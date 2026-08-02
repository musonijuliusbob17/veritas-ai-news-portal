import React, { useState } from 'react';
import { Article } from '../types';
import { 
  ShieldCheck, Cpu, Database, Award, Bot, AlertTriangle, Layers, Activity, 
  Globe, FileText, CheckCircle2, Lock, Search, RefreshCw, X, ArrowRight, Zap, 
  Terminal, UserCheck, Eye, Key, ShieldAlert, Sparkles, Sliders
} from 'lucide-react';

interface IntelligenceOperatingSystemModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface IntelligenceObject {
  id: string;
  type: 'DISPATCH' | 'EVENT' | 'SOVEREIGN_RISK' | 'PREDICTION' | 'CERTIFICATE';
  title: string;
  timestamp: string;
  confidenceEvolution: string; // e.g., "78% -> 94% -> 99%"
  sourceHistory: string[];
  aiProcessingTrail: string[];
  humanReviewer: string;
  provenanceHash: string;
}

interface RedTeamAgent {
  name: string;
  role: string;
  avatarColor: string;
  latestChallenge: string;
  verdict: 'CHALLENGED' | 'PASSED WITH REVISIONS' | 'APPROVED';
}

interface InstitutionalMemoryQuery {
  id: string;
  prompt: string;
  matchedHistoricalEvents: string[];
  patternSimilarity: number;
  predictiveLessons: string;
}

const INTELLIGENCE_OBJECTS: IntelligenceObject[] = [
  {
    id: 'OBJ-2026-9901',
    type: 'DISPATCH',
    title: 'Subsea Cable Severance Threat Assessment - Red Sea Corridor',
    timestamp: '2026-08-01 08:30 UTC',
    confidenceEvolution: '72% (Crawler) → 91% (Multi-Agent Debate) → 99% (Analyst Audit)',
    sourceHistory: ['Satellite SAR Imagery Feed #44', 'IMO Telegraph Wires', 'Telecom Sensor Telemetry'],
    aiProcessingTrail: ['Vector Clustering', 'Fact Verification Sentinel', 'Red Team Skeptic Review'],
    humanReviewer: 'Senior Analyst ID #904 (Cleared Level 5)',
    provenanceHash: '0x8f7c1a99b2e4d5c6a1f3049b772e81'
  },
  {
    id: 'OBJ-2026-8412',
    type: 'PREDICTION',
    title: 'Q3 East African Freight Cost Volatility Index Scenario',
    timestamp: '2026-08-01 06:15 UTC',
    confidenceEvolution: '85% (Initial) → 94% (Consensus)',
    sourceHistory: ['Mombasa Port Shipping Manifests', 'AfCFTA Trade Tariff Database'],
    aiProcessingTrail: ['Macro-Economic Model v4.2', 'Scenario Tree Simulator'],
    humanReviewer: 'Lead Trade Economist Analyst ID #112',
    provenanceHash: '0x3a4b9c1d2e5f6a7b8c9d0e1f2a3b4c'
  }
];

const RED_TEAM_AGENTS: RedTeamAgent[] = [
  {
    name: 'Skeptic Agent (Adversarial Critic)',
    role: 'Challenges baseline assumptions & identifies unverified claims',
    avatarColor: 'from-rose-600 to-red-700',
    latestChallenge: 'Questioned early report attributing Red Sea cable latency to sabotage before verifying underwater acoustic hydrophone logs.',
    verdict: 'PASSED WITH REVISIONS'
  },
  {
    name: 'Alternative Scenario Agent',
    role: 'Constructs low-probability, high-impact counter scenarios',
    avatarColor: 'from-amber-600 to-orange-700',
    latestChallenge: 'Modeled alternative outcome where Panama Canal transit restrictions lift 3 weeks earlier than NOAA precipitation projections.',
    verdict: 'APPROVED'
  },
  {
    name: 'Data Quality & Bias Sentinel',
    role: 'Scans source dispatches for publication bias & sentiment manipulation',
    avatarColor: 'from-purple-600 to-indigo-700',
    latestChallenge: 'Flagged 12 press releases containing promotional language; stripped non-verifiable claims before vector ingestion.',
    verdict: 'PASSED WITH REVISIONS'
  }
];

const INSTITUTIONAL_MEMORY_QUERIES: InstitutionalMemoryQuery[] = [
  {
    id: 'MEM-01',
    prompt: 'What occurred during past maritime strait traffic disruptions in East Africa?',
    matchedHistoricalEvents: [
      '2021 Suez Canal Ever Given Obstruction (6-day blockage)',
      '2024 Red Sea Commercial Vessel Rerouting Episode'
    ],
    patternSimilarity: 96,
    predictiveLessons: 'Historical memory shows container freight spot tariffs spike +35% within 14 days, followed by carrier capacity re-allocations via Cape of Good Hope.'
  },
  {
    id: 'MEM-02',
    prompt: 'How did global tech supply chains react to historical neon gas export restrictions?',
    matchedHistoricalEvents: [
      '2022 Black Sea Refining Industrial Shutdown'
    ],
    patternSimilarity: 94,
    predictiveLessons: 'Fab lead times increased by 4-6 weeks; semiconductor foundries holding >90 days inventory absorbed price shocks with zero line shutdowns.'
  }
];

