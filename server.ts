import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// Memory db for tracking user state, projects, saved reports, visual rules
const userStats = {
  searchesUsed: 14,
  searchesLimit: 100, // or unlimited depending on plans
  plan: 'Free',
  projectsCount: 1,
  savedReportsCount: 2,
};

const savedProjects = [
  {
    id: "proj-1",
    name: "Pet Treats E-commerce",
    url: "https://organicpettreats.com",
    targetKeyword: "healthy dog treats organic",
    createdAt: "2026-05-15T10:00:00Z",
    seoScore: 78,
    aeoScore: 64,
    geoScore: 55,
  }
];

const savedReports = [
  {
    id: "rep-1",
    projectId: "proj-1",
    url: "https://organicpettreats.com",
    keyword: "healthy dog treats organic",
    score: 78,
    type: "SEO",
    analyzedAt: "2026-05-28T14:30:00Z"
  },
  {
    id: "rep-2",
    projectId: "proj-1",
    url: "https://organicpettreats.com",
    keyword: "healthy dog treats organic",
    score: 64,
    type: "AEO",
    analyzedAt: "2026-05-28T14:35:00Z"
  }
];

// Helper fallback generators to guarantee functional UI even when API key is unconfigured
function generateMockSEOAnalysis(url: string, keyword: string) {
  const score = Math.floor(65 + Math.random() * 25);
  const domain = url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
  return {
    url,
    keyword,
    score,
    analyzedAt: new Date().toISOString(),
    elements: {
      title: {
        value: `Best Selection of organic snacks for puppy - Shop Now`,
        length: 53,
        status: score > 80 ? 'good' : 'warning',
        suggestion: 'Title is active, but adding core target keyword at the left-most space improves relevance.'
      },
      metaDescription: {
        value: `Buy delicious, organic products. We have natural rewards, beef jerky, and raw biscuits for dogs and cats. Free shipping available today!`,
        length: 138,
        status: 'good',
        suggestion: 'Nice size and clear call to action. Keep under 160 characters.'
      },
      canonical: {
        value: `${url}`,
        exists: true,
        status: 'good',
        suggestion: 'Canonical header matches index configuration.'
      },
      robots: {
        value: `index, follow, max-image-preview:large`,
        exists: true,
        status: 'good',
        suggestion: 'Robots.txt elements are formatted properly.'
      },
      h1ToH6Count: { H1: 1, H2: 4, H3: 12, H4: 0, H5: 0, H6: 0 },
      structureStatus: 'good',
      imageAlts: {
        total: 15,
        missing: 4,
        status: 'warning',
        details: ['/images/banner-home.jpg - Missing alternative attribute', '/images/product-logo-poodle.png - Missing alternative attribute']
      },
      internalLinksCount: 22,
      externalLinksCount: 5,
      openGraph: {
        exists: true,
        tags: { 'og:title': 'Organic snack rewards for pets', 'og:type': 'website', 'og:image': 'https://' + domain + '/og.jpg' },
        status: 'good'
      },
      twitterCard: {
        exists: true,
        tags: { 'twitter:card': 'summary_large_image', 'twitter:title': 'Organic snack rewards for pets' },
        status: 'good'
      },
      speedScore: Math.floor(75 + Math.random() * 20),
      mobileScore: Math.floor(80 + Math.random() * 15),
    },
    recommendations: [
      {
        id: "rec-1",
        impact: "high",
        category: "Structure",
        title: "Optimize image alt attributes",
        description: "Found 4 images missing alt descriptive titles which hurts search crawlers image indexing.",
        fix: "Locate images in layout and add alt='organic treats ingredients' descriptive markup to img tags."
      },
      {
        id: "rec-2",
        impact: "medium",
        category: "SEO",
        title: "Incorporate keyword into H1 headings",
        description: "Your target keyword '" + keyword + "' is not present in your primary H1 tag.",
        fix: "Adjust H1 tag from 'Pure rewards from nature' to include 'Organic Healthy Treats: Pure rewards from nature'."
      },
      {
        id: "rec-3",
        impact: "low",
        category: "Speed",
        title: "De-prioritize third-party render scripts",
        description: "Render blocking analytics and chat widgets slow initial visual paint by 0.6 seconds.",
        fix: "Apply defer or async keywords to the scripts loaded near the end of body tag."
      }
    ]
  };
}

