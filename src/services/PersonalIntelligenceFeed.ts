import { Article } from '../types';
import { AudienceIntelligenceService, VisitorProfile } from './AudienceIntelligenceService';

export interface PersonalizedDigest {
  headline: string;
  personalizedReason: string;
  matchScore: number; // 0 - 100
  recommendedArticles: Article[];
  suggestedAction: string;
  generatedAt: string;
}

export class PersonalIntelligenceFeed {
  /**
   * Generates a tailored "What Matters To You Today" intelligence feed based on visitor vectors
   */
  public static generatePersonalFeed(articles: Article[]): PersonalizedDigest {
    const profile = AudienceIntelligenceService.getVisitorProfile();
    const topCategory = Object.entries(profile.categoryWeights).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Artificial Intelligence';

    // Filter relevant articles
    const matchedArticles = articles.filter(a => 
      a.category === topCategory || a.category === 'Technology' || a.region === 'Africa'
    ).slice(0, 4);

    return {
      headline: `What Matters To You Today (${topCategory} & Regional Brief)`,
      personalizedReason: `Curated based on your active reading history in ${topCategory} and regional African growth vectors.`,
      matchScore: 94,
      recommendedArticles: matchedArticles.length > 0 ? matchedArticles : articles.slice(0, 3),
      suggestedAction: `Explore targeted ${topCategory} updates or set up WhatsApp channel alerts for real-time notifications.`,
      generatedAt: new Date().toISOString()
    };
  }
}
