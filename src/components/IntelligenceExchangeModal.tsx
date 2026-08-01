import React, { useState } from 'react';
import { Article } from '../types';
import { 
  Network, Globe, Cpu, Layers, ShieldCheck, Zap, Bot, Share2, 
  Search, ArrowRight, Download, CheckCircle2, Award, Terminal, 
  Activity, X, Key, DollarSign, RefreshCw, FileText, Lock, Users,
  Sliders, AlertTriangle, Play, ChevronRight, Database, BookOpen
} from 'lucide-react';

interface IntelligenceExchangeModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface VixpObject {
  vixpId: string;
  type: 'DISPATCH' | 'DEPENDENCY_GRAPH' | 'RISK_MODEL' | 'EXPERT_REPORT';
  title: string;
  creator: string;
  timestamp: string;
  confidenceEvolution: string;
  evidenceChain: string[];
  cryptoSignature: string;
  verificationStatus: string;
}

interface DependencyNodeQuery {
  targetNode: string;
  affectedSystems: string[];
  exposedCountries: string[];
  exposedCompanies: string[];
  cascadingRiskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
}

interface ExchangeAgentLog {
  agentName: string;
  actionType: 'DISCOVERY' | 'NEGOTIATION' | 'VERIFICATION' | 'LICENSING' | 'PAYMENT';
  details: string;
  timestamp: string;
}

interface AiModelProduct {
  modelId: string;
  modelName: string;
  category: 'RISK' | 'CLIMATE' | 'ECONOMIC' | 'SUPPLY_CHAIN';
  developer: string;
  accuracyScore: string;
  licensingFee: string;
}

interface ExpertProfile {
  id: string;
  name: string;
  domain: string;
  reputationScore: number;
  badge: string;
  peerReviews: number;
}

const VIXP_OBJECTS: VixpObject[] = [
  {
    vixpId: 'VIXP-2026-901',
    type: 'DISPATCH',
    title: 'Red Sea Underwater Optical Cable Vibration Anomaly',
    creator: 'Maritime Sensor Telemetry Alliance',
    timestamp: '2026-08-01 08:45 UTC',
    confidenceEvolution: '78% -> 94% -> 99.8%',
    evidenceChain: ['Hydrophone Acoustic Log #1102', 'SAR Satellite Transit #44', 'Analyst Audit ID #904'],
    cryptoSignature: '0x8f7c1a99b2e4d5c6a1f3049b772e81',
    verificationStatus: 'VIXP STANDARDS CERTIFIED'
  },
  {
    vixpId: 'VIXP-2026-902',
    type: 'DEPENDENCY_GRAPH',
    title: 'TSMC Hsinchu Fab 18 Downstream Cascade Matrix',
    creator: 'Veritas Autonomous Graph Lab',
    timestamp: '2026-08-01 07:20 UTC',
    confidenceEvolution: '95% -> 99.1%',
    evidenceChain: ['EDGAR SEC Filings', 'Customs Manifest Telemetry', 'Sub-tier Supplier Graph'],
    cryptoSignature: '0x3a4b9c1d2e5f6a7b8c9d0e1f2a3b4c',
    verificationStatus: 'VIXP STANDARDS CERTIFIED'
  }
];

const DEPENDENCY_QUERIES: DependencyNodeQuery[] = [
  {
    targetNode: 'TSMC Hsinchu Fab 18 (3nm/2nm Nodes)',
    affectedSystems: [
      'Global Hyperscale Data Center AI Accelerators',
      'Automotive ADAS Microcontrollers (EU/US)',
      'Consumer Mobile SoC Assembly Lines'
    ],
    exposedCountries: ['United States', 'Germany', 'Japan', 'South Korea', 'Rwanda (Tech Hub)'],
    exposedCompanies: ['NVIDIA', 'Apple', 'ASML', 'Tesla', 'Kigali Innovation Hub'],
    cascadingRiskLevel: 'CRITICAL'
  },
  {
    targetNode: 'Bab-el-Mandeb Maritime Bottleneck',
    affectedSystems: [
      'Europe-Asia Container Transit Fleets',
      'East African Refined Fuel Import Pipeline',
      'Subsea Telecom Trunk Lines (EIG, SEA-ME-WE 5)'
    ],
    exposedCountries: ['Egypt', 'Kenya', 'Rwanda', 'Djibouti', 'Italy'],
    exposedCompanies: ['Maersk', 'MSC', 'Ethiopian Logistics', 'MTN Group'],
    cascadingRiskLevel: 'HIGH'
  }
];

