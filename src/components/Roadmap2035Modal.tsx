import React, { useState } from 'react';
import {
  X,
  Compass,
  Sparkles,
  Rocket,
  Globe,
  Bot,
  Network,
  TrendingUp,
  Satellite,
  Volume2,
  Video,
  FileText,
  DollarSign,
  AlertOctagon,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Cpu,
  Download,
  Info,
  Terminal,
  Zap
} from 'lucide-react';
import {
  Roadmap2035Engine,
  VisionPillar,
  ArchitectureLayer2035,
  RoadmapMilestone
} from '../services/Roadmap2035Engine';

interface Roadmap2035ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Roadmap2035Modal: React.FC<Roadmap2035ModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'pillars' | 'architecture' | 'roadmap' | 'vision'>('pillars');
  const [selectedPillarId, setSelectedPillarId] = useState<string>('pillar_global_intel');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const pillars = Roadmap2035Engine.getVisionPillars();
  const archLayers = Roadmap2035Engine.getArchitectureLayers2035();
  const milestones = Roadmap2035Engine.getRoadmapMilestones();

  const activePillar = pillars.find(p => p.id === selectedPillarId) || pillars[0];

  const categories = ['ALL', 'Autonomous AI', 'Multimodal Perception', 'Sovereign Analytics', 'Predictive Simulation'];

  const filteredPillars = selectedCategory === 'ALL'
    ? pillars
    : pillars.filter(p => p.category === selectedCategory);

  const getPillarIcon = (id: string) => {
    switch (id) {
      case 'pillar_global_intel': return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'pillar_ai_agents': return <Bot className="w-4 h-4 text-purple-400" />;
      case 'pillar_knowledge_graph': return <Network className="w-4 h-4 text-emerald-400" />;
      case 'pillar_predictive_intel': return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case 'pillar_satellite_data': return <Satellite className="w-4 h-4 text-blue-400" />;
      case 'pillar_audio_intel': return <Volume2 className="w-4 h-4 text-indigo-400" />;
      case 'pillar_video_intel': return <Video className="w-4 h-4 text-pink-400" />;
      case 'pillar_policy_intel': return <FileText className="w-4 h-4 text-teal-400" />;
      case 'pillar_economic_intel': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'pillar_crisis_detection': return <AlertOctagon className="w-4 h-4 text-rose-400" />;
      default: return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-7xl max-h-[94vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 via-purple-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-purple-600/20">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-wide">Phase 15 — Veritas 2035 Strategic Vision & Future Architecture</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                  10-Year Horizon (2026–2035)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Next-decade roadmap: 100M+ Node Knowledge Graph, Multimodal Satellite SAR, Autonomous Agent Swarms & Zero-Latency Crisis Radar
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => alert('Exporting Veritas 2035 Strategic Vision Specification (PDF/JSON)...')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export 2035 Roadmap</span>
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
              onClick={() => setActiveTab('pillars')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'pillars' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>10 Core Intelligence Pillars</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'architecture' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Backward-Compatible Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'roadmap' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Execution Timeline (2026–2035)</span>
            </button>

            <button
              onClick={() => setActiveTab('vision')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'vision' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Strategic Manifesto</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-amber-400">
            <Zap className="w-3.5 h-3.5" />
            <span>100M+ Graph Nodes / Sub-Second Latency</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/60 space-y-6">

          {/* TAB 1: 10 CORE INTELLIGENCE PILLARS */}
          {activeTab === 'pillars' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Pillar Selector */}
              <div className="lg:col-span-4 space-y-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-1.5 bg-slate-950 p-2 border border-slate-800 rounded-xl text-[11px]">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${
                        selectedCategory === cat
                          ? 'bg-amber-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Pillar Cards List */}
                <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                  {filteredPillars.map(p => {
                    const isSelected = p.id === selectedPillarId;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPillarId(p.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition space-y-1.5 ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-lg shadow-amber-900/10'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getPillarIcon(p.id)}
                            <span className="font-bold text-xs">{p.pillarName}</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-amber-300 rounded border border-slate-700">
                            2035
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {p.shortSummary}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                          <span>Category: {p.category}</span>
                          <span className="text-amber-400">{p.id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Pillar Inspector */}
              <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
                
                {/* Pillar Header */}
                <div className="border-b border-slate-800 pb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      {getPillarIcon(activePillar.id)}
                      <h3 className="text-lg font-bold text-white">{activePillar.pillarName}</h3>
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                        {activePillar.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{activePillar.shortSummary}</p>
                  </div>

                  <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold rounded-lg shrink-0">
                    {activePillar.impactMetrics}
                  </span>
                </div>

                {/* 2035 Horizon Capabilities */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                    <Terminal className="w-4 h-4" />
                    <span>2035 Horizon Capabilities & Specifications</span>
                  </h4>

                  <div className="space-y-2">
                    {activePillar.horizon2035Specs.map((spec, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800/90 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backward Compatibility Bridge */}
                <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Backward Compatibility Bridge with Today's 2026 Codebase</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {activePillar.compatibilityBridgeWithToday}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: BACKWARD COMPATIBLE ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>Evolutionary Architecture: 2026 Core to 2035 Grid</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  How future multimodal satellite feeds, agentic swarms, and neural graph memory seamlessly interface with today's design without breaking existing REST or UI contracts.
                </p>
              </div>

              {/* Architecture Layer Comparison Cards */}
              <div className="space-y-4">
                {archLayers.map((layer, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-white text-sm flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-amber-400" />
                        <span>{layer.layerName}</span>
                      </span>
                      <span className="text-xs font-mono text-amber-400 bg-amber-950 px-2.5 py-0.5 border border-amber-800 rounded">
                        Compatibility Protocol: {layer.compatibilityProtocol}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Today 2026 */}
                      <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">2026 Baseline (Current)</span>
                        <p className="text-slate-300 font-medium">{layer.legacy2026Component}</p>
                      </div>

                      {/* Horizon 2035 */}
                      <div className="bg-amber-950/20 p-3.5 rounded-lg border border-amber-500/30 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">2035 Capability (Future Target)</span>
                        <p className="text-amber-200 font-medium">{layer.evolution2035Capability}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: EXECUTION TIMELINE */}
          {activeTab === 'roadmap' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span>Veritas 10-Year Phased Execution Roadmap</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">Structured timeline taking Veritas from today's Phase 1–13 baseline to Phase 20 global deployment.</p>
              </div>

              {/* Milestones Flow */}
              <div className="space-y-4">
                {milestones.map((m, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs rounded-xl shrink-0">
                        {m.year}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{m.phaseTitle}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                            m.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : m.status === 'IN_DEVELOPMENT'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          }`}>
                            {m.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {m.keyDeliverables.map((del, i) => (
                            <span key={i} className="text-[11px] font-mono text-slate-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                              • {del}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: STRATEGIC MANIFESTO */}
          {activeTab === 'vision' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
              
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  <span>The Veritas 2035 Sovereign Intelligence Manifesto</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">Guiding principles for building trusted, non-aligned intelligence infrastructure for sovereigns.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <div className="font-bold text-amber-300 text-sm flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>1. Absolute Sovereign Data Sovereignty</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    National intelligence must never be held hostage by foreign cloud platforms. Veritas guarantees on-premise edge deployments and local key ownership.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <div className="font-bold text-cyan-300 text-sm flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>2. Unbiased Multi-Source Corroboration</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    By cross-analyzing global press wires, satellite radar, and financial clearing streams, Veritas neutralizes single-publisher propaganda.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-300 text-sm flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span>3. Transparent Explainable AI Reasoning</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Black-box risk scores are rejected. Every prediction outputted by Veritas carries verbatim quotes, mathematical formulas, and system limitations.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <div className="font-bold text-purple-300 text-sm flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>4. Proactive Crisis Prevention</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Shifting intelligence from reactive news reporting to sub-minute crisis prediction and automated dispatch before disasters compound.
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
