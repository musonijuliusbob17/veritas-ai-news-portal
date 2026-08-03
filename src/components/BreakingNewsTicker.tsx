import React, { useState, useEffect } from 'react';
import { Zap, ChevronRight, ChevronLeft, Volume2, VolumeX, X, Layers, ListFilter, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface BreakingNewsTickerProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  articles,
  onSelectArticle
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showAllDrawer, setShowAllDrawer] = useState(false);

  // Filter breaking articles
  const breakingArticles = React.useMemo(() => {
    return articles.filter(
      a => a.isBreaking || a.factCheckBadge === 'Breaking' || a.confidenceScore > 95
    );
  }, [articles]);

  // Auto rotate ticker items
  useEffect(() => {
    if (isPaused || breakingArticles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingArticles.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, breakingArticles.length]);

  if (dismissed || breakingArticles.length === 0) return null;

  const currentArticle = breakingArticles[currentIndex] || breakingArticles[0];

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // Audio fallback
    }
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) playChime();
  };

  return (
    <div className="relative z-30">
      {/* MAIN TICKER BAR */}
      <div 
        className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-medium shadow-md transition-colors"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex items-center space-x-3 overflow-hidden flex-1 min-w-0">
          {/* Live Breaking Badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="flex items-center gap-1.5 font-black uppercase tracking-wider bg-slate-950/40 px-2.5 py-1 rounded-lg text-xs shrink-0 border border-white/20 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              BREAKING
            </span>
            {breakingArticles.length > 1 && (
              <span className="bg-black/30 text-white font-mono text-[11px] px-2 py-0.5 rounded-full font-bold">
                {currentIndex + 1}/{breakingArticles.length}
              </span>
            )}
          </div>

          {/* Nav Controls */}
          {breakingArticles.length > 1 && (
            <div className="hidden sm:flex items-center space-x-1 shrink-0">
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + breakingArticles.length) % breakingArticles.length)}
                className="p-1 hover:bg-black/20 rounded transition text-white/90 hover:text-white"
                title="Previous Breaking Item"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % breakingArticles.length)}
                className="p-1 hover:bg-black/20 rounded transition text-white/90 hover:text-white"
                title="Next Breaking Item"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Active Article Content */}
          <button
            onClick={() => onSelectArticle(currentArticle)}
            className="truncate text-left font-bold hover:underline flex items-center gap-2 group cursor-pointer min-w-0"
          >
            <span className="truncate">{currentArticle.title}</span>
            <span className="text-white/80 font-normal hidden lg:inline shrink-0 text-xs">
              • {currentArticle.mainPublisher.name} ({currentArticle.otherPublishersCount}+ sources)
            </span>
            <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>

        {/* Right Utility Buttons */}
        <div className="flex items-center space-x-2 shrink-0 ml-3">
          {/* View All Breaking Drawer Trigger */}
          <button
            onClick={() => setShowAllDrawer(!showAllDrawer)}
            className="px-2 py-1 bg-black/30 hover:bg-black/50 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-white/20"
            title="View All Active Breaking News Dispatches"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span className="hidden md:inline">All ({breakingArticles.length})</span>
          </button>

          {/* Audio Alert Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg transition-colors ${
              soundEnabled ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-black/20 text-white/80 hover:text-white'
            }`}
            title={soundEnabled ? 'Breaking Audio Alerts Enabled' : 'Enable Breaking Audio Alerts'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Dismiss Ticker Button */}
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-white/80 hover:text-white rounded hover:bg-black/20 transition-colors"
            title="Dismiss Breaking Ticker"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* EXPANDABLE ALL BREAKING STORIES DRAWER */}
      {showAllDrawer && (
        <div className="absolute top-full left-0 right-0 z-50 bg-slate-950 border-b border-rose-900/60 p-4 shadow-2xl text-slate-100 max-h-96 overflow-y-auto font-sans">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-rose-500 fill-rose-500" />
                <h3 className="font-extrabold text-sm text-white">Active Breaking Dispatches ({breakingArticles.length})</h3>
              </div>
              <button
                onClick={() => setShowAllDrawer(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close Drawer
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {breakingArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    onSelectArticle(art);
                    setShowAllDrawer(false);
                  }}
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 rounded-xl transition cursor-pointer flex items-start gap-3"
                >
                  <img
                    src={art.featuredImage}
                    alt={art.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-rose-600/30 text-rose-300 font-bold text-[10px]">
                        {art.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{art.mainPublisher.name}</span>
                    </div>
                    <h4 className="font-bold text-white line-clamp-2 leading-snug">{art.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
