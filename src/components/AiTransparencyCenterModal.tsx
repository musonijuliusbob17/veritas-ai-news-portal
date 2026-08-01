import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Info, Lock, X, RefreshCw, Send, Check } from 'lucide-react';

interface AiTransparencyCenterModalProps {
  onClose: () => void;
}

export const AiTransparencyCenterModal: React.FC<AiTransparencyCenterModalProps> = ({ onClose }) => {
  const [reportText, setReportText] = useState<string>('');
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportText('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS AI TRANSPARENCY & PUBLIC TRUST CENTER</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  OPEN ALGORITHMIC AUDIT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transparent disclosure on how Veritas calculates credibility scores, trains verification agents, and corrects errors.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 space-y-6">
          {/* Mathematical Formula Explanation Card */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400" /> HOW VERITAS CONFIDENCE SCORES ARE CALCULATED
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
              Veritas assigns a score from <strong>0 to 100</strong> for every article and story cluster based on a deterministic mathematical weighted formula:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-emerald-400 block text-[10px]">35% WEIGHT</span>
                <strong className="text-white text-xs">Publisher Trust Index</strong>
                <p className="text-[11px] text-slate-400 mt-1">Based on historic wire accuracy & editorial standards.</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-emerald-400 block text-[10px]">30% WEIGHT</span>
                <strong className="text-white text-xs">Cross-Source Consensus</strong>
                <p className="text-[11px] text-slate-400 mt-1">Independent corroboration across Tier-1 newsrooms.</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-emerald-400 block text-[10px]">20% WEIGHT</span>
                <strong className="text-white text-xs">Evidence Quality</strong>
                <p className="text-[11px] text-slate-400 mt-1">Direct primary documents, official quotes & filings.</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-emerald-400 block text-[10px]">15% WEIGHT</span>
                <strong className="text-white text-xs">Timeliness & Freshness</strong>
                <p className="text-[11px] text-slate-400 mt-1">Recency of wire updates & corroborating dispatches.</p>
              </div>
            </div>
          </div>

          {/* Zero Hallucination Guarantee */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> OUR STRICT AI GOVERNANCE LAWS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <strong className="text-white block">1. ZERO GENERATIVE FABRICATION</strong>
                <p className="text-slate-400 text-[11px]">AI agents are strictly bound to verified source texts. If a fact cannot be grounded in an original wire report, it is tagged as UNVERIFIED.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <strong className="text-white block">2. EXPLICIT FORECAST LABELING</strong>
                <p className="text-slate-400 text-[11px]">Predictive analysis and market estimates are visually segregated from historical reporting to prevent reader confusion.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <strong className="text-white block">3. IMMUTABLE CORRECTION AUDIT</strong>
                <p className="text-slate-400 text-[11px]">Any editorial correction or confidence score modification is permanently logged with an analyst timestamp.</p>
              </div>
            </div>
          </div>

          {/* Error & Inaccuracy Reporting Form */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> PUBLIC CORRECTION & DISPATCH REPORTING
            </h3>

            {reportSubmitted ? (
              <div className="p-4 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-2xl text-xs font-bold font-mono flex items-center gap-2">
                <Check className="w-4 h-4" /> Thank you. Your report has been dispatched to the Senior HITL Analyst Desk for instant audit.
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-3">
                <p className="text-xs text-slate-400">
                  Notice an error, unverified claim, or source bias? Submit a correction ticket directly to our human analyst network:
                </p>

                <textarea
                  rows={3}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Describe the article title, claimed inaccuracy, or missing primary source documentation..."
                  className="w-full bg-slate-950 text-white p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs leading-relaxed"
                />

                <button
                  type="submit"
                  disabled={!reportText.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> SUBMIT CORRECTION TICKET
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
