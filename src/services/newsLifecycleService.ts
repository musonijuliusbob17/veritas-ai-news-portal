import { Article, TopicAuthorityHub } from '../types';

/**
 * Calculates the Evergreen Score (0-100), Classification (Evergreen vs Time-Sensitive),
 * Lifecycle Status (fresh, category_only, archived, evergreen), and SEO metadata.
 */

export function calculateEvergreenScore(article: Article): {
  score: number;
  isEvergreen: boolean;
  reason: string;
  status: 'fresh' | 'category_only' | 'archived' | 'evergreen';
} {
  let score = 50; // base score
  const reasons: string[] = [];

  const titleLower = article.title.toLowerCase();
  const summaryLower = (article.summaryDetailed || article.summaryShort).toLowerCase();
  const category = article.category;

  // 1. Content Type & Keywords Analysis
  const evergreenKeywords = [
    'guide', 'how to', 'complete guide', 'explained', 'explainer', 'analysis',
    'investigation', 'deep dive', 'report', 'research', 'history', 'strategy',
    'overview', 'profile', 'blueprint', 'roadmap', 'evolution', 'framework',
    'future of', 'understanding', 'lessons from', 'benchmark', 'policy'
  ];

  const timeSensitiveKeywords = [
    'breaking', 'today', 'live updates', 'announced today', 'yesterday',
    'results', 'score', 'weather', 'cabinet changes', 'press conference',
    'market closes', 'speech', 'statement', 'accident', 'fire', 'match'
  ];

  let matchesEvergreen = 0;
  for (const kw of evergreenKeywords) {
    if (titleLower.includes(kw) || summaryLower.includes(kw)) {
      matchesEvergreen++;
    }
  }

  let matchesTimeSensitive = 0;
  for (const kw of timeSensitiveKeywords) {
    if (titleLower.includes(kw) || summaryLower.includes(kw)) {
      matchesTimeSensitive++;
    }
  }

  score += matchesEvergreen * 12;
  score -= matchesTimeSensitive * 15;

  if (matchesEvergreen > 0) {
    reasons.push('Contains analytical / educational framing');
  }

  // 2. Category inherent lifespan
  if (['Technology', 'Artificial Intelligence', 'Science', 'Health', 'Climate', 'Education'].includes(category)) {
    score += 15;
    reasons.push(`High educational lifespan in ${category}`);
  } else if (['Sports', 'Local', 'Politics'].includes(category)) {
    score -= 10;
  }

  // 3. Article Depth & Reading Time
  if (article.readingTimeMinutes >= 5 || summaryLower.length > 500) {
    score += 15;
    reasons.push('In-depth reading length (>5 mins)');
  }

  // 4. Coverage List / Multi-Publisher Cross References
  if (article.coverageList && article.coverageList.length >= 3) {
    score += 10;
    reasons.push('Multi-publisher reference authority');
  }

  // 5. Engagement Metrics (Bookmarks & Shares)
  if (article.bookmarksCount > 50 || article.shares > 200) {
    score += 10;
    reasons.push('High user bookmark retention');
  }

  // Clamp score 0 - 100
  score = Math.max(5, Math.min(98, score));

  // Threshold: Evergreen if score >= 65 or explicitly marked
  const isEvergreen = article.isEvergreen || score >= 65;
  const primaryReason = reasons.length > 0 ? reasons.join(' • ') : (isEvergreen ? 'Educational / Research Value' : 'Time-Sensitive Wire Report');

  // Determine Lifecycle Status based on Age & Evergreen
  const pubDate = new Date(article.publishedAt).getTime();
  const now = Date.now();
  const ageHours = Math.max(0, (now - pubDate) / (1000 * 60 * 60));
  const ageDays = ageHours / 24;

  let status: 'fresh' | 'category_only' | 'archived' | 'evergreen' = 'fresh';

  if (isEvergreen) {
    status = 'evergreen'; // Permanently active, featured in Knowledge Library
  } else if (ageHours <= 48) {
    status = 'fresh'; // Appears on Homepage
  } else if (ageDays <= 7) {
    status = 'category_only'; // Available in Category
  } else {
    status = 'archived'; // Moved to Archive section
  }

  return {
    score,
    isEvergreen,
    reason: primaryReason,
    status
  };
}

/**
 * Generate Auto SEO Tags & Keywords
 */
