import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getUserDashboard,
  markAllUserNotificationsRead,
  markUserNotificationRead,
  uploadUserDocument,
} from '../lib/api';
import WhatsAppButton from '../components/SupportChat';

/* ─── Helpers ─── */
function fmt(value) {
  return `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function statusTone(s) {
  if (s === 'approved' || s === 'posted' || s === 'reconciled') return 'text-emerald-400';
  if (s === 'rejected') return 'text-rose-400';
  return 'text-amber-400';
}

/* ─── Sidebar icons ─── */
const icons = {
  dashboard: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  ),
  deposit: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
  ),
  withdrawal: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
  ),
  profile: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
};

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
  { id: 'deposits',  label: 'Deposits',  icon: icons.deposit   },
  { id: 'withdrawals', label: 'Withdrawals', icon: icons.withdrawal },
  { id: 'profile',  label: 'Profile',   icon: icons.profile   },
];

/* ─── Reusable card ─── */
function StatCard({ label, value, hint, accent = 'cyan' }) {
  const colors = {
    cyan: 'from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-400',
    emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/10 to-transparent border-amber-500/20 text-amber-400',
  };
  return (
    <div className={`rounded-lg border bg-gradient-to-br p-5 ${colors[accent]}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-[.2em] opacity-70">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      {hint && <p className="mt-1.5 text-xs text-white/45">{hint}</p>}
    </div>
  );
}

