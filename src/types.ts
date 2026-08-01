export type Category = 
  | 'All'
  | 'Top Stories'
  | 'Technology'
  | 'Artificial Intelligence'
  | 'Business'
  | 'Finance'
  | 'Politics'
  | 'World'
  | 'Science'
  | 'Health'
  | 'Sports'
  | 'Entertainment'
  | 'Climate'
  | 'Cryptocurrency'
  | 'Automotive'
  | 'Travel'
  | 'Lifestyle'
  | 'Education'
  | 'Local';

export type Region = 
  | 'Global'
  | 'Africa'
  | 'Europe'
  | 'Asia'
  | 'Middle East'
  | 'North America'
  | 'South America'
  | 'Oceania';

export type FactCheckBadge = 
  | 'Verified'
  | 'Developing'
  | 'Conflicting Reports'
  | 'Rumor'
  | 'Breaking';

export type BiasRating = 
  | 'Left'
  | 'Center-Left'
  | 'Center'
  | 'Center-Right'
  | 'Right'
  | 'Mixed'
  | 'Neutral';

export type PublisherTier = 1 | 2 | 3;

export interface PublisherInfo {
  id: string;
  name: string;
  code: string;
  logo: string;
  websiteUrl: string;
  trustScore: number; // 0 - 100
  biasRating: BiasRating;
  tier: PublisherTier;
  country: string;
  description?: string;
  historicalAccuracy?: number;
}

export interface TimelineEvent {
  timestamp: string;
  title: string;
  description: string;
  source: string;
}

export interface ConfidenceBreakdown {
  publisherTrust: number; // 40%
  recency: number; // 15%
  popularity: number; // 15%
  factCheckStatus: number; // 10%
  sourceAuthority: number; // 10%
  authorReputation: number; // 5%
  readerEngagement: number; // 5%
  totalScore: number;
}

export interface CoveragePublisher {
  publisherId: string;
  publisherName: string;
  logo: string;
  trustScore: number;
  articleTitle: string;
  url: string;
  publishedAt: string;
  bias: BiasRating;
  excerpt: string;
}

export interface Article {
  id: string;
  title: string;
  originalUrl: string;
  featuredImage: string;
  imageCaption?: string;
  summaryShort: string;
  summaryMedium: string;
  summaryDetailed: string;
  mainPublisher: PublisherInfo;
  otherPublishersCount: number;
  coverageList: CoveragePublisher[];
  category: Category;
  region: Region;
  country: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  factCheckBadge: FactCheckBadge;
  confidenceScore: number; // 0 - 100
  confidenceBreakdown: ConfidenceBreakdown;
  biasRating: BiasRating;
  biasDetails: string;
  tags: string[];
  viewpoints: {
    leftPerspective?: string;
    centerPerspective?: string;
    rightPerspective?: string;
  };
  timeline: TimelineEvent[];
  views: number;
  shares: number;
  bookmarksCount: number;
  commentsCount: number;
  isBreaking?: boolean;
  isEditorPick?: boolean;
  isTrending?: boolean;
  
  // Evergreen Content Intelligence & Lifecycle
  isEvergreen?: boolean;
  evergreenScore?: number; // 0 - 100
  evergreenReason?: string;
  articleStatus?: 'fresh' | 'category_only' | 'archived' | 'evergreen';
  trendingScore?: number;
  lastRefreshedAt?: string;
  refreshSuggestions?: string[];
  knowledgeTopics?: string[];
  seoMetadata?: {
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
    canonicalUrl: string;
    slug: string;
    schemaType?: 'NewsArticle' | 'Article' | 'TechArticle' | 'FAQPage' | 'HowTo';
    structuredData?: Record<string, any>;
  };
}

export interface TopicAuthorityHub {
  id: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  keyPeople: string[];
  organizations: string[];
  articleIds: string[];
  lastUpdated: string;
  evergreenArticleCount: number;
  authorityScore: number; // 0-100
}

export interface WeatherData {
  city: string;
  country: string;
  tempC: number;
  tempF: number;
  condition: string;
  icon: string;
  humidity: number;
  windKmH: number;
  highC: number;
  lowC: number;
  forecast: Array<{
    day: string;
    tempC: number;
    condition: string;
    icon: string;
  }>;
}

export interface StockTickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'index' | 'stock' | 'crypto' | 'forex';
  currency: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isVerifiedReader: boolean;
}

export type SupportedLanguage = 
  | 'English'
  | 'French'
  | 'Kinyarwanda'
  | 'Swahili'
  | 'Spanish'
  | 'Arabic'
  | 'Chinese'
  | 'German'
  | 'Portuguese';

export interface UserPreferences {
  bookmarks: string[];
  history: string[];
  followedTopics: string[];
  followedPublishers: string[];
  preferredLanguage: SupportedLanguage;
  regionFilter: Region;
  darkMode: boolean;
  autoplayAudio: boolean;
  breakingNewsAlerts: boolean;
}

export interface CrawlerLog {
  id: string;
  timestamp: string;
  source: string;
  articlesFetched: number;
  clustersMerged: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  executionTimeMs: number;
}
