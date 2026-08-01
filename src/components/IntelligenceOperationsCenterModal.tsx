import React, { useState } from 'react';
import { Article } from '../types';
import { 
  Compass, ShieldCheck, AlertTriangle, Cpu, TrendingUp, Globe, FileText, 
  Layers, Zap, CheckCircle2, Play, Volume2, Download, HelpCircle, ArrowRight, X, Search, Activity, Users, Radio
} from 'lucide-react';

interface IntelligenceOperationsCenterModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface EarlyWarningAlert {
  id: string;
  threatType: string;
  region: string;
  probability: number; // 0-100%
  timeframe: string;
  escalationStatus: 'CRITICAL' | 'ELEVATED' | 'WATCH';
  historicalComparison: string;
  recommendedAction: string;
}

interface ScenarioSimulation {
  id: string;
  title: string;
  category: string;
  recommendation: 'STRONG PROCEED' | 'PROCEED WITH MITIGATION' | 'HIGH RISK DEFER';
  confidenceScore: number;
  marketStabilityScore: number;
  keyDrivers: string[];
  riskFactors: string[];
  alternativeScenarios: string[];
}

interface ForecastRecord {
  id: string;
  prediction: string;
  predictionDate: string;
  targetDate: string;
  probabilityStated: number;
  outcomeStatus: 'VERIFIED ACCURATE' | 'PARTIALLY ACCURATE' | 'INCORRECT';
  actualOutcome: string;
  accuracyScore: number; // 0 - 100%
}

const EARLY_WARNINGS: EarlyWarningAlert[] = [
  {
    id: 'EW-2026-09',
    threatType: 'Semiconductor Fabrication Bottleneck',
    region: 'East Asia & North America',
    probability: 88,
    timeframe: 'Next 30-60 Days',
    escalationStatus: 'CRITICAL',
    historicalComparison: 'Matches 2021 Automotive Chip Drought trajectory.',
    recommendedAction: 'Pre-book secondary packaging quota in European foundries; hedge raw neon gas inventories.'
  },
  {
    id: 'EW-2026-04',
    threatType: 'Sovereign Debt Currency Devaluation',
    region: 'South America & Sub-Saharan Trade Zone',
    probability: 74,
    timeframe: 'Next 14 Days',
    escalationStatus: 'ELEVATED',
    historicalComparison: 'Correlates with 2018 Emerging Market FX Spreads.',
    recommendedAction: 'Shift short-term liquidity into SDR-backed reserves and hard-currency trade guarantees.'
  },
  {
    id: 'EW-2026-01',
    threatType: 'Subsea Data Cable Physical Disruption',
    region: 'Red Sea & Horn of Africa Corridor',
    probability: 62,
    timeframe: 'Next 72 Hours',
    escalationStatus: 'WATCH',
    historicalComparison: 'Resembles 2022 Mediterranean Cable Severance incident.',
    recommendedAction: 'Activate satellite backup links & re-route high-frequency trading data packets via trans-continental terrestrial optical fiber.'
  }
];

const SCENARIO_SIMULATIONS: ScenarioSimulation[] = [
  {
    id: 'SC-01',
    title: 'Enterprise Expansion: Establishing AI & EV Hub in Kigali, Rwanda',
    category: 'FOREIGN DIRECT INVESTMENT (FDI)',
    recommendation: 'STRONG PROCEED',
    confidenceScore: 94,
    marketStabilityScore: 89,
    keyDrivers: [
      'High sovereign ease of doing business rank (Kigali Innovation City incentives)',
      'Sub-Saharan pan-African AfCFTA tariff-free market access',
      'Stable inflation and hard-currency repatriation guarantees'
    ],
    riskFactors: [
      'Regional supply chain logistics dependency on Mombasa & Dar es Salaam port throughput'
    ],
    alternativeScenarios: [
      'Scenario B: Establish dual-hub structure with Nairobi to spread port transit risks.',
      'Scenario C: Delay capital deployment until Bugesera International Airport cargo terminal opens.'
    ]
  },
  {
    id: 'SC-02',
    title: 'Taiwan Semiconductor Supply Risk Hedge for European Automakers',
    category: 'SUPPLY CHAIN RESILIENCE',
    recommendation: 'PROCEED WITH MITIGATION',
    confidenceScore: 91,
    marketStabilityScore: 65,
    keyDrivers: [
      'Diversification of 28nm microcontroller sourcing to Dresden Silicon Saxony fabs',
      'Multi-year off-take agreements with Arizona fab sites'
    ],
    riskFactors: [
      'Short-term margin compression of 2.4% due to higher European labor/wafer costs'
    ],
    alternativeScenarios: [
      'Scenario B: Maintain 100% Asian foundry sourcing while holding 180-day safety stock buffer.',
      'Scenario C: Accelerate transition to wide-bandgap Silicon Carbide (SiC) modules.'
    ]
  }
];

