"use client";

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Library, Settings, LogOut, Video, User, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Logo from './Logo';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  
  const isHydrated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

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

  const email = getEmailFromToken(token);
  const userInitial = email ? email[0].toUpperCase() : 'U';

  // Perform route protection ONLY after state hydration is completed
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  const handleConfirmLogout = () => {
    setShowSignOutModal(false);
    logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Video Library', href: '/videos', icon: Library },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center font-sans">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 flex font-sans selection:bg-blue-500/30">
      
      {/* Sidebar Navigation — Linear Aesthetic */}
      <aside className="w-60 bg-[#070709] border-r border-white/[0.07] flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-30 select-none">
        <div>
          {/* Logo & Brand Header */}
          <div className="h-14 px-5 flex items-center border-b border-white/[0.06]">
            <Logo href="/dashboard" size="md" />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-2 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white/[0.07] text-white font-semibold sidebar-active-pill'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User / Session Section */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="px-2 py-2 mb-1 flex items-center gap-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <div className="w-6 h-6 rounded-md bg-blue-600/30 text-blue-300 flex items-center justify-center text-xs font-semibold">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-white truncate">{email || 'User Session'}</p>
              <p className="text-[9px] text-gray-500 truncate flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> Authenticated
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSignOutModal(true)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Sticky Header Bar */}
        <header className="h-14 bg-[#070709]/80 backdrop-blur-xl border-b border-white/[0.07] px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 tracking-wide font-mono">
              Enterprise v1.0 • Gemini 3.6 Flash
            </span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              {userInitial}
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#0c0c10] border border-white/[0.09] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3.5 py-2 border-b border-white/[0.06]">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Active User</p>
                  <p className="text-xs font-medium text-white truncate mt-0.5">{email || 'User'}</p>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs text-gray-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-gray-400" />
                  <span>Account Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setShowSignOutModal(true);
                  }}
                  className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Body Container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Confirmation Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c10] border border-white/[0.1] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-semibold text-white mb-1.5">Sign Out Confirmation</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Are you sure you want to end your current session? You will need to log back in to access video pipelines.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowSignOutModal(false)}
                className="h-8 px-3.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="h-8 px-3.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
