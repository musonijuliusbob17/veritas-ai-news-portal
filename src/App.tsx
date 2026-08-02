import React, { useState, useEffect } from 'react';
import { Article, Category, Region, SupportedLanguage, UserPreferences, WeatherData, StockTickerItem } from './types';
import { INITIAL_ARTICLES, INITIAL_STOCKS, INITIAL_WEATHER } from './data/mockNewsData';

import { Header } from './components/Header';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { CategoryNavigation } from './components/CategoryNavigation';
import { HeroSection } from './components/HeroSection';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { ClusterComparisonModal } from './components/ClusterComparisonModal';
import { PublisherDirectory } from './components/PublisherDirectory';
import { LiveFinancialHub } from './components/LiveFinancialHub';
import { AiResearchAssistant } from './components/AiResearchAssistant';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { LiveNewsMapModal } from './components/LiveNewsMapModal';
import { KnowledgeGraphModal } from './components/KnowledgeGraphModal';
import { AudioVideoIntelligenceModal } from './components/AudioVideoIntelligenceModal';
import { NewsApiDevModal } from './components/NewsApiDevModal';
import { StoryEvolutionModal } from './components/StoryEvolutionModal';
import { CrisisMonitoringModal } from './components/CrisisMonitoringModal';
import { AiResearchWorkspaceModal } from './components/AiResearchWorkspaceModal';
import { AiAgentNetworkModal } from './components/AiAgentNetworkModal';
import { AfricaIntelligenceCenterModal } from './components/AfricaIntelligenceCenterModal';
import { AnalystReviewEnvironmentModal } from './components/AnalystReviewEnvironmentModal';
import { EnterpriseWorkspaceModal } from './components/EnterpriseWorkspaceModal';
import { AiTransparencyCenterModal } from './components/AiTransparencyCenterModal';
import { GlobalRiskIndexModal } from './components/GlobalRiskIndexModal';
import { CompanyGovProfilesModal } from './components/CompanyGovProfilesModal';
import { DeveloperApiMarketplaceModal } from './components/DeveloperApiMarketplaceModal';
import { IntelligenceOperationsCenterModal } from './components/IntelligenceOperationsCenterModal';
import { GlobalDigitalTwinModal } from './components/GlobalDigitalTwinModal';
import { IntelligenceOperatingSystemModal } from './components/IntelligenceOperatingSystemModal';
import { IntelligenceTerminalModal } from './components/IntelligenceTerminalModal';
import { IntelligenceExchangeModal } from './components/IntelligenceExchangeModal';
import { LanguageTranslatorModal } from './components/LanguageTranslatorModal';
import { VeritasKnowledgeLibraryModal } from './components/VeritasKnowledgeLibraryModal';
import { VeritasIntelligenceCommandCenterModal } from './components/VeritasIntelligenceCommandCenterModal';
import { AiSearchAssistantModal } from './components/AiSearchAssistantModal';
import { SuggestedForYouSection } from './components/SuggestedForYouSection';
import { WhatsAppIntegration } from './components/WhatsAppIntegration';
import { AudienceIntelligenceService } from './services/AudienceIntelligenceService';
import { ArticleLifecycleManager } from './services/newsLifecycleService';
import { Footer } from './components/Footer';

import { ShieldCheck, Sparkles, Filter, Bookmark, X, RefreshCw } from 'lucide-react';

