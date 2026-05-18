"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import { PlayCircle, Clock, CheckCircle, AlertCircle, FileVideo, Search, Grid, List, Plus, Video, Calendar, Eye, Trash2 } from 'lucide-react';
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
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'PROCESSING':
      case 'UPLOAD_PENDING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
            <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} /> Processing
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-gray-400 text-sm font-mono tracking-widest uppercase">Fetching Video Vault...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl flex items-center gap-3">
        <AlertCircle className="w-6 h-6 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-white">System Connectivity Issue</h3>
          <p className="text-sm text-gray-400 mt-1">Failed to communicate with REST API. Please ensure the backend is healthy.</p>
        </div>
      </div>
    );
  }

  const filteredVideos = (videos || []).filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedVideos = filteredVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="pb-12 font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Video Vault</h1>
          <p className="text-gray-400 text-sm">Review processing logs, transcripts, and AI models across all telemetry footage.</p>
        </div>
        <Link href="/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2 self-start md:self-auto">
          <Plus className="w-5 h-5" />
          <span>Upload Footage</span>
        </Link>
      </div>

      {/* Control bar: search & layout toggles */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0A0A0A] border border-[#262626] p-4 rounded-2xl mb-8">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search catalog..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#000000] border border-[#262626] text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm placeholder-gray-600"
          />
        </div>
        
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex items-center bg-[#000000] border border-[#262626] p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-500/10 text-blue-500' : 'text-gray-500 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-500/10 text-blue-500' : 'text-gray-500 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {sortedVideos.length === 0 ? (
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-16 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-500/5 rounded-2xl flex items-center justify-center mb-6 border border-[#262626]">
            <FileVideo className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No videos matched</h3>
          <p className="text-gray-400 mb-6 max-w-sm text-sm">Upload more files or adjust search keywords to view processing catalogs.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedVideos.map((video) => (
            <div 
              key={video.id} 
              className="bg-[#0A0A0A] border border-[#262626] rounded-2xl overflow-hidden group hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(37,99,235,0.08)] flex flex-col cursor-pointer relative"
              onClick={() => window.location.href = `/videos/${video.id}`}
            >
              <div className="aspect-video bg-[#141414] relative overflow-hidden flex items-center justify-center border-b border-[#262626]">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:12px_12px]"></div>
                
                {/* Trash Button */}
                <button
                  onClick={(e) => handleDeleteVideo(e, video.id)}
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-lg bg-black/60 hover:bg-red-600 border border-[#262626] hover:border-red-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
                  title="Delete video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="w-12 h-12 rounded-full bg-black/60 border border-[#262626] flex items-center justify-center z-10 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-300">
                  <PlayCircle className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-blue-400 border border-[#262626]">
                  RESOLVED 4K
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 z-0"></div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-white font-semibold text-base line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors mb-4 flex-grow">
                  {video.title}
                </h3>
                <div className="pt-4 flex items-center justify-between border-t border-[#1a1a1a] mt-auto">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
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
        <div className="space-y-4">
          {sortedVideos.map((video) => (
            <div 
              key={video.id}
              className="bg-[#0A0A0A] border border-[#262626] hover:border-blue-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:shadow-[0_8px_30px_rgba(37,99,235,0.05)] transition-all duration-300 group"
              onClick={() => window.location.href = `/videos/${video.id}`}
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-16 h-12 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:border-blue-500/30 transition-colors relative">
                  <PlayCircle className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-sm truncate group-hover:text-blue-400 transition-colors">{video.title}</h3>
                  <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {getStatusBadge(video.status)}
                <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                  <Eye className="w-4 h-4" />
                </div>
                {/* Trash Button */}
                <button
                  onClick={(e) => handleDeleteVideo(e, video.id)}
                  className="w-9 h-9 rounded-xl bg-[#141414] hover:bg-red-600 border border-[#262626] hover:border-red-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
                  title="Delete video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
