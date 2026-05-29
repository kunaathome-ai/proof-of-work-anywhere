import { Router, Request, Response } from 'express';
import { ReportGenerator } from '../report-generator';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';

const logger = createLogger('report-routes', LogLevel.INFO);

export class ReportRouter {
  router: Router;
  private reportGenerator: ReportGenerator;

  constructor(reportGenerator: ReportGenerator) {
    this.router = Router();
    this.reportGenerator = reportGenerator;
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post('/generate', this.generateReport.bind(this));
    this.router.get('/:id', this.getReport.bind(this));
    this.router.post('/:id/verify', this.verifyReport.bind(this));
  }

  private async generateReport(req: Request, res: Response) {
    try {
      const { sessionId, jobId, client, evidence, aiFindings } = req.body;
      const privateKey = process.env.PRIVATE_KEY || 'default-private-key';

      const manifest = await this.reportGenerator.generateManifest(
        sessionId,
        jobId,
        client,
        evidence,
        aiFindings
      );

      const report = await this.reportGenerator.generateProofReport(manifest, privateKey);
      
      logger.info('Report generated', { reportId: report.id });
      res.status(201).json(report);
    } catch (error) {
      logger.error('Failed to generate report', { error });
      res.status(500).json({ error: 'Failed to generate report' });
    }
  }

  private async getReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // In a real implementation, this would fetch from storage
      res.json({ message: 'Report retrieval', id });
    } catch (error) {
      logger.error('Failed to get report', { error });
      res.status(500).json({ error: 'Failed to get report' });
    }
  }

  private async verifyReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { report, publicKey } = req.body;

      const isValid = await this.reportGenerator.verifyReport(report, publicKey);
      
      res.json({ valid: isValid });
    } catch (error) {
      logger.error('Failed to verify report', { error });
      res.status(500).json({ error: 'Failed to verify report' });
    }
  }
}
