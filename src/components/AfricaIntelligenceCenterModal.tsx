import React, { useState } from 'react';
import { Article } from '../types';
import {
  Compass,
  Globe,
  ShieldCheck,
  TrendingUp,
  Zap,
  Building2,
  MapPin,
  X,
  ArrowUpRight,
  Search,
  FileText,
  Sparkles,
  Layers,
  Radio,
  Activity,
  Landmark,
  Scale,
  Award,
  Cpu,
  BarChart2,
  CheckCircle2
} from 'lucide-react';

interface AfricaIntelligenceCenterModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

type IntelligenceTier = 'rwanda' | 'east_africa' | 'pan_africa' | 'global';

interface CountryProfile {
  name: string;
  flag: string;
  iso: string;
  capital: string;
  gdpGrowth: string;
  afcftaScore: number;
  riskRating: 'STABLE' | 'LOW' | 'MODERATE' | 'ELEVATED';
  primarySectors: string[];
  keyProjects: string;
  recentInsight: string;
}

const RWANDA_PROVINCES = [
  {
    name: 'Kigali City (HQ)',
    capital: 'Kigali',
    focus: 'Tech Innovation City, Financial Hub, CMU-Africa, Sovereign AI, Eco-Tourism Hub',
    status: 'OPTIMAL (98% Digital)',
    gdpContribution: '42%'
  },
  {
    name: 'Northern Province',
    capital: 'Musanze',
    focus: 'Volcanoes National Park Eco-Tourism, High-Altitude Agritech, Hydro Energy',
    status: 'STABLE',
    gdpContribution: '15%'
  },
  {
    name: 'Southern Province',
    capital: 'Huye / Nyanza',
    focus: 'University of Rwanda Research HQ, Cultural Heritage, Agritech & Coffee Processing',
    status: 'STABLE',
    gdpContribution: '14%'
  },
  {
    name: 'Eastern Province',
    capital: 'Rwamagana / Bugesera',
    focus: 'Bugesera International Airport, Special Economic Zone, Livestock & Solar Energy',
    status: 'EXPANDING',
    gdpContribution: '16%'
  },
  {
    name: 'Western Province',
    capital: 'Rubavu / Karongi',
    focus: 'Lake Kivu Methane Energy, Tea Estates, Cross-Border DRC Trade Corridor',
    status: 'STABLE',
    gdpContribution: '13%'
  }
];

const EAC_MEMBER_STATES: CountryProfile[] = [
  {
    name: 'Rwanda',
    flag: '🇷🇼',
    iso: 'RWA',
    capital: 'Kigali',
    gdpGrowth: '+7.8%',
    afcftaScore: 94,
    riskRating: 'STABLE',
    primarySectors: ['Sovereign AI & Fintech', 'Eco-Tourism', 'Green Bonds (Ireme)', '3T Minerals'],
    keyProjects: 'Kigali Innovation City & Bugesera International Logistics Airport',
    recentInsight: 'Rwanda anchors East Africa in digital governance integration, green bond issuance, and high-tech services.'
  },
  {
    name: 'Kenya',
    flag: '🇰🇪',
    iso: 'KEN',
    capital: 'Nairobi',
    gdpGrowth: '+5.4%',
    afcftaScore: 91,
    riskRating: 'STABLE',
    primarySectors: ['Silicon Savannah Tech', 'Geothermal Power', 'Horticulture', 'Financial Services'],
    keyProjects: 'Konza Technopolis & Northern Corridor Highway Modernization',
    recentInsight: 'Mobile financial transactions reach record highs as geothermal energy powers over 45% of the national grid.'
  },
  {
    name: 'Tanzania',
    flag: '🇹🇿',
    iso: 'TZA',
    capital: 'Dodoma / Dar es Salaam',
    gdpGrowth: '+5.2%',
    afcftaScore: 87,
    riskRating: 'STABLE',
    primarySectors: ['Standard Gauge Railway', 'Gold Mining', 'Port Logistics', 'Agriculture'],
    keyProjects: 'Dar es Salaam Deepwater Port Expansion & Julius Nyerere Hydropower Dam',
    recentInsight: 'Central Corridor SGR electric rail freight reduces transit times to Kigali and Bujumbura by 50%.'
  },
  {
    name: 'Uganda',
    flag: '🇺🇬',
    iso: 'UGA',
    capital: 'Kampala',
    gdpGrowth: '+5.0%',
    afcftaScore: 84,
    riskRating: 'MODERATE',
    primarySectors: ['EACOP Crude Oil Pipeline', 'Coffee Exports', 'Hydropower', 'Agritech'],
    keyProjects: 'East African Crude Oil Pipeline (EACOP) & Karuma Hydroelectric Station',
    recentInsight: 'Agricultural commodity trade across the EAC single customs territory saw 18% quarter-on-quarter growth.'
  },
  {
    name: 'Democratic Republic of Congo',
    flag: '🇨🇩',
    iso: 'COD',
    capital: 'Kinshasa',
    gdpGrowth: '+6.1%',
    afcftaScore: 78,
    riskRating: 'ELEVATED',
    primarySectors: ['Cobalt & Copper Mining', 'Hydropower (Inga)', 'Timber & Forestry', 'Telecoms'],
    keyProjects: 'Grand Inga Hydropower Expansion & Kolwezi Mineral Transport Rail',
    recentInsight: 'DRC cobalt and copper production remain critical nodes for the global electric vehicle battery supply chain.'
  }
];

