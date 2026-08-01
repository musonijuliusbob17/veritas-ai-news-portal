import React, { useState } from 'react';
import { 
  X, Lock, Key, ShieldCheck, Cpu, Layers, Activity, CheckCircle2, 
  Sparkles, RefreshCw, FileText, Globe, Search, Database, Award, ArrowRight, Zap
} from 'lucide-react';
import { 
  QuantumVerificationEngine, 
  LedgerBlock, 
  ZkFactProof 
} from '../services/QuantumVerificationEngine';
import { GlobalGovernanceOrchestratorService } from '../services/GlobalGovernanceOrchestratorService';

interface QuantumVerificationModalProps {
  onClose: () => void;
}

export const QuantumVerificationModal: React.FC<QuantumVerificationModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'zkproofs' | 'ecosystem'>('ledger');
  const [ledger, setLedger] = useState<LedgerBlock[]>(QuantumVerificationEngine.getLedger());
  const [zkProofs, setZkProofs] = useState<ZkFactProof[]>(QuantumVerificationEngine.getZkProofs());

  // State for minting block
  const [newTitle, setNewTitle] = useState('Geopolitical Maritime Trade Flow & Subsea Cable Stability Briefing');
  const [isMinting, setIsMinting] = useState(false);

  // State for ZK Proof generator
  const [claimInput, setClaimInput] = useState('East African Renewable Hydro-Electric Grid exports hit 1.2 Terawatts with 0% downtime.');
  const [sourceType, setSourceType] = useState<ZkFactProof['sourceType']>('CLASSIFIED_SATELLITE');
  const [isGeneratingZk, setIsGeneratingZk] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleMintBlock = () => {
    if (!newTitle.trim()) return;
    setIsMinting(true);
    setTimeout(() => {
      const block = QuantumVerificationEngine.verifyArticleAndMintBlock(newTitle, 'Kigali Sovereign Node #01');
      setLedger(QuantumVerificationEngine.getLedger());
      setIsMinting(false);
      showToast(`Quantum-Resistant Ledger Block #${block.blockNumber} successfully sealed with Dilithium-5 signature!`);
    }, 600);
  };

  const handleGenerateZkProof = () => {
    if (!claimInput.trim()) return;
    setIsGeneratingZk(true);
    setTimeout(() => {
      const proof = QuantumVerificationEngine.generateZkProof(claimInput, sourceType);
      setZkProofs(QuantumVerificationEngine.getZkProofs());
      setIsGeneratingZk(false);
      showToast(`Zero-Knowledge (ZK) Proof generated! Verified without revealing source identity (${proof.zkProofHash.substring(0, 16)}...)`);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-400">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Quantum-Resistant Cryptographic Verification & Proof-of-Truth Vault</h2>
                <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span> Phase 11 Final Suite
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Post-Quantum Dilithium-5 Signatures, Zero-Knowledge Fact Verification & Complete 11-Phase Enterprise AI Architecture Matrix
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

        {/* Sub-Nav */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'ledger' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4" /> Immutable Proof Ledger
            </button>
            <button
              onClick={() => setActiveTab('zkproofs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'zkproofs' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Key className="w-4 h-4" /> Zero-Knowledge (ZK) Proof Generator
            </button>
            <button
              onClick={() => setActiveTab('ecosystem')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'ecosystem' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" /> Master 11-Phase Ecosystem Matrix
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="mx-6 mt-4 p-3 bg-purple-950/80 border border-purple-500/50 text-purple-300 rounded-xl text-xs flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">

          {/* TAB 1: IMMUTABLE PROOF LEDGER */}
          {activeTab === 'ledger' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Mint Block Controls */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400" /> Seal Intelligence on Immutable Ledger
                  </h3>
                  <p className="text-xs text-slate-400">Mint Dilithium-5 signed cryptographic block for tamper-proof auditing</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Intelligence Article / Briefing Title</label>
                    <textarea 
                      rows={3}
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleMintBlock}
                    disabled={isMinting}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isMinting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    {isMinting ? 'Sealing Post-Quantum Block...' : 'Seal & Mint Ledger Block'}
                  </button>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Active Post-Quantum Spec:</span>
                    <strong className="text-purple-300">NIST Dilithium-5 / Kyber-1024</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Block Explorer Status:</span>
                    <strong className="text-emerald-400">100% Immutable</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Ledger Blocks Feed */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Cryptographic Proof Blocks</span>
                  <span className="text-xs text-purple-400 font-mono font-bold">{ledger.length} Blocks Minted</span>
                </h3>

                <div className="space-y-3">
                  {ledger.map(block => (
                    <div key={block.blockNumber} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-bold">
                            BLOCK #{block.blockNumber}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold">
                            {block.verificationStatus}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{new Date(block.timestamp).toLocaleTimeString()}</span>
                      </div>

                      <h4 className="text-xs font-bold font-sans text-white">{block.articleTitle}</h4>

                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-[11px] text-slate-400 overflow-x-auto">
                        <div>Hash: <span className="text-purple-300 break-all">{block.hash}</span></div>
                        <div>Previous Hash: <span className="text-slate-500 break-all">{block.previousHash}</span></div>
                        <div>Merkle Root: <span className="text-indigo-300">{block.merkleRoot}</span></div>
                        <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-sans">
                          <span>Scheme: <strong className="text-white">{block.signatureScheme}</strong></span>
                          <span>Validator: <strong className="text-cyan-400">{block.validatorNode}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ZERO-KNOWLEDGE PROOF GENERATOR */}
          {activeTab === 'zkproofs' && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-purple-400" /> Zero-Knowledge (ZK) Fact Proof Engine
                  </h3>
                  <p className="text-xs text-slate-400">
                    Verify intelligence statements mathematically without revealing confidential source origins or raw document leaks.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Intelligence Claim Statement</label>
                    <input 
                      type="text"
                      value={claimInput}
                      onChange={(e) => setClaimInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">Classified Source Type:</span>
                      <select 
                        value={sourceType}
                        onChange={(e) => setSourceType(e.target.value as any)}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                      >
                        <option value="CLASSIFIED_SATELLITE">CLASSIFIED SATELLITE TELEMETRY</option>
                        <option value="FINANCIAL_WIRE">FINANCIAL WIRE & SWIFT TELEMETRY</option>
                        <option value="DIPLOMATIC_DESK">DIPLOMATIC DESK DISPATCH</option>
                      </select>
                    </div>

                    <button
                      onClick={handleGenerateZkProof}
                      disabled={isGeneratingZk}
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingZk ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                      {isGeneratingZk ? 'Generating ZK Circuit...' : 'Generate ZK Proof'}
                    </button>
                  </div>
                </div>

                {/* Proofs roster */}
                <div className="pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Verified ZK Fact Proofs</h4>
                  
                  <div className="space-y-3 font-mono">
                    {zkProofs.map(zk => (
                      <div key={zk.proofId} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white font-sans">{zk.claim}</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-bold">
                            VERIFIED ZERO-EXPOSURE
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                          <div>ZK Proof Hash: <strong className="text-purple-300">{zk.zkProofHash}</strong></div>
                          <div>Source Type: <strong className="text-indigo-300">{zk.sourceType}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MASTER 11-PHASE ECOSYSTEM MATRIX */}
          {activeTab === 'ecosystem' && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 border border-purple-500/40 rounded-2xl text-purple-300">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white">Veritas Complete 11-Phase Enterprise Architecture</h3>
                    <p className="text-xs text-slate-300">
                      Fully realized sovereign news intelligence platform combining multi-lingual AI, geopolitical stress testing, WhatsApp growth, podcast generation, sovereign edge compute, and post-quantum cryptography.
                    </p>
                  </div>
                </div>

                {/* Matrix Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div><strong className="text-white block">Phase 1: Veritas Core Intelligence</strong> Fact Verification & AI Bias Radar</div>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div><strong className="text-white block">Phase 2: Global Risk Index</strong> Real-time Anomaly & Financial Volatility Tracker</div>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div><strong className="text-white block">Phase 3: Knowledge Graph</strong> Visual Entity Disambiguation & Relation Network</div>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div><strong className="text-white block">Phase 4: Neural Translation</strong> Swahili, Kinyarwanda & French Localizers</div>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div><strong className="text-white block">Phase 5: Developer API Portal</strong> API Keys, OAuth Docs & Enterprise Marketplace</div>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div><strong className="text-white block">Phase 6: WhatsApp Growth Suite</strong> Mobile Channel Syndication & Automated Digests</div>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div><strong className="text-white block">Phase 7: Autonomous AI Newsroom</strong> Podcast Audio Studio & Multi-Agent Drafters</div>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div><strong className="text-white block">Phase 8: Geopolitical War-Room</strong> Monte-Carlo Stress Test & Crisis Playbooks</div>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div><strong className="text-white block">Phase 9: Sovereign Compute Vault</strong> Air-Gapped Data Residency & LEO Satellite Relays</div>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div><strong className="text-white block">Phase 10: Master Governance Vault</strong> Cross-Engine Executive AI Consensus Orchestration</div>
                  </div>
                  <div className="p-3 bg-purple-950/80 border border-purple-500/50 rounded-xl flex items-center gap-3 text-xs md:col-span-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-300 shrink-0" />
                    <div><strong className="text-purple-200 block">Phase 11: Quantum Cryptographic Ledger</strong> Post-Quantum Dilithium Signatures & ZK Proof Verification</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
