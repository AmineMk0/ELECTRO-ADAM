import { Eye, Printer } from 'lucide-react';
import { dashboardDemo } from '../../data/admin/dashboardDemo';
const money = value => `${value.toLocaleString('en-US')} DH`;

export function OrdersTable({ orders, onView, detailed = false, onPrint, onEditStatus, printing = false }) {
  const headings = detailed
    ? ['رقم الطلب', 'اسم العميل', 'الهاتف', 'المبلغ', 'الحالة', 'تاريخ الطلب', 'الإجراءات']
    : ['رقم الطلب', 'اسم العميل', 'المبلغ', 'الحالة', 'التاريخ', 'الإجراءات'];
  return (
    <div className="overflow-x-auto rounded-lg" tabIndex={0} role="region" aria-label="جدول الطلبات — مرّر أفقياً لعرض جميع الأعمدة">
      <table className={`w-full ${detailed ? 'min-w-[880px]' : 'min-w-[570px]'} border-collapse text-right text-xs leading-6 text-[#182746]`}>
        <thead className="bg-[#f0f3f9]"><tr>{headings.map(label => <th key={label} scope="col" className="whitespace-nowrap px-3 py-2 font-bold">{label}</th>)}</tr></thead>
        <tbody>{orders.map(order => {
          const status = dashboardDemo.statuses.find(item => item.id === order.status);
          const viewButton = <button type="button" onClick={() => onView(order)} aria-label={`عرض تفاصيل الطلب ${order.id}`} className="flex min-h-9 min-w-11 items-center justify-center rounded-lg border border-slate-200 text-brand hover:bg-blue-50"><Eye size={17} aria-hidden="true" /></button>;
          return <tr key={order.id} className="border-b border-[#edf0f6] last:border-0 hover:bg-slate-50">
            <th scope="row" className="px-3 py-1 font-bold text-brand"><bdi>#{order.id}</bdi></th>
            <td className="whitespace-nowrap px-3 py-1 font-semibold">{order.customer}</td>
            {detailed && <td className="whitespace-nowrap px-3 py-1"><bdi>{order.phone}</bdi></td>}
            <td className="whitespace-nowrap px-3 py-1"><bdi>{money(order.amount)}</bdi></td>
            <td className="px-3 py-1">{detailed ? <button type="button" onClick={() => onEditStatus(order)} aria-label={`تعديل حالة الطلب ${order.id}: ${status.label}`} className={`min-h-9 whitespace-nowrap rounded-lg px-3 py-1 text-[11px] font-bold hover:brightness-95 ${status.badge}`}>{status.label}</button> : <span className={`inline-block whitespace-nowrap rounded-lg px-2 py-0.5 text-[11px] font-bold ${status.badge}`}>{status.label}</span>}</td>
            <td className="px-3 py-1"><time dateTime={detailed ? order.created_at : order.date} dir="ltr" className="whitespace-nowrap">{order.date}{detailed && <span className="ml-2 text-[11px] text-slate-500">{order.time}</span>}</time></td>
            <td className="px-3 py-1">{detailed ? <div className="flex items-center gap-1.5">{viewButton}<button type="button" disabled={printing} onClick={() => onPrint(order)} aria-label={`طباعة الطلب ${order.id}`} className="flex min-h-9 min-w-11 items-center justify-center rounded-lg bg-slate-100 text-brand hover:bg-slate-200 disabled:opacity-40"><Printer size={17} aria-hidden="true" /></button></div> : viewButton}</td>
          </tr>;
        })}{!orders.length && <tr><td colSpan={headings.length} className="py-10 text-center text-sm text-slate-500">لا توجد طلبات مطابقة للبحث والفلاتر.</td></tr>}</tbody>
      </table>
    </div>
  );
}
