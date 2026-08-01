import React, { useState } from 'react';
import { 
  X, ShieldAlert, Sliders, Activity, Play, RefreshCw, AlertTriangle, 
  CheckCircle2, Volume2, Shield, Globe, Cpu, Zap, FileText, ArrowRight, Layers
} from 'lucide-react';
import { 
  GeopoliticalSimulationEngine, 
  ScenarioVariable, 
  SimulationResult 
} from '../services/GeopoliticalSimulationEngine';

interface GeopoliticalSimulationModalProps {
  onClose: () => void;
}

export const GeopoliticalSimulationModal: React.FC<GeopoliticalSimulationModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'warroom' | 'timeline'>('simulation');
  
  // State
  const [scenarioTitle, setScenarioTitle] = useState('Global Supply Chain & Cyber Friction Test');
  const [variables, setVariables] = useState<ScenarioVariable[]>(GeopoliticalSimulationEngine.getVariables());
  const [currentResult, setCurrentResult] = useState<SimulationResult>(
    GeopoliticalSimulationEngine.runSimulation(scenarioTitle, variables)
  );

  const [isSimulating, setIsSimulating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleVariableChange = (id: string, newValue: number) => {
    setVariables(prev => prev.map(v => v.id === id ? { ...v, value: newValue } : v));
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = GeopoliticalSimulationEngine.runSimulation(scenarioTitle, variables);
      setCurrentResult(res);
      setIsSimulating(false);
      showToast(`AI Simulation Run complete! Risk Level: ${res.overallRiskLevel} (${res.confidenceScore}% confidence)`);
    }, 800);
  };

  const handleSpeakBriefing = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);

      const briefingText = `Veritas War Room Crisis Briefing. Scenario: ${currentResult.scenarioTitle}. Overall Risk Level is evaluated as ${currentResult.overallRiskLevel} with a confidence score of ${currentResult.confidenceScore} percent. Primary recommendation: ${currentResult.mitigationPlaybook[0].action}`;
      
      const utterance = new SpeechSynthesisUtterance(briefingText);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Geopolitical Predictive Simulation & Crisis War-Room</h2>
                <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span> Live Phase 8 Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Monte-Carlo Scenario Modeling, Multi-Vector Stress Testing & Automated War-Room Playbooks
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Nav Bar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'simulation' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-4 h-4" /> Predictive Scenario Builder
            </button>
            <button
              onClick={() => setActiveTab('warroom')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'warroom' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-4 h-4" /> War-Room Crisis Playbook
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'timeline' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4" /> Trajectory & Timeline Forecast
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakBriefing}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSpeaking ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Volume2 className="w-4 h-4" /> {isSpeaking ? 'Stop Audio Briefing' : 'Voice War-Room Briefing'}
            </button>
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              {isSimulating ? 'Simulating...' : 'Run AI Stress Test'}
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">

          {/* TAB 1: SCENARIO BUILDER */}
          {activeTab === 'simulation' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Variable Sliders */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-rose-400" /> Scenario Stress Parameters
                  </h3>
                  <p className="text-xs text-slate-400">Adjust risk vector probabilities for real-time Monte-Carlo evaluation</p>
                </div>

                <div className="space-y-4">
                  {variables.map(v => (
                    <div key={v.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{v.name}</span>
                        <span className="text-xs font-mono font-bold text-rose-400">{v.value}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={v.value}
                        onChange={(e) => handleVariableChange(v.id, Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />
                      <p className="text-[10px] text-slate-400">{v.description}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Custom Scenario Title</label>
                  <input 
                    type="text"
                    value={scenarioTitle}
                    onChange={(e) => setScenarioTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Right Column (2 cols): Simulation Output Dashboard */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Risk Overview Card */}
                <div className="p-6 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border border-rose-800/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-rose-300 uppercase font-bold tracking-wider block">Projected Threat Matrix Level</span>
                    <h3 className="text-2xl font-black text-white">{currentResult.scenarioTitle}</h3>
                    <p className="text-xs text-slate-400">
                      Monte-Carlo AI Confidence Score: <strong className="text-emerald-400 font-mono">{currentResult.confidenceScore}%</strong>
                    </p>
                  </div>

                  <div className={`px-5 py-3 rounded-2xl border text-center space-y-0.5 shrink-0 ${
                    currentResult.overallRiskLevel === 'EXTREME' ? 'bg-rose-500/20 border-rose-500 text-rose-300' :
                    currentResult.overallRiskLevel === 'CRITICAL' ? 'bg-amber-500/20 border-amber-500 text-amber-300' :
                    'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  }`}>
                    <span className="text-[10px] uppercase font-bold tracking-wider block">Overall Risk</span>
                    <span className="text-xl font-black">{currentResult.overallRiskLevel}</span>
                  </div>
                </div>

                {/* Outcome Vector Cards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Simulated Vector Impact Ratings</h4>
                  
                  <div className="space-y-3">
                    {currentResult.outcomes.map((out, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                            {out.category}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              out.trajectory === 'DETERIORATING' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {out.trajectory}
                            </span>
                            <span className="text-xs font-mono font-bold text-rose-400">Impact: {out.impactScore}/100</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300">{out.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: WAR-ROOM CRISIS PLAYBOOK */}
          {activeTab === 'warroom' && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-rose-400" /> Automated War-Room Counter-Measure Playbook
                    </h3>
                    <p className="text-xs text-slate-400">Pre-computed action steps generated by Veritas Geopolitical AI Command</p>
                  </div>
                  <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold">
                    PRIORITY ALPHA
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  {currentResult.mitigationPlaybook.map(item => (
                    <div key={item.step} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 font-extrabold flex items-center justify-center shrink-0">
                        {item.step}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{item.title}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">Entity: {item.responsibleEntity}</span>
                        </div>
                        <p className="text-xs text-slate-300">{item.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRAJECTORY & TIMELINE FORECAST */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" /> Projected Event Progression Timeline
                </h3>

                <div className="space-y-4">
                  {currentResult.projectedTimeline.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-rose-400 font-mono">{item.timeframe}</span>
                        <p className="text-xs text-slate-200">{item.eventPrediction}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-slate-400">Probability Index:</span>
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-bold font-mono">
                          {item.probability}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
