import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { Evidence, ValidationResult } from '../../../../shared/types';

export class Database {
  private db: Database.Database | null = null;

  async initialize() {
    const dbPath = process.env.DB_PATH || './data/evidence.db';
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.createTables();
  }

  private createTables() {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS evidence (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        job_id TEXT NOT NULL,
        type TEXT NOT NULL,
        data TEXT NOT NULL,
        hash TEXT NOT NULL,
        uploaded_at TEXT NOT NULL,
        server_side_hash TEXT,
        validated INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS validation_results (
        id TEXT PRIMARY KEY,
        evidence_id TEXT NOT NULL,
        validator TEXT NOT NULL,
        passed INTEGER NOT NULL,
        confidence REAL,
        reason TEXT,
        details TEXT,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_evidence_session ON evidence(session_id);
      CREATE INDEX IF NOT EXISTS idx_evidence_job ON evidence(job_id);
      CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence(type);
      CREATE INDEX IF NOT EXISTS idx_validation_evidence ON validation_results(evidence_id);
    `);
  }

  async createEvidence(evidence: Omit<Evidence, 'id' | 'uploadedAt'>): Promise<Evidence> {
    if (!this.db) throw new Error('Database not initialized');

    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO evidence (id, session_id, job_id, type, data, hash, uploaded_at, server_side_hash, validated, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      evidence.sessionId,
      evidence.jobId,
      evidence.type,
      JSON.stringify(evidence.data),
      evidence.hash,
      now,
      evidence.serverSideHash || null,
      evidence.validated ? 1 : 0,
      now
    );

    return this.getEvidenceById(id) as Evidence;
  }

  async getEvidenceById(id: string): Promise<Evidence | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM evidence WHERE id = ?');
    const evidence = stmt.get(id) as any;

    if (!evidence) return null;

    const validationStmt = this.db.prepare('SELECT * FROM validation_results WHERE evidence_id = ?');
    const validationResults = validationStmt.all(id) as any[];

    return {
      id: evidence.id,
      sessionId: evidence.session_id,
      jobId: evidence.job_id,
      type: evidence.type,
      data: JSON.parse(evidence.data),
      hash: evidence.hash,
      uploadedAt: new Date(evidence.uploaded_at),
      serverSideHash: evidence.server_side_hash,
      validated: evidence.validated === 1,
      validationResults: validationResults.map(vr => ({
        validator: vr.validator,
        passed: vr.passed === 1,
        confidence: vr.confidence,
        reason: vr.reason,
        details: vr.details ? JSON.parse(vr.details) : undefined,
        timestamp: new Date(vr.timestamp)
      }))
    };
  }

  async getEvidenceBySession(sessionId: string): Promise<Evidence[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT id FROM evidence WHERE session_id = ?');
    const evidenceIds = stmt.all(sessionId) as any[];

    const evidenceList = [];
    for (const { id } of evidenceIds) {
      const evidence = await this.getEvidenceById(id);
      if (evidence) evidenceList.push(evidence);
    }

    return evidenceList;
  }

  async getEvidenceByJob(jobId: string): Promise<Evidence[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT id FROM evidence WHERE job_id = ?');
    const evidenceIds = stmt.all(jobId) as any[];

    const evidenceList = [];
    for (const { id } of evidenceIds) {
      const evidence = await this.getEvidenceById(id);
      if (evidence) evidenceList.push(evidence);
    }

    return evidenceList;
  }

  async updateEvidence(id: string, updates: Partial<Evidence>): Promise<Evidence | null> {
    if (!this.db) throw new Error('Database not initialized');

    const existing = await this.getEvidenceById(id);
    if (!existing) return null;

    const merged = { ...existing, ...updates };

    const stmt = this.db.prepare(`
      UPDATE evidence
      SET server_side_hash = ?, validated = ?
      WHERE id = ?
    `);

    stmt.run(
      merged.serverSideHash || null,
      merged.validated ? 1 : 0,
      id
    );

    return this.getEvidenceById(id);
  }

  async addValidationResult(evidenceId: string, result: ValidationResult): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      INSERT INTO validation_results (id, evidence_id, validator, passed, confidence, reason, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      uuidv4(),
      evidenceId,
      result.validator,
      result.passed ? 1 : 0,
      result.confidence || null,
      result.reason || null,
      result.details ? JSON.stringify(result.details) : null,
      result.timestamp.toISOString()
    );
  }

  async deleteEvidence(id: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('DELETE FROM evidence WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
