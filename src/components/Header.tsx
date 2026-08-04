import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sun, Moon, Radio, Tv, ShieldCheck, Shield, Rocket, Award,
  Bookmark, Bell, User, BarChart2, Cpu, RefreshCw, Volume2, Settings,
  Globe, Network, Code, ShieldAlert, Sparkles, Bot, Compass, UserCheck, Building2, Info, Activity, Landmark, Terminal, BookOpen,
  ChevronDown, Grid, Menu, X, Layers, Clock, History, TrendingUp, Tag, Filter, Check
} from 'lucide-react';<div style={{background:'#ffeb3b',padding:'6px',textAlign:'center',fontWeight:'bold'}}>
🚀 AUTONOMOUS DEPLOYMENT TEST - 04 Aug 2026
</div>
import { SupportedLanguage, UserPreferences, WeatherData, StockTickerItem, Article } from '../types';
import { WhatsAppIntegration } from './WhatsAppIntegration';

interface HeaderProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onOpenAiAssistant: () => void;
  onOpenAdmin: () => void;
  onOpenBookmarks: () => void;
  onOpenFinancialHub: () => void;
  onOpenPublisherDirectory: () => void;
  onOpenNewsMap: () => void;
  onOpenKnowledgeGraph: () => void;
  onOpenAudioVideo: () => void;
  onOpenDevApi: () => void;
  onOpenCrisisMonitor: () => void;
  onOpenResearchWorkspace: () => void;
  onOpenAgentNetwork: () => void;
  onOpenAfricaCenter?: () => void;
  onOpenAnalystReview?: () => void;
  onOpenEnterpriseWorkspace?: () => void;
  onOpenTransparencyCenter?: () => void;
  onOpenGlobalRiskIndex?: () => void;
  onOpenCompanyGovProfiles?: () => void;
  onOpenCountryProfiles?: () => void;
  onOpenExecutiveDashboard?: () => void;
  onOpenPromptFramework?: () => void;
  onOpenSecurityArchitecture?: () => void;
  onOpenRoadmap2035?: () => void;
  onOpenPrincipalCouncilAudit?: () => void;
  onOpenUniversalCollection?: () => void;
  onOpenIntelligenceOps?: () => void;
  onOpenDigitalTwin?: () => void;
  onOpenOsCore?: () => void;
  onOpenTerminal?: () => void;
  onOpenExchange?: () => void;
  onOpenLanguageTranslator?: () => void;
  onOpenKnowledgeLibrary?: () => void;
  onOpenCommandCenter?: () => void;
  onOpenAiSearch?: () => void;
  onOpenNarrativeEngine?: () => void;
  onOpenVcioBrain?: () => void;
  onOpenVciaInvestigative?: () => void;
  onOpenOperationsCenter?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  weather: WeatherData | null;
  stocks: StockTickerItem[];
  articles?: Article[];
  onSelectArticle?: (article: Article) => void;
}

const LANGUAGES: SupportedLanguage[] = [
  'English',
  'French',
  'Kinyarwanda',
  'Swahili',
  'Spanish',
  'Arabic',
  'Chinese',
  'German',
  'Portuguese'
];

