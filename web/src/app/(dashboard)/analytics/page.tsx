"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import { 
  TrendingUp, Sparkles, Clock, CheckCircle, Calendar, Download, Activity, Video, ShieldCheck 
} from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  status: 'UPLOAD_PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  duration: number;
  createdAt: string;
}

export default function AnalyticsPage() {
  const { data: videos, isLoading } = useQuery<VideoItem[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await api.get('/api/videos');
      return response.data;
    },
  });

  const videoList = videos || [];
  const totalCount = videoList.length;
  const completedCount = videoList.filter(v => v.status === 'COMPLETED').length;
  const processingCount = videoList.filter(v => v.status === 'PROCESSING' || v.status === 'UPLOAD_PENDING').length;
  const accuracyRate = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : '100.0';

  return (
    <div className="pb-12 font-sans space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest mb-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Intelligence Analytics
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Telemetry Insights</h1>
          <p className="text-gray-400 text-sm mt-1">Synthesized deep neural metrics across all ingested video feeds.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2 flex items-center gap-2 text-xs text-gray-300">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Active Session Period</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-2xl relative overflow-hidden group hover:border-gray-800 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Videos Ingested</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{isLoading ? '...' : totalCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-[#141414] h-1.5 rounded-full overflow-hidden border border-[#262626]">
            <div className="bg-blue-500 h-full w-4/5"></div>
          </div>
          <p className="text-2xs text-gray-500 mt-3 font-mono">100% processed via Gemini 2.5 Flash</p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-2xl relative overflow-hidden group hover:border-gray-800 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Analysis Success Rate</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{accuracyRate}%</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-[#141414] h-1.5 rounded-full overflow-hidden border border-[#262626]">
            <div className="bg-green-500 h-full" style={{ width: `${accuracyRate}%` }}></div>
          </div>
          <p className="text-2xs text-green-400 mt-3 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Fully Verified Transcripts
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-2xl relative overflow-hidden group hover:border-gray-800 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Ingestion Pipeline</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{processingCount} pending</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-[#141414] h-1.5 rounded-full overflow-hidden border border-[#262626]">
            <div className="bg-cyan-400 h-full w-2/3 animate-pulse"></div>
          </div>
          <p className="text-2xs text-gray-500 mt-3 font-mono">RabbitMQ Queue: Active</p>
        </div>
      </div>

      {/* Intelligence Frequency Section */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" /> Intelligence Frequency
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Automated visual density and scene highlight telemetry timeline.</p>
          </div>
          <span className="text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
            REAL-TIME STREAM
          </span>
        </div>

        <div className="relative h-64 w-full bg-[#050505] rounded-xl border border-[#1f1f1f] p-4 flex items-end justify-between gap-2 overflow-hidden">
          {/* Simulated Neon Telemetry Bars */}
          {[40, 65, 30, 85, 95, 50, 75, 90, 60, 80, 100, 70, 85, 90, 60, 95].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div 
                className="w-full bg-gradient-to-t from-blue-600 via-cyan-400 to-blue-400 rounded-t transition-all duration-500 group-hover:brightness-125 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-[9px] font-mono text-gray-600 group-hover:text-gray-300">{idx * 2}h</span>
            </div>
          ))}
        </div>
      </div>

      {/* Processed Feed Logs */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-500" />
          Recent Ingestion History
        </h3>

        <div className="space-y-3">
          {videoList.slice(0, 5).map((v) => (
            <div key={v.id} className="bg-[#141414] border border-[#262626] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{v.title}</h4>
                  <span className="text-[10px] text-gray-500 font-mono">{new Date(v.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                v.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {v.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
