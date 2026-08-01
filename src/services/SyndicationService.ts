export interface SyndicationChannel {
  id: string;
  name: string;
  type: 'WHATSAPP_CHANNEL' | 'RSS_ATOM_FEED' | 'ENTERPRISE_WEBHOOK' | 'SOCIAL_DISPATCH' | 'EMAIL_NEWSLETTER';
  subscribersCount: number;
  status: 'ACTIVE' | 'PAUSED' | 'SYNCING';
  lastBroadcast: string;
}

export interface BroadcastLog {
  id: string;
  channelName: string;
  channelType: string;
  articleTitle: string;
  reachCount: number;
  deliveryStatus: 'DELIVERED' | 'QUEUED' | 'SENDING';
  timestamp: string;
}

export class SyndicationService {
  private static channels: SyndicationChannel[] = [
    {
      id: 'chan-wa-1',
      name: 'Veritas WhatsApp Intelligence Channel',
      type: 'WHATSAPP_CHANNEL',
      subscribersCount: 24500,
      status: 'ACTIVE',
      lastBroadcast: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'chan-rss-1',
      name: 'Veritas Enterprise Verified RSS Feed',
      type: 'RSS_ATOM_FEED',
      subscribersCount: 89000,
      status: 'ACTIVE',
      lastBroadcast: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'chan-wh-1',
      name: 'Bloomberg & Reuters Enterprise Webhooks',
      type: 'ENTERPRISE_WEBHOOK',
      subscribersCount: 140,
      status: 'ACTIVE',
      lastBroadcast: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: 'chan-soc-1',
      name: 'Veritas Global X / LinkedIn Social Bot',
      type: 'SOCIAL_DISPATCH',
      subscribersCount: 142000,
      status: 'ACTIVE',
      lastBroadcast: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  private static logs: BroadcastLog[] = [
    {
      id: 'log-101',
      channelName: 'Veritas WhatsApp Intelligence Channel',
      channelType: 'WHATSAPP_CHANNEL',
      articleTitle: 'Autonomous AI Agents Intersecting Global Supply Chains: Q3 Analysis',
      reachCount: 24500,
      deliveryStatus: 'DELIVERED',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'log-102',
      channelName: 'Bloomberg & Reuters Enterprise Webhooks',
      channelType: 'ENTERPRISE_WEBHOOK',
      articleTitle: 'Global Renewable Energy Grid Resilience Reaches Historic Landmark',
      reachCount: 140,
      deliveryStatus: 'DELIVERED',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    }
  ];

  public static getChannels(): SyndicationChannel[] {
    return this.channels;
  }

  public static getLogs(): BroadcastLog[] {
    return this.logs;
  }

  public static triggerMultiChannelBroadcast(articleTitle: string): BroadcastLog[] {
    const newLogs: BroadcastLog[] = this.channels.map(chan => {
      const log: BroadcastLog = {
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        channelName: chan.name,
        channelType: chan.type,
        articleTitle,
        reachCount: chan.subscribersCount,
        deliveryStatus: 'DELIVERED',
        timestamp: new Date().toISOString()
      };
      chan.lastBroadcast = log.timestamp;
      return log;
    });

    this.logs = [...newLogs, ...this.logs];
    return newLogs;
  }
}
