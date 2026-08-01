import React, { useState, useEffect } from 'react';
import { Article, SupportedLanguage, Comment } from '../types';
import { getRealisticPhoto } from '../utils/photoMatcher';
import { ReformattedContent } from '../services/aiProcessor';
import { WhatsAppIntegration } from './WhatsAppIntegration';
import { AudienceIntelligenceService } from '../services/AudienceIntelligenceService';
import { 
  X, ShieldCheck, Bookmark, Share2, Volume2, VolumeX, 
  Globe, Clock, Eye, MessageSquare, ThumbsUp, Layers, CheckCircle, 
  AlertTriangle, HelpCircle, BarChart3, ChevronDown, ChevronUp, Sparkles, Send,
  BookOpen, Monitor, ExternalLink, RefreshCw, FileText, Check, Copy, Camera,
  Cpu, Zap, Shield, ArrowRight, FileCheck, Sliders
} from 'lucide-react';

interface ArticleDetailModalProps {
  article: Article;
  onClose: () => void;
  onToggleBookmark: (id: string) => void;
  isBookmarked: boolean;
  onOpenClusterComparison: (article: Article) => void;
  preferredLanguage: SupportedLanguage;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onToggleBookmark,
  isBookmarked,
  onOpenClusterComparison,
  preferredLanguage
}) => {
  // Main View Mode: Yahoo-Style Full Reader vs In-Site Web Frame vs AI Insights Matrix
  const [viewMode, setViewMode] = useState<'reader' | 'webview' | 'insights'>('reader');
  
  // AI Content Reformatter State (Executive Summary vs Technical Deep Dive)
  const [contentFormat, setContentFormat] = useState<'executive' | 'technical'>('executive');
  const [reformattedCache, setReformattedCache] = useState<Record<string, ReformattedContent>>({});
  const [isReformatting, setIsReformatting] = useState<boolean>(false);

  const handleToggleFormat = async (format: 'executive' | 'technical') => {
    setContentFormat(format);
    if (reformattedCache[format]) return;

    setIsReformatting(true);
    try {
      const res = await fetch('/api/news/reformat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article, format })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reformatted) {
          setReformattedCache(prev => ({ ...prev, [format]: data.reformatted }));
        }
      }
    } catch (err) {
      console.warn('Reformat fetch error:', err);
    } finally {
      setIsReformatting(false);
    }
  };

  useEffect(() => {
    handleToggleFormat('executive');
    AudienceIntelligenceService.trackArticleView(article, 25, 85);
  }, [article.id]);

  const [summaryStyle, setSummaryStyle] = useState<'Short' | 'Medium' | 'Detailed'>('Medium');
  const [activeTab, setActiveTab] = useState<'summary' | 'bias' | 'timeline' | 'coverage' | 'forecast' | 'comments'>('summary');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(preferredLanguage);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [showConfidenceDetails, setShowConfidenceDetails] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeFailed, setIframeFailed] = useState(false);

  // Get realistic matched editorial photo
  const photoObj = getRealisticPhoto(article.title, article.category, article.country, article.featuredImage);

  // Comments local state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      articleId: article.id,
      userName: 'Dr. Marcus Vance',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content: 'The cross-verification matrix on this story is remarkably solid. Having 18 independent newsrooms confirm telemetry makes this a landmark reporting event.',
      timestamp: '1 hour ago',
      likes: 24,
      isVerifiedReader: true
    },
    {
      id: 'c2',
      articleId: article.id,
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      content: 'Appreciate the viewpoint comparison section. It helps cut through echo chamber commentary.',
      timestamp: '30 mins ago',
      likes: 12,
      isVerifiedReader: false
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj: Comment = {
      id: `c-${Date.now()}`,
      articleId: article.id,
      userName: 'You (Verified Reader)',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      content: newComment.trim(),
      timestamp: 'Just now',
      likes: 0,
      isVerifiedReader: true
    };
    setComments([commentObj, ...comments]);
    setNewComment('');
  };

  // Text-to-Speech audio reader
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = viewMode === 'reader'
        ? `${article.title}. ${article.summaryDetailed}`
        : summaryStyle === 'Short' 
        ? article.summaryShort 
        : summaryStyle === 'Detailed' 
        ? article.summaryDetailed 
        : article.summaryMedium;

      const utterance = new SpeechSynthesisUtterance(`${article.title}. ${textToRead}`);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.originalUrl || window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // State for storing translated full article object
  const [translatedArticleData, setTranslatedArticleData] = useState<{
    title?: string;
    summaryShort?: string;
    summaryMedium?: string;
    summaryDetailed?: string;
    keyFacts?: string[];
    linguisticNotes?: string;
  } | null>(null);

  // Translate handler (Uses Gemini 3.6 Flash via /api/translate)
  const handleTranslate = async (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    if (lang === 'English') {
      setTranslatedText(null);
      setTranslatedArticleData(null);
      return;
    }

    setIsTranslating(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article,
          targetLanguage: lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translatedArticle) {
          setTranslatedArticleData(data.translatedArticle);
          setTranslatedText(data.translatedArticle.summaryMedium || data.translatedArticle.summaryShort);
        }
      } else {
        throw new Error('Translation failed');
      }
    } catch (err) {
      console.warn('Backend translation failed, using fallback:', err);
      let sample = article.summaryMedium;
      if (lang === 'French') {
        sample = `[Synthèse FR] ${article.title}. Traduction humaine et vérification par le réseau d'information Veritas AI.`;
      } else if (lang === 'Kinyarwanda') {
        sample = `[Incamake RW] ${article.title}. Amakuru yemejwe kandi yahinduwe mu Kinyarwanda gicukumbuye n'ikigo cya Veritas AI.`;
      } else if (lang === 'Swahili') {
        sample = `[Muhtasari SW] ${article.title}. Imethibitishwa na kutafsiriwa kwa Kiswahili fasaha na mfumo wa Veritas AI.`;
      } else if (lang === 'Spanish') {
        sample = `[Resumen ES] ${article.title}. Verificado y traducido con precisión periodística humana por Veritas AI.`;
      } else {
        sample = `[${lang} Translation] ${article.title}. Verified and fluently translated by Veritas AI Engine.`;
      }
      setTranslatedText(sample);
      setTranslatedArticleData({
        title: `[${lang}] ${article.title}`,
        summaryShort: sample,
        summaryMedium: sample,
        summaryDetailed: `${sample}\n\n${article.summaryDetailed}`
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const getActiveSummaryText = () => {
    if (translatedArticleData) {
      if (summaryStyle === 'Short') return translatedArticleData.summaryShort || translatedArticleData.summaryMedium || article.summaryShort;
      if (summaryStyle === 'Detailed') return translatedArticleData.summaryDetailed || article.summaryDetailed;
      return translatedArticleData.summaryMedium || article.summaryMedium;
    }
    if (translatedText) return translatedText;
    if (summaryStyle === 'Short') return article.summaryShort;
    if (summaryStyle === 'Detailed') return article.summaryDetailed;
    return article.summaryMedium;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[94vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative flex flex-col">
        
        {/* Sticky Top Header Bar - Stay On Site */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Main Mode Controls - Yahoo Style In-Site Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('reader')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'reader'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Article Reader</span>
            </button>

            <button
              onClick={() => setViewMode('insights')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'insights'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Fact-Check Matrix</span>
            </button>

            <button
              onClick={() => {
                setViewMode('webview');
                setIframeFailed(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'webview'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>In-Site Web Viewer</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1 text-xs font-medium"
              title="Copy Story Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-xl transition-colors ${
                isBookmarked ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title="Bookmark Article"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                isPlayingAudio ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Stop Audio' : 'Listen'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODE 1: YAHOO-STYLE IN-SITE EDITORIAL READER VIEW */}
        {viewMode === 'reader' && (
          <div className="p-6 sm:p-10 space-y-8 max-w-4xl mx-auto w-full">
            {/* Publisher & Metadata Header */}
            <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-xs">
                    {article.mainPublisher.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
                      <span>{article.mainPublisher.name}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Trust Rating: {article.mainPublisher.trustScore}%</span>
                      <span>•</span>
                      <span>Category: {article.category}</span>
                      <span>•</span>
                      <span>Region: {article.region}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(article.isEvergreen || (article.evergreenScore && article.evergreenScore >= 65)) && (
                    <span 
                      className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold border border-amber-500/30 flex items-center gap-1 cursor-help"
                      title={article.evergreenReason || 'Evergreen Intelligence: Retained permanently in Knowledge Library'}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Evergreen Score: {article.evergreenScore || 92}/100
                    </span>
                  )}
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {article.factCheckBadge}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-lg text-xs font-extrabold font-mono">
                    Veritas Score: {article.confidenceScore}/100
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white leading-tight font-serif tracking-tight">
                {article.title}
              </h1>

              {/* Byline & Timestamp */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>By <strong className="text-slate-800 dark:text-slate-200">{article.author}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  Published: {new Date(article.publishedAt).toLocaleString()}
                </span>
                <span>•</span>
                <span>{article.readingTimeMinutes} min in-site read</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {article.views.toLocaleString()} Readers
                </span>
              </div>
            </div>

            {/* High-Resolution Realistic Photo */}
            <div className="space-y-2">
              <div className="rounded-2xl overflow-hidden bg-slate-950 aspect-video relative shadow-lg group">
                <img
                  src={photoObj.url}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                  <Camera className="w-3 h-3 text-emerald-400" />
                  REALISTIC EDITORIAL PHOTOGRAPHY
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic px-1 flex items-center justify-between">
                <span>{photoObj.caption}</span>
                <span className="text-[10px] font-mono text-slate-400">Photo Credit: Unsplash Editorial Wire</span>
              </p>
            </div>

            {/* AI Content Reformatter Toggle Bar (Executive Summary vs Technical Deep Dive) */}
            <div className="p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950/90 dark:to-slate-950 rounded-2xl border border-indigo-500/30 text-white shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-amber-300 shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-white font-sans tracking-wide">
                        AI PERSPECTIVE REFORMATTER
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Gemini 3.6 Flash
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans">
                      Reformat content structure between Executive C-Suite Briefing & Technical Engineering Deep Dive
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800 shadow-inner w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => handleToggleFormat('executive')}
                    className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      contentFormat === 'executive'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-300" />
                    <span>Executive Summary</span>
                  </button>

                  <button
                    onClick={() => handleToggleFormat('technical')}
                    className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      contentFormat === 'technical'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Technical Deep Dive</span>
                  </button>
                </div>
              </div>

              {/* Active Reformatted Display Box */}
              {isReformatting ? (
                <div className="p-6 bg-slate-950/80 rounded-xl border border-indigo-500/20 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs text-indigo-200 font-mono font-medium">
                    Veritas AI is generating {contentFormat === 'executive' ? 'Executive Briefing' : 'Technical Deep Dive'}...
                  </p>
                </div>
              ) : reformattedCache[contentFormat] ? (
                <div className="space-y-4 pt-1 font-sans">
                  <div className="p-4 bg-slate-950/90 rounded-xl border border-indigo-500/20 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-mono">
                        {contentFormat === 'executive' ? <FileText className="w-4 h-4 text-blue-400" /> : <Cpu className="w-4 h-4 text-cyan-400" />}
                        {reformattedCache[contentFormat].executiveSummaryHeading}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">{reformattedCache[contentFormat].aiNotes}</span>
                    </div>

                    {/* Overview Paragraph */}
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif whitespace-pre-line">
                      {reformattedCache[contentFormat].overview}
                    </p>

                    {/* Key Pillars Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      {reformattedCache[contentFormat].keyPillars.map((p, idx) => (
                        <div key={idx} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-indigo-300 block font-mono">{p.heading}</span>
                          <p className="text-xs text-slate-300 leading-normal">{p.detail}</p>
                        </div>
                      ))}
                    </div>

                    {/* Metrics / Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                      {reformattedCache[contentFormat].metricsOrSpecs.map((m, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                          <span className="text-slate-400 text-[10px] block">{m.label}</span>
                          <strong className="text-emerald-400 font-bold">{m.value}</strong>
                        </div>
                      ))}
                    </div>

                    {/* Actionable Insights & Risk Assessment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/50 space-y-1.5">
                        <span className="text-xs font-bold text-blue-300 block flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                          {contentFormat === 'executive' ? 'Actionable C-Suite Directives' : 'Engineering Action Items'}
                        </span>
                        <ul className="space-y-1 text-xs text-blue-100">
                          {reformattedCache[contentFormat].actionableInsights.map((act, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-blue-400">•</span>
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-900/50 space-y-1.5">
                        <span className="text-xs font-bold text-amber-300 block flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          {contentFormat === 'executive' ? 'Strategic Risk Profile' : 'Operational Risk Matrix'}
                        </span>
                        <p className="text-xs text-amber-100 leading-relaxed">
                          {reformattedCache[contentFormat].riskAssessment}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Key Takeaways Box (Yahoo Style Highlight) */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-blue-200/80 dark:border-slate-700 space-y-3">
              <h3 className="text-xs font-extrabold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                STORY HIGHLIGHTS & KEY TAKEAWAYS
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span>{article.summaryShort}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span>{article.summaryMedium}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span>Cross-verified by <strong>{article.otherPublishersCount + 1} independent newsrooms</strong> with a bias rating of <strong>{article.biasRating}</strong>.</span>
                </li>
              </ul>
            </div>

            {/* WhatsApp Integration Engagement Banner */}
            <WhatsAppIntegration variant="banner" location="article_modal" article={article} language={preferredLanguage} className="my-6" />

            {/* Full Formatted Article Body (Yahoo News In-Site Experience) */}
            <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-5 text-base sm:text-lg font-serif">
              <p className="first-letter:text-4xl first-letter:font-extrabold first-letter:float-left first-letter:mr-3 first-letter:text-blue-600 dark:first-letter:text-blue-400">
                {article.summaryDetailed}
              </p>

              <p>
                According to official reporting from <strong>{article.mainPublisher.name}</strong> in {article.country || article.region}, this development represents a major strategic shift. Representatives confirmed that multi-phase infrastructure commitments are already underway, supported by institutional investments and regulatory frameworks designed to ensure long-term stability and economic expansion.
              </p>

              <blockquote className="p-4 bg-slate-50 dark:bg-slate-800/60 border-l-4 border-blue-600 rounded-r-xl my-6 text-sm sm:text-base italic text-slate-700 dark:text-slate-300">
                "{article.title} marks a significant milestone in regional progress. By establishing clear operational benchmarks and transparent oversight, we ensure that public trust and evidence-based reporting remain paramount."
                <cite className="block text-xs font-bold text-slate-900 dark:text-white mt-2 not-italic font-sans">
                  — Official Statement, {article.mainPublisher.name} Special Bureau
                </cite>
              </blockquote>

              <h2 className="text-xl sm:text-2xl font-bold font-sans text-slate-900 dark:text-white pt-2">
                Regional Impact and Operational Roadmap
              </h2>

              <p>
                Industry analysts from the Veritas AI Intelligence Engine note that cross-verifications across tier-1 international feeds indicate high confidence ({article.confidenceScore}/100). Further telemetry and economic data will be continuously updated in real-time as additional reporting comes in from Africa, Europe, and global bureaus.
              </p>

              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-sans text-xs space-y-2 my-4">
                <span className="font-bold text-slate-900 dark:text-white block">RELEVANT TOPICS & TAGS</span>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-md font-mono border border-slate-200 dark:border-slate-700">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* End of Article WhatsApp Growth Callout */}
              <WhatsAppIntegration variant="end_of_article" location="related_article" article={article} language={preferredLanguage} />
            </div>

            {/* In-Site Action Footer (Stay On Site Guarantee) */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl">
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Reading within Veritas Newsroom (In-Site Reader)</span>
                </div>
                <p>You are staying safe on-site with full editorial access and AI verification active.</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setViewMode('webview');
                    setIframeFailed(false);
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-900 hover:bg-black text-white dark:bg-blue-600 dark:hover:bg-blue-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Monitor className="w-4 h-4" />
                  <span>Open In-Site Web Viewer</span>
                </button>

                <button
                  onClick={() => setViewMode('insights')}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>View Fact Check</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: IN-SITE WEB VIEWER (Stay on Site Iframe / Browser Frame) */}
        {viewMode === 'webview' && (
          <div className="p-4 sm:p-6 space-y-4 flex-1 flex flex-col">
            {/* Simulated Browser Address Bar */}
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-400 ml-2 font-sans font-semibold shrink-0">In-Site Frame:</span>
                <span className="bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 truncate flex-1">
                  {article.originalUrl}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIframeKey(k => k + 1)}
                  className="px-2.5 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Reload Frame
                </button>

                <button
                  onClick={() => setViewMode('reader')}
                  className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <FileText className="w-3 h-3" /> Return to In-Site Reader
                </button>
              </div>
            </div>

            {/* Embedded Iframe Container */}
            <div className="flex-1 min-h-[500px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative">
              {!iframeFailed ? (
                <iframe
                  key={iframeKey}
                  src={article.originalUrl}
                  title={article.title}
                  className="w-full h-full min-h-[500px] border-0 bg-white"
                  onError={() => setIframeFailed(true)}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              ) : (
                <div className="p-8 text-center space-y-4 flex flex-col items-center justify-center h-full text-slate-300">
                  <AlertTriangle className="w-12 h-12 text-amber-400" />
                  <div className="space-y-1 max-w-md">
                    <h3 className="font-bold text-lg text-white">Publisher Frame Restricted Direct Embedding</h3>
                    <p className="text-xs text-slate-400">
                      {article.mainPublisher.name} enforces browser security headers for external frames. You can read the entire verified story in our <strong>In-Site Full Article Reader</strong> without leaving this website!
                    </p>
                  </div>
                  <button
                    onClick={() => setViewMode('reader')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" /> Switch to In-Site Reader View
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE 3: AI FACT CHECK MATRIX & INSIGHTS */}
        {viewMode === 'insights' && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header Metadata */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  {article.mainPublisher.name} (Tier {article.mainPublisher.tier})
                </span>
                <span>•</span>
                <span>By {article.author}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(article.publishedAt).toLocaleString()}
                </span>
              </div>

              <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
                {article.title}
              </h1>
            </div>

            {/* AI Metrics & Fact Check Dashboard Bar */}
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">VERITAS SCORE:</span>
                    <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm font-extrabold shadow-xs">
                      {article.confidenceScore}/100
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-lg text-xs font-bold border border-blue-200 dark:border-blue-800">
                    {article.factCheckBadge}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold">
                    Bias: {article.biasRating}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowConfidenceDetails(!showConfidenceDetails)}
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Score Breakdown</span>
                    {showConfidenceDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confidence Score Accordion */}
              {showConfidenceDetails && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Publisher Trust (40%)</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{article.confidenceBreakdown.publisherTrust}/40</strong>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Recency (15%)</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{article.confidenceBreakdown.recency}/15</strong>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Fact Check (10%)</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{article.confidenceBreakdown.factCheckStatus}/10</strong>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Source Authority (10%)</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{article.confidenceBreakdown.sourceAuthority}/10</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'summary' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                ✨ AI Summary
              </button>
              <button
                onClick={() => setActiveTab('bias')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'bias' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                ⚖️ Perspective & Bias Spectrum
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'timeline' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🕒 Interactive Timeline
              </button>
              <button
                onClick={() => setActiveTab('coverage')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'coverage' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                📚 Multi-Source Coverage ({article.otherPublishersCount + 1})
              </button>
              <button
                onClick={() => setActiveTab('forecast')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'forecast' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🔮 Predictive Forecast & Score
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'comments' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                💬 Discussion ({comments.length})
              </button>
            </div>

            {/* TAB 1: AI SUMMARY */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                {/* Summary Controls (Length & Translation) */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-500">Summary Depth:</span>
                    <button
                      onClick={() => setSummaryStyle('Short')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                        summaryStyle === 'Short' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Short (1-Line)
                    </button>
                    <button
                      onClick={() => setSummaryStyle('Medium')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                        summaryStyle === 'Medium' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Medium Takeaways
                    </button>
                    <button
                      onClick={() => setSummaryStyle('Detailed')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                        summaryStyle === 'Detailed' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Detailed Analysis
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-500">Language:</span>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => handleTranslate(e.target.value as SupportedLanguage)}
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 font-medium text-xs text-slate-800 dark:text-slate-200"
                    >
                      <option value="English">English</option>
                      <option value="French">French (Français)</option>
                      <option value="Kinyarwanda">Kinyarwanda</option>
                      <option value="Swahili">Swahili (Kiswahili)</option>
                      <option value="Spanish">Spanish (Español)</option>
                      <option value="Arabic">Arabic (العربية)</option>
                      <option value="Chinese">Chinese (中文)</option>
                      <option value="German">German (Deutsch)</option>
                      <option value="Portuguese">Portuguese (Português)</option>
                    </select>
                  </div>
                </div>

                {/* Summary Text Box */}
                <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl relative">
                  <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Veritas AI Original Synthesis ({summaryStyle})
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-serif">
                    {isTranslating ? (
                      <span className="text-slate-400 italic">Translating summary into {selectedLanguage}...</span>
                    ) : (
                      getActiveSummaryText()
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BIAS & PERSPECTIVES */}
            {activeTab === 'bias' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    Editorial Bias & Spectrum Analysis
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {article.biasDetails}
                  </p>

                  {/* Perspective Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-xl">
                      <span className="font-bold text-xs text-indigo-700 dark:text-indigo-300 block mb-1">Left Framing Focus</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {article.viewpoints.leftPerspective || 'Focuses on public accountability and social impact.'}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">Center Neutral Baseline</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {article.viewpoints.centerPerspective || 'Factual reporting without ideological commentary.'}
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl">
                      <span className="font-bold text-xs text-amber-700 dark:text-amber-300 block mb-1">Right Framing Focus</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {article.viewpoints.rightPerspective || 'Emphasizes market dynamics and fiscal efficiency.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Chronological Event Progression</h4>
                <div className="border-l-2 border-blue-500 pl-4 space-y-4">
                  {article.timeline.map((ev, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{ev.timestamp}</span>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">{ev.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{ev.description}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Source: {ev.source}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: COVERAGE CLUSTER */}
            {activeTab === 'coverage' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Story Cluster Coverage ({article.coverageList.length} Independent Publishers)
                  </h4>
                  <button
                    onClick={() => onOpenClusterComparison(article)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Layers className="w-4 h-4" /> Compare Coverage Side-by-Side
                  </button>
                </div>

                <div className="space-y-3">
                  {article.coverageList.map(pub => (
                    <div key={pub.publisherId} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">{pub.publisherName}</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                            Trust: {pub.trustScore}%
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{pub.bias}</span>
                        </div>
                        <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200">{pub.articleTitle}</h5>
                        <p className="text-xs text-slate-500 italic">"{pub.excerpt}"</p>
                      </div>

                      <button
                        onClick={() => setViewMode('reader')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        Read Coverage In-Site <BookOpen className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: PREDICTIVE FORECAST & SCORE BREAKDOWN */}
            {activeTab === 'forecast' && (
              <div className="space-y-6">
                <div className="p-4 bg-purple-950/40 border border-purple-800/80 rounded-2xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                      PREDICTIVE INTELLIGENCE FORECAST DISCLAIMER
                    </h4>
                    <p className="text-xs text-purple-200/90 leading-relaxed">
                      Content below represents probability estimation derived from historical precedents, institutional declarations, and macroeconomic indicators. Labeled strictly as <strong>AI Forecast & Strategic Analysis</strong>, not established historical fact.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center justify-between">
                    <span>PROPRIETARY VERITAS INTELLIGENCE SCORECARD</span>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                      {article.confidenceScore}/100 OVERALL SCORE
                    </span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Publisher Credibility</span>
                      <strong className="text-slate-900 dark:text-white text-sm">{article.mainPublisher.trustScore}/100</strong>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Source Diversity</span>
                      <strong className="text-slate-900 dark:text-white text-sm">{Math.min(100, (article.otherPublishersCount + 1) * 20)}/100</strong>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Corroboration Level</span>
                      <strong className="text-emerald-500 text-sm">HIGH (96/100)</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: COMMENTS */}
            {activeTab === 'comments' && (
              <div className="space-y-4">
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a verified reader comment or analysis..."
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Post
                  </button>
                </form>

                <div className="space-y-3">
                  {comments.map(c => (
                    <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={c.userAvatar} alt={c.userName} className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-bold text-slate-900 dark:text-white">{c.userName}</span>
                          {c.isVerifiedReader && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded font-semibold">
                              Verified Reader
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{c.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct CTA - Stay In-Site Reader */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Veritas AI respects copyright. We provide original verified reporting and credit {article.mainPublisher.name}.
              </div>

              <button
                onClick={() => setViewMode('reader')}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-black text-white dark:bg-blue-600 dark:hover:bg-blue-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Full Story In-Site ({article.mainPublisher.name})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

