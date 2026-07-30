"use client";

import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, Server, Cpu, Clock, Search, Bot, Sparkles, 
  Play, CheckCircle2, ChevronRight, FileText, ArrowRight, ShieldCheck, Database 
} from 'lucide-react';

interface Stage {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
  badge: string;
  details: {
    status: string;
    protocol: string;
    outputHeader: string;
    outputSnippet: string;
    previewType: 'upload' | 'queue' | 'ai' | 'timestamps' | 'search' | 'copilot' | 'summary';
  };
}

const STAGES: Stage[] = [
  {
    id: 'upload',
    number: '01',
    title: 'Video Upload',
    shortDesc: 'Presigned S3 PUT directly to Cloudflare R2',
    icon: UploadCloud,
    badge: 'Direct Upload',
    details: {
      status: 'HTTP 200 OK • Presigned PUT Stream',
      protocol: 'Browser → Cloudflare R2',
      outputHeader: 'Storage Key Generated',
      outputSnippet: 'uploads/9b1deb4d-3b7d-419b-a67b-demo-video.mp4',
      previewType: 'upload',
    },
  },
  {
    id: 'queue',
    number: '02',
    title: 'AI Processing Queue',
    shortDesc: 'RabbitMQ serverless job dispatcher',
    icon: Server,
    badge: 'RabbitMQ Confirm',
    details: {
      status: 'Message Published & Acknowledged',
      protocol: 'AMQP 0-9-1 • ConfirmChannel',
      outputHeader: 'Queue Payload Dispatched',
      outputSnippet: '{"videoId": "v-8912", "action": "PROCESS_MULTIMODAL"}',
      previewType: 'queue',
    },
  },
  {
    id: 'speech',
    number: '03',
    title: 'Transcript Generation',
    shortDesc: 'Gemini 3.6 Flash verbatim speech-to-text',
    icon: Cpu,
    badge: 'Gemini 3.6 Flash',
    details: {
      status: 'Speech Recognition Complete',
      protocol: 'Google GenAI Files API',
      outputHeader: 'Verbatim Audio Extraction',
      outputSnippet: 'Welcome to the technical sync. Today we are reviewing the VisiCore distributed media architecture...',
      previewType: 'ai',
    },
  },
  {
    id: 'timestamps',
    number: '04',
    title: 'Timestamp Indexing',
    shortDesc: 'Second-by-second segment mapping',
    icon: Clock,
    badge: 'Sub-Second Map',
    details: {
      status: 'Segment Indexing Complete',
      protocol: 'JSON Vector Timecode Map',
      outputHeader: 'Synchronized Timestamp Stream',
      outputSnippet: '[00:15] Direct R2 Uploads • [02:15] Presigned S3 URLs • [05:40] RabbitMQ Confirmations',
      previewType: 'timestamps',
    },
  },
  {
    id: 'search',
    number: '05',
    title: 'Semantic Search',
    shortDesc: 'Natural language query over footage',
    icon: Search,
    badge: 'Vector Index',
    details: {
      status: 'Natural Language Match 99.4%',
      protocol: 'Full-Text Vector Index',
      outputHeader: 'Query Result Matches',
      outputSnippet: 'Match found at [02:15]: "We enforced presigned URLs to bypass Vercel 4.5MB payload limits"',
      previewType: 'search',
    },
  },
  {
    id: 'copilot',
    number: '06',
    title: 'AI Copilot Q&A',
    shortDesc: 'Context-grounded conversational agent',
    icon: Bot,
    badge: 'Interactive Agent',
    details: {
      status: 'Grounded Response Stream',
      protocol: 'Strict Video Context Guard',
      outputHeader: 'Copilot Answer',
      outputSnippet: 'At [02:15], the team resolved serverless timeouts by switching to direct R2 uploads.',
      previewType: 'copilot',
    },
  },
  {
    id: 'insights',
    number: '07',
    title: 'Structured Insights',
    shortDesc: 'TL;DR executive notes & scene highlights',
    icon: Sparkles,
    badge: 'TL;DR Notes',
    details: {
      status: 'Executive Summary Synthesized',
      protocol: 'PostgreSQL Relational DB',
      outputHeader: 'Summary Generated',
      outputSnippet: 'Executive TL;DR: Operational sync covering Cloudflare R2, RabbitMQ confirmations, and PostgreSQL index security.',
      previewType: 'summary',
    },
  },
];

