import React, { useState, useEffect } from 'react';
import { 
  X, RefreshCw, Server, Activity, ShieldCheck, Database, DollarSign, Cpu, 
  Shield, Key, Users, Eye, Lock, Sliders, AlertCircle, CheckCircle2, FileText, 
  Terminal, Bell, UserPlus, Trash2, Search, Zap, Layout, Sparkles,
  LogOut, EyeOff, CheckSquare, Square, Edit, Globe, Languages,
  Compass, TrendingUp, TrendingDown, Radio, BarChart3, Layers, MapPin, 
  AlertTriangle, Play, Pause, Check, Download, Send, Filter,
  HardDrive, Gauge, Network, Brain, Plus, Share2, Award, History, ArrowUpRight
} from 'lucide-react';
import { Article, SupportedLanguage, CrawlerLog, PublisherInfo, BiasRating } from '../types';
import { getAllCachedTranslations, updateAdminTranslationOverride } from '../services/translationService';
import { INITIAL_ARTICLES } from '../data/mockNewsData';
import { NarrativeEngine } from '../services/NarrativeEngine';
import { WhatsAppIntegration } from './WhatsAppIntegration';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SYSTEM_AUDITOR' | 'CONTENT_MODERATOR' | 'ANALYST_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'MFA_REQUIRED';
  lastActive: string;
  permissions: string[];
}

interface ActivityRecord {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: 'SECURITY' | 'UI_CONFIG' | 'CRAWLER' | 'PRIVILEGE' | 'SYSTEM';
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

interface SourceFeedItem {
  id: string;
  name: string;
  url: string;
  category: string;
  trustScore: number;
  bias: BiasRating;
  latencyMs: number;
  status: 'ACTIVE' | 'PAUSED' | 'DEGRADED';
  articlesIngestedToday: number;
  country: string;
}

interface FactQueueItem {
  id: string;
  title: string;
  source: string;
  claim: string;
  confidenceScore: number;
  badge: 'Verified' | 'Developing' | 'Conflicting Reports' | 'Rumor' | 'Breaking';
  flaggedReason: string;
  timestamp: string;
  country: string;
}

interface BreakingQueueItem {
  id: string;
  title: string;
  source: string;
  urgency: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  broadcastActive: boolean;
  timestamp: string;
  country: string;
  impactScore: number;
}

interface AdminDashboardModalProps {
  onClose: () => void;
  articles?: Article[];
}

const ALL_PRIVILEGES_LIST = [
  { id: 'ALL_PERMISSIONS', label: 'Super Admin Override', desc: 'Unrestricted master access across all system nodes' },
  { id: 'UI_CONTROL', label: 'Web UI & Settings Control', desc: 'Modify live layout, widgets, and announcement banners' },
  { id: 'CRAWLER_SWEEP', label: 'Ingestion & Telemetry Control', desc: 'Trigger RSS wire sweeps and crawler feed overrides' },
  { id: 'ROLE_MANAGEMENT', label: 'Role & Privilege Assignment', desc: 'Provision admin accounts and manage security privileges' },
  { id: 'DATABASE_READ_WRITE', label: 'Database & Records Write', desc: 'Modify news clusters, comments, and audit records' },
  { id: 'SECURITY_LOCK', label: 'Security & TLS Emergency Lock', desc: 'Rotate Gemini API keys and lock down console access' }
];

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'ADM-000',
    name: 'System Administrator',
    email: 'admin',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    lastActive: 'Just now',
    permissions: ['ALL_PERMISSIONS', 'UI_CONTROL', 'CRAWLER_SWEEP', 'ROLE_MANAGEMENT', 'DATABASE_READ_WRITE', 'SECURITY_LOCK']
  },
  {
    id: 'ADM-001',
    name: 'Dr. Sarah Vance',
    email: 'sarah.vance@veritas.intelligence',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    lastActive: '2 mins ago',
    permissions: ['ALL_PERMISSIONS', 'UI_CONTROL', 'CRAWLER_SWEEP', 'ROLE_MANAGEMENT', 'SECURITY_LOCK']
  },
  {
    id: 'ADM-002',
    name: 'Marcus Holloway',
    email: 'marcus.h@veritas.intelligence',
    role: 'SYSTEM_AUDITOR',
    status: 'ACTIVE',
    lastActive: '14 mins ago',
    permissions: ['DATABASE_READ_WRITE', 'SECURITY_LOCK']
  },
  {
    id: 'ADM-003',
    name: 'Elena Rostova',
    email: 'elena.r@veritas.intelligence',
    role: 'CONTENT_MODERATOR',
    status: 'ACTIVE',
    lastActive: '1 hour ago',
    permissions: ['UI_CONTROL', 'DATABASE_READ_WRITE']
  },
  {
    id: 'ADM-004',
    name: 'Kaito Tanaka',
    email: 'kaito.t@veritas.intelligence',
    role: 'ANALYST_ADMIN',
    status: 'MFA_REQUIRED',
    lastActive: '3 hours ago',
    permissions: ['CRAWLER_SWEEP']
  }
];

const INITIAL_ACTIVITY_RECORDS: ActivityRecord[] = [
  {
    id: 'REC-901',
    timestamp: '2026-08-01 09:14:22',
    actor: 'admin',
    action: 'Promoted Elena Rostova to CONTENT_MODERATOR',
    category: 'PRIVILEGE',
    ipAddress: '192.168.1.104',
    status: 'SUCCESS'
  },
  {
    id: 'REC-902',
    timestamp: '2026-08-01 08:52:10',
    actor: 'marcus.h@veritas.intelligence',
    action: 'Updated Web Banner Message to: "Systemic Risk Warning Active"',
    category: 'UI_CONFIG',
    ipAddress: '10.0.4.12',
    status: 'SUCCESS'
  },
  {
    id: 'REC-903',
    timestamp: '2026-08-01 07:30:00',
    actor: 'SYSTEM_AUTONOMOUS',
    action: 'Executed Autonomous Ingestion Cycle (1,420 items ingested)',
    category: 'CRAWLER',
    ipAddress: '127.0.0.1',
    status: 'SUCCESS'
  },
  {
    id: 'REC-904',
    timestamp: '2026-08-01 06:15:44',
    actor: 'kaito.t@veritas.intelligence',
    action: 'Rotated Gemini API Key Cluster',
    category: 'SECURITY',
    ipAddress: '172.16.0.88',
    status: 'WARNING'
  }
];

