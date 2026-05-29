import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { AIProxy } from './ai-proxy';
import { QueueProcessor } from './queue-processor';

dotenv.config();

const logger = createLogger('ai-inspector', LogLevel.INFO);
const app = express();
const PORT = process.env.PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(express.json());

const aiProxy = new AIProxy();
const queueProcessor = new QueueProcessor(aiProxy);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'ai-inspector' });
});

app.listen(PORT, async () => {
  try {
    await queueProcessor.start();
    logger.info(`AI Inspector running on port ${PORT}`);
  } catch (error) {
    logger.error('Failed to start AI Inspector', { error });
    process.exit(1);
  }
});

export { app };
