import React, { useState } from 'react';
import {
  X,
  Radio,
  Rss,
  Globe,
  Building2,
  FileText,
  BookOpen,
  Youtube,
  Send,
  Podcast,
  GraduationCap,
  Landmark,
  Play,
  Pause,
  RefreshCw,
  Plus,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  Search,
  Filter,
  BarChart2,
  ShieldCheck,
  Server,
  Activity,
  Database,
  HardDrive,
  Copy,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Download,
  Share2
} from 'lucide-react';
import {
  UniversalCollectionEngine,
  CollectionSource,
  SourceCategory,
  CrawlPriority,
  NodeRegion,
  CrawlTaskResult,
  DiscoveredSourceCandidate
} from '../services/UniversalCollectionEngine';

interface UniversalCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UniversalCollectionModal: React.FC<UniversalCollectionModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'sources' | 'nodes_matrix' | 'discovery' | 'analytics'>('sources');
  const [sources, setSources] = useState<CollectionSource[]>(UniversalCollectionEngine.getSources());
  const [discoveredCandidates, setDiscoveredCandidates] = useState<DiscoveredSourceCandidate[]>(UniversalCollectionEngine.getDiscoveredSources());
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastCrawlResult, setLastCrawlResult] = useState<CrawlTaskResult | null>(null);
  const [isCrawling, setIsCrawling] = useState<boolean>(false);

  // New source form modal state
  const [showAddSourceModal, setShowAddSourceModal] = useState<boolean>(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceType, setNewSourceType] = useState<SourceCategory>('Government Portals');
  const [newSourcePriority, setNewSourcePriority] = useState<CrawlPriority>('P1_BREAKING_WIRE');
  const [newSourceNode, setNewSourceNode] = useState<NodeRegion>('Kigali-Node-01');
  const [newSourceCountry, setNewSourceCountry] = useState('RW');
  const [newSourceLang, setNewSourceLang] = useState('English');

  if (!isOpen) return null;

  const analytics = UniversalCollectionEngine.getAnalyticsMetrics();
  const countryProfiles = UniversalCollectionEngine.getCountryProfiles();

  const sourceIcons: Record<SourceCategory, React.ReactNode> = {
    'RSS': <Rss className="w-4 h-4 text-orange-400" />,
    'Websites': <Globe className="w-4 h-4 text-blue-400" />,
    'Government Portals': <Landmark className="w-4 h-4 text-amber-400" />,
    'Press Releases': <FileText className="w-4 h-4 text-emerald-400" />,
    'Blogs': <BookOpen className="w-4 h-4 text-purple-400" />,
    'YouTube': <Youtube className="w-4 h-4 text-red-500" />,
    'TikTok': <Zap className="w-4 h-4 text-pink-400" />,
    'Facebook Public Pages': <Share2 className="w-4 h-4 text-blue-500" />,
    'Telegram Public Channels': <Send className="w-4 h-4 text-cyan-400" />,
    'Podcasts': <Podcast className="w-4 h-4 text-indigo-400" />,
    'Research Papers': <GraduationCap className="w-4 h-4 text-teal-400" />,
    'International Organizations': <Building2 className="w-4 h-4 text-yellow-400" />
  };

  const priorityBadges: Record<CrawlPriority, { label: string; color: string }> = {
    'P0_CRITICAL_CRISIS': { label: 'P0 Critical (1m)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    'P1_BREAKING_WIRE': { label: 'P1 Wire (3-5m)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    'P2_ROUTINE_INTEL': { label: 'P2 Intel (30m)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    'P3_ARCHIVAL_RESEARCH': { label: 'P3 Archival (6h)', color: 'bg-slate-500/20 text-slate-300 border-slate-500/40' }
  };

  const filteredSources = sources.filter(s => {
    const matchesCategory = selectedCategoryFilter === 'ALL' || s.sourceType === selectedCategoryFilter;
    const matchesPriority = selectedPriorityFilter === 'ALL' || s.priority === selectedPriorityFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.countryProfile.countryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  const handleToggleSource = (id: string) => {
    UniversalCollectionEngine.toggleSourceStatus(id);
    setSources([...UniversalCollectionEngine.getSources()]);
  };

  const handleManualCrawl = (id: string) => {
    setIsCrawling(true);
    setTimeout(() => {
      const res = UniversalCollectionEngine.triggerManualCrawl(id);
      setLastCrawlResult(res);
      setSources([...UniversalCollectionEngine.getSources()]);
      setIsCrawling(false);
    }, 600);
  };

  const handleAddSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) return;

    const countryConfig = countryProfiles[newSourceCountry] || countryProfiles['RW'];
    UniversalCollectionEngine.addSource({
      name: newSourceName,
      url: newSourceUrl,
      sourceType: newSourceType,
      countryProfile: countryConfig,
      primaryLanguage: newSourceLang,
      supportedLanguages: [newSourceLang],
      priority: newSourcePriority,
      assignedNode: newSourceNode,
      scheduleCron: '*/5 * * * *',
      intervalMinutes: 5
    });

    setSources([...UniversalCollectionEngine.getSources()]);
    setShowAddSourceModal(false);
    setNewSourceName('');
    setNewSourceUrl('');
  };

  const handleApproveDiscoveredSource = (candidate: DiscoveredSourceCandidate) => {
    UniversalCollectionEngine.addSource({
      name: candidate.pageTitle,
      url: candidate.discoveredUrl,
      sourceType: candidate.detectedType,
      countryProfile: countryProfiles['RW'],
      primaryLanguage: candidate.detectedLanguage,
      supportedLanguages: [candidate.detectedLanguage],
      priority: 'P1_BREAKING_WIRE',
      assignedNode: 'Kigali-Node-01',
      scheduleCron: '*/5 * * * *',
      intervalMinutes: 5
    });

    setDiscoveredCandidates(discoveredCandidates.filter(c => c.id !== candidate.id));
    setSources([...UniversalCollectionEngine.getSources()]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-7xl max-h-[94vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/95">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-wide">Universal Collection Engine</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                  12 Multi-Channel Channels Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sovereign Crawling • Government Portals • Wire Feeds • Telegram • YouTube • Research Papers • AI Deduplication
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddSourceModal(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Collection Source</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live System Metrics Bar */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl space-y-0.5">
            <span className="text-[10px] text-slate-400 font-medium">Active Sources</span>
            <div className="text-base font-bold text-white font-mono">{analytics.totalActiveSources} Feeds</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl space-y-0.5">
            <span className="text-[10px] text-slate-400 font-medium">Throughput</span>
            <div className="text-base font-bold text-indigo-400 font-mono">{analytics.throughputReqPerMin} req/min</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl space-y-0.5">
            <span className="text-[10px] text-slate-400 font-medium">Avg Latency</span>
            <div className="text-base font-bold text-cyan-400 font-mono">{analytics.avgResponseLatencyMs} ms</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl space-y-0.5">
            <span className="text-[10px] text-slate-400 font-medium">Exact Deduplication</span>
            <div className="text-base font-bold text-emerald-400 font-mono">{analytics.exactDeduplicationRatePercent}%</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl space-y-0.5">
            <span className="text-[10px] text-slate-400 font-medium">Semantic Deduplication</span>
            <div className="text-base font-bold text-purple-400 font-mono">{analytics.semanticDeduplicationRatePercent}%</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl space-y-0.5">
            <span className="text-[10px] text-slate-400 font-medium">System Health</span>
            <div className="text-base font-bold text-emerald-400 font-mono">{analytics.systemHealthScorePercent}%</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setActiveTab('sources')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'sources' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Collection Fleet ({sources.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('nodes_matrix')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'nodes_matrix' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>Distributed Nodes Matrix (5 Regions)</span>
            </button>

            <button
              onClick={() => setActiveTab('discovery')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'discovery' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Source Auto-Discovery ({discoveredCandidates.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Crawl Analytics & Metrics</span>
            </button>
          </div>

          {lastCrawlResult && (
            <div className="hidden lg:flex items-center space-x-2 text-xs bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-indigo-200">
                Last Manual Scan [{lastCrawlResult.sourceName}]: {lastCrawlResult.rawItemsFound} items, {lastCrawlResult.exactDuplicatesPruned} exact dupes, {lastCrawlResult.executionTimeMs}ms
              </span>
            </div>
          )}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/60 space-y-6">

          {/* TAB 1: COLLECTION FLEET SOURCES */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              
              {/* Filter & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search collection sources by name, URL, country..."
                    className="bg-transparent border-none text-xs text-slate-200 focus:outline-none w-full placeholder-slate-500"
                  />
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400 font-medium flex items-center space-x-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Type:</span>
                  </span>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="ALL">All 12 Source Channels</option>
                    <option value="RSS">RSS</option>
                    <option value="Websites">Websites</option>
                    <option value="Government Portals">Government Portals</option>
                    <option value="Press Releases">Press Releases</option>
                    <option value="Blogs">Blogs</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Facebook Public Pages">Facebook Pages</option>
                    <option value="Telegram Public Channels">Telegram Channels</option>
                    <option value="Podcasts">Podcasts</option>
                    <option value="Research Papers">Research Papers</option>
                    <option value="International Organizations">Int. Organizations</option>
                  </select>

                  <select
                    value={selectedPriorityFilter}
                    onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="ALL">All Priorities (P0-P3)</option>
                    <option value="P0_CRITICAL_CRISIS">P0 Critical (1m)</option>
                    <option value="P1_BREAKING_WIRE">P1 Wire (3-5m)</option>
                    <option value="P2_ROUTINE_INTEL">P2 Intel (30m)</option>
                    <option value="P3_ARCHIVAL_RESEARCH">P3 Archival (6h)</option>
                  </select>
                </div>
              </div>

              {/* Sources Table */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Channel / Source Name</th>
                        <th className="py-3 px-3">Type</th>
                        <th className="py-3 px-3">Country / Lang</th>
                        <th className="py-3 px-3">Priority</th>
                        <th className="py-3 px-3">Worker Node</th>
                        <th className="py-3 px-3">Health</th>
                        <th className="py-3 px-3">Ingested</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {filteredSources.map((source) => {
                        const prio = priorityBadges[source.priority];
                        return (
                          <tr key={source.id} className="hover:bg-slate-900/70 transition">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center space-x-2.5">
                                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                                  {sourceIcons[source.sourceType]}
                                </div>
                                <div>
                                  <div className="font-bold text-white text-xs flex items-center space-x-1.5">
                                    <span>{source.name}</span>
                                    {source.status === 'ACTIVE_RUNNING' && (
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active Poll Loop" />
                                    )}
                                  </div>
                                  <a href={source.url} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 hover:text-indigo-400 truncate max-w-[220px] block">
                                    {source.url}
                                  </a>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3 font-medium text-slate-300">
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                                {source.sourceType}
                              </span>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex items-center space-x-1.5">
                                <span>{source.countryProfile.flagEmoji}</span>
                                <span className="font-semibold text-slate-200">{source.countryProfile.countryName}</span>
                                <span className="text-[10px] text-slate-500">({source.primaryLanguage})</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border ${prio.color}`}>
                                {prio.label}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 font-mono text-[11px] text-cyan-300">
                              {source.assignedNode}
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-mono text-emerald-400 font-bold text-[11px]">{source.healthScore}%</span>
                                <span className="text-[10px] text-slate-500">({source.avgLatencyMs}ms)</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-3 font-mono text-slate-200">
                              {source.totalArticlesFetched.toLocaleString()}
                              <span className="text-[10px] text-slate-500 block">(-{source.duplicateSuppressedCount} dupes)</span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleManualCrawl(source.id)}
                                  disabled={isCrawling}
                                  className="p-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 rounded-lg transition"
                                  title="Trigger Manual Instant Scan"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${isCrawling ? 'animate-spin text-indigo-400' : ''}`} />
                                </button>

                                <button
                                  onClick={() => handleToggleSource(source.id)}
                                  className={`p-1.5 rounded-lg border transition ${
                                    source.status === 'ACTIVE_RUNNING'
                                      ? 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/60'
                                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60'
                                  }`}
                                  title={source.status === 'ACTIVE_RUNNING' ? 'Pause Poll Loop' : 'Resume Poll Loop'}
                                >
                                  {source.status === 'ACTIVE_RUNNING' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DISTRIBUTED NODES MATRIX */}
          {activeTab === 'nodes_matrix' && (
            <div className="space-y-6">
              
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-2">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Server className="w-5 h-5 text-indigo-400" />
                  <span>Sovereign Distributed Crawling Worker Cluster Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Active Edge Node Workers stationed in Kigali, Nairobi, Frankfurt, Washington DC, and Singapore to ensure zero regional geo-blocking, minimal network latency, and high-volume parallel crawling.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.activeWorkerNodes.map((node) => (
                  <div key={node.nodeId} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-indigo-950/80 text-indigo-400 rounded-lg">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{node.nodeId}</div>
                          <span className="text-[10px] text-slate-400">{node.location}</span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                        ONLINE 100%
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Active Parallel Jobs:</span>
                        <span className="font-bold text-indigo-300">{node.activeJobs} Jobs</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Response Success Rate:</span>
                        <span className="font-bold text-emerald-400">{node.successRate}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Egress Bandwidth:</span>
                        <span className="font-bold text-cyan-400">{(node.bandwidthKbps / 1000).toFixed(1)} Mbps</span>
                      </div>

                      {/* Health Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Circuit Breaker Status</span>
                          <span className="text-emerald-400 font-bold">HEALTHY</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full w-[98%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: SOURCE AUTO-DISCOVERY */}
          {activeTab === 'discovery' && (
            <div className="space-y-6">
              
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>Automatic Source Discovery Radar</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sitemap XML scanners, RSS header auto-detectors, and Telegram public broadcast link miners discovering new trusted sources automatically.
                  </p>
                </div>

                <button
                  onClick={() => alert('Initiating Deep Sitemap & RSS Auto-Discovery Crawler Sweep...')}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-amber-600/20 transition shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Run Discovery Sweep</span>
                </button>
              </div>

              <div className="space-y-3">
                {discoveredCandidates.map((candidate) => (
                  <div key={candidate.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-xs">{candidate.pageTitle}</span>
                        <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-semibold">
                          {candidate.detectedType}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-mono">
                          {(candidate.confidenceScore * 100).toFixed(0)}% AI Confidence
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 font-mono">
                        Target: <a href={candidate.discoveredUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">{candidate.discoveredUrl}</a>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApproveDiscoveredSource(candidate)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 shadow transition shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Approve & Add to Fleet</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: CRAWL ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Source Type Breakdown */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    <span>Coverage Across 12 Collection Channels</span>
                  </h4>

                  <div className="space-y-2.5">
                    {Object.entries(analytics.sourcesByType).map(([type, count]) => (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 flex items-center space-x-2">
                            {sourceIcons[type as SourceCategory]}
                            <span>{type}</span>
                          </span>
                          <span className="font-mono text-indigo-300 font-bold">{count} Sources</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (count / analytics.totalActiveSources) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Country Ingestion Breakdown */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Ingestion Volume by Country Profile</span>
                  </h4>

                  <div className="space-y-3">
                    {analytics.topCountryIngestion.map((item) => (
                      <div key={item.country} className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                        <div className="flex items-center space-x-2.5">
                          <span className="text-base">{item.flag}</span>
                          <span className="font-bold text-white">{item.country}</span>
                        </div>
                        <div className="font-mono text-emerald-400 font-bold">
                          {item.count.toLocaleString()} Items / Day
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>

      {/* ADD NEW SOURCE FORM MODAL OVERLAY */}
      {showAddSourceModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <span>Add Collection Channel Source</span>
              </h3>
              <button onClick={() => setShowAddSourceModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSourceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Source Name</label>
                <input
                  type="text"
                  required
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  placeholder="e.g. Rwanda Ministry of Foreign Affairs Dispatch"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Feed / Portal URL</label>
                <input
                  type="url"
                  required
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  placeholder="https://www.minaffet.gov.rw/rss or https://t.me/s/channel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Source Category (12 Types)</label>
                  <select
                    value={newSourceType}
                    onChange={(e) => setNewSourceType(e.target.value as SourceCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="RSS">RSS</option>
                    <option value="Websites">Websites</option>
                    <option value="Government Portals">Government Portals</option>
                    <option value="Press Releases">Press Releases</option>
                    <option value="Blogs">Blogs</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Facebook Public Pages">Facebook Pages</option>
                    <option value="Telegram Public Channels">Telegram Channels</option>
                    <option value="Podcasts">Podcasts</option>
                    <option value="Research Papers">Research Papers</option>
                    <option value="International Organizations">Int. Organizations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Crawl Priority</label>
                  <select
                    value={newSourcePriority}
                    onChange={(e) => setNewSourcePriority(e.target.value as CrawlPriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="P0_CRITICAL_CRISIS">P0 Critical (1m poll)</option>
                    <option value="P1_BREAKING_WIRE">P1 Wire (3-5m poll)</option>
                    <option value="P2_ROUTINE_INTEL">P2 Routine (30m poll)</option>
                    <option value="P3_ARCHIVAL_RESEARCH">P3 Archival (6h poll)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Country Profile</label>
                  <select
                    value={newSourceCountry}
                    onChange={(e) => setNewSourceCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    {Object.values(countryProfiles).map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.flagEmoji} {c.countryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Assigned Worker Node</label>
                  <select
                    value={newSourceNode}
                    onChange={(e) => setNewSourceNode(e.target.value as NodeRegion)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="Kigali-Node-01">Kigali-Node-01 (East Africa)</option>
                    <option value="Nairobi-Node-02">Nairobi-Node-02 (Horn/Central)</option>
                    <option value="Frankfurt-Node-03">Frankfurt-Node-03 (Europe/UN)</option>
                    <option value="Washington-Node-04">Washington-Node-04 (Americas)</option>
                    <option value="Singapore-Node-05">Singapore-Node-05 (Asia-Pac)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddSourceModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20"
                >
                  Register Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
