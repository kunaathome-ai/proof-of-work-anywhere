import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { BillingRouter } from './routes/billing.routes';
import { Database } from './database';

dotenv.config();

const logger = createLogger('billing-service', LogLevel.INFO);
const app = express();
const PORT = process.env.PORT || 3009;

app.use(helmet());
app.use(cors());
app.use(express.json());

const db = new Database();
const billingRouter = new BillingRouter(db);

app.use('/api/billing', billingRouter.router);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'billing-service' });
});

app.listen(PORT, async () => {
  try {
    await db.initialize();
    logger.info(`Billing service running on port ${PORT}`);
  } catch (error) {
    logger.error('Failed to start billing service', { error });
    process.exit(1);
  }
});

export { app };
