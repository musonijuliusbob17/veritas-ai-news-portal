import React, { useState } from 'react';
import { Zap, ChevronRight, AlertCircle, X } from 'lucide-react';
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
  const breakingArticles = articles.filter(a => a.isBreaking || a.factCheckBadge === 'Breaking' || a.confidenceScore > 96);

  if (dismissed || breakingArticles.length === 0) return null;

  const primaryBreaking = breakingArticles[0];

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-medium shadow-sm relative">
      <div className="flex items-center space-x-3 overflow-hidden">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider bg-black/20 px-2.5 py-1 rounded text-xs shrink-0 border border-white/20 animate-pulse">
          <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          BREAKING UPDATE
        </span>
        <button
          onClick={() => onSelectArticle(primaryBreaking)}
          className="truncate text-left font-semibold hover:underline flex items-center gap-2 group cursor-pointer"
        >
          <span className="truncate">{primaryBreaking.title}</span>
          <span className="text-white/80 font-normal hidden md:inline shrink-0">
            • Reported by {primaryBreaking.mainPublisher.name} ({primaryBreaking.otherPublishersCount}+ sources)
          </span>
          <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 text-white/80 hover:text-white rounded hover:bg-black/20 transition-colors ml-2 shrink-0"
        title="Dismiss Ticker"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
