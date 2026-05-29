import { Router, Request, Response } from 'express';
import { Database } from '../database';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { Job } from '../../../../shared/types';

const logger = createLogger('job-routes', LogLevel.INFO);

export class JobRouter {
  router: Router;
  private db: Database;

  constructor(db: Database) {
    this.router = Router();
    this.db = db;
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post('/', this.createJob.bind(this));
    this.router.get('/:id', this.getJob.bind(this));
    this.router.get('/client/:clientId', this.getClientJobs.bind(this));
    this.router.put('/:id', this.updateJob.bind(this));
    this.router.delete('/:id', this.deleteJob.bind(this));
  }

  private async createJob(req: Request, res: Response) {
    try {
      const jobData = req.body;
      const job = await this.db.createJob({
        ...jobData,
        status: jobData.status || 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      logger.info('Job created', { jobId: job.id });
      res.status(201).json(job);
    } catch (error) {
      logger.error('Failed to create job', { error });
      res.status(500).json({ error: 'Failed to create job' });
    }
  }

  private async getJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await this.db.getJobById(id);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json(job);
    } catch (error) {
      logger.error('Failed to get job', { error });
      res.status(500).json({ error: 'Failed to get job' });
    }
  }

  private async getClientJobs(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const jobs = await this.db.getJobsByClient(clientId);
      res.json(jobs);
    } catch (error) {
      logger.error('Failed to get client jobs', { error });
      res.status(500).json({ error: 'Failed to get client jobs' });
    }
  }

  private async updateJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const job = await this.db.updateJob(id, updates);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      logger.info('Job updated', { jobId: id });
      res.json(job);
    } catch (error) {
      logger.error('Failed to update job', { error });
      res.status(500).json({ error: 'Failed to update job' });
    }
  }

  private async deleteJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await this.db.deleteJob(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Job not found' });
      }
      logger.info('Job deleted', { jobId: id });
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete job', { error });
      res.status(500).json({ error: 'Failed to delete job' });
    }
  }
}
