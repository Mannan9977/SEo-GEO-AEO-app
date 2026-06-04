import React, { useState } from 'react';
import { AEOResult } from '../types';
import { 
  Check, 
  Copy, 
  HelpCircle, 
  Mic, 
  Sparkles, 
  UserCheck, 
  Volume2, 
  AlertCircle,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface AeoOptimizerProps {
  onAnalyzeAEO: (content: string, focusKeyword: string) => Promise<{ provider: string; mock: AEOResult }>;
  initialKeyword?: string;
}

export default function AeoOptimizer({ onAnalyzeAEO, initialKeyword = '' }: AeoOptimizerProps) {
  const [contentToAnalyze, setContentToAnalyze] = useState('');
  const [focusKeyword, setFocusKeyword] = useState(initialKeyword || 'organic dog treats');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AEOResult | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleRunAeoAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentToAnalyze) return;
    setLoading(true);
    try {
      const res = await onAnalyzeAEO(contentToAnalyze, focusKeyword);
      setResult(res.mock);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 1500);
  };

  const handleExportJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aeo_optimization_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Intro visual banner */}
      <div className="bg-indigo-900 text-white rounded-xl p-5 md:p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-505 rounded-full blur-2xl opacity-15"></div>
        <div className="space-y-1 relative z-10">
          <div className="text-indigo-200 text-xs font-mono uppercase tracking-widest font-black">Answer Engine Optimizations (AEO)</div>
          <h2 className="text-xl md:text-2xl font-display font-bold">Optimize for Zero-Click Conversational AI</h2>
          <p className="text-xs text-indigo-100 max-w-xl">
            Fine-tune content for smart speakers, structured snippet boxes, and Siri/Google Assistant searches by analyzing paragraph readability and direct helpful signal levels.
          </p>
        </div>
        <Mic className="w-16 h-16 text-indigo-400 opacity-20 shrink-0 self-end md:self-center" />
      </div>

      {/* Main Form Analyzer */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <form onSubmit={handleRunAeoAudit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase">Focus Conversational Keyword</label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. how do i identify organic puppy snack ingredients?"
                required
                className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">Input Material Scope</label>
              <div className="text-xs text-slate-400 mt-2.5 italic">Minimum 50 words recommended.</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Paste Content Draft to Optimize</label>
            <textarea
              rows={5}
              value={contentToAnalyze}
              onChange={(e) => setContentToAnalyze(e.target.value)}
              required
              placeholder="Paste your blog draft or web text copy here. We will check conversational answers quality and format paragraph definitions..."
              className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Auditing Conversational Quality...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Analyze Voice & Snippets Readiness
              </>
            )}
          </button>
        </form>
      </div>

      {loading && (
        <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-8 text-center space-y-3">
          <div className="flex justify-center">
            <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
          <h4 className="font-semibold text-slate-800">Calibrating Conversational Metrics</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Gemini is measuring the Flesch reading index, scanning for answering directness, extracting conversational Siri query patterns and preparing FAQ JSON structured markups...
          </p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6" id="aeo-analysis-results">
          {/* Answer Quality evaluations scores panel */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-3 border-r border-slate-100 last:border-0">
              <span className="text-3xl font-black font-display text-indigo-600">{result.aeoTotalScore}%</span>
              <div className="text-xs font-semibold text-slate-800 mt-2">Overall AEO Health</div>
              <p className="text-[10px] text-slate-400 leading-normal mt-1">Unified helpful signals and direct voice query compatibility rating.</p>
            </div>

            <div className="p-3 border-r border-slate-100 last:border-0 space-y-1">
              <span className="text-xl font-bold font-mono text-slate-800">{result.readabilityScore}/100</span>
              <div className="text-xs font-semibold text-slate-700 mt-1">Flesch Readability</div>
              <p className="text-[10px] text-slate-400 leading-normal">Scores above 65 mean content is highly legible for voice assistant text-to-speech.</p>
            </div>

            <div className="p-3 border-r border-slate-100 last:border-0 space-y-1">
              <span className="text-xl font-bold font-mono text-slate-800">{result.directnessScore}/100</span>
              <div className="text-xs font-semibold text-slate-700 mt-1">Response Directness</div>
              <p className="text-[10px] text-slate-400 leading-normal">Measures how immediate definition answers are stated for search spiders.</p>
            </div>

            <div className="p-3">
              <span className="text-xl font-bold font-mono text-slate-800">{result.snippetReadyScore}%</span>
              <div className="text-xs font-semibold text-slate-700 mt-1">Snippet Readiness</div>
              <p className="text-[10px] text-slate-400 leading-normal">Measures structural elements like lists or tables matching search snippet models.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Featured Snippet formatting improvements */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="font-display font-semibold text-slate-900">Featured Snippet Optimization Ideas</h4>
                  <button onClick={handleExportJSON} className="text-xs text-indigo-600 flex items-center gap-1">
                    <Download className="w-4 h-4" /> Export Audit JSON
                  </button>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  {/* Paragraph suggested formats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">1. Optimized Answer Paragraph (Definition)</span>
                      <button 
                        onClick={() => copyText(result.snippetTypeSuggestions.paragraph.suggestedMarkdown, 'snippet_p')}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                      >
                        {copiedSnippet === 'snippet_p' ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="p-3.5 bg-slate-900 rounded-lg font-mono text-indigo-300 whitespace-pre-wrap leading-relaxed">
                      {result.snippetTypeSuggestions.paragraph.suggestedMarkdown}
                    </div>
                  </div>

                  {/* List format suggestion */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">2. Structured Bulleted List (Process/Steps)</span>
                      <button 
                        onClick={() => copyText(result.snippetTypeSuggestions.list.suggestedMarkdown, 'snippet_l')}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                      >
                        {copiedSnippet === 'snippet_l' ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="p-3.5 bg-slate-900 rounded-lg font-mono text-indigo-300 whitespace-pre-wrap leading-relaxed">
                      {result.snippetTypeSuggestions.list.suggestedMarkdown}
                    </div>
                  </div>

                  {/* Table format suggested */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">3. Comparative Analytical Table</span>
                      <button 
                        onClick={() => copyText(result.snippetTypeSuggestions.table.suggestedMarkdown, 'snippet_t')}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                      >
                        {copiedSnippet === 'snippet_t' ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="p-3.5 bg-slate-900 rounded-lg font-mono text-indigo-300 whitespace-pre-wrap leading-relaxed">
                      {result.snippetTypeSuggestions.table.suggestedMarkdown}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversational Queries and People also ask lists */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <h4 className="font-display font-semibold text-slate-900 border-b border-slate-100 pb-2">"People Also Ask" (PAA) Question Banks & Voice Matches</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* PAA queries list */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-indigo-950 block">Searchers intent Questions (PAA)</span>
                    <div className="space-y-3">
                      {result.paaQuestions?.map((paa, i) => (
                        <div key={i} className="p-3 border border-slate-100 rounded-lg text-xs space-y-1.5 bg-slate-50/40">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-slate-400">PAA INTENT INDEX</span>
                            <span className="px-1 bg-indigo-50 text-indigo-600 font-bold rounded">{paa.complexity} complexity</span>
                          </div>
                          <div className="font-bold text-slate-900">"{paa.question}"</div>
                          <p className="text-slate-500 leading-relaxed italic">"{paa.suggestedAnswer}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Siri queries optimizations */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-indigo-950 block flex items-center gap-1">
                      <Volume2 className="w-4 h-4 text-indigo-600" /> Conversational Voice Assistant Matches
                    </span>
                    <div className="space-y-3">
                      {result.voiceQueries?.map((vq, i) => (
                        <div key={i} className="p-3 border border-slate-100 rounded-lg text-xs space-y-1.5 bg-slate-50/40">
                          <div className="font-bold text-slate-400 text-[10px]">Hey Siri / OK Google prompt matching:</div>
                          <div className="font-bold text-slate-900">"{vq.conversationalQuery}"</div>
                          <div className="p-2 bg-indigo-50 rounded text-indigo-950">
                            <strong>Dynamic Speech Response:</strong> <br />
                            {vq.optimizedAnswer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar FAQ JSON Schema generation */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="font-display font-semibold text-slate-900">Structured FAQs Schema</h4>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(result.faqSchemaGenerated);
                      setCopiedSchema(true);
                      setTimeout(() => setCopiedSchema(false), 2000);
                    }}
                    className="text-xs text-indigo-600 font-semibold flex items-center gap-1"
                  >
                    {copiedSchema ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Generated FAQ schema specifically mapped out based on top evaluated topic questions:
                </p>

                <div className="p-3 bg-slate-900 text-indigo-300 font-mono text-[10px] rounded-lg max-h-[220px] overflow-y-auto">
                  <pre>{result.faqSchemaGenerated}</pre>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <span className="text-xs font-bold text-slate-700 block">Identified Topic Inquiries:</span>
                  {result.faqQuestions?.map((fq, idx) => (
                    <div key={idx} className="text-xs space-y-1">
                      <div className="font-semibold text-slate-900 flex items-start gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        "{fq.q}"
                      </div>
                      <p className="text-slate-500 pl-4.5 break-words">{fq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