const PAN_AFRICAN_BLOCS: CountryProfile[] = [
  {
    name: 'Morocco',
    flag: '🇲🇦',
    iso: 'MAR',
    capital: 'Rabat',
    gdpGrowth: '+4.2%',
    afcftaScore: 92,
    riskRating: 'STABLE',
    primarySectors: ['EV Battery Manufacturing', 'Solar Desalination', 'Phosphates', 'Aeronautics'],
    keyProjects: 'Noor Ouarzazate Solar Complex & Tanger Med Port Expansion',
    recentInsight: 'Morocco anchors European-African supply chains as European automakers expand EV battery gigafactories.'
  },
  {
    name: 'Nigeria',
    flag: '🇳🇬',
    iso: 'NGA',
    capital: 'Abuja / Lagos',
    gdpGrowth: '+3.6%',
    afcftaScore: 85,
    riskRating: 'MODERATE',
    primarySectors: ['Fintech Ecosystem', 'Dangote Petroleum Complex', 'Creative Economy', 'Gas Exports'],
    keyProjects: 'Lagos Free Trade Zone & Lekki Deep Sea Port',
    recentInsight: 'PAPSS local currency settlement reduces transaction fees for West African merchants by 22%.'
  },
  {
    name: 'South Africa',
    flag: '🇿🇦',
    iso: 'ZAF',
    capital: 'Pretoria / Cape Town',
    gdpGrowth: '+2.1%',
    afcftaScore: 88,
    riskRating: 'MODERATE',
    primarySectors: ['Platinum & Rare Minerals', 'Banking & Capital Markets', 'Automotive', 'Renewables'],
    keyProjects: 'Just Energy Transition Investment Plan & Durban Port Modernization',
    recentInsight: 'Private renewable energy grid interconnections accelerate industrial manufacturing efficiency.'
  }
];

const GLOBAL_GEOPOLITICAL_NODES = [
  {
    framework: 'BRICS+ Alliance',
    leadNations: 'Brazil, Russia, India, China, South Africa, Egypt, Ethiopia, UAE, Saudi Arabia',
    impactOnAfrica: 'Local currency trade mechanisms, New Development Bank infrastructure loans, and critical mineral partnerships.',
    status: 'EXPANDING (10+ Signatories)'
  },
  {
    framework: 'EU-Africa Global Gateway',
    leadNations: 'European Union & African Union Commission',
    impactOnAfrica: '€150 Billion investment package targeting green energy corridors, digital submarine cables, and raw material processing.',
    status: 'ACTIVE ($160B Pipeline)'
  },
  {
    framework: 'US-AGOA Trade Compact',
    leadNations: 'United States & 35 Eligible African Economies',
    impactOnAfrica: 'Duty-free export privileges for 6,800+ products into US markets, driving textile and agricultural industrialization.',
    status: 'ACTIVE (RENEWAL PHASE)'
  },
  {
    framework: 'China-FOCAC Framework',
    leadNations: 'China & 53 African Signatories',
    impactOnAfrica: 'Belt and Road port, rail, and telecom infrastructure financing coupled with zero-tariff green technology exports.',
    status: 'ACTIVE ($50B 3-Yr Pledge)'
  }
];

