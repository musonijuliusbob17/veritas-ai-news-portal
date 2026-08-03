import React, { useState } from 'react';
import {
  X,
  Search,
  Clock,
  Sparkles,
  TrendingUp,
  Building2,
  FileText,
  HelpCircle,
  Network,
  ArrowRight,
  Send,
  Calendar,
  Layers
} from 'lucide-react';
import { Article } from '../types';
import { VciaEngine, VciaInvestigationResult } from '../services/VciaEngine';

interface VciaInvestigativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
}

export const VciaInvestigativeModal: React.FC<VciaInvestigativeModalProps> = ({
  isOpen,
  onClose,
  articles
}) => {
  const [queryInput, setQueryInput] = useState("Show every article about Rwanda's energy projects during the last 10 years");
  const [activeResult, setActiveResult] = useState<VciaInvestigationResult>(() =>
    VciaEngine.investigateLongTermQuery("Show every article about Rwanda's energy projects during the last 10 years", articles)
  );

  if (!isOpen) return null;

  const presetQueries = [
    "Show every article about Rwanda's energy projects during the last 10 years",
    "Which organizations consistently appear together in trade discussions?",
    "Which narratives disappeared after policy changes in EAC?",
    "Which companies gained the most positive coverage over 5 years?"
  ];

  const handleRunQuery = (q: string) => {
    setQueryInput(q);
    const res = VciaEngine.investigateLongTermQuery(q, articles);
    setActiveResult(res);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    const res = VciaEngine.investigateLongTermQuery(queryInput, articles);
    setActiveResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-7xl max-h-[96vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-wide text-white">
                  VCIA (VERITAS CHIEF INVESTIGATIVE ANALYST)
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full">
                  LONG-TERM RESEARCH CO-PILOT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Investigates multi-year historical questions, entity co-occurrence shifts, disappeared narratives & policy impact over 1–10 years
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Query Input & Preset Ribbon */}
        <div className="bg-slate-950/80 border-b border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Investigative Query Console (10-Year Archival Horizon):
            </span>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/30">
              Archival Articles Evaluated: {activeResult.totalArticlesEvaluated.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {presetQueries.map((pq, idx) => (
              <button
                key={idx}
                onClick={() => handleRunQuery(pq)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-indigo-300 transition cursor-pointer flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{pq}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              placeholder="Enter long-term investigative question (e.g., 'Which companies gained the most positive coverage over 5 years?')..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg cursor-pointer"
            >
              <span>Investigate</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Investigative Results Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/60 font-sans">
          
          {/* Header Summary */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{activeResult.investigationTitle}</h3>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full font-mono text-xs font-bold">
                Timeframe: {activeResult.timeframe}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Evaluated {activeResult.totalArticlesEvaluated.toLocaleString()} historical wire records, government gazettes, and corporate disclosures.
            </p>
          </div>

          {/* 1. Multi-Year Longitudinal Milestones */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>10-Year Longitudinal Policy & Impact Timeline</span>
            </h4>

            <div className="space-y-3 font-mono text-xs">
              {activeResult.keyFindings.map((kf, i) => (
                <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-amber-400 font-bold text-sm">{kf.yearRange}: {kf.milestone}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px]">
                      Confidence: {kf.confidence}%
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">{kf.impactDescription}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>Policy Trigger: <strong className="text-indigo-300">{kf.policyTrigger}</strong></span>
                    <div className="flex gap-1">
                      {kf.entityConnections.map((e, idx) => (
                        <span key={idx} className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 text-[10px]">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Entity Co-Occurrence Matrix */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Network className="w-4 h-4 text-purple-400" />
              <span>Entity Co-Occurrence Matrix (Which Organizations Consistently Appear Together)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              {activeResult.entityCoOccurrenceMatrix.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{item.entityA}</span>
                    <span className="text-amber-400">+</span>
                    <span>{item.entityB}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Co-occurrences: <strong className="text-indigo-300">{item.coOccurrenceCount} articles</strong></span>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px]">{item.strength}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Relationship: {item.relationshipType}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Disappeared Narratives */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Disappeared Narratives & Framing Replacement</span>
            </h4>

            <div className="space-y-3 font-mono text-xs">
              {activeResult.disappearedNarratives.map((dn, idx) => (
                <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between font-bold text-rose-400">
                    <span>Former Narrative: "{dn.formerNarrative}"</span>
                    <span className="text-slate-400 text-[11px]">Active: {dn.activePeriod}</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    <strong className="text-amber-400">Disappearance Catalyst:</strong> {dn.disappearanceReason}
                  </p>
                  <div className="text-emerald-400 font-bold flex items-center space-x-2 pt-1 border-t border-slate-800">
                    <span>Replaced By:</span>
                    <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-300">
                      "{dn.replacedBy}"
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Top Beneficiaries */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Top Organization Beneficiaries Over Time</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {activeResult.topBeneficiaries.map((b, idx) => (
                <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{b.organizationName}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Sentiment Shift: {b.sentimentShift}</div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold">
                    +{b.coverageGrowthPct}% Growth
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
