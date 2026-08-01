import React from 'react';
import { Article } from '../types';
import { ShieldCheck, ExternalLink, Bookmark, Share2, Layers, Clock, Eye } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  isBookmarked: boolean;
  onOpenClusterComparison?: (article: Article) => void;
  variant?: 'featured' | 'standard' | 'compact';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  onToggleBookmark,
  isBookmarked,
  onOpenClusterComparison,
  variant = 'standard'
}) => {
  const getFactBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Verified':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Developing':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Conflicting Reports':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800';
    }
  };

  const getBiasBadgeColor = (bias: string) => {
    switch (bias) {
      case 'Left':
      case 'Center-Left':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300';
      case 'Right':
      case 'Center-Right':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  if (variant === 'compact') {
    return (
      <div 
        onClick={() => onSelectArticle(article)}
        className="group flex items-start gap-3 p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer shadow-xs hover:shadow-md"
      >
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-20 h-20 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{article.mainPublisher.name}</span>
            <span>•</span>
            <span>{article.readingTimeMinutes} min read</span>
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 mt-1.5 text-[10px]">
            <span className={`px-1.5 py-0.5 rounded font-bold border ${getFactBadgeColor(article.factCheckBadge)}`}>
              {article.factCheckBadge}
            </span>
            <span className="text-slate-400 font-mono">
              Score: <strong className="text-emerald-600 dark:text-emerald-400">{article.confidenceScore}/100</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-xs hover:shadow-xl flex flex-col h-full">
      {/* Article Image Container */}
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

        {/* Category & Region Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/90 text-white backdrop-blur-md border border-white/20">
            {article.category}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-600/90 text-white backdrop-blur-md">
            {article.region}
          </span>
        </div>

        {/* Bookmark Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(article.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isBookmarked
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>

        {/* Bottom Image Overlay Strip */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {article.mainPublisher.name}
            </span>
            <span className="text-white/60">({article.mainPublisher.trustScore}% Trust)</span>
          </div>
          {article.otherPublishersCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenClusterComparison) onOpenClusterComparison(article);
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white font-medium text-[11px] backdrop-blur-md transition-colors"
            >
              <Layers className="w-3 h-3" />
              +{article.otherPublishersCount} Sources
            </button>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div 
        onClick={() => onSelectArticle(article)}
        className="p-5 flex-1 flex flex-col justify-between cursor-pointer"
      >
        <div>
          {/* Metrics Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded font-semibold text-[11px] border ${getFactBadgeColor(article.factCheckBadge)}`}>
                {article.factCheckBadge}
              </span>
              <span className={`px-2 py-0.5 rounded font-medium text-[11px] ${getBiasBadgeColor(article.biasRating)}`}>
                Bias: {article.biasRating}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <span>Score: <strong className="text-emerald-600 dark:text-emerald-400">{article.confidenceScore}/100</strong></span>
            </div>
          </div>

          {/* Headline */}
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
            {article.title}
          </h3>

          {/* AI Medium Summary */}
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
            {article.summaryMedium}
          </p>
        </div>

        {/* Card Footer Info */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.views.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={article.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              title="Read directly on publisher site"
            >
              Original <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
