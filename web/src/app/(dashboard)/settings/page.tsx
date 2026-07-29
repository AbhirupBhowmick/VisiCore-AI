"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Lock, CheckCircle, ShieldAlert } from 'lucide-react';
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
    <div className="space-y-8 font-sans pb-16">
      {/* Top Banner Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account profile and security credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Account Profile Info */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 hover:border-gray-800 transition-colors flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Account Profile
            </h3>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f1f1f] pb-4">
                <span className="text-sm text-gray-500 font-medium">Email Address</span>
                <span className="text-sm font-semibold text-white mt-1 sm:mt-0">{email || 'Not authenticated'}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f1f1f] pb-4">
                <span className="text-sm text-gray-500 font-medium">Account Access Role</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20 mt-1 sm:mt-0">
                  {userRole.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f1f1f] pb-4">
                <span className="text-sm text-gray-500 font-medium">Platform Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 mt-1 sm:mt-0">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  Active Session
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-xs text-blue-300">
            Account preferences and authentication credentials are synchronized securely across your enterprise session.
          </div>
        </div>

        {/* Card 2: Security & Password Update */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 hover:border-gray-800 transition-colors">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-500" />
            Security & Authentication
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-5">
            {passwordError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
              <input 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#000000] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#000000] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#000000] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>

            <button 
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {passwordLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
