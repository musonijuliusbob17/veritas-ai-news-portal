export interface APIKeyRecord {
  keyId: string;
  name: string;
  apiKey: string;
  createdDate: string;
  lastUsed: string;
  rateLimitPerMin: number;
  monthlyQuota: number;
  monthlyRequestsUsed: number;
  status: 'ACTIVE' | 'REVOKED';
}

export interface APIRequestLog {
  timestamp: string;
  endpoint: string;
  method: 'GET' | 'POST';
  statusCode: number;
  responseTimeMs: number;
  clientIp: string;
}

export class VeritasAPIService {
  private static apiKeys: APIKeyRecord[] = [
    {
      keyId: 'key_001',
      name: 'EAC Policy Analytics Production Key',
      apiKey: 'vrt_live_sec_99481a82f10d482a9bc',
      createdDate: '2026-05-10',
      lastUsed: '2 minutes ago',
      rateLimitPerMin: 1200,
      monthlyQuota: 500000,
      monthlyRequestsUsed: 42180,
      status: 'ACTIVE'
    },
    {
      keyId: 'key_002',
      name: 'Norrsken Deep Tech Monitor Dev Key',
      apiKey: 'vrt_live_dev_44109c11a84f33b1109',
      createdDate: '2026-06-01',
      lastUsed: '1 hour ago',
      rateLimitPerMin: 300,
      monthlyQuota: 100000,
      monthlyRequestsUsed: 12450,
      status: 'ACTIVE'
    }
  ];

  private static requestLogs: APIRequestLog[] = [
    { timestamp: new Date(Date.now() - 120000).toISOString(), endpoint: '/api/news', method: 'GET', statusCode: 200, responseTimeMs: 42, clientIp: '197.243.0.12' },
    { timestamp: new Date(Date.now() - 300000).toISOString(), endpoint: '/api/risk', method: 'GET', statusCode: 200, responseTimeMs: 38, clientIp: '197.243.0.12' },
    { timestamp: new Date(Date.now() - 600000).toISOString(), endpoint: '/api/knowledge', method: 'GET', statusCode: 200, responseTimeMs: 65, clientIp: '41.186.22.4' },
    { timestamp: new Date(Date.now() - 900000).toISOString(), endpoint: '/api/trends', method: 'GET', statusCode: 200, responseTimeMs: 29, clientIp: '197.243.0.12' }
  ];

  public static getAPIKeys(): APIKeyRecord[] {
    return [...this.apiKeys];
  }

  public static createAPIKey(name: string): APIKeyRecord {
    const randomHex = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newKey: APIKeyRecord = {
      keyId: `key_${Date.now()}`,
      name,
      apiKey: `vrt_live_${randomHex}`,
      createdDate: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      rateLimitPerMin: 600,
      monthlyQuota: 250000,
      monthlyRequestsUsed: 0,
      status: 'ACTIVE'
    };
    this.apiKeys.unshift(newKey);
    return newKey;
  }

  public static revokeAPIKey(keyId: string) {
    const k = this.apiKeys.find(x => x.keyId === keyId);
    if (k) k.status = 'REVOKED';
  }

  public static getRecentLogs(): APIRequestLog[] {
    return [...this.requestLogs];
  }

  public static getEndpointsDocumentation(): Array<{ path: string; method: string; description: string; sampleParams: string }> {
    return [
      { path: '/api/news', method: 'GET', description: 'Returns verified AI news dispatches filtered by country, topic, or sentiment.', sampleParams: '?country=Rwanda&limit=20' },
      { path: '/api/entities', method: 'GET', description: 'Queries extracted entity profiles (people, companies, countries, technologies).', sampleParams: '?q=Norrsken%20Kigali' },
      { path: '/api/knowledge', method: 'GET', description: 'Returns full Knowledge Graph nodes and relationship vectors.', sampleParams: '?rootEntity=Rwanda' },
      { path: '/api/risk', method: 'GET', description: 'Retrieves real-time composite and domain risk evaluation scores.', sampleParams: '?domain=Technology' },
      { path: '/api/trends', method: 'GET', description: 'Returns trending search intent velocity and topic projections.', sampleParams: '?timeframe=30d' },
      { path: '/api/reports', method: 'GET', description: 'Fetches compiled intelligence report metadata and Markdown dispatches.', sampleParams: '?type=Daily%20Intelligence%20Brief' }
    ];
  }
}
