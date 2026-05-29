import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { ReportRouter } from './routes/report.routes';
import { ReportGenerator } from './report-generator';

dotenv.config();

const logger = createLogger('report-service', LogLevel.INFO);
const app = express();
const PORT = process.env.PORT || 3007;

app.use(helmet());
app.use(cors());
app.use(express.json());

const reportGenerator = new ReportGenerator();
const reportRouter = new ReportRouter(reportGenerator);

app.use('/api/reports', reportRouter.router);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'report-service' });
});

app.listen(PORT, () => {
  logger.info(`Report service running on port ${PORT}`);
});

export { app };
