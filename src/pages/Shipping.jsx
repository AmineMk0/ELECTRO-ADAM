import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';
import shippingReference from '../../desin/liv.jpg';

const sections = [
  {
    id: 'areas',
    title: 'مناطق التوصيل',
    text: 'نقوم بالتوصيل إلى جميع مدن و مناطق المغرب.',
    iconViewBox: '1340 300 110 75',
  },
  {
    id: 'delivery-time',
    title: 'مدة التوصيل',
    text: 'عادة يتم التوصيل خلال 24 إلى 72 ساعة حسب المدينة.',
    iconViewBox: '1345 410 95 85',
  },
  {
    id: 'shipping-cost',
    title: 'تكلفة الشحن',
    text: 'التوصيل مجاني على جميع الطلبات.',
    iconViewBox: '1345 535 95 80',
  },
  {
    id: 'payment',
    title: 'طريقة الدفع',
    text: 'الدفع عند الاستلام، حيث يمكنك دفع قيمة طلبك مباشرة عند استلامه.',
    iconViewBox: '1340 645 105 85',
  },
  {
    id: 'returns',
    title: 'إرجاع أو استبدال الطلب',
    text: <>يمكنك إرجاع أو استبدال المنتج خلال 7 أيام من تاريخ الاستلام، وفقاً <Link to="/info/returns" className="decoration-orange underline-offset-4 hover:underline">لسياسة الإرجاع</Link>.</>,
    iconViewBox: '1340 765 110 85',
  },
];

function ShippingArtwork({ viewBox, className, label }) {
  return (
    <svg viewBox={viewBox} className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
      <image href={shippingReference} width="1536" height="1024" />
    </svg>
  );
}

export default function Shipping() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'الشحن والتوصيل | إلكترو آدم';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div dir="rtl" className="relative isolate overflow-hidden bg-white pb-14 text-right text-brand sm:pb-16">
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 w-full sm:h-24" aria-hidden="true">
        <defs>
          <linearGradient id="shipping-top-fade" x2="0" y2="1"><stop stopColor="#e1f1ff" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient>
        </defs>
        <path fill="url(#shipping-top-fade)" d="M0 0H1440V140H0Z" />
        <path fill="#e5f3ff" d="M0 0H330C240 60 90 40 0 140Z" />
        <path fill="#b5def9" d="M0 0H260C170 30 80 30 0 80Z" />
      </svg>

      <div className="mx-auto max-w-6xl px-5 pt-3 sm:px-7">
        <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-xs font-bold leading-6">
          <Link to="/" className="inline-flex min-h-10 items-center gap-2 hover:text-orange"><Home size={17} aria-hidden="true" />الرئيسية</Link>
          <ChevronLeft size={13} aria-hidden="true" />
          <span aria-current="page">الشحن والتوصيل</span>
        </nav>

        <header className="pb-6 pt-3 text-center sm:pb-8">
          <h1 className="text-3xl font-bold leading-relaxed sm:text-4xl">الشحن والتوصيل</h1>
          <div className="mt-2 flex justify-center gap-2" aria-hidden="true"><span className="h-1.5 w-16 rounded-full bg-orange" /><span className="h-1.5 w-16 rounded-full bg-orange" /></div>
        </header>

        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_220px] md:gap-7 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-9">
          <div className="min-w-0 divide-y divide-[#e7eaf2]">
            {sections.map(({ id, title, text, iconViewBox }) => (
              <section key={id} aria-labelledby={`shipping-${id}`} className="grid grid-cols-[38px_minmax(0,1fr)] items-start gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[44px_minmax(0,1fr)] sm:py-4">
                <ShippingArtwork viewBox={iconViewBox} className="mt-1 h-10 w-full overflow-hidden sm:h-12" />
                <div className="min-w-0">
                  <h2 id={`shipping-${id}`} className="text-base font-bold leading-7 sm:text-xl">{title}</h2>
                  <p className="mt-1 text-sm font-semibold leading-7 text-[#252733]">{text}</p>
                </div>
              </section>
            ))}
          </div>

          <div className="mx-auto w-48 max-w-full sm:w-56 md:w-full">
            <ShippingArtwork viewBox="20 325 440 470" className="block aspect-[44/47] w-full overflow-hidden" label="شاحنة إلكترو آدم لتوصيل الطلبات في المغرب" />
          </div>
        </div>
      </div>

      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-10 w-full sm:h-14" aria-hidden="true">
        <path fill="#c7e7fc" d="M0 0C260 105 1070 110 1320 18 1380 0 1410 15 1440 30V80H0Z" />
        <path fill="#0861bd" d="M0 10C250 110 1110 105 1440 35V80H0Z" />
      </svg>
    </div>
  );
}
