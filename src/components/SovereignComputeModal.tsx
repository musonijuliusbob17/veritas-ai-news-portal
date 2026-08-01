import React, { useState } from 'react';
import { 
  X, Server, Cpu, ShieldCheck, Activity, Zap, RefreshCw, CheckCircle2, 
  Globe, Database, Lock, AlertCircle, HardDrive
} from 'lucide-react';
import { 
  SovereignComputeTelemetryService, 
  ComputeNode, 
  TelemetryLog 
} from '../services/SovereignComputeTelemetryService';

interface SovereignComputeModalProps {
  onClose: () => void;
}

export const SovereignComputeModal: React.FC<SovereignComputeModalProps> = ({ onClose }) => {
  const [nodes, setNodes] = useState<ComputeNode[]>(SovereignComputeTelemetryService.getNodes());
  const [logs, setLogs] = useState<TelemetryLog[]>(SovereignComputeTelemetryService.getLogs());
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [pingingNodeId, setPingingNodeId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePingNode = (id: string) => {
    setPingingNodeId(id);
    setTimeout(() => {
      const newLatency = SovereignComputeTelemetryService.pingNode(id);
      setNodes(SovereignComputeTelemetryService.getNodes());
      setPingingNodeId(null);
      showToast(`Node latency refreshed: ${newLatency} ms (Ultra-Fast Edge Response)`);
    }, 400);
  };

  const handleRebalance = (id: string) => {
    const updated = SovereignComputeTelemetryService.rebalanceCompute(id);
    if (updated) {
      setNodes(SovereignComputeTelemetryService.getNodes());
      setLogs(SovereignComputeTelemetryService.getLogs());
      showToast(`Compute load rebalanced on ${updated.name}. Utilization now ${updated.utilizationPercent}%.`);
    }
  };

  const totalGpus = nodes.reduce((acc, n) => acc + n.gpuCount, 0);
  const avgLatency = (nodes.reduce((acc, n) => acc + n.latencyMs, 0) / nodes.length).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
              <Server className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Sovereign AI Compute & Edge Telemetry Vault</h2>
                <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span> Live Phase 9 Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Local Data Residency Audits, Pan-African Edge Nodes & Radiation-Hardened Satellite Compute Relays
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

        {/* Toast Alert */}
        {toastMsg && (
          <div className="mx-6 mt-4 p-3 bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 rounded-xl text-xs flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sovereign GPU Clusters</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{totalGpus}</span>
                <span className="text-[10px] text-cyan-400 font-semibold">Accelerators</span>
              </div>
              <span className="text-[10px] text-slate-500 block">Nvidia H100 / A100 & TPUs</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Data Sovereignty Index</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400">100%</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Strict Air-Gapped</span>
              </div>
              <span className="text-[10px] text-slate-500 block">Zero Unauthorized External Leaks</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg Edge Latency</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-indigo-400">{avgLatency} ms</span>
                <span className="text-[10px] text-slate-400">Intra-African Route</span>
              </div>
              <span className="text-[10px] text-slate-500 block">Fiber & Satellite Optimization</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Nodes</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-cyan-400">{nodes.length}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">ONLINE</span>
              </div>
              <span className="text-[10px] text-slate-500 block">Kigali, Nairobi, Jo’burg, LEO Sat</span>
            </div>
          </div>

          {/* Compute Nodes Roster */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Registered Sovereign Compute Clusters & Edge Relays</span>
              <span className="text-xs text-slate-400 font-normal">Real-Time Telemetry Feed</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nodes.map(n => (
                <div key={n.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <h4 className="text-sm font-bold text-white">{n.name}</h4>
                    </div>
                    <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded text-[10px] font-bold">
                      {n.nodeType}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-0.5">
                    <div>Location: <strong className="text-white">{n.location}, {n.country}</strong></div>
                    <div>Hardware: <strong className="text-indigo-300">{n.gpuCount}x {n.gpuModel}</strong></div>
                  </div>

                  {/* Load Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Compute Utilization:</span>
                      <span className="font-bold font-mono text-cyan-400">{n.utilizationPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 transition-all duration-500"
                        style={{ width: `${n.utilizationPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Models list & actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-900">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {n.activeModels.map((m, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded text-[9px]">
                          {m}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePingNode(n.id)}
                        disabled={pingingNodeId === n.id}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {pingingNodeId === n.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-amber-400" />}
                        {n.latencyMs}ms Ping
                      </button>

                      <button
                        onClick={() => handleRebalance(n.id)}
                        className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Rebalance
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Data Residency & Sovereign Compliance Audit Trail
            </h3>

            <div className="divide-y divide-slate-800 font-mono text-xs">
              {logs.map(log => (
                <div key={log.id} className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.nodeName}</span>
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-bold">
                        {log.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{log.metric}: {log.value}</p>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
