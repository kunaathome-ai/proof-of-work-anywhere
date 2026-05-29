import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { JobRouter } from './routes/job.routes';
import { Database } from './database';

dotenv.config();

const logger = createLogger('job-service', LogLevel.INFO);
const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

const db = new Database();
const jobRouter = new JobRouter(db);

app.use('/api/jobs', jobRouter.router);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'job-service' });
});

app.listen(PORT, async () => {
  try {
    await db.initialize();
    logger.info(`Job service running on port ${PORT}`);
  } catch (error) {
    logger.error('Failed to start job service', { error });
    process.exit(1);
  }
});

export { app };
