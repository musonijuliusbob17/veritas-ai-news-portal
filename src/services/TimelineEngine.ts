import { Article, TimelineEvent } from '../types';

export interface ComprehensiveTopicTimeline {
  topicId: string;
  topicName: string;
  category: string;
  milestones: Array<{
    year: string;
    title: string;
    description: string;
    significance: 'HIGH' | 'CRITICAL' | 'NORMAL';
    connectedEntities: string[];
    relatedArticleId?: string;
  }>;
  totalArticlesCount: number;
  lastUpdated: string;
}

export class TimelineEngine {
  /**
   * Constructs an interconnected historical timeline for key global and regional intelligence topics
   */
  public static buildTopicTimeline(topicName: string, articles: Article[]): ComprehensiveTopicTimeline {
    const defaultMilestones = [
      {
        year: '2018',
        title: 'Launch of First Sovereign Digital & AI Strategies',
        description: 'African nations initiate national digital transformation and smart governance roadmaps.',
        significance: 'NORMAL' as const,
        connectedEntities: ['African Union', 'Rwanda Information Society Authority']
      },
      {
        year: '2022',
        title: 'Startup Capital & Incubator Acceleration Surge',
        description: 'Tech hubs in Kigali, Nairobi, and Lagos surpass $1.5B in venture funding.',
        significance: 'HIGH' as const,
        connectedEntities: ['Norrsken Kigali', 'Silicon Savannah']
      },
      {
        year: '2025',
        title: 'Continental AI Policy Frameworks & Green Energy Grid Accords',
        description: 'Harmonized data sovereignty and renewable energy power pools established.',
        significance: 'HIGH' as const,
        connectedEntities: ['East African Community', 'World Bank']
      },
      {
        year: '2026 (Current)',
        title: 'Pan-African Sovereign AI Hubs & AfCFTA Digital Trade Realization',
        description: 'Real-time automated governance and cross-border instant payments go live.',
        significance: 'CRITICAL' as const,
        connectedEntities: ['Kigali AI Center', 'AfCFTA Secretariat', 'Veritas Global Network'],
        relatedArticleId: articles[0]?.id
      }
    ];

    return {
      topicId: `tl_${topicName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      topicName,
      category: 'Technology & Governance',
      milestones: defaultMilestones,
      totalArticlesCount: articles.length,
      lastUpdated: new Date().toISOString()
    };
  }
}
