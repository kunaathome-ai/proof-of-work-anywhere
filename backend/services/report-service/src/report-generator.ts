import PDFDocument from 'pdfkit';
import { EvidenceManifest, ProofReport, AIFinding } from '../../../../shared/types';
import { createLogger, LogLevel } from '../../../../shared/utils/logger';
import { sign, sha256 } from '../../../../shared/utils/crypto';

const logger = createLogger('report-generator', LogLevel.INFO);

export class ReportGenerator {
  async generateProofReport(manifest: EvidenceManifest, privateKey: string): Promise<ProofReport> {
    const reportId = `${manifest.sessionId}-${Date.now()}`;
    
    // Generate JSON report
    const jsonReport = await this.generateJsonReport(manifest, reportId);
    
    // Generate PDF report
    const pdfBuffer = await this.generatePdfReport(manifest, reportId);
    
    // Sign the manifest
    const manifestString = JSON.stringify(manifest);
    const signature = sign(manifestString, privateKey);
    
    const report: ProofReport = {
      id: reportId,
      jobId: manifest.jobId,
      sessionId: manifest.sessionId,
      manifest,
      jsonUrl: `/reports/${reportId}.json`,
      generatedAt: new Date(),
      signed: true,
      signature
    };

    logger.info('Proof report generated', { reportId });
    return report;
  }

  private async generateJsonReport(manifest: EvidenceManifest, reportId: string): Promise<string> {
    const report = {
      id: reportId,
      manifest,
      generatedAt: new Date().toISOString(),
      version: '1.0'
    };

    return JSON.stringify(report, null, 2);
  }

  private async generatePdfReport(manifest: EvidenceManifest, reportId: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('Proof of Work Report', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12).text(`Report ID: ${reportId}`);
      doc.text(`Generated: ${new Date().toLocaleString()}`);
      doc.moveDown();

      // Job Information
      doc.fontSize(14).text('Job Information', { underline: true });
      doc.fontSize(10);
      doc.text(`Job ID: ${manifest.jobId}`);
      doc.text(`Session ID: ${manifest.sessionId}`);
      doc.text(`Client: ${manifest.client}`);
      doc.text(`Timestamp: ${manifest.timestamp.toLocaleString()}`);
      doc.moveDown();

      // Location
      if (manifest.location) {
        doc.fontSize(14).text('Location', { underline: true });
        doc.fontSize(10);
        doc.text(`Latitude: ${manifest.location.latitude}`);
        doc.text(`Longitude: ${manifest.location.longitude}`);
        doc.text(`Accuracy: ${manifest.location.accuracy}m`);
        doc.moveDown();
      }

      // Evidence Summary
      doc.fontSize(14).text('Evidence Summary', { underline: true });
      doc.fontSize(10);
      manifest.evidence.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.type} - ${item.hash.substring(0, 16)}...`);
      });
      doc.moveDown();

      // Hashes
      doc.fontSize(14).text('Evidence Hashes', { underline: true });
      doc.fontSize(8);
      Object.entries(manifest.hashes).forEach(([key, hash]) => {
        doc.text(`${key}: ${hash}`);
      });
      doc.moveDown();

      // AI Findings
      if (manifest.aiFindings && manifest.aiFindings.length > 0) {
        doc.fontSize(14).text('AI Analysis', { underline: true });
        doc.fontSize(10);
        manifest.aiFindings.forEach((finding, index) => {
          doc.text(`${index + 1}. ${finding.type} - Confidence: ${(finding.confidence * 100).toFixed(1)}%`);
          doc.text(`   ${finding.description}`, { indent: 4 });
        });
        doc.moveDown();
      }

      // Audit Trail
      doc.fontSize(14).text('Audit Trail', { underline: true });
      doc.fontSize(8);
      manifest.auditTrail.forEach((entry, index) => {
        doc.text(`${index + 1}. ${entry.timestamp.toLocaleString()} - ${entry.actor} - ${entry.action}`);
      });

      // Footer
      doc.fontSize(8).text(
        'This report is cryptographically signed and tamper-evident.',
        { align: 'center' }
      );

      doc.end();
    });
  }

  async generateManifest(
    sessionId: string,
    jobId: string,
    client: string,
    evidence: any[],
    aiFindings?: AIFinding[]
  ): Promise<EvidenceManifest> {
    const hashes: { [key: string]: string } = {};
    
    for (const item of evidence) {
      hashes[item.id] = item.hash;
    }

    const manifest: EvidenceManifest = {
      jobId,
      sessionId,
      client,
      timestamp: new Date(),
      evidence: evidence.map(item => ({
        id: item.id,
        type: item.type,
        hash: item.hash,
        url: item.data.url,
        metadata: item.data
      })),
      hashes,
      aiFindings,
      auditTrail: [
        {
          action: 'manifest_generated',
          actor: 'report-service',
          timestamp: new Date(),
          details: { evidenceCount: evidence.length }
        }
      ]
    };

    return manifest;
  }

  async verifyReport(report: ProofReport, publicKey: string): Promise<boolean> {
    const manifestString = JSON.stringify(report.manifest);
    return verify(manifestString, report.signature || '', publicKey);
  }
}

function verify(data: string, signature: string, publicKey: string): boolean {
  const crypto = require('crypto');
  return crypto.createVerify('SHA256').update(data).verify(publicKey, signature, 'base64');
}
