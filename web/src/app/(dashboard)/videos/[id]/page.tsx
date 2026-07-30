"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '../../../../lib/api';
import { useAuthStore } from '../../../../store/authStore';
import { Sparkles, FileText, Bot, Clock, PlayCircle, Send, User, Zap, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

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
    refetchInterval: (q) => (q?.state?.data?.status === 'COMPLETED' || q?.state?.data?.status === 'FAILED' ? false : 3000),
  });

  const parsedTimestamps = React.useMemo<Timestamp[]>(() => {
    if (!video?.transcript?.timestamps) return [];
    if (Array.isArray(video.transcript.timestamps)) return video.transcript.timestamps as Timestamp[];
    try {
      return typeof video.transcript.timestamps === 'string' ? JSON.parse(video.transcript.timestamps) : [];
    } catch {
      return [];
    }
  }, [video]);

  useEffect(() => {
    if (video && messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([
          {
            sender: 'ai',
            text: `Hi! I have successfully analyzed "${video.title}". Ask me anything about the content, or tell me to find specific moments, summarize discussions, or extract action items.`
          }
        ]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [video, messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 font-sans">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-gray-400 text-xs font-mono tracking-wider">Loading Video Workspace...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-5 rounded-xl text-xs font-sans flex items-center justify-between">
        <span>Failed to load video details. The video asset may have been removed.</span>
        <Link href="/videos" className="text-white hover:underline font-medium">Return to Library</Link>
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
            className="inline-flex items-center gap-1 mx-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-[10px] font-mono text-blue-400 px-1.5 py-0.5 rounded transition-all active:scale-95 cursor-pointer align-middle"
          >
            <PlayCircle className="w-3 h-3 text-blue-400" />
            {match[1]}:{match[2]}
          </button>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const getVideoStreamUrl = () => {
    if (!id) return '';
    const token = useAuthStore.getState().token;
    return `/api/videos/${id}/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`;
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !video) return;

    const userText = inputMessage.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await api.post(`/api/videos/${id}/chat`, { message: userText });
      const aiReply = response.data.reply;

      const timeMatch = aiReply.match(/\[(\d+):(\d+)\]/);
      let targetTime: number | undefined = undefined;
      if (timeMatch) {
        targetTime = parseInt(timeMatch[1], 10) * 60 + parseInt(timeMatch[2], 10);
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: aiReply,
        timestamp: targetTime
      }]);
    } catch (err) {
      console.error("Copilot chat error:", err);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "I encountered an issue processing your query. Please check network connectivity or try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Link href="/videos" className="w-8 h-8 rounded-lg bg-[#141418] hover:bg-[#1c1c22] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight truncate max-w-xl">{video.title}</h1>
            <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
              <span>Added {new Date(video.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="font-mono text-[10px] uppercase text-blue-400">{video.status}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleDeleteVideo}
          className="h-8 px-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg text-xs font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Video</span>
        </button>
      </div>

      {/* Main Grid Layout: Video + Copilot Chat & Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* Left Column: Player & Copilot */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Video Player */}
          <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl overflow-hidden shadow-lg flex flex-col">
            <video 
              ref={videoRef}
              src={getVideoStreamUrl()} 
              controls 
              className="w-full aspect-video bg-black object-contain cursor-pointer"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%230a0a0c'%3E%3Crect width='100' height='100'/%3E%3C/svg%3E"
            >
              Your browser does not support HTML5 video streaming.
            </video>
          </div>

          {/* AI Copilot Panel */}
          <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-4 flex flex-col flex-1 shadow-lg relative min-h-[350px]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs font-semibold text-white">VisiCore Copilot</h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                Gemini 3.6 Active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px] text-xs">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex gap-2.5 max-w-[90%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {msg.sender === 'ai' ? (
                    <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                      <Bot className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded bg-white/[0.1] flex items-center justify-center text-gray-300 flex-shrink-0 mt-0.5">
                      <User className="w-3 h-3" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#141418] border border-white/[0.06] text-gray-200'
                    }`}>
                      {msg.text.split('\n').map((line, lIdx) => (
                        <p key={lIdx} className={line ? 'mb-1 last:mb-0' : 'h-1'}>
                          {renderMessageText(line)}
                        </p>
                      ))}
                    </div>

                    {msg.timestamp !== undefined && (
                      <button 
                        onClick={() => seekTo(msg.timestamp!)}
                        className="flex items-center gap-1 text-[10px] font-mono text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <PlayCircle className="w-3 h-3" /> Jump to {formatTime(msg.timestamp)}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-xs text-gray-400">
                  <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Bot className="w-3 h-3 animate-spin" />
                  </div>
                  <span>Copilot analyzing query...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="mt-3 relative flex items-center">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={video.status === 'COMPLETED' ? "Ask anything about this video..." : "Waiting for analysis..."}
                disabled={video.status !== 'COMPLETED'}
                className="w-full bg-[#0d0d10] border border-white/[0.08] focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 text-white rounded-lg pl-3.5 pr-10 py-2 text-xs placeholder-gray-600 transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={video.status !== 'COMPLETED' || !inputMessage.trim()}
                className="absolute right-2 p-1 bg-blue-600 hover:bg-blue-500 text-white disabled:bg-transparent disabled:text-gray-600 rounded transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Insights & Transcript Tabs */}
        <div className="lg:col-span-5 bg-[#0a0a0c] border border-white/[0.08] rounded-xl overflow-hidden shadow-lg flex flex-col">
          {/* Tabs Navigation */}
          <div className="flex border-b border-white/[0.06] bg-[#070709]">
            <button 
              onClick={() => setActiveTab('transcript')}
              className={`flex-1 py-3 text-xs font-medium transition-colors border-b-2 ${
                activeTab === 'transcript'
                  ? 'border-blue-500 text-white bg-white/[0.03]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Transcript
            </button>
            <button 
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-3 text-xs font-medium transition-colors border-b-2 ${
                activeTab === 'summary'
                  ? 'border-blue-500 text-white bg-white/[0.03]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Summary
            </button>
            <button 
              onClick={() => setActiveTab('highlights')}
              className={`flex-1 py-3 text-xs font-medium transition-colors border-b-2 ${
                activeTab === 'highlights'
                  ? 'border-blue-500 text-white bg-white/[0.03]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Highlights
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-4 flex-1 overflow-y-auto max-h-[600px] text-xs">
            {video.status !== 'COMPLETED' ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 mb-3">
                  <Clock className="w-5 h-5 text-blue-400 animate-spin" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-1">Analyzing Media Content</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">Transcripts and smart summaries will appear automatically once Gemini processing completes.</p>
              </div>
            ) : (
              <div>
                {activeTab === 'transcript' && (
                  <div className="space-y-2">
                    {parsedTimestamps.length > 0 ? (
                      parsedTimestamps.map((ts, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => seekTo(ts.start)}
                          className="flex gap-3 p-2.5 hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-white/[0.06] group"
                        >
                          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded self-start mt-0.5">
                            {formatTime(ts.start)}
                          </span>
                          <p className="text-xs text-gray-300 leading-relaxed group-hover:text-white transition-colors">{ts.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 p-3 bg-[#141418] rounded-lg border border-white/[0.06]">
                        {video.transcript?.content || "No transcript available for this video."}
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'summary' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> TL;DR Executive Summary
                      </h4>
                      <div className="bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-lg text-xs text-blue-100 leading-relaxed">
                        {video.summary?.shortSummary || "No short summary available."}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-gray-300 mb-2">Detailed Analysis</h4>
                      <div className="bg-[#141418] border border-white/[0.06] p-3.5 rounded-lg text-xs text-gray-300 leading-relaxed">
                        {video.summary?.detailedSummary || "No detailed summary available."}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'highlights' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-blue-400" /> Key Scene Highlights
                    </h4>
                    {parsedTimestamps.length > 0 ? (
                      parsedTimestamps.slice(0, 4).map((ts, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => seekTo(ts.start)}
                          className="p-3 bg-[#141418] border border-white/[0.06] hover:border-blue-500/40 rounded-lg transition-all cursor-pointer group flex items-start gap-3"
                        >
                          <div className="w-7 h-7 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                            <PlayCircle className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors">Key Moment #{idx + 1}</span>
                              <span className="text-[10px] font-mono text-blue-400">{formatTime(ts.start)}</span>
                            </div>
                            <p className="text-[11px] text-gray-400 truncate">{ts.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No highlights detected.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
