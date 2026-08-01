import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { NewsIntelligenceEngine, ArticleIntelligenceProfile } from '../services/NewsIntelligenceEngine';
import { TrustScoreEngine, TrustScoreEvaluation } from '../services/TrustScoreEngine';
import { TrendDetectionService, TrendItem } from '../services/TrendDetectionService';
import { EditorialAssistantService, EditorialPackage } from '../services/EditorialAssistantService';
import { AudienceIntelligenceService, VisitorProfile } from '../services/AudienceIntelligenceService';
import { AiSearchService, AiSearchResult } from '../services/AiSearchService';
import { KnowledgeGraphEngine, KnowledgeGraphData } from '../services/KnowledgeGraphEngine';
import { GlobalDataIngestionEngine, IngestionPipelineStats } from '../services/GlobalDataIngestionEngine';
import { EventDetectionEngine, EventIntelligenceObject } from '../services/EventDetectionEngine';
import { BreakingNewsEngine, BreakingAlert } from '../services/BreakingNewsEngine';
import { TimelineEngine, ComprehensiveTopicTimeline } from '../services/TimelineEngine';
import { GlobalIntelligenceMap } from './GlobalIntelligenceMap';
import { 
  X, Cpu, Radio, TrendingUp, Users, ShieldCheck, Sparkles, 
  Search, BookOpen, Share2, MessageCircle, BarChart3, ChevronRight, 
  Layers, CheckCircle2, AlertTriangle, RefreshCw, Eye, Flame, Award, Globe, Zap, History, Database
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
  const [activeTab, setActiveTab] = useState<'world' | 'pipeline' | 'timeline' | 'content' | 'audience' | 'editorial' | 'search'>('world');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(articles[0] || null);
  const [intelProfile, setIntelProfile] = useState<ArticleIntelligenceProfile | null>(null);
  const [trustEval, setTrustEval] = useState<TrustScoreEvaluation | null>(null);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [visitorProfile, setVisitorProfile] = useState<VisitorProfile | null>(null);
  const [editorialPkg, setEditorialPkg] = useState<EditorialPackage | null>(null);
  const [graphData, setGraphData] = useState<KnowledgeGraphData | null>(null);
  const [events, setEvents] = useState<EventIntelligenceObject[]>([]);
  const [breakingAlerts, setBreakingAlerts] = useState<BreakingAlert[]>([]);
  const [timelines, setTimelines] = useState<ComprehensiveTopicTimeline[]>([]);
  const [pipelineStats, setPipelineStats] = useState<IngestionPipelineStats | null>(null);
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);

  // Search State
  const [searchQuery, setSearchQuery] = useState('Latest AI investments in Rwanda');
  const [searchResult, setSearchResult] = useState<AiSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTrends(TrendDetectionService.detectTrends(articles));
      setVisitorProfile(AudienceIntelligenceService.getVisitorProfile());
      setGraphData(KnowledgeGraphEngine.buildGraph(articles));
      setEvents(EventDetectionEngine.detectEvents(articles));
      setBreakingAlerts(BreakingNewsEngine.getActiveBreakingAlerts(articles));
      setTimelines(TimelineEngine.getAllAvailableTimelines(articles));
      setPipelineStats(GlobalDataIngestionEngine.getPipelineStats());

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
                Continuous Global Data Ingestion, Automated Event Detection, Consensus Verification & Knowledge Graph System
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
            { id: 'pipeline', label: '2. Ingestion Pipeline', icon: Database },
            { id: 'timeline', label: '3. Topic Timelines', icon: History },
            { id: 'content', label: '4. Trust & Fact Core', icon: ShieldCheck },
            { id: 'audience', label: '5. Audience Intelligence', icon: Users },
            { id: 'editorial', label: '6. Editorial AI', icon: Sparkles },
            { id: 'search', label: '7. Veritas AI Search', icon: Search }
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
                  <span className="text-xs text-slate-400 font-mono block">Breaking Alerts</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-rose-400">
                      {breakingAlerts.length || 2}
                    </span>
                    <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Multi-Publisher Verified</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-mono block">Detected World Events</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-blue-400">{events.length}</span>
                    <Radio className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Political, Economic, Tech & Climate</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-mono block">Emerging Trends</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-amber-400">{trends.length}</span>
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Max +250% Search Rise</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-mono block">Consensus Score Avg</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-indigo-400">92.4%</span>
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Cross-Publisher Verification</span>
                </div>
              </div>

              {/* Global Intelligence Map Component */}
              <GlobalIntelligenceMap articles={articles} onSelectArticle={onSelectArticle} />

              {/* Real-time Event Objects Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
                  REAL-TIME DETECTED WORLD EVENTS
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map(evt => (
                    <div key={evt.event_id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[10px] font-mono font-bold">
                          {evt.eventType} • {evt.status}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                          Conf: {evt.confidence_score}% | Imp: {evt.importance_score}/100
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                      
                      <div className="flex flex-wrap gap-1 text-[11px] font-mono">
                        {evt.entities.map((ent, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-950/80 text-slate-300 border border-slate-800 rounded">
                            {ent}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-1 pt-2 border-t border-slate-900 text-xs font-mono">
                        <span className="text-slate-400 font-bold block">Event Milestones:</span>
                        {evt.timeline.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px]">
                            <span className="text-indigo-400 font-bold shrink-0">[{item.timestamp}]</span>
                            <span className="text-slate-300">{item.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INGESTION PIPELINE */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-indigo-400" />
                      Global Ingestion Engine & Deduplication Pipeline
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Pipeline Architecture: External Sources → Queue → AI Analysis → Trust Verification → Knowledge Graph → Publication
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold">
                    SYSTEM ACTIVE
                  </span>
                </div>

                {pipelineStats && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs font-mono">
                    <div className="p-3 bg-slate-900/80 rounded-xl">
                      <span className="text-slate-400 block">Total Ingested</span>
                      <span className="text-xl font-bold text-white">{pipelineStats.totalIngested}</span>
                    </div>
                    <div className="p-3 bg-slate-900/80 rounded-xl">
                      <span className="text-slate-400 block">Currently Queued</span>
                      <span className="text-xl font-bold text-cyan-400">{pipelineStats.currentlyQueued}</span>
                    </div>
                    <div className="p-3 bg-slate-900/80 rounded-xl">
                      <span className="text-slate-400 block">Verified & Published</span>
                      <span className="text-xl font-bold text-emerald-400">{pipelineStats.verifiedPublished}</span>
                    </div>
                    <div className="p-3 bg-slate-900/80 rounded-xl">
                      <span className="text-slate-400 block">Duplicates Blocked</span>
                      <span className="text-xl font-bold text-amber-400">{pipelineStats.duplicatesBlocked}</span>
                    </div>
                    <div className="p-3 bg-slate-900/80 rounded-xl">
                      <span className="text-slate-400 block">Active Feed Sources</span>
                      <span className="text-xl font-bold text-indigo-400">{pipelineStats.sourcesActive}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-slate-900">
                  <h4 className="text-xs font-bold text-slate-300 font-mono">Recent Ingestion Telemetry Logs:</h4>
                  <div className="space-y-2">
                    {GlobalDataIngestionEngine.getSourceHistoryLog().map((log, idx) => (
                      <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span className="font-bold text-white">{log.source}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'VERIFIED_PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TOPIC TIMELINES */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-400" />
                    Historical Topic Timelines & Entity Connections
                  </h3>
                  <div className="flex gap-2">
                    {timelines.map((tl, index) => (
                      <button
                        key={tl.topicId}
                        onClick={() => setSelectedTimelineIndex(index)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          selectedTimelineIndex === index
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {tl.topicName.slice(0, 25)}...
                      </button>
                    ))}
                  </div>
                </div>

                {timelines[selectedTimelineIndex] && (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-indigo-400">Category: {timelines[selectedTimelineIndex].category}</span>
                      <span className="text-slate-400">Connected System Articles: {timelines[selectedTimelineIndex].totalArticlesCount}</span>
                    </div>

                    <div className="relative pl-6 space-y-6 border-l-2 border-indigo-500/40">
                      {timelines[selectedTimelineIndex].milestones.map((m, i) => (
                        <div key={i} className="relative space-y-1">
                          <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-2 border-slate-950" />
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-bold">{m.year}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.significance === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {m.significance}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{m.title}</h4>
                          <p className="text-xs text-slate-300">{m.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {m.connectedEntities.map((ent, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800 rounded">
                                {ent}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CONTENT & TRUST CORE */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 font-mono block">SELECT ARTICLE TO INSPECT AI INTELLIGENCE & TRUST SCORECARD:</span>
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
                  </div>

                  {/* Trust Score Evaluation */}
                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        ADVANCED TRUST & CONSENSUS ENGINE
                      </h3>
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold">
                        {trustEval.verificationStatus}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl space-y-2 font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Consensus Trust Score:</span>
                        <span className="font-bold text-emerald-400 text-sm">{trustEval.consensusScore} / 100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Source Reliability Rating:</span>
                        <span className="font-bold text-cyan-400">{trustEval.metrics.sourceReliability}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Correction History Rating:</span>
                        <span className="font-bold text-indigo-400">{trustEval.metrics.correctionHistoryRating}%</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs font-mono text-slate-400">
                      <span className="font-bold text-slate-300 block">Verification Audit Log:</span>
                      {trustEval.auditTrail.map((log, idx) => (
                        <p key={idx} className="text-[11px] text-slate-400">• {log}</p>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 5: AUDIENCE INTELLIGENCE */}
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
              </div>
            </div>
          )}

          {/* TAB 6: EDITORIAL AI */}
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
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: VERITAS AI SEARCH */}
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
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {searchResult.synthesizedAnswer}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
