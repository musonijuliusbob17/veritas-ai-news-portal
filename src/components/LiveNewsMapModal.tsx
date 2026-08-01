import React, { useState } from 'react';
import { Article, Category } from '../types';
import { Globe, MapPin, X, Flame, ShieldCheck, Filter, ChevronRight, RefreshCw, Zap } from 'lucide-react';

interface LiveNewsMapModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface MapMarker {
  id: string;
  article: Article;
  lat: number;
  lng: number;
  label: string;
  city: string;
  category: Category;
  severity: 'high' | 'medium' | 'normal';
}

const MAP_MARKERS: MapMarker[] = [
  {
    id: 'm1',
    article: null as any, // linked dynamically
    lat: 38.8951,
    lng: -77.0364,
    label: 'Washington D.C. Energy & Tariff Summit',
    city: 'Washington D.C., USA',
    category: 'Politics',
    severity: 'high'
  },
  {
    id: 'm2',
    article: null as any,
    lat: 51.5074,
    lng: -0.1278,
    label: 'London Global Tech AI Regulatory Summit',
    city: 'London, UK',
    category: 'Technology',
    severity: 'medium'
  },
  {
    id: 'm3',
    article: null as any,
    lat: -1.2921,
    lng: 36.8219,
    label: 'Nairobi Africa Innovation & Trade Expo',
    city: 'Nairobi, Kenya',
    category: 'Business',
    severity: 'medium'
  },
  {
    id: 'm4',
    article: null as any,
    lat: 35.6762,
    lng: 139.6503,
    label: 'Tokyo High-Tech Semiconductor Consortium',
    city: 'Tokyo, Japan',
    category: 'Technology',
    severity: 'high'
  },
  {
    id: 'm5',
    article: null as any,
    lat: 48.8566,
    lng: 2.3522,
    label: 'Paris Climate Accord Implementation Talks',
    city: 'Paris, France',
    category: 'Climate',
    severity: 'normal'
  },
  {
    id: 'm6',
    article: null as any,
    lat: 25.2048,
    lng: 55.2708,
    label: 'Dubai Sovereign Energy & Finance Forum',
    city: 'Dubai, UAE',
    category: 'Finance',
    severity: 'high'
  },
  {
    id: 'm7',
    article: null as any,
    lat: -23.5505,
    lng: -46.6333,
    label: 'São Paulo Amazon Bio-Economy Summit',
    city: 'São Paulo, Brazil',
    category: 'Climate',
    severity: 'medium'
  },
  {
    id: 'm8',
    article: null as any,
    lat: -33.8688,
    lng: 151.2093,
    label: 'Sydney Pacific Subsea Fiber Expansion',
    city: 'Sydney, Australia',
    category: 'Technology',
    severity: 'normal'
  }
];