export const Header: React.FC<HeaderProps> = ({
  preferences,
  onUpdatePreferences,
  onOpenAiAssistant,
  onOpenAdmin,
  onOpenBookmarks,
  onOpenFinancialHub,
  onOpenPublisherDirectory,
  onOpenNewsMap,
  onOpenKnowledgeGraph,
  onOpenAudioVideo,
  onOpenDevApi,
  onOpenCrisisMonitor,
  onOpenResearchWorkspace,
  onOpenAgentNetwork,
  onOpenAfricaCenter,
  onOpenAnalystReview,
  onOpenEnterpriseWorkspace,
  onOpenTransparencyCenter,
  onOpenGlobalRiskIndex,
  onOpenCompanyGovProfiles,
  onOpenCountryProfiles,
  onOpenExecutiveDashboard,
  onOpenPromptFramework,
  onOpenSecurityArchitecture,
  onOpenRoadmap2035,
  onOpenPrincipalCouncilAudit,
  onOpenUniversalCollection,
  onOpenIntelligenceOps,
  onOpenDigitalTwin,
  onOpenOsCore,
  onOpenTerminal,
  onOpenExchange,
  onOpenLanguageTranslator,
  onOpenKnowledgeLibrary,
  onOpenCommandCenter,
  onOpenAiSearch,
  onOpenNarrativeEngine,
  onOpenVcioBrain,
  onOpenVciaInvestigative,
  onOpenOperationsCenter,
  searchQuery,
  onSearchChange,
  weather,
  stocks,
  articles = [],
  onSelectArticle
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLiveAudioPlaying, setIsLiveAudioPlaying] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showToolsMenu, setShowToolsMenu] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('veritas_recent_searches');
      return saved ? JSON.parse(saved) : ['Rwanda Tech Hub', 'AI Regulations', 'Global Markets', 'Elections'];
    } catch {
      return ['Rwanda Tech Hub', 'AI Regulations', 'Global Markets', 'Elections'];
    }
  });
  const [minTrustFilter, setMinTrustFilter] = useState<number>(0);
  const [scheduleStatus, setScheduleStatus] = useState<string>('Every 3h (Active)');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const TRENDING_SEARCH_TOPICS = [
    '🇷🇼 Rwanda Tech', '🤖 Gemini 1.5 Pro', '📈 Fed Rates', '🌍 Oil Markets', '🛡️ Cybersecurity', '🪙 Crypto Rules'
  ];

  // Save query to search history
  const handleSelectSearchQuery = (query: string) => {
    onSearchChange(query);
    if (query.trim()) {
      const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 6);
      setRecentSearches(updated);
      try {
        localStorage.setItem('veritas_recent_searches', JSON.stringify(updated));
      } catch {}
    }
    setIsSearchFocused(false);
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('veritas_recent_searches');
    } catch {}
  };

  // Keyboard shortcut listener for `/` or `Cmd+K`
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter matching articles for live autocomplete
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return articles.filter(a => {
      const matchesText = a.title.toLowerCase().includes(q) ||
        a.summaryShort.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.mainPublisher.name.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q));
      const matchesTrust = a.confidenceScore >= minTrustFilter;
      return matchesText && matchesTrust;
    }).slice(0, 6);
  }, [searchQuery, articles, minTrustFilter]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 10000);

    fetch('/api/crawler/schedule')
      .then(res => res.json())
      .then(data => {
        if (data && data.status) {
          setScheduleStatus(`Every ${data.intervalHours || 3}h (${data.status})`);
        }
      })
      .catch(() => {});

    return () => clearInterval(interval);
  }, []);

  const toggleLiveAudio = () => {
    setIsLiveAudioPlaying(!isLiveAudioPlaying);
    if (!isLiveAudioPlaying && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Welcome to Veritas Global AI News Bulletin. Streaming top verified stories live.");
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Utility Ticker Bar */}
      <div className="bg-slate-950 text-slate-300 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-0.5">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            VERITAS ENGINE ACTIVE
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400 font-medium flex items-center gap-1 shrink-0" title="System autonomously fetches new content every 3 hours">
            <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
            <span>AUTO-HARVEST: {scheduleStatus}</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 shrink-0 font-mono">{currentTime}</span>
          <span className="text-slate-500 hidden md:inline">|</span>

          {/* Quick Weather */}
          {weather && (
            <div className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer shrink-0">
              <span className="font-medium">{weather.city}:</span>
              <span className="font-semibold text-amber-300">{weather.tempC}°C ({weather.tempF}°F)</span>
              <span className="text-slate-400">({weather.condition})</span>
            </div>
          )}

          {/* Top Stock Ticker Strip */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            <span className="text-slate-500">|</span>
            {stocks.slice(0, 4).map(st => (
              <div 
                key={st.symbol} 
                onClick={onOpenFinancialHub}
                className="flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer transition-colors"
              >
                <span className="font-medium text-slate-400">{st.symbol}:</span>
                <span>{st.price.toLocaleString()}</span>
                <span className={`text-[10px] font-bold ${st.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {st.change >= 0 ? '+' : ''}{st.changePercent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Right Utilities */}
        <div className="flex items-center space-x-3 ml-auto">
          {/* Language Selector & AI Translate Hub Button */}
          <div className="flex items-center gap-1.5">
            <select 
              value={preferences.preferredLanguage}
              onChange={(e) => onUpdatePreferences({ preferredLanguage: e.target.value as SupportedLanguage })}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded text-xs px-2 py-0.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            {onOpenLanguageTranslator && (
              <button
                onClick={onOpenLanguageTranslator}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 transition-all cursor-pointer"
                title="Open Human-Like AI Neural Translation Hub (Articles & Websites)"
              >
                <Globe className="w-3 h-3 text-blue-400" />
                <span className="hidden md:inline">Translate Hub</span>
              </button>
            )}
          </div>

          {/* Live Audio / Radio Toggle */}
          <button
            onClick={toggleLiveAudio}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium transition-all ${
              isLiveAudioPlaying 
                ? 'bg-rose-600 text-white animate-pulse' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle Veritas AI Radio Broadcast"
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLiveAudioPlaying ? 'LIVE AUDIO ON' : 'AI RADIO'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => onUpdatePreferences({ darkMode: !preferences.darkMode })}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {preferences.darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-sans">
                  VERITAS<span className="text-blue-600 dark:text-blue-400">GLOBAL</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <ShieldCheck className="w-3 h-3 mr-0.5" /> AI VERIFIED
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80 shadow-sm">
                  <Globe className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" /> 🌍 75% Africa (🇷🇼 20% Rwanda)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Autonomous Global News Intelligence & Verification Network
              </p>
            </div>
          </a>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsSearchFocused(true);
              }}
              placeholder="Search global news... (Press '/' to focus)"
              className="w-full pl-10 pr-16 py-2 bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            
            <div className="absolute right-2.5 top-2 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-0.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-700/80 rounded border border-slate-300 dark:border-slate-600">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* INSTANT AUTOCOMPLETE & SEARCH POPOVER PANEL */}
          {isSearchFocused && (
            <>
              {/* Invisible Backdrop to close on click outside */}
              <div 
                className="fixed inset-0 z-30 bg-black/20"
                onClick={() => setIsSearchFocused(false)}
              />

              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 text-slate-900 dark:text-slate-100 z-40 max-h-[80vh] overflow-y-auto space-y-4 font-sans text-xs">
                
                {/* Search Quick Filters Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <span className="font-bold uppercase tracking-wider flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <Sparkles className="w-3.5 h-3.5" /> Veritas Instant Search
                  </span>
                  
                  {/* Launch Enterprise Search Platform Trigger */}
                  {onOpenAiSearch && (
                    <button
                      onClick={() => {
                        setIsSearchFocused(false);
                        onOpenAiSearch();
                      }}
                      className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg font-mono font-bold flex items-center gap-1 text-[10px] cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Enterprise Search Platform (Ctrl+K)</span>
                    </button>
                  )}

                  {/* Trust Filter Toggle */}
                  <div className="flex items-center gap-1">
                    <span>Min Trust:</span>
                    <button
                      onClick={() => setMinTrustFilter(minTrustFilter === 90 ? 0 : 90)}
                      className={`px-2 py-0.5 rounded-md font-bold transition ${
                        minTrustFilter === 90 ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {minTrustFilter === 90 ? '90%+ Verified' : 'All'}
                    </button>
                  </div>
                </div>

                {/* Case 1: Active query entered -> Show matching article suggestions */}
                {searchQuery.trim() ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                      <span>MATCHING DISPATCHES ({searchSuggestions.length})</span>
                      <span>Press Enter for full feed search</span>
                    </div>

                    {searchSuggestions.length === 0 ? (
                      <p className="py-4 text-center text-slate-500 text-xs">
                        No articles match "{searchQuery}". Try searching for categories like "AI", "Business", or "Africa".
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {searchSuggestions.map((art) => (
                          <div
                            key={art.id}
                            onClick={() => {
                              if (onSelectArticle) onSelectArticle(art);
                              handleSelectSearchQuery(art.title);
                            }}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-100 dark:border-slate-800 transition cursor-pointer flex items-start gap-3"
                          >
                            <img
                              src={art.featuredImage}
                              alt={art.title}
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-blue-600 dark:text-blue-400">{art.category}</span>
                                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{art.confidenceScore}% Trust</span>
                              </div>
                              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs line-clamp-1 leading-snug">
                                {art.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                {art.summaryShort}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Case 2: No query typed -> Show Recent Searches & Trending Topics */
                  <div className="space-y-4">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                          <span className="flex items-center gap-1">
                            <History className="w-3.5 h-3.5" /> RECENT SEARCHES
                          </span>
                          <button
                            onClick={handleClearHistory}
                            className="text-slate-400 hover:text-rose-500 transition text-[10px]"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {recentSearches.map((term, i) => (
                            <button
                              key={i}
                              onClick={() => handleSelectSearchQuery(term)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition cursor-pointer flex items-center gap-1"
                            >
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending Search Topics */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> TRENDING TOPICS
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {TRENDING_SEARCH_TOPICS.map((topic, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectSearchQuery(topic.replace(/^[^\s]+\s*/, ''))}
                            className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 transition cursor-pointer flex items-center gap-1"
                          >
                            <span>{topic}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end relative">
          {/* VCIO (The Brain) Button */}
          {onOpenVcioBrain && (
            <button
              onClick={onOpenVcioBrain}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-indigo-600/20 to-purple-600/20 hover:from-amber-500/30 hover:to-purple-600/30 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1.5 font-extrabold text-xs shadow-sm cursor-pointer"
              title="VCIO (Veritas Chief Intelligence Officer) — The Brain of Veritas"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>VCIO (Brain)</span>
            </button>
          )}

          {/* VCIA (Investigative Analyst) Button */}
          {onOpenVciaInvestigative && (
            <button
              onClick={onOpenVciaInvestigative}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition-all flex items-center gap-1.5 font-bold text-xs cursor-pointer"
              title="VCIA (Veritas Chief Investigative Analyst) — Long-Term Research Co-Pilot"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">VCIA</span>
            </button>
          )}

          {/* AI Search Assistant Button */}
          {onOpenAiSearch && (
            <button
              onClick={onOpenAiSearch}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
              title="Veritas AI Conversational Search Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden lg:inline">AI Search</span>
            </button>
          )}

          {/* AI Command Center Button */}
          {onOpenCommandCenter && (
            <button
              onClick={onOpenCommandCenter}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              title="Veritas AI Command Center Dashboard"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
              <span className="hidden md:inline">Command Center</span>
            </button>
          )}

          {/* AI Research Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            title="Veritas AI Research Co-Pilot"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Research</span>
          </button>

          {/* Emergency Crisis Radar */}
          <button
            onClick={onOpenCrisisMonitor}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            title="Live Emergency Crisis Radar"
          >
            <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Bookmarks & Reading List"
          >
            <Bookmark className="w-4 h-4" />
            {preferences.bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {preferences.bookmarks.length}
              </span>
            )}
          </button>

          {/* Admin Dashboard / Console Panel Link */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-amber-400 hover:bg-slate-800 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700 border border-amber-500/30 transition-all cursor-pointer shadow-xs"
            title="System Admin & Crawler Control Console"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Operations Center & Deployment Manager (VDM) Link */}
          {onOpenOperationsCenter && (
            <button
              onClick={onOpenOperationsCenter}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-indigo-900 to-slate-900 text-emerald-400 hover:text-emerald-300 border border-indigo-500/50 hover:border-emerald-500 transition-all cursor-pointer shadow-sm"
              title="Veritas Operations Center (VOC) & Deployment Manager (VDM)"
            >
              <Rocket className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden md:inline">Operations Center (VDM)</span>
            </button>
          )}

          {/* MORE TOOLS (25+) DROPDOWN TRIGGER */}
          <button
            onClick={() => setShowToolsMenu(!showToolsMenu)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-sm ${
              showToolsMenu
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-cyan-400 border-cyan-500/40 hover:bg-slate-800 hover:text-cyan-300'
            }`}
            title="Access all 25+ Veritas Intelligence Engines & Suites"
          >
            <Grid className="w-4 h-4" />
            <span>25+ Tools</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showToolsMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* TOOLS DROPDOWN POPOVER PANEL */}
          {showToolsMenu && (
            <>
              {/* Overlay Backdrop to close */}
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                onClick={() => setShowToolsMenu(false)}
              />

              <div className="absolute right-0 top-full mt-2 w-[94vw] max-w-[720px] max-h-[85vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-5 text-slate-100 z-50 font-sans">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg text-slate-950">
                      <Grid className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">Veritas Intelligence Suite</h3>
                      <p className="text-[11px] text-slate-400">All specialized AI verification engines & governance modules</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowToolsMenu(false)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  {/* Category 1: Executive & Governance */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Executive & Governance</span>
                    </div>
                    <div className="space-y-1">
                      {onOpenOperationsCenter && (
                        <button
                          onClick={() => { onOpenOperationsCenter(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/40 rounded-lg hover:border-emerald-500 flex items-center justify-between text-slate-100 hover:text-emerald-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Rocket className="w-4 h-4 text-emerald-400" />
                            <span className="font-extrabold text-emerald-300">Operations Center (VDM Deployment)</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">CORE DEVOPS</span>
                        </button>
                      )}
                      {onOpenExecutiveDashboard && (
                        <button
                          onClick={() => { onOpenExecutiveDashboard(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-amber-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <UserCheck className="w-4 h-4 text-purple-400" />
                            <span className="font-medium">Executive Intelligence Suite</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">Phase 10</span>
                        </button>
                      )}
                      {onOpenCountryProfiles && (
                        <button
                          onClick={() => { onOpenCountryProfiles(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-blue-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span className="font-medium">Country Intelligence Profiles</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">Phase 9</span>
                        </button>
                      )}
                      {onOpenCompanyGovProfiles && (
                        <button
                          onClick={() => { onOpenCompanyGovProfiles(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-indigo-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Landmark className="w-4 h-4 text-indigo-400" />
                            <span className="font-medium">Sovereign State & Company Dossiers</span>
                          </div>
                        </button>
                      )}
                      {onOpenEnterpriseWorkspace && (
                        <button
                          onClick={() => { onOpenEnterpriseWorkspace(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-emerald-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-emerald-400" />
                            <span className="font-medium">Enterprise Workspaces</span>
                          </div>
                        </button>
                      )}
                      {onOpenRoadmap2035 && (
                        <button
                          onClick={() => { onOpenRoadmap2035(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-amber-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Rocket className="w-4 h-4 text-amber-400" />
                            <span className="font-medium">Veritas 2035 Strategic Vision</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">Phase 15</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category 2: Operations & Systems */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Operations & Intelligence OS</span>
                    </div>
                    <div className="space-y-1">
                      {onOpenIntelligenceOps && (
                        <button
                          onClick={() => { onOpenIntelligenceOps(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-cyan-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Compass className="w-4 h-4 text-amber-400" />
                            <span className="font-medium">Intelligence Operations Center</span>
                          </div>
                        </button>
                      )}
                      {onOpenDigitalTwin && (
                        <button
                          onClick={() => { onOpenDigitalTwin(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-cyan-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-cyan-400" />
                            <span className="font-medium">Global Digital Twin Simulator</span>
                          </div>
                        </button>
                      )}
                      {onOpenOsCore && (
                        <button
                          onClick={() => { onOpenOsCore(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-emerald-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="font-medium">Veritas OS Core & Red Team</span>
                          </div>
                        </button>
                      )}
                      {onOpenTerminal && (
                        <button
                          onClick={() => { onOpenTerminal(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-indigo-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Terminal className="w-4 h-4 text-indigo-400" />
                            <span className="font-medium">Institutional Terminal</span>
                          </div>
                        </button>
                      )}
                      {onOpenExchange && (
                        <button
                          onClick={() => { onOpenExchange(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-cyan-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Network className="w-4 h-4 text-cyan-400" />
                            <span className="font-medium">VIXP Exchange Protocol</span>
                          </div>
                        </button>
                      )}
                      {onOpenSecurityArchitecture && (
                        <button
                          onClick={() => { onOpenSecurityArchitecture(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-rose-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-rose-400" />
                            <span className="font-medium">Enterprise Security Architecture</span>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category 3: Analytics & Knowledge Engines */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Analytics & Knowledge</span>
                    </div>
                    <div className="space-y-1">
                      {onOpenNarrativeEngine && (
                        <button
                          onClick={() => { onOpenNarrativeEngine(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-indigo-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Compass className="w-4 h-4 text-indigo-400" />
                            <span className="font-medium">Narrative Intelligence Engine</span>
                          </div>
                        </button>
                      )}
                      {onOpenKnowledgeLibrary && (
                        <button
                          onClick={() => { onOpenKnowledgeLibrary(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-cyan-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-cyan-400" />
                            <span className="font-medium">Veritas Knowledge Library</span>
                          </div>
                        </button>
                      )}
                      <button
                        onClick={() => { onOpenKnowledgeGraph(); setShowToolsMenu(false); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-indigo-300 transition"
                      >
                        <div className="flex items-center space-x-2">
                          <Network className="w-4 h-4 text-indigo-400" />
                          <span className="font-medium">AI Knowledge Graph</span>
                        </div>
                      </button>
                      {onOpenAfricaCenter && (
                        <button
                          onClick={() => { onOpenAfricaCenter(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-amber-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Compass className="w-4 h-4 text-amber-400" />
                            <span className="font-medium">Pan-African Trade & Risk Hub</span>
                          </div>
                        </button>
                      )}
                      {onOpenAnalystReview && (
                        <button
                          onClick={() => { onOpenAnalystReview(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-blue-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <UserCheck className="w-4 h-4 text-blue-400" />
                            <span className="font-medium">Senior Analyst HITL Review</span>
                          </div>
                        </button>
                      )}
                      {onOpenPromptFramework && (
                        <button
                          onClick={() => { onOpenPromptFramework(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-indigo-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Terminal className="w-4 h-4 text-indigo-400" />
                            <span className="font-medium">Prompt Engineering Framework</span>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category 4: Data Streams, Media & Trust */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                      <Radio className="w-3.5 h-3.5" />
                      <span>Data Streams & Media</span>
                    </div>
                    <div className="space-y-1">
                      {onOpenUniversalCollection && (
                        <button
                          onClick={() => { onOpenUniversalCollection(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-cyan-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Radio className="w-4 h-4 text-cyan-400" />
                            <span className="font-medium">Universal Collection Engine</span>
                          </div>
                        </button>
                      )}
                      {onOpenTransparencyCenter && (
                        <button
                          onClick={() => { onOpenTransparencyCenter(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-teal-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Info className="w-4 h-4 text-teal-400" />
                            <span className="font-medium">AI Trust & Transparency</span>
                          </div>
                        </button>
                      )}
                      {onOpenGlobalRiskIndex && (
                        <button
                          onClick={() => { onOpenGlobalRiskIndex(); setShowToolsMenu(false); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-rose-300 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-rose-400" />
                            <span className="font-medium">Global Risk Index</span>
                          </div>
                        </button>
                      )}
                      <button
                        onClick={() => { onOpenAgentNetwork(); setShowToolsMenu(false); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-purple-300 transition"
                      >
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-purple-400" />
                          <span className="font-medium">Specialized AI Agent Network</span>
                        </div>
                      </button>
                      <button
                        onClick={() => { onOpenNewsMap(); setShowToolsMenu(false); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-emerald-300 transition"
                      >
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-emerald-400" />
                          <span className="font-medium">Live Geospatial News Map</span>
                        </div>
                      </button>
                      <button
                        onClick={() => { onOpenAudioVideo(); setShowToolsMenu(false); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-purple-300 transition"
                      >
                        <div className="flex items-center space-x-2">
                          <Radio className="w-4 h-4 text-purple-400" />
                          <span className="font-medium">AI Audio Podcasts & Video</span>
                        </div>
                      </button>
                      <button
                        onClick={() => { onOpenDevApi(); setShowToolsMenu(false); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-teal-300 transition"
                      >
                        <div className="flex items-center space-x-2">
                          <Code className="w-4 h-4 text-teal-400" />
                          <span className="font-medium">Public News REST API Portal</span>
                        </div>
                      </button>
                      <button
                        onClick={() => { onOpenPublisherDirectory(); setShowToolsMenu(false); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-slate-100 transition"
                      >
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 text-blue-400" />
                          <span className="font-medium">Trusted Publisher Directory</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
