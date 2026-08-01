import { Article } from '../types';
import { INITIAL_ARTICLES } from '../data/mockNewsData';

export interface AutonomousArticleDraft {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  sourceOrigin: string;
  verificationScore: number;
  biasScore: number;
  status: 'DRAFTING' | 'FACT_CHECKING' | 'MULTIMEDIA_PROCESSING' | 'READY_FOR_PUBLISH' | 'PUBLISHED';
  createdAt: string;
  assignedAgents: string[];
  formats: {
    executiveBrief: string;
    whatsAppCard: string;
    audioScript: string;
    socialPosts: string[];
  };
}

export interface NewsroomMetrics {
  totalAutoPublished: number;
  averageVerificationScore: number;
  avgSpeedToPublishSeconds: number;
  activeAgents: number;
  syndicatedChannels: number;
}

export class AutonomousNewsroomEngine {
  private static drafts: AutonomousArticleDraft[] = [
    {
      id: 'draft-auto-101',
      title: 'Autonomous AI Agents Intersecting Global Supply Chains: Q3 Analysis',
      summary: 'AI-driven logistical coordination reduces shipping delays by 18% across major Euro-Asian trade corridors.',
      content: 'In a significant shift for global supply chain dynamics, autonomous AI coordination nodes have successfully optimized container routing across major ports in Rotterdam and Singapore. Early telemetry indicates an 18% reduction in congestion bottlenecks during peak transit windows.',
      category: 'Technology',
      sourceOrigin: 'Veritas Autonomous Feeds & Port Telemetry',
      verificationScore: 96,
      biasScore: 2,
      status: 'PUBLISHED',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      assignedAgents: ['Drafting Agent Alpha', 'Veritas FactCheck AI', 'Audio Producer Bot'],
      formats: {
        executiveBrief: 'SUMMARY: AI logistics nodes optimize Euro-Asian shipping corridors by 18%. Impact: High on global transport efficiency.',
        whatsAppCard: '🚢 *VERITAS BREAKING*: AI Autonomous Nodes Reduce Shipping Delays by 18% across Rotterdam-Singapore corridors. Read full telemetry.',
        audioScript: 'This is the Veritas Autonomous Newsroom. Headline: AI-driven logistical coordination is transforming Euro-Asian shipping efficiency...',
        socialPosts: [
          'BREAKING: Autonomous AI supply chain nodes reduce port congestion by 18%. #VeritasAI #TechLogistics',
          'Deep dive into real-time Euro-Asian shipping telemetry optimized by artificial intelligence. #SupplyChain'
        ]
      }
    },
    {
      id: 'draft-auto-102',
      title: 'Global Renewable Energy Grid Resilience Reaches Historic Landmark',
      summary: 'Cross-border smart grids prevent blackout risks in Central European power sectors during extreme heatwaves.',
      content: 'Cross-border interconnections using predictive grid management systems maintained 99.99% uptime across Central European energy networks despite unprecedented thermal demand spikes.',
      category: 'Energy & Climate',
      sourceOrigin: 'European Grid Telemetry & Veritas Sensors',
      verificationScore: 98,
      biasScore: 1,
      status: 'READY_FOR_PUBLISH',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      assignedAgents: ['Climate Intelligence Bot', 'Veritas Verification Matrix'],
      formats: {
        executiveBrief: 'EU energy grids achieve 99.99% uptime during peak heatwave demand due to predictive grid AI balancing.',
        whatsAppCard: '⚡ *VERITAS ENERGY*: Smart grid AI prevents heatwave blackout risk with 99.99% uptime recorded across Central Europe.',
        audioScript: 'Good day. Veritas Energy Radar reports record stability across Central European power grids...',
        socialPosts: [
          'Predictive grid management protects European power networks amid severe heatwaves. Full briefing inside. #CleanEnergy'
        ]
      }
    }
  ];

  public static getDrafts(): AutonomousArticleDraft[] {
    return this.drafts;
  }

  public static generateAutonomousDraft(topic: string, category: string): AutonomousArticleDraft {
    const newId = `draft-auto-${Date.now()}`;
    const verificationScore = Math.floor(Math.random() * 8) + 92; // 92-99%
    const biasScore = Math.floor(Math.random() * 4) + 1; // 1-4%
    
    const draft: AutonomousArticleDraft = {
      id: newId,
      title: `Autonomous Intelligence: ${topic}`,
      summary: `Automated real-time investigation report covering key developments and factual verification on ${topic.toLowerCase()}.`,
      content: `Veritas Autonomous AI Newsroom has compiled real-time telemetry and verified cross-wire reports regarding ${topic}. Preliminary analysis confirms multi-source alignment with zero critical discrepancies detected. Impact assessment ongoing across policy, market, and social vectors.`,
      category: category || 'General',
      sourceOrigin: 'Veritas Autonomous Crawler & Satellite Feeds',
      verificationScore,
      biasScore,
      status: 'FACT_CHECKING',
      createdAt: new Date().toISOString(),
      assignedAgents: ['Newsroom Crawler Bot', 'Veritas FactCheck AI', 'Multi-Format Adapter'],
      formats: {
        executiveBrief: `EXECUTIVE BRIEF: ${topic}. Verification score: ${verificationScore}%. Neutrality index: HIGH.`,
        whatsAppCard: `📰 *VERITAS AUTO-REPORT*: ${topic}. Verified with ${verificationScore}% confidence score.`,
        audioScript: `Welcome to Veritas Audio Briefing. Our autonomous newsroom has synthesized latest telemetry on ${topic}...`,
        socialPosts: [
          `Veritas AI Newsroom auto-synthesized analysis on ${topic}. Read live updates: #VeritasAI`
        ]
      }
    };

    this.drafts.unshift(draft);
    return draft;
  }

  public static approveAndPublish(id: string): AutonomousArticleDraft | null {
    const draft = this.drafts.find(d => d.id === id);
    if (draft) {
      draft.status = 'PUBLISHED';
    }
    return draft || null;
  }

  public static getMetrics(): NewsroomMetrics {
    const published = this.drafts.filter(d => d.status === 'PUBLISHED').length;
    const avgScore = Math.round(
      this.drafts.reduce((acc, d) => acc + d.verificationScore, 0) / (this.drafts.length || 1)
    );

    return {
      totalAutoPublished: published + 142, // offset for historical autonomous count
      averageVerificationScore: avgScore,
      avgSpeedToPublishSeconds: 14.2,
      activeAgents: 8,
      syndicatedChannels: 5
    };
  }
}
