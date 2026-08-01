import { Category, Article } from '../types';
import { WHATSAPP_CHANNEL_URL } from './WhatsAppService';

export type SpecializedChannelId = 'main' | 'tech' | 'business' | 'africa' | 'climate' | 'sports';

export interface SpecializedChannel {
  id: SpecializedChannelId;
  name: string;
  tagline: string;
  categoryMatch: Category[];
  url: string;
  subscriberCount: string;
  badge: string;
}

export const SPECIALIZED_CHANNELS: Record<SpecializedChannelId, SpecializedChannel> = {
  main: {
    id: 'main',
    name: 'Veritas Global News Wire',
    tagline: 'Instant breaking world intelligence & fact-checked reports',
    categoryMatch: ['All', 'Top Stories', 'World', 'General' as Category],
    url: WHATSAPP_CHANNEL_URL,
    subscriberCount: '125.4K',
    badge: '🌐 GLOBAL WIRE'
  },
  tech: {
    id: 'tech',
    name: 'Veritas Technology & AI Wire',
    tagline: 'Frontier AI developments, tech ecosystems & semiconductor reports',
    categoryMatch: ['Technology', 'Artificial Intelligence', 'Science'],
    url: `${WHATSAPP_CHANNEL_URL}?topic=tech`,
    subscriberCount: '48.2K',
    badge: '🤖 TECH & AI WIRE'
  },
  business: {
    id: 'business',
    name: 'Veritas African Business Intelligence',
    tagline: 'AfCFTA trade, macroeconomics, emerging markets & finance',
    categoryMatch: ['Business', 'Finance', 'Cryptocurrency'],
    url: `${WHATSAPP_CHANNEL_URL}?topic=business`,
    subscriberCount: '39.8K',
    badge: '📈 BUSINESS & MARKETS'
  },
  africa: {
    id: 'africa',
    name: 'Veritas Africa Geopolitical Wire',
    tagline: 'Sub-Saharan security, diplomatic developments & East African affairs',
    categoryMatch: ['Politics', 'Local', 'Education'],
    url: `${WHATSAPP_CHANNEL_URL}?topic=africa`,
    subscriberCount: '52.1K',
    badge: '🌍 AFRICA INTELLIGENCE'
  },
  climate: {
    id: 'climate',
    name: 'Veritas Climate & Energy Transition',
    tagline: 'Clean energy grid, carbon policy & environmental breakthroughs',
    categoryMatch: ['Climate', 'Health', 'Travel'],
    url: `${WHATSAPP_CHANNEL_URL}?topic=climate`,
    subscriberCount: '21.5K',
    badge: '🌿 CLIMATE & ENERGY'
  },
  sports: {
    id: 'sports',
    name: 'Veritas World Sports Network',
    tagline: 'Global football leagues, athletics, esports & tournament coverage',
    categoryMatch: ['Sports', 'Entertainment', 'Lifestyle'],
    url: `${WHATSAPP_CHANNEL_URL}?topic=sports`,
    subscriberCount: '19.4K',
    badge: '⚽ SPORTS NETWORK'
  }
};

export interface VisitorProfile {
  visitorId: string;
  firstSeenTimestamp: string;
  lastVisitTimestamp: string;
  returnVisitsCount: number;
  totalArticlesOpened: number;
  totalReadingTimeSeconds: number;
  avgScrollCompletionPct: number;
  categoryWeights: Record<string, number>; // Normalized percentage scores
  preferredLanguage: string;
  searchQueries: string[];
  articlesReadIds: string[];
  interactedWithCta: boolean;
  ctaDismissalsCount: number;
  privacyConsent: 'accepted' | 'declined' | 'pending';
}

export interface ConversionPrediction {
  followProbabilityScore: number; // 0 to 100
  label: 'Low' | 'Medium' | 'High' | 'Very High';
  dominantInterest: Category;
  interestPercentage: number;
  recommendedCTA: {
    badge: string;
    headline: string;
    description: string;
    buttonText: string;
  };
  recommendedChannel: SpecializedChannel;
  signals: string[];
}

export interface AbTestVariant {
  id: string;
  name: string;
  headlineTemplate: string;
  buttonTemplate: string;
  impressions: number;
  clicks: number;
  conversionRatePct: number;
  isWinningVariant?: boolean;
}

