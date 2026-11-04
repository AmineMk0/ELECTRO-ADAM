import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Banknote, ChevronLeft, CircleHelp, Clock3, Info, MessageCircle, PackageCheck, RefreshCcw, RotateCcw, Wallet } from 'lucide-react';

const cardClass = 'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6';

function CardHeading({ icon: Icon, children }) {
  return <div className="mb-4 flex items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/5 text-brand"><Icon size={21} aria-hidden="true"/></span><h2 className="text-base font-bold text-brand sm:text-lg">{children}</h2></div>;
}

function Bullet({ children }) {
  return <li className="flex gap-3"><span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-orange"/><span>{children}</span></li>;
}

export default function StorePolicy({ type }) {
  const payment = type === 'payment';
  const title = payment ? 'طرق الدفع' : 'سياسة الاستبدال والاسترجاع';
  const HeroIcon = payment ? Wallet : RotateCcw;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | إلكترو آدم`;
    return () => { document.title = previousTitle; };
  }, [title]);

  return (
    <div dir="rtl" className="bg-slate-50/80 pb-20 text-right sm:pb-24">
      <div className="mx-auto max-w-5xl px-4 pt-5 sm:px-6 sm:pt-7">
        <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-xs leading-6 text-slate-500 sm:text-sm">
          <Link to="/" className="rounded transition-colors hover:text-brand">الرئيسية</Link>
          <ChevronLeft size={14} aria-hidden="true"/>
          <span aria-current="page" className="text-brand">{title}</span>
        </nav>

        <header className="flex items-start gap-4 py-6 sm:gap-5 sm:py-8">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-brand/10 bg-white text-brand shadow-sm sm:size-16"><HeroIcon className="size-7 sm:size-8" strokeWidth={1.7} aria-hidden="true"/></span>
          <div>
            <p className="mb-1 text-xs font-bold text-brand/70">إلكترو آدم · معلومات المتجر</p>
            <h1 className="text-2xl leading-relaxed font-bold text-brand sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">{payment ? 'كل ما تحتاج معرفته عن الدفع مقابل طلبك.' : 'معلومات واضحة حول الاستبدال والاسترجاع واسترداد المبالغ.'}</p>
          </div>
        </header>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-5">
          <div className="min-w-0 space-y-4">
            {payment ? <>
              <section aria-labelledby="cash-heading" className={`${cardClass} relative overflow-hidden border-t-4 border-t-orange`}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-orange/10 text-brand"><Banknote size={26} aria-hidden="true"/></span>
                  <span className="rounded-full bg-brand/5 px-3 py-1 text-xs font-semibold text-brand">طريقة الدفع المعتمدة في المتجر</span>
                </div>
                <h2 id="cash-heading" className="text-xl font-bold text-brand">الدفع عند الاستلام</h2>
                <p className="mt-3 text-sm leading-8 text-slate-600">يمكنك الدفع بكل سهولة عند استلام طلبك.</p>
                <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-brand"><PackageCheck size={21} className="mt-1 shrink-0" aria-hidden="true"/><p>توصل بطلبك وخلص حتى يوصلك</p></div>
              </section>
              <section className={cardClass}>
                <CardHeading icon={Info}>قبل الطلب</CardHeading>
                <ul className="space-y-2 text-sm leading-8 text-slate-600">
                  <Bullet>واجهة تجريبية: الطلب غير متاح حالياً.</Bullet>
                  <Bullet>لا توجد خدمة دفع إلكتروني متصلة بالمتجر حالياً.</Bullet>
                </ul>
              </section>
            </> : <>
              <section className={`${cardClass} border-t-4 border-t-orange`}>
                <CardHeading icon={RefreshCcw}>شروط الضمان والاستبدال والاسترجاع</CardHeading>
                <p className="text-sm leading-8 text-slate-600">ستُنشر شروط الضمان والاستبدال والاسترجاع قبل بدء استقبال الطلبات.</p>
                <div className="mt-5 flex items-start gap-3 rounded-xl bg-orange/10 p-4 text-sm leading-7 text-brand"><Clock3 size={20} className="mt-1 shrink-0" aria-hidden="true"/><p>هذه نسخة عرض للواجهة؛ الطلبات غير متاحة بعد.</p></div>
              </section>
              <section className={cardClass}>
                <CardHeading icon={Wallet}>استرداد المبالغ</CardHeading>
                <ul className="space-y-2 text-sm leading-8 text-slate-600">
                  <Bullet>تفاصيل استرداد المبالغ غير منشورة حالياً.</Bullet>
                  <Bullet>يُرجى مراجعة شروط الاسترجاع عند نشرها قبل الطلب.</Bullet>
                </ul>
              </section>
            </>}
            <Link to={payment ? '/info/returns' : '/info/payment'} className="group flex min-h-14 items-center justify-between gap-4 rounded-xl border border-brand/10 bg-white px-5 py-3 text-sm font-semibold text-brand transition-colors hover:border-brand/30 hover:bg-brand/5">
              <span className="flex items-center gap-3">{payment ? <RotateCcw size={19} aria-hidden="true"/> : <Wallet size={19} aria-hidden="true"/>}{payment ? 'سياسة الاستبدال والاسترجاع' : 'تعرّف على طرق الدفع'}</span>
              <ArrowLeft size={18} className="shrink-0 transition-transform group-hover:-translate-x-1" aria-hidden="true"/>
            </Link>
          </div>

          <aside aria-label="معلومات ومساعدة" className="space-y-4">
            <section className="rounded-2xl bg-brand p-5 text-white shadow-sm sm:p-6">
              <CircleHelp size={26} className="mb-3 text-orange" aria-hidden="true"/>
              <h2 className="text-lg font-bold">لديك استفسار؟</h2>
              <p className="mt-2 text-sm leading-7 text-white/80">نسعد بالإجابة عن استفساراتكم ومساعدتكم في اختيار المنتج المناسب.</p>
              <Link to="/info/contact" className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-brand transition-colors hover:bg-slate-100"><MessageCircle size={18} aria-hidden="true"/>تواصل معنا<ArrowLeft size={16} aria-hidden="true"/></Link>
            </section>
            <section className={cardClass}>
              <h2 className="mb-3 text-sm font-bold text-brand">روابط مفيدة</h2>
              <nav aria-label="روابط معلومات المتجر" className="divide-y divide-slate-100 text-sm text-slate-600">
                <Link to="/info/shipping" className="flex min-h-11 items-center justify-between gap-2 py-2 hover:text-brand">الشحن والتوصيل<ChevronLeft size={15} aria-hidden="true"/></Link>
                <Link to="/info/faq" className="flex min-h-11 items-center justify-between gap-2 py-2 hover:text-brand">الأسئلة المتكررة<ChevronLeft size={15} aria-hidden="true"/></Link>
              </nav>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
