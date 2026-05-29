import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { Client, JobTemplate, SystemConfig, AIModelConfig } from '../../../../shared/types';

export class Database {
  private db: Database.Database | null = null;

  async initialize() {
    const dbPath = process.env.DB_PATH || './data/config.db';
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.createTables();
  }

  private createTables() {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        storage_config TEXT NOT NULL,
        ai_config TEXT,
        billing_plan TEXT NOT NULL,
        cmk_enabled INTEGER NOT NULL DEFAULT 0,
        cmk_key_id TEXT,
        webhook_url TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS job_templates (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        required_photos INTEGER NOT NULL,
        checklist_template TEXT NOT NULL,
        ai_prompt_template TEXT,
        validation_rules TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS system_config (
        id TEXT PRIMARY KEY,
        runtime_mode TEXT NOT NULL,
        default_storage TEXT NOT NULL,
        default_ai TEXT NOT NULL,
        auth_config TEXT NOT NULL,
        blockchain_config TEXT,
        observability_config TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_clients_plan ON clients(billing_plan);
      CREATE INDEX IF NOT EXISTS idx_templates_client ON job_templates(client_id);
    `);

    // Initialize default system config if not exists
    this.initializeDefaultConfig();
  }

  private initializeDefaultConfig() {
    if (!this.db) throw new Error('Database not initialized');

    const existing = this.db.prepare('SELECT id FROM system_config WHERE id = ?').get('default');
    if (!existing) {
      const defaultConfig: SystemConfig = {
        runtimeMode: 'local',
        defaultStorage: {
          type: 'local',
          config: { basePath: './storage' }
        },
        defaultAI: {
          id: 'default',
          name: 'Mock AI',
          provider: 'local',
          type: 'multimodal',
          capabilities: ['text', 'vision']
        },
        auth: {
          oidc: { enabled: false, issuer: '', clientId: '' },
          jwt: { secret: 'change-in-production', expiry: '24h' }
        },
        observability: {
          metricsEnabled: true,
          tracingEnabled: false,
          logLevel: 'info'
        }
      };

      const stmt = this.db.prepare(`
        INSERT INTO system_config (id, runtime_mode, default_storage, default_ai, auth_config, blockchain_config, observability_config, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        'default',
        defaultConfig.runtimeMode,
        JSON.stringify(defaultConfig.defaultStorage),
        JSON.stringify(defaultConfig.defaultAI),
        JSON.stringify(defaultConfig.auth),
        JSON.stringify(defaultConfig.blockchain || {}),
        JSON.stringify(defaultConfig.observability),
        new Date().toISOString()
      );
    }
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    if (!this.db) throw new Error('Database not initialized');

    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO clients (id, name, storage_config, ai_config, billing_plan, cmk_enabled, cmk_key_id, webhook_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      client.name,
      JSON.stringify(client.storageConfig),
      JSON.stringify(client.aiConfig || {}),
      client.billingPlan,
      client.cmkEnabled ? 1 : 0,
      client.cmkKeyId || null,
      client.webhookUrl || null,
      now,
      now
    );

    return this.getClientById(id) as Client;
  }

  async getClientById(id: string): Promise<Client | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM clients WHERE id = ?');
    const client = stmt.get(id) as any;

    if (!client) return null;

    return {
      id: client.id,
      name: client.name,
      storageConfig: JSON.parse(client.storage_config),
      aiConfig: JSON.parse(client.ai_config || '{}'),
      billingPlan: client.billing_plan,
      cmkEnabled: client.cmk_enabled === 1,
      cmkKeyId: client.cmk_key_id,
      webhookUrl: client.webhook_url,
      createdAt: new Date(client.created_at),
      updatedAt: new Date(client.updated_at)
    };
  }

  async getAllClients(): Promise<Client[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT id FROM clients');
    const clientIds = stmt.all() as any[];

    const clients = [];
    for (const { id } of clientIds) {
      const client = await this.getClientById(id);
      if (client) clients.push(client);
    }

    return clients;
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
    if (!this.db) throw new Error('Database not initialized');

    const existing = await this.getClientById(id);
    if (!existing) return null;

    const merged = { ...existing, ...updates, updatedAt: new Date() };

    const stmt = this.db.prepare(`
      UPDATE clients
      SET name = ?, storage_config = ?, ai_config = ?, billing_plan = ?, cmk_enabled = ?, cmk_key_id = ?, webhook_url = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      merged.name,
      JSON.stringify(merged.storageConfig),
      JSON.stringify(merged.aiConfig || {}),
      merged.billingPlan,
      merged.cmkEnabled ? 1 : 0,
      merged.cmkKeyId || null,
      merged.webhookUrl || null,
      new Date().toISOString(),
      id
    );

    return this.getClientById(id);
  }

  async deleteClient(id: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('DELETE FROM clients WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async createJobTemplate(template: Omit<JobTemplate, 'id'>): Promise<JobTemplate> {
    if (!this.db) throw new Error('Database not initialized');

    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO job_templates (id, client_id, name, description, required_photos, checklist_template, ai_prompt_template, validation_rules, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      template.clientId,
      template.name,
      template.description,
      template.requiredPhotos,
      JSON.stringify(template.checklistTemplate),
      template.aiPromptTemplate || null,
      JSON.stringify(template.validationRules),
      template.isActive ? 1 : 0,
      now,
      now
    );

    return this.getJobTemplateById(id) as JobTemplate;
  }

  async getJobTemplateById(id: string): Promise<JobTemplate | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM job_templates WHERE id = ?');
    const template = stmt.get(id) as any;

    if (!template) return null;

    return {
      id: template.id,
      clientId: template.client_id,
      name: template.name,
      description: template.description,
      requiredPhotos: template.required_photos,
      checklistTemplate: JSON.parse(template.checklist_template),
      aiPromptTemplate: template.ai_prompt_template,
      validationRules: JSON.parse(template.validation_rules),
      isActive: template.is_active === 1
    };
  }

  async getJobTemplatesByClient(clientId: string): Promise<JobTemplate[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT id FROM job_templates WHERE client_id = ?');
    const templateIds = stmt.all(clientId) as any[];

    const templates = [];
    for (const { id } of templateIds) {
      const template = await this.getJobTemplateById(id);
      if (template) templates.push(template);
    }

    return templates;
  }

  async getSystemConfig(): Promise<SystemConfig> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM system_config WHERE id = ?');
    const config = stmt.get('default') as any;

    return {
      runtimeMode: config.runtime_mode,
      defaultStorage: JSON.parse(config.default_storage),
      defaultAI: JSON.parse(config.default_ai),
      auth: JSON.parse(config.auth_config),
      blockchain: JSON.parse(config.blockchain_config || '{}'),
      observability: JSON.parse(config.observability_config)
    };
  }

  async updateSystemConfig(updates: Partial<SystemConfig>): Promise<SystemConfig> {
    if (!this.db) throw new Error('Database not initialized');

    const existing = await this.getSystemConfig();
    const merged = { ...existing, ...updates };

    const stmt = this.db.prepare(`
      UPDATE system_config
      SET runtime_mode = ?, default_storage = ?, default_ai = ?, auth_config = ?, blockchain_config = ?, observability_config = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      merged.runtimeMode,
      JSON.stringify(merged.defaultStorage),
      JSON.stringify(merged.defaultAI),
      JSON.stringify(merged.auth),
      JSON.stringify(merged.blockchain || {}),
      JSON.stringify(merged.observability),
      new Date().toISOString(),
      'default'
    );

    return this.getSystemConfig();
  }
}
