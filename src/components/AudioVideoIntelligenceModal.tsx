import React, { useState } from 'react';
import { Article } from '../types';
import { Volume2, Play, Pause, SkipForward, X, Video, Radio, Sparkles, Mic, FileText, Clock, User, CheckCircle2 } from 'lucide-react';

interface AudioVideoIntelligenceModalProps {
  articles: Article[];
  onClose: () => void;
  onSelectArticle: (art: Article) => void;
}

interface AudioBriefing {
  id: string;
  title: string;
  category: string;
  duration: string;
  narrator: string;
  summary: string;
  transcript: Array<{ time: string; text: string }>;
}

const DAILY_BRIEFINGS: AudioBriefing[] = [
  {
    id: 'b1',
    title: 'Global Executive Morning Briefing: Energy Summit & AI Chips',
    category: 'Morning Wire',
    duration: '04:15',
    narrator: 'Veritas Gemini Neural Voice (Female - Neutral)',
    summary: 'Comprehensive analysis of the Washington D.C. energy transition agreements and global semiconductor supply chain developments.',
    transcript: [
      { time: '00:00', text: 'Welcome to the Veritas Global Morning Briefing for today.' },
      { time: '00:30', text: 'In our top story, delegates at the Washington Energy Summit have finalized terms on subsea transmission line investments.' },
      { time: '01:45', text: 'Turning to tech news, global semiconductor foundries reported record quarterly yields for sub-3nm chipsets.' },
      { time: '03:10', text: 'Financial markets responded positively, with major indices gaining 1.2 percent across early European trading.' }
    ]
  },
  {
    id: 'b2',
    title: 'Africa Tech & Innovation Wire: Renewable Infrastructure & Trade',
    category: 'Africa Report',
    duration: '03:45',
    narrator: 'Veritas Gemini Neural Voice (Male - African Accent)',
    summary: 'Focus on East African geothermal expansion, mobile finance integration, and Pan-African trade corridor milestones.',
    transcript: [
      { time: '00:00', text: 'Broadcasting live from the Veritas East Africa desk in Nairobi.' },
      { time: '01:10', text: 'Kenya has officially commissioned an additional geothermal capacity of 300 Megawatts at Olkaria.' },
      { time: '02:30', text: 'Cross-border digital settlement mechanisms have reduced transaction friction across 12 participating nations.' }
    ]
  },
  {
    id: 'b3',
    title: 'Evening Financial & Economic Wrap: Central Bank Policy',
    category: 'Evening Digest',
    duration: '05:00',
    narrator: 'Veritas Gemini Neural Voice (Male - Professional)',
    summary: 'Complete summary of global monetary policy updates, currency exchange movements, and commodity futures.',
    transcript: [
      { time: '00:00', text: 'Good evening. This is the Veritas Global Financial Summary.' },
      { time: '02:00', text: 'Central bank governors emphasized prudent inflation management while hinting at prospective benchmark rate recalibration.' }
    ]
  }
];

interface VideoItem {
  id: string;
  title: string;
  publisher: string;
  duration: string;
  speaker: string;
  speakerRole: string;
  thumbnail: string;
  keyHighlights: string[];
}

const VIDEO_FEEDS: VideoItem[] = [
  {
    id: 'v1',
    title: 'UN General Assembly Address on Climate Resilience & Clean Energy',
    publisher: 'United Nations Press',
    duration: '14:20',
    speaker: 'António Guterres',
    speakerRole: 'UN Secretary-General',
    thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    keyHighlights: [
      'Call for accelerated climate financing for developing nations.',
      'Establishment of global AI governance monitoring framework.',
      'Pledge to phase out high-emission energy subsidies by 2030.'
    ]
  },
  {
    id: 'v2',
    title: 'Federal Reserve Press Conference: Economic Growth Outlook',
    publisher: 'US Federal Reserve Wire',
    duration: '22:15',
    speaker: 'Jerome Powell',
    speakerRole: 'Federal Reserve Chair',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    keyHighlights: [
      'Inflation trends stabilizing near target equilibrium.',
      'Labor market demonstrates resilience without overheating.',
      'Monetary policy remains data-dependent for future quarters.'
    ]
  }
];

