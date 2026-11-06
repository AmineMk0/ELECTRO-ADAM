import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUp, BarChart3, Bell, CalendarDays, ChartNoAxesCombined, ChevronLeft, CirclePlus, Eye, Layers, LayoutDashboard, LogOut, Menu, Package, Search, Settings, ShoppingCart, Tags, UserRound, Users, Wallet, X, Zap } from 'lucide-react';
import AdminLayout, { AdminDemoNotice, adminNavigation } from '../components/admin/AdminLayout';
import { OrdersTable } from '../components/admin/OrdersTable';
export { OrdersTable } from '../components/admin/OrdersTable';
import { OrderStatusChart, SalesChart } from '../components/admin/DashboardCharts';
import { dashboardDemo } from '../data/admin/dashboardDemo';

const money = value => `${value.toLocaleString('en-US')} DH`;
const panelClass = 'min-w-0 rounded-2xl border border-[#e9edf5] bg-white p-4 shadow-[0_3px_12px_#123a7010]';
function AddProductForm({ onAdd }) {
  const [error, setError] = useState('');
  function submit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const name = String(values.get('name')).trim(), category = String(values.get('category')).trim();
    const price = Number(values.get('price')), stock = Number(values.get('stock'));
    if (name.length < 2 || !category || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) { setError('يرجى إدخال اسم وتصنيف وسعر وكمية صحيحة.'); return; }
    onAdd({ id: `demo-added-${Date.now()}`, name, category, price, stock });
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-xs leading-6 text-slate-500">إضافة مؤقتة للمعاينة فقط. لن يتم نشر المنتج في المتجر.</p>
      {[{ name: 'name', label: 'اسم المنتج', type: 'text' }, { name: 'category', label: 'التصنيف', type: 'text' }, { name: 'price', label: 'السعر بالدرهم', type: 'number', min: '0.01', step: '0.01' }, { name: 'stock', label: 'الكمية المتوفرة', type: 'number', min: '0', step: '1' }].map(({ label, ...field }) => <label key={field.name} className="block text-sm font-bold">{label}<input {...field} required maxLength={field.type === 'text' ? 100 : undefined} className="mt-1 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal text-slate-800" /></label>)}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" className="flex min-h-11 items-center gap-2 rounded-xl bg-orange px-5 py-2 text-sm font-bold text-white"><CirclePlus size={18} aria-hidden="true" />إضافة للمعاينة</button>
    </form>
  );
}

function ProductTable({ products, inventory = false }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[360px] text-right text-sm"><thead><tr className="bg-slate-50">{['المنتج', 'التصنيف', inventory ? 'المخزون' : 'السعر'].map(title => <th key={title} className="px-3 py-2" scope="col">{title}</th>)}</tr></thead><tbody>{products.map(product => <tr key={product.id} className="border-b border-slate-100"><th scope="row" className="px-3 py-3 font-semibold">{product.name}</th><td className="px-3 py-3">{product.category}</td><td className="px-3 py-3">{inventory ? <span className={product.stock < 5 ? 'font-bold text-orange' : ''}>{product.stock} قطعة</span> : <bdi>{money(product.price)}</bdi>}</td></tr>)}</tbody></table></div>;
}

