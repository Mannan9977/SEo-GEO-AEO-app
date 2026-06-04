import React, { useState } from 'react';
import { Project, UserStats } from '../types';
import { 
  Briefcase, 
  Plus, 
  Settings, 
  ShieldAlert, 
  TrendingUp, 
  Zap, 
  Users, 
  DollarSign, 
  Globe, 
  CheckCircle, 
  FileText, 
  Sparkles,
  Search,
  ExternalLink,
  Crown
} from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
  projects: Project[];
  reports: any[];
  onAddProject: (p: { name: string; url: string; targetKeyword: string }) => void;
  onSetPlan: (plan: 'Free' | 'Pro' | 'Agency') => void;
  onSelectProject: (url: string, keyword: string) => void;
}

export default function Dashboard({ 
  stats, 
  projects, 
  reports, 
  onAddProject, 
  onSetPlan,
  onSelectProject
}: DashboardProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectKeyword, setProjectKeyword] = useState('');
  
  // Plans Pricing Configuration
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'plan' | 'checkout' | 'success'>('plan');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !projectUrl || !projectKeyword) return;
    onAddProject({
      name: projectName,
      url: projectUrl,
      targetKeyword: projectKeyword
    });
    setProjectName('');
    setProjectUrl('');
    setProjectKeyword('');
    setShowAddModal(false);
  };

  const handleCheckoutSubmit = (plan: 'Pro' | 'Agency') => {
    onSetPlan(plan);
    setPaymentStep('success');
    setTimeout(() => {
      setCheckoutPlan(null);
      setPaymentStep('plan');
    }, 2000);
  };

  return (
    <div className="space-y-8" id="dashboard-tab-view">
      {/* Premium Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-15"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 font-medium text-xs px-3 py-1 rounded-full border border-indigo-500/30">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Optimized For Search, Answer, & Generative Engines</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-display font-medium tracking-tight">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-400 font-semibold">ma.mannan.9977@gmail.com</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl">
              Welcome to your ultimate search console. Optimize articles, evaluate citing trends on Perplexity or ChatGPT, and build structured voice schema markups on a single hub.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shrink-0">
            <div>
              <div className="text-xs text-slate-400">Current Tier Status</div>
              <div className="text-lg font-bold text-amber-300 flex items-center gap-1">
                <Crown className="w-4 h-4 fill-amber-300 text-amber-500" />
                {stats.plan} Account
              </div>
            </div>
            {stats.plan === 'Free' && (
              <button 
                onClick={() => setCheckoutPlan('Pro')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-lg shadow-lg shadow-indigo-600/30 transition-all duration-150"
              >
                Upgrade Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Audit Stats Dashboard Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-dashboard-grid">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Registered Projects</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{projects.length} / 5</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle className="w-3.5 h-3.5" /> Tracked live
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-indigo-50/80 text-indigo-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Completed Audits</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{reports.length} Reports</span>
            <span className="text-xs text-slate-500 mt-1 block">SEO, AEO & GEO tests saved</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-indigo-50/80 text-indigo-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">API Usage limits</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{stats.searchesUsed} / {stats.searchesLimit}</span>
            <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-2">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full" 
                style={{ width: `${Math.min(100, (stats.searchesUsed / stats.searchesLimit) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-indigo-50/80 text-indigo-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Average Web Score</span>
            <span className="text-2xl font-bold text-indigo-600 mt-1 block">
              {projects.length ? Math.round(projects.reduce((acc, curr) => acc + (curr.seoScore || 0), 0) / projects.length) : 0}%
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Across search frameworks</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="projects-monitoring-wrapper">
        {/* Left column: Projects and SAVED domains */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-semibold text-slate-900">Your Monitored Projects</h3>
                <p className="text-xs text-slate-500 mt-0.5">Quickly trigger audit modules with target search keywords.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>
            
            <div className="divide-y divide-slate-100">
              {projects.map((proj) => (
                <div key={proj.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm sm:text-base">{proj.name}</span>
                      <a href={proj.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium text-[10px]">
                        URL: {proj.url}
                      </span>
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium text-[10px]">
                        Keyword: {proj.targetKeyword}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:self-center">
                    {/* Tiny Health Metrics indicators */}
                    <div className="flex items-center gap-4 mr-2">
                      <div className="text-center">
                        <span className="block text-[9px] text-slate-400 font-bold uppercase">SEO</span>
                        <span className="font-mono text-xs font-semibold text-emerald-600">{proj.seoScore || '--'}</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-[9px] text-slate-400 font-bold uppercase">AEO</span>
                        <span className="font-mono text-xs font-semibold text-indigo-600">{proj.aeoScore || '--'}</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-[9px] text-slate-400 font-bold uppercase">GEO</span>
                        <span className="font-mono text-xs font-semibold text-purple-600">{proj.geoScore || '--'}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onSelectProject(proj.url, proj.targetKeyword)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Analyze Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Audits list table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-lg font-display font-semibold text-slate-900">Recent Completed Auditing Logs</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">Historic reports and cache metrics from server databases.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3">Audit Domain</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Score</th>
                    <th className="px-5 py-3">Date Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-900">
                        {rep.url}
                        <span className="block text-[11px] text-slate-400 font-normal">Target: "{rep.keyword}"</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rep.type === 'SEO' ? 'bg-emerald-100 text-emerald-800' : 
                          rep.type === 'AEO' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {rep.type} Audit
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono font-bold text-slate-900">{rep.score}%</td>
                      <td className="px-5 py-3 text-xs text-slate-500">{new Date(rep.analyzedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
                        No previous audit history generated yet. Get started by typing in a website!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: Plans overview and monetization */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 p-5 shadow-xs space-y-4">
            <h3 className="font-display font-semibold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Pro Plans & API Limits
            </h3>
            
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              Unlock unlimited AI capabilities for Answer Engines (AEO) and Generative Engines (GEO). Upgrade to leverage advanced citation analysis & high speed content writing under our Pro plans.
            </p>

            <div className="space-y-2 border-t border-indigo-100 pt-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Free searches used</span>
                <span className="font-semibold text-slate-950">{stats.searchesUsed} / 100</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>PDF Document Exports</span>
                <span className="font-semibold text-slate-950">{stats.plan === 'Free' ? 'Watermarked' : 'Unbounded PDF'}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>API Raw Keys limit</span>
                <span className="font-semibold text-slate-950">{stats.plan === 'Agency' ? 'Unlimited' : 'None'}</span>
              </div>
            </div>

            {stats.plan === 'Free' ? (
              <button 
                onClick={() => setCheckoutPlan('Pro')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2.5 rounded-lg text-center font-semibold tracking-wide transition-colors"
              >
                Go Pro - $49/mo
              </button>
            ) : (
              <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-2.5 rounded-lg border border-emerald-100 text-center">
                Your account is currently {stats.plan} Active
              </div>
            )}
          </div>

          {/* Quick Help Tips */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-3 shadow-xs">
            <h4 className="font-semibold text-slate-900 text-sm">Understanding Optimization Tiers</h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li className="flex gap-2">
                <span className="font-bold text-slate-800 shrink-0">1. Traditional SEO:</span> 
                Focuses on meta headers, speed rates and robots file crawl compliance for classic desktop spiders.
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-slate-800 shrink-0">2. AEO (Answer Engine):</span> 
                Optimizes text snippets and FAQs schema markup for conversational agents like Alexa or voice assistant queries.
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-slate-800 shrink-0">3. GEO (Generative Optimization):</span> 
                Fine-tunes content for citations, semantic entity links, and knowledge database parsing by generative models (ChatGPT, Claude, Gemini, Perplexity).
              </li>
            </ul>
          </div>

          {/* Core System Dashboard Toggle Button */}
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-slate-500" />
            {showAdminPanel ? 'Close Admin Dashboard' : 'Open Global Admin Dashboard'}
          </button>
        </div>
      </div>

      {/* Global Administrative Simulator Panel (Requested in spec) */}
      {showAdminPanel && (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-6 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Administrative Simulation Console
              </div>
              <h3 className="text-xl font-display font-medium text-white mt-1">Global System Settings & Analytics</h3>
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 text-xs font-mono px-3 py-1 rounded border border-emerald-500/20">
              SYSTEM LEVEL: LIVE PREVIEW
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">TOTAL SUBSCRIBERS</span>
              <span className="text-2xl font-bold text-white mt-1 block">1,824 Users</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Free Tier: 1,420 | Pro/Agency: 404</span>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">GLOBAL MRR</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1 block">$24,942 USD</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Target MRR Progress: 82%</span>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">ACTIVE SESSIONS TODAY</span>
              <span className="text-2xl font-bold text-white mt-1 block">348 Live</span>
              <span className="text-[11px] text-indigo-400 mt-1 block">Gemini API status: Active</span>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">SYSTEM API RATE LIMIT</span>
              <span className="text-2xl font-bold text-amber-400 mt-1 block">2,500/Hour</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Threshold limits buffer ok</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 bg-slate-950 rounded-lg space-y-3">
              <h4 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">Global Plan Configurator</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Edit threshold limits, toggle search boundaries, or check API rules configs dynamically. Changes apply instantly.
              </p>
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-400 uppercase font-mono">Manage Plan Tiers Limits</label>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => onSetPlan('Free')} className={`px-3 py-1 rounded text-xs ${stats.plan === 'Free' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Free (100)</button>
                    <button onClick={() => onSetPlan('Pro')} className={`px-3 py-1 rounded text-xs ${stats.plan === 'Pro' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Pro (2500)</button>
                    <button onClick={() => onSetPlan('Agency')} className={`px-3 py-1 rounded text-xs ${stats.plan === 'Agency' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Agency (Unlimited)</button>
                  </div>
                </div>
                <div className="border-t border-slate-800 pt-3">
                  <div className="text-xs font-mono text-slate-400 flex justify-between">
                    <span>Stripe Live Web Hook status:</span>
                    <span className="text-emerald-400">CONNECTING</span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 flex justify-between mt-1">
                    <span>Database Engine status:</span>
                    <span className="text-emerald-400">ONLINE (MEMORY/JSON)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg space-y-3">
              <h4 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">Simulated Live Transaction Logs</h4>
              <div className="space-y-2 max-h-[140px] overflow-y-auto font-mono text-[11px] text-slate-400">
                <div className="flex justify-between hover:bg-slate-900 p-1 rounded">
                  <span className="text-slate-300">USER upgrade request: Pro</span>
                  <span className="text-indigo-400">ma.mannan.9977@gmail.com</span>
                </div>
                <div className="flex justify-between hover:bg-slate-900 p-1 rounded">
                  <span className="text-slate-300">Stripe payment received: $49</span>
                  <span className="text-emerald-400">SUCCESS</span>
                </div>
                <div className="flex justify-between hover:bg-slate-900 p-1 rounded">
                  <span className="text-slate-300">Gemini model initialized</span>
                  <span className="text-indigo-400">gemini-3.5-flash</span>
                </div>
                <div className="flex justify-between hover:bg-slate-900 p-1 rounded">
                  <span className="text-slate-300">System checklist parsed 22 links</span>
                  <span className="text-slate-500">2026-06-03</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200/60 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="text-lg font-display font-semibold text-slate-900">Add New Website/Project</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>
            
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Project Name</label>
                <input 
                  type="text" 
                  value={projectName} 
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Organic Dog Treats Shopify Store" 
                  required
                  className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Target Domain URL</label>
                <input 
                  type="url" 
                  value={projectUrl} 
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://organicpettreats.com" 
                  required
                  className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Primary Target Keyword</label>
                <input 
                  type="text" 
                  value={projectKeyword} 
                  onChange={(e) => setProjectKeyword(e.target.value)}
                  placeholder="healthy dog treats organic" 
                  required
                  className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-lg"
                >
                  Register Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Monetization Checkout simulation modal */}
      {checkoutPlan && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200/80 max-w-md w-full p-6 space-y-6">
            {paymentStep === 'plan' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="text-xl font-display font-bold text-slate-900">Upgrade your Subscription</h4>
                  <button onClick={() => setCheckoutPlan(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">×</button>
                </div>
                
                <p className="text-xs text-slate-500">
                  Unlock unlimited GEO simulations, complete voice snippet optimization tables, and dynamic AI outlines writer modules.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setCheckoutPlan('Pro')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${checkoutPlan === 'Pro' ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="text-xs font-bold text-indigo-700 uppercase">PRO PLAN</div>
                    <div className="text-2xl font-black text-slate-900 mt-2">$49<span className="text-xs font-normal text-slate-400">/mo</span></div>
                    <ul className="text-[10px] text-slate-500 space-y-1 mt-3 list-disc pl-4">
                      <li>Unlimited AEO/SEO Analyses</li>
                      <li>2,500 monthly keys quota</li>
                      <li>Full GEO simulation dashboards</li>
                    </ul>
                  </div>

                  <div 
                    onClick={() => setCheckoutPlan('Agency')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${checkoutPlan === 'Agency' ? 'border-purple-600 bg-purple-50/20' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="text-xs font-bold text-purple-700 uppercase">AGENCY PLAN</div>
                    <div className="text-2xl font-black text-slate-900 mt-2">$149<span className="text-xs font-normal text-slate-400">/mo</span></div>
                    <ul className="text-[10px] text-slate-500 space-y-1 mt-3 list-disc pl-4">
                      <li>Everything in Pro plus:</li>
                      <li>White Label reports</li>
                      <li>Priority custom LLM tuning</li>
                      <li>Team Account Access</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50/70 p-3 rounded-lg border border-slate-100 mt-3">
                  <span className="text-xs text-slate-500 font-medium">Auto recurring billing</span>
                  <span className="text-xs font-bold text-slate-800">No lock-in contracts</span>
                </div>

                <button 
                  onClick={() => setPaymentStep('checkout')}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3 rounded-lg transition-all"
                >
                  Proceed to Payment Selection
                </button>
              </div>
            )}

            {paymentStep === 'checkout' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="text-lg font-display font-semibold text-slate-900 flex items-center gap-1.5">
                    Secure Stripe Checkout Gateway
                  </h4>
                  <button onClick={() => setPaymentStep('plan')} className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold">‹ Go Back</button>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/40 space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Subscribing plan:</span>
                    <span className="font-bold text-slate-900">{checkoutPlan} Edition</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Billing cycle:</span>
                    <span className="text-slate-800 font-medium">Monthly Renewal</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-900 font-bold border-t border-slate-200 pt-2 mt-2">
                    <span>Total Due Now</span>
                    <span>{checkoutPlan === 'Pro' ? '$49.00 USD' : '$149.00 USD'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Card Holder Name</label>
                    <input type="text" defaultValue="M. A. Mannan" className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Card Credentials</label>
                    <input 
                      type="text" 
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Expiry (MM/YY)</label>
                      <input type="text" defaultValue="11 / 28" placeholder="MM/YY" className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">CVV Number</label>
                      <input type="password" defaultValue="•••" placeholder="CVV" className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => setCheckoutPlan(null)}
                    className="w-1/3 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleCheckoutSubmit(checkoutPlan as 'Pro' | 'Agency')}
                    className="w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-lg text-center transition-all"
                  >
                    Pay & Activate Instant Access
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="space-y-4 text-center py-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h4 className="text-xl font-display font-medium text-slate-900">Subscription Updated!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Payment processed successfully via credit card account. Enjoy unrestricted access to our core SEO, AEO and GEO intelligence suites!
                </p>
                <div className="text-xs font-mono text-slate-400 bg-slate-50 py-1.5 rounded-lg">
                  Ref: TXN-STRIPE-{Math.floor(Math.random() * 900000 + 100000)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
