import React from 'react';

const defaultTestimonials = [
  {
    name: 'Misha Grant',
    role: 'Private investor',
    text: 'Skytrade made it easier to compare markets, follow my portfolio, and move quickly when opportunities opened up. The platform feels focused and professional.',
  },
  {
    name: 'Nazar Buch',
    role: 'Business owner',
    text: 'I wanted a broker that could support long-term investing and active trading in one place. Skytrade gives me clear reporting, useful market insight, and responsive support.',
  },
  {
    name: 'Amara Wells',
    role: 'Portfolio client',
    text: 'The account view is clear, the onboarding process is simple, and the broker support team understands both investing and active trading workflows.',
  },
];

const defaultStats = [
  { label: 'Active investors', value: '12,400+' },
  { label: 'Markets covered', value: '53' },
  { label: 'Client satisfaction', value: '98%' },
];

export default function ClientsPage({ content }) {
  const reviews = content?.testimonials || defaultTestimonials;
  const stats = content?.clientStats || defaultStats;

  return (
    <main className="relative z-10 px-5 pb-24 pt-32 sm:px-8 lg:px-12 overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 h-64 w-64 rounded-full bg-blue-600/8 blur-[80px] pointer-events-none" />

      <section className="mx-auto max-w-7xl">

        {/* Hero header */}
        <div className="grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.24em] text-cyan-400">Skytrade clients</p>
            <h1 className="mt-3 max-w-md text-4xl font-black leading-tight sm:text-5xl text-white">
              Trusted by active investors
            </h1>
          </div>

          {/* Center decorative element – cyan orb */}
          <div className="mx-auto hidden lg:flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/20 shadow-[0_0_60px_rgba(6,182,212,0.25)]">
            <svg viewBox="0 0 64 64" className="h-14 w-14 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="32" cy="22" r="10" />
              <path d="M12 52c0-11 9-18 20-18s20 7 20 18" strokeLinecap="round" />
              <path d="M44 18c4 2 7 6 7 10" strokeLinecap="round" />
              <path d="M20 18c-4 2-7 6-7 10" strokeLinecap="round" />
            </svg>
          </div>

          <p className="max-w-lg text-base font-medium leading-7 text-white/65">
            Skytrade combines brokerage access, market intelligence, and account support so investors can make decisions with clearer data and better execution workflows.
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-14 grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border border-cyan-500/15 bg-white/[.03] p-6 rounded-sm text-center hover:border-cyan-400/30 hover:bg-cyan-900/10 transition-colors"
            >
              <p className="text-3xl font-black text-white sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-cyan-400/80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials grid */}
        <div className="mt-14">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-cyan-400 mb-8">Client testimonials</p>
          <div className="grid gap-6 lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="border border-cyan-500/15 bg-white/[.025] p-6 rounded-sm hover:border-cyan-400/25 hover:bg-white/[.04] transition-colors flex flex-col"
              >
                {/* Avatar */}
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-slate-700 flex items-center justify-center text-white font-black text-lg">
                  {review.name.charAt(0)}
                </div>

                {/* Review text */}
                <p className="mt-5 text-sm font-medium leading-6 text-white/70 flex-1">
                  "{review.text}"
                </p>

                {/* Reviewer info */}
                <div className="mt-5 pt-4 border-t border-white/8">
                  <p className="text-sm font-black text-white">{review.name}</p>
                  <p className="mt-0.5 text-xs font-extrabold uppercase tracking-[.18em] text-cyan-400/70">{review.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-16 border border-cyan-500/20 bg-gradient-to-br from-[#0c1a30] to-[#04334c] p-8 sm:p-12 rounded-sm grid gap-8 md:grid-cols-2 items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-cyan-400">Join our community</p>
            <h3 className="mt-3 text-3xl font-black leading-tight text-white">
              Become part of the Skytrade investor network
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Open your account today and experience professional-grade brokerage tools, transparent pricing, and dedicated investor support.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button className="flex-1 rounded-sm bg-cyan-500 hover:bg-cyan-400 text-white font-extrabold text-sm px-6 py-3.5 shadow-[0_0_35px_rgba(6,182,212,0.25)] transition">
              Open Account
            </button>
            <button className="flex-1 rounded-sm border border-white/15 bg-white/5 hover:bg-white/10 text-white font-extrabold text-sm px-6 py-3.5 transition">
              Learn More
            </button>
          </div>
        </div>

      </section>
    </main>
  );
}
