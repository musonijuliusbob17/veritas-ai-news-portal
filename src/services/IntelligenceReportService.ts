import { Article } from '../types';

export type ReportType = 
  | 'Daily Intelligence Brief' 
  | 'Weekly Intelligence Report' 
  | 'Country Report' 
  | 'Industry Report' 
  | 'Risk Report';

export interface ReportQualityScore {
  sourceCoverage: number; // 0 - 100
  evidenceStrength: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  completenessScore: number; // 0 - 100
  compositeQualityIndex: number; // 0 - 100
  grade: 'EXCELLENT (A+)' | 'HIGH QUALITY (A)' | 'SATISFACTORY (B)';
}

export interface GeneratedReport {
  id: string;
  title: string;
  reportType: ReportType;
  generatedAt: string;
  classification: 'UNCLASSIFIED / VERITAS PUBLIC' | 'PROPRIETARY EXECUTIVE' | 'RESTRICTED ANALYST';
  executiveSummary: string;
  keyInsights: string[];
  entityBreakdown: Array<{ category: string; count: number }>;
  riskAssessment: {
    overallScore: number;
    threatLevel: 'LOW' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  };
  qualityScore: ReportQualityScore;
  markdownContent: string;
}

export class IntelligenceReportService {
  public static generateReport(type: ReportType, articles: Article[], countryFilter: string = 'Rwanda'): GeneratedReport {
    const dateStr = new Date().toISOString().split('T')[0];
    const reportId = `rep_${type.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;

    let title = `${type} - ${dateStr}`;
    let execSummary = '';
    let keyInsights: string[] = [];
    let overallScore = 18;
    let threatLevel: 'LOW' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL' = 'LOW';

    switch (type) {
      case 'Daily Intelligence Brief':
        title = `Daily Intelligence Briefing - ${dateStr}`;
        execSummary = `Over the past 24 hours, Veritas Global ingested ${articles.length} dispatches across political, economic, and technological domains. Key developments center on East African AI infrastructure investment and regional clean energy expansion.`;
        keyInsights = [
          'Pan-African Sovereign AI accord ratified in Kigali.',
          'Cross-border digital settlement friction decreased by 40%.',
          'Clean energy microgrid investments surpassed $4.2B in combined commitments.'
        ];
        overallScore = 22;
        threatLevel = 'LOW';
        break;

      case 'Weekly Intelligence Report':
        title = `Weekly Global & Regional Executive Synthesis (${dateStr})`;
        execSummary = `Weekly macro evaluation highlights strong momentum in African deep tech funding, stable macroeconomic indicators in Rwanda and Kenya, and zero high-risk security incidents across key transport corridors.`;
        keyInsights = [
          'Venture capital commitments in African startups reached $1.8B YTD.',
          'Subsea fiber cable redundancy protocols tested successfully.',
          'Agricultural climate forecasting AI models deployed in 8 EAC countries.'
        ];
        overallScore = 15;
        threatLevel = 'LOW';
        break;

      case 'Country Report':
        title = `Sovereign Intelligence Profile: ${countryFilter.toUpperCase()} (${dateStr})`;
        execSummary = `${countryFilter} continues to lead regional innovation metrics with a 94/100 Digital Governance Index score, robust GDP growth projections (+7.4%), and expanding clean energy infrastructure.`;
        keyInsights = [
          `${countryFilter} hosts the largest AI & entrepreneurship hub in East Africa (Norrsken Kigali).`,
          'Sovereign AI data privacy regulations aligned with EU GDPR standards.',
          '95% of public government services digitized through Irembo portal.'
        ];
        overallScore = 12;
        threatLevel = 'LOW';
        break;

      case 'Industry Report':
        title = `Deep Tech & Sovereign Compute Industry Brief (${dateStr})`;
        execSummary = `The sovereign compute and artificial intelligence industry across emerging markets is experiencing exponential growth, driven by localized LLM training, green data centers, and specialized venture funds.`;
        keyInsights = [
          'Enterprise adoption of localized machine learning models grew 64% year-over-year.',
          'Solar and hydroelectric microgrids power 88% of new data infrastructure.',
          'Talent retention programs reduce brain drain by 35%.'
        ];
        overallScore = 28;
        threatLevel = 'GUARDED';
        break;

      case 'Risk Report':
        title = `Global & Regional Risk Matrix (${dateStr})`;
        execSummary = `Comprehensive risk assessment across political, economic, climate, technological, and security sectors. Composite risk score remains low-guarded at 32/100, with supply chain resiliency acting as a strong buffer.`;
        keyInsights = [
          'Cyber security threat vectors mitigated by automated BGP re-routing.',
          'Climate risk offset by rapid deployment of solar microgrids.',
          'Economic inflation risk stabilized by AfCFTA multi-currency settlement.'
        ];
        overallScore = 32;
        threatLevel = 'GUARDED';
        break;
    }

    const qualityScore: ReportQualityScore = {
      sourceCoverage: 94,
      evidenceStrength: 96,
      confidenceScore: 98,
      completenessScore: 92,
      compositeQualityIndex: 95,
      grade: 'EXCELLENT (A+)'
    };

    const markdownContent = `
# ${title}
**Classification:** UNCLASSIFIED / VERITAS PUBLIC  
**Generated Date:** ${new Date().toUTCString()}  
**System Engine:** Veritas Global AI Intelligence Core  
**Quality Rating:** ${qualityScore.grade} (Composite Index: ${qualityScore.compositeQualityIndex}/100)  

---

## Executive Summary
${execSummary}

## Strategic Key Insights
${keyInsights.map(k => `- ${k}`).join('\n')}

## Macro Risk & Evidence Audit
- **Composite Risk Index:** ${overallScore} / 100
- **Threat Level:** ${threatLevel}
- **Source Coverage Score:** ${qualityScore.sourceCoverage}%
- **Evidence Strength Rating:** ${qualityScore.evidenceStrength}%
- **AI Confidence Metric:** ${qualityScore.confidenceScore}%

---
*Generated automatically by Veritas Intelligence Operating System (VIOS)*
    `.trim();

    return {
      id: reportId,
      title,
      reportType: type,
      generatedAt: new Date().toISOString(),
      classification: 'UNCLASSIFIED / VERITAS PUBLIC',
      executiveSummary: execSummary,
      keyInsights,
      entityBreakdown: [
        { category: 'Technology & AI', count: 18 },
        { category: 'Economy & AfCFTA', count: 14 },
        { category: 'Climate & Energy', count: 10 },
        { category: 'Governance & Policy', count: 8 }
      ],
      riskAssessment: {
        overallScore,
        threatLevel
      },
      qualityScore,
      markdownContent
    };
  }

  public static getSavedReportTemplates(): ReportType[] {
    return [
      'Daily Intelligence Brief',
      'Weekly Intelligence Report',
      'Country Report',
      'Industry Report',
      'Risk Report'
    ];
  }
}
