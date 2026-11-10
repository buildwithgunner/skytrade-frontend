import React, { useCallback, useEffect, useState } from 'react';
import SiteNav from './components/SiteNav';
import LandingPage from './pages/LandingPage';
import PerformancePage from './pages/PerformancePage';
import PlatformPage from './pages/PlatformPage';
import ClientsPage from './pages/ClientsPage';
import AuthPage from './pages/AuthPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import WhatsAppButton from './components/SupportChat';
import { getSiteContent, getToken, clearToken, apiRequest, TOKEN_KEY } from './lib/api';

const publicPages = new Set(['home', 'performance', 'clients']);

function Footer({ onNavigate }) {
  return (
    <footer className="relative z-10 border-t border-cyan-500/15 bg-[#050e1a]/80 backdrop-blur-sm px-5 py-8 text-xs text-white/50 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          {/* Mini brand mark */}
          <span className="grid h-6 w-6 place-items-center rounded-sm bg-cyan-500/20">
            <span className="h-3 w-3 rotate-45 rounded-sm bg-gradient-to-br from-cyan-300 via-cyan-500 to-blue-600" />
          </span>
          <span className="font-bold text-white/60">Skytrade</span>
          <span className="ml-2">&copy; 2026. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap gap-6 underline underline-offset-4">
          <button onClick={() => onNavigate('home')}>Privacy Policy</button>
          <button onClick={() => onNavigate('home')}>Terms of Use</button>
          <button onClick={() => onNavigate('home')}>Risk Disclosure</button>
          <button onClick={() => onNavigate('admin-login')} className="text-cyan-400/60 hover:text-cyan-400 no-underline transition">Admin</button>
        </div>
      </div>
    </footer>
  );
}

function BackendStatus({ loading, error }) {
  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 z-50 border border-cyan-500/20 bg-[#070f1a]/90 backdrop-blur-sm px-4 py-3 text-xs font-bold text-white/70 rounded-sm">
        Loading backend content...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-xs border border-rose-300/30 bg-rose-950/80 px-4 py-3 text-xs font-bold text-rose-100 rounded-sm">
        Backend unavailable: {error}
      </div>
    );
  }

  return null;
}

// URL path → internal page key
const pathToPageKey = {
  '': 'home',
  '/': 'home',
  'performance': 'performance',
  'platform': 'platform',
  'clients': 'clients',
  'deposit': 'deposit',
  'withdrawal': 'withdrawal',
  'admin/login': 'admin-login',
  'admin/signup': 'admin-signup',
  'admin/dashboard': 'admin-dashboard',
  'user/login': 'user-login',
  'user/signup': 'user-signup',
  'user/dashboard': 'user-dashboard',
};

const pageKeyToPath = {
  home: '/',
  performance: '/performance',
  platform: '/platform',
  clients: '/clients',
  'admin-login': '/admin/login',
  'admin-signup': '/admin/signup',
  'admin-dashboard': '/admin/dashboard',
  'user-login': '/user/login',
  'user-signup': '/user/signup',
  'user-dashboard': '/user/dashboard',
};

function pathToPage(pathname) {
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  return pathToPageKey[slug] ?? 'home';
}

