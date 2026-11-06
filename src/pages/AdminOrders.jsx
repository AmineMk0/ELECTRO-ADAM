import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Printer, Search, ShoppingBag, ShoppingCart, Truck, X } from 'lucide-react';
import AdminLayout, { AdminDemoNotice } from '../components/admin/AdminLayout';
import { OrdersTable } from '../components/admin/OrdersTable';
import AdminPagination from '../components/admin/AdminPagination';
import { createOrdersDemo, orderStatuses } from '../data/admin/ordersDemo';
import { createManualDemoOrder, filterOrders, formatPhone, money, orderDate, orderStatistics, orderTime, paginateOrders, paginationItems, toTableOrder, updateOrderStatus } from '../utils/adminOrders';
import { printAdminOrder } from '../utils/printAdminOrder';

const initialFilters = { search: '', status: 'all', from: '', to: '' };
const cards = [
  { id: 'all', label: 'إجمالي الطلبات', Icon: ShoppingCart, background: 'bg-[#dcecff]', color: 'text-[#0875ed]', iconBackground: 'bg-blue-200/60' },
  { id: 'new', label: 'طلبات جديدة', Icon: ShoppingBag, background: 'bg-[#edf6ff]', color: 'text-[#0875ed]', iconBackground: 'bg-blue-100' },
  { id: 'confirmed', label: 'مؤكدة', Icon: Check, background: 'bg-[#fff3e9]', color: 'text-orange', iconBackground: 'bg-orange/15' },
  { id: 'delivered', label: 'تم التسليم', Icon: Check, background: 'bg-[#eafbf3]', color: 'text-green-600', iconBackground: 'bg-green-100' },
  { id: 'shipping', label: 'قيد الشحن', Icon: Truck, background: 'bg-[#f2edff]', color: 'text-purple-700', iconBackground: 'bg-purple-100' },
  { id: 'cancelled', label: 'طلبات ملغاة', Icon: X, background: 'bg-[#fff0f2]', color: 'text-red-500', iconBackground: 'bg-red-100' },
];

function NewOrderForm({ onAdd, orders }) {
  const [error, setError] = useState('');
  function submit(event) {
    event.preventDefault();
    try { onAdd(createManualDemoOrder(Object.fromEntries(new FormData(event.currentTarget)), orders)); }
    catch (failure) { setError(failure.message); }
  }
  return <form onSubmit={submit} className="space-y-4">
    <p className="text-xs leading-6 text-slate-500">إضافة محلية إلى بيانات المعاينة فقط، دون إرسال طلب فعلي.</p>
    <div className="grid gap-3 sm:grid-cols-2">{[
      { name: 'name', label: 'اسم العميل', type: 'text' }, { name: 'phone', label: 'رقم الهاتف', type: 'tel' },
      { name: 'city', label: 'المدينة', type: 'text' }, { name: 'product', label: 'المنتج', type: 'text' },
      { name: 'amount', label: 'المبلغ بالدرهم', type: 'number', min: '0.01', step: '0.01' },
    ].map(({ label, ...field }) => <label key={field.name} className="block text-sm font-bold">{label}<input {...field} required maxLength={field.type === 'number' ? undefined : 100} className="mt-1 min-h-11 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal text-slate-800" /></label>)}</div>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button type="submit" className="min-h-11 rounded-xl bg-orange px-5 py-2 text-sm font-bold text-white">إضافة للمعاينة</button>
  </form>;
}

