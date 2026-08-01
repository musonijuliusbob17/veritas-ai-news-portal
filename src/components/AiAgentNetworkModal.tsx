import React, { useState } from 'react';
import { Article } from '../types';
import { Bot, Cpu, ShieldCheck, Zap, Activity, Filter, ChevronRight, MessageSquare, Sparkles, X, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';

interface AiAgentNetworkModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface AgentPersona {
  id: string;
  name: string;
  domain: string;
  avatarColor: string;
  status: 'ACTIVE' | 'PROCESSING';
  lastActive: string;
  briefingTitle: string;
  briefingSummary: string;
  confidenceScore: number;
  recommendations: string[];
}

interface AgentDebateThread {
  id: string;
  topic: string;
  agentA: string;
  agentB: string;
  agentAArgument: string;
  agentBChallenge: string;
  consensusConclusion: string;
  finalConfidence: number;
}

const AI_AGENTS: AgentPersona[] = [
  {
    id: 'agent-chief',
    name: 'Chief Intelligence Agent (Executive Synthesizer)',
    domain: 'Executive Synthesis',
    avatarColor: 'from-amber-600 to-rose-600',
    status: 'ACTIVE',
    lastActive: '30 SECS AGO',
    briefingTitle: 'Cross-Domain Global Risk & Macro Stability Brief',
    briefingSummary: 'Synthesized insights from 8 specialized sub-agents. Global geopolitical tension elevated in maritime bottlenecks, offset by strong FDI momentum in East Africa.',
    confidenceScore: 99,
    recommendations: ['Prioritize supply corridor diversification', 'Issue executive briefing on semiconductor fab lead times']
  },
  {
    id: 'agent-geopolitical',
    name: 'Geopolitical Analyst Agent',
    domain: 'Politics & Diplomacy',
    avatarColor: 'from-blue-600 to-indigo-600',
    status: 'ACTIVE',
    lastActive: '2 MINS AGO',
    briefingTitle: 'Multilateral Trade Agreements & Strait Security',
    briefingSummary: 'Monitored diplomatic cables across 18 capital cities. High probability of bilateral trade re-negotiation following legislative sessions.',
    confidenceScore: 98,
    recommendations: ['Monitor parliamentary committee calendar', 'Cross-verify diplomatic draft language']
  },
  {
    id: 'agent-economic',
    name: 'Macro-Economic Analyst Agent',
    domain: 'Macroeconomics',
    avatarColor: 'from-emerald-600 to-teal-600',
    status: 'ACTIVE',
    lastActive: '5 MINS AGO',
    briefingTitle: 'Central Bank Rate Expectations & Debt Yields',
    briefingSummary: 'Synthesized treasury bond yields and sovereign debt spreads. Energy commodity futures stabilizing ahead of policy assembly.',
    confidenceScore: 96,
    recommendations: ['Track currency exchange variance', 'Review commodity futures liquidity']
  },
  {
    id: 'agent-tech',
    name: 'Technology Analyst Agent',
    domain: 'Tech & Semiconductors',
    avatarColor: 'from-purple-600 to-violet-600',
    status: 'ACTIVE',
    lastActive: '1 MIN AGO',
    briefingTitle: 'Semiconductor Fab Capacity & Model Safety',
    briefingSummary: 'Assessed global foundry output reports. Advanced node fabrication demand remains robust, with safety benchmarks adopted by 40+ labs.',
    confidenceScore: 99,
    recommendations: ['Audit EU AI Act compliance timelines', 'Track rare earth supply contracts']
  },
  {
    id: 'agent-africa',
    name: 'Africa Specialist Agent',
    domain: 'African Markets & Tech',
    avatarColor: 'from-amber-600 to-orange-600',
    status: 'ACTIVE',
    lastActive: '8 MINS AGO',
    briefingTitle: 'AfCFTA Implementation & East African Tech Corridors',
    briefingSummary: 'Intra-African trade volumes increased 14% year-over-year. Kigali, Nairobi, and Lagos fintech hubs lead cross-border settlement infrastructure.',
    confidenceScore: 97,
    recommendations: ['Monitor mobile money cross-border gateways', 'Track renewable grid investments in Rwanda & Kenya']
  },
  {
    id: 'agent-cyber',
    name: 'Cybersecurity Sentinel Agent',
    domain: 'Cyber & Grid Security',
    avatarColor: 'from-red-600 to-rose-600',
    status: 'ACTIVE',
    lastActive: '3 MINS AGO',
    briefingTitle: 'Critical Infrastructure Zero-Day Threat Audit',
    briefingSummary: 'Scanned 120 global energy grid substations. Contained zero-day telemetry anomalies with zero operational downtime.',
    confidenceScore: 98,
    recommendations: ['Deploy post-quantum firmware encryption', 'Audit SCADA isolated networks']
  },
  {
    id: 'agent-climate',
    name: 'Climate Risk Agent',
    domain: 'Climate & Sustainability',
    avatarColor: 'from-teal-600 to-cyan-600',
    status: 'ACTIVE',
    lastActive: '12 MINS AGO',
    briefingTitle: 'Renewable Storage Scaling & Thermal Satellite Data',
    briefingSummary: 'Satellite thermal mapping indicates historic solar power generation yields in Southern Europe and Northern Africa.',
    confidenceScore: 95,
    recommendations: ['Audit regional battery storage reserve levels', 'Review water security advisories']
  },
  {
    id: 'agent-markets',
    name: 'Financial Markets Analyst Agent',
    domain: 'Capital & Equities',
    avatarColor: 'from-indigo-600 to-sky-600',
    status: 'ACTIVE',
    lastActive: '4 MINS AGO',
    briefingTitle: 'Global Equity Liquidity & Sovereign Bond Flows',
    briefingSummary: 'Monitored institutional capital allocations. Tech and renewable energy infrastructure funds recorded $12.4B net inflow this week.',
    confidenceScore: 96,
    recommendations: ['Hedge foreign exchange volatility', 'Track high-yield corporate credit risk']
  },
  {
    id: 'agent-fact',
    name: 'Fact Verification Sentinel Agent',
    domain: 'Fact Verification & Audit',
    avatarColor: 'from-rose-600 to-pink-600',
    status: 'ACTIVE',
    lastActive: '30 SECS AGO',
    briefingTitle: 'Deepfake & Synthetic Media Detection Audit',
    briefingSummary: 'Audited 420 viral social dispatches. Zero synthetic audio artifacts detected in verified mainstream wire feeds.',
    confidenceScore: 100,
    recommendations: ['Maintain cryptographic signature verification on images', 'Flag unverified social dispatches']
  }
];

const DEBATE_THREADS: AgentDebateThread[] = [
  {
    id: 'DEB-01',
    topic: 'Impact of Bab-el-Mandeb Maritime Transit Rerouting on EU Inflation',
    agentA: 'Macro-Economic Analyst Agent',
    agentB: 'Fact Verification Sentinel Agent',
    agentAArgument: 'Initial model predicted a 1.2% headline inflation surge across the Eurozone due to doubled container shipping freight tariffs.',
    agentBChallenge: 'Cross-reference of carrier spot rates demonstrates that 60% of shippers operate under multi-year fixed contracts, mitigating immediate consumer price spikes.',
    consensusConclusion: 'Revised Inflation Impact: Restricted to +0.35% over Q2, primarily localized to energy and perishable agricultural imports.',
    finalConfidence: 96
  },
  {
    id: 'DEB-02',
    topic: 'TSMC Advanced Packaging Bottleneck Timeline',
    agentA: 'Technology Analyst Agent',
    agentB: 'Geopolitical Analyst Agent',
    agentAArgument: 'CoWoS packaging capacity deficit will persist until Q4 2026, creating GPU delivery lag.',
    agentBChallenge: 'New OSAT packaging facility expansions in Dresden & Penang come online in Q3, easing bottleneck earlier than projected.',
    consensusConclusion: 'Synthesized Lead Time: Bottleneck will peak in Q2 and ease significantly by late Q3 2026.',
    finalConfidence: 94
  }
];

export const AiAgentNetworkModal: React.FC<AiAgentNetworkModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'debates' | 'departments'>('roster');
  const [selectedAgent, setSelectedAgent] = useState<AgentPersona>(AI_AGENTS[0]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">AUTONOMOUS INTELLIGENCE AGENT NETWORK 2.0</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  9 AGENTS COLLABORATING
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Specialized AI agent team continuously debating, challenging hypotheses, verifying evidence, and publishing intelligence products.
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
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-3 text-xs">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'roster' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🤖 Specialized Agent Roster ({AI_AGENTS.length})
          </button>
          <button
            onClick={() => setActiveTab('debates')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'debates' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Autonomous Agent Debate Chamber ({DEBATE_THREADS.length})
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'departments' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏛️ AI Virtual Research Departments (6)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-6 space-y-6">
          {activeTab === 'roster' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Agent Roster List */}
              <div className="w-full md:w-88 bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-3 max-h-[70vh] overflow-y-auto">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  COLLABORATIVE TEAM ROSTER
                </h3>

                {AI_AGENTS.map(agent => {
                  const isSelected = selectedAgent.id === agent.id;
                  return (
                    <div
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-950 to-slate-900 border-purple-500 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-purple-400">{agent.domain}</span>
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          {agent.lastActive}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs text-white leading-snug">{agent.name}</h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                        <span>Confidence:</span>
                        <strong className="text-emerald-400">{agent.confidenceScore}%</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Agent Briefing Panel */}
              <div className="flex-1 space-y-6">
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl bg-gradient-to-tr ${selectedAgent.avatarColor} text-white font-black text-sm`}>
                        AI
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">{selectedAgent.name}</h3>
                        <span className="text-xs font-mono text-purple-400">{selectedAgent.domain}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">CONFIDENCE METRIC</span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                        {selectedAgent.confidenceScore}% ACCURACY
                      </span>
                    </div>
                  </div>

                  {/* Briefing Card */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-400 font-mono">CURRENT INTELLIGENCE DISPATCH</span>
                      <span className="text-xs font-mono text-slate-400">{selectedAgent.lastActive}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{selectedAgent.briefingTitle}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{selectedAgent.briefingSummary}</p>
                  </div>

                  {/* Actionable Recommendations */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">STRATEGIC ACTION ITEMS</h4>
                    <div className="space-y-2">
                      {selectedAgent.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTONOMOUS AGENT DEBATE CHAMBER */}
          {activeTab === 'debates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  LIVE AGENT CROSS-EXAMINATION & CHALLENGE LOGS
                </h3>
                <span className="text-xs font-mono text-purple-400 font-bold">● DEBATE PROTOCOL ACTIVE</span>
              </div>

              <div className="space-y-4">
                {DEBATE_THREADS.map(deb => (
                  <div key={deb.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-extrabold text-sm text-white">DEBATE TOPIC: {deb.topic}</h4>
                      <span className="px-3 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-full text-xs font-mono font-bold">
                        CONSENSUS CONFIDENCE: {deb.finalConfidence}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Agent A Argument */}
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-blue-400 font-mono font-bold text-[10px] block">PRIMARY HYPOTHESIS BY {deb.agentA.toUpperCase()}</span>
                        <p className="text-slate-300 leading-relaxed">{deb.agentAArgument}</p>
                      </div>

                      {/* Agent B Challenge */}
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-amber-400 font-mono font-bold text-[10px] block">EVIDENTIARY CHALLENGE BY {deb.agentB.toUpperCase()}</span>
                        <p className="text-slate-300 leading-relaxed">{deb.agentBChallenge}</p>
                      </div>
                    </div>

                    {/* Final Consensus Conclusion */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-900/60 text-xs text-slate-200 space-y-1">
                      <strong className="text-emerald-400 font-mono text-[10px] block uppercase">SYNTHESIZED CONSENSUS OUTCOME</strong>
                      <p className="font-bold">{deb.consensusConclusion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AI VIRTUAL RESEARCH DEPARTMENTS */}
          {activeTab === 'departments' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
                <h3 className="text-base font-extrabold text-white">AUTONOMOUS VIRTUAL RESEARCH DEPARTMENTS</h3>
                <p className="text-xs text-slate-400">
                  Self-governing AI research teams equipped with Lead Agents, Field Analysts, Verification Sentinels, and Publication Engines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'Economic Research Department',
                    lead: 'Chief Macro-Economic Agent',
                    analysts: ['Sovereign Debt Yield Analyst', 'FDI Flow Tracking Agent'],
                    verifier: 'Fact Verification Sentinel',
                    publisher: 'Macro Dispatches Engine',
                    currentFocus: 'Global central bank rate alignment & commodity futures variance'
                  },
                  {
                    name: 'Technology Research Department',
                    lead: 'Chief Technology Analyst Agent',
                    analysts: ['Advanced Semiconductor Fab Agent', 'AI Safety & Governance Agent'],
                    verifier: 'Hardware Spec Sentinel',
                    publisher: 'Tech Infrastructure Dispatcher',
                    currentFocus: 'CoWoS packaging bottlenecks & post-quantum encryption standards'
                  },
                  {
                    name: 'Africa Research Department',
                    lead: 'Pan-African Specialist Lead Agent',
                    analysts: ['AfCFTA Trade Corridor Agent', 'Fintech Settlement Gateways Agent'],
                    verifier: 'Cross-Border Wire Sentinel',
                    publisher: 'African Markets Intelligence Engine',
                    currentFocus: 'Kigali-Nairobi tech corridor capital inflows & renewable grid scaling'
                  },
                  {
                    name: 'Security & Defense Department',
                    lead: 'Cybersecurity Sentinel Lead',
                    analysts: ['Critical Infrastructure Grid Agent', 'Maritime Bottleneck Sentinel'],
                    verifier: 'Zero-Day Telemetry Sentinel',
                    publisher: 'Strategic Security Threat Engine',
                    currentFocus: 'Subsea cable monitoring & SCADA system anomaly detection'
                  },
                  {
                    name: 'Climate & Sustainability Department',
                    lead: 'Climate Risk Lead Agent',
                    analysts: ['Thermal Satellite Mapper Agent', 'Renewable Storage Reserve Agent'],
                    verifier: 'Earth Observation Sentinel',
                    publisher: 'Global Sustainability Bulletin',
                    currentFocus: 'Battery energy storage system (BESS) capacity & hydrologic stress mapping'
                  },
                  {
                    name: 'Market Intelligence Department',
                    lead: 'Financial Capital Lead Agent',
                    analysts: ['Equities Liquidity Agent', 'High-Yield Corporate Credit Agent'],
                    verifier: 'SEC Wire Verification Sentinel',
                    publisher: 'Capital Markets Terminal Engine',
                    currentFocus: 'Institutional capital allocations & cross-border currency hedging'
                  }
                ].map((dept, idx) => (
                  <div key={idx} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-sm text-purple-400">{dept.name}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                        ACTIVE
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-slate-300">
                        <strong className="text-slate-400">Lead Agent:</strong> {dept.lead}
                      </p>
                      <p className="text-slate-300">
                        <strong className="text-slate-400">Analysts:</strong> {dept.analysts.join(', ')}
                      </p>
                      <p className="text-slate-300">
                        <strong className="text-slate-400">Verifier & Publisher:</strong> {dept.verifier} → {dept.publisher}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
                      <strong className="text-purple-400 text-[10px] block uppercase">CURRENT RESEARCH DIRECTIVE</strong>
                      {dept.currentFocus}
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
