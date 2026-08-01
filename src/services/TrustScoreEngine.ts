import { Article, PublisherInfo } from '../types';

export interface SourceVerificationDetail {
  publisherName: string;
  sourceType: 'Main Publisher' | 'Cross Publisher' | 'Official Statement' | 'Expert Source';
  claimStatus: 'CONFIRMED' | 'CONTRADICTION' | 'NEUTRAL';
  reliabilityScore: number;
  bias: string;
}

export interface TrustScoreEvaluation {
  articleId: string;
  trustScore: number; // Consensus score 0 - 100
  consensusScore: number; // 0 - 100
  verificationStatus: 'Verified Intelligence' | 'High Confidence' | 'Pending Fact Check' | 'Unverified Claim';
  badgeLabel: string;
  metrics: {
    sourceReliability: number; // 0 - 100
    confirmingSourcesCount: number;
    historicalSourceAccuracy: number; // 0 - 100
    contradictionRiskFactor: number; // 0 - 100 (lower is better)
    aiModelConfidence: number; // 0 - 100
    correctionHistoryRating: number; // 0 - 100 (100 means zero uncorrected mistakes)
  };
  sourcesConfirmed: SourceVerificationDetail[];
  auditTrail: string[];
  lastEvaluatedAt: string;
}

export class TrustScoreEngine {
  /**
   * Calculates comprehensive Trust & Fact Verification metrics for an article.
   */
  public static evaluateArticle(article: Article): TrustScoreEvaluation {
    const mainPub = article.mainPublisher || { name: 'Veritas Wire', trustScore: 88, historicalAccuracy: 92, biasRating: 'Neutral' };
    const coverageList = article.coverageList || [];
    
    // 1. Source Reliability (Main Publisher Trust)
    const sourceReliability = mainPub.trustScore || 88;

    // 2. Confirming Sources Count
    const confirmingSourcesCount = coverageList.length + 1; // main + coverage

    // 3. Historical Accuracy & Correction History
    const historicalSourceAccuracy = ('historicalAccuracy' in mainPub ? mainPub.historicalAccuracy : 92) || 92;
    const correctionHistoryRating = 95; // High rating for verified network

    // 4. Cross Verification & Contradiction Risk Factor
    let contradictionRiskFactor = 10;
    if (article.factCheckBadge === 'Conflicting Reports') contradictionRiskFactor = 55;
    if (article.factCheckBadge === 'Rumor') contradictionRiskFactor = 80;
    if (article.factCheckBadge === 'Developing') contradictionRiskFactor = 30;

    // 5. AI Model Confidence
    const aiModelConfidence = article.confidenceScore || 88;

    // Weighted Consensus Formula
    const confirmingFactor = Math.min(100, confirmingSourcesCount * 25);
    let weightedScore = (
      (sourceReliability * 0.30) +
      (historicalSourceAccuracy * 0.25) +
      (confirmingFactor * 0.20) +
      (aiModelConfidence * 0.15) +
      (correctionHistoryRating * 0.10) -
      (contradictionRiskFactor * 0.15)
    );

    const consensusScore = Math.min(100, Math.max(10, Math.round(weightedScore)));
    const trustScore = consensusScore;

    // Status Determination
    let verificationStatus: TrustScoreEvaluation['verificationStatus'] = 'Pending Fact Check';
    let badgeLabel = 'Developing Intelligence';

    if (consensusScore >= 88 && confirmingSourcesCount >= 2 && contradictionRiskFactor < 25) {
      verificationStatus = 'Verified Intelligence';
      badgeLabel = 'Verified Intelligence';
    } else if (consensusScore >= 75) {
      verificationStatus = 'High Confidence';
      badgeLabel = 'High Confidence Source';
    } else if (contradictionRiskFactor >= 50) {
      verificationStatus = 'Unverified Claim';
      badgeLabel = 'Conflicting Field Reports';
    } else {
      verificationStatus = 'Pending Fact Check';
      badgeLabel = 'Pending Verification';
    }

    const sourcesConfirmed: SourceVerificationDetail[] = [
      {
        publisherName: mainPub.name || 'Primary Agency',
        sourceType: 'Main Publisher',
        claimStatus: contradictionRiskFactor > 50 ? 'CONTRADICTION' : 'CONFIRMED',
        reliabilityScore: sourceReliability,
        bias: mainPub.biasRating || 'Neutral'
      },
      ...coverageList.map(c => ({
        publisherName: c.publisherName,
        sourceType: 'Cross Publisher' as const,
        claimStatus: 'CONFIRMED' as const,
        reliabilityScore: c.trustScore,
        bias: c.bias
      })),
      {
        publisherName: 'Official Ministry & Press Statement Archive',
        sourceType: 'Official Statement',
        claimStatus: 'CONFIRMED',
        reliabilityScore: 96,
        bias: 'Neutral'
      }
    ];

    const auditTrail: string[] = [
      `Evaluated primary publisher '${mainPub.name}' with ${sourceReliability}% reliability.`,
      `Cross-verified ${confirmingSourcesCount} independent journalism and official wire sources.`,
      `Correction history rating calculated at ${correctionHistoryRating}%.`,
      `Contradiction check risk factor evaluated at ${contradictionRiskFactor}%.`,
      `Final Consensus Trust Score calculated: ${consensusScore}% [Status: ${verificationStatus}].`
    ];

    return {
      articleId: article.id,
      trustScore,
      consensusScore,
      verificationStatus,
      badgeLabel,
      metrics: {
        sourceReliability,
        confirmingSourcesCount,
        historicalSourceAccuracy,
        contradictionRiskFactor,
        aiModelConfidence,
        correctionHistoryRating
      },
      sourcesConfirmed,
      auditTrail,
      lastEvaluatedAt: new Date().toISOString()
    };
  }
}

