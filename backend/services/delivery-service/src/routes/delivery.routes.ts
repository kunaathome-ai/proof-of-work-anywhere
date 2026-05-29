import { Router, Request, Response } from 'express';
import { DeliveryManager, DeliveryRequest } from '../delivery-manager';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';

const logger = createLogger('delivery-routes', LogLevel.INFO);

export class DeliveryRouter {
  router: Router;
  private deliveryManager: DeliveryManager;

  constructor(deliveryManager: DeliveryManager) {
    this.router = Router();
    this.deliveryManager = deliveryManager;
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post('/deliver', this.deliver.bind(this));
    this.router.post('/test', this.testConnection.bind(this));
  }

  private async deliver(req: Request, res: Response) {
    try {
      const request: DeliveryRequest = req.body;
      const results = await this.deliveryManager.deliver(request);
      
      const allSuccessful = results.every(r => r.success);
      const status = allSuccessful ? 200 : 207; // 207 Multi-Status for partial success
      
      logger.info('Delivery completed', { 
        clientId: request.clientId, 
        successCount: results.filter(r => r.success).length,
        totalCount: results.length
      });
      
      res.status(status).json({ results });
    } catch (error) {
      logger.error('Delivery failed', { error });
      res.status(500).json({ error: 'Delivery failed' });
    }
  }

  private async testConnection(req: Request, res: Response) {
    try {
      const { destination } = req.body;
      const isConnected = await this.deliveryManager.testConnection(destination);
      
      res.json({ connected: isConnected });
    } catch (error) {
      logger.error('Connection test failed', { error });
      res.status(500).json({ error: 'Connection test failed' });
    }
  }
}
