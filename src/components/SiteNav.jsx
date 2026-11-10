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
          {/* WhatsApp contact icon */}
          {/* WhatsApp contact icon */}
<a
  href="https://wa.me/15753862748"
  target="_blank"
  rel="noopener noreferrer"
  title="Chat with us on WhatsApp"
  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors"
>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
</a>
        </div>

        {/* Desktop right-side actions */}
        <div className="hidden items-center gap-3 text-sm font-bold md:flex">
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
