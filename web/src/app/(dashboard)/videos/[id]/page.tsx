"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '../../../../lib/api';
import { Sparkles, FileText, Bot, Clock, PlayCircle, Send, User, Zap, Trash2 } from 'lucide-react';

interface Timestamp {
  start: number;
  end: number;
  text: string;
}

interface VideoDetail {
  id: string;
  title: string;
  status: string;
  minioUrl: string;
  createdAt: string;
  transcript?: {
    content: string;
    timestamps: string;
  };
  summary?: {
    shortSummary: string;
    detailedSummary: string;
  };
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp?: number;
}

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState<'transcript' | 'summary' | 'highlights'>('transcript');
  const [parsedTimestamps, setParsedTimestamps] = useState<Timestamp[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { data: video, isLoading, error } = useQuery<VideoDetail>({
    queryKey: ['video', id],
    queryFn: async () => {
      const response = await api.get(`/api/videos/${id}`);
      return response.data;
    },
    refetchInterval: (query: any) => (query?.state?.data?.status === 'COMPLETED' || query?.state?.data?.status === 'FAILED' ? false : 3000),
  });

  useEffect(() => {
    if (video?.transcript?.timestamps) {
      try {
        setParsedTimestamps(JSON.parse(video.transcript.timestamps));
      } catch (e) {
        console.error("Failed to parse timestamps", e);
      }
    }
  }, [video]);

  useEffect(() => {
    if (video) {
      setMessages([
        {
          sender: 'ai',
          text: `Hi! I have successfully analyzed "${video.title}". Ask me anything about the content, or tell me to find specific moments, summarize discussions, or extract action items.`
        }
      ]);
    }
  }, [video?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl">
        Failed to load video details.
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const seekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
    }
  };

  const renderMessageText = (text: string) => {
    const parts = text.split(/(\[\d+:\d+\])/g);
    return parts.map((part, idx) => {
      const match = part.match(/\[(\d+):(\d+)\]/);
      if (match) {
        const mins = parseInt(match[1], 10);
        const secs = parseInt(match[2], 10);
        const totalSeconds = mins * 60 + secs;
        return (
          <button
            key={idx}
            onClick={() => seekTo(totalSeconds)}
            className="inline-flex items-center gap-1 mx-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-[11px] font-mono text-blue-400 px-2 py-0.5 rounded-md transition-all active:scale-95 cursor-pointer align-middle"
          >
            <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
            {match[1]}:{match[2]}
          </button>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const getEncodedMinioUrl = (path: string) => {
    if (!path) return '';
    // Encode space characters, '#' hashes, and special characters in each url segment
    return path.split('/').map(segment => encodeURIComponent(segment)).join('/');
  };

  const handleDeleteVideo = async () => {
    if (!confirm("Are you sure you want to permanently delete this video from your library? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`/api/videos/${id}`);
      router.push('/videos');
    } catch (err) {
      console.error("Failed to delete video", err);
      alert("Failed to delete video. Please check connection.");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !video) return;

    const userText = inputMessage.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      let targetTime: number | undefined = undefined;
      const lowerText = userText.toLowerCase();

      // ── FULL TRANSCRIPT CONTENT for search context ─────────────────────
      const fullTranscript = video.transcript?.content || '';
      const allWords = lowerText.split(/\s+/).filter(w => w.length > 2);

      // ── Score each timestamp segment by relevance ──────────────────────
      const scored = parsedTimestamps.map(ts => {
        const tsLower = ts.text.toLowerCase();
        let score = 0;
        // exact phrase match
        if (tsLower.includes(lowerText)) score += 10;
        // individual word matches
        allWords.forEach(word => { if (tsLower.includes(word)) score += 2; });
        return { ts, score };
      }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

      // ── Also search full transcript for context sentences ──────────────
      const transcriptSentences = fullTranscript
        .split(/(?<=[.!?])\s+/)
        .filter(s => s.length > 20);
      const matchingSentences = transcriptSentences.filter(sentence => {
        const sl = sentence.toLowerCase();
        if (sl.includes(lowerText)) return true;
        return allWords.filter(w => sl.includes(w)).length >= Math.max(1, Math.floor(allWords.length * 0.4));
      }).slice(0, 4);

      // ── INTENT: Summary ────────────────────────────────────────────────
      if (/\b(summary|summarize|summarise|tldr|tl;dr|overview|what is this|what is the video|what is it about|about|main point|key point|topics|discuss)\b/.test(lowerText)) {
        aiResponseText =
          `Here is a complete breakdown of this video:\n\n` +
          `**TL;DR:**\n${video.summary?.shortSummary || 'Video summary not yet available.'}\n\n` +
          `**In-Depth Analysis:**\n${video.summary?.detailedSummary || 'Detailed summary not yet available.'}\n\n` +
          `**Full Video Timeline:**\n` +
          (parsedTimestamps.length > 0
            ? parsedTimestamps.map(ts => `• [${formatTime(ts.start)}] ${ts.text}`).join('\n')
            : '• No timeline data available yet.');

      // ── INTENT: Full transcript ────────────────────────────────────────
      } else if (/\b(transcript|full text|everything said|all words|verbatim)\b/.test(lowerText)) {
        aiResponseText =
          `**Full Video Transcript:**\n\n` +
          (fullTranscript || 'Transcript not yet available for this video.');

      // ── INTENT: Timestamp matches found ───────────────────────────────
      } else if (scored.length > 0) {
        const topMatches = scored.slice(0, 5);
        targetTime = topMatches[0].ts.start;
        aiResponseText =
          `I found **${topMatches.length}** relevant moment${topMatches.length > 1 ? 's' : ''} in the video for "${userText}":\n\n` +
          topMatches.map((s, i) =>
            `${i + 1}. [${formatTime(s.ts.start)}] — "${s.ts.text}"`
          ).join('\n\n');

        if (matchingSentences.length > 0) {
          aiResponseText += `\n\n**Additional context from transcript:**\n"${matchingSentences.join(' ')}"`;
        }
        aiResponseText += `\n\nClick any timestamp above to jump directly to that moment!`;

      // ── INTENT: Transcript text matches (no timestamps) ───────────────
      } else if (matchingSentences.length > 0) {
        aiResponseText =
          `I found relevant content in the transcript for "${userText}":\n\n` +
          `"${matchingSentences.join(' ')}"\n\n` +
          `The full video transcript and timeline are available in the Transcript tab above.`;

      // ── FALLBACK: Show what we know ────────────────────────────────────
      } else {
        aiResponseText =
          `I couldn't find an exact match for "${userText}" in this video's transcript.\n\n` +
          `**What I know about this video:**\n` +
          `${video.summary?.shortSummary || video.title}\n\n` +
          `**Full Timeline:**\n` +
          (parsedTimestamps.length > 0
            ? parsedTimestamps.map(ts => `• [${formatTime(ts.start)}] ${ts.text}`).join('\n')
            : '• Transcript not yet available.') +
          `\n\nTry asking about topics, people, or phrases you expect to hear in this video.`;
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: aiResponseText,
        timestamp: targetTime
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 pb-6 font-sans">
      
      {/* LEFT COLUMN: Video & Chat */}
      <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
        {/* Video Player Container */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden shadow-lg flex-shrink-0 flex flex-col max-h-[50%]">
          <video 
            ref={videoRef}
            src={`http://localhost:9000${getEncodedMinioUrl(video.minioUrl)}`} 
            controls 
            className="w-full h-full max-h-[260px] md:max-h-[300px] bg-black object-contain cursor-pointer"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23141414'%3E%3Crect width='100' height='100'/%3E%3C/svg%3E"
          >
            Your browser does not support the video tag.
          </video>
          <div className="p-4 border-t border-[#262626] bg-[#0A0A0A] flex justify-between items-center">
             <div className="min-w-0">
               <h1 className="text-base font-bold text-white truncate">{video.title}</h1>
               <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                 <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(video.createdAt).toLocaleDateString()}</span>
                 <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border
                    ${video.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      video.status === 'FAILED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}
                 `}>
                   {video.status}
                 </span>
               </div>
             </div>

             {/* Delete Button */}
             <button
               onClick={handleDeleteVideo}
               className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer ml-4"
             >
               <Trash2 className="w-3.5 h-3.5" />
               <span>Delete Video</span>
             </button>
          </div>
        </div>

        {/* AI Copilot Chat */}
        <div className="flex-1 bg-[#141414] border border-[#262626] rounded-2xl p-5 flex flex-col shadow-lg overflow-hidden relative">
          <div className="flex items-center gap-3 mb-4 border-b border-[#262626] pb-3 flex-shrink-0">
             <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
               <Bot className="w-4 h-4 text-blue-500" />
             </div>
             <div className="flex flex-col">
               <div className="flex items-center gap-2">
                 <h2 className="text-sm font-bold text-white">VisiCore AI Copilot</h2>
                 <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-[9px] font-extrabold text-blue-400 border border-blue-500/20 uppercase tracking-wider">Gemma 4</span>
               </div>
               <span className="text-[10px] text-green-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Active Session Context</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-800">
             {messages.map((msg, index) => (
               <div 
                 key={index} 
                 className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
               >
                 {msg.sender === 'ai' ? (
                   <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Bot className="w-3.5 h-3.5 text-blue-400" />
                   </div>
                 ) : (
                   <div className="w-7 h-7 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <User className="w-3.5 h-3.5 text-gray-300" />
                   </div>
                 )}
                 <div className="flex flex-col gap-1.5">
                   <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm
                     ${msg.sender === 'user' ? 
                       'bg-blue-600 text-white rounded-tr-none' : 
                       'bg-[#1a1a1a] border border-[#262626] text-gray-300 rounded-tl-none'
                     }
                   `}>
                      {msg.text.split('\n').map((line, lIdx) => (
                        <p key={lIdx} className={line ? 'mb-1 last:mb-0' : 'h-2'}>
                          {renderMessageText(line)}
                        </p>
                      ))}
                   </div>
                   
                   {msg.timestamp !== undefined && (
                     <button 
                       onClick={() => seekTo(msg.timestamp!)}
                       className="self-start flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-[10px] font-mono text-blue-400 px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer mt-0.5"
                     >
                       <PlayCircle className="w-3.5 h-3.5" /> Jump to Moment ({formatTime(msg.timestamp)})
                     </button>
                   )}
                 </div>
               </div>
             ))}

             {isTyping && (
               <div className="flex gap-3 max-w-[85%]">
                 <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                   <Bot className="w-3.5 h-3.5 text-blue-400" />
                 </div>
                 <div className="bg-[#1a1a1a] border border-[#262626] p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                 </div>
               </div>
             )}

             <div ref={chatEndRef} />
             
             {/* Disabled Overlay if not completed */}
             {video.status !== 'COMPLETED' && (
               <div className="absolute inset-0 top-[60px] bg-[#141414]/85 backdrop-blur-sm flex items-center justify-center z-10">
                 <div className="flex flex-col items-center bg-[#0A0A0A] border border-[#262626] p-6 rounded-xl shadow-2xl">
                   <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                   <p className="text-white font-medium text-sm">Analyzing video context...</p>
                   <p className="text-[10px] text-gray-400 mt-1">Copilot will be active once pipeline completes.</p>
                 </div>
               </div>
             )}
          </div>

          <form onSubmit={handleSendMessage} className="relative flex items-center mt-auto flex-shrink-0">
             <input 
               type="text" 
               value={inputMessage}
               onChange={(e) => setInputMessage(e.target.value)}
               placeholder={video.status === 'COMPLETED' ? "Ask about this video..." : "Waiting for analysis pipeline..."}
               disabled={video.status !== 'COMPLETED'}
               className="w-full bg-[#050505] border border-[#222] text-xs text-white rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-40 transition-all placeholder-gray-600"
             />
             <button 
               type="submit"
               disabled={video.status !== 'COMPLETED' || !inputMessage.trim()}
               className="absolute right-2.5 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-[#141414] text-white disabled:text-gray-600 rounded-lg transition-all active:scale-95 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed border-none outline-none"
             >
               <Send className="w-3.5 h-3.5" />
             </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Insights Panel */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#141414] border border-[#262626] rounded-2xl flex flex-col shadow-lg overflow-hidden h-full flex-shrink-0">
        {/* Tabs */}
        <div className="flex border-b border-[#262626] bg-[#0A0A0A] flex-shrink-0">
          <button 
            onClick={() => setActiveTab('transcript')}
            className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'transcript' ? 'border-blue-500 text-blue-500 bg-[#141414]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#141414]'}`}
          >
            Transcript
          </button>
          <button 
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'summary' ? 'border-blue-500 text-blue-500 bg-[#141414]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#141414]'}`}
          >
            Summary
          </button>
          <button 
            onClick={() => setActiveTab('highlights')}
            className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'highlights' ? 'border-blue-500 text-blue-500 bg-[#141414]' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#141414]'}`}
          >
            Highlights
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 relative">
           {video.status !== 'COMPLETED' ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
                 <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-[#262626] mb-4">
                   <FileText className="w-8 h-8 text-gray-500 animate-pulse" />
                 </div>
                 <h3 className="text-sm font-bold text-white mb-1.5">Processing Insights</h3>
                 <p className="text-xs text-gray-400 max-w-[240px] leading-relaxed">Our neural pipeline is currently analyzing this video to extract the transcript and generate smart summaries.</p>
              </div>
           ) : (
             <div className="h-full">
               {activeTab === 'transcript' && (
                 <div className="space-y-2">
                   {parsedTimestamps.length > 0 ? (
                     parsedTimestamps.map((ts, idx) => (
                       <div 
                         key={idx} 
                         onClick={() => seekTo(ts.start)}
                         className="flex gap-4 p-3 hover:bg-[#1a1a1a] rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-[#262626]"
                       >
                          <span className="text-xs font-mono text-blue-500 mt-1 whitespace-nowrap bg-blue-500/10 px-2 py-0.5 rounded flex items-center gap-1 self-start">
                            <PlayCircle className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {formatTime(ts.start)}
                          </span>
                          <p className="text-xs text-gray-300 leading-relaxed group-hover:text-white transition-colors">{ts.text}</p>
                       </div>
                     ))
                   ) : (
                     <p className="text-gray-400 text-xs p-3 leading-relaxed bg-[#1a1a1a] rounded-xl border border-[#262626]">{video.transcript?.content || "No transcript available."}</p>
                   )}
                 </div>
               )}

               {activeTab === 'summary' && (
                 <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> TL;DR
                      </h4>
                      <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl text-xs text-blue-50 leading-relaxed shadow-inner">
                        {video.summary?.shortSummary || "No short summary available."}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Detailed Notes</h4>
                      <div className="bg-[#1a1a1a] border border-[#262626] p-4 rounded-xl text-xs text-gray-300 leading-relaxed space-y-4">
                        <p>{video.summary?.detailedSummary || "No detailed summary available."}</p>
                      </div>
                    </div>
                 </div>
               )}

               {activeTab === 'highlights' && (
                 <div className="space-y-4">
                   <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                     <Zap className="w-3.5 h-3.5 animate-pulse text-blue-400" /> AI Key Scenes Detect
                   </h4>
                   {parsedTimestamps.length > 0 ? (
                     <div className="space-y-3">
                       {parsedTimestamps.slice(0, 3).map((ts, idx) => (
                         <div 
                           key={idx} 
                           onClick={() => seekTo(ts.start)}
                           className="bg-[#1a1a1a] border border-[#262626] hover:border-blue-500/50 p-4 rounded-xl transition-all cursor-pointer group flex items-start gap-4 hover:shadow-[0_0_15px_rgba(59,130,246,0.05)] active:scale-[0.99]"
                         >
                           <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-200">
                             <PlayCircle className="w-5 h-5" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center mb-1">
                               <span className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">Scene Highlight #{idx + 1}</span>
                               <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{formatTime(ts.start)}</span>
                             </div>
                             <p className="text-[11px] text-gray-400 leading-relaxed truncate">{ts.text}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="flex flex-col items-center justify-center py-12 text-center">
                       <Sparkles className="w-12 h-12 text-gray-600 mb-4" />
                       <h4 className="text-white font-medium mb-1">No Highlights Yet</h4>
                       <p className="text-sm text-gray-400 max-w-[200px]">Waiting for transcription data to isolate highlight moments.</p>
                     </div>
                   )}
                 </div>
               )}
             </div>
           )}
        </div>
      </div>

    </div>
  );
}
