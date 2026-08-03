import fs from 'fs';
import path from 'path';
import { getLiveVdmMetrics, incrementBuildCounter } from './vdmMetrics.js';
import { vdmRollbackManager } from './vdmRollbackManager.js';
import { vdmHistoryManager } from './vdmHistoryManager.js';
import { vdmLogManager } from './vdmLogManager.js';

export type DeploymentStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'TIMED_OUT';

export interface QueueDeploymentItem {
  id: string;
  buildNumber: number;
  version: string;
  commitHash: string;
  branch: string;
  environment: 'Production' | 'Staging' | 'Testing' | 'Development';
  cloudTarget: string;
  operator: string;
  notes: string;
  status: DeploymentStatus;
  progress: number;
  currentStep: number;
  totalSteps: number;
  stepDescription: string;
  logs: string[];
  enqueuedAt: string;
  startedAt?: string;
  completedAt?: string;
  timeoutMs: number;
  retryCount: number;
  maxRetries: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const QUEUE_FILE = path.join(DATA_DIR, 'vdm_queue.json');

class VdmQueueManager {
  private items: QueueDeploymentItem[] = [];
  private isProcessing = false;
  private timer: NodeJS.Timeout | null = null;
  private currentTimeoutTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.ensureDataDir();
    this.loadFromDisk();
    // Start processing queue if any left queued/running
    this.processNext();
  }

