import React from 'react';
import { Article } from '../types';
import { ShieldCheck, Sparkles, Layers, ArrowRight, Bookmark, Zap } from 'lucide-react';

interface HeroSectionProps {
  leadArticle: Article;
  topStories: Article[];
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  bookmarkedIds: string[];
  onOpenClusterComparison: (article: Article) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  leadArticle,
  topStories,
  onSelectArticle,
  onToggleBookmark,
  bookmarkedIds,
  onOpenClusterComparison
}) => {
  if (!leadArticle) return null;

  const isLeadBookmarked = bookmarkedIds.includes(leadArticle.id);

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Lead Story (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <div 
            onClick={() => onSelectArticle(leadArticle)}
            className="group relative bg-slate-900 rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-slate-800 flex-1 flex flex-col justify-end min-h-[420px] lg:min-h-[500px]"
          >
            {/* Featured Image */}
            <img
              src={leadArticle.featuredImage}
              alt={leadArticle.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-md flex items-center gap-1 uppercase tracking-wider animate-pulse">
                  <Zap className="w-3.5 h-3.5" /> TOP STORY
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/20">
                  {leadArticle.category}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(leadArticle.id);
                }}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isLeadBookmarked ? 'bg-blue-600 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Lead Content Box */}
            <div className="relative z-10 p-6 sm:p-8 space-y-3">
              {/* Publisher & Confidence Badge */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="font-bold text-white flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {leadArticle.mainPublisher.name}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
                  Veritas Score: {leadArticle.confidenceScore}/100 ({leadArticle.factCheckBadge})
                </span>
                <span>•</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenClusterComparison(leadArticle);
                  }}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-600/80 hover:bg-blue-600 text-white font-medium text-xs backdrop-blur-md transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Reported by {leadArticle.mainPublisher.name} & {leadArticle.otherPublishersCount} others
                </button>
              </div>

              {/* Title */}
              <h1 className="font-extrabold text-2xl sm:text-4xl text-white leading-tight group-hover:text-blue-300 transition-colors">
                {leadArticle.title}
              </h1>

              {/* Summary */}
              <p className="text-slate-200 text-sm sm:text-base line-clamp-3 leading-relaxed max-w-3xl">
                {leadArticle.summaryMedium}
              </p>

              {/* Read Action */}
              <div className="pt-2 flex items-center gap-2 text-blue-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                <span>Explore Full AI Verification & Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stories Sidebar (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              EDITOR'S PICKS
            </h2>
            <span className="text-xs text-slate-500 font-medium">Verified Feeds</span>
          </div>

          <div className="space-y-3 flex-1">
            {topStories.slice(0, 3).map(story => (
              <div
                key={story.id}
                onClick={() => onSelectArticle(story)}
                className="group p-3.5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 transition-all cursor-pointer shadow-xs hover:shadow-md flex items-start gap-3"
              >
                <img
                  src={story.featuredImage}
                  alt={story.title}
                  className="w-24 h-24 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{story.category}</span>
                    <span>•</span>
                    <span>{story.mainPublisher.name}</span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {story.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Score: {story.confidenceScore}/100
                    </span>
                    <span>{story.readingTimeMinutes} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
