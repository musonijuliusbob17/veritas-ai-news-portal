export type SourceCategory =
  | 'RSS'
  | 'Websites'
  | 'Government Portals'
  | 'Press Releases'
  | 'Blogs'
  | 'YouTube'
  | 'TikTok'
  | 'Facebook Public Pages'
  | 'Telegram Public Channels'
  | 'Podcasts'
  | 'Research Papers'
  | 'International Organizations';

export type CrawlPriority = 'P0_CRITICAL_CRISIS' | 'P1_BREAKING_WIRE' | 'P2_ROUTINE_INTEL' | 'P3_ARCHIVAL_RESEARCH';

export type NodeRegion = 'Kigali-Node-01' | 'Nairobi-Node-02' | 'Frankfurt-Node-03' | 'Washington-Node-04' | 'Singapore-Node-05';

export interface CountryProfileConfig {
  isoCode: string;
  countryName: string;
  flagEmoji: string;
  region: string;
  priorityLevel: number;
}

export interface CollectionSource {
  id: string;
  name: string;
  sourceType: SourceCategory;
  url: string;
  countryProfile: CountryProfileConfig;
  primaryLanguage: string;
  supportedLanguages: string[];
  priority: CrawlPriority;
  assignedNode: NodeRegion;
  scheduleCron: string; // e.g. "*/1 * * * *" or "*/5 * * * *"
  intervalMinutes: number;
  lastCrawledAt: string;
  healthScore: number; // 0-100%
  circuitBreakerStatus: 'CLOSED_HEALTHY' | 'HALF_OPEN_RETRY' | 'OPEN_CIRCUIT_BROKEN';
  totalArticlesFetched: number;
  duplicateSuppressedCount: number;
  avgLatencyMs: number;
  status: 'ACTIVE_RUNNING' | 'PAUSED' | 'SCHEDULED' | 'FAILED_RETRYING';
}

export interface CrawlTaskResult {
  taskId: string;
  sourceId: string;
  sourceName: string;
  sourceType: SourceCategory;
  timestamp: string;
  priority: CrawlPriority;
  nodeUsed: NodeRegion;
  status: 'SUCCESS' | 'DUPLICATE_PRUNED' | 'CIRCUIT_BROKEN' | 'RETRY_QUEUED';
  rawItemsFound: number;
  newUniqueArticles: Partial<CollectionItem>[];
  exactDuplicatesPruned: number;
  semanticDuplicatesMerged: number;
  aiEnrichedCount: number;
  executionTimeMs: number;
  httpStatusCode: number;
}

export interface CollectionItem {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType: SourceCategory;
  title: string;
  originalUrl: string;
  bodyText: string;
  summary: string;
  publishedAt: string;
  crawledAt: string;
  country: string;
  language: string;
  priority: CrawlPriority;
  contentHashMd5: string;
  semanticClusterId: string;
  similarityScoreWithPrimary?: number;
  entities: {
    people: string[];
    organizations: string[];
    locations: string[];
    technologies: string[];
  };
  credibilityScore: number;
  aiSummaryShort: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'HIGH_RISK_ALERT';
  assignedWorkerNode: NodeRegion;
}

export interface CrawlAnalyticsMetrics {
  totalActiveSources: number;
  totalArticlesIngestedToday: number;
  throughputReqPerMin: number;
  avgResponseLatencyMs: number;
  exactDeduplicationRatePercent: number;
  semanticDeduplicationRatePercent: number;
  systemHealthScorePercent: number;
  activeWorkerNodes: {
    nodeId: NodeRegion;
    location: string;
    activeJobs: number;
    successRate: number;
    bandwidthKbps: number;
  }[];
  sourcesByType: Record<SourceCategory, number>;
  sourcesByPriority: Record<CrawlPriority, number>;
  topCountryIngestion: { country: string; count: number; flag: string }[];
}

export interface DiscoveredSourceCandidate {
  id: string;
  discoveredUrl: string;
  pageTitle: string;
  detectedType: SourceCategory;
  detectedLanguage: string;
  confidenceScore: number;
  parentDomain: string;
  discoveredAt: string;
}

