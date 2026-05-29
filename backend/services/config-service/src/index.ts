import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { ConfigRouter } from './routes/config.routes';
import { Database } from './database';

dotenv.config();

const logger = createLogger('config-service', LogLevel.INFO);
const app = express();
const PORT = process.env.PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(express.json());

const db = new Database();
const configRouter = new ConfigRouter(db);

app.use('/api/config', configRouter.router);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'config-service' });
});

app.listen(PORT, async () => {
  try {
    await db.initialize();
    logger.info(`Config service running on port ${PORT}`);
  } catch (error) {
    logger.error('Failed to start config service', { error });
    process.exit(1);
  }
});

export { app };
