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
          <a
            href="https://wa.me/15753862748"
            target="_blank"
            rel="noopener noreferrer"
            title="Chat with us on WhatsApp"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.407 9.862-9.83.001-2.628-1.02-5.1-2.871-6.953C16.593 1.99 14.12 1.01 11.5 1.01c-5.44 0-9.863 4.41-9.866 9.833-.001 1.762.48 3.487 1.396 4.992l-.995 3.63 3.733-.974zm11.144-7.535c-.328-.163-1.94-.954-2.24-1.063-.3-.11-.518-.163-.737.163-.219.327-.847 1.063-1.038 1.282-.19.217-.382.244-.71.081-1.123-.563-1.92-.93-2.678-2.23-.195-.336.195-.312.558-1.036.06-.12.03-.223-.015-.313-.045-.09-.41-1.01-.563-1.378-.15-.36-.315-.31-.41-.315l-.35-.005c-.246 0-.645.093-.982.463-.337.37-1.287 1.253-1.287 3.052 0 1.8 1.309 3.54 1.49 3.785.183.245 2.57 3.932 6.24 5.51 2.89 1.237 3.48 1.01 4.73 1.01.812 0 1.62-.397 1.848-1.007.228-.61.228-1.137.16-1.246-.07-.11-.257-.163-.585-.327z"/></svg>
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
