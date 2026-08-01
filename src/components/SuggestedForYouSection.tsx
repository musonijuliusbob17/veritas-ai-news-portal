import React, { useState } from 'react';
import { Article, UserPreferences, Category } from '../types';
import { ArticleCard } from './ArticleCard';
import { Sparkles, Sliders, Plus, Check, Bookmark, TrendingUp, RefreshCw, X, Tag } from 'lucide-react';

interface SuggestedForYouSectionProps {
  articles: Article[];
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  onOpenClusterComparison?: (article: Article) => void;
}

const POPULAR_TOPICS: Category[] = [
  'Artificial Intelligence',
  'Technology',
  'Business',
  'Finance',
  'Politics',
  'World',
  'Climate',
  'Cryptocurrency',
  'Health',
  'Science',
  'Sports',
  'Local'
];

interface ScoredArticle {
  article: Article;
  score: number;
  primaryReason: string;
}

export const SuggestedForYouSection: React.FC<SuggestedForYouSectionProps> = ({
  articles,
  preferences,
  onUpdatePreferences,
  onSelectArticle,
  onToggleBookmark,
  onOpenClusterComparison
}) => {
  const [showTopicPicker, setShowTopicPicker] = useState<boolean>(false);

  const followedTopics = preferences.followedTopics || [];
  const bookmarkedIds = preferences.bookmarks || [];
  const bookmarkedArticles = articles.filter(a => bookmarkedIds.includes(a.id));

  // Build recommendation profile from bookmarks
  const bookmarkedCategories = new Set(bookmarkedArticles.map(a => a.category));
  const bookmarkedTags = new Set(bookmarkedArticles.flatMap(a => a.tags));
  const bookmarkedPublishers = new Set(bookmarkedArticles.map(a => a.mainPublisher.id));

  // Compute recommendation scores for all articles
  const scoredArticles: ScoredArticle[] = articles.map(article => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Followed topic match
    if (followedTopics.includes(article.category)) {
      score += 5;
      reasons.push(`Topic: ${article.category}`);
    }

    // Check tags against followed topics
    for (const tag of article.tags) {
      if (followedTopics.some(ft => ft.toLowerCase() === tag.toLowerCase())) {
        score += 4;
        reasons.push(`Tag: ${tag}`);
      }
    }

    // 2. Bookmark similarity match
    if (bookmarkedCategories.has(article.category)) {
      score += 3;
      reasons.push(`Category match from bookmarks`);
    }

    let matchingTagsCount = 0;
    for (const tag of article.tags) {
      if (bookmarkedTags.has(tag)) {
        matchingTagsCount++;
      }
    }
    if (matchingTagsCount > 0) {
      score += matchingTagsCount * 1.5;
      reasons.push(`${matchingTagsCount} matching tag${matchingTagsCount > 1 ? 's' : ''}`);
    }

    if (bookmarkedPublishers.has(article.mainPublisher.id)) {
      score += 2;
      reasons.push(`Publisher: ${article.mainPublisher.name}`);
    }

    // Recency & Trust boost
    score += (article.confidenceScore / 100) * 2;
    score += article.views > 2000 ? 1 : 0;

    // Small demotion if already bookmarked so user sees fresh content (but keep visible if highly relevant)
    if (bookmarkedIds.includes(article.id)) {
      score -= 1;
    }

    const primaryReason = reasons.length > 0 ? reasons[0] : 'High Quality Verified Story';

    return {
      article,
      score,
      primaryReason
    };
  });

  // Sort by score descending
  scoredArticles.sort((a, b) => b.score - a.score);

  // Take top 6 suggested articles
  const topSuggested = scoredArticles.slice(0, 6);

  const handleToggleTopic = (topic: string) => {
    const isFollowed = followedTopics.includes(topic);
    const updatedTopics = isFollowed
      ? followedTopics.filter(t => t !== topic)
      : [...followedTopics, topic];
    
    onUpdatePreferences({ followedTopics: updatedTopics });
  };

  const hasPersonalization = followedTopics.length > 0 || bookmarkedIds.length > 0;

  return (
    <section className="max-w-7xl mx-auto px-4 my-8">
      {/* Outer Card Container */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        
        {/* Glowing Decorative Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/25">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="font-extrabold text-xl text-white tracking-wide flex items-center gap-2">
                SUGGESTED FOR YOU
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ALGORITHMIC FEED
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 pl-11">
              Custom curated stories matching your <strong className="text-slate-200">{followedTopics.length} followed topics</strong> and <strong className="text-slate-200">{bookmarkedIds.length} saved bookmarks</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 pl-11 md:pl-0">
            <button
              onClick={() => setShowTopicPicker(!showTopicPicker)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>{showTopicPicker ? 'Close Topics' : 'Tune Recommendation Topics'}</span>
            </button>
          </div>
        </div>

        {/* Topic Tuning Drawer */}
        {showTopicPicker && (
          <div className="mt-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2 font-mono">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                Select topics you're interested in to refine your algorithm:
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {followedTopics.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {POPULAR_TOPICS.map(topic => {
                const isSelected = followedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => handleToggleTopic(topic)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{topic}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Followed Topics Quick Pills (Always visible if followed) */}
        {followedTopics.length > 0 && !showTopicPicker && (
          <div className="pt-4 flex flex-wrap items-center gap-2 text-xs relative z-10">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              Active Interests:
            </span>
            {followedTopics.map(topic => (
              <span
                key={topic}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/80 text-indigo-200 border border-indigo-800/60 font-mono text-[11px]"
              >
                <span>{topic}</span>
                <button
                  onClick={() => handleToggleTopic(topic)}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove topic"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Onboarding Notice if user has no bookmarks and no topics */}
        {!hasPersonalization && (
          <div className="mt-4 p-4 bg-indigo-950/40 border border-indigo-800/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-200 relative z-10">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="font-bold text-white block">Showing Popular Verified Stories</strong>
                <span className="text-[11px] text-indigo-300">
                  Follow topics above or bookmark stories to build your personalized news profile.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Artificial Intelligence', 'Technology', 'Climate'].map(top => (
                <button
                  key={top}
                  onClick={() => handleToggleTopic(top)}
                  className="px-2.5 py-1 bg-indigo-900/80 hover:bg-indigo-800 text-white font-bold text-[11px] rounded-lg border border-indigo-700/60 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-amber-300" />
                  <span>{top}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 relative z-10">
          {topSuggested.map(({ article, primaryReason, score }) => (
            <div key={article.id} className="relative group">
              {/* Reason Badge overlay */}
              <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{primaryReason}</span>
              </div>

              <ArticleCard
                article={article}
                onSelectArticle={onSelectArticle}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={bookmarkedIds.includes(article.id)}
                onOpenClusterComparison={onOpenClusterComparison}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