export const AudioVideoIntelligenceModal: React.FC<AudioVideoIntelligenceModalProps> = ({
  articles,
  onClose,
  onSelectArticle
}) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'video'>('audio');
  const [selectedBriefing, setSelectedBriefing] = useState<AudioBriefing>(DAILY_BRIEFINGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(VIDEO_FEEDS[0]);

  const togglePlayAudio = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const fullText = `${selectedBriefing.title}. ${selectedBriefing.summary}. ${selectedBriefing.transcript.map(t => t.text).join(' ')}`;
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.rate = playbackRate;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">VERITAS AUDIO & VIDEO INTELLIGENCE HUB</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-950 text-purple-300 border border-purple-800">
                  AI NEURAL SYNTHESIS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Listen to automated executive podcasts or inspect AI video transcripts and speaker identification.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-3 text-xs">
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'audio'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" /> AI DAILY PODCASTS & AUDIO BRIEFINGS
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'video'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Video className="w-4 h-4" /> VIDEO INTELLIGENCE & PRESS CONFERENCES
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'audio' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950">
            {/* Playlist Sidebar */}
            <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 p-4 space-y-3 overflow-y-auto">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                AVAILABLE BRIEFINGS ({DAILY_BRIEFINGS.length})
              </h3>
              {DAILY_BRIEFINGS.map(b => {
                const isSelected = selectedBriefing.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                      setIsPlaying(false);
                      setSelectedBriefing(b);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-950 to-slate-900 border-purple-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-purple-400">{b.category}</span>
                      <span className="text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {b.duration}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-white leading-snug">{b.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{b.summary}</p>
                  </div>
                );
              })}
            </div>

            {/* Active Player & Interactive Transcript */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Player Header Card */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-950 text-purple-300 border border-purple-800">
                    {selectedBriefing.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Narrator: <strong>{selectedBriefing.narrator}</strong>
                  </span>
                </div>

                <h2 className="text-xl font-black text-white">{selectedBriefing.title}</h2>
                <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  {selectedBriefing.summary}
                </p>

                {/* Animated Audio Player Controls */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlayAudio}
                      className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>

                    <div>
                      <p className="text-xs font-extrabold text-white">
                        {isPlaying ? 'PLAYING NEURAL AUDIO BROADCAST...' : 'READY TO STREAM BRIEFING'}
                      </p>
                      {isPlaying && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-1.5 h-4 bg-purple-400 animate-bounce"></span>
                          <span className="w-1.5 h-6 bg-pink-400 animate-bounce delay-100"></span>
                          <span className="w-1.5 h-3 bg-purple-400 animate-bounce delay-200"></span>
                          <span className="w-1.5 h-5 bg-pink-400 animate-bounce delay-300"></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Playback Rate Selector */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-mono">Speed:</span>
                    {[1.0, 1.25, 1.5].map(rate => (
                      <button
                        key={rate}
                        onClick={() => setPlaybackRate(rate)}
                        className={`px-2.5 py-1 rounded-lg font-bold font-mono transition-all ${
                          playbackRate === rate ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Audio Transcript */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" /> AI INTERACTIVE TIMESTAMP TRANSCRIPT
                </h3>

                <div className="space-y-3">
                  {selectedBriefing.transcript.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-3"
                    >
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 text-[11px] font-mono font-bold shrink-0 mt-0.5">
                        {item.time}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Video Intelligence Tab */
          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-950">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {VIDEO_FEEDS.map(vid => (
                <div key={vid.id} className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden space-y-4 p-5">
                  <div className="relative h-48 rounded-2xl overflow-hidden group">
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                      <div className="flex items-center justify-between w-full text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-extrabold flex items-center gap-1">
                          <Video className="w-3.5 h-3.5" /> {vid.publisher}
                        </span>
                        <span className="font-mono text-white bg-black/60 px-2 py-0.5 rounded">{vid.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-lg text-white leading-snug">{vid.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <User className="w-4 h-4 text-purple-400" />
                      <span>Speaker: <strong className="text-white">{vid.speaker}</strong> ({vid.speakerRole})</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI EXTRACTED HIGHLIGHTS</h4>
                    {vid.keyHighlights.map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
