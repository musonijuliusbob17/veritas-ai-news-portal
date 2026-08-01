import React, { useState } from 'react';
import { Article } from '../types';
import { ShieldCheck, CheckCircle2, XCircle, Edit3, MessageSquare, History, UserCheck, AlertCircle, X, Check, Save } from 'lucide-react';

interface AnalystReviewEnvironmentModalProps {
  articles: Article[];
  onClose: () => void;
  onUpdateArticleConfidence?: (id: string, score: number) => void;
}

interface ReviewQueueItem {
  id: string;
  articleId: string;
  articleTitle: string;
  publisher: string;
  submittedAt: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'MODIFIED';
  confidenceScore: number;
  aiSummary: string;
  analystNotes: string;
  reviewer: string;
}

export const AnalystReviewEnvironmentModal: React.FC<AnalystReviewEnvironmentModalProps> = ({
  articles,
  onClose
}) => {
  const [reviewItems, setReviewItems] = useState<ReviewQueueItem[]>(() => 
    articles.slice(0, 5).map((art, idx) => ({
      id: `rev-${art.id}`,
      articleId: art.id,
      articleTitle: art.title,
      publisher: art.mainPublisher.name,
      submittedAt: art.timeAgo || '10 MINS AGO',
      status: idx === 0 ? 'PENDING_REVIEW' : idx === 1 ? 'APPROVED' : 'PENDING_REVIEW',
      confidenceScore: art.confidenceScore,
      aiSummary: art.summaryShort,
      analystNotes: idx === 1 ? 'Corroborated against secondary wire reports. Facts confirmed.' : '',
      reviewer: 'Chief Intelligence Analyst #402'
    }))
  );

  const [activeItem, setActiveItem] = useState<ReviewQueueItem>(reviewItems[0]);
  const [editedNotes, setEditedNotes] = useState<string>(reviewItems[0]?.analystNotes || '');
  const [editedScore, setEditedScore] = useState<number>(reviewItems[0]?.confidenceScore || 95);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleApprove = () => {
    const updated = reviewItems.map(item => {
      if (item.id === activeItem.id) {
        return {
          ...item,
          status: 'APPROVED' as const,
          confidenceScore: editedScore,
          analystNotes: editedNotes || 'Verified by Human Analyst.'
        };
      }
      return item;
    });
    setReviewItems(updated);
    setActiveItem({ ...activeItem, status: 'APPROVED', confidenceScore: editedScore, analystNotes: editedNotes });
    showNotification('Intelligence item APPROVED and committed to Veritas Immutable Archive.');
  };

  const handleReject = () => {
    const updated = reviewItems.map(item => {
      if (item.id === activeItem.id) {
        return {
          ...item,
          status: 'REJECTED' as const,
          analystNotes: editedNotes || 'Flagged for insufficient corroboration.'
        };
      }
      return item;
    });
    setReviewItems(updated);
    setActiveItem({ ...activeItem, status: 'REJECTED', analystNotes: editedNotes });
    showNotification('Item REJECTED. Removed from public feeds.');
  };

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">HUMAN-IN-THE-LOOP (HITL) ANALYST AUDIT ENVIRONMENT</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-950 text-blue-300 border border-blue-800">
                  SECURE COCKPIT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Senior analyst oversight to approve, audit, and annotate AI-generated summaries before public dissemination.
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
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950">
          {/* Review Queue List */}
          <div className="w-full md:w-88 bg-slate-900 border-r border-slate-800 p-4 space-y-3 overflow-y-auto">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              UNVERIFIED DISPATCH QUEUE ({reviewItems.length})
            </h3>

            {reviewItems.map(item => {
              const isSelected = activeItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item);
                    setEditedNotes(item.analystNotes);
                    setEditedScore(item.confidenceScore);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-950 to-slate-900 border-blue-500 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold font-mono ${
                      item.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400' :
                      item.status === 'REJECTED' ? 'bg-rose-950 text-rose-400' : 'bg-amber-950 text-amber-400'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{item.submittedAt}</span>
                  </div>

                  <h4 className="font-extrabold text-xs text-white line-clamp-2">{item.articleTitle}</h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>Publisher: <strong className="text-slate-200">{item.publisher}</strong></span>
                    <span className="text-emerald-400">{item.confidenceScore}% Score</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Review Inspector & Action Panel */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {successMessage && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold font-mono flex items-center gap-2">
                <Check className="w-4 h-4" /> {successMessage}
              </div>
            )}

            {/* Main Inspection Card */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-blue-400 font-bold">SOURCE DISPATCH ID: {activeItem.id}</span>
                  <h3 className="text-lg font-black text-white mt-1">{activeItem.articleTitle}</h3>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                  activeItem.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                  activeItem.status === 'REJECTED' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {activeItem.status}
                </span>
              </div>

              {/* AI Summary Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI EXTRACTED SUMMARY & CLAIMS</h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  {activeItem.aiSummary}
                </p>
              </div>

              {/* Analyst Controls & Notes Input */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 font-mono">CONFIDENCE SCORE OVERRIDE ({editedScore}%)</label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={editedScore}
                      onChange={(e) => setEditedScore(Number(e.target.value))}
                      className="w-full accent-blue-500 bg-slate-950 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 font-mono">ASSIGNED REVIEWER</label>
                    <input
                      type="text"
                      disabled
                      value={activeItem.reviewer}
                      className="w-full bg-slate-950 text-slate-400 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 font-mono">ANALYST AUDIT NOTES & CORROBORATION REMARKS</label>
                  <textarea
                    rows={3}
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Enter senior analyst notes, wire corroborations, or source verification rationale..."
                    className="w-full bg-slate-950 text-white p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={handleReject}
                  className="px-5 py-2.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> REJECT DISPATCH
                </button>

                <button
                  onClick={handleApprove}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> APPROVE & COMMIT INTELLIGENCE
                </button>
              </div>
            </div>

            {/* Immutable Audit Trail Log */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" /> IMMUTABLE AUDIT TRAIL LOG
              </h4>
              <div className="space-y-2 font-mono text-[11px] text-slate-400">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span>[08:24:12 UTC] AI Pipeline ingest completed. Confidence baseline score: {activeItem.confidenceScore}%</span>
                  <span className="text-slate-500">SYSTEM</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span>[08:28:45 UTC] Cryptographic hash verified. Cross-wire consensus established across 4 Tier-1 outlets.</span>
                  <span className="text-emerald-400 font-bold">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
