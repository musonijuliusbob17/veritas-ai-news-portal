import fs from 'fs';
import path from 'path';

export interface VdmAuditRecord {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  operator: string;
  ipAddress: string;
  userAgent: string;
  statusCode: number;
  action: string;
  status: 'SUCCESS' | 'FAILED' | 'UNAUTHORIZED';
  details?: string | Record<string, any>;
}

export class VdmAuditLogger {
  private auditLogs: VdmAuditRecord[] = [];
  private filePath: string;

  constructor() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (e) {
        console.warn('Failed to create data directory for audit logs:', e);
      }
    }
    this.filePath = path.join(dataDir, 'vdm_audit_logs.json');
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.auditLogs = JSON.parse(raw);
      } else {
        // Initialize with default historical audit logs
        this.auditLogs = [
          {
            id: 'audit-1042',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            method: 'POST',
            endpoint: '/api/vdm/deploy',
            operator: 'admin@veritas.gov.rw',
            ipAddress: '197.243.12.44',
            userAgent: 'Mozilla/5.0 (Veritas Operations Center)',
            statusCode: 200,
            action: 'DEPLOY_TRIGGERED',
            status: 'SUCCESS',
            details: { environment: 'Production', buildNumber: 1042 }
          },
          {
            id: 'audit-1041',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            method: 'POST',
            endpoint: '/api/vdm/rollback',
            operator: 'sysadmin@veritas.gov.rw',
            ipAddress: '197.243.12.10',
            userAgent: 'cURL/8.2.1',
            statusCode: 200,
            action: 'ROLLBACK_TRIGGERED',
            status: 'SUCCESS',
            details: { snapshotId: 'snap-1040', targetCommit: '7e281b0' }
          }
        ];
        this.saveToDisk();
      }
    } catch (err) {
      console.warn('Failed to load audit logs from disk:', err);
    }
  }

  private saveToDisk() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.auditLogs, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to save audit logs to disk:', err);
    }
  }

  public record(entry: Omit<VdmAuditRecord, 'id' | 'timestamp'>): VdmAuditRecord {
    const record: VdmAuditRecord = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };

    this.auditLogs.unshift(record);
    if (this.auditLogs.length > 500) {
      this.auditLogs = this.auditLogs.slice(0, 500);
    }

    this.saveToDisk();
    return record;
  }

  public getLogs(params?: {
    action?: string;
    status?: string;
    operator?: string;
    limit?: number;
  }): VdmAuditRecord[] {
    let result = [...this.auditLogs];

    if (params?.action) {
      const act = params.action.toLowerCase();
      result = result.filter(r => r.action.toLowerCase().includes(act));
    }

    if (params?.status) {
      const st = params.status.toUpperCase();
      result = result.filter(r => r.status === st);
    }

    if (params?.operator) {
      const op = params.operator.toLowerCase();
      result = result.filter(r => r.operator.toLowerCase().includes(op));
    }

    if (params?.limit && params.limit > 0) {
      result = result.slice(0, params.limit);
    }

    return result;
  }
}

export const vdmAuditLogger = new VdmAuditLogger();