export default function AIPipelineShowcase() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance pipeline stages every 4 seconds unless user manually clicks
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentStage = STAGES[activeStep];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none font-sans">
      
      {/* Horizontal Pipeline Process Stepper Bar */}
      <div className="bg-[#0a0a0c] border border-white/[0.09] rounded-2xl p-2 sm:p-3 shadow-xl backdrop-blur-xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = idx === activeStep;
            const isCompleted = idx < activeStep;

            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStep(idx);
                  setIsAutoPlaying(false);
                }}
                className={`flex flex-col items-center p-2.5 rounded-xl transition-all duration-200 text-center cursor-pointer border ${
                  isActive
                    ? 'bg-blue-600/15 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                    : isCompleted
                    ? 'bg-[#121216] border-white/[0.08] text-gray-300'
                    : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : isCompleted
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'bg-[#16161c] text-gray-400 border border-white/[0.06]'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <span className={`text-[10px] font-mono leading-none ${isActive ? 'text-blue-400 font-semibold' : 'text-gray-500'}`}>
                  {stage.number}
                </span>

                <span className={`text-[11px] font-medium mt-1 truncate max-w-full ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {stage.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage Inspector & Output Preview Container */}
      <div className="bg-[#0a0a0c] border border-white/[0.09] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Stage Header Banner */}
        <div className="h-11 px-5 bg-[#0d0d10] border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </div>
            <span className="text-xs font-mono text-gray-300">
              STAGE {currentStage.number} // <span className="text-white font-semibold">{currentStage.title.toUpperCase()}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              {currentStage.details.status}
            </span>
            <button 
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-[10px] font-mono text-gray-400 hover:text-white transition-colors cursor-pointer bg-[#16161c] border border-white/[0.08] px-2 py-0.5 rounded"
            >
              {isAutoPlaying ? 'PAUSE PIPELINE' : 'RESUME AUTO'}
            </button>
          </div>
        </div>

        {/* Live Active Preview Area */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Stage Description & Telemetry */}
          <div className="md:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono">
              <currentStage.icon className="w-3 h-3 text-blue-400" />
              <span>{currentStage.details.protocol}</span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              {currentStage.title}
            </h3>

            <p className="text-xs text-gray-400 leading-relaxed">
              {currentStage.shortDesc}. VisiCore AI processes media asynchronously without blocking serverless web workers.
            </p>

            <div className="pt-2 border-t border-white/[0.06] space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-500">Output Standard:</span>
                <span className="text-gray-300 font-mono">{currentStage.details.outputHeader}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-500">Pipeline Latency:</span>
                <span className="text-emerald-400 font-mono">Sub-Second Queue</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Stage Visualizer Box */}
          <div className="md:col-span-7 bg-[#101014] border border-white/[0.08] rounded-xl p-4.5 space-y-3 min-h-[210px] flex flex-col justify-center">
            
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" /> Live Telemetry Output
              </span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                ACTIVE STAGE
              </span>
            </div>

            {/* Dynamic Stage Content Renderer */}
            <div className="py-2">
              {currentStage.details.previewType === 'upload' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Streaming `sample-footage.mp4` to Cloudflare R2...</span>
                    <span className="text-emerald-400 font-mono">100% Complete</span>
                  </div>
                  <div className="w-full bg-[#181820] h-2 rounded-full overflow-hidden border border-white/[0.06]">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full w-full"></div>
                  </div>
                  <p className="text-[11px] font-mono text-gray-400 bg-[#070709] p-2 rounded border border-white/[0.06] truncate">
                    {currentStage.details.outputSnippet}
                  </p>
                </div>
              )}

              {currentStage.details.previewType === 'queue' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-lg">
                    <Server className="w-4 h-4 text-blue-400 flex-shrink-0 animate-pulse" />
                    <span>RabbitMQ ConfirmChannel ack received. Triggering Python AI worker container.</span>
                  </div>
                  <pre className="text-[11px] font-mono text-gray-300 bg-[#070709] p-2.5 rounded border border-white/[0.06] overflow-x-auto">
                    {currentStage.details.outputSnippet}
                  </pre>
                </div>
              )}

              {currentStage.details.previewType === 'ai' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Cpu className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Gemini 3.6 Flash Files API speech transcription stream:</span>
                  </div>
                  <div className="p-3 bg-[#070709] border border-white/[0.06] rounded-lg text-xs text-gray-200 leading-relaxed">
                    &quot;{currentStage.details.outputSnippet}&quot;
                  </div>
                </div>
              )}

              {currentStage.details.previewType === 'timestamps' && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-1 rounded font-mono">[00:15] Intro</span>
                    <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-1 rounded font-mono">[02:15] Cloudflare R2</span>
                    <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-1 rounded font-mono">[05:40] RabbitMQ Confirm</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Clicking any timestamp seeks HTML5 video playback instantly.</p>
                </div>
              )}

              {currentStage.details.previewType === 'search' && (
                <div className="space-y-2">
                  <div className="p-2.5 bg-[#070709] border border-white/[0.06] rounded-lg flex items-center gap-2 text-xs text-white">
                    <Search className="w-3.5 h-3.5 text-blue-400" />
                    <span>Query: &quot;Why did we switch to presigned URLs?&quot;</span>
                  </div>
                  <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-100">
                    {currentStage.details.outputSnippet}
                  </div>
                </div>
              )}

              {currentStage.details.previewType === 'copilot' && (
                <div className="space-y-2">
                  <div className="p-3 bg-blue-950/30 border border-blue-500/20 rounded-lg text-xs text-blue-100 flex items-start gap-2.5">
                    <Bot className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white mb-0.5">VisiCore Copilot</p>
                      <p>{currentStage.details.outputSnippet}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStage.details.previewType === 'summary' && (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-100 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white mb-0.5">Executive TL;DR</p>
                      <p className="text-gray-300">{currentStage.details.outputSnippet}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