function generateMockKeywordResearch(keyword: string) {
  const hash = keyword.length * 7;
  const vol = 1200 + (hash % 10) * 850;
  const diff = 25 + (hash % 50);
  const cost = 0.5 + (hash % 20) * 0.18;
  return {
    keyword,
    searchVolume: vol,
    difficulty: diff,
    cpc: parseFloat(cost.toFixed(2)),
    competition: Math.floor(diff * 0.9),
    longTails: [
      `best ${keyword} on sale`,
      `why we recommend buy ${keyword}`,
      `affordable ${keyword} review guides`,
      `how to identify original ${keyword}`
    ],
    questions: [
      `which has cheaper ${keyword}?`,
      `is it healthy to use ${keyword} daily?`,
      `how much does custom ${keyword} usually cost?`
    ],
    related: [
      `${keyword} comparison parameters`,
      `${keyword} alternative materials`,
      `professional premium ${keyword}`
    ],
    trends: [
      { month: "Jan", value: 45 },
      { month: "Feb", value: 50 },
      { month: "Mar", value: 65 },
      { month: "Apr", value: 85 },
      { month: "May", value: 95 },
      { month: "Jun", value: 100 }
    ]
  };
}


// --- API routes ---

// Projects API
app.get("/api/user/info", (req, res) => {
  res.json({ stats: userStats, projects: savedProjects, reports: savedReports });
});

app.post("/api/user/plan", (req, res) => {
  const { plan } = req.body;
  if (['Free', 'Pro', 'Agency'].includes(plan)) {
    userStats.plan = plan;
    userStats.searchesLimit = plan === 'Free' ? 100 : plan === 'Pro' ? 2500 : 99999;
  }
  res.json({ success: true, stats: userStats });
});

app.post("/api/projects", (req, res) => {
  const { name, url, targetKeyword } = req.body;
  const newProject = {
    id: "proj-" + (savedProjects.length + 1),
    name: name || "Un-named site",
    url: url || "https://mysite.com",
    targetKeyword: targetKeyword || "seo strategy",
    createdAt: new Date().toISOString(),
    seoScore: 0,
    aeoScore: 0,
    geoScore: 0
  };
  savedProjects.push(newProject);
  userStats.projectsCount = savedProjects.length;
  res.json({ success: true, project: newProject });
});

