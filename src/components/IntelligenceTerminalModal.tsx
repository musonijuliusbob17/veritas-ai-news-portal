import React, { useState } from 'react';
import { Article } from '../types';
import { 
  Terminal, ShieldCheck, Globe, Activity, Cpu, Layers, Award, Users, 
  Building2, Sliders, Zap, CheckCircle2, Play, Download, Search, X, 
  ArrowRight, Landmark, Lock, FileText, Share2, Sparkles, Filter
} from 'lucide-react';

interface IntelligenceTerminalModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface TrustPartner {
  id: string;
  institutionName: string;
  category: 'UNIVERSITY' | 'THINK_TANK' | 'GOVERNMENT_AGENCY' | 'FINANCIAL_INSTITUTION' | 'NGO';
  reputationScore: number; // 0 - 100
  dataContributions: number;
  badge: string;
  verifiedStatus: boolean;
}

interface WorkflowTrigger {
  id: string;
  name: string;
  condition: string;
  action: string;
  status: 'ACTIVE' | 'PAUSED';
}

const TRUST_PARTNERS: TrustPartner[] = [
  {
    id: 'PARTNER-01',
    institutionName: 'Kigali Innovation & Tech Institute (KITI)',
    category: 'UNIVERSITY',
    reputationScore: 99.4,
    dataContributions: 1420,
    badge: 'GOLD RESEARCH PARTNER',
    verifiedStatus: true
  },
  {
    id: 'PARTNER-02',
    institutionName: 'European Sovereign Risk Observatory',
    category: 'THINK_TANK',
    reputationScore: 98.8,
    dataContributions: 3100,
    badge: 'KEY CONTRIBUTOR',
    verifiedStatus: true
  },
  {
    id: 'PARTNER-03',
    institutionName: 'International Maritime & Supply Telemetry Group',
    category: 'GOVERNMENT_AGENCY',
    reputationScore: 99.9,
    dataContributions: 8400,
    badge: 'STRATEGIC DATA PROVIDER',
    verifiedStatus: true
  }
];

const WORKFLOW_TRIGGERS: WorkflowTrigger[] = [
  {
    id: 'TRIG-01',
    name: 'Semiconductor Fab Lead-Time Anomaly',
    condition: 'When Foundry Delivery Lag > 45 Days',
    action: 'Trigger Procurement Alert & Auto-Generate Supply Dossier',
    status: 'ACTIVE'
  },
  {
    id: 'TRIG-02',
    name: 'Sovereign Debt Yield Spike Alert',
    condition: 'When Country Risk Rating drops > 5 points',
    action: 'Dispatch SMS to Executive Board & Re-balance FX Reserves',
    status: 'ACTIVE'
  }
];

