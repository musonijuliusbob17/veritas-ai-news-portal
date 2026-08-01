import React, { useState } from 'react';
import { Article } from '../types';
import { 
  Globe, Cpu, Layers, Activity, Network, AlertTriangle, ShieldCheck, 
  Building2, ArrowRight, Play, RefreshCw, CheckCircle2, FileText, Zap, 
  Share2, Users, Database, Lock, X, Search, Landmark, Clock, Flame, BarChart2, Filter, Eye, ChevronRight
} from 'lucide-react';

interface GlobalDigitalTwinModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface DigitalTwinNode {
  id: string;
  name: string;
  category: 'PORT' | 'FOUNDRY' | 'ENERGY GRID' | 'DATA CENTER' | 'SUBSEA CABLE';
  location: string;
  operationalStatus: 'NORMAL' | 'DEGRADED' | 'DISRUPTED';
  healthScore: number;
  failureProbability: number;
  strategicSignificance: number;
  cyberVulnerability: number;
  ttrDays: number;
  connectedEntities: string[];
  simulatedShockImpact: string;
}

interface SupplyChainStage {
  stageName: string;
  location: string;
  chokepointName: string;
  isChokepoint: boolean;
  throughput: string;
  ttrImpactDays: number;
  riskScore: number;
}

interface HistoricalAnalogue {
  id: string;
  currentScenario: string;
  historicalEvent: string;
  year: string;
  similarityMatch: number;
  keyPattern: string;
  forecastedOutcome: string;
  mitigationStrategy: string;
}

interface PresetCrisis {
  id: string;
  name: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  cascadeEffects: string[];
  affectedSectors: string[];
  estimatedTTR: string;
  economicImpact: string;
}

const DIGITAL_TWIN_NODES: DigitalTwinNode[] = [
  {
    id: 'TWIN-01',
    name: 'Port of Mombasa & Northern Corridor',
    category: 'PORT',
    location: 'Mombasa, Kenya',
    operationalStatus: 'NORMAL',
    healthScore: 94,
    failureProbability: 3.2,
    strategicSignificance: 98,
    cyberVulnerability: 12,
    ttrDays: 14,
    connectedEntities: ['Uganda Trade Corridor', 'Kigali Logistics Hub', 'Maersk Fleet'],
    simulatedShockImpact: 'A 48-hour port berth disruption increases East African hinterland freight delays by +8 days and inflates regional transport overhead by 14%.'
  },
  {
    id: 'TWIN-02',
    name: 'TSMC Fab 18 Advanced Node Cluster',
    category: 'FOUNDRY',
    location: 'Tainan, Taiwan',
    operationalStatus: 'NORMAL',
    healthScore: 99,
    failureProbability: 8.5,
    strategicSignificance: 99.9,
    cyberVulnerability: 18,
    ttrDays: 180,
    connectedEntities: ['NVIDIA AI Accelerators', 'Apple Silicon Fab', 'ASML Lithography Systems'],
    simulatedShockImpact: 'A 10-day power grid instability disrupts 14,000 silicon wafers, creating a 6-month delay for global AI enterprise server deliveries.'
  },
  {
    id: 'TWIN-03',
    name: 'Rhein-Main Subsea Optical Fiber Node',
    category: 'SUBSEA CABLE',
    location: 'Frankfurt, Germany',
    operationalStatus: 'NORMAL',
    healthScore: 91,
    failureProbability: 4.1,
    strategicSignificance: 95,
    cyberVulnerability: 24,
    ttrDays: 7,
    connectedEntities: ['DE-CIX Exchange', 'ECB High-Frequency Network', 'NATO Telecom'],
    simulatedShockImpact: 'Targeted fiber degradation shifts 3.2 Terabits/sec to secondary Scandinavian land cables with +12ms latency bump.'
  },
  {
    id: 'TWIN-04',
    name: 'Grand Renaissance Hydroelectric Power Grid',
    category: 'ENERGY GRID',
    location: 'Guba, Ethiopia',
    operationalStatus: 'NORMAL',
    healthScore: 96,
    failureProbability: 2.1,
    strategicSignificance: 92,
    cyberVulnerability: 15,
    ttrDays: 21,
    connectedEntities: ['East African Power Pool', 'Sudan Interconnector', 'Djibouti Industrial Park'],
    simulatedShockImpact: 'Turbine frequency fluctuation triggers rolling load-shedding across 4 East African nations.'
  }
];

