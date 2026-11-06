import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { paginationItems } from '../../utils/adminOrders';

export default function AdminPagination({ pagination, total = pagination.total, pageSize = pagination.pageSize, onPageChange, onPageSizeChange, entity = 'طلب', ariaLabel = 'صفحات الطلبات' }) {
 return (<div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p role="status" aria-live="polite" className="text-xs text-slate-600">عرض {pagination.start} - {pagination.end} من {pagination.total} {entity}{pagination.total !== total && <span> (من إجمالي {total})</span>}</p>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-[11px] text-slate-500">لكل صفحة<select value={pageSize} onChange={event => onPageSizeChange(Number(event.target.value))} className="min-h-10 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-brand">{[5, 10, 20].map(size => <option key={size} value={size}>{size}</option>)}</select></label>
              <nav aria-label={ariaLabel} className="flex flex-wrap items-center gap-1">
                <button type="button" onClick={() => onPageChange(1)} disabled={pagination.page === 1} aria-label="الصفحة الأولى" className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-35"><ChevronsRight size={17} aria-hidden="true" /></button>
                <button type="button" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page === 1} aria-label="الصفحة السابقة" className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-35"><ChevronRight size={17} aria-hidden="true" /></button>
                {paginationItems(pagination.page, pagination.pages).map(item => typeof item === 'number' ? <button type="button" key={item} onClick={() => onPageChange(item)} aria-label={`الصفحة ${item}`} aria-current={item === pagination.page ? 'page' : undefined} className={`flex min-h-10 min-w-10 items-center justify-center rounded-lg border px-2 text-sm font-bold ${item === pagination.page ? 'border-orange bg-orange text-white' : 'border-slate-200 hover:bg-slate-50'}`}>{item}</button> : <span key={item} className="px-1 text-slate-400" aria-hidden="true">…</span>)}
                <button type="button" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages} aria-label="الصفحة التالية" className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-35"><ChevronLeft size={17} aria-hidden="true" /></button>
                <button type="button" onClick={() => onPageChange(pagination.pages)} disabled={pagination.page === pagination.pages} aria-label="الصفحة الأخيرة" className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-35"><ChevronsLeft size={17} aria-hidden="true" /></button>
              </nav>
            </div>
          </div>);
}
