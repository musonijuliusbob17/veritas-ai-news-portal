import React, { useState } from 'react';
import { Article, Region } from '../types';
import { EventDetectionEngine, EventIntelligenceObject } from '../services/EventDetectionEngine';
import { BreakingNewsEngine, BreakingAlert } from '../services/BreakingNewsEngine';
import { TrendDetectionService, TrendItem } from '../services/TrendDetectionService';
import { Globe, MapPin, Radio, ShieldCheck, Flame, Filter, Zap, Activity, ChevronRight } from 'lucide-react';

export type MapLayer = 'All' | 'Political' | 'Economic' | 'Technology' | 'Climate' | 'Science' | 'Security';
export type FilterRegion = 'Global' | 'Africa' | 'Europe' | 'Asia' | 'Americas' | 'Middle East';

interface GlobalIntelligenceMapProps {
  articles: Article[];
  onSelectArticle?: (article: Article) => void;
}

interface IntelligencePin {
  id: string;
  title: string;
  layer: MapLayer;
  region: Region;
  country: string;
  city: string;
  lat: number; // visual percent Y on vector map
  lng: number; // visual percent X on vector map
  type: 'EVENT' | 'BREAKING' | 'TREND' | 'STORY';
  importance: number;
  confidence: number;
  articleId?: string;
  details: string;
}

