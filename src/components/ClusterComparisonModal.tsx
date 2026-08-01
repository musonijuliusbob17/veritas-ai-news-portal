import React from 'react';
import { Article } from '../types';
import { X, Layers, ExternalLink, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';

interface ClusterComparisonModalProps {
  article: Article;
  onClose: () => void;
}

export const ClusterComparisonModal: React.FC<ClusterComparisonModalProps> = ({
  article,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              Multi-Publisher Coverage Matrix & Bias Comparison
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Clustered Story Event
            </span>
            <h1 className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
              {article.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Veritas AI merged coverage from <strong className="text-slate-900 dark:text-white">{article.otherPublishersCount + 1} independent newsrooms</strong> to analyze reporting variations and factual consistency.
            </p>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Primary Source */}
            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 border-2 border-blue-500 rounded-2xl space-y-3 relative flex flex-col justify-between">
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white uppercase">
                LEAD SOURCE
              </span>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{article.mainPublisher.name}</span>
                  <span className="text-xs text-slate-500 font-mono">Tier {article.mainPublisher.tier}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                    Trust {article.mainPublisher.trustScore}%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {article.biasRating}
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {article.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{article.summaryShort}"
                </p>
              </div>

              <a
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
              >
                <span>Read Full Story</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Other Coverage Items */}
            {article.coverageList.map(item => (
              <div key={item.publisherId} className="p-4 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{item.publisherName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                      Trust {item.trustScore}%
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                      {item.bias}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {item.articleTitle}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{item.excerpt}"
                  </p>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Read Article</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
