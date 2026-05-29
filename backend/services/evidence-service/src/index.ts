import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { EvidenceRouter } from './routes/evidence.routes';
import { Database } from './database';
import { StorageFactory } from './storage/storage-factory';

dotenv.config();

const logger = createLogger('evidence-service', LogLevel.INFO);
const app = express();
const PORT = process.env.PORT || 3003;

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

app.use(helmet());
app.use(cors());
app.use(express.json());

const db = new Database();
const storageFactory = new StorageFactory();
const evidenceRouter = new EvidenceRouter(db, storageFactory, upload);

app.use('/api/evidence', evidenceRouter.router);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'evidence-service' });
});

app.listen(PORT, async () => {
  try {
    await db.initialize();
    logger.info(`Evidence service running on port ${PORT}`);
  } catch (error) {
    logger.error('Failed to start evidence service', { error });
    process.exit(1);
  }
});

export { app };
