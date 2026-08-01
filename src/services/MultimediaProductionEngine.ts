export interface AudioVoiceProfile {
  id: string;
  name: string;
  role: string;
  gender: 'Female' | 'Male' | 'Neutral';
  accent: string;
  pitch: number;
  speed: number;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  summary: string;
  durationSeconds: number;
  voiceProfile: AudioVoiceProfile;
  transcript: string;
  audioWaveformData: number[];
  publishedAt: string;
}

export interface InfographicPromptSpec {
  id: string;
  articleTitle: string;
  suggestedType: 'BAR_GRAPH' | 'NETWORK_DIAGRAM' | 'GEOPOLITICAL_MAP' | 'TIMELINE';
  visualPrompt: string;
  keyDataPoints: { label: string; value: string }[];
}

export class MultimediaProductionEngine {
  public static voiceProfiles: AudioVoiceProfile[] = [
    {
      id: 'voice-1',
      name: 'Victoria Vance',
      role: 'Senior Geopolitical Anchor',
      gender: 'Female',
      accent: 'British RP',
      pitch: 1.0,
      speed: 1.0
    },
    {
      id: 'voice-2',
      name: 'Marcus Sterling',
      role: 'Global Markets & Financial Analyst',
      gender: 'Male',
      accent: 'Mid-Atlantic',
      pitch: 0.9,
      speed: 1.05
    },
    {
      id: 'voice-3',
      name: 'Elena Rostova',
      role: 'Tech & AI Systems Correspondent',
      gender: 'Female',
      accent: 'International Standard',
      pitch: 1.05,
      speed: 0.98
    }
  ];

  private static podcastQueue: PodcastEpisode[] = [
    {
      id: 'pod-101',
      title: 'Daily AI Briefing: Autonomous Newsrooms & Geopolitical Shifts',
      summary: 'A 3-minute executive overview of today’s top verified AI intelligence and global market movements.',
      durationSeconds: 184,
      voiceProfile: MultimediaProductionEngine.voiceProfiles[0],
      transcript: 'Welcome to Veritas Daily AI Briefing. Today, autonomous AI systems demonstrate unprecedented precision in tracking global logistics and energy resilience across key trade hubs. In geopolitics, multi-regional diplomatic talks progress with real-time verification benchmarks.',
      audioWaveformData: [20, 45, 80, 60, 95, 40, 70, 85, 90, 30, 60, 100, 75, 50, 65, 80, 40, 90, 55, 30],
      publishedAt: new Date(Date.now() - 3600000 * 3).toISOString()
    }
  ];

  public static getVoiceProfiles(): AudioVoiceProfile[] {
    return this.voiceProfiles;
  }

  public static getPodcasts(): PodcastEpisode[] {
    return this.podcastQueue;
  }

  public static generatePodcast(articleTitle: string, articleSummary: string, voiceId: string): PodcastEpisode {
    const selectedVoice = this.voiceProfiles.find(v => v.id === voiceId) || this.voiceProfiles[0];
    const newId = `pod-${Date.now()}`;
    const waveform = Array.from({ length: 24 }, () => Math.floor(Math.random() * 70) + 30);

    const episode: PodcastEpisode = {
      id: newId,
      title: `Podcast Audio: ${articleTitle}`,
      summary: `Automated voice synthesis of article: ${articleSummary}`,
      durationSeconds: Math.floor(Math.random() * 90) + 120, // 2 to 3.5 mins
      voiceProfile: selectedVoice,
      transcript: `This is Veritas Autonomous Audio Service narrated by ${selectedVoice.name}, ${selectedVoice.role}. Report on ${articleTitle}: ${articleSummary}`,
      audioWaveformData: waveform,
      publishedAt: new Date().toISOString()
    };

    this.podcastQueue.unshift(episode);
    return episode;
  }

  public static generateInfographicSpec(articleTitle: string, keyPoints: string[]): InfographicPromptSpec {
    return {
      id: `info-spec-${Date.now()}`,
      articleTitle,
      suggestedType: 'TIMELINE',
      visualPrompt: `High-definition clean corporate infographic visualizing data points for "${articleTitle}". Dark slate theme with emerald and cyan glowing telemetry lines.`,
      keyDataPoints: keyPoints.map((kp, idx) => ({ label: `Data Point ${idx + 1}`, value: kp }))
    };
  }
}
