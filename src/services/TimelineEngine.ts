import { Article } from '../types';

export interface MilestoneItem {
  year: string;
  title: string;
  description: string;
  significance: 'HIGH' | 'CRITICAL' | 'NORMAL';
  connectedEntities: string[];
  relatedArticleId?: string;
  category?: string;
}

export interface ComprehensiveTopicTimeline {
  topicId: string;
  topicName: string;
  category: string;
  milestones: MilestoneItem[];
  totalArticlesCount: number;
  lastUpdated: string;
}

export class TimelineEngine {
  /**
   * Constructs an interconnected historical timeline for key global and regional intelligence topics
   */
  public static buildTopicTimeline(topicName: string, articles: Article[]): ComprehensiveTopicTimeline {
    const isAiTopic = topicName.toLowerCase().includes('ai') || topicName.toLowerCase().includes('tech') || topicName.toLowerCase().includes('intelligence');

    const defaultMilestones: MilestoneItem[] = isAiTopic ? [
      {
        year: '2018',
        title: 'Launch of First Sovereign Digital & AI Strategies',
        description: 'African nations initiate national digital transformation and smart governance roadmaps.',
        significance: 'NORMAL',
        connectedEntities: ['African Union', 'Rwanda Information Society Authority', 'Kigali Innovation City'],
        category: 'Policy & Foundations'
      },
      {
        year: '2022',
        title: 'Startup Capital & Incubator Acceleration Surge',
        description: 'Tech hubs in Kigali, Nairobi, and Lagos surpass $1.5B in venture funding and accelerator programs.',
        significance: 'HIGH',
        connectedEntities: ['Norrsken Kigali', 'Silicon Savannah', 'Smart Africa Alliance'],
        category: 'Incentives & Capital'
      },
      {
        year: '2025',
        title: 'Continental AI Policy Frameworks & Green Compute Accords',
        description: 'Harmonized data sovereignty regulations, ethical AI guidelines, and renewable power pools established.',
        significance: 'HIGH',
        connectedEntities: ['East African Community', 'World Bank', 'AI Regulatory Body'],
        category: 'Governance'
      },
      {
        year: '2026 (Current)',
        title: 'Pan-African Sovereign AI Accord & AfCFTA Digital Trade Realization',
        description: 'Real-time automated governance, localized LLMs, and cross-border instant settlement engines go live.',
        significance: 'CRITICAL',
        connectedEntities: ['Kigali AI Hub', 'AfCFTA Secretariat', 'Veritas Global Network'],
        relatedArticleId: articles[0]?.id,
        category: 'Global Execution'
      }
    ] : [
      {
        year: '2019',
        title: 'East African Energy Interconnection Initiative',
        description: 'Initial agreements signed for high-voltage cross-border power transmission lines.',
        significance: 'NORMAL',
        connectedEntities: ['East Africa Power Pool', 'REG Rwanda', 'Kenya Power'],
        category: 'Infrastructure'
      },
      {
        year: '2023',
        title: 'Green Hydro & Solar Microgrid Expansion',
        description: 'Deployment of over 100 decentralized solar and hydroelectric microgrids across rural corridors.',
        significance: 'HIGH',
        connectedEntities: ['Green Climate Fund', 'Rwandan Development Bank'],
        category: 'Clean Energy'
      },
      {
        year: '2026 (Current)',
        title: '$4.2B International Clean Energy Corridor Accord',
        description: 'Ratification of cross-border power sharing grid connecting EAC power pools to sovereign clean grids.',
        significance: 'CRITICAL',
        connectedEntities: ['EAC', 'World Bank', 'Veritas Intelligence'],
        relatedArticleId: articles[0]?.id,
        category: 'Regional Integration'
      }
    ];

    return {
      topicId: `tl_${topicName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      topicName,
      category: isAiTopic ? 'Technology & AI Sovereignty' : 'Energy & Economic Integration',
      milestones: defaultMilestones,
      totalArticlesCount: articles.length,
      lastUpdated: new Date().toISOString()
    };
  }

  public static getAllAvailableTimelines(articles: Article[]): ComprehensiveTopicTimeline[] {
    return [
      this.buildTopicTimeline('African Artificial Intelligence Development', articles),
      this.buildTopicTimeline('East African Clean Energy Integration', articles),
      this.buildTopicTimeline('AfCFTA Digital Trade & Customs Modernization', articles)
    ];
  }
}

