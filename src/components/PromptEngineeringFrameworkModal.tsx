import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Terminal,
  Layers,
  ArrowRight,
  Code2,
  Cpu,
  BookOpen,
  CheckCircle2,
  Copy,
  Info,
  Workflow,
  Download,
  Zap,
  Play,
  MessageSquare,
  Radio,
  Share2,
  ShieldCheck,
  RefreshCw,
  Clock,
  Database
} from 'lucide-react';
import {
  PromptEngineeringEngine,
  SpecialistPrompt,
  ChainExecutionResult,
  SpecialistMessage
} from '../services/PromptEngineeringEngine';

interface PromptEngineeringFrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptEngineeringFrameworkModal: React.FC<PromptEngineeringFrameworkModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'specialists' | 'communication' | 'chaining' | 'runner' | 'principles'>('specialists');
  const [selectedPromptId, setSelectedPromptId] = useState<string>('prompt_news_analyst');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live Runner State
  const [testTitle, setTestTitle] = useState<string>(
    'Sovereign Digital Infrastructure Initiative Expands Across East African Economic Zone'
  );
  const [testBody, setTestBody] = useState<string>(
    'KIGALI — Afreximbank and the East African Community today signed a $2.5B multilateral agreement establishing a sovereign compute and cross-border digital settlement node in Kigali. President Paul Kagame and regional central bank governors confirmed the facility will process PAPSS transactions with sub-second latency while enforcing zero-trust data sovereignty principles.'
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ChainExecutionResult | null>(null);

  if (!isOpen) return null;

  const prompts = PromptEngineeringEngine.getAllPrompts();
  const chains = PromptEngineeringEngine.getAllChains();
  const activePrompt = PromptEngineeringEngine.getPromptById(selectedPromptId) || prompts[0];

  const categories = ['ALL', 'Extraction', 'Analysis', 'Transformation', 'Graph & Reasoning', 'Risk & Credibility'];

  const filteredPrompts = selectedCategory === 'ALL'
    ? prompts
    : prompts.filter(p => p.category === selectedCategory);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunChain = async () => {
    setIsRunning(true);
    setExecutionResult(null);
    try {
      const res = await PromptEngineeringEngine.executeChainWithGemini(
        'chain_full_intelligence_swarm',
        { title: testTitle, bodyText: testBody, publisher: 'Veritas Sovereign Wire' }
      );
      setExecutionResult(res);
    } catch (err) {
      console.error('Error running specialist chain:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-7xl max-h-[94vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-purple-600/20">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-wide">AI Specialists & Prompt Chaining Architecture</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full">
                  10 AI Specialists Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-specialist intelligence network with structured payload communication, topic bus routing, and prompt chaining
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => alert('Exporting AI Specialist System Prompts & Communication Specification (JSON/Markdown)...')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>Export Specifications</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center space-x-2 text-xs shrink-0">
            <button
              onClick={() => setActiveTab('specialists')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'specialists' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>10 AI Specialists ({prompts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('communication')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'communication' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Inter-Specialist Communication</span>
            </button>

            <button
              onClick={() => setActiveTab('chaining')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'chaining' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>Prompt Chaining Mechanics</span>
            </button>

            <button
              onClick={() => setActiveTab('runner')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'runner' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Play className="w-4 h-4 text-emerald-300" />
              <span>Live Gemini Chain Runner</span>
            </button>

            <button
              onClick={() => setActiveTab('principles')}
              className={`py-2 px-4 rounded-xl font-semibold transition flex items-center space-x-2 ${
                activeTab === 'principles' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Architecture Principles</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-purple-400 shrink-0">
            <Cpu className="w-3.5 h-3.5" />
            <span>Gemini 3.6 Flash Powered</span>
          </div>
        </div>

        {/* Main Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/60 space-y-6">

          {/* TAB 1: 10 AI SPECIALISTS LIBRARY */}
          {activeTab === 'specialists' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Specialist Selector */}
              <div className="lg:col-span-4 space-y-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-1.5 bg-slate-950 p-2 border border-slate-800 rounded-xl text-[11px]">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${
                        selectedCategory === cat
                          ? 'bg-purple-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Prompt List */}
                <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                  {filteredPrompts.map(p => {
                    const isSelected = p.id === selectedPromptId;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPromptId(p.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition space-y-1.5 ${
                          isSelected
                            ? 'bg-purple-950/40 border-purple-500/60 text-white shadow-lg shadow-purple-900/10'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>{p.name}</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-purple-300 rounded border border-slate-700">
                            Temp: {p.temperature}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {p.purpose}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                          <span>Cat: {p.category}</span>
                          <span className="text-purple-400">{p.id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Specialist Inspector */}
              <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
                
                {/* Selected Specialist Title Header */}
                <div className="border-b border-slate-800 pb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-white">{activePrompt.name}</h3>
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded">
                        {activePrompt.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{activePrompt.purpose}</p>
                  </div>

                  <button
                    onClick={() => handleCopy(activePrompt.systemPrompt, 'sys')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-purple-300 flex items-center space-x-1.5 transition"
                  >
                    {copiedId === 'sys' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'sys' ? 'Copied System Prompt' : 'Copy System Prompt'}</span>
                  </button>
                </div>

                {/* System Prompt Block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-purple-400">
                    <span className="flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>System Instruction (Role Persona & Rules)</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">Temperature: {activePrompt.temperature}</span>
                  </div>
                  <pre className="bg-slate-900 border border-slate-800/90 rounded-xl p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-52">
                    {activePrompt.systemPrompt}
                  </pre>
                </div>

                {/* Inter-Specialist Communication Contract Pill */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 text-xs font-mono">
                  <div className="text-amber-400 font-bold flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-amber-400" />
                    <span>Inter-Specialist Communication Contract</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500">CONSUMES TOPICS:</span>
                      <div className="text-blue-300 font-bold mt-1">
                        {activePrompt.communicationProtocol.consumesTopics.join(', ')}
                      </div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500">EMITS TOPIC:</span>
                      <div className="text-emerald-300 font-bold mt-1">
                        {activePrompt.communicationProtocol.emitsTopics.join(', ')}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans pt-1">
                    {activePrompt.communicationProtocol.messageContract}
                  </p>
                </div>

                {/* Input Template & Output Schema */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Input Template */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-blue-400 flex items-center space-x-1.5">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Input Variables Template</span>
                    </div>
                    <pre className="bg-slate-900 border border-slate-800/90 rounded-xl p-3.5 text-xs font-mono text-blue-200 whitespace-pre-wrap h-40 overflow-y-auto">
                      {activePrompt.inputTemplate}
                    </pre>
                  </div>

                  {/* Output Schema */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Structured JSON Output Schema</span>
                    </div>
                    <pre className="bg-slate-900 border border-slate-800/90 rounded-xl p-3.5 text-xs font-mono text-emerald-200 whitespace-pre-wrap h-40 overflow-y-auto">
                      {activePrompt.outputFormatSchema}
                    </pre>
                  </div>
                </div>

                {/* Explanation & Design Justification */}
                <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                    <Info className="w-4 h-4 text-purple-400" />
                    <span>Specialist Role Rationale</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activePrompt.explanation}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: INTER-SPECIALIST COMMUNICATION PROTOCOL */}
          {activeTab === 'communication' && (
            <div className="space-y-6">
              
              {/* Architecture Explanation Banner */}
              <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950 border border-purple-500/30 rounded-2xl p-6 space-y-3">
                <div className="flex items-center space-x-2 text-white font-bold text-base">
                  <Radio className="w-5 h-5 text-purple-400" />
                  <span>How AI Specialists Communicate With Each Other</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                  Rather than making independent isolated calls, Veritas AI Specialists communicate through a <strong>Shared Context Blackboard</strong> and an <strong>Event-Driven Message Bus</strong>. When a specialist executes, it reads its input dependencies from topic channels on the blackboard, performs its specialized reasoning with Gemini 3.6 Flash, and publishes a signed payload object containing structured data, quotes, and confidence scores onto topic channels for downstream specialists.
                </p>
              </div>

              {/* Data Flow Diagram / Payload Table */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <h4 className="text-base font-bold text-white flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    <span>10-Specialist Inter-Communication Protocol Matrix</span>
                  </h4>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 border border-emerald-800 rounded-lg">
                    Typed Payload Contracts Active
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono text-[11px]">
                        <th className="p-3">Sender Specialist</th>
                        <th className="p-3">Topic Channel Emitted</th>
                        <th className="p-3">Message Payload Contract</th>
                        <th className="p-3">Target Downstream Specialists</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {prompts.filter(p => !p.id.includes('legacy')).map((sp) => (
                        <tr key={sp.id} className="hover:bg-slate-900/40 transition">
                          <td className="p-3 font-bold text-white font-sans flex items-center space-x-2">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>{sp.name}</span>
                          </td>
                          <td className="p-3 text-emerald-400">
                            {sp.communicationProtocol.emitsTopics.join(', ')}
                          </td>
                          <td className="p-3 text-slate-300 font-sans max-w-md">
                            {sp.communicationProtocol.messageContract}
                          </td>
                          <td className="p-3 text-blue-300">
                            {sp.communicationProtocol.downstreamSpecialistIds.map(id => {
                              const target = PromptEngineeringEngine.getPromptById(id);
                              return target ? target.name : id;
                            }).join(', ') || 'Terminal Briefing Output'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: PROMPT CHAINING MECHANICS */}
          {activeTab === 'chaining' && (
            <div className="space-y-6">
              
              {/* Introduction Banner */}
              <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-6 space-y-3">
                <div className="flex items-center space-x-2 text-white font-bold text-base">
                  <Workflow className="w-5 h-5 text-purple-400" />
                  <span>Prompt Chaining Mechanics & Sequential Pipeline Control</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                  <strong>Prompt Chaining</strong> breaks complex intelligence synthesis into deterministic specialist stages. Each step receives validated output JSON from the shared message bus of step <em>N-1</em>. This prevents model hallucinations, enforces strict zero-trust credibility auditing, and maintains schema fidelity.
                </p>
              </div>

              {/* Chain Visualization Cards */}
              {chains.map((chain) => (
                <div key={chain.chainId} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
                  
                  <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>{chain.chainName}</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{chain.description}</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg">
                      {chain.steps.length} Sequential Pipeline Stages
                    </span>
                  </div>

                  {/* Sequential Steps Flow */}
                  <div className="space-y-4">
                    {chain.steps.map((step, idx) => {
                      const promptObj = PromptEngineeringEngine.getPromptById(step.promptId);
                      return (
                        <div key={step.stepNumber} className="relative">
                          {idx > 0 && (
                            <div className="flex justify-center my-2">
                              <ArrowRight className="w-4 h-4 text-purple-400 rotate-90" />
                            </div>
                          )}

                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                                {step.stepNumber < 10 ? `0${step.stepNumber}` : step.stepNumber}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-white text-sm">{step.stepName}</span>
                                  <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 border border-purple-800 rounded">
                                    {step.promptId}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300 mt-1">{step.description}</p>
                              </div>
                            </div>

                            {/* Inputs & Outputs Pill */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-[11px] font-mono shrink-0 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                              <div>
                                <span className="text-slate-500">IN: </span>
                                <span className="text-blue-300">{step.inputSource}</span>
                              </div>
                              <span className="text-slate-700 hidden sm:inline">→</span>
                              <div>
                                <span className="text-slate-500">OUT: </span>
                                <span className="text-emerald-300">{step.outputProduced}</span>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}

            </div>
          )}

          {/* TAB 4: LIVE GEMINI CHAIN RUNNER */}
          {activeTab === 'runner' && (
            <div className="space-y-6">
              
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center space-x-2">
                      <Play className="w-5 h-5 text-emerald-400" />
                      <span>Live 10-Specialist Prompt Chain Runner (Gemini 3.6 Flash)</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Execute the full 10-specialist chain in real time. Watch messages pass across the inter-specialist bus to synthesize a C-suite briefing.
                    </p>
                  </div>

                  <button
                    onClick={handleRunChain}
                    disabled={isRunning}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white shadow-lg shadow-emerald-600/20 flex items-center space-x-2 transition cursor-pointer"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Executing 10 Specialists...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-white fill-white" />
                        <span>Run 10-Specialist Chain</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Article Title</label>
                    <input
                      type="text"
                      value={testTitle}
                      onChange={(e) => setTestTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Article Copy / News Wire Body</label>
                    <textarea
                      rows={3}
                      value={testBody}
                      onChange={(e) => setTestBody(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Live Results Panel */}
              {executionResult && (
                <div className="space-y-6">
                  
                  {/* Execution Summary Bar */}
                  <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex items-center space-x-2 text-emerald-300 font-bold">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>Pipeline Execution Completed Successfully</span>
                    </div>
                    <div className="flex items-center space-x-4 font-mono text-[11px] text-slate-300">
                      <span>Latency: <strong className="text-emerald-400">{executionResult.executionDurationMs}ms</strong></span>
                      <span>Specialists Run: <strong className="text-emerald-400">{executionResult.stepResults.length}</strong></span>
                      <span>Inter-Specialist Messages: <strong className="text-purple-400">{executionResult.interSpecialistMessages.length}</strong></span>
                    </div>
                  </div>

                  {/* Final Executive Briefing Result Card */}
                  {executionResult.finalExecutiveBriefing && (
                    <div className="bg-slate-950/90 border border-purple-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-sm font-bold text-purple-300 flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span>Master Executive Intelligence Briefing (Synthesized Output)</span>
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full">
                          {executionResult.finalExecutiveBriefing.credibilityBadge || 'Verified'}
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl">
                          <span className="text-purple-400 font-bold block mb-1">EXECUTIVE VERDICT:</span>
                          <p className="text-slate-100 font-medium leading-relaxed">
                            {executionResult.finalExecutiveBriefing.executiveVerdict}
                          </p>
                        </div>

                        {executionResult.finalExecutiveBriefing.keyStrategicPillars && (
                          <div className="space-y-2">
                            <span className="text-slate-400 font-semibold text-[11px]">KEY STRATEGIC PILLARS:</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {executionResult.finalExecutiveBriefing.keyStrategicPillars.map((p: any, idx: number) => (
                                <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                                  <span className="text-purple-300 font-bold text-xs">{p.heading}</span>
                                  <p className="text-slate-300 text-[11px] leading-relaxed">{p.detail}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {executionResult.finalExecutiveBriefing.actionableNextSteps && (
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                            <span className="text-emerald-400 font-bold block">ACTIONABLE NEXT STEPS:</span>
                            <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                              {executionResult.finalExecutiveBriefing.actionableNextSteps.map((step: string, idx: number) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Inter-Specialist Messages Bus Inspector */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
                      <Radio className="w-4 h-4 text-purple-400" />
                      <span>Inter-Specialist Communication Bus Log ({executionResult.interSpecialistMessages.length} Messages)</span>
                    </h4>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1 font-mono text-[11px]">
                      {executionResult.interSpecialistMessages.map((msg: SpecialistMessage) => (
                        <div key={msg.messageId} className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-purple-400 font-bold">
                              [Step 0{msg.stepNumber}] {msg.senderSpecialistName}
                            </span>
                            <span className="text-slate-500">{msg.timestamp}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-[10px]">
                            <span className="text-slate-500">TOPIC:</span>
                            <span className="text-emerald-400 font-bold">{msg.topic}</span>
                            <span className="text-slate-500">➔ RECIPIENTS:</span>
                            <span className="text-blue-300">{msg.recipientSpecialistIds.join(', ') || 'Terminal Subscriber'}</span>
                          </div>
                          <pre className="bg-slate-950 p-2.5 rounded-lg text-slate-300 overflow-x-auto text-[10px]">
                            {JSON.stringify(msg.payload, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 5: ARCHITECTURE PRINCIPLES */}
          {activeTab === 'principles' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>Veritas Specialist Architecture Principles & Best Practices</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">Core guidelines governing multi-specialist AI chaining across Veritas intelligence services</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <div className="font-bold text-purple-300 text-sm flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>1. Strict Single-Responsibility Role Scoping</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Every specialist is given a narrow identity ("Veritas News Analyst", "Veritas Entity Extractor"). This prevents identity drift, reduces prompt size, and guarantees output schema compliance.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <div className="font-bold text-blue-300 text-sm flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>2. Inter-Specialist Bus Payload Isolation</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Specialists communicate exclusively via structured topic messages on the shared context bus. Downstream prompts receive validated JSON payloads from upstream specialists rather than raw unstructured text.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-300 text-sm flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>3. Deterministic Temperature Calibration</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Extraction and auditing specialists (Entity Extractor, Fact Extraction, Timeline) use near-zero temperature (0.1) to prevent hallucinated nodes. Analysis specialists use 0.2–0.3 for natural framing.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <div className="font-bold text-amber-300 text-sm flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>4. Transparent Explainable Reasoning</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    As required in Phase 7 Explainable AI, scoring prompts (Evidence Analyst, Credibility Auditor) MUST output their mathematical breakdown formulas rather than raw unexplained numbers.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
