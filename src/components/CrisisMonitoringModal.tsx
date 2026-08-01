import React, { useState } from 'react';
import { Article } from '../types';
import { AlertTriangle, Activity, Flame, ShieldAlert, Zap, Globe, MapPin, X, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';

interface CrisisMonitoringModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface CrisisEvent {
  id: string;
  title: string;
  type: 'Earthquake' | 'Cyberattack' | 'Wildfire' | 'Conflict' | 'Aviation' | 'Flood';
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  location: string;
  timestamp: string;
  affectedPeople: string;
  status: string;
  summary: string;
  verifiedSources: string[];
}

const LIVE_CRISIS_EVENTS: CrisisEvent[] = [
  {
    id: 'cr-1',
    title: 'Magnitude 6.4 Offshore Seismic Event & Tsunami Advisory',
    type: 'Earthquake',
    severity: 'CRITICAL',
    location: 'Pacific Ocean / Honshu Coast, Japan',
    timestamp: '14 MINS AGO',
    affectedPeople: '~450,000 Coastal Residents',
    status: 'Active Advisory Issued',
    summary: 'Seismological sensors register M6.4 submarine tremor. Regional emergency agencies activate coastal warning sirens. Ocean buoys confirm minor wave displacement.',
    verifiedSources: ['Japan Meteorological Agency', 'USGS Earthquake Hazards', 'Reuters Tokyo']
  },
  {
    id: 'cr-2',
    title: 'Global Financial Infrastructure Ransomware Attack Incident',
    type: 'Cyberattack',
    severity: 'HIGH',
    location: 'Frankfurt & London Banking Nodes',
    timestamp: '42 MINS AGO',
    affectedPeople: '12 Tier-1 European Banks',
    status: 'Containment Protocol Active',
    summary: 'Coordinated zero-day exploit targeting interbank messaging gateways. Backup cold-storage systems activated. No customer fund loss reported.',
    verifiedSources: ['ENISA Cyber Agency', 'European Central Bank Cyber Desk', 'Financial Times']
  },
  {
    id: 'cr-3',
    title: 'Subsea Fiber Optical Telecom Outage',
    type: 'Aviation',
    severity: 'MODERATE',
    location: 'Red Sea International Cable Corridor',
    timestamp: '1 HOUR AGO',
    affectedPeople: 'East Africa & Gulf Internet Backbone',
    status: 'Repair Vessel En Route',
    summary: 'Sensors detect physical signal loss on two major undersea fiber pairs. Rerouting traffic via trans-African terrestrial microwave links.',
    verifiedSources: ['Subsea Cable Maintenance Consortium', 'BBC Technology', 'AP News']
  },
  {
    id: 'cr-4',
    title: 'East African Severe Drought Early Warning & Crop Forecast',
    type: 'Flood',
    severity: 'HIGH',
    location: 'Horn of Africa Regional Sector',
    timestamp: '2 HOURS AGO',
    affectedPeople: '1.2M Agricultural Producers',
    status: 'UN Aid Logistics Dispatched',
    summary: 'Satellite soil moisture readings indicate prolonged rainfall deficits. Emergency grain reserves unlocked in coordination with regional governments.',
    verifiedSources: ['UN Food & Agriculture Org', 'IGAD Climate Center', 'Kenya Meteorological Dept']
  }
];

export const CrisisMonitoringModal: React.FC<CrisisMonitoringModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [activeCrisis, setActiveCrisis] = useState<CrisisEvent>(LIVE_CRISIS_EVENTS[0]);

  const filteredEvents = selectedType === 'All'
    ? LIVE_CRISIS_EVENTS
    : LIVE_CRISIS_EVENTS.filter(e => e.type.toLowerCase() === selectedType.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white shadow-lg shadow-rose-500/20">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">LIVE GLOBAL CRISIS & EMERGENCY MONITORING RADAR</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  HIGH ALERT RADAR
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Continuous satellite and newsroom telemetry monitoring natural disasters, cyber incidents, and global security events.
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

        {/* Filter Bar */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Earthquake', 'Cyberattack', 'Flood', 'Aviation'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedType === t
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-rose-500 animate-bounce" /> LIVE SENSOR FEED
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950">
          {/* Left Event List */}
          <div className="w-full md:w-88 bg-slate-900 border-r border-slate-800 p-4 space-y-3 overflow-y-auto">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              ACTIVE INCIDENTS ({filteredEvents.length})
            </h3>
            {filteredEvents.map(event => {
              const isSelected = activeCrisis.id === event.id;
              return (
                <div
                  key={event.id}
                  onClick={() => setActiveCrisis(event)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-950 to-slate-900 border-rose-500 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold font-mono ${
                      event.severity === 'CRITICAL' ? 'bg-rose-900 text-rose-300' : 'bg-amber-900 text-amber-300'
                    }`}>
                      {event.severity}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{event.timestamp}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-white leading-snug">{event.title}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" /> {event.location}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Active Incident Dossier */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Incident Header Card */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-950 text-rose-300 border border-rose-800">
                  {activeCrisis.type} INCIDENT
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> VERIFIED BY OFFICIAL SOURCES
                </span>
              </div>

              <h2 className="text-xl font-black text-white">{activeCrisis.title}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">LOCATION</span>
                  <strong className="text-white">{activeCrisis.location}</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">AFFECTED REGION</span>
                  <strong className="text-amber-400">{activeCrisis.affectedPeople}</strong>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">SATELLITE & TELEMETRY SUMMARY</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{activeCrisis.summary}</p>
              </div>

              {/* Verified Sources */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">CORROBORATING AUTHORITIES</h4>
                <div className="flex flex-wrap gap-2">
                  {activeCrisis.verifiedSources.map((src, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Matching Articles */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                CORRESPONDING DISPATCHES IN VERITAS ARCHIVE
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.slice(0, 2).map(art => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2"
                  >
                    <span className="text-[11px] text-rose-400 font-bold">{art.mainPublisher.name}</span>
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
