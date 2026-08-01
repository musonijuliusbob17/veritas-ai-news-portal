import { Article } from '../types';

export type BreakingClassification = 'UNVERIFIED' | 'DEVELOPING' | 'CONFIRMED' | 'BREAKING';

export interface BreakingRecommendation {
  homepageBanner: boolean;
  whatsAppPush: boolean;
  mobileAlert: boolean;
  editorialAction: string;
}

export interface BreakingAlert {
  alertId: string;
  articleId: string;
  headline: string;
  classification: BreakingClassification;
  importanceScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  velocityScore: number; // 0 - 100
  confirmingPublisherCount: number;
  socialSignalSpikePercentage: number;
  searchActivityVolume: number;
  recommendation: BreakingRecommendation;
  detectedAt: string;
}

export class BreakingNewsEngine {
  /**
   * Evaluates incoming articles and signals for Breaking News qualification.
   */
  public static evaluateBreakingAlert(article: Article): BreakingAlert {
    const isBreakingFlag = article.isBreaking || false;
    const isRwandaOrAfrica = article.region === 'Africa' || article.country === 'Rwanda';
    const coverageCount = (article.coverageList?.length || 0) + 1;
    const baseConfidence = article.confidenceScore || 85;

    let classification: BreakingClassification = 'DEVELOPING';

    if (isBreakingFlag && coverageCount >= 3 && baseConfidence >= 90) {
      classification = 'BREAKING';
    } else if (coverageCount >= 2 && baseConfidence >= 85) {
      classification = 'CONFIRMED';
    } else if (coverageCount < 2 && baseConfidence < 75) {
      classification = 'UNVERIFIED';
    } else {
      classification = 'DEVELOPING';
    }

    const importanceScore = Math.min(100, (baseConfidence * 0.5) + (coverageCount * 12) + (isRwandaOrAfrica ? 15 : 5));
    const velocityScore = classification === 'BREAKING' ? 98 : classification === 'CONFIRMED' ? 82 : 60;
    const socialSignalSpikePercentage = isRwandaOrAfrica ? 340 : 160;
    const searchActivityVolume = Math.round(importanceScore * 140);

    const recommendation: BreakingRecommendation = {
      homepageBanner: classification === 'BREAKING' || classification === 'CONFIRMED',
      whatsAppPush: classification === 'BREAKING' || (classification === 'CONFIRMED' && importanceScore >= 88),
      mobileAlert: classification === 'BREAKING',
      editorialAction: classification === 'BREAKING'
        ? 'Deploy real-time live blog, send instant WhatsApp broadcast, pin to primary homepage ticker.'
        : classification === 'CONFIRMED'
        ? 'Feature in Top Stories section and auto-generate multilingual translations.'
        : 'Monitor incoming wire feeds for secondary independent verification.'
    };

    return {
      alertId: `brk_${article.id}`,
      articleId: article.id,
      headline: article.title,
      classification,
      importanceScore: Math.round(importanceScore),
      confidenceScore: baseConfidence,
      velocityScore,
      confirmingPublisherCount: coverageCount,
      socialSignalSpikePercentage,
      searchActivityVolume,
      recommendation,
      detectedAt: new Date().toISOString()
    };
  }

  public static getActiveBreakingAlerts(articles: Article[]): BreakingAlert[] {
    return articles
      .filter(a => a.isBreaking || (a.confidenceScore || 80) > 88)
      .map(a => this.evaluateBreakingAlert(a));
  }
}

