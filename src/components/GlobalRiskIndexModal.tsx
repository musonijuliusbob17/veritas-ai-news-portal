import React, { useState } from 'react';
import { Article } from '../types';
import { ShieldAlert, Globe, Activity, TrendingUp, AlertTriangle, Layers, Truck, Cpu, Zap, Anchor, X, ArrowUpRight, Search, FileText, CheckCircle2 } from 'lucide-react';

interface GlobalRiskIndexModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface SovereignRiskProfile {
  country: string;
  flag: string;
  overallRisk: number; // 0 - 100
  status: 'STABLE' | 'MODERATE' | 'ELEVATED' | 'HIGH CRITICAL';
  politicalRisk: number;
  economicRisk: number;
  securityRisk: number;
  climateRisk: number;
  techRisk: number;
  supplyChainRisk: number;
  primaryRiskDrivers: string[];
}

interface SupplyChainNode {
  sector: string;
  iconName: string;
  riskScore: number;
  status: 'OPTIMAL' | 'MODERATE BOTTLENECK' | 'CRITICAL DISRUPTION';
  keyChokepoints: string[];
  affectedCompanies: string[];
  alternativeRoutes: string;
  latestEvent: string;
}

interface DetectedEventItem {
  eventId: string;
  timestamp: string;
  category: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  location: string;
  affectedEntities: string[];
  confidence: number;
  impactAssessment: string;
}

const SOVEREIGN_RISK_DATA: SovereignRiskProfile[] = [
  {
    country: 'Taiwan',
    flag: '🇹🇼',
    overallRisk: 78,
    status: 'ELEVATED',
    politicalRisk: 82,
    economicRisk: 45,
    securityRisk: 85,
    climateRisk: 40,
    techRisk: 30,
    supplyChainRisk: 88,
    primaryRiskDrivers: ['Geopolitical Strait Tension', 'Semiconductor Foundry Concentration', 'Cyber Operations']
  },
  {
    country: 'Ukraine',
    flag: '🇺🇦',
    overallRisk: 91,
    status: 'HIGH CRITICAL',
    politicalRisk: 95,
    economicRisk: 88,
    securityRisk: 96,
    climateRisk: 50,
    techRisk: 60,
    supplyChainRisk: 82,
    primaryRiskDrivers: ['Active Armed Conflict', 'Black Sea Grain Trade Corridors', 'Energy Grid Infrastructure']
  },
  {
    country: 'Germany',
    flag: '🇩🇪',
    overallRisk: 28,
    status: 'STABLE',
    politicalRisk: 22,
    economicRisk: 38,
    securityRisk: 20,
    climateRisk: 30,
    techRisk: 18,
    supplyChainRisk: 35,
    primaryRiskDrivers: ['Industrial Energy Transition Costs', 'Manufacturing Export Demands']
  },
  {
    country: 'Kenya',
    flag: '🇰🇪',
    overallRisk: 34,
    status: 'STABLE',
    politicalRisk: 35,
    economicRisk: 40,
    securityRisk: 28,
    climateRisk: 45,
    techRisk: 20,
    supplyChainRisk: 30,
    primaryRiskDrivers: ['Horticultural Export Freight Costs', 'Drought Climate Adaptations']
  },
  {
    country: 'Singapore',
    flag: '🇸🇬',
    overallRisk: 14,
    status: 'STABLE',
    politicalRisk: 10,
    economicRisk: 15,
    securityRisk: 12,
    climateRisk: 25,
    techRisk: 10,
    supplyChainRisk: 20,
    primaryRiskDrivers: ['Maritime Strait Traffic Density', 'Global Trade Tariffs']
  }
];