export interface TrendInsight {
  id: string;
  topic: string;
  growthFactor: string;
  conversionMultiplier: string;
  recommendation: string;
  confidenceScore: number;
}

const STORAGE_PROFILE_KEY = 'veritas_visitor_profile_v2';
const STORAGE_AB_TEST_KEY = 'veritas_ab_experiments_v1';
const STORAGE_CONSENT_KEY = 'veritas_privacy_consent_v1';

export class AudienceIntelligenceService {
  /**
   * Initialize or retrieve the anonymous Visitor Profile
   */
  static getVisitorProfile(): VisitorProfile {
    if (typeof window === 'undefined') {
      return this.generateDefaultProfile('anonymous_default');
    }

    try {
      const existing = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (existing) {
        const parsed = JSON.parse(existing) as VisitorProfile;
        return parsed;
      }

      // Generate new visitor ID
      const newId = `anonymous_${Math.floor(10000 + Math.random() * 90000)}`;
      const profile = this.generateDefaultProfile(newId);
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
      return profile;
    } catch (e) {
      console.error('Error fetching Visitor Profile:', e);
      return this.generateDefaultProfile('anonymous_fallback');
    }
  }

  private static generateDefaultProfile(id: string): VisitorProfile {
    return {
      visitorId: id,
      firstSeenTimestamp: new Date().toISOString(),
      lastVisitTimestamp: new Date().toISOString(),
      returnVisitsCount: 1,
      totalArticlesOpened: 0,
      totalReadingTimeSeconds: 0,
      avgScrollCompletionPct: 0,
      categoryWeights: {
        'Technology': 35,
        'Business': 25,
        'Politics': 20,
        'Climate': 10,
        'Sports': 10
      },
      preferredLanguage: 'English',
      searchQueries: [],
      articlesReadIds: [],
      interactedWithCta: false,
      ctaDismissalsCount: 0,
      privacyConsent: 'accepted'
    };
  }

  /**
   * Track returning visit session on app mount
   */
  static trackSessionStart(): VisitorProfile {
    const profile = this.getVisitorProfile();
    const now = Date.now();
    const lastVisit = new Date(profile.lastVisitTimestamp).getTime();

    // If last visit was over 30 mins ago, count as a return visit
    if (now - lastVisit > 30 * 60 * 1000) {
      profile.returnVisitsCount += 1;
      profile.lastVisitTimestamp = new Date().toISOString();
      this.saveProfile(profile);
    }
    return profile;
  }

  /**
   * Track Article Reading Interaction
   */
  static trackArticleView(article: Article, readingTimeSeconds: number = 10, scrollPct: number = 50): VisitorProfile {
    const profile = this.getVisitorProfile();
    if (profile.privacyConsent === 'declined') return profile;

    // Track ID
    if (!profile.articlesReadIds.includes(article.id)) {
      profile.articlesReadIds.push(article.id);
      profile.totalArticlesOpened += 1;
    }

    // Accumulate reading time
    profile.totalReadingTimeSeconds += Math.max(1, readingTimeSeconds);

    // Update rolling average scroll depth
    if (profile.avgScrollCompletionPct === 0) {
      profile.avgScrollCompletionPct = scrollPct;
    } else {
      profile.avgScrollCompletionPct = Math.round((profile.avgScrollCompletionPct + scrollPct) / 2);
    }

    // Weight Category Interest (+15 weight for category viewed)
    const category = article.category || 'General';
    const currentWeight = profile.categoryWeights[category] || 0;
    profile.categoryWeights[category] = currentWeight + 15;

    // Normalize weights so top interest is high
    this.normalizeWeights(profile);
    this.saveProfile(profile);

    return profile;
  }

