import { Article, Category, Region } from '../types';
import { NewsIntelligenceEngine } from './NewsIntelligenceEngine';

export interface IngestedItem {
  id: string;
  sourceType: 'RSS' | 'NewsAPI' | 'Government' | 'EconomicDB' | 'ScientificPub' | 'Corporate' | 'PublicDataset';
  sourceName: string;
  title: string;
  rawText: string;
  publishedAt: string;
  detectedLanguage: string;
  location: {
    country?: string;
    city?: string;
    region: Region;
  };
  classification: {
    primaryCategory: Category;
    secondaryCategories: Category[];
  };
  entities: {
    people: string[];
    organizations: string[];
    locations: string[];
    technologies: string[];
  };
  ingestedAt: string;
  status: 'INGESTED' | 'QUEUED' | 'VERIFIED' | 'PUBLISHED';

  // UI display helpers
  source_type?: string;
  source?: string;
  content?: string;
  published_date?: string;
  processing_status?: string;
}

export class GlobalDataIngestionEngine {
  /**
   * Mock ingested feed items for live pipeline display
   */
  public static getIngestedItems(): IngestedItem[] {
    return [
      {
        id: 'ing_001',
        sourceType: 'Government',
        source_type: 'Government Portal',
        sourceName: 'Rwanda Information Society Authority',
        source: 'RISA Official Press',
        title: 'National Sovereign AI Compute Cluster Infrastructure Framework Announced',
        rawText: 'Kigali establishes high-performance sovereign AI infrastructure for pan-African research & enterprise startups.',
        content: 'Kigali establishes high-performance sovereign AI infrastructure for pan-African research & enterprise startups.',
        publishedAt: new Date().toISOString(),
        published_date: 'Just now',
        detectedLanguage: 'English',
        location: { country: 'Rwanda', city: 'Kigali', region: 'Africa' },
        classification: { primaryCategory: 'Technology', secondaryCategories: ['Top Stories'] },
        entities: { people: ['Paul Kagame'], organizations: ['RISA', 'AIMS'], locations: ['Rwanda'], technologies: ['AI Compute'] },
        ingestedAt: new Date().toISOString(),
        status: 'VERIFIED',
        processing_status: 'QUEUED_FOR_KNOWLEDGE_GRAPH'
      },
      {
        id: 'ing_002',
        sourceType: 'EconomicDB',
        source_type: 'International Wire',
        sourceName: 'East African Power Pool',
        source: 'EAPP Trade Registry',
        title: '$4.2B Cross-Border Geothermal Grid Synchronised Across EAC',
        rawText: 'Nairobi-Kigali clean energy transmission interconnector operationalized.',
        content: 'Nairobi-Kigali clean energy transmission interconnector operationalized.',
        publishedAt: new Date().toISOString(),
        published_date: '12m ago',
        detectedLanguage: 'English',
        location: { country: 'Kenya', city: 'Nairobi', region: 'Africa' },
        classification: { primaryCategory: 'Climate', secondaryCategories: ['Business'] },
        entities: { people: [], organizations: ['World Bank', 'Kenya Power'], locations: ['Kenya', 'Rwanda'], technologies: ['Renewable Grid'] },
        ingestedAt: new Date().toISOString(),
        status: 'VERIFIED',
        processing_status: 'VERIFIED_MULTI_SOURCE'
      },
      {
        id: 'ing_003',
        sourceType: 'NewsAPI',
        source_type: 'Reuters Wire',
        sourceName: 'Global Trade Bureau',
        source: 'Reuters Financial',
        title: 'AfCFTA Digital Payment Settlement System Surges Past $10B Transactions',
        rawText: 'PAPSS instant currency exchange protocol eliminates dollar clearing costs across 42 African nations.',
        content: 'PAPSS instant currency exchange protocol eliminates dollar clearing costs across 42 African nations.',
        publishedAt: new Date().toISOString(),
        published_date: '28m ago',
        detectedLanguage: 'English',
        location: { country: 'Ghana', city: 'Accra', region: 'Africa' },
        classification: { primaryCategory: 'Business', secondaryCategories: ['Finance'] },
        entities: { people: [], organizations: ['AfCFTA', 'Afreximbank'], locations: ['Ghana'], technologies: ['FinTech'] },
        ingestedAt: new Date().toISOString(),
        status: 'PUBLISHED',
        processing_status: 'PUBLISHED_LIVE'
      }
    ];
  }

