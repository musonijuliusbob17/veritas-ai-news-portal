export interface ScenarioVariable {
  id: string;
  name: string;
  category: 'GEOPOLITICS' | 'ENERGY' | 'CYBER' | 'ECONOMY';
  value: number; // 0 to 100
  unit: string;
  description: string;
}

export interface SimulationResult {
  id: string;
  scenarioTitle: string;
  timestamp: string;
  overallRiskLevel: 'LOW' | 'MODERATE' | 'CRITICAL' | 'EXTREME';
  confidenceScore: number;
  outcomes: {
    category: string;
    impactScore: number; // 0 to 100
    trajectory: 'IMPROVING' | 'STABLE' | 'DETERIORATING';
    description: string;
  }[];
  mitigationPlaybook: {
    step: number;
    title: string;
    action: string;
    responsibleEntity: string;
  }[];
  projectedTimeline: {
    timeframe: string;
    eventPrediction: string;
    probability: number;
  }[];
}

export class GeopoliticalSimulationEngine {
  public static defaultVariables: ScenarioVariable[] = [
    {
      id: 'var-1',
      name: 'South China Sea Maritime Tension',
      category: 'GEOPOLITICS',
      value: 75,
      unit: '% Risk Escalation',
      description: 'Naval presence and freedom of navigation friction levels'
    },
    {
      id: 'var-2',
      name: 'Global Crude Oil Supply Volatility',
      category: 'ENERGY',
      value: 62,
      unit: '% Volatility Index',
      description: 'Chokepoint transit delays & OPEC production quotas'
    },
    {
      id: 'var-3',
      name: 'Critical Subsea Infrastructure Cyber Threat',
      category: 'CYBER',
      value: 84,
      unit: '% Threat Level',
      description: 'Targeted DDoS & intrusion activity against fiber cables'
    },
    {
      id: 'var-4',
      name: 'Semiconductor Supply Chain Bottleneck',
      category: 'ECONOMY',
      value: 68,
      unit: '% Constraints',
      description: 'Advanced chip export restrictions and fab capacity'
    }
  ];

  public static getVariables(): ScenarioVariable[] {
    return this.defaultVariables;
  }

  public static runSimulation(
    scenarioTitle: string,
    activeVariables: ScenarioVariable[]
  ): SimulationResult {
    const avgRisk = Math.round(
      activeVariables.reduce((acc, v) => acc + v.value, 0) / (activeVariables.length || 1)
    );

    let overallRiskLevel: 'LOW' | 'MODERATE' | 'CRITICAL' | 'EXTREME' = 'MODERATE';
    if (avgRisk > 80) overallRiskLevel = 'EXTREME';
    else if (avgRisk > 65) overallRiskLevel = 'CRITICAL';
    else if (avgRisk > 45) overallRiskLevel = 'MODERATE';
    else overallRiskLevel = 'LOW';

    const cyberVar = activeVariables.find(v => v.category === 'CYBER')?.value || 50;
    const energyVar = activeVariables.find(v => v.category === 'ENERGY')?.value || 50;
    const geoVar = activeVariables.find(v => v.category === 'GEOPOLITICS')?.value || 50;

    return {
      id: `sim-run-${Date.now()}`,
      scenarioTitle: scenarioTitle || 'Custom Multi-Vector Geopolitical Stress Test',
      timestamp: new Date().toISOString(),
      overallRiskLevel,
      confidenceScore: Math.floor(Math.random() * 6) + 93, // 93-98%
      outcomes: [
        {
          category: 'Global Trade & Logistics',
          impactScore: Math.min(99, Math.round(geoVar * 1.1)),
          trajectory: geoVar > 70 ? 'DETERIORATING' : 'STABLE',
          description: `Container rerouting around major chokepoints expected to inflate shipping costs by ${Math.round(geoVar * 0.45)}% over 30 days.`
        },
        {
          category: 'Energy Market Stability',
          impactScore: Math.min(99, Math.round(energyVar * 1.05)),
          trajectory: energyVar > 60 ? 'DETERIORATING' : 'IMPROVING',
          description: `European thermal & gas reserves face price swings up to $${Math.round(energyVar * 1.2)}/MWh during peak demand.`
        },
        {
          category: 'Digital Infrastructure Integrity',
          impactScore: Math.min(99, Math.round(cyberVar * 1.15)),
          trajectory: cyberVar > 75 ? 'DETERIORATING' : 'STABLE',
          description: `Subsea optical links experience high packet drop alerts; failover routing required across alternate regional satellites.`
        }
      ],
      mitigationPlaybook: [
        {
          step: 1,
          title: 'Activate Redundant Subsea Bandwidth',
          action: 'Reroute critical banking and defense communications through trans-Pacific satellite constellations.',
          responsibleEntity: 'Cyber & Infrastructure Command'
        },
        {
          step: 2,
          title: 'Pre-position Strategic Energy Buffers',
          action: 'Release 15M barrels equivalent from strategic reserves to damp short-term price spikes.',
          responsibleEntity: 'International Energy Agency Consortium'
        },
        {
          step: 3,
          title: 'Initiate Bilateral Maritime De-escalation Protocol',
          action: 'Deploy automated diplomatic telemetry channels to establish emergency naval hotline contact.',
          responsibleEntity: 'Veritas Geopolitical Mediation Desk'
        }
      ],
      projectedTimeline: [
        {
          timeframe: '+12 Hours',
          eventPrediction: 'Market futures reflect preliminary scenario risk premium (+3.4% volatility).',
          probability: 94
        },
        {
          timeframe: '+48 Hours',
          eventPrediction: 'Logistical carriers issue revised maritime routing advisories.',
          probability: 88
        },
        {
          timeframe: '+7 Days',
          eventPrediction: 'Policy interventions stabilize primary commodity price vectors.',
          probability: 76
        }
      ]
    };
  }
}
