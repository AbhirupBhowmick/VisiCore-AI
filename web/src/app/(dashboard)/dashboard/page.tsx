"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import { PlayCircle, Clock, CheckCircle2, AlertCircle, FileVideo, UploadCloud, ChevronRight, Activity, Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface VideoItem {
  id: string;
  title: string;
  status: 'UPLOAD_PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  minioUrl: string;
  duration: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: videos, isLoading, error } = useQuery<VideoItem[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await api.get('/api/videos');
      return response.data;
    },
    refetchInterval: 5000, // Poll every 5 seconds for status updates
  });

  const getStatusBadge = (status: VideoItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Ready
          </span>
        );
      case 'PROCESSING':
      case 'UPLOAD_PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3 animate-spin text-blue-400" style={{ animationDuration: '2s' }} /> Processing
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3 text-rose-400" /> Failed
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] gap-3">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-gray-400 text-xs font-mono tracking-wider">Syncing Video Assets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-5 rounded-xl flex items-center gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
        <div>
          <h3 className="text-xs font-semibold text-white">API Connection Error</h3>
          <p className="text-xs text-gray-400 mt-0.5">Failed to synchronize with backend services. Please check network connectivity.</p>
        </div>
      </div>
    );
  }

  const sortedVideos = videos?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-400 mb-1">
            <Activity className="w-3.5 h-3.5" /> Live Workspace Pipeline
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Video Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Monitor processing state, transcripts, and Gemini AI analysis.</p>
        </div>
        
        <Link 
          href="/upload" 
          className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all duration-150 shadow-[0_0_12px_rgba(37,99,235,0.3)] hover:shadow-[0_0_18px_rgba(37,99,235,0.5)] active:scale-[0.98] inline-flex items-center justify-center gap-2 group cursor-pointer self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Video</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0a0a0c] border border-white/[0.08] p-4 rounded-xl">
          <p className="text-[11px] font-medium text-gray-400">Total Asset Collection</p>
          <p className="text-2xl font-bold text-white mt-1 tracking-tight">{sortedVideos.length}</p>
        </div>
        
        <div className="bg-[#0a0a0c] border border-white/[0.08] p-4 rounded-xl">
          <p className="text-[11px] font-medium text-gray-400">Completed Analyses</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1 tracking-tight">
            {sortedVideos.filter(v => v.status === 'COMPLETED').length}
          </p>
        </div>

        <div className="bg-[#0a0a0c] border border-white/[0.08] p-4 rounded-xl">
          <p className="text-[11px] font-medium text-gray-400">Active Queue Pipeline</p>
          <p className="text-2xl font-bold text-blue-400 mt-1 tracking-tight">
            {sortedVideos.filter(v => v.status === 'PROCESSING' || v.status === 'UPLOAD_PENDING').length}
          </p>
        </div>
      </div>

      {/* Main Video Collection Grid */}
      {sortedVideos.length === 0 ? (
        <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-12 text-center flex flex-col items-center shadow-lg relative overflow-hidden">
          <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
            <FileVideo className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">No videos uploaded yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
            Upload your first video asset to generate automated transcripts, timestamp indexing, and Gemini AI insights.
          </p>
          <Link href="/upload" className="h-9 px-4 bg-[#141418] hover:bg-[#1c1c22] border border-white/[0.08] hover:border-white/[0.16] text-white text-xs font-medium rounded-lg transition-all inline-flex items-center gap-2">
            <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
            <span>Go to Upload Center</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedVideos.map((video) => (
            <div 
              key={video.id} 
              className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl overflow-hidden group hover:border-white/[0.18] transition-all duration-200 shadow-md hover:shadow-xl flex flex-col cursor-pointer"
              onClick={() => window.location.href = `/videos/${video.id}`}
            >
              
              {/* Media Card Thumbnail Header */}
              <div className="aspect-video bg-[#101014] relative overflow-hidden flex items-center justify-center border-b border-white/[0.06] group-hover:bg-[#14141a] transition-colors">
                <div className="w-10 h-10 rounded-full bg-black/60 border border-white/[0.12] flex items-center justify-center z-10 group-hover:border-blue-500/50 group-hover:scale-105 transition-all duration-200">
                  <PlayCircle className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                </div>
                
                <div className="absolute bottom-2 left-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 border border-white/[0.08]">
                  4K • AI READY
                </div>
              </div>
              
              {/* Card Meta Description */}
              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <h3 className="text-white font-medium text-xs line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
                
                <div className="pt-3 flex items-center justify-between border-t border-white/[0.05]">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                  {getStatusBadge(video.status)}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
