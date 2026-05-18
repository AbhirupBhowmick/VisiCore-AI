"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Key, Cpu, Bell, Webhook, 
  Eye, EyeOff, Copy, Check, Sparkles, ShieldAlert, CheckCircle 
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import api from '../../../lib/api';

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
  } catch (e) {
    return '';
  }
};

export default function SettingsPage() {
  const token = useAuthStore((state: any) => state.token);
  const email = getEmailFromToken(token);

  // Profile preferences (Saved locally in localStorage for persistent client state)
  const [neuralMode, setNeuralMode] = useState('accuracy'); // accuracy | speed
  const [webhooksActive, setWebhooksActive] = useState(false);
  const [alertsActive, setAlertsActive] = useState(true);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // API key states
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const apiKey = 'vc_live_83b27b9921f0084c892019488a0b73c2';

  // Platform preferences loading/saving local states
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    // Load persisted preferences
    const storedNeuralMode = localStorage.getItem('vc_pref_neural_mode');
    const storedWebhooks = localStorage.getItem('vc_pref_webhooks');
    const storedAlerts = localStorage.getItem('vc_pref_alerts');

    if (storedNeuralMode) setNeuralMode(storedNeuralMode);
    if (storedWebhooks) setWebhooksActive(storedWebhooks === 'true');
    if (storedAlerts) setAlertsActive(storedAlerts === 'true');
  }, []);

  const handleSavePreferences = () => {
    localStorage.setItem('vc_pref_neural_mode', neuralMode);
    localStorage.setItem('vc_pref_webhooks', String(webhooksActive));
    localStorage.setItem('vc_pref_alerts', String(alertsActive));
    
    setSaveStatus('Preferences saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      // Hit the new backend change password endpoint
      await api.post('/api/auth/change-password', {
        email,
        currentPassword,
        newPassword
      });
      setPasswordSuccess('Password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password. Please check current credentials.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* Top Banner Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure neural pipelines, developer access credentials, and profile options</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Account Profile and Password Security */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Card 1: Account Profile Info */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 hover:border-gray-800 transition-colors">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Account Profile
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f1f1f] pb-4">
                <span className="text-sm text-gray-500 font-medium">Email Address</span>
                <span className="text-sm font-semibold text-white mt-1 sm:mt-0">{email || 'Not authenticated'}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f1f1f] pb-4">
                <span className="text-sm text-gray-500 font-medium">Account Access Role</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20 mt-1 sm:mt-0">
                  DEVELOPER / USER
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">Platform Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 mt-1 sm:mt-0">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  Active Session
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Security & Password Update */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 hover:border-gray-800 transition-colors">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-500" />
              Update Password
            </h3>

            {passwordError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3.5 rounded-xl mb-6 text-xs leading-relaxed flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3.5 rounded-xl mb-6 text-xs leading-relaxed flex items-center gap-2 animate-bounce">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
                <input 
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#000000] border border-[#262626] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm placeholder-gray-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                  <input 
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#000000] border border-[#262626] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm placeholder-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#000000] border border-[#262626] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm placeholder-gray-700"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] disabled:opacity-50 mt-4"
              >
                {passwordLoading ? 'Updating credentials...' : 'Update Password'}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Platform Prefs and API Keys */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Card 3: Developer API Credentials */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 hover:border-gray-800 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
            
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-500" />
              API Feed Credentials
            </h3>
            
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Integrate external security cameras and RTSP streaming links remotely into VisiCore AI using your API key.
            </p>

            <div className="bg-[#000000] border border-[#262626] rounded-xl p-3 flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-glow text-blue-400 select-all tracking-wider">
                {showApiKey ? apiKey : '••••••••••••••••••••••••••••••••••••'}
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-gray-500 hover:text-white transition-colors p-1.5"
                  title={showApiKey ? 'Hide Key' : 'Show Key'}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button 
                  onClick={handleCopyKey}
                  className="text-gray-500 hover:text-white transition-colors p-1.5 relative"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 text-2xs leading-relaxed text-blue-300 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>
                Keep your API secrets private. If compromised, you can revoke keys from the developer portal console.
              </span>
            </div>
          </div>

          {/* Card 4: Neural Engine Preferences */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 hover:border-gray-800 transition-colors">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-500" />
              Neural Pipeline Prefs
            </h3>

            {saveStatus && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl mb-4 text-2xs leading-relaxed flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                <span>{saveStatus}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Option 1 */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Neural Engine Mode</label>
                <div className="grid grid-cols-2 gap-2 bg-[#000000] p-1 border border-[#262626] rounded-xl">
                  <button 
                    onClick={() => setNeuralMode('accuracy')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      neuralMode === 'accuracy' ? 'bg-[#141414] text-white border border-[#262626]' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    High Accuracy
                  </button>
                  <button 
                    onClick={() => setNeuralMode('speed')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      neuralMode === 'speed' ? 'bg-[#141414] text-white border border-[#262626]' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Fast Inference
                  </button>
                </div>
              </div>

              {/* Option 2 */}
              <div className="flex items-center justify-between border-t border-[#1f1f1f] pt-4">
                <div className="flex items-start gap-2">
                  <Webhook className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <span className="block text-sm font-semibold text-white">Active Webhooks</span>
                    <span className="block text-2xs text-gray-500 mt-0.5">Send alert callbacks to endpoint url</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setWebhooksActive(!webhooksActive)}
                  className={`w-11 h-6 rounded-full transition-all duration-300 p-0.5 relative cursor-pointer ${
                    webhooksActive ? 'bg-blue-600' : 'bg-gray-800'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white block transition-all shadow-md ${
                    webhooksActive ? 'translate-x-5' : 'translate-x-0'
                  }`}></span>
                </button>
              </div>

              {/* Option 3 */}
              <div className="flex items-center justify-between border-t border-[#1f1f1f] pt-4">
                <div className="flex items-start gap-2">
                  <Bell className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <span className="block text-sm font-semibold text-white">Audio Sound Alerts</span>
                    <span className="block text-2xs text-gray-500 mt-0.5">Play ping upon high density detections</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setAlertsActive(!alertsActive)}
                  className={`w-11 h-6 rounded-full transition-all duration-300 p-0.5 relative cursor-pointer ${
                    alertsActive ? 'bg-blue-600' : 'bg-gray-800'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white block transition-all shadow-md ${
                    alertsActive ? 'translate-x-5' : 'translate-x-0'
                  }`}></span>
                </button>
              </div>

              {/* Save Button */}
              <button 
                onClick={handleSavePreferences}
                className="w-full bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] text-white font-medium py-3 rounded-xl transition-all text-sm outline-none focus:outline-none hover:border-gray-700"
              >
                Save Preferences
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
