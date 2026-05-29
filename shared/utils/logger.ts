export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private level: LogLevel;
  private context: string;

  constructor(context: string, level: LogLevel = LogLevel.INFO) {
    this.context = context;
    this.level = level;
  }

  private log(level: LogLevel, message: string, meta?: any) {
    if (level < this.level) return;

    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level];
    const logEntry = {
      timestamp,
      level: levelStr,
      context: this.context,
      message,
      ...meta
    };

    console.log(JSON.stringify(logEntry));
  }

  debug(message: string, meta?: any) {
    this.log(LogLevel.DEBUG, message, meta);
  }

  info(message: string, meta?: any) {
    this.log(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta?: any) {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, meta?: any) {
    this.log(LogLevel.ERROR, message, meta);
  }
}

export function createLogger(context: string, level?: LogLevel): Logger {
  const logLevel = level ?? (process.env.LOG_LEVEL ? LogLevel[process.env.LOG_LEVEL as keyof typeof LogLevel] : LogLevel.INFO);
  return new Logger(context, logLevel);
}
