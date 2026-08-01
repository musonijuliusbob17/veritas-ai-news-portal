import React, { useState } from 'react';
import { Shield, Building, Users, Bell, Layers, Plus, Search, Eye, FileText, CheckCircle2, MessageSquare, AlertTriangle, Activity, Lock, Globe, Share2, Cpu } from 'lucide-react';
import { EnterpriseAccountService, OrganizationProfile } from '../services/EnterpriseAccountService';
import { IntelligenceRoomService, IntelligenceRoom } from '../services/IntelligenceRoomService';
import { IntelligenceAlertService, EnterpriseAlertRule } from '../services/IntelligenceAlertService';
import { SubscriptionManagementService } from '../services/SubscriptionManagementService';

export const EnterpriseIntelligenceDashboard: React.FC = () => {
  const [currentOrg, setCurrentOrg] = useState<OrganizationProfile>(EnterpriseAccountService.getCurrentOrganization());
  const [rooms, setRooms] = useState<IntelligenceRoom[]>(IntelligenceRoomService.getRooms());
  const [alertRules, setAlertRules] = useState<EnterpriseAlertRule[]>(IntelligenceAlertService.getAlertRules());
  const [activeTab, setActiveTab] = useState<'monitoring' | 'rooms' | 'team' | 'alerts'>('monitoring');

  // Custom monitoring states
  const [trackedTopics, setTrackedTopics] = useState<string[]>([
    'Rwanda Sovereign AI', 'Norrsken Kigali', 'East Africa BGP Connectivity', 'Kigali Health LLM'
  ]);
  const [newTopicInput, setNewTopicInput] = useState<string>('');

  // New Room Modal state
  const [showNewRoomModal, setShowNewRoomModal] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomType, setNewRoomType] = useState<'Company Monitoring Room' | 'Government Intelligence Room' | 'Research Room'>('Government Intelligence Room');

  // New Alert Rule Modal
  const [showNewAlertModal, setShowNewAlertModal] = useState<boolean>(false);
  const [newAlertTopic, setNewAlertTopic] = useState<string>('');
  const [newAlertThreshold, setNewAlertThreshold] = useState<number>(50);

  // Invite member state
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteName, setInviteName] = useState<string>('');

  const handleAddTrackedTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicInput.trim()) return;
    if (!trackedTopics.includes(newTopicInput.trim())) {
      setTrackedTopics([...trackedTopics, newTopicInput.trim()]);
    }
    setNewTopicInput('');
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    const room = IntelligenceRoomService.createRoom(newRoomName, newRoomType, currentOrg.organizationName);
    setRooms(IntelligenceRoomService.getRooms());
    setNewRoomName('');
    setShowNewRoomModal(false);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertTopic.trim()) return;
    IntelligenceAlertService.createAlertRule({
      topicTitle: newAlertTopic,
      targetDomain: 'Custom Intelligence Target',
      conditionDescription: `When risk index exceeds threshold ${newAlertThreshold}`,
      riskScoreThreshold: newAlertThreshold,
      deliveryChannels: ['DASHBOARD', 'WHATSAPP', 'EMAIL']
    });
    setAlertRules(IntelligenceAlertService.getAlertRules());
    setNewAlertTopic('');
    setShowNewAlertModal(false);
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;
    EnterpriseAccountService.inviteTeamMember(currentOrg.organizationId, inviteName, inviteEmail, 'ANALYST');
    setCurrentOrg({ ...EnterpriseAccountService.getCurrentOrganization() });
    setInviteEmail('');
    setInviteName('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-mono">
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">{currentOrg.organizationName}</h2>
            <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold rounded-full">
              {currentOrg.organizationType}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Enterprise Intelligence Operational Command • Country: {currentOrg.country} • Security Isolation: Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-right">
            <span className="text-[10px] text-slate-400 block">Subscription Tier</span>
            <span className="text-xs font-bold text-emerald-400">{currentOrg.subscriptionPlan} PLAN</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-right">
            <span className="text-[10px] text-slate-400 block">Team Seats</span>
            <span className="text-xs font-bold text-indigo-300">{currentOrg.teamMembers.length} Active Analysts</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'monitoring', label: 'Custom Monitoring & Live Feed', icon: Activity },
          { id: 'rooms', label: `Intelligence Rooms (${rooms.length})`, icon: Layers },
          { id: 'team', label: `Team Collaboration (${currentOrg.teamMembers.length})`, icon: Users },
          { id: 'alerts', label: `Enterprise Alerts (${alertRules.length})`, icon: Bell }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: CUSTOM MONITORING & LIVE FEED */}
      {activeTab === 'monitoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Custom Target Watchlist */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Search className="w-4 h-4 text-indigo-400" /> Monitored Entities & Topics
              </span>
              <span className="text-slate-400">{trackedTopics.length} Targets</span>
            </h3>

            <form onSubmit={handleAddTrackedTopic} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add country, tech, entity..."
                value={newTopicInput}
                onChange={e => setNewTopicInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {trackedTopics.map((topic, i) => (
                <div key={i} className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{topic}</span>
                  <button
                    onClick={() => setTrackedTopics(trackedTopics.filter(t => t !== topic))}
                    className="text-slate-500 hover:text-rose-400 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Middle & Right Column: Real-Time Enterprise Feed */}
          <div className="lg:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" /> Enterprise Live Intelligence Feed
              </span>
              <span className="text-slate-400">Live Telemetry</span>
            </h3>

            <div className="space-y-3">
              {[
                { time: '12m ago', category: 'COMPUTE CLUSTER', title: 'Norrsken Kigali AI Lab deployed 64x Nvidia B200 accelerators.', impact: 'HIGH', note: 'AI Search Assistant ingested node telemetry.' },
                { time: '45m ago', category: 'HEALTHCARE LLM', title: 'Kigali Central Hospital completed clinical trials for localized Kinyarwanda diagnosis.', impact: 'CRITICAL', note: 'Model accuracy reached 98.4%.' },
                { time: '2h ago', category: 'SUBSEA OPTICAL', title: 'Mombasa-Dar es Salaam optical fiber branch latency stabilized at 8.2ms.', impact: 'NORMAL', note: 'Risk monitoring engine updated status to GUARDED.' }
              ].map((feed, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-indigo-400">{feed.category}</span>
                    <span className="text-slate-500">{feed.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{feed.title}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>💡 {feed.note}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      feed.impact === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>{feed.impact} IMPACT</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTELLIGENCE ROOMS */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Private Organization Intelligence Chambers</h3>
            <button
              onClick={() => setShowNewRoomModal(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" /> Create Intelligence Room
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map(room => (
              <div key={room.roomId} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-[10px] font-bold">
                    {room.roomType}
                  </span>
                  <span className="text-[10px] text-slate-400">Created: {room.createdDate}</span>
                </div>

                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" /> {room.name}
                </h4>

                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tracked Entities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {room.trackedEntities.map((ent, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-[10px] text-slate-300 rounded">
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="text-indigo-400 font-bold block text-[10px] uppercase">Room Analyst Notes:</span>
                  {room.sharedNotes.map((note, idx) => (
                    <div key={idx} className="border-b border-slate-800/80 pb-1.5 last:border-0 last:pb-0 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-300">{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TEAM COLLABORATION */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" /> Invite Team Analyst
            </h3>

            <form onSubmit={handleInviteMember} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Analyst Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. Dr. Aline Umutoni"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Institutional Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="e.g. aline@eac.int"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
              >
                Send Invitation & Assign Key
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase flex items-center justify-between">
              <span>Active Institutional Team Members ({currentOrg.teamMembers.length})</span>
              <span className="text-slate-400">Domain RBAC Active</span>
            </h3>

            <div className="divide-y divide-slate-800">
              {currentOrg.teamMembers.map(m => (
                <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{m.name}</span>
                    <span className="text-slate-400 text-[11px]">{m.email}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-indigo-400">
                      {m.role}
                    </span>
                    <span className="text-[10px] text-slate-500">{m.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ENTERPRISE ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Configured Enterprise Risk & Telemetry Alerts</h3>
            <button
              onClick={() => setShowNewAlertModal(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" /> Add Alert Rule
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alertRules.map(rule => (
              <div key={rule.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-400">{rule.targetDomain}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rule.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                    {rule.isActive ? 'ACTIVE' : 'PAUSED'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{rule.topicTitle}</h4>
                <p className="text-xs text-slate-400">{rule.conditionDescription}</p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Channels: {rule.deliveryChannels.join(', ')}</span>
                  <button
                    onClick={() => {
                      IntelligenceAlertService.toggleAlertRule(rule.id);
                      setAlertRules(IntelligenceAlertService.getAlertRules());
                    }}
                    className="text-indigo-400 hover:underline font-bold"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Room */}
      {showNewRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Create Private Intelligence Room</h3>
            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Room Name</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={e => setNewRoomName(e.target.value)}
                  placeholder="e.g. East Africa Telecom Audit Chamber"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Chamber Classification</label>
                <select
                  value={newRoomType}
                  onChange={e => setNewRoomType(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Government Intelligence Room">Government Intelligence Room</option>
                  <option value="Company Monitoring Room">Company Monitoring Room</option>
                  <option value="Research Room">Research Room</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewRoomModal(false)} className="px-3 py-1.5 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl">Create Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Alert */}
      {showNewAlertModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Configure New Telemetry Alert</h3>
            <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Topic / Sector to Monitor</label>
                <input
                  type="text"
                  value={newAlertTopic}
                  onChange={e => setNewAlertTopic(e.target.value)}
                  placeholder="e.g. Rwanda AI Sector Infrastructure"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Risk Score Threshold (0 - 100)</label>
                <input
                  type="number"
                  value={newAlertThreshold}
                  onChange={e => setNewAlertThreshold(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewAlertModal(false)} className="px-3 py-1.5 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl">Activate Alert</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
