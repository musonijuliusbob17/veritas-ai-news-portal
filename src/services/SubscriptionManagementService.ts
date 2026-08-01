export type PlanTier = 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

export interface PlanDetails {
  tier: PlanTier;
  priceMonthlyUSD: number;
  priceAnnualUSD: number;
  description: string;
  features: PlanFeature[];
}

export interface SubscriptionStatus {
  orgId: string;
  tier: PlanTier;
  status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  monthlyQuotaUsed: {
    reportsDownloaded: number;
    reportsQuota: number;
    apiRequestsUsed: number;
    apiQuota: number;
    aiSearchQueriesUsed: number;
    aiSearchQuota: number;
  };
}

export class SubscriptionManagementService {
  public static getPlans(): PlanDetails[] {
    return [
      {
        tier: 'FREE',
        priceMonthlyUSD: 0,
        priceAnnualUSD: 0,
        description: 'For independent journalists and public researchers.',
        features: [
          { name: 'Public Intelligence News Feed', included: true },
          { name: 'Basic AI Search Assistant', included: true, limit: '50 queries/day' },
          { name: 'Public Daily Briefing', included: true },
          { name: 'Premium Intelligence Store Reports', included: false },
          { name: 'Enterprise API Access', included: false },
          { name: 'Private Intelligence Rooms', included: false },
          { name: 'Dedicated Support & SLA', included: false }
        ]
      },
      {
        tier: 'PROFESSIONAL',
        priceMonthlyUSD: 299,
        priceAnnualUSD: 2990,
        description: 'For growing research desks, media houses, and policy analysts.',
        features: [
          { name: 'Public Intelligence News Feed', included: true },
          { name: 'Advanced AI Search & Knowledge Graph', included: true, limit: '1,000 queries/day' },
          { name: 'Full VIOS Agent Workspace Access', included: true },
          { name: '5 Included Premium Reports / Month', included: true },
          { name: 'Custom Multi-channel Alerts (WhatsApp & Email)', included: true },
          { name: 'Enterprise API Access', included: false },
          { name: 'Private Intelligence Rooms', included: false },
          { name: 'Dedicated Support & SLA', included: false }
        ]
      },
      {
        tier: 'ENTERPRISE',
        priceMonthlyUSD: 1499,
        priceAnnualUSD: 14990,
        description: 'For sovereign governments, global institutions, and multinational investors.',
        features: [
          { name: 'Full Unrestricted Platform Access', included: true },
          { name: 'Unlimited AI Search & Agent Orchestration', included: true },
          { name: 'Unlimited Marketplace Intelligence Reports', included: true },
          { name: 'Dedicated Private Intelligence Rooms', included: true, limit: 'Up to 10 Rooms' },
          { name: 'Full Veritas REST API Access', included: true, limit: '500,000 requests/mo' },
          { name: 'Custom Risk Threshold Webhooks & SLA', included: true },
          { name: 'Domain Security Isolation & Audit Log Vault', included: true }
        ]
      }
    ];
  }

  public static getSubscriptionStatus(orgId: string): SubscriptionStatus {
    return {
      orgId,
      tier: 'ENTERPRISE',
      status: 'ACTIVE',
      currentPeriodStart: '2026-08-01',
      currentPeriodEnd: '2027-08-01',
      monthlyQuotaUsed: {
        reportsDownloaded: 14,
        reportsQuota: 999,
        apiRequestsUsed: 42180,
        apiQuota: 500000,
        aiSearchQueriesUsed: 3120,
        aiSearchQuota: 100000
      }
    };
  }

  public static upgradeSubscription(orgId: string, newTier: PlanTier): SubscriptionStatus {
    const sub = this.getSubscriptionStatus(orgId);
    sub.tier = newTier;
    return sub;
  }
}
