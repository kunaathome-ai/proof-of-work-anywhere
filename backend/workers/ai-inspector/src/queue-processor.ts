import Bull from 'bull';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { AIProxy } from './ai-proxy';
import { AIRequest, ValidationResult } from '../../../../shared/types';

const logger = createLogger('queue-processor', LogLevel.INFO);

interface ValidationJob {
  evidenceId: string;
  evidenceType: string;
  evidenceData: any;
  modelId: string;
  systemPrompt?: string;
}

export class QueueProcessor {
  private queue: Bull.Queue<ValidationJob>;
  private aiProxy: AIProxy;

  constructor(aiProxy: AIProxy) {
    this.aiProxy = aiProxy;
    this.queue = new Bull('ai-validation', {
      redis: process.env.REDIS_URL || 'redis://localhost:6379',
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 }
      }
    });

    this.queue.process(this.processJob.bind(this));
  }

  async start() {
    logger.info('Queue processor started');
    this.queue.on('completed', (job, result) => {
      logger.info('Job completed', { jobId: job.id, evidenceId: job.data.evidenceId });
    });

    this.queue.on('failed', (job, error) => {
      logger.error('Job failed', { jobId: job.id, error });
    });
  }

  async addValidationJob(job: ValidationJob): Promise<void> {
    await this.queue.add(job);
    logger.info('Validation job added', { evidenceId: job.evidenceId });
  }

  private async processJob(job: Bull.Job<ValidationJob>): Promise<ValidationResult> {
    const { evidenceId, evidenceType, evidenceData, modelId, systemPrompt } = job.data;

    try {
      const aiRequest: AIRequest = {
        model: modelId,
        prompt: this.buildPrompt(evidenceType, evidenceData),
        systemPrompt,
        image: evidenceData.url,
        responseFormat: 'json',
        maxTokens: 1000,
        temperature: 0.3
      };

      const response = await this.aiProxy.processRequest(aiRequest);

      const validationResult: ValidationResult = {
        validator: 'ai-inspector',
        passed: this.determinePass(response.structured),
        confidence: response.structured?.confidence || 0.5,
        reason: response.structured?.description || response.content,
        details: response.structured,
        timestamp: new Date()
      };

      return validationResult;
    } catch (error) {
      logger.error('AI validation failed', { evidenceId, error });
      throw error;
    }
  }

  private buildPrompt(evidenceType: string, evidenceData: any): string {
    switch (evidenceType) {
      case 'photo':
        return 'Analyze this photo for compliance with job requirements. Identify objects, detect safety issues, and provide confidence scores.';
      case 'gps':
        return 'Validate this GPS location against expected coordinates and accuracy requirements.';
      case 'checklist':
        return 'Review checklist responses for completeness and accuracy.';
      default:
        return 'Analyze this evidence for compliance and quality.';
    }
  }

  private determinePass(structured: any): boolean {
    if (!structured) return false;
    
    const confidence = structured.confidence || 0;
    const threshold = 0.7; // Configurable threshold
    
    return confidence >= threshold;
  }

  getQueueStats() {
    return {
      waiting: await this.queue.getWaitingCount(),
      active: await this.queue.getActiveCount(),
      completed: await this.queue.getCompletedCount(),
      failed: await this.queue.getFailedCount()
    };
  }
}
