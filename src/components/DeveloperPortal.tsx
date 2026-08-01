import React, { useState } from 'react';
import { Terminal, Key, Activity, Code, BookOpen, Copy, Check, ShieldCheck, Play, Layers } from 'lucide-react';
import { VeritasAPIService, APIKeyRecord, APIRequestLog } from '../services/VeritasAPIService';
import { INITIAL_ARTICLES } from '../data/mockNewsData';
import { NewsIntelligenceEngine } from '../services/NewsIntelligenceEngine';
import { RiskMonitoringEngine } from '../services/RiskMonitoringEngine';
import { IntelligenceReportService } from '../services/IntelligenceReportService';

export const DeveloperPortal: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKeyRecord[]>(VeritasAPIService.getAPIKeys());
  const [logs] = useState<APIRequestLog[]>(VeritasAPIService.getRecentLogs());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState<string>('');

  // Interactive Endpoint Tester state
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/news');
  const [testerParam, setTesterParam] = useState<string>('country=Rwanda');
  const [testResponse, setTestResponse] = useState<any | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const endpoints = VeritasAPIService.getEndpointsDocumentation();

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    VeritasAPIService.createAPIKey(newKeyName.trim());
    setApiKeys(VeritasAPIService.getAPIKeys());
    setNewKeyName('');
  };

  const handleRevokeKey = (keyId: string) => {
    VeritasAPIService.revokeAPIKey(keyId);
    setApiKeys(VeritasAPIService.getAPIKeys());
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExecuteAPITest = () => {
    setIsTesting(true);
    setTimeout(() => {
      let mockRes: any = {};
      if (selectedEndpoint === '/api/news') {
        mockRes = {
          status: 'success',
          endpoint: '/api/news',
          timestamp: new Date().toISOString(),
          data: INITIAL_ARTICLES.slice(0, 3).map(a => NewsIntelligenceEngine.analyzeArticle(a))
        };
      } else if (selectedEndpoint === '/api/risk') {
        mockRes = {
          status: 'success',
          endpoint: '/api/risk',
          timestamp: new Date().toISOString(),
          evaluation: RiskMonitoringEngine.evaluateSystemRisk(INITIAL_ARTICLES)
        };
      } else if (selectedEndpoint === '/api/reports') {
        mockRes = {
          status: 'success',
          endpoint: '/api/reports',
          timestamp: new Date().toISOString(),
          reports: [IntelligenceReportService.generateReport('Daily Intelligence Brief', INITIAL_ARTICLES)]
        };
      } else {
        mockRes = {
          status: 'success',
          endpoint: selectedEndpoint,
          query: testerParam,
          timestamp: new Date().toISOString(),
          resultCount: 24,
          executionTimeMs: 18,
          sovereignClusterNode: 'Norrsken-Kigali-Primary'
        };
      }
      setTestResponse(mockRes);
      setIsTesting(false);
    }, 400);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-mono">
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Veritas Intelligence REST & Telemetry API Platform</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Integrate high-frequency verified news dispatches, knowledge graph vectors, and risk evaluation endpoints directly into institutional software.
          </p>
        </div>

        <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-right">
          <span className="text-[10px] text-slate-400 block">Monthly Quota</span>
          <span className="text-sm font-bold text-emerald-400">42,180 / 500,000 reqs</span>
          <span className="text-[10px] text-slate-500 block">Rate Limit: 1,200 reqs/min</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: API Keys Management */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="w-4 h-4 text-indigo-400" /> API Access Credentials
            </span>
            <span className="text-slate-400">{apiKeys.length} Keys</span>
          </h3>

          <form onSubmit={handleCreateKey} className="space-y-2">
            <input
              type="text"
              placeholder="Key Description (e.g. Analytics Bot)"
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition"
            >
              Generate New API Key
            </button>
          </form>

          <div className="space-y-3 pt-2">
            {apiKeys.map(k => (
              <div key={k.keyId} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{k.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${k.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400'}`}>
                    {k.status}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800 font-mono text-[11px] text-slate-300">
                  <span className="truncate max-w-[180px]">{k.apiKey}</span>
                  <button
                    onClick={() => copyToClipboard(k.apiKey, k.keyId)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {copiedKey === k.keyId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Used: {k.lastUsed}</span>
                  {k.status === 'ACTIVE' && (
                    <button onClick={() => handleRevokeKey(k.keyId)} className="text-rose-400 hover:underline">
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Endpoints & Interactive Tester */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Tester Playground */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-emerald-400" /> Interactive Endpoint Tester Playground
              </span>
              <span className="text-slate-400">Sandbox Mode</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={selectedEndpoint}
                onChange={e => setSelectedEndpoint(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {endpoints.map(ep => (
                  <option key={ep.path} value={ep.path}>{ep.method} {ep.path}</option>
                ))}
              </select>

              <input
                type="text"
                value={testerParam}
                onChange={e => setTesterParam(e.target.value)}
                placeholder="Query params"
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />

              <button
                onClick={handleExecuteAPITest}
                disabled={isTesting}
                className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30"
              >
                <Play className="w-3.5 h-3.5" /> Execute Test Call
              </button>
            </div>

            {testResponse && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">JSON Output Response (HTTP 200 OK):</span>
                <pre className="text-[11px] text-emerald-300 max-h-48 overflow-y-auto no-scrollbar font-mono leading-tight">
                  {JSON.stringify(testResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Endpoints Reference List */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" /> API Endpoints Documentation Reference
            </h3>

            <div className="divide-y divide-slate-800">
              {endpoints.map(ep => (
                <div key={ep.path} className="py-3 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded">
                      {ep.method}
                    </span>
                    <span className="font-bold text-white">{ep.path}</span>
                    <span className="text-[11px] text-slate-400 font-mono">Sample: {ep.sampleParams}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{ep.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
