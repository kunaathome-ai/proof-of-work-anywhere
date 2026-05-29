import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { Job, ChecklistItem } from '../../../../shared/types';

export class Database {
  private db: Database.Database | null = null;

  async initialize() {
    const dbPath = process.env.DB_PATH || './data/jobs.db';
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.createTables();
  }

  private createTables() {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        expected_lat REAL,
        expected_lon REAL,
        radius_meters INTEGER,
        required_photos INTEGER NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        expires_at TEXT,
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS checklist_items (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        text TEXT NOT NULL,
        type TEXT NOT NULL,
        required INTEGER NOT NULL,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_jobs_client ON jobs(client_id);
      CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
      CREATE INDEX IF NOT EXISTS idx_checklist_job ON checklist_items(job_id);
    `);
  }

  async createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
    if (!this.db) throw new Error('Database not initialized');

    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO jobs (id, client_id, title, description, expected_lat, expected_lon, radius_meters, required_photos, status, created_at, updated_at, expires_at, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      job.clientId,
      job.title,
      job.description,
      job.expectedLocation?.latitude,
      job.expectedLocation?.longitude,
      job.expectedLocation?.radiusMeters,
      job.requiredPhotos,
      job.status,
      now,
      now,
      job.expiresAt?.toISOString(),
      JSON.stringify(job.metadata || {})
    );

    for (const item of job.checklist) {
      const itemStmt = this.db.prepare(`
        INSERT INTO checklist_items (id, job_id, text, type, required, order_index)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      itemStmt.run(uuidv4(), id, item.text, item.type, item.required ? 1 : 0, item.order);
    }

    return this.getJobById(id) as Job;
  }

  async getJobById(id: string): Promise<Job | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM jobs WHERE id = ?');
    const job = stmt.get(id) as any;

    if (!job) return null;

    const checklistStmt = this.db.prepare('SELECT * FROM checklist_items WHERE job_id = ? ORDER BY order_index');
    const checklistItems = checklistStmt.all(id) as any[];

    return {
      id: job.id,
      clientId: job.client_id,
      title: job.title,
      description: job.description,
      expectedLocation: job.expected_lat ? {
        latitude: job.expected_lat,
        longitude: job.expected_lon,
        radiusMeters: job.radius_meters
      } : undefined,
      requiredPhotos: job.required_photos,
      checklist: checklistItems.map(item => ({
        id: item.id,
        text: item.text,
        type: item.type,
        required: item.required === 1,
        order: item.order_index
      })),
      status: job.status,
      createdAt: new Date(job.created_at),
      updatedAt: new Date(job.updated_at),
      expiresAt: job.expires_at ? new Date(job.expires_at) : undefined,
      metadata: JSON.parse(job.metadata || '{}')
    };
  }

  async getJobsByClient(clientId: string): Promise<Job[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT id FROM jobs WHERE client_id = ?');
    const jobIds = stmt.all(clientId) as any[];

    const jobs = [];
    for (const { id } of jobIds) {
      const job = await this.getJobById(id);
      if (job) jobs.push(job);
    }

    return jobs;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    if (!this.db) throw new Error('Database not initialized');

    const existing = await this.getJobById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const merged = { ...existing, ...updates, updatedAt: new Date(now) };

    const stmt = this.db.prepare(`
      UPDATE jobs
      SET title = ?, description = ?, expected_lat = ?, expected_lon = ?, radius_meters = ?, required_photos = ?, status = ?, updated_at = ?, expires_at = ?, metadata = ?
      WHERE id = ?
    `);

    stmt.run(
      merged.title,
      merged.description,
      merged.expectedLocation?.latitude,
      merged.expectedLocation?.longitude,
      merged.expectedLocation?.radiusMeters,
      merged.requiredPhotos,
      merged.status,
      now,
      merged.expiresAt?.toISOString(),
      JSON.stringify(merged.metadata || {}),
      id
    );

    return this.getJobById(id);
  }

  async deleteJob(id: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('DELETE FROM jobs WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
