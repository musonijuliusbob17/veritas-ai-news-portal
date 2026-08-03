import fs from 'fs';
import path from 'path';

export interface DeploymentHistoryRecord {
  id: string;
  buildId: string;
  version: string;
  commitHash: string;
  branch: string;
  buildNumber: number;
  startTime: string;
  finishTime: string;
  duration: string;
  operator: string;
  environment: string;
  status: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS' | 'ROLLED_BACK' | 'TIMED_OUT' | 'CANCELLED';
  errors: string[];
  warnings: string[];
  notes: string;
  rollbackTarget: string;
  rollbackAvailable: boolean;
  healthPassed: boolean;
  cloudTarget?: string;
  logs?: string[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'vdm_deployments.json');

class VdmHistoryManager {
  private history: DeploymentHistoryRecord[] = [];

  constructor() {
    this.ensureDataDir();
    this.loadFromDisk();
    this.seedDefaultHistoryIfEmpty();
  }

  private ensureDataDir() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (e) {
      console.error('Failed to create data directory for VDM History Manager:', e);
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(HISTORY_FILE)) {
        const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
        this.history = JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load VDM history data from disk:', e);
    }
  }

  private saveToDisk() {
    try {
      this.ensureDataDir();
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(this.history, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save VDM history data to disk:', e);
    }
  }

  private seedDefaultHistoryIfEmpty() {
    if (this.history.length === 0) {
      const now = Date.now();
      this.history = [
        {
          id: 'dep-1042',
          buildId: 'BUILD-1042',
          version: 'v1.0.0',
          commitHash: '91679a2',
          branch: 'main',
          buildNumber: 1042,
          startTime: new Date(now - 3600000 - 11000).toISOString(),
          finishTime: new Date(now - 3600000).toISOString(),
          duration: '11s',
          operator: 'admin@veritas.gov.rw',
          environment: 'Production',
          status: 'SUCCESS',
          errors: [],
          warnings: ['Minor latency spike in RSS feed ingestion worker (120ms)'],
          notes: 'Live Veritas Deployment Manager Orchestration Subsystem initialized.',
          rollbackTarget: 'snap-1041 (v0.9.9 @ 7e281b0)',
          rollbackAvailable: true,
          healthPassed: true,
          cloudTarget: 'Namecheap Shared Hosting / cPanel'
        },
        {
          id: 'dep-1041',
          buildId: 'BUILD-1041',
          version: 'v0.9.9',
          commitHash: '7e281b0',
          branch: 'main',
          buildNumber: 1041,
          startTime: new Date(now - 86400000 - 14000).toISOString(),
          finishTime: new Date(now - 86400000).toISOString(),
          duration: '14s',
          operator: 'admin@veritas.gov.rw',
          environment: 'Production',
          status: 'SUCCESS',
          errors: [],
          warnings: [],
          notes: 'Integrated VCIO Brain & VCIA Investigative Intelligence Subsystem.',
          rollbackTarget: 'snap-1040 (v0.9.8 @ 3a91c8d)',
          rollbackAvailable: true,
          healthPassed: true,
          cloudTarget: 'Namecheap Shared Hosting / cPanel'
        },
        {
          id: 'dep-1040',
          buildId: 'BUILD-1040',
          version: 'v0.9.8',
          commitHash: '3a91c8d',
          branch: 'staging',
          buildNumber: 1040,
          startTime: new Date(now - 172800000 - 18000).toISOString(),
          finishTime: new Date(now - 172800000).toISOString(),
          duration: '18s',
          operator: 'devops@veritas.gov.rw',
          environment: 'Staging',
          status: 'SUCCESS',
          errors: [],
          warnings: ['Node version deprecation warning for dependencies'],
          notes: 'Staging build with automated pre-deployment snapshot generation.',
          rollbackTarget: 'snap-1039 (v0.9.7 @ 1b22c9e)',
          rollbackAvailable: true,
          healthPassed: true,
          cloudTarget: 'AWS EC2 Container Instance'
        },
        {
          id: 'dep-1039',
          buildId: 'BUILD-1039',
          version: 'v0.9.7',
          commitHash: '1b22c9e',
          branch: 'feature/auth-hardening',
          buildNumber: 1039,
          startTime: new Date(now - 259200000 - 45000).toISOString(),
          finishTime: new Date(now - 259200000).toISOString(),
          duration: '45s',
          operator: 'secops@veritas.gov.rw',
          environment: 'Testing',
          status: 'TIMED_OUT',
          errors: ['Deployment job dep-1039 exceeded maximum execution timeout limit (45000ms)'],
          warnings: ['Network timeout connecting to external health probe'],
          notes: 'Auth hardening verification test.',
          rollbackTarget: 'snap-1038 (v0.9.6 @ 4f11a80)',
          rollbackAvailable: false,
          healthPassed: false,
          cloudTarget: 'Staging Test Cluster'
        }
      ];
      this.saveToDisk();
    }
  }

  public getAll(): DeploymentHistoryRecord[] {
    return this.getHistory();
  }

  public getHistory(params?: {
    environment?: string;
    status?: string;
    search?: string;
    rollbackOnly?: boolean;
  }): DeploymentHistoryRecord[] {
    let result = [...this.history];

    if (params) {
      if (params.environment && params.environment.toUpperCase() !== 'ALL') {
        result = result.filter(r => r.environment.toLowerCase() === params.environment!.toLowerCase());
      }
      if (params.status && params.status.toUpperCase() !== 'ALL') {
        result = result.filter(r => r.status.toLowerCase() === params.status!.toLowerCase());
      }
      if (params.rollbackOnly) {
        result = result.filter(r => r.rollbackAvailable);
      }
      if (params.search && params.search.trim() !== '') {
        const q = params.search.toLowerCase().trim();
        result = result.filter(r =>
          r.id.toLowerCase().includes(q) ||
          r.buildId.toLowerCase().includes(q) ||
          r.version.toLowerCase().includes(q) ||
          r.commitHash.toLowerCase().includes(q) ||
          r.branch.toLowerCase().includes(q) ||
          r.operator.toLowerCase().includes(q) ||
          r.notes.toLowerCase().includes(q) ||
          r.errors.some(e => e.toLowerCase().includes(q)) ||
          r.warnings.some(w => w.toLowerCase().includes(q))
        );
      }
    }

    return result;
  }

  public addRecord(record: DeploymentHistoryRecord): DeploymentHistoryRecord {
    const existingIdx = this.history.findIndex(r => r.id === record.id);
    if (existingIdx >= 0) {
      this.history[existingIdx] = record;
    } else {
      this.history.unshift(record);
    }
    this.saveToDisk();
    return record;
  }

  public updateRecord(id: string, updates: Partial<DeploymentHistoryRecord>): DeploymentHistoryRecord | null {
    const item = this.history.find(r => r.id === id);
    if (item) {
      Object.assign(item, updates);
      this.saveToDisk();
      return item;
    }
    return null;
  }
}

export const vdmHistoryManager = new VdmHistoryManager();
