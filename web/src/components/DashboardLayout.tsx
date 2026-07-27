"use client";

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Library, Settings, LogOut, Video } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

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
    { name: 'Videos', href: '/videos', icon: Library },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 flex font-sans selection:bg-blue-500/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-[#262626] flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-30">
        <div>
          {/* Logo & Brand */}
          <div className="p-6 border-b border-[#1f1f1f]">
            <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-white">
              <Video className="w-6 h-6 text-blue-500" />
              VisiCore AI
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                      : 'text-gray-400 hover:text-white hover:bg-[#141414]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Sign Out Action */}
        <div className="p-4 border-t border-[#1f1f1f]">
          <button
            onClick={() => setShowSignOutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Sticky Header Bar */}
        <header className="h-16 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#262626] px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Enterprise Neural v2.5
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md hover:ring-2 hover:ring-blue-500 transition-all"
            >
              {userInitial}
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0A0A0A] border border-[#262626] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-[#1f1f1f]">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-xs font-semibold text-white truncate">{email || 'User'}</p>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#141414] hover:text-white"
                >
                  Account Settings
                </Link>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setShowSignOutModal(true);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Confirmation Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Sign Out Confirmation</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Are you sure you want to end your current session? You will need to sign back in to access video telemetry features.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSignOutModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#1f1f1f] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-all shadow-md"
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
