import React, { useState } from 'react';
import { Article } from '../types';
import { Cpu, Search, X, Network, Globe, Building2, User, Landmark, Tag, Calendar, ExternalLink, ArrowUpRight, TrendingUp } from 'lucide-react';

interface KnowledgeGraphModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface EntityItem {
  id: string;
  name: string;
  category: 'Person' | 'Company' | 'Country' | 'Organization' | 'Event' | 'Product';
  description: string;
  relevanceScore: number;
  connectionsCount: number;
  country: string;
  keyFacts: string[];
  connectedEntities: Array<{ name: string; relation: string; category: string }>;
  timeline: Array<{ year: string; title: string; detail: string }>;
}

const KNOWLEDGE_ENTITIES: EntityItem[] = [
  {
    id: 'ent-1',
    name: 'Elon Musk',
    category: 'Person',
    description: 'CEO of Tesla, SpaceX, and xAI. Key global figure in autonomous vehicles, AI compute infrastructure, and space exploration.',
    relevanceScore: 98,
    connectionsCount: 42,
    country: 'United States',
    keyFacts: [
      'Leading xAI Colossus supercomputer development.',
      'Supervising Tesla Full Self-Driving V13 release.',
      'Key economic influence on tech & automotive markets.'
    ],
    connectedEntities: [
      { name: 'Tesla', relation: 'CEO & Founder', category: 'Company' },
      { name: 'xAI', relation: 'Founder', category: 'Company' },
      { name: 'NVIDIA', relation: 'Hardware Partner', category: 'Company' },
      { name: 'US Federal Reserve', relation: 'Regulatory & Economic Impact', category: 'Organization' }
    ],
    timeline: [
      { year: '2026', title: 'xAI Compute Cluster Expansion', detail: 'Deploys 200,000 H200 GPU cluster for next-gen reasoning models.' },
      { year: '2025', title: 'Tesla Cybercab Autonomous Unveil', detail: 'Launches steering-wheel-less robotaxi fleet production line.' },
      { year: '2024', title: 'Starship Orbital Capture', detail: 'Achieves historical booster catch at Starbase.' }
    ]
  },
  {
    id: 'ent-2',
    name: 'NVIDIA Corporation',
    category: 'Company',
    description: 'Global leader in Accelerated Compute, AI GPUs, and CUDA platform architecture.',
    relevanceScore: 99,
    connectionsCount: 85,
    country: 'United States',
    keyFacts: [
      'Blackwell & Rubin GPU microarchitectures dominating AI data centers.',
      'Valuation exceeds $3.4 Trillion Market Cap.',
      'Primary hardware engine for global AI foundational models.'
    ],
    connectedEntities: [
      { name: 'Jensen Huang', relation: 'CEO', category: 'Person' },
      { name: 'TSMC', relation: 'Foundry Partner', category: 'Company' },
      { name: 'Microsoft', relation: 'Cloud AI Partner', category: 'Company' }
    ],
    timeline: [
      { year: '2026', title: 'Rubin Architecture Unveil', detail: 'Introduces next-gen HBM4 memory architecture.' },
      { year: '2025', title: 'Blackwell Enterprise Shipping', detail: 'Mass shipment to major cloud providers.' }
    ]
  },
  {
    id: 'ent-3',
    name: 'European Union (EU)',
    category: 'Organization',
    description: 'Supranational political and economic union of 27 member states in Europe.',
    relevanceScore: 94,
    connectionsCount: 120,
    country: 'Europe',
    keyFacts: [
      'Enforcing strict AI Act risk-based framework.',
      'Active clean-energy transition subsidies.',
      'Key trade negotiator with US and Asian markets.'
    ],
    connectedEntities: [
      { name: 'Ursula von der Leyen', relation: 'EU Commission President', category: 'Person' },
      { name: 'European Central Bank', relation: 'Monetary Policy', category: 'Organization' },
      { name: 'Germany', relation: 'Member State', category: 'Country' }
    ],
    timeline: [
      { year: '2026', title: 'EU AI Act Enforcement Phase 2', detail: 'Full compliance mandatory for high-risk AI models.' },
      { year: '2025', title: 'Green Industrial Plan Expansion', detail: 'Passes €250B clean tech subsidy framework.' }
    ]
  },
  {
    id: 'ent-4',
    name: 'Federal Reserve System',
    category: 'Organization',
    description: 'Central banking system of the United States guiding global monetary policy and interest rates.',
    relevanceScore: 97,
    connectionsCount: 150,
    country: 'United States',
    keyFacts: [
      'Manages US inflation targets and federal funds rate.',
      'Direct correlation with global stock indices and currency FX markets.',
      'Monitors employment, GDP growth, and credit market liquidity.'
    ],
    connectedEntities: [
      { name: 'Jerome Powell', relation: 'Fed Chair', category: 'Person' },
      { name: 'Wall Street', relation: 'Market Target', category: 'Event' },
      { name: 'US Treasury', relation: 'Fiscal Co-operation', category: 'Organization' }
    ],
    timeline: [
      { year: '2026', title: 'Rate Cut Cycle Adjustment', detail: 'Navigates soft-landing target with steady rate reductions.' }
    ]
  },
  {
    id: 'ent-5',
    name: 'Republic of Kenya',
    category: 'Country',
    description: 'East African economic and technology hub leading renewable energy and mobile financial tech.',
    relevanceScore: 91,
    connectionsCount: 38,
    country: 'Kenya',
    keyFacts: [
      '92%+ electricity generated from clean geothermal and solar.',
      'Silicon Savannah tech corridor attracting international venture capital.',
      'Nairobi hosting global trade summits and UN Environment Program HQ.'
    ],
    connectedEntities: [
      { name: 'African Union', relation: 'Member State', category: 'Organization' },
      { name: 'East African Community', relation: 'Regional Bloc', category: 'Organization' }
    ],
    timeline: [
      { year: '2026', title: 'Geothermal Energy Expansion', detail: 'Commissions additional 300MW Olkaria geothermal plant.' }
    ]
  }
];

