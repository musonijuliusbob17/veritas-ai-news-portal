import React, { useState } from 'react';
import { Article } from '../types';
import { 
  enrichArticleWithLifecycleAndSeo, 
  getKnowledgeLibraryArticles, 
  getTopicAuthorityHubs,
  generateXmlSitemap 
} from '../services/newsLifecycleService';
import { 
  BookOpen, Search, Sparkles, Shield, Cpu, Tag, Globe, 
  Layers, Clock, Network, ExternalLink, Code, CheckCircle, 
  FileText, Download, Copy, Check, Filter, X, Zap, ChevronRight
} from 'lucide-react';

interface VeritasKnowledgeLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const VeritasKnowledgeLibraryModal: React.FC<VeritasKnowledgeLibraryModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'evergreen' | 'topics' | 'timeline' | 'graph' | 'seo_sitemap'>('evergreen');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [selectedArticleForSeo, setSelectedArticleForSeo] = useState<Article | null>(null);

  // Filter evergreen articles
  const allEvergreen = getKnowledgeLibraryArticles(articles);
  const topicHubs = getTopicAuthorityHubs(articles);

  const filteredEvergreen = allEvergreen.filter(art => {
    const matchesSearch = searchQuery === '' || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summaryShort.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['All', 'Technology', 'Artificial Intelligence', 'Climate', 'Finance', 'Business', 'Health', 'World'];

  const xmlSitemap = generateXmlSitemap(articles);

  const handleCopySitemap = () => {
    navigator.clipboard.writeText(xmlSitemap);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative text-slate-100">
        
        {/* Header Bar */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl text-white shadow-lg shadow-cyan-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-wide">
                  VERITAS KNOWLEDGE LIBRARY
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  EVERGREEN ARCHIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Permanently accessible research reports, guides, investigations, and high-impact historical analysis.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer self-end sm:self-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-3 bg-slate-950/60 border-b border-slate-800/80 text-xs font-mono">
          <button
            onClick={() => setActiveTab('evergreen')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'evergreen' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Evergreen Articles ({allEvergreen.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'topics' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-300" />
            <span>Topic Authority Hubs ({topicHubs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'timeline' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-300" />
            <span>Chronological Knowledge Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'graph' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-4 h-4 text-purple-300" />
            <span>Knowledge Graph</span>
          </button>

          <button
            onClick={() => setActiveTab('seo_sitemap')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'seo_sitemap' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4 text-amber-400" />
            <span>SEO & XML Sitemap</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: EVERGREEN ARTICLES & EXPLAINERS */}
          {activeTab === 'evergreen' && (
            <div className="space-y-6">
              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search evergreen guides, research, reports..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 font-mono text-xs">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evergreen List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvergreen.map(article => {
                  const enriched = enrichArticleWithLifecycleAndSeo(article);
                  return (
                    <div
                      key={article.id}
                      onClick={() => {
                        onSelectArticle(article);
                        onClose();
                      }}
                      className="p-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Evergreen Score: {enriched.evergreenScore}/100</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {article.category}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {article.summaryShort}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                        <span className="font-mono">{article.mainPublisher.name}</span>
                        <span className="text-cyan-400 font-bold flex items-center gap-1">
                          <span>Read Research</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TOPIC AUTHORITY HUBS */}
          {activeTab === 'topics' && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-950/40 border border-indigo-800/50 rounded-2xl text-xs text-indigo-200">
                <strong className="text-white block font-bold mb-1">🏛️ Veritas Topic Authority System</strong>
                Veritas Global automatically aggregates deep coverage across high-priority regional and global domains to serve as a permanent authoritative reference.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topicHubs.map(hub => (
                  <div key={hub.id} className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono font-bold">
                          {hub.category}
                        </span>
                        <h3 className="text-base font-extrabold text-white mt-1">{hub.title}</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
                        {hub.authorityScore}% Authority
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {hub.description}
                    </p>

                    {/* Key Organizations & People */}
                    <div className="space-y-2 pt-2 border-t border-slate-900 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">Key Entities:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {hub.organizations.concat(hub.keyPeople).map((entity, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono">
                              {entity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">Topic Tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {hub.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-900 text-[10px] font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE VIEW */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="relative border-l-2 border-slate-800 pl-6 space-y-8 my-4">
                {allEvergreen.map((article, idx) => (
                  <div key={article.id} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-950 group-hover:scale-125 transition-transform" />

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                        <span>Published: {new Date(article.publishedAt).toLocaleDateString()}</span>
                        <span className="text-cyan-400 font-bold">Evergreen Score: {article.evergreenScore || 90}/100</span>
                      </div>
                      <h4 
                        onClick={() => {
                          onSelectArticle(article);
                          onClose();
                        }}
                        className="font-bold text-sm text-white hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        {article.title}
                      </h4>
                      <p className="text-xs text-slate-400">{article.summaryShort}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: KNOWLEDGE GRAPH */}
          {activeTab === 'graph' && (
            <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-6 text-center">
              <Network className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-lg font-extrabold text-white">INTERACTIVE KNOWLEDGE GRAPH</h3>
                <p className="text-xs text-slate-400">
                  Semantic entity relationship model linking research papers, verified news stories, government institutions, and AI technological milestones.
                </p>
              </div>

              {/* Visual Nodes Preview */}
              <div className="p-8 bg-slate-900/60 rounded-2xl border border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
                <div className="px-4 py-2 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-xl font-bold shadow-lg">
                  Rwanda AI Policy
                </div>
                <div className="w-8 h-0.5 bg-cyan-500" />
                <div className="px-4 py-2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-xl font-bold shadow-lg">
                  Green City Kigali
                </div>
                <div className="w-8 h-0.5 bg-emerald-500" />
                <div className="px-4 py-2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl font-bold shadow-lg">
                  Sub-Saharan Climate Grid
                </div>
                <div className="w-8 h-0.5 bg-purple-500" />
                <div className="px-4 py-2 bg-purple-950 text-purple-300 border border-purple-800 rounded-xl font-bold shadow-lg">
                  Gemini 3.6 Intelligence Core
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SEO & XML SITEMAP */}
          {activeTab === 'seo_sitemap' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-amber-400" />
                    AUTOMATIC XML SITEMAP & GOOGLE SEO SCHEMAS
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live dynamic XML sitemap generated for search engine crawlers (Google, Bing, DuckDuckGo) preserving evergreen SEO authority.
                  </p>
                </div>

                <button
                  onClick={handleCopySitemap}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                >
                  {copiedSitemap ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSitemap ? 'Copied Sitemap XML!' : 'Copy XML Sitemap'}</span>
                </button>
              </div>

              {/* Sitemap XML Box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-64">
                <pre>{xmlSitemap}</pre>
              </div>

              {/* Sample Structured Data Schema Preview */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold font-mono text-slate-300 block">
                  Schema.org NewsArticle & Article Structured Data Sample:
                </span>
                <div className="p-3 bg-slate-900 rounded-xl font-mono text-[10px] text-slate-300 overflow-x-auto">
                  <pre>{JSON.stringify(articles[0] ? enrichArticleWithLifecycleAndSeo(articles[0]).seoMetadata?.structuredData : {}, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
