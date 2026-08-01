import React, { useState } from 'react';
import { 
  Code, Key, BookOpen, Layers, Check, Copy, Zap, Terminal, Globe, 
  ShoppingBag, Download, ArrowRight, X, ShieldCheck, Bot, Award, Sparkles, 
  Users, Sliders, DollarSign, FileCheck, Share2, Activity, Filter
} from 'lucide-react';

interface DeveloperApiMarketplaceModalProps {
  onClose: () => void;
}

interface IntelligenceProduct {
  id: string;
  title: string;
  category: string;
  creator: string;
  price: string;
  confidenceScore: number;
  sourcesUsed: number;
  verificationStatus: string;
  updateFrequency: string;
  historicalAccuracy: string;
  version: string;
  certificateHash: string;
}

interface CustomAgentConfig {
  id: string;
  name: string;
  objective: string;
  sources: string;
  alertConditions: string;
  schedule: string;
  status: 'RUNNING' | 'PAUSED';
}

const MARKETPLACE_PRODUCTS: IntelligenceProduct[] = [
  {
    id: 'PROD-2026-01',
    title: 'East Africa AfCFTA Trade & Logistics Dossier',
    category: 'Supply Chain & Country',
    creator: 'Kigali Tech & Policy Institute',
    price: '$499.00',
    confidenceScore: 99.4,
    sourcesUsed: 38,
    verificationStatus: 'CRYPTOGRAPHICALLY AUDITED',
    updateFrequency: 'Real-time (Hourly)',
    historicalAccuracy: '99.8%',
    version: 'v4.2.0',
    certificateHash: '0x994827a1f30b9c'
  },
  {
    id: 'PROD-2026-02',
    title: 'Global Semiconductor Packaging Bottleneck Forecast 2026-2030',
    category: 'Technology & Company',
    creator: 'Veritas Autonomous AI Lab',
    price: '$899.00',
    confidenceScore: 98.7,
    sourcesUsed: 52,
    verificationStatus: 'RED TEAM VERIFIED',
    updateFrequency: 'Daily Briefings',
    historicalAccuracy: '99.1%',
    version: 'v3.1.0',
    certificateHash: '0x77c2e1f409a8b1'
  },
  {
    id: 'PROD-2026-03',
    title: 'Red Sea Subsea Cable Vulnerability & Acoustic Telemetry Report',
    category: 'Security & Infrastructure',
    creator: 'Maritime & Telecom Sensor Alliance',
    price: '$1,200.00',
    confidenceScore: 99.9,
    sourcesUsed: 14,
    verificationStatus: 'CRYPTOGRAPHICALLY AUDITED',
    updateFrequency: 'Continuous Sensor Stream',
    historicalAccuracy: '100.0%',
    version: 'v1.0.4',
    certificateHash: '0x33b8a1094f2d7c'
  }
];

const INITIAL_CUSTOM_AGENTS: CustomAgentConfig[] = [
  {
    id: 'AGENT-01',
    name: 'My Semiconductor Risk Watcher',
    objective: 'Monitor TSMC, Samsung & ASML supply chain lead times',
    sources: 'SEC Filings, Customs Telemetry, Industry Wires',
    alertConditions: 'When delivery lag shifts > 14 days',
    schedule: 'Every 6 hours',
    status: 'RUNNING'
  },
  {
    id: 'AGENT-02',
    name: 'My East Africa FDI Strategic Analyst',
    objective: 'Track infrastructure investments & AfCFTA tariffs in Rwanda and Kenya',
    sources: 'Central Bank Press Releases, IMO Port Manifests',
    alertConditions: 'When sovereign risk rating fluctuates > 2.5 points',
    schedule: 'Daily Morning Brief',
    status: 'RUNNING'
  }
];