export default function App() {
  const [page, setPageState] = useState(() => pathToPage(window.location.pathname));
  const [siteContent, setSiteContent] = useState(null);
  const [contentStatus, setContentStatus] = useState({ loading: true, error: '' });
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Navigate: update React state AND the browser URL
  const setPage = useCallback((newPage) => {
    const path = pageKeyToPath[newPage] ?? '/';
    window.history.pushState({ page: newPage }, '', path);
    setPageState(newPage);
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const onPopState = (e) => {
      setPageState(e.state?.page ?? pathToPage(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    let ignore = false;

    getSiteContent()
      .then((data) => {
        if (!ignore) {
          setSiteContent(data);
          setContentStatus({ loading: false, error: '' });
        }
      })
      .catch((error) => {
        if (!ignore) setContentStatus({ loading: false, error: error.message });
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuthLoading(true);
      apiRequest('/auth/me')
        .then(({ user, permissions }) => {
          setUser({ ...user, permissions: permissions || [] });
          if (user.role === 'admin' && page === 'home') {
            setPage('admin-dashboard');
          } else if (user.role === 'user' && page === 'home') {
            setPage('user-dashboard');
          }
        })
        .catch(() => {
          clearToken();
          setUser(null);
        })
        .finally(() => {
          setAuthLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== TOKEN_KEY) {
        return;
      }

      if (!event.newValue) {
        setUser(null);
        setPageState('home');
        return;
      }

      setAuthLoading(true);
      apiRequest('/auth/me')
        .then(({ user, permissions }) => {
          setUser({ ...user, permissions: permissions || [] });
        })
        .catch(() => {
          clearToken();
          setUser(null);
        })
        .finally(() => {
          setAuthLoading(false);
        });
    };

    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if ((page === 'platform' || page === 'user-dashboard') && !user) {
      setPage('user-login');
      return;
    }

    if (page === 'admin-dashboard' && user?.role !== 'admin') {
      setPage(user ? 'user-dashboard' : 'admin-login');
      return;
    }

    if (page === 'admin-login' && user?.role === 'admin') {
      setPage('admin-dashboard');
      return;
    }

    if ((page === 'platform' || page === 'user-dashboard') && user?.role === 'admin') {
      setPage('admin-dashboard');
      return;
    }

    if ((page === 'user-login' || page === 'user-signup') && user) {
      setPage(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard');
    }
  }, [authLoading, page, setPage, user]);

  const handleLogout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (err) {
      // Ignore API logout error, proceed to clear local session anyway
    } finally {
      clearToken();
      setUser(null);
      setPage('home');
    }
  };

  const authMatch = page.match(/^(user|admin)-(login|signup)$/);
  const isPublicPage = publicPages.has(page);
  const isAuthPage = !!authMatch;

  let content;
  if (page === 'performance') content = <PerformancePage content={siteContent} />;
  else if (page === 'platform') content = <PlatformPage content={siteContent} user={user} />;
  else if (page === 'user-dashboard') content = <UserDashboardPage user={user} />;
  else if (page === 'clients') content = <ClientsPage content={siteContent} />;
  else if (page === 'admin-dashboard') content = <AdminDashboardPage user={user} />;
  else if (authMatch) {
    content = (
      <AuthPage
        role={authMatch[1]}
        mode={authMatch[2]}
        onNavigate={setPage}
        onAuthSuccess={(userData) => {
          setUser(userData);
          if (userData.role === 'admin') {
            setPage('admin-dashboard');
          } else {
            setPage('user-dashboard');
          }
        }}
      />
    );
  } else {
    content = <LandingPage content={siteContent} onNavigate={setPage} />;
  }

  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050e1a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-sm bg-cyan-500/20 shadow-[0_0_28px_rgba(6,182,212,.4)] animate-pulse">
            <span className="h-6 w-6 rotate-45 rounded-sm bg-gradient-to-br from-cyan-300 via-cyan-500 to-blue-600" />
          </div>
          <span className="text-sm font-medium text-white/50 tracking-wider">Verifying session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen overflow-hidden text-white selection:bg-cyan-500/30 ${(isAuthPage || page === 'home') ? '' : 'bg-[#050e1a]'}`}>
      {/* Background glows – only on inner non-auth pages */}
      {!isAuthPage && page !== 'home' && (
        <div className="pointer-events-none fixed inset-0 opacity-60">
          <div className="absolute left-[-12rem] top-32 h-72 w-72 rounded-full bg-cyan-700/20 blur-3xl" />
          <div className="absolute right-[-10rem] top-48 h-96 w-96 rounded-full bg-blue-700/15 blur-3xl" />
          <div className="absolute left-1/2 bottom-32 h-64 w-64 rounded-full bg-cyan-900/20 blur-[100px]" />
        </div>
      )}
      {!isAuthPage && <SiteNav activePage={page} onNavigate={setPage} user={user} onLogout={handleLogout} />}
      {isAuthPage && <SiteNav activePage="" onNavigate={setPage} user={user} onLogout={handleLogout} />}
      <BackendStatus loading={contentStatus.loading} error={contentStatus.error} />
      {content}
      {isPublicPage && <Footer onNavigate={setPage} />}
      {user && user.role === 'user' && <WhatsAppButton />}
    </div>
  );
}
