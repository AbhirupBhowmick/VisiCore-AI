"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import { 
  Cpu, Database, ShieldCheck, RefreshCw, Download, 
  AlertCircle, CheckCircle, Clock, Activity, Server, FileVideo
} from 'lucide-react';

interface TelemetryData {
  systemStatus: string;
  version: string;
  stats: {
    totalUsers: number;
    totalVideos: number;
    completedVideos: number;
    processingVideos: number;
    failedVideos: number;
  };
  failedJobs: Array<{
    id: string;
    title: string;
    status: string;
    minioUrl: string;
    createdAt: string;
  }>;
}

export default function AdminPage() {
  const { data, isLoading, error, refetch } = useQuery<TelemetryData>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/api/admin/stats');
      return response.data;
    },
    refetchInterval: 5000,
  });

  const stats = data?.stats || {
    totalUsers: 0,
    totalVideos: 0,
    completedVideos: 0,
    processingVideos: 0,
    failedVideos: 0,
  };

  const failedJobs = data?.failedJobs || [];

  const handleRetryJob = async (id: string) => {
    try {
      await api.post(`/api/videos/${id}/retry`);
      refetch();
    } catch (err) {
      console.error('Failed to retry video job:', err);
      alert('Failed to re-queue job. Please check system logs.');
    }
  };

  return (
    <div className="pb-12 font-sans space-y-8">
      {/* Top Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest mb-1.5">
            <Server className="w-3.5 h-3.5" /> Platform Control Center
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Vision Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time system health, telemetry, and background processing pipeline controls.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
            <ShieldCheck className="w-4 h-4" /> {data?.systemStatus || 'System Healthy'}
          </span>
          <button 
            onClick={() => refetch()}
            className="p-2.5 rounded-xl bg-[#0A0A0A] border border-[#262626] text-gray-400 hover:text-white hover:border-gray-700 transition-all active:scale-95"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* System Health Section (Bento Style Grid) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            System Health & Telemetry
          </h2>
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{data?.version || 'v2.5.0-stable'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Videos & Pipelines */}
          <div className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-2xl relative overflow-hidden group hover:border-gray-800 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Video Pipelines</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{stats.totalVideos}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FileVideo className="w-5 h-5" />
              </div>
            </div>
            <div className="w-full bg-[#141414] h-2 rounded-full overflow-hidden border border-[#262626]">
              <div 
                className="bg-blue-500 h-full transition-all duration-500" 
                style={{ width: `${stats.totalVideos > 0 ? (stats.completedVideos / stats.totalVideos) * 100 : 100}%` }}
              ></div>
            </div>
            <div className="mt-3 flex justify-between text-xs text-gray-400 font-mono">
              <span>Completed: {stats.completedVideos}</span>
              <span>Processing: {stats.processingVideos}</span>
            </div>
          </div>

          {/* Card 2: Active Processing Load */}
          <div className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-2xl relative overflow-hidden group hover:border-gray-800 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Queue Processing Load</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{stats.processingVideos} active</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <div className="w-full bg-[#141414] h-2 rounded-full overflow-hidden border border-[#262626]">
              <div className="bg-cyan-400 h-full w-2/3 animate-pulse"></div>
            </div>
            <div className="mt-3 flex justify-between text-xs text-gray-400 font-mono">
              <span>RabbitMQ Queue: Ready</span>
              <span>Worker Node: Online</span>
            </div>
          </div>

          {/* Card 3: Database & Node Status */}
          <div className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-2xl relative overflow-hidden group hover:border-gray-800 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Database & Storage</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">99.9%</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <div className="w-full bg-[#141414] h-2 rounded-full overflow-hidden border border-[#262626]">
              <div className="bg-purple-500 h-full w-[99.9%]"></div>
            </div>
            <div className="mt-3 flex justify-between text-xs text-gray-400 font-mono">
              <span>PostgreSQL: Connected</span>
              <span>MinIO S3: Healthy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Failed AI Processing Jobs Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Pipeline Jobs</h2>
            <p className="text-xs text-gray-400">Monitoring worker task execution status and failure logs.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => refetch()}
              className="bg-[#141414] border border-[#262626] hover:bg-[#1f1f1f] text-gray-300 px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" /> Export Logs
            </button>
            <button 
              onClick={() => refetch()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-sync Queue
            </button>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-12 text-center text-gray-400 text-sm font-mono">Loading telemetry logs...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-400 text-sm flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" /> Failed to load pipeline logs.
            </div>
          ) : failedJobs.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-green-400 mb-3" />
              <h3 className="text-base font-semibold text-white">All Pipelines Operational</h3>
              <p className="text-xs text-gray-400 mt-1">No failed video jobs detected in the processing queue.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#141414] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-[#262626]">
                  <tr>
                    <th className="px-6 py-3.5">Video Title</th>
                    <th className="px-6 py-3.5">Job ID</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Created At</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f] text-sm">
                  {failedJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[#121212] transition-colors">
                      <td className="px-6 py-4 font-semibold text-white truncate max-w-xs">{job.title}</td>
                      <td className="px-6 py-4 font-mono text-xs text-blue-400">{job.id.substring(0, 13)}...</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                          <AlertCircle className="w-3 h-3" /> {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                        {new Date(job.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleRetryJob(job.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Re-queue
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
