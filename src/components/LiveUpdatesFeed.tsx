import React, { useState } from 'react';
import { Radio, RefreshCw, Zap, Clock, ShieldCheck, Filter, Search, ChevronRight, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { Article } from '../types';

interface LiveUpdatesFeedProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export interface LiveDispatchItem {
  id: string;
  time: string;
  timestampMs: number;
  type: 'breaking' | 'economy' | 'diplomacy' | 'tech' | 'security';
  title: string;
  summary: string;
  publisher: string;
  confidenceScore: number;
  articleId?: string;
  sourceCount: number;
  keyPoints?: string[];
}

export const LiveUpdatesFeed: React.FC<LiveUpdatesFeedProps> = ({
  articles,
  onSelectArticle
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Convert articles to live dispatches feed items
  const dispatches: LiveDispatchItem[] = React.useMemo(() => {
    const list: LiveDispatchItem[] = [];

    // Derive dispatches from existing timeline events & breaking articles
    articles.forEach((art, artIdx) => {
      if (art.timeline && art.timeline.length > 0) {
        art.timeline.forEach((item, tIdx) => {
          let itemType: LiveDispatchItem['type'] = 'diplomacy';
          if (art.category === 'Technology' || art.category === 'Artificial Intelligence') itemType = 'tech';
          else if (art.category === 'Business' || art.category === 'Finance') itemType = 'economy';
          else if (art.isBreaking) itemType = 'breaking';
          else if (art.category === 'Politics' || art.category === 'World') itemType = 'security';

          list.push({
            id: `disp-${art.id}-${tIdx}`,
            time: item.timestamp || `${19 - (tIdx % 5)}:${30 + (tIdx * 7) % 30} UTC`,
            timestampMs: Date.now() - (tIdx * 1800000 + artIdx * 3600000),
            type: itemType,
            title: item.title || art.title,
            summary: item.description || art.summaryShort,
            publisher: item.source || art.mainPublisher.name,
            confidenceScore: art.confidenceScore,
            articleId: art.id,
            sourceCount: art.otherPublishersCount + 1,
            keyPoints: [art.summaryShort, `Cross-verified by ${art.mainPublisher.name}`]
          });
        });
      } else {
        // Fallback dispatch item from article
        let itemType: LiveDispatchItem['type'] = 'diplomacy';
        if (art.category === 'Technology' || art.category === 'Artificial Intelligence') itemType = 'tech';
        else if (art.category === 'Business' || art.category === 'Finance') itemType = 'economy';
        else if (art.isBreaking) itemType = 'breaking';

        list.push({
          id: `disp-${art.id}-main`,
          time: art.publishedAt || 'Recent Dispatch',
          timestampMs: Date.now() - artIdx * 2400000,
          type: itemType,
          title: art.title,
          summary: art.summaryMedium,
          publisher: art.mainPublisher.name,
          confidenceScore: art.confidenceScore,
          articleId: art.id,
          sourceCount: art.otherPublishersCount + 1,
          keyPoints: [art.summaryShort]
        });
      }
    });

    return list.sort((a, b) => b.timestampMs - a.timestampMs);
  }, [articles]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 800);
  };

  const filteredDispatches = dispatches.filter(d => {
    const matchesType = selectedType === 'all' || d.type === selectedType;
    const matchesSearch = !searchTerm || 
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.publisher.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeBadge = (type: LiveDispatchItem['type']) => {
    switch (type) {
      case 'breaking':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white uppercase animate-pulse">🔴 Breaking</span>;
      case 'economy':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">⚡ Markets</span>;
      case 'tech':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">🔬 Tech</span>;
      case 'security':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">🛡️ Security</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">🌍 Global</span>;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 my-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* HEADER BAR */}
        <div className="p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-xl text-white shadow-md">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white font-sans">LIVE DISPATCH STREAM</h2>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs text-slate-400">Minute-by-minute autonomous intelligence updates & verified events</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Sync status: <span className="text-emerald-400 font-bold">{lastSyncTime}</span>
            </span>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Fetch New Dispatches'}</span>
            </button>
          </div>
        </div>

        {/* CONTROLS & FILTERS ROW */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Type Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'All Dispatches' },
              { id: 'breaking', label: '🔴 Breaking' },
              { id: 'economy', label: '⚡ Markets' },
              { id: 'diplomacy', label: '🌍 Geopolitics' },
              { id: 'tech', label: '🔬 Tech & AI' },
              { id: 'security', label: '🛡️ Security' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedType === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Stream Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search live stream..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* TIMELINE STREAM LIST */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[500px] overflow-y-auto font-sans">
          {filteredDispatches.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No live dispatches match your filter criteria.
            </div>
          ) : (
            filteredDispatches.map((item) => {
              const matchedArticle = articles.find(a => a.id === item.articleId);
              return (
                <div 
                  key={item.id}
                  className="group relative pl-6 sm:pl-8 pb-4 border-l-2 border-slate-200 dark:border-slate-800 last:border-l-transparent last:pb-0 transition"
                >
                  {/* Timeline Pulse Marker */}
                  <span className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-400 group-hover:scale-125 transition-transform flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                  </span>

                  {/* Dispatch Content Box */}
                  <div className="bg-slate-50 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 transition shadow-xs hover:shadow-md space-y-2">
                    
                    {/* Time & Badges Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.time}
                        </span>
                        {getTypeBadge(item.type)}
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.publisher}</span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          {item.confidenceScore}% Trust
                        </span>
                      </div>
                    </div>

                    {/* Dispatch Title */}
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>

                    {/* Dispatch Summary */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.summary}
                    </p>

                    {/* Action Button */}
                    {matchedArticle && (
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Verified by {item.sourceCount} sources
                        </span>
                        <button
                          onClick={() => onSelectArticle(matchedArticle)}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Read Full Story & Multi-Source Analysis</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};
