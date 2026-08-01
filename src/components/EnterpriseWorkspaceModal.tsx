import React, { useState } from 'react';
import { Building2, ShieldCheck, Users, Lock, Key, Check, Zap, ArrowRight, Download, Server, X } from 'lucide-react';

interface EnterpriseWorkspaceModalProps {
  onClose: () => void;
}

export const EnterpriseWorkspaceModal: React.FC<EnterpriseWorkspaceModalProps> = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState<'workspace' | 'pricing' | 'security'>('workspace');
  const [activePlan, setActivePlan] = useState<'FREE' | 'PRO' | 'ENTERPRISE'>('ENTERPRISE');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white border border-slate-700 shadow-lg">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS ENTERPRISE INTELLIGENCE PORTAL</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  TENANT: SOVEREIGN RISK DESK
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Isolated intelligence environments, team collaboration, role-based access control, and dedicated API capacity.
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

        {/* Navigation Bar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-3 text-xs">
          <button
            onClick={() => setSelectedTab('workspace')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
              selectedTab === 'workspace' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏢 Private Team Workspace
          </button>
          <button
            onClick={() => setSelectedTab('pricing')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
              selectedTab === 'pricing' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            💳 Commercial Pricing Tiers
          </button>
          <button
            onClick={() => setSelectedTab('security')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
              selectedTab === 'security' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔒 Security & SSO Compliance
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 space-y-6">
          {selectedTab === 'workspace' && (
            <div className="space-y-6">
              {/* Workspace Header Overview */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">ORGANIZATION: GLOBAL MACRO INVESTMENTS CORP</span>
                    <h3 className="text-xl font-black text-white mt-0.5">Sovereign & Supply Chain Intelligence Workspace</h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-mono font-bold">
                    ACTIVE ENTERPRISE LICENSE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">TEAM SEATS</span>
                    <strong className="text-white text-sm">48 / 50 Active Users</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">SAVED INVESTIGATIONS</span>
                    <strong className="text-emerald-400 text-sm">124 Dossiers</strong>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">API QUOTA USAGE</span>
                    <strong className="text-amber-400 text-sm">4.2M / 10M Reqs</strong>
                  </div>
                </div>
              </div>

              {/* Saved Investigations Grid */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>ACTIVE SHARED INVESTIGATIONS & DOSSIERS</span>
                  <span className="text-emerald-400 font-mono text-xs cursor-pointer hover:underline">+ New Investigation</span>
                </h4>

                <div className="space-y-2">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div>
                      <strong className="text-white block">East Africa Renewable Energy Corridor Assessment</strong>
                      <span className="text-slate-400">Collaborators: 6 Analysts • Last modified 2 hours ago</span>
                    </div>
                    <span className="px-3 py-1 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg">RESTRICTED ACCESSS</span>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div>
                      <strong className="text-white block">Semiconductor Supply Chain Zero-Day Vulnerability Report</strong>
                      <span className="text-slate-400">Collaborators: 12 Analysts • Last modified yesterday</span>
                    </div>
                    <span className="px-3 py-1 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg">RESTRICTED ACCESS</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'pricing' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h3 className="text-2xl font-black text-white">COMMERCIAL PLATFORM SUBSCRIPTIONS</h3>
                <p className="text-xs text-slate-400">
                  Select an intelligence plan suited for personal monitoring, newsrooms, financial institutions, or government agencies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* FREE */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-xs font-mono font-bold text-slate-400">FREE PLAN</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">$0</span>
                      <span className="text-xs text-slate-500 font-mono">/ month</span>
                    </div>
                    <p className="text-xs text-slate-400">For consumer news readers & basic AI article summaries.</p>

                    <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Standard News Aggregation</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Basic AI Summaries</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Weather & Stock Ticker</li>
                    </ul>
                  </div>

                  <button className="w-full py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors">
                    CURRENT STANDARD TIER
                  </button>
                </div>

                {/* PRO */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-emerald-500 space-y-4 flex flex-col justify-between relative shadow-xl shadow-emerald-950/40">
                  <div className="absolute -top-3 right-6 px-3 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase rounded-full">
                    POPULAR FOR ANALYSTS
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs font-mono font-bold text-emerald-400">PRO INTELLIGENCE</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">$99</span>
                      <span className="text-xs text-slate-500 font-mono">/ analyst / mo</span>
                    </div>
                    <p className="text-xs text-slate-400">For individual researchers, journalists, and market analysts.</p>

                    <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Knowledge Graph & Maps</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Predictive Forecast Models</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Developer API Key (10k/day)</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Audio Podcast Generator</li>
                    </ul>
                  </div>

                  <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors">
                    UPGRADE TO PRO
                  </button>
                </div>

                {/* ENTERPRISE */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-xs font-mono font-bold text-indigo-400">ENTERPRISE OS</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">CUSTOM</span>
                    </div>
                    <p className="text-xs text-slate-400">Isolated private tenants for banks, governments, and enterprise risk desks.</p>

                    <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Private Data Isolation</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> SSO & SAML Authentication</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Unlimited Developer API</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Dedicated HITL Analyst Desk</li>
                    </ul>
                  </div>

                  <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors">
                    CONTACT ENTERPRISE SALES
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'security' && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> ENTERPRISE SECURITY & PRIVACY COMPLIANCE
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <strong className="text-white block">SAML 2.0 & OAuth2 SSO</strong>
                  <p className="text-slate-400 text-[11px]">Enforce Okta, Azure AD, or Google Workspace enterprise authentication.</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <strong className="text-white block">AES-256 & TLS 1.3 Encryption</strong>
                  <p className="text-slate-400 text-[11px]">End-to-end encrypted storage for saved investigations and private notes.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
