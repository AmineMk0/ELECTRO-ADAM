import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, ChartNoAxesCombined, Layers, LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingCart, Tags, UserRound, Users, X } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { dashboardDemo } from '../../data/admin/dashboardDemo';
import { logoutAdmin } from '../../services/adminSession';

export const adminNavigation = [
  { id: 'dashboard', label: 'لوحة التحكم', Icon: LayoutDashboard },
  { id: 'orders', label: 'الطلبات', Icon: ShoppingCart },
  { id: 'products', label: 'المنتجات', Icon: Package },
  { id: 'categories', label: 'التصنيفات', Icon: Tags },
  { id: 'inventory', label: 'المخزون', Icon: Layers },
  { id: 'customers', label: 'العملاء', Icon: Users },
  { id: 'reports', label: 'التقارير', Icon: ChartNoAxesCombined },
  { id: 'settings', label: 'الإعدادات', Icon: Settings },
];

export function AdminSidebar({ active, onSelect, onLogout, loggingOut, newOrderCount = dashboardDemo.statuses.find(status => status.id === 'new').count }) {
  return (
    <div dir="rtl" className="flex h-full flex-col overflow-y-auto bg-gradient-to-b from-brand to-[#062b67] px-4 py-5 text-white">
      <BrandLogo className="mx-auto mb-5 h-24 w-24 shrink-0 brightness-0 invert" />
      <nav aria-label="التنقل الإداري" className="space-y-1">
        {adminNavigation.map(({ id, label, Icon }) => <button key={id} type="button" onClick={() => onSelect(id)} aria-current={active === id ? 'page' : undefined} className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-sm font-bold transition-colors ${active === id ? 'bg-orange text-white shadow-sm' : 'hover:bg-white/10'}`}><Icon size={22} className="shrink-0" aria-hidden="true" /><span className="flex-1">{label}</span>{id === 'orders' && <span className="rounded-full bg-orange px-2 py-0.5 text-xs text-white">{newOrderCount}</span>}</button>)}
      </nav>
      <div className="mt-6 border-t border-white/40 pt-4"><button type="button" disabled={loggingOut} onClick={onLogout} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold hover:bg-white/10 disabled:opacity-50"><LogOut size={22} aria-hidden="true" />{loggingOut ? 'جارٍ تسجيل الخروج...' : 'تسجيل الخروج'}</button></div>
    </div>
  );
}

export function AdminHeader({ date, preview, user, sidebarOpen, onOpenSidebar, onNotifications, onAccount }) {
 return (<header className="sticky top-0 z-20 flex min-h-[60px] items-center justify-between gap-3 border-b border-[#e7edf6] bg-white px-4 shadow-[0_3px_12px_#123a7010] sm:px-6">
          <div className="flex min-w-0 items-center gap-2"><button type="button" aria-label="فتح القائمة الإدارية" aria-expanded={sidebarOpen} onClick={onOpenSidebar} className="flex size-11 items-center justify-center rounded-lg hover:bg-blue-50 lg:hidden"><Menu size={23} /></button><CalendarDays size={21} className="hidden shrink-0 sm:block" aria-hidden="true" /><time className="truncate text-[11px] font-semibold sm:text-sm">{date}</time></div>
          <div className="flex items-center gap-2 sm:gap-4"><button type="button" aria-label="عرض الإشعارات التجريبية" onClick={onNotifications} className="relative flex size-11 items-center justify-center rounded-lg hover:bg-blue-50"><Bell size={22} aria-hidden="true" /><span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white" /></button><button type="button" onClick={onAccount} className="flex min-h-11 max-w-40 items-center gap-2 rounded-lg px-1 text-xs font-bold hover:bg-blue-50 sm:text-sm"><span className="truncate">{preview ? 'معاينة محلية' : typeof user?.name === 'string' && user.name.trim() ? user.name : 'الإدارة'}</span><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0875ed] text-white"><UserRound size={20} aria-hidden="true" /></span></button></div>
        </header>);
}

export function AdminDemoNotice({ preview, subject = 'الأرقام والطلبات' }) {
 return (<div role="note" className="rounded-lg bg-[#fff4df] px-3 py-2 text-[11px] leading-6 text-[#875300]">{preview ? 'معاينة محلية فقط — لا توجد جلسة دخول حقيقية. ' : ''}جميع {subject} المعروضة بيانات تجريبية، وليست بيانات المتجر الفعلية.</div>);
}

export default function AdminLayout({ preview, user, active = 'dashboard', newOrderCount, onSelect, onNotifications, onAccount, children }) {
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [loggingOut, setLoggingOut] = useState(false);
 const [logoutError, setLogoutError] = useState('');
 const mobileSidebar = useRef(null), logoutRequest = useRef(null);
 const navigate = useNavigate(), location = useLocation();
 useEffect(() => () => logoutRequest.current?.abort(), []);
 useEffect(() => {
  const media = window.matchMedia('(min-width: 1024px)');
  const closeOnDesktop = () => { if (media.matches) mobileSidebar.current?.close(); };
  media.addEventListener('change', closeOnDesktop);
  return () => media.removeEventListener('change', closeOnDesktop);
 }, []);
 function select(id) {
  mobileSidebar.current?.close();
  if (id === 'orders') { navigate('/admin/orders'); return; }
  if (id === 'products') { navigate('/admin/products'); return; }
  if (id === 'categories') { navigate('/admin/categories'); return; }
  if (id === 'dashboard' && location.pathname !== '/admin/dashboard') { navigate('/admin/dashboard'); return; }
  if (onSelect) onSelect(id);
  else navigate('/admin/dashboard', { state: { panel: id } });
 }
 async function handleLogout() {
  if (logoutRequest.current) return;
  setLogoutError('');
  if (preview) { navigate('/admin/login', { replace: true }); return; }
  const controller = new AbortController();
  logoutRequest.current = controller;
  setLoggingOut(true);
  try { await logoutAdmin({ signal: controller.signal }); if (!controller.signal.aborted) navigate('/admin/login', { replace: true }); }
  catch { if (!controller.signal.aborted) setLogoutError('تعذر تسجيل الخروج. يرجى المحاولة مجدداً.'); }
  finally { logoutRequest.current = null; if (!controller.signal.aborted) setLoggingOut(false); }
 }
 const sidebarProps = { active, newOrderCount, onSelect: select, onLogout: handleLogout, loggingOut };
 const date = new Intl.DateTimeFormat('ar-MA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', calendar: 'gregory', numberingSystem: 'latn', timeZone: 'Africa/Casablanca' }).format(new Date());
 return <div dir="rtl" className="min-h-dvh bg-[#f5f7fd] text-[#08265f]">
  <aside className="fixed inset-y-0 right-0 z-30 hidden w-[224px] lg:block"><AdminSidebar {...sidebarProps}/></aside>
  <dialog ref={mobileSidebar} onClose={() => setSidebarOpen(false)} onClick={event => { if (event.target === mobileSidebar.current) mobileSidebar.current.close(); }} aria-label="القائمة الإدارية" className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[260px] max-w-[85vw] border-0 p-0 backdrop:bg-slate-950/50">
   <button type="button" aria-label="إغلاق القائمة" onClick={() => mobileSidebar.current.close()} className="absolute left-2 top-2 z-10 flex size-11 items-center justify-center rounded-lg text-white hover:bg-white/10"><X size={22}/></button><AdminSidebar {...sidebarProps}/>
  </dialog>
  <div className="min-w-0 lg:mr-[224px]">
   <AdminHeader date={date} preview={preview} user={user} sidebarOpen={sidebarOpen} onOpenSidebar={() => { mobileSidebar.current.showModal(); setSidebarOpen(true); }} onNotifications={onNotifications || (() => select('notifications'))} onAccount={onAccount || (() => select('account'))}/>
   {typeof children === 'function' ? children({ logoutError }) : children}
  </div>
 </div>;
}