export const AfricaIntelligenceCenterModal: React.FC<AfricaIntelligenceCenterModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [activeTier, setActiveTier] = useState<IntelligenceTier>('rwanda');
  const [selectedEacCountry, setSelectedEacCountry] = useState<CountryProfile>(EAC_MEMBER_STATES[0]);
  const [searchFilter, setSearchFilter] = useState('');

  // Filter articles by tier or query
  const filteredArticles = articles.filter(a => {
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.summaryShort.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q)
      );
    }
    if (activeTier === 'rwanda') return a.region === 'Rwanda' || a.title.toLowerCase().includes('rwanda') || a.summaryShort.toLowerCase().includes('kigali');
    if (activeTier === 'east_africa') return a.region === 'East Africa' || a.region === 'Rwanda' || a.title.toLowerCase().includes('kenya') || a.title.toLowerCase().includes('tanzania');
    if (activeTier === 'pan_africa') return a.region === 'Africa' || a.region === 'East Africa';
    return true; // Global
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-950 border border-slate-800 text-white rounded-3xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-emerald-600 text-white shadow-lg shadow-amber-500/20">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">EXPANDED GEOGRAPHIC & MACRO INTELLIGENCE HUB</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PHASE 4 EXPANSION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-tier macro intelligence spanning Rwanda (Sovereign HQ), East Africa (EAC), Pan-Africa (AfCFTA), and Global Geopolitical Interlinks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search dispatches or regions..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 lg:w-64"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 4-Tier Navigation Sub-Bar */}
        <div className="flex items-center space-x-2 px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 overflow-x-auto scrollbar-none font-mono text-xs font-bold">
          <button
            onClick={() => setActiveTier('rwanda')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTier === 'rwanda'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="text-base">🇷🇼</span>
            <span>Rwanda Sovereign HQ</span>
          </button>

          <button
            onClick={() => setActiveTier('east_africa')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTier === 'east_africa'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>East Africa (EAC Community)</span>
          </button>

          <button
            onClick={() => setActiveTier('pan_africa')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTier === 'pan_africa'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Pan-Africa (AfCFTA & PAPSS)</span>
          </button>

          <button
            onClick={() => setActiveTier('global')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTier === 'global'
                ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-300" />
            <span>Global Geopolitics & Macro</span>
          </button>
        </div>

        {/* MAIN BODY CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 space-y-6">

          {/* ========================================================================= */}
          {/* TIER 1: RWANDA SOVEREIGN HQ */}
          {/* ========================================================================= */}
          {activeTier === 'rwanda' && (
            <div className="space-y-6">
              {/* Executive Overview Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-emerald-950/60 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 text-slate-100 shadow-xl space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">🇷🇼</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-black text-white">REPUBLIC OF RWANDA</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          VERITAS REGIONAL HQ
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Capital: Kigali • Vision 2050 Framework • NST2 National Strategy for Transformation
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
                      <span className="text-slate-400 text-[10px] block">REAL GDP GROWTH</span>
                      <strong className="text-emerald-400 text-sm font-black">+7.8%</strong>
                    </div>
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
                      <span className="text-slate-400 text-[10px] block">DIGITAL SERVICES</span>
                      <strong className="text-indigo-300 text-sm font-black">98% Irembo</strong>
                    </div>
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
                      <span className="text-slate-400 text-[10px] block">GOVERNANCE INDEX</span>
                      <strong className="text-amber-300 text-sm font-black">91/100</strong>
                    </div>
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
                      <span className="text-slate-400 text-[10px] block">SOVEREIGN RISK</span>
                      <strong className="text-emerald-300 text-sm font-black">STABLE</strong>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <strong className="text-emerald-400 font-bold block mb-1">VERITAS NATIONAL STRATEGIC DOSSIER:</strong>
                  Rwanda leads East and Central Africa as a sovereign AI compute, financial service, and high-tech eco-tourism hub. With Kigali Innovation City housing premier institutions like CMU-Africa and AIMS, plus the new Bugesera International Logistics Hub, Rwanda serves as the primary regional anchor for digital governance and green finance (Ireme Serve).
                </div>
              </div>

              {/* Provinces & Regional Nodes */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>RWANDA ADMINISTRATIVE PROVINCES & SPECIAL ECONOMIC ZONES</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
                  {RWANDA_PROVINCES.map((prov, i) => (
                    <div key={i} className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 hover:border-emerald-500/40 transition">
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-xs block">{prov.name}</strong>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">{prov.status}</span>
                      </div>
                      <span className="text-[10px] text-amber-400 block">Cap: {prov.capital}</span>
                      <p className="text-[11px] text-slate-400 line-clamp-3 font-sans">{prov.focus}</p>
                      <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between">
                        <span>GDP Share:</span>
                        <strong className="text-indigo-300">{prov.gdpContribution}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rwanda Live News Dispatches */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span>VERITAS RWANDA CORRESPONDENCE & SOVEREIGN DISPATCHES ({filteredArticles.length})</span>
                  <span className="text-xs font-mono text-emerald-400">UPDATED REAL-TIME</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.slice(0, 6).map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        onSelectArticle(art);
                        onClose();
                      }}
                      className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-emerald-400 font-bold">{art.mainPublisher.name}</span>
                        <span className="text-slate-400">{art.publishedTime}</span>
                      </div>
                      <h4 className="font-bold text-xs text-white group-hover:text-emerald-300 transition line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{art.summaryShort}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TIER 2: EAST AFRICA (EAC COMMUNITY) */}
          {/* ========================================================================= */}
          {activeTier === 'east_africa' && (
            <div className="space-y-6">
              {/* EAC Overview Card */}
              <div className="bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 border border-amber-500/30 rounded-3xl p-6 text-slate-100 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-300 border border-amber-500/30">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">EAST AFRICAN COMMUNITY (EAC) REGIONAL HUB</h3>
                      <p className="text-xs text-slate-300">
                        8 Partner States • 312M+ Population • $320B Combined GDP • Single Customs Territory
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-center">
                      <span className="text-slate-400 text-[10px] block">EAC INTRA-TRADE</span>
                      <span className="text-emerald-400 font-bold">+14.2% YoY</span>
                    </div>
                    <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-center">
                      <span className="text-slate-400 text-[10px] block">PAYMENT SYSTEM</span>
                      <span className="text-amber-300 font-bold">EAPS ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Trade Corridors Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                    <strong className="text-amber-400 font-bold text-sm block">1. NORTHERN TRADE CORRIDOR</strong>
                    <span className="text-slate-300 block text-[11px]">Mombasa Port 🇰🇪 → Nairobi → Kampala 🇺🇬 → Kigali 🇷🇼 → Bujumbura 🇧🇮 → Goma 🇨🇩</span>
                    <p className="text-[10px] text-slate-400 pt-1 font-sans">High-capacity highway and proposed multimodal freight rail network for direct cargo transit.</p>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                    <strong className="text-emerald-400 font-bold text-sm block">2. CENTRAL TRADE CORRIDOR</strong>
                    <span className="text-slate-300 block text-[11px]">Dar es Salaam Port 🇹🇿 → Dodoma → Isaka SGR → Rusumo Border → Kigali 🇷🇼</span>
                    <p className="text-[10px] text-slate-400 pt-1 font-sans">Electric SGR rail network cutting transit times from Indian Ocean ports to Kigali to under 24 hours.</p>
                  </div>
                </div>
              </div>

              {/* EAC Countries Deep Dive Selector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-2">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">SELECT EAC MEMBER STATE</h3>
                  {EAC_MEMBER_STATES.map((c) => (
                    <div
                      key={c.iso}
                      onClick={() => setSelectedEacCountry(c)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        selectedEacCountry.iso === c.iso
                          ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{c.flag}</span>
                        <strong className="text-xs">{c.name}</strong>
                      </div>
                      <span className="font-mono text-xs text-emerald-400 font-bold">{c.gdpGrowth}</span>
                    </div>
                  ))}
                </div>

                {/* Selected Country Dossier */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{selectedEacCountry.flag}</span>
                      <div>
                        <h4 className="text-lg font-bold text-white">{selectedEacCountry.name}</h4>
                        <span className="text-slate-400">Capital: {selectedEacCountry.capital}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 font-bold">
                      Risk: {selectedEacCountry.riskRating}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px]">REAL GDP GROWTH</span>
                      <strong className="text-emerald-400 text-base block">{selectedEacCountry.gdpGrowth}</strong>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px]">AfCFTA INTEGRATION SCORE</span>
                      <strong className="text-amber-400 text-base block">{selectedEacCountry.afcftaScore}/100</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold block">STRATEGIC INFRASTRUCTURE FLAGSHIP:</span>
                    <p className="text-white font-sans">{selectedEacCountry.keyProjects}</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold block">VERITAS INTELLIGENCE ANALYSIS:</span>
                    <p className="text-slate-300 font-sans leading-relaxed">{selectedEacCountry.recentInsight}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TIER 3: PAN-AFRICA (AfCFTA & PAPSS) */}
          {/* ========================================================================= */}
          {activeTier === 'pan_africa' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 border border-purple-500/30 rounded-3xl p-6 text-slate-100 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-300 border border-purple-500/30">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">PAN-AFRICAN CONTINENTAL TRADE OBSERVATORY</h3>
                      <p className="text-xs text-slate-300">
                        AfCFTA Free Trade Zone • 54 Signatory Economies • $3.4 Trillion Market • PAPSS Local Payment Rail
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-center">
                      <span className="text-slate-400 text-[10px] block">TARIFF FREE LINES</span>
                      <span className="text-emerald-400 font-bold">90% ENFORCED</span>
                    </div>
                    <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-center">
                      <span className="text-slate-400 text-[10px] block">PAYMENT SYSTEM</span>
                      <span className="text-purple-300 font-bold">PAPSS LIVE</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  {PAN_AFRICAN_BLOCS.map((b) => (
                    <div key={b.iso} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{b.flag} <strong className="text-white text-xs">{b.name}</strong></span>
                        <span className="text-emerald-400 font-bold">{b.gdpGrowth}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] font-sans line-clamp-2">{b.recentInsight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TIER 4: GLOBAL GEOPOLITICS & MACRO */}
          {/* ========================================================================= */}
          {activeTier === 'global' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950 border border-blue-500/30 rounded-3xl p-6 text-slate-100 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-500/20 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-500/20 rounded-2xl text-cyan-300 border border-blue-500/30">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">INTERCONTINENTAL GEOPOLITICAL & GEO-ECONOMIC LINKS</h3>
                      <p className="text-xs text-slate-300">
                        BRICS+, EU-Africa Gateway, US-AGOA, China-FOCAC & Middle East Sovereign Energy Investments
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-center">
                      <span className="text-slate-400 text-[10px] block">GLOBAL TRADE LINKS</span>
                      <span className="text-cyan-300 font-bold">4 GLOBAL COMPACTS</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {GLOBAL_GEOPOLITICAL_NODES.map((node, i) => (
                    <div key={i} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-cyan-300 text-sm">{node.framework}</strong>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {node.status}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[10px] block">Nations: {node.leadNations}</span>
                      <p className="text-slate-300 font-sans leading-relaxed text-[11px]">{node.impactOnAfrica}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
