import { Router, Request, Response } from 'express';
import { Database } from '../database';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { Client, JobTemplate, SystemConfig } from '../../../../shared/types';

const logger = createLogger('config-routes', LogLevel.INFO);

export class ConfigRouter {
  router: Router;
  private db: Database;

  constructor(db: Database) {
    this.router = Router();
    this.db = db;
    this.setupRoutes();
  }

  private setupRoutes() {
    // Client routes
    this.router.post('/clients', this.createClient.bind(this));
    this.router.get('/clients/:id', this.getClient.bind(this));
    this.router.get('/clients', this.getAllClients.bind(this));
    this.router.put('/clients/:id', this.updateClient.bind(this));
    this.router.delete('/clients/:id', this.deleteClient.bind(this));

    // Job template routes
    this.router.post('/templates', this.createJobTemplate.bind(this));
    this.router.get('/templates/:id', this.getJobTemplate.bind(this));
    this.router.get('/templates/client/:clientId', this.getClientTemplates.bind(this));

    // System config routes
    this.router.get('/system', this.getSystemConfig.bind(this));
    this.router.put('/system', this.updateSystemConfig.bind(this));
  }

  // Client routes
  private async createClient(req: Request, res: Response) {
    try {
      const clientData = req.body;
      const client = await this.db.createClient({
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      logger.info('Client created', { clientId: client.id });
      res.status(201).json(client);
    } catch (error) {
      logger.error('Failed to create client', { error });
      res.status(500).json({ error: 'Failed to create client' });
    }
  }

  private async getClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const client = await this.db.getClientById(id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      res.json(client);
    } catch (error) {
      logger.error('Failed to get client', { error });
      res.status(500).json({ error: 'Failed to get client' });
    }
  }

  private async getAllClients(req: Request, res: Response) {
    try {
      const clients = await this.db.getAllClients();
      res.json(clients);
    } catch (error) {
      logger.error('Failed to get all clients', { error });
      res.status(500).json({ error: 'Failed to get all clients' });
    }
  }

  private async updateClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const client = await this.db.updateClient(id, updates);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      logger.info('Client updated', { clientId: id });
      res.json(client);
    } catch (error) {
      logger.error('Failed to update client', { error });
      res.status(500).json({ error: 'Failed to update client' });
    }
  }

  private async deleteClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await this.db.deleteClient(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Client not found' });
      }
      logger.info('Client deleted', { clientId: id });
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete client', { error });
      res.status(500).json({ error: 'Failed to delete client' });
    }
  }

  // Job template routes
  private async createJobTemplate(req: Request, res: Response) {
    try {
      const templateData = req.body;
      const template = await this.db.createJobTemplate(templateData);
      logger.info('Job template created', { templateId: template.id });
      res.status(201).json(template);
    } catch (error) {
      logger.error('Failed to create job template', { error });
      res.status(500).json({ error: 'Failed to create job template' });
    }
  }

  private async getJobTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const template = await this.db.getJobTemplateById(id);
      if (!template) {
        return res.status(404).json({ error: 'Job template not found' });
      }
      res.json(template);
    } catch (error) {
      logger.error('Failed to get job template', { error });
      res.status(500).json({ error: 'Failed to get job template' });
    }
  }

  private async getClientTemplates(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const templates = await this.db.getJobTemplatesByClient(clientId);
      res.json(templates);
    } catch (error) {
      logger.error('Failed to get client templates', { error });
      res.status(500).json({ error: 'Failed to get client templates' });
    }
  }

  // System config routes
  private async getSystemConfig(req: Request, res: Response) {
    try {
      const config = await this.db.getSystemConfig();
      res.json(config);
    } catch (error) {
      logger.error('Failed to get system config', { error });
      res.status(500).json({ error: 'Failed to get system config' });
    }
  }

  private async updateSystemConfig(req: Request, res: Response) {
    try {
      const updates = req.body;
      const config = await this.db.updateSystemConfig(updates);
      logger.info('System config updated');
      res.json(config);
    } catch (error) {
      logger.error('Failed to update system config', { error });
      res.status(500).json({ error: 'Failed to update system config' });
    }
  }
}
