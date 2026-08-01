import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { AiSearchService, AiSearchResult } from '../services/AiSearchService';
import { Search, X, Sparkles, BookOpen, Clock, ShieldCheck, ChevronRight, Cpu, ArrowRight, ExternalLink } from 'lucide-react';

interface AiSearchAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  initialQuery?: string;
  onSelectArticle?: (article: Article) => void;
}

export const AiSearchAssistantModal: React.FC<AiSearchAssistantModalProps> = ({
  isOpen,
  onClose,
  articles,
  initialQuery = 'What are the latest developments in Rwanda technology and economy?',
  onSelectArticle
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<AiSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (qToUse?: string) => {
    const activeQ = qToUse || query;
    if (!activeQ.trim()) return;

    setIsLoading(true);
    try {
      const res = await AiSearchService.answerQuery(activeQ, articles);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleSearch(initialQuery);
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Veritas AI Search Assistant
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Conversational Knowledge Engine Powered by Verified Global News & Knowledge Graph
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-5 bg-slate-950/60 border-b border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask any question (e.g., 'What are Rwanda AI investments?', 'Summarize EAC trade')..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl text-xs font-mono border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold cursor-pointer transition-all shrink-0 flex items-center gap-1.5"
            >
              {isLoading ? 'Querying AI...' : 'Ask Veritas AI'}
            </button>
          </form>

          {/* Quick Preset Queries */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar text-[11px] font-mono text-slate-400">
            <span className="text-slate-500 shrink-0">Popular:</span>
            {[
              'Rwanda AI strategy and investments',
              'Kenya renewable energy projects',
              'Pan-African trade AfCFTA progress',
              'East Africa digital economy'
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(preset);
                  handleSearch(preset);
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-lg border border-slate-800 whitespace-nowrap cursor-pointer shrink-0"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Content Result */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <Cpu className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Synthesizing intelligence across knowledge graph & multi-publisher articles...</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              
              {/* Synthesized Answer */}
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-xs font-bold text-indigo-400 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    AI Synthesized Answer
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-mono font-bold">
                    Confidence: {result.confidenceScore}%
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans space-y-2 whitespace-pre-line">
                  {result.synthesizedAnswer}
                </div>
              </div>

              {/* Cited Articles */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 font-mono block">
                  Cited Primary Intelligence Reports ({result.sources.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.sources.map(src => (
                    <div 
                      key={src.articleId}
                      onClick={() => {
                        const art = articles.find(a => a.id === src.articleId);
                        if (art && onSelectArticle) {
                          onSelectArticle(art);
                          onClose();
                        }
                      }}
                      className="p-3.5 bg-slate-950 hover:bg-slate-800/90 rounded-2xl border border-slate-800 cursor-pointer transition-all space-y-2"
                    >
                      <span className="text-xs font-bold text-white block line-clamp-2">{src.title}</span>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-900">
                        <span>{src.publisherName}</span>
                        <span className="text-emerald-400 font-bold">Trust: {src.trustScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Knowledge Graph Nodes */}
              {result.connectedEntities.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 font-mono block">
                    Connected Knowledge Graph Entities:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.connectedEntities.map(node => (
                      <div key={node.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center gap-2">
                        <span className="text-indigo-400 font-bold">{node.name}</span>
                        <span className="text-[10px] text-slate-500">({node.type})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up Prompts */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 font-mono block">Suggested Follow-Up Exploration:</span>
                <div className="space-y-1.5">
                  {result.suggestedFollowUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(prompt);
                        handleSearch(prompt);
                      }}
                      className="w-full text-left p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-mono flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>• {prompt}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};
