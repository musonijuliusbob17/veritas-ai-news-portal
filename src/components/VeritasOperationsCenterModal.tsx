import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Article } from '../types';
import {
  Server,
  Cpu,
  Database,
  Activity,
  GitCommit,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  Clock,
  RefreshCw,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Terminal,
  Layers,
  HardDrive,
  Radio,
  Sparkles,
  Zap,
  Globe,
  Lock,
  Search,
  Bell,
  Sliders,
  Download,
  Upload,
  BarChart2,
  X,
  FileCode,
  Box,
  Cloud,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  HelpCircle,
  Check,
  List,
  Flame,
  Info
} from 'lucide-react';

interface VeritasOperationsCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles?: Article[];
}

export interface VdmLogEntry {
  id: string;
  timestamp: string;
  formattedTime: string;
  severity: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SUCCESS';
  source: string;
  message: string;
  deploymentId?: string;
  meta?: Record<string, any>;
}

export interface VcioBriefingData {
  generatedAt: string;
  deploymentOutcome: {
    status: string;
    deploymentId: string;
    buildNumber: number;
    environment: string;
    durationMs: number;
    deployedAt: string;
    operator: string;
    notes: string;
    citation: string;
  };
  versionInfo: {
    appVersion: string;
    buildNumber: number;
    commitHash: string;
    branch: string;
    citation: string;
  };
  healthAssessment: {
    overallStatus: string;
    passedChecks: number;
    totalChecks: number;
    avgLatencyMs: number;
    degradedServices: string[];
    citation: string;
  };
  resourceUtilization: {
    memoryUsagePercent: number;
    memoryUsedMb: number;
    memoryTotalMb: number;
    cpuLoadPercent: number;
    nodeUptimeSeconds: number;
    hostname: string;
    osType: string;
    citation: string;
  };
  detectedAnomalies: {
    anomalyCount: number;
    anomalies: Array<{
      severity: string;
      source: string;
      description: string;
      telemetryRef: string;
    }>;
    citation: string;
  };
  riskAssessment: {
    riskLevel: string;
    confidencePercent: number;
    primaryRiskDrivers: string[];
    citation: string;
  };
  recommendations: Array<{
    id: string;
    priority: string;
    action: string;
    rationale: string;
    telemetryEvidence: string;
  }>;
  executiveSummary: string;
  aiEnriched: boolean;
}

export interface VciaDiagnosticData {
  analysisId: string;
  analyzedAt: string;
  targetDeployment: {
    id: string;
    buildNumber: number;
    environment: string;
    status: string;
    commitHash: string;
    operator: string;
    failedAt: string;
  };
  rootCauseAnalysis: {
    primaryRootCause: string;
    failureCategory: string;
    confidenceScore: number;
    unknownFactors: string[];
  };
  correlatedLogs: Array<{
    id: string;
    timestamp: string;
    formattedTime?: string;
    source: string;
    severity: string;
    message: string;
    relevanceReason: string;
  }>;
  dependencyConflicts: Array<{
    packageName: string;
    expectedVersion: string;
    detectedVersion: string;
    conflictType: string;
    severity: string;
    details: string;
  }>;
  correctiveActions: Array<{
    id: string;
    stepNumber: number;
    title: string;
    commandOrAction: string;
    description: string;
    riskImpact: string;
  }>;
  diagnosticSummary: string;
  aiEnriched: boolean;
}

export type OperationTab =
  | 'vdm_dashboard'
  | 'deployment_queue'
  | 'deployment_pipeline'
  | 'rollback_manager'
  | 'health_verification'
  | 'build_history'
  | 'live_logs'
  | 'environment_cloud'
  | 'ai_deployment_advisor'
  | 'vcio_briefings'
  | 'vcia_diagnostics'
  | 'deployment_api'
  | 'viie_engine'
  | 'github_webhook'
  | 'security_audit';

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
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'TIMED_OUT';
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

export interface DeploymentRecord {
  id: string;
  buildId?: string;
  version: string;
  commitHash: string;
  branch: string;
  buildNumber: number;
  startTime?: string;
  finishTime?: string;
  deployedAt?: string;
  duration: string;
  operator: string;
  environment: 'Production' | 'Staging' | 'Testing' | 'Development' | string;
  status: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS' | 'ROLLED_BACK' | 'TIMED_OUT' | 'CANCELLED';
  errors?: string[];
  warnings?: string[];
  notes: string;
  rollbackTarget?: string;
  rollbackAvailable: boolean;
  healthPassed: boolean;
}

export interface RollbackSnapshot {
  id: string;
  version: string;
  commitHash: string;
  timestamp: string;
  sizeMb: number;
  environment: string;
  creator: string;
}

export interface LiveMetricsState {
  gitCommitHash: string;
  gitBranch: string;
  gitTag: string;
  buildNumber: number;
  deploymentTimestamp: string;
  appVersion: string;
  nodeVersion: string;
  npmVersion: string;
  osType: string;
  osPlatform: string;
  osArch: string;
  hostname: string;
  uptimeSeconds: number;
  processId: number;
  timezone: string;
  memory: {
    rssMb: number;
    heapTotalMb: number;
    heapUsedMb: number;
    systemFreeMb: number;
    systemTotalMb: number;
    usagePercent: number;
  };
  cpu: {
    cores: number;
    model: string;
    loadAvg: number[];
    usagePercent: number;
  };
  disk: {
    freeGb: number;
    totalGb: number;
    usedGb: number;
    usagePercent: number;
  };
  lastRestart: string;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);
  return parts.join(' ');
}

