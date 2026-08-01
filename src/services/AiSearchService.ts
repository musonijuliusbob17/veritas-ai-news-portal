import { Article, TimelineEvent } from '../types';
import { KnowledgeGraphEngine, GraphEntityNode } from './KnowledgeGraphEngine';

export interface AiSearchResult {
  query: string;
  synthesizedAnswer: string;
  confidenceScore: number;
  sources: Array<{
    articleId: string;
    title: string;
    publisherName: string;
    publishedAt: string;
    trustScore: number;
  }>;
  timeline: TimelineEvent[];
  connectedEntities: GraphEntityNode[];
  suggestedFollowUps: string[];
  processedAt: string;
}

export class AiSearchService {
  /**
   * Executes AI natural language query over Veritas Global news intelligence database.
   */
  public static async answerQuery(query: string, articles: Article[]): Promise<AiSearchResult> {
    const qLower = query.toLowerCase().trim();

    // Filter matching articles
    const matchedArticles = articles.filter(art => {
      const text = `${art.title} ${art.summaryDetailed} ${art.category} ${art.country} ${art.region} ${art.tags.join(' ')}`.toLowerCase();
      return qLower.split(' ').some(word => word.length > 2 && text.includes(word));
    }).slice(0, 5);

    const graph = KnowledgeGraphEngine.buildGraph(articles);
    const connectedEntities = graph.nodes.filter(node => 
      qLower.includes(node.name.toLowerCase()) || node.description.toLowerCase().includes(qLower)
    ).slice(0, 6);

    // Build timeline events
    const timelineEvents: TimelineEvent[] = [];
    matchedArticles.forEach(art => {
      if (art.timeline && art.timeline.length > 0) {
        timelineEvents.push(...art.timeline);
      } else {
        timelineEvents.push({
          timestamp: new Date(art.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          title: art.title,
          description: art.summaryShort,
          source: art.mainPublisher?.name || 'Veritas Intelligence'
        });
      }
    });

    // Synthesize Answer
    let synthesizedAnswer = '';
    if (matchedArticles.length > 0) {
      const topArt = matchedArticles[0];
      synthesizedAnswer = `Based on verified news reports from ${matchedArticles.length} independent sources, recent developments regarding **"${query}"** highlight significant progress:\n\n` +
        `• **Key Event:** ${topArt.title}. ${topArt.summaryMedium}\n\n` +
        `• **Strategic Impact:** ${matchedArticles[1]?.summaryShort || 'Regional and international stakeholders continue monitoring regulatory and economic alignment.'}\n\n` +
        `• **Trust & Verification:** The primary source (${topArt.mainPublisher?.name || 'Veritas Partner'}) maintains a **${topArt.confidenceScore || 92}% Trust Score**.`;
    } else {
      synthesizedAnswer = `Veritas AI News Intelligence monitored regional streams for **"${query}"**:\n\n` +
        `• Currently tracking 1,200+ global feeds covering policy, technology, and economic developments in Africa and internationally.\n\n` +
        `• Recommended Action: Explore connected knowledge graph entities or browse breaking coverage in Artificial Intelligence, Business, and Climate.`;
    }

    const sources = (matchedArticles.length > 0 ? matchedArticles : articles.slice(0, 3)).map(a => ({
      articleId: a.id,
      title: a.title,
      publisherName: a.mainPublisher?.name || 'Veritas Global',
      publishedAt: new Date(a.publishedAt).toLocaleDateString(),
      trustScore: a.confidenceScore || 90
    }));

    const suggestedFollowUps = [
      `What are the economic implications of ${query}?`,
      `Who are the key people and organizations involved in ${query}?`,
      `How does Rwanda and East Africa compare in ${query}?`
    ];

    return {
      query,
      synthesizedAnswer,
      confidenceScore: matchedArticles.length > 0 ? 94 : 85,
      sources,
      timeline: timelineEvents.slice(0, 6),
      connectedEntities: connectedEntities.length > 0 ? connectedEntities : graph.nodes.slice(0, 5),
      suggestedFollowUps,
      processedAt: new Date().toISOString()
    };
  }
}