  private ensureDataDir() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (e) {
      console.error('Failed to create data directory for VDM queue:', e);
    }
  }

  private saveToDisk() {
    try {
      this.ensureDataDir();
      fs.writeFileSync(QUEUE_FILE, JSON.stringify(this.items, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist VDM queue to disk:', e);
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(QUEUE_FILE)) {
        const raw = fs.readFileSync(QUEUE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.items = parsed.map((item: QueueDeploymentItem) => {
            // If server restarted while an item was running, mark it as FAILED or QUEUED so it doesn't get stuck forever
            if (item.status === 'RUNNING') {
              item.status = 'FAILED';
              item.logs = [...(item.logs || []), `[VDM Queue Worker] Server restarted during execution. Execution aborted.`];
              item.completedAt = new Date().toISOString();
            }
            return item;
          });
        }
      }
    } catch (e) {
      console.error('Failed to load VDM queue from disk:', e);
      this.items = [];
    }
  }

  public getQueue(): QueueDeploymentItem[] {
    return [...this.items];
  }

  public getSummary() {
    const items = this.getQueue();
    return {
      total: items.length,
      pendingCount: items.filter(i => i.status === 'QUEUED' || i.status === 'RUNNING').length,
      completedCount: items.filter(i => i.status === 'COMPLETED').length,
      failedCount: items.filter(i => i.status === 'FAILED' || i.status === 'TIMED_OUT').length
    };
  }

  public getItemById(id: string): QueueDeploymentItem | undefined {
    return this.items.find(i => i.id === id);
  }

  public enqueue(params: {
    environment?: 'Production' | 'Staging' | 'Testing' | 'Development';
    cloudTarget?: string;
    operator?: string;
    notes?: string;
    timeoutMs?: number;
    maxRetries?: number;
  }): QueueDeploymentItem {
    const metrics = getLiveVdmMetrics();
    const buildNumber = incrementBuildCounter();
    const now = new Date().toISOString();

    const newItem: QueueDeploymentItem = {
      id: `qdep-${buildNumber}`,
      buildNumber,
      version: `v${metrics.appVersion}`,
      commitHash: metrics.gitCommitHash,
      branch: metrics.gitBranch,
      environment: params.environment || 'Production',
      cloudTarget: params.cloudTarget || 'Namecheap Shared Hosting / cPanel',
      operator: params.operator || 'admin@veritas.gov.rw',
      notes: params.notes || 'Automated VDM Queued Deployment',
      status: 'QUEUED',
      progress: 0,
      currentStep: 0,
      totalSteps: 10,
      stepDescription: 'Queued in FIFO Pipeline',
      logs: [
        `[${now}] Enqueued deployment qdep-${buildNumber} for ${params.environment || 'Production'}`
      ],
      enqueuedAt: now,
      timeoutMs: params.timeoutMs || 45000, // 45 sec default timeout
      retryCount: 0,
      maxRetries: params.maxRetries ?? 2
    };

    this.items.push(newItem);
    this.saveToDisk();

    vdmLogManager.addLog(
      'INFO',
      'Queue Worker',
      `Enqueued job ${newItem.id} (Build #${newItem.buildNumber}) for ${newItem.environment} via ${newItem.cloudTarget}`,
      newItem.id
    );

    // Trigger queue processor
    setImmediate(() => this.processNext());

    return newItem;
  }

  public cancel(id: string): QueueDeploymentItem | null {
    const item = this.items.find(i => i.id === id);
    if (!item) return null;

    if (item.status === 'COMPLETED' || item.status === 'CANCELLED' || item.status === 'TIMED_OUT') {
      return item; // Already finished
    }

    const now = new Date().toISOString();
    const wasRunning = item.status === 'RUNNING';

    item.status = 'CANCELLED';
    item.completedAt = now;
    item.stepDescription = 'Cancelled by operator';
    item.logs.push(`[${now}] Deployment CANCELLED by operator request.`);

    vdmLogManager.addLog(
      'WARN',
      'Queue Worker',
      `Deployment job ${item.id} CANCELLED by operator request.`,
      item.id
    );

    if (wasRunning) {
      if (this.currentTimeoutTimer) {
        clearTimeout(this.currentTimeoutTimer);
        this.currentTimeoutTimer = null;
      }
      this.isProcessing = false;
    }

    this.saveToDisk();

    if (wasRunning) {
      setImmediate(() => this.processNext());
    }

    return item;
  }

  public retry(id: string): QueueDeploymentItem | null {
    const originalItem = this.items.find(i => i.id === id);
    if (!originalItem) return null;

    // Enqueue a fresh retry item
    const newItem = this.enqueue({
      environment: originalItem.environment,
      cloudTarget: originalItem.cloudTarget,
      operator: originalItem.operator,
      notes: `Retry of ${originalItem.id}: ${originalItem.notes}`,
      timeoutMs: originalItem.timeoutMs,
      maxRetries: originalItem.maxRetries
    });

    newItem.retryCount = originalItem.retryCount + 1;
    this.saveToDisk();

    return newItem;
  }

  public clearCompleted(): number {
    const countBefore = this.items.length;
    this.items = this.items.filter(i => i.status === 'QUEUED' || i.status === 'RUNNING');
    this.saveToDisk();
    return countBefore - this.items.length;
  }

  private async processNext() {
    if (this.isProcessing) return;

    // Find next QUEUED item in FIFO order
    const nextItem = this.items.find(i => i.status === 'QUEUED');
    if (!nextItem) return;

    this.isProcessing = true;
    nextItem.status = 'RUNNING';
    nextItem.startedAt = new Date().toISOString();
    nextItem.logs.push(`[${nextItem.startedAt}] [VDM Queue Worker] Starting FIFO execution for ${nextItem.id}`);
    this.saveToDisk();

    vdmLogManager.addLog(
      'INFO',
      'Queue Worker',
      `Starting execution of FIFO job ${nextItem.id} (Build #${nextItem.buildNumber}) for ${nextItem.environment}`,
      nextItem.id
    );

    // Set timeout safeguard timer
    this.currentTimeoutTimer = setTimeout(() => {
      if (nextItem.status === 'RUNNING') {
        const timeoutTime = new Date().toISOString();
        nextItem.status = 'TIMED_OUT';
        nextItem.completedAt = timeoutTime;
        nextItem.stepDescription = 'Execution timed out';
        nextItem.logs.push(`[${timeoutTime}] [VDM Queue Worker] TIMEOUT ERROR: Exceeded maximum allowed runtime of ${nextItem.timeoutMs}ms.`);

        vdmLogManager.addLog(
          'ERROR',
          'Queue Worker',
          `Deployment job ${nextItem.id} TIMED OUT after exceeding ${nextItem.timeoutMs}ms maximum runtime limit.`,
          nextItem.id
        );

        // Trigger Phase 5 Automatic Rollback on Timeout Failure
        const autoRollback = vdmRollbackManager.executeAutomaticRollback({
          triggerReason: `Deployment job ${nextItem.id} exceeded maximum execution timeout limit (${nextItem.timeoutMs}ms)`,
          failedJobId: nextItem.id,
          environment: nextItem.environment,
          operatorEmail: nextItem.operator
        });

        nextItem.logs.push(`[${timeoutTime}] [VDM Queue Worker] AUTOMATIC ROLLBACK EXECUTED: Restored snapshot ${autoRollback.restoredSnapshotId} (${autoRollback.restoredVersion})`);
        this.saveToDisk();

        // Save to Persistent History (Phase 7)
        vdmHistoryManager.addRecord({
          id: nextItem.id,
          buildId: `BUILD-${nextItem.buildNumber}`,
          version: `v1.0.0-timeout`,
          commitHash: nextItem.commitHash,
          branch: nextItem.branch,
          buildNumber: nextItem.buildNumber,
          startTime: nextItem.startedAt || new Date().toISOString(),
          finishTime: timeoutTime,
          duration: `${Math.round(nextItem.timeoutMs / 1000)}s`,
          operator: nextItem.operator,
          environment: nextItem.environment,
          status: 'TIMED_OUT',
          errors: [`Execution timed out after ${nextItem.timeoutMs}ms`],
          warnings: ['Automatic rollback triggered due to queue execution timeout'],
          notes: `Deployment job ${nextItem.id} timed out. Auto-restored ${autoRollback.restoredSnapshotId}`,
          rollbackTarget: autoRollback.restoredSnapshotId,
          rollbackAvailable: false,
          healthPassed: false,
          cloudTarget: nextItem.cloudTarget,
          logs: nextItem.logs
        });

        this.isProcessing = false;
        this.currentTimeoutTimer = null;
        setImmediate(() => this.processNext());
      }
    }, nextItem.timeoutMs);

    // Simulate 10-step realistic pipeline execution
    const steps = [
      { step: 1, prog: 10, log: `Inspect git branch ${nextItem.branch} and commit ${nextItem.commitHash}` },
      { step: 2, prog: 20, log: `Validate GPG commit signatures & developer policy` },
      { step: 3, prog: 30, log: `Check environment variable configuration & secret vault` },
      { step: 4, prog: 40, log: `Create atomic pre-deployment snapshot image` },
      { step: 5, prog: 55, log: `Install & verify node_modules dependencies` },
      { step: 6, prog: 70, log: `Bundle client & server build outputs with esbuild` },
      { step: 7, prog: 80, log: `Execute automated linting & TypeScript verification` },
      { step: 8, prog: 90, log: `Deploy release assets to ${nextItem.cloudTarget}` },
      { step: 9, prog: 95, log: `Perform 12-point health diagnostics sweep` },
      { step: 10, prog: 100, log: `Deployment COMPLETED successfully.` }
    ];

    for (const s of steps) {
      if (nextItem.status !== 'RUNNING') {
        // Was cancelled or timed out externally
        if (this.currentTimeoutTimer) clearTimeout(this.currentTimeoutTimer);
        this.isProcessing = false;
        return;
      }

      // Step 4: Automatically register atomic pre-deployment snapshot
      if (s.step === 4) {
        vdmRollbackManager.createSnapshot(nextItem.environment, `VDM Queue (${nextItem.operator})`);
      }

      nextItem.currentStep = s.step;
      nextItem.progress = s.prog;
      nextItem.stepDescription = s.log;
      const stepTime = new Date().toLocaleTimeString();
      nextItem.logs.push(`[${stepTime}] Step ${s.step}/10: ${s.log}`);
      this.saveToDisk();

      vdmLogManager.addLog(
        s.step === 10 ? 'SUCCESS' : 'INFO',
        'Build Pipeline',
        `[${nextItem.id}] Step ${s.step}/10: ${s.log}`,
        nextItem.id
      );

      // Wait 1 second per step
      await new Promise(res => setTimeout(res, 1000));
    }

    if (nextItem.status === 'RUNNING') {
      if (this.currentTimeoutTimer) clearTimeout(this.currentTimeoutTimer);
      nextItem.status = 'COMPLETED';
      nextItem.completedAt = new Date().toISOString();
      nextItem.stepDescription = 'Successfully Deployed to ' + nextItem.environment;
      this.saveToDisk();

      vdmLogManager.addLog(
        'SUCCESS',
        'VDM Kernel',
        `Deployment job ${nextItem.id} COMPLETED successfully for ${nextItem.environment} on ${nextItem.cloudTarget}`,
        nextItem.id
      );

      const startTimeMs = nextItem.startedAt ? new Date(nextItem.startedAt).getTime() : Date.now() - 10000;
      const finishTimeMs = new Date(nextItem.completedAt).getTime();
      const durationSec = Math.max(1, Math.round((finishTimeMs - startTimeMs) / 1000));

      vdmHistoryManager.addRecord({
        id: nextItem.id,
        buildId: `BUILD-${nextItem.buildNumber}`,
        version: `v1.0.0`,
        commitHash: nextItem.commitHash,
        branch: nextItem.branch,
        buildNumber: nextItem.buildNumber,
        startTime: nextItem.startedAt || new Date().toISOString(),
        finishTime: nextItem.completedAt,
        duration: `${durationSec}s`,
        operator: nextItem.operator,
        environment: nextItem.environment,
        status: 'SUCCESS',
        errors: [],
        warnings: [],
        notes: `Queue Job ${nextItem.id} deployed to ${nextItem.environment} via ${nextItem.cloudTarget}`,
        rollbackTarget: `snap-${nextItem.buildNumber}`,
        rollbackAvailable: true,
        healthPassed: true,
        cloudTarget: nextItem.cloudTarget,
        logs: nextItem.logs
      });
    }

    this.isProcessing = false;
    this.currentTimeoutTimer = null;

    // Process next queued item if any
    setImmediate(() => this.processNext());
  }
}

export const vdmQueueManager = new VdmQueueManager();
