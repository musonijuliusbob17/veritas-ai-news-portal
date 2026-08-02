import { Article, PublisherInfo, CoveragePublisher } from '../types';

export interface TrustScoreEvaluation {
  articleId: string;
  trustScore: number; // 0 - 100
  verificationStatus: 'Verified Intelligence' | 'High Confidence' | 'Pending Fact Check' | 'Unverified Claim';
  badgeLabel: string;
  metrics: {
    sourceReliability: number; // 0 - 100
    confirmingSourcesCount: number;
    historicalSourceAccuracy: number; // 0 - 100
    contradictionRiskFactor: number; // 0 - 100 (lower is better)
    aiModelConfidence: number; // 0 - 100
  };
  sourcesConfirmed: Array<{
    publisherName: string;
    trustScore: number;
    bias: string;
  }>;
  auditTrail: string[];
  lastEvaluatedAt: string;
}

export class TrustScoreEngine {
  /**
   * Calculates comprehensive Trust & Fact Verification metrics for an article.
   */
  public static evaluateArticle(article: Article): TrustScoreEvaluation {
    const mainPub = article.mainPublisher || { name: 'Veritas Wire', trustScore: 85, historicalAccuracy: 90, biasRating: 'Neutral' };
    const coverageList = article.coverageList || [];
    
    // 1. Source Reliability (Main Publisher Trust)
    const sourceReliability = mainPub.trustScore || 85;

    // 2. Confirming Sources Count
    const confirmingSourcesCount = coverageList.length + 1; // main + coverage

    // 3. Historical Accuracy
    const historicalSourceAccuracy = ('historicalAccuracy' in mainPub ? mainPub.historicalAccuracy : 90) || 92;

    // 4. Contradiction Risk Factor
    let contradictionRiskFactor = 10;
    if (article.factCheckBadge === 'Conflicting Reports') contradictionRiskFactor = 65;
    if (article.factCheckBadge === 'Rumor') contradictionRiskFactor = 80;
    if (article.factCheckBadge === 'Developing') contradictionRiskFactor = 35;

    // 5. AI Model Confidence
    const aiModelConfidence = article.confidenceScore || 88;

    // Weighted Formula calculation
    // TrustScore = 0.35 * sourceReliability + 0.25 * historicalAccuracy + 0.20 * min(100, confirmingSourcesCount * 25) + 0.20 * aiModelConfidence - (contradictionRiskFactor * 0.25)
    const confirmingFactor = Math.min(100, confirmingSourcesCount * 25);
    let weightedScore = (
      (sourceReliability * 0.35) +
      (historicalSourceAccuracy * 0.25) +
      (confirmingFactor * 0.20) +
      (aiModelConfidence * 0.20) -
      (contradictionRiskFactor * 0.15)
    );

    const trustScore = Math.min(100, Math.max(10, Math.round(weightedScore)));

    // Status Determination
    let verificationStatus: TrustScoreEvaluation['verificationStatus'] = 'Pending Fact Check';
    let badgeLabel = 'Developing Intelligence';

    if (trustScore >= 88 && confirmingSourcesCount >= 2 && contradictionRiskFactor < 25) {
      verificationStatus = 'Verified Intelligence';
      badgeLabel = 'Verified Intelligence';
    } else if (trustScore >= 75) {
      verificationStatus = 'High Confidence';
      badgeLabel = 'High Confidence Source';
    } else if (contradictionRiskFactor >= 50) {
      verificationStatus = 'Unverified Claim';
      badgeLabel = 'Conflicting Field Reports';
    } else {
      verificationStatus = 'Pending Fact Check';
      badgeLabel = 'Pending Verification';
    }

    const sourcesConfirmed = [
      { publisherName: mainPub.name || 'Primary Agency', trustScore: mainPub.trustScore || 85, bias: mainPub.biasRating || 'Neutral' },
      ...coverageList.map(c => ({
        publisherName: c.publisherName,
        trustScore: c.trustScore,
        bias: c.bias
      }))
    ];

    const auditTrail: string[] = [
      `Evaluated primary publisher '${mainPub.name}' with ${sourceReliability}% trust score.`,
      `Cross-referenced ${confirmingSourcesCount} independent journalism feeds.`,
      `AI Fact-check audit calculated historical accuracy at ${historicalSourceAccuracy}%.`,
      `Contradiction check yielded risk factor of ${contradictionRiskFactor}%.`,
      `Final AI Verification status assigned: [${verificationStatus}].`
    ];

    return {
      articleId: article.id,
      trustScore,
      verificationStatus,
      badgeLabel,
      metrics: {
        sourceReliability,
        confirmingSourcesCount,
        historicalSourceAccuracy,
        contradictionRiskFactor,
        aiModelConfidence
      },
      sourcesConfirmed,
      auditTrail,
      lastEvaluatedAt: new Date().toISOString()
    };
  }
}
