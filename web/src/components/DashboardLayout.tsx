"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Library, Settings, LogOut, Video } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state: any) => state.token);
  const router = useRouter();
  
  const [isHydrated, setIsHydrated] = useState(false);
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
    } catch (e) {
      return '';
    }
  };

  const email = getEmailFromToken(token);
  const userInitial = email ? email[0].toUpperCase() : 'U';

  // Wait for store to hydrate from localStorage on client-side mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
    { name: 'Library', href: '/videos', icon: Library },
    { name: 'Upload', href: '/upload', icon: Video },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  // While checking authentication or hydrating, display a clean loading skeleton
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#000000] text-[#e1e2ec] relative">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-[#262626] flex flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tighter text-white text-glow hover:opacity-90 transition-opacity">
            <Video className="w-6 h-6 text-blue-500" />
            VisiCore <span className="text-blue-500">AI</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 mt-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none active:scale-[0.97] ${
                  isActive ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'text-gray-400 border-transparent hover:text-white hover:bg-[#141414]'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#262626]">
          <button 
            onClick={() => setShowSignOutModal(true)} 
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 border border-transparent hover:text-white hover:bg-[#141414] rounded-lg transition-all duration-200 text-left outline-none focus:outline-none focus-visible:outline-none active:scale-[0.97]"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#262626] flex items-center justify-between px-8 z-20 relative">
          <div className="text-xl font-semibold text-white capitalize">
            {pathname.split('/')[1] || 'Dashboard'}
          </div>
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-150 flex items-center justify-center text-white font-bold cursor-pointer outline-none focus:outline-none focus-visible:outline-none active:scale-90"
            >
              {userInitial}
            </button>
            {profileDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setProfileDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 top-10 w-48 bg-[#0A0A0A] border border-[#262626] rounded-xl shadow-2xl py-2 z-20 transition-all duration-200">
                  <Link 
                    href="/settings" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#141414] transition-colors"
                  >
                    Account Settings
                  </Link>
                  <button 
                    onClick={() => { setProfileDropdownOpen(false); setShowSignOutModal(true); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors outline-none"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-[#000000]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowSignOutModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Top Warning Icon */}
            <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-xl mb-4 mx-auto">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            
            {/* Text Information */}
            <h3 className="text-xl font-bold text-white text-center mb-2 tracking-tight">Sign Out of VisiCore AI?</h3>
            <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
              Are you sure you want to end your active session? You will need to enter your email and password to log in again.
            </p>
            
            {/* Button Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleConfirmLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] outline-none"
              >
                Yes, Sign Out
              </button>
              <button 
                onClick={() => setShowSignOutModal(false)}
                className="w-full bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] text-gray-400 hover:text-white font-medium py-3 rounded-xl transition-colors outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
