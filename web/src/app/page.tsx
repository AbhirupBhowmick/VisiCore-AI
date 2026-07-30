"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Video, Search, Layers, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import ShapeGrid from '@/components/ShapeGrid';

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
          borderColor="rgba(56, 189, 248, 0.15)"
          hoverFillColor="rgba(14, 165, 233, 0.25)"
          shape="square"
          hoverTrailAmount={6}
        />
      </div>
      
      {/* Top Header Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-14 bg-[#070709]/80 backdrop-blur-xl border-b border-white/[0.07] transition-all">
        <div className="flex items-center gap-6">
          <a onClick={(e) => handleScroll(e, 'platform')} className="text-base font-semibold tracking-tight text-white flex items-center gap-2.5 cursor-pointer" href="#platform">
            <div className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Video className="w-3.5 h-3.5" />
            </div>
            <span>VisiCore <span className="text-blue-400 font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">AI</span></span>
          </a>
          <div className="hidden md:flex gap-1 ml-6">
            <a onClick={(e) => handleScroll(e, 'platform')} className="text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-md text-xs font-medium cursor-pointer" href="#platform">Platform</a>
            <a onClick={(e) => handleScroll(e, 'features')} className="text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-md text-xs font-medium cursor-pointer" href="#features">Features</a>
            <a onClick={(e) => handleScroll(e, 'pricing')} className="text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-md text-xs font-medium cursor-pointer" href="#pricing">Pricing</a>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-xs font-medium">
          <Link className="text-gray-400 hover:text-white transition-colors px-3 py-1.5" href="/login">Sign In</Link>
          <Link className="h-8 px-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all shadow-[0_0_12px_rgba(37,99,235,0.3)] hover:shadow-[0_0_18px_rgba(37,99,235,0.5)] active:scale-[0.98] inline-flex items-center justify-center" href="/signup">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-14">
        
        {/* Hero Section */}
        <section className="relative pt-16 pb-16 md:pt-28 md:pb-24 px-6 overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">

          <div className="max-w-4xl mx-auto text-center z-10 relative">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-medium text-blue-400 mb-6">
              <Cpu className="w-3.5 h-3.5" /> Next-Gen Video Intelligence Architecture
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              Unlock Deep Intelligence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">From Every Video Frame.</span>
            </h1>

            <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Precision video understanding powered by Gemini 3.6 Flash, timestamp indexing, and interactive Copilot search.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a onClick={(e) => handleScroll(e, 'demo')} href="#demo" className="w-full sm:w-auto h-10 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] active:scale-[0.98] px-6 inline-flex items-center justify-center gap-2 group cursor-pointer">
                <span>View Product Demo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <Link href="/login" className="w-full sm:w-auto h-10 text-gray-200 hover:text-white border border-white/[0.08] hover:border-white/[0.16] bg-[#141418] font-medium text-xs rounded-lg transition-all px-6 inline-flex items-center justify-center">
                Launch Workspace
              </Link>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div id="demo" className="w-full max-w-4xl mx-auto mt-16 relative z-10 flex items-center justify-center px-4">
            <div className="relative w-full rounded-2xl border border-white/[0.08] overflow-hidden bg-[#0a0a0c] shadow-2xl">
              <img 
                alt="VisiCore AI Video Analytics Dashboard" 
                className="w-full h-auto block opacity-95 hover:opacity-100 transition-opacity duration-500" 
                src="/visicore_hero_visual.png"
              />
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-20 px-6 relative border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight">Core Neural Capabilities</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">Extract structured insights from unstructured video assets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.16] transition-all">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">Automated Transcription</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Full verbatim speech-to-text with synchronized timestamp indexing.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.16] transition-all">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <Search className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">Semantic AI Search</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Search video moments using natural language prompts.</p>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.16] transition-all">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">Copilot Assistant</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Interactive conversational queries grounded strictly in video context.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-6 relative border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight">Simple Pricing</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">Scalable plans tailored to your media pipeline requirements.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Starter</h3>
                  <p className="text-xs text-gray-400 mt-0.5">For individual creators</p>
                  <p className="text-3xl font-bold text-white mt-4 tracking-tight">$0</p>
                  <ul className="space-y-2.5 my-6 text-xs text-gray-400">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> 5 video uploads per month</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Automated Transcripts</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Direct Cloudflare R2 Uploads</li>
                  </ul>
                </div>
                <Link href="/signup" className="h-9 w-full bg-[#141418] hover:bg-[#1c1c22] border border-white/[0.08] text-white text-xs font-medium rounded-lg transition-all flex items-center justify-center">
                  Get Started Free
                </Link>
              </div>

              <div className="bg-[#0a0a0c] border-2 border-blue-500/80 rounded-xl p-6 flex flex-col justify-between relative shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                  Recommended
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Professional</h3>
                  <p className="text-xs text-blue-400 mt-0.5">For engineering teams</p>
                  <p className="text-3xl font-bold text-white mt-4 tracking-tight">$49 <span className="text-xs text-gray-400 font-normal">/ mo</span></p>
                  <ul className="space-y-2.5 my-6 text-xs text-gray-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Unlimited video processing</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Gemini 3.6 Flash Inference</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Copilot Interactive Queries</li>
                  </ul>
                </div>
                <Link href="/signup" className="h-9 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-all flex items-center justify-center shadow-md">
                  Upgrade to Pro
                </Link>
              </div>

              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Enterprise</h3>
                  <p className="text-xs text-gray-400 mt-0.5">For dedicated infrastructure</p>
                  <p className="text-3xl font-bold text-white mt-4 tracking-tight">Custom</p>
                  <ul className="space-y-2.5 my-6 text-xs text-gray-400">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Dedicated worker pools</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Custom SLA & Dedicated Support</li>
                  </ul>
                </div>
                <a href="mailto:support@visicore.ai" className="h-9 w-full bg-[#141418] hover:bg-[#1c1c22] border border-white/[0.08] text-white text-xs font-medium rounded-lg transition-all flex items-center justify-center">
                  Contact Sales
                </a>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-8 bg-[#070709] border-t border-white/[0.07] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Video className="w-4 h-4 text-blue-400" />
          <span>VisiCore AI</span>
        </div>
        <p>&copy; {new Date().getFullYear()} VisiCore AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