export const IntelligenceOperatingSystemModal: React.FC<IntelligenceOperatingSystemModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [activeTab, setActiveTab] = useState<'os' | 'redteam' | 'memory' | 'quality' | 'certification' | 'copilot'>('os');
  const [selectedObj, setSelectedObj] = useState<IntelligenceObject>(INTELLIGENCE_OBJECTS[0]);
  const [copilotQuery, setCopilotQuery] = useState<string>('');
  const [copilotResponse, setCopilotResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const handleCopilotAsk = () => {
    if (!copilotQuery.trim()) return;
    setIsThinking(true);
    setCopilotResponse(null);
    setTimeout(() => {
      setIsThinking(false);
      setCopilotResponse(`Executive Analysis for: "${copilotQuery}"\n\n1. Primary Risk Vector: Geopolitical and supply corridor vulnerability score currently stands at 42.4/100 (Stable with localized elevated alerts).\n2. Recommended Executive Protocol: Hedge short-term freight logistics contracts, monitor TSMC advanced node packaging lead times, and maintain SDR-backed currency reserves.\n3. Confidence Calibration: 98.4% verified across 14 independent satellite and financial telemetry feeds.`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS INTELLIGENCE OPERATING SYSTEM (VERITAS OS v9.0)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  GLOBAL TRUST & PROVENANCE UTILITY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Unified intelligence object registry, adversarial red team verification, long-term institutional memory, and cryptographic certificates.
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
            onClick={() => setActiveTab('os')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'os' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🖥️ OS Object Registry
          </button>
          <button
            onClick={() => setActiveTab('redteam')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'redteam' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚔️ Adversarial Red Team Review
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'memory' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🧠 Institutional Long-Term Memory
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'quality' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔬 Quality Evaluation Lab
          </button>
          <button
            onClick={() => setActiveTab('certification')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'certification' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📜 Cryptographic Report Certification
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'copilot' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🤖 Veritas Executive Copilot
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 space-y-6">
          {/* TAB 1: OS OBJECT REGISTRY */}
          {activeTab === 'os' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Object List */}
              <div className="w-full md:w-88 space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  REGISTERED INTELLIGENCE OBJECTS
                </h3>

                {INTELLIGENCE_OBJECTS.map(obj => {
                  const isSelected = selectedObj.id === obj.id;
                  return (
                    <div
                      key={obj.id}
                      onClick={() => setSelectedObj(obj)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-950 to-slate-900 border-emerald-500 shadow-lg'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                          {obj.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{obj.id}</span>
                      </div>
                      <h4 className="font-bold text-xs text-white">{obj.title}</h4>
                      <p className="text-[10px] font-mono text-slate-500">{obj.timestamp}</p>
                    </div>
                  );
                })}
              </div>

              {/* Object Inspector */}
              <div className="flex-1 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">INTELLIGENCE OBJECT AUDIT TRAIL</span>
                    <h3 className="text-xl font-black text-white">{selectedObj.title}</h3>
                    <span className="text-xs font-mono text-slate-400">ID: {selectedObj.id} • Registered: {selectedObj.timestamp}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">CONFIDENCE EVOLUTION STAGES</span>
                    <strong className="text-emerald-400 block mt-1">{selectedObj.confidenceEvolution}</strong>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">INGESTED SOURCE DISPATCHES</span>
                    <strong className="text-slate-300 block mt-1">{selectedObj.sourceHistory.join(' • ')}</strong>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">AI PROCESSING PIPELINE TRAIL</span>
                    <strong className="text-cyan-400 block mt-1">{selectedObj.aiProcessingTrail.join(' → ')}</strong>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block uppercase font-bold text-[10px]">SENIOR HUMAN ANALYST APPROVAL</span>
                      <strong className="text-white block mt-0.5">{selectedObj.humanReviewer}</strong>
                    </div>
                    <span className="text-slate-400 text-[10px]">PROVENANCE HASH: <code className="text-emerald-400">{selectedObj.provenanceHash}</code></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADVERSARIAL RED TEAM REVIEW */}
          {activeTab === 'redteam' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
                <h3 className="text-base font-extrabold text-white">AUTONOMOUS ADVERSARIAL RED TEAM SYSTEM</h3>
                <p className="text-xs text-slate-400">
                  Before any intelligence dispatch or scenario model is published, specialized adversarial agents subject the conclusions to rigorous stress-testing and counter-hypothesis modeling.
                </p>
              </div>

              <div className="space-y-4">
                {RED_TEAM_AGENTS.map((agent, idx) => (
                  <div key={idx} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-2xl bg-gradient-to-tr ${agent.avatarColor} text-white font-bold text-xs`}>
                          RED
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-white">{agent.name}</h4>
                          <span className="text-xs font-mono text-slate-400">{agent.role}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                        agent.verdict === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        VERDICT: {agent.verdict}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
                      <strong className="text-rose-400 font-mono text-[10px] block uppercase">ADVERSARIAL CHALLENGE LOG</strong>
                      <p className="leading-relaxed">{agent.latestChallenge}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INSTITUTIONAL LONG-TERM MEMORY */}
          {activeTab === 'memory' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
                <h3 className="text-base font-extrabold text-white">INSTITUTIONAL LONG-TERM INTELLIGENCE MEMORY</h3>
                <p className="text-xs text-slate-400">
                  Cross-referencing real-time dispatches against decades of historical crisis records, market shocks, and policy interventions.
                </p>
              </div>

              <div className="space-y-4">
                {INSTITUTIONAL_MEMORY_QUERIES.map(q => (
                  <div key={q.id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-extrabold text-sm text-white">QUERY: "{q.prompt}"</h4>
                      <span className="text-xs font-mono text-emerald-400 font-bold">PATTERN SIMILARITY: {q.patternSimilarity}%</span>
                    </div>

                    <div className="text-xs font-mono text-slate-300 space-y-1">
                      <span className="text-slate-500 block uppercase text-[10px] font-bold">MATCHED HISTORICAL EVENT CLUSTERS</span>
                      <p className="text-slate-200">{q.matchedHistoricalEvents.join(' • ')}</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
                      <strong className="text-emerald-400 font-mono text-[10px] block uppercase">PREDICTIVE STRATEGIC LESSONS EXTRAPOLATED</strong>
                      <p className="leading-relaxed">{q.predictiveLessons}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUALITY LAB */}
          {activeTab === 'quality' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">VERITAS QUALITY EVALUATION LAB</span>
                  <h3 className="text-lg font-black text-white mt-1">Continuous Model & Source Calibration</h3>
                </div>
                <div className="text-right font-mono">
                  <span className="text-slate-400 text-[10px] block">MONTHLY ACCURACY REPORT</span>
                  <strong className="text-emerald-400 text-3xl font-black">99.2%</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 block">SOURCE PRECISION</span>
                  <strong className="text-emerald-400 text-xl font-bold">99.6%</strong>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 block">HUMAN OVERRIDE RATE</span>
                  <strong className="text-cyan-400 text-xl font-bold">0.14%</strong>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 block">MISSED EVENTS</span>
                  <strong className="text-indigo-400 text-xl font-bold">0.00%</strong>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 block">CALIBRATION SCORE</span>
                  <strong className="text-emerald-400 text-xl font-bold">99.8 / 100</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CRYPTOGRAPHIC CERTIFICATION */}
          {activeTab === 'certification' && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-amber-400" />
                  <div>
                    <h3 className="text-base font-extrabold text-white">VERITAS CRYPTOGRAPHIC INTELLIGENCE CERTIFICATE</h3>
                    <span className="text-xs font-mono text-slate-400">AUTHENTICITY VERIFICATION ID: CERT-VERITAS-994827-2026</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-mono font-bold">
                  VALID & AUDITED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">SOURCES CONSUMED</span>
                  <strong className="text-white">14 Verified Feeds</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">AI MODEL ENGINE</span>
                  <strong className="text-emerald-400">Gemini 3.6 Enterprise</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">ANALYST SIGNATURE</span>
                  <strong className="text-indigo-400">Analyst #904 (Level 5)</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">CONFIDENCE METRIC</span>
                  <strong className="text-emerald-400">99.4% Verified</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: VERITAS EXECUTIVE COPILOT */}
          {activeTab === 'copilot' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  VERITAS EXECUTIVE AI COPILOT
                </h3>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={copilotQuery}
                    onChange={(e) => setCopilotQuery(e.target.value)}
                    placeholder="Ask strategic questions: e.g., 'What are the top investment and logistics risks in East Africa this quarter?'"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleCopilotAsk}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl transition-colors flex items-center gap-2"
                  >
                    {isThinking ? <Zap className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isThinking ? 'ANALYZING...' : 'ASK COPILOT'}
                  </button>
                </div>
              </div>

              {copilotResponse && (
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
                  <span className="text-xs font-mono text-emerald-400 font-bold block">COPILOT EXECUTIVE BRIEF</span>
                  <pre className="text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    {copilotResponse}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
