"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import { PlayCircle, Clock, CheckCircle, AlertCircle, FileVideo, UploadCloud, Video, ChevronRight, Activity, Calendar } from 'lucide-react';
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
        <div className="text-gray-400 text-sm font-mono tracking-widest uppercase">Fetching workspace assets...</div>
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

  const sortedVideos = videos?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];

  return (
    <div className="pb-12 font-sans">
      
      {/* Header and Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest mb-1.5">
            <Activity className="w-3.5 h-3.5" /> Video Library
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Your Workspace</h1>
          <p className="text-gray-400 text-sm">Manage, review, and query deep intelligence from your processed footage.</p>
        </div>
        <Link href="/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 group self-start md:self-auto">
          <UploadCloud className="w-5 h-5" />
          <span>Upload New Video</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {sortedVideos.length === 0 ? (
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-16 text-center flex flex-col items-center shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
          <div className="w-20 h-20 bg-blue-500/5 rounded-2xl flex items-center justify-center mb-6 border border-[#262626] group-hover:border-blue-500/30 transition-all duration-300">
            <FileVideo className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Workspace is Empty</h3>
          <p className="text-gray-400 mb-8 max-w-sm text-sm leading-relaxed">No footage detected. Drag and drop your first raw media to start generating synchronized AI transcripts and deep semantic intelligence.</p>
          <Link href="/upload" className="bg-[#141414] border border-[#262626] hover:bg-[#1a1a1a] hover:border-gray-700 text-white px-6 py-3 rounded-xl transition-all font-medium inline-flex items-center gap-2">
            Go to Upload Center
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedVideos.map((video) => (
            <div 
              key={video.id} 
              className="bg-[#0A0A0A] border border-[#262626] rounded-2xl overflow-hidden group hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(37,99,235,0.08)] flex flex-col cursor-pointer"
              onClick={() => window.location.href = `/videos/${video.id}`}
            >
              
              {/* Media Thumbnail Visualizer */}
              <div className="aspect-video bg-[#141414] relative overflow-hidden flex items-center justify-center border-b border-[#262626] group-hover:bg-[#111] transition-colors">
                {/* Visual grid backdrop mimicking AI detection grid */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:12px_12px] group-hover:opacity-20 transition-opacity"></div>
                
                {/* Play Button Indicator */}
                <div className="w-12 h-12 rounded-full bg-black/60 border border-[#262626] flex items-center justify-center z-10 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-300">
                  <PlayCircle className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                
                {/* Visualizer overlay highlights */}
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-blue-400 border border-[#262626]">
                  AI RESOLUTION: 4K
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 z-0"></div>
              </div>
              
              {/* Card Meta Content */}
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
      )}
    </div>
  );
}
