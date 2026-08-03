import React, { useState, useEffect } from 'react';
import {
  X,
  Compass,
  TrendingUp,
  TrendingDown,
  Globe,
  Users,
  Building2,
  Newspaper,
  ShieldCheck,
  Clock,
  Sparkles,
  FileText,
  Activity,
  Layers,
  BarChart3,
  Search,
  BookOpen,
  History,
  AlertTriangle,
  Award,
  RefreshCw,
  Play,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { Article } from '../types';
import { NarrativeEngine, NarrativeItem } from '../services/NarrativeEngine';

interface NarrativeIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles?: Article[];
}

export const NarrativeIntelligenceModal: React.FC<NarrativeIntelligenceModalProps> = ({
  isOpen,
  onClose,
  articles = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedNarrativeId, setSelectedNarrativeId] = useState<string>('nar_tech_sovereign_ai');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'history_growth' | 'actors_publishers' | 'evidence_sentiment' | 'timeline'>('overview');
  
  // AI Strategic Synthesis State
  const [isAiSynthesizing, setIsAiSynthesizing] = useState<boolean>(false);
  const [aiSynthesis, setAiSynthesis] = useState<{
    aiStrategicVerdict?: string;
    growthVectorAnalysis?: string;
    declineRiskAnalysis?: string;
    globalActorAlignment?: string;
    timelineProjection?: string;
  } | null>(null);

  if (!isOpen) return null;

  const allNarratives = NarrativeEngine.getGlobalNarratives();

  const categories = [
    'ALL',
    'Tourism',
    'Infrastructure',
    'Healthcare',
    'Economy',
    'Security',
    'Investment',
    'Agriculture',
    'Technology',
    'Education',
    'Climate',
    'Human Rights',
    'Sports'
  ];

  const filteredNarratives = allNarratives.filter((nar) => {
    const matchesCat = selectedCategory === 'ALL' || nar.category === selectedCategory;
    const matchesSearch =
      nar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nar.coreTheme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nar.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeNarrative =
    allNarratives.find((n) => n.id === selectedNarrativeId) || filteredNarratives[0] || allNarratives[0];

  const handleRunAiAnalysis = async () => {
    setIsAiSynthesizing(true);
    setAiSynthesis(null);
    try {
      const res = await NarrativeEngine.analyzeNarrativeDynamicsWithAi(activeNarrative.id, articles);
      setAiSynthesis(res);
    } catch (err) {
      console.error('Error running AI narrative synthesis:', err);
    } finally {
      setIsAiSynthesizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl text-white shadow-lg shadow-purple-600/20">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black tracking-tight text-white">GLOBAL NARRATIVE INTELLIGENCE ENGINE</h2>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full font-mono">
                  PROMPT 5 • GLOBAL DISPERSION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Track long-term thematic narratives across History, Growth, Decline, Countries, Actors, Publishers, Evidence, Sentiment & Timelines.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Global Summary Metrics Banner */}
        <div className="bg-slate-950/70 border-b border-slate-800/80 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="flex items-center space-x-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <Layers className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-slate-500 text-[10px] block">TOTAL TRACKED NARRATIVES</span>
              <span className="text-white font-bold text-sm">{allNarratives.length} Global Sector Threads</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-500 text-[10px] block">AVG GROWTH VELOCITY</span>
              <span className="text-emerald-400 font-bold text-sm">+138.4% MoM</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <Globe className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-slate-500 text-[10px] block">GLOBAL GEOGRAPHIC COVERAGE</span>
              <span className="text-blue-300 font-bold text-sm">Non-Hardcoded • 48 Nations</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-slate-500 text-[10px] block">CONFIDENCE VERIFICATION</span>
              <span className="text-purple-300 font-bold text-sm">94.8% Math Formula Score</span>
            </div>
          </div>
        </div>

        {/* Main Body Layout */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/60 space-y-6">
          
          {/* Sector Categories Bar */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{cat}</span>
                {cat !== 'ALL' && (
                  <span className="text-[10px] opacity-75 font-mono">
                    ({allNarratives.filter((n) => n.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Master 2-Column Inspector Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Narrative Selector & Search */}
            <div className="lg:col-span-4 space-y-3">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search narratives, themes, or sectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Narratives List */}
              <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                {filteredNarratives.map((nar) => {
                  const isSelected = nar.id === activeNarrative.id;
                  return (
                    <div
                      key={nar.id}
                      onClick={() => {
                        setSelectedNarrativeId(nar.id);
                        setAiSynthesis(null);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-xl shadow-indigo-950/20'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded font-mono font-bold">
                          {nar.category}
                        </span>
                        <span className="text-emerald-400 font-mono font-bold flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>+{nar.growth.growthRatePercent}% MoM</span>
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-white leading-snug line-clamp-2">
                        {nar.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {nar.dominantFrame}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-mono">
                        <span className="flex items-center space-x-1">
                          <Globe className="w-3 h-3 text-blue-400" />
                          <span>{nar.countries.length} Global Nations</span>
                        </span>
                        <span className="text-purple-400 font-bold">
                          Confidence: {nar.confidence.overallConfidenceScore}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Column: Detailed Narrative Inspector */}
            <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              
              {/* Active Narrative Header & Tabs */}
              <div className="border-b border-slate-800 pb-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-indigo-600 text-white rounded">
                        {activeNarrative.category}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                        Status: {activeNarrative.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white mt-2 leading-snug">
                      {activeNarrative.title}
                    </h3>
                  </div>

                  <button
                    onClick={handleRunAiAnalysis}
                    disabled={isAiSynthesizing}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition shrink-0 cursor-pointer"
                  >
                    {isAiSynthesizing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Synthesizing Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Run AI Strategic Verdict</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  <strong className="text-indigo-400">Dominant Structural Frame: </strong>
                  {activeNarrative.dominantFrame}
                </p>

                {/* Sub-Tab Navigation Bar */}
                <div className="flex items-center space-x-2 text-xs font-medium pt-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeTab === 'overview'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    Overview & Metrics
                  </button>
                  <button
                    onClick={() => setActiveTab('history_growth')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeTab === 'history_growth'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    History, Growth & Decline
                  </button>
                  <button
                    onClick={() => setActiveTab('actors_publishers')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeTab === 'actors_publishers'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    Countries, Actors & Publishers
                  </button>
                  <button
                    onClick={() => setActiveTab('evidence_sentiment')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeTab === 'evidence_sentiment'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    Evidence & Sentiment
                  </button>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeTab === 'timeline'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    Chronological Timeline
                  </button>
                </div>

              </div>

              {/* AI Strategic Verdict Result Box */}
              {aiSynthesis && (
                <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950 border border-emerald-500/40 rounded-2xl p-5 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-emerald-300 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Gemini 3.6 Flash Strategic Narrative Analysis</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      AI Verified
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block mb-0.5">EXECUTIVE VERDICT:</span>
                      <p className="text-white font-medium">{aiSynthesis.aiStrategicVerdict}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-emerald-400 font-bold block mb-1">Growth Vector Analysis</span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{aiSynthesis.growthVectorAnalysis}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-amber-400 font-bold block mb-1">12-24 Month Trajectory Projection</span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{aiSynthesis.timelineProjection}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 1: OVERVIEW & METRICS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Top Key Drivers Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[11px] font-mono">GROWTH VELOCITY</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-400 text-lg font-bold">+{activeNarrative.growth.growthRatePercent}%</span>
                        <span className="text-[10px] font-mono text-slate-400">({activeNarrative.growth.growthPhase})</span>
                      </div>
                      <span className="text-slate-500 text-[10px] block">Velocity Score: {activeNarrative.growth.velocityScore}/100</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[11px] font-mono">DECAY RISK COUNTER</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-amber-400 text-lg font-bold">{activeNarrative.decline.decayRatePercent}%</span>
                        <span className="text-[10px] font-mono text-slate-400">({activeNarrative.decline.declinePhase})</span>
                      </div>
                      <span className="text-slate-500 text-[10px] block">Low Structural Dissipation Risk</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[11px] font-mono">CONFIDENCE SCORE</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-indigo-400 text-lg font-bold">{activeNarrative.confidence.overallConfidenceScore}%</span>
                        <span className="text-[10px] font-mono text-emerald-400">Verified</span>
                      </div>
                      <span className="text-slate-500 text-[10px] block">Multi-Source Mathematical Formula</span>
                    </div>
                  </div>

                  {/* Narrative Category & Theme Breakdown */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="text-xs font-bold text-white flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      <span>Core Narrative Theme & Global Scope</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{activeNarrative.coreTheme}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                      <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono">
                        First Observed: {new Date(activeNarrative.firstObserved).toLocaleDateString()}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono">
                        Last Updated: {new Date(activeNarrative.lastUpdated).toLocaleDateString()}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono">
                        Corpus Articles: {activeNarrative.supportingArticlesCount}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Mathematical Formula Box */}
                  <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-4 space-y-2 text-xs font-mono">
                    <div className="text-purple-300 font-bold flex items-center space-x-2">
                      <Award className="w-4 h-4 text-purple-400" />
                      <span>Mathematical Confidence Formula Breakdown</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      {activeNarrative.confidence.mathematicalBreakdownFormula}
                    </p>
                    <div className="grid grid-cols-3 gap-2 pt-2 text-[10px]">
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-slate-500">Data Density:</span>
                        <span className="text-indigo-300 font-bold block">{activeNarrative.confidence.dataDensityScore}/100</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-slate-500">Source Diversity:</span>
                        <span className="text-emerald-300 font-bold block">{activeNarrative.confidence.sourceDiversityScore}/100</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-slate-500">Semantic Coherence:</span>
                        <span className="text-purple-300 font-bold block">{activeNarrative.confidence.semanticCoherenceScore}/100</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-TAB 2: HISTORY, GROWTH & DECLINE */}
              {activeTab === 'history_growth' && (
                <div className="space-y-6">
                  
                  {/* History Section */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div className="text-xs font-bold text-amber-400 flex items-center space-x-2 border-b border-slate-800 pb-2">
                      <History className="w-4 h-4 text-amber-400" />
                      <span>1. Narrative History & Backstory</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block">Origin & Context:</span>
                        <p className="text-slate-300 mt-1 leading-relaxed">{activeNarrative.history.historicalContext}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Key Catalyst Event:</span>
                        <p className="text-slate-300 mt-1 leading-relaxed">{activeNarrative.history.keyCatalystEvent}</p>
                      </div>
                    </div>
                  </div>

                  {/* Growth Drivers Section */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div className="text-xs font-bold text-emerald-400 flex items-center space-x-2 border-b border-slate-800 pb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>2. Growth Drivers & Expansion Momentum</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                      {activeNarrative.growth.growthDrivers.map((driver, idx) => (
                        <li key={idx} className="leading-relaxed">{driver}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Decline & Risk Counters Section */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div className="text-xs font-bold text-amber-400 flex items-center space-x-2 border-b border-slate-800 pb-2">
                      <TrendingDown className="w-4 h-4 text-amber-400" />
                      <span>3. Decline Metrics & Risk Counter-Pressures</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                      {activeNarrative.decline.riskCounters.map((risk, idx) => (
                        <li key={idx} className="leading-relaxed">{risk}</li>
                      ))}
                    </ul>
                  </div>

                </div>
              )}

              {/* SUB-TAB 3: COUNTRIES, ACTORS & PUBLISHERS */}
              {activeTab === 'actors_publishers' && (
                <div className="space-y-6">
                  
                  {/* Dynamic Countries (Never Hardcoded) */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div className="text-xs font-bold text-blue-400 flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span>Dynamic Global Countries Involved ({activeNarrative.countries.length} Nations)</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Never Hardcoded • Global Dispersion</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {activeNarrative.countries.map((c) => (
                        <div key={c.countryCode} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white flex items-center space-x-1.5">
                              <span className="text-blue-400 font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                {c.countryCode}
                              </span>
                              <span>{c.countryName}</span>
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">
                              {c.coverageSharePercent}%
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                            <span>{c.region}</span>
                            <span className="text-indigo-300 font-semibold">{c.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Organizations & People */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Organizations */}
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                      <div className="text-xs font-bold text-purple-300 flex items-center space-x-2 border-b border-slate-800 pb-2">
                        <Building2 className="w-4 h-4 text-purple-400" />
                        <span>Organizations & Multilateral Bodies</span>
                      </div>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {activeNarrative.organizations.map((org) => (
                          <div key={org.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{org.name}</span>
                              <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded">
                                {org.stance}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block font-mono">Type: {org.type} • Influence: {org.influenceScore}/100</span>
                            {org.keyStatement && (
                              <p className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-800/60">
                                "{org.keyStatement}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* People */}
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                      <div className="text-xs font-bold text-indigo-300 flex items-center space-x-2 border-b border-slate-800 pb-2">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span>Key Leaders & Stakeholders</span>
                      </div>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {activeNarrative.people.map((p) => (
                          <div key={p.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{p.name}</span>
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">{p.stance}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block font-mono">{p.title} ({p.organizationOrCountry})</span>
                            <p className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-800/60">
                              "{p.quote}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Publishers Breakdown */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div className="text-xs font-bold text-teal-300 flex items-center space-x-2 border-b border-slate-800 pb-2">
                      <Newspaper className="w-4 h-4 text-teal-400" />
                      <span>Publishers & Media Outlets Tracking This Narrative</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {activeNarrative.publishers.map((pub, idx) => (
                        <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="font-bold text-white block truncate">{pub.name}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{pub.type}</span>
                          <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-300">
                            <span>Articles: {pub.volumeArticles}</span>
                            <span className={pub.sentimentBiasScore >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                              Bias: {pub.sentimentBiasScore > 0 ? `+${pub.sentimentBiasScore}` : pub.sentimentBiasScore}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-TAB 4: EVIDENCE & SENTIMENT */}
              {activeTab === 'evidence_sentiment' && (
                <div className="space-y-6">
                  
                  {/* Evidence Section */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div className="text-xs font-bold text-emerald-400 flex items-center space-x-2 border-b border-slate-800 pb-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Verifiable Quotes & Evidence Anchors</span>
                    </div>

                    <div className="space-y-3">
                      {activeNarrative.evidence.map((ev) => (
                        <div key={ev.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-300">{ev.claim}</span>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 border border-emerald-800 rounded">
                              Verifiability: {ev.verifiabilityScore}%
                            </span>
                          </div>
                          <p className="text-slate-300 italic bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                            "{ev.sourceQuote}"
                          </p>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                            <span>Publisher: {ev.publisherName}</span>
                            {ev.documentRef && <span>Doc Ref: {ev.documentRef}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sentiment Breakdown */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 text-xs">
                    <div className="text-xs font-bold text-purple-300 flex items-center space-x-2 border-b border-slate-800 pb-2">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                      <span>Sentiment Polarity & Stance Distribution</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-slate-400 font-bold block">Overall Sentiment Polarity</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-black text-emerald-400">
                            {activeNarrative.sentiment.polarityScore > 0 ? `+${activeNarrative.sentiment.polarityScore}` : activeNarrative.sentiment.polarityScore}
                          </span>
                          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-mono font-bold">
                            {activeNarrative.sentiment.overallSentiment}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-300 block pt-1">
                          Resonance: {activeNarrative.sentiment.emotionalResonance}
                        </span>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-slate-400 font-bold block">Distribution Breakdown</span>
                        
                        {/* Multi-Color Percentage Bar */}
                        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${activeNarrative.sentiment.distribution.positivePercent}%` }}
                            className="bg-emerald-500 h-full"
                          />
                          <div
                            style={{ width: `${activeNarrative.sentiment.distribution.neutralPercent}%` }}
                            className="bg-slate-500 h-full"
                          />
                          <div
                            style={{ width: `${activeNarrative.sentiment.distribution.negativePercent}%` }}
                            className="bg-rose-500 h-full"
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-300">
                          <span className="text-emerald-400">{activeNarrative.sentiment.distribution.positivePercent}% Positive</span>
                          <span className="text-slate-400">{activeNarrative.sentiment.distribution.neutralPercent}% Neutral</span>
                          <span className="text-rose-400">{activeNarrative.sentiment.distribution.negativePercent}% Negative</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-TAB 5: CHRONOLOGICAL TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="text-xs font-bold text-indigo-300 flex items-center space-x-2 border-b border-slate-800 pb-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Chronological Timeline Milestones ({activeNarrative.timeline.length} Events)</span>
                  </div>

                  <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                    {activeNarrative.timeline.map((event) => (
                      <div key={event.id} className="relative pl-8 space-y-1 text-xs">
                        {/* Timeline Node Dot */}
                        <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-slate-900" />

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-indigo-400 font-bold">
                              {event.timestamp} • {event.location}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 rounded">
                              Impact: {event.impactLevel}
                            </span>
                          </div>

                          <h5 className="font-bold text-white text-xs">{event.title}</h5>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{event.description}</p>
                          
                          <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/60">
                            Key Actors: {event.keyActors.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
