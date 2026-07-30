"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Lock, CheckCircle2, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import api from '../../../lib/api';

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

export default function SettingsPage() {
  const token = useAuthStore((state) => state.token);
  const emailFromToken = getEmailFromToken(token);

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get('/api/auth/me');
      return response.data;
    },
    enabled: !!token,
  });

  const email = userProfile?.email || emailFromToken;
  const userRole = userProfile?.role || 'USER';

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.post('/api/auth/change-password', {
        email,
        currentPassword,
        newPassword
      });
      setPasswordSuccess('Password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setPasswordError(errorResponse.response?.data?.message || 'Failed to change password. Please check current credentials.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner Header */}
      <div className="pb-6 border-b border-white/[0.06]">
        <h1 className="text-2xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage workspace credentials and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Account Profile Info */}
        <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/[0.06]">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-semibold text-white">Account Profile</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <span className="text-xs text-gray-400 font-medium">Email Address</span>
                <span className="text-xs font-medium text-white truncate max-w-[200px]">{email || 'Not authenticated'}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <span className="text-xs text-gray-400 font-medium">Access Role</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {userRole.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-gray-400 font-medium">Session Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Active & Authenticated
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-[#141418] border border-white/[0.06] rounded-lg p-3 text-[11px] text-gray-400 leading-relaxed">
            Authentication context is protected via JWT tokens and encrypted byte-stream policies.
          </div>
        </div>

        {/* Card 2: Security & Password Update */}
        <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/[0.06]">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-white">Update Password</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3.5">
            {passwordError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Current Password</label>
              <input 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#0d0d10] border border-white/[0.08] focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 text-white rounded-lg px-3 py-2 text-xs placeholder-gray-600 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">New Password</label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#0d0d10] border border-white/[0.08] focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 text-white rounded-lg px-3 py-2 text-xs placeholder-gray-600 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Confirm New Password</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#0d0d10] border border-white/[0.08] focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 text-white rounded-lg px-3 py-2 text-xs placeholder-gray-600 transition-all outline-none"
              />
            </div>

            <button 
              type="submit"
              disabled={passwordLoading}
              className="w-full h-9 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all shadow-[0_0_12px_rgba(37,99,235,0.3)] hover:shadow-[0_0_18px_rgba(37,99,235,0.5)] active:scale-[0.98] disabled:opacity-50 cursor-pointer mt-4"
            >
              {passwordLoading ? 'Updating Password...' : 'Save Password Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
