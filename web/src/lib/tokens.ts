/**
 * VisiCore AI — Production Design Tokens & System Standards
 * Inspired by Linear, Vercel, Supabase, and Raycast aesthetics.
 */

export const tokens = {
  colors: {
    bg: {
      app: '#050505',
      card: '#0a0a0c',
      cardHover: '#111115',
      subtle: '#141418',
      sidebar: '#070709',
      border: 'rgba(255, 255, 255, 0.08)',
      borderHover: 'rgba(255, 255, 255, 0.16)',
      accentGlow: 'rgba(59, 130, 246, 0.15)',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
      muted: '#6b7280',
      accent: '#60a5fa',
    },
    accent: {
      blue: '#3b82f6',
      blueHover: '#2563eb',
      blueLight: '#93c5fd',
      emerald: '#10b981',
      rose: '#f43f5e',
      amber: '#f59e0b',
    },
  },
  radii: {
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
    glow: '0 0 20px rgba(59, 130, 246, 0.15)',
    focus: '0 0 0 2px rgba(59, 130, 246, 0.5)',
  },
  transitions: {
    fast: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    smooth: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

export const styles = {
  card: 'bg-[#0a0a0c] border border-white/[0.08] hover:border-white/[0.14] rounded-xl transition-all duration-200 shadow-lg',
  glassCard: 'bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-xl',
  buttonPrimary: 'h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-all duration-150 shadow-[0_0_12px_rgba(37,99,235,0.3)] hover:shadow-[0_0_18px_rgba(37,99,235,0.5)] active:scale-[0.98] outline-none flex items-center justify-center gap-2 cursor-pointer',
  buttonSecondary: 'h-9 px-4 bg-[#141418] hover:bg-[#1c1c22] border border-white/[0.08] hover:border-white/[0.16] text-gray-200 hover:text-white font-medium text-xs rounded-lg transition-all duration-150 active:scale-[0.98] outline-none flex items-center justify-center gap-2 cursor-pointer',
  input: 'h-10 w-full bg-[#0d0d10] border border-white/[0.08] focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 rounded-lg px-3.5 text-xs text-white placeholder-gray-500 transition-all outline-none',
  badge: 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border',
};
