import { AgentType } from './AgentTaskManager';

export type FeedbackRating = 'CORRECT' | 'INCORRECT' | 'NEEDS_IMPROVEMENT';

export interface AgentFeedbackEntry {
  id: string;
  taskId: string;
  agentType: AgentType;
  rating: FeedbackRating;
  analystComment?: string;
  correctedOutput?: string;
  submittedAt: string;
  analystId: string;
}

export class AgentFeedbackEngine {
  private static feedbackLogs: AgentFeedbackEntry[] = [
    {
      id: 'fb_001',
      taskId: 'task_001',
      agentType: 'News Analyst Agent',
      rating: 'CORRECT',
      analystComment: 'Synthesis accurately captured the Norrsken Kigali compute cluster expansion.',
      submittedAt: new Date(Date.now() - 1200000).toISOString(),
      analystId: 'Analyst #104'
    },
    {
      id: 'fb_002',
      taskId: 'task_002',
      agentType: 'Fact Verification Agent',
      rating: 'CORRECT',
      analystComment: 'Matched maritime telemetry with hydrographic office logs perfectly.',
      submittedAt: new Date(Date.now() - 3600000).toISOString(),
      analystId: 'Analyst #88'
    }
  ];

  public static submitFeedback(
    taskId: string,
    agentType: AgentType,
    rating: FeedbackRating,
    comment?: string,
    correctedOutput?: string
  ): AgentFeedbackEntry {
    const entry: AgentFeedbackEntry = {
      id: `fb_${Date.now()}`,
      taskId,
      agentType,
      rating,
      analystComment: comment,
      correctedOutput,
      submittedAt: new Date().toISOString(),
      analystId: 'Senior Analyst Desk'
    };

    this.feedbackLogs.unshift(entry);
    return entry;
  }

  public static getFeedbackHistory(): AgentFeedbackEntry[] {
    return [...this.feedbackLogs];
  }

  public static getFeedbackStats(): {
    correctCount: number;
    incorrectCount: number;
    needsImprovementCount: number;
    satisfactionRate: number;
  } {
    const total = this.feedbackLogs.length || 1;
    const correct = this.feedbackLogs.filter(f => f.rating === 'CORRECT').length;
    const incorrect = this.feedbackLogs.filter(f => f.rating === 'INCORRECT').length;
    const needsImp = this.feedbackLogs.filter(f => f.rating === 'NEEDS_IMPROVEMENT').length;

    return {
      correctCount: correct,
      incorrectCount: incorrect,
      needsImprovementCount: needsImp,
      satisfactionRate: Math.round((correct / total) * 100)
    };
  }
}
