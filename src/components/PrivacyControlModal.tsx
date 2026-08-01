import React, { useState, useEffect } from 'react';
import { AudienceIntelligenceService, VisitorProfile } from '../services/AudienceIntelligenceService';
import { ShieldCheck, UserCheck, Trash2, RefreshCw, X, Lock, CheckCircle2, EyeOff } from 'lucide-react';

interface PrivacyControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyControlModal: React.FC<PrivacyControlModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<VisitorProfile | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProfile(AudienceIntelligenceService.getVisitorProfile());
    }
  }, [isOpen]);

  if (!isOpen || !profile) return null;

  const handleToggleConsent = (status: 'accepted' | 'declined') => {
    AudienceIntelligenceService.setPrivacyConsent(status);
    setProfile(AudienceIntelligenceService.getVisitorProfile());
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset your local visitor intelligence profile?')) {
      const fresh = AudienceIntelligenceService.resetProfileData();
      setProfile(fresh);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.visitorId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5 text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Data Privacy & Personalization Controls</h3>
            </div>
            <p className="text-xs text-slate-400">
              Veritas AI Audience Intelligence operates strictly locally with anonymous tracking IDs.
            </p>
          </div>
        </div>

        {/* Visitor Identity Details */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Anonymous Visitor ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-400">{profile.visitorId}</span>
              <button
                onClick={handleCopyId}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
              >
                {copiedId ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[11px]">
            <div>
              <span className="text-slate-500 block">Articles Read:</span>
              <span className="text-slate-200 font-bold">{profile.totalArticlesOpened}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Reading Time:</span>
              <span className="text-slate-200 font-bold">{Math.round(profile.totalReadingTimeSeconds / 60)} min</span>
            </div>
            <div>
              <span className="text-slate-500 block">Return Sessions:</span>
              <span className="text-slate-200 font-bold">{profile.returnVisitsCount}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Tracking Status:</span>
              <span className={`font-bold ${profile.privacyConsent === 'accepted' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {profile.privacyConsent.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Interest Profile Breakdown */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block font-mono">Your Inferred Category Interests:</span>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(profile.categoryWeights).map(([cat, score]) => (
              <span key={cat} className="px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono">
                {cat}: <strong className="text-indigo-400">{score}%</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Privacy Consent Toggle */}
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-200 block">Personalization Settings</span>
          
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              {profile.privacyConsent === 'accepted'
                ? 'AI Personalization is ENABLED. You receive tailored WhatsApp channel invites and relevant story updates.'
                : 'AI Personalization is DISABLED. Generic WhatsApp banners are displayed.'}
            </div>

            {profile.privacyConsent === 'accepted' ? (
              <button
                onClick={() => handleToggleConsent('declined')}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold cursor-pointer shrink-0"
              >
                Disable
              </button>
            ) : (
              <button
                onClick={() => handleToggleConsent('accepted')}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer shrink-0"
              >
                Enable
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleResetData}
            className="px-3.5 py-2 bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-800/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Profile Data
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
