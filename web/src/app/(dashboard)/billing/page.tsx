import React from 'react';

export default function Page() {
  return (
    <>
      
{/* SideNavBar */}
<aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant flex flex-col py-md px-sm z-50">
<div className="mb-xl px-xs">
<div className="flex items-center gap-xs">
<div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary text-[20px]" >analytics</span>
</div>
<div>
<h1 className="font-headline-md text-headline-md font-bold text-on-surface">VisiCore AI</h1>
<p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">AI Video Analysis</p>
</div>
</div>
</div>
<nav className="flex-1 space-y-base">
<a className="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 group" href="#">
<span className="material-symbols-outlined group-hover:text-primary">dashboard</span>
<span className="font-label-md text-label-md">Dashboard</span>
</a>
<a className="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 group" href="#">
<span className="material-symbols-outlined group-hover:text-primary">video_library</span>
<span className="font-label-md text-label-md">Library</span>
</a>
<a className="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 group" href="#">
<span className="material-symbols-outlined group-hover:text-primary">insights</span>
<span className="font-label-md text-label-md">Insights</span>
</a>
<a className="flex items-center gap-sm px-sm py-xs rounded text-primary bg-secondary-container/10 border-l-2 border-primary transition-colors duration-200" href="#">
<span className="material-symbols-outlined" >payments</span>
<span className="font-label-md text-label-md">Billing</span>
</a>
</nav>
<div className="mt-auto space-y-base border-t border-outline-variant pt-md">
<a className="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-label-md text-label-md">Settings</span>
</a>
<a className="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200" href="#">
<span className="material-symbols-outlined">help</span>
<span className="font-label-md text-label-md">Support</span>
</a>
</div>
</aside>
{/* TopAppBar */}
<header className="fixed top-0 right-0 w-[calc(100%-260px)] h-xl bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-lg z-40">
<div className="flex items-center flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
<input className="w-full bg-surface-container-low border border-outline-variant rounded-full py-base pl-xl pr-md text-body-sm focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Search invoices or plans..." type="text"/>
</div>
</div>
<div className="flex items-center gap-md">
<button className="bg-primary text-on-primary px-md py-base rounded-full font-label-md flex items-center gap-xs hover-glow transition-all active:scale-95">
<span className="material-symbols-outlined text-[18px]">upload</span>
                Upload Video
            </button>
<div className="flex items-center gap-sm border-l border-outline-variant pl-md">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">notifications</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="Close-up professional portrait of a tech executive with a modern, minimalist background. The lighting is dramatic and low-key, emphasizing a sophisticated and authoritative presence. The overall aesthetic is ultra-dark and premium, matching the VisiCore AI brand identity with deep blacks and subtle highlights." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoFI71ZozaxkwkYjhWQsiY5tfAUi0nTaydZ64-iGNY9HFEmhf72XX3OlM8zQhfVeVleMysHhANXfsXHC-q-cx411UyuxPz0XlQOlX0SYSU3ftrqXhDJ8e4MVnu8-lScUwK4QkscLiTqrexCD0NonOfs9K38GUwVuY8dEQ16k5qL1zcKk9J8XrLN3yhXNAc1swEmtVMSXrGylgoPnxQ5jiff1AuC29ZfZ3tWA9qxJcmdu1MXhHOi26QF3WUDkb39t6_lqwAIVBl5Dk"/>
</div>
</div>
</div>
</header>
{/* Main Content */}
<main className="ml-[260px] pt-xl min-h-screen px-lg pb-xl">
<div className="max-w-7xl mx-auto space-y-lg mt-md">
{/* Sleek Banner */}
<section className="ultra-dark-card rounded-xl p-lg relative overflow-hidden group">
<div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
<div className="flex flex-col md:flex-row md:items-center justify-between gap-md relative z-10">
<div className="flex items-center gap-md">
<div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[32px]">verified</span>
</div>
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Current Plan: Pro (Annual)</h2>
<p className="text-on-surface-variant font-body-md">Your next renewal is on <span className="text-on-surface font-semibold">November 12, 2024</span>.</p>
</div>
</div>
<div className="flex flex-col items-end">
<span className="bg-primary/20 text-primary px-md py-xs rounded-full font-label-md border border-primary/30 mb-xs">Active</span>
<p className="text-on-surface-variant text-body-sm">Status: Excellent</p>
</div>
</div>
</section>
{/* Pricing Grid */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-md">
{/* Free Plan */}
<div className="ultra-dark-card rounded-xl p-lg flex flex-col">
<div className="mb-lg">
<p className="font-label-md text-on-surface-variant uppercase tracking-widest mb-xs">Individual</p>
<h3 className="font-headline-md text-headline-md text-on-surface mb-md">Free</h3>
<div className="flex items-baseline gap-xs">
<span className="font-display-lg text-display-lg text-on-surface">$0</span>
<span className="text-on-surface-variant font-body-md">/month</span>
</div>
<p className="text-on-surface-variant text-body-sm mt-sm">Basic features for personal video analysis and experiments.</p>
</div>
<div className="space-y-sm flex-1 mb-lg">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant text-[20px]">check_circle</span>
<span className="text-body-sm text-on-surface-variant">5 AI analyses per month</span>
</div>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant text-[20px]">check_circle</span>
<span className="text-body-sm text-on-surface-variant">Standard processing speed</span>
</div>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant text-[20px]">check_circle</span>
<span className="text-body-sm text-on-surface-variant">720p export quality</span>
</div>
<div className="flex items-center gap-sm opacity-30">
<span className="material-symbols-outlined text-[20px]">cancel</span>
<span className="text-body-sm">Custom API integration</span>
</div>
</div>
<button className="w-full border border-outline-variant hover:bg-surface-container-low text-on-surface py-md rounded-lg font-label-md transition-all active:scale-95">
                        Current Plan
                    </button>
</div>
{/* Pro Plan */}
<div className="ultra-dark-card rounded-xl p-lg flex flex-col glow-primary relative">
<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-md py-1 rounded-full shadow-lg">
                        Most Popular
                    </div>
<div className="mb-lg">
<p className="font-label-md text-primary uppercase tracking-widest mb-xs">Professional</p>
<h3 className="font-headline-md text-headline-md text-on-surface mb-md">Pro</h3>
<div className="flex items-baseline gap-xs">
<span className="font-display-lg text-display-lg text-on-surface">$49</span>
<span className="text-on-surface-variant font-body-md">/month</span>
</div>
<p className="text-on-surface-variant text-body-sm mt-sm">Comprehensive tools for creators and small studios.</p>
</div>
<div className="space-y-sm flex-1 mb-lg">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span className="text-body-sm text-on-surface">Unlimited AI analyses</span>
</div>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span className="text-body-sm text-on-surface">Priority GPU processing</span>
</div>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span className="text-body-sm text-on-surface">4K Ultra HD exports</span>
</div>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span className="text-body-sm text-on-surface">Advanced motion tracking</span>
</div>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span className="text-body-sm text-on-surface">Multi-user workspace</span>
</div>
</div>
<button className="w-full bg-primary text-on-primary py-md rounded-lg font-label-md hover-glow transition-all active:scale-95">
                        Manage Subscription
                    </button>
</div>
{/* Enterprise Plan */}
<div className="ultra-dark-card rounded-xl p-lg flex flex-col">
<div className="mb-lg">
<p className="font-label-md text-on-surface-variant uppercase tracking-widest mb-xs">Scalable</p>
<h3 className="font-headline-md text-headline-md text-on-surface mb-md">Enterprise</h3>
<div className="flex items-baseline gap-xs">
<span className="font-display-lg text-display-lg text-on-surface">Custom</span>
</div>
<p className="text-on-surface-variant text-body-sm mt-sm">Tailored solutions for high-volume enterprise operations.</p>
</div>
<div className="space-y-sm flex-1 mb-lg">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant text-[20px]">check_circle</span>
<span className="text-body-sm text-on-surface-variant">Dedicated AI nodes</span>
</div>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant text-[20px]">check_circle</span>
<span className="text-body-sm text-on-surface-variant">Custom API endpoints</span>
</div>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant text-[20px]">check_circle</span>
<span className="text-body-sm text-on-surface-variant">White-glove 24/7 support</span>
</div>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant text-[20px]">check_circle</span>
<span className="text-body-sm text-on-surface-variant">SLA guarantees</span>
</div>
</div>
<button className="w-full border border-outline-variant hover:bg-surface-container-low text-on-surface py-md rounded-lg font-label-md transition-all active:scale-95">
                        Contact Sales
                    </button>
</div>
</section>
{/* Footer: Payment & Invoices */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-md">
{/* Payment Method */}
<div className="ultra-dark-card rounded-xl p-lg">
<div className="flex justify-between items-center mb-lg">
<h3 className="font-headline-md text-headline-md text-on-surface">Payment Method</h3>
<button className="text-primary font-label-md hover:underline">Update</button>
</div>
<div className="bg-surface-container-low border border-outline-variant rounded-xl p-md flex items-center gap-md">
<div className="w-12 h-8 bg-[#1a1a1a] border border-[#262626] rounded flex items-center justify-center">
<span className="text-[10px] font-bold text-on-surface italic">VISA</span>
</div>
<div className="flex-1">
<p className="text-on-surface font-body-md">â¢â¢â¢â¢ â¢â¢â¢â¢ â¢â¢â¢â¢ 4242</p>
<p className="text-on-surface-variant text-body-sm">Expires 08/26</p>
</div>
<div className="text-right">
<span className="material-symbols-outlined text-on-surface-variant">lock</span>
</div>
</div>
<div className="mt-lg flex items-center gap-sm text-on-surface-variant text-body-sm">
<span className="material-symbols-outlined text-[16px]">info</span>
<span>Your billing information is securely encrypted.</span>
</div>
</div>
{/* Invoice History */}
<div className="ultra-dark-card rounded-xl p-lg overflow-hidden">
<div className="flex justify-between items-center mb-lg">
<h3 className="font-headline-md text-headline-md text-on-surface">Invoice History</h3>
<button className="text-on-surface-variant font-label-md hover:text-on-surface transition-colors">View All</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="border-b border-outline-variant">
<th className="py-sm font-label-md text-on-surface-variant">Date</th>
<th className="py-sm font-label-md text-on-surface-variant">Amount</th>
<th className="py-sm font-label-md text-on-surface-variant">Status</th>
<th className="py-sm font-label-md text-on-surface-variant text-right">Invoice</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/30">
<tr>
<td className="py-sm text-body-sm text-on-surface">Oct 12, 2023</td>
<td className="py-sm text-body-sm text-on-surface">$499.00</td>
<td className="py-sm">
<span className="bg-green-500/10 text-green-500 text-[10px] px-sm py-0.5 rounded-full border border-green-500/20">Paid</span>
</td>
<td className="py-sm text-right">
<button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[20px]">download</span></button>
</td>
</tr>
<tr>
<td className="py-sm text-body-sm text-on-surface">Sep 12, 2023</td>
<td className="py-sm text-body-sm text-on-surface">$499.00</td>
<td className="py-sm">
<span className="bg-green-500/10 text-green-500 text-[10px] px-sm py-0.5 rounded-full border border-green-500/20">Paid</span>
</td>
<td className="py-sm text-right">
<button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[20px]">download</span></button>
</td>
</tr>
<tr>
<td className="py-sm text-body-sm text-on-surface">Aug 12, 2023</td>
<td className="py-sm text-body-sm text-on-surface">$499.00</td>
<td className="py-sm">
<span className="bg-green-500/10 text-green-500 text-[10px] px-sm py-0.5 rounded-full border border-green-500/20">Paid</span>
</td>
<td className="py-sm text-right">
<button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[20px]">download</span></button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
{/* Bottom Actions */}
<footer className="pt-lg pb-md flex justify-center border-t border-outline-variant/30">
<a className="text-on-surface-variant font-label-md hover:text-error transition-colors text-sm opacity-60 hover:opacity-100" href="#">Cancel Subscription</a>
</footer>
</div>
</main>


    </>
  );
}