export function generateAutoTagsAndKeywords(article: Article): { tags: string[]; keywords: string[]; slug: string } {
  const existingTags = article.tags || [];
  const generatedTags = new Set<string>(existingTags);

  // Extract location/country
  if (article.country) generatedTags.add(article.country);
  if (article.region) generatedTags.add(article.region);
  if (article.category) generatedTags.add(article.category);

  // Key topic detection
  const text = `${article.title} ${article.summaryShort}`.toLowerCase();
  if (text.includes('ai') || text.includes('intelligence')) generatedTags.add('Artificial Intelligence');
  if (text.includes('rwanda')) generatedTags.add('Rwanda AI');
  if (text.includes('kigali')) generatedTags.add('Kigali Tech');
  if (text.includes('africa')) generatedTags.add('African Innovation');
  if (text.includes('tech') || text.includes('digital')) generatedTags.add('Digital Transformation');
  if (text.includes('climate') || text.includes('energy')) generatedTags.add('Green Transition');
  if (text.includes('health') || text.includes('medical')) generatedTags.add('Global Health');

  const tagsArray = Array.from(generatedTags);
  const keywords = [...tagsArray, article.category, article.country, article.mainPublisher.name].filter(Boolean);

  const slug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return {
    tags: tagsArray,
    keywords,
    slug
  };
}

/**
 * Enriches raw Article with Evergreen Intelligence & SEO
 */
