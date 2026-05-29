import { Evidence, ValidationResult } from '../../../../shared/types';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';

const logger = createLogger('photo-count-validator', LogLevel.INFO);

export class PhotoCountValidator {
  async validate(evidence: Evidence, config: any): Promise<ValidationResult> {
    if (evidence.type !== 'photo') {
      return {
        validator: 'photo-count-validator',
        passed: true,
        reason: 'Not photo evidence, skipping validation',
        timestamp: new Date()
      };
    }

    const { requiredPhotos, currentCount } = config;

    try {
      if (!requiredPhotos) {
        return {
          validator: 'photo-count-validator',
          passed: true,
          confidence: 1,
          reason: 'No photo count requirement specified',
          timestamp: new Date()
        };
      }

      if (currentCount >= requiredPhotos) {
        return {
          validator: 'photo-count-validator',
          passed: true,
          confidence: 1,
          reason: `Photo count ${currentCount} meets requirement ${requiredPhotos}`,
          details: { required: requiredPhotos, actual: currentCount },
          timestamp: new Date()
        };
      }

      const confidence = currentCount / requiredPhotos;
      
      return {
        validator: 'photo-count-validator',
        passed: false,
        confidence,
        reason: `Photo count ${currentCount} below requirement ${requiredPhotos}`,
        details: { required: requiredPhotos, actual: currentCount },
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Photo count validation failed', { error });
      return {
        validator: 'photo-count-validator',
        passed: false,
        confidence: 0,
        reason: 'Photo count validation error',
        timestamp: new Date()
      };
    }
  }
}