const SUPPLY_CHAIN_STAGES: SupplyChainStage[] = [
  {
    stageName: '1. Raw Material Extraction',
    location: 'Katanga Copper-Cobalt Belt (DRC)',
    chokepointName: 'KOLWEZI LOGISTICS BOTTLENECK',
    isChokepoint: true,
    throughput: '420,000 Metric Tons/yr',
    ttrImpactDays: 60,
    riskScore: 78
  },
  {
    stageName: '2. Chemical Refining & Processing',
    location: 'Yibin Lithium Carbonate Hydroxide Complex',
    chokepointName: 'REFINING CAPACITY CHOKEPOINT',
    isChokepoint: true,
    throughput: '68% Global Battery-Grade Supply',
    ttrImpactDays: 90,
    riskScore: 84
  },
  {
    stageName: '3. Component & Cell Assembly',
    location: 'Giga-Factory Industrial Zone (Munich / Austin / Nagoya)',
    chokepointName: 'PRECISION COATING BOTTLENECK',
    isChokepoint: false,
    throughput: '1.2 Million EV Packs/yr',
    ttrImpactDays: 30,
    riskScore: 45
  },
  {
    stageName: '4. Global Distribution Corridor',
    location: 'Strait of Malacca Transit Route',
    chokepointName: 'MARITIME CHOKEPOINT STRAIT',
    isChokepoint: true,
    throughput: '90,000 Vessels Annually',
    ttrImpactDays: 45,
    riskScore: 92
  }
];

const HISTORICAL_ANALOGUES: HistoricalAnalogue[] = [
  {
    id: 'HIST-01',
    currentScenario: '2026 Red Sea Freight Disruption & Bab-el-Mandeb Strait Rerouting',
    historicalEvent: '1973 OPEC Oil Embargo & Suez Canal Closure (1967-1975)',
    year: '1973',
    similarityMatch: 91.8,
    keyPattern: 'Long-haul maritime rerouting around Cape of Good Hope causing +14 day shipping delays and 3.4x spike in container spot rates.',
    forecastedOutcome: 'Inflationary pressure on European retail goods with +6-month inventory buffer exhaustion.',
    mitigationStrategy: 'Pre-positioning East African regional warehouses (Kigali/Mombasa) & expanding trans-African rail networks.'
  },
  {
    id: 'HIST-02',
    currentScenario: '2026 AI Semiconductor Export Restrictions & Subsea Fiber Strain',
    historicalEvent: '1997 Asian Financial Crisis & Tech Supply Chain Shock',
    year: '1997',
    similarityMatch: 87.4,
    keyPattern: 'Concentration of advanced node manufacturing causing severe currency and component domino effects.',
    forecastedOutcome: 'Bifurcation of global AI compute architecture into regional sovereign hardware clusters.',
    mitigationStrategy: 'Diversification into European and African semiconductor packaging facilities.'
  }
];

