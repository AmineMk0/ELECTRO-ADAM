import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn, Mail } from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';
import { AdminAuthError, authenticateAdmin, validateAdminLogin } from '../services/adminAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const request = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'دخول الإدارة | إلكترو آدم';
    return () => {
      document.title = previousTitle;
      request.current?.abort();
    };
  }, []);

  function changeField(name, value) {
    if (name === 'email') setEmail(value);
    else setPassword(value);
    setFieldErrors(current => ({ ...current, [name]: '' }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (request.current) return;
    const errors = validateAdminLogin({ email, password });
    setFieldErrors(errors);
    setError('');
    if (Object.keys(errors).length) {
      (errors.email ? emailInput : passwordInput).current?.focus();
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    try {
      await authenticateAdmin({ email, password }, { signal: controller.signal });
      if (!controller.signal.aborted) navigate('/admin/dashboard', { replace: true });
    } catch (failure) {
      if (controller.signal.aborted) return;
      setError(failure instanceof AdminAuthError ? failure.message : 'تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً.');
      const fields = failure instanceof AdminAuthError ? failure.fieldErrors : {};
      setFieldErrors(fields);
      if (fields.email) emailInput.current?.focus();
      else if (fields.password) passwordInput.current?.focus();
    } finally {
      if (request.current === controller) request.current = null;
      if (!controller.signal.aborted) setPending(false);
    }
  }

  const inputClass = 'h-[52px] w-full min-w-0 rounded-xl border-2 border-[#cfd7e2] bg-white py-3 pl-12 pr-4 text-right text-base text-[#222b3c] shadow-sm outline-none placeholder:text-[#4b505b] focus:border-brand focus:ring-2 focus:ring-brand/10 disabled:opacity-60';

  return (
    <main dir="rtl" className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-white px-5 py-8 text-brand sm:py-10">
      <svg viewBox="0 0 700 260" preserveAspectRatio="none" className="pointer-events-none absolute left-0 top-0 -z-10 h-28 w-[60%] max-w-2xl sm:h-44" aria-hidden="true">
        <path fill="#e0effe" d="M0 0H700C350 30 130 180 0 260Z" />
        <path fill="#acd2f5" d="M0 0H440C240 50 100 140 0 175Z" />
      </svg>
      <svg viewBox="0 0 700 260" preserveAspectRatio="none" className="pointer-events-none absolute bottom-0 right-0 -z-10 h-28 w-[60%] max-w-2xl sm:h-44" aria-hidden="true">
        <path fill="#e0effe" d="M0 260C350 230 570 80 700 0V260Z" />
        <path fill="#acd2f5" d="M260 260C460 210 600 120 700 85V260Z" />
      </svg>

      <div className="w-full max-w-[410px]">
        <header className="mb-6 text-center">
          <BrandLogo className="mx-auto h-28 w-28 sm:h-32 sm:w-32" />
          <div className="mt-3 flex justify-center gap-2" aria-hidden="true"><span className="h-1.5 w-12 rounded-full bg-orange" /><span className="h-1.5 w-12 rounded-full bg-orange" /></div>
          <h1 id="admin-login-heading" className="mt-5 text-3xl font-bold leading-relaxed sm:text-4xl">دخول الإدارة</h1>
        </header>

        <form onSubmit={handleSubmit} noValidate aria-labelledby="admin-login-heading" aria-busy={pending} className="rounded-[22px] bg-white p-5 shadow-[0_7px_35px_rgba(7,55,115,0.11)] sm:p-7">
          <div>
            <label htmlFor="admin-email" className="sr-only">البريد الإلكتروني</label>
            <div className="relative">
              <input ref={emailInput} id="admin-email" name="email" type="email" dir="ltr" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={254} value={email} onChange={event => changeField('email', event.target.value)} placeholder="البريد الإلكتروني" disabled={pending} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'admin-email-error' : undefined} className={inputClass} />
              <Mail size={22} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#252e3e]" aria-hidden="true" />
            </div>
            {fieldErrors.email && <p id="admin-email-error" className="mt-1 text-xs leading-6 text-red-700">{fieldErrors.email}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="admin-password" className="sr-only">كلمة المرور</label>
            <div className="relative">
              <input ref={passwordInput} id="admin-password" name="password" type={showPassword ? 'text' : 'password'} dir="ltr" autoComplete="current-password" required maxLength={1024} value={password} onChange={event => changeField('password', event.target.value)} placeholder="كلمة المرور" disabled={pending} aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? 'admin-password-error' : undefined} className={`${inputClass} pl-24`} />
              <LockKeyhole size={22} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#252e3e]" aria-hidden="true" />
              <button type="button" onClick={() => setShowPassword(current => !current)} disabled={pending} aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'} aria-pressed={showPassword} aria-controls="admin-password" className="absolute left-10 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-brand">
                {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
              </button>
            </div>
            {fieldErrors.password && <p id="admin-password-error" className="mt-1 text-xs leading-6 text-red-700">{fieldErrors.password}</p>}
          </div>

          {error && <p role="alert" className="mt-3 text-sm leading-7 text-red-700">{error}</p>}
          <button type="submit" disabled={pending} className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#0649a6] px-4 py-3 text-lg font-bold text-white transition-colors hover:bg-brand disabled:opacity-65">
            {pending ? <LoaderCircle size={22} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <LogIn size={23} aria-hidden="true" />}
            {pending ? 'جارٍ التحقق...' : 'دخول'}
          </button>
        </form>
      </div>
    </main>
  );
}
