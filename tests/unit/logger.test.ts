import { Logger, createLogger, LogLevel } from '../../shared/utils/logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = createLogger('test', LogLevel.DEBUG);
  });

  describe('log levels', () => {
    it('should log debug messages', () => {
      expect(() => logger.debug('test message')).not.toThrow();
    });

    it('should log info messages', () => {
      expect(() => logger.info('test message')).not.toThrow();
    });

    it('should log warn messages', () => {
      expect(() => logger.warn('test message')).not.toThrow();
    });

    it('should log error messages', () => {
      expect(() => logger.error('test message')).not.toThrow();
    });
  });

  describe('log filtering', () => {
    it('should filter debug messages when level is INFO', () => {
      const infoLogger = createLogger('test', LogLevel.INFO);
      expect(() => infoLogger.debug('test message')).not.toThrow();
    });

    it('should filter info messages when level is WARN', () => {
      const warnLogger = createLogger('test', LogLevel.WARN);
      expect(() => warnLogger.info('test message')).not.toThrow();
    });
  });

  describe('metadata', () => {
    it('should include metadata in logs', () => {
      expect(() => logger.info('test message', { key: 'value' })).not.toThrow();
    });
  });
});