const PRESET_CRISES: PresetCrisis[] = [
  {
    id: 'CRISIS-01',
    name: 'Global Supply Chain Collapse',
    category: 'LOGISTICS & MARITIME',
    severity: 'CRITICAL',
    cascadeEffects: [
      'Strait of Malacca + Bab-el-Mandeb simultaneous maritime closure',
      'Port container backlog exceeding 4.2 million TEU worldwide',
      'Manufacturing shutdown across automotive and consumer electronics',
      'Consumer price index spike of +8.4% globally within 30 days'
    ],
    affectedSectors: ['Automotive', 'Consumer Tech', 'Agriculture', 'Pharmaceuticals'],
    estimatedTTR: '120 Days (Time-to-Recovery)',
    economicImpact: '$4.8 Trillion USD Loss'
  },
  {
    id: 'CRISIS-02',
    name: 'Major Energy Shortage & Power Grid Blackout',
    category: 'ENERGY INFRASTRUCTURE',
    severity: 'CRITICAL',
    cascadeEffects: [
      'Continental European & East Asian gas pipeline disruption',
      'Industrial aluminum and chemical smelters forced offline',
      'Data center load-shedding degrading cloud services and banking APIs',
      'Emergency fuel rationing for critical emergency response teams'
    ],
    affectedSectors: ['Heavy Industry', 'Cloud Computing', 'Financial Markets'],
    estimatedTTR: '45 Days (Time-to-Recovery)',
    economicImpact: '$1.9 Trillion USD Loss'
  },
  {
    id: 'CRISIS-03',
    name: 'Subsea Fiber Cable Cut & Global Internet Partition',
    category: 'TELECOM & CYBER',
    severity: 'HIGH',
    cascadeEffects: [
      '3 major subsea cables severed in Red Sea & North Atlantic',
      'SWIFT banking transaction latency jumping from 200ms to 18 seconds',
      'Sovereign cloud data synchronization degraded across continents'
    ],
    affectedSectors: ['Banking', 'Telecom', 'Defense', 'Cross-Border Trade'],
    estimatedTTR: '21 Days (Time-to-Recovery)',
    economicImpact: '$850 Billion USD Loss'
  }
];

