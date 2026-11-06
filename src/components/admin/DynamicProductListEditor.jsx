import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { productListFields } from '../../utils/productCreateDraft';

export default function DynamicProductListEditor({ list, title, Icon, state, dispatch, error }) {
  const editor = state.editors[list];
  const send = action => dispatch({ ...action, list });
  return <section className="min-w-0 rounded-2xl bg-white p-4 shadow-[0_2px_7px_#123a7010]" aria-labelledby={`${list}-title`}>
    <h2 id={`${list}-title`} className="mb-3 flex items-center gap-2 text-sm font-bold sm:text-base"><Icon size={23} className="text-[#0875ed]" aria-hidden="true" />{title}</h2>
    <div className={`grid gap-2 ${list === 'specifications' ? 'sm:grid-cols-2' : ''}`}>
      {productListFields[list].map(field => <label key={field.name} className="min-w-0"><span className="sr-only">{field.label}</span><input id={`${list}-${field.name}`} value={editor.values[field.name]} maxLength={field.maxLength} placeholder={field.placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${list}-error` : undefined} onChange={event => send({ type: 'editor-change', name: field.name, value: event.target.value })} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); send({ type: 'row-commit' }); } }} className="min-h-10 w-full rounded-lg border border-[#d6deeb] bg-white px-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>)}
    </div>
    <div className="mt-2 flex gap-2"><button type="button" onClick={() => send({ type: 'row-commit' })} className="flex min-h-10 items-center gap-1 rounded-lg bg-blue-50 px-3 text-xs font-bold text-blue-700"><Plus size={17} aria-hidden="true" />{editor.editingId ? 'حفظ التعديل' : 'إضافة'}</button>{editor.editingId && <button type="button" onClick={() => send({ type: 'editor-cancel' })} className="flex min-h-10 items-center gap-1 px-2 text-xs"><X size={15} />إلغاء التعديل</button>}</div>
    {error && <p id={`${list}-error`} role="alert" className="mt-2 text-xs leading-6 text-red-600">{error}</p>}
    {state.draft[list].length ? <ul className="mt-3 list-none space-y-1.5">
      {state.draft[list].map((row, index) => <li key={row.id} className="rounded-lg bg-[#f8faff] px-2 py-1 text-xs leading-6">
        <div className="inline-flex w-full items-start gap-2">{list === 'description_points' && <span aria-hidden="true">•</span>}<div className="min-w-0 flex-1 break-words">{list === 'specifications' ? <><strong className="ml-2 inline-block rounded bg-blue-100/60 px-2">{row.name}</strong><bdi>{row.value}</bdi></> : row.text}</div><div className="flex shrink-0"><button type="button" aria-label={`تعديل ${title} ${index + 1}`} onClick={() => send({ type: 'row-edit', id: row.id })} className="flex size-9 items-center justify-center rounded-md text-blue-600 hover:bg-blue-100"><Pencil size={16} /></button><button type="button" aria-label={`حذف ${title} ${index + 1}`} onClick={() => send({ type: 'row-delete', id: row.id })} className="flex size-9 items-center justify-center rounded-md text-red-500 hover:bg-red-50"><Trash2 size={16} /></button></div></div>
      </li>)}
    </ul> : <p className="mt-3 text-xs leading-6 text-slate-400">لا توجد عناصر بعد. أضف العناصر من الحقول أعلاه.</p>}
  </section>;
}