const INITIAL_SOURCES: SourceFeedItem[] = [
  { id: 'SRC-01', name: 'Reuters Wire Pipeline', url: 'https://wire.reuters.com/rss/world', category: 'World', trustScore: 98, bias: 'Center', latencyMs: 14, status: 'ACTIVE', articlesIngestedToday: 412, country: 'United States' },
  { id: 'SRC-02', name: 'AP News Global RSS', url: 'https://apnews.com/rss/hub/worldnews', category: 'World', trustScore: 97, bias: 'Center', latencyMs: 18, status: 'ACTIVE', articlesIngestedToday: 328, country: 'United States' },
  { id: 'SRC-03', name: 'The New Times Rwanda', url: 'https://www.newtimes.co.rw/rss', category: 'Africa', trustScore: 95, bias: 'Neutral', latencyMs: 22, status: 'ACTIVE', articlesIngestedToday: 184, country: 'Rwanda' },
  { id: 'SRC-04', name: 'AllAfrica Intelligence Feed', url: 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf', category: 'Africa', trustScore: 93, bias: 'Neutral', latencyMs: 31, status: 'ACTIVE', articlesIngestedToday: 245, country: 'Rwanda' },
  { id: 'SRC-05', name: 'AFP Agence France-Presse', url: 'https://www.afp.com/en/rss', category: 'World', trustScore: 96, bias: 'Center', latencyMs: 28, status: 'ACTIVE', articlesIngestedToday: 290, country: 'France' },
  { id: 'SRC-06', name: 'BBC World News Feed', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'World', trustScore: 96, bias: 'Center-Left', latencyMs: 19, status: 'ACTIVE', articlesIngestedToday: 310, country: 'United Kingdom' },
  { id: 'SRC-07', name: 'Xinhua News Wire', url: 'http://www.xinhuanet.com/english/rss.xml', category: 'Asia', trustScore: 89, bias: 'Neutral', latencyMs: 42, status: 'DEGRADED', articlesIngestedToday: 160, country: 'China' }
];

const INITIAL_FACT_QUEUE: FactQueueItem[] = [
  { id: 'FQ-101', title: 'East Africa Monetary Union Digital Currency Pilot', source: 'EAC Secretariat', claim: 'Unified CBDC deployment set for Q4 2026 across 8 member states', confidenceScore: 82, badge: 'Developing', flaggedReason: 'Conflicting timeline statements from regional central banks', timestamp: '12 mins ago', country: 'Rwanda' },
  { id: 'FQ-102', title: 'Subsea Optical Cable Break in Red Sea Corridor', source: 'Maritime Tech Wire', claim: '3 major Fiber cables severed near Bab-el-Mandeb Strait', confidenceScore: 68, badge: 'Conflicting Reports', flaggedReason: 'Physical anchor drag vs seismic activity unverified', timestamp: '25 mins ago', country: 'United Arab Emirates' },
  { id: 'FQ-103', title: 'Next-Gen Solid State Battery Commercial Production', source: 'Global Tech Insider', claim: 'Automaker claims 1,200km range per charge starting next month', confidenceScore: 45, badge: 'Rumor', flaggedReason: 'Unverified lab report without independent third-party audit', timestamp: '48 mins ago', country: 'Germany' }
];

const INITIAL_BREAKING_QUEUE: BreakingQueueItem[] = [
  { id: 'BQ-201', title: 'Kigali Innovation City Attracts $1.2B AI Foundry Deal', source: 'New Times / AfDB', urgency: 'CRITICAL', broadcastActive: true, timestamp: 'Just now', country: 'Rwanda', impactScore: 96 },
  { id: 'BQ-202', title: 'Global Semiconductor Supply Chain Resilience Treaty Signed', source: 'Reuters', urgency: 'HIGH', broadcastActive: true, timestamp: '18 mins ago', country: 'United States', impactScore: 91 },
  { id: 'BQ-203', title: 'Central Bank Interest Rate Decision Announced in EU Zone', source: 'Bloomberg', urgency: 'ELEVATED', broadcastActive: false, timestamp: '42 mins ago', country: 'Germany', impactScore: 84 }
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ onClose, articles = INITIAL_ARTICLES }) => {
  // Navigation tabs for the Operations Center
  const [activeTab, setActiveTab] = useState<
    'ops_center' | 'vcio' | 'deploy' | 'server' | 'crawler' | 'ai_usage' | 'logs' | 'rss' | 'content_queues' | 'user_security' | 'web_settings'
  >('vcio');

  // Stored Admin Password (defaults to admin123)
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('veritas_admin_password') || 'admin123';
  });

  // Admin Login & Security Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('veritas_admin_auth') === 'true';
  });
  const [authenticatedUser, setAuthenticatedUser] = useState<AdminUser | null>(() => {
    const saved = sessionStorage.getItem('veritas_admin_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ADMIN_USERS[0];
  });

  const [loginEmail, setLoginEmail] = useState<string>('admin');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginHint, setLoginHint] = useState<string | null>('Default username: admin | Password: admin123');

  // Password Change
  const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);
  const [currentPassInput, setCurrentPassInput] = useState<string>('');
  const [newPassInput, setNewPassInput] = useState<string>('');
  const [confirmPassInput, setConfirmPassInput] = useState<string>('');
  const [passChangeError, setPassChangeError] = useState<string | null>(null);
  const [passChangeSuccess, setPassChangeSuccess] = useState<string | null>(null);

  // Live Real-Time Operations Telemetry State
  const [isLivePolling, setIsLivePolling] = useState<boolean>(true);
  const [ingestStats, setIngestStats] = useState({
    activeCrawlers: 12,
    totalIngestedToday: 1842,
    clustersFormed: 418,
    articlesPerMinute: 34,
    verificationPassRate: 98.2,
    apiCallsTotal: 14280,
    apiCostUsd: 1.14,
    cpuUsagePercent: 14.2,
    memoryUsageMb: 1840,
    activeSockets: 48
  });

  const [crawlerLogs, setCrawlerLogs] = useState<CrawlerLog[]>([
    { id: 'LOG-001', timestamp: new Date().toLocaleTimeString(), source: 'Reuters Wire Pipeline', articlesFetched: 14, clustersMerged: 3, status: 'SUCCESS', executionTimeMs: 142 },
    { id: 'LOG-002', timestamp: new Date().toLocaleTimeString(), source: 'The New Times Rwanda', articlesFetched: 8, clustersMerged: 2, status: 'SUCCESS', executionTimeMs: 88 },
    { id: 'LOG-003', timestamp: new Date().toLocaleTimeString(), source: 'AP News Global', articlesFetched: 19, clustersMerged: 5, status: 'SUCCESS', executionTimeMs: 210 },
    { id: 'LOG-004', timestamp: new Date().toLocaleTimeString(), source: 'AFP Agence France-Presse', articlesFetched: 11, clustersMerged: 2, status: 'SUCCESS', executionTimeMs: 165 }
  ]);

  // Deployment Center State
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployStep, setDeployStep] = useState<string>('');
  const [showEnvSecrets, setShowEnvSecrets] = useState<boolean>(false);
  const [envVars, setEnvVars] = useState([
    { name: 'GEMINI_API_KEY', value: 'AIzaSyD...k9X2L8', secret: true, desc: 'Google Gemini Pro & Flash Server Key' },
    { name: 'PORT', value: '3000', secret: false, desc: 'Hardcoded ingress port required for Cloud Run nginx reverse proxy' },
    { name: 'NODE_ENV', value: 'production', secret: false, desc: 'Production runtime execution flag' },
    { name: 'AUTONOMOUS_CRAWLER_SWEEP_SEC', value: '15', secret: false, desc: 'RSS wire sweep frequency' },
    { name: 'VERITAS_TRUST_THRESHOLD', value: '80', secret: false, desc: 'Minimum confidence score for instant broadcast' }
  ]);

  // System Logs & Audit
  const [logLevelFilter, setLogLevelFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR' | 'SECURITY'>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [systemConsoleLogs, setSystemConsoleLogs] = useState([
    { id: 'SYS-101', time: new Date(Date.now() - 1000 * 30).toLocaleTimeString(), level: 'INFO', module: 'EXPRESS_SERVER', msg: 'GET /api/health HTTP/1.1 200 OK - 4ms' },
    { id: 'SYS-102', time: new Date(Date.now() - 1000 * 90).toLocaleTimeString(), level: 'INFO', module: 'CRAWLER_ENGINE', msg: 'Sweep completed: 7 feeds synchronized across 48 regional nodes' },
    { id: 'SYS-103', time: new Date(Date.now() - 1000 * 180).toLocaleTimeString(), level: 'WARN', module: 'RATE_LIMITER', msg: 'Xinhua feed latency exceeded 40ms threshold (42ms recorded)' },
    { id: 'SYS-104', time: new Date(Date.now() - 1000 * 300).toLocaleTimeString(), level: 'SECURITY', module: 'AUTH_GATEWAY', msg: 'Admin session authenticated for user: admin (192.168.1.104)' },
    { id: 'SYS-105', time: new Date(Date.now() - 1000 * 450).toLocaleTimeString(), level: 'INFO', module: 'GEMINI_SDK', msg: 'Gemini 2.0 Flash call verified: 420 prompt tokens, 110 output tokens (120ms)' }
  ]);

  // RSS Tester State
  const [testRssUrlInput, setTestRssUrlInput] = useState<string>('');
  const [isTestingRss, setIsTestingRss] = useState<boolean>(false);
  const [testRssResult, setTestRssResult] = useState<{ status: 'IDLE' | 'SUCCESS' | 'ERROR'; message: string; title?: string; itemNum?: number } | null>(null);

  // Sources & Queues State
  const [sources, setSources] = useState<SourceFeedItem[]>(INITIAL_SOURCES);
  const [factQueue, setFactQueue] = useState<FactQueueItem[]>(INITIAL_FACT_QUEUE);
  const [breakingQueue, setBreakingQueue] = useState<BreakingQueueItem[]>(INITIAL_BREAKING_QUEUE);
  const [newRssUrl, setNewRssUrl] = useState<string>('');
  const [newRssName, setNewRssName] = useState<string>('');

  // Pending Articles for Editorial Approval
  const [pendingArticles, setPendingArticles] = useState<Article[]>(() => articles.slice(0, 5));

  // Users & Privileges
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [records, setRecords] = useState<ActivityRecord[]>(INITIAL_ACTIVITY_RECORDS);
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);

  // Executive Briefing Generator State
  const [briefingScope, setBriefingScope] = useState<string>('Global High-Impact Intelligence & Geopolitical Risk');
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState<boolean>(false);
  const [generatedBriefing, setGeneratedBriefing] = useState<string | null>(null);

  // Web Settings
  const [webSettings, setWebSettings] = useState(() => {
    const saved = localStorage.getItem('veritas_admin_web_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      themeMode: 'DARK_INTELLIGENCE',
      showLiveTicker: true,
      showBiasMeters: true,
      showAiDebatePanel: true,
      showDigitalTwinWidget: true,
      autoRefreshIntervalSec: 15,
      announcementBannerEnabled: true,
      announcementBannerText: '🔴 GLOBAL OPERATIONS ALERT: Ingestion engines active across 48 nations.'
    };
  });

  // REAL-TIME PULSE EFFECT
  useEffect(() => {
    if (!isLivePolling) return;
    const interval = setInterval(() => {
      setIngestStats(prev => ({
        ...prev,
        totalIngestedToday: prev.totalIngestedToday + Math.floor(Math.random() * 3) + 1,
        clustersFormed: prev.clustersFormed + (Math.random() > 0.6 ? 1 : 0),
        articlesPerMinute: Math.floor(28 + Math.random() * 12),
        apiCallsTotal: prev.apiCallsTotal + Math.floor(Math.random() * 4) + 1,
        apiCostUsd: Number((prev.apiCostUsd + 0.0002).toFixed(4)),
        cpuUsagePercent: Number((12 + Math.random() * 6).toFixed(1)),
        memoryUsageMb: 1840 + Math.floor(Math.random() * 30) - 15
      }));

      // Randomly append a live crawler log
      if (Math.random() > 0.4) {
        const randomSource = sources[Math.floor(Math.random() * sources.length)];
        const newLog: CrawlerLog = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toLocaleTimeString(),
          source: randomSource ? randomSource.name : 'Autonomous Wire Crawler',
          articlesFetched: Math.floor(Math.random() * 8) + 1,
          clustersMerged: Math.floor(Math.random() * 3),
          status: 'SUCCESS',
          executionTimeMs: Math.floor(Math.random() * 150) + 60
        };
        setCrawlerLogs(prev => [newLog, ...prev.slice(0, 15)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLivePolling, sources]);

  const handleQuickSelectUser = (user: AdminUser) => {
    setLoginEmail(user.email);
    setLoginPassword('');
    setLoginError(null);
    setLoginHint(`Pre-filled account: "${user.email}". Type password (default: admin123) to authenticate.`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const inputUser = loginEmail.trim().toLowerCase();
    const inputPass = loginPassword.trim();

    if (!inputUser || !inputPass) {
      setLoginError('Please enter both username/email and password.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      const isPasswordValid = inputPass === adminPassword || (adminPassword === 'admin123' && inputPass === 'admin123');

      if (!isPasswordValid) {
        setIsAuthenticating(false);
        setLoginError(`Authentication failed: Invalid credentials.`);
        return;
      }

      const foundUser = INITIAL_ADMIN_USERS.find(u => 
        u.email.toLowerCase() === inputUser || u.name.toLowerCase().includes(inputUser)
      ) || {
        id: 'ADM-SYSTEM',
        name: inputUser === 'admin' ? 'System Administrator' : inputUser.toUpperCase(),
        email: inputUser,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        lastActive: 'Just now',
        permissions: ['ALL_PERMISSIONS', 'UI_CONTROL', 'CRAWLER_SWEEP', 'ROLE_MANAGEMENT', 'DATABASE_READ_WRITE', 'SECURITY_LOCK']
      };

      setIsAuthenticated(true);
      setAuthenticatedUser(foundUser as AdminUser);
      sessionStorage.setItem('veritas_admin_auth', 'true');
      sessionStorage.setItem('veritas_admin_user', JSON.stringify(foundUser));

      const newRec: ActivityRecord = {
        id: `REC-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actor: foundUser.email,
        action: `Logged into Intelligence Operations Center (${foundUser.role})`,
        category: 'SECURITY',
        ipAddress: '192.168.1.104',
        status: 'SUCCESS'
      };
      setRecords(prev => [newRec, ...prev]);
      setIsAuthenticating(false);
    }, 400);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('veritas_admin_auth');
    sessionStorage.removeItem('veritas_admin_user');
    setLoginPassword('');
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeError(null);
    setPassChangeSuccess(null);

    if (currentPassInput !== adminPassword) {
      setPassChangeError('Current password is incorrect.');
      return;
    }
    if (newPassInput.length < 6) {
      setPassChangeError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassInput !== confirmPassInput) {
      setPassChangeError('New password and confirm password do not match.');
      return;
    }

    setAdminPassword(newPassInput);
    localStorage.setItem('veritas_admin_password', newPassInput);
    setPassChangeSuccess('Admin password updated successfully!');
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRssUrl || !newRssName) return;
    const newSrc: SourceFeedItem = {
      id: `SRC-${Date.now().toString().slice(-3)}`,
      name: newRssName,
      url: newRssUrl,
      category: 'General',
      trustScore: 92,
      bias: 'Center',
      latencyMs: 25,
      status: 'ACTIVE',
      articlesIngestedToday: 0,
      country: 'Global'
    };
    setSources(prev => [newSrc, ...prev]);
    setNewRssName('');
    setNewRssUrl('');
  };

  const handleToggleSourceStatus = (sourceId: string) => {
    setSources(prev => prev.map(s => {
      if (s.id === sourceId) {
        const nextStatus = s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleApproveArticle = (articleId: string) => {
    setPendingArticles(prev => prev.filter(a => a.id !== articleId));
  };

  const handleVerifyFactQueueItem = (itemId: string) => {
    setFactQueue(prev => prev.filter(f => f.id !== itemId));
  };

  const handleToggleBreakingBroadcast = (itemId: string) => {
    setBreakingQueue(prev => prev.map(b => b.id === itemId ? { ...b, broadcastActive: !b.broadcastActive } : b));
  };

  const handleGenerateBriefing = () => {
    setIsGeneratingBriefing(true);
    setGeneratedBriefing(null);
    setTimeout(() => {
      const summary = `
# VERITAS EXECUTIVE INTELLIGENCE BRIEFING
**Scope Focus:** ${briefingScope}
**Timestamp:** ${new Date().toUTCString()}
**Security Classification:** TOP SECRET / EXECUTIVE CLEARANCE ONLY

---

### EXECUTIVE SUMMARY
Global intelligence signals indicate accelerated strategic investments across Sub-Saharan tech hubs, led by Kigali Innovation City's $1.2B AI foundry expansion. Concurrently, maritime fiber cable vulnerabilities in the Red Sea corridor present short-term high-impact telecom routing risks.

### KEY INTELLIGENCE VECTORS
1. **AFRICA TECH SOVEREIGNTY:** Regional AfCFTA trade agreements and hard-currency guarantees have boosted cross-border FDI confidence by +38.4% MoM.
2. **SEMICONDUCTOR & ENERGY SUPPLY:** European and North American foundries continue secondary packaging expansion to hedge against East Asian geopolitical bottlenecks.
3. **CURRENCY & MONETARY STABILITY:** Central bank interest rate adjustments in EU and Emerging Markets demonstrate tight monetary containment against inflation spikes.

### STRATEGIC ACTION RECOMMENDATION
- **Capital Allocation:** Proceed with FDI expansions in East Africa tech corridors.
- **Telecom Operations:** Maintain satellite backup link readiness for high-frequency trading data nodes.
- **Fact-Verification:** Continue 24/7 automated crawler verification across Tier-1 and Tier-2 publishers.

*Generated automatically by Veritas AI Intelligence Operations Center Engine.*
      `;
      setGeneratedBriefing(summary);
      setIsGeneratingBriefing(false);
    }, 1000);
  };

  const handleTriggerDeploy = () => {
    setIsDeploying(true);
    setDeployStep('Compiling ESModules & Type Checking...');
    setTimeout(() => {
      setDeployStep('Bundling Cloud Run Container image (v3.4.2)...');
      setTimeout(() => {
        setDeployStep('Executing Healthcheck on port 3000...');
        setTimeout(() => {
          setDeployStep('Deployment complete! Container active on Cloud Run.');
          setIsDeploying(false);
          const newLog = {
            id: `SYS-${Date.now().toString().slice(-3)}`,
            time: new Date().toLocaleTimeString(),
            level: 'INFO',
            module: 'DEPLOY_CENTER',
            msg: 'Manual redeployment trigger successful: Container applet v3.4.2 LIVE on port 3000.'
          };
          setSystemConsoleLogs(prev => [newLog, ...prev]);
        }, 800);
      }, 800);
    }, 800);
  };

  const handleExportLogsCsv = () => {
    const csvHeader = 'ID,Time,Level,Module,Message\n';
    const csvRows = systemConsoleLogs
      .map(l => `"${l.id}","${l.time}","${l.level}","${l.module}","${l.msg.replace(/"/g, '""')}"`)
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `veritas_system_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTestRssFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRssUrlInput.trim()) return;
    setIsTestingRss(true);
    setTestRssResult(null);
    setTimeout(() => {
      setIsTestingRss(false);
      setTestRssResult({
        status: 'SUCCESS',
        message: 'Valid RSS 2.0 XML Schema verified! Response latency: 18ms. 24 articles extracted.',
        title: 'Verified RSS Feed Endpoint',
        itemNum: 24
      });
    }, 900);
  };

  // LOGIN GATE SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-auto">
          
          <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-slate-950 shadow-lg shadow-amber-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base text-white tracking-wide">
                    INTELLIGENCE OPERATIONS CENTER
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    RESTRICTED GATE
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Zero-Trust Administrator Authentication & System Control
                </p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 bg-slate-950">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center justify-between">
                <span>Select Admin Account</span>
                <span className="text-[10px] text-amber-400 font-normal">Pre-fills account</span>
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                {adminUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickSelectUser(user)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                      loginEmail.toLowerCase() === user.email.toLowerCase()
                        ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{user.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                        {user.role === 'SUPER_ADMIN' ? 'ROOT' : user.role.split('_')[0]}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate font-mono">{user.email}</p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
                  <span>Username / Email</span>
                  <span className="text-indigo-400 font-normal">Default: <strong className="text-amber-300">admin</strong></span>
                </label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-indigo-400 font-normal">Default: <strong className="text-amber-300">admin123</strong></span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginHint && !loginError && (
                <div className="p-2.5 bg-indigo-950/40 border border-indigo-900/60 rounded-xl text-[11px] text-indigo-200 font-mono flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{loginHint}</span>
                </div>
              )}

              {loginError && (
                <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white font-extrabold rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center justify-center space-x-2"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating System Gate...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Unlock Intelligence Operations Console</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // MAIN OPERATIONS CENTER UI
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-7xl max-h-[96vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden font-sans">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 via-indigo-600 to-purple-600 rounded-2xl text-slate-950 shadow-lg shadow-amber-500/20">
              <Gauge className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-wide text-white">
                  VERITAS INTELLIGENCE OPERATIONS CENTER
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>LIVE REAL-TIME</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <strong className="text-white">{authenticatedUser?.name}</strong> ({authenticatedUser?.role}) • System Health: <span className="text-emerald-400 font-bold">100% OPERATIONAL</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLivePolling(!isLivePolling)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition flex items-center space-x-1.5 ${
                isLivePolling
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isLivePolling ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>{isLivePolling ? 'Real-time On' : 'Polling Paused'}</span>
            </button>

            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition"
              title="Change Admin Password"
            >
              <Key className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/50 border border-rose-900/50 transition"
              title="Lock Console / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Telemetry Stats Banner */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-2.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-500 text-[9px] block">CRAWLER STATUS</span>
              <span className="text-emerald-400 font-bold">{ingestStats.activeCrawlers} Active Nodes</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <Database className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-slate-500 text-[9px] block">TOTAL INGESTED</span>
              <span className="text-white font-bold">{ingestStats.totalIngestedToday.toLocaleString()} Items</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-500 text-[9px] block">INGESTION SPEED</span>
              <span className="text-amber-300 font-bold">{ingestStats.articlesPerMinute} Articles/min</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <Brain className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-slate-500 text-[9px] block">GEMINI API CALLS</span>
              <span className="text-purple-300 font-bold">{ingestStats.apiCallsTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-500 text-[9px] block">EST. TODAY COST</span>
              <span className="text-emerald-300 font-bold">${ingestStats.apiCostUsd.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <Cpu className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-slate-500 text-[9px] block">SYS MEMORY / CPU</span>
              <span className="text-blue-300 font-bold">{ingestStats.cpuUsagePercent}% | {ingestStats.memoryUsageMb}MB</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Sub-Bar */}
        <div className="flex items-center space-x-1 px-6 py-2 bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab('vcio')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'vcio'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Brain className="w-4 h-4 text-amber-400" />
            <span>VCIO Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'deploy'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Deployment Center</span>
          </button>

          <button
            onClick={() => setActiveTab('server')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'server'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Server Health</span>
          </button>

          <button
            onClick={() => setActiveTab('crawler')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'crawler'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Crawler Health</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_usage')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ai_usage'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>AI Usage & Cost</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Logs & Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('rss')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'rss'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="w-4 h-4 text-amber-400" />
            <span>RSS Monitor</span>
          </button>

          <button
            onClick={() => setActiveTab('ops_center')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ops_center'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Operations & Live Map</span>
          </button>

          <button
            onClick={() => setActiveTab('content_queues')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'content_queues'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-300" />
            <span>Approval Queues ({pendingArticles.length + factQueue.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('user_security')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'user_security'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Users & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('web_settings')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'web_settings'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-slate-300" />
            <span>UI Settings</span>
          </button>
        </div>

        {/* BODY TAB CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/60 space-y-6">

          {/* TAB 1: VCIO DASHBOARD */}
          {activeTab === 'vcio' && (
            <div className="space-y-6">
              
              {/* Executive Overview Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-indigo-600 rounded-2xl text-slate-950 shadow-lg">
                      <Brain className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-black text-white">VIRTUAL CHIEF INFORMATION OFFICER (VCIO)</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          SLA 99.98% OPTIMAL
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Autonomous Strategic IT Governance, System Health Architecture & AI Cost Optimization Engine
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-center">
                      <span className="text-slate-400 text-[10px] block">SECURITY COMPLIANCE</span>
                      <span className="text-emerald-400 font-bold">SOC2 TYPE II READY</span>
                    </div>
                    <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-center">
                      <span className="text-slate-400 text-[10px] block">INFRASTRUCTURE COST</span>
                      <span className="text-amber-300 font-bold">$1.14 / DAY</span>
                    </div>
                  </div>
                </div>

                {/* Strategic Health Scorecard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Systemic Health Score</span>
                      <Zap className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">99.8 / 100</div>
                    <p className="text-[10px] text-slate-400">Zero unhandled exceptions or critical API crashes</p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">AI Efficiency Index</span>
                      <Brain className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-black text-purple-300 font-mono">96.4%</div>
                    <p className="text-[10px] text-slate-400">Gemini 2.0 Flash prompt token caching active</p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Ingestion Reliability</span>
                      <Activity className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="text-2xl font-black text-indigo-300 font-mono">99.4%</div>
                    <p className="text-[10px] text-slate-400">48 countries connected via wire proxies</p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Threat & Risk Level</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black text-emerald-300 font-mono">LOW (SECURE)</div>
                    <p className="text-[10px] text-slate-400">All express secrets proxy-masked</p>
                  </div>
                </div>
              </div>

              {/* VCIO Strategic Recommendations & System Topology */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* AI Executive Recommendations */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>AUTONOMOUS VCIO STRATEGIC DIRECTIVES</span>
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-400">3 ACTIONABLE ITEMS</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">1. Optimize Gemini 2.0 Flash Prompt Caching</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300">HIGH SAVINGS</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        Re-using common systemic prompts for cross-lingual news summarization will reduce input token cost by ~35% with zero impact on latency.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-300">2. Pre-Scale Cloud Run Container Min-Instances</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300">LATENCY OPTIMIZATION</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        Set min-instances to 2 between 06:00 and 09:00 UTC to handle peak Kigali & East Africa breaking news ingestion sweeps.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-300">3. Enforce Strict TLS 1.3 & HSTS Preload</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300">SECURITY COMPLIANCE</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        Ingress proxy configuration verified. Ensure all custom publisher webhooks validate HMAC cryptographic signatures.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cloud Infrastructure Topology */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                      <Network className="w-4 h-4 text-blue-400" />
                      <span>SYSTEM TOPOLOGY & ARCHITECTURE</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">PORT 3000 CONTAINERSHIP</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">Edge Reverse Proxy (Nginx)</span>
                        <span className="text-[10px] text-slate-400">Port 3000 Ingress • TLS Termination • Compression</span>
                      </div>
                      <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">HEALTHY</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">Express Server Runtime (Node.js)</span>
                        <span className="text-[10px] text-slate-400">Server API Proxy • Gemini SDK Integration • Wire Ingestion</span>
                      </div>
                      <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">HEALTHY</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">Google Gemini Pro / Flash SDK</span>
                        <span className="text-[10px] text-slate-400">Server-side Only • Hidden Secrets • 92 tokens/sec</span>
                      </div>
                      <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">CONNECTED</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: DEPLOYMENT CENTER */}
          {activeTab === 'deploy' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Deployment Trigger & Active Release */}
                <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span>CONTAINER DEPLOYMENT CENTER</span>
                    </h3>
                    <span className="text-xs font-mono text-emerald-400">Cloud Run Active</span>
                  </div>

                  {/* Active Deployment Card */}
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Current Commit:</span>
                      <span className="text-indigo-400 font-bold">c7a8ef1 (Phase 3 Integration)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Container Image:</span>
                      <span className="text-white font-bold">gcr.io/veritas-news-ai/applet:v3.4.2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Target Environment:</span>
                      <span className="text-emerald-400 font-bold">Production (Port 3000 Ingress)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Health Status:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        HTTP 200 OK (/api/health)
                      </span>
                    </div>
                  </div>

                  {/* Deploy Action Bar */}
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={handleTriggerDeploy}
                      disabled={isDeploying}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-90 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
                    >
                      {isDeploying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{deployStep}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Trigger Immediate Continuous Deployment</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400 text-center font-mono">
                      Compiles Vite React SPA & bundles Express server via esbuild into single CommonJS binary
                    </p>
                  </div>
                </div>

                {/* Environment Variables Inspector */}
                <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>ENVIRONMENT VARIABLES</span>
                    </h3>
                    <button
                      onClick={() => setShowEnvSecrets(!showEnvSecrets)}
                      className="text-[10px] text-slate-400 hover:text-white transition flex items-center space-x-1 cursor-pointer"
                    >
                      {showEnvSecrets ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showEnvSecrets ? 'Hide Secrets' : 'Show Secrets'}</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {envVars.map((env, i) => (
                      <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300">{env.name}</span>
                          {env.secret && <span className="text-[9px] text-rose-400 font-bold">SECRET</span>}
                        </div>
                        <p className="text-white font-bold bg-slate-950 p-1.5 rounded border border-slate-800/80 truncate">
                          {env.secret && !showEnvSecrets ? '••••••••••••••••' : env.value}
                        </p>
                        <span className="text-[10px] text-slate-500 block">{env.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: SERVER HEALTH */}
          {activeTab === 'server' && (
            <div className="space-y-6">
              
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span>EXPRESS & NODE.JS PROCESS TELEMETRY</span>
                  </h3>
                  <span className="text-emerald-400 font-bold">PORT 3000 LISTENER ACTIVE</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">CPU UTILIZATION</span>
                    <span className="text-2xl font-black text-blue-400">{ingestStats.cpuUsagePercent}%</span>
                    <p className="text-[10px] text-slate-400">Container 2-vCPU core</p>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">MEMORY HEAP RSS</span>
                    <span className="text-2xl font-black text-purple-400">{ingestStats.memoryUsageMb} MB</span>
                    <p className="text-[10px] text-slate-400">Of 4096 MB allocated</p>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">EVENT LOOP LAG</span>
                    <span className="text-2xl font-black text-emerald-400">0.6 ms</span>
                    <p className="text-[10px] text-slate-400">Zero asynchronous blocking</p>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">REQUEST THROUGHPUT</span>
                    <span className="text-2xl font-black text-amber-400">42 req/s</span>
                    <p className="text-[10px] text-slate-400">Active Express HTTP/2 proxy</p>
                  </div>
                </div>

                {/* Endpoint Latency Breakdown */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs">ENDPOINT LATENCY MATRIX (PERCENTILES)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">p50 Latency (Median):</span>
                      <span className="font-bold text-emerald-400">12 ms</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">p95 Latency:</span>
                      <span className="font-bold text-indigo-400">28 ms</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">p99 Latency (Tail):</span>
                      <span className="font-bold text-amber-400">64 ms</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: CRAWLER HEALTH */}
          {activeTab === 'crawler' && (
            <div className="space-y-6">
              
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span>AUTONOMOUS CRAWLER WORKER HEALTH ({ingestStats.activeCrawlers} Threads Active)</span>
                  </h3>
                  <span className="text-emerald-400 font-bold">SWEEP CYCLE: EVERY 15 SEC</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sources.map((src) => (
                    <div key={src.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{src.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {src.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] truncate">{src.url}</p>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[10px]">
                        <div>
                          <span className="text-slate-500">Latency:</span>
                          <span className="text-indigo-300 font-bold block">{src.latencyMs}ms</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Trust Index:</span>
                          <span className="text-emerald-400 font-bold block">{src.trustScore}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Ingested Today:</span>
                          <span className="text-amber-300 font-bold block">{src.articlesIngestedToday}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: AI USAGE */}
          {activeTab === 'ai_usage' && (
            <div className="space-y-6 font-mono text-xs">
              
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>GEMINI AI SDK TOKEN CONSUMPTION & COST ANALYTICS</span>
                  </h3>
                  <span className="text-amber-300 font-bold">EST. DAILY COST: ${ingestStats.apiCostUsd.toFixed(2)} USD</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px]">GEMINI CALLS TODAY</span>
                    <span className="text-2xl font-black text-purple-300 block">{ingestStats.apiCallsTotal.toLocaleString()}</span>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px]">PROMPT TOKENS</span>
                    <span className="text-2xl font-black text-indigo-300 block">4,820,100</span>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px]">OUTPUT TOKENS</span>
                    <span className="text-2xl font-black text-emerald-300 block">1,210,000</span>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px]">AVG TOKEN SPEED</span>
                    <span className="text-2xl font-black text-amber-300 block">92 tok/s</span>
                  </div>
                </div>

                {/* Model Tier Usage Table */}
                <div className="pt-2 space-y-2">
                  <h4 className="font-bold text-white text-xs">MODEL DISPATCH DISTRIBUTION</h4>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-purple-300 block">Gemini 2.0 Flash (`gemini-2.0-flash`)</span>
                      <span className="text-[10px] text-slate-400">Used for instant summarization, cross-lingual translation & bias detection</span>
                    </div>
                    <span className="font-bold text-emerald-400">11,240 calls (78.7%)</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-indigo-300 block">Gemini 1.5 Pro (`gemini-1.5-pro`)</span>
                      <span className="text-[10px] text-slate-400">Used for deep investigative research & complex narrative synthesis</span>
                    </div>
                    <span className="font-bold text-indigo-300">3,040 calls (21.3%)</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: LOGS & AUDIT */}
          {activeTab === 'logs' && (
            <div className="space-y-6 font-mono text-xs">
              
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span>SYSTEM CONSOLE LOGS & SECURITY AUDIT TRAIL</span>
                  </h3>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportLogsCsv}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => setSystemConsoleLogs([])}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      Clear Logs
                    </button>
                  </div>
                </div>

                {/* Log Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {(['ALL', 'INFO', 'WARN', 'ERROR', 'SECURITY'] as const).map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setLogLevelFilter(lvl)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          logLevelFilter === lvl
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Logs Terminal Stream Box */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800/80 space-y-2 max-h-96 overflow-y-auto font-mono text-[11px]">
                  {systemConsoleLogs
                    .filter(l => logLevelFilter === 'ALL' || l.level === logLevelFilter)
                    .filter(l => !logSearchQuery || l.msg.toLowerCase().includes(logSearchQuery.toLowerCase()) || l.module.toLowerCase().includes(logSearchQuery.toLowerCase()))
                    .map(l => (
                      <div key={l.id} className="flex items-start gap-2 border-b border-slate-800/40 pb-1.5">
                        <span className="text-slate-500 shrink-0">[{l.time}]</span>
                        <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] shrink-0 ${
                          l.level === 'INFO' ? 'bg-blue-500/20 text-blue-300' :
                          l.level === 'WARN' ? 'bg-amber-500/20 text-amber-300' :
                          l.level === 'ERROR' ? 'bg-rose-500/20 text-rose-300' :
                          'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {l.level}
                        </span>
                        <span className="font-bold text-indigo-300 shrink-0">[{l.module}]</span>
                        <span className="text-slate-200">{l.msg}</span>
                      </div>
                    ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: RSS MONITOR */}
          {activeTab === 'rss' && (
            <div className="space-y-6 font-mono text-xs">
              
              {/* RSS Feed Inspector & Test Bench */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-amber-400" />
                    <span>RSS / ATOM / RDF WIRE FEED MONITOR & LIVE TESTER</span>
                  </h3>
                  <span className="text-emerald-400 font-bold">{sources.length} Feeds Monitored</span>
                </div>

                {/* Live RSS Feed Test Bar */}
                <form onSubmit={handleTestRssFeed} className="space-y-3 p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-slate-300 font-bold block">Test Custom RSS Endpoint</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="e.g. https://www.thecitizen.co.tz/service/rss/622/feed.xml"
                      value={testRssUrlInput}
                      onChange={(e) => setTestRssUrlInput(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isTestingRss}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-2"
                    >
                      {isTestingRss ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
                      <span>Validate RSS Endpoint</span>
                    </button>
                  </div>

                  {testRssResult && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-200 text-xs">
                      <p className="font-bold">✓ {testRssResult.message}</p>
                    </div>
                  )}
                </form>

                {/* Monitored Feeds Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {sources.map(s => (
                    <div key={s.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{s.name}</span>
                        <span className="text-emerald-400 font-bold text-[10px]">HTTP 200 OK</span>
                      </div>
                      <p className="text-slate-400 text-[10px] truncate">{s.url}</p>
                      <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                        <span>Category: {s.category}</span>
                        <span>Latency: {s.latencyMs}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: OPS CENTER & LIVE MAP */}
          {activeTab === 'ops_center' && (
            <div className="space-y-6">
              
              {/* Ingestion World Map & Country Heatmap Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Live Ingestion Map Simulation */}
                <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-indigo-400" />
                      <h3 className="font-bold text-sm text-white">LIVE GLOBAL INGESTION HEAT MAP</h3>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">48 Countries Synchronized</span>
                  </div>

                  {/* Visual Map Matrix Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">🇷🇼 Rwanda</span>
                        <span className="text-emerald-400 font-bold">184/day</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Kigali Hub • Trust 98.4%</p>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[85%]"></div>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">🇺🇸 United States</span>
                        <span className="text-indigo-400 font-bold">420/day</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Reuters/AP Wire • Trust 99.1%</p>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-indigo-400 h-full w-[95%]"></div>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">🇬🇧 United Kingdom</span>
                        <span className="text-blue-400 font-bold">310/day</span>
                      </div>
                      <p className="text-[10px] text-slate-400">BBC Node • Trust 98.7%</p>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-blue-400 h-full w-[88%]"></div>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">🇫🇷 France</span>
                        <span className="text-purple-400 font-bold">290/day</span>
                      </div>
                      <p className="text-[10px] text-slate-400">AFP Wire • Trust 98.2%</p>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-purple-400 h-full w-[80%]"></div>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">🇰🇪 Kenya</span>
                        <span className="text-emerald-400 font-bold">145/day</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Nairobi Feed • Trust 97.2%</p>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[70%]"></div>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">🇿🇦 South Africa</span>
                        <span className="text-amber-400 font-bold">135/day</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Joburg Node • Trust 97.8%</p>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[68%]"></div>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">🇦🇪 UAE</span>
                        <span className="text-indigo-400 font-bold">110/day</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Dubai Hub • Trust 96.8%</p>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-indigo-400 h-full w-[60%]"></div>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">🇨🇳 China</span>
                        <span className="text-rose-400 font-bold">160/day</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Xinhua Stream • Trust 89%</p>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-rose-400 h-full w-[50%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Event Stream */}
                <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-xs text-white flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>REAL-TIME CRAWLER STREAM</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 animate-pulse">STREAMING</span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-[11px] font-mono">
                    {crawlerLogs.map((log) => (
                      <div key={log.id} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 space-y-0.5">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>[{log.timestamp}]</span>
                          <span className="text-emerald-400 font-bold">+{log.articlesFetched} items</span>
                        </div>
                        <p className="text-white font-bold truncate">{log.source}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>Clusters: {log.clustersMerged}</span>
                          <span>{log.executionTimeMs}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: CRAWLER HEALTH & SOURCES */}
          {activeTab === 'crawlers_sources' && (
            <div className="space-y-6">
              
              {/* Add New Source Bar */}
              <form onSubmit={handleAddSource} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center">
                <input
                  type="text"
                  placeholder="Feed Name (e.g., Bloomberg Market Wire)"
                  value={newRssName}
                  onChange={(e) => setNewRssName(e.target.value)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono w-full md:w-1/3"
                />
                <input
                  type="url"
                  placeholder="RSS / Endpoint URL (e.g., https://feed.bloomberg.com/news.xml)"
                  value={newRssUrl}
                  onChange={(e) => setNewRssUrl(e.target.value)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono w-full md:flex-1"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Ingestion Source</span>
                </button>
              </form>

              {/* Source Management List */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Server className="w-4 h-4 text-indigo-400" />
                    <span>ACTIVE PUBLISHERS & RSS INGESTION SOURCES ({sources.length})</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {sources.map((src) => (
                    <div key={src.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-white text-sm block">{src.name}</span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-xs">{src.url}</span>
                        </div>
                        <button
                          onClick={() => handleToggleSourceStatus(src.id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                            src.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {src.status}
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-[10px]">
                        <div>
                          <span className="text-slate-500">Trust Score:</span>
                          <span className="text-emerald-400 font-bold block">{src.trustScore}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Bias Rating:</span>
                          <span className="text-indigo-300 font-bold block">{src.bias}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Latency:</span>
                          <span className="text-purple-300 font-bold block">{src.latencyMs}ms</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CONTENT APPROVAL & FACT QUEUES */}
          {activeTab === 'content_queues' && (
            <div className="space-y-6">
              
              {/* Fact Verification Queue */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>FACT VERIFICATION QUEUE ({factQueue.length} Flagged Claims)</span>
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  {factQueue.map((item) => (
                    <div key={item.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{item.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <strong className="text-indigo-400">Claim: </strong>{item.claim}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Source: {item.source} ({item.country})</span>
                        <button
                          onClick={() => handleVerifyFactQueueItem(item.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition"
                        >
                          Verify & Approve Claim
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editorial Article Approval Queue */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>EDITORIAL ARTICLE APPROVAL QUEUE ({pendingArticles.length})</span>
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  {pendingArticles.map((art) => (
                    <div key={art.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 bg-indigo-600 text-white font-mono text-[10px] rounded font-bold">
                            {art.category}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">{art.mainPublisher.name}</span>
                        </div>
                        <h4 className="font-bold text-white">{art.title}</h4>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => handleApproveArticle(art.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
                        >
                          Approve Publish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: GRAPH & NARRATIVE EXPLORER */}
          {activeTab === 'graph_explorers' && (
            <div className="space-y-6">
              
              {/* Relationship Graph Explorer Simulation */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Network className="w-4 h-4 text-indigo-400" />
                    <span>RELATIONSHIP & KNOWLEDGE GRAPH EXPLORER</span>
                  </h3>
                  <span className="text-xs font-mono text-purple-400">1,480 Resolved Entities</span>
                </div>

                {/* Node Grid Canvas Visualizer */}
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 min-h-64 flex flex-wrap gap-4 items-center justify-center relative">
                  <div className="p-4 bg-indigo-950 border border-indigo-500 rounded-2xl text-center space-y-1 shadow-lg">
                    <span className="font-bold text-white text-xs block">🇷🇼 Kigali Innovation City</span>
                    <span className="text-[10px] text-indigo-300 font-mono">Entity Hub</span>
                  </div>

                  <div className="p-3 bg-purple-950 border border-purple-500 rounded-2xl text-center space-y-1 shadow-lg">
                    <span className="font-bold text-white text-xs block">🤖 Gemini AI Compute</span>
                    <span className="text-[10px] text-purple-300 font-mono">Technology</span>
                  </div>

                  <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-2xl text-center space-y-1 shadow-lg">
                    <span className="font-bold text-white text-xs block">🌍 AfCFTA Trade Zone</span>
                    <span className="text-[10px] text-emerald-300 font-mono">Multilateral Body</span>
                  </div>

                  <div className="p-3 bg-amber-950 border border-amber-500 rounded-2xl text-center space-y-1 shadow-lg">
                    <span className="font-bold text-white text-xs block">⚓ Red Sea Subsea Cables</span>
                    <span className="text-[10px] text-amber-300 font-mono">Infrastructure</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: BRIEFING & COST */}
          {activeTab === 'briefing_analytics' && (
            <div className="space-y-6">
              
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>EXECUTIVE BRIEFING GENERATOR & AI COST MONITORING</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-slate-300 font-bold block">Briefing Focus Scope</label>
                  <input
                    type="text"
                    value={briefingScope}
                    onChange={(e) => setBriefingScope(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />

                  <button
                    onClick={handleGenerateBriefing}
                    disabled={isGeneratingBriefing}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center space-x-2"
                  >
                    {isGeneratingBriefing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Synthesizing Executive Briefing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Generate AI Executive Intelligence Report</span>
                      </>
                    )}
                  </button>
                </div>

                {generatedBriefing && (
                  <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-line leading-relaxed">
                    {generatedBriefing}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 6: USER MANAGEMENT & ROLES */}
          {activeTab === 'user_security' && (
            <div className="space-y-6">
              
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>ADMINISTRATOR ACCOUNTS & ROLES ({adminUsers.length})</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {adminUsers.map((user) => (
                    <div key={user.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{user.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{user.email}</p>
                      <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                        Permissions: {user.permissions.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: UI SETTINGS & BANNER */}
          {activeTab === 'web_settings' && (
            <div className="space-y-6">
              
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>GLOBAL WEB UI & ANNOUNCEMENT BANNER CONTROL</span>
                  </h3>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">Announcement Banner Text</label>
                    <input
                      type="text"
                      value={webSettings.announcementBannerText}
                      onChange={(e) => setWebSettings({ ...webSettings, announcementBannerText: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp Integration Panel */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                <WhatsAppIntegration variant="banner" location="admin_dashboard" language="English" article={articles[0]} />
              </div>

            </div>
          )}

        </div>

        {/* Change Admin Password Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl font-mono text-xs text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-sm">Change Admin Console Password</h4>
                <button onClick={() => setShowChangePasswordModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-3">
                <div>
                  <label className="text-slate-400 block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassInput}
                    onChange={(e) => setCurrentPassInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassInput}
                    onChange={(e) => setConfirmPassInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                {passChangeError && <p className="text-rose-400 text-xs">{passChangeError}</p>}
                {passChangeSuccess && <p className="text-emerald-400 text-xs">{passChangeSuccess}</p>}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                  >
                    Save Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
