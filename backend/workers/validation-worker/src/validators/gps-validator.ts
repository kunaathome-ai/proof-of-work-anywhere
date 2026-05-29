import { Evidence, ValidationResult } from '../../../../shared/types';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';

const logger = createLogger('gps-validator', LogLevel.INFO);

export class GPSValidator {
  async validate(evidence: Evidence, config: any): Promise<ValidationResult> {
    if (evidence.type !== 'gps') {
      return {
        validator: 'gps-validator',
        passed: true,
        reason: 'Not GPS evidence, skipping validation',
        timestamp: new Date()
      };
    }

    const { expectedLat, expectedLon, radiusMeters, maxAccuracy } = config;
    const { latitude, longitude, accuracy } = evidence.data;

    try {
      // Check accuracy
      if (maxAccuracy && accuracy > maxAccuracy) {
        return {
          validator: 'gps-validator',
          passed: false,
          confidence: 0,
          reason: `GPS accuracy ${accuracy}m exceeds maximum ${maxAccuracy}m`,
          details: { accuracy, maxAccuracy },
          timestamp: new Date()
        };
      }

      // Check location if expected coordinates provided
      if (expectedLat && expectedLon && radiusMeters) {
        const distance = this.calculateDistance(
          latitude, longitude,
          expectedLat, expectedLon
        );

        if (distance > radiusMeters) {
          return {
            validator: 'gps-validator',
            passed: false,
            confidence: 0,
            reason: `Location ${distance}m outside expected radius ${radiusMeters}m`,
            details: { distance, radiusMeters, actual: { lat: latitude, lon: longitude }, expected: { lat: expectedLat, lon: expectedLon } },
            timestamp: new Date()
          };
        }

        // Calculate confidence based on distance from center
        const confidence = Math.max(0, 1 - (distance / radiusMeters));
        
        return {
          validator: 'gps-validator',
          passed: true,
          confidence,
          reason: `Location within ${distance}m of expected location`,
          details: { distance, radiusMeters, accuracy },
          timestamp: new Date()
        };
      }

      return {
        validator: 'gps-validator',
        passed: true,
        confidence: 1,
        reason: 'GPS coordinates valid',
        details: { latitude, longitude, accuracy },
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('GPS validation failed', { error });
      return {
        validator: 'gps-validator',
        passed: false,
        confidence: 0,
        reason: 'GPS validation error',
        timestamp: new Date()
      };
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