export class UniversalCollectionEngine {
  private static countryProfiles: Record<string, CountryProfileConfig> = {
    RW: { isoCode: 'RW', countryName: 'Rwanda', flagEmoji: '🇷🇼', region: 'East Africa', priorityLevel: 1 },
    KE: { isoCode: 'KE', countryName: 'Kenya', flagEmoji: '🇰🇪', region: 'East Africa', priorityLevel: 1 },
    ZA: { isoCode: 'ZA', countryName: 'South Africa', flagEmoji: '🇿🇦', region: 'Southern Africa', priorityLevel: 2 },
    CD: { isoCode: 'CD', countryName: 'DR Congo', flagEmoji: '🇨🇩', region: 'Central Africa', priorityLevel: 1 },
    ET: { isoCode: 'ET', countryName: 'Ethiopia', flagEmoji: '🇪🇹', region: 'Horn of Africa', priorityLevel: 2 },
    UG: { isoCode: 'UG', countryName: 'Uganda', flagEmoji: '🇺🇬', region: 'East Africa', priorityLevel: 2 },
    US: { isoCode: 'US', countryName: 'United States', flagEmoji: '🇺🇸', region: 'North America', priorityLevel: 2 },
    GB: { isoCode: 'GB', countryName: 'United Kingdom', flagEmoji: '🇬🇧', region: 'Europe', priorityLevel: 2 },
    CN: { isoCode: 'CN', countryName: 'China', flagEmoji: '🇨🇳', region: 'Asia-Pacific', priorityLevel: 2 },
    UN: { isoCode: 'UN', countryName: 'International (UN/AU/EAC)', flagEmoji: '🇺🇳', region: 'Global', priorityLevel: 1 }
  };

