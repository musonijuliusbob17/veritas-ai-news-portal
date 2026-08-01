import { Article } from '../types';

export interface EditorialPackage {
  articleId: string;
  originalHeadline: string;
  headlineSuggestions: string[];
  executiveSummary: string;
  seoMetadata: {
    seoTitle: string;
    metaDescription: string;
    keywords: string[];
    slug: string;
  };
  socialMediaCopy: {
    xTwitter: string;
    linkedIn: string;
    facebook: string;
  };
  whatsAppBroadcast: {
    channelHeadline: string;
    bodyText: string;
    callToAction: string;
  };
}

export class EditorialAssistantService {
  /**
   * Generates a complete AI Editorial Assistance package for any article.
   */
  public static generateEditorialPackage(article: Article): EditorialPackage {
    const orig = article.title;
    const cat = article.category;
    const region = article.region || 'Global';

    // 1. Headline Suggestions
    const headlineSuggestions = [
      `How ${orig.replace(/^(the|a|an)\s+/i, '')} Could Transform Regional Outlook`,
      `Major Intelligence Shift: What Stakeholders Need To Know About ${orig}`,
      `Strategic Breakdown: Inside the ${cat} Dynamics Shaping ${region}`
    ];

    // 2. Executive Summary
    const executiveSummary = article.summaryMedium || article.summaryShort || `${article.title}. Verified by Veritas Global Intelligence.`;

    // 3. SEO Metadata
    const cleanSlug = orig
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const seoTitle = `${orig} | Veritas Global News`;
    const metaDescription = `${executiveSummary.slice(0, 155)}... Read full verified intelligence on Veritas Global.`;
    const keywords = [
      ...article.tags,
      article.category,
      article.country,
      article.region,
      'Veritas News',
      'Global Intelligence'
    ].filter(Boolean);

    // 4. Social Media Copy
    const xTwitter = `⚡ JUST IN: ${orig}\n\nKey takeaway: ${executiveSummary.slice(0, 110)}...\n\nRead verified report: https://veritas.news/${cleanSlug} #VeritasGlobal #${cat.replace(/\s+/g, '')}`;
    
    const linkedIn = `📊 STRATEGIC NEWS BRIEF: ${orig}\n\n${executiveSummary}\n\nOur AI news engine evaluates this story with ${article.confidenceScore}% verification confidence.\n\nRead the full intelligence report: https://veritas.news/${cleanSlug}`;

    const facebook = `🌐 ${orig}\n\n${executiveSummary}\n\nStay ahead with verified global news intelligence on Veritas Global.`;

    // 5. WhatsApp Channel Broadcast Message
    const whatsAppBroadcast = {
      channelHeadline: `📢 ${orig}`,
      bodyText: `Key Highlights:\n• ${executiveSummary}\n• Verified by 3+ independent sources\n• Coverage region: ${region} (${article.country || 'International'})`,
      callToAction: `👉 Tap to read full verified article: https://veritas.news/wa/${article.id}`
    };

    return {
      articleId: article.id,
      originalHeadline: orig,
      headlineSuggestions,
      executiveSummary,
      seoMetadata: {
        seoTitle,
        metaDescription,
        keywords,
        slug: cleanSlug
      },
      socialMediaCopy: {
        xTwitter,
        linkedIn,
        facebook
      },
      whatsAppBroadcast
    };
  }
}
