import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { WhatsAppService, WhatsAppLocation, WHATSAPP_CHANNEL_URL } from '../services/WhatsAppService';
import { AudienceIntelligenceService, ConversionPrediction } from '../services/AudienceIntelligenceService';
import { WhatsAppQrModal } from './WhatsAppQrModal';
import { PrivacyControlModal } from './PrivacyControlModal';
import { 
  MessageCircle, ExternalLink, Bell, ShieldCheck, Users, 
  QrCode, X, Sparkles, ChevronRight, Zap, Settings 
} from 'lucide-react';

interface WhatsAppIntegrationProps {
  variant?: 'button' | 'banner' | 'card' | 'compact' | 'sticky_mobile' | 'end_of_article';
  location?: WhatsAppLocation;
  article?: Article;
  language?: string;
  className?: string;
}

export const WhatsAppIntegration: React.FC<WhatsAppIntegrationProps> = ({
  variant = 'banner',
  location = 'homepage_banner',
  article,
  language = 'en',
  className = ''
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [prediction, setPrediction] = useState<ConversionPrediction | null>(null);

  // Initialize prediction & track impression on mount
  useEffect(() => {
    if (variant === 'sticky_mobile') {
      setIsDismissed(WhatsAppService.isStickyMobileDismissed());
    }

    // AI Prediction & Personalization
    const pred = AudienceIntelligenceService.predictConversionLikelihood(undefined, article);
    setPrediction(pred);

    // Track banner view
    WhatsAppService.trackView((location || 'homepage_banner') as WhatsAppLocation, article?.id, article?.category);

    // Log A/B test impression
    AudienceIntelligenceService.trackAbTestEvent('var_c', 'impression');
  }, [variant, location, article]);

  if (isDismissed && variant === 'sticky_mobile') return null;

  // Fallback copy or AI personalized copy
  const defaultSmartCopy = WhatsAppService.getSmartCopy(article, language);
  const smartCopy = prediction?.recommendedCTA || defaultSmartCopy;
  const channel = prediction?.recommendedChannel;
  const channelUrl = channel?.url || WHATSAPP_CHANNEL_URL;

  const handleClick = (e: React.MouseEvent) => {
    AudienceIntelligenceService.trackCtaInteraction('click');
    AudienceIntelligenceService.trackAbTestEvent('var_c', 'click');
    WhatsAppService.trackClick((location || 'homepage_banner') as WhatsAppLocation, article, smartCopy.buttonText, language);
  };

  const handleDismissSticky = (e: React.MouseEvent) => {
    e.stopPropagation();
    AudienceIntelligenceService.trackCtaInteraction('dismiss');
    WhatsAppService.dismissStickyMobile(24); // dismiss 24h
    setIsDismissed(true);
  };

  // VARIANT: Button
  if (variant === 'button') {
    return (
      <>
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105 cursor-pointer"
            title={`Join ${channel?.name || 'Veritas Global'} on WhatsApp`}
          >
            <MessageCircle className="w-4 h-4 fill-current text-white shrink-0" />
            <span className="whitespace-nowrap">{smartCopy.buttonText}</span>
          </a>

          <button
            onClick={() => setShowQrModal(true)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Scan QR Code"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        <WhatsAppQrModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />
        <PrivacyControlModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      </>
    );
  }

  // VARIANT: Compact
  if (variant === 'compact') {
    return (
      <>
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-200 border border-emerald-800/80 text-xs font-mono font-bold transition-all cursor-pointer ${className}`}
        >
          <div className="p-1 rounded-lg bg-emerald-500 text-slate-950 font-black shrink-0">
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
          </div>
          <div className="text-left">
            <span className="block font-sans font-bold text-white text-[11px] leading-tight">{smartCopy.headline}</span>
            <span className="block text-[10px] text-emerald-400">{smartCopy.buttonText}</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400 ml-1" />
        </a>

        <WhatsAppQrModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />
        <PrivacyControlModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      </>
    );
  }

  // VARIANT: Sticky Mobile Bottom Bar
  if (variant === 'sticky_mobile') {
    return (
      <>
        <div className={`fixed bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 border-t border-emerald-800/80 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-slate-100 sm:hidden animate-slide-up ${className}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 shrink-0">
              <MessageCircle className="w-4 h-4 fill-current" />
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-white truncate">{smartCopy.headline}</span>
              <span className="block text-[10px] text-emerald-400 font-mono">
                {channel?.name || 'Veritas Official Channel'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg shadow-md cursor-pointer whitespace-nowrap"
            >
              Follow
            </a>

            <button
              onClick={handleDismissSticky}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <WhatsAppQrModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />
        <PrivacyControlModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      </>
    );
  }

  // VARIANT: End of Article Growth Callout
  if (variant === 'end_of_article') {
    return (
      <>
        <div className={`p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 border border-emerald-800/80 shadow-2xl space-y-4 my-6 text-slate-100 relative overflow-hidden ${className}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500 text-slate-950 rounded-2xl shadow-lg shadow-emerald-500/20 shrink-0">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {smartCopy.badge}
                  </span>
                  {prediction && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {prediction.followProbabilityScore}% Conversion Match
                    </span>
                  )}
                </div>
                <h4 className="text-base font-extrabold text-white mt-1">
                  {smartCopy.headline}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                title="AI Personalization Privacy Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowQrModal(true)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer hidden sm:block"
                title="Scan QR Code"
              >
                <QrCode className="w-5 h-5 text-emerald-400" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {smartCopy.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{channel?.subscriberCount || '125,480+'} Active Subscribers</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">• {channel?.name}</span>
            </div>

            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>{smartCopy.buttonText}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <WhatsAppQrModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />
        <PrivacyControlModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      </>
    );
  }

  // DEFAULT VARIANT: Banner
  return (
    <>
      <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-800/80 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden ${className}`}>
        {/* Decorative Glow */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start sm:items-center gap-3.5 relative z-10">
          <div className="p-3 bg-gradient-to-tr from-emerald-600 to-green-500 rounded-2xl text-slate-950 shadow-lg shadow-emerald-500/25 shrink-0">
            <MessageCircle className="w-6 h-6 fill-current" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                {smartCopy.headline}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                {smartCopy.badge}
              </span>
              {prediction && prediction.followProbabilityScore >= 60 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  AI Recommended
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {smartCopy.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto relative z-10 shrink-0">
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer shrink-0"
            title="Privacy & AI Personalization Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer shrink-0"
            title="Scan QR Code to Join"
          >
            <QrCode className="w-5 h-5 text-emerald-400" />
          </button>

          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{smartCopy.buttonText}</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>
      </div>

      <WhatsAppQrModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />
      <PrivacyControlModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </>
  );
};