  private static collectionSources: CollectionSource[] = [
    {
      id: 'src_newtimes_rw',
      name: 'The New Times Rwanda',
      sourceType: 'RSS',
      url: 'https://www.newtimes.co.rw/rss',
      countryProfile: UniversalCollectionEngine.countryProfiles.RW,
      primaryLanguage: 'English',
      supportedLanguages: ['English', 'Kinyarwanda'],
      priority: 'P1_BREAKING_WIRE',
      assignedNode: 'Kigali-Node-01',
      scheduleCron: '*/3 * * * *',
      intervalMinutes: 3,
      lastCrawledAt: new Date(Date.now() - 45000).toISOString(),
      healthScore: 99.4,
      circuitBreakerStatus: 'CLOSED_HEALTHY',
      totalArticlesFetched: 14200,
      duplicateSuppressedCount: 1840,
      avgLatencyMs: 142,
      status: 'ACTIVE_RUNNING'
    },
    {
      id: 'src_risa_gov_rw',
      name: 'RISA Official Sovereign Tech Gazette',
      sourceType: 'Government Portals',
      url: 'https://www.risa.gov.rw/news-and-updates',
      countryProfile: UniversalCollectionEngine.countryProfiles.RW,
      primaryLanguage: 'Kinyarwanda',
      supportedLanguages: ['Kinyarwanda', 'English', 'French'],
      priority: 'P0_CRITICAL_CRISIS',
      assignedNode: 'Kigali-Node-01',
      scheduleCron: '*/1 * * * *',
      intervalMinutes: 1,
      lastCrawledAt: new Date(Date.now() - 20000).toISOString(),
      healthScore: 100,
      circuitBreakerStatus: 'CLOSED_HEALTHY',
      totalArticlesFetched: 4120,
      duplicateSuppressedCount: 290,
      avgLatencyMs: 98,
      status: 'ACTIVE_RUNNING'
    },
    {
      id: 'src_eastafrican_ke',
      name: 'The EastAfrican Regional Bureau',
      sourceType: 'Websites',
      url: 'https://www.theeastafrican.co.ke/business',
      countryProfile: UniversalCollectionEngine.countryProfiles.KE,
      primaryLanguage: 'English',
      supportedLanguages: ['English', 'Swahili'],
      priority: 'P1_BREAKING_WIRE',
      assignedNode: 'Nairobi-Node-02',
      scheduleCron: '*/5 * * * *',
      intervalMinutes: 5,
      lastCrawledAt: new Date(Date.now() - 120000).toISOString(),
      healthScore: 98.2,
      circuitBreakerStatus: 'CLOSED_HEALTHY',
      totalArticlesFetched: 18900,
      duplicateSuppressedCount: 3100,
      avgLatencyMs: 185,
      status: 'ACTIVE_RUNNING'
    },
    {
      id: 'src_eac_secretariat',
      name: 'EAC Secretariat Regional Portal',
      sourceType: 'International Organizations',
      url: 'https://www.eac.int/press-releases',
      countryProfile: UniversalCollectionEngine.countryProfiles.UN,
      primaryLanguage: 'English',
      supportedLanguages: ['English', 'Swahili', 'French'],
      priority: 'P1_BREAKING_WIRE',
      assignedNode: 'Nairobi-Node-02',
      scheduleCron: '*/10 * * * *',
      intervalMinutes: 10,
      lastCrawledAt: new Date(Date.now() - 240000).toISOString(),
      healthScore: 97.5,
      circuitBreakerStatus: 'CLOSED_HEALTHY',
      totalArticlesFetched: 3410,
      duplicateSuppressedCount: 420,
      avgLatencyMs: 210,
      status: 'ACTIVE_RUNNING'
    },
    {
      id: 'src_telegram_rw_wire',
      name: 'Telegram Public Dispatch Rwanda',
      sourceType: 'Telegram Public Channels',
      url: 'https://t.me/s/rwanda_official_wire',
      countryProfile: UniversalCollectionEngine.countryProfiles.RW,
      primaryLanguage: 'Kinyarwanda',
      supportedLanguages: ['Kinyarwanda', 'French'],
      priority: 'P0_CRITICAL_CRISIS',
      assignedNode: 'Kigali-Node-01',
      scheduleCron: '*/1 * * * *',
      intervalMinutes: 1,
      lastCrawledAt: new Date(Date.now() - 15000).toISOString(),
      healthScore: 99.8,
      circuitBreakerStatus: 'CLOSED_HEALTHY',
      totalArticlesFetched: 8900,
      duplicateSuppressedCount: 1200,
      avgLatencyMs: 78,
      status: 'ACTIVE_RUNNING'
    },
    {
      id: 'src_yt_rwanda_tv',
      name: 'Rwanda Broadcasting Agency YouTube',
      sourceType: 'YouTube',
      url: 'https://www.youtube.com/@RwandaBroadcastingAgency',
      countryProfile: UniversalCollectionEngine.countryProfiles.RW,
      primaryLanguage: 'Kinyarwanda',
      supportedLanguages: ['Kinyarwanda', 'English', 'French'],
      priority: 'P1_BREAKING_WIRE',
      assignedNode: 'Kigali-Node-01',
      scheduleCron: '*/15 * * * *',
      intervalMinutes: 15,
      lastCrawledAt: new Date(Date.now() - 300000).toISOString(),
      healthScore: 96.4,
      circuitBreakerStatus: 'CLOSED_HEALTHY',
      totalArticlesFetched: 2450,
      duplicateSuppressedCount: 180,
      avgLatencyMs: 420,
      status: 'ACTIVE_RUNNING'
    },
    {
      id: 'src_reuters_world',
      name: 'Reuters World News Wire',
      sourceType: 'Press Releases',
      url: 'https://www.reuters.com/world',
      countryProfile: UniversalCollectionEngine.countryProfiles.US,
      primaryLanguage: 'English',
      supportedLanguages: ['English', 'Spanish', 'Mandarin'],
      priority: 'P1_BREAKING_WIRE',
      assignedNode: 'Washington-Node-04',
      scheduleCron: '*/2 * * * *',
      intervalMinutes: 2,
      lastCrawledAt: new Date(Date.now() - 60000).toISOString(),
      healthScore: 99.9,
      circuitBreakerStatus: 'CLOSED_HEALTHY',
      totalArticlesFetched: 45000,
      duplicateSuppressedCount: 12400,
      avgLatencyMs: 110,
      status: 'ACTIVE_RUNNING'
    },
    {
      id: 'src_un_news_africa',
      name: 'UN News Centre Africa',
      sourceType: 'International Organizations',
      url: 'https://news.un.org/feed/subscribe/en/news/region/africa/feed.rss',
      countryProfile: UniversalCollectionEngine.countryProfiles.UN,
      primaryLanguage: 'English',
      supportedLanguages: ['English', 'French', 'Arabic'],
      priority: 'P1_BREAKING_WIRE',
      assignedNode: 'Frankfurt-Node-03',
      scheduleCron: '*/10 * * * *',
      intervalMinutes: 10,
      lastCrawledAt: new Date(Date.now() - 180000).toISOString(),
      healthScore: 98.9,
      circuitBreakerStatus: 'CLOSED_HEALTHY',
      totalArticlesFetched: 11200,
      duplicateSuppressedCount: 1950,
      avgLatencyMs: 165,
      status: 'ACTIVE_RUNNING'
    },
    {
      id: 'src_nature_academic',
      name: 'Nature & African Science Journals',
      sourceType: 'Research Papers',
      url: 'https://www.nature.com/subjects/development-studies.rss',
      countryProfile: UniversalCollectionEngine.countryProfiles.GB,
      primaryLanguage: 'English',
      supportedLanguages: ['English'],
      priority: 'P3_ARCHIVAL_RESEARCH',
      assignedNode: 'Frankfurt-Node-03',
      scheduleCron: '0 */6 * * *',
      intervalMinutes: 360,
      lastCrawledAt: new Date(Date.now() - 14400000).toISOString(),
      healthScore: 99.1,
      circuitBreakerStatus: 'CLOSED_HEALTHY',
      totalArticlesFetched: 1240,
      duplicateSuppressedCount: 85,
      avgLatencyMs: 310,
      status: 'ACTIVE_RUNNING'
    },
    {
      id: 'src_pod_africa_today',
      name: 'Africa Focus Daily Podcast Feed',
      sourceType: 'Podcasts',
      url: 'https://feeds.simplecast.com/africa_focus_daily',
      countryProfile: UniversalCollectionEngine.countryProfiles.ZA,
      primaryLanguage: 'English',
      supportedLanguages: ['English', 'Swahili'],
      priority: 'P2_ROUTINE_INTEL',
      assignedNode: 'Nairobi-Node-02',
      scheduleCron: '0 */2 * * *',
      intervalMinutes: 120,
      lastCrawledAt: new Date(Date.now() - 3600000).toISOString(),
      healthScore: 95.0,
      circuitBreakerStatus: 'CLOSED_HEALTHY',
      totalArticlesFetched: 890,
      duplicateSuppressedCount: 45,
      avgLatencyMs: 540,
      status: 'ACTIVE_RUNNING'
    }
  ];

