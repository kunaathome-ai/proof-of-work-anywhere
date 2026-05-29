import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { UsageRecord, Invoice } from '../../../../shared/types';

export class Database {
  private db: Database.Database | null = null;

  async initialize() {
    const dbPath = process.env.DB_PATH || './data/billing.db';
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.createTables();
  }

  private createTables() {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS usage_records (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        job_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        metric TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        period_start TEXT NOT NULL,
        period_end TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL,
        status TEXT NOT NULL,
        line_items TEXT NOT NULL,
        stripe_invoice_id TEXT,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_usage_client ON usage_records(client_id);
      CREATE INDEX IF NOT EXISTS idx_usage_timestamp ON usage_records(timestamp);
      CREATE INDEX IF NOT EXISTS idx_invoice_client ON invoices(client_id);
      CREATE INDEX IF NOT EXISTS idx_invoice_status ON invoices(status);
    `);
  }

  async recordUsage(record: Omit<UsageRecord, 'id'>): Promise<UsageRecord> {
    if (!this.db) throw new Error('Database not initialized');

    const id = uuidv4();

    const stmt = this.db.prepare(`
      INSERT INTO usage_records (id, client_id, job_id, session_id, metric, value, unit, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      record.clientId,
      record.jobId,
      record.sessionId,
      record.metric,
      record.value,
      record.unit,
      record.timestamp.toISOString()
    );

    return {
      id,
      ...record
    };
  }

  async getUsageByClient(clientId: string, startDate?: Date, endDate?: Date): Promise<UsageRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM usage_records WHERE client_id = ?';
    const params: any[] = [clientId];

    if (startDate) {
      query += ' AND timestamp >= ?';
      params.push(startDate.toISOString());
    }

    if (endDate) {
      query += ' AND timestamp <= ?';
      params.push(endDate.toISOString());
    }

    const stmt = this.db.prepare(query);
    const records = stmt.all(...params) as any[];

    return records.map(r => ({
      id: r.id,
      clientId: r.client_id,
      jobId: r.job_id,
      sessionId: r.session_id,
      metric: r.metric,
      value: r.value,
      unit: r.unit,
      timestamp: new Date(r.timestamp)
    }));
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> {
    if (!this.db) throw new Error('Database not initialized');

    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO invoices (id, client_id, period_start, period_end, amount, currency, status, line_items, stripe_invoice_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      invoice.clientId,
      invoice.period.start.toISOString(),
      invoice.period.end.toISOString(),
      invoice.amount,
      invoice.currency,
      invoice.status,
      JSON.stringify(invoice.lineItems),
      invoice.stripeInvoiceId || null,
      now
    );

    return this.getInvoiceById(id) as Invoice;
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM invoices WHERE id = ?');
    const invoice = stmt.get(id) as any;

    if (!invoice) return null;

    return {
      id: invoice.id,
      clientId: invoice.client_id,
      period: {
        start: new Date(invoice.period_start),
        end: new Date(invoice.period_end)
      },
      amount: invoice.amount,
      currency: invoice.currency,
      status: invoice.status,
      lineItems: JSON.parse(invoice.line_items),
      stripeInvoiceId: invoice.stripe_invoice_id
    };
  }

  async getInvoicesByClient(clientId: string): Promise<Invoice[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT id FROM invoices WHERE client_id = ? ORDER BY created_at DESC');
    const invoiceIds = stmt.all(clientId) as any[];

    const invoices = [];
    for (const { id } of invoiceIds) {
      const invoice = await this.getInvoiceById(id);
      if (invoice) invoices.push(invoice);
    }

    return invoices;
  }

  async updateInvoiceStatus(id: string, status: Invoice['status'], stripeInvoiceId?: string): Promise<Invoice | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      UPDATE invoices
      SET status = ?, stripe_invoice_id = ?
      WHERE id = ?
    `);

    stmt.run(status, stripeInvoiceId || null, id);

    return this.getInvoiceById(id);
  }
}
