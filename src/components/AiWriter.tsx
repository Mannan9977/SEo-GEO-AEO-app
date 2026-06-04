import React, { useState } from 'react';
import { AIWriterParams, AIWriterResult } from '../types';
import { 
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  Plus,
  Trash,
  RefreshCw,
  Edit3,
  List,
  Compass,
  ArrowRight,
  Bookmark
} from 'lucide-react';

interface AiWriterProps {
  onGenerateContent: (params: AIWriterParams) => Promise<{ provider: string; mock: AIWriterResult }>;
}

export default function AiWriter({ onGenerateContent }: AiWriterProps) {
  const [type, setType] = useState<AIWriterParams['type']>('blog');
  const [topic, setTopic] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [tone, setTone] = useState<AIWriterParams['tone']>('professional');
  const [optimizationType, setOptimizationType] = useState<AIWriterParams['optimizationType']>('SEO');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIWriterResult | null>(null);
  
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    
    // Parse comma-separated keywords
    const keywords = keywordsInput
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    try {
      const res = await onGenerateContent({
        type,
        topic,
        keywords,
        tone,
        optimizationType
      });
      setResult(res.mock);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const downloadArticle = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([result.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_optimized.md`;
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white rounded-xl p-5 md:p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500 rounded-full blur-2xl opacity-15"></div>
        <div className="space-y-1 relative z-10">
          <div className="text-emerald-300 text-xs font-mono uppercase tracking-widest font-black">AI SEO, AEO & GEO Writer</div>
          <h2 className="text-xl md:text-2xl font-display font-bold">Write Authority Content Instantly</h2>
          <p className="text-xs text-emerald-100 max-w-xl">
            Input a subject and targeted search queries. Bring together entity graph embeddings or smart answer formats designed to optimize page rank, snippet visibility, and citation metrics.
          </p>
        </div>
        <Edit3 className="w-16 h-16 text-emerald-400 opacity-20 shrink-0 self-end md:self-center" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form panel */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4 h-fit">
          <h3 className="font-display font-semibold text-slate-900 border-b border-slate-100 pb-2">Generation Configurations</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-600 font-semibold uppercase tracking-wider text-[10px]">What is the target topic?</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Benefits of organic dried dog treats for puppies"
                required
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold uppercase tracking-wider text-[10px]">Article Type</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
                >
                  <option value="blog">Blog / Article</option>
                  <option value="product_description">Product Specs Guide</option>
                  <option value="landing_page">Landing Copy</option>
                  <option value="faq">FAQ Section</option>
                  <option value="howto">Step-by-step HowTo</option>
                  <option value="comparison">Comparison Table</option>
                  <option value="listicle">Listicle</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold uppercase tracking-wider text-[10px]">Tone of voice</label>
                <select
                  value={tone}
                  onChange={(e: any) => setTone(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
                >
                  <option value="professional">Professional / Trust</option>
                  <option value="casual">Friendly / Casual</option>
                  <option value="witty">Witty / Clever</option>
                  <option value="authoritative">Authoritative</option>
                  <option value="educational">Educational</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold uppercase tracking-wider text-[10px]">Target SEO Keywords (Comma separated)</label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="e.g. organic, healthy snacks, pet rewards"
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="block text-slate-600 font-bold uppercase tracking-wider text-[10px]">Core Optimization Focus</label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOptimizationType('SEO')}
                  className={`py-2 px-1 rounded text-center border font-semibold transition-all ${
                    optimizationType === 'SEO' 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  SEO (Search)
                </button>
                <button
                  type="button"
                  onClick={() => setOptimizationType('AEO')}
                  className={`py-2 px-1 rounded text-center border font-semibold transition-all ${
                    optimizationType === 'AEO' 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  AEO (Siri/Snp)
                </button>
                <button
                  type="button"
                  onClick={() => setOptimizationType('GEO')}
                  className={`py-2 px-1 rounded text-center border font-semibold transition-all ${
                    optimizationType === 'GEO' 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  GEO (LLMs)
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {optimizationType === 'SEO' && "Tailored for high search volumes, paragraph keywords distribution & headings flow."}
                {optimizationType === 'AEO' && "Optimized with immediate direct answers, tables, and structured JSON-LD FAQ schema nodes."}
                {optimizationType === 'GEO' && "Embedded with high-authority study references, named entities context & statistical claims."}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating optimized draft...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Write & Optimize Content
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results output panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
              <div className="flex justify-center">
                <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Drafting Semantic Content...</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Gemini is researching citations, formatting headings, weaving in context queries, and structuring corresponding OpenGraph tag arrays...
                </p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-6" id="ai-writer-results">
              
              {/* Header inside result card */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-semibold text-slate-900">Optimized Material Copy</h4>
                  <p className="text-xs text-slate-400 font-mono">Format type: Markdown (.md)</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(result.content, 'art_copy')}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    {copiedText === 'art_copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Markdown
                  </button>
                  <button
                    onClick={downloadArticle}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              </div>

              {/* Document Display block */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 max-h-[420px] overflow-y-auto whitespace-pre-wrap font-sans text-sm text-slate-800 leading-relaxed scrollbar-thin">
                {result.content}
              </div>

              {/* Outline points checklist */}
              {result.outline?.length > 0 && (
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Semantic Heading Outline Summary:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {result.outline.map((out, idx) => (
                      <div key={idx} className="p-2 bg-slate-100 rounded text-slate-600 font-mono text-[10px] truncate flex items-center gap-1">
                        <List className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {out}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Embedded pre-built title & metas optimized along the draft */}
              {result.seoOptimizedMetas && (
                <div className="space-y-3.5 border-t border-slate-100 pt-4 bg-emerald-50/20 p-4 rounded-xl border border-emerald-100/45">
                  <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Optimized Accompanying Meta Tags Generated
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-700">Meta Title Tag:</span>
                      <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-600 leading-normal truncate">
                        {result.seoOptimizedMetas.title}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-slate-700">Meta Description:</span>
                      <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-600 leading-normal line-clamp-1">
                        {result.seoOptimizedMetas.description}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {!result && !loading && (
            <div className="p-16 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 font-medium">
              Specify your subject parameters, keywords, and choose optimization level on the left to produce authority index-ready search writeups instantly.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