/* ─── Empty state ─── */
function Empty({ text }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-white/10 px-6 py-10 text-center">
      <span className="text-2xl">📭</span>
      <p className="text-sm text-white/40">{text}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   VIEWS
══════════════════════════════════════════════════ */

/* Dashboard Overview */
function DashboardView({ dashboard, user, onNavChange }) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,.22),transparent_50%),linear-gradient(135deg,#07101d,#0b1828_60%,#07101d)] p-6 sm:p-8">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl" />
        <p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-cyan-300">Client Dashboard</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-black text-white sm:text-4xl">
          {dashboard?.welcome_message || `Welcome back, ${user?.name?.split(' ')[0] || 'Investor'}!`}
        </h1>
        <p className="mt-3 text-sm leading-7 text-white/55 max-w-xl">
          Track your live balance, profits, and recent account activity all in one place.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/60">{user?.name || 'Investor'}</span>
          <span className={`rounded-md border px-3 py-1.5 text-xs font-extrabold ${dashboard?.compliance?.kyc_completed ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/30 bg-amber-500/10 text-amber-400'}`}>
            KYC {dashboard?.compliance?.kyc_completed ? '✓ Complete' : '⏳ Pending'}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Balance" value={fmt(dashboard?.summary?.balance)} hint="Available account balance" accent="cyan" />
        <StatCard label="Total Profit" value={fmt(dashboard?.summary?.total_profit)} hint="Cumulative profit earned" accent="emerald" />
        <StatCard label="Bonus" value={fmt(dashboard?.summary?.bonus)} hint="Package bonus balance" accent="amber" />
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => onNavChange('deposits')}
          className="group flex items-center gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-left transition hover:border-emerald-500/40 hover:bg-emerald-500/10"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 transition">{icons.deposit}</span>
          <div>
            <p className="font-extrabold text-white">Make a Deposit</p>
            <p className="text-xs text-white/45 mt-0.5">Fund your trading account</p>
          </div>
        </button>
        <button
          onClick={() => onNavChange('withdrawals')}
          className="group flex items-center gap-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 text-left transition hover:border-rose-500/40 hover:bg-rose-500/10"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-rose-500/20 text-rose-400 group-hover:bg-rose-500/30 transition">{icons.withdrawal}</span>
          <div>
            <p className="font-extrabold text-white">Withdraw Funds</p>
            <p className="text-xs text-white/45 mt-0.5">Request a withdrawal</p>
          </div>
        </button>
      </div>

      {/* Recent transactions */}
      <div className="rounded-xl border border-white/10 bg-[#0a1220]">
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan-400/70">Movement History</p>
          <h2 className="mt-1 text-lg font-black text-white">Recent Transactions</h2>
        </div>
        <div className="p-5">
          {(dashboard?.transactions || []).length === 0 ? (
            <Empty text="No transactions recorded yet." />
          ) : (
            <div className="divide-y divide-white/5">
              {dashboard.transactions.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-sm font-bold text-white capitalize">{t.type}</p>
                    <p className="mt-0.5 text-xs text-white/40">{t.external_reference || t.description || 'Internal'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{fmt(t.amount)}</p>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${statusTone(t.status)}`}>{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <NotificationSection dashboard={dashboard} />
    </div>
  );
}

/* Notifications (used inside dashboard) */
function NotificationSection({ dashboard }) {
  if ((dashboard?.notifications || []).length === 0) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a1220]">
      <div className="px-5 py-4 border-b border-white/10">
        <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan-400/70">Account Feed</p>
        <h2 className="mt-1 text-lg font-black text-white">Notifications</h2>
      </div>
      <div className="divide-y divide-white/5 px-5">
        {dashboard.notifications.slice(0, 5).map((n) => (
          <div key={n.id} className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white">{n.title}</p>
                <p className="mt-1 text-xs leading-5 text-white/50">{n.data?.message || n.type?.replaceAll('_', ' ')}</p>
                <p className="mt-1.5 text-[11px] text-white/30">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {!n.read_at && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-cyan-400" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Deposits View */
function DepositsView({ dashboard }) {
  const deposits = (dashboard?.transactions || []).filter((t) => t.type === 'deposit');
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan-400/70">Money In</p>
        <h2 className="mt-1 text-2xl font-black text-white">Deposits</h2>
        <p className="mt-1 text-sm text-white/45">All your deposit history and funding records.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Deposited" value={fmt(deposits.reduce((s, t) => s + Number(t.amount || 0), 0))} accent="emerald" />
        <StatCard label="Pending Deposits" value={deposits.filter((t) => t.status === 'pending').length} accent="amber" />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0a1220]">
        <div className="px-5 py-4 border-b border-white/10">
          <h3 className="font-extrabold text-white">Deposit History</h3>
        </div>
        <div className="p-5">
          {deposits.length === 0 ? (
            <Empty text="No deposits recorded yet. Make your first deposit to get started." />
          ) : (
            <div className="divide-y divide-white/5">
              {deposits.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-bold text-white">{fmt(t.amount)}</p>
                    <p className="mt-0.5 text-xs text-white/40">{t.description || t.external_reference || 'Deposit'}</p>
                    <p className="mt-0.5 text-[11px] text-white/30">{new Date(t.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-extrabold uppercase tracking-wider ${statusTone(t.status)}`}>{t.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Withdrawals View */
function WithdrawalsView({ dashboard }) {
  const withdrawals = (dashboard?.transactions || []).filter((t) => t.type === 'withdrawal');
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-rose-400/70">Money Out</p>
        <h2 className="mt-1 text-2xl font-black text-white">Withdrawals</h2>
        <p className="mt-1 text-sm text-white/45">All your withdrawal requests and their status.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Withdrawn" value={fmt(withdrawals.reduce((s, t) => s + Number(t.amount || 0), 0))} accent="cyan" />
        <StatCard label="Pending" value={withdrawals.filter((t) => t.status === 'pending').length} accent="amber" />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0a1220]">
        <div className="px-5 py-4 border-b border-white/10">
          <h3 className="font-extrabold text-white">Withdrawal History</h3>
        </div>
        <div className="p-5">
          {withdrawals.length === 0 ? (
            <Empty text="No withdrawals made yet." />
          ) : (
            <div className="divide-y divide-white/5">
              {withdrawals.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-bold text-white">{fmt(t.amount)}</p>
                    <p className="mt-0.5 text-xs text-white/40">{t.description || t.external_reference || 'Withdrawal'}</p>
                    <p className="mt-0.5 text-[11px] text-white/30">{new Date(t.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-extrabold uppercase tracking-wider ${statusTone(t.status)}`}>{t.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Profile View */
function ProfileView({ user, dashboard, loadDashboard }) {
  const [uploadType, setUploadType] = useState('government_id');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) { setUploadError('Please choose a file.'); return; }
    try {
      setUploading(true);
      setUploadError('');
      await uploadUserDocument({ type: uploadType, file: uploadFile });
      setUploadFile(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      await loadDashboard({ silent: true });
    } catch (err) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.reset();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan-400/70">Account</p>
        <h2 className="mt-1 text-2xl font-black text-white">Profile</h2>
      </div>

      {/* User info card */}
      <div className="rounded-xl border border-white/10 bg-[#0a1220] p-6">
        <div className="flex items-center gap-5">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black text-white">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-extrabold text-white">{user?.name}</p>
            <p className="text-sm text-white/45">{user?.email}</p>
            <span className="mt-1 inline-block rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
              {user?.account_type || 'Investor'}
            </span>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div className="rounded-lg border border-white/8 bg-black/20 px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">KYC Status</p>
            <p className={`mt-1 font-bold ${dashboard?.compliance?.kyc_completed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {dashboard?.compliance?.kyc_completed ? '✓ Verified' : '⏳ Pending'}
            </p>
          </div>
          <div className="rounded-lg border border-white/8 bg-black/20 px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">Suitability</p>
            <p className={`mt-1 font-bold ${dashboard?.compliance?.suitability_completed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {dashboard?.compliance?.suitability_completed ? '✓ Complete' : '⏳ Pending'}
            </p>
          </div>
        </div>
      </div>

      {/* KYC document upload */}
      <div className="rounded-xl border border-white/10 bg-[#0a1220]">
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan-400/70">KYC Center</p>
          <h3 className="mt-1 font-extrabold text-white">Upload Documents</h3>
        </div>
        <div className="p-5">
          {uploadError && <div className="mb-4 rounded-lg border border-rose-300/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">{uploadError}</div>}
          {uploadSuccess && <div className="mb-4 rounded-lg border border-emerald-300/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">Document uploaded successfully!</div>}
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">Document Type</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                >
                  <option value="government_id">Government ID</option>
                  <option value="proof_of_address">Proof of Address</option>
                  <option value="bank_statement">Bank Statement</option>
                  <option value="passport">Passport</option>
                  <option value="selfie_verification">Selfie Verification</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">Choose File</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.webp"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white file:mr-3 file:rounded file:border-0 file:bg-cyan-500 file:px-3 file:py-1.5 file:font-bold file:text-white"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-extrabold uppercase tracking-[.14em] text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : 'Upload Document'}
            </button>
          </form>

          {/* Uploaded docs list */}
          {(dashboard?.documents || []).length > 0 && (
            <div className="mt-6 divide-y divide-white/5">
              {dashboard.documents.map((doc) => (
                <div key={doc.id} className="flex flex-wrap items-center justify-between gap-4 py-3.5">
                  <div>
                    <p className="text-sm font-bold text-white">{doc.document_name}</p>
                    <p className="mt-0.5 text-xs text-white/40">{doc.type.replaceAll('_', ' ')} · {new Date(doc.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-extrabold uppercase tracking-wider ${statusTone(doc.status)}`}>{doc.status}</span>
                    <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 hover:text-cyan-100 transition">View</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function UserDashboardPage({ user }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const data = await getUserDashboard();
      setDashboard(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load your dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center text-sm text-white/40">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          Loading your dashboard…
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen pt-[72px]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed left-0 top-[72px] z-40 h-[calc(100vh-72px)] w-64 flex-shrink-0 border-r border-white/8 bg-[#070f1a] transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block md:h-auto`}
      >
        {/* User badge */}
        <div className="border-b border-white/8 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-black text-white">
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-extrabold text-white">{user?.name || 'Investor'}</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-cyan-400/70">{user?.account_type || 'Client'}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition
                ${activeNav === item.id
                  ? 'bg-cyan-500/15 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(6,182,212,.2)]'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className={activeNav === item.id ? 'text-cyan-400' : ''}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Balance pill */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/8 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">Account Balance</p>
          <p className="mt-1 text-xl font-black text-white">{fmt(dashboard?.summary?.balance)}</p>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <main className="flex-1 overflow-auto">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/8 bg-[#070f1a]/90 px-4 py-3 backdrop-blur md:hidden">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:text-white"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <p className="text-sm font-extrabold text-white">
            {NAV.find((n) => n.id === activeNav)?.label}
          </p>
          <span className="text-xs font-bold text-cyan-400">{fmt(dashboard?.summary?.balance)}</span>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 rounded-lg border border-rose-300/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">{error}</div>
          )}

          {activeNav === 'dashboard' && (
            <DashboardView dashboard={dashboard} user={user} onNavChange={setActiveNav} />
          )}
          {activeNav === 'deposits' && (
            <DepositsView dashboard={dashboard} />
          )}
          {activeNav === 'withdrawals' && (
            <WithdrawalsView dashboard={dashboard} />
          )}
          {activeNav === 'profile' && (
            <ProfileView user={user} dashboard={dashboard} loadDashboard={loadDashboard} />
          )}
        </div>
      </main>
        {user && user.role === 'user' && <WhatsAppButton />}
    </div>
  );
}
