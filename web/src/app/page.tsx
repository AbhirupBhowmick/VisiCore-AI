"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Video, Search, Layers, Shield, Cpu } from 'lucide-react';
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
    <div id="platform" className="relative text-white min-h-screen flex flex-col font-sans selection:bg-blue-600/30 selection:text-white overflow-x-hidden">
      
      {/* Layered Obsidian Base Background to prevent browser-level negative z-index clipping */}
      <div className="absolute inset-0 bg-[#000000] -z-50 w-full h-full pointer-events-none"></div>

      {/* Full-Page Background ShapeGrid */}
      <div className="absolute inset-0 w-full h-full -z-40 pointer-events-auto">
        <ShapeGrid 
          speed={0.16} 
          squareSize={46}
          direction="diagonal"
          borderColor="rgba(56, 189, 248, 0.22)"
          hoverFillColor="rgba(14, 165, 233, 0.38)"
          shape="square"
          hoverTrailAmount={6}
        />
      </div>
      
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-[#000000]/80 backdrop-blur-md border-b border-[#262626] transition-all">
        <div className="flex items-center gap-6">
          <a onClick={(e) => handleScroll(e, 'platform')} className="text-xl font-bold tracking-tighter text-white text-glow flex items-center gap-2 cursor-pointer" href="#platform">
            <Video className="w-6 h-6 text-blue-500" />
            VisiCore AI
          </a>
          <div className="hidden md:flex gap-1 ml-8">
            <a onClick={(e) => handleScroll(e, 'platform')} className="text-gray-400 hover:text-white transition-colors hover:bg-[#141414] px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer" href="#platform">Platform</a>
            <a onClick={(e) => handleScroll(e, 'features')} className="text-gray-400 hover:text-white transition-colors hover:bg-[#141414] px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer" href="#features">Features</a>
            <a onClick={(e) => handleScroll(e, 'pricing')} className="text-gray-400 hover:text-white transition-colors hover:bg-[#141414] px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer" href="#pricing">Pricing</a>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link className="text-gray-400 hover:text-white transition-colors px-3 py-1.5" href="/login">Log In</Link>
          <Link className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]" href="/signup">Sign Up</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-8 overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">

          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center z-10 relative">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-400 mb-6 animate-pulse">
              <Cpu className="w-3.5 h-3.5" /> Next-Gen Video Intelligence
            </div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
              Unlock the Intelligence <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500">Within Every Frame.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Precision video understanding powered by advanced semantic search and object detection. Transform raw footage into actionable data streams instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a onClick={(e) => handleScroll(e, 'demo')} href="#demo" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 group cursor-pointer">
                Try Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link href="/login" className="w-full sm:w-auto text-white border border-[#262626] font-medium px-8 py-3.5 rounded-xl transition-all hover:bg-[#141414] hover:border-gray-700 flex items-center justify-center">
                Explore Dashboard
              </Link>
            </div>
          </div>

          {/* Hero Image Visualization with Premium Holographic Widescreen Masking & Seamless Grid Blend */}
          <div id="demo" className="w-full max-w-4xl mx-auto mt-20 relative z-10 flex items-center justify-center group px-4">
            
            {/* Layered Chromatic Ambient Radial Backlights (Breathing Atmosphere) */}
            <div className="absolute w-[620px] h-[360px] bg-blue-500/10 rounded-full blur-[120px] -z-20 pointer-events-none animate-pulse"></div>
            <div className="absolute w-[480px] h-[260px] bg-cyan-500/8 rounded-full blur-[100px] -z-20 pointer-events-none animate-pulse delay-100"></div>

            {/* Floating Live Indicator Tab */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#0A0A0A]/95 border border-[#262626]/80 px-4 py-1.5 rounded-full text-[9px] font-mono tracking-widest text-cyan-400/85 flex items-center gap-2 shadow-xl backdrop-blur-md group-hover:border-cyan-500/40 transition-all duration-500 z-30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              LIVE VIDEO STREAM [NODE_08]
            </div>

            {/* Widescreen Masked Container - Fades edges seamlessly into the grid background */}
            <div 
              className="relative w-full overflow-hidden transition-all duration-1000 ease-out hover:scale-[1.015]"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 52% 35% at 50% 50%, #000000 10%, rgba(0, 0, 0, 0.8) 45%, rgba(0, 0, 0, 0.2) 75%, transparent 100%)',
                maskImage: 'radial-gradient(ellipse 52% 35% at 50% 50%, #000000 10%, rgba(0, 0, 0, 0.8) 45%, rgba(0, 0, 0, 0.2) 75%, transparent 100%)'
              }}
            >
              <img 
                alt="AI Video Analytics Visualization" 
                className="w-full h-auto block opacity-90 group-hover:opacity-100 transition-all duration-1000 bg-transparent filter brightness-[1.05] contrast-[1.02]" 
                src="/visicore_hero_visual.png"
              />

              {/* Holographic Gridlines & CRT overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(59,130,246,0.03),_rgba(34,211,238,0.01),_rgba(99,102,241,0.03))] bg-[size:100%_4px,_6px_100%] opacity-40 z-10 pointer-events-none"></div>

              {/* Dynamic Scanning Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20 opacity-80 scan-line"></div>
            </div>

            {/* Floating Telemetry Badges for Premium Computer Vision Feel */}
            <div className="absolute bottom-6 left-12 hidden md:flex items-center gap-3 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#262626]/80 px-4 py-2.5 rounded-xl text-[10px] uppercase font-semibold tracking-wider text-gray-400 shadow-[0_8px_32px_rgba(0,0,0,0.8)] z-20 transition-all hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] duration-300">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
              <span className="text-glow text-cyan-400 font-mono">FEED STATUS: PROCESSING</span>
            </div>
            <div className="absolute top-16 right-12 hidden md:flex items-center gap-3 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#262626]/80 px-4 py-2.5 rounded-xl text-[10px] uppercase font-semibold tracking-wider text-gray-400 shadow-[0_8px_32px_rgba(0,0,0,0.8)] z-20 transition-all hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] duration-300">
              <span className="text-cyan-400 font-mono">ACCURACY: 99.42%</span>
            </div>

          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-24 px-8 bg-transparent relative border-t border-[#141414]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Core Intelligence</h2>
              <p className="text-gray-400 max-w-[36rem] mx-auto text-base leading-relaxed">Extract meaning from pixels with our proprietary neural architecture designed specifically for high-density video data.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 transition-all duration-300 hover:border-blue-500/30 hover:bg-[#0E0E0E] group flex flex-col h-full hover:shadow-[0_8px_30px_rgba(37,99,235,0.05)]">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:border-blue-500/40 transition-colors">
                  <Video className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">AI Transcripts</h3>
                <p className="text-sm text-gray-400 flex-grow leading-relaxed">Real-time, multi-language speech-to-text with advanced speaker identification and diarization capabilities.</p>
                <div className="mt-6 h-[2px] w-full bg-[#141414] overflow-hidden rounded-full">
                  <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 transition-all duration-300 hover:border-blue-500/30 hover:bg-[#0E0E0E] group flex flex-col h-full hover:shadow-[0_8px_30px_rgba(37,99,235,0.05)]">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:border-blue-500/40 transition-colors">
                  <Search className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">Semantic Search</h3>
                <p className="text-sm text-gray-400 flex-grow leading-relaxed">Find specific moments in thousands of hours of video using natural language queries instead of rigid metadata tags.</p>
                <div className="mt-6 h-[2px] w-full bg-[#141414] overflow-hidden rounded-full">
                  <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 transition-all duration-300 hover:border-blue-500/30 hover:bg-[#0E0E0E] group flex flex-col h-full hover:shadow-[0_8px_30px_rgba(37,99,235,0.05)]">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:border-blue-500/40 transition-colors">
                  <Layers className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">Object Tracking</h3>
                <p className="text-sm text-gray-400 flex-grow leading-relaxed">Automated tracking and classification of objects, actions, and custom events across feeds with sub-second latency.</p>
                <div className="mt-6 h-[2px] w-full bg-[#141414] overflow-hidden rounded-full">
                  <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-8 bg-transparent relative border-t border-[#141414]">
          {/* Ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Transparent Enterprise Pricing</h2>
              <p className="text-gray-400 max-w-[36rem] mx-auto text-base leading-relaxed">Choose a plan tailored to your processing needs. Scale effortlessly from single videos to high-density video vaults.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              
              {/* Starter Plan */}
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-3xl p-8 flex flex-col transition-all duration-300 hover:border-gray-700 hover:bg-[#0E0E0E] relative h-full">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-300">Starter</h3>
                  <p className="text-sm text-gray-500 mt-1">For creators & experimenters</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">$0</span>
                    <span className="text-gray-500 ml-1 text-sm">/ forever</span>
                  </div>
                </div>
                
                <hr className="border-[#1C1C1C] my-2" />

                <ul className="space-y-4 my-6 text-sm text-gray-400 flex-grow">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold">✓</span>
                    5 videos per month
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold">✓</span>
                    AI Audio Transcripts
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold">✓</span>
                    Basic Semantic Search
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold">✓</span>
                    2GB Cloud Storage
                  </li>
                </ul>

                <Link href="/signup" className="w-full py-3 rounded-xl border border-[#262626] text-white hover:bg-[#141414] hover:border-gray-600 transition-all font-medium text-center text-sm">
                  Get Started
                </Link>
              </div>

              {/* Pro Plan (Highlighted) */}
              <div className="bg-[#0A0A0A] border-2 border-blue-600 rounded-3xl p-8 flex flex-col transition-all duration-300 hover:bg-[#0E0E0E] relative h-full shadow-[0_0_40px_rgba(37,99,235,0.15)] scale-[1.03]">
                {/* Most Popular Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
                  Most Popular
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white">Professional</h3>
                  <p className="text-sm text-blue-400 mt-1">For active developers & teams</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">$49</span>
                    <span className="text-gray-400 ml-1 text-sm">/ month</span>
                  </div>
                </div>

                <hr className="border-blue-500/20 my-2" />

                <ul className="space-y-4 my-6 text-sm text-gray-300 flex-grow">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">✓</span>
                    Unlimited uploaded videos
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">✓</span>
                    Advanced Diarization & Speakers
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">✓</span>
                    Deep Semantic Search Queries
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">✓</span>
                    Real-time Object Tracking (YOLOv8)
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">✓</span>
                    100GB Dedicated Storage
                  </li>
                </ul>

                <Link href="/signup" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium text-center text-sm shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]">
                  Upgrade to Pro
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-3xl p-8 flex flex-col transition-all duration-300 hover:border-gray-700 hover:bg-[#0E0E0E] relative h-full">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-300">Enterprise</h3>
                  <p className="text-sm text-gray-500 mt-1">For large-scale infrastructure</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">Custom</span>
                  </div>
                </div>

                <hr className="border-[#1C1C1C] my-2" />

                <ul className="space-y-4 my-6 text-sm text-gray-400 flex-grow">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold">✓</span>
                    Dedicated GPU computing pools
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold">✓</span>
                    Custom Vocabulary & Dialect Tuning
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold">✓</span>
                    Unlimited Video Library Vaults
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold">✓</span>
                    Restful API Integrations
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold">✓</span>
                    24/7 Dedicated Support SLA
                  </li>
                </ul>

                <a href="mailto:support@visicore.ai" className="w-full py-3 rounded-xl border border-[#262626] text-white hover:bg-[#141414] hover:border-gray-600 transition-all font-medium text-center text-sm">
                  Contact Sales
                </a>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-[#000000] relative z-10 border-t border-[#141414] flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">
        <a onClick={(e) => handleScroll(e, 'platform')} className="text-lg font-bold text-white flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors" href="#platform">
          <Video className="w-5 h-5 text-blue-500" />
          VisiCore AI
        </a>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-white transition-colors" href="#">API Status</a>
        </div>
        <div className="text-sm text-gray-500">
          © 2026 VisiCore AI. Precision video intelligence.
        </div>
      </footer>
    </div>
  );
}
