export class AdminAuthError extends Error {
  constructor(message, fieldErrors = {}) {
    super(message);
    this.name = 'AdminAuthError';
    this.fieldErrors = fieldErrors;
  }
}

export function validateAdminLogin({ email, password }) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.trim().length > 254) {
    errors.email = 'يرجى إدخال بريد إلكتروني صحيح.';
  }
  if (!password.length || password.length > 1024) errors.password = 'يرجى إدخال كلمة المرور.';
  return errors;
}

function csrfToken() {
  const cookie = document.cookie.split(';').map(value => value.trim()).find(value => value.startsWith('XSRF-TOKEN='));
  try { return cookie ? decodeURIComponent(cookie.slice('XSRF-TOKEN='.length)) : ''; } catch { return ''; }
}

async function jsonBody(response) {
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new AdminAuthError('تعذر التحقق من تسجيل الدخول. يرجى المحاولة لاحقاً.');
  }
  try { return await response.json(); } catch {
    throw new AdminAuthError('تعذر التحقق من تسجيل الدخول. يرجى المحاولة لاحقاً.');
  }
}

async function checkResponse(response) {
  if (response.ok) return;
  if (response.status === 401) throw new AdminAuthError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
  if (response.status === 403) throw new AdminAuthError('هذا الحساب غير مخوّل للدخول إلى الإدارة.');
  if (response.status === 419) throw new AdminAuthError('انتهت صلاحية الجلسة. يرجى المحاولة مجدداً.');
  if (response.status === 429) throw new AdminAuthError('محاولات كثيرة. يرجى الانتظار قبل المحاولة مجدداً.');
  if (response.status === 422) {
    const body = await jsonBody(response);
    const fields = {};
    if (body?.errors?.email) fields.email = 'يرجى التحقق من البريد الإلكتروني.';
    if (body?.errors?.password) fields.password = 'يرجى التحقق من كلمة المرور.';
    throw new AdminAuthError('يرجى التحقق من بيانات الدخول.', fields);
  }
  throw new AdminAuthError('تسجيل الدخول غير متاح حالياً. يرجى المحاولة لاحقاً.');
}

// Laravel Sanctum session flow. No tokens or credentials are saved in browser storage.
export async function authenticateAdmin({ email, password }, { signal } = {}) {
  const configuredBase = import.meta.env.VITE_ADMIN_API_BASE_URL?.trim();
  if (!configuredBase) throw new AdminAuthError('تسجيل الدخول غير متاح حالياً. يرجى المحاولة لاحقاً.');

  let base;
  try {
    const url = new URL(configuredBase);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error();
    base = url.origin;
  } catch {
    throw new AdminAuthError('تسجيل الدخول غير متاح حالياً. يرجى المحاولة لاحقاً.');
  }

  const options = { credentials: 'include', redirect: 'error', headers: { Accept: 'application/json' }, signal };
  const csrf = await fetch(`${base}/sanctum/csrf-cookie`, options);
  await checkResponse(csrf);
  const token = csrfToken();
  if (!token) throw new AdminAuthError('تعذر بدء جلسة آمنة. يرجى المحاولة مجدداً.');

  const login = await fetch(`${base}/login`, {
    ...options,
    method: 'POST',
    headers: { ...options.headers, 'Content-Type': 'application/json', 'X-XSRF-TOKEN': token },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  await checkResponse(login);
  if (login.status !== 204) {
    const result = await jsonBody(login);
    if (result?.two_factor === true) throw new AdminAuthError('يتطلب هذا الحساب تحققاً إضافياً. يرجى التواصل مع المسؤول.');
  }

  // This future endpoint must be protected by auth:sanctum AND server-side admin authorization.
  const session = await fetch(`${base}/api/admin/user`, options);
  await checkResponse(session);
  const result = await jsonBody(session);
  const user = result?.user;
  const validId = (typeof user?.id === 'number' && Number.isInteger(user.id) && user.id > 0)
    || (typeof user?.id === 'string' && user.id.trim().length > 0);
  if (!validId || typeof user.email !== 'string' || !user.email.trim() || user.is_admin !== true) {
    throw new AdminAuthError('تعذر تأكيد صلاحية الدخول إلى الإدارة.');
  }
  return user;
}
