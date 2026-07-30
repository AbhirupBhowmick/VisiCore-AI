"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { 
  Mail, Lock, Eye, EyeOff, Video, ArrowRight, ArrowLeft, CheckCircle2, 
  ShieldCheck, Zap, Sparkles, Server, Cpu, UploadCloud, Database
} from 'lucide-react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';
  const setToken = useAuthStore((state) => state.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      setToken(response.data.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Top Navbar Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors duration-150 group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>
        
        <Link href="/" className="inline-flex items-center gap-2.5 text-base font-semibold tracking-tight text-white">
          <div className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Video className="w-3.5 h-3.5" />
          </div>
          <span>VisiCore <span className="text-blue-400 font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">AI</span></span>
        </Link>
      </header>

      {/* Main Split Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6 z-10">
        
        {/* Left Side: Product Pipeline & Product Highlights */}
        <div className="lg:col-span-7 hidden lg:flex flex-col justify-center space-y-6 pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Multimodal Video Pipeline
          </div>

          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
            High-speed video intelligence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">for engineering & media teams.</span>
          </h1>

          <p className="text-xs md:text-sm text-gray-400 max-w-lg leading-relaxed">
            Transcribe, index timestamps, generate executive summaries, and query raw footage in real-time with Gemini 3.6 Flash.
          </p>

          {/* Animated Pipeline Visual */}
          <div className="bg-[#0a0a0c] border border-white/[0.08] p-4 rounded-xl space-y-3">
            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">Live Distributed Pipeline</div>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="p-2.5 bg-[#141418] border border-white/[0.06] rounded-lg">
                <UploadCloud className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <span className="text-white font-medium block">R2 Upload</span>
                <span className="text-gray-500">Presigned PUT</span>
              </div>
              <div className="p-2.5 bg-[#141418] border border-white/[0.06] rounded-lg">
                <Server className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <span className="text-white font-medium block">RabbitMQ</span>
                <span className="text-gray-500">Queue Task</span>
              </div>
              <div className="p-2.5 bg-[#141418] border border-white/[0.06] rounded-lg">
                <Cpu className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <span className="text-white font-medium block">Gemini 3.6</span>
                <span className="text-gray-500">AI Worker</span>
              </div>
              <div className="p-2.5 bg-[#141418] border border-white/[0.06] rounded-lg">
                <Database className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <span className="text-white font-medium block">PostgreSQL</span>
                <span className="text-gray-500">Indexed DB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Premium Sign In Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-[#0a0a0c] border border-white/[0.09] rounded-2xl p-7 shadow-2xl relative">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-white tracking-tight">Sign in to VisiCore AI</h2>
              <p className="text-xs text-gray-400 mt-0.5">Enter your account credentials to access your workspace.</p>
            </div>

            {isRegistered && !error && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded-lg mb-4 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Account registered successfully. Please sign in.</span>
              </div>
            )}

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-3 py-2 rounded-lg mb-4 text-xs flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/[0.08] focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 text-white rounded-lg pl-9 pr-3.5 py-2 text-xs placeholder-gray-600 transition-all outline-none"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-gray-300">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/[0.08] focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 text-white rounded-lg pl-9 pr-9 py-2 text-xs placeholder-gray-600 transition-all outline-none"
                    placeholder="••••••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-9 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all shadow-[0_0_12px_rgba(37,99,235,0.3)] hover:shadow-[0_0_18px_rgba(37,99,235,0.45)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 mt-5 cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign In to Workspace'}
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-white/[0.06] text-center text-xs text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-gray-600 z-10">
        &copy; {new Date().getFullYear()} VisiCore AI Inc. Precision Video Intelligence.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
