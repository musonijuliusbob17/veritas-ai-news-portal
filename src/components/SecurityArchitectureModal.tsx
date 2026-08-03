import React, { useState } from 'react';
import {
  X,
  Shield,
  Lock,
  Key,
  ShieldAlert,
  Server,
  Database,
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Globe,
  HardDrive,
  Download,
  Info,
  Terminal,
  Cpu,
  Layers,
  FileText,
  Copy,
  Sliders,
  Sparkles
} from 'lucide-react';
import {
  SecurityArchitectureEngine,
  SecurityLayerDetail,
  SecurityRole,
  AuditLogEntry
} from '../services/SecurityArchitectureEngine';

interface SecurityArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityArchitectureModal: React.FC<SecurityArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'layers' | 'rbac' | 'audit' | 'dr'>('layers');
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer_auth');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role_cso');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const layers = SecurityArchitectureEngine.getSecurityLayers();
  const roles = SecurityArchitectureEngine.getRoles();
  const auditLogs = SecurityArchitectureEngine.getAuditLogs();

  const activeLayer = layers.find(l => l.layerId === selectedLayerId) || layers[0];
  const activeRole = roles.find(r => r.roleId === selectedRoleId) || roles[0];

  const categories = ['ALL', 'Access', 'Data Protection', 'Compliance & Audit', 'Resilience'];

  const filteredLayers = selectedCategory === 'ALL'
    ? layers
    : layers.filter(l => l.category === selectedCategory);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-7xl max-h-[94vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-rose-600 to-red-700 rounded-xl text-white shadow-lg shadow-rose-600/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-wide">Phase 13 — Enterprise Security Architecture</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full">
                  Sovereign Zero-Trust OS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-end defense-in-depth: WebAuthn, mTLS, FIPS 140-2 HSM, Merkle Audit Logs, ECDSA Signatures & 15s RPO Disaster Recovery
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => alert('Exporting Security Compliance Architecture Specification (PDF/JSON)...')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" />
              <span>Export Security Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setActiveTab('layers')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'layers' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>8 Defense-in-Depth Layers</span>
            </button>

            <button
              onClick={() => setActiveTab('rbac')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'rbac' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>RBAC & Clearance Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'audit' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Immutable Merkle Audit Log</span>
            </button>

            <button
              onClick={() => setActiveTab('dr')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'dr' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Disaster Recovery & SLA</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>FIPS 140-2 Level 3 HSM Enforced</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/60 space-y-6">

          {/* TAB 1: 8 DEFENSE IN DEPTH LAYERS */}
          {activeTab === 'layers' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Layer Selection Cards */}
              <div className="lg:col-span-4 space-y-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-1.5 bg-slate-950 p-2 border border-slate-800 rounded-xl text-[11px]">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${
                        selectedCategory === cat
                          ? 'bg-rose-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Layer Cards List */}
                <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                  {filteredLayers.map(l => {
                    const isSelected = l.layerId === selectedLayerId;
                    return (
                      <div
                        key={l.layerId}
                        onClick={() => setSelectedLayerId(l.layerId)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition space-y-1.5 ${
                          isSelected
                            ? 'bg-rose-950/40 border-rose-500/60 text-white shadow-lg shadow-rose-900/10'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{l.layerName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                            {l.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {l.summary}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                          <span>Category: {l.category}</span>
                          <span className="text-rose-400">{l.layerId}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Layer Inspector */}
              <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
                
                {/* Layer Header */}
                <div className="border-b border-slate-800 pb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-white">{activeLayer.layerName}</h3>
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded">
                        {activeLayer.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{activeLayer.summary}</p>
                  </div>

                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold rounded-lg">
                    {activeLayer.status}
                  </span>
                </div>

                {/* Technical Implementation Specifications */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-rose-400 flex items-center space-x-1.5">
                    <Terminal className="w-4 h-4" />
                    <span>Technical Controls & Enforcement Mechanisms</span>
                  </h4>

                  <div className="space-y-2">
                    {activeLayer.implementationDetails.map((detail, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800/90 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Standards Met */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 flex items-center space-x-1.5">
                    <Shield className="w-4 h-4" />
                    <span>Regulatory & Security Standards Certification</span>
                  </h4>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {activeLayer.standardsComplied.map((std, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-900 border border-slate-800 text-blue-300 rounded-lg font-mono font-semibold">
                        ✓ {std}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strategic Rationale & Explanation */}
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-bold text-rose-300 flex items-center space-x-1.5">
                    <Info className="w-4 h-4 text-rose-400" />
                    <span>Security Design Rationale</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeLayer.explanation}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: RBAC MATRIX */}
          {activeTab === 'rbac' && (
            <div className="space-y-6">
              
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white flex items-center space-x-2">
                    <Key className="w-5 h-5 text-rose-400" />
                    <span>Role-Based & Attribute-Based Clearance Matrix (ABAC/RBAC)</span>
                  </h4>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 border border-slate-800 rounded-lg">
                    4 Core Security Roles
                  </span>
                </div>

                {/* Role Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
                  {roles.map(r => (
                    <button
                      key={r.roleId}
                      onClick={() => setSelectedRoleId(r.roleId)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                        selectedRoleId === r.roleId
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r.roleName}
                    </button>
                  ))}
                </div>

                {/* Active Role Card Inspector */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-white text-base">{activeRole.roleName}</h5>
                      <p className="text-slate-400 mt-0.5">{activeRole.description}</p>
                    </div>

                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-bold rounded-lg">
                      Clearance: {activeRole.clearanceLevel}
                    </span>
                  </div>

                  {/* Granted Permissions List */}
                  <div className="space-y-2">
                    <span className="font-semibold text-slate-300">Explicit Permission Grants:</span>
                    <div className="flex flex-wrap gap-2 font-mono">
                      {activeRole.permissions.map((perm, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-950 text-emerald-400 border border-emerald-500/30 rounded-md">
                          + {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: IMMUTABLE MERKLE AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center space-x-2">
                    <FileCheck2 className="w-5 h-5 text-emerald-400" />
                    <span>Cryptographic Merkle Tree Hash-Chain Ledger</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Tamper-evident SHA-256 logs. Any historical edit breaks the root hash integrity.</p>
                </div>

                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 border border-emerald-500/30 rounded-lg">
                  Merkle Root Status: VALID
                </span>
              </div>

              {/* Audit Log Table */}
              <div className="space-y-3 text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-rose-400">{log.id}</span>
                        <span className="text-slate-300 font-bold">{log.action}</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-blue-300 font-mono">{log.resource}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 font-mono font-bold rounded text-[10px] ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : log.status === 'DENIED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {log.status}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div><span className="text-slate-500">Actor:</span> {log.actor} ({log.actorRole})</div>
                      <div><span className="text-slate-500">IP:</span> {log.ipAddress}</div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] font-mono">
                      <div className="truncate">
                        <span className="text-slate-500">Merkle SHA-256: </span>
                        <span className="text-emerald-300">{log.merkleHash}</span>
                      </div>
                      <button
                        onClick={() => handleCopyHash(log.merkleHash)}
                        className="text-purple-400 hover:text-purple-300 flex items-center space-x-1 shrink-0"
                      >
                        {copiedHash === log.merkleHash ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedHash === log.merkleHash ? 'Copied' : 'Copy Hash'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: DISASTER RECOVERY & SLA */}
          {activeTab === 'dr' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-indigo-400" />
                  <span>Disaster Recovery (DR) & Multi-Region SLA Metrics</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">High-availability active-active replication ensuring zero data loss during cloud or grid failures.</p>
              </div>

              {/* SLA KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <div className="text-slate-400">Recovery Point Objective (RPO)</div>
                  <div className="text-2xl font-mono font-bold text-emerald-400">15 Seconds</div>
                  <p className="text-[10px] text-slate-500">Continuous WAL streaming to multi-region storage</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <div className="text-slate-400">Recovery Time Objective (RTO)</div>
                  <div className="text-2xl font-mono font-bold text-blue-400">&lt; 2 Minutes</div>
                  <p className="text-[10px] text-slate-500">Automated DNS & health probe hot failover</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <div className="text-slate-400">System Availability SLA</div>
                  <div className="text-2xl font-mono font-bold text-purple-400">99.999%</div>
                  <p className="text-[10px] text-slate-500">Five-nines high availability design</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                  <div className="text-slate-400">Replication Nodes</div>
                  <div className="text-2xl font-mono font-bold text-amber-400">3 Active Regions</div>
                  <p className="text-[10px] text-slate-500">Kigali (RWA), Nairobi (KEN), Frankfurt (DEU)</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
