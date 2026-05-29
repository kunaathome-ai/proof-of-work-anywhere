export const DEFAULT_CONFIG = {
  JWT_EXPIRY: '24h',
  MAGIC_LINK_EXPIRY: '7d',
  MAX_UPLOAD_SIZE: '50MB',
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MIN_AI_CONFIDENCE: 0.7,
  MAX_GPS_ACCURACY: 100, // meters
  EVIDENCE_RETENTION_DAYS: 365,
  QUEUE_RETRY_ATTEMPTS: 3,
  QUEUE_RETRY_DELAY: 5000, // ms
} as const;

export const STORAGE_TYPES = ['local', 's3', 'azure_blob', 'minio', 'sftp', 'sharepoint'] as const;
export const AI_PROVIDERS = ['openai', 'azure_openai', 'bedrock', 'local', 'ollama'] as const;
export const RUNTIME_MODES = ['local', 'on_prem', 'cloud'] as const;
export const BILLING_PLANS = ['free', 'starter', 'professional', 'enterprise'] as const;

export const VALIDATION_TYPES = {
  GPS: 'gps',
  PHOTO_COUNT: 'photo_count',
  AI_CONFIDENCE: 'ai_confidence',
  TIME_WINDOW: 'time_window',
  HASH_INTEGRITY: 'hash_integrity',
  ANOMALY_DETECTION: 'anomaly_detection'
} as const;

export const EVIDENCE_TYPES = {
  PHOTO: 'photo',
  GPS: 'gps',
  CHECKLIST: 'checklist',
  SIGNATURE: 'signature',
  METADATA: 'metadata'
} as const;
