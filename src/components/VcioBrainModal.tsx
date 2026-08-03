import React, { useState } from 'react';
import {
  X,
  Brain,
  Shield,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  Layers,
  HelpCircle,
  FileText,
  Building2,
  Landmark,
  GraduationCap,
  Newspaper,
  HeartHandshake,
  LineChart,
  ChevronRight,
  Send,
  Database,
  Lock,
  Cpu,
  CheckSquare
} from 'lucide-react';
import { Article } from '../types';
import { VcioEngine, ExecutiveMode, IntelligenceTier, VcioAnswer } from '../services/VcioEngine';
import { ExplainableAiEngine, ExplainableDecision } from '../services/ExplainableAiEngine';

interface VcioBrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
}

export const VcioBrainModal: React.FC<VcioBrainModalProps> = ({ isOpen, onClose, articles }) => {
  const [activeTab, setActiveTab] = useState<'briefing' | 'qa' | 'architecture' | 'tiers' | 'constitution'>('briefing');
  const [selectedMode, setSelectedMode] = useState<ExecutiveMode>('President');
  const [selectedTierFilter, setSelectedTierFilter] = useState<IntelligenceTier | 'ALL'>('ALL');
  const [temporalMemory, setTemporalMemory] = useState<'week' | 'month' | 'year' | '5years'>('week');

  // Interactive QA State
  const [customQuestion, setCustomQuestion] = useState('');
  const [activeAnswer, setActiveAnswer] = useState<VcioAnswer | null>(() =>
    VcioEngine.askVcio('What changed in Rwanda during the last week?', 'President')
  );

  // Explainability drawer state
  const [explainDecision, setExplainDecision] = useState<ExplainableDecision | null>(null);

  if (!isOpen) return null;

  const morningBrief = VcioEngine.generateMorningBrief(articles, selectedMode);

  const filteredDevelopments = morningBrief.keyDevelopments.filter(item => {
    if (selectedTierFilter === 'ALL') return true;
    return item.tier === selectedTierFilter;
  });

  const presetQuestions = [
    'What changed in Rwanda during the last week?',
    'Which ministries received the most media attention?',
    'Which organizations are becoming more influential?',
    'Which narratives are increasing?',
    'Which publishers disagree most?',
    'Which claims require verification?'
  ];

  const handleAskPreset = (q: string) => {
    setCustomQuestion(q);
    const ans = VcioEngine.askVcio(q, selectedMode);
    setActiveAnswer(ans);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    const ans = VcioEngine.askVcio(customQuestion, selectedMode);
    setActiveAnswer(ans);
  };

  const handleInspectExplainability = (title: string, summary: string) => {
    const matched = articles[0] || {
      id: 'vcio_exp_1',
      title,
      summaryShort: summary,
      category: 'Strategic Intelligence',
      country: 'Rwanda',
      timestamp: '06:00 AM CAT',
      originalUrl: 'https://veritas.intelligence/audit'
    };
    const decision = ExplainableAiEngine.evaluateArticleTransparently(matched as Article);
    setExplainDecision(decision);
  };

  const executiveModeMeta: Record<ExecutiveMode, { title: string; icon: React.ReactNode; color: string }> = {
    President: { title: 'President Mode', icon: <Landmark className="w-4 h-4" />, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    Minister: { title: 'Minister Mode', icon: <Shield className="w-4 h-4" />, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
    Investor: { title: 'Investor Mode', icon: <LineChart className="w-4 h-4" />, color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
    Journalist: { title: 'Journalist Mode', icon: <Newspaper className="w-4 h-4" />, color: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
    Researcher: { title: 'Researcher Mode', icon: <GraduationCap className="w-4 h-4" />, color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10' },
    NGO: { title: 'NGO Mode', icon: <HeartHandshake className="w-4 h-4" />, color: 'text-pink-400 border-pink-500/40 bg-pink-500/10' },
    Company: { title: 'Company Mode', icon: <Building2 className="w-4 h-4" />, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-7xl max-h-[96vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 via-indigo-600 to-purple-600 rounded-2xl text-slate-950 shadow-lg shadow-amber-500/20">
              <Brain className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-wide text-white">
                  VCIO (VERITAS CHIEF INTELLIGENCE OFFICER)
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                  THE BRAIN OF VERITAS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transforms the entire global information ecosystem into explainable, evidence-backed executive intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="text-slate-400">Memory Horizon:</span>
              <button
                onClick={() => setTemporalMemory('week')}
                className={`px-2 py-0.5 rounded transition ${temporalMemory === 'week' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                1 Wk
              </button>
              <button
                onClick={() => setTemporalMemory('month')}
                className={`px-2 py-0.5 rounded transition ${temporalMemory === 'month' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                1 Mo
              </button>
              <button
                onClick={() => setTemporalMemory('year')}
                className={`px-2 py-0.5 rounded transition ${temporalMemory === 'year' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                1 Yr
              </button>
              <button
                onClick={() => setTemporalMemory('5years')}
                className={`px-2 py-0.5 rounded transition ${temporalMemory === '5years' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                5 Yrs
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Executive Mode & Tier Ribbon */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-3 flex items-center justify-between overflow-x-auto gap-4">
          {/* Executive Mode Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Executive Mode:</span>
            {(['President', 'Minister', 'Investor', 'Journalist', 'Researcher', 'NGO', 'Company'] as ExecutiveMode[]).map(mode => {
              const meta = executiveModeMeta[mode];
              const isActive = selectedMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/30 to-indigo-600/30 border-amber-500/60 text-white shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {meta.icon}
                  <span>{mode}</span>
                </button>
              );
            })}
          </div>

          {/* VCIO Constitution Badge */}
          <div className="hidden xl:flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-xs text-amber-300 font-mono">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold">VCIO CONSTITUTION:</span>
            <span>"Never present speculation as fact."</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950/40 border-b border-slate-800 px-6 py-2 flex items-center space-x-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('briefing')}
            className={`py-2 px-4 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'briefing' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>06:00 Morning Intelligence Brief</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`py-2 px-4 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'qa' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Interactive Intelligence Query Console</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-2 px-4 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'architecture' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>VCIO System Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('tiers')}
            className={`py-2 px-4 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'tiers' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Intelligence Tier Classification</span>
          </button>

          <button
            onClick={() => setActiveTab('constitution')}
            className={`py-2 px-4 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'constitution' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Evidence Audit & Governance</span>
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/60">

          {/* TAB 1: MORNING BRIEFING */}
          {activeTab === 'briefing' && (
            <div className="space-y-6">
              
              {/* Daily Telemetry Bar */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2 text-sm font-bold text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Daily Ecosystem Ingestion Telemetry · {morningBrief.date}</span>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono text-xs font-bold">
                    Briefing Time: {morningBrief.briefTime}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 text-center font-mono">
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-amber-400 font-bold text-sm">{morningBrief.stats.articlesAnalyzed.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Articles</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-emerald-400 font-bold text-sm">{morningBrief.stats.countriesCovered}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Countries</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-blue-400 font-bold text-sm">{morningBrief.stats.languagesProcessed}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Languages</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-purple-400 font-bold text-sm">{morningBrief.stats.videosAnalyzed.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Videos</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-indigo-400 font-bold text-sm">{morningBrief.stats.publishersIndexed}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Publishers</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-pink-400 font-bold text-sm">{morningBrief.stats.governmentStatements}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Govt Docs</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-amber-300 font-bold text-sm">{morningBrief.stats.socialTrends}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Trends</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-teal-400 font-bold text-sm">{morningBrief.stats.graphChanges.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Graph Delta</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-rose-400 font-bold text-sm">{morningBrief.stats.narrativesTracked}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Narratives</div>
                  </div>
                </div>
              </div>

              {/* Executive Note Header */}
              <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl flex items-start space-x-3">
                <Brain className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    VCIO Executive Guidance ({selectedMode} Perspective)
                  </div>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">{morningBrief.executiveNote}</p>
                </div>
              </div>

              {/* Tier Filter Buttons */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 font-bold">Filter by Tier:</span>
                  {(['ALL', 'Strategic', 'Critical', 'Significant', 'Important', 'Routine'] as const).map(tier => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTierFilter(tier)}
                      className={`px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer ${
                        selectedTierFilter === tier
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
                <span className="text-slate-400 font-mono text-[11px]">
                  Showing {filteredDevelopments.length} key developments
                </span>
              </div>

              {/* Key Developments Feed */}
              <div className="space-y-4">
                {filteredDevelopments.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-amber-400 font-mono font-bold text-sm">#{idx + 1}</span>
                        <h3 className="text-base font-bold text-white">{item.title}</h3>
                      </div>

                      <div className="flex items-center space-x-2 font-mono text-xs">
                        <span className={`px-2.5 py-0.5 rounded font-bold border ${
                          item.tier === 'Strategic' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                          item.tier === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                          item.tier === 'Significant' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        }`}>
                          {item.tier.toUpperCase()} TIER
                        </span>

                        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-bold">
                          Confidence: {item.confidenceScore}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>

                    {/* Reasoning & Evidence Box */}
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800/80 text-xs space-y-2 font-mono">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Evidence Count: <strong className="text-white">{item.evidenceCount} sources</strong></span>
                        <span>Timestamp: <strong className="text-amber-300">{item.timestamp}</strong></span>
                      </div>

                      <div className="text-slate-300">
                        <span className="text-amber-400 font-bold">Reasoning:</span> {item.reasoning}
                      </div>

                      {item.unconfirmedGaps && (
                        <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                          <span className="text-rose-400 font-bold">Unconfirmed Gap:</span> {item.unconfirmedGaps}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                        <div className="flex flex-wrap gap-1 text-[10px]">
                          <span className="text-slate-500">Sources:</span>
                          {item.sources.map((src, i) => (
                            <span key={i} className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                              {src}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => handleInspectExplainability(item.title, item.summary)}
                          className="text-amber-300 hover:underline flex items-center space-x-1 cursor-pointer text-[11px]"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Audit Logic</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: INTERACTIVE QUERY CONSOLE */}
          {activeTab === 'qa' && (
            <div className="space-y-6">
              
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-amber-400" />
                      <span>Executive Intelligence Query Console</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Ask VCIO deep questions about ecosystem developments, ministry performance & narrative shifts</p>
                  </div>

                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                    Mode: {selectedMode}
                  </span>
                </div>

                {/* Preset Questions Selector */}
                <div className="space-y-2 text-xs">
                  <div className="text-slate-400 font-bold">Recommended Executive Queries:</div>
                  <div className="flex flex-wrap gap-2">
                    {presetQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAskPreset(q)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-200 hover:text-amber-300 transition cursor-pointer flex items-center space-x-1"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Query Input */}
                <form onSubmit={handleCustomSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={customQuestion}
                    onChange={e => setCustomQuestion(e.target.value)}
                    placeholder="Ask VCIO anything (e.g. 'Which companies gained the most positive coverage?')..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg cursor-pointer"
                  >
                    <span>Analyze</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* VCIO Intelligence Answer Response */}
              {activeAnswer && (
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                        VCIO INTELLIGENCE ANSWER
                      </span>
                      <h4 className="text-sm font-bold text-white font-mono">"{activeAnswer.question}"</h4>
                    </div>

                    <div className="flex items-center space-x-3 font-mono text-xs">
                      <span className="text-emerald-400 font-bold">Confidence: {activeAnswer.confidenceScore}%</span>
                      <span className="text-slate-400">Tier: {activeAnswer.intelligenceTier}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
                    {activeAnswer.answerText}
                  </p>

                  {/* Supporting Evidence Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="text-amber-400 font-bold flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Supporting Reasons ({activeAnswer.supportingSourcesCount} Sources)</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                        {activeAnswer.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="text-blue-400 font-bold flex items-center space-x-1.5">
                        <FileText className="w-4 h-4" />
                        <span>Evidence References</span>
                      </div>
                      <div className="space-y-1.5">
                        {activeAnswer.evidenceLinks.map((link, idx) => (
                          <div key={idx} className="flex items-center justify-between text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                            <div>
                              <div className="font-bold text-white">{link.title}</div>
                              <div className="text-[10px] text-slate-500">{link.source}</div>
                            </div>
                            <span className="text-emerald-400 text-[10px]">{link.confidence}% match</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Strategic Takeaway & Limitations */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-4 rounded-xl text-xs space-y-2 font-mono">
                    <div>
                      <span className="text-purple-400 font-bold">Strategic Takeaway:</span>{' '}
                      <span className="text-slate-200">{activeAnswer.strategicTakeaway}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                      <span className="text-amber-400 font-bold">Evaluation Limitations:</span> {activeAnswer.limitations}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: SYSTEM ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <span>VCIO Intelligence OS Pipeline Architecture</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">VCIO sits at the apex of the Veritas information processing pipeline, converting raw collection streams into decision-ready executive intelligence</p>
              </div>

              {/* Visual Pipeline Stack */}
              <div className="space-y-3 font-mono text-xs">
                {[
                  { step: '1. Collection Engine', desc: '18,200+ articles, RSS streams, TV transcripts, government gazettes & satellite telemetry', icon: <Database className="w-4 h-4 text-amber-400" />, count: '18,214 articles/day' },
                  { step: '2. AI Intelligence Pipeline', desc: 'Multi-lingual translation, NLP entity extraction, stance analysis & vector embeddings', icon: <Cpu className="w-4 h-4 text-emerald-400" />, count: '23 languages' },
                  { step: '3. Knowledge Graph Engine', desc: 'Continuous entity relationship mapping (persons, orgs, policies, projects)', icon: <Layers className="w-4 h-4 text-indigo-400" />, count: '2,100 delta/day' },
                  { step: '4. Narrative Intelligence', desc: 'Cluster tracking, framing evolution & media divergence calculation', icon: <Sparkles className="w-4 h-4 text-purple-400" />, count: '85 narratives' },
                  { step: '5. Verification Engine', desc: 'Source authority scoring, cross-wire corroboration & claim validation', icon: <CheckSquare className="w-4 h-4 text-blue-400" />, count: '98.6% verified' },
                  { step: '6. Decision Support Engine', desc: 'Executive risk forecasting, scenario modeling & policy alignment indices', icon: <Shield className="w-4 h-4 text-pink-400" />, count: '7 Executive Modes' },
                  { step: '7. VCIO (The Brain)', desc: 'Executive intelligence synthesis, 06:00 briefs & natural language query reasoning', icon: <Brain className="w-4 h-4 text-amber-400" />, count: 'Active Brain Node' }
                ].map((st, i) => (
                  <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">{st.icon}</div>
                      <div>
                        <div className="font-bold text-white text-sm">{st.step}</div>
                        <div className="text-slate-400 text-xs font-sans mt-0.5">{st.desc}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-bold shrink-0">
                      {st.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INTELLIGENCE TIERS */}
          {activeTab === 'tiers' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>5-Tier Intelligence Classification Framework</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Not every wire item deserves equal executive attention. VCIO categorizes findings into 5 actionable tiers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs font-mono">
                {[
                  { tier: 'Strategic', color: 'bg-purple-950/80 border-purple-500/40 text-purple-300', desc: 'Multi-year policy, sovereign trade shifts, international treaties & macro paradigm changes.' },
                  { tier: 'Critical', color: 'bg-rose-950/80 border-rose-500/40 text-rose-300', desc: 'Immediate national security posture changes, supply chain disruptions & emergency events.' },
                  { tier: 'Significant', color: 'bg-amber-950/80 border-amber-500/40 text-amber-300', desc: 'Major infrastructure milestones, central bank policy announcements & cabinet decisions.' },
                  { tier: 'Important', color: 'bg-blue-950/80 border-blue-500/40 text-blue-300', desc: 'Corporate earnings, university research releases & regional trade corridor logistics.' },
                  { tier: 'Routine', color: 'bg-slate-950/80 border-slate-800 text-slate-300', desc: 'Standard press announcements, local weather updates & scheduled civic events.' }
                ].map((t, idx) => (
                  <div key={idx} className={`p-4 border rounded-2xl space-y-2 ${t.color}`}>
                    <div className="font-bold text-sm text-white">{t.tier} Tier</div>
                    <p className="text-[11px] leading-relaxed font-sans text-slate-300">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CONSTITUTION & AUDIT */}
          {activeTab === 'constitution' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span>VCIO Constitution & Anti-Hallucination Framework</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">To ensure absolute executive trust, VCIO adheres strictly to the core principle: "Never present speculation as fact."</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs font-mono">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 font-bold text-sm text-center">
                  VCIO Core Directive: "Never present speculation as fact."
                </div>

                <div className="space-y-3">
                  <div className="font-bold text-white">Every VCIO output mandates:</div>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                    <li>Explicit Confidence Score (0-100%) computed mathematically from wire corroboration.</li>
                    <li>Number of independent supporting publishers and official government statements.</li>
                    <li>Transparent disclosure of unconfirmed gaps or missing telemetry.</li>
                    <li>Clear separation between verified factual records and market sentiment projections.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Explainable AI Modal Drawer */}
      {explainDecision && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full text-xs space-y-4 font-mono text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-amber-400">VCIO EXPLAINABILITY AUDIT LOG</span>
              <button onClick={() => setExplainDecision(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <div className="text-slate-400">Headline Evaluated:</div>
              <div className="font-bold text-white text-sm mt-0.5">{explainDecision.headline}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400">Factuality Score:</span> <strong className="text-emerald-400">{explainDecision.scores.factuality}/100</strong>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400">Source Authority:</span> <strong className="text-amber-400">{explainDecision.scores.sourceAuthority}/100</strong>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-slate-400 font-bold">Why this decision?</div>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {explainDecision.explanationPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