export const LiveNewsMapModal: React.FC<LiveNewsMapModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);

  // Link map markers to actual articles or fallback
  const mappedMarkers = MAP_MARKERS.map((m, idx) => {
    const linkedArticle = articles[idx % articles.length] || articles[0];
    return {
      ...m,
      article: linkedArticle
    };
  });

  const filteredMarkers = selectedFilter === 'All'
    ? mappedMarkers
    : mappedMarkers.filter(m => m.category.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">LIVE GLOBAL GEOSPATIAL NEWS MAP</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  REAL-TIME SATELLITE FEED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive real-time map displaying geo-located verified dispatches and story clusters worldwide.
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

        {/* Filter Toolbar */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter Category:
            </span>
            {['All', 'Politics', 'Technology', 'Finance', 'Climate', 'Business'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedFilter === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> Breaking/High Alert
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Developing
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Verified Standard
            </span>
          </div>
        </div>

        {/* Map Body & Side Drawer Layout */}
        <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden bg-slate-950">
          {/* Visual Interactive Map Canvas */}
          <div className="flex-1 relative min-h-[350px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col justify-between overflow-hidden">
            {/* Background Map Grid Graphic */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

            {/* Stylized Vector World Map Graphic */}
            <svg className="w-full h-full opacity-30 absolute inset-0 text-slate-700" viewBox="0 0 1000 500" fill="currentColor">
              {/* Simplified World Continents Paths */}
              <path d="M150,150 Q180,120 250,140 Q300,160 320,220 Q280,260 200,240 Q140,220 150,150 Z" /> {/* N. America */}
              <path d="M250,280 Q290,270 320,320 Q310,400 270,440 Q240,400 250,280 Z" /> {/* S. America */}
              <path d="M450,120 Q550,110 580,160 Q540,200 470,180 Q440,150 450,120 Z" /> {/* Europe */}
              <path d="M460,200 Q560,190 580,280 Q550,380 480,350 Q440,280 460,200 Z" /> {/* Africa */}
              <path d="M600,100 Q800,90 850,200 Q800,280 650,250 Q580,180 600,100 Z" /> {/* Asia */}
              <path d="M750,340 Q850,330 870,420 Q800,450 740,400 Q730,360 750,340 Z" /> {/* Oceania */}
            </svg>

            {/* Interactive Pins */}
            <div className="absolute inset-0 relative z-10 p-8">
              {filteredMarkers.map((marker, idx) => {
                // Approximate coordinates projection on SVG area
                const leftPct = ((marker.lng + 180) / 360) * 85 + 5;
                const topPct = ((90 - marker.lat) / 180) * 80 + 10;
                const isSelected = activeMarker?.id === marker.id;

                return (
                  <div
                    key={marker.id}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    onClick={() => setActiveMarker(marker)}
                  >
                    {/* Pulsing ring */}
                    <div className="relative flex items-center justify-center">
                      <span className={`animate-ping absolute inline-flex h-8 w-8 rounded-full opacity-75 ${
                        marker.severity === 'high' ? 'bg-rose-500' : marker.severity === 'medium' ? 'bg-amber-400' : 'bg-blue-500'
                      }`}></span>
                      <div className={`relative p-2 rounded-full text-white shadow-xl transition-transform group-hover:scale-125 ${
                        isSelected ? 'ring-4 ring-white scale-125' : ''
                      } ${
                        marker.severity === 'high' ? 'bg-rose-600' : marker.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-600'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-20 w-48 pointer-events-none">
                        <div className="bg-slate-900 text-white text-[11px] p-2 rounded-xl border border-slate-700 shadow-xl text-center font-semibold">
                          <p className="text-amber-400 text-[10px]">{marker.city}</p>
                          <p className="line-clamp-1">{marker.label}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Telemetry Overlay Info */}
            <div className="relative z-10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 font-mono">ACTIVE SATELLITE NODES: <strong className="text-white">8 REGIONAL HUBS</strong></span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">LATENCY: 14ms | DISPATCH SYNC: OK</span>
            </div>
          </div>

          {/* Marker Detail Sidebar Drawer */}
          <div className="w-full md:w-96 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto">
            {activeMarker ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 text-xs font-bold">
                    {activeMarker.city}
                  </span>
                  <span className="text-xs text-amber-400 font-extrabold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> GEO-CLUSTER
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-white leading-snug">
                  {activeMarker.label}
                </h3>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Category: <strong>{activeMarker.article.category}</strong></span>
                    <span>Confidence: <strong className="text-emerald-400">{activeMarker.article.confidenceScore}%</strong></span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
                    {activeMarker.article.summaryMedium}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Main Source: {activeMarker.article.mainPublisher.name}</span>
                    <span className="text-slate-500 font-mono">Verified Node</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectArticle(activeMarker.article);
                    onClose();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  READ FULL VERIFIED DISPATCH <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <MapPin className="w-10 h-10 text-slate-600 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-slate-300 text-sm">SELECT A GEO-PIN ON THE MAP</h4>
                <p className="text-xs text-slate-500">
                  Click any animated node on the world map to inspect localized breaking stories, cross-verified publishers, and event timelines.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
