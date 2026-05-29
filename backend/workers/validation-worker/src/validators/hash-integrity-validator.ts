import { Evidence, ValidationResult } from '../../../../shared/types';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { sha256 } from '../../../../shared/utils/crypto';

const logger = createLogger('hash-integrity-validator', LogLevel.INFO);

export class HashIntegrityValidator {
  async validate(evidence: Evidence, config: any): Promise<ValidationResult> {
    try {
      const clientHash = evidence.hash;
      const data = evidence.data;

      // Recalculate hash on server side
      let serverHash: string;
      
      if (typeof data === 'string') {
        serverHash = await sha256(data);
      } else if (Buffer.isBuffer(data)) {
        serverHash = await sha256(data);
      } else {
        serverHash = await sha256(JSON.stringify(data));
      }

      const hashesMatch = clientHash === serverHash;

      if (hashesMatch) {
        return {
          validator: 'hash-integrity-validator',
          passed: true,
          confidence: 1,
          reason: 'Client and server hashes match',
          details: { clientHash, serverHash },
          timestamp: new Date()
        };
      }

      return {
        validator: 'hash-integrity-validator',
        passed: false,
        confidence: 0,
        reason: 'Hash mismatch detected - evidence may be tampered',
        details: { clientHash, serverHash },
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Hash integrity validation failed', { error });
      return {
        validator: 'hash-integrity-validator',
        passed: false,
        confidence: 0,
        reason: 'Hash integrity validation error',
        timestamp: new Date()
      };
    }
  }
}
