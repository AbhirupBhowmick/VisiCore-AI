"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import { Mail, Lock, Eye, EyeOff, Video, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Cpu, Layers } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/register', { email, password, role: 'USER' });
      router.push('/login?registered=true');
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Top Navbar Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-150 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
        
        <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Video className="w-4 h-4" />
          </div>
          <span>VisiCore <span className="text-blue-500 font-mono text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">AI</span></span>
        </Link>
      </header>

      {/* Main Split Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8 z-10">
        
        {/* Left Side: Features & Value Proposition */}
        <div className="lg:col-span-7 hidden lg:flex flex-col justify-center space-y-8 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Start Analyzing Videos in Minutes
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Transform raw video assets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">into structured insights.</span>
          </h1>

          <p className="text-base text-gray-400 max-w-xl leading-relaxed">
            Create an account to gain immediate access to automated video transcription, timestamp indexing, smart summaries, and interactive Copilot analysis.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Gemini 3.6 Flash Inference</h4>
                <p className="text-[11px] text-gray-400">Deep multimodal processing for full-length video streams.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mt-0.5">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Direct Presigned Cloud Storage</h4>
                <p className="text-[11px] text-gray-400">Zero-latency uploads directly to Cloudflare R2 object storage.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mt-0.5">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Real-Time Search & Interactive Copilot</h4>
                <p className="text-[11px] text-gray-400">Query your video collection directly using natural language prompts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sleek Signup Form Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-[#0a0a0c] border border-white/[0.09] rounded-2xl p-8 shadow-2xl relative backdrop-blur-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight">Create your account</h2>
              <p className="text-xs text-gray-400 mt-1">Get started with your free workspace access</p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-3.5 py-3 rounded-lg mb-5 text-xs flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/[0.08] focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 text-white rounded-lg pl-10 pr-3.5 py-2.5 text-xs placeholder-gray-600 transition-all outline-none"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/[0.08] focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 text-white rounded-lg pl-10 pr-10 py-2.5 text-xs placeholder-gray-600 transition-all outline-none"
                    placeholder="At least 8 characters"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.45)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 mt-6 cursor-pointer"
              >
                {loading ? 'Creating account...' : 'Get Started Free'}
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/[0.06] text-center text-xs text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-gray-600 z-10">
        &copy; {new Date().getFullYear()} VisiCore AI Inc. Precision Media Intelligence.
      </footer>
    </div>
  );
}
