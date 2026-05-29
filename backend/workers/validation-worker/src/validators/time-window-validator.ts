import { Evidence, ValidationResult } from '../../../../shared/types';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';

const logger = createLogger('time-window-validator', LogLevel.INFO);

export class TimeWindowValidator {
  async validate(evidence: Evidence, config: any): Promise<ValidationResult> {
    try {
      const { startTime, endTime, timezone = 'UTC' } = config;
      const uploadedAt = evidence.uploadedAt;

      if (!startTime && !endTime) {
        return {
          validator: 'time-window-validator',
          passed: true,
          confidence: 1,
          reason: 'No time window specified',
          timestamp: new Date()
        };
      }

      const evidenceTime = new Date(uploadedAt);
      
      if (startTime && evidenceTime < new Date(startTime)) {
        return {
          validator: 'time-window-validator',
          passed: false,
          confidence: 0,
          reason: `Evidence uploaded before allowed start time`,
          details: { evidenceTime: evidenceTime.toISOString(), startTime },
          timestamp: new Date()
        };
      }

      if (endTime && evidenceTime > new Date(endTime)) {
        return {
          validator: 'time-window-validator',
          passed: false,
          confidence: 0,
          reason: `Evidence uploaded after allowed end time`,
          details: { evidenceTime: evidenceTime.toISOString(), endTime },
          timestamp: new Date()
        };
      }

      // Calculate confidence based on position in time window
      let confidence = 1;
      if (startTime && endTime) {
        const windowStart = new Date(startTime).getTime();
        const windowEnd = new Date(endTime).getTime();
        const windowDuration = windowEnd - windowStart;
        const evidenceTimestamp = evidenceTime.getTime();
        
        // Higher confidence for evidence in the middle of the window
        const positionInWindow = (evidenceTimestamp - windowStart) / windowDuration;
        confidence = 1 - Math.abs(positionInWindow - 0.5) * 0.5; // Min 0.5 confidence
      }

      return {
        validator: 'time-window-validator',
        passed: true,
        confidence,
        reason: 'Evidence uploaded within allowed time window',
        details: { evidenceTime: evidenceTime.toISOString(), startTime, endTime },
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Time window validation failed', { error });
      return {
        validator: 'time-window-validator',
        passed: false,
        confidence: 0,
        reason: 'Time window validation error',
        timestamp: new Date()
      };
    }
  }
}