  /**
   * Continuous pipeline ingesting raw global feeds into structured Intelligence items
   */
  public static processIncomingItem(
    rawItem: Partial<IngestedItem>,
    sourceName: string = 'International Wire Feed'
  ): IngestedItem {
    const title = rawItem.title || 'Untitled Global Ingestion Signal';
    const text = `${title} ${rawItem.rawText || ''}`.toLowerCase();

    // Language Detection
    let detectedLanguage = 'English';
    if (text.includes('le ') || text.includes(' la ') || text.includes('et ')) detectedLanguage = 'French';
    else if (text.includes('yuko ') || text.includes('katika ')) detectedLanguage = 'Swahili';
    else if (text.includes('muraako ') || text.includes('rwanda ')) detectedLanguage = 'Kinyarwanda';

    // Location Extraction
    let region: Region = 'Global';
    let country: string | undefined = undefined;
    let city: string | undefined = undefined;

    if (text.includes('rwanda') || text.includes('kigali')) {
      region = 'Africa';
      country = 'Rwanda';
      city = 'Kigali';
    } else if (text.includes('kenya') || text.includes('nairobi')) {
      region = 'Africa';
      country = 'Kenya';
      city = 'Nairobi';
    } else if (text.includes('france') || text.includes('paris')) {
      region = 'Europe';
      country = 'France';
      city = 'Paris';
    } else if (text.includes('usa') || text.includes('washington') || text.includes('new york')) {
      region = 'North America';
      country = 'United States';
      city = 'Washington';
    }

    // Classification
    let primaryCategory: Category = 'Top Stories';
    if (text.includes('ai') || text.includes('tech') || text.includes('software') || text.includes('chip')) primaryCategory = 'Technology';
    else if (text.includes('bank') || text.includes('market') || text.includes('trade') || text.includes('gdp')) primaryCategory = 'Business';
    else if (text.includes('climate') || text.includes('solar') || text.includes('carbon') || text.includes('energy')) primaryCategory = 'Climate';
    else if (text.includes('election') || text.includes('policy') || text.includes('minister') || text.includes('treaty')) primaryCategory = 'Politics';

    return {
      id: `ingest_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      sourceType: rawItem.sourceType || 'RSS',
      sourceName,
      title,
      rawText: rawItem.rawText || title,
      publishedAt: rawItem.publishedAt || new Date().toISOString(),
      detectedLanguage,
      location: { country, city, region },
      classification: {
        primaryCategory,
        secondaryCategories: ['Top Stories']
      },
      entities: {
        people: text.includes('kagame') ? ['Paul Kagame'] : [],
        organizations: text.includes('au') ? ['African Union'] : ['Veritas Global Wire'],
        locations: country ? [country] : ['Global'],
        technologies: primaryCategory === 'Technology' ? ['Artificial Intelligence'] : []
      },
      ingestedAt: new Date().toISOString(),
      status: 'VERIFIED'
    };
  }

  /**
   * Convert Ingested item to full system Article model
   */
  public static convertToArticle(ingested: IngestedItem): Partial<Article> {
    return {
      id: ingested.id,
      title: ingested.title,
      summaryShort: ingested.rawText.slice(0, 140) + '...',
      summaryMedium: ingested.rawText,
      category: ingested.classification.primaryCategory,
      region: ingested.location.region,
      country: ingested.location.country,
      publishedAt: ingested.publishedAt,
      confidenceScore: 92,
      isBreaking: ingested.title.toLowerCase().includes('breaking'),
      tags: [...ingested.entities.locations, ...ingested.entities.technologies, ingested.classification.primaryCategory]
    };
  }
}
