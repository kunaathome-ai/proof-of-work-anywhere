import { Router, Request, Response } from 'express';
import { Database } from '../database';
import { StorageFactory } from '../storage/storage-factory';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { Evidence, ValidationResult, StorageConfig } from '../../../../shared/types';
import { sha256 } from '../../../../shared/utils/crypto';
import multer from 'multer';

const logger = createLogger('evidence-routes', LogLevel.INFO);

export class EvidenceRouter {
  router: Router;
  private db: Database;
  private storageFactory: StorageFactory;
  private upload: multer.Multer;

  constructor(db: Database, storageFactory: StorageFactory, upload: multer.Multer) {
    this.router = Router();
    this.db = db;
    this.storageFactory = storageFactory;
    this.upload = upload;
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post('/', this.upload.single('file'), this.createEvidence.bind(this));
    this.router.get('/:id', this.getEvidence.bind(this));
    this.router.get('/session/:sessionId', this.getSessionEvidence.bind(this));
    this.router.get('/job/:jobId', this.getJobEvidence.bind(this));
    this.router.put('/:id', this.updateEvidence.bind(this));
    this.router.delete('/:id', this.deleteEvidence.bind(this));
    this.router.post('/:id/validate', this.validateEvidence.bind(this));
  }

  private async createEvidence(req: Request, res: Response) {
    try {
      const { sessionId, jobId, type, storageConfig } = req.body;
      const file = req.file;

      if (!sessionId || !jobId || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      let data: any = {};
      let hash: string;

      if (file) {
        // Handle file upload
        hash = await sha256(file.buffer);
        
        const config: StorageConfig = storageConfig || {
          type: 'local',
          config: { basePath: './storage' }
        };

        const storage = this.storageFactory.createAdapter(config);
        const key = `${sessionId}/${type}/${Date.now()}-${file.originalname}`;
        const url = await storage.upload(key, file.buffer);
        
        data = {
          url,
          key,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size
        };
      } else {
        // Handle non-file evidence (GPS, checklist, etc.)
        data = req.body.data || {};
        hash = await sha256(JSON.stringify(data));
      }

      const evidence = await this.db.createEvidence({
        sessionId,
        jobId,
        type,
        data,
        hash,
        uploadedAt: new Date(),
        validated: false
      });

      logger.info('Evidence created', { evidenceId: evidence.id, type });
      res.status(201).json(evidence);
    } catch (error) {
      logger.error('Failed to create evidence', { error });
      res.status(500).json({ error: 'Failed to create evidence' });
    }
  }

  private async getEvidence(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const evidence = await this.db.getEvidenceById(id);
      if (!evidence) {
        return res.status(404).json({ error: 'Evidence not found' });
      }
      res.json(evidence);
    } catch (error) {
      logger.error('Failed to get evidence', { error });
      res.status(500).json({ error: 'Failed to get evidence' });
    }
  }

  private async getSessionEvidence(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const evidence = await this.db.getEvidenceBySession(sessionId);
      res.json(evidence);
    } catch (error) {
      logger.error('Failed to get session evidence', { error });
      res.status(500).json({ error: 'Failed to get session evidence' });
    }
  }

  private async getJobEvidence(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const evidence = await this.db.getEvidenceByJob(jobId);
      res.json(evidence);
    } catch (error) {
      logger.error('Failed to get job evidence', { error });
      res.status(500).json({ error: 'Failed to get job evidence' });
    }
  }

  private async updateEvidence(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const evidence = await this.db.updateEvidence(id, updates);
      if (!evidence) {
        return res.status(404).json({ error: 'Evidence not found' });
      }
      logger.info('Evidence updated', { evidenceId: id });
      res.json(evidence);
    } catch (error) {
      logger.error('Failed to update evidence', { error });
      res.status(500).json({ error: 'Failed to update evidence' });
    }
  }

  private async deleteEvidence(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await this.db.deleteEvidence(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Evidence not found' });
      }
      logger.info('Evidence deleted', { evidenceId: id });
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete evidence', { error });
      res.status(500).json({ error: 'Failed to delete evidence' });
    }
  }

  private async validateEvidence(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validationResult: ValidationResult = req.body;

      await this.db.addValidationResult(id, validationResult);
      
      // Update evidence validation status
      const evidence = await this.db.getEvidenceById(id);
      if (evidence) {
        const allPassed = evidence.validationResults?.every(vr => vr.passed) || false;
        await this.db.updateEvidence(id, { validated: allPassed });
      }

      logger.info('Validation result added', { evidenceId: id, validator: validationResult.validator });
      res.status(201).json({ success: true });
    } catch (error) {
      logger.error('Failed to validate evidence', { error });
      res.status(500).json({ error: 'Failed to validate evidence' });
    }
  }
}