export const IntelligenceTerminalModal: React.FC<IntelligenceTerminalModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'trust' | 'validation' | 'multimodal' | 'governance'>('terminal');
  const [selectedPartner, setSelectedPartner] = useState<TrustPartner>(TRUST_PARTNERS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notebookNote, setNotebookNote] = useState<string>('Analyst Note #402: High probability of logistics bottlenecks easing in East Africa following opening of Bugesera Airport cargo terminal.');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Terminal className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS INSTITUTIONAL INTELLIGENCE TERMINAL (v10.0)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  GLOBAL DEPLOYMENT READY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Institutional analyst workspace, global trust ecosystem, multi-modal ingestion engine, and enterprise automated workflows.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Bar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'terminal' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            💻 Analyst Workstation & Triggers
          </button>
          <button
            onClick={() => setActiveTab('trust')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'trust' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🤝 Global Trust Network & Partners
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'validation' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Real-World Validation Benchmark
          </button>
          <button
            onClick={() => setActiveTab('multimodal')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'multimodal' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📡 Multi-Modal Satellite & Sensor Engine
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'governance' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏛️ Governance Board & Regional Hubs
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 space-y-6">
          {/* TAB 1: ANALYST WORKSTATION */}
          {activeTab === 'terminal' && (
            <div className="space-y-6">
              {/* Terminal Multi-Screen Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Watchlist & Live Feeds */}
                <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    ENTITY WATCHLIST MONITOR
                  </h3>

                  <div className="space-y-2 text-xs font-mono">
                    {['Rwanda (Sovereign FDI)', 'TSMC (Semiconductors)', 'Bab-el-Mandeb (Maritime)', 'Eurozone Debt (Macro)'].map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span className="text-white font-bold">{item}</span>
                        <span className="text-emerald-400">● VERIFIED</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Triggers */}
                <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                    AUTOMATED WORKFLOW TRIGGERS
                  </h3>

                  <div className="space-y-2 text-xs font-mono">
                    {WORKFLOW_TRIGGERS.map(trig => (
                      <div key={trig.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-white text-[11px]">{trig.name}</strong>
                          <span className="text-emerald-400 text-[10px]">{trig.status}</span>
                        </div>
                        <p className="text-slate-400 text-[10px]">{trig.condition}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Research Notebook */}
                <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    ANALYST RESEARCH NOTEBOOK
                  </h3>

                  <textarea
                    value={notebookNote}
                    onChange={(e) => setNotebookNote(e.target.value)}
                    rows={5}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors">
                    SAVE TO INSTITUTIONAL REPOSITORY
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GLOBAL TRUST NETWORK */}
          {activeTab === 'trust' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
                <h3 className="text-base font-extrabold text-white">VERITAS GLOBAL TRUST NETWORK</h3>
                <p className="text-xs text-slate-400">
                  Federated network of verified universities, research institutes, government open data gateways, and financial institutions contributing audited intelligence dispatches.
                </p>
              </div>

              <div className="space-y-4">
                {TRUST_PARTNERS.map(partner => (
                  <div key={partner.id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <Landmark className="w-5 h-5 text-indigo-400" />
                        <div>
                          <h4 className="font-extrabold text-sm text-white">{partner.institutionName}</h4>
                          <span className="text-xs font-mono text-slate-400">{partner.category} • {partner.badge}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-mono font-bold">
                        VERIFIED PARTNER (REPUTATION: {partner.reputationScore}%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>CONTRIBUTED DATASETS: <strong className="text-white">{partner.dataContributions} DISPATCHES</strong></span>
                      <span>STATUS: <strong className="text-emerald-400">CRYPTOGRAPHIC TRUST SIGNED</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REAL-WORLD VALIDATION BENCHMARK */}
          {activeTab === 'validation' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-indigo-400 font-bold">PUBLIC INTELLIGENCE PERFORMANCE BENCHMARK</span>
                  <h3 className="text-lg font-black text-white mt-1">Real-World Forecast Validation Report</h3>
                </div>
                <div className="text-right font-mono">
                  <span className="text-slate-400 text-[10px] block">VERITAS BENCHMARK SCORE</span>
                  <strong className="text-indigo-400 text-3xl font-black">99.6 / 100</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 block">FORECAST PRECISION</span>
                  <strong className="text-emerald-400 text-xl font-bold">99.8%</strong>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 block">FALSE ALERTS</span>
                  <strong className="text-rose-400 text-xl font-bold">&lt; 0.01%</strong>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 block">SATELLITE AUDIT</span>
                  <strong className="text-cyan-400 text-xl font-bold">100% MATCH</strong>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 block">GLOBAL UPTIME</span>
                  <strong className="text-indigo-400 text-xl font-bold">99.999%</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MULTI-MODAL INGESTION */}
          {activeTab === 'multimodal' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
                <h3 className="text-base font-extrabold text-white">AUTONOMOUS MULTI-MODAL INGESTION ENGINE</h3>
                <p className="text-xs text-slate-400">
                  Ingesting satellite synthetic aperture radar (SAR), thermal imaging, hydrophone acoustic feeds, SWIFT wire messages, and corporate SEC filings into unified vector intelligence objects.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-indigo-400 font-bold block">🛰️ SATELLITE & SAR DATA</span>
                  <p className="text-slate-300">Continuous 15-minute orbital imagery pass over major port chokepoints and agricultural zones.</p>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-purple-400 font-bold block">🎙️ TELEMETRY & ACOUSTIC LOGS</span>
                  <p className="text-slate-300">Red Sea underwater hydrophone telemetry for subsea cable vibration monitoring.</p>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-emerald-400 font-bold block">📄 CORPORATE & OPEN DATA</span>
                  <p className="text-slate-300">Real-time SEC EDGAR filings, customs manifests, and AfCFTA trade receipts parsing.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GOVERNANCE BOARD */}
          {activeTab === 'governance' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
                <h3 className="text-base font-extrabold text-white">INTERNATIONAL GOVERNANCE BOARD & REGIONAL HUBS</h3>
                <p className="text-xs text-slate-400">
                  Overseeing AI ethics, algorithmic bias audits, data residency compliance, and regional intelligence hubs across Kigali, Geneva, Singapore, and Washington D.C.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-indigo-400 font-bold block">KIGALI HUB</span>
                  <p className="text-slate-300">Pan-African & Emerging Market Headquarters</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-purple-400 font-bold block">GENEVA HUB</span>
                  <p className="text-slate-300">Sovereign Risk & Diplomatic Standards</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-bold block">SINGAPORE HUB</span>
                  <p className="text-slate-300">Indo-Pacific & Supply Chain Infrastructure</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold block">WASHINGTON HUB</span>
                  <p className="text-slate-300">Multilateral Policy & Compliance Oversight</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
