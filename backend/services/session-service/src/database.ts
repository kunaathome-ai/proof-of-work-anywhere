import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Session, DeviceInfo } from '../../../../shared/types';

export class Database {
  private db: Database.Database | null = null;
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
  }

  async initialize() {
    const dbPath = process.env.DB_PATH || './data/sessions.db';
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.createTables();
  }

  private createTables() {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        magic_link_token TEXT UNIQUE NOT NULL,
        worker_email TEXT,
        worker_phone TEXT,
        status TEXT NOT NULL,
        started_at TEXT,
        completed_at TEXT,
        expires_at TEXT NOT NULL,
        device_info TEXT,
        one_time_use INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_job ON sessions(job_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(magic_link_token);
      CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
    `);
  }

  generateMagicLinkToken(): string {
    return jwt.sign(
      { sessionId: uuidv4(), timestamp: Date.now() },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  verifyMagicLinkToken(token: string): { sessionId: string; valid: boolean } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      return { sessionId: decoded.sessionId, valid: true };
    } catch (error) {
      return { sessionId: '', valid: false };
    }
  }

  async createSession(session: Omit<Session, 'id' | 'magicLinkToken'>): Promise<Session> {
    if (!this.db) throw new Error('Database not initialized');

    const id = uuidv4();
    const magicLinkToken = this.generateMagicLinkToken();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO sessions (id, job_id, magic_link_token, worker_email, worker_phone, status, started_at, completed_at, expires_at, device_info, one_time_use, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      session.jobId,
      magicLinkToken,
      session.workerEmail || null,
      session.workerPhone || null,
      session.status,
      session.startedAt?.toISOString() || null,
      session.completedAt?.toISOString() || null,
      session.expiresAt.toISOString(),
      JSON.stringify(session.deviceInfo || {}),
      session.oneTimeUse ? 1 : 0,
      now
    );

    return this.getSessionById(id) as Session;
  }

  async getSessionById(id: string): Promise<Session | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM sessions WHERE id = ?');
    const session = stmt.get(id) as any;

    if (!session) return null;

    return {
      id: session.id,
      jobId: session.job_id,
      magicLinkToken: session.magic_link_token,
      workerEmail: session.worker_email,
      workerPhone: session.worker_phone,
      status: session.status,
      startedAt: session.started_at ? new Date(session.started_at) : undefined,
      completedAt: session.completed_at ? new Date(session.completed_at) : undefined,
      expiresAt: new Date(session.expires_at),
      deviceInfo: session.device_info ? JSON.parse(session.device_info) : undefined,
      oneTimeUse: session.one_time_use === 1
    };
  }

  async getSessionByToken(token: string): Promise<Session | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM sessions WHERE magic_link_token = ?');
    const session = stmt.get(token) as any;

    if (!session) return null;

    return this.getSessionById(session.id);
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | null> {
    if (!this.db) throw new Error('Database not initialized');

    const existing = await this.getSessionById(id);
    if (!existing) return null;

    const merged = { ...existing, ...updates };

    const stmt = this.db.prepare(`
      UPDATE sessions
      SET status = ?, started_at = ?, completed_at = ?, device_info = ?
      WHERE id = ?
    `);

    stmt.run(
      merged.status,
      merged.startedAt?.toISOString() || null,
      merged.completedAt?.toISOString() || null,
      JSON.stringify(merged.deviceInfo || {}),
      id
    );

    return this.getSessionById(id);
  }

  async getSessionsByJob(jobId: string): Promise<Session[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT id FROM sessions WHERE job_id = ?');
    const sessionIds = stmt.all(jobId) as any[];

    const sessions = [];
    for (const { id } of sessionIds) {
      const session = await this.getSessionById(id);
      if (session) sessions.push(session);
    }

    return sessions;
  }

  async deleteSession(id: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('DELETE FROM sessions WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async cleanupExpiredSessions(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const stmt = this.db.prepare('DELETE FROM sessions WHERE expires_at < ?');
    const result = stmt.run(now);
    return result.changes;
  }
}