export const KnowledgeGraphModal: React.FC<KnowledgeGraphModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeEntity, setActiveEntity] = useState<EntityItem>(KNOWLEDGE_ENTITIES[0]);

  const filteredEntities = KNOWLEDGE_ENTITIES.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Find articles matching entity
  const relatedArticles = articles.filter(a => 
    a.title.toLowerCase().includes(activeEntity.name.toLowerCase()) ||
    a.summaryMedium.toLowerCase().includes(activeEntity.name.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(activeEntity.name.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Network className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS KNOWLEDGE GRAPH & ENTITY INTELLIGENCE</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-950 text-indigo-400 border border-indigo-800">
                  AI GRAPH NEURAL NETWORK
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore connected people, global companies, nations, and market events extracted from millions of news stories.
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

        {/* Search & Filter Bar */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entity name..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {['All', 'Person', 'Company', 'Country', 'Organization'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Graph & Entity Detail Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950">
          {/* Left Column: Entity Selector List */}
          <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 p-4 space-y-2 overflow-y-auto">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              DISCOVERED ENTITIES ({filteredEntities.length})
            </h3>
            {filteredEntities.map(entity => {
              const isSelected = activeEntity.id === entity.id;
              return (
                <div
                  key={entity.id}
                  onClick={() => setActiveEntity(entity)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-950 to-slate-900 border-indigo-500 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-white">{entity.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-900/60 text-indigo-300">
                      {entity.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{entity.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                    <span>{entity.country}</span>
                    <span className="text-indigo-400 font-bold">{entity.connectionsCount} Connections</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Entity Graph Visualizer & Intelligence Dossier */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Entity Header Dossier */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white">{activeEntity.name}</h2>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {activeEntity.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{activeEntity.country} • Veritas Entity Index #{activeEntity.id}</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-center">
                    <p className="text-slate-500">RELEVANCE SCORE</p>
                    <p className="text-xl font-black text-emerald-400">{activeEntity.relevanceScore}/100</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500 font-mono">CONNECTIONS</p>
                    <p className="text-xl font-black text-indigo-400">{activeEntity.connectionsCount}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {activeEntity.description}
              </p>

              {/* Key Bullet Facts */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">PRIMARY INTELLIGENCE SUMMARY</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeEntity.keyFacts.map((fact, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1"></span>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Node Connections Graph */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-400" /> GRAPH CONNECTIONS & RELATIONAL TOPOLOGY
              </h3>

              <div className="relative w-full h-56 bg-slate-950 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full text-indigo-500/30" viewBox="0 0 600 200">
                  {/* Lines from center node to peripheral nodes */}
                  <line x1="300" y1="100" x2="120" y2="50" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                  <line x1="300" y1="100" x2="480" y2="50" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                  <line x1="300" y1="100" x2="150" y2="160" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                  <line x1="300" y1="100" x2="450" y2="160" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                </svg>

                {/* Central Active Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-indigo-600 to-purple-600 p-4 rounded-2xl text-white font-extrabold text-xs shadow-xl ring-4 ring-indigo-500/20 text-center">
                  <p>{activeEntity.name}</p>
                  <p className="text-[10px] text-indigo-200 font-normal">{activeEntity.category}</p>
                </div>

                {/* Satellite Nodes */}
                {activeEntity.connectedEntities.map((conn, idx) => {
                  const positions = [
                    'top-4 left-8',
                    'top-4 right-8',
                    'bottom-4 left-12',
                    'bottom-4 right-12'
                  ];
                  return (
                    <div
                      key={idx}
                      className={`absolute ${positions[idx % positions.length]} bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-xs text-white space-y-0.5 shadow-lg max-w-[140px]`}
                    >
                      <p className="font-bold text-indigo-300">{conn.name}</p>
                      <p className="text-[10px] text-slate-400">{conn.relation}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Related Coverage Stories */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-white flex items-center justify-between">
                <span>RELATED VERIFIED DISPATCHES ({relatedArticles.length || articles.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(relatedArticles.length > 0 ? relatedArticles : articles.slice(0, 4)).map(art => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{art.mainPublisher.name}</span>
                      <span className="text-emerald-400 font-bold">{art.confidenceScore}% Confidence</span>
                    </div>
                    <h4 className="font-extrabold text-xs text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {art.title}
                    </h4>
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