const AGENT_LOGS: ExchangeAgentLog[] = [
  {
    agentName: 'Discovery Agent #04',
    actionType: 'DISCOVERY',
    details: 'Discovered new satellite SAR dispatch from European Space Observatory regarding Suez anchorage lead times.',
    timestamp: '08:52:10 UTC'
  },
  {
    agentName: 'Negotiation Agent #12',
    actionType: 'NEGOTIATION',
    details: 'Agreed on $0.004 VIXP micro-license per telemetry query with African Ports Authority API.',
    timestamp: '08:51:45 UTC'
  },
  {
    agentName: 'Verification Agent #01',
    actionType: 'VERIFICATION',
    details: 'Validated Merkle root 0x8f7c1a9... against institutional ledger; zero tampering detected.',
    timestamp: '08:50:30 UTC'
  }
];

const AI_MODELS: AiModelProduct[] = [
  {
    modelId: 'MOD-01',
    modelName: 'Veritas Cascade-Risk 4.0',
    category: 'SUPPLY_CHAIN',
    developer: 'Veritas Autonomous AI Lab',
    accuracyScore: '99.4%',
    licensingFee: '$1,200 / mo'
  },
  {
    modelId: 'MOD-02',
    modelName: 'Macro-Economic Shock Model (AfCFTA)',
    category: 'ECONOMIC',
    developer: 'Kigali Tech & Policy Institute',
    accuracyScore: '98.9%',
    licensingFee: '$850 / mo'
  }
];

const EXPERTS: ExpertProfile[] = [
  {
    id: 'EXP-101',
    name: 'Dr. Amina K. Mutanguha',
    domain: 'East African Logistics & Sovereign Risk',
    reputationScore: 99.8,
    badge: 'VERIFIED DOMAIN CHAIR',
    peerReviews: 142
  },
  {
    id: 'EXP-102',
    name: 'Prof. Marcus Vance',
    domain: 'Subsea Infrastructure & Fiber Security',
    reputationScore: 99.2,
    badge: 'SENIOR FELLOW',
    peerReviews: 98
  }
];

