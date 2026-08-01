import React, { useState, useEffect } from 'react';
import { 
  Search, Sun, Moon, Radio, Tv, ShieldCheck, 
  Bookmark, Bell, User, BarChart2, Cpu, RefreshCw, Volume2, Settings,
  Globe, Network, Code, ShieldAlert, Sparkles, Bot, Compass, UserCheck, Building2, Info, Activity, Landmark, Terminal, BookOpen, Server, Layers, Lock
} from 'lucide-react';
import { SupportedLanguage, UserPreferences, WeatherData, StockTickerItem } from '../types';
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
  onOpenIntelligenceOps?: () => void;
  onOpenDigitalTwin?: () => void;
  onOpenOsCore?: () => void;
  onOpenTerminal?: () => void;
  onOpenExchange?: () => void;
  onOpenLanguageTranslator?: () => void;
  onOpenKnowledgeLibrary?: () => void;
  onOpenCommandCenter?: () => void;
  onOpenAutonomousNewsroom?: () => void;
  onOpenGeopoliticalSimulation?: () => void;
  onOpenSovereignCompute?: () => void;
  onOpenGlobalGovernance?: () => void;
  onOpenQuantumVerification?: () => void;
  onOpenAiSearch?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  weather: WeatherData | null;
  stocks: StockTickerItem[];
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
  onOpenIntelligenceOps,
  onOpenDigitalTwin,
  onOpenOsCore,
  onOpenTerminal,
  onOpenExchange,
  onOpenLanguageTranslator,
  onOpenKnowledgeLibrary,
  onOpenCommandCenter,
  onOpenAutonomousNewsroom,
  onOpenGeopoliticalSimulation,
  onOpenSovereignCompute,
  onOpenGlobalGovernance,
  onOpenQuantumVerification,
  onOpenAiSearch,
  searchQuery,
  onSearchChange,
  weather,
  stocks
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLiveAudioPlaying, setIsLiveAudioPlaying] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [scheduleStatus, setScheduleStatus] = useState<string>('Every 3h (Active)');

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
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search global news by topic, headline, publisher, or region..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-1.5">
          {/* WhatsApp Channel Direct Link */}
          <WhatsAppIntegration variant="button" location="header" className="hidden md:inline-flex" />

          {/* Veritas Knowledge Library */}
          {onOpenKnowledgeLibrary && (
            <button
              onClick={onOpenKnowledgeLibrary}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-bold text-xs"
              title="Veritas Evergreen Knowledge Library & Research Archive"
            >
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span className="hidden xl:inline">Knowledge Library</span>
            </button>
          )}
          {/* Pan-African Trade & Risk Hub */}
          {onOpenAfricaCenter && (
            <button
              onClick={onOpenAfricaCenter}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-600 dark:hover:text-amber-400 transition-colors hidden sm:block"
              title="Pan-African Intelligence & Trade Observatory"
            >
              <Compass className="w-4 h-4 text-amber-500" />
            </button>
          )}

          {/* Senior Analyst HITL Review */}
          {onOpenAnalystReview && (
            <button
              onClick={onOpenAnalystReview}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block"
              title="Human-in-the-Loop Analyst Audit Cockpit"
            >
              <UserCheck className="w-4 h-4 text-blue-500" />
            </button>
          )}

          {/* Enterprise Workspace */}
          {onOpenEnterpriseWorkspace && (
            <button
              onClick={onOpenEnterpriseWorkspace}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hidden md:block"
              title="Enterprise Workspaces & Licensing"
            >
              <Building2 className="w-4 h-4 text-emerald-500" />
            </button>
          )}

          {/* AI Trust & Transparency Center */}
          {onOpenTransparencyCenter && (
            <button
              onClick={onOpenTransparencyCenter}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-600 dark:hover:text-teal-400 transition-colors hidden md:block"
              title="AI Transparency & Public Trust Center"
            >
              <Info className="w-4 h-4 text-teal-500" />
            </button>
          )}

          {/* Global Risk Index & Supply Chain */}
          {onOpenGlobalRiskIndex && (
            <button
              onClick={onOpenGlobalRiskIndex}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors hidden md:block"
              title="Veritas Global Risk Index & Supply Chain Observatory"
            >
              <Activity className="w-4 h-4 text-rose-500" />
            </button>
          )}

          {/* Sovereign & Company Dossiers */}
          {onOpenCompanyGovProfiles && (
            <button
              onClick={onOpenCompanyGovProfiles}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden md:block"
              title="Enterprise & Sovereign State Dossiers"
            >
              <Landmark className="w-4 h-4 text-indigo-500" />
            </button>
          )}

          {/* Intelligence Operations Center */}
          {onOpenIntelligenceOps && (
            <button
              onClick={onOpenIntelligenceOps}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-600 dark:hover:text-amber-400 transition-colors hidden md:block"
              title="Veritas Intelligence Operations Center (Command Center & Decision Engine)"
            >
              <Compass className="w-4 h-4 text-amber-500" />
            </button>
          )}

          {/* Global Digital Twin & Simulation Suite */}
          {onOpenDigitalTwin && (
            <button
              onClick={onOpenDigitalTwin}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors hidden md:block"
              title="Real-Time Global Digital Twin & Advanced Shock Simulator"
            >
              <Globe className="w-4 h-4 text-cyan-500 animate-spin-slow" />
            </button>
          )}

          {/* Veritas OS Core & Trust Framework */}
          {onOpenOsCore && (
            <button
              onClick={onOpenOsCore}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hidden md:block"
              title="Veritas Intelligence Operating System (OS Core, Red Team, Trust Framework)"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </button>
          )}

          {/* Institutional Intelligence Terminal */}
          {onOpenTerminal && (
            <button
              onClick={onOpenTerminal}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden md:block"
              title="Veritas Institutional Intelligence Terminal & Global Trust Network"
            >
              <Terminal className="w-4 h-4 text-indigo-500 animate-pulse" />
            </button>
          )}

          {/* VIXP Intelligence Exchange Protocol */}
          {onOpenExchange && (
            <button
              onClick={onOpenExchange}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors hidden md:block"
              title="Veritas Intelligence Exchange Protocol (VIXP v12.0) & Dependency Graph 2.0"
            >
              <Network className="w-4 h-4 text-cyan-500 animate-pulse" />
            </button>
          )}

          {/* Emergency Crisis Radar */}
          <button
            onClick={onOpenCrisisMonitor}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            title="Live Emergency Crisis Radar"
          >
            <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
          </button>

          {/* Deep AI Research Workspace */}
          <button
            onClick={onOpenResearchWorkspace}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:block"
            title="AI Deep Research Workspace"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </button>

          {/* AI Agent Network */}
          <button
            onClick={onOpenAgentNetwork}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 dark:hover:text-purple-400 transition-colors hidden sm:block"
            title="Specialized AI News Agent Network"
          >
            <Bot className="w-4 h-4 text-purple-500" />
          </button>

          {/* Phase 7: Autonomous AI Newsroom */}
          {onOpenAutonomousNewsroom && (
            <button
              onClick={onOpenAutonomousNewsroom}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:block"
              title="Autonomous AI Newsroom Studio (Phase 7)"
            >
              <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
            </button>
          )}

          {/* Phase 8: Geopolitical Predictive Simulation & Crisis War-Room */}
          {onOpenGeopoliticalSimulation && (
            <button
              onClick={onOpenGeopoliticalSimulation}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors hidden sm:block"
              title="Geopolitical Simulation & Crisis War-Room (Phase 8)"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            </button>
          )}

          {/* Phase 9: Sovereign AI Compute Vault */}
          {onOpenSovereignCompute && (
            <button
              onClick={onOpenSovereignCompute}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors hidden sm:block"
              title="Sovereign AI Compute & Edge Telemetry Vault (Phase 9)"
            >
              <Server className="w-4 h-4 text-cyan-400 animate-pulse" />
            </button>
          )}

          {/* Phase 10: Master Governance & Command Vault */}
          {onOpenGlobalGovernance && (
            <button
              onClick={onOpenGlobalGovernance}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:block"
              title="Veritas Master Governance Vault (Phase 10 Orchestrated)"
            >
              <Layers className="w-4 h-4 text-indigo-400 animate-pulse" />
            </button>
          )}

          {/* Phase 11: Quantum Cryptographic Verification Vault */}
          {onOpenQuantumVerification && (
            <button
              onClick={onOpenQuantumVerification}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 dark:hover:text-purple-400 transition-colors hidden sm:block"
              title="Quantum-Resistant Cryptographic Verification Vault (Phase 11 Final Suite)"
            >
              <Lock className="w-4 h-4 text-purple-400 animate-pulse" />
            </button>
          )}

          {/* Live Geospatial Map */}
          <button
            onClick={onOpenNewsMap}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
            title="Live Geospatial News Map"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
          </button>

          {/* AI Knowledge Graph */}
          <button
            onClick={onOpenKnowledgeGraph}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
            title="AI Knowledge Graph & Entity Intelligence"
          >
            <Network className="w-4 h-4 text-indigo-500" />
          </button>

          {/* Audio & Video Podcast Hub */}
          <button
            onClick={onOpenAudioVideo}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
            title="AI Audio Podcasts & Video Intelligence"
          >
            <Radio className="w-4 h-4 text-purple-500" />
          </button>

          {/* Public API Dev Portal */}
          <button
            onClick={onOpenDevApi}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden md:block"
            title="Public News REST API Portal"
          >
            <Code className="w-4 h-4 text-teal-500" />
          </button>

          {/* AI Search Assistant Button */}
          {onOpenAiSearch && (
            <button
              onClick={onOpenAiSearch}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-bold rounded-lg transition-all cursor-pointer"
              title="Veritas AI Conversational Search Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden lg:inline">AI SEARCH</span>
            </button>
          )}

          {/* AI Command Center Button */}
          {onOpenCommandCenter && (
            <button
              onClick={onOpenCommandCenter}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
              title="Veritas AI Command Center Dashboard"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
              <span className="hidden md:inline">COMMAND CENTER</span>
            </button>
          )}

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span className="hidden md:inline">AI RESEARCH</span>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Bookmarks & Reading List"
          >
            <Bookmark className="w-4 h-4" />
            {preferences.bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {preferences.bookmarks.length}
              </span>
            )}
          </button>

          {/* Publisher Directory Button */}
          <button
            onClick={onOpenPublisherDirectory}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
            title="Trusted Publisher Directory"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Admin Dashboard / Console Panel Link */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-amber-400 hover:bg-slate-800 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700 border border-amber-500/30 transition-all cursor-pointer shadow-xs"
            title="System Admin & Crawler Control Console"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>
        </div>
      </div>
    </header>
  );
};