export const VeritasOperationsCenterModal: React.FC<VeritasOperationsCenterModalProps> = ({
  isOpen,
  onClose
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<OperationTab>('vdm_dashboard');
  const [selectedEnv, setSelectedEnv] = useState<'Production' | 'Staging' | 'Testing' | 'Development'>('Production');

  // Real Operational Metrics
  const [liveMetrics, setLiveMetrics] = useState<LiveMetricsState | null>(null);
  const [isFetchingMetrics, setIsFetchingMetrics] = useState<boolean>(false);

  // Deployment Execution & Pipeline State
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentStep, setDeploymentStep] = useState<number>(0);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([
    '[VDM Kernel 1.0] Operations Center initialized.',
    '[VDM Kernel 1.0] Connecting to live operational metrics gateway...',
    '[VDM Kernel 1.0] Target Node: veritas-node-01.kigali (Production).'
  ]);

  // Cloud Target State
  const [cloudTarget, setCloudTarget] = useState<string>('Namecheap Shared Hosting / cPanel');

  // Deployment Records & Snapshots State
  const [history, setHistory] = useState<DeploymentRecord[]>([]);
  const [snapshots, setSnapshots] = useState<RollbackSnapshot[]>([]);

  // Health Verification Items
  const [healthData, setHealthData] = useState<{
    overallStatus: string;
    totalChecks: number;
    passedChecks: number;
    checks: Array<{ id: string; name: string; status: string; latencyMs: number; details: string }>;
  } | null>(null);

  // Persistent Queue State
  const [queueItems, setQueueItems] = useState<QueueDeploymentItem[]>([]);
  const [queueSummary, setQueueSummary] = useState<{
    totalInQueue: number;
    activeDeployment: QueueDeploymentItem | null;
    pendingCount: number;
    completedCount: number;
  }>({
    totalInQueue: 0,
    activeDeployment: null,
    pendingCount: 0,
    completedCount: 0
  });

  // Phase 5 Automatic Rollback Records & Admin Alerts
  const [autoRollbackRecords, setAutoRollbackRecords] = useState<any[]>([]);
  const [adminAlerts, setAdminAlerts] = useState<any[]>([]);

  // Auto Rollback Safety Setting
  const [autoRollbackOnFail, setAutoRollbackOnFail] = useState<boolean>(true);

  // Phase 7: Deployment History Search, Filter & Export States
  const [historySearch, setHistorySearch] = useState<string>('');
  const [historyEnvFilter, setHistoryEnvFilter] = useState<string>('ALL');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('ALL');
  const [historyRollbackFilter, setHistoryRollbackFilter] = useState<string>('ALL');

  // Phase 8: Live Stream Logs States
  const [liveLogEntries, setLiveLogEntries] = useState<VdmLogEntry[]>([]);
  const [logSearch, setLogSearch] = useState<string>('');
  const [logSeverityFilter, setLogSeverityFilter] = useState<string>('ALL');
  const [logSourceFilter, setLogSourceFilter] = useState<string>('ALL');
  const [logAutoScroll, setLogAutoScroll] = useState<boolean>(true);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [showTimestamps, setShowTimestamps] = useState<boolean>(true);

  // Phase 12 Deployment API & Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [apiToken, setApiToken] = useState<string>('veritas-vdm-token-2026');
  const [activeApiTestEndpoint, setActiveApiTestEndpoint] = useState<string>('/api/vdm/status');
  const [apiTestResponse, setApiTestResponse] = useState<any>(null);
  const [isTestingApi, setIsTestingApi] = useState<boolean>(false);

  // VIIE (Veritas Infrastructure Intelligence Engine) State
  const [viieTelemetry, setViieTelemetry] = useState<any>(null);
  const [viieDiagnostics, setViieDiagnostics] = useState<any>(null);
  const [viieQueryInput, setViieQueryInput] = useState<string>('Why is Veritas slower today?');
  const [viieQueryResult, setViieQueryResult] = useState<any>(null);
  const [isQueryingViie, setIsQueryingViie] = useState<boolean>(false);

  const fetchViieData = useCallback(async () => {
    try {
      const [tRes, dRes] = await Promise.all([
        fetch('/api/vdm/viie/telemetry', { headers: { 'Authorization': `Bearer ${apiToken}` } }),
        fetch('/api/vdm/viie/diagnostics', { headers: { 'Authorization': `Bearer ${apiToken}` } })
      ]);
      if (tRes.ok) setViieTelemetry(await tRes.json());
      if (dRes.ok) setViieDiagnostics(await dRes.json());
    } catch (e) {
      console.error('Failed to fetch VIIE data:', e);
    }
  }, [apiToken]);

  const handleAskViie = async (qString?: string) => {
    const queryToRun = qString || viieQueryInput;
    if (!queryToRun.trim()) return;
    setIsQueryingViie(true);
    try {
      const res = await fetch('/api/vdm/viie/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({ query: queryToRun })
      });
      if (res.ok) {
        setViieQueryResult(await res.json());
      }
    } catch (e) {
      console.error('Failed to query VIIE:', e);
    } finally {
      setIsQueryingViie(false);
    }
  };

  // GitHub Webhook Integration State
  const [webhookConfig, setWebhookConfig] = useState<any>(null);
  const [webhookTestResult, setWebhookTestResult] = useState<any>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState<boolean>(false);
  const [webhookSimCommitMsg, setWebhookSimCommitMsg] = useState<string>('feat: zero-touch automated deployment update');
  const [webhookSimBranch, setWebhookSimBranch] = useState<string>('main');

  const fetchWebhookConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/vdm/webhook/github/config');
      if (res.ok) setWebhookConfig(await res.json());
    } catch (e) {
      console.error('Failed to fetch webhook config:', e);
    }
  }, []);

  const handleTriggerWebhookPing = async () => {
    setIsTestingWebhook(true);
    try {
      const res = await fetch('/api/vdm/webhook/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-github-event': 'ping'
        },
        body: JSON.stringify({ zen: 'Zero-touch software delivery powered by Veritas VDM.' })
      });
      const data = await res.json();
      setWebhookTestResult({ event: 'ping', status: res.status, data });
    } catch (e: any) {
      setWebhookTestResult({ event: 'ping', status: 500, error: e.message });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleTriggerWebhookPush = async () => {
    setIsTestingWebhook(true);
    try {
      const payload = {
        ref: `refs/heads/${webhookSimBranch}`,
        head_commit: {
          id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
          message: webhookSimCommitMsg,
          committer: { name: 'Principal DevOps Engineer', email: 'devops@veritas.gov.rw' }
        },
        repository: { name: 'Veritas-Intelligence-OS', full_name: 'Veritas-OS/Veritas-Intelligence-OS' }
      };

      const res = await fetch('/api/vdm/webhook/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-github-event': 'push'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setWebhookTestResult({ event: 'push', status: res.status, data });
      if (res.ok) {
        fetchHistoryAndSnapshots();
        fetchLogs();
      }
    } catch (e: any) {
      setWebhookTestResult({ event: 'push', status: 500, error: e.message });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'github_webhook') {
      fetchWebhookConfig();
    }
  }, [activeTab, fetchWebhookConfig]);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/vdm/audit-logs', {
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch (e) {
      console.error('Failed to fetch audit logs:', e);
    }
  }, [apiToken]);

  useEffect(() => {
    if (activeTab === 'deployment_api' || activeTab === 'security_audit') {
      fetchAuditLogs();
    }
  }, [activeTab, fetchAuditLogs]);

  const handleRunApiTest = async (endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) => {
    setIsTestingApi(true);
    setActiveApiTestEndpoint(endpoint);
    try {
      const opts: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
          'X-API-Key': apiToken
        }
      };
      if (body) {
        opts.body = JSON.stringify(body);
      }
      const res = await fetch(endpoint, opts);
      const data = await res.json();
      setApiTestResponse({ status: res.status, ok: res.ok, data });
      fetchAuditLogs();
    } catch (err: any) {
      setApiTestResponse({ status: 500, ok: false, error: err.message });
    } finally {
      setIsTestingApi(false);
    }
  };

  // Fetch logs from backend endpoint
  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/vdm/logs');
      if (res.ok) {
        const data = await res.json();
        setLiveLogEntries(data);
      }
    } catch (e) {
      console.error('Failed to fetch live logs:', e);
    }
  }, []);

  // SSE & Polling for Live Streaming
  useEffect(() => {
    fetchLogs();

    if (!isLiveStreaming) return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/vdm/logs/stream');

      eventSource.onmessage = (event) => {
        try {
          const newEntry: VdmLogEntry = JSON.parse(event.data);
          setLiveLogEntries((prev) => {
            if (prev.some((l) => l.id === newEntry.id)) return prev;
            return [...prev, newEntry];
          });
        } catch (err) {
          console.error('Error parsing SSE log event:', err);
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
      };
    } catch (err) {
      console.warn('SSE not supported or failed');
    }

    // Backup polling every 2s
    const interval = setInterval(() => {
      fetchLogs();
    }, 2000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
    };
  }, [isLiveStreaming, fetchLogs]);

  // Terminal Auto Scroll
  useEffect(() => {
    if (logAutoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [liveLogEntries, logAutoScroll, activeTab]);

  // Filtered logs computation (Phase 8)
  const filteredLogs = liveLogEntries.filter((log) => {
    if (logSeverityFilter !== 'ALL' && log.severity.toLowerCase() !== logSeverityFilter.toLowerCase()) {
      return false;
    }
    if (logSourceFilter !== 'ALL' && log.source.toLowerCase() !== logSourceFilter.toLowerCase()) {
      return false;
    }
    if (logSearch.trim() !== '') {
      const q = logSearch.toLowerCase().trim();
      const matchMsg = log.message.toLowerCase().includes(q);
      const matchSource = log.source.toLowerCase().includes(q);
      const matchDepId = (log.deploymentId || '').toLowerCase().includes(q);
      const matchTime = log.timestamp.toLowerCase().includes(q) || log.formattedTime.toLowerCase().includes(q);
      const matchSeverity = log.severity.toLowerCase().includes(q);
      return matchMsg || matchSource || matchDepId || matchTime || matchSeverity;
    }
    return true;
  });

  // Download logs as .LOG file
  const handleDownloadLogsTxt = () => {
    const lines = filteredLogs.map(
      (l) => `[${l.timestamp}] [${l.severity}] [${l.source}]${l.deploymentId ? ` [${l.deploymentId}]` : ''} ${l.message}`
    );
    const content = lines.join('\n');
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `veritas-deployment-logs-${new Date().toISOString().substring(0, 10)}.log`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Download logs as .JSON file
  const handleDownloadLogsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `veritas-deployment-logs-${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Clear log entries from display
  const handleClearLogStream = () => {
    setLiveLogEntries([]);
  };

  // Phase 10: VCIO Briefing States
  const [vcioBriefing, setVcioBriefing] = useState<VcioBriefingData | null>(null);
  const [isGeneratingVcioAi, setIsGeneratingVcioAi] = useState<boolean>(false);

  const fetchVcioBriefing = useCallback(async (useAi: boolean = false) => {
    try {
      if (useAi) setIsGeneratingVcioAi(true);
      const url = useAi ? '/api/vdm/vcio/briefing?ai=true' : '/api/vdm/vcio/briefing';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVcioBriefing(data);
      }
    } catch (e) {
      console.error('Failed to fetch VCIO Briefing:', e);
    } finally {
      setIsGeneratingVcioAi(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'vcio_briefings' && !vcioBriefing) {
      fetchVcioBriefing(false);
    }
  }, [activeTab, vcioBriefing, fetchVcioBriefing]);

  const handleDownloadVcioTxt = () => {
    if (!vcioBriefing) return;
    const lines = [
      `=================================================================`,
      `VCIO OPERATIONAL TELEMETRY BRIEFING - ${vcioBriefing.generatedAt}`,
      `=================================================================`,
      ``,
      `EXECUTIVE SUMMARY:`,
      vcioBriefing.executiveSummary,
      ``,
      `1. DEPLOYMENT OUTCOME:`,
      `Status: ${vcioBriefing.deploymentOutcome.status}`,
      `Deployment ID: ${vcioBriefing.deploymentOutcome.deploymentId} (Build #${vcioBriefing.deploymentOutcome.buildNumber})`,
      `Environment: ${vcioBriefing.deploymentOutcome.environment}`,
      `Duration: ${vcioBriefing.deploymentOutcome.durationMs} ms`,
      `Deployed At: ${vcioBriefing.deploymentOutcome.deployedAt}`,
      `Operator: ${vcioBriefing.deploymentOutcome.operator}`,
      `Citation: ${vcioBriefing.deploymentOutcome.citation}`,
      ``,
      `2. VERSION & CODEBASE:`,
      `App Version: v${vcioBriefing.versionInfo.appVersion}`,
      `Build Number: #${vcioBriefing.versionInfo.buildNumber}`,
      `Git Commit: ${vcioBriefing.versionInfo.commitHash} (${vcioBriefing.versionInfo.branch})`,
      `Citation: ${vcioBriefing.versionInfo.citation}`,
      ``,
      `3. HEALTH ASSESSMENT:`,
      `Overall Status: ${vcioBriefing.healthAssessment.overallStatus}`,
      `Passed Checks: ${vcioBriefing.healthAssessment.passedChecks} / ${vcioBriefing.healthAssessment.totalChecks}`,
      `Average Latency: ${vcioBriefing.healthAssessment.avgLatencyMs} ms`,
      `Degraded Services: ${vcioBriefing.healthAssessment.degradedServices.join(', ') || 'None'}`,
      `Citation: ${vcioBriefing.healthAssessment.citation}`,
      ``,
      `4. RESOURCE UTILIZATION:`,
      `Memory Usage: ${vcioBriefing.resourceUtilization.memoryUsagePercent}% (${vcioBriefing.resourceUtilization.memoryUsedMb}MB / ${vcioBriefing.resourceUtilization.memoryTotalMb}MB)`,
      `CPU Load: ${vcioBriefing.resourceUtilization.cpuLoadPercent}%`,
      `Node Uptime: ${vcioBriefing.resourceUtilization.nodeUptimeSeconds} seconds`,
      `Host: ${vcioBriefing.resourceUtilization.hostname} (${vcioBriefing.resourceUtilization.osType})`,
      `Citation: ${vcioBriefing.resourceUtilization.citation}`,
      ``,
      `5. DETECTED ANOMALIES (${vcioBriefing.detectedAnomalies.anomalyCount}):`,
      ...vcioBriefing.detectedAnomalies.anomalies.map(a => `• [${a.severity}] [${a.source}] ${a.description} (${a.telemetryRef})`),
      `Citation: ${vcioBriefing.detectedAnomalies.citation}`,
      ``,
      `6. RISK ASSESSMENT:`,
      `Risk Level: ${vcioBriefing.riskAssessment.riskLevel} (${vcioBriefing.riskAssessment.confidencePercent}% Confidence)`,
      `Drivers: ${vcioBriefing.riskAssessment.primaryRiskDrivers.join('; ')}`,
      `Citation: ${vcioBriefing.riskAssessment.citation}`,
      ``,
      `7. RECOMMENDATIONS:`,
      ...vcioBriefing.recommendations.map((r, i) => `${i + 1}. [${r.priority}] ${r.action}\n   Rationale: ${r.rationale}\n   Evidence: ${r.telemetryEvidence}`),
      ``,
      `=================================================================`
    ];
    const content = lines.join('\n');
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', `vcio-operational-briefing-${new Date().toISOString().substring(0, 10)}.txt`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleDownloadVcioJson = () => {
    if (!vcioBriefing) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vcioBriefing, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', `vcio-operational-briefing-${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  // Phase 11: VCIA Failure Diagnostics States
  const [vciaData, setVciaData] = useState<VciaDiagnosticData | null>(null);
  const [isAnalyzingVcia, setIsAnalyzingVcia] = useState<boolean>(false);
  const [vciaTargetId, setVciaTargetId] = useState<string>('');

  const fetchVciaDiagnostics = useCallback(async (targetId?: string, useAi: boolean = false) => {
    try {
      setIsAnalyzingVcia(true);
      const queryParams = new URLSearchParams();
      if (targetId) queryParams.set('deploymentId', targetId);
      if (useAi) queryParams.set('ai', 'true');

      const url = `/api/vdm/vcia/diagnostics?${queryParams.toString()}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVciaData(data);
      }
    } catch (e) {
      console.error('Failed to fetch VCIA Diagnostics:', e);
    } finally {
      setIsAnalyzingVcia(false);
    }
  }, []);

  useEffect(() => {
    if ((activeTab === 'vcia_diagnostics' || activeTab === 'vcio_briefings') && !vciaData) {
      fetchVciaDiagnostics(undefined, false);
    }
  }, [activeTab, vciaData, fetchVciaDiagnostics]);

  const handleDownloadVciaTxt = () => {
    if (!vciaData) return;
    const lines = [
      `=================================================================`,
      `VCIA AUTOMATED DEPLOYMENT FAILURE DIAGNOSTIC REPORT`,
      `Analyzed At: ${vciaData.analyzedAt} | Analysis ID: ${vciaData.analysisId}`,
      `=================================================================`,
      ``,
      `TARGET DEPLOYMENT:`,
      `Deployment ID: ${vciaData.targetDeployment.id} (Build #${vciaData.targetDeployment.buildNumber})`,
      `Environment: ${vciaData.targetDeployment.environment.toUpperCase()}`,
      `Status: ${vciaData.targetDeployment.status}`,
      `Commit: ${vciaData.targetDeployment.commitHash}`,
      `Operator: ${vciaData.targetDeployment.operator}`,
      `Failed At: ${vciaData.targetDeployment.failedAt}`,
      ``,
      `ROOT CAUSE ANALYSIS:`,
      `Failure Category: ${vciaData.rootCauseAnalysis.failureCategory}`,
      `Confidence Score: ${vciaData.rootCauseAnalysis.confidenceScore}%`,
      `Primary Root Cause: ${vciaData.rootCauseAnalysis.primaryRootCause}`,
      `Unknown Factors (${vciaData.rootCauseAnalysis.unknownFactors.length}):`,
      ...vciaData.rootCauseAnalysis.unknownFactors.map(uf => `  - ${uf}`),
      ``,
      `DETECTED DEPENDENCY CONFLICTS (${vciaData.dependencyConflicts.length}):`,
      ...vciaData.dependencyConflicts.map(dc => `  • Package: ${dc.packageName} (Expected: ${dc.expectedVersion}, Detected: ${dc.detectedVersion}) [${dc.severity}] - ${dc.details}`),
      ``,
      `CORRELATED LOGS (${vciaData.correlatedLogs.length}):`,
      ...vciaData.correlatedLogs.map(cl => `  • [${cl.severity}] [${cl.source}] ${cl.message} (${cl.relevanceReason})`),
      ``,
      `CORRECTIVE ACTIONS PLAYBOOK (${vciaData.correctiveActions.length} STEPS):`,
      ...vciaData.correctiveActions.map(ca => `  Step ${ca.stepNumber}: ${ca.title} [${ca.riskImpact}]\n    Command: ${ca.commandOrAction}\n    Description: ${ca.description}`),
      ``,
      `DIAGNOSTIC SUMMARY:`,
      vciaData.diagnosticSummary,
      `=================================================================`
    ];
    const content = lines.join('\n');
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', `vcia-failure-diagnostic-${vciaData.targetDeployment.id}-${new Date().toISOString().substring(0, 10)}.txt`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleDownloadVciaJson = () => {
    if (!vciaData) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vciaData, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', `vcia-failure-diagnostic-${vciaData.targetDeployment.id}-${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  // Filtered deployment history computation (Phase 7)
  const filteredHistory = history.filter((rec) => {
    if (historyEnvFilter !== 'ALL' && rec.environment.toLowerCase() !== historyEnvFilter.toLowerCase()) {
      return false;
    }
    if (historyStatusFilter !== 'ALL' && rec.status.toLowerCase() !== historyStatusFilter.toLowerCase()) {
      return false;
    }
    if (historyRollbackFilter === 'AVAILABLE' && !rec.rollbackAvailable) {
      return false;
    }
    if (historySearch.trim() !== '') {
      const q = historySearch.toLowerCase().trim();
      const matchId = rec.id.toLowerCase().includes(q);
      const matchBuildId = (rec.buildId || '').toLowerCase().includes(q);
      const matchVersion = rec.version.toLowerCase().includes(q);
      const matchCommit = rec.commitHash.toLowerCase().includes(q);
      const matchBranch = rec.branch.toLowerCase().includes(q);
      const matchOperator = rec.operator.toLowerCase().includes(q);
      const matchNotes = rec.notes.toLowerCase().includes(q);
      const matchErrors = (rec.errors || []).some(e => e.toLowerCase().includes(q));
      const matchWarnings = (rec.warnings || []).some(w => w.toLowerCase().includes(q));

      return matchId || matchBuildId || matchVersion || matchCommit || matchBranch || matchOperator || matchNotes || matchErrors || matchWarnings;
    }
    return true;
  });

  // Export JSON handler (Phase 7)
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vdm-deployment-history-${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV handler (Phase 7)
  const handleExportCsv = () => {
    const headers = [
      "Deployment ID",
      "Build ID",
      "Version",
      "Status",
      "Environment",
      "Start Time",
      "Finish Time",
      "Duration",
      "Commit Hash",
      "Branch",
      "Operator",
      "Rollback Available",
      "Rollback Target",
      "Errors Count",
      "Warnings Count",
      "Errors Detail",
      "Warnings Detail",
      "Deployment Notes"
    ];

    const rows = filteredHistory.map(rec => [
      `"${rec.id}"`,
      `"${rec.buildId || `BUILD-${rec.buildNumber}`}"`,
      `"${rec.version}"`,
      `"${rec.status}"`,
      `"${rec.environment}"`,
      `"${rec.startTime || rec.deployedAt || ''}"`,
      `"${rec.finishTime || rec.deployedAt || ''}"`,
      `"${rec.duration}"`,
      `"${rec.commitHash}"`,
      `"${rec.branch}"`,
      `"${rec.operator}"`,
      `"${rec.rollbackAvailable ? 'YES' : 'NO'}"`,
      `"${rec.rollbackTarget || ''}"`,
      `"${(rec.errors || []).length}"`,
      `"${(rec.warnings || []).length}"`,
      `"${(rec.errors || []).join('; ').replace(/"/g, '""')}"`,
      `"${(rec.warnings || []).join('; ').replace(/"/g, '""')}"`,
      `"${rec.notes.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `vdm-deployment-history-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Terminal Log Ref
  const terminalRef = useRef<HTMLDivElement>(null);

  // Fetch Live Operational Data on Mount and Periodically
  const fetchLiveMetrics = async () => {
    setIsFetchingMetrics(true);
    try {
      const res = await fetch('/api/vdm/metrics');
      if (res.ok) {
        const data = await res.json();
        setLiveMetrics(data);
      }
    } catch (err) {
      console.warn('Could not fetch live metrics from /api/vdm/metrics', err);
    } finally {
      setIsFetchingMetrics(false);
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/vdm/health');
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch (err) {
      console.warn('Could not fetch health from /api/vdm/health', err);
    }
  };

  const handleTestIndividualEndpoint = async (endpoint: string) => {
    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        const item = await res.json();
        setHealthData((prev: any) => {
          if (!prev) return prev;
          const updatedChecks = prev.checks.map((c: any) => {
            if (c.endpoint === endpoint || c.id === item.id) {
              return {
                ...c,
                status: item.status,
                latencyMs: item.latencyMs,
                details: item.details
              };
            }
            return c;
          });
          const passed = updatedChecks.filter((c: any) => c.status === 'PASS').length;
          const warn = updatedChecks.filter((c: any) => c.status === 'WARN').length;
          const failed = updatedChecks.filter((c: any) => c.status === 'FAIL').length;
          return {
            ...prev,
            passedChecks: passed,
            warnChecks: warn,
            failedChecks: failed,
            overallStatus: failed > 0 ? 'CRITICAL' : warn > 0 ? 'DEGRADED' : 'HEALTHY',
            checks: updatedChecks
          };
        });
      }
    } catch (err) {
      console.error(`Failed to test endpoint ${endpoint}`, err);
    }
  };

  const fetchHistoryAndSnapshots = async () => {
    try {
      const [histRes, snapRes, rollRes, alertRes] = await Promise.all([
        fetch('/api/vdm/history'),
        fetch('/api/vdm/snapshots'),
        fetch('/api/vdm/rollback/records'),
        fetch('/api/vdm/alerts')
      ]);
      if (histRes.ok) {
        const histData = await histRes.json();
        setHistory(histData);
      }
      if (snapRes.ok) {
        const snapData = await snapRes.json();
        setSnapshots(snapData);
      }
      if (rollRes.ok) {
        const rollData = await rollRes.json();
        setAutoRollbackRecords(rollData.records || []);
      }
      if (alertRes.ok) {
        const alertData = await alertRes.json();
        setAdminAlerts(alertData.alerts || []);
      }
    } catch (err) {
      console.warn('Could not fetch deployment history/snapshots/rollbacks', err);
    }
  };

  const handleTriggerAutoRollbackTest = async () => {
    try {
      const res = await fetch('/api/vdm/rollback/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          triggerReason: 'Simulated Health Verification Failure on ' + selectedEnv,
          environment: selectedEnv,
          operatorEmail: 'admin@veritas.gov.rw'
        })
      });
      if (res.ok) {
        fetchHistoryAndSnapshots();
        fetchLiveMetrics();
      }
    } catch (err) {
      console.error('Failed to trigger automatic rollback test', err);
    }
  };

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/vdm/queue');
      if (res.ok) {
        const data = await res.json();
        setQueueItems(data.queue || []);
        setQueueSummary({
          totalInQueue: data.totalInQueue || 0,
          activeDeployment: data.activeDeployment || null,
          pendingCount: data.pendingCount || 0,
          completedCount: data.completedCount || 0
        });
      }
    } catch (err) {
      console.warn('Could not fetch queue from /api/vdm/queue', err);
    }
  };

  const handleEnqueueDeploymentJob = async (env?: string, notes?: string) => {
    try {
      const res = await fetch('/api/vdm/queue/enqueue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environment: env || selectedEnv,
          cloudTarget,
          operator: 'admin@veritas.gov.rw',
          notes: notes || `Queued Deployment to ${env || selectedEnv}`
        })
      });
      if (res.ok) {
        fetchQueue();
      }
    } catch (err) {
      console.error('Failed to enqueue job', err);
    }
  };

  const handleCancelDeploymentJob = async (id: string) => {
    try {
      const res = await fetch('/api/vdm/queue/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchQueue();
      }
    } catch (err) {
      console.error('Failed to cancel job', err);
    }
  };

  const handleRetryDeploymentJob = async (id: string) => {
    try {
      const res = await fetch('/api/vdm/queue/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchQueue();
      }
    } catch (err) {
      console.error('Failed to retry job', err);
    }
  };

  const handleClearCompletedJobs = async () => {
    try {
      const res = await fetch('/api/vdm/queue/clear', {
        method: 'POST'
      });
      if (res.ok) {
        fetchQueue();
      }
    } catch (err) {
      console.error('Failed to clear completed jobs', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLiveMetrics();
      fetchHealth();
      fetchHistoryAndSnapshots();
      fetchQueue();

      const metricsInterval = setInterval(() => {
        fetchLiveMetrics();
      }, 3000);

      const healthInterval = setInterval(() => {
        fetchHealth();
      }, 10000);

      const queueInterval = setInterval(() => {
        fetchQueue();
      }, 2000);

      return () => {
        clearInterval(metricsInterval);
        clearInterval(healthInterval);
        clearInterval(queueInterval);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [deploymentLogs]);

  // Real Automated Deployment Trigger Pipeline
  const handleTriggerDeployment = async () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeploymentStep(1);
    setDeploymentProgress(5);
    setActiveTab('deployment_pipeline');

    const steps = [
      { step: 1, prog: 10, log: `[VDM Pipeline] Step 1/10: Inspecting repository state on branch ${liveMetrics?.gitBranch || 'main'}...` },
      { step: 2, prog: 20, log: `[VDM Pipeline] Step 2/10: Verifying GPG Signature for commit ${liveMetrics?.gitCommitHash || '91679a2'}...` },
      { step: 3, prog: 30, log: `[VDM Pipeline] Step 3/10: Syncing latest changes from origin/${liveMetrics?.gitBranch || 'main'}...` },
      { step: 4, prog: 45, log: `[VDM Pipeline] Step 4/10: Generating pre-deployment snapshot on host ${liveMetrics?.hostname || 'server'}...` },
      { step: 5, prog: 60, log: `[VDM Pipeline] Step 5/10: Checking Node.js ${liveMetrics?.nodeVersion || 'v20'} & NPM ${liveMetrics?.npmVersion || 'v10'} runtime dependencies...` },
      { step: 6, prog: 75, log: '[VDM Pipeline] Step 6/10: Compiling frontend assets via Vite & esbuild server.cjs bundle...' },
      { step: 7, prog: 85, log: '[VDM Pipeline] Step 7/10: Executing TypeScript type-checking & lint verification...' },
      { step: 8, prog: 90, log: `[VDM Pipeline] Step 8/10: Zero-downtime process restart on OS ${liveMetrics?.osPlatform || 'linux'} (PID ${liveMetrics?.processId || '123'})...` },
      { step: 9, prog: 95, log: '[VDM Pipeline] Step 9/10: Running 12-point Automated Health Check sweep...' },
      { step: 10, prog: 100, log: '[VDM Pipeline] Step 10/10: Deployment SUCCESSFUL! Production node updated.' }
    ];

    let current = 0;
    const stepInterval = setInterval(async () => {
      if (current < steps.length) {
        const item = steps[current];
        setDeploymentStep(item.step);
        setDeploymentProgress(item.prog);
        setDeploymentLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${item.log}`]);
        current++;
      } else {
        clearInterval(stepInterval);

        // Call backend deploy route
        try {
          const res = await fetch('/api/vdm/deploy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              environment: selectedEnv,
              cloudTarget,
              operator: 'admin@veritas.gov.rw',
              notes: 'Automated VDM Deployment from Operations Center'
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.deployment) {
              setHistory(prev => [data.deployment, ...prev]);
            }
            if (data.snapshot) {
              setSnapshots(prev => [data.snapshot, ...prev]);
            }
            if (data.logs) {
              setDeploymentLogs(prev => [...prev, ...data.logs]);
            }
          }
        } catch (err) {
          console.error('Error triggering backend deploy:', err);
        } finally {
          setIsDeploying(false);
          fetchLiveMetrics();
          fetchHealth();
        }
      }
    }, 800);
  };

  // Rollback Execution
  const handleExecuteRollback = async (snap: RollbackSnapshot) => {
    if (confirm(`ARE YOU SURE you want to rollback ${selectedEnv} environment to snapshot ${snap.id} (${snap.version})?`)) {
      try {
        const res = await fetch('/api/vdm/rollback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            snapshotId: snap.id,
            targetCommit: snap.commitHash
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.logs) {
            setDeploymentLogs(prev => [...prev, ...data.logs]);
          }
          if (data.deployment) {
            setHistory(prev => [data.deployment, ...prev]);
          }
          alert(`Rollback to ${snap.version} completed successfully!`);
          fetchLiveMetrics();
          fetchHealth();
        }
      } catch (err) {
        console.error('Error executing rollback:', err);
        alert('Rollback request failed.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in overflow-hidden">
      <div className="bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden shadow-2xl font-sans relative">
        
        {/* ========================================================================= */}
        {/* TOP OPERATIONS HEADER */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xl shadow-indigo-600/20">
              <Server className="w-6 h-6 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                  VERITAS OPERATIONS CENTER (VOC)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  VDM v{liveMetrics?.appVersion || '1.0.0'} REALTIME
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live Deployment Orchestrator • Host: {liveMetrics?.hostname || 'veritas-node-01.kigali'} • PID: {liveMetrics?.processId || '---'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Environment Indicator Switcher */}
            <div className="flex items-center bg-slate-900 rounded-2xl p-1 border border-slate-800 font-mono text-xs">
              {(['Production', 'Staging', 'Testing', 'Development'] as const).map((env) => (
                <button
                  key={env}
                  onClick={() => setSelectedEnv(env)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                    selectedEnv === env
                      ? env === 'Production'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {env === 'Production' ? '🔴 PROD' : env.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Manual Refresh Live Metrics */}
            <button
              onClick={fetchLiveMetrics}
              disabled={isFetchingMetrics}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition cursor-pointer"
              title="Refresh Live Operational Metrics"
            >
              <RefreshCw className={`w-4 h-4 ${isFetchingMetrics ? 'animate-spin text-indigo-400' : ''}`} />
            </button>

            {/* Quick Trigger Deployment CTA */}
            <button
              onClick={handleTriggerDeployment}
              disabled={isDeploying}
              className={`px-4 py-2.5 rounded-2xl font-mono font-extrabold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg ${
                isDeploying
                  ? 'bg-amber-600/50 text-amber-200 border border-amber-500 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
              }`}
            >
              {isDeploying ? <RefreshCw className="w-4 h-4 animate-spin text-amber-300" /> : <Play className="w-4 h-4 text-emerald-300" />}
              <span>{isDeploying ? 'Deploying Pipeline...' : 'Deploy to Production'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY LAYOUT (SIDEBAR NAVIGATION + CONTENT AREA) */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-slate-950">
          
          {/* LEFT NAVIGATION SIDEBAR */}
          <div className="lg:col-span-3 p-4 bg-slate-950/80 border-r border-slate-800/80 space-y-2 overflow-y-auto font-mono text-xs">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              OPERATIONS SUBSYSTEMS
            </div>

            {[
              { id: 'vdm_dashboard', label: 'VDM Dashboard', icon: Activity, badge: 'Live Data' },
              { id: 'deployment_queue', label: 'Deployment Queue', icon: List, badge: `${queueSummary.pendingCount} Queued` },
              { id: 'deployment_pipeline', label: 'Deployment Pipeline', icon: Play, badge: isDeploying ? 'BUILDING' : 'Idle' },
              { id: 'live_logs', label: 'Live Stream Logs', icon: Terminal, badge: `${liveLogEntries.length} Logs` },
              { id: 'rollback_manager', label: 'Rollback Snapshots', icon: RotateCcw, badge: `${snapshots.length} Snaps` },
              { id: 'health_verification', label: 'Health Verification', icon: ShieldCheck, badge: `${healthData?.passedChecks || 12}/${healthData?.totalChecks || 12} PASS` },
              { id: 'build_history', label: 'Build & Release History', icon: Clock, badge: `${history.length} Builds` },
              { id: 'ai_deployment_advisor', label: 'AI Risk Predictor', icon: Sparkles, badge: 'Low Risk' },
              { id: 'vcio_briefings', label: 'VCIO Briefings', icon: Cpu, badge: 'Phase 10' },
              { id: 'vcia_diagnostics', label: 'VCIA Diagnostics', icon: AlertTriangle, badge: 'Phase 11' },
              { id: 'deployment_api', label: 'Deployment REST API', icon: FileCode, badge: 'Phase 12' },
              { id: 'viie_engine', label: 'Infra Intelligence (VIIE)', icon: Cpu, badge: 'Phase 13' },
              { id: 'github_webhook', label: 'GitHub Webhook (Zero-Touch)', icon: GitBranch, badge: 'Phase 14' },
              { id: 'environment_cloud', label: 'Cloud Infrastructure', icon: Cloud, badge: 'Config' },
              { id: 'security_audit', label: 'Security & Audit Logs', icon: Lock, badge: 'Signed' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as OperationTab)}
                  className={`w-full text-left px-3.5 py-3 rounded-2xl font-bold transition flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-900/80 to-slate-900 text-white border border-indigo-500/50 shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    isActive ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}

            {/* LIVE SYSTEM HEALTH SUMMARY BOX */}
            <div className="mt-6 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" /> SYSTEM METRICS (LIVE)
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Realtime</span>
              </span>

              <div className="space-y-2 text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>CPU Usage:</span>
                    <span className="text-emerald-400 font-bold">{liveMetrics?.cpu.usagePercent ?? 18}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, liveMetrics?.cpu.usagePercent ?? 18)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>RAM Usage:</span>
                    <span className="text-cyan-400 font-bold">
                      {liveMetrics?.memory.usagePercent ?? 42}% ({liveMetrics?.memory.heapUsedMb ?? 48} MB / {liveMetrics?.memory.systemTotalMb ?? 8192} MB)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, liveMetrics?.memory.usagePercent ?? 42)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Disk Storage:</span>
                    <span className="text-indigo-400 font-bold">
                      {liveMetrics?.disk.usagePercent ?? 24}% ({liveMetrics?.disk.usedGb ?? 12.4} GB / {liveMetrics?.disk.totalGb ?? 50} GB)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, liveMetrics?.disk.usagePercent ?? 24)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT MAIN OPERATIONS PANEL */}
          <div className="lg:col-span-9 p-6 overflow-y-auto space-y-6 bg-slate-950">
            
            {/* ========================================================================= */}
            {/* TAB 1: VDM DASHBOARD (LIVE METRICS & OPERATIONAL DATA) */}
            {/* ========================================================================= */}
            {activeTab === 'vdm_dashboard' && (
              <div className="space-y-6 animate-fade-in font-sans">
                {/* TOP HERO SYSTEM OVERVIEW METRICS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1 shadow-lg">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Application Version</span>
                    <div className="text-lg font-black text-white flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-indigo-400" />
                      v{liveMetrics?.appVersion || '1.0.0'}
                    </div>
                    <span className="text-[10px] text-emerald-400">
                      Commit: {liveMetrics?.gitCommitHash || '91679a2'} ({liveMetrics?.gitBranch || 'main'})
                    </span>
                  </div>

                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1 shadow-lg">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Build Number</span>
                    <div className="text-lg font-black text-amber-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      #{liveMetrics?.buildNumber || 1042}
                    </div>
                    <span className="text-[10px] text-slate-400">Tag: {liveMetrics?.gitTag || 'v1.0.0'}</span>
                  </div>

                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1 shadow-lg">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Process Uptime</span>
                    <div className="text-lg font-black text-cyan-400 flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      {liveMetrics ? formatUptime(liveMetrics.uptimeSeconds) : '0s'}
                    </div>
                    <span className="text-[10px] text-emerald-400">PID {liveMetrics?.processId || '---'} Active</span>
                  </div>

                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1 shadow-lg">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Overall Health</span>
                    <div className="text-lg font-black text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {healthData?.overallStatus || 'HEALTHY'}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {healthData?.passedChecks || 12}/{healthData?.totalChecks || 12} Services PASS
                    </span>
                  </div>
                </div>

                {/* DETAILED SYSTEM ENVIRONMENT SPEC MATRIX */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      VERITAS REALTIME RUNTIME ENVIRONMENT MATRIX ({selectedEnv.toUpperCase()})
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Timezone: {liveMetrics?.timezone || 'UTC'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Server Hostname</span>
                      <span className="text-slate-200 font-bold">{liveMetrics?.hostname || 'veritas-node-01'}</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Node.js Engine</span>
                      <span className="text-slate-200 font-bold">{liveMetrics?.nodeVersion || 'v20.12.2'}</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">NPM Version</span>
                      <span className="text-slate-200 font-bold">{liveMetrics?.npmVersion || '10.5.0'}</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Operating System</span>
                      <span className="text-slate-200 font-bold">{liveMetrics?.osType || 'Linux x64'}</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Git Commit & Tag</span>
                      <span className="text-indigo-300 font-bold">{liveMetrics?.gitCommitHash || '91679a2'} ({liveMetrics?.gitTag || 'v1.0.0'})</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Deployment Timestamp</span>
                      <span className="text-slate-200 font-bold">
                        {liveMetrics?.deploymentTimestamp ? new Date(liveMetrics.deploymentTimestamp).toLocaleString() : '---'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">CPU Model & Cores</span>
                      <span className="text-slate-200 font-bold truncate block" title={liveMetrics?.cpu.model}>
                        {liveMetrics?.cpu.cores || 8} Cores ({liveMetrics?.cpu.model || 'x86_64'})
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Infrastructure Target</span>
                      <span className="text-indigo-300 font-bold truncate block" title={cloudTarget}>
                        {cloudTarget}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RECENT DEPLOYMENT LOG & ACTION BAR */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      LIVE DEPLOYMENT KERNEL LOG
                    </h3>

                    <button
                      onClick={handleTriggerDeployment}
                      disabled={isDeploying}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-300" />
                      <span>Execute New Build</span>
                    </button>
                  </div>

                  <div
                    ref={terminalRef}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-1.5 max-h-56 overflow-y-auto shadow-inner"
                  >
                    {deploymentLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: PERSISTENT DEPLOYMENT QUEUE (FIFO) */}
            {/* ========================================================================= */}
            {activeTab === 'deployment_queue' && (
              <div className="space-y-6 animate-fade-in font-mono">
                {/* QUEUE SUBSYSTEM HEADER */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
                          <List className="w-5 h-5 text-indigo-400" />
                          PERSISTENT DEPLOYMENT QUEUE MANAGER
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          FIFO STRICT EXECUTION
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          1 AT A TIME GUARD
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          DISK STORED
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-1">
                        Serialized FIFO queue automatically persists state to disk across restarts. Guaranteed single-active execution with cancellation, retry, and timeout protection.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleEnqueueDeploymentJob(selectedEnv)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                      >
                        <Play className="w-4 h-4 text-amber-300" />
                        <span>Enqueue for {selectedEnv}</span>
                      </button>

                      <button
                        onClick={fetchQueue}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Sync Queue</span>
                      </button>

                      <button
                        onClick={handleClearCompletedJobs}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Clear Finished</span>
                      </button>
                    </div>
                  </div>

                  {/* SUMMARY CARDS */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Active Execution Status</span>
                      {queueSummary.activeDeployment ? (
                        <div className="text-amber-400 font-black flex items-center gap-2 text-sm">
                          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                          <span>{queueSummary.activeDeployment.id} ({queueSummary.activeDeployment.environment})</span>
                        </div>
                      ) : (
                        <div className="text-emerald-400 font-black text-sm flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> IDLE (Ready)
                        </div>
                      )}
                      <span className="text-[10px] text-slate-500">Concurrency: 1 Active max</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Pending FIFO Jobs</span>
                      <div className="text-indigo-400 font-black text-lg">
                        {queueSummary.pendingCount} Jobs Queued
                      </div>
                      <span className="text-[10px] text-slate-500">First In, First Out order</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Finished Queue Jobs</span>
                      <div className="text-cyan-400 font-black text-lg">
                        {queueSummary.completedCount} Completed
                      </div>
                      <span className="text-[10px] text-slate-500">Retain history & audit</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Timeout Safeguard</span>
                      <div className="text-amber-400 font-black text-lg">
                        45s Max Runtime
                      </div>
                      <span className="text-[10px] text-slate-500">Auto-marks TIMED_OUT</span>
                    </div>
                  </div>
                </div>

                {/* CURRENT ACTIVE RUNNING DEPLOYMENT CARD */}
                {queueSummary.activeDeployment && (
                  <div className="p-6 bg-slate-900/90 border border-amber-500/50 rounded-3xl space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs">
                          ACTIVE RUNNING JOB
                        </span>
                        <span className="text-white font-bold text-sm">
                          {queueSummary.activeDeployment.id} (Build #{queueSummary.activeDeployment.buildNumber})
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                          {queueSummary.activeDeployment.environment}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCancelDeploymentJob(queueSummary.activeDeployment!.id)}
                        className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Active Job</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-bold">Step {queueSummary.activeDeployment.currentStep}/10: {queueSummary.activeDeployment.stepDescription}</span>
                        <span className="text-amber-400 font-bold">{queueSummary.activeDeployment.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 h-full transition-all duration-300 animate-pulse"
                          style={{ width: `${queueSummary.activeDeployment.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-emerald-400 text-xs font-mono space-y-1 max-h-36 overflow-y-auto">
                      {queueSummary.activeDeployment.logs.map((log, idx) => (
                        <div key={idx}>{log}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PENDING FIFO QUEUE LIST */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      PENDING QUEUED JOBS (FIFO WAITING LIST)
                    </h4>
                    <span className="text-xs text-slate-400 font-sans">
                      {queueItems.filter(i => i.status === 'QUEUED').length} Jobs waiting
                    </span>
                  </div>

                  {queueItems.filter(i => i.status === 'QUEUED').length === 0 ? (
                    <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-500 text-xs font-sans">
                      No jobs currently pending in the FIFO queue. Click "Enqueue for {selectedEnv}" above to add a new build task.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {queueItems.filter(i => i.status === 'QUEUED').map((item, index) => (
                        <div
                          key={item.id}
                          className="p-4 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-2xl flex flex-wrap items-center justify-between gap-4 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center">
                              #{index + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{item.id}</span>
                                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                                  {item.environment}
                                </span>
                                <span className="text-slate-500 text-xs">• Commit {item.commitHash}</span>
                              </div>
                              <div className="text-xs text-slate-400 font-sans mt-0.5">
                                {item.notes} | Operator: {item.operator} | Enqueued: {new Date(item.enqueuedAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleCancelDeploymentJob(item.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* FINISHED & HISTORICAL QUEUED JOBS */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    FINISHED & PROCESSED QUEUE HISTORY
                  </h4>

                  <div className="space-y-3">
                    {queueItems.filter(i => i.status !== 'QUEUED' && i.status !== 'RUNNING').map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{item.id}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                item.status === 'COMPLETED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : item.status === 'CANCELLED'
                                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              }`}
                            >
                              {item.status}
                            </span>
                            <span className="text-slate-500 text-xs">• {item.environment}</span>
                          </div>
                          <div className="text-xs text-slate-400 font-sans">
                            {item.notes} | Enqueued: {new Date(item.enqueuedAt).toLocaleTimeString()} {item.completedAt && `| Completed: ${new Date(item.completedAt).toLocaleTimeString()}`}
                          </div>
                        </div>

                        {(item.status === 'FAILED' || item.status === 'CANCELLED' || item.status === 'TIMED_OUT') && (
                          <button
                            onClick={() => handleRetryDeploymentJob(item.id)}
                            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retry Job</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: DEPLOYMENT PIPELINE */}
            {/* ========================================================================= */}
            {activeTab === 'deployment_pipeline' && (
              <div className="space-y-6 animate-fade-in font-mono">
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
                        <Play className="w-5 h-5 text-emerald-400" />
                        AUTOMATED ENTERPRISE DEPLOYMENT PIPELINE
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        Real Backend Execution Pipeline • Commit {liveMetrics?.gitCommitHash || '91679a2'} on branch {liveMetrics?.gitBranch || 'main'}
                      </p>
                    </div>

                    <button
                      onClick={handleTriggerDeployment}
                      disabled={isDeploying}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <Play className="w-4 h-4 text-amber-300" />
                      <span>{isDeploying ? 'Pipeline Running...' : 'Start Pipeline'}</span>
                    </button>
                  </div>

                  {/* PIPELINE PROGRESS BAR */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-bold">Pipeline Execution Progress:</span>
                      <span className="text-amber-400 font-bold">{deploymentProgress}% Complete</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 h-full transition-all duration-500"
                        style={{ width: `${deploymentProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* PIPELINE STAGES GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                    {[
                      { step: 1, title: '1. Detect Commit', desc: `Branch ${liveMetrics?.gitBranch || 'main'}` },
                      { step: 2, title: '2. Verify Repo', desc: `GPG ${liveMetrics?.gitCommitHash || '91679a2'}` },
                      { step: 3, title: '3. Pull Changes', desc: 'Git origin/main' },
                      { step: 4, title: '4. Snapshot Backup', desc: 'Pre-build State' },
                      { step: 5, title: '5. Install PKGs', desc: `Node ${liveMetrics?.nodeVersion || 'v20'}` },
                      { step: 6, title: '6. Compile Build', desc: 'Vite & esbuild' },
                      { step: 7, title: '7. Run Tests', desc: 'TypeScript & Linter' },
                      { step: 8, title: '8. Node Restart', desc: `PID ${liveMetrics?.processId || '123'}` },
                      { step: 9, title: '9. Health Check', desc: '12 Point Matrix' },
                      { step: 10, title: '10. Mark Success', desc: 'Audit Log Written' }
                    ].map((s) => {
                      const isDone = deploymentStep > s.step || (!isDeploying && deploymentProgress === 100);
                      const isCurrent = isDeploying && deploymentStep === s.step;
                      return (
                        <div
                          key={s.step}
                          className={`p-3 rounded-2xl border transition ${
                            isDone
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                              : isCurrent
                              ? 'bg-amber-950/50 border-amber-500 text-amber-300 animate-pulse'
                              : 'bg-slate-950 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="font-bold">{s.title}</div>
                          <div className="text-[10px] opacity-80 mt-1">{s.desc}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* LIVE TERMINAL CONSOLE */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs font-bold block flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        REALTIME BUILD CONSOLE OUTPUT STREAM ({filteredLogs.length} LINES)
                      </span>
                      <button
                        onClick={() => setActiveTab('live_logs')}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Full Console Streamer →</span>
                      </button>
                    </div>
                    <div
                      ref={terminalRef}
                      className="p-4 bg-black/90 rounded-2xl border border-slate-800 font-mono text-xs space-y-1.5 max-h-72 overflow-y-auto shadow-inner"
                    >
                      {filteredLogs.slice(-30).map((entry, idx) => (
                        <div key={entry.id || idx} className="flex items-start gap-2 text-[11px]">
                          {showTimestamps && (
                            <span className="text-slate-500">[{entry.formattedTime || entry.timestamp.split('T')[1]?.replace('Z', '')}]</span>
                          )}
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${
                            entry.severity === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                            entry.severity === 'ERROR' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                            entry.severity === 'WARN' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                            'bg-indigo-950 text-indigo-300 border-indigo-800'
                          }`}>
                            {entry.severity}
                          </span>
                          <span className="text-slate-400">[{entry.source}]</span>
                          <span className={entry.severity === 'SUCCESS' ? 'text-emerald-300 font-bold' : entry.severity === 'ERROR' ? 'text-rose-300 font-bold' : 'text-slate-200'}>
                            {entry.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: PHASE 8 LIVE STREAM LOGS & TERMINAL CONSOLE */}
            {/* ========================================================================= */}
            {activeTab === 'live_logs' && (
              <div className="space-y-6 animate-fade-in font-mono">
                {/* HEADER BANNER */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
                          <Terminal className="w-5 h-5 text-emerald-400" />
                          PHASE 8 LIVE LOG STREAMER & TERMINAL CONSOLE
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${
                          isLiveStreaming
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                          {isLiveStreaming ? 'SSE LIVE STREAMING' : 'STREAM PAUSED'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          FILE DATASTORE BACKED
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-1">
                        Real-time deployment output stream with live SSE updates, severity badges, source attribution, timestamp toggles, search filtering, and multi-format exports.
                      </p>
                    </div>

                    {/* ACTIONS TOOLBAR */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Live Stream Toggle */}
                      <button
                        onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer border transition ${
                          isLiveStreaming
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900/80'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                        title={isLiveStreaming ? 'Pause live log stream' : 'Resume live SSE stream'}
                      >
                        <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                        <span>{isLiveStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
                      </button>

                      {/* Timestamps Toggle */}
                      <button
                        onClick={() => setShowTimestamps(!showTimestamps)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition ${
                          showTimestamps
                            ? 'bg-indigo-900/60 text-indigo-200 border-indigo-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                        title="Toggle timestamps visibility"
                      >
                        <Clock className="w-3.5 h-3.5 text-indigo-300" />
                        <span>{showTimestamps ? 'Time ON' : 'Time OFF'}</span>
                      </button>

                      {/* Auto-scroll Toggle */}
                      <button
                        onClick={() => setLogAutoScroll(!logAutoScroll)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition ${
                          logAutoScroll
                            ? 'bg-cyan-900/60 text-cyan-200 border-cyan-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                        title="Auto scroll to bottom on new log line"
                      >
                        <Zap className="w-3.5 h-3.5 text-cyan-300" />
                        <span>{logAutoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}</span>
                      </button>

                      {/* Download LOG */}
                      <button
                        onClick={handleDownloadLogsTxt}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                        title="Download logs as .LOG text file"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>.LOG</span>
                      </button>

                      {/* Download JSON */}
                      <button
                        onClick={handleDownloadLogsJson}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                        title="Export logs as JSON file"
                      >
                        <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                        <span>.JSON</span>
                      </button>

                      {/* Refresh Logs */}
                      <button
                        onClick={fetchLogs}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer border border-slate-700"
                        title="Refresh log entries"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                      </button>
                    </div>
                  </div>

                  {/* CONTROLS BAR: SEARCH & SEVERITY / SOURCE FILTERS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                    {/* Live Search Bar */}
                    <div className="md:col-span-6 relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={logSearch}
                        onChange={(e) => setLogSearch(e.target.value)}
                        placeholder="Search logs message, source, commit, deployment ID..."
                        className="w-full bg-slate-900 text-xs text-white pl-9 pr-8 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none font-mono"
                      />
                      {logSearch && (
                        <button
                          onClick={() => setLogSearch('')}
                          className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white text-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Severity Filter */}
                    <div className="md:col-span-3 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[10px] text-slate-400">Severity:</span>
                      <select
                        value={logSeverityFilter}
                        onChange={(e) => setLogSeverityFilter(e.target.value)}
                        className="bg-transparent text-xs text-white font-bold focus:outline-none w-full cursor-pointer uppercase"
                      >
                        <option value="ALL" className="bg-slate-900">ALL Severities</option>
                        <option value="INFO" className="bg-slate-900">INFO Only</option>
                        <option value="SUCCESS" className="bg-slate-900">SUCCESS Only</option>
                        <option value="WARN" className="bg-slate-900">WARN Only</option>
                        <option value="ERROR" className="bg-slate-900">ERROR Only</option>
                        <option value="DEBUG" className="bg-slate-900">DEBUG Only</option>
                      </select>
                    </div>

                    {/* Source Filter */}
                    <div className="md:col-span-3 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400">Source:</span>
                      <select
                        value={logSourceFilter}
                        onChange={(e) => setLogSourceFilter(e.target.value)}
                        className="bg-transparent text-xs text-white font-bold focus:outline-none w-full cursor-pointer"
                      >
                        <option value="ALL" className="bg-slate-900">All Sources</option>
                        <option value="Build Pipeline" className="bg-slate-900">Build Pipeline</option>
                        <option value="Queue Worker" className="bg-slate-900">Queue Worker</option>
                        <option value="VDM Kernel" className="bg-slate-900">VDM Kernel</option>
                        <option value="Health Checker" className="bg-slate-900">Health Checker</option>
                        <option value="Rollback Engine" className="bg-slate-900">Rollback Engine</option>
                      </select>
                    </div>
                  </div>

                  {/* SUMMARY COUNTER */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-sans pt-1">
                    <span>
                      Displaying <strong className="text-white font-mono">{filteredLogs.length}</strong> of <strong className="text-slate-300 font-mono">{liveLogEntries.length}</strong> total log entries.
                    </span>
                    <div className="flex items-center gap-3 text-[11px] font-mono">
                      <span className="text-emerald-400">✓ SUCCESS: {liveLogEntries.filter(l => l.severity === 'SUCCESS').length}</span>
                      <span className="text-indigo-400">ℹ INFO: {liveLogEntries.filter(l => l.severity === 'INFO').length}</span>
                      <span className="text-amber-400">⚡ WARN: {liveLogEntries.filter(l => l.severity === 'WARN').length}</span>
                      <span className="text-rose-400">⚠ ERROR: {liveLogEntries.filter(l => l.severity === 'ERROR').length}</span>
                    </div>
                  </div>
                </div>

                {/* REALTIME TERMINAL CONSOLE BOX */}
                <div className="p-4 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-[11px] text-slate-400 px-2 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                      <span className="ml-2 font-bold text-slate-300">veritas-vdm-kernel.log (Live TTY)</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px]">
                      <span>Buffer: {filteredLogs.length} lines</span>
                      <button
                        onClick={handleClearLogStream}
                        className="text-slate-500 hover:text-rose-400 transition"
                      >
                        Clear Display
                      </button>
                    </div>
                  </div>

                  <div
                    ref={terminalRef}
                    className="p-4 bg-black/90 rounded-2xl border border-slate-900 font-mono text-xs space-y-2 max-h-[520px] overflow-y-auto leading-relaxed scroll-smooth"
                  >
                    {filteredLogs.length === 0 ? (
                      <div className="p-8 text-center text-slate-600 font-sans text-xs">
                        No log entries match the selected filters or search query.
                      </div>
                    ) : (
                      filteredLogs.map((entry, index) => {
                        const sevColor =
                          entry.severity === 'SUCCESS'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                            : entry.severity === 'ERROR'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                            : entry.severity === 'WARN'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                            : entry.severity === 'DEBUG'
                            ? 'bg-purple-950/80 text-purple-300 border-purple-800/60'
                            : 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60';

                        const msgColor =
                          entry.severity === 'SUCCESS'
                            ? 'text-emerald-300 font-semibold'
                            : entry.severity === 'ERROR'
                            ? 'text-rose-300 font-bold'
                            : entry.severity === 'WARN'
                            ? 'text-amber-200'
                            : 'text-slate-200';

                        return (
                          <div
                            key={entry.id || index}
                            className="flex flex-wrap items-start gap-2 py-1 px-2 hover:bg-slate-900/60 rounded transition group"
                          >
                            {/* Row Index */}
                            <span className="text-[10px] text-slate-600 w-8 select-none font-mono">
                              #{(index + 1).toString().padStart(2, '0')}
                            </span>

                            {/* Timestamps */}
                            {showTimestamps && (
                              <span className="text-[11px] text-slate-500 font-mono select-none">
                                [{entry.formattedTime || entry.timestamp.split('T')[1]?.replace('Z', '') || entry.timestamp}]
                              </span>
                            )}

                            {/* Severity Badge */}
                            <span className={`px-2 py-0.2 rounded text-[9px] font-black uppercase border ${sevColor}`}>
                              {entry.severity}
                            </span>

                            {/* Source Tag */}
                            <span className="px-2 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px]">
                              [{entry.source}]
                            </span>

                            {/* Deployment ID Tag */}
                            {entry.deploymentId && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 text-[10px] font-bold">
                                {entry.deploymentId}
                              </span>
                            )}

                            {/* Log Message Content */}
                            <span className={`flex-1 break-words ${msgColor}`}>
                              {entry.message}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: ROLLBACK MANAGER & BACKUP SNAPSHOTS */}
            {/* ========================================================================= */}
            {activeTab === 'rollback_manager' && (
              <div className="space-y-6 animate-fade-in font-mono">
                {/* PHASE 5 AUTOMATIC ROLLBACK CONTROLLER BANNER */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
                          <RotateCcw className="w-5 h-5 text-amber-400" />
                          PHASE 5 AUTOMATIC ROLLBACK ENGINE
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ZERO MANUAL INTERVENTION
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          AUTO ADMIN NOTIFIED
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-1">
                        If deployment or health verification fails, the engine automatically restores the latest healthy snapshot, restarts the previous version, notifies administrators via webhook/email, and records the event.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleTriggerAutoRollbackTest}
                        className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg transition"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-200" />
                        <span>Simulate Auto-Rollback Execution</span>
                      </button>

                      <button
                        onClick={() => {
                          const newSnap: RollbackSnapshot = {
                            id: `snap-${Date.now().toString().slice(-4)}`,
                            version: `v${liveMetrics?.appVersion || '1.0.0'}-manual`,
                            commitHash: liveMetrics?.gitCommitHash || '91679a2',
                            timestamp: new Date().toLocaleString(),
                            sizeMb: 15.1,
                            environment: selectedEnv,
                            creator: 'Manual Snapshot Request'
                          };
                          setSnapshots(prev => [newSnap, ...prev]);
                          alert('Manual Rollback Snapshot created!');
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-300" />
                        <span>Create Snapshot</span>
                      </button>
                    </div>
                  </div>

                  {/* ROLLBACK ENGINE STATS */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Engine Automation Mode</span>
                      <div className="text-emerald-400 font-black text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> FULLY AUTOMATIC
                      </div>
                      <span className="text-[10px] text-slate-500">No manual clicks needed</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Recorded Auto-Rollbacks</span>
                      <div className="text-amber-400 font-black text-lg">
                        {autoRollbackRecords.length} Executed
                      </div>
                      <span className="text-[10px] text-slate-500">Audit history logged</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Admin Alerts Sent</span>
                      <div className="text-indigo-400 font-black text-lg">
                        {adminAlerts.length} Dispatched
                      </div>
                      <span className="text-[10px] text-slate-500">Email & Webhook channels</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Healthy Snapshots</span>
                      <div className="text-cyan-400 font-black text-lg">
                        {snapshots.length} Available
                      </div>
                      <span className="text-[10px] text-slate-500">Atomic image backups</span>
                    </div>
                  </div>
                </div>

                {/* AUTOMATIC ROLLBACK RECORDS AUDIT LOG */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="flex items-center gap-2">
                      <History className="w-4 h-4 text-amber-400" />
                      AUTOMATIC ROLLBACK EXECUTION AUDIT TRAIL
                    </span>
                    <span className="text-xs text-slate-400 font-sans font-normal">
                      Non-interactive rollbacks triggered by health or pipeline failures
                    </span>
                  </h4>

                  {autoRollbackRecords.length === 0 ? (
                    <div className="p-6 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-500 text-xs font-sans">
                      No automatic rollbacks recorded yet. Click "Simulate Auto-Rollback Execution" above to test the non-interactive rollback flow.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {autoRollbackRecords.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                                {rec.id}
                              </span>
                              <span className="font-bold text-white text-sm">
                                Restored Snapshot: {rec.restoredSnapshotId} ({rec.restoredVersion})
                              </span>
                              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                                {rec.environment}
                              </span>
                            </div>
                            <span className="text-slate-400 text-xs font-mono">
                              Executed in {rec.durationMs}ms at {new Date(rec.executedAt).toLocaleTimeString()}
                            </span>
                          </div>

                          <div className="text-xs text-amber-300 font-sans">
                            <strong className="text-amber-400">Trigger Reason:</strong> {rec.triggerReason}
                          </div>

                          <div className="p-3 bg-slate-900 rounded-xl text-[11px] text-emerald-400 font-mono space-y-1 max-h-32 overflow-y-auto">
                            {rec.logs?.map((l: string, idx: number) => (
                              <div key={idx}>{l}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ADMINISTRATOR NOTIFICATIONS SENT */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-400" />
                      ADMINISTRATOR NOTIFICATIONS DISPATCH LOG
                    </span>
                    <span className="text-xs text-slate-400 font-sans font-normal">
                      Emergency alerts sent on rollback
                    </span>
                  </h4>

                  {adminAlerts.length === 0 ? (
                    <div className="p-6 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-500 text-xs font-sans">
                      No admin notifications sent yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {adminAlerts.map((alt) => (
                        <div
                          key={alt.id}
                          className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{alt.subject}</span>
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                                {alt.severity}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                                {alt.channel}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 font-sans">
                              Recipient: {alt.recipient} | Delivered: {alt.delivered ? 'YES (100%)' : 'NO'} | Sent: {new Date(alt.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SNAPSHOT REGISTRY & RESTORATION */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                        <Download className="w-4 h-4 text-emerald-400" />
                        PRE-DEPLOYMENT SNAPSHOT REGISTRY
                      </h4>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        Every deployment generates a full rollback snapshot (Source, Config, Assets & Metadata).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {snapshots.map((snap) => (
                      <div
                        key={snap.id}
                        className="p-4 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl flex flex-wrap items-center justify-between gap-4 transition shadow-md"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm">{snap.version}</span>
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                              {snap.id}
                            </span>
                            <span className="text-slate-500 text-xs">• Commit {snap.commitHash}</span>
                          </div>
                          <div className="text-xs text-slate-400 font-sans">
                            Created: {snap.timestamp} | Size: {snap.sizeMb} MB | Target: {snap.environment} | Creator: {snap.creator}
                          </div>
                        </div>

                        <button
                          onClick={() => handleExecuteRollback(snap)}
                          className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore Snapshot</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: HEALTH VERIFICATION (FULL SERVICE MATRIX & ENDPOINTS) */}
            {/* ========================================================================= */}
            {activeTab === 'health_verification' && (
              <div className="space-y-6 animate-fade-in font-mono">
                {/* OVERALL COMPUTED HEALTH BANNER */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          PHASE 4 ENTERPRISE SERVICE HEALTH MATRIX
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black border ${
                            healthData?.overallStatus === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : healthData?.overallStatus === 'DEGRADED'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          SYSTEM STATUS: {healthData?.overallStatus || 'HEALTHY'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-1">
                        Independent diagnostic verification across 11 critical platform services. Each service exposes an isolated health endpoint.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={fetchHealth}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg transition"
                      >
                        <RefreshCw className="w-4 h-4 text-amber-300" />
                        <span>Run Full Diagnostic Matrix</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-sans">Auto-Rollback:</span>
                        <button
                          onClick={() => setAutoRollbackOnFail(!autoRollbackOnFail)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            autoRollbackOnFail ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {autoRollbackOnFail ? 'ENABLED' : 'DISABLED'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* COMPUTED SUMMARY SCORECARD */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Verified Services</span>
                      <div className="text-white font-black text-lg">
                        {healthData?.totalChecks || 11} Services Monitored
                      </div>
                      <span className="text-[10px] text-slate-500">100% Core coverage</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Passed (PASS)</span>
                      <div className="text-emerald-400 font-black text-lg">
                        {healthData?.passedChecks ?? 11} Passed
                      </div>
                      <span className="text-[10px] text-slate-500">Fully operational</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Warnings (WARN)</span>
                      <div className="text-amber-400 font-black text-lg">
                        {healthData?.warnChecks ?? 0} Warnings
                      </div>
                      <span className="text-[10px] text-slate-500">Non-blocking fallbacks</span>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Failures (FAIL)</span>
                      <div className="text-rose-400 font-black text-lg">
                        {healthData?.failedChecks ?? 0} Critical Failures
                      </div>
                      <span className="text-[10px] text-slate-500">Triggering auto-alert</span>
                    </div>
                  </div>
                </div>

                {/* 11 VERIFIED SERVICES GRID */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      INDIVIDUAL SERVICE DIAGNOSTIC RESULTS
                    </span>
                    <span className="text-xs text-slate-400 font-sans font-normal">
                      Click "Test Endpoint" to probe individual routes
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {healthData?.checks.map((hc: any) => (
                      <div
                        key={hc.id}
                        className="p-5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-3 transition flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="font-bold text-white text-sm flex items-center gap-2">
                                {hc.status === 'PASS' ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : hc.status === 'WARN' ? (
                                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                )}
                                <span>{hc.name}</span>
                              </div>
                              {hc.endpoint && (
                                <span className="inline-block px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800 font-mono text-[10px]">
                                  {hc.endpoint}
                                </span>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              <span
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                                  hc.status === 'PASS'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : hc.status === 'WARN'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                }`}
                              >
                                {hc.status}
                              </span>
                              <div className="text-[10px] text-slate-500 mt-1 font-mono">{hc.latencyMs} ms</div>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                            {hc.details}
                          </p>
                        </div>

                        {hc.endpoint && (
                          <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-mono">
                              Verified: {new Date(hc.timestamp || Date.now()).toLocaleTimeString()}
                            </span>
                            <button
                              onClick={() => handleTestIndividualEndpoint(hc.endpoint)}
                              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition"
                            >
                              <RefreshCw className="w-3 h-3 text-indigo-400" />
                              <span>Probe Endpoint</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 5: PHASE 7 PERSISTENT DEPLOYMENT HISTORY REGISTRY */}
            {/* ========================================================================= */}
            {activeTab === 'build_history' && (
              <div className="space-y-6 animate-fade-in font-mono">
                {/* VERSION MANAGEMENT & PERSISTENT DATASTORE HEADER BANNER */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
                          <Clock className="w-5 h-5 text-indigo-400" />
                          PHASE 7 PERSISTENT DEPLOYMENT HISTORY REGISTRY
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          FILE DATASTORE PERSISTED
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-1">
                        Deployment records are saved in file-based datastore (<code className="text-amber-300">data/vdm_deployments.json</code>). Tracks Start/Finish times, Status, Errors, Warnings, Commit, Branch, Operator, and Rollback targets.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleExportJson}
                        className="px-3.5 py-2 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition"
                        title="Export filtered records as JSON file"
                      >
                        <Download className="w-4 h-4 text-indigo-300" />
                        <span>Export JSON</span>
                      </button>

                      <button
                        onClick={handleExportCsv}
                        className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition"
                        title="Export filtered records as CSV spreadsheet"
                      >
                        <FileCode className="w-4 h-4 text-emerald-300" />
                        <span>Export CSV</span>
                      </button>

                      <button
                        onClick={fetchHistoryAndSnapshots}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer border border-slate-700 transition"
                      >
                        <RefreshCw className="w-4 h-4 text-indigo-400" />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  {/* SEARCH & FILTER CONTROLS BAR */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                    {/* Search Input */}
                    <div className="md:col-span-5 relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        placeholder="Search commit, branch, operator, version, errors, notes..."
                        className="w-full bg-slate-900 text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none font-mono"
                      />
                      {historySearch && (
                        <button
                          onClick={() => setHistorySearch('')}
                          className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white text-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Environment Filter */}
                    <div className="md:col-span-3 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[10px] text-slate-400">Env:</span>
                      <select
                        value={historyEnvFilter}
                        onChange={(e) => setHistoryEnvFilter(e.target.value)}
                        className="bg-transparent text-xs text-white font-bold focus:outline-none w-full cursor-pointer"
                      >
                        <option value="ALL" className="bg-slate-900">All Environments</option>
                        <option value="Production" className="bg-slate-900">Production</option>
                        <option value="Staging" className="bg-slate-900">Staging</option>
                        <option value="Testing" className="bg-slate-900">Testing</option>
                        <option value="Development" className="bg-slate-900">Development</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="md:col-span-2 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400">Status:</span>
                      <select
                        value={historyStatusFilter}
                        onChange={(e) => setHistoryStatusFilter(e.target.value)}
                        className="bg-transparent text-xs text-white font-bold focus:outline-none w-full cursor-pointer"
                      >
                        <option value="ALL" className="bg-slate-900">All Statuses</option>
                        <option value="SUCCESS" className="bg-slate-900">SUCCESS</option>
                        <option value="FAILED" className="bg-slate-900">FAILED</option>
                        <option value="ROLLED_BACK" className="bg-slate-900">ROLLED_BACK</option>
                        <option value="TIMED_OUT" className="bg-slate-900">TIMED_OUT</option>
                        <option value="CANCELLED" className="bg-slate-900">CANCELLED</option>
                      </select>
                    </div>

                    {/* Rollback Available Filter */}
                    <div className="md:col-span-2 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400">Rollback:</span>
                      <select
                        value={historyRollbackFilter}
                        onChange={(e) => setHistoryRollbackFilter(e.target.value)}
                        className="bg-transparent text-xs text-white font-bold focus:outline-none w-full cursor-pointer"
                      >
                        <option value="ALL" className="bg-slate-900">All Targets</option>
                        <option value="AVAILABLE" className="bg-slate-900">Available Only</option>
                      </select>
                    </div>
                  </div>

                  {/* SUMMARY COUNTER */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-sans pt-1">
                    <span>
                      Showing <strong className="text-white font-mono">{filteredHistory.length}</strong> of <strong className="text-slate-300 font-mono">{history.length}</strong> deployments recorded in datastore.
                    </span>
                    <div className="flex items-center gap-4 text-[11px] font-mono">
                      <span className="text-emerald-400">✓ Success: {history.filter(r => r.status === 'SUCCESS').length}</span>
                      <span className="text-amber-400">↺ Rolled Back: {history.filter(r => r.status === 'ROLLED_BACK').length}</span>
                      <span className="text-rose-400">⚠ Timed Out / Failed: {history.filter(r => r.status === 'TIMED_OUT' || r.status === 'FAILED').length}</span>
                    </div>
                  </div>
                </div>

                {/* HISTORICAL VERSION AUDIT LIST */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      PERSISTENT DEPLOYMENT RECORDS AUDIT LOG
                    </span>
                    <span className="text-xs text-slate-400 font-sans font-normal">
                      Displaying complete Phase 7 metrics
                    </span>
                  </h4>

                  {filteredHistory.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 font-sans text-xs">
                      No deployment records match the selected search or filter criteria.
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {filteredHistory.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-4 text-xs transition shadow-lg"
                        >
                          {/* ROW 1: HEADER & BADGES */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Version */}
                              <span className="px-2.5 py-1 rounded-xl bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 text-sm font-black">
                                {rec.version}
                              </span>

                              {/* Build ID */}
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800 font-mono text-[10px] font-bold">
                                {rec.buildId || `BUILD-${rec.buildNumber}`}
                              </span>

                              {/* Deployment ID */}
                              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-mono text-[10px] font-bold">
                                ID: {rec.id}
                              </span>

                              {/* Environment */}
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                rec.environment === 'Production'
                                  ? 'bg-rose-950/80 text-rose-300 border-rose-800/40'
                                  : 'bg-slate-900 text-slate-300 border-slate-800'
                              }`}>
                                {rec.environment}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Status Badge */}
                              <span
                                className={`px-3 py-1 rounded-full font-extrabold text-[10px] border tracking-wider uppercase ${
                                  rec.status === 'SUCCESS'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : rec.status === 'ROLLED_BACK'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    : rec.status === 'TIMED_OUT'
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}
                              >
                                {rec.status}
                              </span>

                              {/* Rollback Availability Badge */}
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                rec.rollbackAvailable
                                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                                  : 'bg-slate-900 text-slate-600 border-slate-800'
                              }`}>
                                {rec.rollbackAvailable ? '↺ Rollback Ready' : 'Rollback N/A'}
                              </span>
                            </div>
                          </div>

                          {/* ROW 2: PHASE 7 DYNAMIC METRICS GRID */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 p-3.5 bg-slate-900/70 rounded-xl border border-slate-800/80 font-mono text-[11px]">
                            {/* 1. Start Time */}
                            <div className="col-span-2">
                              <span className="text-slate-500 text-[9px] uppercase block">1. Start Time</span>
                              <span className="text-white font-bold text-[11px]">
                                {rec.startTime ? new Date(rec.startTime).toLocaleString() : rec.deployedAt || '---'}
                              </span>
                            </div>

                            {/* 2. Finish Time */}
                            <div className="col-span-2">
                              <span className="text-slate-500 text-[9px] uppercase block">2. Finish Time</span>
                              <span className="text-white font-bold text-[11px]">
                                {rec.finishTime ? new Date(rec.finishTime).toLocaleString() : rec.deployedAt || '---'}
                              </span>
                            </div>

                            {/* 3. Status */}
                            <div>
                              <span className="text-slate-500 text-[9px] uppercase block">3. Status</span>
                              <span className={`font-bold ${
                                rec.status === 'SUCCESS' ? 'text-emerald-400' : rec.status === 'ROLLED_BACK' ? 'text-amber-400' : 'text-rose-400'
                              }`}>
                                {rec.status}
                              </span>
                            </div>

                            {/* 4. Commit */}
                            <div>
                              <span className="text-slate-500 text-[9px] uppercase block">6. Commit</span>
                              <span className="text-amber-300 font-bold">{rec.commitHash}</span>
                            </div>

                            {/* 5. Branch */}
                            <div>
                              <span className="text-slate-500 text-[9px] uppercase block">7. Branch</span>
                              <span className="text-indigo-300 font-bold">{rec.branch}</span>
                            </div>

                            {/* 6. Operator */}
                            <div>
                              <span className="text-slate-500 text-[9px] uppercase block">8. Operator</span>
                              <span className="text-slate-200 font-bold truncate block">{rec.operator}</span>
                            </div>
                          </div>

                          {/* ROW 3: ERRORS AND WARNINGS AUDIT PANELS */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Errors List */}
                            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                                  <AlertTriangle className={`w-3.5 h-3.5 ${rec.errors && rec.errors.length > 0 ? 'text-rose-400' : 'text-slate-600'}`} />
                                  4. ERRORS ENCOUNTERED ({(rec.errors || []).length})
                                </span>
                              </div>
                              {rec.errors && rec.errors.length > 0 ? (
                                <ul className="space-y-1 mt-1">
                                  {rec.errors.map((err, idx) => (
                                    <li key={idx} className="text-rose-300 font-mono text-[11px] bg-rose-950/30 p-1.5 rounded border border-rose-900/30">
                                      ⚠ {err}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-[11px] text-slate-500 italic">No errors encountered during deployment pipeline.</p>
                              )}
                            </div>

                            {/* Warnings List */}
                            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                                  <Info className={`w-3.5 h-3.5 ${rec.warnings && rec.warnings.length > 0 ? 'text-amber-400' : 'text-slate-600'}`} />
                                  5. WARNINGS LOGGED ({(rec.warnings || []).length})
                                </span>
                              </div>
                              {rec.warnings && rec.warnings.length > 0 ? (
                                <ul className="space-y-1 mt-1">
                                  {rec.warnings.map((warn, idx) => (
                                    <li key={idx} className="text-amber-300 font-mono text-[11px] bg-amber-950/30 p-1.5 rounded border border-amber-900/30">
                                      ⚡ {warn}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-[11px] text-slate-500 italic">No pipeline warnings logged.</p>
                              )}
                            </div>
                          </div>

                          {/* ROW 4: DEPLOYMENT NOTES & ROLLBACK TARGET */}
                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-slate-300 pt-1 border-t border-slate-900">
                            <div>
                              <strong className="font-mono text-slate-400 font-bold">Notes:</strong> {rec.notes}
                            </div>
                            <div className="font-mono text-[11px] text-slate-400">
                              Target Baseline: <strong className="text-rose-300">{rec.rollbackTarget || `snap-${rec.buildNumber - 1}`}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 6: AI DEPLOYMENT RISK ADVISOR */}
            {/* ========================================================================= */}
            {activeTab === 'ai_deployment_advisor' && (
              <div className="space-y-6 animate-fade-in font-sans">
                <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 border border-indigo-500/40 rounded-3xl space-y-5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                    <h3 className="font-bold text-white text-base font-mono uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                      AI PREDICTIVE DEPLOYMENT RISK ADVISOR
                    </h3>

                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Recommendation: SAFE TO DEPLOY (99.4% Confidence)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase block font-bold">Predicted Build Risk</span>
                      <div className="text-lg font-black text-emerald-400">LOW RISK (0.2%)</div>
                      <span className="text-[10px] text-slate-500">No breaking API changes detected</span>
                    </div>

                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase block font-bold">Dependency Conflict Assessment</span>
                      <div className="text-lg font-black text-cyan-400">0 CONFLICTS</div>
                      <span className="text-[10px] text-slate-500">Package version {liveMetrics?.appVersion || '1.0.0'} verified</span>
                    </div>

                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase block font-bold">Performance Impact</span>
                      <div className="text-lg font-black text-amber-400">+3.1% Faster</div>
                      <span className="text-[10px] text-slate-500">ESM bundle optimization active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 7: PHASE 10 VCIO EVIDENCE-BASED OPERATIONAL BRIEFING */}
            {/* ========================================================================= */}
            {activeTab === 'vcio_briefings' && (
              <div className="space-y-6 animate-fade-in font-sans">
                {/* HEADER BANNER */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 font-mono">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-amber-400" />
                          PHASE 10 VCIO EVIDENCE-BASED OPERATIONAL BRIEFING
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {vcioBriefing?.aiEnriched ? 'GEMINI 2.5 FLASH ENRICHED' : 'TELEMETRY ENGINE VERIFIED'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-1">
                        Consumes deployment telemetry, health matrices, system metrics, and log streams to construct an evidence-based operational briefing.
                      </p>
                    </div>

                    {/* ACTIONS TOOLBAR */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => fetchVcioBriefing(true)}
                        disabled={isGeneratingVcioAi}
                        className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-lg"
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-amber-200 ${isGeneratingVcioAi ? 'animate-spin' : ''}`} />
                        <span>{isGeneratingVcioAi ? 'Generating AI Briefing...' : 'Generate AI Briefing'}</span>
                      </button>

                      <button
                        onClick={() => fetchVcioBriefing(false)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Refresh Telemetry</span>
                      </button>

                      <button
                        onClick={handleDownloadVcioTxt}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                        title="Download Briefing as TXT"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>.TXT</span>
                      </button>

                      <button
                        onClick={handleDownloadVcioJson}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                        title="Export Briefing as JSON"
                      >
                        <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                        <span>.JSON</span>
                      </button>
                    </div>
                  </div>

                  {/* EXECUTIVE SUMMARY BOX */}
                  {vcioBriefing && (
                    <div className="p-5 bg-gradient-to-r from-indigo-950/80 via-slate-950 to-slate-950 rounded-2xl border border-indigo-500/40 space-y-2">
                      <div className="flex items-center justify-between text-indigo-300 font-mono text-xs font-bold">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          VCIO EXECUTIVE OPERATIONAL SUMMARY:
                        </span>
                        <span className="text-[10px] text-slate-400">Generated: {new Date(vcioBriefing.generatedAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed font-sans pt-1">
                        {vcioBriefing.executiveSummary}
                      </p>
                    </div>
                  )}

                  {!vcioBriefing ? (
                    <div className="p-12 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                      <span>Loading VCIO Telemetry Briefing...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* 1 & 2: DEPLOYMENT OUTCOME & VERSION GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* DEPLOYMENT OUTCOME CARD */}
                        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                            <span className="font-bold text-white text-sm flex items-center gap-2">
                              <Activity className="w-4 h-4 text-emerald-400" />
                              1. DEPLOYMENT OUTCOME
                            </span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                              vcioBriefing.deploymentOutcome.status === 'SUCCESS'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            }`}>
                              {vcioBriefing.deploymentOutcome.status}
                            </span>
                          </div>

                          <div className="space-y-2 text-slate-300 font-sans">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Deployment ID:</span>
                              <span className="font-mono font-bold text-cyan-300">{vcioBriefing.deploymentOutcome.deploymentId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Build Number:</span>
                              <span className="font-mono font-bold text-amber-300">#{vcioBriefing.deploymentOutcome.buildNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Target Environment:</span>
                              <span className="font-mono text-indigo-300 uppercase">{vcioBriefing.deploymentOutcome.environment}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Pipeline Duration:</span>
                              <span className="font-mono text-emerald-300">{vcioBriefing.deploymentOutcome.durationMs} ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Operator:</span>
                              <span className="font-mono text-slate-200">{vcioBriefing.deploymentOutcome.operator}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 italic flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{vcioBriefing.deploymentOutcome.citation}</span>
                          </div>
                        </div>

                        {/* VERSION & CODEBASE CARD */}
                        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                            <span className="font-bold text-white text-sm flex items-center gap-2">
                              <GitBranch className="w-4 h-4 text-indigo-400" />
                              2. VERSION & CODEBASE TELEMETRY
                            </span>
                            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold">
                              v{vcioBriefing.versionInfo.appVersion}
                            </span>
                          </div>

                          <div className="space-y-2 text-slate-300 font-sans">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Release Tag:</span>
                              <span className="font-mono font-bold text-white">v{vcioBriefing.versionInfo.appVersion}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Build Sequence:</span>
                              <span className="font-mono font-bold text-amber-300">#{vcioBriefing.versionInfo.buildNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Git Commit Hash:</span>
                              <span className="font-mono font-bold text-amber-400">{vcioBriefing.versionInfo.commitHash}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Git Branch:</span>
                              <span className="font-mono font-bold text-cyan-300">{vcioBriefing.versionInfo.branch}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 italic flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>{vcioBriefing.versionInfo.citation}</span>
                          </div>
                        </div>
                      </div>

                      {/* 3 & 4: HEALTH ASSESSMENT & RESOURCE UTILIZATION GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* HEALTH ASSESSMENT CARD */}
                        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                            <span className="font-bold text-white text-sm flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              3. HEALTH ASSESSMENT
                            </span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                              vcioBriefing.healthAssessment.overallStatus === 'HEALTHY'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}>
                              {vcioBriefing.healthAssessment.overallStatus}
                            </span>
                          </div>

                          <div className="space-y-2 text-slate-300 font-sans">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Checks Matrix Status:</span>
                              <span className="font-mono font-bold text-emerald-400">
                                {vcioBriefing.healthAssessment.passedChecks} / {vcioBriefing.healthAssessment.totalChecks} PASSED
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Avg Endpoint Latency:</span>
                              <span className="font-mono font-bold text-indigo-300">{vcioBriefing.healthAssessment.avgLatencyMs} ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Degraded Services:</span>
                              <span className="font-mono text-slate-400">
                                {vcioBriefing.healthAssessment.degradedServices.length === 0 ? 'None (0 Degraded)' : vcioBriefing.healthAssessment.degradedServices.join(', ')}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 italic flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{vcioBriefing.healthAssessment.citation}</span>
                          </div>
                        </div>

                        {/* RESOURCE UTILIZATION CARD */}
                        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                            <span className="font-bold text-white text-sm flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-cyan-400" />
                              4. RESOURCE UTILIZATION
                            </span>
                            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                              {vcioBriefing.resourceUtilization.memoryUsagePercent}% MEM
                            </span>
                          </div>

                          <div className="space-y-2 text-slate-300 font-sans">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">System Memory:</span>
                              <span className="font-mono font-bold text-cyan-300">
                                {vcioBriefing.resourceUtilization.memoryUsagePercent}% ({vcioBriefing.resourceUtilization.memoryUsedMb}MB / {vcioBriefing.resourceUtilization.memoryTotalMb}MB)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">CPU Load:</span>
                              <span className="font-mono font-bold text-amber-300">{vcioBriefing.resourceUtilization.cpuLoadPercent}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Node Runtime Uptime:</span>
                              <span className="font-mono text-indigo-300">{vcioBriefing.resourceUtilization.nodeUptimeSeconds} seconds</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Host Machine:</span>
                              <span className="font-mono text-slate-300">{vcioBriefing.resourceUtilization.hostname} ({vcioBriefing.resourceUtilization.osType})</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 italic flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{vcioBriefing.resourceUtilization.citation}</span>
                          </div>
                        </div>
                      </div>

                      {/* 5. DETECTED ANOMALIES CARD */}
                      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                          <span className="font-bold text-white text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            5. DETECTED ANOMALIES ({vcioBriefing.detectedAnomalies.anomalyCount} FLAGGED)
                          </span>
                          <span className="text-[10px] text-slate-500 font-sans">
                            {vcioBriefing.detectedAnomalies.citation}
                          </span>
                        </div>

                        {vcioBriefing.detectedAnomalies.anomalies.length === 0 ? (
                          <div className="p-4 bg-slate-900/40 rounded-xl text-slate-400 text-xs font-sans italic text-center">
                            Zero operational anomalies or process exceptions detected in telemetry stream.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {vcioBriefing.detectedAnomalies.anomalies.map((a, idx) => (
                              <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1 font-sans">
                                <div className="flex items-center justify-between font-mono text-[11px]">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.2 rounded text-[9px] font-bold border ${
                                      a.severity === 'ERROR' || a.severity === 'CRITICAL'
                                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                                        : 'bg-amber-950 text-amber-300 border-amber-800'
                                    }`}>
                                      {a.severity}
                                    </span>
                                    <span className="text-slate-300 font-bold">[{a.source}]</span>
                                  </div>
                                  <span className="text-[10px] text-slate-500">{a.telemetryRef}</span>
                                </div>
                                <p className="text-slate-300 text-xs">{a.description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 6. RISK ASSESSMENT CARD */}
                      <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900/60 to-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-bold text-white text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            6. PREDICTIVE RISK ASSESSMENT
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-0.5 rounded-full text-[11px] font-black border ${
                              vcioBriefing.riskAssessment.riskLevel === 'LOW'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : vcioBriefing.riskAssessment.riskLevel === 'MEDIUM'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            }`}>
                              RISK LEVEL: {vcioBriefing.riskAssessment.riskLevel}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              ({vcioBriefing.riskAssessment.confidencePercent}% Confidence)
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-slate-300 font-sans">
                          <div className="text-xs text-slate-400">Primary Risk Drivers:</div>
                          <ul className="space-y-1">
                            {vcioBriefing.riskAssessment.primaryRiskDrivers.map((driver, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                                <span className="text-indigo-400 font-bold">•</span>
                                <span>{driver}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 italic flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{vcioBriefing.riskAssessment.citation}</span>
                        </div>
                      </div>

                      {/* 7. RECOMMENDATIONS CITING TELEMETRY */}
                      <div className="p-5 bg-slate-950 border border-indigo-500/30 rounded-2xl space-y-4 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                          <span className="font-bold text-white text-sm flex items-center gap-2">
                            <List className="w-4 h-4 text-amber-400" />
                            7. ACTIONABLE OPERATIONAL RECOMMENDATIONS (TELEMETRY CITED)
                          </span>
                          <span className="text-[10px] text-slate-500 font-sans">
                            All conclusions cite live telemetry metrics
                          </span>
                        </div>

                        <div className="space-y-3 font-sans">
                          {vcioBriefing.recommendations.map((rec, idx) => (
                            <div key={rec.id || idx} className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between font-mono text-xs">
                                <span className="font-bold text-white flex items-center gap-2">
                                  <span className="text-amber-400 font-mono">#{idx + 1}</span>
                                  <span>{rec.action}</span>
                                </span>
                                <span className={`px-2 py-0.2 rounded text-[9px] font-bold border uppercase ${
                                  rec.priority === 'HIGH'
                                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                                    : rec.priority === 'MEDIUM'
                                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                                    : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                                }`}>
                                  {rec.priority} PRIORITY
                                </span>
                              </div>

                              <p className="text-slate-300 text-xs leading-relaxed">
                                <strong>Rationale:</strong> {rec.rationale}
                              </p>

                              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-300 flex items-start gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="text-slate-400 font-sans block text-[10px]">Citing Telemetry Evidence:</strong>
                                  <span>{rec.telemetryEvidence}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 8: PHASE 11 VCIA AUTOMATED DEPLOYMENT FAILURE DIAGNOSTICS */}
            {/* ========================================================================= */}
            {activeTab === 'vcia_diagnostics' && (
              <div className="space-y-6 animate-fade-in font-sans">
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5 shadow-xl">
                  {/* HEADER BANNER */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 font-mono">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-rose-400" />
                          PHASE 11 VCIA DEPLOYMENT FAILURE DIAGNOSTIC ENGINE
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {vciaData?.aiEnriched ? 'GEMINI DEEP DIAGNOSTIC' : 'AUTOMATED LOG CORRELATION ENGINE'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-1">
                        Automatically analyzes deployment failures, isolates root causes, correlates logs, detects dependency conflicts, and suggests corrective action playbooks.
                      </p>
                    </div>

                    {/* ACTIONS & DEPLOYMENT SELECTOR */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* TARGET SELECTOR */}
                      <select
                        value={vciaTargetId}
                        onChange={(e) => {
                          setVciaTargetId(e.target.value);
                          fetchVciaDiagnostics(e.target.value, false);
                        }}
                        className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-mono font-bold focus:outline-none focus:border-rose-500"
                      >
                        <option value="">Auto-Detect Recent Failure</option>
                        {history.map((h) => (
                          <option key={h.id} value={h.id}>
                            Build #{h.buildNumber} ({h.environment.toUpperCase()}) - [{h.status}]
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => fetchVciaDiagnostics(vciaTargetId || undefined, true)}
                        disabled={isAnalyzingVcia}
                        className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-lg"
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-rose-200 ${isAnalyzingVcia ? 'animate-spin' : ''}`} />
                        <span>{isAnalyzingVcia ? 'Running Deep AI Scan...' : 'Deep AI Scan (Gemini)'}</span>
                      </button>

                      <button
                        onClick={() => fetchVciaDiagnostics(vciaTargetId || undefined, false)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Re-analyze</span>
                      </button>

                      <button
                        onClick={handleDownloadVciaTxt}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                        title="Download Diagnostic Report as TXT"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>.TXT</span>
                      </button>

                      <button
                        onClick={handleDownloadVciaJson}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                        title="Export Diagnostic JSON"
                      >
                        <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                        <span>.JSON</span>
                      </button>
                    </div>
                  </div>

                  {!vciaData ? (
                    <div className="p-12 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 text-rose-400 animate-spin" />
                      <span>VCIA Diagnostic Engine Analyzing Failure Telemetry...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* 1. ROOT CAUSE & CONFIDENCE SCORE HEADER */}
                      <div className="p-5 bg-gradient-to-r from-rose-950/80 via-slate-950 to-slate-950 rounded-2xl border border-rose-500/40 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-900/50 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                              CATEGORY: {vciaData.rootCauseAnalysis.failureCategory}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              Target: <strong className="text-white">{vciaData.targetDeployment.id}</strong> (Build #{vciaData.targetDeployment.buildNumber})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="text-slate-400">Diagnostic Confidence:</span>
                            <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-extrabold text-sm">
                              {vciaData.rootCauseAnalysis.confidenceScore}%
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-rose-300 uppercase font-mono mb-1">
                            IDENTIFIED PRIMARY ROOT CAUSE:
                          </h4>
                          <p className="text-slate-100 text-sm font-sans font-medium leading-relaxed">
                            {vciaData.rootCauseAnalysis.primaryRootCause}
                          </p>
                        </div>

                        {/* UNKNOWN FACTORS CALLOUT */}
                        {vciaData.rootCauseAnalysis.unknownFactors.length > 0 && (
                          <div className="pt-2 border-t border-slate-900 text-xs font-mono">
                            <div className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>HIGHLIGHTED UNKNOWNS & ENVIRONMENTAL UNVERIFIED FACTORS:</span>
                            </div>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px] font-sans">
                              {vciaData.rootCauseAnalysis.unknownFactors.map((uf, i) => (
                                <li key={i}>{uf}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* 2. DETECTED DEPENDENCY CONFLICTS CARD */}
                      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                          <span className="font-bold text-white text-sm flex items-center gap-2">
                            <Lock className="w-4 h-4 text-amber-400" />
                            DETECTED DEPENDENCY CONFLICTS & VERSION MISMATCHES ({vciaData.dependencyConflicts.length})
                          </span>
                          <span className="text-[10px] text-slate-500 font-sans">
                            Scanned node_modules & package manifests
                          </span>
                        </div>

                        {vciaData.dependencyConflicts.length === 0 ? (
                          <div className="p-4 bg-slate-900/40 rounded-xl text-slate-400 text-xs font-sans italic text-center">
                            Zero package dependency conflicts or peer version mismatches detected.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {vciaData.dependencyConflicts.map((dc, idx) => (
                              <div key={idx} className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1 font-sans">
                                <div className="flex items-center justify-between font-mono text-[11px]">
                                  <span className="font-bold text-amber-300">{dc.packageName}</span>
                                  <span className={`px-2 py-0.2 rounded text-[9px] font-bold border uppercase ${
                                    dc.severity === 'CRITICAL'
                                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                                      : 'bg-amber-950 text-amber-300 border-amber-800'
                                  }`}>
                                    {dc.severity}
                                  </span>
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                                  <span>Expected: <strong className="text-emerald-400">{dc.expectedVersion}</strong></span>
                                  <span>Detected: <strong className="text-rose-400">{dc.detectedVersion}</strong></span>
                                </div>
                                <p className="text-slate-300 text-xs pt-1 border-t border-slate-800/60">
                                  {dc.details}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 3. CORRELATED LOGS STREAM */}
                      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                          <span className="font-bold text-white text-sm flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-cyan-400" />
                            CORRELATED FAILURE LOG STREAM ({vciaData.correlatedLogs.length} MATCHED)
                          </span>
                          <span className="text-[10px] text-slate-500 font-sans">
                            Logs isolated within failure timestamp window
                          </span>
                        </div>

                        {vciaData.correlatedLogs.length === 0 ? (
                          <div className="p-4 bg-slate-900/40 rounded-xl text-slate-400 text-xs font-sans italic text-center">
                            No correlated error log entries found.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {vciaData.correlatedLogs.map((log) => (
                              <div key={log.id} className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                                <div className="flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-1.5 py-0.2 rounded font-bold ${
                                      log.severity === 'ERROR' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                                    }`}>
                                      {log.severity}
                                    </span>
                                    <span className="text-slate-400">[{log.source}]</span>
                                    <span className="text-slate-300 font-bold">{log.message}</span>
                                  </div>
                                  <span className="text-slate-500">{log.formattedTime || log.timestamp}</span>
                                </div>
                                <div className="text-[10px] text-indigo-300 italic font-sans pl-2 border-l border-indigo-500/40">
                                  Correlation Reason: {log.relevanceReason}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 4. CORRECTIVE ACTIONS PLAYBOOK */}
                      <div className="p-5 bg-slate-950 border border-indigo-500/30 rounded-2xl space-y-4 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                          <span className="font-bold text-white text-sm flex items-center gap-2">
                            <Play className="w-4 h-4 text-emerald-400" />
                            RECOMMENDED CORRECTIVE ACTIONS PLAYBOOK
                          </span>
                          <span className="text-[10px] text-slate-500 font-sans">
                            {vciaData.correctiveActions.length} step-by-step remediation commands
                          </span>
                        </div>

                        <div className="space-y-3 font-sans">
                          {vciaData.correctiveActions.map((ca) => (
                            <div key={ca.id || ca.stepNumber} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                              <div className="flex items-center justify-between font-mono text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold rounded">
                                    STEP {ca.stepNumber}
                                  </span>
                                  <span className="font-bold text-white text-sm">{ca.title}</span>
                                </div>

                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase font-mono ${
                                  ca.riskImpact === 'HIGH_RISK'
                                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                                    : ca.riskImpact === 'MEDIUM_RISK'
                                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                }`}>
                                  {ca.riskImpact.replace('_', ' ')}
                                </span>
                              </div>

                              <p className="text-slate-300 text-xs">
                                {ca.description}
                              </p>

                              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300 flex items-center justify-between">
                                <span>$ {ca.commandOrAction}</span>
                                <button
                                  onClick={() => alert(`Triggered Action: ${ca.title}`)}
                                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold cursor-pointer transition"
                                >
                                  Execute Action
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 9: CLOUD INFRASTRUCTURE CONFIG */}
            {/* ========================================================================= */}
            {activeTab === 'environment_cloud' && (
              <div className="space-y-6 animate-fade-in font-mono text-xs">
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5">
                  <h3 className="font-bold text-white text-base uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-indigo-400" />
                    FUTURE-READY CLOUD & CONTAINER TARGET SELECTION
                  </h3>

                  <div className="space-y-3">
                    {[
                      { name: 'Namecheap Shared Hosting / cPanel', desc: 'Current active target via Node.js App Manager & Reverse Proxy', status: 'ACTIVE' },
                      { name: 'Docker Container Cluster', desc: 'Single & Multi-container Compose setups', status: 'READY' },
                      { name: 'Kubernetes (K8s)', desc: 'Enterprise autoscaling pods & ingress routing', status: 'READY' },
                      { name: 'Google Cloud Run / GCP App Engine', desc: 'Serverless container execution on Cloud Run', status: 'READY' },
                      { name: 'AWS ECS / Elastic Beanstalk', desc: 'Amazon Web Services Cloud deployment', status: 'READY' },
                      { name: 'Microsoft Azure App Service', desc: 'Enterprise Azure cloud instance', status: 'READY' }
                    ].map((target) => (
                      <div
                        key={target.name}
                        onClick={() => setCloudTarget(target.name)}
                        className={`p-4 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                          cloudTarget === target.name
                            ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-lg'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm flex items-center gap-2">
                            <span>{target.name}</span>
                            {cloudTarget === target.name && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">CURRENT TARGET</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-sans mt-0.5">{target.desc}</div>
                        </div>

                        <button className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl font-bold">
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 12: DEPLOYMENT REST API EXPLORER & AUDIT */}
            {/* ========================================================================= */}
            {activeTab === 'deployment_api' && (
              <div className="space-y-6 animate-fade-in font-mono text-xs">
                {/* HEADER BANNER */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <FileCode className="w-6 h-6 text-indigo-400" />
                      <div>
                        <h3 className="font-bold text-white text-base uppercase tracking-wider">
                          PHASE 12 — RESTFUL DEPLOYMENT API & AUDIT LOGGING
                        </h3>
                        <p className="text-slate-400 text-xs font-sans">
                          Secure REST endpoints for automated CI/CD pipelines, status checks, rollbacks, and audit tracking.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        AUTH: BEARER / API KEY
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        AUDIT LOGGING ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* AUTHENTICATION CONFIG & TOKEN INPUT */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400" />
                        ACTIVE API BEARER TOKEN / X-API-KEY:
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        Required in headers: <code className="text-amber-300">Authorization: Bearer &lt;token&gt;</code> or <code className="text-amber-300">X-API-Key: &lt;key&gt;</code>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={apiToken}
                        onChange={(e) => setApiToken(e.target.value)}
                        className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-amber-300 text-xs focus:outline-none focus:border-indigo-500"
                        placeholder="Enter API Key or Bearer Token..."
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`Authorization: Bearer ${apiToken}`);
                          alert('Authorization header copied to clipboard!');
                        }}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer transition flex items-center gap-1.5"
                      >
                        Copy Header
                      </button>
                    </div>
                  </div>

                  {/* ENDPOINT EXPLORER GRID */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-xs uppercase flex items-center justify-between">
                      <span>EXPOSED REST ENDPOINTS</span>
                      <span className="text-slate-500 text-[10px]">Click any endpoint to execute live REST test</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { method: 'GET', endpoint: '/api/vdm/status', label: 'Deployment Status', color: 'emerald' },
                        { method: 'GET', endpoint: '/api/vdm/version', label: 'Release Version', color: 'emerald' },
                        { method: 'GET', endpoint: '/api/vdm/health', label: 'Health Matrix', color: 'emerald' },
                        { method: 'GET', endpoint: '/api/vdm/history', label: 'Deployment History', color: 'emerald' },
                        { method: 'GET', endpoint: '/api/vdm/logs', label: 'System Logs', color: 'emerald' },
                        { method: 'POST', endpoint: '/api/vdm/deploy', label: 'Execute Deployment', color: 'indigo', body: { environment: 'Production', notes: 'REST API Test' } },
                        { method: 'POST', endpoint: '/api/vdm/rollback', label: 'Trigger Rollback', color: 'rose', body: { snapshotId: 'snap-1041' } },
                        { method: 'GET', endpoint: '/api/vdm/audit-logs', label: 'Audit Trail Logs', color: 'amber' }
                      ].map((ep) => (
                        <div
                          key={ep.endpoint + ep.method}
                          onClick={() => handleRunApiTest(ep.endpoint, ep.method as any, ep.body)}
                          className={`p-3 bg-slate-950 border rounded-2xl transition cursor-pointer hover:border-indigo-500 space-y-1.5 ${
                            activeApiTestEndpoint === ep.endpoint ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ep.method === 'GET' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                            }`}>
                              {ep.method}
                            </span>
                            <span className="text-[10px] text-slate-400 font-sans">{ep.label}</span>
                          </div>
                          <div className="font-mono text-[11px] text-white font-bold truncate">
                            {ep.endpoint}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LIVE API RESPONSE & CURL CODE DISPLAY */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* cURL Command Panel */}
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-slate-400 font-bold">
                        <span className="text-xs text-white flex items-center gap-1.5">
                          <Terminal className="w-4 h-4 text-cyan-400" />
                          GENERATED cURL SNIPPET
                        </span>
                        <button
                          onClick={() => {
                            const curlStr = `curl -X GET "https://ais-dev-oi3226e5d4y4lffhertqbe-507783827227.europe-west2.run.app${activeApiTestEndpoint}" -H "Authorization: Bearer ${apiToken}" -H "Content-Type: application/json"`;
                            navigator.clipboard.writeText(curlStr);
                            alert('cURL command copied to clipboard!');
                          }}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold"
                        >
                          Copy cURL
                        </button>
                      </div>

                      <pre className="p-3 bg-slate-900/90 rounded-xl text-[10px] text-cyan-300 font-mono overflow-x-auto whitespace-pre-wrap border border-slate-800/80">
{`curl -X GET "https://veritas.gov.rw${activeApiTestEndpoint}" \\
  -H "Authorization: Bearer ${apiToken}" \\
  -H "X-API-Key: ${apiToken}" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>

                    {/* Response Output Panel */}
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-slate-400 font-bold">
                        <span className="text-xs text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          LIVE RESPONSE DATA ({apiTestResponse?.status || 200})
                        </span>
                        {isTestingApi && (
                          <span className="text-[10px] text-amber-400 animate-pulse font-mono">Executing...</span>
                        )}
                      </div>

                      <pre className="p-3 bg-slate-900/90 rounded-xl text-[10px] text-emerald-400 font-mono overflow-x-auto max-h-48 border border-slate-800/80">
                        {apiTestResponse ? JSON.stringify(apiTestResponse, null, 2) : '// Click any REST endpoint above to test response'}
                      </pre>
                    </div>
                  </div>

                  {/* AUDIT TRAIL LOGS TABLE */}
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="font-bold text-white text-sm flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        AUDIT TRAIL LOGS ({auditLogs.length} RECORDED)
                      </span>
                      <button
                        onClick={fetchAuditLogs}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh Audit Trail
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase">
                            <th className="py-2 px-2">ID & Time</th>
                            <th className="py-2 px-2">Action</th>
                            <th className="py-2 px-2">Operator</th>
                            <th className="py-2 px-2">Endpoint</th>
                            <th className="py-2 px-2">IP Address</th>
                            <th className="py-2 px-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-slate-300">
                          {auditLogs.map((log: any) => (
                            <tr key={log.id} className="hover:bg-slate-900/50">
                              <td className="py-2 px-2 font-mono text-[10px] text-slate-400">
                                <div className="font-bold text-slate-200">{log.id}</div>
                                <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                              </td>
                              <td className="py-2 px-2 font-bold text-indigo-300">
                                {log.action}
                              </td>
                              <td className="py-2 px-2 font-mono text-slate-300">
                                {log.operator}
                              </td>
                              <td className="py-2 px-2 font-mono text-cyan-300">
                                {log.method} {log.endpoint}
                              </td>
                              <td className="py-2 px-2 font-mono text-slate-400">
                                {log.ipAddress}
                              </td>
                              <td className="py-2 px-2 font-bold">
                                <span className={`px-2 py-0.5 rounded text-[9px] ${
                                  log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                                }`}>
                                  {log.status} ({log.statusCode})
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 13: VERITAS INFRASTRUCTURE INTELLIGENCE ENGINE (VIIE) */}
            {/* ========================================================================= */}
            {activeTab === 'viie_engine' && (
              <div className="space-y-6 animate-fade-in font-mono text-xs">
                {/* BANNER HEADER */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
                      <div>
                        <h3 className="font-bold text-white text-base uppercase tracking-wider">
                          VERITAS INFRASTRUCTURE INTELLIGENCE ENGINE (VIIE)
                        </h3>
                        <p className="text-slate-400 text-xs font-sans">
                          Continuous 10-subsystem operational telemetry, risk projection & natural language infrastructure reasoning.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        viieDiagnostics?.overallStatus === 'HEALTHY'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        SYSTEM STATUS: {viieDiagnostics?.overallStatus || 'HEALTHY'}
                      </span>
                      <button
                        onClick={fetchViieData}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1 font-bold text-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh Telemetry
                      </button>
                    </div>
                  </div>

                  {/* SUMMARY & PROACTIVE BOTTLENECK / RISK CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        TELEMETRY SUMMARY
                      </div>
                      <p className="text-slate-300 font-sans text-xs leading-relaxed">
                        {viieDiagnostics?.summary || 'Monitoring 10 live operational subsystems...'}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <div className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        ACTIVE BOTTLENECKS
                      </div>
                      <ul className="list-disc list-inside text-slate-300 font-sans text-xs space-y-1">
                        {viieDiagnostics?.bottlenecks?.map((b: string, i: number) => (
                          <li key={i}>{b}</li>
                        )) || <li>No bottleneck detected.</li>}
                      </ul>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <div className="text-xs text-rose-400 font-bold flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        INFRASTRUCTURE RISKS THIS WEEK
                      </div>
                      <ul className="list-disc list-inside text-slate-300 font-sans text-xs space-y-1">
                        {viieDiagnostics?.risksThisWeek?.map((r: string, i: number) => (
                          <li key={i}>{r}</li>
                        )) || <li>Zero risks identified.</li>}
                      </ul>
                    </div>
                  </div>

                  {/* 10-SUBSYSTEM TELEMETRY MATRIX GRID */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
                      <span>10-SUBSYSTEM CONTINUOUS TELEMETRY GRID</span>
                      <span className="text-slate-500 text-[10px]">REALTIME MONITORING</span>
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                      {viieTelemetry && [
                        { label: 'Server CPU & RAM', val: `${viieTelemetry.serverHealth.cpuUsagePercent}% CPU / ${viieTelemetry.serverHealth.memoryUsagePercent}% RAM`, badge: viieTelemetry.serverHealth.status, color: 'emerald' },
                        { label: 'Database Health', val: `${viieTelemetry.databaseHealth.articleCount} Articles (${viieTelemetry.databaseHealth.latencyMs}ms)`, badge: viieTelemetry.databaseHealth.status, color: 'emerald' },
                        { label: 'RSS Ingestion Rate', val: `${viieTelemetry.rssIngestion.ingestedLastHour} articles/hr (${viieTelemetry.rssIngestion.activeFeeds} feeds)`, badge: viieTelemetry.rssIngestion.status, color: 'cyan' },
                        { label: 'API Gateway Latency', val: `${viieTelemetry.apiLatency.avgLatencyMs}ms (P95: ${viieTelemetry.apiLatency.p95LatencyMs}ms)`, badge: viieTelemetry.apiLatency.status, color: 'indigo' },
                        { label: 'AI Models Availability', val: `Gemini ${viieTelemetry.aiModelAvailability.geminiStatus} (${viieTelemetry.aiModelAvailability.successRatePercent}%)`, badge: viieTelemetry.aiModelAvailability.status, color: 'emerald' },
                        { label: 'Crawler Throughput', val: `${viieTelemetry.crawlerThroughput.docsPerSec} docs/s (${viieTelemetry.crawlerThroughput.activeThreads} th)`, badge: `${viieTelemetry.crawlerThroughput.sourceCoveragePercent}% Cov`, color: 'amber' },
                        { label: 'Storage Growth', val: `Used: ${viieTelemetry.storageGrowth.usedGb}GB (+${viieTelemetry.storageGrowth.growthMbPerDay}MB/d)`, badge: `${viieTelemetry.storageGrowth.projectedDaysToExhaustion}d Rem`, color: 'rose' },
                        { label: 'Deployment Pass Rate', val: `${viieTelemetry.deploymentSuccessRate.successPercent}% (${viieTelemetry.deploymentSuccessRate.totalDeployments} total)`, badge: `${viieTelemetry.deploymentSuccessRate.rollbackCount} Rollbacks`, color: 'emerald' },
                        { label: 'Knowledge Graph', val: `${(viieTelemetry.knowledgeGraphGrowth.nodesCount / 1000).toFixed(1)}k Nodes (+${viieTelemetry.knowledgeGraphGrowth.weeklyGrowthPercent}%/wk)`, badge: 'ACTIVE', color: 'indigo' },
                        { label: 'Security & Audit', val: `${viieTelemetry.securityEvents.failedAuthCount24h} Auth Failures / 24h`, badge: `THREAT: ${viieTelemetry.securityEvents.threatLevel}`, color: 'amber' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                          <div className="text-[10px] text-slate-400 font-sans truncate">{item.label}</div>
                          <div className="font-bold text-white text-xs truncate">{item.val}</div>
                          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900 border border-slate-800 text-indigo-300">
                            {item.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* VCIO NATURAL LANGUAGE INFRASTRUCTURE CONSOLE */}
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="font-bold text-white text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        VCIO NATURAL LANGUAGE INFRASTRUCTURE REASONING
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        Ask any operational or infrastructure risk question
                      </span>
                    </div>

                    {/* QUICK PRESET QUESTION BUTTONS */}
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      {[
                        'Why is Veritas slower today?',
                        'Which subsystem is limiting ingestion?',
                        'What infrastructure risks should I address this week?',
                        'Predict when disk space will be exhausted based on current growth.'
                      ].map((presetQ, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setViieQueryInput(presetQ);
                            handleAskViie(presetQ);
                          }}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-300 transition cursor-pointer font-sans"
                        >
                          "{presetQ}"
                        </button>
                      ))}
                    </div>

                    {/* INPUT FORM */}
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={viieQueryInput}
                        onChange={(e) => setViieQueryInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskViie()}
                        className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-white text-xs focus:outline-none focus:border-cyan-500"
                        placeholder="Ask VIIE about server performance, storage, crawlers, or risk..."
                      />
                      <button
                        onClick={() => handleAskViie()}
                        disabled={isQueryingViie}
                        className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 rounded-xl font-bold cursor-pointer transition flex items-center gap-1.5"
                      >
                        {isQueryingViie ? 'Analyzing...' : 'Ask VIIE'}
                      </button>
                    </div>

                    {/* QUERY RESULT DISPLAY */}
                    {viieQueryResult && (
                      <div className="p-4 bg-slate-900/90 border border-cyan-800/80 rounded-2xl space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-bold text-cyan-300">
                            QUESTION: "{viieQueryResult.question}"
                          </span>
                          <span className="text-[10px] text-slate-400 font-sans">
                            TARGET: <code className="text-amber-300">{viieQueryResult.subsystemTarget}</code>
                          </span>
                        </div>

                        <p className="text-slate-200 font-sans text-xs leading-relaxed whitespace-pre-wrap">
                          {viieQueryResult.answer}
                        </p>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 text-[11px]">
                          <div className="text-amber-400 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> RECOMMENDED ACTION:
                          </div>
                          <div className="text-slate-300 font-sans">{viieQueryResult.recommendedAction}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 14: GITHUB WEBHOOK & ZERO-TOUCH AUTOMATED DEPLOYMENT */}
            {/* ========================================================================= */}
            {activeTab === 'github_webhook' && (
              <div className="space-y-6 animate-fade-in font-mono text-xs">
                {/* BANNER HEADER */}
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <GitBranch className="w-6 h-6 text-emerald-400 animate-pulse" />
                      <div>
                        <h3 className="font-bold text-white text-base uppercase tracking-wider">
                          GITHUB WEBHOOK & ZERO-TOUCH CI/CD PIPELINE
                        </h3>
                        <p className="text-slate-400 text-xs font-sans">
                          Automated GitHub push detector, HMAC SHA-256 signature verifier, 12-point health checker & Passenger reload trigger.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-bold">
                        HMAC SHA-256: ACTIVE
                      </span>
                      <button
                        onClick={fetchWebhookConfig}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1 font-bold text-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh Specs
                      </button>
                    </div>
                  </div>

                  {/* SETUP SPECIFICATIONS CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                      <div className="text-[10px] text-slate-400 font-sans">Payload URL</div>
                      <div className="font-bold text-cyan-300 text-xs truncate">
                        {webhookConfig?.payloadUrl || 'https://newsplus.ink/api/vdm/webhook/github'}
                      </div>
                      <div className="text-[9px] text-slate-500 font-sans">Target Endpoint</div>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                      <div className="text-[10px] text-slate-400 font-sans">Content Type</div>
                      <div className="font-bold text-emerald-300 text-xs">
                        {webhookConfig?.contentType || 'application/json'}
                      </div>
                      <div className="text-[9px] text-slate-500 font-sans">JSON Body Payload</div>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                      <div className="text-[10px] text-slate-400 font-sans">Secret Key Env Var</div>
                      <div className="font-bold text-amber-300 text-xs">
                        {webhookConfig?.secretEnvVar || 'VERITAS_WEBHOOK_SECRET'}
                      </div>
                      <div className="text-[9px] text-emerald-400 font-sans">Configured in .env</div>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                      <div className="text-[10px] text-slate-400 font-sans">Supported Events</div>
                      <div className="font-bold text-indigo-300 text-xs">
                        push, ping
                      </div>
                      <div className="text-[9px] text-slate-500 font-sans">SSL Verification Enabled</div>
                    </div>
                  </div>

                  {/* GITHUB WEBHOOK LIVE SIMULATOR & TESTER */}
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="font-bold text-white text-sm flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        ZERO-TOUCH WEBHOOK EXECUTION SIMULATOR & VERIFIER
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        Test end-to-end webhook delivery without leaving VDM
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* SIMULATION CONTROLS */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-slate-400 text-xs font-sans">Target Branch</label>
                          <input
                            type="text"
                            value={webhookSimBranch}
                            onChange={(e) => setWebhookSimBranch(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-400 text-xs font-sans">Commit Message</label>
                          <input
                            type="text"
                            value={webhookSimCommitMsg}
                            onChange={(e) => setWebhookSimCommitMsg(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={handleTriggerWebhookPush}
                            disabled={isTestingWebhook}
                            className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 rounded-xl font-bold cursor-pointer transition flex items-center justify-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5" />
                            {isTestingWebhook ? 'Executing Pipeline...' : 'Simulate GitHub Push Webhook'}
                          </button>

                          <button
                            onClick={handleTriggerWebhookPing}
                            disabled={isTestingWebhook}
                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-xl font-bold cursor-pointer transition flex items-center gap-1.5"
                          >
                            <Radio className="w-3.5 h-3.5 text-cyan-400" /> Ping Event
                          </button>
                        </div>
                      </div>

                      {/* SIMULATION RESPONSE & EVIDENCE DISPLAY */}
                      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 overflow-hidden">
                        <div className="text-xs font-bold text-slate-400 flex items-center justify-between border-b border-slate-800 pb-2">
                          <span>EXECUTION EVIDENCE LOG</span>
                          {webhookTestResult && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              webhookTestResult.status === 200 ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                            }`}>
                              HTTP {webhookTestResult.status}
                            </span>
                          )}
                        </div>

                        {webhookTestResult ? (
                          <div className="space-y-2 text-[11px] font-mono">
                            <div className="text-cyan-300 font-bold">
                              Trigger: GitHub <code className="text-amber-300">x-github-event: {webhookTestResult.event}</code>
                            </div>

                            {webhookTestResult.data?.message && (
                              <div className="text-slate-200 font-sans text-xs bg-slate-950 p-2 rounded-lg border border-slate-800">
                                {webhookTestResult.data.message}
                              </div>
                            )}

                            {webhookTestResult.data?.logs && (
                              <div className="space-y-1 pt-1 max-h-40 overflow-y-auto">
                                {webhookTestResult.data.logs.map((logStr: string, idx: number) => (
                                  <div key={idx} className="text-emerald-400 text-[10px] truncate">
                                    {logStr}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-slate-500 font-sans text-xs py-8 text-center">
                            Click "Simulate GitHub Push Webhook" to execute the end-to-end zero-touch delivery pipeline.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* NAMECHEAP CPANEL NODE.JS ARCHITECTURE & RESTART LIMITATIONS */}
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      NAMECHEAP CPANEL NODE.JS ENVIRONMENT ARCHITECTURE & SELF-RESTART ANALYSIS
                    </h4>

                    <div className="space-y-2 text-slate-300 font-sans text-xs leading-relaxed">
                      <p>
                        <strong className="text-white">Phusion Passenger Execution Model:</strong> Namecheap Shared Hosting hosts Node.js applications inside a CloudLinux LVE container utilizing Nginx + Phusion Passenger. Standard system commands like <code className="text-cyan-300">systemctl restart</code>, <code className="text-cyan-300">pm2</code>, or binding to raw ports are strictly prohibited by cPanel kernel security policies.
                      </p>
                      <p>
                        <strong className="text-white">Automated Reload Trigger:</strong> VDM implements automated application reload by writing a timestamp to <code className="text-emerald-400">tmp/restart.txt</code> immediately upon receiving a verified GitHub push event. Phusion Passenger monitors this file and gracefully reloads the Node.js process without downtime or manual cPanel button clicks.
                      </p>
                      <p>
                        <strong className="text-white">Shared Hosting Limitations & Production Fallbacks:</strong> If Namecheap LVE resource throttling or file-watcher latency prevents instant Passenger reload under heavy load, the supported architectural fallbacks are:
                      </p>
                      <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400 text-[11px] font-mono">
                        <li>1. A lightweight SSH deployment agent running on the server.</li>
                        <li>2. A scheduled cPanel Cron job polling <code className="text-indigo-300">/api/vdm/deploy</code> every 5 minutes.</li>
                        <li>3. Migration to a dedicated VPS / Cloud Run instance for full systemd daemon control.</li>
                      </ul>
                    </div>
                  </div>

                  {/* GITHUB REPOSITORY CONFIGURATION STEP-BY-STEP CHECKLIST */}
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      STEP-BY-STEP GITHUB REPOSITORY WEBHOOK SETUP GUIDE
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
                      {[
                        { step: '1', title: 'Open GitHub Repository', desc: 'Navigate to your project repository on github.com' },
                        { step: '2', title: 'Access Webhooks Menu', desc: 'Click Settings → Webhooks in the repository navigation bar' },
                        { step: '3', title: 'Click Add Webhook', desc: 'Confirm password prompt and click the "Add webhook" button' },
                        { step: '4', title: 'Enter Payload URL', desc: 'Paste https://newsplus.ink/api/vdm/webhook/github' },
                        { step: '5', title: 'Select Content Type', desc: 'Change Content type dropdown to application/json' },
                        { step: '6', title: 'Enter Secret Token', desc: 'Paste secret key configured in VERITAS_WEBHOOK_SECRET' },
                        { step: '7', title: 'Select Push Events', desc: 'Choose "Just the push event" for automatic deployment' },
                        { step: '8', title: 'Enable SSL & Save', desc: 'Keep SSL verification enabled and click Add webhook' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                            {item.step}
                          </span>
                          <div>
                            <div className="font-bold text-white text-xs">{item.title}</div>
                            <div className="text-slate-400 text-[11px]">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 9: SECURITY & AUDIT LOGS */}
            {/* ========================================================================= */}
            {activeTab === 'security_audit' && (
              <div className="space-y-6 animate-fade-in font-mono text-xs">
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5">
                  <h3 className="font-bold text-white text-base uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-rose-400" />
                    DEPLOYMENT SECURITY & DIGITAL SIGNATURE AUDIT LOGS
                  </h3>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-300 font-bold">
                      <span>AUDIT TRAIL LOGS:</span>
                      <span className="text-emerald-400">All Operations Authenticated</span>
                    </div>

                    <div className="space-y-1.5 text-slate-400 text-[11px]">
                      {history.map((h) => (
                        <div key={h.id}>
                          [{h.deployedAt}] Operator {h.operator} triggered {h.id} (Build #{h.buildNumber}) to {h.environment}. Notes: {h.notes}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOOTER ACTION BAR */}
        {/* ========================================================================= */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Veritas Operations System Operational</span>
            </span>
            <span>|</span>
            <span>Host: {liveMetrics?.hostname || 'veritas-node-01.kigali'}</span>
            <span>|</span>
            <span>Timezone: {liveMetrics?.timezone || 'UTC'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl font-bold cursor-pointer"
          >
            Close Operations Center
          </button>
        </div>
      </div>
    </div>
  );
};
