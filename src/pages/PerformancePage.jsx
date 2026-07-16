import React from 'react';

const defaultStats = [
  { value: '$734.5M', suffix: '', label: 'Client assets monitored' },
  { value: '53', suffix: '', label: 'Global markets covered' },
  { value: '4.8', suffix: 's', label: 'Average execution speed' },
];

const defaultFeatures = [
  'Transparent spread monitoring',
  'Multi-market execution reports',
  'Risk-weighted portfolio snapshots',
];

function SignalIcon() {
  return (
    <svg viewBox="0 0 96 96" className="h-14 w-14 text-cyan-400" aria-hidden="true">
      <path d="M16 70V48M36 70V28M56 70V40M76 70V18" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M12 76h72" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity=".65" />
    </svg>
  );
}

function InvestorIcon() {
  return (
    <svg viewBox="0 0 96 96" className="h-16 w-16 text-cyan-400" aria-hidden="true">
      <path d="M24 76c4-24 13-36 28-36 9 0 15 4 20 10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <circle cx="70" cy="26" r="12" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M25 51 39 37l12 12 21-23" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity=".82" />
    </svg>
  );
}

export default function PerformancePage({ content }) {
  const statsList = content?.stats || defaultStats;
  const featuresList = content?.performanceFeatures || defaultFeatures;

  return (
    <main className="relative z-10 px-5 pb-24 pt-32 sm:px-8 lg:px-12">
      {/* Decorative glow */}
      <div className="absolute right-0 top-28 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute left-10 bottom-1/3 h-36 w-36 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <section className="mx-auto max-w-7xl">
        {/* Page header */}
        <p className="text-sm font-extrabold uppercase tracking-[.24em] text-cyan-400">
          Brokerage performance
        </p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[1.03] tracking-tight sm:text-6xl text-white">
          Market access and reporting built for{' '}
          <span className="text-cyan-400">modern investors</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/65">
          Track portfolio health, execution quality, and market exposure across the assets you trade most often.
        </p>

        {/* Stats grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {statsList.map((item, index) => (
            <div
              key={item.label}
              className="flex min-h-44 items-center justify-between border border-cyan-500/15 bg-white/[.03] p-6 rounded-sm hover:border-cyan-400/30 hover:bg-cyan-900/10 transition-colors"
            >
              <div>
                <div className="flex items-baseline gap-1 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {item.value}
                  <span className="text-5xl text-cyan-400">{item.suffix}</span>
                </div>
                <p className="mt-4 max-w-52 text-base font-extrabold leading-snug text-white/80">{item.label}</p>
              </div>
              {index === 1 && <SignalIcon />}
              {index === 2 && <InvestorIcon />}
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {featuresList.map((feature) => (
            <div
              key={feature}
              className="border border-cyan-500/15 bg-[#0a1628]/60 p-6 rounded-sm hover:border-cyan-400/30 transition-colors"
            >
              {/* Cyan indicator */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">Feature</span>
              </div>
              <h2 className="text-xl font-black text-white">{feature}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Review the data behind every position with clean broker-grade reporting and account controls.
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-14 border border-cyan-500/20 bg-gradient-to-br from-[#0c1a30] to-[#04334c] p-8 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-cyan-400">Ready to get started?</p>
            <h3 className="mt-2 text-2xl font-black text-white">Access your investment workspace today</h3>
          </div>
          <button
            className="flex-shrink-0 rounded-sm bg-cyan-500 hover:bg-cyan-400 text-white font-extrabold text-sm px-6 py-3.5 shadow-[0_0_35px_rgba(6,182,212,0.3)] transition cursor-pointer"
            onClick={() => window.location.hash = '#signup'}
          >
            Open Account
          </button>
        </div>
      </section>
    </main>
  );
}