export const GlobalIntelligenceMap: React.FC<GlobalIntelligenceMapProps> = ({
  articles,
  onSelectArticle
}) => {
  const [selectedLayer, setSelectedLayer] = useState<MapLayer>('All');
  const [selectedRegion, setSelectedRegion] = useState<FilterRegion>('Global');
  const [activePin, setActivePin] = useState<IntelligencePin | null>(null);

  const events = EventDetectionEngine.detectEvents(articles);
  const breakingAlerts = BreakingNewsEngine.getActiveBreakingAlerts(articles);
  const trends = TrendDetectionService.detectTrends(articles);

  const pins: IntelligencePin[] = [
    {
      id: 'pin_kigali_ai',
      title: 'Pan-African AI Regulatory Accord Ratified',
      layer: 'Technology',
      region: 'Africa',
      country: 'Rwanda',
      city: 'Kigali',
      lat: 58,
      lng: 58,
      type: 'EVENT',
      importance: 96,
      confidence: 94,
      details: 'Kigali Sovereign Supercomputing Center & Pan-African AI Regulatory Agreement signed by 14 member nations.'
    },
    {
      id: 'pin_nairobi_grid',
      title: 'East Africa Clean Hydro & Solar Grid',
      layer: 'Climate',
      region: 'Africa',
      country: 'Kenya',
      city: 'Nairobi',
      lat: 56,
      lng: 60,
      type: 'EVENT',
      importance: 92,
      confidence: 90,
      details: '$4.2B International Green Infrastructure Grant signed in Nairobi to connect cross-border clean energy grids.'
    },
    {
      id: 'pin_accra_trade',
      title: 'AfCFTA Digital Customs Clearance Protocol',
      layer: 'Economic',
      region: 'Africa',
      country: 'Ghana',
      city: 'Accra',
      lat: 54,
      lng: 48,
      type: 'TREND',
      importance: 91,
      confidence: 88,
      details: 'Instant PAPSS multi-currency cross-border settlement engine deployed across 12 countries.'
    },
    {
      id: 'pin_paris_sovereign',
      title: 'Global Sovereign Data Governance Accord',
      layer: 'Political',
      region: 'Europe',
      country: 'France',
      city: 'Paris',
      lat: 30,
      lng: 49,
      type: 'EVENT',
      importance: 89,
      confidence: 91,
      details: 'Paris High-Level Summit on Algorithmic Transparency and AI Ethics.'
    },
    {
      id: 'pin_dc_semiconductors',
      title: 'Strategic Energy & Tech Defense Investment',
      layer: 'Security',
      region: 'North America',
      country: 'United States',
      city: 'Washington',
      lat: 34,
      lng: 24,
      type: 'BREAKING',
      importance: 94,
      confidence: 93,
      details: 'Sovereign microchip manufacturing accord signed to secure critical tech supply chains.'
    },
    {
      id: 'pin_tokyo_compute',
      title: 'Next-Gen Quantum Hardware Consortium',
      layer: 'Science',
      region: 'Asia',
      country: 'Japan',
      city: 'Tokyo',
      lat: 36,
      lng: 85,
      type: 'TREND',
      importance: 90,
      confidence: 89,
      details: 'Joint research agreement signed for high-density silicon quantum processing units.'
    },
    {
      id: 'pin_dubai_finance',
      title: 'Sovereign Wealth Clean Capital Pool',
      layer: 'Economic',
      region: 'Middle East',
      country: 'UAE',
      city: 'Dubai',
      lat: 42,
      lng: 66,
      type: 'STORY',
      importance: 87,
      confidence: 92,
      details: '$12B Middle East & African Infrastructure Fund established in Dubai.'
    }
  ];

  const filteredPins = pins.filter(pin => {
    const matchesLayer = selectedLayer === 'All' || pin.layer === selectedLayer;
    const matchesRegion = selectedRegion === 'Global' || 
      (selectedRegion === 'Africa' && pin.region === 'Africa') ||
      (selectedRegion === 'Europe' && pin.region === 'Europe') ||
      (selectedRegion === 'Asia' && pin.region === 'Asia') ||
      (selectedRegion === 'Americas' && (pin.region === 'North America' || pin.region === 'South America')) ||
      (selectedRegion === 'Middle East' && pin.region === 'Middle East');
    return matchesLayer && matchesRegion;
  });

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col">
      {/* Map Control Bar */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400 animate-spin-slow" />
          <h3 className="font-bold text-white text-base">Global Intelligence Map</h3>
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/30 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE TELEMETRY
          </span>
        </div>

        {/* Region Filters */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {(['Global', 'Africa', 'Europe', 'Asia', 'Americas', 'Middle East'] as FilterRegion[]).map(reg => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Filter Pills */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Layers:
        </span>
        {(['All', 'Political', 'Economic', 'Technology', 'Climate', 'Science', 'Security'] as MapLayer[]).map(layer => (
          <button
            key={layer}
            onClick={() => setSelectedLayer(layer)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all shrink-0 cursor-pointer ${
              selectedLayer === layer
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* Interactive Digital Twin World Stage */}
      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden flex items-center justify-center">
        {/* Stylized Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        
        {/* World Map Background SVG outline representation */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 1000 500" fill="none">
          <path d="M150 150 Q200 100 300 160 T450 200 T600 150 T800 220" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M200 300 Q350 250 500 380 T750 320" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>

        {/* Dynamic Pins */}
        {filteredPins.map(pin => {
          const isSelected = activePin?.id === pin.id;
          return (
            <div
              key={pin.id}
              onClick={() => setActivePin(pin)}
              style={{ top: `${pin.lat}%`, left: `${pin.lng}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10`}
            >
              <div className="relative flex items-center justify-center">
                <span className={`absolute w-7 h-7 rounded-full animate-ping ${
                  pin.type === 'BREAKING' ? 'bg-red-500/40' : pin.type === 'EVENT' ? 'bg-blue-500/40' : 'bg-emerald-500/40'
                }`} />
                <div className={`relative p-2 rounded-full border-2 shadow-lg transition-transform duration-300 group-hover:scale-125 ${
                  isSelected ? 'scale-125 ring-4 ring-cyan-400' : ''
                } ${
                  pin.type === 'BREAKING' ? 'bg-red-600 border-red-300 text-white' :
                  pin.type === 'EVENT' ? 'bg-blue-600 border-blue-300 text-white' :
                  'bg-emerald-600 border-emerald-300 text-white'
                }`}>
                  {pin.type === 'BREAKING' ? <Flame className="w-3.5 h-3.5 animate-bounce" /> :
                   pin.type === 'EVENT' ? <Radio className="w-3.5 h-3.5" /> :
                   <Zap className="w-3.5 h-3.5" />}
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                  <div className="px-2.5 py-1 bg-slate-900/95 border border-slate-700 text-white text-[11px] font-bold rounded-md shadow-xl whitespace-nowrap">
                    {pin.title} ({pin.city})
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Pin Details Drawer overlay when clicked */}
        {activePin && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-blue-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-md z-20 animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  activePin.type === 'BREAKING' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}>
                  {activePin.layer} • {activePin.type}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" /> {activePin.city}, {activePin.country}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base">{activePin.title}</h4>
              <p className="text-xs text-slate-300">{activePin.details}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right font-mono text-xs">
                <div className="text-emerald-400 font-bold">{activePin.confidence}% Trust Score</div>
                <div className="text-slate-400">Importance: {activePin.importance}/100</div>
              </div>
              <button
                onClick={() => setActivePin(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Events Summary Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div>Active Intelligence Pins: <span className="text-white font-bold">{filteredPins.length}</span></div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Breaking</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Events</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Trends</span>
        </div>
      </div>
    </div>
  );
};