const HISTORICAL_FORECASTS: ForecastRecord[] = [
  {
    id: 'FC-8821',
    prediction: 'Central Bank of Europe will maintain interest rates despite headline energy spikes in Q1 2026.',
    predictionDate: '2026-01-10',
    targetDate: '2026-03-15',
    probabilityStated: 92,
    outcomeStatus: 'VERIFIED ACCURATE',
    actualOutcome: 'ECB maintained key benchmark rate at 3.50% verbatim as predicted.',
    accuracyScore: 99
  },
  {
    id: 'FC-7410',
    prediction: 'Horn of Africa agricultural yield will recover 18% following short-rains precipitation.',
    predictionDate: '2026-02-01',
    targetDate: '2026-06-01',
    probabilityStated: 85,
    outcomeStatus: 'VERIFIED ACCURATE',
    actualOutcome: 'FAO crop harvest reports confirmed a 19.2% increase in regional cereal production.',
    accuracyScore: 96
  },
  {
    id: 'FC-6192',
    prediction: 'Global container shipping freight index will rise by 40% due to Suez maritime rerouting.',
    predictionDate: '2025-11-20',
    targetDate: '2026-02-01',
    probabilityStated: 78,
    outcomeStatus: 'PARTIALLY ACCURATE',
    actualOutcome: 'Freight rates increased by 28.5% before carrier capacity adjustments stabilized rates.',
    accuracyScore: 84
  }
];

