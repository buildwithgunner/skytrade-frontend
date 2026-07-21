import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  approveAdminMoneyMovement,
  createAdminPackage,
  getAdminDocuments,
  getAdminMoneyMovements,
  getAdminAuditLogs,
  getAdminNotifications,
  getAdminOverview,
  getAdminPackages,
  getAdminRequests,
  getAdminUserProfile,
  getAdminUsers,
  markAllAdminNotificationsRead,
  markNotificationRead,
  rejectAdminMoneyMovement,
  reviewAdminDocument,
  updateAdminPackage,
  updateAdminUserFinance,
  updateAdminUserStatus,
  updateRequestStatus,
  reconcileAdminMoneyMovement,
} from '../lib/api';

const statusOptions = ['active', 'review', 'suspended'];

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusTone(status) {
  if (status === 'approved' || status === 'active') return 'text-emerald-400';
  if (status === 'rejected' || status === 'suspended') return 'text-rose-400';
  return 'text-amber-400';
}

function severityTone(severity) {
  if (severity === 'critical') return 'border-rose-500/40 bg-rose-950/30 text-rose-200';
  if (severity === 'warning') return 'border-amber-500/30 bg-amber-950/30 text-amber-200';
  if (severity === 'success') return 'border-emerald-500/30 bg-emerald-950/30 text-emerald-200';
  return 'border-cyan-500/20 bg-cyan-950/20 text-cyan-200';
}

function MetricCard({ label, value, description, tone = 'cyan' }) {
  const barTone = tone === 'violet' ? 'bg-violet-500' : tone === 'blue' ? 'bg-blue-500' : tone === 'emerald' ? 'bg-emerald-500' : 'bg-cyan-500';

  return (
    <div className="relative overflow-hidden rounded-sm border border-white/10 bg-white/[.02] p-6 backdrop-blur-sm">
      <div className={`absolute left-0 top-0 h-full w-1 ${barTone}`} />
      <p className="text-xs font-bold uppercase tracking-[.18em] text-white/50">{label}</p>
      <p className="mt-3 text-3xl font-black text-white sm:text-4xl">{value}</p>
      <p className="mt-2 text-xs text-white/40">{description}</p>
    </div>
  );
}

