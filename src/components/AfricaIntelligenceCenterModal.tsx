import React, { useState } from 'react';
import { Article } from '../types';
import { Compass, Globe, ShieldCheck, TrendingUp, Zap, Building2, MapPin, X, ArrowUpRight, Search, FileText } from 'lucide-react';

interface AfricaIntelligenceCenterModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface AfricanNationProfile {
  country: string;
  flag: string;
  capital: string;
  gdpGrowth: string;
  afcftaTradeScore: number;
  riskRating: 'LOW' | 'MODERATE' | 'STABLE';
  primarySectors: string[];
  keyProjects: string;
  recentInsight: string;
}

const AFRICAN_NATIONS: AfricanNationProfile[] = [
  {
    country: 'Rwanda',
    flag: '🇷🇼',
    capital: 'Kigali',
    gdpGrowth: '+7.8%',
    afcftaTradeScore: 94,
    riskRating: 'STABLE',
    primarySectors: ['High-Tech Eco-Tourism', 'Fintech', 'Renewable Energy', 'Coffee Exports'],
    keyProjects: 'Kigali Innovation City & Bugesera Green International Logistics Hub',
    recentInsight: 'Rwanda leads East Africa in digital governance integration, green bonds issuance, and luxury eco-tourism growth.'
  },
  {
    country: 'Kenya',
    flag: '🇰🇪',
    capital: 'Nairobi',
    gdpGrowth: '+5.4%',
    afcftaTradeScore: 91,
    riskRating: 'STABLE',
    primarySectors: ['Silicon Savannah Tech', 'Geothermal Power', 'Tea & Horticulture', 'Logistics'],
    keyProjects: 'Konza Technopolis & Northern Corridor Multimodal Transit',
    recentInsight: 'Mobile financial transactions hit record highs while geothermal energy now powers over 45% of national grid output.'
  },
  {
    country: 'South Africa',
    flag: '🇿🇦',
    capital: 'Pretoria / Cape Town',
    gdpGrowth: '+2.1%',
    afcftaTradeScore: 88,
    riskRating: 'MODERATE',
    primarySectors: ['Platinum & Mining', 'Banking & Equities', 'Automotive Assembly', 'Renewables'],
    keyProjects: 'Just Energy Transition Investment Plan & Durban Port Modernization',
    recentInsight: 'Private renewable energy grid interconnections accelerate industrial manufacturing efficiency.'
  },
  {
    country: 'Nigeria',
    flag: '🇳🇬',
    capital: 'Abuja',
    gdpGrowth: '+3.6%',
    afcftaTradeScore: 85,
    riskRating: 'MODERATE',
    primarySectors: ['Fintech & Creative Economy', 'Oil & Gas', 'Dangote Refinery Complex', 'Agriculture'],
    keyProjects: 'Lagos Free Trade Zone & Lekki Deep Sea Port',
    recentInsight: 'Fintech startups drive digital payments scaling across West Africa, supported by new foreign exchange stabilization measures.'
  },
  {
    country: 'Morocco',
    flag: '🇲🇦',
    capital: 'Rabat',
    gdpGrowth: '+4.2%',
    afcftaTradeScore: 92,
    riskRating: 'STABLE',
    primarySectors: ['Aeronautics & EV Batteries', 'Solar Desalination', 'Phosphates', 'Tourism'],
    keyProjects: 'Noor Ouarzazate Solar Complex & Tanger Med Port Expansion',
    recentInsight: 'Morocco anchors European-African supply chains as major European automakers expand EV battery assembly plants.'
  }
];

export const AfricaIntelligenceCenterModal: React.FC<AfricaIntelligenceCenterModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [selectedCountry, setSelectedCountry] = useState<AfricanNationProfile>(AFRICAN_NATIONS[0]);
  const [activeSector, setActiveSector] = useState<string>('All Sectors');

  const africaArticles = articles.filter(a => a.region === 'Africa' || a.category === 'Business' || a.category === 'Technology');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-600 to-emerald-600 text-white shadow-lg shadow-amber-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">PAN-AFRICAN INTELLIGENCE & TRADE OBSERVATORY</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-800">
                  AfCFTA CONTINENTAL TRACKER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Macroeconomic intelligence, infrastructure investment, trade corridors, and sovereign risk metrics across African economies.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950">
          {/* Left Country Selection Sidebar */}
          <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 p-4 space-y-3 overflow-y-auto">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              SOVEREIGN COUNTRY PROFILES
            </h3>

            {AFRICAN_NATIONS.map(nation => {
              const isSelected = selectedCountry.country === nation.country;
              return (
                <div
                  key={nation.country}
                  onClick={() => setSelectedCountry(nation)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-950 to-slate-900 border-amber-500 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{nation.flag} <strong className="text-xs text-white ml-1">{nation.country}</strong></span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{nation.gdpGrowth} GDP</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>AfCFTA Score:</span>
                    <strong className="text-amber-400">{nation.afcftaTradeScore}/100</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Country Deep Dive & Intelligence Feed */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Country Dossier Card */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCountry.flag}</span>
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedCountry.country}</h3>
                    <span className="text-xs font-mono text-amber-400">Capital: {selectedCountry.capital}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                    Sovereign Risk: <strong className="text-emerald-400">{selectedCountry.riskRating}</strong>
                  </div>
                </div>
              </div>

              {/* Economic Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">REAL GDP GROWTH</span>
                  <strong className="text-emerald-400 text-sm">{selectedCountry.gdpGrowth}</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">AfCFTA INTEGRATION INDEX</span>
                  <strong className="text-amber-400 text-sm">{selectedCountry.afcftaTradeScore}/100</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">STRATEGIC INFRASTRUCTURE</span>
                  <strong className="text-white text-xs line-clamp-1">{selectedCountry.keyProjects}</strong>
                </div>
              </div>

              {/* Key Insight */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">LATEST VERITAS REGIONAL INSIGHT</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedCountry.recentInsight}</p>
              </div>

              {/* Sector Tags */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">KEY ECONOMIC SECTORS</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCountry.primarySectors.map((sec, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Regional News Archive */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                PAN-AFRICAN CORRESPONDENCE & TRADE DISPATCHES
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {africaArticles.slice(0, 4).map(art => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold font-mono">
                      <span>{art.mainPublisher.name}</span>
                      <span>{art.region}</span>
                    </div>
                    <h4 className="font-bold text-xs text-white line-clamp-2">{art.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{art.summaryShort}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