// 1. SEO Analyzer
app.post("/api/seo/analyze", async (req, res) => {
  const { url, keyword } = req.body;
  if (!url || !keyword) {
    return res.status(400).json({ error: "Please enter URL and target Keyword" });
  }

  userStats.searchesUsed += 1;
  const ai = getGeminiClient();

  if (!ai) {
    // Return high-quality local analysis mock
    const mock = generateMockSEOAnalysis(url, keyword);
    return res.json({ provider: 'local', mock });
  }

  try {
    const prompt = `Perform a high-fidelity SEO, schema, content readability, and metadata analysis of this simulated webpage:
URL: "${url}"
Keyword: "${keyword}"

You must respond with a JSON object ONLY matching this schema precisely:
{
  "url": string,
  "keyword": string,
  "score": number (0 to 100),
  "analyzedAt": string (ISO date),
  "elements": {
    "title": { "value": string, "length": number, "status": "good" | "warning" | "critical", "suggestion": string },
    "metaDescription": { "value": string, "length": number, "status": "good" | "warning" | "critical", "suggestion": string },
    "canonical": { "value": string, "exists": boolean, "status": "good" | "critical", "suggestion": string },
    "robots": { "value": string, "exists": boolean, "status": "good" | "warning", "suggestion": string },
    "h1ToH6Count": { "H1": number, "H2": number, "H3": number, "H4": number, "H5": number, "H6": number },
    "structureStatus": "good" | "warning" | "critical",
    "imageAlts": { "total": number, "missing": number, "status": "good" | "warning", "details": string[] },
    "internalLinksCount": number,
    "externalLinksCount": number,
    "openGraph": { "exists": boolean, "tags": { [key: string]: string }, "status": "good" | "critical" },
    "twitterCard": { "exists": boolean, "tags": { [key: string]: string }, "status": "good" | "warning" },
    "speedScore": number,
    "mobileScore": number
  },
  "recommendations": [
    {
      "id": string,
      "impact": "high" | "medium" | "low",
      "category": "SEO" | "Speed" | "Structure" | "Meta",
      "title": string,
      "description": string,
      "fix": string
    }
  ]
}

Ensure the audit is highly realistic, realistic speeds (load speed 70-98), actual problems matching normal web standards for ${url} and search targeting for ${keyword}. Produce valid JSON only. Keep descriptions constructive.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const val = JSON.parse(response.text || "{}");
    // Cache inside memories
    const foundProj = savedProjects.find(p => p.url === url);
    if (foundProj) {
      foundProj.seoScore = val.score;
    }
    // Save report
    savedReports.push({
      id: "rep-seo-" + Date.now(),
      projectId: foundProj?.id || "proj-1",
      url,
      keyword,
      score: val.score,
      type: "SEO",
      analyzedAt: new Date().toISOString()
    });
    userStats.savedReportsCount = savedReports.length;

    res.json({ provider: 'gemini', mock: val });
  } catch (err: any) {
    console.error("Gemini SEO Analyzer Error: ", err);
    res.json({ provider: 'local_fallback', error: err.message, mock: generateMockSEOAnalysis(url, keyword) });
  }
});

// 2. Keyword Research
app.post("/api/keyword/research", async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) {
    return res.status(400).json({ error: "Please enter a seed keyword" });
  }

  userStats.searchesUsed += 1;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({ provider: 'local', mock: generateMockKeywordResearch(keyword) });
  }

  try {
    const prompt = `Research keyword search volume, difficulty, CPC cost, related listings, PAA questions and long tail combinations based on keyword: "${keyword}".
Generate a strictly formatted JSON response mapping the following layout exactly:
{
  "keyword": string,
  "searchVolume": number (indicative monthly volume e.g. 1500 to 80000),
  "difficulty": number (difficulty score between 0 and 100),
  "cpc": number (CPC cost in USD like 1.45),
  "competition": number (percentage between 0 and 100),
  "longTails": string[],
  "questions": string[],
  "related": string[],
  "trends": [
    { "month": "Jan", "value": number },
    { "month": "Feb", "value": number },
    { "month": "Mar", "value": number },
    { "month": "Apr", "value": number },
    { "month": "May", "value": number },
    { "month": "Jun", "value": number }
  ]
}
Make difficulty and metrics relevant to physical markets. Return JSON with no markdown wrapping details.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ provider: 'gemini', mock: parsed });
  } catch (err: any) {
    console.error("Gemini Keyword Research Error: ", err);
    res.json({ provider: 'local_fallback', error: err.message, mock: generateMockKeywordResearch(keyword) });
  }
});

// 3. AI Meta Generator
app.post("/api/meta/generate", async (req, res) => {
  const { keyword, tone, description } = req.body;
  const ai = getGeminiClient();

  const mockData = {
    title: `Ultimate ${keyword || "Product"} Guide | Top Quality in 2026`,
    description: `Shop the finest ${keyword || "products"} selected carefully by our experts. ${description || "Read more today to save on premium deals with fast global shipping!"}`,
    ogTitle: `Best selection of premium ${keyword || "Item"}`,
    ogDescription: `Check out our best-selling ${keyword || "solution"}. Free setup options with friendly expert consultations.`,
    twitterTitle: `${keyword || "Resource"} - Essential Selection Guide`,
    twitterDescription: `Check out our best-selling ${keyword || "solution"}. Free setup options with friendly expert consultations.`
  };

  if (!ai) {
    return res.json({ provider: 'local', mock: mockData });
  }

  try {
    const prompt = `Create optimized SEO Title, Meta Description, openGraph tags, and Twitter display card headers targeted for keyword "${keyword}" with tone "${tone || 'professional'}". Supplemental summary of user: "${description || 'None provided'}".
Ensure title remains strict under 60 chars, description stays under 155 chars. Return structured JSON matching:
{
  "title": string,
  "description": string,
  "ogTitle": string,
  "ogDescription": string,
  "twitterTitle": string,
  "twitterDescription": string
}`;
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    res.json({ provider: 'gemini', mock: JSON.parse(result.text || "{}") });
  } catch (err: any) {
    res.json({ provider: 'local_fallback', error: err.message, mock: mockData });
  }
});

