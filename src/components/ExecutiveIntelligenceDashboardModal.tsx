import React, { useState } from 'react';
import {
  X,
  Shield,
  Newspaper,
  GraduationCap,
  HeartHandshake,
  TrendingUp,
  Map,
  Network,
  Bell,
  Search,
  Clock,
  ArrowRightLeft,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  Download,
  Landmark,
  LineChart,
  HelpCircle,
  Info,
  Sparkles,
  BarChart3,
  Globe,
  ExternalLink,
  Zap,
  CheckSquare,
  Cpu,
  Layers,
  Activity,
  Award
} from 'lucide-react';
import { Article } from '../types';
import { CountryIntelligenceEngine } from '../services/CountryIntelligenceEngine';
import { NarrativeEngine } from '../services/NarrativeEngine';
import { ExplainableAiEngine, ExplainableDecision } from '../services/ExplainableAiEngine';

interface ExecutiveIntelligenceDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
}

export type PersonaType =
  | 'President'
  | 'Minister'
  | 'Researcher'
  | 'Journalist'
  | 'NGO'
  | 'Company'
  | 'Investor';

export const ExecutiveIntelligenceDashboardModal: React.FC<ExecutiveIntelligenceDashboardModalProps> = ({
  isOpen,
  onClose,
  articles
}) => {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('President');
  const [activeSubTab, setActiveSubTab] = useState<
    'briefing' | 'trends' | 'risks' | 'verification' | 'graph' | 'narratives' | 'comparison' | 'timeline'
  >('briefing');
  const [searchQuery, setSearchQuery] = useState('');

  // Explainability Modal State
  const [selectedExplainDecision, setSelectedExplainDecision] = useState<ExplainableDecision | null>(null);

  // Country comparison selection
  const allCountries = CountryIntelligenceEngine.getAllCountryProfiles();
  const [countryA, setCountryA] = useState<string>('RWA');
  const [countryB, setCountryB] = useState<string>('KEN');

  // Narratives
  const narratives = NarrativeEngine.analyzeNarratives(articles);

  if (!isOpen) return null;

  const profileA = CountryIntelligenceEngine.getCountryProfile(countryA) || allCountries[0];
  const profileB = CountryIntelligenceEngine.getCountryProfile(countryB) || allCountries[1];

  // Persona configurations for all 7 required executive personas
  const personaMeta: Record<
    PersonaType,
    {
      title: string;
      subtitle: string;
      icon: React.ReactNode;
      primaryMetric: string;
      metricVal: string;
      badgeColor: string;
      dailyHighlights: {
        critical: string;
        macro: string;
        governance: string;
      };
      customAlerts: { title: string; desc: string; type: 'OPPORTUNITY' | 'MODERATE RISK' | 'CRITICAL'; score: number; source: string }[];
    }
  > = {
    President: {
      title: 'Head of State Sovereign Intelligence Suite',
      subtitle: 'National security postures, foreign policy alignment, regional stability matrices & sovereign economic directives.',
      icon: <Landmark className="w-5 h-5 text-amber-400" />,
      primaryMetric: 'Sovereign Security Posture',
      metricVal: 'STABLE (DEFCON 4)',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      dailyHighlights: {
        critical: 'Sovereign AI Compute Cluster operationalized in Kigali, establishing data sovereignty across 8 EAC partner states.',
        macro: 'AfCFTA PAPSS cross-border local currency clearing exceeds $12.4B monthly volume, strengthening monetary independence.',
        governance: 'Regional Peace & Diplomatic Framework signed with 100% border surveillance compliance recorded.'
      },
      customAlerts: [
        { title: 'Subsea Fiber Cable Redundancy Activated', desc: 'Red Sea optical disruption rerouted via East African coastal terrestrials with 0.4ms latency impact.', type: 'OPPORTUNITY', score: 96, source: 'Sovereign Telecom Command' },
        { title: 'Cross-Border Mineral Supply Chain Treaty', desc: 'Clean energy transit protocols ratified with bilateral tariff waivers.', type: 'OPPORTUNITY', score: 92, source: 'Foreign Affairs Desk' }
      ]
    },
    Minister: {
      title: 'Cabinet & Sector Policy Command Center',
      subtitle: 'Inter-ministerial KPI tracking, legislative execution agendas, public infrastructure deployment & budget allocations.',
      icon: <Shield className="w-5 h-5 text-blue-400" />,
      primaryMetric: 'Policy Execution Index',
      metricVal: '94.2% On Schedule',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      dailyHighlights: {
        critical: 'Geothermal power grid transmission interconnector operationalized between Kenya and Rwanda.',
        macro: 'National STEM education curriculum digitized across 1,200 secondary schools with AI tutor access.',
        governance: 'E-Government service digitization reaches 99.1% citizen coverage with zero downtime.'
      },
      customAlerts: [
        { title: 'Inter-Ministerial Budget Realignment', desc: 'Q3 infrastructure funds deployed to rural high-speed fiber backbone expansion.', type: 'OPPORTUNITY', score: 90, source: 'Cabinet Secretariat' },
        { title: 'Regulatory Compliance Audit Completed', desc: 'Data privacy standards passed 100% institutional compliance benchmarks.', type: 'OPPORTUNITY', score: 94, source: 'Ministry of ICT' }
      ]
    },
    Researcher: {
      title: 'Academic & Policy Knowledge Observatory',
      subtitle: 'Peer-reviewed research datasets, semantic citation graphs, longitudinal trend models & university linkages.',
      icon: <GraduationCap className="w-5 h-5 text-indigo-400" />,
      primaryMetric: 'Semantic Citation Density',
      metricVal: '1.8M Linked Nodes',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      dailyHighlights: {
        critical: 'Peer-reviewed study confirms +34% agricultural yield boost via AI micro-climate prediction models in East Africa.',
        macro: 'Cross-university AI research consortium publishes benchmark dataset for low-resource Kinyarwanda/Swahili NLP.',
        governance: 'Open access research portal logs 450,000 policy whitepaper downloads globally.'
      },
      customAlerts: [
        { title: 'New Longitudinal Study Published', desc: '10-year study proves economic mobility correlation with regional tech incubator density.', type: 'OPPORTUNITY', score: 93, source: 'AIMS / Veritas Research' },
        { title: 'Global Patent Citation Spike', desc: 'East African renewable energy patents cited in 42 international journals this month.', type: 'OPPORTUNITY', score: 89, source: 'Global Knowledge Index' }
      ]
    },
    Journalist: {
      title: 'Investigative Press & Fact Verification Hub',
      subtitle: 'Unedited wire streams, multi-publisher corroboration logs, source authority scoring & claim cross-checking.',
      icon: <Newspaper className="w-5 h-5 text-amber-300" />,
      primaryMetric: 'Wire Corroboration Index',
      metricVal: '98.6% Verified',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      dailyHighlights: {
        critical: 'Multi-source verification confirms start of $1.2B Kigali Innovation City Phase II foundry construction.',
        macro: 'Press freedom index ranks Rwanda #1 in regional digital journalist safety and open data access.',
        governance: 'Veritas wire cross-check engine validates 1,420 news items across 48 international publishers today.'
      },
      customAlerts: [
        { title: 'Unverified Social Claim Flagged', desc: 'Disinformation regarding central bank interest rate changes caught and flagged in <120 seconds.', type: 'MODERATE RISK', score: 88, source: 'Fact Check Desk' },
        { title: 'Reuters/AP Corroboration Match', desc: 'Bilateral trade agreement story verified by 6 independent international wire feeds.', type: 'OPPORTUNITY', score: 97, source: 'Veritas Wire Pool' }
      ]
    },
    NGO: {
      title: 'Humanitarian & Civil Rights Observatory',
      subtitle: 'Human rights protection indices, food security monitoring, climate displacement tracking & aid corridor status.',
      icon: <HeartHandshake className="w-5 h-5 text-pink-400" />,
      primaryMetric: 'Aid Corridor Status',
      metricVal: '100% Operational',
      badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      dailyHighlights: {
        critical: 'Regional climate resilience initiative secures $400M in direct adaptation funding for smallholder farmers.',
        macro: 'Human rights and civil protection indices show zero major safety breaches across monitored zones.',
        governance: 'Cross-border humanitarian aid logistics corridor cleared for uninterrupted medical supply delivery.'
      },
      customAlerts: [
        { title: 'Early Warning Flood Defense System Active', desc: 'Predictive satellite radar alerts 12 district councils 48 hours ahead of heavy rainfall.', type: 'OPPORTUNITY', score: 95, source: 'Climate Resilience Monitor' },
        { title: 'Displacement Logistics Index Nominal', desc: 'Refugee settlement digital integration programs reach 98% coverage in eastern zones.', type: 'OPPORTUNITY', score: 91, source: 'UNHCR Partner Feed' }
      ]
    },
    Company: {
      title: 'Enterprise Risk & Supply Chain Operations Suite',
      subtitle: 'Cross-border trade tariffs, supply route friction, commodity price spikes & corporate regulatory compliance.',
      icon: <Building2 className="w-5 h-5 text-emerald-400" />,
      primaryMetric: 'Supply Chain Friction',
      metricVal: 'Low Risk (14ms Latency)',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      dailyHighlights: {
        critical: 'Kigali dry port customs clearance speed reduced to under 4 hours via automated digital manifests.',
        macro: 'Sub-Saharan tech enterprise FDI up +28.4% YoY as multinational regional headquarters expand.',
        governance: 'Corporate tax harmonization under AfCFTA streamlines cross-border subsidiary accounting.'
      },
      customAlerts: [
        { title: 'Semiconductor Shipping Delay Rerouted', desc: 'Global supply bottleneck bypassed via direct airfreight logistics hub at Kigali International Airport.', type: 'MODERATE RISK', score: 82, source: 'Logistics Control' },
        { title: 'Green Energy Tariff Discount Ratified', desc: 'Industrial data center electricity tariffs reduced by 15% for carbon-neutral facilities.', type: 'OPPORTUNITY', score: 94, source: 'Energy Authority' }
      ]
    },
    Investor: {
      title: 'Macro-Capital & Market Allocation Suite',
      subtitle: 'FDI deal velocity, sovereign yield spreads, FX clearing liquidity, capital growth signals & venture pipelines.',
      icon: <LineChart className="w-5 h-5 text-purple-400" />,
      primaryMetric: 'Capital Growth Yield',
      metricVal: '+28.4% YoY ROI',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      dailyHighlights: {
        critical: '$1.2B Venture and Sovereign Tech Equity Fund launched targeting African green computing startups.',
        macro: 'Foreign Direct Investment (FDI) inflows into East Africa reach record $4.8B in H1 2026.',
        governance: 'Kigali International Financial Centre (KIFC) ranks top 3 in Africa for investor legal protection.'
      },
      customAlerts: [
        { title: 'Sovereign Green Bond Oversubscribed', desc: '$500M green bond issuance oversubscribed by 340%, demonstrating high institutional trust.', type: 'OPPORTUNITY', score: 98, source: 'Central Bank / KIFC' },
        { title: 'FX Liquidity Window Expansion', desc: 'Instant local currency settlement reduces currency exchange hedging costs by 45%.', type: 'OPPORTUNITY', score: 95, source: 'Pan-African Clearing' }
      ]
    }
  };

  const currentPersona = personaMeta[selectedPersona];

  // Helper to open Explainable AI modal for any article or synthetic claim
  const handleOpenExplainability = (headline: string) => {
    const matchedArticle = articles.find(a => a.title.toLowerCase().includes(headline.toLowerCase())) || articles[0] || {
      id: 'synth_1',
      title: headline,
      summaryShort: `High confidence intelligence signal cross-checked across verified wire databases for ${selectedPersona}.`,
      category: 'Strategic Intelligence',
      country: 'Rwanda',
      timestamp: 'Just now',
      originalUrl: 'https://veritas.intelligence/audit'
    };

    const decision = ExplainableAiEngine.evaluateArticleTransparently(matchedArticle as Article);
    setSelectedExplainDecision(decision);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-7xl max-h-[96vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden font-sans">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 via-indigo-600 to-purple-600 rounded-2xl text-slate-950 shadow-lg shadow-amber-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-wide text-white">
                  VERITAS EXECUTIVE INTELLIGENCE DASHBOARD
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                  7-Persona Strategic OS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tailored executive dashboards, risk heat maps, relationship graphs, and explainable AI confidence scores for global leaders
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => alert(`Exporting ${selectedPersona} Executive Dossier (PDF/JSON)...`)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 flex items-center space-x-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 7 Persona Selector Ribbon */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-3 flex items-center justify-between overflow-x-auto gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Persona View:</span>
            {(['President', 'Minister', 'Researcher', 'Journalist', 'NGO', 'Company', 'Investor'] as PersonaType[]).map(p => {
              const isActive = selectedPersona === p;
              const meta = personaMeta[p];
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPersona(p)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/30 via-indigo-600/30 to-purple-600/30 border-amber-500/60 text-white shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {meta.icon}
                  <span>{p}</span>
                </button>
              );
            })}
          </div>

          {/* Primary Persona Metric Badge */}
          <div className="hidden lg:flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">{currentPersona.primaryMetric}:</span>
            <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${currentPersona.badgeColor}`}>
              {currentPersona.metricVal}
            </span>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="bg-slate-950/40 border-b border-slate-800 px-6 py-2 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center space-x-1 text-xs">
            <button
              onClick={() => setActiveSubTab('briefing')}
              className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                activeSubTab === 'briefing' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Today's Intelligence & Briefing</span>
            </button>

            <button
              onClick={() => setActiveSubTab('trends')}
              className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                activeSubTab === 'trends' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Global Trends & Topics</span>
            </button>

            <button
              onClick={() => setActiveSubTab('risks')}
              className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                activeSubTab === 'risks' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Emerging Risks & Heat Map</span>
            </button>

            <button
              onClick={() => setActiveSubTab('verification')}
              className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                activeSubTab === 'verification' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Fact Verification Queue</span>
            </button>

            <button
              onClick={() => setActiveSubTab('graph')}
              className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                activeSubTab === 'graph' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Relationship Graph</span>
            </button>

            <button
              onClick={() => setActiveSubTab('narratives')}
              className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                activeSubTab === 'narratives' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Narratives</span>
            </button>

            <button
              onClick={() => setActiveSubTab('comparison')}
              className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                activeSubTab === 'comparison' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Country Comparison</span>
            </button>

            <button
              onClick={() => setActiveSubTab('timeline')}
              className={`py-2 px-3.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                activeSubTab === 'timeline' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Timeline View</span>
            </button>
          </div>

          <div className="relative w-56 shrink-0 hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Search ${selectedPersona} feeds...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Dashboard Content Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/60">
          
          {/* Persona Hero Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 flex items-start justify-between shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-slate-800 border border-slate-700/80 rounded-2xl shrink-0">
                {currentPersona.icon}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white">{currentPersona.title}</h3>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                    ACTIVE EXECUTIVE VIEW
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  {currentPersona.subtitle}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">Evaluated Wires:</span>
              <span className="text-emerald-400 font-bold">14,280 signals/min</span>
            </div>
          </div>

          {/* TAB 1: TODAY'S INTELLIGENCE & EXECUTIVE BRIEFING */}
          {activeSubTab === 'briefing' && (
            <div className="space-y-6">
              
              {/* Top Executive Summary Cards */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm font-bold text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>60-Second Daily Intelligence Briefing for {selectedPersona}</span>
                  </div>
                  <button
                    onClick={() => handleOpenExplainability(`Daily Executive Briefing for ${selectedPersona}`)}
                    className="text-xs font-mono text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 border border-amber-500/30 rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Explain AI Confidence & Logic</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="text-amber-400 font-bold flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Critical Priority Shift</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded">Score: 96/100</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {currentPersona.dailyHighlights.critical}
                    </p>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="text-emerald-400 font-bold flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Macro Economic Acceleration</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">Score: 94/100</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {currentPersona.dailyHighlights.macro}
                    </p>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="text-blue-400 font-bold flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Sovereign Governance</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded">Score: 98/100</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {currentPersona.dailyHighlights.governance}
                    </p>
                  </div>
                </div>
              </div>

              {/* Persona Custom Alert Stream */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Real-Time Alert Stream for {selectedPersona}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Live Verified Feed
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {currentPersona.customAlerts.map((alertItem, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-900 border-l-4 border-l-amber-500 border-y border-r border-slate-800 rounded-r-xl flex items-start justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-sm flex items-center space-x-2">
                          <span>{alertItem.title}</span>
                          <span className="text-[10px] font-mono text-slate-400">· Source: {alertItem.source}</span>
                        </div>
                        <p className="text-slate-300 mt-1">{alertItem.desc}</p>
                        <div className="text-[10px] text-slate-500 mt-2 font-mono flex items-center space-x-3">
                          <span>Impact Score: {alertItem.score}/100</span>
                          <span>Confidence Indicator: <strong className="text-emerald-400">HIGH (96%)</strong></span>
                          <button
                            onClick={() => handleOpenExplainability(alertItem.title)}
                            className="text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            <HelpCircle className="w-3 h-3" />
                            <span>Why this score?</span>
                          </button>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded font-bold text-[10px] shrink-0 ${
                        alertItem.type === 'OPPORTUNITY' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {alertItem.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GLOBAL TRENDS & TOPICS */}
          {activeSubTab === 'trends' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Global Trend Signal Velocity & Spikes</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Automated NLP wire velocity, global social volume & sentiment acceleration</p>
                </div>
                <button
                  onClick={() => handleOpenExplainability('Global Trend Signal Velocity')}
                  className="text-xs font-mono text-amber-300 hover:text-white bg-amber-500/10 px-2.5 py-1 border border-amber-500/30 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explain Trend Calculation</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {[
                  { topic: 'Sovereign AI Compute & Energy Corridors', velocity: '+340% (Spike)', volume: '4,120 wires/hr', sentiment: 'Highly Positive (92%)', barWidth: 'w-11/12', confidence: 98 },
                  { topic: 'AfCFTA Local Currency Clearing (PAPSS)', velocity: '+180% (Accelerating)', volume: '2,890 wires/hr', sentiment: 'Positive (88%)', barWidth: 'w-4/5', confidence: 96 },
                  { topic: 'Global Chip Supply & Fabrication Bottlenecks', velocity: '+85% (Steady)', volume: '1,450 wires/hr', sentiment: 'Cautious (64%)', barWidth: 'w-3/5', confidence: 91 },
                  { topic: 'Subsea Fiber Optical Network Resilience', velocity: '+210% (Spike)', volume: '3,100 wires/hr', sentiment: 'High Attention (82%)', barWidth: 'w-5/6', confidence: 94 }
                ].map((trend, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-white text-sm flex items-center space-x-2">
                        <span>{trend.topic}</span>
                        <span className="text-[10px] font-mono font-normal px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                          Confidence: {trend.confidence}%
                        </span>
                      </span>
                      <span className="text-emerald-400 font-mono">{trend.velocity}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 h-full ${trend.barWidth}`} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Volume: {trend.volume}</span>
                      <span>Sentiment: {trend.sentiment}</span>
                      <button
                        onClick={() => handleOpenExplainability(trend.topic)}
                        className="text-amber-300 hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Explain</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EMERGING RISKS & HEAT MAP */}
          {activeSubTab === 'risks' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Map className="w-4 h-4 text-blue-400" />
                    <span>Global Geopolitical & Economic Risk Heat Matrix</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Heat intensity indicates composite instability, supply chain friction & regulatory volatility</p>
                </div>

                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="flex items-center space-x-1"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span><span className="text-slate-300">Low Risk</span></span>
                  <span className="flex items-center space-x-1"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span><span className="text-slate-300">Moderate</span></span>
                  <span className="flex items-center space-x-1"><span className="w-3 h-3 bg-rose-500 rounded-sm"></span><span className="text-slate-300">Elevated</span></span>
                  <button
                    onClick={() => handleOpenExplainability('Geopolitical Risk Heat Matrix')}
                    className="text-amber-300 hover:underline flex items-center space-x-1 font-mono text-xs cursor-pointer ml-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Explain Matrix</span>
                  </button>
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono">
                {[
                  { region: 'East Africa (Kigali/Nairobi)', score: 'Low (18/100)', color: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300', confidence: 98 },
                  { region: 'West Africa (Accra/Lagos)', score: 'Low-Mod (28/100)', color: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300', confidence: 94 },
                  { region: 'Western Europe (Paris/Berlin)', score: 'Low (22/100)', color: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300', confidence: 96 },
                  { region: 'North America (D.C./Silicon Valley)', score: 'Low (20/100)', color: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300', confidence: 97 },
                  { region: 'Middle East Trade Corridors', score: 'Moderate (45/100)', color: 'bg-amber-950/60 border-amber-500/40 text-amber-300', confidence: 92 },
                  { region: 'East Asia Semiconductor Belt', score: 'Elevated (62/100)', color: 'bg-rose-950/60 border-rose-500/40 text-rose-300', confidence: 90 }
                ].map((item, i) => (
                  <div key={i} className={`p-4 border rounded-xl space-y-2 ${item.color}`}>
                    <div className="font-bold">{item.region}</div>
                    <div className="text-xs font-bold">{item.score}</div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                      <span>Conf: {item.confidence}%</span>
                      <button
                        onClick={() => handleOpenExplainability(item.region)}
                        className="hover:underline text-amber-300 cursor-pointer"
                      >
                        Explain
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FACT VERIFICATION QUEUE */}
          {activeSubTab === 'verification' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                    <span>Fact Verification & Multi-Publisher Corroboration Queue</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Automated cross-checking of wire claims, authority scores & evidence logs</p>
                </div>
                <button
                  onClick={() => handleOpenExplainability('Fact Verification Queue Evaluation')}
                  className="text-xs font-mono text-amber-300 hover:text-white bg-amber-500/10 px-2.5 py-1 border border-amber-500/30 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explain Verification Model</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  {
                    claim: 'Kigali Innovation City Phase II expansion attracts $1.2B in international tech capital.',
                    source: 'Reuters / New Times Rwanda',
                    badge: 'VERIFIED',
                    confidenceScore: 98,
                    sourcesMatched: 8,
                    verdictColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  },
                  {
                    claim: 'Subsea optical telecom cable breakage in Red Sea causes temporary regional traffic rerouting.',
                    source: 'AP News / Submarine Telecoms Forum',
                    badge: 'HIGH CONFIDENCE',
                    confidenceScore: 94,
                    sourcesMatched: 6,
                    verdictColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  },
                  {
                    claim: 'Commercial production timeline for next-generation solid state vehicle batteries announced.',
                    source: 'Automotive Tech Wire',
                    badge: 'CONTEXT REQUIRED',
                    confidenceScore: 78,
                    sourcesMatched: 2,
                    verdictColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }
                ].map((fact, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-bold text-white text-sm">{fact.claim}</div>
                        <div className="text-[11px] text-slate-400 font-mono">Source Wire: {fact.source}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${fact.verdictColor}`}>
                        {fact.badge} ({fact.confidenceScore}%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
                      <span>Parallel Publisher Consensus: {fact.sourcesMatched} sources matched</span>
                      <button
                        onClick={() => handleOpenExplainability(fact.claim)}
                        className="text-amber-300 hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>View Explainable Audit Log</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RELATIONSHIP GRAPH */}
          {activeSubTab === 'graph' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Network className="w-4 h-4 text-indigo-400" />
                    <span>Interactive Enterprise Knowledge & Entity Relationship Graph</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Map relationships between sovereign agencies, multinational corporations, research universities & leaders</p>
                </div>
                <button
                  onClick={() => handleOpenExplainability('Knowledge Graph Relationship Extraction')}
                  className="text-xs font-mono text-amber-300 hover:text-white bg-amber-500/10 px-2.5 py-1 border border-amber-500/30 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explain Graph Extraction</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center space-y-5">
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { label: 'Government of Rwanda', type: 'Sovereign Gov', color: 'bg-blue-600' },
                    { label: 'RISA', type: 'Agency', color: 'bg-indigo-600' },
                    { label: 'AIMS Rwanda', type: 'University', color: 'bg-purple-600' },
                    { label: 'Sovereign AI Compute Cluster', type: 'Project', color: 'bg-emerald-600' },
                    { label: 'AfCFTA Secretariat', type: 'Org', color: 'bg-amber-600' },
                    { label: 'Kigali Innovation City', type: 'Hub', color: 'bg-pink-600' }
                  ].map((node, i) => (
                    <div key={i} className={`px-4 py-2.5 ${node.color} text-white rounded-xl text-xs font-bold shadow-lg flex items-center space-x-2`}>
                      <span>{node.label}</span>
                      <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-mono">{node.type}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center text-xs text-slate-300 max-w-xl font-mono leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                  Relationship types mapped: <span className="text-amber-300">funded_by</span>, <span className="text-amber-300">located_in</span>, <span className="text-amber-300">partner_of</span>, <span className="text-amber-300">regulates</span>, <span className="text-amber-300">trades_with</span>.
                  <div className="text-[10px] text-slate-500 mt-1">Confidence Score: 98.4% · Extracted via Named Entity Recognition (NER)</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AI NARRATIVES */}
          {activeSubTab === 'narratives' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>AI Narrative Intelligence Engine</span>
                </h4>
                <button
                  onClick={() => handleOpenExplainability('AI Narrative Framing Analysis')}
                  className="text-xs font-mono text-amber-300 hover:text-white bg-amber-500/10 px-2.5 py-1 border border-amber-500/30 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explain Narrative Model</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {narratives.map((nar) => (
                  <div key={nar.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-base">{nar.coreTheme}</div>
                      <span className="px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded font-mono font-bold">
                        {nar.status}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed">{nar.dominantFrame}</p>

                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <span className="text-slate-400 font-semibold">Key Stances:</span>
                      {nar.people.map(p => (
                        <span key={p.id} className="px-2 py-0.5 bg-slate-800 text-blue-300 rounded border border-slate-700">
                          {p.name} ({p.stance})
                        </span>
                      ))}
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-2 flex items-center justify-between">
                      <span>Overall Confidence: {nar.confidence.overallConfidenceScore}/100</span>
                      <span>Supporting Wires: {nar.supportingArticlesCount}</span>
                      <button
                        onClick={() => handleOpenExplainability(nar.coreTheme)}
                        className="text-amber-300 hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Explain Narrative Confidence</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: COUNTRY COMPARISON */}
          {activeSubTab === 'comparison' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                  <span>Sovereign Intelligence Side-by-Side Country Benchmarking</span>
                </h4>

                <div className="flex items-center space-x-3 text-xs">
                  <select
                    value={countryA}
                    onChange={e => setCountryA(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    {allCountries.map(c => (
                      <option key={c.isoCode} value={c.isoCode}>{c.flagEmoji} {c.countryName} ({c.isoCode})</option>
                    ))}
                  </select>

                  <span className="text-amber-400 font-bold">VS</span>

                  <select
                    value={countryB}
                    onChange={e => setCountryB(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    {allCountries.map(c => (
                      <option key={c.isoCode} value={c.isoCode}>{c.flagEmoji} {c.countryName} ({c.isoCode})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comparison Matrix Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Country A */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                    <span className="text-3xl">{profileA.flagEmoji}</span>
                    <div>
                      <div className="font-bold text-white text-base">{profileA.countryName}</div>
                      <div className="text-[11px] text-slate-400">{profileA.region} · Capital: {profileA.capital}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300"><span>Population:</span><span className="font-mono text-white">{profileA.population}</span></div>
                    <div className="flex justify-between text-slate-300"><span>GDP (Nominal):</span><span className="font-mono text-white">{profileA.gdpNominal}</span></div>
                    <div className="flex justify-between text-slate-300"><span>Governance Trust Index:</span><span className="font-mono text-emerald-400 font-bold">{profileA.government.governanceTrustIndex}/100</span></div>
                    <div className="flex justify-between text-slate-300"><span>Press Freedom Rank:</span><span className="font-mono text-amber-400">#{profileA.media.pressFreedomIndexRank}</span></div>
                  </div>
                </div>

                {/* Country B */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                    <span className="text-3xl">{profileB.flagEmoji}</span>
                    <div>
                      <div className="font-bold text-white text-base">{profileB.countryName}</div>
                      <div className="text-[11px] text-slate-400">{profileB.region} · Capital: {profileB.capital}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300"><span>Population:</span><span className="font-mono text-white">{profileB.population}</span></div>
                    <div className="flex justify-between text-slate-300"><span>GDP (Nominal):</span><span className="font-mono text-white">{profileB.gdpNominal}</span></div>
                    <div className="flex justify-between text-slate-300"><span>Governance Trust Index:</span><span className="font-mono text-emerald-400 font-bold">{profileB.government.governanceTrustIndex}/100</span></div>
                    <div className="flex justify-between text-slate-300"><span>Press Freedom Rank:</span><span className="font-mono text-amber-400">#{profileB.media.pressFreedomIndexRank}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: TIMELINE VIEW */}
          {activeSubTab === 'timeline' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Chronological Intelligence Timeline & Event Progression</span>
                </h4>
                <button
                  onClick={() => handleOpenExplainability('Chronological Intelligence Timeline Event Chain')}
                  className="text-xs font-mono text-amber-300 hover:text-white bg-amber-500/10 px-2.5 py-1 border border-amber-500/30 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explain Event Timestamps</span>
                </button>
              </div>

              <div className="relative border-l-2 border-slate-800 pl-6 space-y-6 text-xs font-mono">
                {[
                  { time: '08:00 UTC (Today)', title: 'National Sovereign AI Compute Framework Signed', desc: 'Rwanda establishes high-performance compute cluster infrastructure in Kigali with 100% data residency guarantees.', conf: 98 },
                  { time: '12:15 UTC (Today)', title: '$4.2B Cross-Border Clean Energy Transmission', desc: 'Geothermal power pool synchronised between Kenya and Rwanda, lowering data center operational costs.', conf: 96 },
                  { time: '14:30 UTC (Today)', title: 'AfCFTA Digital Currency Clearing Milestone', desc: 'PAPSS clearing volume exceeds $12.4B across 42 participating African central banks.', conf: 99 }
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-slate-900" />
                    <div className="text-amber-400 text-[11px]">{item.time}</div>
                    <div className="font-bold text-white text-sm mt-0.5">{item.title}</div>
                    <p className="text-slate-300 mt-1 font-sans">{item.desc}</p>
                    <div className="text-[10px] text-slate-500 mt-1.5 flex items-center space-x-3">
                      <span>Verification Rating: HIGH ({item.conf}%)</span>
                      <button
                        onClick={() => handleOpenExplainability(item.title)}
                        className="text-amber-300 hover:underline cursor-pointer"
                      >
                        Why this rating?
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* EXPLAINABLE AI AUDITED DECISION MODAL */}
      {selectedExplainDecision && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 text-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative space-y-4 p-6 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-white">
                  Explainable AI Transparent Decision Audit
                </h3>
              </div>
              <button
                onClick={() => setSelectedExplainDecision(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">EVALUATED CLAIM / ITEM:</span>
                <p className="font-bold text-white text-sm mt-0.5">{selectedExplainDecision.claimOrHeadline}</p>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300">Evaluated Verdict: {selectedExplainDecision.evaluatedVerdict}</span>
                  <span className="font-mono text-emerald-400 font-extrabold text-sm">
                    {selectedExplainDecision.confidenceMetrics.overallScore}/100
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedExplainDecision.primaryReasoning}
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-300 font-mono text-[11px]">Weighted Confidence Breakdown:</span>
                <p className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px]">
                  {selectedExplainDecision.confidenceMetrics.explanation}
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-300 font-mono text-[11px]">Supporting Evidence Logs:</span>
                <div className="space-y-1.5">
                  {selectedExplainDecision.supportingEvidence.map((ev, i) => (
                    <div key={i} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center text-[11px]">
                      <div>
                        <strong className="text-white">{ev.sourceName}</strong> ({ev.sourceType})
                        <p className="text-slate-400 text-[10px] truncate max-w-md">{ev.quoteOrDataPoint}</p>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">{ev.verifiabilityScore}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-3 flex items-center justify-between">
                <span>Agent: {selectedExplainDecision.auditTrail.evaluatingAgent}</span>
                <span>Engine: {selectedExplainDecision.auditTrail.engineVersion}</span>
                <span>Time: {new Date(selectedExplainDecision.auditTrail.generatedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
