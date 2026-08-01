import { Article, Category, Region } from '../types';

export interface ArticleIntelligenceProfile {
  articleId: string;
  importance_score: number; // 0 - 100
  breaking_probability: number; // 0 - 100
  regional_relevance: number; // 0 - 100
  global_relevance: number; // 0 - 100
  evergreen_score: number; // 0 - 100
  audience_match_score: number; // 0 - 100
  verification_confidence: number; // 0 - 100
  contentType: 
    | 'Breaking News'
    | 'Daily News'
    | 'Analysis'
    | 'Investigation'
    | 'Explainer'
    | 'Research'
    | 'Opinion'
    | 'Interview'
    | 'Guide'
    | 'Historical Context';
  entityExtraction: {
    countries: string[];
    cities: string[];
    organizations: string[];
    people: string[];
    industries: string[];
    technologies: string[];
    events: string[];
  };
  recommendations: {
    homepage: boolean;
    whatsapp: boolean;
    knowledgeLibrary: boolean;
    reasoning: string;
  };
  analyzedAt: string;
}

export class NewsIntelligenceEngine {
  /**
   * Generates a complete AI Intelligence Profile for an article.
   */
  public static analyzeArticle(article: Article): ArticleIntelligenceProfile {
    const titleLower = article.title.toLowerCase();
    const summaryLower = (article.summaryDetailed || article.summaryMedium || article.summaryShort || '').toLowerCase();
    const text = `${titleLower} ${summaryLower} ${article.tags.join(' ')}`.toLowerCase();

    // 1. Calculate Importance Score (0-100)
    let importance = 60;
    if (article.isBreaking) importance += 20;
    if (article.isEditorPick) importance += 10;
    if (article.otherPublishersCount > 3) importance += 10;
    if (text.includes('presid') || text.includes('summit') || text.includes('billion') || text.includes('accord')) importance += 8;
    importance = Math.min(100, Math.max(20, importance));

    // 2. Breaking Probability
    let breakingProb = article.isBreaking ? 95 : 20;
    if (text.includes('breaking') || text.includes('urgent') || text.includes('just in') || text.includes('announces')) {
      breakingProb = Math.min(99, breakingProb + 30);
    }

    // 3. Regional vs Global Relevance
    let regionalRelevance = 70;
    let globalRelevance = 65;
    if (article.region === 'Africa' || article.country === 'Rwanda' || text.includes('kenya') || text.includes('nigeria')) {
      regionalRelevance = 95;
    }
    if (article.region === 'Global' || text.includes('global') || text.includes('un') || text.includes('world bank') || text.includes('climate')) {
      globalRelevance = 90;
    }

    // 4. Evergreen Score
    let evergreen = article.evergreenScore || 40;
    if (text.includes('guide') || text.includes('history') || text.includes('explainer') || text.includes('policy framework') || text.includes('strategy')) {
      evergreen = Math.min(98, evergreen + 35);
    }

    // 5. Verification Confidence
    const verificationConf = Math.min(98, Math.max(50, article.confidenceScore || 85));

    // 6. Audience Match Score
    const audienceMatch = Math.min(98, Math.round((importance * 0.4) + (globalRelevance * 0.3) + (verificationConf * 0.3)));

    // 7. Content Type Classification
    let contentType: ArticleIntelligenceProfile['contentType'] = 'Daily News';
    if (breakingProb > 80) contentType = 'Breaking News';
    else if (text.includes('investigat') || text.includes('expose') || text.includes('audit')) contentType = 'Investigation';
    else if (text.includes('why') || text.includes('how to') || text.includes('explainer') || text.includes('what you need to know')) contentType = 'Explainer';
    else if (text.includes('deep dive') || text.includes('analysis') || text.includes('outlook') || text.includes('strategy')) contentType = 'Analysis';
    else if (text.includes('study') || text.includes('report') || text.includes('research') || text.includes('data')) contentType = 'Research';
    else if (text.includes('opinion') || text.includes('column') || text.includes('editorial')) contentType = 'Opinion';
    else if (text.includes('interview') || text.includes('qa') || text.includes('speaks to')) contentType = 'Interview';
    else if (text.includes('guide') || text.includes('roadmap')) contentType = 'Guide';
    else if (text.includes('history') || text.includes('archival') || text.includes('timeline')) contentType = 'Historical Context';

    // 8. Entity Extraction
    const entityExtraction = this.extractEntities(article);

    // 9. Recommendations
    const homepageRec = importance >= 70 || breakingProb >= 75;
    const whatsappRec = (importance >= 75 && (breakingProb >= 70 || regionalRelevance >= 85));
    const knowledgeLibRec = evergreen >= 65 || contentType === 'Analysis' || contentType === 'Explainer' || contentType === 'Research';

    return {
      articleId: article.id,
      importance_score: importance,
      breaking_probability: breakingProb,
      regional_relevance: regionalRelevance,
      global_relevance: globalRelevance,
      evergreen_score: evergreen,
      audience_match_score: audienceMatch,
      verification_confidence: verificationConf,
      contentType,
      entityExtraction,
      recommendations: {
        homepage: homepageRec,
        whatsapp: whatsappRec,
        knowledgeLibrary: knowledgeLibRec,
        reasoning: `AI Evaluated high impact (${importance}%) with ${contentType} classification.`
      },
      analyzedAt: new Date().toISOString()
    };
  }

