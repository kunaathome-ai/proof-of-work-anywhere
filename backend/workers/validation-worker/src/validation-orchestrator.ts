import Bull from 'bull';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { Evidence, ValidationResult, VALIDATION_TYPES } from '../../../../shared/types';
import { GPSValidator } from './validators/gps-validator';
import { PhotoCountValidator } from './validators/photo-count-validator';
import { HashIntegrityValidator } from './validators/hash-integrity-validator';
import { TimeWindowValidator } from './validators/time-window-validator';
import axios from 'axios';

const logger = createLogger('validation-orchestrator', LogLevel.INFO);

interface ValidationTask {
  evidenceId: string;
  sessionId: string;
  jobId: string;
  evidence: Evidence;
  jobRules: any;
}

export class ValidationOrchestrator {
  private queue: Bull.Queue<ValidationTask>;
  private validators: Map<string, any>;

  constructor() {
    this.queue = new Bull('validation-pipeline', {
      redis: process.env.REDIS_URL || 'redis://localhost:6379',
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 }
      }
    });

    this.validators = new Map();
    this.initializeValidators();
    this.queue.process(this.processValidation.bind(this));
  }

  private initializeValidators() {
    this.validators.set(VALIDATION_TYPES.GPS, new GPSValidator());
    this.validators.set(VALIDATION_TYPES.PHOTO_COUNT, new PhotoCountValidator());
    this.validators.set(VALIDATION_TYPES.HASH_INTEGRITY, new HashIntegrityValidator());
    this.validators.set(VALIDATION_TYPES.TIME_WINDOW, new TimeWindowValidator());
  }

  async start() {
    logger.info('Validation orchestrator started');
    this.queue.on('completed', (job, result) => {
      logger.info('Validation completed', { jobId: job.id, evidenceId: job.data.evidenceId });
    });

    this.queue.on('failed', (job, error) => {
      logger.error('Validation failed', { jobId: job.id, error });
    });
  }

  async addValidationTask(task: ValidationTask): Promise<void> {
    await this.queue.add(task);
    logger.info('Validation task added', { evidenceId: task.evidenceId });
  }

  private async processValidation(job: Bull.Job<ValidationTask>): Promise<ValidationResult[]> {
    const { evidence, jobRules } = job.data;
    const results: ValidationResult[] = [];

    try {
      // Run applicable validators based on evidence type and job rules
      for (const rule of jobRules) {
        if (!rule.enabled) continue;

        const validator = this.validators.get(rule.type);
        if (!validator) {
          logger.warn('Validator not found', { type: rule.type });
          continue;
        }

        try {
          const result = await validator.validate(evidence, rule.config);
          results.push(result);
          
          // Send result to evidence service
          await this.sendValidationResult(evidence.id, result);
        } catch (error) {
          logger.error('Validator execution failed', { type: rule.type, error });
        }
      }

      // If AI validation is enabled, send to AI inspector
      if (jobRules.some(r => r.type === VALIDATION_TYPES.AI_CONFIDENCE && r.enabled)) {
        await this.queueAIValidation(evidence, jobRules);
      }

      return results;
    } catch (error) {
      logger.error('Validation pipeline failed', { evidenceId: evidence.id, error });
      throw error;
    }
  }

  private async sendValidationResult(evidenceId: string, result: ValidationResult): Promise<void> {
    try {
      await axios.post(`${process.env.EVIDENCE_SERVICE_URL || 'http://localhost:3003'}/api/evidence/${evidenceId}/validate`, result);
    } catch (error) {
      logger.error('Failed to send validation result', { evidenceId, error });
    }
  }

  private async queueAIValidation(evidence: Evidence, jobRules: any): Promise<void> {
    try {
      const aiRule = jobRules.find(r => r.type === VALIDATION_TYPES.AI_CONFIDENCE);
      if (!aiRule) return;

      const aiJob = {
        evidenceId: evidence.id,
        evidenceType: evidence.type,
        evidenceData: evidence.data,
        modelId: aiRule.config.modelId || 'mock',
        systemPrompt: aiRule.config.systemPrompt
      };

      await axios.post(`${process.env.AI_INSPECTOR_URL || 'http://localhost:3005'}/api/validate`, aiJob);
    } catch (error) {
      logger.error('Failed to queue AI validation', { evidenceId: evidence.id, error });
    }
  }

  getQueueStats() {
    return {
      waiting: this.queue.getWaitingCount(),
      active: this.queue.getActiveCount(),
      completed: this.queue.getCompletedCount(),
      failed: this.queue.getFailedCount()
    };
  }
}
