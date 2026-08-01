export interface ComputeNode {
  id: string;
  name: string;
  location: string;
  country: string;
  nodeType: 'SOVEREIGN_CLOUD' | 'EDGE_CLUSTER' | 'SATELLITE_RELAY' | 'LOCAL_LLM_DESK';
  gpuCount: number;
  gpuModel: string;
  status: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE';
  utilizationPercent: number;
  latencyMs: number;
  dataSovereigntyCompliance: number; // 0 - 100%
  activeModels: string[];
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeName: string;
  metric: string;
  value: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
}

export class SovereignComputeTelemetryService {
  private static nodes: ComputeNode[] = [
    {
      id: 'node-kigali-01',
      name: 'Norrsken Kigali Sovereign AI Compute Hub',
      location: 'Kigali Innovation City',
      country: 'Rwanda',
      nodeType: 'SOVEREIGN_CLOUD',
      gpuCount: 128,
      gpuModel: 'Nvidia H100 / B200 Tensor Core',
      status: 'ONLINE',
      utilizationPercent: 74,
      latencyMs: 8.4,
      dataSovereigntyCompliance: 100,
      activeModels: ['Kinyarwanda-LLM-v2', 'EAC-Policy-Assistant', 'Health-Diagnostic-V3']
    },
    {
      id: 'node-nairobi-02',
      name: 'Silicon Savannah Hyperscale Edge Cluster',
      location: 'Nairobi Digital Hub',
      country: 'Kenya',
      nodeType: 'EDGE_CLUSTER',
      gpuCount: 96,
      gpuModel: 'Nvidia A100 Tensor Core',
      status: 'ONLINE',
      utilizationPercent: 82,
      latencyMs: 14.2,
      dataSovereigntyCompliance: 98,
      activeModels: ['Swahili-News-Summarizer', 'Fintech-Anomaly-Detector']
    },
    {
      id: 'node-joburg-03',
      name: 'Southern Africa Deep Tech Compute Vault',
      location: 'Johannesburg Data Park',
      country: 'South Africa',
      nodeType: 'SOVEREIGN_CLOUD',
      gpuCount: 256,
      gpuModel: 'Nvidia H200 Superchip',
      status: 'ONLINE',
      utilizationPercent: 65,
      latencyMs: 24.1,
      dataSovereigntyCompliance: 99,
      activeModels: ['Subsea-Acoustic-AI', 'Macro-Economic-Prediction-Engine']
    },
    {
      id: 'node-sat-relay-04',
      name: 'Equatorial Orbit Low-Earth Satellite Relay',
      location: 'Low-Earth Orbit',
      country: 'Pan-African',
      nodeType: 'SATELLITE_RELAY',
      gpuCount: 32,
      gpuModel: 'Edge TPU Radiation Hardened',
      status: 'ONLINE',
      utilizationPercent: 42,
      latencyMs: 48.0,
      dataSovereigntyCompliance: 100,
      activeModels: ['Geospatial-Optical-Processor', 'BGP-Route-Anomaly-Bot']
    }
  ];

  private static logs: TelemetryLog[] = [
    {
      id: 'log-001',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      nodeId: 'node-kigali-01',
      nodeName: 'Norrsken Kigali Sovereign AI Compute Hub',
      metric: 'Sovereign Data Residency Audit',
      value: '100% Encrypted & Localized (Zero external leaks)',
      level: 'INFO'
    },
    {
      id: 'log-002',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      nodeId: 'node-nairobi-02',
      metric: 'Compute Load Balance',
      nodeName: 'Silicon Savannah Hyperscale Edge Cluster',
      value: '+12% shift to Kigali Hub to optimize grid thermal energy',
      level: 'INFO'
    }
  ];

  public static getNodes(): ComputeNode[] {
    return [...this.nodes];
  }

  public static getLogs(): TelemetryLog[] {
    return [...this.logs];
  }

  public static pingNode(id: string): number {
    const node = this.nodes.find(n => n.id === id);
    if (node) {
      node.latencyMs = Math.round((Math.random() * 5 + 6) * 10) / 10;
      return node.latencyMs;
    }
    return 12.0;
  }

  public static rebalanceCompute(nodeId: string): ComputeNode | null {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.utilizationPercent = Math.max(30, node.utilizationPercent - 15);
      this.logs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        nodeId: node.id,
        nodeName: node.name,
        metric: 'Manual Compute Rebalance',
        value: `Utilized load optimized to ${node.utilizationPercent}%`,
        level: 'INFO'
      });
    }
    return node || null;
  }
}