const SUPPLY_CHAIN_DATA: SupplyChainNode[] = [
  {
    sector: 'Semiconductor Fabrication & Packaging',
    iconName: 'Cpu',
    riskScore: 84,
    status: 'CRITICAL DISRUPTION',
    keyChokepoints: ['Hsinchu Science Park Taiwan', 'Malaysian Assembly Hubs', 'Neogas Ukraine Refineries'],
    affectedCompanies: ['TSMC', 'Nvidia', 'Apple', 'ASML', 'AMD'],
    alternativeRoutes: 'Accelerate Arizona Fab 21 & Dresden European Silicon Foundry capacity.',
    latestEvent: 'High-purity neon gas supply tightness raises wafer fabrication lead times by 4 weeks.'
  },
  {
    sector: 'Lithium & Critical Battery Minerals',
    iconName: 'Zap',
    riskScore: 68,
    status: 'MODERATE BOTTLENECK',
    keyChokepoints: ['Atacama Salt Flats Chile', 'DRC Cobalt Belt', 'Yichun Lithium Refineries'],
    affectedCompanies: ['Tesla', 'BYD', 'Albemarle', 'CATL', 'LG Energy Solution'],
    alternativeRoutes: 'Expand Australian Hard-Rock Spodumene processing & North American recycling.',
    latestEvent: 'Export license quotas in South America tighten refined lithium carbonate international availability.'
  },
  {
    sector: 'Maritime Container Shipping & Logistics',
    iconName: 'Anchor',
    riskScore: 72,
    status: 'MODERATE BOTTLENECK',
    keyChokepoints: ['Bab-el-Mandeb Strait', 'Suez Canal Transit', 'Panama Canal Locks'],
    affectedCompanies: ['Maersk', 'MSC', 'Hapag-Lloyd', 'COSCO', 'Amazon'],
    alternativeRoutes: 'Cape of Good Hope rerouting adding 10-14 transit days to Asia-Europe trade lanes.',
    latestEvent: 'Panama Canal water levels restrict daily vessel transit slots to 32 ships.'
  }
];

const UNIVERSAL_EVENTS: DetectedEventItem[] = [
  {
    eventId: 'EVT-2026-9041',
    timestamp: '28 MINS AGO',
    category: 'GEOPOLITICS & MARITIME',
    title: 'Bab-el-Mandeb Strait Maritime Transit Advisory Issued',
    severity: 'HIGH',
    location: 'Red Sea / Gulf of Aden',
    affectedEntities: ['Maersk', 'Global Tanker Fleet', 'IMO'],
    confidence: 96,
    impactAssessment: 'Rerouting container ships around Cape of Good Hope increases fuel expenditure by 22% and adds 12 days to Asia-EU supply routes.'
  },
  {
    eventId: 'EVT-2026-8812',
    timestamp: '2 HOURS AGO',
    category: 'MACROECONOMICS & REGULATION',
    title: 'EU Enforces Carbon Border Adjustment Mechanism (CBAM) Phase 2',
    severity: 'MODERATE',
    location: 'Brussels, Belgium',
    affectedEntities: ['ArcelorMittal', 'Aluminum Exporters', 'African Steel Millers'],
    confidence: 94,
    impactAssessment: 'Imposes carbon intensity tariffs on imported steel, aluminum, and fertilizer shipments into European markets.'
  },
  {
    eventId: 'EVT-2026-7490',
    timestamp: '5 HOURS AGO',
    category: 'CYBERSECURITY & INFRASTRUCTURE',
    title: 'Zero-Day Exploit Targeted Critical Power Distribution Network',
    severity: 'CRITICAL',
    location: 'Eastern European Energy Grid',
    affectedEntities: ['National Grid Operators', 'CERT-EU', 'Siemens Energy'],
    confidence: 98,
    impactAssessment: 'Automated containment prevented blackouts; firmware patches deployed across 140 regional substations.'
  }
];

