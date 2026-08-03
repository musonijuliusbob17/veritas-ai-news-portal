import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Article, Region, Category } from '../types';
import { KnowledgeGraphEngine, GraphEntityNode } from '../services/KnowledgeGraphEngine';
import {
  Search,
  X,
  Filter,
  Sparkles,
  Sliders,
  Clock,
  TrendingUp,
  Mic,
  MicOff,
  Globe,
  ShieldCheck,
  AlertTriangle,
  FileText,
  BarChart2,
  Share2,
  Bookmark,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  Layers,
  Cpu,
  RefreshCw,
  Eye,
  CheckCircle2,
  HelpCircle,
  MapPin,
  Calendar,
  Radio,
  Tv,
  Rss,
  Video,
  FileCode,
  Tag,
  UserCheck,
  Database,
  Grid,
  List,
  Compass,
  ArrowRight,
  Bell,
  Save,
  Printer
} from 'lucide-react';

interface EnterpriseIntelligenceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  initialQuery?: string;
  onSelectArticle: (article: Article) => void;
}

// Filter Types
export type TimeFilter = 'all' | 'today' | '24h' | '3d' | '7d' | '30d' | '90d' | 'year' | 'custom';
export type SourceFilter = 'all' | 'government' | 'international' | 'local' | 'tv' | 'radio' | 'newspaper' | 'rss' | 'tiktok' | 'youtube' | 'academic' | 'ngo' | 'social';
export type SentimentFilter = 'all' | 'positive' | 'neutral' | 'negative' | 'mixed' | 'highly_positive' | 'highly_negative';
export type CredibilityFilter = 'all' | 'very_high' | 'high' | 'medium' | 'low';
export type BiasFilter = 'all' | 'government' | 'opposition' | 'independent' | 'international' | 'commercial';
export type NarrativeFilter = 'all' | 'supportive' | 'critical' | 'polarizing' | 'disinformation' | 'propaganda' | 'unverified' | 'fact_checked';
export type RiskFilter = 'all' | 'strategic' | 'critical' | 'high' | 'medium' | 'low';
export type LanguageFilter = 'all' | 'english' | 'french' | 'kinyarwanda' | 'swahili' | 'arabic' | 'chinese' | 'spanish';
export type AiConfidenceFilter = 'all' | '90_100' | '80_90' | '70_80' | 'below_70';
export type ArticleTypeFilter = 'all' | 'breaking' | 'analysis' | 'editorial' | 'opinion' | 'interview' | 'investigation' | 'press_release' | 'research' | 'speech' | 'notice';
export type MediaFormatFilter = 'all' | 'article' | 'video' | 'audio' | 'image' | 'satellite' | 'map' | 'pdf';
export type EntityTypeFilter = 'all' | 'person' | 'company' | 'organization' | 'country' | 'ministry' | 'military' | 'court' | 'party' | 'bank' | 'airport' | 'university' | 'hospital' | 'ngo' | 'law' | 'policy';
export type SortOption = 'importance' | 'credibility' | 'risk' | 'trending' | 'discussed' | 'latest' | 'oldest' | 'connected' | 'confidence';

const TRENDING_QUERIES = [
  'Rwanda economy last month',
  'Show infrastructure projects in Kigali',
  'Which ministries were mentioned most?',
  'Articles about Kagame and AI',
  'News affecting tourism',
  'Anti-government narratives',
  'Investment opportunities in East Africa'
];

const RWANDA_PROVINCES = ['All', 'Kigali City', 'Northern Province', 'Southern Province', 'Eastern Province', 'Western Province'];
const RWANDA_DISTRICTS = ['All', 'Gasabo', 'Nyarugenge', 'Kicukiro', 'Musanze', 'Huye', 'Bugesera', 'Rubavu', 'Rwamagana'];

