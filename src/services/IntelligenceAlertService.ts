export type AlertDeliveryChannel = 'EMAIL' | 'DASHBOARD' | 'WHATSAPP' | 'API_WEBHOOK';
export type AlertSeverityTrigger = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EnterpriseAlertRule {
  id: string;
  topicTitle: string;
  targetDomain: string;
  conditionDescription: string;
  riskScoreThreshold: number;
  deliveryChannels: AlertDeliveryChannel[];
  webhookUrl?: string;
  recipientPhone?: string;
  isActive: boolean;
  createdDate: string;
  lastTriggered?: string;
}

export class IntelligenceAlertService {
  private static alertRules: EnterpriseAlertRule[] = [
    {
      id: 'alt_001',
      topicTitle: 'Monitor Rwanda AI Sector & Sovereignty',
      targetDomain: 'Technology Research',
      conditionDescription: 'When composite risk score exceeds 40 or positive sentiment drops below 60%',
      riskScoreThreshold: 40,
      deliveryChannels: ['DASHBOARD', 'WHATSAPP', 'EMAIL'],
      recipientPhone: '+250 788 123 456',
      isActive: true,
      createdDate: '2026-07-10',
      lastTriggered: '2026-07-29 14:22'
    },
    {
      id: 'alt_002',
      topicTitle: 'Subsea Fiber Landing Telemetry Disruption Alert',
      targetDomain: 'Security Analysis',
      conditionDescription: 'When subsea fiber cable acoustic sensors register elevated risk',
      riskScoreThreshold: 50,
      deliveryChannels: ['DASHBOARD', 'API_WEBHOOK'],
      webhookUrl: 'https://api.eac.int/hooks/veritas-security-alerts',
      isActive: true,
      createdDate: '2026-07-15'
    }
  ];

  public static getAlertRules(): EnterpriseAlertRule[] {
    return [...this.alertRules];
  }

  public static createAlertRule(rule: Omit<EnterpriseAlertRule, 'id' | 'createdDate' | 'isActive'>): EnterpriseAlertRule {
    const newRule: EnterpriseAlertRule = {
      ...rule,
      id: `alt_${Date.now()}`,
      isActive: true,
      createdDate: new Date().toISOString().split('T')[0]
    };
    this.alertRules.unshift(newRule);
    return newRule;
  }

  public static toggleAlertRule(id: string): boolean {
    const r = this.alertRules.find(x => x.id === id);
    if (r) {
      r.isActive = !r.isActive;
      return r.isActive;
    }
    return false;
  }
}