  private static mockDiscoveredSources: DiscoveredSourceCandidate[] = [
    {
      id: 'disc_001',
      discoveredUrl: 'https://www.minict.gov.rw/rss',
      pageTitle: 'Rwanda Ministry of ICT & Innovation Announcements',
      detectedType: 'Government Portals',
      detectedLanguage: 'English',
      confidenceScore: 0.98,
      parentDomain: 'minict.gov.rw',
      discoveredAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'disc_002',
      discoveredUrl: 'https://t.me/s/eac_trade_bulletin',
      pageTitle: 'EAC Regional Trade & Tariffs Live Channel',
      detectedType: 'Telegram Public Channels',
      detectedLanguage: 'Swahili',
      confidenceScore: 0.94,
      parentDomain: 't.me',
      discoveredAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'disc_003',
      discoveredUrl: 'https://www.afdb.org/en/news-and-events/rss',
      pageTitle: 'African Development Bank Press Releases',
      detectedType: 'International Organizations',
      detectedLanguage: 'French',
      confidenceScore: 0.99,
      parentDomain: 'afdb.org',
      discoveredAt: new Date(Date.now() - 10800000).toISOString()
    }
  ];

  public static getSources(): CollectionSource[] {
    return this.collectionSources;
  }

  public static getDiscoveredSources(): DiscoveredSourceCandidate[] {
    return this.mockDiscoveredSources;
  }

  public static getCountryProfiles(): Record<string, CountryProfileConfig> {
    return this.countryProfiles;
  }