export default function App() {
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [weather, setWeather] = useState<WeatherData | null>(INITIAL_WEATHER);
  const [stocks, setStocks] = useState<StockTickerItem[]>(INITIAL_STOCKS);

  // User Preferences & State
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('veritas_prefs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      bookmarks: [],
      history: [],
      followedTopics: [],
      followedPublishers: [],
      preferredLanguage: 'English',
      regionFilter: 'Global',
      darkMode: true,
      autoplayAudio: false,
      breakingNewsAlerts: true
    };
  });

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedRegion, setSelectedRegion] = useState<Region>('Global');
  const [selectedSort, setSelectedSort] = useState<'latest' | 'trending' | 'confidence'>('latest');
  const [selectedPublisher, setSelectedPublisher] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Overlays
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [clusterComparisonArticle, setClusterComparisonArticle] = useState<Article | null>(null);
  const [storyEvolutionArticle, setStoryEvolutionArticle] = useState<Article | null>(null);
  const [showAiAssistant, setShowAiAssistant] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showPublisherDirectory, setShowPublisherDirectory] = useState<boolean>(false);
  const [showFinancialHub, setShowFinancialHub] = useState<boolean>(false);
  const [showBookmarksDrawer, setShowBookmarksDrawer] = useState<boolean>(false);
  const [showNewsMap, setShowNewsMap] = useState<boolean>(false);
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState<boolean>(false);
  const [showAudioVideo, setShowAudioVideo] = useState<boolean>(false);
  const [showDevApi, setShowDevApi] = useState<boolean>(false);
  const [showCrisisMonitor, setShowCrisisMonitor] = useState<boolean>(false);
  const [showResearchWorkspace, setShowResearchWorkspace] = useState<boolean>(false);
  const [showAgentNetwork, setShowAgentNetwork] = useState<boolean>(false);
  const [showAfricaCenter, setShowAfricaCenter] = useState<boolean>(false);
  const [showAnalystReview, setShowAnalystReview] = useState<boolean>(false);
  const [showEnterpriseWorkspace, setShowEnterpriseWorkspace] = useState<boolean>(false);
  const [showTransparencyCenter, setShowTransparencyCenter] = useState<boolean>(false);
  const [showGlobalRiskIndex, setShowGlobalRiskIndex] = useState<boolean>(false);
  const [showCompanyGovProfiles, setShowCompanyGovProfiles] = useState<boolean>(false);
  const [showIntelligenceOps, setShowIntelligenceOps] = useState<boolean>(false);
  const [showDigitalTwin, setShowDigitalTwin] = useState<boolean>(false);
  const [showOsCore, setShowOsCore] = useState<boolean>(false);
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [showExchange, setShowExchange] = useState<boolean>(false);
  const [showLanguageTranslator, setShowLanguageTranslator] = useState<boolean>(false);
  const [showKnowledgeLibrary, setShowKnowledgeLibrary] = useState<boolean>(false);
  const [showCommandCenter, setShowCommandCenter] = useState<boolean>(false);
  const [showAiSearch, setShowAiSearch] = useState<boolean>(false);

  // Sync Dark Mode class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('veritas_prefs', JSON.stringify(preferences));
  }, [preferences]);

  // Fetch news articles from backend endpoint if available & poll for 3-hour autonomous posts
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
        if (selectedRegion && selectedRegion !== 'Global') params.append('region', selectedRegion);
        if (selectedPublisher) params.append('publisher', selectedPublisher);
        if (searchQuery) params.append('query', searchQuery);
        if (selectedSort) params.append('sort', selectedSort);

        const res = await fetch(`/api/news?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.articles && data.articles.length > 0) {
            setArticles(data.articles);
          }
        }
      } catch (err) {
        console.warn('Backend news fetch warning, falling back to local state:', err);
      }
    };
    fetchNews();

    // Auto-poll every 30 seconds to catch 3-hour autonomous background updates
    const pollInterval = setInterval(fetchNews, 30000);
    return () => clearInterval(pollInterval);
  }, [selectedCategory, selectedRegion, selectedPublisher, searchQuery, selectedSort]);

  // Track session start and search queries for Audience Intelligence
  useEffect(() => {
    AudienceIntelligenceService.trackSessionStart();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      AudienceIntelligenceService.trackSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  // Automated Article Lifecycle Manager: evaluates publishedAt age and transitions articles between 'fresh', 'category_only', and 'archived', preserving 'evergreen' content
  useEffect(() => {
    const stopCronJob = ArticleLifecycleManager.startAutomatedCronJob(
      () => articles,
      (updatedArticles, report) => {
        setArticles(updatedArticles);
        if (report.transitionedArticles.length > 0) {
          console.log(`[ArticleLifecycleManager] Evaluated ${report.evaluatedCount} articles. ${report.transitionedArticles.length} status transitions applied. Fresh: ${report.freshCount}, Category: ${report.categoryOnlyCount}, Archived: ${report.archivedCount}, Evergreen: ${report.evergreenCount}`);
        }
      },
      3600000 // Run every hour
    );
    return () => stopCronJob();
  }, []);

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updated }));
  };

  const handleToggleBookmark = (id: string) => {
    const isBookmarked = preferences.bookmarks.includes(id);
    const updated = isBookmarked
      ? preferences.bookmarks.filter(b => b !== id)
      : [...preferences.bookmarks, id];
    handleUpdatePreferences({ bookmarks: updated });
  };

  const handleResetPersonalization = () => {
    handleUpdatePreferences({
      bookmarks: [],
      history: [],
      followedTopics: [],
      followedPublishers: [],
      regionFilter: 'Global',
      preferredLanguage: 'English'
    });
    setSelectedCategory('All');
    setSelectedRegion('Global');
    setSelectedPublisher(null);
    setSearchQuery('');
  };

  // Filter local array based on user selections
  let displayedArticles = [...articles];

  if (selectedCategory !== 'All' && selectedCategory !== 'Top Stories') {
    displayedArticles = displayedArticles.filter(a => a.category === selectedCategory);
  }
  if (selectedRegion !== 'Global') {
    displayedArticles = displayedArticles.filter(a => a.region === selectedRegion);
  }
  if (selectedPublisher) {
    displayedArticles = displayedArticles.filter(a => a.mainPublisher.id === selectedPublisher);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedArticles = displayedArticles.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.summaryMedium.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.mainPublisher.name.toLowerCase().includes(q)
    );
  }

  // Sort
  if (selectedSort === 'trending') {
    displayedArticles.sort((a, b) => b.views - a.views);
  } else if (selectedSort === 'confidence') {
    displayedArticles.sort((a, b) => b.confidenceScore - a.confidenceScore);
  } else {
    displayedArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  const leadArticle = displayedArticles[0];
  const secondaryArticles = displayedArticles.slice(1);
  const bookmarkedArticles = articles.filter(a => preferences.bookmarks.includes(a.id));

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-blue-500 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        onOpenAiAssistant={() => setShowAiAssistant(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenBookmarks={() => setShowBookmarksDrawer(true)}
        onOpenFinancialHub={() => setShowFinancialHub(true)}
        onOpenPublisherDirectory={() => setShowPublisherDirectory(true)}
        onOpenNewsMap={() => setShowNewsMap(true)}
        onOpenKnowledgeGraph={() => setShowKnowledgeGraph(true)}
        onOpenAudioVideo={() => setShowAudioVideo(true)}
        onOpenDevApi={() => setShowDevApi(true)}
        onOpenCrisisMonitor={() => setShowCrisisMonitor(true)}
        onOpenResearchWorkspace={() => setShowResearchWorkspace(true)}
        onOpenAgentNetwork={() => setShowAgentNetwork(true)}
        onOpenAfricaCenter={() => setShowAfricaCenter(true)}
        onOpenAnalystReview={() => setShowAnalystReview(true)}
        onOpenEnterpriseWorkspace={() => setShowEnterpriseWorkspace(true)}
        onOpenTransparencyCenter={() => setShowTransparencyCenter(true)}
        onOpenGlobalRiskIndex={() => setShowGlobalRiskIndex(true)}
        onOpenCompanyGovProfiles={() => setShowCompanyGovProfiles(true)}
        onOpenIntelligenceOps={() => setShowIntelligenceOps(true)}
        onOpenDigitalTwin={() => setShowDigitalTwin(true)}
        onOpenOsCore={() => setShowOsCore(true)}
        onOpenTerminal={() => setShowTerminal(true)}
        onOpenExchange={() => setShowExchange(true)}
        onOpenLanguageTranslator={() => setShowLanguageTranslator(true)}
        onOpenKnowledgeLibrary={() => setShowKnowledgeLibrary(true)}
        onOpenCommandCenter={() => setShowCommandCenter(true)}
        onOpenAiSearch={() => setShowAiSearch(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        weather={weather}
        stocks={stocks}
      />

      {/* Breaking Ticker Bar */}
      <BreakingNewsTicker
        articles={articles}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

      {/* Category & Region Navigation Bar */}
      <CategoryNavigation
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
      />

      {/* Main Content Area */}
      <main className="space-y-8 pb-12">
        {/* Active Filters Bar if any active */}
        {(selectedPublisher || searchQuery || selectedCategory !== 'All' || selectedRegion !== 'Global') && (
          <div className="max-w-7xl mx-auto px-4 pt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Active Filters:
              </span>
              {selectedCategory !== 'All' && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedRegion !== 'Global' && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                  Region: {selectedRegion}
                </span>
              )}
              {selectedPublisher && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                  Publisher: {selectedPublisher}
                </span>
              )}
              {searchQuery && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  Query: "{searchQuery}"
                </span>
              )}
            </div>

            <button
              onClick={handleResetPersonalization}
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset Personalization Filters
            </button>
          </div>
        )}

        {/* Hero Top Story Section (Only when no search query active) */}
        {!searchQuery && leadArticle && (
          <HeroSection
            leadArticle={leadArticle}
            topStories={secondaryArticles}
            onSelectArticle={(art) => setSelectedArticle(art)}
            onToggleBookmark={handleToggleBookmark}
            bookmarkedIds={preferences.bookmarks}
            onOpenClusterComparison={(art) => setClusterComparisonArticle(art)}
          />
        )}

        {/* Suggested For You Recommendation Engine (Only when no search query active or when filtering) */}
        {!searchQuery && (
          <SuggestedForYouSection
            articles={articles}
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onSelectArticle={(art) => setSelectedArticle(art)}
            onToggleBookmark={handleToggleBookmark}
            onOpenClusterComparison={(art) => setClusterComparisonArticle(art)}
          />
        )}

        {/* Mid-Feed WhatsApp Channel Engagement Banner */}
        <section className="max-w-7xl mx-auto px-4 my-8">
          <WhatsAppIntegration variant="banner" location="homepage_banner" language={preferences.preferredLanguage} article={articles[0]} />
        </section>

        {/* Article Grid Section */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {selectedCategory === 'All' ? 'LATEST GLOBAL VERIFIED DISPATCHES' : `${selectedCategory.toUpperCase()} NEWS`}
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Showing {displayedArticles.length} Stories
            </span>
          </div>

          {displayedArticles.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-slate-500 text-sm">No stories match your search criteria or filters.</p>
              <button
                onClick={handleResetPersonalization}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onSelectArticle={(art) => setSelectedArticle(art)}
                  onToggleBookmark={handleToggleBookmark}
                  isBookmarked={preferences.bookmarks.includes(article.id)}
                  onOpenClusterComparison={(art) => setClusterComparisonArticle(art)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Bookmarks Drawer Overlay */}
      {showBookmarksDrawer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full p-6 space-y-4 overflow-y-auto border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                <Bookmark className="w-5 h-5 text-blue-600" />
                SAVED BOOKMARKS ({bookmarkedArticles.length})
              </h3>
              <button onClick={() => setShowBookmarksDrawer(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookmarkedArticles.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No saved articles yet. Click the bookmark icon on any story card to save for offline reading.</p>
            ) : (
              <div className="space-y-3">
                {bookmarkedArticles.map(art => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    onSelectArticle={(selected) => {
                      setSelectedArticle(selected);
                      setShowBookmarksDrawer(false);
                    }}
                    onToggleBookmark={handleToggleBookmark}
                    isBookmarked={true}
                    variant="compact"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onToggleBookmark={handleToggleBookmark}
          isBookmarked={preferences.bookmarks.includes(selectedArticle.id)}
          onOpenClusterComparison={(art) => setClusterComparisonArticle(art)}
          preferredLanguage={preferences.preferredLanguage}
        />
      )}

      {clusterComparisonArticle && (
        <ClusterComparisonModal
          article={clusterComparisonArticle}
          onClose={() => setClusterComparisonArticle(null)}
        />
      )}

      {showAiAssistant && (
        <AiResearchAssistant onClose={() => setShowAiAssistant(false)} />
      )}

      {showAdminModal && (
        <AdminDashboardModal onClose={() => setShowAdminModal(false)} />
      )}

      {showPublisherDirectory && (
        <PublisherDirectory
          onClose={() => setShowPublisherDirectory(false)}
          onSelectPublisher={(pubId) => setSelectedPublisher(pubId)}
        />
      )}

      {showFinancialHub && (
        <LiveFinancialHub
          stocks={stocks}
          onClose={() => setShowFinancialHub(false)}
        />
      )}

      {showNewsMap && (
        <LiveNewsMapModal
          articles={articles}
          onClose={() => setShowNewsMap(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showKnowledgeGraph && (
        <KnowledgeGraphModal
          articles={articles}
          onClose={() => setShowKnowledgeGraph(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showAudioVideo && (
        <AudioVideoIntelligenceModal
          articles={articles}
          onClose={() => setShowAudioVideo(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showDevApi && (
        <DeveloperApiMarketplaceModal
          onClose={() => setShowDevApi(false)}
        />
      )}

      {showGlobalRiskIndex && (
        <GlobalRiskIndexModal
          articles={articles}
          onClose={() => setShowGlobalRiskIndex(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showCompanyGovProfiles && (
        <CompanyGovProfilesModal
          articles={articles}
          onClose={() => setShowCompanyGovProfiles(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showIntelligenceOps && (
        <IntelligenceOperationsCenterModal
          articles={articles}
          onClose={() => setShowIntelligenceOps(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showDigitalTwin && (
        <GlobalDigitalTwinModal
          articles={articles}
          onClose={() => setShowDigitalTwin(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showOsCore && (
        <IntelligenceOperatingSystemModal
          articles={articles}
          onClose={() => setShowOsCore(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showTerminal && (
        <IntelligenceTerminalModal
          articles={articles}
          onClose={() => setShowTerminal(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showExchange && (
        <IntelligenceExchangeModal
          articles={articles}
          onClose={() => setShowExchange(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showCrisisMonitor && (
        <CrisisMonitoringModal
          articles={articles}
          onClose={() => setShowCrisisMonitor(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showResearchWorkspace && (
        <AiResearchWorkspaceModal
          articles={articles}
          onClose={() => setShowResearchWorkspace(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showAgentNetwork && (
        <AiAgentNetworkModal
          articles={articles}
          onClose={() => setShowAgentNetwork(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showAfricaCenter && (
        <AfricaIntelligenceCenterModal
          articles={articles}
          onClose={() => setShowAfricaCenter(false)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showAnalystReview && (
        <AnalystReviewEnvironmentModal
          articles={articles}
          onClose={() => setShowAnalystReview(false)}
        />
      )}

      {showEnterpriseWorkspace && (
        <EnterpriseWorkspaceModal
          onClose={() => setShowEnterpriseWorkspace(false)}
        />
      )}

      {showTransparencyCenter && (
        <AiTransparencyCenterModal
          onClose={() => setShowTransparencyCenter(false)}
        />
      )}

      {storyEvolutionArticle && (
        <StoryEvolutionModal
          article={storyEvolutionArticle}
          onClose={() => setStoryEvolutionArticle(null)}
        />
      )}

      {showLanguageTranslator && (
        <LanguageTranslatorModal
          isOpen={showLanguageTranslator}
          onClose={() => setShowLanguageTranslator(false)}
          articles={articles}
          currentLanguage={preferences.preferredLanguage}
          onSelectLanguage={(lang) => handleUpdatePreferences({ preferredLanguage: lang })}
          selectedArticleForTranslation={selectedArticle}
        />
      )}

      {showKnowledgeLibrary && (
        <VeritasKnowledgeLibraryModal
          isOpen={showKnowledgeLibrary}
          onClose={() => setShowKnowledgeLibrary(false)}
          articles={articles}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showCommandCenter && (
        <VeritasIntelligenceCommandCenterModal
          isOpen={showCommandCenter}
          onClose={() => setShowCommandCenter(false)}
          articles={articles}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {showAiSearch && (
        <AiSearchAssistantModal
          isOpen={showAiSearch}
          onClose={() => setShowAiSearch(false)}
          articles={articles}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {/* Mobile Sticky WhatsApp Channel Growth Bar */}
      <WhatsAppIntegration variant="sticky_mobile" location="sticky_mobile" language={preferences.preferredLanguage} article={articles[0]} />

      {/* Global Footer */}
      <Footer
        onSelectCategory={setSelectedCategory}
        onSelectRegion={setSelectedRegion}
        onOpenPublisherDirectory={() => setShowPublisherDirectory(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenAiAssistant={() => setShowAiAssistant(true)}
        onOpenDevApi={() => setShowDevApi(true)}
        onOpenTransparencyCenter={() => setShowTransparencyCenter(true)}
      />
    </div>
  );
}
