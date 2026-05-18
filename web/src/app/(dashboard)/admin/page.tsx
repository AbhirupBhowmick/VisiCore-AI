import React from 'react';

export default function Page() {
  return (
    <>
      
{/* SideNavBar Shell */}
<nav className="fixed left-0 top-0 h-full w-[260px] bg-surface dark:bg-surface border-r border-outline-variant dark:border-outline-variant flex flex-col p-md space-y-xs z-50">
<div className="mb-lg">
<h1 className="font-headline-md text-headline-md font-semibold text-primary dark:text-primary">AI Vision Admin</h1>
<p className="font-label-md text-label-md text-on-surface-variant opacity-60">v2.4.0-stable</p>
</div>
<div className="flex-1 space-y-xs">
<a className="flex items-center gap-sm p-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors duration-200 cursor-pointer active:scale-95 rounded-xl" href="#">
<span className="material-symbols-outlined">group</span>
<span className="font-label-md text-label-md">Users</span>
</a>
<a className="flex items-center gap-sm p-sm bg-secondary-container text-on-secondary-container rounded-xl cursor-pointer active:scale-95" href="#">
<span className="material-symbols-outlined">queue_play_next</span>
<span className="font-label-md text-label-md">Job Queue</span>
</a>
<a className="flex items-center gap-sm p-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors duration-200 cursor-pointer active:scale-95 rounded-xl" href="#">
<span className="material-symbols-outlined">terminal</span>
<span className="font-label-md text-label-md">Logs</span>
</a>
<a className="flex items-center gap-sm p-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors duration-200 cursor-pointer active:scale-95 rounded-xl" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-label-md text-label-md">Settings</span>
</a>
</div>
<button className="w-full bg-[#3B82F6] text-white font-label-md py-sm rounded-lg glow-blue active:scale-95 transition-all mb-md">
            New Analysis
        </button>
<div className="pt-md border-t border-outline-variant space-y-xs">
<a className="flex items-center gap-sm p-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" href="#">
<span className="material-symbols-outlined">description</span>
<span>Documentation</span>
</a>
<a className="flex items-center gap-sm p-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" href="#">
<span className="material-symbols-outlined">help</span>
<span>Support</span>
</a>
</div>
</nav>
{/* TopNavBar Shell */}
<header className="fixed top-0 right-0 w-[calc(100%-260px)] z-40 bg-surface-container-low dark:bg-surface-container-low border-b border-outline-variant dark:border-outline-variant flex justify-between items-center h-16 px-margin">
<div className="flex items-center gap-lg flex-1">
<span className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">Control Center</span>
<div className="relative w-full max-w-md focus-within:ring-1 focus-within:ring-primary rounded-lg">
<span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input className="w-full bg-surface-container-lowest border-none pl-10 pr-sm py-xs text-body-sm rounded-lg focus:ring-0 text-on-surface placeholder:text-outline-variant" placeholder="Search nodes, jobs, or logs..." type="text"/>
</div>
</div>
<div className="flex items-center gap-md">
<div className="flex items-center gap-xs text-primary font-body-sm">
<span className="material-symbols-outlined text-[18px]">check_circle</span>
<span>System Healthy</span>
</div>
<div className="flex items-center gap-sm text-on-surface-variant">
<span className="material-symbols-outlined hover:text-on-surface cursor-pointer transition-opacity">notifications</span>
<span className="material-symbols-outlined hover:text-on-surface cursor-pointer transition-opacity">cloud_done</span>
<span className="material-symbols-outlined hover:text-on-surface cursor-pointer transition-opacity">account_circle</span>
</div>
</div>
</header>
{/* Main Content Canvas */}
<main className="ml-[260px] mt-16 p-margin h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
{/* System Health Section (Bento Style) */}
<section className="mb-xl">
<div className="flex items-center justify-between mb-md">
<h2 className="font-headline-lg text-headline-lg text-on-surface">System Health</h2>
<span className="font-code-sm text-code-sm text-outline-variant uppercase tracking-widest">Real-time Telemetry</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
{/* CPU Graph */}
<div className="bg-surface-container border border-outline-variant p-md rounded-xl">
<div className="flex justify-between items-start mb-sm">
<div>
<p className="font-label-md text-label-md text-on-surface-variant">CPU Usage</p>
<h3 className="font-headline-md text-headline-md font-bold">42.8%</h3>
</div>
<span className="material-symbols-outlined text-primary glow-blue">memory</span>
</div>
<div className="h-16 flex items-end gap-[2px]">
{/* Simple high-density bar representation for a "graph" look */}
<div className="w-full bg-[#3B82F6] h-[30%] opacity-40"></div>
<div className="w-full bg-[#3B82F6] h-[45%] opacity-50"></div>
<div className="w-full bg-[#3B82F6] h-[60%] opacity-60"></div>
<div className="w-full bg-[#3B82F6] h-[40%] opacity-70"></div>
<div className="w-full bg-[#3B82F6] h-[35%] opacity-80"></div>
<div className="w-full bg-[#3B82F6] h-[50%] opacity-90"></div>
<div className="w-full bg-[#3B82F6] h-[42%] health-gradient"></div>
</div>
<div className="mt-sm flex justify-between font-code-sm text-code-sm text-outline-variant">
<span>-15m</span>
<span>Now</span>
</div>
</div>
{/* Memory Graph */}
<div className="bg-surface-container border border-outline-variant p-md rounded-xl">
<div className="flex justify-between items-start mb-sm">
<div>
<p className="font-label-md text-label-md text-on-surface-variant">Memory Load</p>
<h3 className="font-headline-md text-headline-md font-bold">12.4 GB</h3>
</div>
<span className="material-symbols-outlined text-primary glow-blue">database</span>
</div>
<div className="h-16 flex items-end gap-[2px]">
<div className="w-full bg-[#3B82F6] h-[70%] opacity-40"></div>
<div className="w-full bg-[#3B82F6] h-[72%] opacity-50"></div>
<div className="w-full bg-[#3B82F6] h-[68%] opacity-60"></div>
<div className="w-full bg-[#3B82F6] h-[75%] opacity-70"></div>
<div className="w-full bg-[#3B82F6] h-[80%] opacity-80"></div>
<div className="w-full bg-[#3B82F6] h-[78%] opacity-90"></div>
<div className="w-full bg-[#3B82F6] h-[75%] health-gradient"></div>
</div>
<div className="mt-sm flex justify-between font-code-sm text-code-sm text-outline-variant">
<span>-15m</span>
<span>Now</span>
</div>
</div>
{/* DB Health Graph */}
<div className="bg-surface-container border border-outline-variant p-md rounded-xl">
<div className="flex justify-between items-start mb-sm">
<div>
<p className="font-label-md text-label-md text-on-surface-variant">DB Health</p>
<h3 className="font-headline-md text-headline-md font-bold">99.9%</h3>
</div>
<span className="material-symbols-outlined text-primary glow-blue">shield</span>
</div>
<div className="h-16 flex items-end gap-[2px]">
<div className="w-full bg-[#3B82F6] h-[95%] opacity-40"></div>
<div className="w-full bg-[#3B82F6] h-[98%] opacity-50"></div>
<div className="w-full bg-[#3B82F6] h-[99%] opacity-60"></div>
<div className="w-full bg-[#3B82F6] h-[97%] opacity-70"></div>
<div className="w-full bg-[#3B82F6] h-[99%] opacity-80"></div>
<div className="w-full bg-[#3B82F6] h-[99.5%] opacity-90"></div>
<div className="w-full bg-[#3B82F6] h-[99.9%] health-gradient"></div>
</div>
<div className="mt-sm flex justify-between font-code-sm text-code-sm text-outline-variant">
<span>-15m</span>
<span>Now</span>
</div>
</div>
</div>
</section>
{/* Failed AI Processing Jobs Section */}
<section>
<div className="flex items-center justify-between mb-md">
<h2 className="font-headline-lg text-headline-lg text-on-surface">Failed AI Processing Jobs</h2>
<div className="flex gap-sm">
<button className="bg-surface-container-highest border border-outline-variant px-sm py-xs rounded-lg text-body-sm font-medium hover:bg-outline-variant transition-colors">Export CSV</button>
<button className="bg-[#3B82F6] text-white px-sm py-xs rounded-lg text-body-sm font-medium glow-blue active:scale-95 transition-all">Retry All</button>
</div>
</div>
<div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-high text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
<tr>
<th className="px-md py-sm border-b border-outline-variant">Job ID</th>
<th className="px-md py-sm border-b border-outline-variant">User</th>
<th className="px-md py-sm border-b border-outline-variant">Error Reason</th>
<th className="px-md py-sm border-b border-outline-variant">Timestamp</th>
<th className="px-md py-sm border-b border-outline-variant text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
{/* Row 1 */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-md py-md font-code-sm text-code-sm text-primary">#JOB-8842-AX</td>
<td className="px-md py-md text-body-sm font-medium">alec_vogel_ai</td>
<td className="px-md py-md">
<span className="bg-error-container/20 text-error border border-error/30 px-xs py-[2px] rounded text-[11px] font-bold uppercase">OOM Error</span>
</td>
<td className="px-md py-md text-on-surface-variant text-body-sm">2 min ago</td>
<td className="px-md py-md text-right">
<button className="text-primary font-label-md hover:underline active:scale-95 transition-transform flex items-center justify-end gap-xs w-full">
<span className="material-symbols-outlined text-sm">refresh</span>
                                    Retry
                                </button>
</td>
</tr>
{/* Row 2 */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-md py-md font-code-sm text-code-sm text-primary">#JOB-9102-BQ</td>
<td className="px-md py-md text-body-sm font-medium">vision_lead_01</td>
<td className="px-md py-md">
<span className="bg-error-container/20 text-error border border-error/30 px-xs py-[2px] rounded text-[11px] font-bold uppercase">Timeout</span>
</td>
<td className="px-md py-md text-on-surface-variant text-body-sm">14 min ago</td>
<td className="px-md py-md text-right">
<button className="text-primary font-label-md hover:underline active:scale-95 transition-transform flex items-center justify-end gap-xs w-full">
<span className="material-symbols-outlined text-sm">refresh</span>
                                    Retry
                                </button>
</td>
</tr>
{/* Row 3 */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-md py-md font-code-sm text-code-sm text-primary">#JOB-0021-CZ</td>
<td className="px-md py-md text-body-sm font-medium">root_admin</td>
<td className="px-md py-md">
<span className="bg-error-container/20 text-error border border-error/30 px-xs py-[2px] rounded text-[11px] font-bold uppercase">CUDA Error</span>
</td>
<td className="px-md py-md text-on-surface-variant text-body-sm">45 min ago</td>
<td className="px-md py-md text-right">
<button className="text-primary font-label-md hover:underline active:scale-95 transition-transform flex items-center justify-end gap-xs w-full">
<span className="material-symbols-outlined text-sm">refresh</span>
                                    Retry
                                </button>
</td>
</tr>
{/* Row 4 */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-md py-md font-code-sm text-code-sm text-primary">#JOB-1193-DL</td>
<td className="px-md py-md text-body-sm font-medium">dev_sandbox_04</td>
<td className="px-md py-md">
<span className="bg-error-container/20 text-error border border-error/30 px-xs py-[2px] rounded text-[11px] font-bold uppercase">OOM Error</span>
</td>
<td className="px-md py-md text-on-surface-variant text-body-sm">1 hour ago</td>
<td className="px-md py-md text-right">
<button className="text-primary font-label-md hover:underline active:scale-95 transition-transform flex items-center justify-end gap-xs w-full">
<span className="material-symbols-outlined text-sm">refresh</span>
                                    Retry
                                </button>
</td>
</tr>
{/* Row 5 */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-md py-md font-code-sm text-code-sm text-primary">#JOB-5521-EP</td>
<td className="px-md py-md text-body-sm font-medium">enterprise_user_9</td>
<td className="px-md py-md">
<span className="bg-error-container/20 text-error border border-error/30 px-xs py-[2px] rounded text-[11px] font-bold uppercase">Model Loading</span>
</td>
<td className="px-md py-md text-on-surface-variant text-body-sm">2 hours ago</td>
<td className="px-md py-md text-right">
<button className="text-primary font-label-md hover:underline active:scale-95 transition-transform flex items-center justify-end gap-xs w-full">
<span className="material-symbols-outlined text-sm">refresh</span>
                                    Retry
                                </button>
</td>
</tr>
</tbody>
</table>
<div className="px-md py-sm bg-surface-container-low border-t border-outline-variant flex justify-between items-center text-body-sm">
<span className="text-on-surface-variant">Showing 5 of 142 failed jobs</span>
<div className="flex gap-xs">
<button className="p-xs hover:bg-surface-container-highest rounded transition-colors text-on-surface-variant"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
<button className="p-xs hover:bg-surface-container-highest rounded transition-colors text-on-surface-variant"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
</div>
</div>
</div>
</section>
{/* Decorative UI Element: Background Texture */}
<div className="fixed bottom-0 right-0 p-lg pointer-events-none opacity-5">
<h1 className="text-[120px] font-bold text-on-surface tracking-tighter leading-none">VISICORE</h1>
</div>
</main>


    </>
  );
}
