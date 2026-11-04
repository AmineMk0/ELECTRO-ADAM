import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { reviews } from '../../data/products';
import AccentTitle from '../common/AccentTitle';

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const touchStart = useRef(null);
  const change = direction => setActive(current => (current + direction + reviews.length) % reviews.length);
  const arrowClass = 'absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#91caf0] bg-white text-brand shadow-[0_3px_10px_#168cce30] transition-colors hover:bg-sky-50 sm:size-10';

  function handleTouchEnd(event) {
    const start = touchStart.current;
    const end = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !end) return;
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.2) change(dx > 0 ? 1 : -1);
  }

  return (
    <section dir="rtl" aria-labelledby="customer-reviews-heading" aria-roledescription="عرض شرائح" className="relative isolate my-5 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-50 px-3 pt-4 pb-5 sm:my-7 sm:px-5 sm:pt-5">
      <svg viewBox="0 0 1600 150" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-16 w-full sm:h-24" aria-hidden="true"><path d="M0 0H450C275 95 120 12 0 150Z" fill="#e0f2fe"/><path d="M0 0H355C220 65 110 18 0 126Z" fill="#06a9f4"/><path d="M0 0H250C140 20 65 50 0 100Z" fill="#0570bf"/><path d="M1230 0H1600V120C1470 40 1380 140 1110 115 1390 105 1450 28 1500 0Z" fill="#e0f2fe"/><path d="M1465 0H1600V112C1520 60 1450 65 1370 88Z" fill="#FF8A00"/><path d="M1430 0H1570C1500 40 1430 70 1315 82Z" fill="#06a9f4"/></svg>
      <svg viewBox="0 0 1600 70" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-9 w-full sm:h-12" aria-hidden="true"><path d="M0 10C190 100 260 0 480 70H0ZM1050 70C1300 0 1420 120 1600 5V70Z" fill="#bce7fb"/><path d="M0 35 80 70H0ZM1470 70 1600 30V70Z" fill="#0570bf"/></svg>

      <div className="mb-4 text-center sm:mb-4">
        <div className="mb-1 flex items-center justify-center gap-4" aria-hidden="true"><span className="h-px w-12 bg-[#43a8dd] sm:w-20"/><img src="/assets/logo.jpg" alt="" loading="lazy" width="56" height="56" className="size-10 object-contain sm:size-12"/><span className="h-px w-12 bg-[#43a8dd] sm:w-20"/></div>
        <AccentTitle id="customer-reviews-heading">آراء العملاء</AccentTitle>
        <p className="mt-1 text-xs font-semibold leading-6 text-slate-600 sm:text-sm">ماذا يقول عملاؤنا عن تجربتهم معنا؟</p>
      </div>

      <div className="relative mx-auto max-w-7xl px-10 sm:px-12">
        <div
          role="group"
          aria-label="آراء العملاء"
          aria-live="polite"
          aria-atomic="true"
          className="touch-pan-y"
          onTouchStart={event => { const touch = event.touches[0]; touchStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null; }}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => { touchStart.current = null; }}
        >
          <div key={active} className="slide-in grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-4">
            {reviews.map((_, index) => {
              const review = reviews[(index + active) % reviews.length];
              return (
                <article key={review.avatar} aria-label={`رأي ${review.name}`} className={`${index === 0 ? 'flex' : 'hidden md:flex'} min-w-0 flex-col rounded-[22px] border border-[#9dcef1] bg-white px-4 py-3 shadow-[0_5px_12px_#168cce24] lg:px-5`}>
                  <div className="flex items-center gap-3">
                    <img src={`/assets/${review.avatar}.png`} alt={`صورة توضيحية لـ ${review.name}`} loading="lazy" width="56" height="56" className="size-10 shrink-0 rounded-full border-2 border-[#1184c6] object-cover lg:size-12"/>
                    <div className="min-w-0">
                      <h3 dir="ltr" className="text-right text-lg leading-6 font-bold text-brand lg:text-xl">{review.name}</h3>
                      <div className="mt-1 flex gap-0.5 text-orange" role="img" aria-label="خمس نجوم توضيحية">{Array.from({ length: 5 }, (_, star) => <Star key={star} size={14} fill="currentColor" strokeWidth={1} aria-hidden="true"/>)}</div>
                    </div>
                  </div>
                  <div className="relative mt-3 flex flex-1 flex-col">
                    <span aria-hidden="true" className="pointer-events-none absolute -top-3 -right-1 font-serif text-4xl leading-none font-bold text-[#65bbed]">”</span>
                    <p className="px-3 text-center text-[13px] leading-6 font-semibold text-brand lg:text-[14px]">{review.text}</p>
                    <span aria-hidden="true" className="mt-auto h-5 self-end font-serif text-4xl leading-none font-bold text-[#65bbed]">“</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <button type="button" aria-label="الرأي السابق" onClick={() => change(-1)} className={`${arrowClass} right-0`}><ChevronRight size={21} strokeWidth={3} aria-hidden="true"/></button>
        <button type="button" aria-label="الرأي التالي" onClick={() => change(1)} className={`${arrowClass} left-0`}><ChevronLeft size={21} strokeWidth={3} aria-hidden="true"/></button>
      </div>

      <div className="mt-1 flex justify-center" dir="ltr" role="group" aria-label="اختيار الرأي">{reviews.map((review, index) => <button type="button" key={review.avatar} onClick={() => setActive(index)} aria-label={`عرض رأي ${reviews[index].name}`} aria-current={active === index ? 'true' : undefined} className="flex size-10 items-center justify-center rounded-full"><span className={`size-2.5 rounded-full transition-colors sm:size-3 ${active === index ? 'bg-orange' : 'bg-[#98cff2]'}`}/></button>)}</div>
      <p className="text-center text-[10px] leading-5 text-slate-500">آراء توضيحية لعرض التصميم — ليست تقييمات عملاء حقيقية</p>
    </section>
  );
}
