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
import { getToken, clearToken, apiRequest, TOKEN_KEY } from './lib/api';

const publicPages = new Set(['home', 'performance', 'clients']);

function Footer({ onNavigate }) {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-[#07090e]/90 backdrop-blur-xl px-5 py-8 text-xs text-slate-400 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-2.5">
          {/* Mini brand mark */}
          <span className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-500/15 border border-emerald-500/30">
            <span className="h-3 w-3 rotate-45 rounded-sm bg-gradient-to-br from-emerald-300 to-teal-700" />
          </span>
          <span className="font-bold text-white">Skytrade</span>
          <span className="ml-2 text-slate-500">&copy; 2026. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap gap-6 text-slate-400">
          <button onClick={() => onNavigate('home')} className="hover:text-white transition">Privacy Policy</button>
          <button onClick={() => onNavigate('home')} className="hover:text-white transition">Terms of Use</button>
          <button onClick={() => onNavigate('home')} className="hover:text-white transition">Risk Disclosure</button>
          <button onClick={() => onNavigate('admin-login')} className="text-emerald-400/70 hover:text-emerald-400 transition font-medium">Admin</button>
        </div>
      </div>
    </footer>
  );
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
  if (page === 'performance') content = <PerformancePage content={null} onNavigate={setPage} />;
  else if (page === 'platform') content = <PlatformPage content={null} user={user} onNavigate={setPage} />;
  else if (page === 'user-dashboard') content = <UserDashboardPage user={user} />;
  else if (page === 'clients') content = <ClientsPage content={null} onNavigate={setPage} />;
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
    content = <LandingPage content={null} onNavigate={setPage} />;
  }

  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#07090e] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_28px_rgba(34,197,94,.4)] animate-pulse">
            <span className="h-6 w-6 rotate-45 rounded-sm bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-700" />
          </div>
          <span className="text-sm font-medium text-slate-400 tracking-wider">Verifying session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen overflow-hidden text-white selection:bg-emerald-500/30 selection:text-emerald-200 ${(isAuthPage || page === 'home') ? 'bg-[#06080e]' : 'bg-[#07090e]'}`}>
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
      {content}
      {isPublicPage && page !== 'home' && <Footer onNavigate={setPage} />}
      {user && user.role === 'user' && <WhatsAppButton />}
    </div>
  );
}