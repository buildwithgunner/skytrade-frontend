import React, { useState } from 'react';

const defaultBrand = {
  heroTitle: 'Skytrade Capital',
  eyebrow: 'Regulated Investment Broker',
  summary:
    'Skytrade helps investors access global markets with professional brokerage tools, live analytics, portfolio reporting, and support for disciplined long-term wealth building.',
};

const defaultFeatures = [
  {
    title: 'Brokerage access',
    text: 'Trade major global markets from one account with clear pricing and account-level reporting.',
    icon: 'brokerage',
  },
  {
    title: 'Portfolio oversight',
    text: 'Track holdings, deposits, account movements, and investment performance with a clean dashboard.',
    icon: 'portfolio',
  },
  {
    title: 'Investor support',
    text: 'Get broker support for onboarding, funding, account security, and platform workflows.',
    icon: 'support',
  },
  {
    title: 'Compliance ready',
    text: 'Full KYC, AML, and suitability profiling built into the onboarding pipeline from day one.',
    icon: 'compliance',
  },
  {
    title: 'Real-time analytics',
    text: 'Live market feeds, portfolio snapshots, and execution data visualised in your workspace.',
    icon: 'analytics',
  },
  {
    title: 'Multi-asset trading',
    text: 'Equities, forex, commodities, ETFs, and digital assets from a single unified brokerage account.',
    icon: 'multiasset',
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
  {
    name: 'Elena Rostova',
    role: 'Algorithmic Trader',
    text: 'Ultra-low latency execution and rock-solid reporting. The multi-asset coverage allows seamless execution across forex, equities, and commodities without friction.',
    amount: '$1.2M',
    label: 'Volume traded',
  },
];

const steps = [
  { n: '01', title: 'Create account', text: 'Register and choose individual, joint, or business.' },
  { n: '02', title: 'Complete KYC', text: 'Identity checks and suitability profiling.' },
  { n: '03', title: 'Fund account', text: 'Wire, ACH, or linked bank — encrypted.' },
  { n: '04', title: 'Start investing', text: 'Submit requests across global markets.' },
];

const markets = [
  {
    pair: 'AAPL',
    name: 'Apple Inc.',
    price: '$213.40',
    change: '+2.34%',
    up: true,
    sparkline: 'M0,18 Q15,14 30,16 T60,8 T90,3',
  },
  {
    pair: 'EUR/USD',
    name: 'Euro / US Dollar',
    price: '1.0842',
    change: '+0.18%',
    up: true,
    sparkline: 'M0,16 Q20,12 40,15 T70,9 T90,4',
  },
  {
    pair: 'GOLD',
    name: 'Gold Spot',
    price: '$2,318.00',
    change: '-0.52%',
    up: false,
    sparkline: 'M0,4 Q25,8 50,7 T75,14 T90,18',
  },
  {
    pair: 'BTC',
    name: 'Bitcoin',
    price: '$67,420.00',
    change: '+4.12%',
    up: true,
    sparkline: 'M0,19 Q20,16 40,10 T70,5 T90,1',
  },
  {
    pair: 'S&P 500',
    name: 'S&P 500 Index',
    price: '5,412.00',
    change: '+0.89%',
    up: true,
    sparkline: 'M0,17 Q25,15 50,11 T75,7 T90,2',
  },
  {
    pair: 'TSLA',
    name: 'Tesla Inc.',
    price: '$176.20',
    change: '-1.23%',
    up: false,
    sparkline: 'M0,5 Q20,6 40,12 T70,14 T90,19',
  },
];

const defaultFaqs = [
  {
    q: 'Is Skytrade regulated?',
    a: 'Accounts are opened through a regulated brokerage framework with KYC, AML, and suitability checks as standard.',
  },
  {
    q: 'How fast is onboarding?',
    a: 'Most investors finish registration and compliance within a day once documents are submitted.',
  },
  {
    q: 'What markets can I access?',
    a: 'Equities, forex, commodities, ETFs, and select digital assets — based on account type and suitability.',
  },
  {
    q: 'How is client capital protected?',
    a: 'Client capital is held in segregated accounts at Tier-1 banking institutions with end-to-end cryptographic encryption.',
  },
  {
    q: 'Can I open a joint or corporate account?',
    a: 'Yes, Skytrade supports individual accounts, joint accounts, family trusts, and registered corporate investment entities.',
  },
  {
    q: 'What are the funding options?',
    a: 'You can fund your account via domestic wire, international SWIFT, ACH transfer, or linked bank account with zero deposit fees.',
  },
];

export default function LandingPage({ content, onNavigate }) {
  const brand = content?.brand || defaultBrand;
  const features = content?.homeFeatures || defaultFeatures;
  const reviews = content?.testimonials || defaultTestimonials;
  const [openFaq, setOpenFaq] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-white pt-16 selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden font-sans">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 right-[-10%] w-[650px] h-[650px] rounded-full bg-emerald-500/[0.08] blur-[140px]" />
        <div className="absolute top-[600px] left-[-15%] w-[550px] h-[550px] rounded-full bg-emerald-600/[0.04] blur-[150px]" />
        <div className="absolute top-[1400px] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/[0.05] blur-[160px]" />
      </div>

      {/* ── TOP ANNOUNCEMENT STRIP ── */}
      <div className="border-b border-white/[0.06] bg-[#090d14]/80 backdrop-blur-md text-[11px] font-medium tracking-wide">
        <div className="max-w-7xl mx-auto px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span>Regulated brokerage · Encrypted funding · 24/5 dedicated desk</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('user-signup')}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition flex items-center gap-1 group"
          >
            <span>Open an account</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative max-w-7xl mx-auto px-5 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-300">
                {brand.eyebrow || 'INVESTMENT BROKERAGE PLATFORM'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Capital,
              <br />
              <span className="text-emerald-400 drop-shadow-[0_0_35px_rgba(34,197,94,0.35)]">
                handled with intent.
              </span>
            </h1>

            {/* Summary */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
              {brand.summary}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('user-signup')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Open Free Account</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('platform')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#111622] hover:bg-[#182030] text-white font-semibold text-sm border border-white/10 transition-all hover:border-white/20 active:scale-[0.98]"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white/10 text-emerald-400">
                  <svg className="w-3 h-3 ml-0.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span>View Platform</span>
              </button>
            </div>

            {/* Social proof rating pill */}
            <div className="pt-4 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Trader avatar"
                    className="w-8 h-8 rounded-full border-2 border-[#07090e] object-cover"
                  />
                ))}
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span>4.9/5</span>
                  <div className="flex text-emerald-400 text-xs">
                    {'★★★★★'}
                  </div>
                </div>
                <p className="text-slate-400 text-[11px]">From 12,400+ active investors</p>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Isometric Trading Platform Graphic */}
          <div className="lg:col-span-6 relative">
            {/* Background radiant glow */}
            <div className="absolute inset-0 -m-8 rounded-3xl bg-emerald-500/[0.12] blur-3xl pointer-events-none" />

            {/* Floating Top Badge */}
            <div className="absolute -top-4 right-6 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1420]/90 border border-emerald-500/30 shadow-[0_0_20px_rgba(34,197,94,0.25)] backdrop-blur-md animate-bounce duration-1000">
              <span className="text-emerald-400 font-extrabold text-xs">+24%</span>
              <span className="text-slate-300 text-[11px] font-semibold">YTD Performance</span>
            </div>

            {/* Floating Left Badge */}
            <div className="absolute top-1/4 -left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1420]/90 border border-white/10 shadow-lg backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Execution</p>
                <p className="text-xs font-extrabold text-emerald-400">4.8s Avg.</p>
              </div>
            </div>

            {/* Floating Bottom Card */}
            <div className="absolute -bottom-4 left-8 z-20 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0e1624]/95 border border-emerald-500/30 shadow-[0_0_25px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs">
                $
              </span>
              <div>
                <p className="text-[11px] font-extrabold text-white">$734M+ AUM</p>
                <p className="text-[10px] text-emerald-400 font-medium">Assets Under Management</p>
              </div>
            </div>

            {/* 3D Platform Isometric Container */}
            <div className="relative mx-auto w-full max-w-lg aspect-[4/3] rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#0c131f] to-[#070b12] p-5 shadow-[0_0_50px_rgba(34,197,94,0.12)] overflow-hidden flex flex-col justify-between">
              {/* Subtle top grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 pointer-events-none" />

              {/* Header inside platform preview */}
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="font-bold text-white tracking-wide">Skytrade Live Workspace</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                  Live Market Feed
                </span>
              </div>

              {/* Main 3D Candlestick Graphic & Trendline SVG */}
              <div className="relative z-10 flex-1 my-2 flex items-end justify-center">
                <svg viewBox="0 0 460 220" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="neonGreenGlow2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="chartAreaGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                    <filter id="emeraldGlow2" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Isometric base grid lines */}
                  <g opacity="0.25" stroke="#22c55e" strokeWidth="0.8">
                    <line x1="20" y1="180" x2="440" y2="180" />
                    <line x1="20" y1="140" x2="440" y2="140" strokeDasharray="3 3" />
                    <line x1="20" y1="100" x2="440" y2="100" strokeDasharray="3 3" />
                    <line x1="20" y1="60" x2="440" y2="60" strokeDasharray="3 3" />
                  </g>

                  {/* Glowing 3D Candlestick Bars */}
                  {[
                    { x: 35, y: 140, h: 40, w: 14, high: 125, low: 185 },
                    { x: 60, y: 130, h: 50, w: 14, high: 115, low: 185 },
                    { x: 85, y: 135, h: 45, w: 14, high: 120, low: 185 },
                    { x: 110, y: 115, h: 65, w: 14, high: 98, low: 185 },
                    { x: 135, y: 125, h: 55, w: 14, high: 108, low: 185 },
                    { x: 160, y: 105, h: 75, w: 14, high: 88, low: 185 },
                    { x: 185, y: 95, h: 85, w: 14, high: 78, low: 185 },
                    { x: 210, y: 110, h: 70, w: 14, high: 92, low: 185 },
                    { x: 235, y: 85, h: 95, w: 14, high: 68, low: 185 },
                    { x: 260, y: 75, h: 105, w: 14, high: 58, low: 185 },
                    { x: 285, y: 65, h: 115, w: 14, high: 48, low: 185 },
                    { x: 310, y: 80, h: 100, w: 14, high: 62, low: 185 },
                    { x: 335, y: 50, h: 130, w: 14, high: 32, low: 185 },
                    { x: 360, y: 40, h: 140, w: 14, high: 22, low: 185 },
                    { x: 385, y: 30, h: 150, w: 14, high: 15, low: 185 },
                    { x: 410, y: 20, h: 160, w: 14, high: 8, low: 185 },
                  ].map((bar, i) => (
                    <g key={i}>
                      {/* Vertical Wick */}
                      <line
                        x1={bar.x + bar.w / 2}
                        y1={bar.high}
                        x2={bar.x + bar.w / 2}
                        y2={bar.low}
                        stroke="#22c55e"
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                      {/* Candlestick Body */}
                      <rect
                        x={bar.x}
                        y={bar.y}
                        width={bar.w}
                        height={bar.h}
                        rx="3"
                        fill="rgba(34, 197, 94, 0.45)"
                        stroke="#22c55e"
                        strokeWidth="1.2"
                      />
                      {/* 3D Top Cap Highlight */}
                      <rect
                        x={bar.x}
                        y={bar.y}
                        width={bar.w}
                        height="4"
                        rx="2"
                        fill="#86efac"
                        opacity="0.9"
                      />
                    </g>
                  ))}

                  {/* Gradient Area Fill Under Trendline */}
                  <path
                    d="M 35 140 Q 120 125 185 95 T 310 65 T 425 15 L 425 180 L 35 180 Z"
                    fill="url(#chartAreaGradient2)"
                  />

                  {/* Ascending Neon Trendline */}
                  <path
                    d="M 35 140 Q 120 125 185 95 T 310 65 T 425 15"
                    fill="none"
                    stroke="url(#neonGreenGlow2)"
                    strokeWidth="3.5"
                    filter="url(#emeraldGlow2)"
                    strokeLinecap="round"
                  />

                  {/* Arrowhead at Peak */}
                  <polygon
                    points="425,10 435,22 415,22"
                    fill="#22c55e"
                    filter="url(#emeraldGlow2)"
                  />

                  {/* Pulsing Dot at Peak */}
                  <circle cx="425" cy="15" r="4.5" fill="#86efac" filter="url(#emeraldGlow2)" />
                </svg>
              </div>

              {/* Bottom footer bar inside preview */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/[0.06]">
                <span className="font-mono">PORTFOLIO: $734,430.50</span>
                <span className="text-emerald-400 font-semibold font-mono">+12.45% (Today)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE MARKET TICKER STRIP ── */}
      <section className="border-y border-white/[0.07] bg-[#090d14]/90 py-4 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {markets.map((m) => (
              <div
                key={m.pair}
                className="rounded-xl border border-white/[0.06] bg-[#0e131d]/80 p-3 hover:border-emerald-500/30 transition-all hover:bg-[#111724]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wide">{m.pair}</span>
                  <svg width="45" height="20" className="overflow-visible">
                    <path
                      d={m.sparkline}
                      fill="none"
                      stroke={m.up ? '#22c55e' : '#f43f5e'}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-200">{m.price}</span>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      m.up ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {m.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: CAPABILITIES / FEATURES ── */}
      <section id="features" className="max-w-7xl mx-auto px-5 py-24">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
              CAPABILITIES & INFRASTRUCTURE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Built for{' '}
            <span className="text-emerald-400">serious money.</span>
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            One regulated account. Every market that matters. Equities, forex, commodities, ETFs, and digital assets with reporting built for people who actually read their statements.
          </p>
        </div>

        {/* 6 Features in Sleek Dark Glass Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-white/[0.08] bg-[#0c1018]/90 p-7 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.08)] hover:-translate-y-1"
            >
              {/* Subtle green ambient hover glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/[0.03] rounded-full blur-2xl group-hover:bg-emerald-500/[0.08] transition-all" />

              <div className="flex items-center justify-between mb-5">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.15)] group-hover:bg-emerald-500/20 transition-all">
                  {i === 0 && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  )}
                  {i === 1 && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3v18h18" />
                      <path d="M18 9l-5 5-4-4-4 4" />
                    </svg>
                  )}
                  {i === 2 && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  )}
                  {i === 3 && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  )}
                  {i === 4 && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  )}
                  {i === 5 && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  )}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {f.text}
              </p>
            </div>
          ))}
        </div>

        {/* ── INTERACTIVE DASHBOARD & MARKET INSIGHT SHOWCASE ── */}
        <div className="mt-16 grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Showcase Card: Portfolio Overview */}
          <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0c1018]/90 p-7 lg:p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Portfolio Overview
                  </span>
                  <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-400">
                  Updated Live
                </span>
              </div>

              {/* Balance */}
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-slate-400">Total Valuation</p>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-1">
                    $734,430.50
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <span>+12.45%</span>
                    <span>(Today)</span>
                  </span>
                </div>
              </div>

              {/* Area Line Chart */}
              <div className="mt-5 h-36 w-full">
                <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="pvGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,90 Q60,75 120,80 T240,55 T360,40 T500,10 L500,120 L0,120 Z"
                    fill="url(#pvGradient2)"
                  />
                  <path
                    d="M0,90 Q60,75 120,80 T240,55 T360,40 T500,10"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="500" cy="10" r="4" fill="#86efac" />
                </svg>
              </div>
            </div>

            {/* Split Bottom: Donut Chart & Top Holdings */}
            <div className="mt-6 pt-6 border-t border-white/[0.06] grid sm:grid-cols-2 gap-6 items-center">
              {/* Asset Allocation Donut */}
              <div>
                <p className="text-xs font-bold text-white mb-3">Asset Allocation</p>
                <div className="flex items-center gap-4">
                  <svg width="84" height="84" viewBox="0 0 36 36" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#161f2e" strokeWidth="4" />
                    {/* Stocks: 45% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="4"
                      strokeDasharray="45 100"
                      strokeDashoffset="0"
                    />
                    {/* Commodities: 25% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="4"
                      strokeDasharray="25 100"
                      strokeDashoffset="-45"
                    />
                    {/* Forex: 20% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="4"
                      strokeDasharray="20 100"
                      strokeDashoffset="-70"
                    />
                    {/* Digital Assets: 10% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="4"
                      strokeDasharray="10 100"
                      strokeDashoffset="-90"
                    />
                  </svg>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Equities: 45%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>Commodities: 25%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      <span>Forex: 20%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Digital: 10%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Holdings Table */}
              <div className="space-y-2 text-xs font-mono">
                <p className="text-xs font-bold text-white font-sans mb-2">Top Holdings</p>
                {[
                  { sym: 'AAPL', name: 'Apple Inc.', val: '$32,450.00', gain: '+4.25%' },
                  { sym: 'NVDA', name: 'NVIDIA Corp.', val: '$28,320.00', gain: '+6.25%' },
                  { sym: 'MSFT', name: 'Microsoft', val: '$18,750.00', gain: '+2.15%' },
                ].map((h) => (
                  <div key={h.sym} className="flex items-center justify-between text-slate-300">
                    <span>{h.sym}</span>
                    <span className="text-white">{h.val}</span>
                    <span className="text-emerald-400 font-bold">{h.gain}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Showcase Card: Regulated Market Insight & Wireframe Bull */}
          <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0c1018]/90 p-7 lg:p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Ambient emerald backlight */}
            <div className="absolute top-1/2 right-0 w-60 h-60 bg-emerald-500/[0.1] rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Market Oversight
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Bullish Outlook
                </span>
              </div>

              <div className="mt-6">
                <p className="text-5xl font-black text-white font-mono tracking-tight">
                  99.8%
                </p>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Platform Reliability & Execution Score
                </p>
              </div>

              <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                Continuous compliance oversight, segregated client funds, and multi-asset routing ensure your capital remains disciplined and execution-ready.
              </p>
            </div>

            {/* Glowing Wireframe Green Bull Graphic */}
            <div className="my-6 flex items-center justify-center">
              <svg viewBox="0 0 280 160" className="w-full max-w-[240px] overflow-visible">
                <defs>
                  <filter id="bullGlow2">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Geometric Wireframe Bull Lines */}
                <g stroke="#22c55e" strokeWidth="1.2" fill="none" opacity="0.85" filter="url(#bullGlow2)">
                  {/* Horns */}
                  <polyline points="40,25 60,40 50,20 65,35" />
                  <polyline points="75,25 70,38 85,18 78,35" />
                  {/* Head & Snout */}
                  <polygon points="50,45 75,40 85,60 65,75 45,65" fill="rgba(34,197,94,0.06)" />
                  <line x1="50" y1="45" x2="85" y2="60" />
                  <line x1="75" y1="40" x2="65" y2="75" />
                  <line x1="65" y1="75" x2="55" y2="85" />
                  {/* Neck & Shoulder */}
                  <polygon points="75,40 120,35 130,65 85,60" fill="rgba(34,197,94,0.08)" />
                  <line x1="75" y1="40" x2="130" y2="65" />
                  <line x1="120" y1="35" x2="85" y2="60" />
                  {/* Forelegs */}
                  <polyline points="85,60 90,110 75,145 95,148" />
                  <polyline points="105,65 110,105 105,145 120,147" />
                  {/* Spine & Torso */}
                  <polygon points="120,35 180,45 210,65 160,85 130,65" fill="rgba(34,197,94,0.07)" />
                  <line x1="120" y1="35" x2="160" y2="85" />
                  <line x1="180" y1="45" x2="130" y2="65" />
                  <line x1="180" y1="45" x2="160" y2="85" />
                  {/* Flank & Hindquarters */}
                  <polygon points="180,45 235,55 245,90 210,95 160,85" fill="rgba(34,197,94,0.05)" />
                  <line x1="180" y1="45" x2="210" y2="95" />
                  <line x1="235" y1="55" x2="160" y2="85" />
                  {/* Hindlegs */}
                  <polyline points="210,95 215,125 220,146 235,148" />
                  <polyline points="235,90 240,120 248,145 260,146" />
                  {/* Tail */}
                  <path d="M245,65 Q265,85 255,115" strokeWidth="1.5" />
                </g>

                {/* Glowing Nodes / Vertices */}
                {[
                  [60, 40], [85, 60], [65, 75], [120, 35], [130, 65],
                  [180, 45], [160, 85], [235, 55], [245, 90], [210, 95]
                ].map(([cx, cy], idx) => (
                  <circle key={idx} cx={cx} cy={cy} r="2.5" fill="#86efac" />
                ))}
              </svg>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('platform')}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition flex items-center justify-center gap-2 group"
            >
              <span>Explore Platform Solutions</span>
              <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: PROCESS (FOUR STEPS) ── */}
      <section className="border-t border-white/[0.07] bg-[#090d14]/70 py-24 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                ONBOARDING PIPELINE
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Four steps.{' '}
              <span className="text-emerald-400">No theatre.</span>
            </h2>
            <p className="mt-4 text-base text-slate-400">
              Straightforward registration, KYC suitability checks, and encrypted deposit workflows.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.n}
                className="relative rounded-2xl border border-white/[0.08] bg-[#0c1018]/90 p-7 hover:border-emerald-500/40 transition-all hover:-translate-y-1"
              >
                <p className="text-5xl font-black text-emerald-500/25 font-mono mb-4">
                  {s.n}
                </p>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: TESTIMONIALS ── */}
      <section id="clients" className="max-w-7xl mx-auto px-5 py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                VERIFIED CLIENTS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Trusted by{' '}
              <span className="text-emerald-400">Traders Worldwide</span>
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-400/40 text-white flex items-center justify-center transition active:scale-95"
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <button
              type="button"
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-400/40 text-white flex items-center justify-center transition active:scale-95"
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={r.name || i}
              className="rounded-2xl border border-white/[0.08] bg-[#0c1018]/90 p-7 flex flex-col justify-between hover:border-emerald-500/30 transition-all hover:shadow-[0_0_25px_rgba(34,197,94,0.06)]"
            >
              <div>
                {/* 5 Green Stars */}
                <div className="flex text-emerald-400 text-sm mb-4">
                  {'★★★★★'}
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic">
                  “{r.text}”
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.role}</p>
                </div>
                {r.amount && (
                  <div className="text-right">
                    <p className="text-base font-extrabold font-mono text-emerald-400">{r.amount}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">{r.label}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: FAQ ── */}
      <section className="border-t border-white/[0.07] bg-[#090d14]/70 py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                FREQUENTLY ASKED
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Frequently Asked{' '}
              <span className="text-emerald-400">Questions</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {defaultFaqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={f.q}
                  className="rounded-xl border border-white/[0.08] bg-[#0c1018]/90 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left transition hover:text-emerald-400"
                  >
                    <span className="text-sm sm:text-base font-bold text-white">
                      {f.q}
                    </span>
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white/5 text-emerald-400 font-bold text-base leading-none">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/[0.04]">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FINAL HIGH-IMPACT CTA ── */}
      <section className="max-w-7xl mx-auto px-5 py-24">
        <div className="relative rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#0c131f] via-[#09101a] to-[#070c14] p-8 sm:p-14 overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.15)]">
          {/* Ambient green radial bloom */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/[0.12] rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Get started today
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready when you are.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Open a Skytrade account, complete compliance, and fund with confidence. No gimmicks — just a clear path to global financial markets.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  No hidden fees
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Full KYC compliance
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Dedicated broker support
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onNavigate('user-signup')}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-[0_0_30px_rgba(34,197,94,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                Start Onboarding →
              </button>
              <button
                type="button"
                onClick={() => onNavigate('platform')}
                className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition text-center"
              >
                Explore Platform
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.07] bg-[#05070c] py-14 px-5 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                <span className="h-4 w-4 rotate-45 rounded-sm bg-gradient-to-br from-emerald-300 to-teal-700" />
              </span>
              <span className="text-lg font-extrabold text-white">Skytrade</span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Professional investment brokerage and trading platform built for disciplined long-term wealth building and active execution.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All trading systems operational</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Platform</p>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition">Home</button></li>
              <li><button onClick={() => onNavigate('platform')} className="hover:text-white transition">Trading Terminal</button></li>
              <li><button onClick={() => onNavigate('performance')} className="hover:text-white transition">Performance</button></li>
              <li><button onClick={() => onNavigate('clients')} className="hover:text-white transition">Clients</button></li>
            </ul>
          </div>

          {/* Col 3: Account */}
          <div>
            <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Access</p>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('user-signup')} className="hover:text-white transition">Open Account</button></li>
              <li><button onClick={() => onNavigate('user-login')} className="hover:text-white transition">Investor Login</button></li>
              <li><button onClick={() => onNavigate('admin-login')} className="hover:text-white transition">Staff Portal</button></li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Legal</p>
            <ul className="space-y-2">
              <li><span className="text-slate-500">Privacy Policy</span></li>
              <li><span className="text-slate-500">Terms of Service</span></li>
              <li><span className="text-slate-500">Risk Disclosure</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Skytrade Capital. All rights reserved.</p>
          <p>Investment products involve market risk. Regulated brokerage services.</p>
        </div>
      </footer>
    </main>
  );
}