// 4. Broken Link Analyzer
app.post("/api/links/checker", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Missing Target URL" });
  }
  // Simulate elegant broken link sweep
  const domain = url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
  const links = [
    { url: `${url}/about-us`, type: 'internal', statusCode: 200, redirectChain: [], fixSuggestion: "Healthy link" },
    { url: `${url}/contact-support`, type: 'internal', statusCode: 200, redirectChain: [], fixSuggestion: "Healthy link" },
    { url: `${url}/promotions-archive-old`, type: 'internal', statusCode: 301, redirectChain: [`${url}/promotions-archive-old`, `${url}/deals`], fixSuggestion: "Permanent redirect detected. Update anchors to /deals directly." },
    { url: `${url}/pricing-plans-v2`, type: 'internal', statusCode: 404, redirectChain: [], fixSuggestion: "Broken. Check if file was renamed or verify Routing links in App directory." },
    { url: `https://partner-link-inactive.com/partner`, type: 'external', statusCode: 502, redirectChain: [], fixSuggestion: "Bad gateway on external partner list. Confirm if partner domain is fully offline." },
  ] as any;

  res.json({
    scannedCount: 28,
    brokenCount: 2,
    links
  });
});

// 5. Backlink Analyzer
app.post("/api/backlinks/analyze", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Missing Target URL" });
  }
  // Simulate backlinks data
  res.json({
    authorityScore: 68,
    referringDomains: 412,
    totalBacklinks: 3250,
    nofollowPercent: 32,
    dofollowPercent: 68,
    backlinksList: [
      { sourceUrl: "https://techcrunch.com/features/new-growth", anchorText: "organic snack options", type: "dofollow", authority: 89 },
      { sourceUrl: "https://medium.com/healthy-paws/what-do-dogs-love", anchorText: "treat guide", type: "nofollow", authority: 75 },
      { sourceUrl: "https://wikipedia.org/wiki/Dog_biscuit", anchorText: "healthy food treats for dogs", type: "nofollow", authority: 95 },
      { sourceUrl: "https://expertblogger.org/best-organic-treats-organic", anchorText: "click here to read", type: "dofollow", authority: 42 },
      { sourceUrl: "https://petcarereviews.net/pet-rewards-review", anchorText: "healthy dog treats organic", type: "dofollow", authority: 54 },
    ]
  });
});

// 6. Schema Markup, Sitemap, and Robots.txt fall strictly in React State Builders as they require dynamic copyable interactive preview fields
// We will build visual generators on the frontend client with high UI precision.

