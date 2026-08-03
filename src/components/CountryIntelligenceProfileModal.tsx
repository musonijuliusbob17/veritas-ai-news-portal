import React, { useState } from 'react';
import {
  X,
  Globe,
  Building2,
  ShieldCheck,
  Scale,
  BookOpen,
  Users,
  Radio,
  FileText,
  Plus,
  Search,
  Flag,
  MapPin,
  Sparkles,
  Award,
  Landmark,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import {
  CountryIntelligenceEngine,
  CountryIntelligenceProfile,
  InstitutionalEntity
} from '../services/CountryIntelligenceEngine';

interface CountryIntelligenceProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIsoCode?: string;
}

type TabType =
  | 'overview'
  | 'government'
  | 'media_publishers'
  | 'parties_politics'
  | 'institutions'
  | 'legal_laws'
  | 'add_country';

export const CountryIntelligenceProfileModal: React.FC<CountryIntelligenceProfileModalProps> = ({
  isOpen,
  onClose,
  initialIsoCode = 'RWA'
}) => {
  const allProfiles = CountryIntelligenceEngine.getAllCountryProfiles();
  const [selectedIso, setSelectedIso] = useState<string>(initialIsoCode);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Add country form state
  const [newIsoCode, setNewIsoCode] = useState('');
  const [newCountryName, setNewCountryName] = useState('');
  const [newCapital, setNewCapital] = useState('');
  const [newRegion, setNewRegion] = useState<CountryIntelligenceProfile['region']>('Africa');
  const [newFlagEmoji, setNewFlagEmoji] = useState('🌐');
  const [newSummary, setNewSummary] = useState('');
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentProfile =
    CountryIntelligenceEngine.getCountryProfile(selectedIso) || allProfiles[0];

  const filteredProfiles = allProfiles.filter(
    p =>
      p.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.isoCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegisterNewCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIsoCode || !newCountryName) return;

    const customProfile: CountryIntelligenceProfile = {
      isoCode: newIsoCode.toUpperCase(),
      countryName: newCountryName,
      region: newRegion,
      flagEmoji: newFlagEmoji || '🌐',
      capital: newCapital || 'Capital City',
      population: '10.0 Million',
      gdpNominal: '$25.0 Billion',
      currency: 'Local Currency',
      intelligenceSummary:
        newSummary || `${newCountryName} registered in Veritas Country Intelligence Hub.`,
      riskRating: 'LOW',
      lastAuditDate: new Date().toISOString().split('T')[0],
      languages: [
        { name: 'Official Language', type: 'Official', speakersPercentage: 90 }
      ],
      government: {
        systemType: 'Constitutional Republic',
        headOfState: { name: 'Head of State', title: 'President' },
        rulingCoalitionOrParty: 'National Alliance',
        governanceTrustIndex: 85,
        capitalCity: newCapital || 'Capital'
      },
      media: {
        pressFreedomIndexRank: 50,
        mediaRegulatoryBody: 'National Communications Authority',
        majorBroadcasters: ['National Broadcast Station'],
        independentMediaStatus: 'Active independent media sector.'
      },
      publishers: [
        {
          id: `pub_${newIsoCode}_01`,
          name: `${newCountryName} Daily Herald`,
          type: 'Independent',
          trustScore: 88,
          reach: 'National'
        }
      ],
      politicalParties: [
        {
          name: 'Democratic Alliance',
          acronym: 'DA',
          orientation: 'Centrist',
          seatsPercentage: 55,
          status: 'Ruling'
        }
      ],
      administrativeDivisions: [
        { name: 'Capital District', type: 'Province', capital: newCapital || 'Capital' }
      ],
      universities: [
        {
          name: `National University of ${newCountryName}`,
          category: 'University',
          description: 'Top research and engineering center.'
        }
      ],
      ngos: [],
      thinkTanks: [
        {
          name: `${newCountryName} Strategic Studies Institute`,
          category: 'Think Tank',
          description: 'Policy and economic research group.'
        }
      ],
      courts: [
        {
          name: `Supreme Court of ${newCountryName}`,
          category: 'Court',
          description: 'Highest appellate court.'
        }
      ],
      ministries: [
        {
          name: 'Ministry of Information and Tech',
          category: 'Ministry',
          description: 'Directs digital governance and tech policy.'
        }
      ],
      internationalOrganizations: [
        {
          name: 'United Nations Member',
          category: 'International Organization',
          description: 'Sovereign UN member state.'
        }
      ],
      laws: [
        {
          title: 'National Digital Security Framework',
          category: 'Cybersecurity',
          enactedYear: 2024,
          summary: 'Governs national cyber resilience and data privacy.'
        }
      ]
    };

    CountryIntelligenceEngine.registerCountryProfile(customProfile);
    setSelectedIso(customProfile.isoCode);
    setRegisterSuccessMessage(
      `Country "${newCountryName}" (${newIsoCode.toUpperCase()}) registered successfully without altering core pipeline code!`
    );
    // Reset
    setNewIsoCode('');
    setNewCountryName('');
    setNewCapital('');
    setNewSummary('');
    setActiveTab('overview');

    setTimeout(() => setRegisterSuccessMessage(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-wide">Country Intelligence Profile System</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Phase 9 Dynamic Architecture
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Comprehensive 13-vector deep intelligence profiles for global sovereign states
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner */}
        {registerSuccessMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/30 px-6 py-3 text-xs text-emerald-300 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{registerSuccessMessage}</span>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Country Selector Sidebar */}
          <div className="w-72 border-r border-slate-800 bg-slate-950/40 p-4 flex flex-col space-y-4 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search country or ISO..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase px-2 mb-1">
                Registered Sovereign Profiles ({filteredProfiles.length})
              </div>
              {filteredProfiles.map(p => {
                const isSelected = p.isoCode === currentProfile.isoCode;
                return (
                  <button
                    key={p.isoCode}
                    onClick={() => {
                      setSelectedIso(p.isoCode);
                      if (activeTab === 'add_country') setActiveTab('overview');
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition border ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                        : 'border-slate-800/60 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="text-xl">{p.flagEmoji}</span>
                      <div className="truncate">
                        <div className="text-xs font-semibold truncate">{p.countryName}</div>
                        <div className="text-[10px] text-slate-400">{p.capital} · {p.region}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
                      {p.isoCode}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setActiveTab('add_country')}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Country</span>
            </button>
          </div>

          {/* Right Detailed View */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/50">
            {activeTab !== 'add_country' ? (
              <>
                {/* Profile Header Banner */}
                <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl p-3 bg-slate-800/80 border border-slate-700/60 rounded-2xl shadow-inner">
                      {currentProfile.flagEmoji}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-2xl font-bold text-white">{currentProfile.countryName}</h3>
                        <span className="px-2.5 py-0.5 text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-md">
                          ISO: {currentProfile.isoCode}
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-800 text-slate-300 rounded-md">
                          {currentProfile.region}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                        {currentProfile.intelligenceSummary}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-400">Risk Assessment:</span>
                      <span
                        className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                          currentProfile.riskRating === 'LOW'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {currentProfile.riskRating} RISK
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Audited: {currentProfile.lastAuditDate}
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center space-x-1 px-6 border-b border-slate-800 bg-slate-950/40 text-xs overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-3 px-4 border-b-2 font-medium transition ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-400 font-semibold'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Overview & Facts
                  </button>
                  <button
                    onClick={() => setActiveTab('government')}
                    className={`py-3 px-4 border-b-2 font-medium transition ${
                      activeTab === 'government'
                        ? 'border-blue-500 text-blue-400 font-semibold'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Government & Ministries
                  </button>
                  <button
                    onClick={() => setActiveTab('media_publishers')}
                    className={`py-3 px-4 border-b-2 font-medium transition ${
                      activeTab === 'media_publishers'
                        ? 'border-blue-500 text-blue-400 font-semibold'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Media & Publishers
                  </button>
                  <button
                    onClick={() => setActiveTab('parties_politics')}
                    className={`py-3 px-4 border-b-2 font-medium transition ${
                      activeTab === 'parties_politics'
                        ? 'border-blue-500 text-blue-400 font-semibold'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Politics & Parties
                  </button>
                  <button
                    onClick={() => setActiveTab('institutions')}
                    className={`py-3 px-4 border-b-2 font-medium transition ${
                      activeTab === 'institutions'
                        ? 'border-blue-500 text-blue-400 font-semibold'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Institutions & Orgs
                  </button>
                  <button
                    onClick={() => setActiveTab('legal_laws')}
                    className={`py-3 px-4 border-b-2 font-medium transition ${
                      activeTab === 'legal_laws'
                        ? 'border-blue-500 text-blue-400 font-semibold'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Legal & Laws
                  </button>
                </div>

                {/* Tab Panel Display */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Key Indicators Matrix */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                          <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            <span>Capital City</span>
                          </div>
                          <div className="text-lg font-bold text-white mt-1">{currentProfile.capital}</div>
                        </div>

                        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                          <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                            <Users className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Population</span>
                          </div>
                          <div className="text-lg font-bold text-white mt-1">{currentProfile.population}</div>
                        </div>

                        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                          <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                            <span>GDP (Nominal)</span>
                          </div>
                          <div className="text-lg font-bold text-white mt-1">{currentProfile.gdpNominal}</div>
                        </div>

                        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                          <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                            <Landmark className="w-3.5 h-3.5 text-purple-400" />
                            <span>Currency</span>
                          </div>
                          <div className="text-sm font-bold text-white mt-2 truncate">{currentProfile.currency}</div>
                        </div>
                      </div>

                      {/* Languages Section */}
                      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
                        <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <span>Languages Profile</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          {currentProfile.languages.map((lang, idx) => (
                            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                              <div className="text-xs font-semibold text-slate-200">{lang.name}</div>
                              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                                <span className="px-1.5 py-0.2 bg-slate-800 text-blue-400 rounded">
                                  {lang.type}
                                </span>
                                {lang.speakersPercentage && (
                                  <span className="font-mono text-emerald-400">{lang.speakersPercentage}%</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Administrative Divisions */}
                      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
                        <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <span>Administrative Divisions ({currentProfile.administrativeDivisions.length})</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {currentProfile.administrativeDivisions.map((div, idx) => (
                            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs">
                              <div className="font-semibold text-slate-200">{div.name}</div>
                              <div className="text-[11px] text-slate-400 mt-1">
                                Capital: {div.capital} · {div.type}
                              </div>
                              {div.populationEstimate && (
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  Pop: {div.populationEstimate}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'government' && (
                    <div className="space-y-6">
                      {/* Government System Details */}
                      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                        <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-blue-400" />
                          <span>Government Architecture</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div className="bg-slate-900 p-3.5 border border-slate-800 rounded-lg">
                            <span className="text-slate-400 block mb-1">System of Governance</span>
                            <span className="font-bold text-slate-100">{currentProfile.government.systemType}</span>
                          </div>
                          <div className="bg-slate-900 p-3.5 border border-slate-800 rounded-lg">
                            <span className="text-slate-400 block mb-1">Head of State</span>
                            <span className="font-bold text-slate-100">{currentProfile.government.headOfState.name}</span>
                            <span className="text-[10px] text-slate-500 block">{currentProfile.government.headOfState.title}</span>
                          </div>
                          <div className="bg-slate-900 p-3.5 border border-slate-800 rounded-lg">
                            <span className="text-slate-400 block mb-1">Ruling Party / Coalition</span>
                            <span className="font-bold text-emerald-400">{currentProfile.government.rulingCoalitionOrParty}</span>
                          </div>
                        </div>
                      </div>

                      {/* Key Ministries */}
                      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
                        <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                          <Landmark className="w-4 h-4 text-purple-400" />
                          <span>Key Cabinet Ministries ({currentProfile.ministries.length})</span>
                        </h4>
                        <div className="space-y-2.5">
                          {currentProfile.ministries.map((min, idx) => (
                            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-100">{min.name}</span>
                                {min.headOrLead && (
                                  <span className="text-[11px] px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded">
                                    Lead: {min.headOrLead}
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-400 text-[11px] mt-1">{min.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'media_publishers' && (
                    <div className="space-y-6">
                      {/* Media Landscape Overview */}
                      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                            <Radio className="w-4 h-4 text-amber-400" />
                            <span>Media Freedom & Regulatory Environment</span>
                          </h4>
                          <span className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg font-mono">
                            Press Freedom Index: #{currentProfile.media.pressFreedomIndexRank}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {currentProfile.media.independentMediaStatus}
                        </p>
                        <div className="text-xs text-slate-400">
                          <strong>Regulatory Body:</strong> {currentProfile.media.mediaRegulatoryBody}
                        </div>
                      </div>

                      {/* Verified Publishers List */}
                      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
                        <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span>Tracked Sovereign Publishers ({currentProfile.publishers.length})</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {currentProfile.publishers.map((pub) => (
                            <div key={pub.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-start justify-between text-xs">
                              <div>
                                <div className="font-semibold text-white">{pub.name}</div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                  Type: {pub.type} · Reach: {pub.reach}
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                                  {pub.trustScore}% Trust
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'parties_politics' && (
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                      <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span>Registered Political Parties</span>
                      </h4>
                      <div className="space-y-3">
                        {currentProfile.politicalParties.map((party, idx) => (
                          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between text-xs">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-white text-sm">{party.name}</span>
                                <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[10px]">
                                  {party.acronym}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1">
                                Orientation: {party.orientation}
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <span
                                className={`px-2.5 py-1 text-[11px] font-bold rounded ${
                                  party.status === 'Ruling'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {party.status}
                              </span>
                              <div className="text-right">
                                <div className="font-mono text-sm font-bold text-blue-400">
                                  {party.seatsPercentage}%
                                </div>
                                <div className="text-[10px] text-slate-500">Parliamentary Seats</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'institutions' && (
                    <div className="space-y-6">
                      <InstitutionalSection
                        title="Universities & Research Centers"
                        items={currentProfile.universities}
                        icon={<BookOpen className="w-4 h-4 text-indigo-400" />}
                      />
                      <InstitutionalSection
                        title="Think Tanks & Policy Hubs"
                        items={currentProfile.thinkTanks}
                        icon={<Award className="w-4 h-4 text-amber-400" />}
                      />
                      <InstitutionalSection
                        title="Courts & Judiciary"
                        items={currentProfile.courts}
                        icon={<Scale className="w-4 h-4 text-emerald-400" />}
                      />
                      <InstitutionalSection
                        title="International Organizations"
                        items={currentProfile.internationalOrganizations}
                        icon={<Globe className="w-4 h-4 text-blue-400" />}
                      />
                      <InstitutionalSection
                        title="NGOs & Civil Society"
                        items={currentProfile.ngos}
                        icon={<Users className="w-4 h-4 text-pink-400" />}
                      />
                    </div>
                  )}

                  {activeTab === 'legal_laws' && (
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                      <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                        <Scale className="w-4 h-4 text-blue-400" />
                        <span>Sovereign Legal Frameworks & Acts</span>
                      </h4>
                      <div className="space-y-3">
                        {currentProfile.laws.map((law, idx) => (
                          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-sm">{law.title}</span>
                              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded text-[10px] font-mono">
                                Enacted {law.enactedYear}
                              </span>
                            </div>
                            <div className="text-[11px] text-amber-400 font-semibold">{law.category}</div>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{law.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Add Country Registration Form */
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center space-x-2 text-blue-300 font-bold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>Dynamic Country Registration Protocol</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Register a new sovereign state profile into the Veritas Knowledge Registry.
                      This extends crawler ingestion, node generation, and narrative attribution
                      <strong className="text-blue-300"> without altering any core application code.</strong>
                    </p>
                  </div>

                  <form onSubmit={handleRegisterNewCountry} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
                    <h4 className="text-sm font-bold text-white mb-2">Country Identity Parameters</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Country Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tanzania"
                          value={newCountryName}
                          onChange={e => setNewCountryName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">ISO 3-Letter Code *</label>
                        <input
                          type="text"
                          required
                          maxLength={3}
                          placeholder="e.g. TZA"
                          value={newIsoCode}
                          onChange={e => setNewIsoCode(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white uppercase font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Capital City</label>
                        <input
                          type="text"
                          placeholder="e.g. Dodoma"
                          value={newCapital}
                          onChange={e => setNewCapital(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Region</label>
                        <select
                          value={newRegion}
                          onChange={e => setNewRegion(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="Africa">Africa</option>
                          <option value="Europe">Europe</option>
                          <option value="Asia">Asia</option>
                          <option value="North America">North America</option>
                          <option value="South America">South America</option>
                          <option value="Middle East">Middle East</option>
                          <option value="Oceania">Oceania</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Flag Emoji</label>
                        <input
                          type="text"
                          placeholder="🇹🇿"
                          value={newFlagEmoji}
                          onChange={e => setNewFlagEmoji(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-center text-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Intelligence Briefing</label>
                      <textarea
                        rows={3}
                        placeholder="Brief overview of geopolitical, technological, and economic focus areas..."
                        value={newSummary}
                        onChange={e => setNewSummary(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="pt-2 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Register Sovereign Profile</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface InstitutionalSectionProps {
  title: string;
  items: InstitutionalEntity[];
  icon: React.ReactNode;
}

const InstitutionalSection: React.FC<InstitutionalSectionProps> = ({ title, items, icon }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
      <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
        {icon}
        <span>{title} ({items.length})</span>
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs space-y-1">
            <div className="font-semibold text-slate-100 flex items-center justify-between">
              <span>{item.name}</span>
              {item.headOrLead && (
                <span className="text-[10px] text-slate-400 font-mono">Lead: {item.headOrLead}</span>
              )}
            </div>
            <p className="text-slate-400 text-[11px]">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
