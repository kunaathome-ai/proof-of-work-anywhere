import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { ValidationOrchestrator } from './validation-orchestrator';

dotenv.config();

const logger = createLogger('validation-worker', LogLevel.INFO);
const app = express();
const PORT = process.env.PORT || 3006;

app.use(helmet());
app.use(cors());
app.use(express.json());

const orchestrator = new ValidationOrchestrator();

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'validation-worker' });
});

app.listen(PORT, async () => {
  try {
    await orchestrator.start();
    logger.info(`Validation worker running on port ${PORT}`);
  } catch (error) {
    logger.error('Failed to start validation worker', { error });
    process.exit(1);
  }
});

export { app };