// 7. AEO Optimizer
app.post("/api/aeo/analyze", async (req, res) => {
  const { content, focusKeyword } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Provide content structure to audit AEO parameters" });
  }

  const keyword = focusKeyword || "seo optimization";
  const mockAEO = {
    snippetReadyScore: 72,
    snippetTypeSuggestions: {
      paragraph: {
        suggestedMarkdown: `**What are ${keyword}?**\n${keyword} refers to targeted actions designed to satisfy direct, factual answers required by Generative Voice Assistants and search snippet views based on clear definitions.`,
        scoreContribution: 15,
        existsSignal: true
      },
      list: {
        suggestedMarkdown: `To optimize content for ${keyword}, follow these core steps:\n1. Answer conversational prompts immediately\n2. Format statistics clearly\n3. Mark structured FAQ schema variables`,
        scoreContribution: 20,
        existsSignal: false
      },
      table: {
        suggestedMarkdown: `| Metric | Target Goal |\n| --- | --- |\n| Readability | Flesch index above 70 |\n| Response Directness | Paragraphs under 45 words |`,
        scoreContribution: Math.round(15),
        existsSignal: false
      }
    },
    faqSchemaGenerated: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"FAQPage\",\n  \"mainEntity\": [\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How to get featured on Snippets?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Format immediate text definitions in tables and numbered lists directly targeting the FAQ query.\"\n      }\n    }\n  ]\n}",
    faqQuestions: [
      { q: `What is the chief function of ${keyword}?`, a: `The main goal is answering user natural language intents directly, allowing smart systems like Alexa or Claude to parse content seamlessly.` },
      { q: `How do search snippets impact CTR?`, a: `Being highlighted on zero-click answers boosts immediate authority and redirects target audience traffic.` }
    ],
    paaQuestions: [
      { question: `Does ${keyword} improve general organic rank?`, suggestedAnswer: "Yes, search engines index highly readable direct fragments first, lifting all structural organic pages.", complexity: "Medium" },
      { question: `Should answers be short and precise?`, suggestedAnswer: "Absolutely. Snippet filters typically crawl text spans of exactly 40-50 words containing high trust details.", complexity: "High" }
    ],
    voiceQueries: [
      { conversationalQuery: `Hey Siri, how do I setup my ${keyword} checklist?`, optimizedAnswer: `To setup your ${keyword} checklist, create direct FAQ headers, place statistical summaries in readable blocks, and use simple Flesch-Kincaid phrasing.` }
    ],
    readabilityScore: 68,
    clarityScore: 75,
    directnessScore: 62,
    helpfulContentScore: 80,
    aeoTotalScore: 71
  };

  userStats.searchesUsed += 1;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({ provider: 'local', mock: mockAEO });
  }

  try {
    const prompt = `Analyze this writeup for Answer Engine Optimization (AEO targeting bots processing Siri, Alexa, and Google Assistant search prompts) and calculate featured snippet potential.
Focus Keyword: "${keyword}"
Content:
"""
${content}
"""

Analyze and return JSON matching exactly this layout:
{
  "snippetReadyScore": number (0 to 100),
  "snippetTypeSuggestions": {
    "paragraph": { "suggestedMarkdown": string, "scoreContribution": number, "existsSignal": boolean },
    "list": { "suggestedMarkdown": string, "scoreContribution": number, "existsSignal": boolean },
    "table": { "suggestedMarkdown": string, "scoreContribution": number, "existsSignal": boolean }
  },
  "faqSchemaGenerated": string (escaped json schema text),
  "faqQuestions": [{ "q": string, "a": string }],
  "paaQuestions": [{ "question": string, "suggestedAnswer": string, "complexity": "Low" | "Medium" | "High" }],
  "voiceQueries": [{ "conversationalQuery": string, "optimizedAnswer": string }],
  "readabilityScore": number,
  "clarityScore": number,
  "directnessScore": number,
  "helpfulContentScore": number,
  "aeoTotalScore": number
}
Ensure the evaluation is strict, constructive and returns ONLY the JSON text structure.`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const val = JSON.parse(result.text || "{}");
    // Cache inside memories
    const foundProj = savedProjects[0]; // cache on first for feedback
    if (foundProj) {
      foundProj.aeoScore = val.aeoTotalScore;
    }
    res.json({ provider: 'gemini', mock: val });
  } catch (err: any) {
    console.error("Gemini AEO Analyzer Error: ", err);
    res.json({ provider: 'local_fallback', error: err.message, mock: mockAEO });
  }
});

