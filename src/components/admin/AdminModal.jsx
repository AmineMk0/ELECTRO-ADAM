import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function AdminModal({ open, onClose, title, children, headingId = 'admin-modal-heading' }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (open && !dialog.current.open) dialog.current.showModal();
    else if (!open && dialog.current.open) dialog.current.close();
  }, [open]);
  return <dialog ref={dialog} onClose={onClose} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }} aria-labelledby={headingId} className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-24px)] max-w-3xl overflow-y-auto rounded-2xl bg-white p-0 text-brand shadow-xl backdrop:bg-slate-950/45">
    <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3"><h2 id={headingId} className="text-lg font-bold">{title}</h2><button type="button" aria-label="إغلاق النافذة" onClick={() => dialog.current.close()} className="flex size-11 items-center justify-center rounded-lg hover:bg-slate-100"><X size={21} /></button></div>
    <div className="space-y-5 p-5">{open ? children : null}</div>
  </dialog>;
}
