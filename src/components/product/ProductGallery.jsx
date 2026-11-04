import { useRef, useState } from 'react';
import { Expand, X } from 'lucide-react';

export default function ProductGallery({ product, discount }) {
  const images = product.images?.length ? product.images : [product.image];
  const [active, setActive] = useState(0);
  const start = useRef(null);
  const zoom = useRef(null);

  return (
    <div className="min-w-0">
      <div
        className="relative flex aspect-[1.45] touch-pan-y items-center justify-center overflow-hidden rounded-lg bg-[#f1f3f7] sm:aspect-[1.4]"
        onTouchStart={event => { start.current = event.touches[0].clientX; }}
        onTouchEnd={event => {
          if (start.current === null) return;
          const distance = event.changedTouches[0].clientX - start.current;
          if (Math.abs(distance) > 45) setActive(current => (current + (distance > 0 ? 1 : -1) + images.length) % images.length);
          start.current = null;
        }}
        onTouchCancel={() => { start.current = null; }}
      >
        {discount > 0 && <span className="absolute top-3 left-3 z-10 rounded bg-orange px-2 py-1 text-sm font-bold text-white" dir="ltr">−{discount}%</span>}
        <img src={images[active]} alt={`${product.name} — صورة ${active + 1}`} width="600" height="600" fetchPriority="high" className="h-full w-full object-contain p-2"/>
        <button type="button" onClick={() => zoom.current.showModal()} aria-label="تكبير صورة المنتج" className="absolute top-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white text-brand shadow-sm"><Expand size={17}/></button>
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1" aria-label="صور المنتج" dir="ltr">
        {images.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setActive(index)} aria-label={`عرض صورة ${index + 1}`} aria-pressed={active === index} className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 bg-[#f5f6f8] sm:h-14 sm:w-14 ${active === index ? 'border-orange' : 'border-transparent'}`}><img src={image} alt="" width="64" height="64" loading="lazy" className="h-full w-full object-contain"/></button>)}
      </div>
      <dialog ref={zoom} onClick={event => { if (event.target === zoom.current) zoom.current.close(); }} aria-label="صورة المنتج المكبرة" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-3xl rounded-xl bg-white p-4 backdrop:bg-black/70">
        <button type="button" autoFocus onClick={() => zoom.current.close()} aria-label="إغلاق الصورة" className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-gray-100"><X/></button>
        <img src={images[active]} alt={product.name} className="max-h-[70dvh] w-full object-contain"/>
      </dialog>
    </div>
  );
}
