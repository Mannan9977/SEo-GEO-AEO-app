/**
 * Types & Interfaces for the SEO, AEO & GEO Toolkit
 */

export interface SEOAnalysisResult {
  url: string;
  keyword: string;
  score: number;
  analyzedAt: string;
  elements: {
    title: { value: string; length: number; status: 'good' | 'warning' | 'critical'; suggestion: string };
    metaDescription: { value: string; length: number; status: 'good' | 'warning' | 'critical'; suggestion: string };
    canonical: { value: string; exists: boolean; status: 'good' | 'critical'; suggestion: string };
    robots: { value: string; exists: boolean; status: 'good' | 'warning'; suggestion: string };
    h1ToH6Count: { [key: string]: number };
    structureStatus: 'good' | 'warning' | 'critical';
    imageAlts: { total: number; missing: number; status: 'good' | 'warning'; details: string[] };
    internalLinksCount: number;
    externalLinksCount: number;
    openGraph: { exists: boolean; tags: { [key: string]: string }; status: 'good' | 'critical' };
    twitterCard: { exists: boolean; tags: { [key: string]: string }; status: 'good' | 'warning' };
    speedScore: number;
    mobileScore: number;
  };
  recommendations: Array<{
    id: string;
    impact: 'high' | 'medium' | 'low';
    category: 'SEO' | 'Speed' | 'Structure' | 'Meta';
    title: string;
    description: string;
    fix: string;
  }>;
}

export interface KeywordResult {
  keyword: string;
  searchVolume: number;
  difficulty: number; // 0-100
  cpc: number;
  competition: number; // 0-100
  longTails: string[];
  questions: string[];
  related: string[];
  trends: Array<{ month: string; value: number }>;
}

export interface MetaGeneratorOutput {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}

export interface BrokenLinksResult {
  scannedCount: number;
  brokenCount: number;
  links: Array<{
    url: string;
    type: 'internal' | 'external';
    statusCode: number;
    redirectChain: string[];
    fixSuggestion: string;
  }>;
}

export interface BacklinkResult {
  authorityScore: number;
  referringDomains: number;
  totalBacklinks: number;
  nofollowPercent: number;
  dofollowPercent: number;
  backlinksList: Array<{
    sourceUrl: string;
    anchorText: string;
    type: 'dofollow' | 'nofollow';
    authority: number;
  }>;
}

// AEO structures
export interface AEOResult {
  snippetReadyScore: number; // 0-100
  snippetTypeSuggestions: {
    paragraph: { suggestedMarkdown: string; scoreContribution: number; existsSignal: boolean };
    list: { suggestedMarkdown: string; scoreContribution: number; existsSignal: boolean };
    table: { suggestedMarkdown: string; scoreContribution: number; existsSignal: boolean };
  };
  faqSchemaGenerated: string; // JSON schema-string
  faqQuestions: Array<{ q: string; a: string }>;
  paaQuestions: Array<{ question: string; suggestedAnswer: string; complexity: string }>;
  voiceQueries: Array<{ conversationalQuery: string; optimizedAnswer: string }>;
  readabilityScore: number; // Flesch-Kincaid approximation
  clarityScore: number;
  directnessScore: number;
  helpfulContentScore: number;
  aeoTotalScore: number;
}

// GEO structures
export interface GEOResult {
  geoTotalScore: number;
  visibilityScores: {
    chatGPT: number;
    gemini: number;
    claude: number;
    perplexity: number;
    copilot: number;
  };
  entities: Array<{ name: string; type: 'Person' | 'Brand' | 'Location' | 'Organization' | 'Product'; relevance: number }>;
  knowledgeGraphRelations: Array<{ source: string; target: string; relationship: string }>;
  citationReadiness: {
    score: number;
    statCitationsCount: number;
    authoritySourcesCount: number;
    unbackedClaims: string[];
    signals: { authorCredentials: boolean; referencesList: boolean; concreteStats: boolean };
  };
  chunksAnalysis: {
    semanticSectionsCount: number;
    passageRankingReadyScore: number;
    suggestions: string[];
    chunks: Array<{ heading: string; textPreview: string; optimized: boolean }>;
  };
  simulations: Array<{
    engine: 'ChatGPT' | 'Gemini' | 'Claude' | 'Perplexity';
    willCite: boolean;
    citationPercentage: number;
    simulatedResponse: string;
    authorityGaps: string[];
    missingInfo: string[];
  }>;
  contentEnhancements: {
    optimizedStructureMarkdown: string;
    entityInsertions: string[];
    citationTriggers: string[];
  };
}

export interface AIWriterParams {
  type: 'blog' | 'product_description' | 'landing_page' | 'faq' | 'howto' | 'comparison' | 'listicle';
  topic: string;
  keywords: string[];
  tone: 'professional' | 'casual' | 'witty' | 'authoritative' | 'educational';
  optimizationType: 'SEO' | 'AEO' | 'GEO';
}

export interface AIWriterResult {
  content: string;
  outline: string[];
  seoOptimizedMetas: MetaGeneratorOutput;
}

export interface Project {
  id: string;
  name: string;
  url: string;
  targetKeyword: string;
  createdAt: string;
  seoScore?: number;
  aeoScore?: number;
  geoScore?: number;
}

export interface UserStats {
  searchesUsed: number;
  searchesLimit: number;
  plan: 'Free' | 'Pro' | 'Agency';
  projectsCount: number;
  savedReportsCount: number;
}