export const GlobalRiskIndexModal: React.FC<GlobalRiskIndexModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'sovereign' | 'supply'>('events');
  const [selectedCountry, setSelectedCountry] = useState<SovereignRiskProfile>(SOVEREIGN_RISK_DATA[0]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS GLOBAL RISK INDEX & SUPPLY CHAIN OBSERVATORY</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-950 text-rose-300 border border-rose-800">
                  REAL-TIME RISK ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Universal event detection system, sovereign risk modeling, and critical supply chain bottleneck monitoring.
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

        {/* Navigation Tabs */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-3 text-xs">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'events' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Universal Event Detection Engine ({UNIVERSAL_EVENTS.length})
          </button>
          <button
            onClick={() => setActiveTab('sovereign')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'sovereign' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌐 Sovereign Country Risk Index
          </button>
          <button
            onClick={() => setActiveTab('supply')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'supply' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📦 Critical Supply Chain Vulnerabilities
          </button>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 space-y-6">
          {/* TAB 1: UNIVERSAL EVENT DETECTION ENGINE */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  REAL-TIME EVENT STREAM (AUTOMATICALLY CLUSTERED & ASSESSED)
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">● ACTIVE STREAM DETECTING 4,200 DISPATCHES/SEC</span>
              </div>

              <div className="space-y-3">
                {UNIVERSAL_EVENTS.map(evt => (
                  <div
                    key={evt.eventId}
                    className="bg-slate-900 p-5 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold font-mono ${
                          evt.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                          evt.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-blue-400'
                        }`}>
                          SEVERITY: {evt.severity}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{evt.category}</span>
                        <span className="text-xs font-mono text-slate-500">• ID: {evt.eventId}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{evt.timestamp}</span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base text-white">{evt.title}</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                        <strong className="text-rose-400 block text-[10px] font-mono mb-0.5">VERITAS STRATEGIC IMPACT ASSESSMENT</strong>
                        {evt.impactAssessment}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 pt-1">
                      <div className="flex items-center gap-2">
                        <span>Location: <strong className="text-slate-200">{evt.location}</strong></span>
                        <span>• Affected: <strong className="text-slate-200">{evt.affectedEntities.join(', ')}</strong></span>
                      </div>
                      <span className="text-emerald-400 font-bold">Confidence: {evt.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SOVEREIGN RISK INDEX */}
          {activeTab === 'sovereign' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sovereign List Sidebar */}
              <div className="w-full md:w-80 space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  COUNTRY RISK MATRIX
                </h3>

                {SOVEREIGN_RISK_DATA.map(c => {
                  const isSelected = selectedCountry.country === c.country;
                  return (
                    <div
                      key={c.country}
                      onClick={() => setSelectedCountry(c)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-gradient-to-r from-rose-950 to-slate-900 border-rose-500 shadow-lg'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{c.flag} {c.country}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          c.overallRisk > 75 ? 'bg-rose-950 text-rose-400' :
                          c.overallRisk > 40 ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Risk Score:</span>
                        <strong className="text-white text-sm">{c.overallRisk}/100</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sovereign Detailed Breakdown Panel */}
              <div className="flex-1 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedCountry.flag}</span>
                    <div>
                      <h3 className="text-xl font-black text-white">{selectedCountry.country} Sovereign Dossier</h3>
                      <span className="text-xs font-mono text-slate-400">STATUS: {selectedCountry.status}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-slate-400 block text-[10px]">COMPOSITE RISK INDEX</span>
                    <strong className="text-rose-400 text-2xl font-black">{selectedCountry.overallRisk}/100</strong>
                  </div>
                </div>

                {/* Sub-Risk Score Grids */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">POLITICAL RISK</span>
                    <strong className="text-amber-400 text-sm">{selectedCountry.politicalRisk}/100</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">ECONOMIC STABILITY</span>
                    <strong className="text-emerald-400 text-sm">{selectedCountry.economicRisk}/100</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">SECURITY & CONFLICT</span>
                    <strong className="text-rose-400 text-sm">{selectedCountry.securityRisk}/100</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">CLIMATE DISRUPTION</span>
                    <strong className="text-blue-400 text-sm">{selectedCountry.climateRisk}/100</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">TECH VULNERABILITY</span>
                    <strong className="text-indigo-400 text-sm">{selectedCountry.techRisk}/100</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">SUPPLY CHAIN CHOKE</span>
                    <strong className="text-purple-400 text-sm">{selectedCountry.supplyChainRisk}/100</strong>
                  </div>
                </div>

                {/* Primary Drivers */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">PRIMARY CATALYST RISK DRIVERS</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.primaryRiskDrivers.map((driver, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-rose-300">
                        ⚠ {driver}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CRITICAL SUPPLY CHAIN VULNERABILITIES */}
          {activeTab === 'supply' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  STRATEGIC COMMODITY & CHOKEPOINT OBSERVATORY
                </h3>
              </div>

              <div className="space-y-4">
                {SUPPLY_CHAIN_DATA.map((node, idx) => (
                  <div key={idx} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-amber-400">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-white">{node.sector}</h4>
                          <span className="text-xs font-mono text-slate-400">VULNERABILITY SCORE: {node.riskScore}/100</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                        node.status === 'CRITICAL DISRUPTION' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {node.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                        <span className="text-slate-500 block">KEY MARITIME / LAND CHOKEPOINTS</span>
                        <strong className="text-slate-200 block">{node.keyChokepoints.join(', ')}</strong>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                        <span className="text-slate-500 block">PRIMARY EXPOSED ENTERPRISES</span>
                        <strong className="text-amber-400 block">{node.affectedCompanies.join(', ')}</strong>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
                      <span className="text-emerald-400 font-mono font-bold text-[10px] uppercase">RECOMMENDED ALTERNATIVE LOGISTICS CORRIDORS</span>
                      <p className="leading-relaxed">{node.alternativeRoutes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