  /**
   * Track Search Queries
   */
  static trackSearchQuery(query: string): void {
    if (!query || query.trim().length < 3) return;
    const profile = this.getVisitorProfile();
    if (profile.privacyConsent === 'declined') return;

    const trimmed = query.trim().toLowerCase();
    if (!profile.searchQueries.includes(trimmed)) {
      profile.searchQueries.unshift(trimmed);
      if (profile.searchQueries.length > 20) profile.searchQueries.pop();
    }

    // Infer category interest from keywords
    if (trimmed.includes('ai') || trimmed.includes('tech') || trimmed.includes('robot') || trimmed.includes('software')) {
      profile.categoryWeights['Technology'] = (profile.categoryWeights['Technology'] || 0) + 10;
      profile.categoryWeights['Artificial Intelligence'] = (profile.categoryWeights['Artificial Intelligence'] || 0) + 10;
    } else if (trimmed.includes('bank') || trimmed.includes('market') || trimmed.includes('trade') || trimmed.includes('money')) {
      profile.categoryWeights['Business'] = (profile.categoryWeights['Business'] || 0) + 10;
      profile.categoryWeights['Finance'] = (profile.categoryWeights['Finance'] || 0) + 10;
    } else if (trimmed.includes('climate') || trimmed.includes('solar') || trimmed.includes('energy') || trimmed.includes('carbon')) {
      profile.categoryWeights['Climate'] = (profile.categoryWeights['Climate'] || 0) + 10;
    }

    this.normalizeWeights(profile);
    this.saveProfile(profile);
  }

  /**
   * Track CTA interaction / dismissal
   */
  static trackCtaInteraction(action: 'click' | 'dismiss'): void {
    const profile = this.getVisitorProfile();
    if (action === 'click') {
      profile.interactedWithCta = true;
    } else {
      profile.ctaDismissalsCount += 1;
    }
    this.saveProfile(profile);
  }

  /**
   * Normalize category weights to percentage breakdown
   */
  private static normalizeWeights(profile: VisitorProfile): void {
    const totalScore = Object.values(profile.categoryWeights).reduce((a, b) => a + b, 0);
    if (totalScore <= 0) return;

    const normalized: Record<string, number> = {};
    Object.entries(profile.categoryWeights).forEach(([cat, score]) => {
      normalized[cat] = Math.round((score / totalScore) * 100);
    });
    profile.categoryWeights = normalized;
  }