export function DashboardContent({ preview, user }) {
  const [products, setProducts] = useState(() => dashboardDemo.products.map(product => ({ ...product })));
  const [panel, setPanel] = useState(null);
  const [notice, setNotice] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const modal = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'لوحة التحكم | إلكترو آدم';
    return () => { document.title = previousTitle; };
  }, []);
  useEffect(() => {
    if (panel && !modal.current.open) modal.current.showModal();
    else if (!panel && modal.current.open) modal.current.close();
  }, [panel]);
  useEffect(() => {
    const requested = location.state?.panel;
    if ([...adminNavigation.map(item => item.id), 'notifications', 'account'].includes(requested) && !['dashboard', 'orders'].includes(requested)) {
      setPanel({ type: requested });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  function openPanel(type, order) {
    if (type === 'orders') { navigate('/admin/orders'); return; }
    if (type === 'dashboard') { setPanel(null); window.scrollTo({ top: 0, behavior: 'auto' }); return; }
    setPanel({ type, order });
  }
  const stats = [
    { id: 'orders', label: 'إجمالي الطلبات', value: dashboardDemo.statistics.orders, Icon: ShoppingCart, background: 'bg-[#edf6ff]', foreground: 'text-[#0875ed]', iconBackground: 'bg-blue-100' },
    { id: 'customers', label: 'عدد العملاء', value: dashboardDemo.statistics.customers, Icon: Users, background: 'bg-[#f5f0ff]', foreground: 'text-[#9144df]', iconBackground: 'bg-purple-100' },
    { id: 'products', label: 'عدد المنتجات', value: dashboardDemo.statistics.products + products.length - dashboardDemo.products.length, Icon: Package, background: 'bg-[#edf6ff]', foreground: 'text-[#0875ed]', iconBackground: 'bg-blue-100' },
    { id: 'sales', label: 'إجمالي المبيعات', value: money(dashboardDemo.statistics.sales), Icon: Wallet, background: 'bg-[#fff5eb]', foreground: 'text-orange', iconBackground: 'bg-orange/15' },
  ];
  const titles = { ...Object.fromEntries(adminNavigation.map(item => [item.id, item.label])), 'new-product': 'إضافة منتج جديد', order: 'تفاصيل الطلب', notifications: 'الإشعارات', account: 'الحساب الإداري' };
  const filteredOrders = dashboardDemo.orders.filter(order => (statusFilter === 'all' || order.status === statusFilter) && `${order.id} ${order.customer}`.includes(orderQuery.trim()));

  return (
    <AdminLayout preview={preview} user={user} active={panel?.type || 'dashboard'} onSelect={openPanel} onNotifications={() => openPanel('notifications')} onAccount={() => openPanel('account')}>
      {({ logoutError }) => <>
        <main className="mx-auto max-w-[1500px] space-y-4 p-3 sm:p-5">
          <AdminDemoNotice preview={preview} />
          <section aria-labelledby="dashboard-title"><h1 id="dashboard-title" className="text-xl font-bold leading-9 sm:text-2xl">👋 مرحباً بك في لوحة التحكم</h1><p className="text-xs font-semibold leading-7 text-slate-500 sm:text-sm">إليك نظرة عامة على أداء متجرك</p></section>
          {logoutError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{logoutError}</p>}
          <p role="status" className={notice ? 'text-xs leading-6 text-green-800' : 'sr-only'}>{notice}</p>

          <section aria-label="إحصائيات المتجر التجريبية" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {stats.map(({ id, label, value, Icon, background, foreground, iconBackground }) => <article key={id} className={`min-w-0 rounded-2xl border border-white/50 p-3 shadow-[0_3px_12px_#123a7007] sm:p-4 ${background}`}><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h2 className="text-[11px] font-bold sm:text-xs">{label}</h2><p className="mt-1 text-lg font-bold leading-8 sm:text-2xl"><bdi>{value}</bdi></p></div><span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${foreground} ${iconBackground}`}><Icon size={24} aria-hidden="true" /></span></div><div className="mt-2 flex flex-wrap items-center justify-end gap-2 text-[10px]"><span className="inline-flex items-center rounded-full bg-green-100 px-1.5 font-bold text-green-700"><ArrowUp size={11} aria-hidden="true" />{dashboardDemo.growth[id]}%</span>{id === 'sales' && <span className="text-slate-500">مقارنة بالأسبوع الماضي</span>}</div></article>)}
          </section>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)]">
            <section aria-labelledby="order-status-heading" className={panelClass}><h2 id="order-status-heading" className="mb-4 flex items-center gap-2 text-sm font-bold"><BarChart3 size={19} aria-hidden="true" />حالة الطلبات</h2><OrderStatusChart /></section>
            <section aria-labelledby="weekly-sales-heading" className={panelClass}><h2 id="weekly-sales-heading" className="mb-3 flex items-center gap-2 text-sm font-bold"><ChartNoAxesCombined size={20} className="text-[#0875ed]" aria-hidden="true" />تطور المبيعات خلال آخر 7 أيام</h2><SalesChart /></section>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.7fr)_minmax(0,1.55fr)]">
            <section aria-labelledby="quick-actions-heading" className={panelClass}><h2 id="quick-actions-heading" className="mb-5 flex items-center gap-2 text-base font-bold"><Zap size={23} className="fill-orange text-orange" aria-hidden="true" />إجراءات سريعة</h2><div className="space-y-3"><button type="button" onClick={() => openPanel('new-product')} className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-orange px-3 py-3 text-sm font-bold text-white hover:brightness-95"><CirclePlus size={24} aria-hidden="true" />إضافة منتج جديد</button><button type="button" onClick={() => openPanel('orders')} className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#d8eaff] px-3 py-3 text-sm font-bold hover:bg-blue-200"><ShoppingCart size={24} aria-hidden="true" />عرض جميع الطلبات</button></div></section>
            <section aria-labelledby="recent-orders-heading" className={panelClass}><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 id="recent-orders-heading" className="flex items-center gap-2 text-base font-bold"><ShoppingCart size={21} aria-hidden="true" />آخر الطلبات</h2><button type="button" onClick={() => openPanel('orders')} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-orange px-2 py-1 text-[11px] font-bold text-[#c96500] hover:bg-orange/5">عرض جميع الطلبات<ChevronLeft size={15} aria-hidden="true" /></button></div><OrdersTable orders={dashboardDemo.orders.slice(0, 4)} onView={order => openPanel('order', order)} /></section>
          </div>
        </main>

      <dialog ref={modal} onClose={() => setPanel(null)} onClick={event => { if (event.target === modal.current) modal.current.close(); }} aria-labelledby="admin-panel-heading" className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-24px)] max-w-3xl overflow-y-auto rounded-2xl bg-white p-0 text-brand shadow-xl backdrop:bg-slate-950/45">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3"><h2 id="admin-panel-heading" className="text-lg font-bold">{titles[panel?.type] || 'لوحة التحكم'}</h2><button type="button" aria-label="إغلاق النافذة" onClick={() => modal.current.close()} className="flex size-11 items-center justify-center rounded-lg hover:bg-slate-100"><X size={21} /></button></div>
        <div className="space-y-4 p-5">
          <p className="text-[11px] leading-6 text-slate-500">بيانات تجريبية للمعاينة فقط.</p>
          {panel?.type === 'orders' && <><div className="flex flex-wrap gap-3"><label className="relative min-w-0 flex-1"><span className="sr-only">البحث برقم الطلب أو اسم العميل</span><Search size={17} className="absolute right-3 top-3 text-slate-400" aria-hidden="true" /><input value={orderQuery} onChange={event => setOrderQuery(event.target.value)} placeholder="رقم الطلب أو اسم العميل" className="min-h-11 w-full rounded-lg border border-slate-200 py-2 pr-9 pl-3 text-sm" /></label><label><span className="sr-only">تصفية حسب الحالة</span><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="min-h-11 rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="all">جميع الحالات</option>{dashboardDemo.statuses.map(status => <option key={status.id} value={status.id}>{status.label}</option>)}</select></label></div><OrdersTable orders={filteredOrders} onView={order => openPanel('order', order)} />{!filteredOrders.length && <p className="py-3 text-center text-sm text-slate-500">لا توجد طلبات مطابقة.</p>}</>}
          {panel?.type === 'order' && <dl className="grid grid-cols-2 gap-4 text-sm">{[['رقم الطلب', `#${panel.order.id}`], ['العميل', panel.order.customer], ['المدينة', panel.order.city], ['المنتج', panel.order.product], ['المبلغ', money(panel.order.amount)], ['الحالة', dashboardDemo.statuses.find(status => status.id === panel.order.status).label], ['التاريخ', panel.order.date]].map(([label, value]) => <div key={label}><dt className="mb-1 text-xs text-slate-500">{label}</dt><dd className="font-semibold"><bdi>{value}</bdi></dd></div>)}</dl>}
          {panel?.type === 'new-product' && <AddProductForm onAdd={product => { setProducts(current => [...current, product]); setNotice('تمت إضافة المنتج إلى بيانات المعاينة لهذه الزيارة فقط.'); setPanel(null); }} />}
          {panel?.type === 'products' && <><button type="button" onClick={() => openPanel('new-product')} className="min-h-11 rounded-lg bg-orange px-4 py-2 text-sm font-bold text-white">إضافة منتج جديد</button><ProductTable products={products} /></>}
          {panel?.type === 'inventory' && <ProductTable products={products} inventory />}
          {panel?.type === 'categories' && <ul className="grid gap-3 sm:grid-cols-2">{[...new Set(products.map(product => product.category))].map(category => <li key={category} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><span className="font-bold">{category}</span><span className="text-xs text-slate-500">{products.filter(product => product.category === category).length} منتج في المعاينة</span></li>)}</ul>}
          {panel?.type === 'customers' && <ul className="divide-y divide-slate-100">{dashboardDemo.orders.map(order => <li key={order.id} className="flex items-center justify-between gap-3 py-3 text-sm"><span className="font-semibold">{order.customer}</span><span className="text-slate-500">{order.city}</span></li>)}</ul>}
          {panel?.type === 'reports' && <><p className="text-sm">مبيعات آخر 7 أيام: <bdi className="font-bold">{money(dashboardDemo.weeklySales.reduce((sum, day) => sum + day.amount, 0))}</bdi></p><SalesChart /><OrderStatusChart /></>}
          {panel?.type === 'settings' && <div className="space-y-4 text-sm"><dl className="space-y-4"><div><dt className="text-slate-500">اسم المتجر</dt><dd className="mt-1 font-bold">ELECTRO ADAM</dd></div><div><dt className="text-slate-500">اللغة والعملة</dt><dd className="mt-1 font-bold">العربية — الدرهم المغربي</dd></div></dl><p className="leading-7 text-slate-500">تعديل الإعدادات غير متاح في المعاينة.</p></div>}
          {panel?.type === 'notifications' && <ul className="space-y-3 text-sm">{dashboardDemo.notifications.map(text => <li key={text} className="flex items-start gap-2 rounded-xl bg-blue-50 p-3"><Bell size={17} className="mt-1 shrink-0" aria-hidden="true" />{text}</li>)}</ul>}
          {panel?.type === 'account' && <div className="space-y-2 text-sm">{preview ? <p>معاينة محلية للواجهة، دون تسجيل دخول أو حساب تجريبي.</p> : <><p>حساب إداري تم التحقق منه</p><p dir="ltr" className="text-right">{user.email}</p></>}</div>}
        </div>
      </dialog>
      </>}
    </AdminLayout>
  );
}

export default DashboardContent;
