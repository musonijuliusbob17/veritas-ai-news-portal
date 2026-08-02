import { Article } from '../types';

export type EntityType = 
  | 'Person'
  | 'Organization'
  | 'Country'
  | 'Company'
  | 'Technology'
  | 'Event'
  | 'Topic';

export interface GraphEntityNode {
  id: string;
  name: string;
  type: EntityType;
  importance: number; // 0 - 100
  articleCount: number;
  description: string;
  region?: string;
}

export interface GraphEdge {
  sourceId: string;
  targetId: string;
  relation: string; // e.g. "headquartered_in", "regulates", "invested_in", "pioneers", "partnered_with"
  strength: number; // 0 - 100
}

export interface KnowledgeGraphData {
  nodes: GraphEntityNode[];
  edges: GraphEdge[];
}

export class KnowledgeGraphEngine {
  /**
   * Constructs an interconnected Knowledge Graph from system articles.
   */
  public static buildGraph(articles: Article[]): KnowledgeGraphData {
    const nodesMap = new Map<string, GraphEntityNode>();
    const edges: GraphEdge[] = [];

    // Baseline Seed Core Nodes
    const seedNodes: GraphEntityNode[] = [
      { id: 'e_rwanda', name: 'Rwanda', type: 'Country', importance: 95, articleCount: 18, description: 'East African nation leading regional tech and governance innovations.', region: 'Africa' },
      { id: 'e_kenya', name: 'Kenya', type: 'Country', importance: 90, articleCount: 15, description: 'Silicon Savannah hub and renewable energy pioneer.', region: 'Africa' },
      { id: 'e_au', name: 'African Union', type: 'Organization', importance: 92, articleCount: 12, description: 'Continental union of 55 member states promoting integration and growth.', region: 'Africa' },
      { id: 'e_ai_tech', name: 'Artificial Intelligence', type: 'Technology', importance: 98, articleCount: 24, description: 'Machine learning, LLMs, and automated governance systems.' },
      { id: 'e_kigali_hub', name: 'Norrsken Kigali AI Center', type: 'Company', importance: 88, articleCount: 9, description: 'Largest entrepreneurship and AI startup hub in Africa.', region: 'Africa' },
      { id: 'e_paul_kagame', name: 'Paul Kagame', type: 'Person', importance: 88, articleCount: 10, description: 'President of Rwanda, advocate for digital transformation and African unity.', region: 'Africa' },
      { id: 'e_renewable_energy', name: 'Renewable Energy Grid', type: 'Technology', importance: 91, articleCount: 14, description: 'Solar, geothermal, and hydroelectric clean power networks.' },
      { id: 'e_afcfta', name: 'AfCFTA', type: 'Organization', importance: 93, articleCount: 11, description: 'African Continental Free Trade Area unlocking 1.3B consumer market.' },
      { id: 'e_world_bank', name: 'World Bank Group', type: 'Organization', importance: 85, articleCount: 8, description: 'Global financial institution providing development capital.' },
      { id: 'e_fintech', name: 'Mobile Money & FinTech', type: 'Technology', importance: 89, articleCount: 16, description: 'Cross-border digital payments and financial inclusion platforms.' }
    ];

    seedNodes.forEach(n => nodesMap.set(n.id, n));

    // Baseline Edges
    edges.push(
      { sourceId: 'e_paul_kagame', targetId: 'e_rwanda', relation: 'leads_nation', strength: 95 },
      { sourceId: 'e_rwanda', targetId: 'e_kigali_hub', relation: 'hosts_center', strength: 90 },
      { sourceId: 'e_kigali_hub', targetId: 'e_ai_tech', relation: 'pioneers_tech', strength: 92 },
      { sourceId: 'e_rwanda', targetId: 'e_au', relation: 'member_state', strength: 85 },
      { sourceId: 'e_au', targetId: 'e_afcfta', relation: 'governs_agreement', strength: 95 },
      { sourceId: 'e_kenya', targetId: 'e_renewable_energy', relation: 'invests_in', strength: 88 },
      { sourceId: 'e_rwanda', targetId: 'e_fintech', relation: 'regulates_digital_pay', strength: 87 },
      { sourceId: 'e_world_bank', targetId: 'e_renewable_energy', relation: 'funds_project', strength: 82 },
      { sourceId: 'e_afcfta', targetId: 'e_fintech', relation: 'integrates_payments', strength: 90 }
    );

    // Dynamically augment graph with article entities
    articles.forEach(art => {
      const artNodeId = `art_${art.id}`;
      nodesMap.set(artNodeId, {
        id: artNodeId,
        name: art.title.slice(0, 35) + '...',
        type: 'Topic',
        importance: art.confidenceScore || 75,
        articleCount: 1,
        description: art.summaryShort,
        region: art.region
      });

      if (art.country === 'Rwanda') {
        edges.push({ sourceId: artNodeId, targetId: 'e_rwanda', relation: 'reports_on', strength: 90 });
      } else if (art.country === 'Kenya') {
        edges.push({ sourceId: artNodeId, targetId: 'e_kenya', relation: 'reports_on', strength: 90 });
      }

      if (art.category === 'Artificial Intelligence' || art.category === 'Technology') {
        edges.push({ sourceId: artNodeId, targetId: 'e_ai_tech', relation: 'analyzes_tech', strength: 88 });
      }
      if (art.category === 'Climate') {
        edges.push({ sourceId: artNodeId, targetId: 'e_renewable_energy', relation: 'covers_climate', strength: 85 });
      }
    });

    return {
      nodes: Array.from(nodesMap.values()),
      edges
    };
  }
}
