import React, { useState } from 'react';
import { Article, Region, Category } from '../types';
import { EventDetectionEngine, IntelligenceEvent } from '../services/EventDetectionEngine';
import { GlobalDataIngestionEngine, IngestedItem } from '../services/GlobalDataIngestionEngine';
import { BreakingNewsEngine, BreakingAlert } from '../services/BreakingNewsEngine';
import { Globe, ShieldCheck, Flame, Zap, MapPin, Filter, Layers, ArrowUpRight, Activity, Radio, Sparkles } from 'lucide-react';

interface GlobalIntelligenceMapProps {
  articles: Article[];
  onSelectArticle?: (article: Article) => void;
}

export const GlobalIntelligenceMap: React.FC<GlobalIntelligenceMapProps> = ({
  articles,
  onSelectArticle
}) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
  const [selectedLayer, setSelectedLayer] = useState<Category | 'All'>('All');
  const [selectedEvent, setSelectedEvent] = useState<IntelligenceEvent | null>(null);

  const events = EventDetectionEngine.detectEvents(articles);
  const breakingAlerts = BreakingNewsEngine.getActiveBreakingAlerts(articles);

  const regionsList: (Region | 'All')[] = ['All', 'Africa', 'Europe', 'Asia', 'North America', 'South America', 'Middle East'];
  const layersList: (Category | 'All')[] = ['All', 'Politics', 'Business', 'Technology', 'Climate', 'Science'];

  const filteredEvents = events.filter(evt => {
    const matchRegion = selectedRegion === 'All' || evt.location.region === selectedRegion;
    const matchLayer = selectedLayer === 'All' || evt.eventType === selectedLayer || (selectedLayer === 'Business' && evt.eventType === 'Economic');
    return matchRegion && matchLayer;
  });

  // Mock Geographical Map Nodes
  const mapNodes = [
    { id: 'node_rwanda', name: 'Kigali AI Hub & Innovation Corridor', country: 'Rwanda', region: 'Africa', category: 'Technology', coords: { x: '54%', y: '58%' }, importance: 96, pulse: true },
    { id: 'node_kenya', name: 'Nairobi Silicon Savannah & Clean Grid', country: 'Kenya', region: 'Africa', category: 'Climate', coords: { x: '57%', y: '55%' }, importance: 92, pulse: true },
    { id: 'node_ghana', name: 'Accra AfCFTA Trade Secretariat', country: 'Ghana', region: 'Africa', category: 'Business', coords: { x: '46%', y: '52%' }, importance: 88, pulse: false },
    { id: 'node_france', name: 'Paris Global AI Policy Forum', country: 'France', region: 'Europe', category: 'Politics', coords: { x: '48%', y: '30%' }, importance: 85, pulse: false },
    { id: 'node_usa', name: 'Washington International Tech Strategy', country: 'United States', region: 'North America', category: 'Technology', coords: { x: '25%', y: '35%' }, importance: 90, pulse: false },
    { id: 'node_uae', name: 'Dubai Future Trade & Logistics', country: 'UAE', region: 'Middle East', category: 'Business', coords: { x: '65%', y: '42%' }, importance: 89, pulse: false }
  ];

  const visibleNodes = mapNodes.filter(node => {
    const matchRegion = selectedRegion === 'All' || node.region === selectedRegion;
    const matchLayer = selectedLayer === 'All' || node.category === selectedLayer;
    return matchRegion && matchLayer;
  });

  return (
    <div className="space-y-6">
      
      {/* Controls & Filter Header */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              REAL-TIME GLOBAL INTELLIGENCE MAP
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Live Monitoring Across Regional Nodes, Active Events & Ingestion Feeds
            </p>
          </div>
        </div>

        {/* Region Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Region:
          </span>
          {regionsList.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedRegion === r 
                  ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Filters */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono px-1">
        <span className="text-slate-400 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Intelligence Layer:
        </span>
        {layersList.map(l => (
          <button
            key={l}
            onClick={() => setSelectedLayer(l)}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedLayer === l 
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold' 
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            {l}
          </button>
        ))}
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
        
        {/* World Map Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        
        {/* Stylized Vector World Continents Contour lines */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <Globe className="w-96 h-96 text-indigo-400" />
        </div>

        {/* Live Regional Pulse Radar Badges */}
        {visibleNodes.map(node => (
          <div
            key={node.id}
            style={{ left: node.coords.x, top: node.coords.y }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            onClick={() => {
              const matchedEvt = events.find(e => e.location.country === node.country);
              if (matchedEvt) setSelectedEvent(matchedEvt);
            }}
          >
            <div className="relative flex items-center justify-center">
              {node.pulse && (
                <span className="absolute w-8 h-8 rounded-full bg-indigo-500/40 animate-ping" />
              )}
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 border-2 border-slate-950 shadow-lg shadow-cyan-500/50 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>

            {/* Hover Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex flex-col p-2.5 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl shadow-xl text-[11px] font-mono whitespace-nowrap z-20">
              <span className="font-bold text-white">{node.name}</span>
              <span className="text-slate-400">{node.country} • {node.category}</span>
              <span className="text-emerald-400 font-bold">Score: {node.importance}%</span>
            </div>
          </div>
        ))}

        {/* Floating Map Legend */}
        <div className="absolute bottom-3 left-3 p-3 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl text-[10px] font-mono space-y-1 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span className="text-slate-300">Live Priority Intelligence Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-400">Verified Coverage Node</span>
          </div>
        </div>
      </div>

      {/* Active Detected Events List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          ACTIVE DETECTED EVENTS ({filteredEvents.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map(evt => (
            <div
              key={evt.event_id}
              onClick={() => setSelectedEvent(evt)}
              className={`p-4 bg-slate-950 hover:bg-slate-900 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                selectedEvent?.event_id === evt.event_id ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-mono font-bold">
                  {evt.eventType.toUpperCase()} EVENT
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Imp: {evt.importance}% | Conf: {evt.confidence}%
                </span>
              </div>

              <h5 className="text-sm font-bold text-white">{evt.title}</h5>

              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="text-slate-400">📍 {evt.location.city || evt.location.country}, {evt.location.region}</span>
                {evt.entities.slice(0, 3).map(ent => (
                  <span key={ent} className="px-1.5 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">
                    {ent}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