export const IntelligenceOperationsCenterModal: React.FC<IntelligenceOperationsCenterModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [activeTab, setActiveTab] = useState<'ops' | 'ews' | 'decision' | 'accuracy' | 'briefs'>('ops');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioSimulation>(SCENARIO_SIMULATIONS[0]);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  const handleRunSimulation = () => {
    if (!customQuery.trim()) return;
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Command Center Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS INTELLIGENCE OPERATIONS CENTER (IOC)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
                  COMMAND DECISION SUITE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Institutional threat monitoring, early warning signals, autonomous scenario simulation, and forecast accuracy verification.
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

        {/* Command Center Nav Bar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('ops')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'ops' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🕹️ Command Radar
          </button>
          <button
            onClick={() => setActiveTab('ews')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'ews' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚠️ Early Warning System ({EARLY_WARNINGS.length})
          </button>
          <button
            onClick={() => setActiveTab('decision')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'decision' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Veritas Decision Engine
          </button>
          <button
            onClick={() => setActiveTab('accuracy')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'accuracy' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Prediction Accuracy Index (94.8%)
          </button>
          <button
            onClick={() => setActiveTab('briefs')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'briefs' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎙️ Executive Intelligence Briefs
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 space-y-6">
          {/* TAB 1: COMMAND RADAR OVERVIEW */}
          {activeTab === 'ops' && (
            <div className="space-y-6">
              {/* Executive Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 font-mono space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">ACTIVE THREAT MATRIX</span>
                  <div className="flex items-center justify-between">
                    <strong className="text-2xl font-black text-rose-400">14 CRITICAL</strong>
                    <span className="text-xs text-rose-500">↑ 2 IN 24H</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 font-mono space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">SOVEREIGN RISK AVERAGE</span>
                  <div className="flex items-center justify-between">
                    <strong className="text-2xl font-black text-amber-400">42.4 / 100</strong>
                    <span className="text-xs text-amber-500">STABLE</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 font-mono space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">SUPPLY CHAIN VULNERABILITY</span>
                  <div className="flex items-center justify-between">
                    <strong className="text-2xl font-black text-emerald-400">MODERATE</strong>
                    <span className="text-xs text-emerald-500">CHOKEPOINTS MONITOR</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 font-mono space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">VERITAS FORECAST SCORE</span>
                  <div className="flex items-center justify-between">
                    <strong className="text-2xl font-black text-indigo-400">94.8%</strong>
                    <span className="text-xs text-indigo-400">ACCURACY</span>
                  </div>
                </div>
              </div>

              {/* Command Center Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Threat Sector Stream */}
                <div className="md:col-span-2 bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      GLOBAL MULTI-SECTOR MONITORING STREAM
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-400">● REAL-TIME DISPATCH AGGREGATOR</span>
                  </div>

                  <div className="space-y-3">
                    {articles.slice(0, 4).map(art => (
                      <div
                        key={art.id}
                        onClick={() => onSelectArticle(art)}
                        className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-amber-400 border border-slate-800">
                              {art.category}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">{art.publisher}</span>
                          </div>
                          <h4 className="font-bold text-xs text-white line-clamp-1">{art.title}</h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 whitespace-nowrap">
                          {art.credibilityScore}% VERIFIED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Action Decision Panel */}
                <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    INSTITUTIONAL DASHBOARDS
                  </h3>

                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('decision')}
                      className="w-full p-3 bg-slate-950 hover:bg-slate-800 rounded-2xl border border-slate-800 text-left transition-all flex items-center justify-between group"
                    >
                      <div>
                        <strong className="text-xs text-white block">Run Investment Risk Engine</strong>
                        <span className="text-[10px] font-mono text-slate-400">Simulate FDI & supply trade-offs</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                    </button>

                    <button
                      onClick={() => setActiveTab('ews')}
                      className="w-full p-3 bg-slate-950 hover:bg-slate-800 rounded-2xl border border-slate-800 text-left transition-all flex items-center justify-between group"
                    >
                      <div>
                        <strong className="text-xs text-white block">Review Early Warnings</strong>
                        <span className="text-[10px] font-mono text-slate-400">Evaluate escalation vectors</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                    </button>

                    <button
                      onClick={() => setActiveTab('briefs')}
                      className="w-full p-3 bg-slate-950 hover:bg-slate-800 rounded-2xl border border-slate-800 text-left transition-all flex items-center justify-between group"
                    >
                      <div>
                        <strong className="text-xs text-white block">Listen to Daily Briefing</strong>
                        <span className="text-[10px] font-mono text-slate-400">Executive synthesized voice summary</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EARLY WARNING SYSTEM */}
          {activeTab === 'ews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  PREDICTIVE RISK ESCALATION DETECTOR
                </h3>
                <span className="text-xs font-mono text-rose-400 font-bold">● 3 ESCALATION THREATS IDENTIFIED</span>
              </div>

              <div className="space-y-4">
                {EARLY_WARNINGS.map(ew => (
                  <div key={ew.id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                          ew.escalationStatus === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                          ew.escalationStatus === 'ELEVATED' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-blue-400'
                        }`}>
                          STATUS: {ew.escalationStatus}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{ew.region}</span>
                        <span className="text-xs font-mono text-slate-500">• ID: {ew.id}</span>
                      </div>
                      <span className="text-xs font-mono text-rose-400 font-bold">PROBABILITY: {ew.probability}%</span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base text-white">{ew.threatType}</h4>
                      <p className="text-xs text-slate-300 mt-1 font-mono">Timeframe: {ew.timeframe} • {ew.historicalComparison}</p>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
                      <strong className="text-amber-400 text-[10px] font-mono block uppercase">RECOMMENDED PRE-EMPTIVE MITIGATION ACTION</strong>
                      <p>{ew.recommendedAction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VERITAS DECISION ENGINE */}
          {activeTab === 'decision' && (
            <div className="space-y-6">
              {/* Custom Query Input Box */}
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  SIMULATE STRATEGIC DECISION QUERY
                </h3>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="e.g. 'Should a multinational company invest in Rwanda's technology sector?'"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleRunSimulation}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-2xl transition-colors flex items-center gap-2"
                  >
                    {isSimulating ? <Zap className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    {isSimulating ? 'COMPUTING...' : 'RUN DECISION SIMULATOR'}
                  </button>
                </div>
              </div>

              {/* Saved Pre-computed Scenarios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SCENARIO_SIMULATIONS.map(sc => (
                  <div key={sc.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-[10px] font-mono text-slate-400">{sc.category}</span>
                      <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-mono font-bold">
                        {sc.recommendation}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-white">{sc.title}</h4>
                      <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mt-2">
                        <span>Confidence: <strong className="text-emerald-400">{sc.confidenceScore}%</strong></span>
                        <span>Stability Score: <strong className="text-amber-400">{sc.marketStabilityScore}/100</strong></span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <span className="text-slate-500 block uppercase font-bold text-[10px]">KEY DECISION DRIVERS</span>
                      <ul className="space-y-1 text-slate-300">
                        {sc.keyDrivers.map((driver, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{driver}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                      <span className="text-amber-400 text-[10px] font-bold block">ALTERNATIVE SCENARIO TREES</span>
                      <p>{sc.alternativeScenarios.join(' • ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PREDICTION ACCURACY INDEX */}
          {activeTab === 'accuracy' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-indigo-400 font-bold">VERITAS FORECAST ACCURACY AUDIT</span>
                  <h3 className="text-lg font-black text-white mt-1">Autonomous Prediction Record & Verification</h3>
                  <p className="text-xs text-slate-400">
                    All forecasts produced by Veritas AI models are timestamped, registered on-chain, and benchmarked against ground truth outcomes.
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-slate-500 text-[10px] block">CUMULATIVE MODEL ACCURACY</span>
                  <strong className="text-indigo-400 text-3xl font-black">94.8%</strong>
                </div>
              </div>

              <div className="space-y-3">
                {HISTORICAL_FORECASTS.map(fc => (
                  <div key={fc.id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {fc.outcomeStatus}
                        </span>
                        <span className="text-slate-400">Forecasted: {fc.predictionDate}</span>
                      </div>
                      <span className="text-indigo-400 font-bold">ACCURACY SCORE: {fc.accuracyScore}%</span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-white">"{fc.prediction}"</h4>
                      <p className="text-xs text-slate-300 mt-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                        <strong className="text-emerald-400 text-[10px] font-mono block">VERIFIED REAL-WORLD OUTCOME</strong>
                        {fc.actualOutcome}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EXECUTIVE BRIEFINGS */}
          {activeTab === 'briefs' && (
            <div className="space-y-6">
              {/* Audio Dispatch Bar */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setAudioPlaying(!audioPlaying)}
                    className="p-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white shadow-lg transition-all"
                  >
                    {audioPlaying ? <Volume2 className="w-6 h-6 animate-pulse" /> : <Play className="w-6 h-6" />}
                  </button>
                  <div>
                    <span className="text-xs font-mono text-amber-400 font-bold">TODAY'S EXECUTIVE AUDIO BRIEFING (4:12 MINS)</span>
                    <h3 className="text-sm font-bold text-white">Global Geopolitical, Tech & Africa Market Intelligence Synthesis</h3>
                  </div>
                </div>

                <button className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2">
                  <Download className="w-4 h-4" /> EXPORT PDF DOSSIER
                </button>
              </div>

              {/* Briefing Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs text-white flex items-center justify-between">
                    <span>🌍 Africa Intelligence Brief</span>
                    <span className="text-[10px] text-emerald-400 font-mono">NEW</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Kigali tech expansion, West African crude refinery exports, and AfCFTA cross-border payment corridors.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs text-white flex items-center justify-between">
                    <span>💻 Semiconductor & AI Policy</span>
                    <span className="text-[10px] text-emerald-400 font-mono">NEW</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    TSMC fab lead times, EU AI Act compliance milestones, and rare earth supply quotas.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs text-white flex items-center justify-between">
                    <span>⚓ Critical Supply Chain Brief</span>
                    <span className="text-[10px] text-emerald-400 font-mono">NEW</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Red Sea maritime transit rerouting, Panama Canal daily locks limits, and freight rate indices.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
