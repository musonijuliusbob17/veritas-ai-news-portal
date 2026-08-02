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
}

export class GlobalDataIngestionEngine {
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
      region = 'Americas';
      country = 'United States';
      city = 'Washington';
    }

    // Classification
    let primaryCategory: Category = 'General';
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
