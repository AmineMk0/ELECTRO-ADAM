import { AdminAuthError } from './adminAuth';

export class AdminSessionError extends AdminAuthError {
  constructor(message, code) {
    super(message);
    this.name = 'AdminSessionError';
    this.code = code;
  }
}

export function dashboardPreviewEnabled() {
  return import.meta.env.DEV
    && import.meta.env.VITE_ADMIN_DASHBOARD_PREVIEW === 'true'
    && !import.meta.env.VITE_ADMIN_API_BASE_URL?.trim();
}

function apiOrigin() {
  const configured = import.meta.env.VITE_ADMIN_API_BASE_URL?.trim();
  if (!configured) throw new AdminSessionError('الإدارة غير متاحة حالياً.', 'unconfigured');
  try {
    const url = new URL(configured);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error();
    return url.origin;
  } catch {
    throw new AdminSessionError('تعذر الاتصال بخدمة الإدارة.', 'configuration');
  }
}

async function responseBody(response) {
  if (!response.headers.get('content-type')?.includes('application/json')) throw new AdminSessionError('تعذر التحقق من الجلسة.', 'invalid-response');
  try { return await response.json(); } catch { throw new AdminSessionError('تعذر التحقق من الجلسة.', 'invalid-response'); }
}

export async function getAdminSession({ signal } = {}) {
  const response = await fetch(`${apiOrigin()}/api/admin/user`, {
    credentials: 'include', redirect: 'error', headers: { Accept: 'application/json' }, signal,
  });
  if ([401, 403, 419].includes(response.status)) throw new AdminSessionError('يرجى تسجيل الدخول بحساب إداري.', 'unauthorized');
  if (!response.ok) throw new AdminSessionError('تعذر التحقق من الجلسة. يرجى المحاولة مجدداً.', 'unavailable');
  const { user } = await responseBody(response);
  const validId = (Number.isInteger(user?.id) && user.id > 0) || (typeof user?.id === 'string' && user.id.trim().length > 0);
  if (!validId || typeof user.email !== 'string' || !user.email.trim() || user.is_admin !== true) {
    throw new AdminSessionError('هذا الحساب غير مخوّل للدخول إلى الإدارة.', 'unauthorized');
  }
  return user;
}

export async function logoutAdmin({ signal } = {}) {
  const base = apiOrigin();
  const options = { credentials: 'include', redirect: 'error', headers: { Accept: 'application/json' }, signal };
  const csrf = await fetch(`${base}/sanctum/csrf-cookie`, options);
  if (!csrf.ok) throw new AdminSessionError('تعذر تسجيل الخروج. يرجى المحاولة مجدداً.', 'logout-failed');
  const cookie = document.cookie.split(';').map(value => value.trim()).find(value => value.startsWith('XSRF-TOKEN='));
  let token;
  try { token = cookie ? decodeURIComponent(cookie.slice('XSRF-TOKEN='.length)) : ''; } catch { token = ''; }
  if (!token) throw new AdminSessionError('تعذر تأكيد الجلسة الآمنة. يرجى المحاولة مجدداً.', 'csrf');
  const response = await fetch(`${base}/logout`, {
    ...options, method: 'POST', headers: { ...options.headers, 'X-XSRF-TOKEN': token },
  });
  if (response.status === 401) return; // The server confirms there is no authenticated session.
  if (!response.ok) throw new AdminSessionError('تعذر تسجيل الخروج. يرجى المحاولة مجدداً.', 'logout-failed');
  if (response.status !== 204) await responseBody(response);
}
