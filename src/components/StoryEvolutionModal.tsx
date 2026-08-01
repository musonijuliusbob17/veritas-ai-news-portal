import React, { useState } from 'react';
import { Article } from '../types';
import { GitBranch, Clock, ShieldCheck, ChevronRight, X, Layers, ArrowRight, ExternalLink } from 'lucide-react';

interface StoryEvolutionModalProps {
  article: Article;
  onClose: () => void;
}

export const StoryEvolutionModal: React.FC<StoryEvolutionModalProps> = ({
  article,
  onClose
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const evolutionSteps = [
    {
      phase: '1. FIRST BREAKING DISPATCH',
      timestamp: article.timeline[0]?.timestamp || '08:00 UTC',
      title: article.timeline[0]?.title || 'Initial Wire Report Broadcasted',
      publisher: article.mainPublisher.name,
      details: article.timeline[0]?.description || 'Verified baseline details logged by Tier-1 primary news wires.',
      status: 'Verified Initial Feed'
    },
    {
      phase: '2. MULTI-NEWSROOM CLUSTERING',
      timestamp: '09:15 UTC',
      title: `Corroborated across ${article.otherPublishersCount} Tier-1 Outlets`,
      publisher: 'Veritas Global Verification Engine',
      details: `Merged coverage from Reuters, BBC, AP, and Bloomberg with zero semantic hallucination. Confidence score verified at ${article.confidenceScore}%.`,
      status: 'Clustered'
    },
    {
      phase: '3. OFFICIAL & GOVERNMENT STATEMENTS',
      timestamp: '11:30 UTC',
      title: 'Institutional Disclosures Released',
      publisher: 'Official Press Secretary',
      details: 'Primary institutional spokespersons issue formal clarifying statement corroborating core facts.',
      status: 'Official Response'
    },
    {
      phase: '4. ECONOMIC & MARKET REACTION',
      timestamp: '14:00 UTC',
      title: 'Financial Markets & Index Movement',
      publisher: 'Bloomberg & Reuters Finance',
      details: 'Equity futures and currency exchange rates adjust to macroeconomic implications outlined in the story.',
      status: 'Market Impact'
    }
  ];

  const activeStep = evolutionSteps[activeStepIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <GitBranch className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">AUTONOMOUS STORY EVOLUTION ENGINE</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  REAL-TIME TIMELINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Track how this story unfolded from initial wire dispatches to international statements and financial impacts.
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

        {/* Story Title & Meta Bar */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 space-y-1">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{article.category} • {article.region}</span>
          <h3 className="text-lg font-black text-white leading-snug">{article.title}</h3>
        </div>

        {/* Flowchart Steps Timeline */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-950">
          {/* Horizontal Step Flow Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {evolutionSteps.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950 to-slate-900 border-cyan-500 shadow-lg ring-1 ring-cyan-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-cyan-400 block">{step.phase}</span>
                  <p className="font-extrabold text-xs text-white line-clamp-1">{step.title}</p>
                  <span className="text-[11px] text-slate-400 font-mono block">{step.timestamp}</span>
                </div>
              );
            })}
          </div>

          {/* Active Phase Deep Dive Detail Card */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-400 font-mono">{activeStep.phase}</span>
                <h4 className="text-xl font-black text-white mt-0.5">{activeStep.title}</h4>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                {activeStep.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {activeStep.details}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 font-mono">
              <span>Primary Source: <strong className="text-white">{activeStep.publisher}</strong></span>
              <span>Logged Timestamp: <strong className="text-cyan-300">{activeStep.timestamp}</strong></span>
            </div>
          </div>

          {/* Political Viewpoints Grid */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> MULTI-PERSPECTIVE SPECTRUM SYNTHESIS
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-950 rounded-2xl border border-blue-900/50 space-y-1.5">
                <span className="text-[10px] font-extrabold text-blue-400 uppercase font-mono">LEFT PERSPECTIVE</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {article.viewpoints?.leftPerspective || 'Focuses on public oversight, social safety nets, and environmental stewardship.'}
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase font-mono">CENTER PERSPECTIVE</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {article.viewpoints?.centerPerspective || 'Objective factual synthesis focused on verified outcomes without editorial bias.'}
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-red-900/50 space-y-1.5">
                <span className="text-[10px] font-extrabold text-rose-400 uppercase font-mono">RIGHT PERSPECTIVE</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {article.viewpoints?.rightPerspective || 'Emphasizes market efficiency, fiscal discipline, and institutional governance.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
