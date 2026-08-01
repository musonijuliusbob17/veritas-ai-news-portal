import React from 'react';
import { Category, Region } from '../types';
import { Globe, TrendingUp, Sparkles, Shield, Compass } from 'lucide-react';

interface CategoryNavigationProps {
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  selectedRegion: Region;
  onSelectRegion: (reg: Region) => void;
  selectedSort: 'latest' | 'trending' | 'confidence';
  onSelectSort: (sort: 'latest' | 'trending' | 'confidence') => void;
}

const CATEGORIES: Category[] = [
  'All',
  'Top Stories',
  'Technology',
  'Artificial Intelligence',
  'Business',
  'Finance',
  'Politics',
  'World',
  'Science',
  'Health',
  'Sports',
  'Entertainment',
  'Climate',
  'Cryptocurrency',
  'Automotive',
  'Travel',
  'Lifestyle'
];

const REGIONS: Region[] = [
  'Global',
  'Africa',
  'Europe',
  'Asia',
  'Middle East',
  'North America',
  'South America',
  'Oceania'
];

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
  selectedSort,
  onSelectSort
}) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        {/* Main Categories Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 flex-1">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat === 'Artificial Intelligence' ? '✨ AI Tech' : cat}
                </button>
              );
            })}
          </div>

          {/* Sort Switcher */}
          <div className="hidden lg:flex items-center space-x-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium shrink-0">
            <button
              onClick={() => onSelectSort('latest')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedSort === 'latest' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => onSelectSort('trending')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedSort === 'trending' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => onSelectSort('confidence')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedSort === 'confidence' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Highest Trust
            </button>
          </div>
        </div>

        {/* Secondary Region Selector Row */}
        <div className="flex items-center space-x-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Globe className="w-3.5 h-3.5" /> REGIONS:
          </span>
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {REGIONS.map(reg => {
              const isRegActive = selectedRegion === reg;
              return (
                <button
                  key={reg}
                  onClick={() => onSelectRegion(reg)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                    isRegActive
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {reg}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
