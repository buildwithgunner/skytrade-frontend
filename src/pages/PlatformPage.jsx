import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  createInvestmentRequest,
  getComplianceStatus,
  getUserDashboard,
  getUserDocuments,
  getUserNotifications,
  getUserTransactions,
  markAllUserNotificationsRead,
  markUserNotificationRead,
  submitKYC,
  submitSuitability,
  submitUserTransaction,
  uploadUserDocument,
} from '../lib/api';

/* ─── Helpers ─── */
function fmt(value) {
  return `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function pct(value) {
  const n = Number(value || 0);
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}
const inputCls =
  'w-full border border-white/10 bg-[#0a1628] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/60 rounded-sm';
const labelCls = 'block text-xs font-bold uppercase tracking-wider text-white/50 mb-2';
const selectCls = `${inputCls} cursor-pointer`;

/* ─── Stat Card ─── */
function StatCard({ label, value, sub, tone = 'neutral', icon }) {
  const toneClass =
    tone === 'positive' ? 'text-emerald-400' : tone === 'negative' ? 'text-rose-400' : 'text-white';
  const barClass =
    tone === 'positive' ? 'bg-emerald-500' : tone === 'negative' ? 'bg-rose-500' : tone === 'bonus' ? 'bg-amber-400' : 'bg-cyan-500';
  return (
    <div className="relative overflow-hidden border border-white/10 bg-white/[.03] p-5 rounded-sm backdrop-blur-sm">
      <div className={`absolute left-0 top-0 h-full w-1 ${barClass}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-white/45">{label}</p>
          <p className={`mt-3 text-2xl font-black sm:text-3xl ${toneClass}`}>{value}</p>
          {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
        </div>
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-white/5 border border-white/8 flex items-center justify-center text-white/40">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Status Badge ─── */
function Badge({ status }) {
  const map = {
    approved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    pending:  'text-amber-400 bg-amber-500/10 border-amber-500/30 animate-pulse',
    rejected: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    review:   'text-blue-400 bg-blue-500/10 border-blue-500/30',
  };
  return (
    <span className={`inline-block border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-sm ${map[status] || map.pending}`}>
      {status}
    </span>
  );
}

/* ─── Tab Button ─── */
function Tab({ id, label, active, onClick, badge }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`relative px-4 py-3 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
        active ? 'text-white border-b-2 border-cyan-400 -mb-px bg-white/5' : 'text-white/40 hover:text-white/70'
      }`}
    >
      {label}
      {badge > 0 && (
        <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-cyan-500 text-[9px] font-black text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab({ dashboard, onTab }) {
  const packages = dashboard?.packages || [];
  const requests = dashboard?.requests || [];
  const approvedReqs = requests.filter((r) => r.status === 'approved');

  return (
    <div className="space-y-8">
      {/* Portfolio chart */}
      <div className="rounded-sm bg-[#0a1225] border border-cyan-500/10 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-cyan-400">Portfolio Performance</p>
            <p className="mt-1 text-lg font-black text-white">Investment growth tracker</p>
          </div>
          <span className="border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/50 rounded-sm">Last 30 days</span>
        </div>
        <div className="relative h-48 overflow-hidden border-l border-b border-white/10 rounded-bl-sm">
          <div className="absolute bottom-0 left-0 h-32 w-full bg-[linear-gradient(to_top,rgba(6,182,212,.2),transparent)]" />
          <svg viewBox="0 0 680 192" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pg2" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#06b6d4" stopOpacity=".5" />
                <stop offset="1" stopColor="#06b6d4" stopOpacity=".02" />
              </linearGradient>
            </defs>
            <path d="M0 160 H100 C130 160 125 130 150 128 S185 148 210 118 S245 78 275 105 S312 145 340 95 S378 52 408 70 S422 138 460 110 S476 42 508 38 S526 78 562 72 H680" fill="none" stroke="#06b6d4" strokeWidth="3" />
            <path d="M0 160 H100 C130 160 125 130 150 128 S185 148 210 118 S245 78 275 105 S312 145 340 95 S378 52 408 70 S422 138 460 110 S476 42 508 38 S526 78 562 72 H680 V192 H0Z" fill="url(#pg2)" />
          </svg>
        </div>
      </div>

      {/* Active investment requests */}
      {approvedReqs.length > 0 && (
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-cyan-400 mb-4">Active Investments</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {approvedReqs.map((req) => (
              <div key={req.id} className="border border-emerald-500/20 bg-emerald-950/10 p-4 rounded-sm">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-white">{req.asset_type}</p>
                  <Badge status={req.status} />
                </div>
                <p className="mt-2 text-xl font-black text-emerald-400">{fmt(req.amount)}</p>
                <p className="text-xs text-white/45 mt-1">{req.funding_source} · {req.frequency}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Packages */}
      {packages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-cyan-400">Investment Packages</p>
            <button onClick={() => onTab('invest')} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition">
              Invest now →
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div key={pkg.id} className="border border-cyan-500/15 bg-white/[.02] p-5 rounded-sm hover:border-cyan-400/30 transition-colors">
                <p className="font-extrabold text-white">{pkg.name}</p>
                <p className="mt-1 text-xs text-white/50 leading-relaxed">{pkg.description || 'No description.'}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/35 block">Min. Deposit</span>
                    <span className="font-black text-white">{fmt(pkg.minimum_amount)}</span>
                  </div>
                  <div>
                    <span className="text-white/35 block">ROI</span>
                    <span className="font-black text-emerald-400">{pkg.roi_percent}%</span>
                  </div>
                  <div>
                    <span className="text-white/35 block">Bonus</span>
                    <span className="font-black text-amber-400">{pkg.bonus_percent}%</span>
                  </div>
                  <div>
                    <span className="text-white/35 block">Duration</span>
                    <span className="font-black text-white">{pkg.duration_days} days</span>
                  </div>
                </div>
                <button
                  onClick={() => onTab('invest')}
                  className="mt-4 w-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/25 text-cyan-300 text-xs font-extrabold py-2 rounded-sm transition cursor-pointer"
                >
                  Select Package
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {packages.length === 0 && approvedReqs.length === 0 && (
        <div className="border border-dashed border-cyan-500/20 rounded-sm p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-white/60 text-sm">No active investments yet.</p>
          <button onClick={() => onTab('deposit')} className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-extrabold px-6 py-2.5 rounded-sm transition cursor-pointer">
            Make Your First Deposit
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Deposit / Withdrawal Tab ─── */
function DepositTab({ onSuccess }) {
  const [type, setType] = useState('deposit');
  const [form, setForm] = useState({ amount: '', payment_method: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: '', error: '' });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) < 10) {
      setStatus({ success: '', error: 'Minimum amount is $10.00.' });
      return;
    }
    setStatus({ success: '', error: '' });
    setLoading(true);
    try {
      await submitUserTransaction({ type, ...form });
      setStatus({ success: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request submitted! Pending broker review.`, error: '' });
      setForm({ amount: '', payment_method: '', description: '' });
      onSuccess?.();
    } catch (err) {
      setStatus({ success: '', error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Type toggle */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {['deposit', 'withdrawal'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`py-3 text-sm font-extrabold border rounded-sm transition cursor-pointer ${
              type === t
                ? t === 'deposit'
                  ? 'border-emerald-400 bg-emerald-900/30 text-emerald-300'
                  : 'border-rose-400 bg-rose-900/30 text-rose-300'
                : 'border-white/10 text-white/40 hover:border-white/25'
            }`}
          >
            {t === 'deposit' ? '↓ Deposit Funds' : '↑ Withdraw Funds'}
          </button>
        ))}
      </div>

      {status.success && (
        <div className="mb-5 border border-emerald-500/25 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300 rounded-sm">
          ✓ {status.success}
        </div>
      )}
      {status.error && (
        <div className="mb-5 border border-rose-500/25 bg-rose-950/30 px-4 py-3 text-sm text-rose-300 rounded-sm">
          {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelCls}>Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-black text-sm">$</span>
            <input
              required type="number" min="10" step="0.01"
              value={form.amount} onChange={set('amount')}
              placeholder="0.00"
              className={`${inputCls} pl-8`}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Payment Method</label>
          <select value={form.payment_method} onChange={set('payment_method')} className={selectCls}>
            <option value="" style={{ background: '#0a1628' }}>Select method</option>
            {['Bank Wire Transfer', 'ACH Direct Debit', 'Credit / Debit Card', 'Cryptocurrency', 'Other'].map((m) => (
              <option key={m} value={m} style={{ background: '#0a1628', color: '#fff' }}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Reference / Notes (optional)</label>
          <textarea
            rows={2} value={form.description} onChange={set('description')}
            placeholder="Transaction reference, bank details, or additional notes..."
            className={`${inputCls} resize-none`}
          />
        </div>

        {type === 'deposit' && (
  <div>
    <p>Routing / SWIFT: <span className="text-white">SKYTUS33</span></p>
    <p className="mt-2 text-white/40">Include your registered email as payment reference.</p>
  </div>
)}

        <button
          type="submit" disabled={loading}
          className={`w-full py-3.5 text-sm font-extrabold text-white rounded-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            type === 'deposit'
              ? 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
              : 'bg-rose-500 hover:bg-rose-400 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
          }`}
        >
          {loading ? 'Submitting...' : type === 'deposit' ? 'Submit Deposit Request' : 'Submit Withdrawal Request'}
        </button>
      </form>
    </div>
  );
}

/* ─── Transactions Tab ─── */
function TransactionsTab() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserTransactions({ limit: 50 })
      .then((d) => setTransactions(d.movements || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-white">Transaction History</h3>
        <span className="text-xs text-white/40">{transactions.length} records</span>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-white/40 animate-pulse">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-sm py-12 text-center">
          <p className="text-white/40 text-sm">No transactions yet.</p>
          <p className="text-xs text-white/25 mt-1">Deposits and withdrawals will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/35 uppercase font-bold tracking-wider">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Method / Notes</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-4 pr-4 text-white/55">
                    {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`font-extrabold uppercase text-[10px] ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'deposit' ? '↓ Deposit' : '↑ Withdrawal'}
                    </span>
                  </td>
                  <td className="py-4 pr-4 font-black text-white text-sm">{fmt(tx.amount)}</td>
                  <td className="py-4 pr-4 text-white/55 max-w-[200px] truncate">{tx.description || '—'}</td>
                  <td className="py-4 text-right"><Badge status={tx.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Documents Tab ─── */
function DocumentsTab() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ success: '', error: '' });
  const fileRef = useRef();

  const load = useCallback(() => {
    setLoading(true);
    getUserDocuments()
      .then((d) => setDocuments(d.documents || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!docType || !file) {
      setUploadStatus({ success: '', error: 'Please select a document type and file.' });
      return;
    }
    setUploading(true);
    setUploadStatus({ success: '', error: '' });
    try {
      await uploadUserDocument({ type: docType, file });
      setUploadStatus({ success: 'Document uploaded successfully. Pending admin review.', error: '' });
      setFile(null);
      setDocType('');
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch (err) {
      setUploadStatus({ success: '', error: err.message });
    } finally {
      setUploading(false);
    }
  };

  const docTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID' },
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'proof_of_address', label: 'Proof of Address' },
    { value: 'bank_statement', label: 'Bank Statement' },
    { value: 'tax_document', label: 'Tax Document' },
    { value: 'selfie_with_id', label: 'Selfie with ID' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-8">
      {/* Upload form */}
      <div className="border border-cyan-500/15 bg-white/[.02] p-6 rounded-sm">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-cyan-400 mb-1">Upload Document</p>
        <p className="text-xs text-white/45 mb-5">Submit your KYC and compliance documents for broker verification.</p>

        {uploadStatus.success && (
          <div className="mb-4 border border-emerald-500/25 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300 rounded-sm">✓ {uploadStatus.success}</div>
        )}
        {uploadStatus.error && (
          <div className="mb-4 border border-rose-500/25 bg-rose-950/30 px-4 py-3 text-sm text-rose-300 rounded-sm">{uploadStatus.error}</div>
        )}

        <form onSubmit={handleUpload} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className={labelCls}>Document Type</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)} className={selectCls}>
              <option value="" style={{ background: '#0a1628' }}>Select type</option>
              {docTypes.map((d) => (
                <option key={d.value} value={d.value} style={{ background: '#0a1628', color: '#fff' }}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>File (PDF, JPG, PNG)</label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border border-white/10 bg-[#0a1628] px-3 py-2.5 text-sm text-white/60 rounded-sm file:mr-3 file:border-0 file:bg-cyan-500/20 file:text-cyan-300 file:text-xs file:font-bold file:px-3 file:py-1 file:rounded-sm cursor-pointer"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit" disabled={uploading}
              className="h-[46px] bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-extrabold px-6 rounded-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>

      {/* Documents list */}
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-white/40 mb-4">Uploaded Documents</p>
        {loading ? (
          <div className="py-8 text-center text-sm text-white/40 animate-pulse">Loading...</div>
        ) : documents.length === 0 ? (
          <div className="border border-dashed border-white/10 py-10 text-center rounded-sm">
            <p className="text-white/40 text-sm">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-white/8 bg-white/[.015] p-4 rounded-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white capitalize">{(doc.type || '').replace(/_/g, ' ')}</p>
                    <p className="text-[11px] text-white/35 mt-0.5">
                      {new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {doc.reviewer && ` · Reviewed by ${doc.reviewer.name}`}
                    </p>
                    {doc.review_notes && (
                      <p className="text-[11px] text-white/45 mt-0.5 italic">"{doc.review_notes}"</p>
                    )}
                  </div>
                </div>
                <Badge status={doc.status || 'pending'} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Notifications Tab ─── */
function NotificationsTab() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getUserNotifications({ limit: 30 })
      .then((d) => setNotifications(d.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleMarkRead = async (id) => {
    await markUserNotificationRead(id).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  const handleMarkAll = async () => {
    await markAllUserNotificationsRead().catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const severityBorder = (n) => {
    if (n.severity === 'critical' || n.severity === 'warning') return 'border-amber-500/25 bg-amber-950/10';
    if (n.severity === 'success') return 'border-emerald-500/20 bg-emerald-950/10';
    return !n.read_at ? 'border-cyan-500/20 bg-cyan-950/10' : 'border-white/8 bg-white/[.015]';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-white">Account Notifications</h3>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-extrabold text-cyan-300 rounded-full">
              {unreadCount} unread
            </span>
          )}
          <button
            onClick={handleMarkAll}
            disabled={unreadCount === 0}
            className="border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-white/60 rounded-sm transition hover:border-cyan-400/30 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Mark all read
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-white/40 animate-pulse">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="border border-dashed border-white/10 py-12 text-center rounded-sm">
          <p className="text-white/40 text-sm">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className={`border p-4 rounded-sm transition ${severityBorder(n)}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{n.title || 'Account update'}</p>
                  <p className="mt-1 text-xs leading-5 text-white/55">
                    {n.data?.message || n.data?.review_notes || n.type?.replaceAll('_', ' ')}
                  </p>
                  <p className="mt-2 text-[10px] text-white/30">{new Date(n.created_at).toLocaleString()}</p>
                </div>
                {!n.read_at && (
                  <button onClick={() => handleMarkRead(n.id)} className="text-[10px] font-extrabold uppercase text-cyan-400 hover:text-cyan-200 transition cursor-pointer">
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── KYC Compliance Wizard ─── */
const STEP_LABELS = ['Identity (KYC)', 'Suitability', 'Complete'];

function KYCStep({ onComplete, onError }) {
  const [form, setForm] = useState({ phone: '', address: '', zip_code: '', dob: '', government_id: '' });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { onComplete((await submitKYC(form)).user); }
    catch (err) { onError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={labelCls}>Phone Number</label><input required value={form.phone} onChange={set('phone')} placeholder="+1 555 000 0000" className={inputCls} /></div>
        <div><label className={labelCls}>Date of Birth</label><input required type="date" value={form.dob} onChange={set('dob')} className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Residential Address</label><input required value={form.address} onChange={set('address')} placeholder="123 Main St, City, State" className={inputCls} /></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={labelCls}>Zip / Postal Code</label><input required value={form.zip_code} onChange={set('zip_code')} placeholder="10001" className={inputCls} /></div>
        <div><label className={labelCls}>Government ID Number</label><input required value={form.government_id} onChange={set('government_id')} placeholder="Passport / Driver's License" className={inputCls} /></div>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 py-3.5 text-sm font-extrabold text-white rounded-sm transition disabled:opacity-50 cursor-pointer">
        {loading ? 'Saving...' : 'Continue to Suitability →'}
      </button>
    </form>
  );
}

function SuitabilityStep({ onComplete, onError }) {
  const [form, setForm] = useState({ annual_income: '', employment_status: '', source_of_funds: '', knowledge_level: '', experience_assets: [], risk_tolerance_scenario: '', investment_goals: '' });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const toggle = (a) => setForm((p) => ({ ...p, experience_assets: p.experience_assets.includes(a) ? p.experience_assets.filter((x) => x !== a) : [...p.experience_assets, a] }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.experience_assets.length) { onError('Select at least one asset class.'); return; }
    setLoading(true);
    try { onComplete((await submitSuitability(form)).user); }
    catch (err) { onError(err.message); }
    finally { setLoading(false); }
  };
  const assets = ['Stocks & Equities', 'Bonds & Fixed Income', 'Forex', 'Cryptocurrencies', 'Real Estate', 'Commodities', 'ETFs & Mutual Funds', 'None'];
  const risks = [
    { value: 'sell_all', label: 'Sell everything — capital preservation' },
    { value: 'sell_some', label: 'Sell some to reduce exposure' },
    { value: 'hold', label: 'Hold and wait for recovery' },
    { value: 'buy_more', label: 'Buy more — opportunity seeker' },
  ];
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Annual Income</label>
          <select required value={form.annual_income} onChange={set('annual_income')} className={selectCls}>
            <option value="" style={{ background: '#0a1628' }}>Select bracket</option>
            {['Under $25,000', '$25,000–$50,000', '$50,000–$100,000', '$100,000–$250,000', 'Over $250,000'].map((v) => (
              <option key={v} value={v} style={{ background: '#0a1628', color: '#fff' }}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Employment Status</label>
          <select required value={form.employment_status} onChange={set('employment_status')} className={selectCls}>
            <option value="" style={{ background: '#0a1628' }}>Select status</option>
            {['Employed (Full-time)', 'Self-Employed', 'Business Owner', 'Retired', 'Student', 'Unemployed'].map((v) => (
              <option key={v} value={v} style={{ background: '#0a1628', color: '#fff' }}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Source of Funds</label>
          <select required value={form.source_of_funds} onChange={set('source_of_funds')} className={selectCls}>
            <option value="" style={{ background: '#0a1628' }}>Select source</option>
            {['Salary', 'Business Revenue', 'Investments', 'Inheritance', 'Savings'].map((v) => (
              <option key={v} value={v} style={{ background: '#0a1628', color: '#fff' }}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Investment Goal</label>
          <select required value={form.investment_goals} onChange={set('investment_goals')} className={selectCls}>
            <option value="" style={{ background: '#0a1628' }}>Select goal</option>
            {['Capital Growth', 'Income Generation', 'Capital Preservation', 'Speculation'].map((v) => (
              <option key={v} value={v} style={{ background: '#0a1628', color: '#fff' }}>{v}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Knowledge Level</label>
        <div className="grid grid-cols-3 gap-2">
          {['Novice', 'Intermediate', 'Professional'].map((v) => (
            <button type="button" key={v} onClick={() => setForm((p) => ({ ...p, knowledge_level: v }))}
              className={`py-3 text-sm font-bold border rounded-sm transition cursor-pointer ${form.knowledge_level === v ? 'border-cyan-400 bg-cyan-900/40 text-cyan-200' : 'border-white/10 text-white/45 hover:border-cyan-500/30'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelCls}>Asset Classes Traded</label>
        <div className="flex flex-wrap gap-2">
          {assets.map((a) => (
            <button type="button" key={a} onClick={() => toggle(a)}
              className={`px-3 py-1.5 text-xs font-bold border rounded-sm transition cursor-pointer ${form.experience_assets.includes(a) ? 'border-cyan-400 bg-cyan-900/40 text-cyan-200' : 'border-white/10 text-white/45 hover:border-cyan-500/30'}`}>
              {a}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelCls}>If portfolio dropped 20%, you would:</label>
        <div className="space-y-2">
          {risks.map(({ value, label }) => (
            <button type="button" key={value} onClick={() => setForm((p) => ({ ...p, risk_tolerance_scenario: value }))}
              className={`w-full text-left px-4 py-3 text-sm border rounded-sm transition cursor-pointer ${form.risk_tolerance_scenario === value ? 'border-cyan-400 bg-cyan-900/30 text-cyan-100' : 'border-white/8 text-white/55 hover:border-cyan-500/30'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 py-3.5 text-sm font-extrabold text-white rounded-sm transition disabled:opacity-50 cursor-pointer">
        {loading ? 'Saving...' : 'Complete Profile →'}
      </button>
    </form>
  );
}

function ComplianceWizard({ user, onDone }) {
  const [step, setStep] = useState(user?.kyc_completed ? 2 : 1);
  const [error, setError] = useState('');
  const done = [user?.kyc_completed, user?.suitability_completed];
  return (
    <div className="max-w-2xl mx-auto">
      <div className="border border-amber-500/25 bg-amber-950/15 p-4 rounded-sm mb-6">
        <p className="text-sm font-extrabold text-amber-300">Compliance required before investing</p>
        <p className="text-xs text-amber-200/60 mt-1">Complete your KYC identity check and suitability questionnaire to unlock deposits and investments.</p>
      </div>
      {/* Steps */}
      <div className="flex gap-2 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className={`flex-1 border-t-2 pt-2 text-xs font-bold ${i + 1 <= step ? 'border-cyan-400 text-cyan-400' : 'border-white/10 text-white/30'}`}>
            <span className="mr-1">{i + 1 < step ? '✓' : `${i + 1}.`}</span>{label}
          </div>
        ))}
      </div>
      {error && <div className="mb-4 border border-rose-500/25 bg-rose-950/30 px-4 py-3 text-sm text-rose-300 rounded-sm">{error}</div>}
      {step === 1 && <KYCStep onComplete={(u) => { setStep(2); setError(''); }} onError={setError} />}
      {step === 2 && <SuitabilityStep onComplete={(u) => { setStep(3); setError(''); onDone?.(u); }} onError={setError} />}
      {step === 3 && (
        <div className="text-center py-10 border border-emerald-500/25 bg-emerald-950/20 rounded-sm">
          <div className="text-4xl mb-3">✓</div>
          <p className="text-lg font-black text-emerald-400">Profile Complete!</p>
          <p className="text-sm text-white/55 mt-2">Your compliance profile has been submitted. You can now make deposits and investments.</p>
        </div>
      )}
    </div>
  );
}

/* ─── Investment Form Tab ─── */
function InvestTab({ user }) {
  const [compUser, setCompUser] = useState(user);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getComplianceStatus()
      .then((d) => setCompUser(d.user))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <div className="py-10 text-center text-white/40 animate-pulse text-sm">Checking compliance status...</div>;
  if (!compUser?.kyc_completed || !compUser?.suitability_completed)
    return <ComplianceWizard user={compUser} onDone={setCompUser} />;

  return <InvestmentForm />;
}

function InvestmentForm() {
  const [form, setForm] = useState({ asset_type: '', amount: '', funding_source: '', frequency: 'one-time', message: '' });
  const [attestations, setAttestations] = useState({ market_risk: false, liquidity: false, fees: false });
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const toggleAttest = (k) => setAttestations((p) => ({ ...p, [k]: !p[k] }));
  const allAttested = Object.values(attestations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.asset_type || !form.amount || !form.funding_source) {
      setStatus({ loading: false, success: '', error: 'Please fill all required fields.' });
      return;
    }
    setStatus({ loading: true, success: '', error: '' });
    try {
      await createInvestmentRequest(form);
      setStatus({ loading: false, success: `Investment request of ${fmt(form.amount)} submitted successfully!`, error: '' });
      setForm({ asset_type: '', amount: '', funding_source: '', frequency: 'one-time', message: '' });
      setAttestations({ market_risk: false, liquidity: false, fees: false });
    } catch (err) {
      setStatus({ loading: false, success: '', error: err.message });
    }
  };

  const frequencies = [{ value: 'one-time', label: 'One Time' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }];

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-cyan-400 mb-1">Capital Allocation</p>
        <h3 className="text-2xl font-black text-white">New Investment Request</h3>
        <p className="text-xs text-white/45 mt-2 leading-relaxed">Submit your investment parameters. Our broker desk will review and process your request.</p>
      </div>
      {status.success && <div className="mb-5 border border-emerald-500/25 bg-emerald-950/30 p-4 text-sm text-emerald-300 rounded-sm">✓ {status.success}</div>}
      {status.error && <div className="mb-5 border border-rose-500/25 bg-rose-950/30 p-4 text-sm text-rose-300 rounded-sm">{status.error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Asset Class</label>
            <select required value={form.asset_type} onChange={set('asset_type')} className={selectCls}>
              <option value="" style={{ background: '#0a1628' }}>Select asset</option>
              {['Stocks & Equities', 'Forex', 'Commodities', 'Cryptocurrencies', 'ETFs & Mutual Funds', 'Bonds', 'Real Estate'].map((v) => (
                <option key={v} value={v} style={{ background: '#0a1628', color: '#fff' }}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Investment Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-black text-sm">$</span>
              <input required type="number" min="100" step="0.01" value={form.amount} onChange={set('amount')} placeholder="0.00" className={`${inputCls} pl-8`} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Funding Source</label>
            <select required value={form.funding_source} onChange={set('funding_source')} className={selectCls}>
              <option value="" style={{ background: '#0a1628' }}>Select source</option>
              {['Bank Wire Transfer', 'ACH Direct Debit', 'Account Balance', 'Rollover Investment'].map((v) => (
                <option key={v} value={v} style={{ background: '#0a1628', color: '#fff' }}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Frequency</label>
            <div className="grid grid-cols-2 gap-2">
              {frequencies.map(({ value, label }) => (
                <button type="button" key={value} onClick={() => setForm((p) => ({ ...p, frequency: value }))}
                  className={`py-3 text-xs font-bold border rounded-sm transition cursor-pointer ${form.frequency === value ? 'border-cyan-400 bg-cyan-900/40 text-cyan-200' : 'border-white/10 text-white/45 hover:border-cyan-500/30'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className={labelCls}>Additional Notes (optional)</label>
          <textarea rows={2} value={form.message} onChange={set('message')} placeholder="Specific instructions or broker notes..." className={`${inputCls} resize-none`} />
        </div>
        <div className="border border-white/8 bg-white/[.015] p-4 space-y-3 rounded-sm">
          <p className="text-xs font-extrabold uppercase tracking-wider text-white/40">Legal Disclosures</p>
          {[
            { key: 'market_risk', text: 'I acknowledge all investments carry market risk and the value may decrease substantially.' },
            { key: 'liquidity', text: 'I understand certain assets may have liquidity locking periods.' },
            { key: 'fees', text: 'I accept Skytrade\'s fee schedule including management and execution fees.' },
          ].map(({ key, text }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer group">
              <div onClick={() => toggleAttest(key)} className={`mt-0.5 flex-shrink-0 h-4 w-4 border transition cursor-pointer rounded-sm ${attestations[key] ? 'border-cyan-400 bg-cyan-500' : 'border-white/20 group-hover:border-cyan-400/40'}`}>
                {attestations[key] && <span className="flex h-full w-full items-center justify-center text-white text-[10px] font-black">✓</span>}
              </div>
              <span className="text-xs leading-relaxed text-white/55 group-hover:text-white/75 transition">{text}</span>
            </label>
          ))}
        </div>
        <button type="submit" disabled={status.loading || !allAttested}
          className="w-full bg-cyan-500 hover:bg-cyan-400 py-3.5 text-sm font-extrabold text-white rounded-sm shadow-[0_0_30px_rgba(6,182,212,0.25)] transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
          {status.loading ? 'Processing...' : `Submit Investment Request${form.amount ? ` — ${fmt(form.amount)}` : ''}`}
        </button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN CLIENT DASHBOARD
══════════════════════════════════════════════ */
export default function PlatformPage({ content, user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadDashboard = useCallback(({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    getUserDashboard()
      .then((d) => setDashboard(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) loadDashboard();
  }, [user, loadDashboard]);

  // Poll dashboard & notifications every 5 seconds
  useEffect(() => {
    if (!user) return;
    const poll = () => {
      loadDashboard({ silent: true });
      getUserNotifications({ limit: 1 })
        .then((d) => setUnreadCount(d.summary?.unread_count ?? 0))
        .catch(() => {});
    };
    poll();
    const id = window.setInterval(poll, 5000);
    return () => window.clearInterval(id);
  }, [user, loadDashboard]);

  const summary = dashboard?.summary || {};
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'deposit', label: 'Deposit / Withdraw' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'invest', label: 'New Investment' },
    { id: 'documents', label: 'Documents' },
    { id: 'notifications', label: 'Notifications', badge: unreadCount },
  ];

  return (
    <main className="relative z-10 px-5 pb-24 pt-28 sm:px-8 lg:px-12">
      {/* Glow */}
      <div className="absolute inset-x-0 top-24 h-64 bg-[linear-gradient(165deg,transparent_10%,rgba(6,182,212,.15)_44%,rgba(59,130,246,.1)_55%,transparent_72%)] blur-xl pointer-events-none" />

      <section className="relative mx-auto max-w-7xl">

        {/* ── Welcome Banner ── */}
        <div className="relative border border-cyan-500/20 bg-gradient-to-r from-[#061525] via-[#081d30] to-[#061525] px-6 py-6 rounded-sm overflow-hidden mb-8">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(6,182,212,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,.3)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-cyan-400 mb-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="text-2xl font-black text-white sm:text-3xl">
                Welcome to <span className="text-cyan-400">Skytrade Limited</span>
                {user?.name && <span className="text-white/60 font-medium text-xl">, {user.name.split(' ')[0]}</span>}
              </h1>
              <p className="mt-1 text-sm text-white/55">
                {summary.balance > 0
                  ? 'Your account is active. Monitor your portfolio below.'
                  : 'Make a deposit to get started with your investments.'}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setActiveTab('deposit')}
                className="bg-cyan-500 hover:bg-cyan-400 text-white font-extrabold text-xs px-5 py-2.5 rounded-sm shadow-[0_0_20px_rgba(6,182,212,0.25)] transition cursor-pointer"
              >
                Make a Deposit
              </button>
              <button
                onClick={() => setActiveTab('invest')}
                className="border border-white/15 bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs px-5 py-2.5 rounded-sm transition cursor-pointer"
              >
                New Investment
              </button>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 border border-white/5 bg-white/[.02] rounded-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
            <StatCard
              label="Account Balance"
              value={fmt(summary.balance)}
              sub="Available funds"
              tone="neutral"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>}
            />
            <StatCard
              label="Total Profit"
              value={fmt(summary.total_profit)}
              sub="Cumulative earnings"
              tone={summary.total_profit >= 0 ? 'positive' : 'negative'}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            />
            <StatCard
              label="Bonus"
              value={fmt(summary.bonus)}
              sub="Promotional credits"
              tone="bonus"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>}
            />
            <StatCard
              label="Active Investments"
              value={summary.approved_requests ?? 0}
              sub="Approved requests"
              tone="neutral"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
            />
          </div>
        )}

        {/* ── Tab Panel ── */}
        <div className="border border-cyan-500/15 bg-[#060f1d] rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {/* Tab bar */}
          <div className="flex gap-0 border-b border-white/8 px-2 overflow-x-auto">
            {tabs.map((t) => (
              <Tab key={t.id} id={t.id} label={t.label} active={activeTab === t.id} onClick={setActiveTab} badge={t.badge} />
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6 lg:p-8">
            {activeTab === 'overview'      && <OverviewTab dashboard={dashboard} onTab={setActiveTab} />}
            {activeTab === 'deposit'       && <DepositTab onSuccess={loadDashboard} />}
            {activeTab === 'transactions'  && <TransactionsTab />}
            {activeTab === 'invest'        && <InvestTab user={user} />}
            {activeTab === 'documents'     && <DocumentsTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
          </div>
        </div>
      </section>
    </main>
  );
}