export function enrichArticleWithLifecycleAndSeo(article: Article): Article {
  const evalResult = calculateEvergreenScore(article);
  const { tags, keywords, slug } = generateAutoTagsAndKeywords(article);

  const isEvergreen = article.isEvergreen !== undefined ? article.isEvergreen : evalResult.isEvergreen;
  const evergreenScore = article.evergreenScore || evalResult.score;
  const status = article.articleStatus || evalResult.status;

  const seoTitle = `${article.title} | Veritas Global AI News`;
  const seoDescription = article.summaryShort.substring(0, 155) + '...';
  const canonicalUrl = `https://veritasglobal.ai/${isEvergreen ? 'knowledge' : 'news'}/${slug}`;

  // Schema.org Structured Data
  const schemaType = isEvergreen ? 'Article' : 'NewsArticle';
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    'headline': article.title,
    'description': article.summaryShort,
    'image': [article.featuredImage],
    'datePublished': article.publishedAt,
    'dateModified': article.updatedAt || article.publishedAt,
    'author': {
      '@type': 'Person',
      'name': article.author || article.mainPublisher.name
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Rebero Incoparated Tech ltd / Veritas Global',
      'logo': {
        '@type': 'ImageObject',
        'url': article.mainPublisher.logo
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    'keywords': keywords.join(', ')
  };

  const trendingScore = (article.views * 0.4) + (article.shares * 0.8) + (article.bookmarksCount * 1.5) + (article.confidenceScore * 0.5);

  return {
    ...article,
    tags,
    isEvergreen,
    evergreenScore,
    evergreenReason: article.evergreenReason || evalResult.reason,
    articleStatus: status,
    trendingScore,
    lastRefreshedAt: article.lastRefreshedAt || article.updatedAt || article.publishedAt,
    refreshSuggestions: isEvergreen ? [
      'Verify 2026 economic metrics and stat citations',
      'Check for newly published government reports',
      'Update related knowledge graph links'
    ] : [],
    knowledgeTopics: [article.category, article.country, article.region].filter(Boolean),
    seoMetadata: {
      seoTitle,
      seoDescription,
      keywords,
      canonicalUrl,
      slug,
      schemaType,
      structuredData
    }
  };
}

/**
 * Filter homepage fresh news (<48 hours or trending breaking)
 */
export function getHomepageFreshArticles(articles: Article[]): Article[] {
  return articles.filter(a => {
    const enriched = enrichArticleWithLifecycleAndSeo(a);
    return enriched.articleStatus === 'fresh' || enriched.isBreaking || enriched.articleStatus === 'evergreen';
  }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/**
 * Get Knowledge Library Evergreen Articles (Score >= 65 or Evergreen flag)
 */
export function getKnowledgeLibraryArticles(articles: Article[]): Article[] {
  return articles
    .map(enrichArticleWithLifecycleAndSeo)
    .filter(a => a.isEvergreen || (a.evergreenScore && a.evergreenScore >= 65))
    .sort((a, b) => (b.evergreenScore || 0) - (a.evergreenScore || 0));
}

/**
 * Get Archived Articles (>7 days and non-evergreen)
 */
export function getArchivedArticles(articles: Article[]): Article[] {
  return articles
    .map(enrichArticleWithLifecycleAndSeo)
    .filter(a => a.articleStatus === 'archived')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/**
 * Generate Topic Authority Hubs (e.g. East African Technology, AI Innovation, Climate Transition)
 */
export function getTopicAuthorityHubs(articles: Article[]): TopicAuthorityHub[] {
  const enriched = articles.map(enrichArticleWithLifecycleAndSeo);

  return [
    {
      id: 'hub_ea_tech',
      title: 'East African Technology & AI Innovation Hub',
      description: 'Comprehensive research, policy roadmaps, and startup ecosystem tracking across Rwanda, Kenya, and East Africa.',
      category: 'Technology',
      tags: ['Rwanda AI', 'East Africa Tech', 'Kigali Innovation Hub', 'Digital Transformation'],
      keyPeople: ['Paula Ingabire (Minister of ICT Rwanda)', 'Strive Masiyiwa', 'Dr. James Mwangi'],
      organizations: ['Rwanda Center for AI', 'EAC Secretariat', 'Smart Africa', 'Carnegie Mellon University Africa'],
      articleIds: enriched.filter(a => a.country === 'Rwanda' || a.tags.some(t => t.toLowerCase().includes('rwanda') || t.toLowerCase().includes('ai'))).map(a => a.id),
      lastUpdated: new Date().toISOString(),
      evergreenArticleCount: enriched.filter(a => a.isEvergreen && a.category === 'Technology').length || 4,
      authorityScore: 98
    },
    {
      id: 'hub_global_ai',
      title: 'Global AI Governance & Frontier Models',
      description: 'Deep analytical intelligence on AI regulations, safety benchmarks, silicon geopolitics, and enterprise AI deployment.',
      category: 'Artificial Intelligence',
      tags: ['AI Governance', 'Frontier Models', 'Silicon Geopolitics', 'AI Safety'],
      keyPeople: ['Sam Altman', 'Demis Hassabis', 'Dario Amodei', 'Margrethe Vestager'],
      organizations: ['Google DeepMind', 'OpenAI', 'Anthropic', 'EU AI Office', 'US AI Safety Institute'],
      articleIds: enriched.filter(a => a.category === 'Artificial Intelligence' || a.tags.includes('Artificial Intelligence')).map(a => a.id),
      lastUpdated: new Date().toISOString(),
      evergreenArticleCount: enriched.filter(a => a.isEvergreen && a.category === 'Artificial Intelligence').length || 5,
      authorityScore: 96
    },
    {
      id: 'hub_climate_energy',
      title: 'Global Climate & Renewable Energy Transition',
      description: 'Long-term research on clean energy grids, carbon credit marketplaces, solar infrastructure, and climate policy.',
      category: 'Climate',
      tags: ['Renewable Energy', 'Clean Tech', 'Carbon Credits', 'Sub-Saharan Climate'],
      keyPeople: ['Dr. Akinwumi Adesina', 'Ursula von der Leyen'],
      organizations: ['African Development Bank', 'IRENA', 'UN Climate Executive Secretariat'],
      articleIds: enriched.filter(a => a.category === 'Climate').map(a => a.id),
      lastUpdated: new Date().toISOString(),
      evergreenArticleCount: enriched.filter(a => a.isEvergreen && a.category === 'Climate').length || 3,
      authorityScore: 94
    },
    {
      id: 'hub_african_finance',
      title: 'African FinTech & Trade Integration (AfCFTA)',
      description: 'Cross-border digital banking, PAPSS payment rails, capital markets, and continental intra-African trade expansion.',
      category: 'Finance',
      tags: ['AfCFTA', 'FinTech', 'PAPSS', 'Sub-Saharan Banking'],
      keyPeople: ['Wamkele Mene (AfCFTA Secretary General)', 'Benedict Oramah'],
      organizations: ['Afreximbank', 'Pan-African Payment System', 'National Bank of Rwanda'],
      articleIds: enriched.filter(a => a.category === 'Finance' || a.category === 'Business').map(a => a.id),
      lastUpdated: new Date().toISOString(),
      evergreenArticleCount: enriched.filter(a => a.isEvergreen && (a.category === 'Finance' || a.category === 'Business')).length || 4,
      authorityScore: 95
    }
  ];
}

/**
 * Generate XML Sitemap for SEO Crawlers
 */
export function generateXmlSitemap(articles: Article[]): string {
  const enriched = articles.map(enrichArticleWithLifecycleAndSeo);

  const urlsXml = enriched.map(a => `
  <url>
    <loc>${a.seoMetadata?.canonicalUrl || `https://veritasglobal.ai/news/${a.id}`}</loc>
    <lastmod>${new Date(a.updatedAt || a.publishedAt).toISOString()}</lastmod>
    <changefreq>${a.isEvergreen ? 'monthly' : 'daily'}</changefreq>
    <priority>${a.isEvergreen ? '0.9' : '0.7'}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>https://veritasglobal.ai/</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://veritasglobal.ai/knowledge-library</loc>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
${urlsXml}
</urlset>`;
}

/**
 * AI Editorial Assistant analysis for Admin
 */
export function getAiEditorialRecommendation(article: Article): {
  evergreenScore: number;
  recommendationText: string;
  actions: string[];
  suggestedTags: string[];
} {
  const enriched = enrichArticleWithLifecycleAndSeo(article);
  const score = enriched.evergreenScore || 50;

  const actions: string[] = [];
  if (score >= 65) {
    actions.push('✓ Keep permanently in Knowledge Library');
    actions.push('✓ Add to Topic Authority Page');
    actions.push('✓ Scheduled for automated 6-month statistical check');
  } else {
    actions.push('✓ Retain on homepage for 48 hours');
    actions.push('✓ Move to category archive after 7 days');
  }

  return {
    evergreenScore: score,
    recommendationText: score >= 65
      ? `High Evergreen Value (${score}/100): Article provides foundational educational value. Do NOT archive after 7 days.`
      : `Time-Sensitive Content (${score}/100): High breaking relevance. Standard 7-day archive lifecycle applies.`,
    actions,
    suggestedTags: enriched.tags
  };
}

export interface LifecycleEvaluationReport {
  evaluatedCount: number;
  freshCount: number;
  categoryOnlyCount: number;
  archivedCount: number;
  evergreenCount: number;
  transitionedArticles: {
    id: string;
    title: string;
    previousStatus: string;
    newStatus: string;
    reason: string;
  }[];
  cleanedUpCount: number;
  timestamp: string;
}

/**
 * ArticleLifecycleManager Utility:
 * Periodically evaluates `publishedAt` to transition articles between 'fresh', 'category_only', and 'archived',
 * preserving 'evergreen' content in Knowledge Library, and executing automated cleanup jobs for non-evergreen content > 7 days.
 */
export class ArticleLifecycleManager {
  /**
   * Evaluates all articles based on `publishedAt` age and evergreen classification.
   */
  static evaluateArticleLifecycle(articles: Article[]): {
    updatedArticles: Article[];
    report: LifecycleEvaluationReport;
  } {
    const now = Date.now();
    const transitions: LifecycleEvaluationReport['transitionedArticles'] = [];
    let cleanedUpCount = 0;

    let freshCount = 0;
    let categoryOnlyCount = 0;
    let archivedCount = 0;
    let evergreenCount = 0;

    const updatedArticles = articles.map(rawArticle => {
      const article = enrichArticleWithLifecycleAndSeo(rawArticle);
      const pubTime = new Date(article.publishedAt).getTime();
      const ageHours = Math.max(0, (now - pubTime) / (1000 * 60 * 60));
      const ageDays = ageHours / 24;

      const previousStatus = article.articleStatus || 'fresh';
      let newStatus: 'fresh' | 'category_only' | 'archived' | 'evergreen';
      let reason = '';

      if (article.isEvergreen || (article.evergreenScore && article.evergreenScore >= 65)) {
        newStatus = 'evergreen';
        reason = `Retained permanently in Knowledge Library (Evergreen score: ${article.evergreenScore || 90}/100)`;
        evergreenCount++;
      } else if (ageHours <= 48) {
        newStatus = 'fresh';
        reason = `Published within last 48h (${Math.round(ageHours)}h old) - Homepage Active`;
        freshCount++;
      } else if (ageDays <= 7) {
        newStatus = 'category_only';
        reason = `Older than 48h but under 7 days (${Math.round(ageDays)} days old) - Category Active`;
        categoryOnlyCount++;
      } else {
        newStatus = 'archived';
        reason = `Non-evergreen story older than 7 days (${Math.round(ageDays)} days old) - Automated Archive Cleaned`;
        archivedCount++;
        cleanedUpCount++;
      }

      if (previousStatus !== newStatus) {
        transitions.push({
          id: article.id,
          title: article.title,
          previousStatus,
          newStatus,
          reason
        });
      }

      return {
        ...article,
        articleStatus: newStatus
      };
    });

    const report: LifecycleEvaluationReport = {
      evaluatedCount: articles.length,
      freshCount,
      categoryOnlyCount,
      archivedCount,
      evergreenCount,
      transitionedArticles: transitions,
      cleanedUpCount,
      timestamp: new Date().toISOString()
    };

    return { updatedArticles, report };
  }

  /**
   * Initializes periodic background cleanup & status transition runner.
   */
  static startAutomatedCronJob(
    getArticles: () => Article[],
    onUpdateArticles: (updated: Article[], report: LifecycleEvaluationReport) => void,
    intervalMs: number = 3600000 // default 1 hour
  ): () => void {
    const runJob = () => {
      const current = getArticles();
      const { updatedArticles, report } = ArticleLifecycleManager.evaluateArticleLifecycle(current);
      onUpdateArticles(updatedArticles, report);
    };

    runJob();
    const timer = setInterval(runJob, intervalMs);
    return () => clearInterval(timer);
  }
}

