import React from 'react';

const defaultTestimonials = [
  {
    name: 'Misha Grant',
    role: 'Private investor',
    text: 'Skytrade made it easier to compare markets, follow my portfolio, and move quickly when opportunities opened up. The platform feels focused and professional.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    stat: '$480K',
    statLabel: 'Portfolio Managed',
  },
  {
    name: 'Nazar Buch',
    role: 'Business owner',
    text: 'I wanted a broker that could support long-term investing and active trading in one place. Skytrade gives me clear reporting, useful market insight, and responsive support.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    stat: '+24%',
    statLabel: 'YTD Return',
  },
  {
    name: 'Amara Wells',
    role: 'Portfolio client',
    text: 'The account view is clear, the onboarding process is simple, and the broker support team understands both investing and active trading workflows.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    stat: '53',
    statLabel: 'Markets Traded',
  },
];

const defaultStats = [
  { label: 'Active investors', value: '12,400+', sub: 'Across 48 jurisdictions' },
  { label: 'Markets covered', value: '53', sub: 'Equities, FX, Commodities' },
  { label: 'Client satisfaction', value: '98%', sub: 'Based on annual survey' },
];

const clientTiers = [
  {
    title: 'Individual Investors',
    desc: 'Self-directed accounts with live market feeds, clean execution tools, and low minimum deposits.',
    tag: 'Individual',
  },
  {
    title: 'High-Net-Worth & Family Trusts',
    desc: 'Dedicated account managers, custom margin facilities, and consolidated reporting across holdings.',
    tag: 'Private Wealth',
  },
  {
    title: 'Corporate & Institutional Entities',
    desc: 'Multi-user authorization, corporate KYC compliance, API integration, and wholesale spread pricing.',
    tag: 'Institutional',
  },
];

export default function ClientsPage({ content, onNavigate }) {
  const reviews = content?.testimonials || defaultTestimonials;
  const stats = content?.clientStats || defaultStats;

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
        {/* Hero Header */}
        <div className="grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                SKYTRADE INVESTOR NETWORK
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Trusted by{' '}
              <span className="text-emerald-400 drop-shadow-[0_0_35px_rgba(34,197,94,0.35)]">
                active investors.
              </span>
            </h1>
          </div>

          {/* Center decorative element – emerald orb badge */}
          <div className="mx-auto hidden lg:flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/20 via-[#0e1624] to-teal-900/20 border border-emerald-500/30 shadow-[0_0_40px_rgba(34,197,94,0.18)]">
            <svg viewBox="0 0 64 64" className="h-14 w-14 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="32" cy="22" r="10" />
              <path d="M12 52c0-11 9-18 20-18s20 7 20 18" strokeLinecap="round" />
              <path d="M44 18c4 2 7 6 7 10" strokeLinecap="round" />
              <path d="M20 18c-4 2-7 6-7 10" strokeLinecap="round" />
            </svg>
          </div>

          <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-400">
            Skytrade combines brokerage access, market intelligence, and account support so investors can make decisions with clearer data and better execution workflows.
          </p>
        </div>

        {/* Stats Row */}
        <div className="mt-14 grid sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="relative rounded-2xl border border-white/[0.08] bg-[#0c1018]/90 p-7 hover:border-emerald-500/40 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.08)] hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-slate-400">0{i + 1}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">{stat.value}</p>
              <p className="mt-2 text-sm font-bold text-slate-200">{stat.label}</p>
              {stat.sub && <p className="mt-1 text-xs text-emerald-400 font-medium">{stat.sub}</p>}
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-emerald-400 mb-2">
              Investor Testimonials
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Direct feedback from the trading desk
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="rounded-2xl border border-white/[0.08] bg-[#0c1018]/90 p-7 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:shadow-[0_0_25px_rgba(34,197,94,0.06)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Avatar */}
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full border-2 border-emerald-500/30 object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">
                        {review.name.charAt(0)}
                      </div>
                    )}

                    {/* 5 Green Stars */}
                    <div className="flex text-emerald-400 text-sm">
                      {'★★★★★'}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base leading-relaxed text-slate-300 italic">
                    “{review.text}”
                  </p>
                </div>

                {/* Reviewer Info */}
                <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-white">{review.name}</p>
                      <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-400">{review.role}</p>
                  </div>

                  {review.stat && (
                    <div className="text-right">
                      <p className="text-base font-extrabold font-mono text-emerald-400">{review.stat}</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">{review.statLabel}</p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Client Account Profiles */}
        <div className="mt-16">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-emerald-400 mb-2">
              Account Suitability
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Solutions tailored to your investment mandate
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {clientTiers.map((tier) => (
              <div
                key={tier.title}
                className="rounded-2xl border border-white/[0.08] bg-[#0c1018]/90 p-7 hover:border-emerald-500/40 transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                    {tier.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{tier.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{tier.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => handleAction('user-signup')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 group"
                  >
                    <span>Open {tier.tag} Account</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 relative rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#0c131f] via-[#09101a] to-[#070c14] p-8 sm:p-12 overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.12)] grid gap-8 md:grid-cols-2 items-center">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              Join our community
            </span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Become part of the Skytrade investor network
            </h3>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Open your account today and experience professional-grade brokerage tools, transparent pricing, and dedicated investor support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => handleAction('user-signup')}
              className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm px-6 py-4 shadow-[0_0_25px_rgba(34,197,94,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
            >
              Open Free Account →
            </button>
            <button
              type="button"
              onClick={() => handleAction('platform')}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm px-6 py-4 transition text-center"
            >
              View Platform
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
