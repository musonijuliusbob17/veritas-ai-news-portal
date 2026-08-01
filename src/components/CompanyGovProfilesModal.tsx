import React, { useState } from 'react';
import { Article } from '../types';
import { Building2, Globe, ShieldCheck, DollarSign, Users, Award, FileText, AlertTriangle, TrendingUp, X, Search, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface CompanyGovProfilesModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface CompanyProfile {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  headquarters: string;
  marketCap: string;
  revenue: string;
  ceo: string;
  riskScore: number;
  esgRating: string;
  competitors: string[];
  keyProducts: string[];
  regulatoryFocus: string;
  aiStrategicAnalysis: string;
}

interface GovernmentProfile {
  id: string;
  country: string;
  flag: string;
  capital: string;
  headOfState: string;
  system: string;
  gdpNominal: string;
  tradeBalance: string;
  keyExports: string[];
  defenceBudget: string;
  investmentOpportunities: string;
  keyInfrastructure: string;
  aiGeopoliticalAssessment: string;
}

const COMPANIES: CompanyProfile[] = [
  {
    id: 'cmp-1',
    name: 'Taiwan Semiconductor Manufacturing Co. (TSMC)',
    ticker: 'TSM',
    headquarters: 'Hsinchu, Taiwan',
    sector: 'Semiconductors & Foundry',
    marketCap: '$880 Billion',
    revenue: '$75.9 Billion',
    ceo: 'C.C. Wei',
    riskScore: 68,
    esgRating: 'AA',
    competitors: ['Samsung Foundry', 'Intel Foundry Services', 'GlobalFoundries'],
    keyProducts: ['3nm & 2nm FinFET/GAA Chips', 'CoWoS Advanced Packaging'],
    regulatoryFocus: 'CHIPS Act Subsidies compliance & Export controls on advanced node equipment.',
    aiStrategicAnalysis: 'TSMC maintains over 60% global semiconductor foundry market share and 90%+ of advanced AI accelerators. Geographic concentration in Taiwan represents primary geopolitical risk driver.'
  },
  {
    id: 'cmp-2',
    name: 'NVIDIA Corporation',
    ticker: 'NVDA',
    headquarters: 'Santa Clara, California, USA',
    sector: 'Artificial Intelligence & Graphics',
    marketCap: '$3.1 Trillion',
    revenue: '$126 Billion',
    ceo: 'Jensen Huang',
    riskScore: 42,
    esgRating: 'AAA',
    competitors: ['AMD', 'Intel', 'Custom Cloud ASICs (Google TPU, Amazon Trainium)'],
    keyProducts: ['Blackwell B200 GPUs', 'DGX AI Supercomputers', 'CUDA Ecosystem'],
    regulatoryFocus: 'US BIS export regulations targeting restricted compute density limits.',
    aiStrategicAnalysis: 'Dominates enterprise LLM training infrastructure. Supply chain bottlenecks bound primarily by TSMC CoWoS packaging capacity.'
  },
  {
    id: 'cmp-3',
    name: 'Dangote Industries Limited',
    ticker: 'PRIVATE',
    headquarters: 'Lagos, Nigeria',
    sector: 'Refining, Cement & Agriculture',
    marketCap: '$25+ Billion (Est.)',
    revenue: '$14.2 Billion',
    ceo: 'Aliko Dangote',
    riskScore: 38,
    esgRating: 'A',
    competitors: ['Lafarge Africa', 'BUA Cement', 'NNPC'],
    keyProducts: ['Lekki Petroleum Refinery (650,000 bpd)', 'Sub-Saharan Cement'],
    regulatoryFocus: 'Foreign exchange liquidity provisions and West African crude oil supply allocations.',
    aiStrategicAnalysis: 'Largest industrial conglomerate in West Africa. The 650,000 bpd Lekki Refinery transforms Nigeria from net fuel importer to major regional exporter.'
  }
];

const GOVERNMENTS: GovernmentProfile[] = [
  {
    id: 'gov-1',
    country: 'Republic of Rwanda',
    flag: '🇷🇼',
    capital: 'Kigali',
    headOfState: 'President Paul Kagame',
    system: 'Unitary Presidential Republic',
    gdpNominal: '$14.1 Billion',
    tradeBalance: '-$1.8 Billion',
    keyExports: ['Specialty Coffee & Tea', 'Tantalum & Tin Ore', 'Refined Gold', 'Eco-Tourism'],
    defenceBudget: '$240 Million',
    investmentOpportunities: 'Kigali Innovation City, Electric Vehicle Assembly, Pan-African Fintech Sandboxes, Sovereign Green Bonds.',
    keyInfrastructure: 'Bugesera International Airport, Kigali Logistics Platform, National Fiber Optic Backbone.',
    aiGeopoliticalAssessment: 'High sovereign institutional efficiency and anti-corruption rank. Positioned as a premier financial, logistics, and technology gateway for East & Central Africa.'
  },
  {
    id: 'gov-2',
    country: 'Federal Republic of Germany',
    flag: '🇩🇪',
    capital: 'Berlin',
    headOfState: 'Chancellor Olaf Scholz',
    system: 'Federal Parliamentary Republic',
    gdpNominal: '$4.5 Trillion',
    tradeBalance: '+$240 Billion',
    keyExports: ['Automobiles & Parts', 'Machinery & Equipment', 'Chemicals', 'Pharmaceuticals'],
    defenceBudget: '$78 Billion',
    investmentOpportunities: 'Industrial Green Hydrogen Networks, Semiconductor Foundries (Magdeburg & Dresden), Offshore Wind Energy.',
    keyInfrastructure: 'Hamburg & Bremerhaven Ports, Rhine Freight Waterways, High-Speed Railway Corridors.',
    aiGeopoliticalAssessment: 'Europe’s largest economy undergoing structural industrial energy transition while recalibrating strategic manufacturing dependencies.'
  }
];

export const CompanyGovProfilesModal: React.FC<CompanyGovProfilesModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [activeTab, setActiveTab] = useState<'companies' | 'governments'>('companies');
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile>(COMPANIES[0]);
  const [selectedGov, setSelectedGov] = useState<GovernmentProfile>(GOVERNMENTS[0]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS ENTERPRISE & SOVEREIGN DOSSIER ARCHIVE</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  DEEP INSTITUTIONAL PROFILES
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Granular dossiers covering multinational corporations, financial health, sovereign risk profiles, and macroeconomic structures.
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
            onClick={() => setActiveTab('companies')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'companies' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏢 Multinational Enterprises ({COMPANIES.length})
          </button>
          <button
            onClick={() => setActiveTab('governments')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'governments' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏛️ Sovereign Government Profiles ({GOVERNMENTS.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 space-y-6">
          {/* TAB 1: MULTINATIONAL ENTERPRISES */}
          {activeTab === 'companies' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Selector */}
              <div className="w-full md:w-80 space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  ENTERPRISE DIRECTORY
                </h3>

                {COMPANIES.map(c => {
                  const isSelected = selectedCompany.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCompany(c)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-950 to-slate-900 border-indigo-500 shadow-lg'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-white">{c.name}</strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-indigo-400 border border-slate-800">
                          {c.ticker}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Market Cap: <strong className="text-slate-200">{c.marketCap}</strong></span>
                        <span className="text-emerald-400">{c.esgRating} ESG</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Profile Inspector */}
              <div className="flex-1 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white">{selectedCompany.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {selectedCompany.ticker}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{selectedCompany.sector} • HQ: {selectedCompany.headquarters}</span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-slate-400 block text-[10px]">RISK EXPOSURE SCORE</span>
                    <strong className="text-indigo-400 text-2xl font-black">{selectedCompany.riskScore}/100</strong>
                  </div>
                </div>

                {/* Key Financial & Leadership Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">MARKET CAPITALIZATION</span>
                    <strong className="text-white text-sm">{selectedCompany.marketCap}</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">ANNUAL REVENUE</span>
                    <strong className="text-emerald-400 text-sm">{selectedCompany.revenue}</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">CHIEF EXECUTIVE</span>
                    <strong className="text-slate-200 text-xs">{selectedCompany.ceo}</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">ESG VERITAS GRADE</span>
                    <strong className="text-indigo-400 text-sm">{selectedCompany.esgRating}</strong>
                  </div>
                </div>

                {/* AI Strategic Assessment */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
                    VERITAS AI STRATEGIC ANALYSIS
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedCompany.aiStrategicAnalysis}
                  </p>
                </div>

                {/* Competitors & Regulatory Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 block">PRIMARY INDUSTRY COMPETITORS</span>
                    <strong className="text-slate-300 block">{selectedCompany.competitors.join(', ')}</strong>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 block">REGULATORY & ANTITRUST FOCUS</span>
                    <strong className="text-amber-400 block">{selectedCompany.regulatoryFocus}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOVEREIGN GOVERNMENT PROFILES */}
          {activeTab === 'governments' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Selector */}
              <div className="w-full md:w-80 space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  SOVEREIGN STATES
                </h3>

                {GOVERNMENTS.map(g => {
                  const isSelected = selectedGov.id === g.id;
                  return (
                    <div
                      key={g.id}
                      onClick={() => setSelectedGov(g)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-950 to-slate-900 border-blue-500 shadow-lg'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{g.flag} {g.country}</span>
                        <span className="text-xs font-mono text-emerald-400">{g.gdpNominal}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 line-clamp-1">
                        Capital: {g.capital}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Profile Inspector */}
              <div className="flex-1 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedGov.flag}</span>
                    <div>
                      <h3 className="text-xl font-black text-white">{selectedGov.country} Sovereign Dossier</h3>
                      <span className="text-xs font-mono text-slate-400">{selectedGov.system} • Capital: {selectedGov.capital}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-slate-400 block text-[10px]">HEAD OF STATE</span>
                    <strong className="text-white text-sm">{selectedGov.headOfState}</strong>
                  </div>
                </div>

                {/* Economic & Defense Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">NOMINAL GDP</span>
                    <strong className="text-white text-sm">{selectedGov.gdpNominal}</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">TRADE BALANCE</span>
                    <strong className="text-emerald-400 text-sm">{selectedGov.tradeBalance}</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">DEFENSE BUDGET</span>
                    <strong className="text-indigo-400 text-sm">{selectedGov.defenceBudget}</strong>
                  </div>
                </div>

                {/* AI Geopolitical Assessment */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
                    VERITAS GEOPOLITICAL ASSESSMENT
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedGov.aiGeopoliticalAssessment}
                  </p>
                </div>

                {/* Strategic Investment Opportunities */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    STRATEGIC INVESTMENT OPPORTUNITIES & INFRASTRUCTURE
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedGov.investmentOpportunities}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