  public static getAnalyticsMetrics(): CrawlAnalyticsMetrics {
    const sources = this.collectionSources;
    const sourcesByType = {} as Record<SourceCategory, number>;
    const sourcesByPriority = {} as Record<CrawlPriority, number>;

    sources.forEach(s => {
      sourcesByType[s.sourceType] = (sourcesByType[s.sourceType] || 0) + 1;
      sourcesByPriority[s.priority] = (sourcesByPriority[s.priority] || 0) + 1;
    });

    return {
      totalActiveSources: sources.length,
      totalArticlesIngestedToday: 128450,
      throughputReqPerMin: 1420,
      avgResponseLatencyMs: 148,
      exactDeduplicationRatePercent: 28.4,
      semanticDeduplicationRatePercent: 14.2,
      systemHealthScorePercent: 99.2,
      activeWorkerNodes: [
        { nodeId: 'Kigali-Node-01', location: 'Kigali, RWA (East Africa Edge)', activeJobs: 14, successRate: 99.8, bandwidthKbps: 45000 },
        { nodeId: 'Nairobi-Node-02', location: 'Nairobi, KEN (Horn/Central Edge)', activeJobs: 12, successRate: 98.9, bandwidthKbps: 38000 },
        { nodeId: 'Frankfurt-Node-03', location: 'Frankfurt, DEU (European/UN Hub)', activeJobs: 8, successRate: 99.4, bandwidthKbps: 62000 },
        { nodeId: 'Washington-Node-04', location: 'Washington DC, USA (Americas Hub)', activeJobs: 10, successRate: 99.9, bandwidthKbps: 78000 },
        { nodeId: 'Singapore-Node-05', location: 'Singapore (Asia-Pacific Radar)', activeJobs: 6, successRate: 98.2, bandwidthKbps: 31000 }
      ],
      sourcesByType,
      sourcesByPriority,
      topCountryIngestion: [
        { country: 'Rwanda', count: 42100, flag: '🇷🇼' },
        { country: 'Kenya', count: 31200, flag: '🇰🇪' },
        { country: 'DR Congo', count: 18400, flag: '🇨🇩' },
        { country: 'International (UN/AU)', count: 21500, flag: '🇺🇳' },
        { country: 'South Africa', count: 15250, flag: '🇿🇦' }
      ]
    };
  }

  public static addSource(newSource: Omit<CollectionSource, 'id' | 'lastCrawledAt' | 'healthScore' | 'circuitBreakerStatus' | 'totalArticlesFetched' | 'duplicateSuppressedCount' | 'avgLatencyMs' | 'status'>): CollectionSource {
    const created: CollectionSource = {
      ...newSource,
      id: `src_custom_${Date.now()}`,
      lastCrawledAt: new Date().toISOString(),
      healthScore: 100,
      circuitBreakerStatus: 'CLOSED_HEALTHY',
      totalArticlesFetched: 0,
      duplicateSuppressedCount: 0,
      avgLatencyMs: 120,
      status: 'ACTIVE_RUNNING'
    };
    this.collectionSources.unshift(created);
    return created;
  }

  public static toggleSourceStatus(sourceId: string): boolean {
    const src = this.collectionSources.find(s => s.id === sourceId);
    if (!src) return false;
    src.status = src.status === 'ACTIVE_RUNNING' ? 'PAUSED' : 'ACTIVE_RUNNING';
    return true;
  }

  public static triggerManualCrawl(sourceId: string): CrawlTaskResult {
    const src = this.collectionSources.find(s => s.id === sourceId) || this.collectionSources[0];
    const startTime = Date.now();

    // Update crawl timestamps
    src.lastCrawledAt = new Date().toISOString();
    src.totalArticlesFetched += 12;
    src.duplicateSuppressedCount += 3;

    return {
      taskId: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sourceId: src.id,
      sourceName: src.name,
      sourceType: src.sourceType,
      timestamp: new Date().toISOString(),
      priority: src.priority,
      nodeUsed: src.assignedNode,
      status: 'SUCCESS',
      rawItemsFound: 15,
      exactDuplicatesPruned: 2,
      semanticDuplicatesMerged: 1,
      aiEnrichedCount: 12,
      executionTimeMs: Date.now() - startTime + Math.floor(Math.random() * 120 + 80),
      httpStatusCode: 200,
      newUniqueArticles: [
        {
          id: `item_${Date.now()}`,
          title: `[${src.name}] Sovereign Digital Economy Expansion & Trade Policy Update`,
          aiSummaryShort: `Real-time collection via ${src.sourceType} pipeline on node ${src.assignedNode}.`,
          country: src.countryProfile.countryName,
          language: src.primaryLanguage,
          sourceId: src.id,
          sourceName: src.name,
          sourceType: src.sourceType,
          priority: src.priority,
          assignedWorkerNode: src.assignedNode
        }
      ]
    };
  }
}