// 8. GEO Optimizer
app.post("/api/geo/analyze", async (req, res) => {
  const { content, targetAudience } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Missing material content to verify Generative Engine Optimization stats." });
  }

  const mockGEO = {
    geoTotalScore: 58,
    visibilityScores: {
      chatGPT: 62,
      gemini: 55,
      claude: 60,
      perplexity: 50,
      copilot: 65
    },
    entities: [
      { name: "Search Optimizer", type: "Product", relevance: 90 },
      { name: "Knowledge Schema", type: "Organization", relevance: 70 },
      { name: "Semantic Engines", type: "Brand", relevance: 85 }
    ],
    knowledgeGraphRelations: [
      { source: "Search Optimizer", target: "Semantic Engines", relationship: "implements" },
      { source: "Semantic Engines", target: "Knowledge Schema", relationship: "parses" }
    ],
    citationReadiness: {
      score: 55,
      statCitationsCount: 1,
      authoritySourcesCount: 0,
      unbackedClaims: [
        "Claims high CTR growth without citing peer audit indices",
        "Assumes bots read custom meta headings with no standards alignment"
      ],
      signals: { authorCredentials: false, referencesList: true, concreteStats: false }
    },
    chunksAnalysis: {
      semanticSectionsCount: 3,
      passageRankingReadyScore: 68,
      suggestions: [
        "Add an expert background bio card to establish author authority trust signals",
        "Integrate statistical research citations to satisfy Perplexity reference queries"
      ],
      chunks: [
        { heading: "Primary overview", textPreview: "Welcome to indexing layouts", optimized: true },
        { heading: "Under-optimized span", textPreview: "Some un-backed statements without numbers", optimized: false }
      ]
    },
    simulations: [
      {
        engine: "ChatGPT",
        willCite: true,
        citationPercentage: 75,
        simulatedResponse: "Our simulation expects ChatGPT to summarize your layout while citing reference data under key semantic headers.",
        authorityGaps: ["Missing specific certified organization links"],
        missingInfo: ["Concrete conversion statistics"]
      },
      {
        engine: "Gemini",
        willCite: false,
        citationPercentage: 40,
        simulatedResponse: "Gemini will likely summarize this broadly but merge results into standard entity definitions instead of distinct backlinking citations unless statistics parameters have external schema anchors.",
        authorityGaps: ["Domain authority context references"],
        missingInfo: ["Author profile references"]
      }
    ],
    contentEnhancements: {
      optimizedStructureMarkdown: `# Semantic Guide on optimization\n\nBy Dr. SEO Expert, certified index analyst.\n\nAccording to Search Engine Journal (2026), 92% of bots look for entity structures.`,
      entityInsertions: ["Dr. SEO Expert", "Search Engine Journal 2026", "Entity structures"],
      citationTriggers: ["According to verified studies", "Refer to schema standards"]
    }
  };

  userStats.searchesUsed += 1;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({ provider: 'local', mock: mockGEO });
  }

  try {
    const prompt = `Analyze this text for GEO (Generative Engine Optimization) - targeting performance for LLMs like ChatGPT, Gemini, Claude, Perplexity and Copilot who compile real-time summaries and citations.
Target Audience Description: "${targetAudience || 'General audience searching Web tools'}"
Content:
"""
${content}
"""

Respond with a strictly formatted JSON object matching exactly this schema:
{
  "geoTotalScore": number (0 to 100),
  "visibilityScores": {
    "chatGPT": number,
    "gemini": number,
    "claude": number,
    "perplexity": number,
    "copilot": number
  },
  "entities": [{ "name": string, "type": "Person" | "Brand" | "Location" | "Organization" | "Product", "relevance": number }],
  "knowledgeGraphRelations": [{ "source": string, "target": string, "relationship": string }],
  "citationReadiness": {
    "score": number,
    "statCitationsCount": number,
    "authoritySourcesCount": number,
    "unbackedClaims": string[],
    "signals": { "authorCredentials": boolean, "referencesList": boolean, "concreteStats": boolean }
  },
  "chunksAnalysis": {
    "semanticSectionsCount": number,
    "passageRankingReadyScore": number,
    "suggestions": string[],
    "chunks": [{ "heading": string, "textPreview": string, "optimized": boolean }]
  },
  "simulations": [
    {
      "engine": "ChatGPT" | "Gemini" | "Claude" | "Perplexity",
      "willCite": boolean,
      "citationPercentage": number,
      "simulatedResponse": string,
      "authorityGaps": string[],
      "missingInfo": string[]
    }
  ],
  "contentEnhancements": {
    "optimizedStructureMarkdown": string,
    "entityInsertions": string[],
    "citationTriggers": string[]
  }
}

Check entity densities, citations readiness and simulation outcomes. Create premium, valid, parsed JSON ONLY.`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");
    const foundProj = savedProjects[0];
    if (foundProj) {
      foundProj.geoScore = parsed.geoTotalScore;
    }
    res.json({ provider: 'gemini', mock: parsed });
  } catch (err: any) {
    console.error("Gemini GEO Analyzer Error: ", err);
    res.json({ provider: 'local_fallback', error: err.message, mock: mockGEO });
  }
});

