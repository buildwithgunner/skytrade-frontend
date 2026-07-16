import React, { useEffect, useState } from 'react';

// Public nav items shown on the landing/marketing pages only
const publicNavItems = [
  { id: 'home',        label: 'Home'        },
  { id: 'performance', label: 'Performance' },
  { id: 'clients',     label: 'Clients'     },
];

export function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-sm bg-cyan-500/20 shadow-[0_0_24px_rgba(6,182,212,.4)]">
        <span className="h-5 w-5 rotate-45 rounded-sm bg-gradient-to-br from-cyan-300 via-cyan-500 to-blue-600" />
      </span>
      {!compact && <span className="text-base font-extrabold tracking-tight text-white">Skytrade</span>}
    </div>
  );
}

export default function SiteNav({ activePage, onNavigate, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Logged-in users navigate via their own sidebar; only show public links otherwise
  const isLoggedIn = !!user;
  const visibleNavItems = isLoggedIn ? [] : publicNavItems;

  // Close menu on route change / when active page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [activePage]);

  // Close menu on resize to desktop
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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-[#070f1a]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <button onClick={() => handleNavigate('home')} className="group" aria-label="Skytrade home">
          <BrandMark />
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 text-sm font-semibold text-white/70 md:flex">
          {visibleNavItems.map((item) => (
            (() => {
              const isActive = item.id === 'platform'
                ? activePage === 'platform' || activePage === 'user-dashboard'
                : activePage === item.id;

              return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`transition hover:text-white ${
                isActive
                  ? 'text-white border-b-2 border-cyan-400 pb-1 -mb-1'
                  : ''
              }`}
            >
              {item.id === 'platform' && user?.role === 'user' ? 'Dashboard' : item.label}
            </button>
              );
            })()
          ))}
          {user?.role === 'admin' && (
            <button
              onClick={() => handleNavigate('admin-dashboard')}
              className={`transition text-cyan-400 hover:text-cyan-300 ${
                activePage === 'admin-dashboard'
                  ? 'border-b-2 border-cyan-400 pb-1 -mb-1 font-bold'
                  : ''
              }`}
            >
              Admin Panel
            </button>
          )}
        </div>

        {/* Desktop right-side actions */}
        <div className="hidden items-center gap-3 text-sm font-bold md:flex">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden flex-col items-end text-right sm:flex">
                <span className="text-sm font-bold text-white leading-tight">{user.name}</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400/80">
                  {user.role === 'admin'
                    ? `Admin (${user.staff_id || 'Staff'})`
                    : user.account_type || 'Investor'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="rounded-sm border border-white/10 bg-white/5 px-4 py-2 text-white/80 transition hover:border-rose-400/40 hover:bg-rose-950/20 hover:text-rose-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleNavigate('user-login')}
                className="rounded-sm border border-white/15 px-4 py-2 text-white/80 transition hover:border-cyan-400/40 hover:text-white"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigate('user-signup')}
                className="rounded-sm bg-cyan-500 px-4 py-2 text-white font-extrabold shadow-[0_0_24px_rgba(6,182,212,.3)] transition hover:bg-cyan-400"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden grid h-10 w-10 place-items-center rounded-sm border border-white/10 bg-white/5 text-white/80 transition hover:border-cyan-400/40 hover:text-cyan-300"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#070f1a]/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 flex flex-col gap-1 text-sm font-semibold text-white/80">
            {visibleNavItems.map((item) => (
              (() => {
                const isActive = item.id === 'platform'
                  ? activePage === 'platform' || activePage === 'user-dashboard'
                  : activePage === item.id;

                return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`text-left py-3 border-b border-white/5 transition ${
                  isActive ? 'text-cyan-400' : 'hover:text-white'
                }`}
              >
                {item.id === 'platform' && user?.role === 'user' ? 'Dashboard' : item.label}
              </button>
                );
              })()
            ))}
            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavigate('admin-dashboard')}
                className={`text-left py-3 border-b border-white/5 transition ${
                  activePage === 'admin-dashboard' ? 'text-cyan-400' : 'hover:text-white'
                }`}
              >
                Admin Panel
              </button>
            )}

            {user ? (
              <div className="mt-3 flex flex-col gap-3">
                <div className="rounded-sm border border-white/10 bg-white/5 px-3 py-2.5">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400/80 mt-0.5">
                    {user.role === 'admin'
                      ? `Admin (${user.staff_id || 'Staff'})`
                      : user.account_type || 'Investor'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                  className="rounded-sm border border-rose-400/30 bg-rose-950/20 px-4 py-2.5 text-rose-200 transition hover:bg-rose-950/30 text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={() => handleNavigate('user-login')}
                  className="rounded-sm border border-white/15 px-4 py-2.5 text-white/80 transition hover:border-cyan-400/40 hover:text-white text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigate('user-signup')}
                  className="rounded-sm bg-cyan-500 px-4 py-2.5 text-white font-extrabold shadow-[0_0_24px_rgba(6,182,212,.3)] transition hover:bg-cyan-400 text-left"
                >
                  Sign Up
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
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
