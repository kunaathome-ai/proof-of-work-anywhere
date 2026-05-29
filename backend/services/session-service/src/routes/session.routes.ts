import { Router, Request, Response } from 'express';
import { Database } from '../database';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { Session } from '../../../../shared/types';

const logger = createLogger('session-routes', LogLevel.INFO);

export class SessionRouter {
  router: Router;
  private db: Database;

  constructor(db: Database) {
    this.router = Router();
    this.db = db;
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post('/', this.createSession.bind(this));
    this.router.get('/:id', this.getSession.bind(this));
    this.router.get('/token/:token', this.getSessionByToken.bind(this));
    this.router.get('/job/:jobId', this.getJobSessions.bind(this));
    this.router.put('/:id', this.updateSession.bind(this));
    this.router.delete('/:id', this.deleteSession.bind(this));
    this.router.post('/validate/:token', this.validateMagicLink.bind(this));
  }

  private async createSession(req: Request, res: Response) {
    try {
      const sessionData = req.body;
      const session = await this.db.createSession({
        ...sessionData,
        status: sessionData.status || 'created',
        oneTimeUse: sessionData.oneTimeUse || false
      });
      logger.info('Session created', { sessionId: session.id });
      res.status(201).json(session);
    } catch (error) {
      logger.error('Failed to create session', { error });
      res.status(500).json({ error: 'Failed to create session' });
    }
  }

  private async getSession(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const session = await this.db.getSessionById(id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json(session);
    } catch (error) {
      logger.error('Failed to get session', { error });
      res.status(500).json({ error: 'Failed to get session' });
    }
  }

  private async getSessionByToken(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const session = await this.db.getSessionByToken(token);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json(session);
    } catch (error) {
      logger.error('Failed to get session by token', { error });
      res.status(500).json({ error: 'Failed to get session by token' });
    }
  }

  private async getJobSessions(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const sessions = await this.db.getSessionsByJob(jobId);
      res.json(sessions);
    } catch (error) {
      logger.error('Failed to get job sessions', { error });
      res.status(500).json({ error: 'Failed to get job sessions' });
    }
  }

  private async updateSession(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const session = await this.db.updateSession(id, updates);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      logger.info('Session updated', { sessionId: id });
      res.json(session);
    } catch (error) {
      logger.error('Failed to update session', { error });
      res.status(500).json({ error: 'Failed to update session' });
    }
  }

  private async deleteSession(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await this.db.deleteSession(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Session not found' });
      }
      logger.info('Session deleted', { sessionId: id });
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete session', { error });
      res.status(500).json({ error: 'Failed to delete session' });
    }
  }

  private async validateMagicLink(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const verification = this.db.verifyMagicLinkToken(token);
      
      if (!verification.valid) {
        return res.status(400).json({ valid: false, error: 'Invalid or expired token' });
      }

      const session = await this.db.getSessionByToken(token);
      
      if (!session) {
        return res.status(404).json({ valid: false, error: 'Session not found' });
      }

      if (new Date() > session.expiresAt) {
        return res.status(400).json({ valid: false, error: 'Session expired' });
      }

      if (session.oneTimeUse && session.status !== 'created') {
        return res.status(400).json({ valid: false, error: 'One-time use session already used' });
      }

      res.json({ valid: true, session });
    } catch (error) {
      logger.error('Failed to validate magic link', { error });
      res.status(500).json({ error: 'Failed to validate magic link' });
    }
  }
}
