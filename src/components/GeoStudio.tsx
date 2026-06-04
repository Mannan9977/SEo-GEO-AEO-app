import React, { useState } from 'react';
import { GEOResult } from '../types';
import { 
  Sparkles,
  Bot,
  Brain,
  Link,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Bookmark,
  Share2,
  List,
  Compass,
  FileCheck,
  Award,
  BookOpen,
  RefreshCw,
  Cpu
} from 'lucide-react';

interface GeoStudioProps {
  onAnalyzeGEO: (content: string, targetAudience: string) => Promise<{ provider: string; mock: GEOResult }>;
  initialContent?: string;
  initialAudience?: string;
}

export default function GeoStudio({ onAnalyzeGEO, initialContent = '', initialAudience = '' }: GeoStudioProps) {
  const [content, setContent] = useState(initialContent);
  const [targetAudience, setTargetAudience] = useState(initialAudience || 'General online shoppers and organic dog owners');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GEOResult | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setLoading(true);
    try {
      const res = await onAnalyzeGEO(content, targetAudience);
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

  return (
    <div className="space-y-6">
      {/* Visual intro gradient block */}
      <div className="bg-gradient-to-r from-purple-900 via-violet-950 to-indigo-950 text-white rounded-xl p-5 md:p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-purple-500 rounded-full blur-2xl opacity-15"></div>
        <div className="space-y-1 relative z-10">
          <div className="text-purple-300 text-xs font-mono uppercase tracking-widest font-black">Generative Engine Optimization (GEO)</div>
          <h2 className="text-xl md:text-2xl font-display font-bold">Incorporate True Citations for AI Discovery</h2>
          <p className="text-xs text-purple-100 max-w-xl">
            Evaluate how search engines like ChatGPT, Gemini, and Perplexity retrieve, cite, and reference your website during conversational inquiry. Boost authoritas.
          </p>
        </div>
        <Bot className="w-16 h-16 text-purple-400 opacity-20 shrink-0 self-end md:self-center" />
      </div>

      {/* Main Form Analyzer */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <form onSubmit={handleRunAudit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Target Audience Profile</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Health-focused pet owners searching for clean organic alternatives"
                className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-end text-xs text-slate-400 italic pb-2">
              Identify who will prompt search bots. We analyze semantic entities matching their demographic intent.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Article Content or Web Draft Copy</label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Paste your content draft to test indexing. We look for authoritative claims, statistics density, and entity structures..."
              className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500"
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
                Processing Citation Graph with Gemini AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-400" />
                Analyze GEO Citation & E-E-A-T Visibility
              </>
            )}
          </button>
        </form>
      </div>

      {loading && (
        <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-8 text-center space-y-3">
          <div className="flex justify-center">
            <RefreshCw className="w-10 h-10 text-purple-600 animate-spin" />
          </div>
          <h4 className="font-semibold text-slate-800">Compiling LLM Discovery Ranks</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Gemini is evaluating entity metrics, calculating unbacked citation vulnerabilities, formulating simulated dialogue models for Claude and Perplexity, and structuring semantic markup...
          </p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6" id="geo-analysis-results">
          {/* Top Level Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Total score gauge block */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Total GEO Score</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black font-display text-purple-600">{result.geoTotalScore}%</span>
                  <span className="text-xs text-slate-400">Visibility Weight</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Calculated based on entity citation density, statistics correctness, and simulation readiness. Higher scores mean LLMs are exponentially more likely to reference you inside citations lists.
                </p>
              </div>
              <div className="border-t border-slate-100 pt-3.5 mt-4 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>EEAT Confidence Level:</span>
                <span className={result.geoTotalScore > 70 ? "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded" : "text-amber-700 bg-amber-50 px-2 py-0.5 rounded"}>
                  {result.geoTotalScore > 70 ? "High Authority" : "Needs Citations"}
                </span>
              </div>
            </div>

            {/* Visibility indices */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Model Retrieval Index</h4>
              <p className="text-xs text-slate-500 mb-2">Simulated probability percentage of your page appearing in structured AI chats.</p>
              
              <div className="space-y-3 font-sans text-xs">
                {/* 1. ChatGPT */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Cpu className="w-3.5 h-3.5 text-emerald-600" /> ChatGPT (GPT-4o)
                    </span>
                    <span className="font-mono">{result.visibilityScores.chatGPT}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${result.visibilityScores.chatGPT}%` }}></div>
                  </div>
                </div>

                {/* 2. Gemini */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Brain className="w-3.5 h-3.5 text-indigo-600" /> Gemini 1.5/2.0
                    </span>
                    <span className="font-mono">{result.visibilityScores.gemini}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${result.visibilityScores.gemini}%` }}></div>
                  </div>
                </div>

                {/* 3. Perplexity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Link className="w-3.5 h-3.5 text-teal-600" /> Perplexity Search
                    </span>
                    <span className="font-mono">{result.visibilityScores.perplexity}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${result.visibilityScores.perplexity}%` }}></div>
                  </div>
                </div>

                {/* 4. Claude */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Bot className="w-3.5 h-3.5 text-rose-600" /> Claude 3.5 Sonnet
                    </span>
                    <span className="font-mono">{result.visibilityScores.claude}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-rose-600 h-2 rounded-full" style={{ width: `${result.visibilityScores.claude}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* E-E-A-T trust signals and unbacked claims detector */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="font-display font-semibold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-5 h-5 text-purple-600" />
                    Citations Readiness & E-E-A-T Scan
                  </h4>
                  <span className="text-xs bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded">
                    Score: {result.citationReadiness.score}/100
                  </span>
                </div>

                {/* Check list boolean metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <span className="text-slate-400 uppercase tracking-wide block text-[10px]">Author Credentials</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span className={result.citationReadiness.signals.authorCredentials ? "text-emerald-600" : "text-amber-500"}>
                        {result.citationReadiness.signals.authorCredentials ? "✓ Provided" : "✗ Missing"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <span className="text-slate-400 uppercase tracking-wide block text-[10px]">References list block</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span className={result.citationReadiness.signals.referencesList ? "text-emerald-600" : "text-amber-500"}>
                        {result.citationReadiness.signals.referencesList ? "✓ Verified" : "✗ Incomplete"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <span className="text-slate-400 uppercase tracking-wide block text-[10px]">Quantitative Statistics</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span className={result.citationReadiness.signals.concreteStats ? "text-emerald-600" : "text-amber-500"}>
                        {result.citationReadiness.signals.concreteStats ? "✓ Found Stats" : "✗ No Stats"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Unbacked Claims Warnings */}
                {result.citationReadiness.unbackedClaims?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      Unbacked claims missing proof indexes:
                    </span>
                    <div className="space-y-1.5">
                      {result.citationReadiness.unbackedClaims.map((claim, idx) => (
                        <p key={idx} className="p-2.5 bg-rose-50/50 text-rose-950 font-sans text-xs rounded border border-rose-100">
                          {claim}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Conversational Simulation responses in action */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <h4 className="font-display font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Cpu className="w-5 h-5 text-indigo-600" />
                  Simulated AI Response Dialogue Output
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.simulations?.map((sim, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl space-y-3.5 border border-slate-150">
                      <div className="flex justify-between items-center text-xs">
                        <strong className="text-slate-900 font-bold">{sim.engine} Engine Simulation</strong>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-black ${sim.willCite ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {sim.willCite ? `Will Cite (${sim.citationPercentage}%)` : ' broad response lack cite'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-sans italic leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                        "{sim.simulatedResponse}"
                      </p>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-black text-[10px] text-slate-400 block uppercase tracking-wide">Missing Key Details:</span>
                          <span className="text-slate-600 block italic leading-tight mt-0.5">
                            {sim.missingInfo?.join(", ") || "None flagged."}
                          </span>
                        </div>
                        <div>
                          <span className="font-black text-[10px] text-slate-400 block uppercase tracking-wide">Source authority gap:</span>
                          <span className="text-amber-700 block italic leading-tight mt-0.5">
                            {sim.authorityGaps?.join(", ") || "No significant gap."}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Semantic Entity Graph & Content Enhancement */}
            <div className="space-y-6">
              
              {/* Entity extraction card */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <h4 className="font-display font-semibold text-slate-900 border-b border-slate-100 pb-1">Identified Entities Graph</h4>
                <p className="text-[10px] text-slate-400 leading-tight">Named elements linked for knowledge structures context:</p>
                
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {result.entities?.map((ent, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 font-sans">{ent.name}</span>
                        <span className="block text-[8px] uppercase tracking-wide font-mono text-purple-600 font-bold">{ent.type}</span>
                      </div>
                      <span className="font-mono text-slate-400 text-[10px]">Rel: {ent.relevance}%</span>
                    </div>
                  ))}
                </div>

                {result.knowledgeGraphRelations?.length > 0 && (
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Discovered Relationship Edges:</span>
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto font-mono text-[10px] text-slate-600">
                      {result.knowledgeGraphRelations.map((rel, id) => (
                        <div key={id} className="p-1.5 bg-purple-50 text-purple-950 rounded leading-none flex items-center justify-between">
                          <span>{rel.source}</span>
                          <span className="text-[8px] bg-indigo-100 text-indigo-700 px-1 rounded-sm mx-1 font-bold">{rel.relationship}</span>
                          <span>{rel.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions Enhancer */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <h4 className="font-display font-semibold text-slate-900 border-b border-slate-100 pb-1">EEAT Content Enhancements</h4>
                
                <div className="space-y-2.5 text-xs text-slate-600 font-sans">
                  {result.chunksAnalysis?.suggestions?.map((sug, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="w-5 h-5 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-tight text-slate-700">{sug}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 border-t border-slate-100 pt-3 text-xs">
                  <span className="font-bold text-slate-800 block">High impact citation insert suggestions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.contentEnhancements.entityInsertions?.map((ins, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-mono">
                        +{ins}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Optimized Structural Draft</span>
                    <button 
                      onClick={() => copyToClipboard(result.contentEnhancements.optimizedStructureMarkdown, 'opt_mark')}
                      className="text-purple-600 font-bold text-[11px]"
                    >
                      {copiedText === 'opt_mark' ? 'Copied!' : 'Copy md'}
                    </button>
                  </div>
                  <div className="p-3 bg-slate-900 text-indigo-300 font-mono text-[10px] rounded-lg max-h-[180px] overflow-y-auto whitespace-pre-wrap">
                    {result.contentEnhancements.optimizedStructureMarkdown}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