function SectionCard({ title, eyebrow, action, children }) {
  return (
    <section className="border border-white/10 bg-[#0d0d10] p-6 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {eyebrow && <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan-400/80">{eyebrow}</p>}
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">{title}</h2>
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ComplianceModal({ investor, onClose }) {
  if (!investor) {
    return null;
  }

  const riskNarrative = {
    sell_all: 'Sell everything to preserve capital.',
    sell_some: 'Reduce exposure and protect downside.',
    hold: 'Hold positions through volatility.',
    buy_more: 'Add to positions during the downturn.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-white/10 bg-[#0d0d10] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-lg text-white/50 transition hover:text-white"
          aria-label="Close investor profile"
        >
          ×
        </button>

        <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan-400/80">Investor Risk Profile</p>
        <h3 className="mt-2 text-3xl font-black text-white">{investor.name}</h3>
        <p className="mt-1 text-sm text-white/55">{investor.email}</p>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-cyan-400">Identity</p>
              <div className="mt-4 grid gap-3 text-sm text-white/75 sm:grid-cols-2">
                <div><span className="block text-[11px] uppercase tracking-wider text-white/35">Phone</span>{investor.phone || '—'}</div>
                <div><span className="block text-[11px] uppercase tracking-wider text-white/35">DOB</span>{investor.dob || '—'}</div>
                <div className="sm:col-span-2"><span className="block text-[11px] uppercase tracking-wider text-white/35">Address</span>{investor.address || '—'}</div>
                <div><span className="block text-[11px] uppercase tracking-wider text-white/35">Zip Code</span>{investor.zip_code || '—'}</div>
                <div><span className="block text-[11px] uppercase tracking-wider text-white/35">Gov ID</span>{investor.government_id || '—'}</div>
              </div>
            </div>

            <div className="border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-cyan-400">Suitability</p>
              <div className="mt-4 grid gap-3 text-sm text-white/75 sm:grid-cols-2">
                <div><span className="block text-[11px] uppercase tracking-wider text-white/35">Annual Income</span>{investor.annual_income || '—'}</div>
                <div><span className="block text-[11px] uppercase tracking-wider text-white/35">Employment</span>{investor.employment_status || '—'}</div>
                <div className="sm:col-span-2"><span className="block text-[11px] uppercase tracking-wider text-white/35">Source of Funds</span>{investor.source_of_funds || '—'}</div>
                <div><span className="block text-[11px] uppercase tracking-wider text-white/35">Knowledge</span>{investor.knowledge_level || '—'}</div>
                <div><span className="block text-[11px] uppercase tracking-wider text-white/35">Goal</span>{investor.investment_goals || '—'}</div>
                <div className="sm:col-span-2"><span className="block text-[11px] uppercase tracking-wider text-white/35">Risk Response</span>{riskNarrative[investor.risk_tolerance_scenario] || '—'}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(investor.experience_assets || []).map((asset) => (
                  <span key={asset} className="border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-white/75">
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-cyan-400">Account Controls</p>
              <div className="mt-4 grid gap-3 text-sm text-white/75 sm:grid-cols-2">
                <div><span className="block text-[11px] uppercase tracking-wider text-white/35">Account Status</span>{investor.account_status}</div>
                <div><span className="block text-[11px] uppercase tracking-wider text-white/35">Last Login</span>{investor.last_login_at ? new Date(investor.last_login_at).toLocaleString() : '—'}</div>
                <div><span className="block text-[11px] uppercase tracking-wider text-white/35">Masked IP</span>{investor.last_login_ip || '—'}</div>
                <div><span className="block text-[11px] uppercase tracking-wider text-white/35">Active Sessions</span>{investor.active_sessions_count ?? 0}</div>
              </div>
            </div>

            <div className="border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-cyan-400">Recent Requests</p>
              <div className="mt-4 space-y-3">
                {(investor.recent_requests || []).length === 0 ? (
                  <p className="text-sm text-white/45">No recent investment requests.</p>
                ) : (
                  investor.recent_requests.map((request) => (
                    <div key={request.id} className="border border-white/8 bg-black/20 p-3 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-bold text-white">{request.asset_type}</span>
                        <span className={`text-xs font-extrabold uppercase tracking-wider ${statusTone(request.status)}`}>{request.status}</span>
                      </div>
                      <p className="mt-2 text-white/70">{formatCurrency(request.amount)} via {request.funding_source}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-cyan-400">Recent Notifications</p>
              <div className="mt-4 space-y-3">
                {(investor.recent_notifications || []).length === 0 ? (
                  <p className="text-sm text-white/45">No recent user notifications.</p>
                ) : (
                  investor.recent_notifications.map((notification) => (
                    <div key={notification.id} className={`border p-3 text-sm ${severityTone(notification.severity)}`}>
                      <p className="font-bold">{notification.title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/75">
                        {notification.data?.message || notification.data?.review_notes || notification.type.replaceAll('_', ' ')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage({ user }) {
  const [overview, setOverview] = useState(null);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [moneyMovements, setMoneyMovements] = useState([]);
  const [packages, setPackages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [reviewNotes, setReviewNotes] = useState({});
  const [userActions, setUserActions] = useState({});
  const [requestActionState, setRequestActionState] = useState({});
  const [userActionState, setUserActionState] = useState({});
  const [notificationActionState, setNotificationActionState] = useState(false);
  const [financeDrafts, setFinanceDrafts] = useState({});
  const [financeActionState, setFinanceActionState] = useState({});
  const [movementActionState, setMovementActionState] = useState({});
  const [documentActionState, setDocumentActionState] = useState({});
  const [documentNotes, setDocumentNotes] = useState({});
  const [movementNotes, setMovementNotes] = useState({});
  const [packageDraft, setPackageDraft] = useState({
    name: '',
    description: '',
    minimum_amount: '',
    maximum_amount: '',
    roi_percent: '',
    duration_days: '30',
    bonus_percent: '0',
    is_active: true,
    sort_order: '0',
  });
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [packageSaving, setPackageSaving] = useState(false);
  const [adminNav, setAdminNav] = useState('overview');
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);

  const permissions = useMemo(
    () => overview?.permissions || user?.permissions || [],
    [overview?.permissions, user?.permissions]
  );

  const fetchAdminData = useCallback(async ({ silent = false } = {}) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);

      const [overviewData, requestData, userData, notificationData, auditLogData, movementData, packageData, documentData] = await Promise.all([
        getAdminOverview(),
        getAdminRequests({ limit: 40 }),
        getAdminUsers({ limit: 40 }),
        getAdminNotifications({ limit: 30 }),
        getAdminAuditLogs({ limit: 30 }),
        getAdminMoneyMovements({ limit: 30 }),
        getAdminPackages(),
        getAdminDocuments({ limit: 30 }),
      ]);

      setOverview(overviewData);
      setRequests(requestData.requests || []);
      setUsers(userData.users || []);
      setNotifications(notificationData.notifications || []);
      setAuditLogs(auditLogData.logs || []);
      setMoneyMovements(movementData.movements || []);
      setPackages(packageData.packages || []);
      setDocuments(documentData.documents || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load administrative data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      fetchAdminData({ silent: true });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [fetchAdminData]);

  const pendingRequests = requests.filter((item) => ['pending', 'awaiting_secondary_approval'].includes(item.status));
  const unreadNotifications = notifications.filter((item) => !item.read_at);

  const handleRequestDecision = async (requestId, status) => {
    try {
      setRequestActionState((prev) => ({ ...prev, [requestId]: true }));
      await updateRequestStatus(requestId, status, reviewNotes[requestId] || undefined);
      await fetchAdminData({ silent: true });
    } catch (err) {
      setError(err.message || 'Failed to update request status.');
    } finally {
      setRequestActionState((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleUserStatusSave = async (targetUser) => {
    const draft = userActions[targetUser.id] || {};
    const nextStatus = draft.account_status || targetUser.account_status;
    const reason = draft.reason || '';

    try {
      setUserActionState((prev) => ({ ...prev, [targetUser.id]: true }));
      const response = await updateAdminUserStatus(targetUser.id, nextStatus, reason);
      setUsers((prev) => prev.map((entry) => (entry.id === targetUser.id ? response.user : entry)));
    } catch (err) {
      setError(err.message || 'Failed to update investor access controls.');
    } finally {
      setUserActionState((prev) => ({ ...prev, [targetUser.id]: false }));
    }
  };

  const openInvestorProfile = async (userId) => {
    try {
      const data = await getAdminUserProfile(userId);
      setSelectedInvestor(data.user);
    } catch (err) {
      setError(err.message || 'Failed to load investor compliance profile.');
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((item) => (
        item.id === id ? { ...item, read_at: new Date().toISOString() } : item
      )));
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read.');
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      setNotificationActionState(true);
      await markAllAdminNotificationsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
    } catch (err) {
      setError(err.message || 'Failed to clear administrative notifications.');
    } finally {
      setNotificationActionState(false);
    }
  };

  const handleFinanceAction = async (targetUser, action) => {
    const draft = financeDrafts[targetUser.id] || {};
    const amount = Number(draft.amount || 0);

    if (!amount) {
      setError('Enter an amount before applying a client finance adjustment.');
      return;
    }

    try {
      setFinanceActionState((prev) => ({ ...prev, [targetUser.id]: true }));
      const response = await updateAdminUserFinance(targetUser.id, action, amount, draft.note || '');
      setUsers((prev) => prev.map((entry) => (entry.id === targetUser.id ? response.user : entry)));
      setFinanceDrafts((prev) => ({
        ...prev,
        [targetUser.id]: { amount: '', note: '' },
      }));
      await fetchAdminData({ silent: true });
    } catch (err) {
      setError(err.message || 'Failed to update client profit.');
    } finally {
      setFinanceActionState((prev) => ({ ...prev, [targetUser.id]: false }));
    }
  };

  const handleMovementAction = async (movementId, action) => {
    try {
      setMovementActionState((prev) => ({ ...prev, [movementId]: true }));

      if (action === 'approve') {
        await approveAdminMoneyMovement(movementId);
      } else {
        await rejectAdminMoneyMovement(movementId, movementNotes[movementId] || '');
      }

      await fetchAdminData({ silent: true });
    } catch (err) {
      setError(err.message || 'Failed to update transaction.');
    } finally {
      setMovementActionState((prev) => ({ ...prev, [movementId]: false }));
    }
  };

  const handleDocumentReview = async (documentId, status) => {
    try {
      setDocumentActionState((prev) => ({ ...prev, [documentId]: true }));
      await reviewAdminDocument(documentId, status, documentNotes[documentId] || '');
      await fetchAdminData({ silent: true });
    } catch (err) {
      setError(err.message || 'Failed to review client document.');
    } finally {
      setDocumentActionState((prev) => ({ ...prev, [documentId]: false }));
    }
  };

  const resetPackageDraft = () => {
    setEditingPackageId(null);
    setPackageDraft({
      name: '',
      description: '',
      minimum_amount: '',
      maximum_amount: '',
      roi_percent: '',
      duration_days: '30',
      bonus_percent: '0',
      is_active: true,
      sort_order: '0',
    });
  };

  const handlePackageSave = async () => {
    try {
      setPackageSaving(true);

      const payload = {
        ...packageDraft,
        minimum_amount: Number(packageDraft.minimum_amount || 0),
        maximum_amount: packageDraft.maximum_amount === '' ? null : Number(packageDraft.maximum_amount),
        roi_percent: Number(packageDraft.roi_percent || 0),
        duration_days: Number(packageDraft.duration_days || 30),
        bonus_percent: Number(packageDraft.bonus_percent || 0),
        sort_order: Number(packageDraft.sort_order || 0),
      };

      if (editingPackageId) {
        await updateAdminPackage(editingPackageId, payload);
      } else {
        await createAdminPackage(payload);
      }

      resetPackageDraft();
      await fetchAdminData({ silent: true });
    } catch (err) {
      setError(err.message || 'Failed to save investment package.');
    } finally {
      setPackageSaving(false);
    }
  };

  const beginEditPackage = (pkg) => {
    setEditingPackageId(pkg.id);
    setPackageDraft({
      name: pkg.name || '',
      description: pkg.description || '',
      minimum_amount: String(pkg.minimum_amount ?? ''),
      maximum_amount: pkg.maximum_amount == null ? '' : String(pkg.maximum_amount),
      roi_percent: String(pkg.roi_percent ?? ''),
      duration_days: String(pkg.duration_days ?? 30),
      bonus_percent: String(pkg.bonus_percent ?? 0),
      is_active: Boolean(pkg.is_active),
      sort_order: String(pkg.sort_order ?? 0),
    });
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center text-sm text-white/40">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          Loading broker operations console…
        </div>
      </main>
    );
  }

  /* ── sidebar nav items ── */
  const ADMIN_NAV = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      id: 'security',
      label: 'Security Center',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
    },
    {
      id: 'audit',
      label: 'Audit Log',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      ),
    },
    {
      id: 'clients',
      label: 'Client Profiles',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      id: 'kyc',
      label: 'KYC',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
    },
    {
      id: 'access',
      label: 'Access Control',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
    {
      id: 'packages',
      label: 'Packages',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/>
          <line x1="10" y1="12" x2="14" y2="12"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen pt-[72px]">
      {/* Mobile overlay */}
      {adminSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setAdminSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed left-0 top-[72px] z-40 h-[calc(100vh-72px)] w-64 flex-shrink-0 border-r border-white/8 bg-[#070f1a] transition-transform duration-300
          ${adminSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block md:h-auto`}
      >
        {/* Admin badge */}
        <div className="border-b border-white/8 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-600 text-sm font-black text-white">
              {(user?.name || 'A')[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-extrabold text-white">{user?.name || 'Admin'}</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-violet-400/80">
                Admin · {user?.staff_id || 'Broker Ops'}
              </p>
            </div>
          </div>
          {refreshing && (
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-cyan-400/60 animate-pulse">● Live refresh</p>
          )}
        </div>

        {/* Nav links */}
        <nav className="px-3 py-4 space-y-1">
          {ADMIN_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => { setAdminNav(item.id); setAdminSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition
                ${adminNav === item.id
                  ? 'bg-violet-500/15 text-violet-300 shadow-[inset_0_0_0_1px_rgba(139,92,246,.2)]'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className={adminNav === item.id ? 'text-violet-400' : ''}>{item.icon}</span>
              {item.label}
              {item.id === 'kyc' && documents.filter(d => d.status === 'pending').length > 0 && (
                <span className="ml-auto rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-black text-black">
                  {documents.filter(d => d.status === 'pending').length}
                </span>
              )}
              {item.id === 'notifications' && unreadNotifications.length > 0 && (
                <span className="ml-auto rounded-full bg-cyan-500 px-1.5 py-0.5 text-[10px] font-black text-black">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Metrics pill */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/8 px-5 py-4 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Pending reviews</span>
            <span className="font-black text-amber-400">{overview?.metrics?.pending_requests ?? 0}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Approved volume</span>
            <span className="font-black text-emerald-400">{formatCurrency(overview?.metrics?.approved_volume)}</span>
          </div>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <main className="flex-1 overflow-auto">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/8 bg-[#070f1a]/90 px-4 py-3 backdrop-blur md:hidden">
          <button
            onClick={() => setAdminSidebarOpen(v => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:text-white"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <p className="text-sm font-extrabold text-white">
            {ADMIN_NAV.find(n => n.id === adminNav)?.label}
          </p>
          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">Admin</span>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 rounded-lg border border-rose-300/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">{error}</div>
          )}

          {/* ══ OVERVIEW ══ */}
          {adminNav === 'overview' && (
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-violet-400/70">Broker Operations Console</p>
                <h1 className="mt-1 text-2xl font-black text-white">Administrative Dashboard</h1>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Approved Volume" value={formatCurrency(overview?.metrics?.approved_volume)} description="Capital routed through review queue." tone="emerald" />
                <MetricCard label="Pending Reviews" value={overview?.metrics?.pending_requests ?? 0} description="Awaiting desk approval." tone="violet" />
                <MetricCard label="Flagged Activity" value={overview?.metrics?.flagged_requests ?? 0} description="Elevated risk or manual review." tone="blue" />
                <MetricCard label="Restricted Investors" value={overview?.metrics?.restricted_users ?? 0} description="Accounts not in active status." />
              </div>

              {/* Vitals Summary Card */}
              <div className="rounded-xl border border-white/10 bg-[#0a1220] p-6 space-y-4">
                <h3 className="text-lg font-black text-white">Operations vitals summary</h3>
                <p className="text-sm text-white/60">
                  Welcome to the Broker Dashboard. Select a menu item from the sidebar to inspect client profiles, review KYC documents, perform wallet adjustments, or audit system transactions.
                </p>
              </div>
            </div>
          )}

          {/* ══ SECURITY CENTER ══ */}
          {adminNav === 'security' && permissions.includes('view_security_center') && (
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-amber-400/70">Risk Monitoring</p>
                <h1 className="mt-1 text-2xl font-black text-white">Security Center</h1>
              </div>

              <SectionCard title="Security Signals" eyebrow="Live Alerts">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-3">
                    <p className="text-xs font-extrabold uppercase tracking-[.16em] text-white/45">High-Risk Requests</p>
                    {(overview?.security_alerts || []).length === 0 ? (
                      <div className="border border-dashed border-white/10 px-4 py-6 text-sm text-white/45">No active risk alerts.</div>
                    ) : overview.security_alerts.map(alert => (
                      <button type="button" key={alert.id} onClick={() => openInvestorProfile(alert.user?.id)}
                        className="w-full border border-amber-500/20 bg-amber-950/10 p-4 text-left transition hover:border-amber-400/40">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-bold text-white">{alert.user?.name || 'Unknown Investor'}</span>
                          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">Risk {alert.risk_score}</span>
                        </div>
                        <p className="mt-2 text-sm text-white/65">{formatCurrency(alert.amount)} into {alert.asset_type}</p>
                        <p className="mt-2 text-xs text-white/45">{(alert.risk_flags || []).join(', ') || 'Manual review required'}</p>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-extrabold uppercase tracking-[.16em] text-white/45">Recently Active Investors</p>
                    {(overview?.recently_active_investors || []).length === 0 ? (
                      <div className="border border-dashed border-white/10 px-4 py-6 text-sm text-white/45">No recent logins.</div>
                    ) : overview.recently_active_investors.map(inv => (
                      <div key={inv.id} className="border border-white/8 bg-white/[0.02] p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-bold text-white">{inv.name}</p>
                            <p className="text-xs text-white/45">{inv.email}</p>
                          </div>
                          <span className={`text-[11px] font-extrabold uppercase tracking-wider ${statusTone(inv.account_status)}`}>{inv.account_status}</span>
                        </div>
                        <p className="mt-2 text-xs text-white/45">Last login {inv.last_login_at ? new Date(inv.last_login_at).toLocaleString() : '—'} · IP {inv.last_login_ip || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ══ ADMIN NOTIFICATIONS ══ */}
          {adminNav === 'notifications' && permissions.includes('view_notifications') && (
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan-400/70">Operational Feed</p>
                <h1 className="mt-1 text-2xl font-black text-white">Admin Notifications</h1>
              </div>

              <SectionCard
                title="System Logs & Notifications"
                eyebrow="Alerts Feed"
                action={
                  <button
                    type="button"
                    onClick={handleMarkAllNotificationsRead}
                    disabled={notificationActionState || unreadNotifications.length === 0}
                    className="border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold uppercase tracking-[.14em] text-white/70 transition hover:border-cyan-400/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Mark all read
                  </button>
                }
              >
                <div className="mb-4 flex gap-3 text-xs">
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-extrabold text-cyan-300">{unreadNotifications.length} unread</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 font-extrabold text-white/55">{notifications.length} total</span>
                </div>
                <div className="max-h-[36rem] space-y-3 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="border border-dashed border-white/10 px-4 py-6 text-sm text-white/45">No notifications.</div>
                  ) : notifications.map(n => (
                    <div key={n.id} className={`border p-4 transition ${severityTone(n.severity)} ${!n.read_at ? 'shadow-[0_0_0_1px_rgba(34,211,238,0.08)]' : ''}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold">{n.title}</p>
                          <p className="mt-1 text-xs leading-5 text-white/75">{n.data?.message || n.data?.reason || n.type?.replaceAll('_', ' ')}</p>
                          <p className="mt-2 text-[11px] text-white/45">{new Date(n.created_at).toLocaleString()}</p>
                        </div>
                        {!n.read_at && (
                          <button type="button" onClick={() => handleMarkNotificationRead(n.id)} className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 hover:text-cyan-100">Clear</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ══ AUDIT LOG ══ */}
          {adminNav === 'audit' && permissions.includes('view_audit_logs') && (
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-rose-400/70">Tamper-Evident Trail</p>
                <h1 className="mt-1 text-2xl font-black text-white">Immutable Audit Log</h1>
              </div>

              <SectionCard title="System Activity Ledger" eyebrow="Ledger Details">
                <div className="mb-4 flex gap-3 text-xs">
                  <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-extrabold text-rose-200">{auditLogs.filter(e => e.severity === 'critical').length} critical</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 font-extrabold text-white/55">{auditLogs.length} records</span>
                </div>
                <div className="max-h-[36rem] space-y-3 overflow-y-auto pr-1">
                  {auditLogs.length === 0 ? (
                    <div className="border border-dashed border-white/10 px-4 py-6 text-sm text-white/45">No audit records.</div>
                  ) : auditLogs.map(entry => (
                    <div key={entry.id} className={`border p-4 ${severityTone(entry.severity)}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold">{entry.event_type.replaceAll('_', ' ')}</p>
                          <p className="mt-1 text-xs leading-5 text-white/75">{entry.data?.message || entry.data?.reason || entry.data?.status || 'Operational event recorded.'}</p>
                          <p className="mt-2 text-[11px] text-white/45">{new Date(entry.occurred_at).toLocaleString()} {entry.actor?.email ? `· ${entry.actor.email}` : ''}</p>
                        </div>
                        <div className="text-right text-[10px] font-extrabold uppercase tracking-wider text-white/45">
                          <div>{entry.severity}</div>
                          <div className="mt-2">{entry.event_hash?.slice(0, 12)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ══ CLIENT PROFILES ══ */}
          {adminNav === 'clients' && (
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-violet-400/70">Investor Management</p>
                <h1 className="mt-1 text-2xl font-black text-white">Client Profiles</h1>
              </div>

              {permissions.includes('view_investment_requests') && (
                <SectionCard title="Investment Review Queue" eyebrow="Request Oversight">
                  {requests.length === 0 ? (
                    <div className="border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/45">No investment requests.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/10 text-[11px] font-extrabold uppercase tracking-[.16em] text-white/40">
                            <th className="pb-3 pr-4">Investor</th><th className="pb-3 pr-4">Asset / Amount</th>
                            <th className="pb-3 pr-4">Funding</th><th className="pb-3 pr-4">Risk</th>
                            <th className="pb-3 pr-4">Review Notes</th><th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {requests.map(req => (
                            <tr key={req.id} className="align-top">
                              <td className="py-4 pr-4">
                                <p className="font-bold text-white">{req.user?.name || 'Unknown'}</p>
                                <p className="mt-1 text-xs text-white/45">{req.user?.email || '—'}</p>
                                {req.user?.id && <button type="button" onClick={() => openInvestorProfile(req.user.id)} className="mt-2 text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 hover:text-cyan-100">View profile</button>}
                              </td>
                              <td className="py-4 pr-4">
                                <p className="font-bold text-white">{req.asset_type}</p>
                                <p className="mt-1 text-xs text-white/45">{formatCurrency(req.amount)}</p>
                                <p className={`mt-2 text-[11px] font-extrabold uppercase tracking-wider ${statusTone(req.status)}`}>{req.status}</p>
                              </td>
                              <td className="py-4 pr-4 text-xs text-white/65">
                                <p>{req.funding_source}</p><p className="mt-1 uppercase tracking-wider text-white/35">{req.frequency}</p>
                              </td>
                              <td className="py-4 pr-4">
                                <div className={`inline-flex border px-2 py-1 text-[11px] font-extrabold ${req.risk_score >= 60 ? 'border-amber-500/30 bg-amber-950/20 text-amber-300' : 'border-white/10 bg-white/5 text-white/70'}`}>Risk {req.risk_score}</div>
                                <p className="mt-2 text-xs text-white/45">{(req.risk_flags || []).join(', ') || 'Standard review'}</p>
                              </td>
                              <td className="py-4 pr-4">
                                <textarea rows={3} value={reviewNotes[req.id] || ''} onChange={e => setReviewNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                                  placeholder="Compliance notes…" disabled={req.status !== 'pending'}
                                  className="w-full min-w-[14rem] border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/40" />
                              </td>
                              <td className="py-4 text-right">
                                {!['pending', 'awaiting_secondary_approval'].includes(req.status) ? (
                                  <span className="text-xs text-white/35">Reviewed</span>
                                ) : (
                                  <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => handleRequestDecision(req.id, 'approved')} disabled={requestActionState[req.id]}
                                      className="bg-emerald-500 px-3 py-2 text-xs font-extrabold uppercase text-white hover:bg-emerald-400 disabled:opacity-50">
                                      {req.status === 'awaiting_secondary_approval' ? 'Final approve' : 'Approve'}
                                    </button>
                                    <button type="button" onClick={() => handleRequestDecision(req.id, 'rejected')} disabled={requestActionState[req.id]}
                                      className="bg-rose-500 px-3 py-2 text-xs font-extrabold uppercase text-white hover:bg-rose-400 disabled:opacity-50">Reject</button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </SectionCard>
              )}

              {/* Wallet controls */}
              {permissions.includes('manage_user_finances') && (
                <SectionCard title="Client Wallet Controls" eyebrow="Balance · Profit · Bonus">
                  {users.length === 0 ? (
                    <div className="border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/45">No investors found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1050px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/10 text-[11px] font-extrabold uppercase tracking-[.16em] text-white/40">
                            <th className="pb-3 pr-4">Investor</th><th className="pb-3 pr-4">Balance</th>
                            <th className="pb-3 pr-4">Profit</th><th className="pb-3 pr-4">Bonus</th>
                            <th className="pb-3 pr-4">Field</th><th className="pb-3 pr-4">Amount</th>
                            <th className="pb-3 pr-4">Note</th><th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {users.map(inv => {
                            const draft = financeDrafts[inv.id] || {};
                            return (
                              <tr key={inv.id} className="align-top">
                                <td className="py-4 pr-4">
                                  <p className="font-bold text-white">{inv.name}</p>
                                  <p className="mt-1 text-xs text-white/45">{inv.email}</p>
                                </td>
                                <td className="py-4 pr-4 font-black text-white">{formatCurrency(inv.account_balance)}</td>
                                <td className="py-4 pr-4 font-bold text-emerald-400">{formatCurrency(inv.total_profit)}</td>
                                <td className="py-4 pr-4 font-bold text-amber-400">{formatCurrency(inv.bonus_balance)}</td>
                                <td className="py-4 pr-4">
                                  <select value={draft.action_field || 'profit'} onChange={e => setFinanceDrafts(prev => ({ ...prev, [inv.id]: { ...prev[inv.id], action_field: e.target.value } }))}
                                    className="border border-white/10 bg-black/20 px-2 py-2 text-xs text-white outline-none w-24">
                                    <option value="profit">Profit</option><option value="balance">Balance</option><option value="bonus">Bonus</option>
                                  </select>
                                </td>
                                <td className="py-4 pr-4">
                                  <div className="relative">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40 text-xs">$</span>
                                    <input type="number" min="0" step="0.01" value={draft.amount || ''} onChange={e => setFinanceDrafts(prev => ({ ...prev, [inv.id]: { ...prev[inv.id], amount: e.target.value } }))}
                                      className="w-24 border border-white/10 bg-black/20 pl-5 pr-2 py-2 text-xs text-white outline-none" placeholder="0.00" />
                                  </div>
                                </td>
                                <td className="py-4 pr-4">
                                  <input value={draft.note || ''} onChange={e => setFinanceDrafts(prev => ({ ...prev, [inv.id]: { ...prev[inv.id], note: e.target.value } }))}
                                    className="w-full min-w-[120px] border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none" placeholder="Note…" />
                                </td>
                                <td className="py-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => handleFinanceAction(inv, `add_${draft.action_field || 'profit'}`)} disabled={financeActionState[inv.id]}
                                      className="bg-emerald-500 px-3 py-2 text-[11px] font-extrabold uppercase text-white hover:bg-emerald-400 disabled:opacity-50">+ Add</button>
                                    <button type="button" onClick={() => handleFinanceAction(inv, `reduce_${draft.action_field || 'profit'}`)} disabled={financeActionState[inv.id]}
                                      className="bg-rose-500 px-3 py-2 text-[11px] font-extrabold uppercase text-white hover:bg-rose-400 disabled:opacity-50">− Reduce</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </SectionCard>
              )}
            </div>
          )}

          {/* ══ KYC ══ */}
          {adminNav === 'kyc' && (
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-violet-400/70">Compliance</p>
                <h1 className="mt-1 text-2xl font-black text-white">KYC Document Review</h1>
              </div>
              {permissions.includes('review_user_documents') && (
                <SectionCard title="Client KYC Documents" eyebrow="Document Review">
                  {documents.length === 0 ? (
                    <div className="border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/45">No client documents uploaded yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/10 text-[11px] font-extrabold uppercase tracking-[.16em] text-white/40">
                            <th className="pb-3 pr-4">Client</th><th className="pb-3 pr-4">Document</th>
                            <th className="pb-3 pr-4">Uploaded</th><th className="pb-3 pr-4">Review Note</th>
                            <th className="pb-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {documents.map(doc => (
                            <tr key={doc.id}>
                              <td className="py-4 pr-4">
                                <p className="font-bold text-white">{doc.user?.name || 'Unknown'}</p>
                                <p className="mt-1 text-xs text-white/45">{doc.user?.email || '—'}</p>
                              </td>
                              <td className="py-4 pr-4">
                                <p className="font-bold text-white">{doc.document_name}</p>
                                <div className="mt-2 flex items-center gap-3">
                                  <span className={`text-[11px] font-extrabold uppercase tracking-wider ${statusTone(doc.status)}`}>{doc.status}</span>
                                  <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 hover:text-cyan-100">View file</a>
                                </div>
                              </td>
                              <td className="py-4 pr-4 text-xs text-white/55">{new Date(doc.created_at).toLocaleString()}</td>
                              <td className="py-4 pr-4">
                                <input value={documentNotes[doc.id] || ''} onChange={e => setDocumentNotes(prev => ({ ...prev, [doc.id]: e.target.value }))}
                                  disabled={doc.status !== 'pending'} placeholder="Review note"
                                  className="w-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/40" />
                              </td>
                              <td className="py-4 text-right">
                                {doc.status !== 'pending' ? (
                                  <span className="text-xs text-white/35">Reviewed</span>
                                ) : (
                                  <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => handleDocumentReview(doc.id, 'approved')} disabled={documentActionState[doc.id]}
                                      className="bg-emerald-500 px-3 py-2 text-[11px] font-extrabold uppercase text-white hover:bg-emerald-400 disabled:opacity-50">Approve</button>
                                    <button type="button" onClick={() => handleDocumentReview(doc.id, 'rejected')} disabled={documentActionState[doc.id]}
                                      className="bg-rose-500 px-3 py-2 text-[11px] font-extrabold uppercase text-white hover:bg-rose-400 disabled:opacity-50">Reject</button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </SectionCard>
              )}
            </div>
          )}

          {/* ══ ACCESS CONTROL ══ */}
          {adminNav === 'access' && (
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-violet-400/70">Role-Based Access Control</p>
                <h1 className="mt-1 text-2xl font-black text-white">Investor Access Controls</h1>
              </div>
              {permissions.includes('view_user_profiles') && (
                <SectionCard title="Investor Status Management" eyebrow="User Segregation & Status">
                  {users.length === 0 ? (
                    <div className="border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/45">No investor accounts found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/10 text-[11px] font-extrabold uppercase tracking-[.16em] text-white/40">
                            <th className="pb-3 pr-4">Investor</th><th className="pb-3 pr-4">Compliance</th>
                            <th className="pb-3 pr-4">Sessions</th><th className="pb-3 pr-4">Status</th>
                            <th className="pb-3 pr-4">Reason</th><th className="pb-3 text-right">Save</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {users.map(inv => {
                            const draft = userActions[inv.id] || {};
                            return (
                              <tr key={inv.id} className="align-top">
                                <td className="py-4 pr-4">
                                  <p className="font-bold text-white">{inv.name}</p>
                                  <p className="mt-1 text-xs text-white/45">{inv.email}</p>
                                  <p className="mt-1 text-[11px] text-white/35">{inv.account_type || 'Investor'}</p>
                                  <button type="button" onClick={() => openInvestorProfile(inv.id)} className="mt-2 text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 hover:text-cyan-100">Open profile</button>
                                </td>
                                <td className="py-4 pr-4 text-xs text-white/65">
                                  <p>KYC: <span className={inv.kyc_completed ? 'text-emerald-400' : 'text-amber-400'}>{inv.kyc_completed ? 'complete' : 'pending'}</span></p>
                                  <p className="mt-1">Suitability: <span className={inv.suitability_completed ? 'text-emerald-400' : 'text-amber-400'}>{inv.suitability_completed ? 'complete' : 'pending'}</span></p>
                                  <p className="mt-2 text-white/35">{inv.total_requests_count} request(s)</p>
                                </td>
                                <td className="py-4 pr-4 text-xs text-white/65">
                                  <p>{inv.active_sessions_count} active session(s)</p>
                                  <p className="mt-1">Last login {inv.last_login_at ? new Date(inv.last_login_at).toLocaleString() : '—'}</p>
                                  <p className="mt-1 text-white/35">IP {inv.last_login_ip || '—'}</p>
                                </td>
                                <td className="py-4 pr-4">
                                  <select value={draft.account_status || inv.account_status} onChange={e => setUserActions(prev => ({ ...prev, [inv.id]: { ...prev[inv.id], account_status: e.target.value } }))}
                                    className="w-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold uppercase text-white outline-none focus:border-cyan-400/40">
                                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                </td>
                                <td className="py-4 pr-4">
                                  <input value={draft.reason || ''} onChange={e => setUserActions(prev => ({ ...prev, [inv.id]: { ...prev[inv.id], reason: e.target.value } }))}
                                    placeholder="Reason for status change"
                                    className="w-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/40" />
                                </td>
                                <td className="py-4 text-right">
                                  <button type="button" onClick={() => handleUserStatusSave(inv)} disabled={userActionState[inv.id]}
                                    className="border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold uppercase text-white hover:border-cyan-400/30 hover:text-cyan-100 disabled:opacity-50">Save</button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </SectionCard>
              )}
            </div>
          )}

          {/* ══ TRANSACTIONS ══ */}
          {adminNav === 'transactions' && (
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-violet-400/70">Money Movements</p>
                <h1 className="mt-1 text-2xl font-black text-white">Transaction Oversight</h1>
              </div>
              {permissions.includes('view_money_movements') && (
                <SectionCard title="Deposits & Withdrawals" eyebrow="Transaction Oversight">
                  {moneyMovements.length === 0 ? (
                    <div className="border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/45">No money movements.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/10 text-[11px] font-extrabold uppercase tracking-[.16em] text-white/40">
                            <th className="pb-3 pr-4">Client</th><th className="pb-3 pr-4">Type</th>
                            <th className="pb-3 pr-4">Amount</th><th className="pb-3 pr-4">Reference</th>
                            <th className="pb-3 pr-4">Review Note</th><th className="pb-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {moneyMovements.map(mv => (
                            <tr key={mv.id}>
                              <td className="py-4 pr-4">
                                <p className="font-bold text-white">{mv.user?.name || 'Unknown'}</p>
                                <p className="mt-1 text-xs text-white/45">{mv.user?.email || '—'}</p>
                              </td>
                              <td className="py-4 pr-4">
                                <p className="font-bold text-white">{mv.type}</p>
                                <p className={`mt-1 text-[11px] font-extrabold uppercase tracking-wider ${statusTone(mv.status)}`}>{mv.status}</p>
                              </td>
                              <td className="py-4 pr-4 font-bold text-white">{formatCurrency(mv.amount)}</td>
                              <td className="py-4 pr-4 text-xs text-white/55">{mv.external_reference || mv.description || 'Internal'}</td>
                              <td className="py-4 pr-4">
                                <input value={movementNotes[mv.id] || ''} onChange={e => setMovementNotes(prev => ({ ...prev, [mv.id]: e.target.value }))}
                                  disabled={mv.status !== 'pending'} placeholder="Reason or desk note"
                                  className="w-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/40" />
                              </td>
                              <td className="py-4 text-right">
                                {mv.status !== 'pending' ? (
                                  <span className="text-xs text-white/35">Reviewed</span>
                                ) : (
                                  <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => handleMovementAction(mv.id, 'approve')} disabled={movementActionState[mv.id]}
                                      className="bg-emerald-500 px-3 py-2 text-[11px] font-extrabold uppercase text-white hover:bg-emerald-400 disabled:opacity-50">Approve</button>
                                    <button type="button" onClick={() => handleMovementAction(mv.id, 'reject')} disabled={movementActionState[mv.id]}
                                      className="bg-rose-500 px-3 py-2 text-[11px] font-extrabold uppercase text-white hover:bg-rose-400 disabled:opacity-50">Reject</button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </SectionCard>
              )}
            </div>
          )}

          {/* ══ PACKAGES ══ */}
          {adminNav === 'packages' && (
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-violet-400/70">Investment Products</p>
                <h1 className="mt-1 text-2xl font-black text-white">Investment Packages</h1>
              </div>
              {permissions.includes('manage_investment_packages') && (
                <SectionCard title="Create & Edit Packages" eyebrow="Package Management">
                  <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-4 border border-white/8 bg-black/20 p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          { key: 'name', placeholder: 'Package name', type: 'text' },
                          { key: 'minimum_amount', placeholder: 'Minimum amount', type: 'number' },
                          { key: 'maximum_amount', placeholder: 'Maximum amount', type: 'number' },
                          { key: 'roi_percent', placeholder: 'ROI %', type: 'number' },
                          { key: 'duration_days', placeholder: 'Duration days', type: 'number' },
                          { key: 'bonus_percent', placeholder: 'Bonus %', type: 'number' },
                        ].map(f => (
                          <input key={f.key} type={f.type} value={packageDraft[f.key]} placeholder={f.placeholder}
                            onChange={e => setPackageDraft(prev => ({ ...prev, [f.key]: e.target.value }))}
                            className="border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/40" />
                        ))}
                      </div>
                      <textarea rows={4} value={packageDraft.description} placeholder="Package description"
                        onChange={e => setPackageDraft(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/40" />
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60">
                          <input type="checkbox" checked={packageDraft.is_active} onChange={e => setPackageDraft(prev => ({ ...prev, is_active: e.target.checked }))} />
                          Active package
                        </label>
                        <input value={packageDraft.sort_order} type="number" placeholder="Sort order"
                          onChange={e => setPackageDraft(prev => ({ ...prev, sort_order: e.target.value }))}
                          className="w-28 border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none" />
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={handlePackageSave} disabled={packageSaving}
                          className="bg-cyan-500 px-4 py-3 text-xs font-extrabold uppercase tracking-[.14em] text-white hover:bg-cyan-400 disabled:opacity-50">
                          {packageSaving ? 'Saving…' : editingPackageId ? 'Update package' : 'Create package'}
                        </button>
                        {editingPackageId && (
                          <button type="button" onClick={resetPackageDraft}
                            className="border border-white/10 bg-white/5 px-4 py-3 text-xs font-extrabold uppercase text-white/70 hover:text-white">Cancel edit</button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {packages.length === 0 ? (
                        <div className="border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/45">No packages created yet.</div>
                      ) : packages.map(pkg => (
                        <div key={pkg.id} className="border border-white/8 bg-black/20 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-lg font-black text-white">{pkg.name}</p>
                              <p className="mt-2 text-sm text-white/60">{pkg.description || 'No description.'}</p>
                              <p className="mt-3 text-xs text-white/45">Min {formatCurrency(pkg.minimum_amount)} · ROI {pkg.roi_percent}% · Bonus {pkg.bonus_percent}% · {pkg.duration_days} days</p>
                            </div>
                            <button type="button" onClick={() => beginEditPackage(pkg)} className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 hover:text-cyan-100">Edit</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>
              )}
            </div>
          )}

        </div>
      </main>

      <ComplianceModal investor={selectedInvestor} onClose={() => setSelectedInvestor(null)} />
    </div>
  );
}