export const GlobalDigitalTwinModal: React.FC<GlobalDigitalTwinModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [activeTab, setActiveTab] = useState<'twin' | 'mapper' | 'heatmap' | 'shocks' | 'analogue'>('twin');
  const [selectedNode, setSelectedNode] = useState<DigitalTwinNode>(DIGITAL_TWIN_NODES[0]);
  const [heatmapFilter, setHeatmapFilter] = useState<'FAILURE' | 'STRATEGIC' | 'HEALTH' | 'CYBER'>('STRATEGIC');
  const [selectedCrisis, setSelectedCrisis] = useState<PresetCrisis>(PRESET_CRISES[0]);
  const [selectedAnalogue, setSelectedAnalogue] = useState<HistoricalAnalogue>(HISTORICAL_ANALOGUES[0]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleRunShockSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Globe className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS PLANETARY INTELLIGENCE DIGITAL TWIN (v13.0)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  GLOBAL SYSTEMS MODEL READY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Continuously updated AI representation of countries, cities, infrastructure, supply chains, energy grids, and climate systems.
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
            onClick={() => setActiveTab('twin')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'twin' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌐 Planetary Twin Core
          </button>
          <button
            onClick={() => setActiveTab('mapper')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'mapper' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📦 Supply Chain Dependency Mapper
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'heatmap' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔥 Global Infrastructure Heatmap
          </button>
          <button
            onClick={() => setActiveTab('shocks')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'shocks' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Planetary Shock Simulation Engine
          </button>
          <button
            onClick={() => setActiveTab('analogue')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'analogue' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🧠 Historical Analogue Engine
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 space-y-6">
          {/* TAB 1: PLANETARY TWIN CORE */}
          {activeTab === 'twin' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Nodes Selector */}
              <div className="w-full md:w-88 space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  MONITORED GLOBAL INFRASTRUCTURE NODES
                </h3>

                {DIGITAL_TWIN_NODES.map(node => {
                  const isSelected = selectedNode.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-950 to-slate-900 border-cyan-500 shadow-lg'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                          {node.category}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">{node.operationalStatus}</span>
                      </div>
                      <h4 className="font-bold text-xs text-white">{node.name}</h4>
                      <p className="text-[11px] font-mono text-slate-400">{node.location} • TTR: {node.ttrDays} Days</p>
                    </div>
                  );
                })}
              </div>

              {/* Node Inspector Card */}
              <div className="flex-1 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{selectedNode.category} SYSTEM DOSSIER</span>
                    <h3 className="text-xl font-black text-white">{selectedNode.name}</h3>
                    <span className="text-xs font-mono text-slate-400">{selectedNode.location} • Status: {selectedNode.operationalStatus}</span>
                  </div>

                  <button
                    onClick={handleRunShockSimulation}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-lg"
                  >
                    {isSimulating ? <Zap className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    {isSimulating ? 'SIMULATING...' : 'RUN NODE SHOCK SIMULATION'}
                  </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">HEALTH SCORE</span>
                    <strong className="text-emerald-400 text-base">{selectedNode.healthScore} / 100</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">FAILURE PROB.</span>
                    <strong className="text-amber-400 text-base">{selectedNode.failureProbability}%</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">STRATEGIC IMPORTANCE</span>
                    <strong className="text-cyan-400 text-base">{selectedNode.strategicSignificance}%</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">TIME-TO-RECOVERY (TTR)</span>
                    <strong className="text-indigo-400 text-base">{selectedNode.ttrDays} Days</strong>
                  </div>
                </div>

                {/* Connected Dependencies */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">LINKED SYSTEM DEPENDENCIES</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.connectedEntities.map((ent, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 rounded-lg">
                        🔗 {ent}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Simulated Impact Result */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                    VERITAS SYSTEMIC SHOCK SIMULATION RESULT
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedNode.simulatedShockImpact}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUPPLY CHAIN DEPENDENCY MAPPER */}
          {activeTab === 'mapper' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">END-TO-END SUPPLY CHAIN DEPENDENCY MAPPER</span>
                <h3 className="text-lg font-black text-white">Raw Material Extraction → Refining → Manufacturing → Distribution</h3>
                <p className="text-xs text-slate-400">
                  Highlighting strategic bottlenecks and computing Time-to-Recovery (TTR) impact scores for specific disruptions.
                </p>
              </div>

              {/* Pipeline Flow Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {SUPPLY_CHAIN_STAGES.map((stg, idx) => (
                  <div key={idx} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{stg.stageName}</span>
                      {stg.isChokepoint ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> CHOKEPOINT
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                          NOMINAL
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-sm text-white">{stg.location}</h4>

                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 font-mono text-[10px]">
                      <div>THROUGHPUT: <strong className="text-slate-200">{stg.throughput}</strong></div>
                      <div>TTR IMPACT SCORE: <strong className="text-cyan-400">{stg.ttrImpactDays} Days</strong></div>
                      <div>RISK INDEX: <strong className={stg.riskScore > 75 ? 'text-rose-400' : 'text-emerald-400'}>{stg.riskScore} / 100</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GLOBAL INFRASTRUCTURE HEATMAP */}
          {activeTab === 'heatmap' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase">REAL-TIME GLOBAL INFRASTRUCTURE HEATMAP</span>
                    <h3 className="text-lg font-black text-white mt-0.5">Critical Ports, Power Plants, Subsea Cables & Space Links</h3>
                  </div>

                  {/* Heatmap Layer Toggles */}
                  <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
                    <button
                      onClick={() => setHeatmapFilter('STRATEGIC')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        heatmapFilter === 'STRATEGIC' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Strategic Significance
                    </button>
                    <button
                      onClick={() => setHeatmapFilter('FAILURE')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        heatmapFilter === 'FAILURE' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Failure Probability
                    </button>
                    <button
                      onClick={() => setHeatmapFilter('CYBER')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        heatmapFilter === 'CYBER' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Cyber Vulnerability
                    </button>
                  </div>
                </div>

                {/* Heatmap Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DIGITAL_TWIN_NODES.map(node => (
                    <div key={node.id} className="p-5 bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-cyan-400 font-bold">{node.category}</span>
                        <span className="text-slate-400">{node.location}</span>
                      </div>

                      <h4 className="font-extrabold text-sm text-white">{node.name}</h4>

                      {/* Bar indicator based on selected layer */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>
                            {heatmapFilter === 'STRATEGIC' && 'STRATEGIC SIGNIFICANCE'}
                            {heatmapFilter === 'FAILURE' && 'FAILURE PROBABILITY'}
                            {heatmapFilter === 'CYBER' && 'CYBER VULNERABILITY SCORE'}
                          </span>
                          <strong className="text-white">
                            {heatmapFilter === 'STRATEGIC' && `${node.strategicSignificance}%`}
                            {heatmapFilter === 'FAILURE' && `${node.failureProbability}%`}
                            {heatmapFilter === 'CYBER' && `${node.cyberVulnerability}/100`}
                          </strong>
                        </div>
                        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                heatmapFilter === 'STRATEGIC' ? node.strategicSignificance :
                                heatmapFilter === 'FAILURE' ? node.failureProbability * 10 :
                                node.cyberVulnerability
                              }%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLANETARY SHOCK SIMULATION */}
          {activeTab === 'shocks' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-rose-400 font-bold uppercase">PLANETARY SHOCK SIMULATION ENGINE</span>
                    <h3 className="text-lg font-black text-white mt-0.5">Preset Global Crises & Cascade Projections</h3>
                  </div>

                  <button
                    onClick={handleRunShockSimulation}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-lg"
                  >
                    {isSimulating ? <Zap className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    {isSimulating ? 'EXECUTING SCENARIO...' : 'RUN PLANETARY CRISIS SCENARIO'}
                  </button>
                </div>

                {/* Crisis Preset Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PRESET_CRISES.map(cr => (
                    <button
                      key={cr.id}
                      onClick={() => setSelectedCrisis(cr)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedCrisis.id === cr.id
                          ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold block text-rose-400">{cr.category}</span>
                      <strong className="text-sm font-extrabold text-white block mt-0.5">{cr.name}</strong>
                      <span className="text-[10px] font-mono text-slate-500 block mt-1">EST. TTR: {cr.estimatedTTR}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Crisis Cascade Details */}
                <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px]">SELECTED SCENARIO</span>
                      <h4 className="text-base font-extrabold text-white">{selectedCrisis.name}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] block">ESTIMATED ECONOMIC LOSS</span>
                      <strong className="text-rose-400 text-base font-black">{selectedCrisis.economicImpact}</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-mono font-bold text-slate-400 uppercase">CASCADING SYSTEM EFFECTS</h5>
                    <div className="space-y-1.5 font-mono text-xs text-slate-300">
                      {selectedCrisis.cascadeEffects.map((eff, i) => (
                        <div key={i} className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <ChevronRight className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span>{eff}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HISTORICAL ANALOGUE ENGINE */}
          {activeTab === 'analogue' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">HISTORICAL ANALOGUE & PATTERN MATCHING ENGINE</span>
                  <h3 className="text-lg font-black text-white mt-0.5">Compare Current Geopolitical Shocks Against 120+ Years of Historical Data</h3>
                  <p className="text-xs text-slate-400">
                    Forecasting potential outcomes by matching high-frequency signal streams against historical crises.
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  {HISTORICAL_ANALOGUES.map(ana => (
                    <div key={ana.id} className="p-5 bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-slate-400 text-[10px]">CURRENT SCENARIO</span>
                          <h4 className="font-extrabold text-sm text-white">{ana.currentScenario}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 text-[10px] block">PATTERN SIMILARITY</span>
                          <strong className="text-emerald-400 text-base font-bold">{ana.similarityMatch}% MATCH</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                          <strong className="text-cyan-400 block text-[10px]">HISTORICAL EVENT ({ana.year})</strong>
                          <p>{ana.historicalEvent}</p>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                          <strong className="text-indigo-400 block text-[10px]">KEY PATTERN OVERLAY</strong>
                          <p>{ana.keyPattern}</p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                        <strong className="text-emerald-400 block text-[10px]">RECOMMENDED STRATEGIC MITIGATION</strong>
                        <p className="text-slate-200">{ana.mitigationStrategy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
