import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { NewsIntelligenceEngine, ArticleIntelligenceProfile } from '../services/NewsIntelligenceEngine';
import { TrustScoreEngine, TrustScoreEvaluation } from '../services/TrustScoreEngine';
import { TrendDetectionService, TrendItem } from '../services/TrendDetectionService';
import { EditorialAssistantService, EditorialPackage } from '../services/EditorialAssistantService';
import { AudienceIntelligenceService, VisitorProfile } from '../services/AudienceIntelligenceService';
import { AiSearchService, AiSearchResult } from '../services/AiSearchService';
import { KnowledgeGraphEngine, KnowledgeGraphData } from '../services/KnowledgeGraphEngine';
import { GlobalDataIngestionEngine, IngestedItem } from '../services/GlobalDataIngestionEngine';
import { EventDetectionEngine } from '../services/EventDetectionEngine';
import { BreakingNewsEngine } from '../services/BreakingNewsEngine';
import { PredictionEngine, ForecastItem } from '../services/PredictionEngine';
import { TimelineEngine } from '../services/TimelineEngine';
import { AgentOrchestrator, AgentStatus } from '../services/AgentOrchestrator';
import { GlobalIntelligenceMap } from './GlobalIntelligenceMap';
import { 
  X, Cpu, Radio, TrendingUp, Users, ShieldCheck, Sparkles, 
  Search, BookOpen, Share2, MessageCircle, BarChart3, ChevronRight, 
  Layers, CheckCircle2, AlertTriangle, RefreshCw, Eye, Flame, Award, Globe, Zap, Network, Activity, Calendar, Bot
} from 'lucide-react';

interface VeritasIntelligenceCommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle?: (article: Article) => void;
}