export default function AdminOrders({ preview, user }) {
  const [orders, setOrders] = useState(createOrdersDemo);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1), [pageSize, setPageSize] = useState(5);
  const [dialog, setDialog] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [printing, setPrinting] = useState(false);
  const modal = useRef(null), printLock = useRef(false);
  const stats = orderStatistics(orders);
  const filtered = filterOrders(orders, filters);
  const pagination = paginateOrders(filtered, page, pageSize);
  const selected = dialog?.id ? orders.find(order => order.id === dialog.id) : null;
  const invalidDates = Boolean(filters.from && filters.to && filters.from > filters.to);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'إدارة الطلبات | إلكترو آدم';
    return () => { document.title = previousTitle; };
  }, []);
  useEffect(() => {
    if (dialog && !modal.current.open) modal.current.showModal();
    else if (!dialog && modal.current.open) modal.current.close();
  }, [dialog]);

  function changeFilter(name, value) { setFilters(current => ({ ...current, [name]: value })); setPage(1); }
  function viewOrder(order) { setDialog({ kind: 'details', id: order.id }); }
  function editStatus(order) { setDialog({ kind: 'status', id: order.id }); }
  async function printOrder(row) {
    if (printLock.current) return;
    const order = orders.find(item => item.id === row.id);
    if (!order) return;
    printLock.current = true; setPrinting(true); setFeedback(null);
    try { await printAdminOrder(order); }
    catch { setFeedback({ error: true, text: 'تعذر فتح نافذة الطباعة. يرجى المحاولة مجدداً.' }); }
    finally { printLock.current = false; setPrinting(false); }
  }
  function saveStatus(event) {
    event.preventDefault();
    const status = new FormData(event.currentTarget).get('status');
    setOrders(current => updateOrderStatus(current, selected.id, status));
    setFeedback({ text: `تم تحديث حالة الطلب #${selected.id} في المعاينة فقط.` });
    setDialog(null);
  }

  return <AdminLayout preview={preview} user={user} active="orders" newOrderCount={stats.all}>
    {({ logoutError }) => <>
      <main className="mx-auto max-w-[1500px] space-y-5 p-3 sm:p-5">
        <AdminDemoNotice preview={preview} />
        <section aria-labelledby="orders-title"><h1 id="orders-title" className="flex items-center gap-3 text-xl font-bold leading-9 sm:text-2xl"><ShoppingCart size={28} aria-hidden="true" />إدارة الطلبات</h1><p className="text-xs font-semibold leading-7 text-slate-500 sm:text-sm">عرض وتتبع جميع طلبات المتجر</p></section>
        {logoutError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{logoutError}</p>}
        {feedback && <p role={feedback.error ? 'alert' : 'status'} className={`rounded-lg px-3 py-2 text-xs leading-6 ${feedback.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`}>{feedback.text}</p>}

        <section aria-label="إحصائيات الطلبات التجريبية" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {cards.map(({ id, label, Icon, background, color, iconBackground }) => <button type="button" key={id} onClick={() => changeFilter('status', id)} aria-pressed={filters.status === id} className={`flex min-w-0 items-center justify-between gap-2 rounded-2xl border p-3 text-right shadow-[0_3px_12px_#123a7007] transition-shadow hover:shadow-md ${filters.status === id ? 'border-blue-200' : 'border-white/50'} ${background}`}><span className="min-w-0"><span className="block text-[11px] font-bold leading-6">{label}</span><strong className="block text-xl leading-8 sm:text-2xl">{stats[id]}</strong></span><span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${color} ${iconBackground}`}><Icon size={24} aria-hidden="true" /></span></button>)}
        </section>

        <section aria-label="قائمة الطلبات" className="min-w-0 rounded-2xl border border-[#e9edf5] bg-white p-3 shadow-[0_3px_12px_#123a7010] sm:p-4">
          <form onSubmit={event => event.preventDefault()} aria-label="البحث وتصفية الطلبات" className="mb-5 grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto]">
            <label className="block min-w-0 sm:col-span-2 xl:col-span-1"><span className="sr-only">البحث برقم الطلب أو اسم العميل أو الهاتف</span><span className="relative block"><Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" /><input type="search" value={filters.search} onChange={event => changeFilter('search', event.target.value)} placeholder="رقم الطلب أو اسم العميل أو الهاتف..." className="min-h-11 w-full min-w-0 rounded-xl border border-[#d5dce8] bg-white py-2 pr-9 pl-3 text-xs" /></span></label>
            <label className="block min-w-0 text-[11px] font-semibold text-slate-500">من<input type="date" value={filters.from} max={filters.to || undefined} onChange={event => changeFilter('from', event.target.value)} className="mt-1 block min-h-11 w-full min-w-0 rounded-xl border border-[#d5dce8] bg-white px-2 py-2 text-xs text-brand" /></label>
            <label className="block min-w-0 text-[11px] font-semibold text-slate-500">إلى<input type="date" value={filters.to} min={filters.from || undefined} onChange={event => changeFilter('to', event.target.value)} className="mt-1 block min-h-11 w-full min-w-0 rounded-xl border border-[#d5dce8] bg-white px-2 py-2 text-xs text-brand" /></label>
            <label className="block min-w-0"><span className="sr-only">حالة الطلب</span><select value={filters.status} onChange={event => changeFilter('status', event.target.value)} className="min-h-11 w-full rounded-xl border border-[#d5dce8] bg-white px-3 py-2 text-xs font-semibold"><option value="all">كل الحالات</option>{orderStatuses.map(status => <option key={status.id} value={status.id}>{status.label}</option>)}</select></label>
            <button type="button" onClick={() => setDialog({ kind: 'new' })} className="flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-orange px-4 py-2 text-sm font-bold text-white hover:brightness-95"><Plus size={20} aria-hidden="true" />إضافة طلب</button>
          </form>
          {invalidDates && <p role="alert" className="mb-3 text-xs leading-6 text-red-700">يجب أن يكون تاريخ البداية قبل تاريخ النهاية أو مساوياً له.</p>}
          {Object.keys(initialFilters).some(key => filters[key] !== initialFilters[key]) && <button type="button" onClick={() => { setFilters(initialFilters); setPage(1); }} className="mb-3 min-h-9 text-xs font-semibold text-[#c96500] underline underline-offset-4">إعادة ضبط البحث والفلاتر</button>}

          <OrdersTable detailed orders={pagination.items.map(toTableOrder)} onView={viewOrder} onEditStatus={editStatus} onPrint={printOrder} printing={printing} />

          <AdminPagination pagination={pagination} total={orders.length} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} />
        </section>
      </main>

      <dialog ref={modal} onClose={() => setDialog(null)} onClick={event => { if (event.target === modal.current) modal.current.close(); }} aria-labelledby="order-dialog-heading" className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-24px)] max-w-2xl overflow-y-auto rounded-2xl bg-white p-0 text-brand shadow-xl backdrop:bg-slate-950/45">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3"><h2 id="order-dialog-heading" className="text-lg font-bold">{dialog?.kind === 'new' ? 'إضافة طلب تجريبي' : dialog?.kind === 'status' ? 'تعديل حالة الطلب' : 'تفاصيل الطلب'}{selected && <bdi className="mr-2 text-sm">#{selected.id}</bdi>}</h2><button type="button" onClick={() => modal.current.close()} aria-label="إغلاق النافذة" className="flex size-11 items-center justify-center rounded-lg hover:bg-slate-100"><X size={21} /></button></div>
        <div className="space-y-5 p-5">
          {dialog?.kind === 'new' && <NewOrderForm orders={orders} onAdd={order => { setOrders(current => [order, ...current]); setFilters(initialFilters); setPage(1); setFeedback({ text: `تمت إضافة الطلب التجريبي #${order.id} محلياً فقط.` }); setDialog(null); }} />}
          {selected && dialog?.kind === 'status' && <form key={`${selected.id}-${selected.status}`} onSubmit={saveStatus} className="space-y-4"><p className="text-xs leading-6 text-slate-500">يُحدَّث هذا الطلب في بيانات المعاينة فقط.</p><label className="block text-sm font-bold">الحالة<select name="status" defaultValue={selected.status} required className="mt-2 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2">{orderStatuses.map(status => <option key={status.id} value={status.id}>{status.label}</option>)}</select></label><button type="submit" className="min-h-11 rounded-xl bg-orange px-5 py-2 text-sm font-bold text-white">حفظ الحالة</button></form>}
          {selected && dialog?.kind === 'details' && <>
            <p className="text-xs text-slate-500">طلب تجريبي للمعاينة فقط.</p>
            <dl className="grid grid-cols-2 gap-4 text-sm">{[['العميل', selected.customer.name], ['الهاتف', formatPhone(selected.customer.phone)], ['المدينة', selected.customer.city], ['العنوان', selected.customer.address], ['التاريخ', `${orderDate(selected)} ${orderTime(selected)}`], ['الحالة', orderStatuses.find(status => status.id === selected.status).label], ['المبلغ', money(selected.amount)], ['طريقة الدفع', 'الدفع عند الاستلام']].map(([label, value]) => <div key={label} className="min-w-0"><dt className="mb-1 text-xs text-slate-500">{label}</dt><dd className="break-words font-semibold"><bdi>{value}</bdi></dd></div>)}</dl>
            <div className="overflow-x-auto"><table className="w-full min-w-[340px] text-right text-xs"><thead className="bg-slate-50"><tr>{['المنتج', 'الكمية', 'سعر الوحدة', 'المجموع'].map(label => <th key={label} scope="col" className="p-2">{label}</th>)}</tr></thead><tbody>{selected.items.map(item => <tr key={item.id} className="border-b border-slate-100"><td className="p-2">{item.name}</td><td className="p-2">{item.quantity}</td><td className="p-2"><bdi>{money(item.unit_price)}</bdi></td><td className="p-2"><bdi>{money(item.unit_price * item.quantity)}</bdi></td></tr>)}</tbody></table></div>
            <div className="flex flex-wrap gap-3"><button type="button" onClick={() => editStatus(selected)} className="min-h-11 rounded-xl bg-orange px-4 py-2 text-sm font-bold text-white">تعديل الحالة</button><button type="button" disabled={printing} onClick={() => printOrder(selected)} className="flex min-h-11 items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-40"><Printer size={18} aria-hidden="true" />طباعة الطلب</button></div>
          </>}
        </div>
      </dialog>
    </>}
  </AdminLayout>;
}
