import React, { useState } from 'react';
import { SEOAnalysisResult, BrokenLinksResult, BacklinkResult, KeywordResult } from '../types';
import { 
  Globe, 
  Search, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  BarChart, 
  AlertCircle,
  Clock, 
  ExternalLink,
  ChevronDown,
  Download,
  TrendingUp,
  Link,
  RefreshCw
} from 'lucide-react';

interface SeoAuditProps {
  onAnalyzeSEO: (url: string, keyword: string) => Promise<SEOAnalysisResult>;
  onCheckLinks: (url: string) => Promise<BrokenLinksResult>;
  onAnalyzeBacklinks: (url: string) => Promise<BacklinkResult>;
  onResearchKeyword: (keyword: string) => Promise<KeywordResult>;
  initialUrl?: string;
  initialKeyword?: string;
}

export default function SeoAudit({
  onAnalyzeSEO,
  onCheckLinks,
  onAnalyzeBacklinks,
  onResearchKeyword,
  initialUrl = '',
  initialKeyword = ''
}: SeoAuditProps) {
  // Tabs within Traditional SEO
  const [activeSubTab, setActiveSubTab] = useState<'analyzer' | 'keyword' | 'links' | 'backlinks'>('analyzer');
  
  // States for SEO Analyzer
  const [url, setUrl] = useState(initialUrl);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoResult, setSeoResult] = useState<SEOAnalysisResult | null>(null);

  // States for Keyword Research
  const [seedKeyword, setSeedKeyword] = useState(initialKeyword);
  const [kwLoading, setKwLoading] = useState(false);
  const [keywordResult, setKeywordResult] = useState<KeywordResult | null>(null);

  // States for Broken Link Scanner
  const [linkUrl, setLinkUrl] = useState(initialUrl);
  const [linksLoading, setLinksLoading] = useState(false);
  const [linksResult, setLinksResult] = useState<BrokenLinksResult | null>(null);

  // States for Backlinks
  const [backlinkUrl, setBacklinkUrl] = useState(initialUrl);
  const [backlinkLoading, setBacklinkLoading] = useState(false);
  const [backlinkResult, setBacklinkResult] = useState<BacklinkResult | null>(null);

  const [providerMode, setProviderMode] = useState<string>('');

  const handleSEOAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !keyword) return;
    setSeoLoading(true);
    try {
      const res = await onAnalyzeSEO(url, keyword);
      // @ts-ignore
      setSeoResult(res.mock);
      // @ts-ignore
      setProviderMode(res.provider || 'local');
    } catch (err) {
      console.error(err);
    } finally {
      setSeoLoading(false);
    }
  };

  const handleKeywordResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedKeyword) return;
    setKwLoading(true);
    try {
      const res = await onResearchKeyword(seedKeyword);
      // @ts-ignore
      setKeywordResult(res.mock);
    } catch (err) {
      console.error(err);
    } finally {
      setKwLoading(false);
    }
  };

  const handleLinkCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;
    setLinksLoading(true);
    try {
      const res = await onCheckLinks(linkUrl);
      setLinksResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLinksLoading(false);
    }
  };

  const handleBacklinkCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backlinkUrl) return;
    setBacklinkLoading(true);
    try {
      const res = await onAnalyzeBacklinks(backlinkUrl);
      setBacklinkResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setBacklinkLoading(false);
    }
  };

  // Export utility helper (Standard JSON schema model export)
  const handleExportJSON = (data: any, titleStr: string) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${titleStr.toLowerCase().replace(/ /g, "_")}_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Search Tools Tabs menu */}
      <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-xs gap-1 md:gap-2">
        <button
          onClick={() => setActiveSubTab('analyzer')}
          className={`flex-1 py-3 text-center rounded-lg text-xs md:text-sm font-semibold transition-all duration-150 ${activeSubTab === 'analyzer' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          🔍 Website SEO Analyzer
        </button>
        <button
          onClick={() => setActiveSubTab('keyword')}
          className={`flex-1 py-3 text-center rounded-lg text-xs md:text-sm font-semibold transition-all duration-150 ${activeSubTab === 'keyword' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          🏷️ Keyword Research
        </button>
        <button
          onClick={() => setActiveSubTab('links')}
          className={`flex-1 py-3 text-center rounded-lg text-xs md:text-sm font-semibold transition-all duration-150 ${activeSubTab === 'links' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          🔗 Broken Link Check
        </button>
        <button
          onClick={() => setActiveSubTab('backlinks')}
          className={`flex-1 py-3 text-center rounded-lg text-xs md:text-sm font-semibold transition-all duration-150 ${activeSubTab === 'backlinks' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          🧱 Backlink Analyzer
        </button>
      </div>

      {/* 1. Website SEO Analyzer */}
      {activeSubTab === 'analyzer' && (
        <div className="space-y-6" id="seo-analyzer-section">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 md:p-6 shadow-xs">
            <h3 className="text-xl font-display font-semibold text-slate-900">Comprehensive SEO & Metadata Scanner</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Enter any page URL to retrieve immediate crawl indicators, meta warnings, Canonical validity, tag density scoring, and page speed index reports.
            </p>

            <form onSubmit={handleSEOAnalyze} className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Website Page URL</label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <Globe className="w-4 h-4" />
                  </span>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    placeholder="https://example.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Primary Target Keyword</label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    required
                    placeholder="e.g. delicious dog biscuits organic"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="md:col-span-3 flex items-end">
                <button
                  type="submit"
                  disabled={seoLoading}
                  className="w-full bg-slate-900 text-white font-semibold text-xs py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800 disabled:bg-slate-400"
                >
                  {seoLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Auditing with Gemini...
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" />
                      Begin Crawl Audit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {seoLoading && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-8 text-center space-y-3">
              <div className="flex justify-center">
                <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
              </div>
              <h4 className="font-semibold text-slate-800">Crawl Audit in Progress</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Gemini AI is parsing the structural layout, reading tags density, checking canonical declarations, and evaluating key semantic SEO metrics...
              </p>
            </div>
          )}

          {seoResult && !seoLoading && (
            <div className="space-y-6" id="seo-result-pane">
              {/* Score summary panel */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="text-center space-y-2 border-r border-slate-100 last:border-0 p-4">
                  <div className="relative inline-flex items-center justify-center">
                    {/* Circle Score visualization */}
                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center bg-indigo-50/20">
                      <span className="text-3xl font-bold font-display text-indigo-600">{seoResult.score}</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 mt-2">Overall SEO Score</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Based on tag lengths, canonical correctness, alt counts, and structure.</p>
                </div>

                <div className="space-y-3 p-4 border-r border-slate-100 last:border-0 text-left">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Metadata Fast Stats</div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Title length:</span>
                      <span className="font-semibold text-slate-900">{seoResult.elements.title.length} chars</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meta Description:</span>
                      <span className="font-semibold text-slate-900">{seoResult.elements.metaDescription.length} chars</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Image alt status:</span>
                      <span className={`font-semibold ${seoResult.elements.imageAlts.missing > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {seoResult.elements.imageAlts.missing} Missing Alts
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>OG Tags status:</span>
                      <span className="text-emerald-600 font-semibold">Active</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 text-left">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Core Web Vitals Estimation</div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between items-center">
                      <span>Page Speed Score</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono">{seoResult.elements.speedScore}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Mobile Friendliness</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono">{seoResult.elements.mobileScore}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Internal Links scanned</span>
                      <span className="font-bold text-slate-900 font-mono">{seoResult.elements.internalLinksCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elements detail lists */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <h4 className="font-display font-semibold text-slate-900">Analyzed Page Elements</h4>
                      <div className="text-[10px] bg-slate-100 px-2 py-0.5 rounded">Parsed via {providerMode} analyzer</div>
                    </div>

                    <div className="space-y-4 text-sm">
                      {/* Title */}
                      <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">Title Tag</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${seoResult.elements.title.status === 'good' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {seoResult.elements.title.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-900 font-mono mt-1 break-words">"{seoResult.elements.title.value}"</p>
                        <p className="text-[11px] text-indigo-700 italic mt-1">Suggestion: {seoResult.elements.title.suggestion}</p>
                      </div>

                      {/* Description */}
                      <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">Meta Description</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${seoResult.elements.metaDescription.status === 'good' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {seoResult.elements.metaDescription.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-900 font-mono mt-1 break-words">"{seoResult.elements.metaDescription.value}"</p>
                        <p className="text-[11px] text-indigo-700 italic mt-1">Suggestion: {seoResult.elements.metaDescription.suggestion}</p>
                      </div>

                      {/* Header distributions */}
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center p-3 border border-slate-100 rounded-lg">
                        {Object.entries(seoResult.elements.h1ToH6Count).map(([tag, count]) => (
                          <div key={tag} className="bg-slate-50/50 p-2 rounded">
                            <span className="font-bold font-mono text-slate-400 block text-[10px]">{tag}</span>
                            <span className="text-sm font-semibold text-slate-800">{count}</span>
                          </div>
                        ))}
                      </div>

                      {/* Canonical & Robots */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 border border-slate-100 rounded-lg text-xs space-y-1">
                          <div className="font-bold text-slate-800">Canonical link Tag</div>
                          <div className="font-mono text-slate-500 truncate">{seoResult.elements.canonical.value || 'None Declared'}</div>
                          <div className="text-[10px] text-slate-400">{seoResult.elements.canonical.suggestion}</div>
                        </div>
                        <div className="p-3 border border-slate-100 rounded-lg text-xs space-y-1">
                          <div className="font-bold text-slate-800">Robots Headers</div>
                          <div className="font-mono text-slate-500 truncate">{seoResult.elements.robots.value}</div>
                          <div className="text-[10px] text-slate-400">{seoResult.elements.robots.suggestion}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                    <div className="flex justify-between items-center pb-1">
                      <h4 className="font-display font-semibold text-slate-900">Required Fixes</h4>
                      <button 
                        onClick={() => handleExportJSON(seoResult, 'SEO_Audit')}
                        className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Export Report
                      </button>
                    </div>

                    <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                      {seoResult.recommendations.map((rec, i) => (
                        <div key={rec.id || i} className="p-3 border border-slate-100 rounded-lg text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              rec.impact === 'high' ? 'bg-red-100 text-red-800' : 
                              rec.impact === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {rec.impact} Impact
                            </span>
                            <span className="font-bold text-slate-400 uppercase text-[9px]">{rec.category}</span>
                          </div>
                          <div className="font-bold text-slate-800">{rec.title}</div>
                          <p className="text-slate-500 leading-relaxed">{rec.description}</p>
                          <div className="bg-indigo-50/50 p-2.5 rounded text-indigo-950 font-medium">
                            <span className="font-bold">Recommendation:</span> <br/>
                            {rec.fix}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Keyword Research */}
      {activeSubTab === 'keyword' && (
        <div className="space-y-6" id="keyword-research-section">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 md:p-6 shadow-xs">
            <h3 className="text-xl font-display font-semibold text-slate-900">Seed Keyword & Difficulty Estimator</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Input any keyphrase to get search volume estimations, pay-per-click costs, long-tail queries, dynamic trends forecasts, and difficulty gauges.
            </p>

            <form onSubmit={handleKeywordResearch} className="flex gap-2">
              <input
                type="text"
                value={seedKeyword}
                onChange={(e) => setSeedKeyword(e.target.value)}
                required
                placeholder="e.g. cheap puppy rewards subscription box"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={kwLoading}
                className="bg-slate-900 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-800 disabled:bg-slate-400"
              >
                {kwLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Run Research'}
              </button>
            </form>
          </div>

          {keywordResult && !kwLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Metrics sidebar */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-6">
                <div>
                  <h4 className="font-display font-semibold text-slate-900 pb-2 border-b border-slate-100">Keyword Overview</h4>
                  <div className="text-xs text-slate-400 mt-1 font-semibold">TARGET: "{keywordResult.keyword}"</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-indigo-50/20 border border-indigo-100 rounded-lg">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Volume</span>
                    <span className="text-lg font-bold text-indigo-700">{keywordResult.searchVolume.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-red-50/20 border border-red-100 rounded-lg">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase font-sans">Difficulty</span>
                    <span className="text-lg font-bold text-red-700">{keywordResult.difficulty}/100</span>
                  </div>
                  <div className="p-3 bg-emerald-50/20 border border-emerald-100 rounded-lg">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">CPC Estimate</span>
                    <span className="text-lg font-bold text-emerald-700">${keywordResult.cpc}</span>
                  </div>
                  <div className="p-3 bg-amber-50/20 border border-amber-100 rounded-lg">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Competition</span>
                    <span className="text-lg font-bold text-amber-700">{keywordResult.competition}%</span>
                  </div>
                </div>

                {/* Visual Trends Chart representation with pure CSS */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Interest Over Time (6 Months)</span>
                  <div className="flex items-end justify-between h-24 pt-4 border-b border-slate-200">
                    {keywordResult.trends?.map((item) => (
                      <div key={item.month} className="flex flex-col items-center flex-1 gap-1 group">
                        <div 
                          className="bg-indigo-600 w-4 rounded-t-sm transition-all duration-300 relative group-hover:bg-indigo-500"
                          style={{ height: `${Math.max(5, item.value * 0.7)}px` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-950 text-white font-mono text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">{item.value}%</div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium font-mono">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keyword expansion lists */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-display font-semibold text-slate-900">Semantic Keyword Groupings</h4>
                  <button 
                    onClick={() => handleExportJSON(keywordResult, 'Keyword_Matrix')}
                    className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:text-indigo-800"
                  >
                    <Download className="w-4 h-4" /> Save CSV Matrix
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                      Long-Tail Keyword Iterations
                    </h5>
                    <div className="space-y-2">
                      {keywordResult.longTails?.map((lt, i) => (
                        <div key={i} className="p-2 bg-slate-50 rounded-lg text-xs text-slate-800 flex justify-between items-center">
                          <span className="font-mono">{lt}</span>
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1 rounded font-bold">Volume: High</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-indigo-500" />
                      Question Phrases (AEO/Snippet gold)
                    </h5>
                    <div className="space-y-2">
                      {keywordResult.questions?.map((q, i) => (
                        <div key={i} className="p-2 bg-slate-50 rounded-lg text-xs text-slate-800 flex justify-between items-center">
                          <span className="font-medium font-sans italic">"{q}"</span>
                          <span className="text-[10px] bg-red-50 text-red-600 px-1 rounded font-bold">Highly relevant</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Related tags */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Related Search Concepts</span>
                  <div className="flex flex-wrap gap-1.5">
                    {keywordResult.related?.map((tag, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Broken Link Check */}
      {activeSubTab === 'links' && (
        <div className="space-y-6" id="broken-links-section">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-xl font-display font-semibold text-slate-900">Broken Link Scanner</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Assess page anchors and identify toxic 404 targets, redirect loops, or 503 gateways. Fix guidelines generated automatically.
            </p>

            <form onSubmit={handleLinkCheck} className="flex gap-2">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                required
                placeholder="https://example.com/shop"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={linksLoading}
                className="bg-slate-900 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-800 disabled:bg-slate-400"
              >
                {linksLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Scan Page links'}
              </button>
            </form>
          </div>

          {linksResult && !linksLoading && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <h4 className="font-display font-semibold text-slate-900">Scan Summary Reports</h4>
                  <p className="text-xs text-slate-400">Validated {linksResult.scannedCount} hyperlinks.</p>
                </div>
                <div className="bg-red-50 text-red-700 px-3 py-1 rounded text-xs font-bold border border-red-100">
                  {linksResult.brokenCount} Errors Found
                </div>
              </div>

              <div className="space-y-3">
                {linksResult.links.map((link, idx) => (
                  <div key={idx} className="p-3 border border-slate-100 rounded-lg flex flex-col md:flex-row justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                          link.statusCode === 200 ? 'bg-emerald-100 text-emerald-800' :
                          link.statusCode === 301 ? 'bg-amber-100 text-amber-850' : 'bg-red-100 text-red-800'
                        }`}>
                          HTTP {link.statusCode}
                        </span>
                        <span className="font-bold text-slate-400 uppercase text-[9px]">{link.type} link</span>
                      </div>
                      <div className="font-mono text-xs text-slate-800 truncate max-w-lg md:max-w-xl">{link.url}</div>
                      {link.redirectChain?.length > 0 && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span className="font-bold">Redirect:</span> {link.redirectChain.join(" → ")}
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 p-2 rounded max-w-sm shrink-0 md:self-center">
                      <div className="font-bold text-[10px] text-slate-400 uppercase">Analysis / Remedy</div>
                      <p className="text-[11px] text-slate-700 italic mt-0.5">{link.fixSuggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Backlinks */}
      {activeSubTab === 'backlinks' && (
        <div className="space-y-6" id="backlinks-section">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-xl font-display font-semibold text-slate-900">Backlink Competitor Scanner</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Gather referring domain lists, active anchor text selections, dofollow ratios, and calculated domain authority score indicators.
            </p>

            <form onSubmit={handleBacklinkCheck} className="flex gap-2">
              <input
                type="url"
                value={backlinkUrl}
                onChange={(e) => setBacklinkUrl(e.target.value)}
                required
                placeholder="https://example.com/company"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={backlinkLoading}
                className="bg-slate-900 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-800 disabled:bg-slate-400"
              >
                {backlinkLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Analyze Backlinks'}
              </button>
            </form>
          </div>

          {backlinkResult && !backlinkLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Backlinks sidebar */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-6">
                <div>
                  <h4 className="font-display font-semibold text-slate-900">Authority Indicators</h4>
                  <p className="text-[11px] text-slate-400">Competitor link metrics summary.</p>
                </div>

                <div className="text-center p-4 bg-indigo-50/10 border border-indigo-100 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Authority Index</span>
                  <span className="text-3xl font-black text-indigo-700 font-display">{backlinkResult.authorityScore}/100</span>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${backlinkResult.authorityScore}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 border border-slate-100 rounded">
                    <div className="text-slate-400 block font-semibold text-[10px] uppercase">Referring Domains</div>
                    <span className="font-bold text-slate-900 text-sm mt-1 block">{backlinkResult.referringDomains}</span>
                  </div>
                  <div className="p-2 border border-slate-100 rounded">
                    <div className="text-slate-400 block font-semibold text-[10px] uppercase">Total Backlinks</div>
                    <span className="font-bold text-slate-900 text-sm mt-1 block">{backlinkResult.totalBacklinks}</span>
                  </div>
                </div>

                {/* Split representation charts */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-500 font-semibold text-[11px]">
                    <span>Dofollow Link Distribution</span>
                    <span>{backlinkResult.dofollowPercent}% vs {backlinkResult.nofollowPercent}%</span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden">
                    <div className="bg-indigo-600" style={{ width: `${backlinkResult.dofollowPercent}%` }}></div>
                    <div className="bg-slate-200" style={{ width: `${backlinkResult.nofollowPercent}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Backlinks table */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <h4 className="font-display font-semibold text-slate-900 pb-2 border-b border-slate-100">Top Referring Anchor URLs</h4>
                
                <div className="space-y-3">
                  {backlinkResult.backlinksList.map((val, idx) => (
                    <div key={idx} className="p-3 bg-slate-5/50 border border-slate-100 rounded-lg text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700 truncate max-w-sm md:max-w-md">{val.sourceUrl}</span>
                        <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                          val.type === 'dofollow' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {val.type}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Anchor: <strong className="text-slate-900 font-mono italic">"{val.anchorText}"</strong></span>
                        <span>Authority Rank: <strong className="text-indigo-600 font-bold">{val.authority}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
