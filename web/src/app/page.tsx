"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Video, Search, Layers, Cpu, Sparkles, CheckCircle2, 
  UploadCloud, Zap, ShieldCheck, Database, Server, Play, Bot, FileText, 
  Clock, Activity, ChevronRight
} from 'lucide-react';
import ShapeGrid from '@/components/ShapeGrid';
import SideRays from '@/components/SideRays';
import Logo from '@/components/Logo';
import AIPipelineShowcase from '@/components/AIPipelineShowcase';

export default function Page() {
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
          borderColor="rgba(56, 189, 248, 0.10)"
          hoverFillColor="rgba(14, 165, 233, 0.18)"
          shape="square"
          hoverTrailAmount={6}
        />
      </div>
      
      {/* Top Header Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 lg:px-12 h-14 bg-[#070709]/80 backdrop-blur-xl border-b border-white/[0.07] transition-all">
        <div className="flex items-center gap-8">
          {/* Logo Component (Identical everywhere) */}
          <Logo href="#platform" size="md" onClick={(e) => handleScroll(e, 'platform')} />

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
          <Link className="h-8.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all duration-150 shadow-[0_0_12px_rgba(37,99,235,0.3)] hover:shadow-[0_0_18px_rgba(37,99,235,0.5)] active:scale-[0.98] inline-flex items-center justify-center cursor-pointer" href="/signup">
            Launch Workspace
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-14">
        
        {/* SECTION 1 — HERO WITH WORKING SIDERAYS BACKGROUND */}
        <section className="relative pt-16 pb-20 md:pt-28 md:pb-24 px-6 overflow-hidden flex flex-col items-center justify-center min-h-[85vh] z-10">
          
          {/* React Bits SideRays Component (Subtle background rays ONLY in Hero section) */}
          <SideRays opacity={0.4} speed={0.5} rayCount={10} className="pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center z-20 relative">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 rounded-full text-xs font-medium text-blue-400 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Powered by Gemini 3.6 Flash Engine
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.12]">
              Precision Multimodal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white">Video Intelligence Architecture.</span>
            </h1>

            <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Asynchronous pipeline for verbatim speech transcripts, second-by-second timestamp indexing, and interactive Copilot queries grounded in video context.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup" className="w-full sm:w-auto h-9.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all duration-150 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] active:scale-[0.98] inline-flex items-center justify-center gap-2 group cursor-pointer">
                <span>Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a onClick={(e) => handleScroll(e, 'demo')} href="#demo" className="w-full sm:w-auto h-9.5 px-6 text-gray-200 hover:text-white border border-white/[0.08] hover:border-white/[0.16] bg-[#141418] font-medium text-xs rounded-lg transition-all duration-150 inline-flex items-center justify-center cursor-pointer">
                Watch Demo
              </a>
            </div>
          </div>

          {/* Key Engineering Telemetry Metrics */}
          <div className="w-full max-w-4xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 px-4 text-center z-20 relative">
            <div className="bg-[#0a0a0c] border border-white/[0.06] p-3.5 rounded-xl">
              <p className="text-lg font-bold text-white tracking-tight font-mono">Gemini 3.6</p>
              <p className="text-[11px] text-gray-400">Multimodal Engine</p>
            </div>
            <div className="bg-[#0a0a0c] border border-white/[0.06] p-3.5 rounded-xl">
              <p className="text-lg font-bold text-white tracking-tight font-mono">Sub-Second</p>
              <p className="text-[11px] text-gray-400">Timestamp Indexing</p>
            </div>
            <div className="bg-[#0a0a0c] border border-white/[0.06] p-3.5 rounded-xl">
              <p className="text-lg font-bold text-white tracking-tight font-mono">Cloudflare R2</p>
              <p className="text-[11px] text-gray-400">Direct Presigned PUT</p>
            </div>
            <div className="bg-[#0a0a0c] border border-white/[0.06] p-3.5 rounded-xl">
              <p className="text-lg font-bold text-white tracking-tight font-mono">RabbitMQ</p>
              <p className="text-[11px] text-gray-400">Async Task Queue</p>
            </div>
          </div>
        </section>

        {/* SECTION 2 — REAL LIVE ANIMATED AI PIPELINE SHOWCASE (ZERO STATIC IMAGES) */}
        <section id="demo" className="py-16 px-6 relative border-t border-white/[0.06] bg-[#070709]/50">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">Live Animated Pipeline</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-1 tracking-tight">Interactive AI Pipeline Showcase</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                Watch how VisiCore AI processes video footage through 7 automated workflow stages.
              </p>
            </div>

            {/* Live Interactive AI Pipeline Showcase Component */}
            <AIPipelineShowcase />
          </div>
        </section>

        {/* SECTION 3 — HOW IT WORKS (CONCISE VISUAL FLOW) */}
        <section id="pipeline" className="py-16 px-6 relative border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">Flow Sequence</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-1 tracking-tight">How It Works</h2>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                Automated pipeline execution from media upload to AI insight.
              </p>
            </div>

            {/* Concise 6-step visual flow */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3 rounded-xl text-center flex flex-col items-center">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                  <UploadCloud className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-0.5">1. Upload</h4>
                <p className="text-[10px] text-gray-400">Presigned R2 PUT</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3 rounded-xl text-center flex flex-col items-center">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                  <Server className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-0.5">2. AI Processing</h4>
                <p className="text-[10px] text-gray-400">RabbitMQ Queue</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3 rounded-xl text-center flex flex-col items-center">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-0.5">3. Transcript</h4>
                <p className="text-[10px] text-gray-400">Verbatim Speech</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3 rounded-xl text-center flex flex-col items-center">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-0.5">4. Search</h4>
                <p className="text-[10px] text-gray-400">Timestamp Index</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3 rounded-xl text-center flex flex-col items-center">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-0.5">5. Copilot</h4>
                <p className="text-[10px] text-gray-400">Interactive Q&A</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] p-3 rounded-xl text-center flex flex-col items-center">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-0.5">6. Insights</h4>
                <p className="text-[10px] text-gray-400">TL;DR Notes</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — FEATURES */}
        <section id="features" className="py-16 px-6 relative border-t border-white/[0.06] bg-[#070709]/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">Capabilities</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-1 tracking-tight">Core Features</h2>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">Multimodal media processing architecture.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-4.5 hover:border-white/[0.16] transition-all">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">Synchronized Transcripts</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">Verbatim speech-to-text with click-to-seek playback.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-4.5 hover:border-white/[0.16] transition-all">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">Timestamp Indexing</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">Second-by-second timestamps for every sentence.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-4.5 hover:border-white/[0.16] transition-all">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">Context-Aware Copilot</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">Query footage directly with timestamp references.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-4.5 hover:border-white/[0.16] transition-all">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">TL;DR Summaries</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">Executive short summaries and key notes.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-4.5 hover:border-white/[0.16] transition-all">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">Key Scene Highlights</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">Automated visual & discussion highlight detection.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-4.5 hover:border-white/[0.16] transition-all">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-semibold text-white mb-1">Secure Byte Streaming</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">HTTP 206 partial content with JWT guards.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — PRODUCT ARCHITECTURE */}
        <section id="architecture" className="py-16 px-6 relative border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">System Design</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-1 tracking-tight">System Architecture</h2>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">Distributed asynchronous pipeline.</p>
            </div>

            {/* System Diagram Flow */}
            <div className="bg-[#0a0a0c] border border-white/[0.09] rounded-xl p-5 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 bg-[#101014] border border-white/[0.06] rounded-lg flex flex-col items-center">
                  <div className="w-7 h-7 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">1. Browser</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Presigned PUT</p>
                </div>

                <div className="p-3.5 bg-[#101014] border border-white/[0.06] rounded-lg flex flex-col items-center">
                  <div className="w-7 h-7 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">2. Cloudflare R2</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">S3 Storage</p>
                </div>

                <div className="p-3.5 bg-[#101014] border border-white/[0.06] rounded-lg flex flex-col items-center">
                  <div className="w-7 h-7 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
                    <Server className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">3. RabbitMQ</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Task Queue</p>
                </div>

                <div className="p-3.5 bg-[#101014] border border-white/[0.06] rounded-lg flex flex-col items-center">
                  <div className="w-7 h-7 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">4. Gemini 3.6</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">AI Engine</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — FINAL CTA */}
        <section className="py-16 px-6 relative border-t border-white/[0.06] text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Ready to Analyze Video Footage?</h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Launch your workspace to index video timestamps and query context with Gemini 3.6.
            </p>
            <div className="flex justify-center">
              <Link href="/signup" className="h-9.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all duration-150 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] active:scale-[0.98] inline-flex items-center justify-center gap-2 group cursor-pointer">
                <span>Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with exact logo alignment */}
      <footer className="w-full py-5 px-8 bg-[#070709] border-t border-white/[0.07] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
        <Logo href="#platform" size="sm" onClick={(e) => handleScroll(e, 'platform')} />
        <p>&copy; {new Date().getFullYear()} VisiCore AI Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
