import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { DeliveryRouter } from './routes/delivery.routes';
import { DeliveryManager } from './delivery-manager';

dotenv.config();

const logger = createLogger('delivery-service', LogLevel.INFO);
const app = express();
const PORT = process.env.PORT || 3008;

app.use(helmet());
app.use(cors());
app.use(express.json());

const deliveryManager = new DeliveryManager();
const deliveryRouter = new DeliveryRouter(deliveryManager);

app.use('/api/delivery', deliveryRouter.router);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'delivery-service' });
});

app.listen(PORT, () => {
  logger.info(`Delivery service running on port ${PORT}`);
});

export { app };
