"use client";

import React from 'react';
import { CreditCard, CheckCircle, Download, Sparkles, ShieldCheck, Zap, Lock, Check } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

// Safely extract email from JWT payload
const getEmailFromToken = (token: string | null) => {
  if (!token) return '';
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload).sub || '';
  } catch {
    return '';
  }
};

export default function BillingPage() {
  const token = useAuthStore((state) => state.token);
  const email = getEmailFromToken(token);

  return (
    <div className="pb-12 font-sans space-y-8">
      {/* Top Banner Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest mb-1.5">
          <CreditCard className="w-3.5 h-3.5" /> Billing & Infrastructure Subscription
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Subscription Plan</h1>
        <p className="text-gray-400 text-sm mt-1">Manage processing quotas, compute tiers, and billing receipts for {email || 'your account'}.</p>
      </div>

      {/* Sleek Active Plan Banner */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 relative overflow-hidden group hover:border-gray-800 transition-colors">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Current Plan: Professional Developer</h2>
              <p className="text-xs text-gray-400 mt-1">Active subscription • High-priority Gemini 2.5 GPU compute tier</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Active Tier
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Tier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 flex flex-col hover:border-gray-700 transition-all">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-300">Starter</h3>
            <p className="text-xs text-gray-500 mt-1">For basic video experimentation</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-extrabold text-white">$0</span>
              <span className="text-gray-500 ml-1 text-xs">/ forever</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-gray-400 flex-grow mb-6">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" /> 5 video uploads / mo
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" /> Verbatim Speech Transcripts
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" /> Basic Timeline Navigation
            </li>
          </ul>

          <button disabled className="w-full py-2.5 rounded-xl border border-[#262626] text-gray-500 font-medium text-xs text-center cursor-not-allowed">
            Free Tier Included
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-[#0A0A0A] border-2 border-blue-600 rounded-2xl p-6 flex flex-col relative shadow-[0_0_30px_rgba(37,99,235,0.15)]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Current Tier
          </div>

          <div className="mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" /> Professional
            </h3>
            <p className="text-xs text-blue-400 mt-1">Full access to telemetry pipeline</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-extrabold text-white">$49</span>
              <span className="text-gray-400 ml-1 text-xs">/ month</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-gray-300 flex-grow mb-6">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" /> Unlimited Video Uploads
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" /> Gemma 4 Copilot Interactive Chat
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" /> Interactive Timestamps & Summaries
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" /> MinIO S3 Object Storage Included
            </li>
          </ul>

          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md">
            Manage Subscription
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 flex flex-col hover:border-gray-700 transition-all">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-300">Enterprise</h3>
            <p className="text-xs text-gray-500 mt-1">Dedicated GPU cluster & SLAs</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-extrabold text-white">Custom</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-gray-400 flex-grow mb-6">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" /> Dedicated Worker Queue Threads
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" /> Custom Vocabulary & Fine-tuning
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" /> 24/7 Priority SLA Support
            </li>
          </ul>

          <a href="mailto:support@visicore.ai" className="w-full py-2.5 rounded-xl border border-[#262626] text-white hover:bg-[#141414] transition-all font-medium text-xs text-center block">
            Contact Sales
          </a>
        </div>
      </div>

      {/* Payment Information & Invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Method */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-500" /> Payment Security
          </h3>
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-black border border-gray-800 rounded flex items-center justify-center font-bold italic text-[10px] text-blue-400">
                VISA
              </div>
              <div>
                <p className="text-xs font-semibold text-white">•••• •••• •••• 4242</p>
                <p className="text-[10px] text-gray-500">Encrypted Bearer Authentication</p>
              </div>
            </div>
            <Lock className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Invoice Download */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-500" /> Recent Receipts
          </h3>
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Monthly Pro Subscription</p>
              <p className="text-[10px] text-gray-500">$49.00 • Active Account</p>
            </div>
            <button className="p-2 rounded-lg bg-black hover:bg-[#1f1f1f] text-blue-400 border border-[#262626] transition-all">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
