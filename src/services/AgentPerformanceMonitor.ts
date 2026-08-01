import { AgentType } from './AgentTaskManager';

export interface AgentMetric {
  agentType: AgentType;
  tasksCompleted: number;
  accuracyRatePercentage: number;
  averageProcessingSeconds: number;
  humanCorrectionRatePercentage: number;
  topCapability: string;
}

export class AgentPerformanceMonitor {
  public static getAgentPerformanceMetrics(): AgentMetric[] {
    return [
      {
        agentType: 'News Analyst Agent',
        tasksCompleted: 14280,
        accuracyRatePercentage: 96.8,
        averageProcessingSeconds: 14,
        humanCorrectionRatePercentage: 3.2,
        topCapability: 'Multi-dispatch narrative clustering & synthesis'
      },
      {
        agentType: 'Fact Verification Agent',
        tasksCompleted: 12540,
        accuracyRatePercentage: 98.4,
        averageProcessingSeconds: 18,
        humanCorrectionRatePercentage: 1.6,
        topCapability: 'Cross-publisher telemetry consensus verification'
      },
      {
        agentType: 'Research Agent',
        tasksCompleted: 8920,
        accuracyRatePercentage: 95.2,
        averageProcessingSeconds: 24,
        humanCorrectionRatePercentage: 4.8,
        topCapability: 'Deep entity relationship network extraction'
      },
      {
        agentType: 'Trend Analyst Agent',
        tasksCompleted: 19400,
        accuracyRatePercentage: 94.6,
        averageProcessingSeconds: 8,
        humanCorrectionRatePercentage: 5.4,
        topCapability: 'Real-time velocity spike & search intent forecasting'
      },
      {
        agentType: 'SEO Agent',
        tasksCompleted: 22100,
        accuracyRatePercentage: 97.9,
        averageProcessingSeconds: 6,
        humanCorrectionRatePercentage: 2.1,
        topCapability: 'High-rank keyword structuring & readability score'
      },
      {
        agentType: 'Audience Agent',
        tasksCompleted: 11200,
        accuracyRatePercentage: 96.1,
        averageProcessingSeconds: 10,
        humanCorrectionRatePercentage: 3.9,
        topCapability: 'Demographic intent clustering & localized personalization'
      },
      {
        agentType: 'Translation Agent',
        tasksCompleted: 34500,
        accuracyRatePercentage: 99.2,
        averageProcessingSeconds: 4,
        humanCorrectionRatePercentage: 0.8,
        topCapability: 'Diplomatic & technical phrasing localization'
      }
    ];
  }

  public static getSystemOverview(): {
    totalAgentTasksCompleted: number;
    overallAccuracy: number;
    avgProcessingSpeedSeconds: number;
    humanCorrectionAverage: number;
  } {
    const metrics = this.getAgentPerformanceMetrics();
    const total = metrics.reduce((acc, m) => acc + m.tasksCompleted, 0);
    const avgAcc = Number((metrics.reduce((acc, m) => acc + m.accuracyRatePercentage, 0) / metrics.length).toFixed(1));
    const avgSpeed = Number((metrics.reduce((acc, m) => acc + m.averageProcessingSeconds, 0) / metrics.length).toFixed(1));
    const avgCorr = Number((metrics.reduce((acc, m) => acc + m.humanCorrectionRatePercentage, 0) / metrics.length).toFixed(1));

    return {
      totalAgentTasksCompleted: total,
      overallAccuracy: avgAcc,
      avgProcessingSpeedSeconds: avgSpeed,
      humanCorrectionAverage: avgCorr
    };
  }
}
