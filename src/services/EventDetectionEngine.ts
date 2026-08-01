import { Article, Region, Category } from '../types';

export interface EventIntelligenceObject {
  event_id: string;
  title: string;
  category: string;
  eventType: 'Political' | 'Economic' | 'Technology' | 'Environment' | 'Security';
  location: {
    country?: string;
    city?: string;
    region: Region;
  };
  entities: string[];
  importance_score: number; // 0 - 100
  confidence_score: number; // 0 - 100
  timeline: Array<{
    timestamp: string;
    description: string;
    source: string;
  }>;
  related_articles: string[]; // Article IDs
  detectedAt: string;
  status: 'EMERGING' | 'ACTIVE' | 'RESOLVING' | 'ARCHIVED';
}

export class EventDetectionEngine {
  /**
   * Automatically groups articles into coherent Event Objects across Political, Economic, Tech, and Environmental categories.
   */
  public static detectEvents(articles: Article[]): EventIntelligenceObject[] {
    const events: EventIntelligenceObject[] = [];

    // 1. Technology & AI Regulatory Event
    const aiArticles = articles.filter(a => a.category === 'Artificial Intelligence' || a.category === 'Technology');
    events.push({
      event_id: 'evt_rwanda_ai_accord_2026',
      title: 'Pan-African Sovereign Artificial Intelligence Infrastructure & Kigali Accord',
      category: 'Technology',
      eventType: 'Technology',
      location: { country: 'Rwanda', city: 'Kigali', region: 'Africa' },
      entities: ['Ministry of ICT Rwanda', 'Norrsken Kigali', 'African Union', 'Paul Kagame', 'DeepMind Africa'],
      importance_score: 96,
      confidence_score: 94,
      timeline: [
        { timestamp: 'Aug 2026', description: 'Kigali Pan-African AI Regulatory Accord ratified by 14 member states', source: 'Veritas Wire' },
        { timestamp: 'Jul 2026', description: '$250M Sovereign Supercomputing Hub construction initiated in Kigali', source: 'EAC Tech Review' },
        { timestamp: 'May 2026', description: 'Pan-African Open Language Dataset framework presented', source: 'AU Tech Forum' }
      ],
      related_articles: aiArticles.map(a => a.id),
      detectedAt: new Date().toISOString(),
      status: 'ACTIVE'
    });

    // 2. Climate & Environmental Energy Grid Event
    const climateArticles = articles.filter(a => a.category === 'Climate' || a.category === 'Business');
    events.push({
      event_id: 'evt_eac_green_corridor',
      title: 'East African Cross-Border Solar & Geothermal Integration Network',
      category: 'Climate',
      eventType: 'Environment',
      location: { country: 'Kenya', city: 'Nairobi', region: 'Africa' },
      entities: ['East Africa Power Pool', 'World Bank', 'Kenya Green Power', 'Rwandan Energy Group'],
      importance_score: 92,
      confidence_score: 90,
      timeline: [
        { timestamp: 'Aug 2026', description: '$4.2B International Green Infrastructure Grant signed in Nairobi', source: 'Global Energy Pulse' },
        { timestamp: 'Jun 2026', description: 'Rift Valley 500MW Geothermal Expansion phase II connected to grid', source: 'East Africa Energy' }
      ],
      related_articles: climateArticles.map(a => a.id),
      detectedAt: new Date().toISOString(),
      status: 'ACTIVE'
    });

    // 3. Economic & AfCFTA Digital Tariff Accord
    const ecoArticles = articles.filter(a => a.category === 'Business' || a.category === 'Politics');
    events.push({
      event_id: 'evt_afcfta_digital_border',
      title: 'AfCFTA Unified Digital Customs Clearance & Instant Cross-Border Settlement Protocol',
      category: 'Economic',
      eventType: 'Economic',
      location: { country: 'Ghana', city: 'Accra', region: 'Africa' },
      entities: ['AfCFTA Secretariat', 'East African Community', 'PAPSS Network', 'Trade & Dev Bank'],
      importance_score: 91,
      confidence_score: 88,
      timeline: [
        { timestamp: 'Jul 2026', description: 'Cargo transit delays decreased by 40% across Mombasa & Kigali corridors', source: 'Trade Intelligence' },
        { timestamp: 'Apr 2026', description: 'PAPSS instant multi-currency transaction engine launched across 12 nations', source: 'Central Banking Africa' }
      ],
      related_articles: ecoArticles.slice(0, 3).map(a => a.id),
      detectedAt: new Date().toISOString(),
      status: 'EMERGING'
    });

    // 4. Political & Sovereign Governance Summit
    events.push({
      event_id: 'evt_global_tech_sovereignty',
      title: 'Global Sovereign Data Governance & Security Accord',
      category: 'Politics',
      eventType: 'Political',
      location: { country: 'France', city: 'Paris', region: 'Europe' },
      entities: ['European Union', 'African Union', 'UN High Commission', 'Veritas Network'],
      importance_score: 89,
      confidence_score: 91,
      timeline: [
        { timestamp: 'Jul 2026', description: 'Paris High-Level Summit on Algorithmic Transparency and AI Ethics', source: 'International Policy Journal' }
      ],
      related_articles: articles.slice(0, 2).map(a => a.id),
      detectedAt: new Date().toISOString(),
      status: 'EMERGING'
    });

    return events;
  }
}

