import React, { useState } from 'react';
import { ShoppingBag, FileText, Globe, Shield, Zap, Download, CheckCircle, Star, Filter, ArrowRight, Lock, Eye } from 'lucide-react';
import { ReportDeliveryService, PurchasedReport } from '../services/ReportDeliveryService';
import { IntelligenceReportService, GeneratedReport } from '../services/IntelligenceReportService';
import { EnterpriseAccountService } from '../services/EnterpriseAccountService';

export interface MarketplaceProduct {
  id: string;
  title: string;
  category: 'Country Reports' | 'Industry Reports' | 'Risk Reports';
  description: string;
  summary: string;
  coveragePeriod: string;
  sourcesCount: number;
  priceUSD: number;
  accessLevel: 'PUBLIC' | 'PROFESSIONAL' | 'ENTERPRISE';
  rating: number;
  sampleKeyInsights: string[];
}

export const IntelligenceMarketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [purchasedList, setPurchasedList] = useState<PurchasedReport[]>(ReportDeliveryService.getPurchasedReports());
  const [activePreviewProduct, setActivePreviewProduct] = useState<MarketplaceProduct | null>(null);
  const [purchasedSuccessMsg, setPurchasedSuccessMsg] = useState<string | null>(null);

  const currentOrg = EnterpriseAccountService.getCurrentOrganization();

  const products: MarketplaceProduct[] = [
    {
      id: 'prod_rwanda_2026',
      title: 'Rwanda Sovereign AI & Digital Economy Outlook 2026-2030',
      category: 'Country Reports',
      description: 'Definitive strategic assessment of Kigali Innovation City, Norrsken Kigali compute expansions, and national sovereign LLM deployments.',
      summary: 'Comprehensive analysis of Rwanda digital transformation metrics showing 140% YoY compute expansion, strategic cross-border tech partnerships, and low sovereign AI operational risk.',
      coveragePeriod: '2026 Q1 - Q3',
      sourcesCount: 142,
      priceUSD: 499,
      accessLevel: 'PROFESSIONAL',
      rating: 4.9,
      sampleKeyInsights: [
        'National compute cluster capacity tripled in Norrsken Kigali.',
        'Kigali Health AI error rate reduced by 34% using localized clinical model.',
        'Digital sovereign cloud policy updated for EAC inter-operability.'
      ]
    },
    {
      id: 'prod_kenya_econ_2026',
      title: 'Kenya Tech Ecosystem & Silicon Savannah Economic Outlook',
      category: 'Country Reports',
      description: 'Macro-economic assessment of Nairobi fintech corridors, mobile money inter-operability, and regional venture capital flows.',
      summary: 'Deep dive into Kenya tech investment resilience, mobile money cross-border clearing, and grid energy stability for data center nodes.',
      coveragePeriod: '2026 H1',
      sourcesCount: 98,
      priceUSD: 399,
      accessLevel: 'PUBLIC',
      rating: 4.8,
      sampleKeyInsights: [
        'Fintech transaction volume up 28% YoY across EAC trade corridors.',
        'Geothermal energy powering 92% of new Nairobi hyperscale data centers.'
      ]
    },
    {
      id: 'prod_ea_tech_2026',
      title: 'East Africa High-Performance Technology & Infrastructure Report',
      category: 'Industry Reports',
      description: 'Cross-border study of Rwanda, Kenya, Uganda, and Tanzania subsea fiber rings, satellite broadband, and regional AI labs.',
      summary: 'Evaluation of digital infrastructure resilience across East Africa with BGP route anomaly monitoring and subsea fiber redundancy maps.',
      coveragePeriod: '2026 Full Year',
      sourcesCount: 215,
      priceUSD: 699,
      accessLevel: 'ENTERPRISE',
      rating: 5.0,
      sampleKeyInsights: [
        'Subsea cable landings in Mombasa & Dar es Salaam achieved 99.99% uptime.',
        'Terrestrial fiber latency between Kigali and Nairobi reduced to 14ms.'
      ]
    },
    {
      id: 'prod_ai_industry_2026',
      title: 'Global Sovereign AI & Frontier LLM Industry Matrix',
      category: 'Industry Reports',
      description: 'Industry benchmark examining national AI models, localized fine-tuning, and compute cluster supply chains across emerging economies.',
      summary: 'Detailed taxonomy of global sovereign AI initiatives with emphasis on multilingual performance, healthcare LLMs, and regulatory frameworks.',
      coveragePeriod: '2026 H2',
      sourcesCount: 310,
      priceUSD: 799,
      accessLevel: 'PROFESSIONAL',
      rating: 4.9,
      sampleKeyInsights: [
        'Open-weight fine-tunes outperforming commercial models in localized clinical trials.',
        'Edge TPU deployments expanding in agricultural telemetry networks.'
      ]
    },
    {
      id: 'prod_pol_risk_2026',
      title: 'East Africa Geopolitical & Economic Risk Assessment 2026',
      category: 'Risk Reports',
      description: 'Predictive risk rating across EAC trade corridors, currency fluctuations, regulatory changes, and cyber threat indicators.',
      summary: 'VIOS Risk Engine composite assessment rating overall regional operational threat level at GUARDED (Score: 24/100).',
      coveragePeriod: '2026 Dynamic Real-Time',
      sourcesCount: 180,
      priceUSD: 599,
      accessLevel: 'ENTERPRISE',
      rating: 4.8,
      sampleKeyInsights: [
        'Trade corridor logistics risk decreased by 12 points post-digital customs launch.',
        'Cyber incident frequency targeting municipal networks remains at LOW threat tier.'
      ]
    }
  ];

  const filteredProducts = selectedCategory === 'ALL'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handlePurchase = (prod: MarketplaceProduct) => {
    const pur = ReportDeliveryService.purchaseReport(
      prod.title,
      prod.category === 'Country Reports' ? 'Country' : prod.category === 'Industry Reports' ? 'Industry' : 'Risk',
      prod.priceUSD,
      currentOrg.organizationName
    );
    setPurchasedList(ReportDeliveryService.getPurchasedReports());
    setPurchasedSuccessMsg(`Successfully acquired "${prod.title}". License & Watermark generated.`);
    setTimeout(() => setPurchasedSuccessMsg(null), 4000);
  };

  const isAlreadyPurchased = (title: string) => {
    return purchasedList.some(p => p.title === title);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white font-mono">Veritas Global Intelligence Marketplace</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Acquire institutional-grade country reports, industry matrices, and risk assessments. Delivered with digital watermarks, live API sync, and executive PDF exports.
          </p>
        </div>

        <div className="px-4 py-2 bg-slate-950 border border-indigo-500/30 rounded-xl text-right">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Active Customer Account</span>
          <span className="text-sm font-bold text-indigo-300 font-mono">{currentOrg.organizationName}</span>
          <span className="text-[10px] text-emerald-400 font-mono block">Plan: {currentOrg.subscriptionPlan} (Full License)</span>
        </div>
      </div>

      {purchasedSuccessMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> {purchasedSuccessMsg}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          {['ALL', 'Country Reports', 'Industry Reports', 'Risk Reports'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'All Intelligence Products' : cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredProducts.length} verified products
        </span>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(prod => {
          const purchased = isAlreadyPurchased(prod.title);
          return (
            <div key={prod.id} className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-indigo-500/40 transition space-y-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase ${
                    prod.category === 'Country Reports'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : prod.category === 'Industry Reports'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {prod.category}
                  </span>

                  <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{prod.rating}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition leading-snug">
                  {prod.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {prod.description}
                </p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Sample Key Insights:</span>
                  <ul className="space-y-1">
                    {prod.sampleKeyInsights.map((ins, idx) => (
                      <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Coverage: {prod.coveragePeriod}</span>
                  <span className="text-slate-400">Sources: {prod.sourcesCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Single Org License</span>
                    <span className="text-lg font-bold text-white">${prod.priceUSD}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActivePreviewProduct(prod)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
                      title="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {purchased ? (
                      <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Acquired
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePurchase(prod)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Purchase
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Digital Library & Purchased Reports */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white font-mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" /> Digital Intelligence Library ({purchasedList.length} Items)
          </span>
          <span className="text-xs text-slate-400">Watermark Licensing Active</span>
        </h3>

        <div className="divide-y divide-slate-800">
          {purchasedList.map(item => (
            <div key={item.purchaseId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="space-y-1">
                <span className="font-bold text-white block">{item.title}</span>
                <span className="text-[10px] text-slate-400">
                  Purchased: {item.purchaseDate} • Licensed to: {item.purchasedByOrg} • Watermark ID: {item.watermarkText}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Downloading Watermarked PDF for "${item.title}"...\n\nDigital Stamp: ${item.watermarkText}`)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" /> PDF
                </button>
                <button
                  onClick={() => alert(`Exporting Markdown Source for "${item.title}"`)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center gap-1 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" /> Markdown
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Preview Modal */}
      {activePreviewProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-indigo-400 uppercase">{activePreviewProduct.category}</span>
              <button onClick={() => setActivePreviewProduct(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <h3 className="text-base font-bold text-white">{activePreviewProduct.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{activePreviewProduct.summary}</p>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="text-indigo-400 font-bold block">Key Insights Included in Full Report:</span>
              <ul className="space-y-1">
                {activePreviewProduct.sampleKeyInsights.map((ki, idx) => (
                  <li key={idx} className="text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> {ki}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-bold text-white">${activePreviewProduct.priceUSD} USD</span>
              <button
                onClick={() => {
                  handlePurchase(activePreviewProduct);
                  setActivePreviewProduct(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition"
              >
                Acquire Full Intelligence Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
