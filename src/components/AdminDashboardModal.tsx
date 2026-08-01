import React, { useState, useEffect } from 'react';
import { CrawlerLog } from '../types';
import { 
  Settings, X, RefreshCw, Server, Activity, ShieldCheck, Database, DollarSign, Cpu, 
  Shield, Key, Users, Eye, Lock, Sliders, AlertCircle, CheckCircle2, FileText, 
  Terminal, Bell, UserPlus, Trash2, Search, Zap, Layout, Monitor, Sparkles,
  LogOut, EyeOff, Fingerprint, ShieldAlert, Check, UserCheck, ArrowRight,
  KeyRound, CheckSquare, Square, UserX, Edit, Globe, Languages
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { getAllCachedTranslations, updateAdminTranslationOverride } from '../services/translationService';
import { INITIAL_ARTICLES } from '../data/mockNewsData';
import { calculateEvergreenScore, getAiEditorialRecommendation, generateXmlSitemap, enrichArticleWithLifecycleAndSeo, ArticleLifecycleManager, LifecycleEvaluationReport } from '../services/newsLifecycleService';
import { WhatsAppService, WHATSAPP_CHANNEL_URL } from '../services/WhatsAppService';
import { WhatsAppQrModal } from './WhatsAppQrModal';
import { BillingService } from '../services/BillingService';
import { EnterpriseAccountService } from '../services/EnterpriseAccountService';
import { VeritasAPIService } from '../services/VeritasAPIService';
import { ShoppingBag, MessageCircle, QrCode, ExternalLink, TrendingUp, BarChart3 } from 'lucide-react';

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

interface AdminDashboardModalProps {
  onClose: () => void;
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

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'web_settings' | 'roles' | 'records' | 'security' | 'multilingual' | 'lifecycle' | 'whatsapp' | 'marketplace'>('telemetry');
  const [auditReport, setAuditReport] = useState<LifecycleEvaluationReport | null>(null);
  const [showAdminQrModal, setShowAdminQrModal] = useState<boolean>(false);
  
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

  // Change Password State
  const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);
  const [currentPassInput, setCurrentPassInput] = useState<string>('');
  const [newPassInput, setNewPassInput] = useState<string>('');
  const [confirmPassInput, setConfirmPassInput] = useState<string>('');
  const [passChangeError, setPassChangeError] = useState<string | null>(null);
  const [passChangeSuccess, setPassChangeSuccess] = useState<string | null>(null);

  // Quick Select User Pre-fill
  const handleQuickSelectUser = (user: AdminUser) => {
    setLoginEmail(user.email);
    setLoginPassword('');
    setLoginError(null);
    setLoginHint(`Pre-filled username: "${user.email}". Please type password (default: admin123) to log in.`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const inputUser = loginEmail.trim().toLowerCase();
    const inputPass = loginPassword.trim();

    if (!inputUser) {
      setLoginError('Please enter your administrator username or email.');
      return;
    }
    if (!inputPass) {
      setLoginError('Please enter your password.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      // Validate Password against stored adminPassword (defaults to 'admin123')
      const isPasswordValid = inputPass === adminPassword || (adminPassword === 'admin123' && inputPass === 'admin123');

      if (!isPasswordValid) {
        setIsAuthenticating(false);
        setLoginError(`Authentication failed: Invalid password. Current required password for admin is "${adminPassword === 'admin123' ? 'admin123' : '••••••••'}".`);
        return;
      }

      // Find matching user or fallback to Super Admin
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

      // Record login event in activity log
      const newRec: ActivityRecord = {
        id: `REC-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actor: foundUser.email,
        action: `Successful Admin Gate Access (${foundUser.role})`,
        category: 'SECURITY',
        ipAddress: '192.168.1.104',
        status: 'SUCCESS'
      };
      setRecords(prev => [newRec, ...prev]);
      setIsAuthenticating(false);
    }, 600);
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

    // Save new password
    setAdminPassword(newPassInput);
    localStorage.setItem('veritas_admin_password', newPassInput);

    // Activity log
    const newRec: ActivityRecord = {
      id: `REC-${Date.now().toString().slice(-3)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: authenticatedUser?.email || 'admin',
      action: 'Admin Security Password Updated',
      category: 'SECURITY',
      ipAddress: '192.168.1.104',
      status: 'SUCCESS'
    };
    setRecords(prev => [newRec, ...prev]);

    setPassChangeSuccess('Admin password updated successfully! Future logins will require your new password.');
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
  };
  
  // Telemetry state
  const [logs, setLogs] = useState<CrawlerLog[]>([]);
  const [isCrawling, setIsCrawling] = useState(false);
  const [ingestStats, setIngestStats] = useState({
    activeCrawlers: 8,
    totalIngestedToday: 1420,
    clustersFormed: 310
  });

  // UI Web Settings State
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
      autoRefreshIntervalSec: 60,
      layoutDensity: 'COMPACT',
      announcementBannerEnabled: false,
      announcementBannerText: '🔴 GLOBAL SYSTEMIC ALERT: Bab-el-Mandeb Strait disruption monitoring active.'
    };
  });

  // Role & Privilege State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminUser['role']>('ANALYST_ADMIN');
  const [newUserPermissions, setNewUserPermissions] = useState<string[]>(['CRAWLER_SWEEP']);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Edit User Privilege Matrix State
  const [editingPrivilegeUser, setEditingPrivilegeUser] = useState<AdminUser | null>(null);

  // Activity Records State
  const [records, setRecords] = useState<ActivityRecord[]>(INITIAL_ACTIVITY_RECORDS);
  const [recordFilter, setRecordFilter] = useState<string>('ALL');

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/crawler/logs');
      const data = await res.json();
      setLogs(data.logs || []);
      setIngestStats({
        activeCrawlers: data.activeCrawlers || 8,
        totalIngestedToday: data.totalIngestedToday || 1420,
        clustersFormed: data.clustersFormed || 310
      });
    } catch (err) {
      console.error('Failed to fetch crawler logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    localStorage.setItem('veritas_admin_web_settings', JSON.stringify(webSettings));
  }, [webSettings]);

  const handleRunCrawler = async () => {
    setIsCrawling(true);
    try {
      const res = await fetch('/api/crawler/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'Manual Admin Trigger (Reuters/AP Wire)' })
      });
      await res.json();
      await fetchLogs();

      // Log activity
      const newRec: ActivityRecord = {
        id: `REC-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actor: authenticatedUser?.email || 'admin',
        action: 'Manual Crawler Triggered via Admin Panel',
        category: 'CRAWLER',
        ipAddress: '192.168.1.104',
        status: 'SUCCESS'
      };
      setRecords(prev => [newRec, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCrawling(false);
    }
  };

  const handleToggleWebSetting = (key: keyof typeof webSettings) => {
    setWebSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      const newRec: ActivityRecord = {
        id: `REC-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actor: authenticatedUser?.email || 'admin',
        action: `Updated Web Setting: ${String(key)} = ${updated[key]}`,
        category: 'UI_CONFIG',
        ipAddress: '192.168.1.104',
        status: 'SUCCESS'
      };
      setRecords(r => [newRec, ...r]);
      return updated;
    });
  };

  const handleChangeRole = (userId: string, newRole: AdminUser['role']) => {
    let defaultPerms: string[] = ['CRAWLER_SWEEP'];
    if (newRole === 'SUPER_ADMIN') {
      defaultPerms = ['ALL_PERMISSIONS', 'UI_CONTROL', 'CRAWLER_SWEEP', 'ROLE_MANAGEMENT', 'DATABASE_READ_WRITE', 'SECURITY_LOCK'];
    } else if (newRole === 'SYSTEM_AUDITOR') {
      defaultPerms = ['DATABASE_READ_WRITE', 'SECURITY_LOCK'];
    } else if (newRole === 'CONTENT_MODERATOR') {
      defaultPerms = ['UI_CONTROL', 'DATABASE_READ_WRITE'];
    }

    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole, permissions: defaultPerms } : u));
    
    const target = adminUsers.find(u => u.id === userId);
    const newRec: ActivityRecord = {
      id: `REC-${Date.now().toString().slice(-3)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: authenticatedUser?.email || 'admin',
      action: `Assigned role ${newRole} to ${target?.name || userId}`,
      category: 'PRIVILEGE',
      ipAddress: '192.168.1.104',
      status: 'SUCCESS'
    };
    setRecords(r => [newRec, ...r]);
  };

  const handleToggleUserStatus = (userId: string) => {
    setAdminUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        const newRec: ActivityRecord = {
          id: `REC-${Date.now().toString().slice(-3)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          actor: authenticatedUser?.email || 'admin',
          action: `Changed status of ${u.name} to ${nextStatus}`,
          category: 'PRIVILEGE',
          ipAddress: '192.168.1.104',
          status: 'WARNING'
        };
        setRecords(r => [newRec, ...r]);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleTogglePrivilegeForUser = (userId: string, privilegeId: string) => {
    setAdminUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const hasPerm = u.permissions.includes(privilegeId);
        const updatedPerms = hasPerm 
          ? u.permissions.filter(p => p !== privilegeId)
          : [...u.permissions, privilegeId];
        
        if (editingPrivilegeUser && editingPrivilegeUser.id === userId) {
          setEditingPrivilegeUser({ ...editingPrivilegeUser, permissions: updatedPerms });
        }

        return { ...u, permissions: updatedPerms };
      }
      return u;
    }));
  };

  const handleDeleteUser = (userId: string) => {
    const target = adminUsers.find(u => u.id === userId);
    if (!target) return;
    if (target.email === 'admin') {
      alert('The root "admin" account cannot be deleted.');
      return;
    }
    if (confirm(`Are you sure you want to revoke and delete admin account for ${target.name}?`)) {
      setAdminUsers(prev => prev.filter(u => u.id !== userId));
      const newRec: ActivityRecord = {
        id: `REC-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actor: authenticatedUser?.email || 'admin',
        action: `Revoked Admin Account for ${target.name} (${target.email})`,
        category: 'PRIVILEGE',
        ipAddress: '192.168.1.104',
        status: 'WARNING'
      };
      setRecords(r => [newRec, ...r]);
    }
  };

  const handleAddAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newAdmin: AdminUser = {
      id: `ADM-${Date.now().toString().slice(-3)}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'ACTIVE',
      lastActive: 'Just now',
      permissions: newUserPermissions.length > 0 ? newUserPermissions : ['CRAWLER_SWEEP']
    };

    setAdminUsers(prev => [...prev, newAdmin]);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');

    const newRec: ActivityRecord = {
      id: `REC-${Date.now().toString().slice(-3)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: authenticatedUser?.email || 'admin',
      action: `Provisioned new admin account for ${newUserName} (${newUserEmail}) as ${newUserRole}`,
      category: 'PRIVILEGE',
      ipAddress: '192.168.1.104',
      status: 'SUCCESS'
    };
    setRecords(r => [newRec, ...r]);
  };

  const filteredRecords = records.filter(r => {
    if (recordFilter === 'ALL') return true;
    return r.category === recordFilter;
  });

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-auto">
          
          {/* Login Gate Header */}
          <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-blue-600 text-slate-950 shadow-lg shadow-amber-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base text-white tracking-wide font-sans">
                    VERITAS ADMIN CONSOLE GATE
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    RESTRICTED ACCESS
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Zero-Trust Administrator Authentication & System Gate
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 bg-slate-950">
            {/* Quick Profile Selectors */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono flex items-center justify-between">
                <span>Select Admin Account</span>
                <span className="text-[10px] text-amber-400 font-normal">Pre-fills username</span>
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

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
                  <span>Username or Email</span>
                  <span className="text-indigo-400 font-normal">Default: <strong className="text-amber-300">admin</strong></span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                    required
                  />
                  <ShieldCheck className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                </div>
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
                    placeholder="Enter password (e.g. admin123)"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
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

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <>
                      <Fingerprint className="w-4 h-4 animate-pulse text-amber-300" />
                      <span>Verifying Security Key...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 text-amber-300" />
                      <span>LOG IN TO ADMIN CONSOLE</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Audit & Security Footer */}
            <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-mono gap-2">
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                IP: 192.168.1.104 • Zero-Trust TLS 1.3 Active
              </span>
              <span className="text-slate-400">Veritas Security Gate v4.5</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS SYSTEM ADMIN CONSOLE & PRIVILEGE MANAGER</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  {authenticatedUser?.role || 'SUPER ADMIN'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Centralized Web UI control, access privilege enforcement, password security, and immutable audit logs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Change Password Quick Trigger */}
            <button
              onClick={() => {
                setShowChangePasswordModal(true);
                setPassChangeError(null);
                setPassChangeSuccess(null);
              }}
              className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Change Admin Security Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Change Password</span>
            </button>

            {/* Authenticated User Status Pill & Sign Out Button */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-bold">{authenticatedUser?.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Sign Out & Lock Console Gate"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Lock Gate</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'telemetry' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" /> ⚡ Ingestion & Telemetry
          </button>
          <button
            onClick={() => setActiveTab('web_settings')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'web_settings' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" /> 🎛️ Web UI & Settings Control
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'roles' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> 🛡️ Assign Roles & Privileges
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'records' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> 📜 Activity Records & Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'security' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" /> 🔒 Password & Security
          </button>
          <button
            onClick={() => setActiveTab('multilingual')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'multilingual' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" /> 🌐 Multilingual AI & Translations
          </button>
          <button
            onClick={() => setActiveTab('lifecycle')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'lifecycle' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> 🌲 Evergreen AI Editorial Assistant & Lifecycle
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'whatsapp' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-current" /> 💬 WhatsApp Growth & Audience Analytics
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'marketplace' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-indigo-400" /> 🛒 Marketplace & Revenue Control
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 space-y-6">
          
          {/* TAB 1: INGESTION & TELEMETRY */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">ACTIVE CRAWLER AGENTS</span>
                  <span className="text-2xl font-black text-emerald-400">{ingestStats.activeCrawlers} Online</span>
                  <span className="text-[10px] text-slate-400 block">Polling frequency: Every 60 seconds</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">ARTICLES INGESTED TODAY</span>
                  <span className="text-2xl font-black text-blue-400">{ingestStats.totalIngestedToday.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block">Across 40 global news wires & RSS</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">CLUSTERS MERGED</span>
                  <span className="text-2xl font-black text-amber-400">{ingestStats.clustersFormed} Clusters</span>
                  <span className="text-[10px] text-slate-400 block">Deduplicated in real-time</span>
                </div>
              </div>

              {/* Ingestion Trigger Control */}
              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-sm flex items-center gap-2 text-white">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      Autonomous Pipeline Execution
                    </h4>
                    <p className="text-xs text-slate-400">Trigger manual RSS crawler sweep & story deduplication cycle instantly.</p>
                  </div>

                  <button
                    onClick={handleRunCrawler}
                    disabled={isCrawling}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${isCrawling ? 'animate-spin' : ''}`} />
                    <span>{isCrawling ? 'Crawling Global Wires...' : 'Run Ingestion Sweep Now'}</span>
                  </button>
                </div>

                {/* Telemetry Log */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-slate-400 block">Recent Pipeline Telemetry Logs:</span>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {logs.map(log => (
                      <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between font-mono">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-bold text-slate-200">{log.source}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                          <span>{log.articlesFetched} articles</span>
                          <span>{log.clustersMerged} merged</span>
                          <span className="text-emerald-400 font-bold">{log.executionTimeMs}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEB UI & SETTINGS CONTROL */}
          {activeTab === 'web_settings' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-400" />
                  GLOBAL WEB APPLICATION UI & INTERFACE CONTROL
                </h3>
                <p className="text-xs text-slate-400">
                  Manage visible widgets, layouts, auto-refresh intervals, and announcement banners across the platform.
                </p>

                {/* Grid of UI Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-sm font-bold text-white block">Live Breaking Ticker</strong>
                      <span className="text-xs text-slate-400">Display top news ticker bar at app header</span>
                    </div>
                    <button
                      onClick={() => handleToggleWebSetting('showLiveTicker')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                        webSettings.showLiveTicker ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {webSettings.showLiveTicker ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-sm font-bold text-white block">Media & Political Bias Indicators</strong>
                      <span className="text-xs text-slate-400">Show spectrum meters on article cards</span>
                    </div>
                    <button
                      onClick={() => handleToggleWebSetting('showBiasMeters')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                        webSettings.showBiasMeters ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {webSettings.showBiasMeters ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-sm font-bold text-white block">AI Perspective Debate Panel</strong>
                      <span className="text-xs text-slate-400">Enable multi-angle synthetic consensus analysis</span>
                    </div>
                    <button
                      onClick={() => handleToggleWebSetting('showAiDebatePanel')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                        webSettings.showAiDebatePanel ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {webSettings.showAiDebatePanel ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-sm font-bold text-white block">Global Digital Twin Status Bar</strong>
                      <span className="text-xs text-slate-400">Show live planetary node alerts on main feed</span>
                    </div>
                    <button
                      onClick={() => handleToggleWebSetting('showDigitalTwinWidget')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                        webSettings.showDigitalTwinWidget ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {webSettings.showDigitalTwinWidget ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                </div>

                {/* Announcement Banner Builder */}
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-sm font-bold text-white block">Global Announcement Alert Banner</strong>
                      <span className="text-xs text-slate-400">Broadcast an emergency system alert to all active users</span>
                    </div>
                    <button
                      onClick={() => handleToggleWebSetting('announcementBannerEnabled')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                        webSettings.announcementBannerEnabled ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {webSettings.announcementBannerEnabled ? 'ACTIVE BANNER' : 'OFF'}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={webSettings.announcementBannerText}
                    onChange={(e) => setWebSettings(prev => ({ ...prev, announcementBannerText: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="Enter announcement text..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ASSIGN ROLES & PRIVILEGES */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              {/* Privilege Catalog Overview */}
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  System Security Privileges Index
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
                  {ALL_PRIVILEGES_LIST.map(p => (
                    <div key={p.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-0.5">
                      <span className="font-bold text-indigo-300 text-[11px] block">{p.label}</span>
                      <p className="text-[10px] text-slate-400 leading-tight">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Management Table */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      ADMIN ACCOUNTS, ROLES & GRANULAR PRIVILEGES
                    </h3>
                    <p className="text-xs text-slate-400">
                      Assign administrative roles, grant or revoke individual security permissions, and toggle account access status.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <UserPlus className="w-4 h-4" /> Provision New Admin Account
                  </button>
                </div>

                {/* User Search */}
                <div className="space-y-3 pt-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search admin accounts by name or email..."
                      value={searchUserQuery}
                      onChange={(e) => setSearchUserQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div className="space-y-3">
                    {adminUsers
                      .filter(u => u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) || u.email.toLowerCase().includes(searchUserQuery.toLowerCase()))
                      .map(user => (
                        <div key={user.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col space-y-3 font-mono text-xs">
                          
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-white text-sm">{user.name}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  user.role === 'SUPER_ADMIN' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                                  user.role === 'SYSTEM_AUDITOR' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                                  user.role === 'CONTENT_MODERATOR' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                                  'bg-blue-950 text-blue-300 border border-blue-800'
                                }`}>
                                  {user.role}
                                </span>

                                <button
                                  onClick={() => handleToggleUserStatus(user.id)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                    user.status === 'ACTIVE' 
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  }`}
                                  title="Toggle Status (Active / Suspended)"
                                >
                                  {user.status}
                                </button>
                              </div>
                              <span className="text-slate-400 text-[11px] block">{user.email} • Last active: {user.lastActive}</span>
                            </div>

                            {/* Controls: Role Selector & Action Buttons */}
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                              <select
                                value={user.role}
                                onChange={(e) => handleChangeRole(user.id, e.target.value as AdminUser['role'])}
                                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono cursor-pointer"
                              >
                                <option value="SUPER_ADMIN">SUPER_ADMIN (Level 5)</option>
                                <option value="SYSTEM_AUDITOR">SYSTEM_AUDITOR (Level 4)</option>
                                <option value="CONTENT_MODERATOR">CONTENT_MODERATOR (Level 3)</option>
                                <option value="ANALYST_ADMIN">ANALYST_ADMIN (Level 2)</option>
                              </select>

                              <button
                                onClick={() => setEditingPrivilegeUser(user)}
                                className="px-3 py-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                                title="Edit Granular Privileges"
                              >
                                <Edit className="w-3.5 h-3.5 text-amber-300" />
                                <span>Privileges</span>
                              </button>

                              {user.email !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 rounded-xl border border-red-800 cursor-pointer"
                                  title="Revoke Admin Account"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Active Permissions Badges */}
                          <div className="pt-2 border-t border-slate-900 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Granted Privileges:</span>
                            {user.permissions.map(perm => (
                              <span key={perm} className="px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800 text-[10px] flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400" />
                                {perm}
                              </span>
                            ))}
                          </div>

                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVITY RECORDS & AUDIT TRAIL */}
          {activeTab === 'records' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      IMMUTABLE ADMINISTRATIVE ACTIVITY RECORDS
                    </h3>
                    <p className="text-xs text-slate-400">
                      Cryptographically signed ledger recording all system modifications, role escalation, and password changes.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                    {['ALL', 'SECURITY', 'UI_CONFIG', 'CRAWLER', 'PRIVILEGE'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setRecordFilter(cat)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          recordFilter === cat ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Records Table */}
                <div className="space-y-2 pt-2">
                  {filteredRecords.map(rec => (
                    <div key={rec.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between font-mono text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-blue-400 border border-slate-800 font-bold">
                            {rec.category}
                          </span>
                          <strong className="text-slate-200">{rec.action}</strong>
                        </div>
                        <span className="text-slate-500 text-[11px] block">{rec.actor} • IP: {rec.ipAddress}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-400 text-[11px] block">{rec.timestamp}</span>
                        <span className="text-emerald-400 font-bold text-[10px]">VERIFIED RECORD</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PASSWORD & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password Panel */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">CHANGE ADMIN SECURITY PASSWORD</h3>
                    <p className="text-xs text-slate-400">Update the master security password for console gate authentication.</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordChangeSubmit} className="max-w-xl space-y-4 pt-2 font-mono text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassInput}
                      onChange={(e) => setCurrentPassInput(e.target.value)}
                      placeholder="Enter current password (default: admin123)"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold block">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold block">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassInput}
                        onChange={(e) => setConfirmPassInput(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {passChangeError && (
                    <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{passChangeError}</span>
                    </div>
                  )}

                  {passChangeSuccess && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{passChangeSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>UPDATE ADMIN PASSWORD</span>
                  </button>
                </form>
              </div>

              {/* Zero Trust Hardware & API Specs */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                  SYSTEM SECURITY & ZERO-TRUST ARCHITECTURE
                </h3>
                <p className="text-xs text-slate-400">
                  Manage API key status, rate limits, and cryptographic verification mechanisms.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs pt-2">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-blue-400 font-bold block">🔑 GEMINI API STATUS</span>
                    <p className="text-emerald-400 font-bold">OPERATIONAL (Key Active)</p>
                    <span className="text-[10px] text-slate-400 block">Quota: 92,000 / 100,000 RPM</span>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-purple-400 font-bold block">🛡️ PROVENANCE HASH ENGINE</span>
                    <p className="text-emerald-400 font-bold">SHA-256 SYNCED</p>
                    <span className="text-[10px] text-slate-400 block">100% News cluster provenance verified</span>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-amber-400 font-bold block">⚡ API RATE LIMITING</span>
                    <p className="text-slate-200">1,000 Req / Min / IP</p>
                    <span className="text-[10px] text-slate-400 block font-bold text-emerald-400">0 Rate Limit Spikes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MULTILINGUAL AI & TRANSLATIONS CONTROL */}
          {activeTab === 'multilingual' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">SUPPORTED LANGUAGES</span>
                  <span className="text-2xl font-black text-cyan-400">9 Dialects</span>
                  <span className="text-[10px] text-slate-400 block">EN, FR, RW, SW, ES, AR, ZH, DE, PT</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">TRANSLATION ENGINE</span>
                  <span className="text-xl font-black text-emerald-400">Gemini 3.6 Flash</span>
                  <span className="text-[10px] text-slate-400 block">Server-Side Proxy Active</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">AVG CONFIDENCE SCORE</span>
                  <span className="text-2xl font-black text-amber-400">98.4%</span>
                  <span className="text-[10px] text-slate-400 block">Journalistic tone preserved</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">ARTICLE CACHE STATUS</span>
                  <span className="text-2xl font-black text-indigo-400">Dynamic / No Duplication</span>
                  <span className="text-[10px] text-slate-400 block">Zero database duplication</span>
                </div>
              </div>

              {/* Translation Override & Inspection Console */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      MULTILINGUAL TRANSLATION CACHE & HUMAN AUDIT CONSOLE
                    </h3>
                    <p className="text-xs text-slate-400">
                      Inspect active AI translations, verify confidence metrics, or apply senior editor human overrides.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      alert('Refreshed multilingual AI cache index.');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sync AI Cache</span>
                  </button>
                </div>

                {/* Cached Translation List */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono text-slate-400 block">Active Dynamic AI Translations Index:</span>
                  
                  {getAllCachedTranslations().length > 0 ? (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {getAllCachedTranslations().map((item, idx) => (
                        <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2 font-mono">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                                {item.targetLanguage}
                              </span>
                              <span className="text-slate-300 font-bold truncate max-w-xs">{item.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                                Score: {item.confidenceScore}%
                              </span>
                              <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                                {item.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2">{item.summaryMedium}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                            <span>ID: {item.articleId}</span>
                            <span>Translated: {new Date(item.translatedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-2">
                      <Languages className="w-8 h-8 text-cyan-500/50 mx-auto" />
                      <p className="font-bold text-slate-300">No Manual Overrides Pending</p>
                      <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                        Dynamic AI translations generate on-the-fly when visitors select languages from the top bar. All translations preserve the original database record without duplicating rows.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: EVERGREEN AI EDITORIAL ASSISTANT & LIFECYCLE MANAGEMENT */}
          {activeTab === 'lifecycle' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">EVERGREEN CONTENT RATIO</span>
                  <span className="text-2xl font-black text-amber-400">
                    {INITIAL_ARTICLES.filter(a => (a.evergreenScore || 0) >= 65 || a.isEvergreen).length} / {INITIAL_ARTICLES.length} Stories
                  </span>
                  <span className="text-[10px] text-slate-400 block">Retained in Knowledge Library</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">HOMEPAGE FRESH WIRE</span>
                  <span className="text-2xl font-black text-emerald-400">&lt; 48 Hours</span>
                  <span className="text-[10px] text-slate-400 block">Auto removal after 48h</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">ARCHIVE THRESHOLD</span>
                  <span className="text-2xl font-black text-cyan-400">7 Days</span>
                  <span className="text-[10px] text-slate-400 block">Time-sensitive items moved to archive</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">AUTO REFRESH ENGINE</span>
                  <span className="text-2xl font-black text-indigo-400">6 Months</span>
                  <span className="text-[10px] text-slate-400 block">AI statistics & link auditor</span>
                </div>
              </div>

              {/* AI Editorial Assistant Console */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      AI EDITORIAL ASSISTANT & LIFECYCLE AUDITOR
                    </h3>
                    <p className="text-xs text-slate-400">
                      Evaluates article information lifespan, educational value, and determines whether stories move to archive or stay permanently in the Knowledge Library.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const { report } = ArticleLifecycleManager.evaluateArticleLifecycle(INITIAL_ARTICLES);
                      setAuditReport(report);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Run AI Lifecycle Audit</span>
                  </button>
                </div>

                {auditReport && (
                  <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-xs space-y-2 font-mono">
                    <div className="flex items-center justify-between text-emerald-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Automated Article Lifecycle Manager Job Executed
                      </span>
                      <span className="text-[10px] text-slate-400">{new Date(auditReport.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px] pt-1">
                      <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Evaluated</span>
                        <span className="text-white font-bold">{auditReport.evaluatedCount}</span>
                      </div>
                      <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Fresh Wire</span>
                        <span className="text-emerald-400 font-bold">{auditReport.freshCount}</span>
                      </div>
                      <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Category Only</span>
                        <span className="text-cyan-400 font-bold">{auditReport.categoryOnlyCount}</span>
                      </div>
                      <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Archived (&gt;7d)</span>
                        <span className="text-slate-400 font-bold">{auditReport.archivedCount}</span>
                      </div>
                      <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Evergreen</span>
                        <span className="text-amber-400 font-bold">{auditReport.evergreenCount}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Article Audit List */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono text-slate-400 block">Article Intelligence Evaluation Queue:</span>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {INITIAL_ARTICLES.slice(0, 8).map(article => {
                      const rec = getAiEditorialRecommendation(article);
                      const enriched = enrichArticleWithLifecycleAndSeo(article);

                      return (
                        <div key={article.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-3 font-mono">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                                rec.evergreenScore >= 65
                                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                                  : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                              }`}>
                                Evergreen: {rec.evergreenScore}/100
                              </span>
                              <span className="text-slate-200 font-bold truncate max-w-sm">{article.title}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px]">
                              Status: {enriched.articleStatus}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                            🤖 <strong>AI Recommendation:</strong> {rec.recommendationText}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 border-t border-slate-900 pt-2">
                            <div className="flex items-center gap-2">
                              {rec.actions.map((act, idx) => (
                                <span key={idx} className="text-emerald-400 font-bold">{act}</span>
                              ))}
                            </div>
                            <span>Published: {new Date(article.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* TAB 8: WHATSAPP AUDIENCE GROWTH & CONVERSION ANALYTICS */}
        {activeTab === 'whatsapp' && (() => {
          const summary = WhatsAppService.getAnalyticsSummary();

          return (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-800/80 rounded-3xl space-y-3 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500 text-slate-950 rounded-2xl shadow-lg shadow-emerald-500/30 shrink-0">
                      <MessageCircle className="w-8 h-8 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-white">WhatsApp Audience Growth Engine</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          LIVE TELEMETRY
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Conversion tracking, placement A/B optimization, and dynamic AI-guided subscription funnels for Veritas Global.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAdminQrModal(true)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-700 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" /> View / Test QR Code
                    </button>
                    <a
                      href={WHATSAPP_CHANNEL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>Channel Direct Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-xs font-mono text-slate-400 block">Total CTA Clicks</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white">{summary.totalClicks}</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+18.4% this week</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Across all 6 placement locations</span>
                </div>

                <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-xs font-mono text-slate-400 block">Total Banner Impressions</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white">{summary.totalViews}</span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">100% Tracked</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Context-aware impressions logged</span>
                </div>

                <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-xs font-mono text-slate-400 block">Conversion Rate (CTR %)</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-emerald-400">{summary.conversionRate}%</span>
                    <span className="text-xs font-mono text-amber-400 font-bold">High Performing</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Clicks ÷ Impressions</span>
                </div>

                <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-xs font-mono text-slate-400 block">Channel Subscribers</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white">125,480+</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+1.2k today</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Verified Official Wire</span>
                </div>
              </div>

              {/* Conversion Breakdowns Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Clicks By Placement */}
                <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      Conversions by Placement Location
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">Location Telemetry</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    {Object.entries(summary.clicksByLocation).map(([loc, cnt]) => {
                      const pct = summary.totalClicks > 0 ? Math.round((cnt / summary.totalClicks) * 100) : 0;
                      return (
                        <div key={loc} className="space-y-1">
                          <div className="flex justify-between text-slate-300">
                            <span className="capitalize">{loc.replace('_', ' ')}</span>
                            <span className="font-bold text-emerald-400">{cnt} clicks ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.max(pct, 5)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Clicks By Category */}
                <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      Conversions by News Category
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">Contextual Interest</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    {Object.entries(summary.clicksByCategory).map(([cat, cnt]) => {
                      const pct = summary.totalClicks > 0 ? Math.round((cnt / summary.totalClicks) * 100) : 0;
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-slate-300">
                            <span>{cat}</span>
                            <span className="font-bold text-cyan-400">{cnt} clicks ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${Math.max(pct, 5)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* AI Follow Conversion Optimization Insights */}
              <div className="p-6 bg-slate-900/90 border border-emerald-800/80 rounded-3xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h4 className="font-extrabold text-sm text-white">AI Follow Conversion Optimization System</h4>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">
                    {summary.aiOptimizationInsights.ctrImprovement}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">Winning Copy Variant</span>
                    <span className="text-emerald-400 font-bold block">{summary.aiOptimizationInsights.winningVariant}</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">Top Recommendation</span>
                    <span className="text-amber-300 font-bold block">{summary.aiOptimizationInsights.recommendedCopy}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] text-slate-400 block font-bold">Automated Growth Recommendations:</span>
                  <ul className="space-y-1.5 text-slate-300">
                    {summary.aiOptimizationInsights.suggestions.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Future Automation Hub */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-300 font-mono">Future WhatsApp Business Cloud API & Webhook Service</span>
                  <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded text-[10px] font-mono font-bold">READY FOR DEPLOYMENT</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  The <strong className="text-white">WhatsAppService.ts</strong> architecture is pre-configured for automated subscriber news broadcasts, direct AI news assistant chat, and real-time news alerts.
                </p>
              </div>

              <WhatsAppQrModal isOpen={showAdminQrModal} onClose={() => setShowAdminQrModal(false)} />
            </div>
          );
        })()}

        {/* TAB 9: ADMIN MARKETPLACE CONTROL CENTER */}
        {activeTab === 'marketplace' && (() => {
          const orgs = EnterpriseAccountService.getOrganizations();
          const invoices = BillingService.getInvoices();
          const totalRev = BillingService.getTotalRevenueUSD();
          const apiKeys = VeritasAPIService.getAPIKeys();

          return (
            <div className="space-y-6 font-mono text-xs">
              {/* Header & Revenue Summary */}
              <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-800 rounded-3xl grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Marketplace & Revenue Control Center</h3>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Manage institutional accounts, product pricing, API provisioning keys, and financial transactions.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Gross Revenue</span>
                  <span className="text-2xl font-bold text-emerald-400">${totalRev.toLocaleString()} USD</span>
                  <span className="text-[9px] text-slate-500 block">Subscriptions & Report Sales</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Institutional Customers</span>
                  <span className="text-2xl font-bold text-indigo-300">{orgs.length} Active Orgs</span>
                  <span className="text-[9px] text-slate-500 block">Government & Enterprise</span>
                </div>
              </div>

              {/* Grid 1: Customer Organizations */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h4 className="font-bold text-sm text-white flex items-center justify-between">
                  <span>Registered Institutional Customers ({orgs.length})</span>
                  <span className="text-slate-400 font-normal text-xs">Enterprise Isolation Active</span>
                </h4>

                <div className="divide-y divide-slate-800">
                  {orgs.map(org => (
                    <div key={org.organizationId} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{org.organizationName}</span>
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded text-[9px]">
                            {org.organizationType}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          Country: {org.country} • Industry: {org.industry} • Team: {org.teamMembers.length} Members
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded font-bold text-[10px]">
                          {org.subscriptionPlan} PLAN
                        </span>
                        <span className="text-[10px] text-slate-500">Joined: {org.createdDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid 2: Revenue Invoices & API Telemetry */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                  <h4 className="font-bold text-sm text-white flex items-center justify-between">
                    <span>Recent Financial Invoices & Sales</span>
                    <span className="text-slate-400 text-xs">Audit Compliant</span>
                  </h4>

                  <div className="space-y-3">
                    {invoices.map(inv => (
                      <div key={inv.invoiceId} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{inv.orgName}</span>
                          <span className="font-bold text-emerald-400">${inv.amountUSD} USD</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{inv.description}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                          <span>Date: {inv.date}</span>
                          <span className="text-emerald-400 font-bold">STATUS: {inv.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                  <h4 className="font-bold text-sm text-white flex items-center justify-between">
                    <span>API Credentials & Quota Telemetry</span>
                    <span className="text-slate-400 text-xs">{apiKeys.length} Active Keys</span>
                  </h4>

                  <div className="space-y-3">
                    {apiKeys.map(k => (
                      <div key={k.keyId} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-300">{k.name}</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-bold">ACTIVE</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Quota: {k.monthlyRequestsUsed.toLocaleString()} / {k.monthlyQuota.toLocaleString()} reqs</span>
                          <span>Rate Limit: {k.rateLimitPerMin}/min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
        </div>

        {/* Change Password Modal (Quick Modal from Header) */}
        {showChangePasswordModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-base text-white">Change Admin Security Password</h4>
                </div>
                <button 
                  onClick={() => setShowChangePasswordModal(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassInput}
                    onChange={(e) => setCurrentPassInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    placeholder="Current password (default: admin123)"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    placeholder="Minimum 6 characters"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassInput}
                    onChange={(e) => setConfirmPassInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    placeholder="Re-type new password"
                  />
                </div>

                {passChangeError && (
                  <div className="p-2.5 bg-red-950/80 border border-red-800 rounded-xl text-red-200 text-xs">
                    {passChangeError}
                  </div>
                )}

                {passChangeSuccess && (
                  <div className="p-2.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-200 text-xs">
                    {passChangeSuccess}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer"
                  >
                    Save Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Granular Privilege Editing per User */}
        {editingPrivilegeUser && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-base text-white">Edit Privileges for {editingPrivilegeUser.name}</h4>
                  <span className="text-[10px] text-slate-400 block">{editingPrivilegeUser.email} • {editingPrivilegeUser.role}</span>
                </div>
                <button 
                  onClick={() => setEditingPrivilegeUser(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {ALL_PRIVILEGES_LIST.map(p => {
                  const isChecked = editingPrivilegeUser.permissions.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleTogglePrivilegeForUser(editingPrivilegeUser.id, p.id)}
                      className={`w-full p-3 rounded-xl border text-left flex items-start justify-between gap-2 transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-xs' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs block text-slate-200">{p.label}</span>
                        <p className="text-[10px] text-slate-400">{p.desc}</p>
                      </div>
                      <div className="pt-0.5">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-amber-400 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button
                  onClick={() => setEditingPrivilegeUser(null)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Done Editing Privileges
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal to Provision New Admin User */}
        {showAddUserModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h4 className="font-bold text-base text-white">Provision New Admin Account</h4>

              <form onSubmit={handleAddAdminUser} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    placeholder="Dr. Alex Mercer"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Email Address or Username</label>
                  <input
                    type="text"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    placeholder="alex.m@veritas.intelligence"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Privilege Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as AdminUser['role'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Level 5)</option>
                    <option value="SYSTEM_AUDITOR">SYSTEM_AUDITOR (Level 4)</option>
                    <option value="CONTENT_MODERATOR">CONTENT_MODERATOR (Level 3)</option>
                    <option value="ANALYST_ADMIN">ANALYST_ADMIN (Level 2)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Provision Account
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
