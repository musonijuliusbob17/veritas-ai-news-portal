import React, { useState } from 'react';
import { 
  X, ShieldCheck, Cpu, Layers, Activity, Radio, Sparkles, CheckCircle2, 
  AlertTriangle, Lock, Globe, Server, FileText, Download, Zap
} from 'lucide-react';
import { 
  GlobalGovernanceOrchestratorService, 
  PlatformEngineHealth, 
  ExecutiveConsensusReport 
} from '../services/GlobalGovernanceOrchestratorService';

interface GlobalGovernanceCommandModalProps {
  onClose: () => void;
}

export const GlobalGovernanceCommandModal: React.FC<GlobalGovernanceCommandModalProps> = ({ onClose }) => {
  const [engines] = useState<PlatformEngineHealth[]>(GlobalGovernanceOrchestratorService.getEngineHealth());
  const [report, setReport] = useState<ExecutiveConsensusReport>(GlobalGovernanceOrchestratorService.generateExecutiveConsensus());
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRefreshConsensus = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newRep = GlobalGovernanceOrchestratorService.generateExecutiveConsensus();
      setReport(newRep);
      setIsGenerating(false);
      showToast('Master Executive Consensus re-synthesized across all 10 Phase engines!');
    }, 600);
  };

  const handleEmergencyOverride = () => {
    showToast('🚨 EMERGENCY PROTOCOL TRIGGERED: All 10 Phase Engines set to Ultra-High Verification Isolation.');
  };

  const avgSystemAccuracy = (engines.reduce((acc, e) => acc + e.accuracy, 0) / engines.length).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400">
              <Layers className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Veritas Master Governance & Command Vault</h2>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Phase 1-10 Orchestrated
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Unified Platform Operations Deck, Executive AI Consensus & System-Wide Security Isolation
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

        {/* Toast Notification */}
        {toastMsg && (
          <div className="mx-6 mt-4 p-3 bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 rounded-xl text-xs flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">

          {/* Master Consensus Banner */}
          <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-800 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Master Executive AI Consensus Briefing</h3>
                </div>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">{report.keySystemInsight}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleRefreshConsensus}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Zap className={`w-4 h-4 text-amber-300 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Synthesizing...' : 'Re-Synthesize Consensus'}
                </button>
                <button
                  onClick={handleEmergencyOverride}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" /> Security Lock Protocol
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-indigo-900/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Consensus Confidence</span>
                <span className="text-xl font-bold text-emerald-400">{report.consensusConfidence}%</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall System Accuracy</span>
                <span className="text-xl font-bold text-indigo-300">{avgSystemAccuracy}%</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Global Threat Index</span>
                <span className="text-xl font-bold text-cyan-400">{report.globalThreatIndex} / 100 (Nominal)</span>
              </div>
            </div>
          </div>

          {/* Engine Health Grid (All 10 Phases) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Platform Engine Operational Roster (Phases 1 - 10)</span>
              <span className="text-xs text-slate-400 font-normal">100% Unified Architecture</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {engines.map(eng => (
                <div key={eng.phase} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded text-[9px] font-bold">
                      PHASE {eng.phase}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2 min-h-[32px]">{eng.engineName}</h4>

                  <div className="text-[10px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-900">
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <strong className="text-emerald-400 font-mono">{eng.accuracy}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Processes:</span>
                      <strong className="text-indigo-300 font-mono">{eng.activeProcesses}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Action Plan */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Active Platform Governance Directives
            </h3>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-bold text-emerald-400 block uppercase">Primary Strategic Directive</span>
              <p className="text-xs text-slate-200 leading-relaxed">{report.recommendedAction}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
