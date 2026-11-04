import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, Home } from 'lucide-react';
import returnsReference from '../../desin/ret.jpg';

function PolicyBullet({ children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-3 size-2 shrink-0 rounded-full bg-orange" aria-hidden="true" />
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  );
}

export default function ReturnsPolicy() {
  return (
    <div dir="rtl" className="relative isolate overflow-hidden bg-white pb-12 text-right text-[#262733] sm:pb-16">
      <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 w-full sm:h-28" aria-hidden="true">
        <defs>
          <linearGradient id="returns-top-fade" x2="0" y2="1">
            <stop stopColor="#e3f3fe" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path fill="url(#returns-top-fade)" d="M0 0H1440V150H0Z" />
        <path fill="#e8f5fe" d="M0 0H300C230 65 90 35 0 145Z" />
        <path fill="#c1e5fc" d="M0 0H240C170 35 90 28 0 85Z" />
      </svg>

      <div className="mx-auto max-w-[1380px] px-5 pt-4 sm:px-8">
        <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-xs font-bold leading-6 text-brand sm:text-sm">
          <Link to="/" className="inline-flex min-h-10 items-center gap-2 hover:text-orange">
            <Home size={15} aria-hidden="true" />الرئيسية
          </Link>
          <ChevronLeft size={14} aria-hidden="true" />
          <span aria-current="page">سياسة الاستبدال والاسترجاع</span>
        </nav>

        <header className="pb-4 pt-5 sm:pb-5 sm:pt-6">
          <p className="mb-2 text-[11px] font-semibold text-brand/70">إلكترو آدم · معلومات المتجر</p>
          <h1 className="text-2xl font-bold leading-relaxed text-brand sm:text-4xl sm:leading-relaxed lg:text-[32px] lg:leading-[1.5]">سياسة الاستبدال والاسترجاع</h1>
          <span className="mt-2 block h-1.5 w-14 rounded-full bg-orange sm:w-16" aria-hidden="true" />
          <p className="mt-4 text-sm leading-7 text-slate-600">معلومات واضحة حول الاستبدال والاسترجاع واسترداد المبالغ.</p>
        </header>

        <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_210px] md:items-start md:gap-7 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4 lg:space-y-5">
            <section aria-labelledby="returns-conditions-heading">
              <h2 id="returns-conditions-heading" className="mb-3 text-lg font-bold leading-7 text-brand sm:text-xl lg:text-2xl lg:leading-9">شروط الضمان والاستبدال والاسترجاع</h2>
              <ul className="space-y-2 text-sm font-semibold leading-7 sm:text-base lg:text-[16px]">
                <PolicyBullet>ستُنشر شروط الضمان والاستبدال والاسترجاع قبل بدء استقبال الطلبات.</PolicyBullet>
                <PolicyBullet>هذه نسخة عرض للواجهة؛ الطلبات غير متاحة بعد.</PolicyBullet>
              </ul>
            </section>

            <section aria-labelledby="refunds-heading">
              <h2 id="refunds-heading" className="mb-3 text-lg font-bold leading-7 text-brand sm:text-xl lg:text-2xl lg:leading-9">استرداد المبالغ</h2>
              <ul className="space-y-2 text-sm font-semibold leading-7 sm:text-base lg:text-[16px]">
                <PolicyBullet>تفاصيل استرداد المبالغ غير منشورة حالياً.</PolicyBullet>
                <PolicyBullet>يُرجى مراجعة شروط الاسترجاع عند نشرها قبل الطلب.</PolicyBullet>
              </ul>
            </section>
          </div>

          <div className="mx-auto w-48 max-w-full sm:w-56 md:w-full md:pt-1">
            {/* Frame the original illustration without rendering the reference's copy or layout. */}
            <svg viewBox="50 300 400 350" width="400" height="350" className="block h-auto w-full overflow-hidden" role="img" aria-labelledby="returns-illustration-title" focusable="false">
              <title id="returns-illustration-title">الاستبدال والاسترجاع</title>
              <image href={returnsReference} width="1536" height="1024" />
            </svg>
          </div>
        </div>

        <aside aria-label="معلومات ومساعدة" className="mt-7 grid gap-5 text-xs leading-7 text-slate-600 sm:mt-7 sm:grid-cols-2 sm:gap-8 sm:text-[13px] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
          <section>
            <h2 className="mb-1 text-sm font-bold text-brand">لديك استفسار؟</h2>
            <p>نسعد بالإجابة عن استفساراتكم ومساعدتكم في اختيار المنتج المناسب.</p>
            <Link to="/info/contact" className="inline-flex min-h-11 items-center gap-2 font-bold text-brand hover:text-orange">تواصل معنا<ArrowLeft size={15} aria-hidden="true" /></Link>
          </section>
          <section>
            <h2 className="mb-1 text-sm font-bold text-brand">روابط مفيدة</h2>
            <nav aria-label="روابط معلومات المتجر" className="flex flex-wrap gap-x-5 gap-y-1 text-brand">
              <Link to="/info/payment" className="inline-flex min-h-11 items-center gap-2 hover:text-orange">تعرّف على طرق الدفع<ChevronLeft size={14} aria-hidden="true" /></Link>
              <Link to="/info/shipping" className="inline-flex min-h-11 items-center gap-2 hover:text-orange">الشحن والتوصيل<ChevronLeft size={14} aria-hidden="true" /></Link>
              <Link to="/info/faq" className="inline-flex min-h-11 items-center gap-2 hover:text-orange">الأسئلة المتكررة<ChevronLeft size={14} aria-hidden="true" /></Link>
            </nav>
          </section>
        </aside>
      </div>

      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-12 w-full sm:h-20" aria-hidden="true">
        <path fill="#cceafd" d="M0 5C140 20 210 90 420 90H1020C1230 90 1300 20 1440 5V90H0Z" />
        <path fill="#79c7fa" d="M0 30C140 40 220 100 430 100H1010C1220 100 1300 40 1440 30V90H0Z" />
      </svg>
    </div>
  );
}
