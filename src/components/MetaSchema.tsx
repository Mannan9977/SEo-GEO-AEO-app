import React, { useState } from 'react';
import { MetaGeneratorOutput } from '../types';
import { 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  Download, 
  Plus, 
  Trash, 
  Code,
  CheckCircle,
  RefreshCw,
  Braces
} from 'lucide-react';

interface MetaSchemaProps {
  onGenerateMeta: (keyword: string, tone: string, description: string) => Promise<{ provider: string; mock: MetaGeneratorOutput }>;
}

export default function MetaSchema({ onGenerateMeta }: MetaSchemaProps) {
  const [activeSubTab, setActiveSubTab] = useState<'meta' | 'schema' | 'robots' | 'sitemap'>('meta');

  // AI Meta Generator State
  const [metaKeyword, setMetaKeyword] = useState('');
  const [metaTone, setMetaTone] = useState('professional');
  const [metaDesc, setMetaDesc] = useState('');
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaResult, setMetaResult] = useState<MetaGeneratorOutput | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Schema Generator State
  const [schemaType, setSchemaType] = useState<'Article' | 'FAQ' | 'Product' | 'LocalBusiness' | 'Organization'>('Article');
  const [schemaTitle, setSchemaTitle] = useState('My Awesome Blog Post');
  const [schemaAuthor, setSchemaAuthor] = useState('M. A. Mannan');
  const [schemaPublisher, setSchemaPublisher] = useState('AI Studio Network');
  const [schemaFaqQ, setSchemaFaqQ] = useState('How to generate schemas?');
  const [schemaFaqA, setSchemaFaqA] = useState('Use our markup tools to create valid JSON-LD code instantly.');
  const [schemaPrice, setSchemaPrice] = useState('49.00');
  const [schemaCurrency, setSchemaCurrency] = useState('USD');
  const [schemaCopied, setSchemaCopied] = useState(false);

  // Robots.txt State
  const [robotsRules, setRobotsRules] = useState<Array<{ type: 'Allow' | 'Disallow'; agent: string; path: string }>>([
    { type: 'Allow', agent: '*', path: '/' },
    { type: 'Disallow', agent: 'BadBot', path: '/private/' },
    { type: 'Disallow', agent: '*', path: '/cgi-bin/' }
  ]);
  const [newRuleType, setNewRuleType] = useState<'Allow' | 'Disallow'>('Disallow');
  const [newRuleAgent, setNewRuleAgent] = useState('*');
  const [newRulePath, setNewRulePath] = useState('/tmp/');
  const [robotsSitemaps, setRobotsSitemaps] = useState('https://mysite.com/sitemap.xml');

  // Sitemap Generator State
  const [sitemapBase, setSitemapBase] = useState('https://myblogsite.com');
  const [includeImages, setIncludeImages] = useState(true);
  const [includeVideos, setIncludeVideos] = useState(false);
  const [includeNews, setIncludeNews] = useState(false);
  const [sitemapCode, setSitemapCode] = useState('');

  const handleMetaGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metaKeyword) return;
    setMetaLoading(true);
    try {
      const res = await onGenerateMeta(metaKeyword, metaTone, metaDesc);
      setMetaResult(res.mock);
    } catch (err) {
      console.error(err);
    } finally {
      setMetaLoading(false);
    }
  };

  const triggerCopyField = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Dynamic Schema markup calculation
  const getGeneratedSchemaCode = () => {
    let schemaObj: any = {
      "@context": "https://schema.org"
    };

    if (schemaType === 'Article') {
      schemaObj["@type"] = "NewsArticle";
      schemaObj["headline"] = schemaTitle;
      schemaObj["datePublished"] = new Date().toISOString();
      schemaObj["author"] = {
        "@type": "Person",
        "name": schemaAuthor
      };
      schemaObj["publisher"] = {
        "@type": "Organization",
        "name": schemaPublisher
      };
    } else if (schemaType === 'FAQ') {
      schemaObj["@type"] = "FAQPage";
      schemaObj["mainEntity"] = [
        {
          "@type": "Question",
          "name": schemaFaqQ,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": schemaFaqA
          }
        }
      ];
    } else if (schemaType === 'Product') {
      schemaObj["@type"] = "Product";
      schemaObj["name"] = schemaTitle;
      schemaObj["offers"] = {
        "@type": "Offer",
        "price": schemaPrice,
        "priceCurrency": schemaCurrency,
        "availability": "https://schema.org/InStock"
      };
    } else {
      schemaObj["@type"] = "LocalBusiness";
      schemaObj["name"] = schemaTitle;
      schemaObj["image"] = "https://example.com/shop.jpg";
      schemaObj["priceRange"] = "$$";
      schemaObj["address"] = {
        "@type": "PostalAddress",
        "streetAddress": "12 Main St",
        "addressLocality": "Singapore"
      };
    }

    return JSON.stringify(schemaObj, null, 2);
  };

  const copySchemaCode = () => {
    navigator.clipboard.writeText(getGeneratedSchemaCode());
    setSchemaCopied(true);
    setTimeout(() => setSchemaCopied(false), 2000);
  };

  // Robots Rules addition
  const handleAddRobotsRule = () => {
    if (!newRulePath) return;
    setRobotsRules([...robotsRules, { type: newRuleType, agent: newRuleAgent, path: newRulePath }]);
    setNewRulePath('');
  };

  const handleRemoveRobotsRule = (idx: number) => {
    setRobotsRules(robotsRules.filter((_, i) => i !== idx));
  };

  const getRobotsTxtContent = () => {
    let output = '';
    const grouped = robotsRules.reduce((acc, curr) => {
      if (!acc[curr.agent]) acc[curr.agent] = [];
      acc[curr.agent].push(`${curr.type}: ${curr.path}`);
      return acc;
    }, {} as any);

    Object.entries(grouped).forEach(([agent, rules]: any) => {
      output += `User-agent: ${agent}\n`;
      rules.forEach((rule: string) => {
        output += `${rule}\n`;
      });
      output += `\n`;
    });

    if (robotsSitemaps) {
      output += `Sitemap: ${robotsSitemaps}\n`;
    }

    return output.trim();
  };

  const downloadRobotsTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([getRobotsTxtContent()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "robots.txt";
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  // Dynamic Sitemap Markup
  const buildSitemapCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = sitemapBase.replace(/\/$/, '');
    let codeStr = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`;
    
    if (includeImages) codeStr += `\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`;
    if (includeVideos) codeStr += `\n        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"`;
    
    codeStr += `>\n`;

    // Add standard pages
    const pages = ['', '/about', '/blog', '/contact', '/pricing'];
    pages.forEach(p => {
      codeStr += `  <url>\n`;
      codeStr += `    <loc>${cleanUrl}${p}</loc>\n`;
      codeStr += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      codeStr += `    <changefreq>weekly</changefreq>\n`;
      codeStr += `    <priority>0.80</priority>\n`;
      if (includeImages && p === '') {
        codeStr += `    <image:image>\n`;
        codeStr += `      <image:loc>${cleanUrl}/images/hero-banner.jpg</image:loc>\n`;
        codeStr += `      <image:title>Healthy treats selection banner</image:title>\n`;
        codeStr += `    </image:image>\n`;
      }
      codeStr += `  </url>\n`;
    });

    codeStr += `</urlset>`;
    setSitemapCode(codeStr);
  };

  const downloadSitemapXml = () => {
    const element = document.createElement("a");
    const file = new Blob([sitemapCode], {type: 'text/xml'});
    element.href = URL.createObjectURL(file);
    element.download = "sitemap.xml";
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs hierarchy */}
      <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-xs gap-1">
        <button
          onClick={() => setActiveSubTab('meta')}
          className={`flex-1 py-3 text-center rounded-lg text-xs md:text-sm font-semibold transition-all ${activeSubTab === 'meta' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          ✨ AI Meta Generator
        </button>
        <button
          onClick={() => setActiveSubTab('schema')}
          className={`flex-1 py-3 text-center rounded-lg text-xs md:text-sm font-semibold transition-all ${activeSubTab === 'schema' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          🏷️ JSON-LD Schema Builder
        </button>
        <button
          onClick={() => setActiveSubTab('robots')}
          className={`flex-1 py-3 text-center rounded-lg text-xs md:text-sm font-semibold transition-all ${activeSubTab === 'robots' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          🤖 Visual Robots.txt Builder
        </button>
        <button
          onClick={() => setActiveSubTab('sitemap')}
          className={`flex-1 py-3 text-center rounded-lg text-xs md:text-sm font-semibold transition-all ${activeSubTab === 'sitemap' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          🗺️ XML Sitemap Generator
        </button>
      </div>

      {/* 1. AI Meta Generator */}
      {activeSubTab === 'meta' && (
        <div className="space-y-6" id="ai-meta-tab">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 md:p-6 shadow-xs">
            <h3 className="text-xl font-display font-semibold text-slate-900">AI Meta Title & Description Generator</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Input target keywords and preferred tonalities. Gemini will write optimized structural tags, OpenGraph previews, and character count counters.
            </p>

            <form onSubmit={handleMetaGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600">Focus Target Keyword</label>
                <input
                  type="text"
                  value={metaKeyword}
                  onChange={(e) => setMetaKeyword(e.target.value)}
                  placeholder="e.g. premium organic pet treat shop"
                  required
                  className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Tone Selection</label>
                <select
                  value={metaTone}
                  onChange={(e) => setMetaTone(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="professional">Professional / Authoritative</option>
                  <option value="casual">Casual / Friendly</option>
                  <option value="funny">Humorous / Witty</option>
                  <option value="persuasive">Persuasive / Sales-driven</option>
                  <option value="educational">Educational / Academic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Supplemental Details (Optional)</label>
                <input
                  type="text"
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  placeholder="e.g. launched in 2026, offering free ship"
                  className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={metaLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5"
                >
                  {metaLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Create Optimized Meta Tags
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {metaResult && !metaLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="ai-meta-outputs">
              {/* Traditional Search Engine Preview card */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <h4 className="font-display font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                  Traditional Search Preview (Google/Bing)
                  <span className="text-[10px] font-mono text-slate-400">Desktop Format</span>
                </h4>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/40 space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium truncate">https://mysite.com › products</div>
                  <div className="text-lg text-blue-800 font-semibold hover:underline cursor-pointer truncate">
                    {metaResult.title}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {metaResult.description}
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3 border border-slate-100 rounded-lg space-y-1">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>HTML Title Tag</span>
                      <span className={`${metaResult.title.length > 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {metaResult.title.length} / 60 Chars
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-mono text-slate-600 truncate flex-1">{metaResult.title}</span>
                      <button onClick={() => triggerCopyField(metaResult.title, 'html_t')} className="text-indigo-600">
                        {copiedField === 'html_t' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 border border-slate-100 rounded-lg space-y-1">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>HTML Meta Description</span>
                      <span className={`${metaResult.description.length > 155 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {metaResult.description.length} / 155 Chars
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-mono text-slate-600 truncate flex-1">{metaResult.description}</span>
                      <button onClick={() => triggerCopyField(metaResult.description, 'html_d')} className="text-indigo-600">
                        {copiedField === 'html_d' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rich Open graph previews */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <h4 className="font-display font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                  Open Graph & Card Tags (Facebook/LinkedIn/X)
                  <span className="text-[10px] font-mono text-slate-400">Social Markup</span>
                </h4>

                <div className="bg-slate-50 rounded-lg border border-slate-200/40 overflow-hidden text-xs">
                  <div className="h-28 bg-slate-200 flex items-center justify-center text-slate-400 font-mono text-[10px]">
                    Simulated og:image preview card
                  </div>
                  <div className="p-3 space-y-1 bg-white border-t border-slate-200">
                    <div className="font-bold text-slate-900 font-sans truncate">{metaResult.ogTitle}</div>
                    <p className="text-slate-500 font-sans leading-relaxed truncate">{metaResult.ogDescription}</p>
                    <span className="text-[10px] text-slate-400 font-mono">OG PROTOCOL</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-2.5 border border-slate-100 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold block text-slate-700">og:title</span>
                      <span className="font-mono text-slate-400 text-[10px]">{metaResult.ogTitle}</span>
                    </div>
                    <button onClick={() => triggerCopyField(metaResult.ogTitle, 'og_t')} className="text-indigo-600 pr-1">
                      {copiedField === 'og_t' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-2.5 border border-slate-100 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold block text-slate-700">og:description</span>
                      <span className="font-mono text-slate-400 text-[10px] truncate max-w-xs block">{metaResult.ogDescription}</span>
                    </div>
                    <button onClick={() => triggerCopyField(metaResult.ogDescription, 'og_d')} className="text-indigo-600 pr-1">
                      {copiedField === 'og_d' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Schema Markup Builder */}
      {activeSubTab === 'schema' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="schema-builder-tab">
          {/* Controls form */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h4 className="font-display font-semibold text-slate-900 border-b border-slate-100 pb-2">Schema Specifications</h4>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-600">Schema Category</label>
                <select
                  value={schemaType}
                  onChange={(e: any) => setSchemaType(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none"
                >
                  <option value="Article">Article Markup</option>
                  <option value="FAQ">FAQ Section</option>
                  <option value="Product">Product Details</option>
                  <option value="LocalBusiness">Local Business</option>
                </select>
              </div>

              {schemaType === 'Article' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-600">Article Headline Title</label>
                    <input type="text" value={schemaTitle} onChange={(e) => setSchemaTitle(e.target.value)} className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600">Author Name</label>
                    <input type="text" value={schemaAuthor} onChange={(e) => setSchemaAuthor(e.target.value)} className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600">Publisher Entity</label>
                    <input type="text" value={schemaPublisher} onChange={(e) => setSchemaPublisher(e.target.value)} className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg" />
                  </div>
                </>
              )}

              {schemaType === 'FAQ' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-600">FAQ Question</label>
                    <input type="text" value={schemaFaqQ} onChange={(e) => setSchemaFaqQ(e.target.value)} className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600">FAQ Accepted Answer</label>
                    <textarea rows={3} value={schemaFaqA} onChange={(e) => setSchemaFaqA(e.target.value)} className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg" />
                  </div>
                </>
              )}

              {schemaType === 'Product' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-600">Product Name</label>
                    <input type="text" value={schemaTitle} onChange={(e) => setSchemaTitle(e.target.value)} className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-600">Price</label>
                      <input type="text" value={schemaPrice} onChange={(e) => setSchemaPrice(e.target.value)} className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600">Currency</label>
                      <input type="text" value={schemaCurrency} onChange={(e) => setSchemaCurrency(e.target.value)} className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg" />
                    </div>
                  </div>
                </>
              )}

              {schemaType === 'LocalBusiness' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-600">Company Name</label>
                    <input type="text" value={schemaTitle} onChange={(e) => setSchemaTitle(e.target.value)} className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg" />
                  </div>
                  <p className="text-[11px] text-slate-400 italic">Address variables formatted as default JSON schema blocks below.</p>
                </>
              )}
            </div>
          </div>

          {/* JSON-LD preview */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-display font-semibold text-slate-900 flex items-center gap-1.5">
                <Braces className="w-5 h-5 text-indigo-600" />
                Structured JSON-LD Schema
              </h4>
              <button
                onClick={copySchemaCode}
                className="text-xs bg-slate-100 hover:bg-slate-200 tracking-wide px-3 py-1 rounded text-slate-700 font-semibold flex items-center gap-1"
              >
                {schemaCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {schemaCopied ? 'Copied' : 'Copy Block'}
              </button>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg font-mono text-xs text-indigo-300 overflow-x-auto max-h-[350px]">
              <pre>{getGeneratedSchemaCode()}</pre>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              * Structured JSON-LD signals authority directly to Google crawlers and generative summaries like Alexa. Embed this script inside your website's <code className="bg-slate-100 text-slate-800 px-1 rounded">&lt;head&gt;</code> element to claim index authority instantly.
            </p>
          </div>
        </div>
      )}

      {/* 3. Robots.txt visual builder */}
      {activeSubTab === 'robots' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="robots-txt-tab">
          {/* Rule configurations */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h4 className="font-display font-semibold text-slate-900 border-b border-slate-100 pb-2">Configure Rules Visual</h4>
            
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold">Rule Protocol</label>
                <div className="flex gap-2 mt-1.5">
                  <button 
                    type="button"
                    onClick={() => setNewRuleType('Allow')} 
                    className={`flex-1 py-1 px-3 rounded text-center text-xs font-semibold ${newRuleType === 'Allow' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    Allow
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewRuleType('Disallow')} 
                    className={`flex-1 py-1 px-3 rounded text-center text-xs font-semibold ${newRuleType === 'Disallow' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    Disallow
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold">Target User Agent Bot</label>
                <input 
                  type="text" 
                  value={newRuleAgent} 
                  onChange={(e) => setNewRuleAgent(e.target.value)}
                  placeholder="e.g. * (all robots)" 
                  className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold">Relative Directories Path</label>
                <input 
                  type="text" 
                  value={newRulePath} 
                  onChange={(e) => setNewRulePath(e.target.value)}
                  placeholder="e.g. /private/" 
                  className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none" 
                />
              </div>

              <button
                type="button"
                onClick={handleAddRobotsRule}
                className="w-full bg-slate-900 text-white font-semibold text-xs py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-slate-800"
              >
                <Plus className="w-4 h-4" /> Add Robots Rule
              </button>

              <div className="border-t border-slate-100 pt-3">
                <label className="block text-slate-600 font-bold">Associate Sitemap Index URL</label>
                <input 
                  type="url" 
                  value={robotsSitemaps} 
                  onChange={(e) => setRobotsSitemaps(e.target.value)}
                  placeholder="e.g. https://domain.com/sitemap.xml" 
                  className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Rules lists and file markup */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-display font-semibold text-slate-900 flex items-center gap-1.5">
                <Code className="w-5 h-5 text-indigo-600" />
                Live robots.txt Output Code
              </h4>
              <button
                onClick={downloadRobotsTxt}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3.5 py-1.5 rounded flex items-center gap-1"
              >
                <Download className="w-4 h-4" /> Download robots.txt
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rules visual manager */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Manage Active Directives</span>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {robotsRules.map((rule, i) => (
                    <div key={i} className="p-2 border border-slate-100 text-xs rounded-lg flex justify-between items-center">
                      <span className="font-mono">
                        <strong className={rule.type === 'Allow' ? "text-emerald-700" : "text-rose-700"}>{rule.type}</strong> Agent({rule.agent}) ➔ {rule.path}
                      </span>
                      <button onClick={() => handleRemoveRobotsRule(i)} className="text-rose-500 hover:bg-rose-50 p-1 rounded">
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Txt preview */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block text-right">Raw Output Preview</span>
                <div className="p-3 bg-slate-900 text-indigo-300 font-mono text-[11px] rounded-lg h-[220px] overflow-y-auto whitespace-pre">
                  {getRobotsTxtContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Sitemap XML generator */}
      {activeSubTab === 'sitemap' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="sitemap-tab">
          {/* Sitemap configurations Form */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h4 className="font-display font-semibold text-slate-900 border-b border-slate-100 pb-2">Crawl Sitemaps Config</h4>
            
            <form onSubmit={buildSitemapCode} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold">Your Website Base URL</label>
                <input
                  type="url"
                  value={sitemapBase}
                  onChange={(e) => setSitemapBase(e.target.value)}
                  placeholder="https://mysite.com"
                  required
                  className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="block text-slate-600 font-bold">Include Multi-Media Sitemaps</label>
                
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer py-1 block">
                  <input type="checkbox" checked={includeImages} onChange={() => setIncludeImages(!includeImages)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <span>Image Sitemap Markup</span>
                </label>

                <label className="flex items-center gap-2 text-slate-600 cursor-pointer py-1 block">
                  <input type="checkbox" checked={includeVideos} onChange={() => setIncludeVideos(!includeVideos)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <span>Video XML parameters</span>
                </label>

                <label className="flex items-center gap-2 text-slate-600 cursor-pointer py-1 block">
                  <input type="checkbox" checked={includeNews} onChange={() => setIncludeNews(!includeNews)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <span>Google News crawl nodes</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-lg"
              >
                Construct Sitemap XML
              </button>
            </form>
          </div>

          {/* Sitemap preview */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-display font-semibold text-slate-900 flex items-center gap-1.5">
                <Braces className="w-5 h-5 text-indigo-600" />
                Raw Sitemap XML Code
              </h4>
              {sitemapCode && (
                <button
                  type="button"
                  onClick={downloadSitemapXml}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1 rounded flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download XML
                </button>
              )}
            </div>

            {sitemapCode ? (
              <div className="p-4 bg-slate-900 rounded-lg font-mono text-xs text-indigo-300 overflow-x-auto max-h-[300px]">
                <pre>{sitemapCode}</pre>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 font-medium">
                Fill in your website domain parameters & click 'Construct Sitemap' to instantly build structured XML crawlers indexes.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