export const DeveloperApiMarketplaceModal: React.FC<DeveloperApiMarketplaceModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'custom_agents' | 'certificates' | 'contributor' | 'api'>('marketplace');
  const [apiKey] = useState<string>('vts_live_99482710385710928a7b');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [products] = useState<IntelligenceProduct[]>(MARKETPLACE_PRODUCTS);
  const [customAgents, setCustomAgents] = useState<CustomAgentConfig[]>(INITIAL_CUSTOM_AGENTS);
  
  // New Agent Form
  const [agentName, setAgentName] = useState<string>('');
  const [agentObjective, setAgentObjective] = useState<string>('');
  const [agentSources, setAgentSources] = useState<string>('Global Dispatches + Satellite Telemetry');
  const [agentAlert, setAgentAlert] = useState<string>('When risk score exceeds 75/100');

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName.trim() || !agentObjective.trim()) return;

    const newAgent: CustomAgentConfig = {
      id: `AGENT-${Date.now().toString().slice(-4)}`,
      name: agentName,
      objective: agentObjective,
      sources: agentSources,
      alertConditions: agentAlert,
      schedule: 'Real-time Autonomous',
      status: 'RUNNING'
    };

    setCustomAgents([newAgent, ...customAgents]);
    setAgentName('');
    setAgentObjective('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20">
              <ShoppingBag className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS GLOBAL INTELLIGENCE MARKETPLACE & ECONOMY (v11.0)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-950 text-teal-300 border border-teal-800">
                  AUTONOMOUS ECONOMY READY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Buy, sell, license, and create verified intelligence assets, custom AI agents, and cryptographic report certificates.
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
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'marketplace' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🛒 Verified Intelligence Catalog
          </button>
          <button
            onClick={() => setActiveTab('custom_agents')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'custom_agents' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🤖 Custom AI Intelligence Agents
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'certificates' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📜 Digital Assets & Certificates
          </button>
          <button
            onClick={() => setActiveTab('contributor')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'contributor' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏆 Contributor Economy & Index
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'api' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔑 Enterprise Graph & REST APIs
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 space-y-6">
          {/* TAB 1: VERIFIED MARKETPLACE CATALOG */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-teal-400 font-bold">AUTONOMOUS INTELLIGENCE MARKETPLACE</span>
                  <h3 className="text-lg font-black text-white mt-1">Verified Reports & Licensed Datasets</h3>
                </div>
                <div className="text-right font-mono">
                  <span className="text-slate-400 text-[10px] block">TOTAL LICENSED ASSETS</span>
                  <strong className="text-emerald-400 text-2xl font-black">14,820 DOSSIERS</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(prod => (
                  <div key={prod.id} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-teal-400 font-bold">{prod.category}</span>
                      <strong className="text-white text-base font-bold">{prod.price}</strong>
                    </div>

                    <h4 className="font-extrabold text-sm text-white">{prod.title}</h4>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <div>CREATOR: <strong className="text-slate-200">{prod.creator}</strong></div>
                      <div>CONFIDENCE: <strong className="text-emerald-400">{prod.confidenceScore}%</strong></div>
                      <div>SOURCES: <strong className="text-slate-200">{prod.sourcesUsed} Feeds</strong></div>
                      <div>HISTORICAL ACCURACY: <strong className="text-cyan-400">{prod.historicalAccuracy}</strong></div>
                      <div>UPDATE FREQ: <strong className="text-slate-200">{prod.updateFrequency}</strong></div>
                      <div>HASH: <code className="text-emerald-400">{prod.certificateHash}</code></div>
                    </div>

                    <button className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      PURCHASE & LICENSE INSTANT ACCESS
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM AI INTELLIGENCE AGENTS */}
          {activeTab === 'custom_agents' && (
            <div className="space-y-6">
              {/* Deploy New Agent Form */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                  CREATE CUSTOM SPECIALIZED AI AGENT
                </h3>

                <form onSubmit={handleCreateAgent} className="space-y-3 text-xs font-mono">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Agent Name</label>
                      <input
                        type="text"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        placeholder="e.g. My Semiconductor Risk Analyst"
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Data Sources</label>
                      <input
                        type="text"
                        value={agentSources}
                        onChange={(e) => setAgentSources(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Strategic Objective</label>
                    <input
                      type="text"
                      value={agentObjective}
                      onChange={(e) => setAgentObjective(e.target.value)}
                      placeholder="e.g. Monitor TSMC lead times and flag supply disruptions"
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Bot className="w-4 h-4" />
                    DEPLOY CUSTOM AUTONOMOUS AGENT
                  </button>
                </form>
              </div>

              {/* Active Custom Agents List */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  YOUR ACTIVE CUSTOM AGENTS
                </h4>

                {customAgents.map(ag => (
                  <div key={ag.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-sm">{ag.name}</strong>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                          {ag.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{ag.objective}</p>
                      <span className="text-slate-500 text-[10px]">SOURCES: {ag.sources}</span>
                    </div>

                    <span className="text-slate-400 text-[10px]">{ag.schedule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DIGITAL ASSETS & CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-amber-400" />
                  <div>
                    <h3 className="text-base font-extrabold text-white">VERITAS INTELLIGENCE DIGITAL ASSET CERTIFICATE</h3>
                    <span className="text-xs font-mono text-slate-400">PROVENANCE TOKEN: VTS-NFT-2026-994827</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-mono font-bold">
                  ON-CHAIN VERIFIED
                </span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed space-y-2">
                <strong className="text-teal-400 block uppercase text-[10px]">CRYPTOGRAPHIC RECORD SPECIFICATION</strong>
                <p>
                  Every report published or purchased on Veritas Global is stamped with a SHA-256 Merkle root containing source telemetry, AI model weights version, analyst level-5 signature, and historical prediction accuracy.
                </p>
                <div className="text-[10px] text-slate-500">
                  MERKLE ROOT: <code>0x8f7c1a99b2e4d5c6a1f3049b772e81904a87b32c</code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTRIBUTOR ECONOMY */}
          {activeTab === 'contributor' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-teal-400 font-bold">VERITAS REPUTATION INDEX & REVENUE SHARE</span>
                  <h3 className="text-lg font-black text-white mt-1">Contributor Economy Dashboard</h3>
                </div>
                <div className="text-right font-mono">
                  <span className="text-slate-400 text-[10px] block">REVENUE SHARED THIS MONTH</span>
                  <strong className="text-emerald-400 text-2xl font-black">$482,900 USD</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-teal-400 font-bold block">RESEARCH INSTITUTES</span>
                  <p className="text-slate-300">Earn 70% royalty on licensed dataset subscriptions.</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-cyan-400 font-bold block">INDEPENDENT ANALYSTS</span>
                  <p className="text-slate-300">Paid per verified human audit & red team review.</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-bold block">DATA PROVIDERS</span>
                  <p className="text-slate-300">Automated micro-payments for sensor stream ingestion.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: API ACCESS */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-teal-400 font-bold">PRODUCTION API KEY</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">Enterprise Tier Access</h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-mono font-bold">
                    UNLIMITED RATE
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-xs">
                  <span className="text-slate-300 flex-1 truncate">{apiKey}</span>
                  <button
                    onClick={handleCopyKey}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 text-xs"
                  >
                    {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedKey ? 'COPIED' : 'COPY KEY'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
