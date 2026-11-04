import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, ShoppingCart } from 'lucide-react';
import aboutReference from '../../desin/quinous.jpg';

const values = [
  { title: 'جودة عالية', viewBox: '1215 765 110 100' },
  { title: 'ثقة و مصداقية', viewBox: '890 765 100 100' },
  { title: 'توصيل سريع', viewBox: '540 775 145 88' },
  { title: 'الدفع عند الاستلام', viewBox: '205 765 120 100' },
];

function ReferenceArtwork({ viewBox, className, label }) {
  return (
    <svg viewBox={viewBox} className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
      <image href={aboutReference} width="1536" height="1024" />
    </svg>
  );
}

function OrangeUnderline() {
  return <div className="mt-2 flex justify-center gap-2" aria-hidden="true"><span className="h-1.5 w-14 rounded-full bg-orange" /><span className="h-1.5 w-14 rounded-full bg-orange" /></div>;
}

export default function About() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'من نحن | إلكترو آدم';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div dir="rtl" className="relative isolate overflow-hidden bg-white pb-14 text-brand sm:pb-16">
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 w-full sm:h-28" aria-hidden="true">
        <defs>
          <linearGradient id="about-top-fade" x2="0" y2="1"><stop stopColor="#e0efff" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient>
        </defs>
        <path fill="url(#about-top-fade)" d="M0 0H1440V140H0Z" />
        <path fill="#e5f3ff" d="M0 0H340C240 60 90 40 0 140Z" />
        <path fill="#c5e5fc" d="M0 0H260C170 30 80 30 0 80Z" />
      </svg>

      <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6">
        <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-xs font-bold leading-6">
          <Link to="/" className="inline-flex min-h-10 items-center gap-2 hover:text-orange"><Home size={17} aria-hidden="true" />الرئيسية</Link>
          <ChevronLeft size={14} aria-hidden="true" />
          <span aria-current="page">من نحن</span>
        </nav>

        <section aria-labelledby="about-heading" className="grid items-center gap-5 pt-5 sm:pt-6 md:grid-cols-2 md:gap-7">
          <div className="min-w-0 text-center">
            <h1 id="about-heading" className="text-3xl font-bold leading-relaxed sm:text-5xl">من نحن ؟</h1>
            <OrangeUnderline />
            <p className="mt-6 text-sm font-semibold leading-8 text-[#172444] sm:text-base sm:leading-8">
              <bdi className="font-bold text-brand">ELECTRO ADAM</bdi> هو متجر إلكتروني مغربي متخصص في بيع المنتجات الإلكترونية، الدرون، والإكسسوارات التكنولوجية.
              <br />
              نحرص على تقديم منتجات أصلية بجودة عالية وخدمة موثوقة لتلبية احتياجات عملائنا في المغرب.
            </p>
            <Link to="/products" className="mt-5 inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-gradient-to-l from-[#ff8a00] to-[#ff7900] px-7 py-2.5 text-base font-bold text-white transition hover:brightness-95 sm:px-9">
              <ChevronRight size={19} aria-hidden="true" />تسوق الآن<ShoppingCart size={21} aria-hidden="true" />
            </Link>
          </div>

          <div className="mx-auto w-full max-w-[360px] md:max-w-none">
            <ReferenceArtwork viewBox="90 225 660 410" className="block aspect-[66/41] w-full overflow-hidden" label="منتجات إلكترو آدم: درون، كاميرا، سماعات رأس وسماعات لاسلكية" />
          </div>
        </section>

        <section aria-labelledby="about-values-heading" className="relative mt-6 sm:mt-8">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="pointer-events-none absolute -inset-x-10 top-2 -z-10 h-20 w-[calc(100%+72px)]" aria-hidden="true"><path fill="#edf6ff" d="M0 45C100 30 130 0 250 8 100 50 90 100 0 100ZM1100 30C1240 75 1350 0 1440 0V30C1320 30 1260 105 1100 30Z" /></svg>
          <h2 id="about-values-heading" className="text-center text-3xl font-bold leading-relaxed">قيمنا</h2>
          <OrangeUnderline />
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 md:grid-cols-4">
            {values.map(value => (
              <li key={value.title} className="flex min-w-0 flex-col items-center justify-center rounded-3xl border border-[#eef1f9] bg-[#f6f8fe] px-2 py-3 text-center sm:py-4">
                <ReferenceArtwork viewBox={value.viewBox} className="mb-2 h-14 w-20 overflow-hidden sm:h-17 sm:w-24" />
                <h3 className="text-xs font-bold leading-6 sm:text-base">{value.title}</h3>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-10 w-full sm:h-14" aria-hidden="true">
        <path fill="#d8edff" d="M0 0C240 100 1080 100 1440 0V80H0Z" />
        <path fill="#91cafa" d="M0 12C260 110 1120 110 1440 12V80H0Z" />
      </svg>
    </div>
  );
}
