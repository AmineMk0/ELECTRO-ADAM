import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoaderCircle, ShieldCheck } from 'lucide-react';
import { AdminSessionError, dashboardPreviewEnabled, getAdminSession } from '../../services/adminSession';

export default function AdminRoute({ children }) {
  const preview = dashboardPreviewEnabled();
  const [session, setSession] = useState({ state: 'loading', user: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (preview) return;
    const controller = new AbortController();
    setSession({ state: 'loading', user: null });
    getAdminSession({ signal: controller.signal })
      .then(user => { if (!controller.signal.aborted) setSession({ state: 'ready', user }); })
      .catch(error => {
        if (controller.signal.aborted) return;
        const denied = error instanceof AdminSessionError && ['unauthorized', 'unconfigured'].includes(error.code);
        setSession({ state: denied ? 'denied' : 'error', user: null });
      });
    return () => controller.abort();
  }, [preview, attempt]);

  if (preview) return children({ preview: true, user: null });
  if (session.state === 'ready') return children({ preview: false, user: session.user });
  if (session.state === 'denied') return <Navigate to="/admin/login" replace />;
  return (
    <main dir="rtl" className="grid min-h-dvh place-items-center bg-[#f5f7fc] px-5 text-brand">
      <div role="status" className="max-w-sm text-center">
        {session.state === 'loading' ? <><LoaderCircle size={28} className="mx-auto mb-3 animate-spin motion-reduce:animate-none" aria-hidden="true" /><p>جارٍ التحقق من الجلسة...</p></> : <><ShieldCheck size={30} className="mx-auto mb-3 text-orange" aria-hidden="true" /><p className="leading-7">تعذر التحقق من صلاحية الدخول. يرجى المحاولة مجدداً.</p><button type="button" onClick={() => setAttempt(current => current + 1)} className="mt-4 min-h-11 rounded-lg bg-brand px-5 py-2 font-bold text-white">إعادة المحاولة</button></>}
      </div>
    </main>
  );
}
