import React, { useState } from 'react';
import { Terminal, Code, Copy, Check, Key, Play, X, Server, ShieldCheck, Zap } from 'lucide-react';

interface NewsApiDevModalProps {
  onClose: () => void;
}

export const NewsApiDevModal: React.FC<NewsApiDevModalProps> = ({ onClose }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'news' | 'search' | 'summarize' | 'crawler'>('news');
  const [apiKey, setApiKey] = useState<string>('vrs_live_99f8a72b0c1e4d3a8e91');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Params for playground execution
  const [categoryParam, setCategoryParam] = useState<string>('Technology');
  const [searchParam, setSearchParam] = useState<string>('Artificial Intelligence');

  const executeApiRequest = async () => {
    setIsLoading(true);
    setApiResponse(null);

    try {
      let url = '/api/news';
      let options: RequestInit = { method: 'GET' };

      if (selectedEndpoint === 'search') {
        url = `/api/news/search?q=${encodeURIComponent(searchParam)}`;
      } else if (selectedEndpoint === 'summarize') {
        url = '/api/news/summarize';
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Global Semiconductor Investment Summit 2026',
            content: 'Leaders from Taiwan, Japan, EU and US convene to establish unified supply resilience standards.',
            language: 'English'
          })
        };
      } else if (selectedEndpoint === 'crawler') {
        url = '/api/crawler/logs';
      } else {
        url = `/api/news?category=${categoryParam}`;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      setApiResponse(data);
    } catch (err: any) {
      setApiResponse({ error: err.message || 'Failed to fetch API' });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurlSnippet = () => {
    if (selectedEndpoint === 'search') {
      return `curl -X GET "https://veritas-news.app/api/news/search?q=${searchParam}" \\\n  -H "Authorization: Bearer ${apiKey}"`;
    }
    if (selectedEndpoint === 'summarize') {
      return `curl -X POST "https://veritas-news.app/api/news/summarize" \\\n  -H "Authorization: Bearer ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"title": "Global Tech Summit", "language": "English"}'`;
    }
    if (selectedEndpoint === 'crawler') {
      return `curl -X GET "https://veritas-news.app/api/crawler/logs" \\\n  -H "Authorization: Bearer ${apiKey}"`;
    }
    return `curl -X GET "https://veritas-news.app/api/news?category=${categoryParam}" \\\n  -H "Authorization: Bearer ${apiKey}"`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCurlSnippet());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS PUBLIC NEWS API & DEVELOPER PORTAL</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  v2.4 PROD API
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Programmatic access to multi-publisher verified news streams, clusters, AI summaries, and entity intelligence.
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

        {/* API Key Bar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-mono">Your Developer API Key:</span>
            <code className="px-3 py-1 bg-slate-950 text-emerald-300 font-mono rounded-lg border border-slate-800">
              {apiKey}
            </code>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>RATE LIMIT: <strong>10,000 REQ/DAY</strong></span>
            <span>STATUS: <strong className="text-emerald-400">99.99% UP</strong></span>
          </div>
        </div>

        {/* Playground Grid */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950">
          {/* Endpoint Sidebar */}
          <div className="w-full md:w-72 bg-slate-900 border-r border-slate-800 p-4 space-y-2 overflow-y-auto">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              REST ENDPOINTS
            </h3>

            <button
              onClick={() => setSelectedEndpoint('news')}
              className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                selectedEndpoint === 'news'
                  ? 'bg-emerald-950 border-emerald-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] font-extrabold text-emerald-400 block font-mono">GET</span>
                <span>/api/news</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Feed</span>
            </button>

            <button
              onClick={() => setSelectedEndpoint('search')}
              className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                selectedEndpoint === 'search'
                  ? 'bg-emerald-950 border-emerald-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] font-extrabold text-emerald-400 block font-mono">GET</span>
                <span>/api/news/search</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Search</span>
            </button>

            <button
              onClick={() => setSelectedEndpoint('summarize')}
              className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                selectedEndpoint === 'summarize'
                  ? 'bg-emerald-950 border-emerald-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 block font-mono">POST</span>
                <span>/api/news/summarize</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">AI Gemini</span>
            </button>

            <button
              onClick={() => setSelectedEndpoint('crawler')}
              className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                selectedEndpoint === 'crawler'
                  ? 'bg-emerald-950 border-emerald-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] font-extrabold text-emerald-400 block font-mono">GET</span>
                <span>/api/crawler/logs</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Telemetry</span>
            </button>
          </div>

          {/* Interactive Request & Response Inspector */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* cURL Snippet Card */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> cURL REQUEST SNIPPET
                </span>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSnippet ? 'COPIED!' : 'COPY cURL'}
                </button>
              </div>

              <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                {getCurlSnippet()}
              </pre>
            </div>

            {/* Test Controls Bar */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  PLAYGROUND PARAMETERS
                </h3>
                <button
                  onClick={executeApiRequest}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Play className="w-4 h-4" /> {isLoading ? 'EXECUTING...' : 'RUN LIVE REQUEST'}
                </button>
              </div>

              {selectedEndpoint === 'news' && (
                <div className="flex items-center gap-3 text-xs">
                  <label className="text-slate-400 font-mono">Category:</label>
                  <select
                    value={categoryParam}
                    onChange={(e) => setCategoryParam(e.target.value)}
                    className="bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {['All', 'Technology', 'Politics', 'Business', 'World', 'Climate'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedEndpoint === 'search' && (
                <div className="flex items-center gap-3 text-xs">
                  <label className="text-slate-400 font-mono">Search Query:</label>
                  <input
                    type="text"
                    value={searchParam}
                    onChange={(e) => setSearchParam(e.target.value)}
                    className="flex-1 bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Response Viewer */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 font-mono flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" /> API RESPONSE INSPECTOR
                </span>
                {apiResponse && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                    HTTP 200 OK
                  </span>
                )}
              </div>

              <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto h-56 whitespace-pre-wrap">
                {apiResponse ? JSON.stringify(apiResponse, null, 2) : '// Click "RUN LIVE REQUEST" above to inspect real JSON payload...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
