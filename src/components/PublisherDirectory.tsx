import React, { useState } from 'react';
import { PUBLISHERS } from '../data/mockNewsData';
import { PublisherInfo } from '../types';
import { ShieldCheck, ExternalLink, X, Search, Award } from 'lucide-react';

interface PublisherDirectoryProps {
  onClose: () => void;
  onSelectPublisher: (publisherId: string) => void;
}

export const PublisherDirectory: React.FC<PublisherDirectoryProps> = ({
  onClose,
  onSelectPublisher
}) => {
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');

  const publishersList = Object.values(PUBLISHERS);

  const filtered = publishersList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.country.toLowerCase().includes(search.toLowerCase());
    const matchesTier = selectedTier === 'all' || p.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Trusted Global Publisher Network & Audited Ratings
              </h2>
              <p className="text-xs text-slate-500">
                Audited news outlets classified into Tier 1, Tier 2, and Tier 3 based on accuracy metrics.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-6 pb-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search publishers by name or country..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold shrink-0">
              <button
                onClick={() => setSelectedTier('all')}
                className={`px-3 py-1 rounded-lg transition-all ${selectedTier === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                All Tiers
              </button>
              <button
                onClick={() => setSelectedTier(1)}
                className={`px-3 py-1 rounded-lg transition-all ${selectedTier === 1 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Tier 1 (Global Wire)
              </button>
              <button
                onClick={() => setSelectedTier(2)}
                className={`px-3 py-1 rounded-lg transition-all ${selectedTier === 2 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Tier 2 (Major Press)
              </button>
            </div>
          </div>
        </div>

        {/* Publisher Cards List */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(pub => (
            <div key={pub.id} className="p-4 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl flex flex-col justify-between space-y-3 hover:border-blue-500 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    {pub.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Tier {pub.tier}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {pub.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                    Trust: {pub.trustScore}%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                    {pub.biasRating}
                  </span>
                  <span className="text-slate-400 text-[10px]">{pub.country}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <button
                  onClick={() => {
                    onSelectPublisher(pub.id);
                    onClose();
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Filter Stories
                </button>
                <a
                  href={pub.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  Website <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