// 9. AI Writer
app.post("/api/writer/generate", async (req, res) => {
  const { type, topic, keywords, tone, optimizationType } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Missing topic to write content." });
  }

  const keys = keywords ? (Array.isArray(keywords) ? keywords : [keywords]) : ["optimization"];
  const optMessage = optimizationType === 'AEO' 
    ? "Highlighted by direct definitions, structured list items, and FAQ query headings for voice indexers."
    : optimizationType === 'GEO'
      ? "Saturated with trusted entity networks, statistics blocks (e.g., 'A study reveals 88%...'), and expert citations for AI summaries."
      : "Optimized with high density keyword pairings, internal link placeholders, and readable paragraph distributions for traditional search spiders.";

  const mockWriterResult = {
    content: `# The Complete Guide on ${topic}\n\nWritten by industry experts in ${tone || 'professional'} tone.\n\n## Frequently Asked Queries\n\n* **What is the significance of this guide?**\n  This resource covers core parameters. In corporate assessments, researchers confirmed speed metrics affect 91% of user retention rates.\n\n## Key Factors\n- Natural Language compliance\n- Structured schema tags\n- Entity graph references\n\nThanks for reading!`,
    outline: ["Introduction", "Why it matters", "Primary Parameters", "Faqs"],
    seoOptimizedMetas: {
      title: `Optimized: Secrets of ${topic}`,
      description: `Read the fully optimized guide on ${topic}. Focused on ${keys.join(", ")} targeting performance.`,
      ogTitle: `${topic} - Premium Guide`,
      ogDescription: `Learn the verified elements on ${topic} optimized for smart engines.`,
      twitterTitle: `${topic} - Mobile Overview`,
      twitterDescription: `Learn the verified elements on ${topic} optimized for smart engines.`
    }
  };

  const ai = getGeminiClient();

  if (!ai) {
    return res.json({ provider: 'local', mock: mockWriterResult });
  }

  try {
    const prompt = `Write a high-quality, fully detailed content piece based on topic "${topic}".
Content Type: "${type || 'article'}"
Tone preference: "${tone || 'professional'}"
Optimization priority: "${optimizationType || 'SEO'}" (${optMessage})
Keywords to target: [${keys.join(", ")}]

You must respond with a strictly valid JSON matching this schema:
{
  "content": string (Markdown formatted article content, roughly 600-1000 words. Include heading blocks, numerical stats, authoritative tables and definitions),
  "outline": string[],
  "seoOptimizedMetas": {
    "title": string,
    "description": string,
    "ogTitle": string,
    "ogDescription": string,
    "twitterTitle": string,
    "twitterDescription": string
  }
}
Respond with raw JSON text only, ready to be parsed.`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const val = JSON.parse(result.text || "{}");
    res.json({ provider: 'gemini', mock: val });
  } catch (err: any) {
    console.error("Gemini Writer Error: ", err);
    res.json({ provider: 'local_fallback', error: err.message, mock: mockWriterResult });
  }
});


// Serve static Vite/React build assets or setup Vite Server Middlewares
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SEO Toolkit Server running on http://localhost:${PORT}`);
  });
}

startServer();
