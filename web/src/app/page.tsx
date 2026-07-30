"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Video, Search, Layers, Cpu, Sparkles, CheckCircle2, 
  UploadCloud, Zap, ShieldCheck, Database, Server, Play, Bot, FileText, 
  Clock, ArrowDown, Activity, ChevronRight
} from 'lucide-react';
import ShapeGrid from '@/components/ShapeGrid';

export default function Page() {
  const [activeDemoTab, setActiveDemoTab] = useState<'player' | 'copilot' | 'transcript'>('player');

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div id="platform" className="relative text-gray-100 min-h-screen flex flex-col font-sans selection:bg-blue-600/30 selection:text-white overflow-x-hidden bg-[#050507]">
      
      {/* Background ShapeGrid */}
      <div className="absolute inset-0 w-full h-full -z-40 pointer-events-auto">
        <ShapeGrid 
          speed={0.16} 
          squareSize={46}
          direction="diagonal"
          borderColor="rgba(56, 189, 248, 0.12)"
          hoverFillColor="rgba(14, 165, 233, 0.2)"
          shape="square"
          hoverTrailAmount={6}
        />
      </div>
      
      {/* Top Header Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 lg:px-12 h-14 bg-[#070709]/80 backdrop-blur-xl border-b border-white/[0.07] transition-all">
        <div className="flex items-center gap-8">
          <a onClick={(e) => handleScroll(e, 'platform')} className="text-base font-semibold tracking-tight text-white flex items-center gap-2.5 cursor-pointer" href="#platform">
            <div className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Video className="w-3.5 h-3.5" />
            </div>
            <span>VisiCore <span className="text-blue-400 font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">AI</span></span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            <a onClick={(e) => handleScroll(e, 'platform')} className="text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-md text-xs font-medium cursor-pointer" href="#platform">Platform</a>
            <a onClick={(e) => handleScroll(e, 'demo')} className="text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-md text-xs font-medium cursor-pointer" href="#demo">Demo</a>
            <a onClick={(e) => handleScroll(e, 'pipeline')} className="text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-md text-xs font-medium cursor-pointer" href="#pipeline">How It Works</a>
            <a onClick={(e) => handleScroll(e, 'features')} className="text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-md text-xs font-medium cursor-pointer" href="#features">Features</a>
            <a onClick={(e) => handleScroll(e, 'architecture')} className="text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-md text-xs font-medium cursor-pointer" href="#architecture">Architecture</a>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-xs font-medium">
          <Link className="text-gray-400 hover:text-white transition-colors px-3 py-1.5" href="/login">Sign In</Link>
          <Link className="h-8 px-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all shadow-[0_0_12px_rgba(37,99,235,0.3)] hover:shadow-[0_0_18px_rgba(37,99,235,0.5)] active:scale-[0.98] inline-flex items-center justify-center cursor-pointer" href="/signup">
            Launch Workspace
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-14">
        
        {/* SECTION 1 — HERO */}
        <section className="relative pt-16 pb-20 md:pt-28 md:pb-24 px-6 overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
          <div className="max-w-4xl mx-auto text-center z-10 relative">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 rounded-full text-xs font-medium text-blue-400 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Powered by Gemini 3.6 Flash Multimodal Pipeline
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
              Transform Raw Video Feeds Into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">Structured Speech & Visual Intelligence.</span>
            </h1>

            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              VisiCore AI transcribes video assets, generates second-by-second timestamp indexes, creates executive summaries, and enables interactive AI Copilot queries directly over video context.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup" className="w-full sm:w-auto h-10 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] active:scale-[0.98] px-6 inline-flex items-center justify-center gap-2 group cursor-pointer">
                <span>Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a onClick={(e) => handleScroll(e, 'demo')} href="#demo" className="w-full sm:w-auto h-10 text-gray-200 hover:text-white border border-white/[0.08] hover:border-white/[0.16] bg-[#141418] font-medium text-xs rounded-lg transition-all px-6 inline-flex items-center justify-center cursor-pointer">
                Watch Product Demo
              </a>
            </div>
          </div>

          {/* Key Metric Indicators */}
          <div className="w-full max-w-4xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 text-center">
            <div className="bg-[#0a0a0c] border border-white/[0.06] p-3.5 rounded-xl">
              <p className="text-lg font-bold text-white tracking-tight">Gemini 3.6</p>
              <p className="text-[11px] text-gray-400">Multimodal Core Engine</p>
            </div>
            <div className="bg-[#0a0a0c] border border-white/[0.06] p-3.5 rounded-xl">
              <p className="text-lg font-bold text-white tracking-tight">Sub-Second</p>
              <p className="text-[11px] text-gray-400">Timestamp Indexing</p>
            </div>
            <div className="bg-[#0a0a0c] border border-white/[0.06] p-3.5 rounded-xl">
              <p className="text-lg font-bold text-white tracking-tight">Cloudflare R2</p>
              <p className="text-[11px] text-gray-400">Direct Presigned PUT</p>
            </div>
            <div className="bg-[#0a0a0c] border border-white/[0.06] p-3.5 rounded-xl">
              <p className="text-lg font-bold text-white tracking-tight">RabbitMQ</p>
              <p className="text-[11px] text-gray-400">Asynchronous Queue</p>
            </div>
          </div>
        </section>

        {/* SECTION 2 — PRODUCT DEMO */}
        <section id="demo" className="py-20 px-6 relative border-t border-white/[0.06] bg-[#070709]/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">Product Preview</span>
              <h2 className="text-2xl md:text-4xl font-bold text-white mt-3 mb-2 tracking-tight">Interactive Video Intelligence Workspace</h2>
              <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
                Explore the production interface: Synchronized 4K HTML5 video streaming, real-time AI transcripts, and context-aware Copilot.
              </p>
            </div>

            {/* Interactive Tabbed Product Demo Wrapper */}
            <div className="bg-[#0a0a0c] border border-white/[0.09] rounded-2xl overflow-hidden shadow-2xl">
              {/* Window Bar Header */}
              <div className="h-11 px-4 bg-[#0d0d10] border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="text-[11px] font-mono text-gray-400 ml-2">VisiCore AI • Video Analysis Session #8912</span>
                </div>

                <div className="flex items-center gap-1 bg-[#141418] p-1 rounded-lg border border-white/[0.06]">
                  <button 
                    onClick={() => setActiveDemoTab('player')} 
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${activeDemoTab === 'player' ? 'bg-white/[0.08] text-white' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    Video Player
                  </button>
                  <button 
                    onClick={() => setActiveDemoTab('copilot')} 
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${activeDemoTab === 'copilot' ? 'bg-white/[0.08] text-white' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    AI Copilot
                  </button>
                  <button 
                    onClick={() => setActiveDemoTab('transcript')} 
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${activeDemoTab === 'transcript' ? 'bg-white/[0.08] text-white' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    Transcript & Notes
                  </button>
                </div>
              </div>

              {/* Demo Content Showcase */}
              <div className="p-6">
                {activeDemoTab === 'player' && (
                  <div className="space-y-4">
                    <div className="relative rounded-xl border border-white/[0.08] overflow-hidden bg-black aspect-video flex items-center justify-center">
                      <img 
                        src="/visicore_hero_visual.png" 
                        alt="Video Player Visual" 
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                      <span>Stream Source: Cloudflare R2 Byte-Range Stream</span>
                      <span className="font-mono text-emerald-400">HTTP 206 Partial Content Active</span>
                    </div>
                  </div>
                )}

                {activeDemoTab === 'copilot' && (
                  <div className="space-y-3 bg-[#101014] p-4 rounded-xl border border-white/[0.06] text-xs">
                    <div className="flex gap-2.5 items-start">
                      <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center text-gray-300 flex-shrink-0 mt-0.5">U</div>
                      <div className="p-3 rounded-lg bg-[#18181f] border border-white/[0.06] text-gray-200">
                        What key architecture decisions were discussed in this technical sync?
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <div className="w-6 h-6 rounded bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-blue-100 space-y-2">
                        <p>At <span className="font-mono text-blue-400 bg-blue-500/10 px-1 rounded">[02:15]</span>, the team decided to adopt Cloudflare R2 direct uploads via presigned URLs to bypass Vercel serverless function payload limits.</p>
                        <p>At <span className="font-mono text-blue-400 bg-blue-500/10 px-1 rounded">[05:40]</span>, RabbitMQ publisher confirmations were enforced to eliminate serverless message loss.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeDemoTab === 'transcript' && (
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2 text-xs">
                    <div className="p-3 bg-[#101014] rounded-lg border border-white/[0.06] flex items-start gap-3">
                      <span className="font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded text-[10px]">00:00 - 00:15</span>
                      <p className="text-gray-300">Welcome to the technical review. Today we are walking through the VisiCore AI distributed processing pipeline.</p>
                    </div>
                    <div className="p-3 bg-[#101014] rounded-lg border border-white/[0.06] flex items-start gap-3">
                      <span className="font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded text-[10px]">00:15 - 00:45</span>
                      <p className="text-gray-300">Video files are uploaded directly from the browser into Cloudflare R2 using S3 presigned PUT URLs.</p>
                    </div>
                    <div className="p-3 bg-[#101014] rounded-lg border border-white/[0.06] flex items-start gap-3">
                      <span className="font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded text-[10px]">00:45 - 01:20</span>
                      <p className="text-gray-300">Once in R2, RabbitMQ triggers the Python AI worker to upload the media to Gemini 3.6 Flash Files API for complete speech and visual analysis.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — HOW IT WORKS (HORIZONTAL TIMELINE PIPELINE) */}
        <section id="pipeline" className="py-20 px-6 relative border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">Pipeline Sequence</span>
              <h2 className="text-2xl md:text-4xl font-bold text-white mt-3 mb-2 tracking-tight">How VisiCore AI Processes Footage</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                From browser drop to interactive AI Copilot response in 7 automated steps.
              </p>
            </div>

            {/* Horizontal Timeline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3.5 rounded-xl text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-blue-400 mb-1">01</span>
                <h4 className="text-xs font-semibold text-white mb-1">Upload Video</h4>
                <p className="text-[10px] text-gray-400 leading-tight">Presigned PUT directly to Cloudflare R2.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3.5 rounded-xl text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <Server className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-blue-400 mb-1">02</span>
                <h4 className="text-xs font-semibold text-white mb-1">AI Queue</h4>
                <p className="text-[10px] text-gray-400 leading-tight">RabbitMQ publishes task event.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3.5 rounded-xl text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-blue-400 mb-1">03</span>
                <h4 className="text-xs font-semibold text-white mb-1">Speech AI</h4>
                <p className="text-[10px] text-gray-400 leading-tight">Gemini 3.6 transcribes audio streams.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3.5 rounded-xl text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-blue-400 mb-1">04</span>
                <h4 className="text-xs font-semibold text-white mb-1">Timestamps</h4>
                <p className="text-[10px] text-gray-400 leading-tight">Generates second-by-second segments.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3.5 rounded-xl text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-blue-400 mb-1">05</span>
                <h4 className="text-xs font-semibold text-white mb-1">Search</h4>
                <p className="text-[10px] text-gray-400 leading-tight">Natural language vector query index.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3.5 rounded-xl text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-blue-400 mb-1">06</span>
                <h4 className="text-xs font-semibold text-white mb-1">AI Copilot</h4>
                <p className="text-[10px] text-gray-400 leading-tight">Interactive grounded Q&A queries.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3.5 rounded-xl text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-blue-400 mb-1">07</span>
                <h4 className="text-xs font-semibold text-white mb-1">Structured Data</h4>
                <p className="text-[10px] text-gray-400 leading-tight">TL;DR summaries & Key highlights.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — FEATURES */}
        <section id="features" className="py-20 px-6 relative border-t border-white/[0.06] bg-[#070709]/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">Capabilities</span>
              <h2 className="text-2xl md:text-4xl font-bold text-white mt-3 mb-2 tracking-tight">Production Video Features</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">Built for precision media indexing and developer workflows.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.16] transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">Synchronized Transcripts</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Verbatim speech-to-text with click-to-seek video playback.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.16] transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">Timestamp Indexing</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Precise second-by-second timestamps for every sentence and visual moment.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.16] transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">Context-Aware Copilot</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Ask questions directly about your footage with timestamped answer references.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.16] transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">TL;DR Summaries</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Executive short summaries and detailed key notes generated automatically.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.16] transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">Key Scene Highlights</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Automated detection of important discussion segments and visual highlights.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.16] transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">Secure Byte Streaming</h3>
                <p className="text-xs text-gray-400 leading-relaxed">HTTP 206 partial content streaming with strict JWT token ownership guards.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — WHY VISICORE */}
        <section id="why-visicore" className="py-20 px-6 relative border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">Engineering Advantage</span>
              <h2 className="text-2xl md:text-4xl font-bold text-white mt-3 mb-2 tracking-tight">Why Teams Choose VisiCore AI</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">Engineered for accuracy, security, and low latency.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white mb-1">Direct Cloudflare R2 Uploads</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Video bytes stream directly from the browser to object storage using S3 presigned PUT URLs, eliminating Vercel payload limits.</p>
                </div>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white mb-1">Zero Hallucination Context</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Copilot responses are strictly grounded in video transcripts and visual frames with precise timestamp references.</p>
                </div>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white mb-1">Resilient Worker Architecture</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">RabbitMQ publisher confirmations and Python worker auto-reconnect loops prevent job loss during high load.</p>
                </div>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white mb-1">PostgreSQL & JWT Security</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Row-level security checks ensure video assets and metadata remain strictly private to authorized user accounts.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — PRODUCT ARCHITECTURE (ANIMATED DIAGRAM) */}
        <section id="architecture" className="py-20 px-6 relative border-t border-white/[0.06] bg-[#070709]/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">System Design</span>
              <h2 className="text-2xl md:text-4xl font-bold text-white mt-3 mb-2 tracking-tight">Enterprise Infrastructure Architecture</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">Cloud-native pipeline designed for high availability and low latency.</p>
            </div>

            {/* Architecture Flow Card */}
            <div className="bg-[#0a0a0c] border border-white/[0.09] rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                
                <div className="p-4 bg-[#101014] border border-white/[0.06] rounded-xl flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
                    <Video className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">1. Web Browser</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Direct Presigned Upload</p>
                </div>

                <div className="p-4 bg-[#101014] border border-white/[0.06] rounded-xl flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">2. Cloudflare R2</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">S3 Object Storage</p>
                </div>

                <div className="p-4 bg-[#101014] border border-white/[0.06] rounded-xl flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
                    <Server className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">3. RabbitMQ Queue</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Publisher Confirmations</p>
                </div>

                <div className="p-4 bg-[#101014] border border-white/[0.06] rounded-xl flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">4. Gemini 3.6 AI</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Multimodal Inference</p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — FINAL CTA */}
        <section className="py-20 px-6 relative border-t border-white/[0.06] text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Start Analyzing Videos in Seconds</h2>
            <p className="text-xs text-gray-400 mb-8 leading-relaxed">
              Launch your workspace to stream footage, index timestamps, and query video context with Gemini 3.6 Flash.
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/signup" className="h-10 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] active:scale-[0.98] px-6 inline-flex items-center justify-center gap-2 group cursor-pointer">
                <span>Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-8 bg-[#070709] border-t border-white/[0.07] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Video className="w-4 h-4 text-blue-400" />
          <span>VisiCore AI</span>
        </div>
        <p>&copy; {new Date().getFullYear()} VisiCore AI Inc. Precision Video Intelligence.</p>
      </footer>
    </div>
  );
}
