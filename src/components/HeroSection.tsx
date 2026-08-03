import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../types';
import { 
  ShieldCheck, Sparkles, Layers, ArrowRight, Bookmark, Zap, 
  ChevronLeft, ChevronRight, Play, Pause, Flame, Award, Clock
} from 'lucide-react';

interface HeroSectionProps {
  leadArticle: Article;
  topStories: Article[];
  allArticles?: Article[];
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  bookmarkedIds: string[];
  onOpenClusterComparison: (article: Article) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  leadArticle,
  topStories,
  allArticles = [],
  onSelectArticle,
  onToggleBookmark,
  bookmarkedIds,
  onOpenClusterComparison
}) => {
  // Collect top featured slides (up to 5 top articles)
  const heroSlides = React.useMemo(() => {
    const list = [leadArticle, ...topStories, ...allArticles.filter(a => a.isBreaking || a.confidenceScore > 94)];
    const unique = Array.from(new Set(list.map(a => a?.id)))
      .map(id => list.find(a => a?.id === id))
      .filter((a): a is Article => Boolean(a));
    return unique.slice(0, 5);
  }, [leadArticle, topStories, allArticles]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'editor' | 'trending' | 'trust'>('editor');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = heroSlides[currentIndex] || leadArticle;

  // Auto slide timer
  useEffect(() => {
    if (isPlaying && heroSlides.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
      }, 6000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, heroSlides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  };

  // Sidebar articles filtering
  const sidebarArticles = React.useMemo(() => {
    const combined = allArticles.length > 0 ? allArticles : topStories;
    if (sidebarTab === 'trending') {
      return [...combined].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);
    }
    if (sidebarTab === 'trust') {
      return [...combined].sort((a, b) => b.confidenceScore - a.confidenceScore).slice(0, 4);
    }
    return topStories.slice(0, 4);
  }, [allArticles, topStories, sidebarTab]);

  if (!currentSlide) return null;

  const isCurrentBookmarked = bookmarkedIds.includes(currentSlide.id);

  return (
    <section className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SLIDING NEWS HERO CAROUSEL (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <div 
            className="group relative bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex-1 flex flex-col justify-end min-h-[460px] sm:min-h-[520px]"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            {/* Slide Image with Overlay */}
            <img
              src={currentSlide.featuredImage}
              alt={currentSlide.title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-65 group-hover:scale-105 group-hover:opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />

            {/* TOP BAR OVERLAY CONTROLS */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg flex items-center gap-1 uppercase tracking-wider animate-pulse">
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  SLIDING HERO • {String(currentIndex + 1).padStart(2, '0')}/{String(heroSlides.length).padStart(2, '0')}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-cyan-300 backdrop-blur-md border border-cyan-500/30">
                  {currentSlide.category}
                </span>
                {currentSlide.region && (
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 backdrop-blur-md border border-white/20">
                    🌍 {currentSlide.region}
                  </span>
                )}
              </div>

              {/* Bookmark & Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-slate-900/80 text-slate-200 hover:text-white backdrop-blur-md border border-slate-700/80 transition"
                  title={isPlaying ? 'Pause Auto-Slide' : 'Play Auto-Slide'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(currentSlide.id);
                  }}
                  className={`p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                    isCurrentBookmarked 
                      ? 'bg-blue-600 text-white border-blue-400' 
                      : 'bg-slate-900/80 text-slate-200 border-slate-700/80 hover:bg-slate-800'
                  }`}
                  title="Save to Bookmarks"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>

            {/* PREV / NEXT NAVIGATION ARROWS */}
            {heroSlides.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white border border-slate-700/80 opacity-80 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
                  title="Previous Lead Story"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white border border-slate-700/80 opacity-80 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
                  title="Next Lead Story"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* MAIN CONTENT AREA */}
            <div 
              onClick={() => onSelectArticle(currentSlide)}
              className="relative z-10 p-6 sm:p-8 space-y-3 cursor-pointer"
            >
              {/* Publisher, Trust & Source Cluster Info */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
                <span className="font-bold text-white flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {currentSlide.mainPublisher.name}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/90 px-2.5 py-1 rounded-lg border border-emerald-800/80">
                  Trust Score: {currentSlide.confidenceScore}/100 ({currentSlide.factCheckBadge})
                </span>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenClusterComparison(currentSlide);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white font-medium text-xs backdrop-blur-md transition-all border border-blue-400/40"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Verified across {currentSlide.otherPublishersCount + 1} sources</span>
                </button>
              </div>

              {/* Title */}
              <h1 className="font-extrabold text-2xl sm:text-4xl text-white leading-tight group-hover:text-blue-300 transition-colors drop-shadow-md">
                {currentSlide.title}
              </h1>

              {/* Summary */}
              <p className="text-slate-200 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-3xl drop-shadow-xs">
                {currentSlide.summaryMedium}
              </p>

              {/* Read Action Bar & Slide Dots */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                  <span>Explore AI Fact Verification & Timeline</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Slide Indicators Dots */}
                {heroSlides.length > 1 && (
                  <div className="flex items-center space-x-1.5 z-20">
                    {heroSlides.map((slide, idx) => (
                      <button
                        key={slide.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(idx);
                        }}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === currentIndex
                            ? 'w-7 bg-blue-500'
                            : 'w-2 bg-slate-600 hover:bg-slate-400'
                        }`}
                        title={`Slide ${idx + 1}: ${slide.title.slice(0, 30)}...`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar for Auto Slide */}
            {isPlaying && (
              <div className="w-full bg-slate-800/80 h-1 relative overflow-hidden z-20">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-slide-progress" key={currentIndex} />
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR WITH MULTI-TAB TOP STORIES (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          {/* Header Tabs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs">
            <div className="grid grid-cols-3 gap-1 text-xs font-bold">
              <button
                onClick={() => setSidebarTab('editor')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  sidebarTab === 'editor'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Editor's</span>
              </button>
              <button
                onClick={() => setSidebarTab('trending')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  sidebarTab === 'trending'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Trending</span>
              </button>
              <button
                onClick={() => setSidebarTab('trust')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  sidebarTab === 'trust'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Top Trust</span>
              </button>
            </div>
          </div>

          {/* Sidebar Stories List */}
          <div className="space-y-3 flex-1">
            {sidebarArticles.map((story, idx) => (
              <div
                key={story.id}
                onClick={() => onSelectArticle(story)}
                className="group p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/70 transition-all cursor-pointer shadow-xs hover:shadow-md flex items-start gap-3 relative overflow-hidden"
              >
                <div className="relative shrink-0">
                  <img
                    src={story.featuredImage}
                    alt={story.title}
                    className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-1 left-1 bg-slate-950/80 text-white font-mono text-[10px] font-black px-1.5 py-0.5 rounded backdrop-blur-xs">
                    #{idx + 1}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-blue-600 dark:text-blue-400 truncate max-w-[90px]">
                      {story.category}
                    </span>
                    <span>•</span>
                    <span className="truncate">{story.mainPublisher.name}</span>
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {story.title}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {story.confidenceScore}/100
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {story.readingTimeMinutes}m
                    </span>
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
