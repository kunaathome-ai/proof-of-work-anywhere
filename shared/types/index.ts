// Core domain types
export interface Job {
  id: string;
  clientId: string;
  title: string;
  description: string;
  expectedLocation?: {
    latitude: number;
    longitude: number;
    radiusMeters: number;
  };
  requiredPhotos: number;
  checklist: ChecklistItem[];
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface ChecklistItem {
  id: string;
  text: string;
  type: 'boolean' | 'text' | 'photo' | 'signature';
  required: boolean;
  order: number;
}

export interface Session {
  id: string;
  jobId: string;
  magicLinkToken: string;
  workerEmail?: string;
  workerPhone?: string;
  status: 'created' | 'started' | 'completed' | 'expired';
  startedAt?: Date;
  completedAt?: Date;
  expiresAt: Date;
  deviceInfo?: DeviceInfo;
  oneTimeUse: boolean;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  ip?: string;
  deviceId?: string;
}

export interface Evidence {
  id: string;
  sessionId: string;
  jobId: string;
  type: 'photo' | 'gps' | 'checklist' | 'signature' | 'metadata';
  data: any;
  hash: string;
  uploadedAt: Date;
  serverSideHash?: string;
  validated: boolean;
  validationResults?: ValidationResult[];
}

export interface ValidationResult {
  validator: string;
  passed: boolean;
  confidence?: number;
  reason?: string;
  details?: any;
  timestamp: Date;
}

export interface ProofReport {
  id: string;
  jobId: string;
  sessionId: string;
  manifest: EvidenceManifest;
  pdfUrl?: string;
  jsonUrl?: string;
  generatedAt: Date;
  signed: boolean;
  signature?: string;
  blockchainAnchored?: boolean;
  blockchainTxId?: string;
}

export interface EvidenceManifest {
  jobId: string;
  sessionId: string;
  client: string;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  evidence: EvidenceItem[];
  hashes: {
    [key: string]: string;
  };
  aiFindings?: AIFinding[];
  auditTrail: AuditEntry[];
}

export interface EvidenceItem {
  id: string;
  type: string;
  hash: string;
  url: string;
  metadata: any;
}

export interface AIFinding {
  type: 'label' | 'ocr' | 'object_detection' | 'anomaly' | 'compliance';
  confidence: number;
  description: string;
  boundingBox?: [number, number, number, number];
  evidenceId: string;
  timestamp: Date;
}

export interface AuditEntry {
  action: string;
  actor: string;
  timestamp: Date;
  details?: any;
}

// Storage types
export interface StorageConfig {
  type: 'local' | 's3' | 'azure_blob' | 'minio' | 'sftp' | 'sharepoint';
  config: any;
  clientEncryption?: {
    enabled: boolean;
    keyId?: string;
  };
}

export interface StorageAdapter {
  upload(key: string, data: Buffer | Stream, metadata?: any): Promise<string>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  getSignedUrl?(key: string, expiry?: number): Promise<string>;
  testConnection?(): Promise<boolean>;
}

// AI types
export interface AIRequest {
  model: string;
  prompt: string;
  image?: Buffer | string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  responseFormat?: 'text' | 'json';
}

export interface AIResponse {
  content: string;
  structured?: any;
  confidence?: number;
  model: string;
  tokensUsed?: number;
  latency: number;
}

export interface AIModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'azure_openai' | 'bedrock' | 'local' | 'ollama';
  type: 'text' | 'vision' | 'multimodal';
  endpoint?: string;
  apiKey?: string;
  capabilities: string[];
  maxTokens?: number;
  costPerToken?: number;
}

// Client and tenant types
export interface Client {
  id: string;
  name: string;
  storageConfig: StorageConfig;
  aiConfig?: AIModelConfig;
  billingPlan: 'free' | 'starter' | 'professional' | 'enterprise';
  cmkEnabled?: boolean;
  cmkKeyId?: string;
  webhookUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobTemplate {
  id: string;
  clientId: string;
  name: string;
  description: string;
  requiredPhotos: number;
  checklistTemplate: ChecklistItem[];
  aiPromptTemplate?: string;
  validationRules: ValidationRule[];
  isActive: boolean;
}

export interface ValidationRule {
  id: string;
  type: 'gps' | 'photo_count' | 'ai_confidence' | 'time_window' | 'custom';
  config: any;
  enabled: boolean;
}

// Configuration types
export interface SystemConfig {
  runtimeMode: 'local' | 'on_prem' | 'cloud';
  defaultStorage: StorageConfig;
  defaultAI: AIModelConfig;
  auth: {
    oidc: {
      enabled: boolean;
      issuer: string;
      clientId: string;
    };
    jwt: {
      secret: string;
      expiry: string;
    };
  };
  blockchain?: {
    enabled: boolean;
    network: string;
    contractAddress: string;
  };
  observability: {
    metricsEnabled: boolean;
    tracingEnabled: boolean;
    logLevel: string;
  };
}

// Billing types
export interface UsageRecord {
  id: string;
  clientId: string;
  jobId: string;
  sessionId: string;
  metric: string;
  value: number;
  unit: string;
  timestamp: Date;
}

export interface Invoice {
  id: string;
  clientId: string;
  period: {
    start: Date;
    end: Date;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  lineItems: InvoiceLineItem[];
  stripeInvoiceId?: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}