export const IntelligenceExchangeModal: React.FC<IntelligenceExchangeModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [activeTab, setActiveTab] = useState<'vixp' | 'graph' | 'agents' | 'models' | 'experts'>('vixp');
  const [selectedVixp, setSelectedVixp] = useState<VixpObject>(VIXP_OBJECTS[0]);
  const [selectedQuery, setSelectedQuery] = useState<DependencyNodeQuery>(DEPENDENCY_QUERIES[0]);
  const [exportedJson, setExportedJson] = useState<boolean>(false);

  const handleExportVixp = () => {
    setExportedJson(true);
    setTimeout(() => setExportedJson(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Network className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS INTELLIGENCE EXCHANGE PROTOCOL (VIXP v12.0)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  GLOBAL INTEROPERABILITY LAYER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Universal intelligence object standard, global dependency graph 2.0, autonomous exchange agents, and expert network.
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
            onClick={() => setActiveTab('vixp')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'vixp' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📄 VIXP Object Protocol Inspector
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'graph' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🕸️ Global Dependency Graph 2.0
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'agents' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🤖 Autonomous Exchange Agents
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'models' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🧠 AI Model Marketplace
          </button>
          <button
            onClick={() => setActiveTab('experts')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'experts' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎓 Global Expert Network
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 space-y-6">
          {/* TAB 1: VIXP PROTOCOL INSPECTOR */}
          {activeTab === 'vixp' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* VIXP Objects */}
              <div className="w-full md:w-88 space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  REGISTERED VIXP OBJECTS
                </h3>

                {VIXP_OBJECTS.map(obj => {
                  const isSelected = selectedVixp.vixpId === obj.vixpId;
                  return (
                    <div
                      key={obj.vixpId}
                      onClick={() => setSelectedVixp(obj)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-950 to-slate-900 border-cyan-500 shadow-lg'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                          {obj.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{obj.vixpId}</span>
                      </div>
                      <h4 className="font-bold text-xs text-white">{obj.title}</h4>
                      <p className="text-[10px] font-mono text-slate-500">{obj.timestamp}</p>
                    </div>
                  );
                })}
              </div>

              {/* Inspector Card */}
              <div className="flex-1 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold">VIXP PORTABLE OBJECT SPECIFICATION</span>
                    <h3 className="text-xl font-black text-white">{selectedVixp.title}</h3>
                    <span className="text-xs font-mono text-slate-400">ID: {selectedVixp.vixpId} • Creator: {selectedVixp.creator}</span>
                  </div>

                  <button
                    onClick={handleExportVixp}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {exportedJson ? 'VIXP OBJECT EXPORTED' : 'EXPORT JSON-VIXP'}
                  </button>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">CONFIDENCE EVOLUTION</span>
                    <strong className="text-cyan-400 block mt-1">{selectedVixp.confidenceEvolution}</strong>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">EVIDENCE PROVENANCE CHAIN</span>
                    <strong className="text-slate-300 block mt-1">{selectedVixp.evidenceChain.join(' → ')}</strong>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block uppercase font-bold text-[10px]">VERIFICATION STATUS</span>
                      <strong className="text-emerald-400 block mt-0.5">{selectedVixp.verificationStatus}</strong>
                    </div>
                    <span className="text-slate-400 text-[10px]">HASH: <code className="text-cyan-400">{selectedVixp.cryptoSignature}</code></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GLOBAL DEPENDENCY GRAPH 2.0 */}
          {activeTab === 'graph' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
                <h3 className="text-base font-extrabold text-white">GLOBAL DEPENDENCY GRAPH 2.0 & RISK PROPAGATION</h3>
                <p className="text-xs text-slate-400">
                  Simulating multi-tier supply chain failures, infrastructure disruptions, and sovereign debt risk transmission across global entities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEPENDENCY_QUERIES.map((q, idx) => (
                  <div key={idx} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">TARGET NODE SIMULATION</span>
                        <h4 className="font-extrabold text-sm text-white">{q.targetNode}</h4>
                      </div>
                      <span className="px-3 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-full text-xs font-mono font-bold">
                        RISK: {q.cascadingRiskLevel}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block uppercase text-[10px] font-bold">AFFECTED INFRASTRUCTURE & SYSTEMS</span>
                        <p className="text-slate-200 mt-0.5">{q.affectedSystems.join(' • ')}</p>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block uppercase text-[10px] font-bold">EXPOSED SOVEREIGN NATIONS</span>
                        <p className="text-cyan-300 mt-0.5">{q.exposedCountries.join(' • ')}</p>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block uppercase text-[10px] font-bold">EXPOSED ENTERPRISE ENTITIES</span>
                        <p className="text-indigo-300 mt-0.5">{q.exposedCompanies.join(' • ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUTONOMOUS EXCHANGE AGENTS */}
          {activeTab === 'agents' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
                <h3 className="text-base font-extrabold text-white">AUTONOMOUS INTELLIGENCE EXCHANGE AGENTS</h3>
                <p className="text-xs text-slate-400">
                  Autonomous AI agents continuously discover, negotiate micro-licensing contracts, verify evidence graphs, and settle payments.
                </p>
              </div>

              <div className="space-y-3">
                {AGENT_LOGS.map((log, idx) => (
                  <div key={idx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <Bot className="w-5 h-5 text-cyan-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-white">{log.agentName}</strong>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                            {log.actionType}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-0.5">{log.details}</p>
                      </div>
                    </div>

                    <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI MODEL MARKETPLACE */}
          {activeTab === 'models' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
                <h3 className="text-base font-extrabold text-white">AUTONOMOUS AI MODEL MARKETPLACE</h3>
                <p className="text-xs text-slate-400">
                  Publish, license, and execute specialized AI models for economic forecasting, climate risk modeling, and supply chain cascade analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AI_MODELS.map(m => (
                  <div key={m.modelId} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-400 font-bold">{m.category}</span>
                      <strong className="text-white text-base">{m.licensingFee}</strong>
                    </div>

                    <h4 className="font-extrabold text-sm text-white">{m.modelName}</h4>

                    <div className="text-[10px] font-mono text-slate-400 bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                      <div>DEVELOPER: <strong className="text-slate-200">{m.developer}</strong></div>
                      <div>ACCURACY SCORE: <strong className="text-emerald-400">{m.accuracyScore}</strong></div>
                    </div>

                    <button className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-colors">
                      SUBSCRIBE & RUN IN PRIVACY ENCLAVE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GLOBAL EXPERT NETWORK */}
          {activeTab === 'experts' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
                <h3 className="text-base font-extrabold text-white">VERIFIED GLOBAL EXPERT NETWORK</h3>
                <p className="text-xs text-slate-400">
                  Vetted institutional researchers and domain chairs providing peer-reviewed human oversight and strategic validation.
                </p>
              </div>

              <div className="space-y-4">
                {EXPERTS.map(exp => (
                  <div key={exp.id} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-sm">{exp.name}</strong>
                        <span className="px-2.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                          {exp.badge}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{exp.domain}</p>
                      <span className="text-slate-500 text-[10px]">PEER REVIEWS COMPLETED: {exp.peerReviews}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] block">REPUTATION SCORE</span>
                      <strong className="text-emerald-400 text-lg font-bold">{exp.reputationScore}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
