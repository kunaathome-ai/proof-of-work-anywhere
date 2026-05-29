import { Router, Request, Response } from 'express';
import { Database } from '../database';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { UsageRecord, Invoice } from '../../../../shared/types';

const logger = createLogger('billing-routes', LogLevel.INFO);

export class BillingRouter {
  router: Router;
  private db: Database;

  constructor(db: Database) {
    this.router = Router();
    this.db = db;
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post('/usage', this.recordUsage.bind(this));
    this.router.get('/usage/:clientId', this.getClientUsage.bind(this));
    this.router.post('/invoices', this.createInvoice.bind(this));
    this.router.get('/invoices/:id', this.getInvoice.bind(this));
    this.router.get('/invoices/client/:clientId', this.getClientInvoices.bind(this));
    this.router.put('/invoices/:id/status', this.updateInvoiceStatus.bind(this));
  }

  private async recordUsage(req: Request, res: Response) {
    try {
      const recordData = req.body;
      const record = await this.db.recordUsage({
        ...recordData,
        timestamp: new Date(recordData.timestamp)
      });
      logger.info('Usage recorded', { recordId: record.id });
      res.status(201).json(record);
    } catch (error) {
      logger.error('Failed to record usage', { error });
      res.status(500).json({ error: 'Failed to record usage' });
    }
  }

  private async getClientUsage(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const { startDate, endDate } = req.query;

      const usage = await this.db.getUsageByClient(
        clientId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json(usage);
    } catch (error) {
      logger.error('Failed to get client usage', { error });
      res.status(500).json({ error: 'Failed to get client usage' });
    }
  }

  private async createInvoice(req: Request, res: Response) {
    try {
      const invoiceData = req.body;
      const invoice = await this.db.createInvoice({
        ...invoiceData,
        period: {
          start: new Date(invoiceData.period.start),
          end: new Date(invoiceData.period.end)
        }
      });
      logger.info('Invoice created', { invoiceId: invoice.id });
      res.status(201).json(invoice);
    } catch (error) {
      logger.error('Failed to create invoice', { error });
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  }

  private async getInvoice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const invoice = await this.db.getInvoiceById(id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      logger.error('Failed to get invoice', { error });
      res.status(500).json({ error: 'Failed to get invoice' });
    }
  }

  private async getClientInvoices(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const invoices = await this.db.getInvoicesByClient(clientId);
      res.json(invoices);
    } catch (error) {
      logger.error('Failed to get client invoices', { error });
      res.status(500).json({ error: 'Failed to get client invoices' });
    }
  }

  private async updateInvoiceStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, stripeInvoiceId } = req.body;

      const invoice = await this.db.updateInvoiceStatus(id, status, stripeInvoiceId);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      logger.info('Invoice status updated', { invoiceId: id, status });
      res.json(invoice);
    } catch (error) {
      logger.error('Failed to update invoice status', { error });
      res.status(500).json({ error: 'Failed to update invoice status' });
    }
  }
}
