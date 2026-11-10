import React from 'react';

const defaultStats = [
  { value: '$734.5M', suffix: '', label: 'Client assets monitored', sub: '+18.4% YoY growth' },
  { value: '53', suffix: '', label: 'Global markets covered', sub: 'Equities, FX, Commodities' },
  { value: '4.8', suffix: 's', label: 'Average execution speed', sub: 'Sub-second order routing' },
];

const defaultFeatures = [
  {
    title: 'Transparent spread monitoring',
    desc: 'Real-time spread feeds across 53 liquid markets with full historical execution transparency and zero markups.',
    icon: 'spread',
  },
  {
    title: 'Multi-market execution reports',
    desc: 'Detailed trade confirmations and post-trade analytics to measure slippage, routing paths, and venue efficiency.',
    icon: 'execution',
  },
  {
    title: 'Risk-weighted portfolio snapshots',
    desc: 'Automated value-at-risk (VaR) calculations, sector concentration tracking, and dynamic margin requirements.',
    icon: 'risk',
  },
];

const executionBenchmarks = [
  { asset: 'Global Equities', speed: '4.2s', fillRate: '99.94%', spread: '0.02% avg' },
  { asset: 'Major Forex Pairs', speed: '2.1s', fillRate: '99.98%', spread: '0.1 pips' },
  { asset: 'Precious Metals & Energy', speed: '3.8s', fillRate: '99.91%', spread: 'Tight market' },
  { asset: 'Index CFDs & Futures', speed: '3.1s', fillRate: '99.96%', spread: 'Institutional' },
];

export default function PerformancePage({ content, onNavigate }) {
  const statsList = content?.stats || defaultStats;
  const featuresList = content?.performanceFeatures || defaultFeatures;

  const handleAction = (route) => {
    if (typeof onNavigate === 'function') {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  return (
    <main className="relative min-h-screen bg-[#07090e] text-white pt-28 pb-24 px-5 sm:px-8 lg:px-12 selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden font-sans">
      {/* Decorative ambient emerald glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/[0.08] blur-[150px]" />
        <div className="absolute top-[600px] left-[-15%] w-[500px] h-[500px] rounded-full bg-emerald-600/[0.04] blur-[150px]" />
      </div>

      <section className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
              BROKERAGE PERFORMANCE & METRICS
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            Market access and reporting built for{' '}
            <span className="text-emerald-400 drop-shadow-[0_0_35px_rgba(34,197,94,0.35)]">
              modern investors.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
            Track portfolio health, execution quality, and market exposure across the assets you trade most often with bank-grade transparency.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {statsList.map((item, index) => (
            <div
              key={item.label}
              className="relative rounded-2xl border border-white/[0.08] bg-[#0c1018]/90 p-7 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.08)] hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Subtle green ambient light */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.03] rounded-full blur-xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {`Metric 0${index + 1}`}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>

                <div className="flex items-baseline gap-1 text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                  {item.value}
                  {item.suffix && <span className="text-emerald-400">{item.suffix}</span>}
                </div>

                <p className="mt-3 text-base font-bold text-slate-200">{item.label}</p>
                {item.sub && <p className="mt-1 text-xs text-emerald-400 font-medium">{item.sub}</p>}
              </div>

              {/* Sparkline / Decorative visual */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <span>Audited Benchmark</span>
                <span className="text-emerald-400 font-mono font-bold">Top Tier 99.8%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Execution Quality & Benchmarks Table */}
        <div className="mt-14 rounded-2xl border border-white/[0.08] bg-[#0c1018]/90 p-7 lg:p-8 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  Execution Quality
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Multi-Venue Routing Benchmarks</h2>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              Live Latency: &lt;10ms
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 font-bold">Asset Class</th>
                  <th className="py-3.5 font-bold">Average Routing Speed</th>
                  <th className="py-3.5 font-bold">Order Fill Rate</th>
                  <th className="py-3.5 font-bold text-right">Spread Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {executionBenchmarks.map((b) => (
                  <tr key={b.asset} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {b.asset}
                    </td>
                    <td className="py-4 font-mono text-slate-300">{b.speed}</td>
                    <td className="py-4 font-mono text-emerald-400 font-bold">{b.fillRate}</td>
                    <td className="py-4 font-mono text-slate-300 text-right">{b.spread}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-14">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-emerald-400 mb-2">
              Reporting Architecture
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Data integrity at every layer
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuresList.map((f, i) => {
              const title = typeof f === 'string' ? f : f.title;
              const desc = typeof f === 'string'
                ? 'Review the data behind every position with clean broker-grade reporting and account controls.'
                : f.desc;

              return (
                <div
                  key={title}
                  className="rounded-2xl border border-white/[0.08] bg-[#0c1018]/90 p-7 hover:border-emerald-500/40 transition-all hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]">
                      {i === 0 && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                      )}
                      {i === 1 && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="20" x2="18" y2="10" />
                          <line x1="12" y1="20" x2="12" y2="4" />
                          <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                      )}
                      {i === 2 && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      )}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">0{i + 1}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 relative rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#0c131f] via-[#09101a] to-[#070c14] p-8 sm:p-12 overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.12)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              Ready to get started?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Access your investment workspace today
            </h3>
            <p className="text-sm text-slate-400 max-w-lg">
              Open your regulated trading account in minutes with zero onboarding friction.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleAction('user-signup')}
            className="flex-shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm px-7 py-4 shadow-[0_0_25px_rgba(34,197,94,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Open Free Account →
          </button>
        </div>
      </section>
    </main>
  );
}
