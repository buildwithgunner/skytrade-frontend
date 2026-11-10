import React, { useEffect, useRef, useState } from 'react';

const defaultBrand = {
  heroTitle: 'Skytrade Capital',
  eyebrow: 'Investment broker',
  summary:
    'Skytrade helps investors access global markets with professional brokerage tools, live analytics, portfolio reporting, and support for disciplined long-term wealth building.',
};

const defaultFeatures = [
  {
    title: 'Brokerage access',
    text: 'Trade major global markets from one account with clear pricing and account-level reporting.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    title: 'Portfolio oversight',
    text: 'Track holdings, deposits, account movements, and investment performance with a clean dashboard.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: 'Investor support',
    text: 'Get broker support for onboarding, funding, account security, and platform workflows.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Compliance ready',
    text: 'Full KYC, AML, and suitability profiling built into the onboarding pipeline from day one.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: 'Real-time analytics',
    text: 'Live market feeds, portfolio snapshots, and execution data visualised in your workspace.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    title: 'Multi-asset trading',
    text: 'Equities, forex, commodities, ETFs, and digital assets from a single unified brokerage account.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
];

const defaultTestimonials = [
  {
    name: 'Misha Grant',
    role: 'Private investor',
    text: 'Skytrade made it easier to compare markets, follow my portfolio, and move quickly when opportunities opened up. The platform feels focused and professional.',
    amount: '$480K',
    label: 'Portfolio managed',
  },
  {
    name: 'Nazar Buch',
    role: 'Business owner',
    text: 'I wanted a broker that could support long-term investing and active trading in one place. Skytrade gives me clear reporting, useful market insight, and responsive support.',
    amount: '+24%',
    label: 'YTD return',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Create your account',
    text: 'Register in minutes. Fill in your basic details and select your preferred investment account type.',
  },
  {
    step: '02',
    title: 'Complete compliance',
    text: 'Pass KYC identity verification and complete the suitability questionnaire required for regulatory compliance.',
  },
  {
    step: '03',
    title: 'Fund your account',
    text: 'Deposit via ACH direct debit, wire transfer, or linked bank account. All transactions are encrypted.',
  },
  {
    step: '04',
    title: 'Start trading',
    text: 'Submit investment requests across equities, forex, commodities and more through your broker workspace.',
  },
];

const marketHighlights = [
  { pair: 'AAPL', change: '+2.34%', price: '$213.40', positive: true },
  { pair: 'EUR/USD', change: '+0.18%', price: '1.0842', positive: true },
  { pair: 'GOLD', change: '-0.52%', price: '$2,318', positive: false },
  { pair: 'BTC', change: '+4.12%', price: '$67,420', positive: true },
  { pair: 'S&P 500', change: '+0.89%', price: '5,412', positive: true },
  { pair: 'TSLA', change: '-1.23%', price: '$176.20', positive: false },
];

const trustStats = [
  { value: '$734M+', label: 'Assets under management' },
  { value: '12,400+', label: 'Active investors' },
  { value: '53', label: 'Global markets' },
  { value: '4.8s', label: 'Avg execution speed' },
];

/* ── Animated ticker bar ── */
function TickerBar() {
  const items = [...marketHighlights, ...marketHighlights];
  return (
    <div className="relative overflow-hidden border-y border-cyan-500/20 bg-[#050e1a]/80 backdrop-blur-sm py-3">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{ animation: 'ticker 30s linear infinite' }}
      >
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-bold">
            <span className="text-white/60">{m.pair}</span>
            <span className="text-white font-black">{m.price}</span>
            <span className={m.positive ? 'text-emerald-400' : 'text-rose-400'}>{m.change}</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

export default function LandingPage({ content, onNavigate }) {
  const brand = content?.brand || defaultBrand;
  const features = content?.homeFeatures || defaultFeatures;
  const reviews = content?.testimonials || defaultTestimonials;

  return (
    <main
      className="relative w-full overflow-hidden text-white"
      style={{
        backgroundImage: 'url(/auth-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Global dark overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#050e1a]/88 via-[#060f1d]/82 to-[#050e1a]/95 pointer-events-none z-0" />

      {/* ─── 1. TICKER BAR ─── */}
      <div className="relative z-10 pt-20">
        <TickerBar />
      </div>

      {/* ─── 2. HERO SECTION ─── */}
      <section className="relative z-10 min-h-[85vh] flex items-center px-5 py-20 sm:px-8 lg:px-12 overflow-hidden">
        {/* Glow effects */}
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute right-1/4 bottom-1/3 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(6,182,212,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,.4)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-[.2em] text-cyan-400">
                  {brand.eyebrow}
                </span>
              </div>
              <h1 className="text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl">
                <span className="text-white">{brand.heroTitle}</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Where Capital Grows
                </span>
              </h1>
              <p className="mt-6 text-base font-medium leading-relaxed text-white/70 sm:text-lg max-w-xl">
                {brand.summary}
              </p>

              {/* CTA buttons */}
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('user-signup')}
                  className="rounded-sm bg-cyan-500 hover:bg-cyan-400 text-white font-extrabold text-sm px-8 py-4 shadow-[0_0_40px_rgba(6,182,212,0.35)] transition-all hover:shadow-[0_0_60px_rgba(6,182,212,0.45)] hover:-translate-y-0.5 cursor-pointer"
                >
                  Open Free Account
                </button>
                <button
                  onClick={() => onNavigate('platform')}
                  className="rounded-sm border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-extrabold text-sm px-8 py-4 transition cursor-pointer"
                >
                  View Platform →
                </button>
              </div>

              {/* Trust micro-badges */}
              <div className="mt-8 flex flex-wrap gap-6 text-xs text-white/50 font-medium">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Regulated & Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  256-bit Encryption
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  24/5 Market Desk
                </span>
              </div>
            </div>

            {/* Right: Dashboard Mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px]">
                {/* Laptop frame */}
                <div className="relative bg-[#0d1f35] rounded-t-2xl p-3 border border-cyan-500/20 shadow-[0_0_80px_rgba(6,182,212,0.15)]">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    <div className="flex-1 mx-3 bg-white/5 rounded px-3 py-0.5 text-[9px] text-white/30 font-mono">
                      app.skytradelimited.com/platform
                    </div>
                  </div>

                  {/* Dashboard screen */}
                  <div className="aspect-[16/10] bg-[#060f1d] rounded-lg overflow-hidden relative border border-white/5">
                    {/* Top nav */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm bg-cyan-500/60" />
                        <span className="text-[8px] font-black text-white/70">SKYTRADE</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[7px] text-white/40">Portfolio</span>
                        <span className="text-[7px] text-cyan-400 border-b border-cyan-400">Overview</span>
                        <span className="text-[7px] text-white/40">Requests</span>
                      </div>
                      <div className="w-12 h-3 bg-cyan-500/20 rounded-full border border-cyan-500/40" />
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-1.5 px-3 pt-2">
                      {[
                        { l: 'Portfolio', v: '$124,367', c: 'text-white' },
                        { l: 'YTD Return', v: '+18.2%', c: 'text-emerald-400' },
                        { l: 'Daily P&L', v: '-$313', c: 'text-rose-400' },
                      ].map((s) => (
                        <div key={s.l} className="bg-white/[.03] border border-white/5 rounded p-1.5">
                          <p className="text-[6px] text-white/40 uppercase font-bold">{s.l}</p>
                          <p className={`text-[10px] font-black ${s.c}`}>{s.v}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chart */}
                    <div className="px-3 pt-2 flex-1">
                      <div className="bg-white/[.02] border border-white/5 rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[6px] text-white/40 font-bold uppercase">Portfolio Performance</span>
                          <span className="text-[6px] text-cyan-400 font-bold">Live</span>
                        </div>
                        <svg className="w-full h-16" viewBox="0 0 300 60">
                          <defs>
                            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d="M0,50 L25,45 L50,48 L75,35 L100,38 L125,22 L150,28 L175,12 L200,18 L225,8 L250,14 L275,5 L300,3" fill="none" stroke="#06b6d4" strokeWidth="2" />
                          <path d="M0,50 L25,45 L50,48 L75,35 L100,38 L125,22 L150,28 L175,12 L200,18 L225,8 L250,14 L275,5 L300,3 L300,60 L0,60 Z" fill="url(#pg)" />
                          <circle cx="300" cy="3" r="3" fill="#06b6d4" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom holdings */}
                    <div className="px-3 pt-1.5 pb-2 space-y-1">
                      {[
                        { a: 'Equities', v: '$62,450', p: '+18.2%' },
                        { a: 'Forex', v: '$34,200', p: '+9.4%' },
                        { a: 'ETFs', v: '$27,717', p: '+5.1%' },
                      ].map((h) => (
                        <div key={h.a} className="flex items-center justify-between">
                          <span className="text-[7px] text-white/50">{h.a}</span>
                          <div className="flex-1 mx-2 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-cyan-400/50" style={{ width: h.a === 'Equities' ? '52%' : h.a === 'Forex' ? '28%' : '22%' }} />
                          </div>
                          <span className="text-[7px] text-white font-bold">{h.v}</span>
                          <span className="text-[7px] text-emerald-400 font-bold ml-1">{h.p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Laptop base */}
                <div className="h-3 bg-[#0d1f35] rounded-b-2xl border-x border-b border-cyan-500/20 flex items-center justify-center">
                  <div className="w-16 h-1.5 bg-white/5 rounded-full" />
                </div>

                {/* Floating mobile overlay */}
                <div className="absolute -left-8 -bottom-6 w-28 bg-[#0d1f35] rounded-2xl p-2 border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.15)] hidden sm:block">
                  <div className="aspect-[9/18] bg-[#060f1d] rounded-xl overflow-hidden p-2 flex flex-col gap-2 border border-white/5">
                    <div className="w-8 h-1.5 bg-black/40 rounded-full mx-auto" />
                    <div className="text-center">
                      <p className="text-[6px] uppercase font-bold text-cyan-400">Portfolio</p>
                      <p className="font-black text-white text-[11px] mt-0.5">$124,367</p>
                      <p className="text-emerald-400 text-[8px] font-bold">+18.2%</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {['AAPL', 'EUR/USD', 'GOLD'].map((s) => (
                        <div key={s} className="flex justify-between text-[6px]">
                          <span className="text-white/50">{s}</span>
                          <span className="text-emerald-400 font-bold">+{(Math.random() * 5 + 1).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating notification card */}
                <div className="absolute -right-4 top-8 bg-[#0d1f35]/90 backdrop-blur-sm border border-cyan-500/25 rounded-sm px-3 py-2 text-xs shadow-xl hidden lg:block">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white/60 text-[10px]">Request approved</span>
                  </div>
                  <p className="text-white font-black text-sm mt-0.5">+$25,000 <span className="text-white/40 font-normal text-[10px]">Equities</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. TRUST STATS BAR ─── */}
      <section className="relative z-10 border-y border-cyan-500/15 bg-[#050e1a]/70 backdrop-blur-sm py-10 px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
          {trustStats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-black text-white sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-cyan-400/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. FEATURES GRID SECTION ─── */}
      <section className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] items-start">

            {/* Left Column: Section heading + visual panel */}
            <div className="sticky top-24">
              <div className="relative bg-[#050e1a]/60 border border-cyan-500/20 p-8 rounded-sm backdrop-blur-sm overflow-hidden min-h-[420px] flex flex-col justify-between">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(6,182,212,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,.3)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan-400">Skytrade Workspace</p>
                  <h2 className="mt-4 text-4xl font-black text-white leading-tight">
                    Our features<br />on offer
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">
                    Everything you need to invest, track, and grow your portfolio — all in one regulated broker workspace.
                  </p>
                </div>
                {/* Mini chart visual */}
                <div className="relative z-10 mt-8 bg-black/40 border border-cyan-500/15 p-4 rounded-sm">
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400/70" />
                    <span className="w-2 h-2 rounded-full bg-blue-400/50" />
                    <span className="w-2 h-2 rounded-full bg-slate-500/30" />
                  </div>
                  <svg className="w-full h-20" viewBox="0 0 220 80">
                    <defs>
                      <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,65 Q35,30 70,50 T140,20 T220,10" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
                    <path d="M0,65 Q35,30 70,50 T140,20 T220,10 L220,80 L0,80 Z" fill="url(#fg)" />
                    <circle cx="220" cy="10" r="4" fill="#06b6d4" />
                  </svg>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[8px] text-white/40">Portfolio growth</span>
                    <span className="text-[9px] text-emerald-400 font-black">+18.2% YTD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Feature cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="border border-cyan-500/15 bg-[#050e1a]/50 backdrop-blur-sm p-6 rounded-sm hover:border-cyan-400/35 hover:bg-cyan-900/10 transition-all group"
                >
                  <div className="w-11 h-11 bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center rounded-sm text-cyan-400 mb-4 group-hover:bg-cyan-500/25 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-extrabold text-base text-white">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/55">{feature.text}</p>
                </div>
              ))}

              {/* CTA card */}
              <div className="sm:col-span-2 border border-cyan-500/20 bg-gradient-to-br from-cyan-900/20 to-blue-900/10 p-6 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white">Get started with our trading workspace today!</h4>
                  <p className="text-xs text-white/50 mt-0.5">Submit your onboarding profile and set up compliance in minutes.</p>
                </div>
                <button
                  onClick={() => onNavigate('user-signup')}
                  className="flex-shrink-0 rounded-sm bg-cyan-500 hover:bg-cyan-400 text-white font-extrabold text-xs px-6 py-3 transition shadow-[0_0_24px_rgba(6,182,212,0.25)] cursor-pointer"
                >
                  Start Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. HOW IT WORKS SECTION ─── */}
      <section className="relative z-10 px-5 py-24 sm:px-8 lg:px-12 border-y border-cyan-500/10 bg-[#050e1a]/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-cyan-400 mb-3">Simple process</p>
            <h2 className="text-4xl font-black text-white">How it works</h2>
            <p className="mt-4 text-base text-white/55 max-w-lg mx-auto">
              From registration to your first trade, Skytrade guides every step of the journey.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {i < howItWorks.length - 1 && (
                  <div className="absolute top-8 left-full w-full h-px bg-gradient-to-r from-cyan-500/40 to-transparent hidden lg:block z-0" />
                )}
                <div className="relative z-10 border border-cyan-500/15 bg-[#050e1a]/50 backdrop-blur-sm p-6 rounded-sm h-full">
                  <div className="text-4xl font-black text-cyan-500/25 mb-3">{step.step}</div>
                  <h3 className="text-base font-extrabold text-white mb-2">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-white/55">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. MARKET HIGHLIGHTS ─── */}
      <section className="relative z-10 px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-cyan-400 mb-2">Market access</p>
              <h2 className="text-3xl font-black text-white">Trade across global markets</h2>
            </div>
            <button onClick={() => onNavigate('performance')} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition">
              View Performance →
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {marketHighlights.map((m) => (
              <div
                key={m.pair}
                className="border border-cyan-500/15 bg-[#050e1a]/50 backdrop-blur-sm p-5 rounded-sm hover:border-cyan-400/30 hover:bg-cyan-900/10 transition-all flex items-center justify-between"
              >
                <div>
                  <p className="font-black text-white text-lg">{m.pair}</p>
                  <p className="text-xs text-white/40 mt-0.5">Live market feed</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-white">{m.price}</p>
                  <p className={`text-sm font-extrabold mt-0.5 ${m.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {m.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. TESTIMONIALS SECTION ─── */}
      <section className="relative z-10 px-5 py-24 sm:px-8 lg:px-12 border-y border-cyan-500/10 bg-[#050e1a]/70 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-cyan-400 mb-2">Testimonials</p>
          <h2 className="text-4xl font-black text-white mb-10">What our clients say</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="border border-cyan-500/15 bg-[#050e1a]/60 backdrop-blur-sm p-8 rounded-sm flex flex-col justify-between hover:border-cyan-400/30 transition-colors"
              >
                {/* Quote icon */}
                <svg className="w-8 h-8 text-cyan-500/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-sm italic leading-relaxed text-white/75 flex-1">
                  "{review.text}"
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-base">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{review.name}</p>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400/70">{review.role}</p>
                    </div>
                  </div>
                  {review.amount && (
                    <div className="text-right border border-cyan-500/20 bg-cyan-900/15 px-3 py-1.5 rounded-sm">
                      <p className="text-base font-black text-white">{review.amount}</p>
                      <p className="text-[9px] text-white/45 uppercase tracking-wider">{review.label}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. LEAD CAPTURE SECTION ─── */}
      <section className="relative z-10 px-5 py-28 sm:px-8 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.07),transparent_40%)] pointer-events-none" />
        <div className="mx-auto max-w-5xl relative">
          <div className="border border-cyan-500/20 bg-[#050e1a]/70 backdrop-blur-xl p-8 sm:p-12 rounded-sm grid gap-10 md:grid-cols-2 items-center">
            {/* Left: Text */}
            <div className="space-y-4">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-cyan-400">Get started today</p>
              <h3 className="text-3xl font-black text-white leading-tight">
                Financial freedom at your fingertips
              </h3>
              <p className="text-sm leading-relaxed text-white/60">
                You are one step closer to setting up your regulated investment workspace. By signing up, Skytrade will guide you through onboarding and compliance setup.
              </p>
              <p className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
                Access custom brokerage solutions today!
              </p>
              {/* Feature bullets */}
              <ul className="space-y-2 text-xs text-white/55">
                {['No hidden fees', 'Full KYC compliance', 'Dedicated broker support', 'Start in under 5 minutes'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); onNavigate('user-signup'); }}
              className="space-y-4"
            >
              <div>
                <input
                  required
                  type="text"
                  placeholder="Full name"
                  className="w-full border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400/60 transition rounded-sm placeholder:text-white/35"
                />
              </div>
              <div>
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  className="w-full border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400/60 transition rounded-sm placeholder:text-white/35"
                />
              </div>
              <div>
                <select
                  required
                  defaultValue=""
                  className="w-full border border-white/10 bg-[#0d1f35] px-4 py-3.5 text-sm text-white/70 outline-none focus:border-cyan-400/60 transition rounded-sm cursor-pointer"
                >
                  <option value="" disabled style={{background:'#0d1f35'}}>Select account type</option>
                  <option value="individual" style={{background:'#0d1f35', color:'#fff'}}>Individual brokerage</option>
                  <option value="joint" style={{background:'#0d1f35', color:'#fff'}}>Joint investment account</option>
                  <option value="business" style={{background:'#0d1f35', color:'#fff'}}>Business investment account</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-extrabold text-sm py-4 transition shadow-[0_0_30px_rgba(6,182,212,0.25)] rounded-sm cursor-pointer"
              >
                Start Onboarding →
              </button>
              <p className="text-[10px] text-white/35 text-center">
                By signing up you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </section>

    </main>
  );
}
