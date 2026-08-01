import React, { useState } from 'react';
import { StockTickerItem } from '../types';
import { X, TrendingUp, TrendingDown, DollarSign, RefreshCw, BarChart2 } from 'lucide-react';

interface LiveFinancialHubProps {
  stocks: StockTickerItem[];
  onClose: () => void;
}

export const LiveFinancialHub: React.FC<LiveFinancialHubProps> = ({
  stocks,
  onClose
}) => {
  const [currencyAmount, setCurrencyAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'JPY' | 'RWF' | 'KES'>('USD');
  const [toCurrency, setToCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'JPY' | 'RWF' | 'KES'>('EUR');

  const RATES: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 154.2,
    RWF: 1380.0,
    KES: 129.5
  };

  const convertedValue = (currencyAmount / RATES[fromCurrency]) * RATES[toCurrency];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-emerald-500" />
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Global Financial Markets & Crypto Intelligence Center
              </h2>
              <p className="text-xs text-slate-500">Real-time indices, commodities, FX rates, and crypto liquidity feeds.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Ticker Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stocks.map(st => (
              <div key={st.symbol} className="p-4 bg-slate-50 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-1">
                <span className="text-xs font-bold text-slate-500 block">{st.name}</span>
                <span className="text-lg font-black text-slate-900 dark:text-white font-mono block">
                  {st.price.toLocaleString()} {st.currency}
                </span>
                <div className={`flex items-center gap-1 text-xs font-bold ${st.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {st.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{st.change >= 0 ? '+' : ''}{st.changePercent}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Currency Rates & Converter */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl space-y-4 shadow-lg border border-slate-800">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Veritas Global Currency & FX Calculator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Amount</label>
                <input
                  type="number"
                  value={currencyAmount}
                  onChange={(e) => setCurrencyAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">From</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="RWF">RWF - Rwandan Franc</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="RWF">RWF - Rwandan Franc</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between font-mono text-sm">
              <span className="text-slate-400">Converted Value:</span>
              <span className="text-emerald-400 font-bold text-lg">
                {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
