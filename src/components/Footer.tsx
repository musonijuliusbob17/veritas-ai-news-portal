import React, { useState } from 'react';
import { ShieldCheck, Globe, Cpu, Radio, Award, Code, FileText, Lock, ShieldAlert, X } from 'lucide-react';
import { Category, Region } from '../types';
import { WhatsAppIntegration } from './WhatsAppIntegration';

interface FooterProps {
  onSelectCategory: (cat: Category) => void;
  onSelectRegion: (reg: Region) => void;
  onOpenPublisherDirectory: () => void;
  onOpenAdmin: () => void;
  onOpenAiAssistant: () => void;
  onOpenDevApi: () => void;
  onOpenTransparencyCenter: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectRegion,
  onOpenPublisherDirectory,
  onOpenAdmin,
  onOpenAiAssistant,
  onOpenDevApi,
  onOpenTransparencyCenter
}) => {
  const [activePolicyModal, setActivePolicyModal] = useState<'privacy' | 'terms' | 'editorial' | null>(null);

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* WhatsApp Channel Call to Action Banner */}
        <WhatsAppIntegration variant="banner" location="footer" />

        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-lg">
                V
              </div>
              <span className="font-extrabold text-lg text-white">VERITAS GLOBAL</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A product of holding company <strong className="text-slate-200">Rebero Incoparated Tech ltd.</strong> — The world's leading autonomous AI-powered news aggregation, verification, and intelligence network.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] border border-emerald-800">
                VERITAS AI v3.6 ONLINE
              </span>
            </div>
          </div>

          {/* Categories Column */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider text-xs">News Categories</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => onSelectCategory('Artificial Intelligence')} className="hover:text-white transition-colors cursor-pointer">✨ AI & Tech</button></li>
              <li><button onClick={() => onSelectCategory('Business')} className="hover:text-white transition-colors cursor-pointer">Business & Finance</button></li>
              <li><button onClick={() => onSelectCategory('Politics')} className="hover:text-white transition-colors cursor-pointer">Politics & World</button></li>
              <li><button onClick={() => onSelectCategory('Science')} className="hover:text-white transition-colors cursor-pointer">Science & Energy</button></li>
              <li><button onClick={() => onSelectCategory('Climate')} className="hover:text-white transition-colors cursor-pointer">Climate & Ecology</button></li>
              <li><button onClick={() => onSelectCategory('Health')} className="hover:text-white transition-colors cursor-pointer">Medicine & Health</button></li>
            </ul>
          </div>

          {/* Global Regions Column */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider text-xs">Global Desks</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => onSelectRegion('Africa')} className="hover:text-white transition-colors cursor-pointer">Africa Desk</button></li>
              <li><button onClick={() => onSelectRegion('Europe')} className="hover:text-white transition-colors cursor-pointer">Europe Desk</button></li>
              <li><button onClick={() => onSelectRegion('Asia')} className="hover:text-white transition-colors cursor-pointer">Asia-Pacific Desk</button></li>
              <li><button onClick={() => onSelectRegion('Middle East')} className="hover:text-white transition-colors cursor-pointer">Middle East Desk</button></li>
              <li><button onClick={() => onSelectRegion('North America')} className="hover:text-white transition-colors cursor-pointer">Americas Desk</button></li>
              <li><button onClick={() => onSelectRegion('Oceania')} className="hover:text-white transition-colors cursor-pointer">Oceania Sanctuary</button></li>
            </ul>
          </div>

          {/* Platform & API Column */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider text-xs">Platform Tools</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={onOpenPublisherDirectory} className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Publisher Ratings</button></li>
              <li><button onClick={onOpenAiAssistant} className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"><Cpu className="w-3.5 h-3.5 text-blue-400" /> AI Research Agent</button></li>
              <li><button onClick={onOpenAdmin} className="hover:text-amber-400 text-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1">⚡ Admin & System Panel</button></li>
              <li><button onClick={onOpenDevApi} className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"><Code className="w-3.5 h-3.5 text-teal-400" /> Developers API v1</button></li>
              <li><button onClick={onOpenTransparencyCenter} className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"><Award className="w-3.5 h-3.5 text-amber-400" /> Fact-Check Guidelines</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Rebero Incoparated Tech ltd. All rights reserved. Veritas Global is a product of Rebero Incoparated Tech ltd. All original content credited to respective publishers.</p>
          <div className="flex space-x-4">
            <button onClick={() => setActivePolicyModal('privacy')} className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={() => setActivePolicyModal('terms')} className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</button>
            <button onClick={() => setActivePolicyModal('editorial')} className="hover:text-slate-300 transition-colors cursor-pointer">Editorial Standards</button>
          </div>
        </div>
      </div>

      {/* Interactive Policy Modal Dialog */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-base text-white capitalize">
                  Veritas Global Governance — {activePolicyModal === 'privacy' ? 'Data Privacy Policy' : activePolicyModal === 'terms' ? 'Terms of Service' : 'Editorial & Fact-Checking Standards'}
                </h3>
              </div>
              <button onClick={() => setActivePolicyModal(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3 leading-relaxed text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
              {activePolicyModal === 'privacy' && (
                <>
                  <p><strong>1. Zero Data Exploitation Guarantee:</strong> Veritas Global utilizes strict client-side encryption and server-side anonymized telemetry. No personal search histories or reader metadata are sold or redistributed to third parties.</p>
                  <p><strong>2. AI Processing Audits:</strong> All queries processed by Gemini 3.6 Flash undergo cryptographic hash generation to ensure zero-retention compliance across global news desks.</p>
                  <p><strong>3. Cookie & Cache Controls:</strong> Local preferences (bookmarks, language, view state) are stored entirely inside your browser local storage and can be cleared at any time.</p>
                </>
              )}

              {activePolicyModal === 'terms' && (
                <>
                  <p><strong>1. Content Rights & Ownership:</strong> Veritas Global is a registered digital product of holding company <strong>Rebero Incoparated Tech ltd.</strong> All original news articles and trademarks belong to their respective publishers. Rebero Incoparated Tech ltd. aggregates public news wire feeds with automated attribution and confidence scoring.</p>
                  <p><strong>2. API Access Limits:</strong> Developers API v1 endpoints are subject to rate limiting of 1,000 requests per minute per IP address. Commercial syndication requires an enterprise license from Rebero Incoparated Tech ltd.</p>
                  <p><strong>3. Non-Partisan Verification:</strong> AI confidence scoring and bias ratings are generated algorithmically using multi-source consensus models and do not represent political endorsements.</p>
                </>
              )}

              {activePolicyModal === 'editorial' && (
                <>
                  <p><strong>1. Multi-Publisher Consensus Threshold:</strong> A news story is rated with a high Veritas Score (&gt;90/100) only when corroborated by at least 3 independent, tier-1 verified news organizations.</p>
                  <p><strong>2. Automated Bias Identification:</strong> Political spectrum alignment (Left, Center, Right) is calculated through semantic analysis across word choice, framing, and quotation balance.</p>
                  <p><strong>3. Real-Time Retraction & Correction Protocol:</strong> If a primary source updates or retracts a story, Veritas crawlers auto-sync and log the correction within 180 seconds across the global network.</p>
                </>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
