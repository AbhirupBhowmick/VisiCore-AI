"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import { PlayCircle, Clock, CheckCircle2, AlertCircle, FileVideo, Search, Grid, List, Plus, Calendar, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface VideoItem {
  id: string;
  title: string;
  status: 'UPLOAD_PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  minioUrl: string;
  duration: number;
  createdAt: string;
}

export default function VideoLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: videos, isLoading, error, refetch } = useQuery<VideoItem[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await api.get('/api/videos');
      return response.data;
    },
    refetchInterval: 5000,
  });

  const handleDeleteVideo = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this video from your library? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`/api/videos/${id}`);
      refetch();
    } catch (err) {
      console.error("Failed to delete video", err);
      alert("Failed to delete video. Please check connection.");
    }
  };

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
      <div className="flex flex-col items-center justify-center min-h-[45vh] gap-3 font-sans">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-gray-400 text-xs font-mono tracking-wider">Loading Video Vault...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-5 rounded-xl flex items-center gap-3 font-sans">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
        <div>
          <h3 className="text-xs font-semibold text-white">System Connectivity Issue</h3>
          <p className="text-xs text-gray-400 mt-0.5">Failed to communicate with REST API. Please ensure the backend is healthy.</p>
        </div>
      </div>
    );
  }

  const filteredVideos = (videos || []).filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedVideos = filteredVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Video Vault</h1>
          <p className="text-xs text-gray-400 mt-0.5">Review, search, and manage processed video telemetry assets.</p>
        </div>
        <Link 
          href="/upload" 
          className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all duration-150 shadow-[0_0_12px_rgba(37,99,235,0.3)] hover:shadow-[0_0_18px_rgba(37,99,235,0.5)] active:scale-[0.98] inline-flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Footage</span>
        </Link>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#0a0a0c] border border-white/[0.08] p-3 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Filter catalog..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d0d10] border border-white/[0.08] focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 text-white rounded-lg pl-9 pr-3.5 py-1.5 text-xs placeholder-gray-600 transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center bg-[#0d0d10] border border-white/[0.08] p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white/[0.08] text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white/[0.08] text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {sortedVideos.length === 0 ? (
        <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-12 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3 border border-blue-500/20">
            <FileVideo className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">No videos matched query</h3>
          <p className="text-xs text-gray-400 max-w-sm">Upload more files or adjust search keywords to view processing catalogs.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedVideos.map((video) => (
            <div 
              key={video.id} 
              className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl overflow-hidden group hover:border-white/[0.18] transition-all duration-200 shadow-md hover:shadow-xl flex flex-col cursor-pointer relative"
              onClick={() => window.location.href = `/videos/${video.id}`}
            >
              <div className="aspect-video bg-[#101014] relative overflow-hidden flex items-center justify-center border-b border-white/[0.06]">
                <button
                  onClick={(e) => handleDeleteVideo(e, video.id)}
                  className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-md bg-black/60 hover:bg-rose-600 border border-white/[0.1] hover:border-rose-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-150 cursor-pointer shadow-md"
                  title="Delete video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="w-10 h-10 rounded-full bg-black/60 border border-white/[0.12] flex items-center justify-center z-10 group-hover:border-blue-500/50 group-hover:scale-105 transition-all duration-200">
                  <PlayCircle className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="absolute bottom-2 left-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 border border-white/[0.08]">
                  4K • READY
                </div>
              </div>

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
      ) : (
        /* LIST VIEW */
        <div className="space-y-2.5">
          {sortedVideos.map((video) => (
            <div 
              key={video.id}
              className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/[0.16] rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer transition-all duration-150 group"
              onClick={() => window.location.href = `/videos/${video.id}`}
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-12 h-9 bg-[#101014] border border-white/[0.06] rounded-md flex items-center justify-center flex-shrink-0 group-hover:border-blue-500/30 transition-colors">
                  <PlayCircle className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-medium text-xs truncate group-hover:text-blue-400 transition-colors">{video.title}</h3>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                {getStatusBadge(video.status)}
                <div className="w-7 h-7 rounded-md bg-[#141418] border border-white/[0.08] flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-blue-600 transition-all">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <button
                  onClick={(e) => handleDeleteVideo(e, video.id)}
                  className="w-7 h-7 rounded-md bg-[#141418] hover:bg-rose-600 border border-white/[0.08] hover:border-rose-500 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
                  title="Delete video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
