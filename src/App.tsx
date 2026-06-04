import React, { useState, useEffect } from 'react';
import { Project, UserStats, SEOAnalysisResult, BrokenLinksResult, BacklinkResult, KeywordResult, AEOResult, GEOResult, AIWriterParams, AIWriterResult, MetaGeneratorOutput } from './types';
import Dashboard from './components/Dashboard';
import SeoAudit from './components/SeoAudit';
import MetaSchema from './components/MetaSchema';
import AeoOptimizer from './components/AeoOptimizer';
import GeoStudio from './components/GeoStudio';
import AiWriter from './components/AiWriter';
import { 
  Globe, 
  Search, 
  HelpCircle, 
  Sparkles, 
  Activity, 
  BarChart, 
  BookOpen, 
  FileText, 
  Compass, 
  Award,
  Bot,
  Zap,
  Briefcase
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'seo_audit' | 'meta_schema' | 'aeo_opt' | 'geo_opt' | 'ai_writer'>('dashboard');
  
  // Core application data loaded from API
  const [stats, setStats] = useState<UserStats>({
    searchesUsed: 0,
    searchesLimit: 100,
    plan: 'Free',
    projectsCount: 0,
    savedReportsCount: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  // Selected state for easy cross-tab audits
  const [selectedUrl, setSelectedUrl] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState('');

  // Fetch initial stats and list data
  const loadStatsAndProjects = async () => {
    try {
      const response = await fetch('/api/user/info');
      if (response.ok) {
        const data = await response.json();
        if (data.stats) setStats(data.stats);
        if (data.projects) setProjects(data.projects);
        if (data.reports) setReports(data.reports);
      }
    } catch (err) {
      console.error("Failed to load project database stats:", err);
    }
  };

  useEffect(() => {
    loadStatsAndProjects();
  }, []);

  // API Interaction Handlers
  const handleAddProject = async (p: { name: string; url: string; targetKeyword: string }) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
      if (response.ok) {
        await loadStatsAndProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetPlan = async (plan: 'Free' | 'Pro' | 'Agency') => {
    try {
      const response = await fetch('/api/user/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (response.ok) {
        await loadStatsAndProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Callback to select a project and direct the user to the auditor
  const handleSelectProject = (url: string, keyword: string) => {
    setSelectedUrl(url);
    setSelectedKeyword(keyword);
    setActiveTab('seo_audit');
  };

  // API Call proxies for children components
  const analyzeSEO = async (url: string, keyword: string): Promise<SEOAnalysisResult> => {
    const res = await fetch('/api/seo/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, keyword }),
    });
    const data = await res.json();
    await loadStatsAndProjects();
    return data;
  };

  const checkLinks = async (url: string): Promise<BrokenLinksResult> => {
    const res = await fetch('/api/links/checker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    return await res.json();
  };

  const analyzeBacklinks = async (url: string): Promise<BacklinkResult> => {
    const res = await fetch('/api/backlinks/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    return await res.json();
  };

  const researchKeyword = async (keyword: string): Promise<KeywordResult> => {
    const res = await fetch('/api/keyword/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword }),
    });
    const data = await res.json();
    await loadStatsAndProjects();
    return data;
  };

  const generateMeta = async (keyword: string, tone: string, description: string): Promise<{ provider: string; mock: MetaGeneratorOutput }> => {
    const res = await fetch('/api/meta/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, tone, description }),
    });
    return await res.json();
  };

  const analyzeAEO = async (content: string, focusKeyword: string): Promise<{ provider: string; mock: AEOResult }> => {
    const res = await fetch('/api/aeo/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, focusKeyword }),
    });
    const data = await res.json();
    await loadStatsAndProjects();
    return data;
  };

  const analyzeGEO = async (content: string, targetAudience: string): Promise<{ provider: string; mock: GEOResult }> => {
    const res = await fetch('/api/geo/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, targetAudience }),
    });
    const data = await res.json();
    await loadStatsAndProjects();
    return data;
  };

  const generateContent = async (params: AIWriterParams): Promise<{ provider: string; mock: AIWriterResult }> => {
    const res = await fetch('/api/writer/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col font-sans" id="applet-primary-root">
      {/* Universal Sticky Top Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-850 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-gradient-indigo text-lg">
            S
          </div>
          <div>
            <span className="font-extrabold text-sm md:text-base tracking-tight block">SEO, AEO & GEO Studio</span>
            <span className="text-[10px] text-indigo-300 font-mono tracking-wider font-semibold uppercase block">Generative Discovery Suite</span>
          </div>
        </div>

        {/* Global Action Header Badges */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 bg-slate-850 text-slate-300 px-3 py-1.5 rounded-full border border-slate-800">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Plan: <b className="text-amber-400">{stats.plan}</b></span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-850 text-slate-300 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Queries Used: <b>{stats.searchesUsed} / {stats.searchesLimit}</b></span>
          </div>
        </div>
      </header>

      {/* Main Full-Stack Workspace Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar Menu Navigation */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 p-4 space-y-2 shrink-0 md:sticky md:top-[69px] md:h-[calc(100vh-69px)] overflow-y-auto">
          <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-3 mb-2 block">
            Navigation Console
          </div>
          
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2.5 transition-all duration-150 ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 shadow-xs border-l-4 border-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-5/50'}`}
            >
              <Briefcase className="w-4 h-4 text-indigo-500" />
              <span>Executive Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('seo_audit')}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2.5 transition-all duration-150 ${activeTab === 'seo_audit' ? 'bg-indigo-50 text-indigo-700 shadow-xs border-l-4 border-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-5/50'}`}
            >
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Standard Website SEO</span>
            </button>

            <button
              onClick={() => setActiveTab('meta_schema')}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2.5 transition-all duration-150 ${activeTab === 'meta_schema' ? 'bg-indigo-50 text-indigo-700 shadow-xs border-l-4 border-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-5/50'}`}
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Meta Tags & JSON Schema</span>
            </button>

            <button
              onClick={() => setActiveTab('aeo_opt')}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2.5 transition-all duration-150 ${activeTab === 'aeo_opt' ? 'bg-indigo-50 text-indigo-700 shadow-xs border-l-4 border-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-5/50'}`}
            >
              <HelpCircle className="w-4 h-4 text-teal-500" />
              <span>Voice Snippet (AEO)</span>
            </button>

            <button
              onClick={() => setActiveTab('geo_opt')}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2.5 transition-all duration-150 ${activeTab === 'geo_opt' ? 'bg-indigo-50 text-indigo-700 shadow-xs border-l-4 border-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-5/50'}`}
            >
              <Bot className="w-4 h-4 text-purple-500" />
              <span>Generative Engine (GEO)</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_writer')}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2.5 transition-all duration-150 ${activeTab === 'ai_writer' ? 'bg-indigo-50 text-indigo-700 shadow-xs border-l-4 border-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-5/50'}`}
            >
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Smart Search Optimizer Writer</span>
            </button>
          </nav>
        </aside>

        {/* Content Container Frame */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard 
              stats={stats} 
              projects={projects} 
              reports={reports} 
              onAddProject={handleAddProject} 
              onSetPlan={handleSetPlan}
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'seo_audit' && (
            <SeoAudit 
              onAnalyzeSEO={analyzeSEO} 
              onCheckLinks={checkLinks} 
              onAnalyzeBacklinks={analyzeBacklinks} 
              onResearchKeyword={researchKeyword}
              initialUrl={selectedUrl}
              initialKeyword={selectedKeyword}
            />
          )}

          {activeTab === 'meta_schema' && (
            <MetaSchema onGenerateMeta={generateMeta} />
          )}

          {activeTab === 'aeo_opt' && (
            <AeoOptimizer onAnalyzeAEO={analyzeAEO} initialKeyword={selectedKeyword} />
          )}

          {activeTab === 'geo_opt' && (
            <GeoStudio onAnalyzeGEO={analyzeGEO} initialContent={''} initialAudience={''} />
          )}

          {activeTab === 'ai_writer' && (
            <AiWriter onGenerateContent={generateContent} />
          )}
        </main>
      </div>
    </div>
  );
}
