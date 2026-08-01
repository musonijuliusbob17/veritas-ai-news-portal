import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { AgentOrchestrator, AgentExecutionRequest } from '../services/AgentOrchestrator';
import { AgentTaskManager, AgentTask, AgentType } from '../services/AgentTaskManager';
import { AgentPerformanceMonitor } from '../services/AgentPerformanceMonitor';
import { AgentFeedbackEngine, FeedbackRating } from '../services/AgentFeedbackEngine';
import { InvestigationEngine, InvestigationRecord, InvestigationDomain } from '../services/InvestigationEngine';
import { IntelligenceReportService, ReportType, GeneratedReport } from '../services/IntelligenceReportService';
import { RiskMonitoringEngine, RiskEvaluationResult } from '../services/RiskMonitoringEngine';
import { 
  Bot, ShieldCheck, Cpu, Terminal, FileText, Search, Play, CheckCircle2, 
  AlertTriangle, Plus, Eye, Share2, Layers, RefreshCw, Activity, ArrowRight,
  TrendingUp, Download, Check, ThumbsUp, ThumbsDown, History, BarChart2, Star
} from 'lucide-react';

interface IntelligenceWorkspaceProps {
  articles: Article[];
  onSelectArticle?: (article: Article) => void;
}

export const IntelligenceWorkspace: React.FC<IntelligenceWorkspaceProps> = ({
  articles,
  onSelectArticle
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'agents' | 'investigations' | 'reports' | 'risks'>('agents');
  
  // Agent State
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('News Analyst Agent');
  const [taskTitle, setTaskTitle] = useState('Analyze Regional Sovereign AI Infrastructure');
  const [taskPrompt, setTaskPrompt] = useState('Evaluate $1.5B venture capital influx and compute node growth in Kigali.');
  const [isExecuting, setIsExecuting] = useState(false);

  // Investigation State
  const [investigations, setInvestigations] = useState<InvestigationRecord[]>([]);
  const [selectedInv, setSelectedInv] = useState<InvestigationRecord | null>(null);
  const [newInvTitle, setNewInvTitle] = useState('');
  const [newInvDomain, setNewInvDomain] = useState<InvestigationDomain>('Technology Research');
  const [newNoteText, setNewNoteText] = useState('');

  // Report State
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('Daily Intelligence Brief');
  const [currentReport, setCurrentReport] = useState<GeneratedReport | null>(null);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  // Risk State
  const [riskEval, setRiskEval] = useState<RiskEvaluationResult | null>(null);

  useEffect(() => {
    setTasks(AgentTaskManager.getTasks());
    const invs = InvestigationEngine.getInvestigations();
    setInvestigations(invs);
    if (invs.length > 0) setSelectedInv(invs[0]);
    setRiskEval(RiskMonitoringEngine.evaluateSystemRisk(articles));
    
    // Default initial report
    setCurrentReport(IntelligenceReportService.generateReport('Daily Intelligence Brief', articles));
  }, [articles]);

  const handleRunAgentTask = async () => {
    if (!taskTitle || !taskPrompt) return;
    setIsExecuting(true);
    
    const req: AgentExecutionRequest = {
      title: taskTitle,
      agentType: selectedAgent,
      prompt: taskPrompt,
      targetArticles: articles
    };

    await AgentOrchestrator.dispatchAgentTask(req);
    setTasks(AgentTaskManager.getTasks());
    setIsExecuting(false);
  };

  const handleCreateInvestigation = () => {
    if (!newInvTitle) return;
    const inv = InvestigationEngine.createInvestigation(newInvTitle, newInvDomain, articles.slice(0, 3));
    setInvestigations(InvestigationEngine.getInvestigations());
    setSelectedInv(inv);
    setNewInvTitle('');
  };

  const handleAddNoteToInv = () => {
    if (!selectedInv || !newNoteText) return;
    InvestigationEngine.addNote(selectedInv.id, newNoteText);
    setInvestigations(InvestigationEngine.getInvestigations());
    setSelectedInv({ ...selectedInv, notes: [...selectedInv.notes, newNoteText] });
    setNewNoteText('');
  };

  const handleGenerateReport = () => {
    const rep = IntelligenceReportService.generateReport(selectedReportType, articles);
    setCurrentReport(rep);
  };

  const handleCopyMarkdown = () => {
    if (!currentReport) return;
    navigator.clipboard.writeText(currentReport.markdownContent);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col">
      {/* Workspace Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">Veritas Intelligence Operating System (VIOS) Workspace</h3>
          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-mono border border-indigo-500/30 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            HUMAN-AI COLLABORATION
          </span>
        </div>

        {/* Workspace Sub-Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'agents', label: '1. AI Agents & Tasks', icon: Bot },
            { id: 'investigations', label: '2. Investigations', icon: Search },
            { id: 'reports', label: '3. Intelligence Reports', icon: FileText },
            { id: 'risks', label: '4. Risk Monitor', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  active 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: AI AGENTS & TASKS */}
      {activeSubTab === 'agents' && (
        <div className="p-5 space-y-6">
          {/* Safeguard #1: Agent Performance Analytics Banner */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            {(() => {
              const sys = AgentPerformanceMonitor.getSystemOverview();
              const fb = AgentFeedbackEngine.getFeedbackStats();
              return (
                <>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <BarChart2 className="w-3 h-3 text-indigo-400" /> Agent Accuracy Rate
                    </span>
                    <span className="text-xl font-bold text-emerald-400">{sys.overallAccuracy}%</span>
                    <span className="text-[9px] text-slate-500 block">Across 121k+ dispatches</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <Activity className="w-3 h-3 text-blue-400" /> Avg Execution Speed
                    </span>
                    <span className="text-xl font-bold text-blue-400">{sys.avgProcessingSpeedSeconds}s</span>
                    <span className="text-[9px] text-slate-500 block">Sub-second inference</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-purple-400" /> Analyst Feedback Rate
                    </span>
                    <span className="text-xl font-bold text-purple-400">{fb.satisfactionRate}%</span>
                    <span className="text-[9px] text-slate-500 block">Approved without edit</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" /> Human Correction Rate
                    </span>
                    <span className="text-xl font-bold text-amber-400">{sys.humanCorrectionAverage}%</span>
                    <span className="text-[9px] text-slate-500 block">Human-in-the-loop active</span>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent Control Form */}
            <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" /> Dispatch Specialized AI Agent
              </h4>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Select Agent Type:</label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value as AgentType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                >
                  {AgentOrchestrator.getAvailableAgents().map(ag => (
                    <option key={ag.type} value={ag.type}>
                      {ag.type} ({ag.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Task Title:</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Verify Subsea Fiber Cable Throughput Claims"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Agent Prompt / Instruction Payload:</label>
                <textarea
                  rows={3}
                  value={taskPrompt}
                  onChange={(e) => setTaskPrompt(e.target.value)}
                  placeholder="Enter detailed prompt..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                onClick={handleRunAgentTask}
                disabled={isExecuting}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                {isExecuting ? 'Executing Agent Pipeline...' : 'Run Agent Execution Task'}
              </button>
            </div>

            {/* Task Log History */}
            <div className="lg:col-span-2 p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white font-mono flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Agent Execution Log & Feedback Loop
                </span>
                <span className="text-xs text-slate-400">Tasks: {tasks.length}</span>
              </h4>

              <div className="space-y-3 max-h-96 overflow-y-auto no-scrollbar">
                {tasks.map(t => (
                  <div key={t.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold">
                          {t.agentType}
                        </span>
                        <span className="font-bold text-white">{t.title}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {t.status} ({t.progressPercentage}%)
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] italic">"{t.inputPayload}"</p>

                    {t.outputResult && (
                      <div className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-2">
                        <div className="text-emerald-300 text-[11px]">{t.outputResult}</div>

                        {/* Safeguard #2: Human Analyst Feedback Loop */}
                        {t.status === 'COMPLETED' && (
                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">Rate Agent Output Quality:</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => AgentFeedbackEngine.submitFeedback(t.id, t.agentType, 'CORRECT')}
                                className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30 flex items-center gap-1 cursor-pointer"
                              >
                                <ThumbsUp className="w-3 h-3" /> Correct
                              </button>
                              <button
                                onClick={() => AgentFeedbackEngine.submitFeedback(t.id, t.agentType, 'NEEDS_IMPROVEMENT')}
                                className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded border border-amber-500/30 flex items-center gap-1 cursor-pointer"
                              >
                                <AlertTriangle className="w-3 h-3" /> Needs Improvement
                              </button>
                              <button
                                onClick={() => AgentFeedbackEngine.submitFeedback(t.id, t.agentType, 'INCORRECT')}
                                className="px-2 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded border border-rose-500/30 flex items-center gap-1 cursor-pointer"
                              >
                                <ThumbsDown className="w-3 h-3" /> Incorrect
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-1 pt-1 border-t border-slate-900 text-[10px] text-slate-400">
                      {t.logs.map((l, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>[{new Date(l.timestamp).toLocaleTimeString()}] {l.message}</span>
                          <span className="text-slate-500">{l.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INVESTIGATIONS */}
      {activeSubTab === 'investigations' && (
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Investigation List & New Form */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" /> Start New Investigation
                </h4>

                <input
                  type="text"
                  placeholder="Investigation Title (e.g. East Africa Green Microgrid)"
                  value={newInvTitle}
                  onChange={(e) => setNewInvTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />

                <select
                  value={newInvDomain}
                  onChange={(e) => setNewInvDomain(e.target.value as InvestigationDomain)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                >
                  <option value="Political Analysis">Political Analysis</option>
                  <option value="Economic Research">Economic Research</option>
                  <option value="Technology Research">Technology Research</option>
                  <option value="Company Intelligence">Company Intelligence</option>
                  <option value="Climate Analysis">Climate Analysis</option>
                  <option value="Security Analysis">Security Analysis</option>
                </select>

                <button
                  onClick={handleCreateInvestigation}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Create Investigation Desk
                </button>
              </div>

              {/* Active Investigations */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 font-mono uppercase">Active Investigation Desks:</h4>
                <div className="space-y-2">
                  {investigations.map(inv => (
                    <div
                      key={inv.id}
                      onClick={() => setSelectedInv(inv)}
                      className={`p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                        selectedInv?.id === inv.id
                          ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white truncate">{inv.title}</span>
                        <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-indigo-400">{inv.domain.split(' ')[0]}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Updated: {inv.lastUpdated}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Investigation Inspector */}
            {selectedInv && (
              <div className="lg:col-span-2 p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[10px] font-mono font-bold">
                      {selectedInv.domain} • RISK: {selectedInv.riskRating}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{selectedInv.title}</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Lead: {selectedInv.leadAnalyst}</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300">
                  <span className="font-bold text-indigo-400 block font-mono">Background Summary:</span>
                  {selectedInv.backgroundSummary}
                </div>

                {/* Key Actors & Entities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                    <span className="font-bold text-slate-300 block">Key Actors:</span>
                    {selectedInv.keyActors.map((actor, idx) => (
                      <div key={idx} className="text-slate-400">• {actor}</div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                    <span className="font-bold text-slate-300 block">Mapped Entities:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedInv.entities.map((e, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-900 text-indigo-300 border border-slate-800 rounded text-[10px]">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Findings & Recommendations */}
                <div className="p-3.5 bg-slate-950 rounded-xl space-y-2 text-xs font-mono">
                  <span className="font-bold text-emerald-400 block">Core Investigation Findings:</span>
                  {selectedInv.findings.map((f, i) => (
                    <div key={i} className="text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-400 shrink-0">✓</span> {f}
                    </div>
                  ))}
                </div>

                {/* Safeguard #3: Investigation Version History */}
                {selectedInv.versionHistory && selectedInv.versionHistory.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-indigo-400" /> Investigation Version History & AI Audit Trail ({selectedInv.versionHistory.length} Revisions):
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar font-mono text-[11px]">
                      {selectedInv.versionHistory.map(v => (
                        <div key={v.versionNumber} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-indigo-400">Version {v.versionNumber}.0 • {v.author}</span>
                            <span className="text-slate-500">{v.date}</span>
                          </div>
                          <div className="text-slate-300">📝 Summary: {v.changeSummary}</div>
                          <div className="text-slate-400 italic text-[10px]">🤖 AI Reasoning: {v.reasoning}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Analyst Notes */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-300 font-mono block">Analyst Notes:</span>
                  <div className="space-y-1.5">
                    {selectedInv.notes.map((n, idx) => (
                      <div key={idx} className="p-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 font-mono">
                        • {n}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add analyst note to this investigation..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                    <button
                      onClick={handleAddNoteToInv}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REPORTS */}
      {activeSubTab === 'reports' && (
        <div className="p-5 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-white text-sm font-mono">Generate Intelligence Report:</span>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value as ReportType)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
              >
                {IntelligenceReportService.getSavedReportTemplates().map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md transition-all"
              >
                Compile Report
              </button>

              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                {copiedMarkdown ? 'Copied Markdown' : 'Export Markdown'}
              </button>
            </div>
          </div>

          {currentReport && (
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-mono font-bold">
                    {currentReport.classification}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{currentReport.title}</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Threat Level: {currentReport.riskAssessment.threatLevel}</span>
              </div>

              {/* Safeguard #4: Report Intelligence Scoring Card */}
              {currentReport.qualityScore && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall Quality</span>
                    <span className="text-sm font-bold text-indigo-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" /> {currentReport.qualityScore.grade}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase block">Source Coverage</span>
                    <span className="text-sm font-bold text-emerald-400">{currentReport.qualityScore.sourceCoverage}%</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase block">Evidence Strength</span>
                    <span className="text-sm font-bold text-emerald-400">{currentReport.qualityScore.evidenceStrength}%</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase block">Confidence Score</span>
                    <span className="text-sm font-bold text-blue-400">{currentReport.qualityScore.confidenceScore}%</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase block">Completeness</span>
                    <span className="text-sm font-bold text-purple-400">{currentReport.qualityScore.completenessScore}%</span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-slate-950 rounded-xl space-y-2 text-xs text-slate-300">
                <span className="font-bold text-indigo-400 block font-mono">Executive Summary:</span>
                <p className="leading-relaxed">{currentReport.executiveSummary}</p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <span className="font-bold text-slate-200 block">Key Strategic Insights:</span>
                {currentReport.keyInsights.map((k, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">•</span> {k}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-950 rounded-xl space-y-2 text-xs font-mono">
                <span className="font-bold text-slate-400 block">Raw Report Markdown Preview:</span>
                <pre className="p-3 bg-slate-900 rounded-lg text-slate-300 overflow-x-auto text-[11px]">
                  {currentReport.markdownContent}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: RISK MONITOR */}
      {activeSubTab === 'risks' && riskEval && (
        <div className="p-5 space-y-6">
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-mono">Macro Risk Composite Score:</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-black text-emerald-400">{riskEval.compositeScore} / 100</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono font-bold">
                  {riskEval.overallThreatLevel} RISK ENVIRONMENT
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">Evaluated at: {new Date(riskEval.evaluatedAt).toLocaleTimeString()}</span>
          </div>

          {/* Domain Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {riskEval.domainDetails.map(d => (
              <div key={d.domain} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{d.domain} Risk</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-indigo-400 rounded font-bold">{d.score} / 100</span>
                </div>

                <div className="text-slate-400 text-[11px]">Threat Rating: <span className="text-emerald-400">{d.threatLevel}</span></div>

                <div className="space-y-1 pt-1 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400 font-bold block">Top Drivers:</span>
                  {d.topDrivers.map((drv, i) => (
                    <div key={i} className="text-slate-300">• {drv}</div>
                  ))}
                </div>

                <div className="p-2 bg-slate-950 rounded text-[11px] text-indigo-300 mt-2">
                  💡 Mitigation: {d.mitigationStrategy}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