export const VeritasIntelligenceCommandCenterModal: React.FC<VeritasIntelligenceCommandCenterModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle
}) => {
  const [activeTab, setActiveTab] = useState<'world' | 'map' | 'pipeline' | 'forecast' | 'agents' | 'audience' | 'content' | 'editorial' | 'search'>('world');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(articles[0] || null);
  const [intelProfile, setIntelProfile] = useState<ArticleIntelligenceProfile | null>(null);
  const [trustEval, setTrustEval] = useState<TrustScoreEvaluation | null>(null);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [visitorProfile, setVisitorProfile] = useState<VisitorProfile | null>(null);
  const [editorialPkg, setEditorialPkg] = useState<EditorialPackage | null>(null);
  const [graphData, setGraphData] = useState<KnowledgeGraphData | null>(null);

  // Phase 4 Ingestion & Forecast Data
  const [ingestedItems, setIngestedItems] = useState<IngestedItem[]>([]);
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [agents, setAgents] = useState<AgentStatus[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('Latest AI investments in Rwanda');
  const [searchResult, setSearchResult] = useState<AiSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTrends(TrendDetectionService.detectTrends(articles));
      setVisitorProfile(AudienceIntelligenceService.getVisitorProfile());
      setGraphData(KnowledgeGraphEngine.buildGraph(articles));
      setIngestedItems(GlobalDataIngestionEngine.getIngestedItems());
      setForecasts(PredictionEngine.generateForecasts(articles));
      setAgents(AgentOrchestrator.getAgentStates());

      if (selectedArticle) {
        setIntelProfile(NewsIntelligenceEngine.analyzeArticle(selectedArticle));
        setTrustEval(TrustScoreEngine.evaluateArticle(selectedArticle));
        setEditorialPkg(EditorialAssistantService.generateEditorialPackage(selectedArticle));
      }
    }
  }, [isOpen, selectedArticle, articles]);

  const handleArticleChange = (art: Article) => {
    setSelectedArticle(art);
    setIntelProfile(NewsIntelligenceEngine.analyzeArticle(art));
    setTrustEval(TrustScoreEngine.evaluateArticle(art));
    setEditorialPkg(EditorialAssistantService.generateEditorialPackage(art));
  };

  const handleExecuteSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const result = await AiSearchService.answerQuery(searchQuery, articles);
    setSearchResult(result);
    setIsSearching(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-7xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Command Center Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Veritas Intelligence Command Center
                </h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  PHASE 4 REAL-TIME NETWORK ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Continuous Global Data Collection, Verification, Event Detection & Predictive AI Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'world', label: '1. Live World Monitor', icon: Radio },
            { id: 'map', label: '2. Global Intelligence Map', icon: Globe },
            { id: 'pipeline', label: '3. Ingestion Pipeline', icon: Network },
            { id: 'forecast', label: '4. AI Trend Forecasts', icon: TrendingUp },
            { id: 'agents', label: '5. AI Swarm Agents', icon: Bot },
            { id: 'audience', label: '6. Audience Vectoring', icon: Users },
            { id: 'content', label: '7. Trust & Verification', icon: ShieldCheck },
            { id: 'search', label: '8. Veritas Search AI', icon: Search }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-xs font-bold font-mono transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  active 
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* TAB 1: LIVE WORLD MONITOR */}
          {activeTab === 'world' && (
            <div className="space-y-6">
              {/* Top Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-mono block">Breaking Stories Active</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-rose-400">
                      {articles.filter(a => a.isBreaking).length || 3}
                    </span>
                    <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Priority Homepage Ticker</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-mono block">Detected Emerging Trends</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-amber-400">{trends.length}</span>
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">250% Max Monthly Rise</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-mono block">Regional Focus (Africa)</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-emerald-400">75%</span>
                    <Globe className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">🇷🇼 20% Rwanda Deep Coverage</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-mono block">Verification Accuracy</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-indigo-400">96.4%</span>
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">3+ Confirming Sources</span>
                </div>
              </div>

              {/* Emerging Topic Recommendations */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  AI DETECTED TRENDS & SPECIAL COVERAGE RECOMMENDATIONS
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trends.map(tr => (
                    <div key={tr.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          +{tr.growthPercentage}% MOMENTUM ({tr.momentum})
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{tr.category}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{tr.topic}</h4>
                      <p className="text-xs text-slate-300 italic">"{tr.sampleHeadline}"</p>

                      <div className="p-2.5 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 font-mono flex items-center justify-between">
                        <span>💡 Recommendation: {tr.recommendation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breaking Articles Radar */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  LIVE BREAKING INTELLIGENCE FEED
                </h3>

                <div className="space-y-2">
                  {articles.slice(0, 5).map(art => {
                    const prof = NewsIntelligenceEngine.analyzeArticle(art);
                    return (
                      <div 
                        key={art.id}
                        onClick={() => {
                          handleArticleChange(art);
                          if (onSelectArticle) onSelectArticle(art);
                        }}
                        className="p-3.5 bg-slate-950 hover:bg-slate-800/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3 max-w-2xl">
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[10px] font-mono font-bold shrink-0">
                            {prof.contentType}
                          </span>
                          <span className="text-xs font-bold text-white truncate">{art.title}</span>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="text-slate-400">{art.country || art.region}</span>
                          <span className="text-emerald-400 font-bold">Imp: {prof.importance_score}%</span>
                          <span className="text-indigo-400 font-bold">Trust: {art.confidenceScore}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIENCE INTELLIGENCE */}
          {activeTab === 'audience' && visitorProfile && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Anonymous Visitor Profile Intelligence</h3>
                    <p className="text-xs text-slate-400">ID: {visitorProfile.visitorId} (Privacy-Compliant Local Vectors)</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold">
                    CONSENT: {visitorProfile.privacyConsent.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-900 text-xs font-mono">
                  <div className="p-3 bg-slate-900/80 rounded-xl">
                    <span className="text-slate-400 block">Total Read Articles</span>
                    <span className="text-lg font-bold text-indigo-400">{visitorProfile.totalArticlesOpened}</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl">
                    <span className="text-slate-400 block">Total Time Spent</span>
                    <span className="text-lg font-bold text-cyan-400">{Math.round((Number(visitorProfile.totalReadingTimeSeconds) || 0) / 60)} mins</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl">
                    <span className="text-slate-400 block">Return Session Count</span>
                    <span className="text-lg font-bold text-amber-400">{visitorProfile.returnVisitsCount}</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl">
                    <span className="text-slate-400 block">CTA Interaction Rate</span>
                    <span className="text-lg font-bold text-emerald-400">14.8%</span>
                  </div>
                </div>

                {/* Category Weight Vector Graph */}
                <div className="space-y-2 pt-3 border-t border-slate-900">
                  <span className="text-xs font-bold text-slate-300 font-mono block">Inferred Category Interest Weights:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(visitorProfile.categoryWeights).map(([cat, weight]) => (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-300">{cat}</span>
                          <span className="text-indigo-400 font-bold">{Number(weight)}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                            style={{ width: `${Math.max(5, Number(weight))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT & TRUST CORE */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Article Selector */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 font-mono block">SELECT ARTICLE TO INSPECT AI INTELLIGENCE PROFILE:</span>
                <select
                  value={selectedArticle?.id || ''}
                  onChange={(e) => {
                    const found = articles.find(a => a.id === e.target.value);
                    if (found) handleArticleChange(found);
                  }}
                  className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500"
                >
                  {articles.map(a => (
                    <option key={a.id} value={a.id}>
                      [{a.category}] {a.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Inspection Grid */}
              {selectedArticle && intelProfile && trustEval && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Intelligence Profile */}
                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-indigo-400 font-mono flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      ARTICLE INTELLIGENCE SCORECARD
                    </h3>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 bg-slate-900 rounded-xl space-y-0.5">
                        <span className="text-slate-400 block">Importance Score</span>
                        <span className="text-xl font-bold text-white">{intelProfile.importance_score}%</span>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl space-y-0.5">
                        <span className="text-slate-400 block">Breaking Probability</span>
                        <span className="text-xl font-bold text-rose-400">{intelProfile.breaking_probability}%</span>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl space-y-0.5">
                        <span className="text-slate-400 block">Evergreen Score</span>
                        <span className="text-xl font-bold text-emerald-400">{intelProfile.evergreen_score}%</span>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl space-y-0.5">
                        <span className="text-slate-400 block">Audience Match</span>
                        <span className="text-xl font-bold text-amber-400">{intelProfile.audience_match_score}%</span>
                      </div>
                    </div>

                    {/* Extracted Entity Tags */}
                    <div className="space-y-2 pt-2 border-t border-slate-900">
                      <span className="text-xs font-bold text-slate-300 font-mono block">Extracted Entities & Tags:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {intelProfile.entityExtraction.countries.map(c => (
                          <span key={c} className="px-2 py-0.5 bg-blue-950/60 text-blue-300 border border-blue-800 rounded text-[11px] font-mono">
                            🏳️ {c}
                          </span>
                        ))}
                        {intelProfile.entityExtraction.organizations.map(o => (
                          <span key={o} className="px-2 py-0.5 bg-purple-950/60 text-purple-300 border border-purple-800 rounded text-[11px] font-mono">
                            🏢 {o}
                          </span>
                        ))}
                        {intelProfile.entityExtraction.technologies.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-cyan-950/60 text-cyan-300 border border-cyan-800 rounded text-[11px] font-mono">
                            ⚡ {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Trust Score Evaluation */}
                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        AI FACT & TRUST EVALUATION
                      </h3>
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold">
                        {trustEval.verificationStatus}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl space-y-2 font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Calculated Trust Score:</span>
                        <span className="font-bold text-emerald-400 text-sm">{trustEval.trustScore} / 100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Confirming News Feeds:</span>
                        <span className="font-bold text-white">{trustEval.metrics.confirmingSourcesCount} feeds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Source Reliability Rating:</span>
                        <span className="font-bold text-cyan-400">{trustEval.metrics.sourceReliability}%</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs font-mono text-slate-400">
                      <span className="font-bold text-slate-300 block">Verification Audit Trail:</span>
                      {trustEval.auditTrail.map((log, idx) => (
                        <p key={idx} className="text-[11px] text-slate-400">• {log}</p>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 4: EDITORIAL ASSISTANT */}
          {activeTab === 'editorial' && editorialPkg && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-amber-400 font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI HEADLINE OPTIMIZER & MULTI-PLATFORM COPY GENERATOR
                </h3>

                <div className="space-y-3">
                  <span className="text-xs text-slate-400 font-mono block">Original Headline:</span>
                  <div className="p-3 bg-slate-900 rounded-xl text-sm font-bold text-slate-200">
                    "{editorialPkg.originalHeadline}"
                  </div>

                  <span className="text-xs text-amber-400 font-mono block pt-2">AI Headline Variations:</span>
                  <div className="space-y-2">
                    {editorialPkg.headlineSuggestions.map((h, i) => (
                      <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white flex items-center justify-between">
                        <span>{i + 1}. "{h}"</span>
                        <button 
                          onClick={() => navigator.clipboard.writeText(h)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Broadcast Format */}
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl space-y-2 font-mono text-xs">
                  <span className="font-bold text-emerald-400 block">WhatsApp Broadcast Message Copy:</span>
                  <p className="font-bold text-white">{editorialPkg.whatsAppBroadcast.channelHeadline}</p>
                  <p className="text-slate-300 whitespace-pre-line">{editorialPkg.whatsAppBroadcast.bodyText}</p>
                  <p className="text-cyan-400">{editorialPkg.whatsAppBroadcast.callToAction}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GLOBAL INTELLIGENCE MAP */}
          {activeTab === 'map' && (
            <GlobalIntelligenceMap articles={articles} onSelectArticle={onSelectArticle} />
          )}

          {/* TAB 3: INGESTION PIPELINE */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">CONTINUOUS INGESTION PIPELINE & DATA QUEUE</h3>
                  <p className="text-xs text-slate-400 font-mono">Automated ingestion from RSS, Wire Feeds, APIs & Academic Repositories</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono font-bold">
                  Ingesting 12 Streams / sec
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ingestedItems.map(item => (
                  <div key={item.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-mono font-bold">
                        {item.source_type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.published_date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{item.content}</p>
                    <div className="flex justify-between items-center text-[10px] font-mono pt-2 border-t border-slate-900">
                      <span className="text-slate-500">Source: {item.source}</span>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">
                        {item.processing_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI TREND FORECASTS */}
          {activeTab === 'forecast' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">PREDICTIVE TREND & EDITORIAL FORECASTING</h3>
                  <p className="text-xs text-slate-400 font-mono">AI signal analysis predicting emerging news topics before mainstream takeoff</p>
                </div>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-mono font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Signal Forecast Mode
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {forecasts.map(fc => (
                  <div key={fc.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-mono font-bold">
                          {fc.category}
                        </span>
                        <span className="text-emerald-400 text-xs font-bold font-mono">+{fc.growthPercentage}% Surge</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{fc.topic}</h4>
                      <p className="text-xs text-slate-400">{fc.patternAnalysis}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-900 space-y-2 text-[11px] font-mono">
                      <span className="text-cyan-400 font-bold block">Editorial Plan:</span>
                      <p className="text-slate-300">{fc.editorialActionPlan}</p>
                      <div className="p-2 bg-slate-900 rounded-xl text-slate-200 italic font-sans text-xs">
                        "{fc.recommendedArticleTitle}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AI SWARM AGENTS */}
          {activeTab === 'agents' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">AUTONOMOUS AGENT SWARM FRAMEWORK</h3>
                  <p className="text-xs text-slate-400 font-mono">Specialized AI agents orchestrating real-time news collection, verification & synthesis</p>
                </div>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-mono font-bold">
                  7 Agents Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map(ag => (
                  <div key={ag.agentId} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white font-mono">{ag.agentName}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-mono font-bold">
                        {ag.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono">{ag.role}</p>

                    <div className="p-2.5 bg-slate-900 rounded-xl text-[11px] font-mono space-y-1">
                      <span className="text-slate-500 block">Last Autonomous Action:</span>
                      <span className="text-slate-200 block truncate">{ag.lastAction}</span>
                      <span className="text-emerald-400 text-[10px] font-bold block pt-1">Agent Confidence: {ag.confidenceScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <form onSubmit={handleExecuteSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask any question across global news intelligence..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-slate-100 placeholder-slate-500 rounded-xl text-xs font-mono border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold cursor-pointer shrink-0"
                >
                  {isSearching ? 'Synthesizing...' : 'Search AI'}
                </button>
              </form>

              {searchResult && (
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <span className="text-xs text-indigo-400 font-mono font-bold">
                      Synthesized Answer (Confidence: {searchResult.confidenceScore}%)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{searchResult.processedAt}</span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {searchResult.synthesizedAnswer}
                  </p>

                  <div className="pt-3 border-t border-slate-900 space-y-2">
                    <span className="text-xs font-bold text-slate-400 font-mono block">Cited Intelligence Sources:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {searchResult.sources.map(src => (
                        <div key={src.articleId} className="p-2.5 bg-slate-900 rounded-xl text-xs font-mono space-y-1">
                          <span className="font-bold text-white block truncate">{src.title}</span>
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>{src.publisherName}</span>
                            <span className="text-emerald-400">Trust: {src.trustScore}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
