import React from 'react';

export default function Page() {
  return (
    <>
      
{/* SideNavBar */}
<aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant flex flex-col p-sm z-50">
<div className="mb-xl px-xs">
<h1 className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-xs">
<span className="material-symbols-outlined" >dataset</span>
                VisiCore AI
            </h1>
<p className="text-on-surface-variant font-label-md text-[12px] tracking-widest mt-base uppercase">Video Intelligence</p>
</div>
<nav className="flex-1 space-y-base">
<a className="flex items-center gap-sm p-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors duration-200" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-label-md">Dashboard</span>
</a>
<a className="flex items-center gap-sm p-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors duration-200" href="#">
<span className="material-symbols-outlined">video_library</span>
<span className="font-label-md">Library</span>
</a>
<a className="flex items-center gap-sm p-sm rounded-lg sidebar-active transition-colors duration-200" href="#">
<span className="material-symbols-outlined" >insights</span>
<span className="font-label-md">Insights</span>
</a>
<a className="flex items-center gap-sm p-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors duration-200" href="#">
<span className="material-symbols-outlined">payments</span>
<span className="font-label-md">Billing</span>
</a>
</nav>
<div className="mt-auto p-sm">
<button className="w-full py-sm bg-primary text-on-primary font-label-md rounded-lg electric-glow transition-all hover:opacity-90 active:scale-95">
                Upgrade Plan
            </button>
</div>
</aside>
{/* TopAppBar */}
<header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-md z-40">
<div className="flex items-center gap-md flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
<input className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-xl pr-sm py-xs text-body-sm neon-border-focus transition-all" placeholder="Search insights..." type="text"/>
</div>
</div>
<div className="flex items-center gap-md">
<button className="text-on-surface-variant hover:text-primary transition-all">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-all">
<span className="material-symbols-outlined">settings</span>
</button>
<div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant">
<img alt="User Profile" data-alt="A professional studio portrait of a high-tech software engineer with thoughtful eyes, lit by cool blue and magenta ambient light reflecting on their face. The background is a dark, out-of-focus laboratory setting. The aesthetic is ultra-modern, cinematic, and sophisticated, matching an AI-driven enterprise software interface with deep blacks and vibrant neon accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvXhfIIrGj4DgjpJOQ-mcY-QC6Ir1vBM1JvHNT7bhP6s7ofS1UujF_ESLJZu1JsfLLiY4hrzW6txwHDyqYkZ0HTQfUW0w_lE21LrbgZiinxj_BgrcnYlXpki7h_y6zTRKfy9EQCECCsJ8BS8KhN_7Sy4jTx-Fy-luVuxFJQyJk5-KAvLAX5KSzg89GwJ4Df8PjQODMXsb-syQR8MALFV0ot3DIeBpG3r8djbyBPlzR_1tTVoFlZ3zXAcu5jhcsmbg3AVAh-Wo0ypk"/>
</div>
</div>
</header>
{/* Main Content Canvas */}
<main className="ml-[260px] pt-16 min-h-screen p-lg">
{/* Header Section */}
<section className="flex justify-between items-end mb-lg">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Intelligence Insights</h2>
<p className="text-on-surface-variant mt-xs">Synthesized analysis from cross-camera neural processing.</p>
</div>
<div className="flex items-center gap-sm">
<div className="bg-surface-container-low border border-outline-variant rounded-lg px-sm py-xs flex items-center gap-xs">
<span className="material-symbols-outlined text-[18px]">calendar_today</span>
<span className="font-label-md text-on-surface">Oct 12 - Oct 19, 2023</span>
</div>
<button className="bg-[#3B82F6] text-white px-md py-xs rounded-lg font-label-md flex items-center gap-xs electric-glow hover:bg-blue-600 transition-colors">
<span className="material-symbols-outlined text-[18px]">download</span>
                    Export Report
                </button>
</div>
</section>
{/* Metric Cards Grid */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
<div className="ultra-dark-card p-md rounded-xl">
<p className="font-label-md text-on-surface-variant mb-xs uppercase tracking-tighter text-[11px]">Total Insights</p>
<div className="flex items-baseline gap-xs">
<span className="font-headline-lg text-headline-lg text-on-surface">12,842</span>
<span className="text-primary font-label-md text-[12px]">+14.2%</span>
</div>
<div className="w-full h-1 bg-surface-container-high mt-md rounded-full overflow-hidden">
<div className="h-full bg-primary w-3/4 shadow-[0_0_8px_rgba(173,198,255,0.5)]"></div>
</div>
</div>
<div className="ultra-dark-card p-md rounded-xl">
<p className="font-label-md text-on-surface-variant mb-xs uppercase tracking-tighter text-[11px]">Detection Accuracy</p>
<div className="flex items-baseline gap-xs">
<span className="font-headline-lg text-headline-lg text-on-surface">98.4%</span>
<span className="text-tertiary font-label-md text-[12px]">Optimized</span>
</div>
<div className="w-full h-1 bg-surface-container-high mt-md rounded-full overflow-hidden">
<div className="h-full bg-tertiary w-[98%] shadow-[0_0_8px_rgba(255,183,134,0.5)]"></div>
</div>
</div>
<div className="ultra-dark-card p-md rounded-xl">
<p className="font-label-md text-on-surface-variant mb-xs uppercase tracking-tighter text-[11px]">Processing Efficiency</p>
<div className="flex items-baseline gap-xs">
<span className="font-headline-lg text-headline-lg text-on-surface">42ms</span>
<span className="text-primary font-label-md text-[12px]">-2ms</span>
</div>
<div className="w-full h-1 bg-surface-container-high mt-md rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-primary to-cyan-400 w-4/5"></div>
</div>
</div>
</section>
{/* Topic Clusters Section */}
<section className="grid grid-cols-1 lg:grid-cols-12 gap-md mb-lg">
<div className="lg:col-span-4 ultra-dark-card p-md rounded-xl flex flex-col">
<div className="flex justify-between items-start mb-lg">
<h3 className="font-headline-md text-headline-md text-on-surface">Topic Clusters</h3>
<span className="material-symbols-outlined text-on-surface-variant">info</span>
</div>
<div className="flex-1 flex items-center justify-center py-md">
{/* Custom SVG Radar Chart */}
<svg className="w-full max-w-[240px] drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]" viewBox="0 0 200 200">
<circle className="radar-grid" cx="100" cy="100" fill="none" r="80"></circle>
<circle className="radar-grid" cx="100" cy="100" fill="none" r="60"></circle>
<circle className="radar-grid" cx="100" cy="100" fill="none" r="40"></circle>
<line className="radar-grid" x1="100" x2="100" y1="20" y2="180"></line>
<line className="radar-grid" x1="20" x2="180" y1="100" y2="100"></line>
{/* Data Shape */}
<polygon className="radar-shape" points="100,40 160,100 100,150 50,100" ></polygon>
<polygon fill="rgba(153, 102, 255, 0.2)" points="100,60 140,100 100,130 70,100" stroke="#9966ff" stroke-width="1.5"></polygon>
</svg>
</div>
<div className="grid grid-cols-2 gap-sm mt-md">
<div className="flex items-center gap-xs">
<div className="w-2 h-2 rounded-full bg-primary"></div>
<span className="text-[12px] text-on-surface-variant">Security</span>
</div>
<div className="flex items-center gap-xs">
<div className="w-2 h-2 rounded-full bg-[#9966ff]"></div>
<span className="text-[12px] text-on-surface-variant">Operations</span>
</div>
<div className="flex items-center gap-xs">
<div className="w-2 h-2 rounded-full bg-tertiary"></div>
<span className="text-[12px] text-on-surface-variant">Maintenance</span>
</div>
<div className="flex items-center gap-xs">
<div className="w-2 h-2 rounded-full bg-error"></div>
<span className="text-[12px] text-on-surface-variant">Anomalies</span>
</div>
</div>
</div>
{/* Key Moments & Trends */}
<div className="lg:col-span-8 ultra-dark-card p-md rounded-xl flex flex-col">
<div className="flex justify-between items-center mb-lg">
<h3 className="font-headline-md text-headline-md text-on-surface">Intelligence Frequency</h3>
<div className="flex gap-sm">
<button className="text-[12px] font-label-md px-sm py-1 rounded bg-surface-container-high text-primary">Hourly</button>
<button className="text-[12px] font-label-md px-sm py-1 rounded text-on-surface-variant hover:text-on-surface">Daily</button>
</div>
</div>
<div className="flex-1 relative min-h-[300px] chart-gradient-blue rounded-lg border-b border-l border-[#262626]">
{/* Simulated Neon Line Chart */}
<svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
<defs>
<linearGradient id="lineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" ></stop>
<stop offset="100%" ></stop>
</linearGradient>
</defs>
<path d="M0,250 Q100,200 200,220 T400,100 T600,150 T800,80 L1000,120 V300 H0 Z" fill="url(#lineGrad)"></path>
<path className="electric-glow" d="M0,250 Q100,200 200,220 T400,100 T600,150 T800,80 L1000,120" fill="none" stroke="#3b82f6" stroke-width="3"></path>
{/* Data Points */}
<circle className="animate-pulse" cx="400" cy="100" fill="#3b82f6" r="4"></circle>
<circle className="animate-pulse" cx="800" cy="80" fill="#3b82f6" r="4"></circle>
</svg>
{/* Time Markers */}
<div className="absolute bottom-[-24px] w-full flex justify-between px-xs">
<span className="text-[10px] text-outline uppercase">08:00</span>
<span className="text-[10px] text-outline uppercase">10:00</span>
<span className="text-[10px] text-outline uppercase">12:00</span>
<span className="text-[10px] text-outline uppercase">14:00</span>
<span className="text-[10px] text-outline uppercase">16:00</span>
<span className="text-[10px] text-outline uppercase">18:00</span>
</div>
</div>
</div>
</section>
{/* Recent Insight Triggers Grid */}
<section className="ultra-dark-card rounded-xl overflow-hidden">
<div className="px-md py-sm border-b border-[#262626] flex justify-between items-center">
<h3 className="font-label-md text-on-surface">Recent Insight Triggers</h3>
<button className="text-primary text-[12px] font-label-md hover:underline">View All Logs</button>
</div>
<div className="divide-y divide-[#262626]">
{/* Item 1 */}
<div className="px-md py-sm flex items-center justify-between hover:bg-surface-container-low transition-colors group">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined">warning</span>
</div>
<div>
<p className="font-body-sm text-on-surface font-medium">Unusual Crowd Density</p>
<p className="text-[12px] text-on-surface-variant">Zone B-4 â¢ Entrance North</p>
</div>
</div>
<div className="text-right">
<p className="font-code-sm text-on-surface">14:22:01</p>
<p className="text-[10px] text-error uppercase font-bold">High Priority</p>
</div>
</div>
{/* Item 2 */}
<div className="px-md py-sm flex items-center justify-between hover:bg-surface-container-low transition-colors group">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined">sync_alt</span>
</div>
<div>
<p className="font-body-sm text-on-surface font-medium">Maintenance Cycle Predicted</p>
<p className="text-[12px] text-on-surface-variant">Elevator Shaft 2 â¢ Main Hub</p>
</div>
</div>
<div className="text-right">
<p className="font-code-sm text-on-surface">13:45:12</p>
<p className="text-[10px] text-primary uppercase font-bold">Scheduled</p>
</div>
</div>
{/* Item 3 */}
<div className="px-md py-sm flex items-center justify-between hover:bg-surface-container-low transition-colors group">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant">
<span className="material-symbols-outlined">verified</span>
</div>
<div>
<p className="font-body-sm text-on-surface font-medium">Shift Handover Success</p>
<p className="text-[12px] text-on-surface-variant">Loading Dock 1 â¢ Warehouse</p>
</div>
</div>
<div className="text-right">
<p className="font-code-sm text-on-surface">12:10:55</p>
<p className="text-[10px] text-on-surface-variant uppercase font-bold">Operational</p>
</div>
</div>
</div>
</section>
</main>


    </>
  );
}
