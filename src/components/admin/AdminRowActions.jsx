import { Eye, Pencil, Trash2 } from 'lucide-react';

export default function AdminRowActions({ reference, entity = 'المنتج', onView, onEdit, onDelete }) {
  return <div className="flex items-center gap-1.5">
    <button type="button" onClick={onView} aria-label={`عرض ${entity} ${reference}`} className="flex min-h-9 min-w-10 items-center justify-center rounded-lg border border-slate-200 text-brand hover:bg-blue-50"><Eye size={17} aria-hidden="true" /></button>
    <button type="button" onClick={onEdit} aria-label={`تعديل ${entity} ${reference}`} className="flex min-h-9 min-w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"><Pencil size={17} aria-hidden="true" /></button>
    <button type="button" onClick={onDelete} aria-label={`حذف ${entity} ${reference}`} className="flex min-h-9 min-w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><Trash2 size={17} aria-hidden="true" /></button>
  </div>;
}
