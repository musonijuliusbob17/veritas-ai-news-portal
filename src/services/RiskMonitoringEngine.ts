import { Article } from '../types';

export type RiskDomain = 'Political' | 'Economic' | 'Climate' | 'Technology' | 'Security';

export interface DomainRiskDetail {
  domain: RiskDomain;
  score: number; // 0 - 100 (lower is safer, higher is riskier)
  threatLevel: 'STABLE' | 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  topDrivers: string[];
  mitigationStrategy: string;
}

export interface RiskEvaluationResult {
  compositeScore: number;
  overallThreatLevel: 'STABLE' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  evaluatedAt: string;
  domainDetails: DomainRiskDetail[];
  recommendations: string[];
  historicalTrend: Array<{ month: string; score: number }>;
}

export class RiskMonitoringEngine {
  public static evaluateSystemRisk(articles: Article[]): RiskEvaluationResult {
    const domainDetails: DomainRiskDetail[] = [
      {
        domain: 'Political',
        score: 18,
        threatLevel: 'STABLE',
        topDrivers: ['EAC Sovereign Accord Alignment', 'Clear Regulatory Guidance in Rwanda'],
        mitigationStrategy: 'Maintain multi-lateral diplomatic channels & AfCFTA trade harmonization protocols.'
      },
      {
        domain: 'Economic',
        score: 24,
        threatLevel: 'LOW',
        topDrivers: ['FDI Surge into Deep Tech', 'Cross-Border Currency Fluctuations'],
        mitigationStrategy: 'Utilize Pan-African Payment and Settlement System (PAPSS) to hedge currency risks.'
      },
      {
        domain: 'Climate',
        score: 32,
        threatLevel: 'MODERATE',
        topDrivers: ['Seasonal Weather Pattern Shift', 'Hydro-power Capacity Fluctuations'],
        mitigationStrategy: 'Accelerate hybrid solar and geothermal microgrid grid integration.'
      },
      {
        domain: 'Technology',
        score: 15,
        threatLevel: 'STABLE',
        topDrivers: ['Rapid AI Adoption', 'Data Privacy Compliance'],
        mitigationStrategy: 'Deploy localized sovereign LLM validation and automated API security audits.'
      },
      {
        domain: 'Security',
        score: 22,
        threatLevel: 'LOW',
        topDrivers: ['Subsea Cable Redundancy Requirements', 'Cyber Resilience at IXP Nodes'],
        mitigationStrategy: 'Enforce zero-trust architecture and redundant terrestrial fiber rings.'
      }
    ];

    const compositeScore = Math.round(
      domainDetails.reduce((sum, d) => sum + d.score, 0) / domainDetails.length
    );

    let overallThreatLevel: 'STABLE' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL' = 'STABLE';
    if (compositeScore > 75) overallThreatLevel = 'CRITICAL';
    else if (compositeScore > 55) overallThreatLevel = 'HIGH';
    else if (compositeScore > 40) overallThreatLevel = 'ELEVATED';
    else if (compositeScore > 25) overallThreatLevel = 'GUARDED';

    return {
      compositeScore,
      overallThreatLevel,
      evaluatedAt: new Date().toISOString(),
      domainDetails,
      recommendations: [
        'Expand solar microgrid backup for core AI data centers in Kigali.',
        'Institutionalize real-time subsea cable acoustic telemetry monitoring.',
        'Conduct monthly multi-agent fact verification audits across public news dispatches.'
      ],
      historicalTrend: [
        { month: 'Feb 2026', score: 28 },
        { month: 'Mar 2026', score: 26 },
        { month: 'Apr 2026', score: 25 },
        { month: 'May 2026', score: 24 },
        { month: 'Jun 2026', score: 23 },
        { month: 'Jul 2026', score: 22 }
      ]
    };
  }
}
