const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
export const TOKEN_KEY = 'skytrade_auth_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
    }

    const message = data.message || Object.values(data.errors || {})?.[0]?.[0] || 'Request failed. Please try again.';
    throw new Error(message);
  }

  return data;
}

export function getSiteContent() {
  return apiRequest('/site-content');
}

export async function submitAuth({ mode, role, values }) {
  const payload = { ...values, role };
  const path = mode === 'signup' ? '/auth/register' : '/auth/login';
  const data = await apiRequest(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

export async function verifyAdminMfa(challenge_token, code) {
  const data = await apiRequest('/auth/admin/verify-mfa', {
    method: 'POST',
    body: JSON.stringify({ challenge_token, code }),
  });
  setToken(data.token);
  return data;
}

export function createInvestmentRequest(values) {
  return apiRequest('/requests', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function getUserRequests() {
  return apiRequest('/requests');
}

export function getAdminRequests(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/admin/requests${query ? `?${query}` : ''}`);
}

export function getAdminOverview() {
  return apiRequest('/admin/overview');
}

export function getAdminUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/admin/users${query ? `?${query}` : ''}`);
}

export function getAdminUserProfile(id) {
  return apiRequest(`/admin/users/${id}`);
}

export function updateAdminUserStatus(id, account_status, reason) {
  return apiRequest(`/admin/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ account_status, reason }),
  });
}

export function updateRequestStatus(id, status, review_notes) {
  return apiRequest(`/admin/requests/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, review_notes }),
  });
}

export function getAdminNotifications(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/admin/notifications${query ? `?${query}` : ''}`);
}

export function getAdminMoneyMovements(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/admin/money-movements${query ? `?${query}` : ''}`);
}

export function approveAdminMoneyMovement(id) {
  return apiRequest(`/admin/money-movements/${id}/approve`, {
    method: 'PUT',
  });
}

export function rejectAdminMoneyMovement(id, review_notes) {
  return apiRequest(`/admin/money-movements/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ review_notes }),
  });
}

export function reconcileAdminMoneyMovement(id, payload) {
  return apiRequest(`/admin/money-movements/${id}/reconcile`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateAdminUserFinance(id, action, amount, note) {
  return apiRequest(`/admin/users/${id}/finance`, {
    method: 'POST',
    body: JSON.stringify({ action, amount, note }),
  });
}

export function getAdminPackages() {
  return apiRequest('/admin/packages');
}

export function createAdminPackage(payload) {
  return apiRequest('/admin/packages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateAdminPackage(id, payload) {
  return apiRequest(`/admin/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function getAdminDocuments(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/admin/documents${query ? `?${query}` : ''}`);
}

export function reviewAdminDocument(id, status, review_notes) {
  return apiRequest(`/admin/documents/${id}/review`, {
    method: 'PUT',
    body: JSON.stringify({ status, review_notes }),
  });
}

export function getAdminAuditLogs(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/admin/audit-logs${query ? `?${query}` : ''}`);
}

export function markNotificationRead(id) {
  return apiRequest(`/admin/notifications/${id}/read`, {
    method: 'POST',
  });
}

export function markAllAdminNotificationsRead() {
  return apiRequest('/admin/notifications/read-all', {
    method: 'POST',
  });
}

export function getUserNotifications(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/notifications${query ? `?${query}` : ''}`);
}

export function markUserNotificationRead(id) {
  return apiRequest(`/notifications/${id}/read`, {
    method: 'POST',
  });
}

export function markAllUserNotificationsRead() {
  return apiRequest('/notifications/read-all', {
    method: 'POST',
  });
}

export function getComplianceStatus() {
  return apiRequest('/user/compliance-status');
}

export function submitKYC(data) {
  return apiRequest('/user/kyc', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function submitSuitability(data) {
  return apiRequest('/user/suitability', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getUserDashboard() {
  return apiRequest('/user/dashboard');
}

export function getUserDocuments() {
  return apiRequest('/user/documents');
}

export function uploadUserDocument({ type, file }) {
  const formData = new FormData();
  formData.append('type', type);
  formData.append('document', file);

  return apiRequest('/user/documents', {
    method: 'POST',
    body: formData,
  });
}

export function getUserTransactions(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/user/transactions${query ? `?${query}` : ''}`);
}

export function submitUserTransaction(payload) {
  return apiRequest('/user/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyUserOtp(challenge_token, code) {
  const data = await apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ challenge_token, code }),
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

export function resendUserOtp(challenge_token) {
  return apiRequest('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ challenge_token }),
  });
}