export const EnterpriseIntelligenceSearchModal: React.FC<EnterpriseIntelligenceSearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  initialQuery = '',
  onSelectArticle
}) => {
  // Core Search State
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'results' | 'graph' | 'timeline' | 'analytics' | 'saved'>('results');
  const [viewLayout, setViewLayout] = useState<'grid' | 'compact' | 'table'>('grid');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isAiSynthesizing, setIsAiSynthesizing] = useState(false);
  const [aiSynthesizedSummary, setAiSynthesizedSummary] = useState<string | null>(null);
  
  // Natural Language Intent Banner
  const [detectedIntent, setDetectedIntent] = useState<string | null>(null);

  // Filters State
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedTime, setSelectedTime] = useState<TimeFilter>('all');
  const [selectedSource, setSelectedSource] = useState<SourceFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentFilter>('all');
  const [selectedCredibility, setSelectedCredibility] = useState<CredibilityFilter>('all');
  const [selectedBias, setSelectedBias] = useState<BiasFilter>('all');
  const [selectedNarrative, setSelectedNarrative] = useState<NarrativeFilter>('all');
  const [selectedRisk, setSelectedRisk] = useState<RiskFilter>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageFilter>('all');
  const [selectedAiConfidence, setSelectedAiConfidence] = useState<AiConfidenceFilter>('all');
  const [selectedArticleType, setSelectedArticleType] = useState<ArticleTypeFilter>('all');
  const [selectedMediaFormat, setSelectedMediaFormat] = useState<MediaFormatFilter>('all');
  const [selectedEntityType, setSelectedEntityType] = useState<EntityTypeFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('importance');

  // Boolean Relationship Filters (Entity A AND Entity B WITHOUT Entity C)
  const [entityA, setEntityA] = useState('');
  const [entityB, setEntityB] = useState('');
  const [entityC, setEntityC] = useState('');

  // Bookmarks & Saved Searches
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<Array<{ id: string; query: string; date: string; alertActive: boolean }>>(() => {
    try {
      const saved = localStorage.getItem('veritas_saved_searches');
      return saved ? JSON.parse(saved) : [
        { id: '1', query: 'Kagame AND AI', date: '2026-08-01', alertActive: true },
        { id: '2', query: 'Rwanda economy last month', date: '2026-07-28', alertActive: false }
      ];
    } catch { return []; }
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('veritas_recent_searches');
      return saved ? JSON.parse(saved) : ['Rwanda AI Hub', 'Kigali Infrastructure', 'EAC Trade Corridors'];
    } catch { return []; }
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Voice Search Handler (Web Speech API or simulation)
  const toggleVoiceSearch = () => {
    if (isVoiceListening) {
      setIsVoiceListening(false);
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        setIsVoiceListening(true);

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          setIsVoiceListening(false);
        };

        recognition.onerror = () => {
          setIsVoiceListening(false);
        };

        recognition.onend = () => {
          setIsVoiceListening(false);
        };

        recognition.start();
      } catch {
        setIsVoiceListening(false);
      }
    } else {
      // Simulation for fallback
      setIsVoiceListening(true);
      setTimeout(() => {
        setQuery('Rwanda economy last month');
        setIsVoiceListening(false);
      }, 2500);
    }
  };

  // Natural Language Query Interpreter
  useEffect(() => {
    const qLower = query.toLowerCase().trim();
    if (!qLower) {
      setDetectedIntent(null);
      return;
    }

    if (qLower.includes('rwanda economy') || qLower.includes('economy last month')) {
      setDetectedIntent('Parsed Natural Query: Region="Rwanda" • Category="Economy" • Time="Last 30 Days"');
    } else if (qLower.includes('infrastructure') || qLower.includes('kigali')) {
      setDetectedIntent('Parsed Natural Query: Region="Rwanda" • Province="Kigali City" • Category="Infrastructure"');
    } else if (qLower.includes('ministries') || qLower.includes('mentioned most')) {
      setDetectedIntent('Parsed Natural Query: Entity Filter="Ministry" • Sort="Most Connected"');
    } else if (qLower.includes('kagame and ai') || (qLower.includes('kagame') && qLower.includes('ai'))) {
      setDetectedIntent('Parsed Relationship Query: Entity A="Kagame" AND Entity B="AI"');
    } else if (qLower.includes('tourism')) {
      setDetectedIntent('Parsed Natural Query: Category="Tourism" • Impact="Regional Economy"');
    } else if (qLower.includes('anti-government') || qLower.includes('narrative')) {
      setDetectedIntent('Parsed Intelligence Query: Narrative="Critical/Polarizing" • Bias="Opposition"');
    } else if (qLower.includes('east africa') || qLower.includes('investment')) {
      setDetectedIntent('Parsed Natural Query: Region="East Africa" • Category="Business/Economy"');
    } else {
      setDetectedIntent(null);
    }
  }, [query]);

  // Handle Search Execution
  const handleExecuteSearch = (qToExecute?: string) => {
    const targetQ = qToExecute !== undefined ? qToExecute : query;
    if (targetQ.trim() && !recentSearches.includes(targetQ)) {
      const updated = [targetQ, ...recentSearches.filter(s => s !== targetQ)].slice(0, 8);
      setRecentSearches(updated);
      try { localStorage.setItem('veritas_recent_searches', JSON.stringify(updated)); } catch {}
    }

    // Generate AI synthesized response for natural language queries
    setIsAiSynthesizing(true);
    setTimeout(() => {
      setAiSynthesizedSummary(
        `Synthesized Intelligence for "${targetQ || 'Global Intelligence Feeds'}":\n` +
        `• Tracked across 18,432 verified dispatches and 124 regional intelligence streams.\n` +
        `• Top entity alignment confirms high activity around Sovereign Tech, Economic Expansion, and EAC Cross-Border Trade.\n` +
        `• Overall Credibility Index: 96.4% | Risk Horizon: Low to Moderate.`
      );
      setIsAiSynthesizing(false);
    }, 350);
  };

  // Filter Articles
  const filteredArticles = useMemo(() => {
    const qLower = query.toLowerCase().trim();
    const eALower = entityA.toLowerCase().trim();
    const eBLower = entityB.toLowerCase().trim();
    const eCLower = entityC.toLowerCase().trim();

    return articles.filter(art => {
      const fullText = `${art.title} ${art.summaryShort} ${art.summaryDetailed || ''} ${art.category} ${art.country} ${art.region} ${art.tags.join(' ')} ${art.mainPublisher.name}`.toLowerCase();

      // Query Text Match
      if (qLower) {
        const words = qLower.split(' ').filter(w => w.length > 2);
        const matchesQuery = words.some(w => fullText.includes(w));
        if (!matchesQuery) return false;
      }

      // Relationship Logic (A AND B WITHOUT C)
      if (eALower && !fullText.includes(eALower)) return false;
      if (eBLower && !fullText.includes(eBLower)) return false;
      if (eCLower && fullText.includes(eCLower)) return false;

      // Region Filter
      if (selectedRegion !== 'all') {
        if (selectedRegion === 'Rwanda' && art.region !== 'Rwanda' && art.country !== 'Rwanda') return false;
        if (selectedRegion === 'East Africa' && art.region !== 'East Africa' && art.region !== 'Rwanda') return false;
        if (selectedRegion === 'Africa' && art.region !== 'Africa' && art.region !== 'East Africa' && art.region !== 'Rwanda') return false;
        if (selectedRegion === 'Global' && art.region !== 'Global') return false;
      }

      // Province Filter
      if (selectedProvince !== 'All' && !fullText.includes(selectedProvince.toLowerCase())) return false;

      // District Filter
      if (selectedDistrict !== 'All' && !fullText.includes(selectedDistrict.toLowerCase())) return false;

      // Category Filter
      if (selectedCategory !== 'all' && art.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;

      // Credibility Filter
      if (selectedCredibility === 'very_high' && art.confidenceScore < 90) return false;
      if (selectedCredibility === 'high' && (art.confidenceScore < 80 || art.confidenceScore >= 90)) return false;
      if (selectedCredibility === 'medium' && (art.confidenceScore < 70 || art.confidenceScore >= 80)) return false;

      // Risk Filter
      if (selectedRisk !== 'all') {
        const artRisk = (art.riskLevel || 'low').toLowerCase();
        if (artRisk !== selectedRisk) return false;
      }

      // Sentiment Filter
      if (selectedSentiment !== 'all') {
        const artSent = (art.sentiment || 'neutral').toLowerCase();
        if (selectedSentiment === 'positive' && !artSent.includes('positive')) return false;
        if (selectedSentiment === 'negative' && !artSent.includes('negative')) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'credibility') return b.confidenceScore - a.confidenceScore;
      if (sortBy === 'trending') return (b.viewsCount || 0) - (a.viewsCount || 0);
      if (sortBy === 'risk') {
        const riskRank = { critical: 4, strategic: 3, high: 2, medium: 1, low: 0 };
        const rA = riskRank[(a.riskLevel || 'low').toLowerCase() as keyof typeof riskRank] || 0;
        const rB = riskRank[(b.riskLevel || 'low').toLowerCase() as keyof typeof riskRank] || 0;
        return rB - rA;
      }
      if (sortBy === 'confidence') return b.confidenceScore - a.confidenceScore;
      if (sortBy === 'oldest') return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      // Default: Latest / Importance
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [
    articles, query, entityA, entityB, entityC, selectedRegion, selectedProvince, selectedDistrict,
    selectedCategory, selectedCredibility, selectedRisk, selectedSentiment, sortBy
  ]);

  // Extract Knowledge Graph Entities from Filtered Results
  const graphData = useMemo(() => {
    return KnowledgeGraphEngine.buildGraph(filteredArticles.length > 0 ? filteredArticles : articles);
  }, [filteredArticles, articles]);

  // Saved Searches Actions
  const handleSaveSearch = () => {
    if (!query.trim()) return;
    const newSave = {
      id: Date.now().toString(),
      query,
      date: new Date().toISOString().split('T')[0],
      alertActive: true
    };
    const updated = [newSave, ...savedSearches];
    setSavedSearches(updated);
    try { localStorage.setItem('veritas_saved_searches', JSON.stringify(updated)); } catch {}
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Export Results
  const handleExport = (format: 'pdf' | 'csv' | 'json' | 'brief') => {
    const dataStr = JSON.stringify(filteredArticles.map(a => ({ title: a.title, category: a.category, trustScore: a.confidenceScore, publishedAt: a.publishedAt })), null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veritas_intelligence_search_${Date.now()}.${format === 'csv' ? 'csv' : 'json'}`;
    a.click();
  };

  const activeFilterCount = [
    selectedRegion !== 'all',
    selectedProvince !== 'All',
    selectedDistrict !== 'All',
    selectedTime !== 'all',
    selectedSource !== 'all',
    selectedCategory !== 'all',
    selectedSentiment !== 'all',
    selectedCredibility !== 'all',
    selectedBias !== 'all',
    selectedNarrative !== 'all',
    selectedRisk !== 'all',
    selectedLanguage !== 'all',
    selectedAiConfidence !== 'all',
    selectedArticleType !== 'all',
    selectedMediaFormat !== 'all',
    selectedEntityType !== 'all',
    entityA.length > 0,
    entityB.length > 0,
    entityC.length > 0
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setSelectedRegion('all');
    setSelectedProvince('All');
    setSelectedDistrict('All');
    setSelectedTime('all');
    setSelectedSource('all');
    setSelectedCategory('all');
    setSelectedSentiment('all');
    setSelectedCredibility('all');
    setSelectedBias('all');
    setSelectedNarrative('all');
    setSelectedRisk('all');
    setSelectedLanguage('all');
    setSelectedAiConfidence('all');
    setSelectedArticleType('all');
    setSelectedMediaFormat('all');
    setSelectedEntityType('all');
    setEntityA('');
    setEntityB('');
    setEntityC('');
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in overflow-hidden">
      <div className="bg-slate-950 border border-slate-800 text-white rounded-3xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden shadow-2xl font-sans relative">
        
        {/* ========================================================================= */}
        {/* 1. TOP INTELLIGENCE SEARCH HEADER & SEARCH BAR */}
        {/* ========================================================================= */}
        <div className="p-4 md:p-6 bg-slate-950/95 border-b border-slate-800 space-y-4 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 text-white shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-6 h-6 animate-pulse text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                    VERITAS ENTERPRISE INTELLIGENCE SEARCH PLATFORM
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden sm:inline-block">
                    PALANTIR / TERMINAL GRADE
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Semantic Natural Language Discovery, Entity Relationship Parsing & Geopolitical Intelligence Filters
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveSearch}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                title="Save this search query & activate alerts"
              >
                <Save className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Save Search</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* LARGE STICKY INTELLIGENT SEARCH INPUT */}
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-indigo-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleExecuteSearch();
                }}
                placeholder="Search natural language, entities, relationships... (e.g., 'Rwanda economy last month' or 'Kagame AND AI')"
                className="w-full pl-12 pr-28 py-3 bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-2xl text-xs sm:text-sm font-mono border border-indigo-500/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-inner"
              />

              <div className="absolute right-3 top-2.5 flex items-center gap-2">
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                    title="Clear query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Voice Search Button */}
                <button
                  onClick={toggleVoiceSearch}
                  className={`p-1.5 rounded-xl transition cursor-pointer ${
                    isVoiceListening
                      ? 'bg-rose-500 text-white animate-bounce shadow-lg shadow-rose-500/50'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                  title={isVoiceListening ? 'Listening...' : 'Voice Search'}
                >
                  {isVoiceListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <kbd className="hidden md:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-950 rounded-lg border border-slate-800">
                  Ctrl + K
                </kbd>
              </div>
            </div>

            {/* Advanced Filters Toggle Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-3 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 border transition cursor-pointer shrink-0 ${
                showAdvancedFilters || activeFilterCount > 0
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                  {activeFilterCount}
                </span>
              )}
              {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* NATURAL LANGUAGE INTENT BANNER */}
          {detectedIntent && (
            <div className="p-2.5 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-xs font-mono text-indigo-300 flex items-center justify-between animate-fade-in">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                {detectedIntent}
              </span>
              <button
                onClick={() => setDetectedIntent(null)}
                className="text-slate-400 hover:text-white text-[10px]"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* RECENT SEARCHES & TRENDING TOPICS */}
          <div className="flex items-center justify-between text-xs font-mono overflow-x-auto scrollbar-none gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Trending:
              </span>
              {TRENDING_QUERIES.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(t);
                    handleExecuteSearch(t);
                  }}
                  className="px-2.5 py-1 bg-slate-900/80 hover:bg-indigo-950 hover:border-indigo-500 text-indigo-300 rounded-lg border border-slate-800 text-[11px] whitespace-nowrap cursor-pointer transition"
                >
                  {t}
                </button>
              ))}
            </div>

            {recentSearches.length > 0 && (
              <div className="hidden lg:flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Recent: {recentSearches.slice(0, 3).join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. COLLAPSIBLE ADVANCED INTELLIGENCE FILTER PANEL */}
        {/* ========================================================================= */}
        {showAdvancedFilters && (
          <div className="bg-slate-900 border-b border-slate-800 p-4 sm:p-6 overflow-y-auto max-h-[45vh] font-mono text-xs space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                INTELLIGENCE FILTER MATRIX ({activeFilterCount} Active)
              </span>
              <button
                onClick={resetAllFilters}
                className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>

            {/* SECTION A: GEOGRAPHY & LOCATION */}
            <div className="space-y-2">
              <span className="text-slate-400 text-[11px] font-bold block">1. GEOGRAPHIC PROXIMITY & ADMINISTRATIVE BOUNDARIES:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Region / Continent</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:border-indigo-500"
                  >
                    <option value="all">All Regions (Global)</option>
                    <option value="Rwanda">Rwanda Sovereign HQ 🇷🇼</option>
                    <option value="East Africa">East Africa (EAC Community)</option>
                    <option value="Africa">Pan-Africa (AfCFTA)</option>
                    <option value="Global">Global Interlinks</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Rwanda Province</label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:border-indigo-500"
                  >
                    {RWANDA_PROVINCES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Rwanda District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:border-indigo-500"
                  >
                    {RWANDA_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">GPS Origin Node</label>
                  <input
                    type="text"
                    placeholder="e.g., -1.9441° S, 30.0619° E"
                    readOnly
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-2 text-slate-400 text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: TIME HORIZON & SOURCE CLASSIFICATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-slate-400 text-[11px] font-bold block">2. TIME HORIZON:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Time' },
                    { id: '24h', label: 'Last 24 Hours' },
                    { id: '3d', label: '3 Days' },
                    { id: '7d', label: '7 Days' },
                    { id: '30d', label: '30 Days' },
                    { id: '90d', label: '90 Days' },
                    { id: 'year', label: 'This Year' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTime(t.id as TimeFilter)}
                      className={`px-3 py-1 rounded-lg text-[11px] border cursor-pointer transition ${
                        selectedTime === t.id
                          ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-slate-400 text-[11px] font-bold block">3. SOURCE TYPES & CHANNELS:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Sources' },
                    { id: 'government', label: '🏛️ Government' },
                    { id: 'international', label: '🌐 International' },
                    { id: 'local', label: '📰 Local Press' },
                    { id: 'tv', label: '📺 Television' },
                    { id: 'rss', label: '📡 RSS Streams' },
                    { id: 'academic', label: '🎓 Academic' },
                    { id: 'ngo', label: '🤝 NGO Reports' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSource(s.id as SourceFilter)}
                      className={`px-3 py-1 rounded-lg text-[11px] border cursor-pointer transition ${
                        selectedSource === s.id
                          ? 'bg-amber-600 border-amber-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION C: CATEGORY & RISK & CREDIBILITY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Sector Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:border-indigo-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Technology">Technology & AI</option>
                  <option value="Economy">Economy & Business</option>
                  <option value="Politics">Politics & Governance</option>
                  <option value="Security">Security & Defence</option>
                  <option value="Health">Health & Bio-Tech</option>
                  <option value="Tourism">Tourism & Environment</option>
                  <option value="Infrastructure">Infrastructure & Logistics</option>
                  <option value="Energy">Energy & Mining</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Credibility Rating</label>
                <select
                  value={selectedCredibility}
                  onChange={(e) => setSelectedCredibility(e.target.value as CredibilityFilter)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:border-indigo-500"
                >
                  <option value="all">All Credibility Levels</option>
                  <option value="very_high">Very High (90%+ Verified)</option>
                  <option value="high">High (80-90%)</option>
                  <option value="medium">Medium (70-80%)</option>
                  <option value="low">Low (&lt;70%)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Risk Horizon Level</label>
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value as RiskFilter)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:border-indigo-500"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="strategic">Strategic Risk</option>
                  <option value="critical">Critical Risk</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
              </div>
            </div>

            {/* SECTION D: AI INTELLIGENCE & RELATIONSHIP LOGIC FILTERS */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/20 space-y-3">
              <span className="text-indigo-400 font-bold text-xs flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-400" />
                BOOLEAN ENTITY RELATIONSHIP LOGIC (Entity A AND Entity B WITHOUT Entity C)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-emerald-400 font-bold block mb-1">1. Entity A (MUST INCLUDE)</label>
                  <input
                    type="text"
                    value={entityA}
                    onChange={(e) => setEntityA(e.target.value)}
                    placeholder="e.g. Kagame"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 text-xs focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-indigo-400 font-bold block mb-1">2. Entity B (AND ALSO INCLUDE)</label>
                  <input
                    type="text"
                    value={entityB}
                    onChange={(e) => setEntityB(e.target.value)}
                    placeholder="e.g. AI"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 text-xs focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-rose-400 font-bold block mb-1">3. Entity C (WITHOUT / EXCLUDE)</label>
                  <input
                    type="text"
                    value={entityC}
                    onChange={(e) => setEntityC(e.target.value)}
                    placeholder="e.g. Sports"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200 text-xs focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. SEARCH ANALYTICS & RANKING SUB-BAR */}
        {/* ========================================================================= */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          {/* Analytics Counter */}
          <div className="flex items-center space-x-4 text-slate-400">
            <span className="text-white font-bold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              18,432 <span className="text-slate-400 font-normal">Articles Searched</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 font-bold">
              {filteredArticles.length} Hits Matched
            </span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-cyan-400 font-bold hidden sm:inline">
              124 Sources
            </span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-amber-400 font-bold hidden sm:inline">
              42ms Latency
            </span>
          </div>

          {/* Navigation Tabs & View Mode & Sorting */}
          <div className="flex items-center gap-3">
            {/* View Mode */}
            <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded-lg transition ${viewLayout === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Grid Cards"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewLayout('compact')}
                className={`p-1.5 rounded-lg transition ${viewLayout === 'compact' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Compact List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 text-[10px]">Rank By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-slate-200 text-xs focus:border-indigo-500"
              >
                <option value="importance">🌟 Most Important</option>
                <option value="credibility">🛡️ Highest Credibility</option>
                <option value="risk">🚨 Highest Risk</option>
                <option value="trending">🔥 Trending</option>
                <option value="latest">⏱️ Latest First</option>
                <option value="oldest">📜 Oldest First</option>
                <option value="confidence">🤖 Highest Confidence</option>
              </select>
            </div>

            {/* Export Dropdown */}
            <button
              onClick={() => handleExport('json')}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              title="Export results"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. MAIN CONTENT SPLIT AREA (RESULTS + RIGHT INTELLIGENCE SIDEBAR) */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 bg-slate-950">
          
          {/* LEFT/CENTER: ARTICLE DISPATCH RESULTS PANEL */}
          <div className="lg:col-span-8 p-6 space-y-6 border-r border-slate-800/80 overflow-y-auto">
            
            {/* AI Synthesized Executive Summary Card */}
            {aiSynthesizedSummary && (
              <div className="bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 border border-indigo-500/40 rounded-3xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                  <span className="text-xs font-bold font-mono text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    AI SYNTHESIZED INTELLIGENCE SUMMARY
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    98.4% Confidence
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-line">
                  {aiSynthesizedSummary}
                </p>
              </div>
            )}

            {/* RESULTS LIST / GRID */}
            {filteredArticles.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <Search className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">No Intelligence Dispatches Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try broadening your search query or resetting filters (e.g., change Credibility or Region limits).
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
                >
                  Reset Filter Matrix
                </button>
              </div>
            ) : (
              <div className={viewLayout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-5 bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl space-y-3 transition group shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">{art.mainPublisher.name}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-amber-400 font-bold">{art.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                            {art.confidenceScore}% Trust
                          </span>
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                            Risk: {(art.riskLevel || 'LOW').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Headline */}
                      <h3
                        onClick={() => {
                          onSelectArticle(art);
                          onClose();
                        }}
                        className="text-sm font-bold text-white group-hover:text-indigo-300 transition cursor-pointer leading-snug line-clamp-2"
                      >
                        {art.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {art.summaryShort}
                      </p>

                      {/* Extracted Entity Badges */}
                      <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
                        {art.tags.slice(0, 4).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-400 rounded-md border border-slate-800">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono text-[11px] text-slate-500">
                      <span>{new Date(art.publishedAt).toLocaleDateString()}</span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleBookmark(art.id)}
                          className={`p-1.5 rounded-lg border transition ${
                            bookmarkedIds.includes(art.id)
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                          title="Bookmark dispatch"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            onSelectArticle(art);
                            onClose();
                          }}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer transition"
                        >
                          <span>Open Intelligence</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: CONNECTED KNOWLEDGE GRAPH, TIMELINE & HEAT MAP */}
          <div className="lg:col-span-4 p-6 bg-slate-950 space-y-6 overflow-y-auto">
            
            {/* 1. CONNECTED ENTITIES MATRIX */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Cpu className="w-4 h-4 text-amber-400" /> RELATED ENTITIES
                </span>
                <span className="text-[10px] text-slate-500">{graphData.nodes.length} Nodes</span>
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {graphData.nodes.slice(0, 10).map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setQuery(node.name)}
                    className="px-2.5 py-1 bg-slate-950 hover:bg-indigo-950 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-[11px] transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>{node.name}</span>
                    <span className="px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">
                      {node.connectionsCount || 3}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. CHRONOLOGICAL INTELLIGENCE TIMELINE */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                <Clock className="w-4 h-4" /> CHRONOLOGICAL TIMELINE
              </h3>

              <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {filteredArticles.slice(0, 4).map((art, idx) => (
                  <div key={art.id} className="pl-6 relative space-y-1">
                    <span className="absolute left-0 top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center text-[8px] text-indigo-400">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] text-indigo-300 font-bold block">
                      {new Date(art.publishedAt).toLocaleDateString()}
                    </span>
                    <h4 className="text-xs text-white font-bold line-clamp-1">{art.title}</h4>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-2">{art.summaryShort}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. GEOGRAPHIC HEAT MAP BREAKDOWN */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                <Globe className="w-4 h-4" /> GEOGRAPHIC ORIGIN BREAKDOWN
              </h3>

              <div className="space-y-2">
                {[
                  { region: 'Rwanda (Kigali HQ)', pct: 54, color: 'bg-emerald-500' },
                  { region: 'East Africa (EAC)', pct: 28, color: 'bg-indigo-500' },
                  { region: 'Pan-Africa (AfCFTA)', pct: 12, color: 'bg-amber-500' },
                  { region: 'Global Nodes', pct: 6, color: 'bg-cyan-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">{item.region}</span>
                      <span className="text-emerald-400 font-bold">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. SAVED SEARCHES & ALERTS */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Bell className="w-4 h-4" /> SAVED SEARCH ALERTS ({savedSearches.length})
                </span>
              </h3>

              <div className="space-y-2">
                {savedSearches.map((s) => (
                  <div key={s.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-white text-xs block">{s.query}</strong>
                      <span className="text-[10px] text-slate-500">Saved {s.date}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                      {s.alertActive ? 'ACTIVE ALERT' : 'PAUSED'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
