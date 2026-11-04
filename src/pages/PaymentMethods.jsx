import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, CreditCard, Home, Landmark, PackageCheck, Truck } from 'lucide-react';
import paymentReference from '../../desin/pay.jpg';

// Show only the reference's illustrations; all page copy remains selectable text.
function PaymentIllustration({ bank = false }) {
  return (
    <svg
      viewBox={bank ? '230 540 285 180' : '210 300 315 215'}
      className="mx-auto block w-40 max-w-full overflow-hidden sm:w-48 lg:w-full"
      aria-hidden="true"
      focusable="false"
    >
      <image href={paymentReference} width="1536" height="1024" />
    </svg>
  );
}

function TitleAccent({ className }) {
  return (
    <svg viewBox="0 0 44 48" className={className} fill="#ff8a00" aria-hidden="true">
      <path d="M25 29 15 9C10-1 0 5 6 14l16 18c2 2 5 0 3-3ZM31 27l1-20c0-9 13-9 11 0l-7 21c-1 4-5 3-5-1ZM19 37 5 28c-8-5-12 7-3 9l15 4c5 1 6-2 2-4Z" />
    </svg>
  );
}

export default function PaymentMethods() {
  return (
    <div dir="rtl" className="relative isolate overflow-hidden bg-white pb-12 text-right text-[#242733] sm:pb-16">
      <div className="mx-auto max-w-6xl px-5 pt-4 sm:px-8">
        <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-xs font-bold text-brand sm:text-sm">
          <Link to="/" aria-label="الصفحة الرئيسية" className="flex min-h-9 items-center gap-2 hover:text-orange">
            <Home size={14} aria-hidden="true" />الرئيسية
          </Link>
          <ChevronLeft size={14} aria-hidden="true" />
          <span aria-current="page">طرق الدفع</span>
        </nav>

        <header className="pb-5 pt-3 text-center sm:pb-6 sm:pt-1">
          <p className="mb-2 text-[11px] font-semibold text-brand/70">إلكترو آدم · معلومات المتجر</p>
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <TitleAccent className="h-8 w-7 -scale-x-100 sm:h-11 sm:w-10" />
            <h1 className="text-3xl font-bold leading-relaxed text-brand sm:text-5xl">طرق الدفع</h1>
            <span className="relative shrink-0 text-[#1099df]">
              <CreditCard className="size-11 sm:size-16" strokeWidth={1.7} aria-hidden="true" />
              <span className="absolute -bottom-1 -left-1 flex size-6 items-center justify-center rounded-full bg-[#1099df] text-sm font-bold text-white ring-4 ring-white sm:size-8 sm:text-lg" aria-hidden="true">✓</span>
            </span>
            <TitleAccent className="h-8 w-7 sm:h-11 sm:w-10" />
          </div>
          <p className="mt-3 text-base font-bold leading-7 sm:text-xl">اختر طريقة الدفع المناسبة لك بكل سهولة وأمان</p>
          <p className="mt-1 text-xs leading-6 text-slate-500">كل ما تحتاج معرفته عن الدفع مقابل طلبك.</p>
        </header>

        <div className="mx-auto max-w-5xl space-y-6 sm:space-y-7">
          <section aria-labelledby="cash-heading" className="grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_210px] md:gap-7 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div>
              <h2 id="cash-heading" className="flex items-start gap-3 text-xl font-bold leading-9 text-[#071c72] sm:text-2xl">
                <Truck className="mt-1 size-8 shrink-0 sm:size-10" strokeWidth={1.8} aria-hidden="true" />
                <span>الدفع نقداً عند الاستلام <bdi>(COD)</bdi></span>
              </h2>
              <p className="mt-3 text-sm font-semibold leading-7 sm:text-base sm:leading-7">
                الدفع عند الاستلام <bdi>(Cash On Delivery)</bdi> هي إحدى طرق الدفع المتاحة على متجرنا، والدفع عند الاستلام يعني أن المتسوق يمكنه التسوق عبر متجرنا إلكتروني واختيار المنتج الذي يرغب فيه ومن ثم يقوم بإجراء الطلب واختيار طريقة الدفع عند الاستلام وهو ما يعني أن عملية الدفع تؤجل حتى استلام العميل للمنتج الذي قام بطلبه إلكترونياً.
                <br />
                وسنقوم بإرسال المنتج إلى المكان المتفق عليه (المدينة أو الحي أو المنزل أو مكان آخر)، وبعدها يتم الدفع.
              </p>
              <p className="mt-2 text-xs leading-6 text-slate-600">يمكنك الدفع بكل سهولة عند استلام طلبك.</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-6 text-brand">
                <span>طريقة الدفع المعتمدة في المتجر</span>
                <span className="inline-flex items-center gap-1.5"><PackageCheck size={16} aria-hidden="true" />توصل بطلبك وخلص حتى يوصلك</span>
              </div>
            </div>
            <div className="relative md:ps-7 before:absolute before:inset-y-5 before:right-0 before:hidden before:w-[3px] before:bg-[#1099df] md:before:block">
              <PaymentIllustration />
            </div>
          </section>

          <section aria-labelledby="bank-heading" className="grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_210px] md:gap-7 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div>
              <h2 id="bank-heading" className="flex items-start gap-3 text-xl font-bold leading-9 text-[#071c72] sm:text-2xl">
                <Landmark className="mt-1 size-8 shrink-0 sm:size-10" strokeWidth={1.8} aria-hidden="true" />
                <span>الدفع عبر تحويل بنكي</span>
              </h2>
              <p className="mt-3 text-sm font-semibold leading-7 sm:text-base sm:leading-7">
                الدفع عبر تحويل بنكي هي أحد طرق الدفع المتاحة على متجرنا، والدفع يتم عبر تحويل المبلغ المتفق عليه إلى حسابنا البنكي، أو عبر حوالة بنكية، أو عبر إحدى وكالات تحويل الأموال بالإسم المتفق عليه، وبعدها يتم إرسال المنتج إلى المكان المتفق عليه.
              </p>
            </div>
            <div className="relative md:ps-7 before:absolute before:inset-y-3 before:right-0 before:hidden before:w-[3px] before:bg-[#1099df] md:before:block">
              <PaymentIllustration bank />
            </div>
          </section>

          <aside aria-label="معلومات ومساعدة" className="grid gap-5 pt-1 text-xs leading-6 text-slate-500 sm:grid-cols-2 sm:gap-x-10">
            <section>
              <h2 className="mb-1 text-sm font-bold text-brand">قبل الطلب</h2>
              <ul>
                <li>واجهة تجريبية: الطلب غير متاح حالياً.</li>
                <li>لا توجد خدمة دفع إلكتروني متصلة بالمتجر حالياً.</li>
              </ul>
            </section>
            <section>
              <h2 className="mb-1 text-sm font-bold text-brand">لديك استفسار؟</h2>
              <p>نسعد بالإجابة عن استفساراتكم ومساعدتكم في اختيار المنتج المناسب.</p>
              <Link to="/info/contact" className="inline-flex min-h-11 items-center gap-2 font-bold text-brand hover:text-orange">تواصل معنا<ArrowLeft size={14} aria-hidden="true" /></Link>
            </section>
            <nav aria-label="روابط معلومات المتجر" className="sm:col-span-2">
              <h2 className="text-sm font-bold text-brand">روابط مفيدة</h2>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-brand">
                <Link to="/info/returns" className="inline-flex min-h-11 items-center hover:text-orange">سياسة الاستبدال والاسترجاع</Link>
                <Link to="/info/shipping" className="inline-flex min-h-11 items-center hover:text-orange">الشحن والتوصيل</Link>
                <Link to="/info/faq" className="inline-flex min-h-11 items-center hover:text-orange">الأسئلة المتكررة</Link>
              </div>
            </nav>
          </aside>
        </div>
      </div>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-12 w-full sm:h-20" aria-hidden="true">
        <path fill="#d9f0fd" d="M0 5C140 20 210 90 420 90H1020C1230 90 1300 20 1440 5V90H0Z" />
        <path fill="#67c3fa" d="M0 30C140 40 220 100 430 100H1010C1220 100 1300 40 1440 30V90H0Z" />
      </svg>
    </div>
  );
}
