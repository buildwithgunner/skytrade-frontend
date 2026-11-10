import React, { useEffect, useState } from 'react';

// Public nav items shown on the landing/marketing pages
const publicNavItems = [
  { id: 'home',        label: 'Home'        },
  { id: 'performance', label: 'Performance' },
  { id: 'clients',     label: 'Clients'     },
];

export function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_15px_rgba(34,197,94,0.35)]">
        <span className="h-4 w-4 rotate-45 rounded-sm bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-700 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
      </span>
      {!compact && (
        <span className="text-lg font-extrabold tracking-tight text-white flex items-center">
          Skytrade
        </span>
      )}
    </div>
  );
}

export default function SiteNav({ activePage, onNavigate, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!user;
  const visibleNavItems = isLoggedIn ? [] : publicNavItems;

  useEffect(() => {
    setMenuOpen(false);
  }, [activePage]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNavigate = (id) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#070a10]/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 lg:px-10">
        <button onClick={() => handleNavigate('home')} className="group transition hover:opacity-90" aria-label="Skytrade home">
          <BrandMark />
        </button>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          {visibleNavItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`transition hover:text-white py-1 relative ${
                  isActive ? 'text-white font-semibold' : 'text-slate-300'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop right-side actions */}
        <div className="hidden items-center gap-4 text-sm font-semibold md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavigate(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10 transition"
              >
                Dashboard ({user.name})
              </button>
              <button
                onClick={onLogout}
                className="text-xs text-rose-300 hover:text-rose-200 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleNavigate('user-login')}
                className="text-slate-300 hover:text-white transition px-2 py-1 text-sm font-medium"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('user-signup')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-black shadow-[0_0_20px_rgba(34,197,94,0.35)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] active:scale-[0.98]"
              >
                <span>Open Free Account</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* WhatsApp contact icon */}
          <a
            href="https://wa.me/15753862748"
            target="_blank"
            rel="noopener noreferrer"
            title="Chat with us on WhatsApp"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors shadow-[0_0_12px_rgba(37,211,102,0.3)]"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:border-emerald-400/40 hover:text-emerald-300"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#070a10]/95 backdrop-blur-2xl">
          <div className="mx-auto max-w-7xl px-5 py-5 flex flex-col gap-2 text-sm font-semibold text-slate-200">
            {visibleNavItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`text-left py-2.5 border-b border-white/5 transition ${
                    isActive ? 'text-emerald-400' : 'hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {user ? (
              <div className="mt-3 flex flex-col gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 mt-0.5">
                    {user.role === 'admin' ? 'Admin' : user.account_type || 'Investor'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                  className="rounded-xl border border-rose-500/30 bg-rose-950/20 px-4 py-2.5 text-rose-200 transition text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2.5">
                <button
                  onClick={() => handleNavigate('user-login')}
                  className="rounded-xl border border-white/15 px-4 py-3 text-white/90 text-center font-medium transition hover:border-emerald-400/40"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigate('user-signup')}
                  className="rounded-xl bg-emerald-500 px-4 py-3 text-black font-bold text-center shadow-[0_0_20px_rgba(34,197,94,0.35)] transition hover:bg-emerald-400"
                >
                  Open Free Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