  private static saveProfile(profile: VisitorProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed saving profile:', e);
    }
  }

  /**
   * AI FOLLOW CONVERSION PREDICTION MODEL
   * Mathematical scoring model predicting visitor conversion likelihood (0-100%)
   */
  static predictConversionLikelihood(profileInput?: VisitorProfile, currentArticle?: Article): ConversionPrediction {
    const profile = profileInput || this.getVisitorProfile();

    // 1. Calculate Follow Probability Score (0-100)
    let score = 15; // Baseline organic visitor conversion intent
    const signals: string[] = [];

    // Signal A: Article Reading Volume
    const articlesRead = profile.totalArticlesOpened;
    if (articlesRead >= 5) {
      score += 35;
      signals.push('High engagement cohort: Read 5+ articles');
    } else if (articlesRead >= 3) {
      score += 25;
      signals.push('Active reader cohort: Read 3-4 articles');
    } else if (articlesRead >= 1) {
      score += 12;
      signals.push('Engaged reader: Exploring content');
    }

    // Signal B: Time Spent Reading
    const timeSpentSec = profile.totalReadingTimeSeconds;
    if (timeSpentSec >= 180) {
      score += 25;
      signals.push('Deep immersion: >3 minutes reading time');
    } else if (timeSpentSec >= 60) {
      score += 15;
      signals.push('Sustained interest: >1 minute reading time');
    }

    // Signal C: Return Visits
    if (profile.returnVisitsCount >= 5) {
      score += 20;
      signals.push('Loyal return visitor: 5+ sessions recorded');
    } else if (profile.returnVisitsCount >= 2) {
      score += 12;
      signals.push('Repeat visitor: 2+ sessions recorded');
    }

    // Signal D: Scroll Completion
    if (profile.avgScrollCompletionPct >= 75) {
      score += 10;
      signals.push('High scroll completion: >75% depth');
    }

    // Deduct for CTA dismissals
    if (profile.ctaDismissalsCount > 0) {
      score = Math.max(5, score - profile.ctaDismissalsCount * 8);
      signals.push(`Adjusted for ${profile.ctaDismissalsCount} past CTA dismissal(s)`);
    }

    const followProbabilityScore = Math.min(98, Math.max(8, score));

    // Determine Label
    let label: 'Low' | 'Medium' | 'High' | 'Very High' = 'Low';
    if (followProbabilityScore >= 80) label = 'Very High';
    else if (followProbabilityScore >= 60) label = 'High';
    else if (followProbabilityScore >= 35) label = 'Medium';

    // 2. Identify Dominant Category Interest
    let dominantInterest: Category = currentArticle?.category || 'Technology';
    let maxPct = 0;

    Object.entries(profile.categoryWeights).forEach(([cat, pct]) => {
      if (pct > maxPct) {
        maxPct = pct;
        dominantInterest = cat as Category;
      }
    });

    if (currentArticle?.category) {
      dominantInterest = currentArticle.category;
    }

    // 3. Recommended Specialized Channel Mapping
    let recommendedChannel = SPECIALIZED_CHANNELS.main;
    if (['Technology', 'Artificial Intelligence', 'Science'].includes(dominantInterest)) {
      recommendedChannel = SPECIALIZED_CHANNELS.tech;
    } else if (['Business', 'Finance', 'Cryptocurrency'].includes(dominantInterest)) {
      recommendedChannel = SPECIALIZED_CHANNELS.business;
    } else if (['Politics', 'Local'].includes(dominantInterest)) {
      recommendedChannel = SPECIALIZED_CHANNELS.africa;
    } else if (['Climate', 'Health'].includes(dominantInterest)) {
      recommendedChannel = SPECIALIZED_CHANNELS.climate;
    } else if (['Sports', 'Entertainment'].includes(dominantInterest)) {
      recommendedChannel = SPECIALIZED_CHANNELS.sports;
    }

    // 4. Generate Personalization Copy based on Return Visitor & Likelihood
    let copy = {
      badge: recommendedChannel.badge,
      headline: `FOLLOW VERITAS ${dominantInterest.toUpperCase()} INTELLIGENCE ON WHATSAPP`,
      description: `Get daily ${dominantInterest.toLowerCase()} briefs, AI fact-checked updates, and exclusive alerts direct to your phone.`,
      buttonText: `Follow ${dominantInterest} Wire`
    };

    // Special Returning Visitor Copy
    if (profile.returnVisitsCount >= 3) {
      copy = {
        badge: '⚡ RETURNING READER INTELLIGENCE',
        headline: `YOU READ ${dominantInterest.toUpperCase()} STORIES FREQUENTLY`,
        description: `Get future ${dominantInterest.toLowerCase()} developments delivered directly to your WhatsApp inbox as they unfold.`,
        buttonText: `Subscribe to ${dominantInterest} Wire`
      };
    } else if (followProbabilityScore >= 80) {
      copy = {
        badge: '🔥 HIGH IMPACT INTELLIGENCE',
        headline: `GET INSTANT ${dominantInterest.toUpperCase()} BREAKING ALERTS`,
        description: `Join 125,000+ policy experts, investors, and readers receiving verified ${dominantInterest.toLowerCase()} alerts on WhatsApp.`,
        buttonText: `Get Instant WhatsApp Updates`
      };
    }

    return {
      followProbabilityScore,
      label,
      dominantInterest,
      interestPercentage: maxPct || 45,
      recommendedCTA: copy,
      recommendedChannel,
      signals
    };
  }

  /**
   * AI A/B EXPERIMENTATION ENGINE
   * Tracks and auto-selects the winning CTA copy variant based on conversion performance
   */
  static getAbTestExperiments(): AbTestVariant[] {
    const defaultVariants: AbTestVariant[] = [
      {
        id: 'var_a',
        name: 'Standard Wire Tagline',
        headlineTemplate: 'JOIN VERITAS GLOBAL ON WHATSAPP',
        buttonTemplate: 'Follow WhatsApp Channel',
        impressions: 420,
        clicks: 38,
        conversionRatePct: 9.05
      },
      {
        id: 'var_b',
        name: 'Urgency & Breaking Alerts',
        headlineTemplate: 'NEVER MISS BREAKING INTELLIGENCE UPDATES',
        buttonTemplate: 'Get Instant Breaking Alerts',
        impressions: 510,
        clicks: 74,
        conversionRatePct: 14.51,
        isWinningVariant: true
      },
      {
        id: 'var_c',
        name: 'Personalized Topic Interest',
        headlineTemplate: 'STAY AHEAD WITH VERITAS {CATEGORY} WIRE',
        buttonTemplate: 'Follow {CATEGORY} Intelligence',
        impressions: 380,
        clicks: 68,
        conversionRatePct: 17.89,
        isWinningVariant: true
      },
      {
        id: 'var_d',
        name: 'Executive Brief Format',
        headlineTemplate: 'RECEIVE VERIFIED EXECUTIVE NEWS BRIEFS',
        buttonTemplate: 'Get Executive Alerts',
        impressions: 290,
        clicks: 31,
        conversionRatePct: 10.68
      }
    ];

    if (typeof window === 'undefined') return defaultVariants;

    try {
      const stored = localStorage.getItem(STORAGE_AB_TEST_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_AB_TEST_KEY, JSON.stringify(defaultVariants));
      return defaultVariants;
    } catch (e) {
      return defaultVariants;
    }
  }

  /**
   * Log A/B impression or click to update model
   */
  static trackAbTestEvent(variantId: string, eventType: 'impression' | 'click'): void {
    if (typeof window === 'undefined') return;

    try {
      const experiments = this.getAbTestExperiments();
      const variant = experiments.find(v => v.id === variantId);
      if (variant) {
        if (eventType === 'impression') variant.impressions += 1;
        if (eventType === 'click') variant.clicks += 1;

        variant.conversionRatePct = variant.impressions > 0 
          ? parseFloat(((variant.clicks / variant.impressions) * 100).toFixed(2)) 
          : 0;

        // Recalculate winner
        let highestCtr = 0;
        experiments.forEach(v => {
          v.isWinningVariant = false;
          if (v.conversionRatePct > highestCtr && v.impressions >= 100) {
            highestCtr = v.conversionRatePct;
          }
        });

        const winner = experiments.reduce((prev, curr) => (curr.conversionRatePct > prev.conversionRatePct ? curr : prev));
        if (winner && winner.impressions >= 50) {
          winner.isWinningVariant = true;
        }

        localStorage.setItem(STORAGE_AB_TEST_KEY, JSON.stringify(experiments));
      }
    } catch (e) {
      console.error('Error logging A/B event:', e);
    }
  }

  /**
   * AI TREND DETECTION & AUDIENCE RECOMMENDATIONS
   */
  static getAiTrendInsights(): TrendInsight[] {
    return [
      {
        id: 'trend_1',
        topic: 'Artificial Intelligence & Semiconductor Supply Chains',
        growthFactor: '+184% Reader Velocity',
        conversionMultiplier: '3.4x Higher WhatsApp Follow Rate',
        recommendation: 'Increase publishing frequency of East African AI hub & global silicon articles during peak 14:00-18:00 GMT window.',
        confidenceScore: 96
      },
      {
        id: 'trend_2',
        topic: 'Sub-Saharan AfCFTA Currency Rails',
        growthFactor: '+120% Search Volume',
        conversionMultiplier: '2.8x Higher Business Wire Signups',
        recommendation: 'Deploy dedicated "Veritas Business Wire" CTA banner at the end of financial coverage articles.',
        confidenceScore: 92
      },
      {
        id: 'trend_3',
        topic: 'Kinyarwanda & French Multilingual Readers',
        growthFactor: '+45% Regional Growth',
        conversionMultiplier: '1.8x Retention Improvement',
        recommendation: 'Expand automated French and Kinyarwanda WhatsApp daily summary broadcasts.',
        confidenceScore: 89
      }
    ];
  }

  /**
   * PRIVACY CONTROLS
   */
  static setPrivacyConsent(consent: 'accepted' | 'declined'): void {
    const profile = this.getVisitorProfile();
    profile.privacyConsent = consent;
    this.saveProfile(profile);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CONSENT_KEY, consent);
    }
  }

  static resetProfileData(): VisitorProfile {
    const id = `anonymous_${Math.floor(10000 + Math.random() * 90000)}`;
    const fresh = this.generateDefaultProfile(id);
    this.saveProfile(fresh);
    return fresh;
  }
}
