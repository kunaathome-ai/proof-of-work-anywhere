import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { SessionRouter } from './routes/session.routes';
import { Database } from './database';

dotenv.config();

const logger = createLogger('session-service', LogLevel.INFO);
const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());

const db = new Database();
const sessionRouter = new SessionRouter(db);

app.use('/api/sessions', sessionRouter.router);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'session-service' });
});

app.listen(PORT, async () => {
  try {
    await db.initialize();
    logger.info(`Session service running on port ${PORT}`);
  } catch (error) {
    logger.error('Failed to start session service', { error });
    process.exit(1);
  }
});

export { app };
