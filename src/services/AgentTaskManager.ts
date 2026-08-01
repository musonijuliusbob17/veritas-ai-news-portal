export type AgentType = 
  | 'News Analyst Agent' 
  | 'Fact Verification Agent' 
  | 'Research Agent' 
  | 'Trend Analyst Agent' 
  | 'SEO Agent' 
  | 'Audience Agent' 
  | 'Translation Agent';

export type TaskStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface AgentTaskLog {
  timestamp: string;
  agent: AgentType;
  message: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

export interface AgentTask {
  id: string;
  title: string;
  agentType: AgentType;
  inputPayload: string;
  status: TaskStatus;
  progressPercentage: number;
  outputResult?: string;
  structuredOutput?: Record<string, any>;
  createdAt: string;
  completedAt?: string;
  logs: AgentTaskLog[];
}

export class AgentTaskManager {
  private static tasks: AgentTask[] = [
    {
      id: 'task_001',
      title: 'Analyze Kigali AI Supercomputing Investment Impact',
      agentType: 'News Analyst Agent',
      inputPayload: 'Evaluate $1.5B venture capital influx into East African deep tech startups.',
      status: 'COMPLETED',
      progressPercentage: 100,
      outputResult: 'Strategic surge detected in East African deep tech ecosystem. Tech talent retention up by 42%.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 1800000).toISOString(),
      logs: [
        { timestamp: new Date(Date.now() - 3500000).toISOString(), agent: 'News Analyst Agent', message: 'Ingested 14 regional news feeds.', level: 'INFO' },
        { timestamp: new Date(Date.now() - 1800000).toISOString(), agent: 'News Analyst Agent', message: 'Synthesis complete with 96% confidence.', level: 'SUCCESS' }
      ]
    },
    {
      id: 'task_002',
      title: 'Cross-Verify Subsea Cable Capacity Claims',
      agentType: 'Fact Verification Agent',
      inputPayload: 'Verify 40 Tbps throughput claims for coastal East Africa fiber grid.',
      status: 'COMPLETED',
      progressPercentage: 100,
      outputResult: 'Verified: Multi-publisher telemetry confirms 40 Tbps rating across 3 marine landing stations.',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      completedAt: new Date(Date.now() - 5400000).toISOString(),
      logs: [
        { timestamp: new Date(Date.now() - 7100000).toISOString(), agent: 'Fact Verification Agent', message: 'Cross-referencing IMO and ITU hydrographic databases.', level: 'INFO' },
        { timestamp: new Date(Date.now() - 5400000).toISOString(), agent: 'Fact Verification Agent', message: 'Zero factual discrepancies detected.', level: 'SUCCESS' }
      ]
    }
  ];

  public static getTasks(): AgentTask[] {
    return [...this.tasks];
  }

  public static addTask(task: Omit<AgentTask, 'id' | 'createdAt' | 'logs' | 'status' | 'progressPercentage'>): AgentTask {
    const newTask: AgentTask = {
      ...task,
      id: `task_${Date.now()}`,
      status: 'QUEUED',
      progressPercentage: 0,
      createdAt: new Date().toISOString(),
      logs: [
        { timestamp: new Date().toISOString(), agent: task.agentType, message: `Task queued: ${task.title}`, level: 'INFO' }
      ]
    };
    this.tasks.unshift(newTask);
    return newTask;
  }

  public static updateTaskStatus(
    taskId: string, 
    status: TaskStatus, 
    progress: number, 
    logMsg?: string, 
    output?: string, 
    structured?: Record<string, any>
  ) {
    const t = this.tasks.find(x => x.id === taskId);
    if (t) {
      t.status = status;
      t.progressPercentage = progress;
      if (output) t.outputResult = output;
      if (structured) t.structuredOutput = structured;
      if (status === 'COMPLETED') t.completedAt = new Date().toISOString();
      if (logMsg) {
        t.logs.push({
          timestamp: new Date().toISOString(),
          agent: t.agentType,
          message: logMsg,
          level: status === 'FAILED' ? 'ERROR' : status === 'COMPLETED' ? 'SUCCESS' : 'INFO'
        });
      }
    }
  }
}
