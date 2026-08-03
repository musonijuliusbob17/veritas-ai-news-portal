import React, { useRef } from 'react';
import { Category, Region, Article } from '../types';
import { Globe, TrendingUp, Sparkles, Shield, Compass, ChevronLeft, ChevronRight, LayoutGrid, ListFilter, SlidersHorizontal, Flame, Award } from 'lucide-react';

interface CategoryNavigationProps {
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  selectedRegion: Region;
  onSelectRegion: (reg: Region) => void;
  selectedSort: 'latest' | 'trending' | 'confidence';
  onSelectSort: (sort: 'latest' | 'trending' | 'confidence') => void;
  articles?: Article[];
  selectedSubcategory?: string;
  onSelectSubcategory?: (sub: string) => void;
  viewMode?: 'grid' | 'list';
  onToggleViewMode?: (mode: 'grid' | 'list') => void;
}

const CATEGORIES_WITH_ICONS: { name: Category; label: string; icon: string; subcategories: string[] }[] = [
  { name: 'All', label: 'All News', icon: '⚡', subcategories: ['Latest Dispatches', 'Top Verified', 'Editor Picks', 'Breaking Alerts'] },
  { name: 'Top Stories', label: 'Top Stories', icon: '🔥', subcategories: ['Global Headlines', 'Must Read', 'Cross-Verified', 'High Impact'] },
  { name: 'Technology', label: 'Technology', icon: '💻', subcategories: ['All Tech', 'Cybersecurity', 'Semiconductors', 'Robotics', 'Quantum', 'Big Tech'] },
  { name: 'Artificial Intelligence', label: 'AI Tech', icon: '✨', subcategories: ['LLMs & GenAI', 'Autonomous Systems', 'Ethics & Regulation', 'Compute & Chips'] },
  { name: 'Business', label: 'Business', icon: '📊', subcategories: ['Markets', 'Macroeconomy', 'Trade', 'Supply Chains', 'Startups'] },
  { name: 'Finance', label: 'Finance', icon: '📈', subcategories: ['Banking', 'Central Banks', 'Monetary Policy', 'Stock Exchanges'] },
  { name: 'Politics', label: 'Politics', icon: '🏛️', subcategories: ['Elections', 'Diplomacy', 'Governance', 'Policy', 'Geopolitics'] },
  { name: 'World', label: 'World News', icon: '🌍', subcategories: ['Global Affairs', 'Conflict Resolution', 'United Nations', 'Treaties'] },
  { name: 'Science', label: 'Science', icon: '🔬', subcategories: ['Space Exploration', 'Physics', 'Biotech', 'Genetics'] },
  { name: 'Health', label: 'Health', icon: '🏥', subcategories: ['Public Health', 'Medical Breakthroughs', 'Pharma', 'Global Wellness'] },
  { name: 'Climate', label: 'Climate & Environment', icon: '🌱', subcategories: ['Clean Energy', 'Carbon Neutrality', 'Biodiversity', 'Extreme Weather'] },
  { name: 'Cryptocurrency', label: 'Crypto & Web3', icon: '🪙', subcategories: ['Bitcoin', 'Ethereum', 'DeFi', 'CBDCs', 'Web3'] },
  { name: 'Sports', label: 'Sports', icon: '🏆', subcategories: ['Global Tournaments', 'Olympics', 'Football', 'Motorsports'] },
  { name: 'Entertainment', label: 'Entertainment', icon: '🍿', subcategories: ['Media', 'Cinema', 'Gaming', 'Culture'] },
  { name: 'Automotive', label: 'Automotive', icon: '🚗', subcategories: ['EVs', 'Autonomous Vehicles', 'Mobility', 'Transit'] },
  { name: 'Local', label: 'Pan-Africa & Local', icon: '🇷🇼', subcategories: ['Rwanda Tech', 'East Africa Trade', 'AfCFTA', 'Regional Tech'] }
];

const REGIONS: { name: Region; flag: string }[] = [
  { name: 'Global', flag: '🌍' },
  { name: 'Rwanda', flag: '🇷🇼' },
  { name: 'East Africa', flag: '🌍' },
  { name: 'Africa', flag: '🌍' },
  { name: 'Europe', flag: '🇪🇺' },
  { name: 'Asia', flag: '🌏' },
  { name: 'Middle East', flag: '🕌' },
  { name: 'North America', flag: '🇺🇸' },
  { name: 'South America', flag: '🌎' },
  { name: 'Oceania', flag: '🇦🇺' }
];

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
  selectedSort,
  onSelectSort,
  articles = [],
  selectedSubcategory = '',
  onSelectSubcategory,
  viewMode = 'grid',
  onToggleViewMode
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  // Compute count per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: articles.length };
    articles.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [articles]);

  const activeCategoryObject = CATEGORIES_WITH_ICONS.find(c => c.name === selectedCategory) || CATEGORIES_WITH_ICONS[0];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 shadow-sm transition-colors sticky top-[61px] z-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5 font-sans">
        
        {/* ROW 1: CATEGORY PILLS WITH SCROLL ARROWS */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Scroll Left Button */}
          <button
            onClick={scrollLeft}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition shrink-0 hidden sm:flex"
            title="Scroll Categories Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Categories Pill Container */}
          <div 
            ref={scrollRef}
            className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 flex-1 scroll-smooth"
          >
            {CATEGORIES_WITH_ICONS.map(item => {
              const isActive = selectedCategory === item.name;
              const count = categoryCounts[item.name] || 0;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    onSelectCategory(item.name);
                    if (onSelectSubcategory) onSelectSubcategory('');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={scrollRight}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition shrink-0 hidden sm:flex"
            title="Scroll Categories Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Sort & View Mode Switcher */}
          <div className="hidden lg:flex items-center space-x-2 shrink-0">
            {/* Sort Controls */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => onSelectSort('latest')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedSort === 'latest' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => onSelectSort('trending')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedSort === 'trending' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => onSelectSort('confidence')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedSort === 'confidence' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Highest Trust
              </button>
            </div>

            {/* View Mode */}
            {onToggleViewMode && (
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => onToggleViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onToggleViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
                  }`}
                  title="List Feed View"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ROW 2: SUBCATEGORY TOPIC PILLS (When active category has subcategories) */}
        {activeCategoryObject && activeCategoryObject.subcategories.length > 0 && (
          <div className="flex items-center space-x-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <span className="text-slate-400 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-500" />
              TOPICS:
            </span>
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
              {activeCategoryObject.subcategories.map(sub => {
                const isSubActive = selectedSubcategory === sub || (!selectedSubcategory && sub.startsWith('All'));
                return (
                  <button
                    key={sub}
                    onClick={() => onSelectSubcategory && onSelectSubcategory(sub.startsWith('All') ? '' : sub)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSubActive
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ROW 3: REGION FILTER PILLS */}
        <div className="flex items-center space-x-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <span className="text-slate-400 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            REGIONS:
          </span>
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {REGIONS.map(reg => {
              const isRegActive = selectedRegion === reg.name;
              return (
                <button
                  key={reg.name}
                  onClick={() => onSelectRegion(reg.name)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                    isRegActive
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{reg.flag}</span>
                  <span>{reg.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