  /**
   * Automatic Tag and Entity Extraction Engine
   */
  public static extractEntities(article: Article) {
    const text = `${article.title} ${article.summaryMedium} ${article.tags.join(' ')} ${article.country}`.toLowerCase();

    const countries = new Set<string>();
    const cities = new Set<string>();
    const organizations = new Set<string>();
    const people = new Set<string>();
    const industries = new Set<string>();
    const technologies = new Set<string>();
    const events = new Set<string>();

    if (article.country) countries.add(article.country);
    if (text.includes('rwanda')) countries.add('Rwanda');
    if (text.includes('kenya')) countries.add('Kenya');
    if (text.includes('nigeria')) countries.add('Nigeria');
    if (text.includes('south africa')) countries.add('South Africa');
    if (text.includes('ethiopia')) countries.add('Ethiopia');
    if (text.includes('france')) countries.add('France');
    if (text.includes('united states') || text.includes('us')) countries.add('United States');

    if (text.includes('kigali')) cities.add('Kigali');
    if (text.includes('nairobi')) cities.add('Nairobi');
    if (text.includes('lagos')) cities.add('Lagos');
    if (text.includes('johannesburg')) cities.add('Johannesburg');
    if (text.includes('addis ababa')) cities.add('Addis Ababa');
    if (text.includes('london')) cities.add('London');

    if (text.includes('african union') || text.includes('au')) organizations.add('African Union');
    if (text.includes('east african community') || text.includes('eac')) organizations.add('East African Community');
    if (text.includes('world bank')) organizations.add('World Bank');
    if (text.includes('imf')) organizations.add('IMF');
    if (text.includes('un') || text.includes('united nations')) organizations.add('United Nations');

    if (text.includes('kagame')) people.add('Paul Kagame');
    if (text.includes('ruto')) people.add('William Ruto');
    if (text.includes('ramaphosa')) people.add('Cyril Ramaphosa');

    if (text.includes('fintech') || text.includes('finance')) industries.add('FinTech & Financial Services');
    if (text.includes('energy') || text.includes('renewable') || text.includes('solar')) industries.add('Renewable Energy');
    if (text.includes('agritech') || text.includes('agriculture')) industries.add('Agriculture & AgriTech');
    if (text.includes('telecom') || text.includes('5g')) industries.add('Telecommunications');

    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('llm')) technologies.add('Artificial Intelligence');
    if (text.includes('blockchain') || text.includes('crypto')) technologies.add('Blockchain');
    if (text.includes('solar') || text.includes('grid')) technologies.add('CleanTech');

    if (text.includes('cop') || text.includes('summit')) events.add('Global Summit');
    if (text.includes('forum') || text.includes('elections')) events.add('Governance Event');

    return {
      countries: Array.from(countries),
      cities: Array.from(cities),
      organizations: Array.from(organizations),
      people: Array.from(people),
      industries: Array.from(industries),
      technologies: Array.from(technologies),
      events: Array.from(events)
    };
  }
}
