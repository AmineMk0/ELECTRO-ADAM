import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Cookie, Database, Home, RefreshCw, Settings, ShieldCheck } from 'lucide-react';
import privacyReference from '../../desin/siyasa.jpg';

const sections = [
  {
    id: 'collected-information',
    title: 'المعلومات التي نجمعها',
    Icon: Database,
    text: 'قد نقوم بجمع بعض المعلومات مثل: الاسم، رقم الهاتف، العنوان، ومعلومات الطلب لتنفيذ طلباتك وتحسين خدماتنا.',
  },
  {
    id: 'information-use',
    title: 'كيفية استخدام المعلومات',
    Icon: Settings,
    text: 'نستخدم معلوماتك لمعالجة الطلبات، التواصل معك، وتقديم تجربة تسوق أفضل.',
  },
  {
    id: 'information-protection',
    title: 'حماية المعلومات',
    Icon: ShieldCheck,
    text: 'نلتزم بحماية بياناتك وعدم مشاركتها مع أي طرف ثالث، إلا في الحالات الضرورية لتنفيذ الطلب (مثل شركة التوصيل).',
  },
  {
    id: 'cookies',
    title: <>ملفات تعريف الارتباط <bdi>(Cookies)</bdi></>,
    Icon: Cookie,
    text: 'يستخدم موقعنا ملفات تعريف الارتباط لتحسين أداء الموقع وتخصيص تجربتك.',
  },
  {
    id: 'policy-updates',
    title: 'التعديلات على السياسة',
    Icon: RefreshCw,
    text: 'قد نقوم بتحديث هذه السياسة من وقت لآخر، وسيتم نشر أي تغييرات على هذه الصفحة.',
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'سياسة الخصوصية | إلكترو آدم';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div dir="rtl" className="relative isolate overflow-hidden bg-white pb-14 text-right text-brand sm:pb-16">
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 w-full sm:h-24" aria-hidden="true">
        <defs>
          <linearGradient id="privacy-top-fade" x2="0" y2="1"><stop stopColor="#e1f1ff" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient>
        </defs>
        <path fill="url(#privacy-top-fade)" d="M0 0H1440V140H0Z" />
        <path fill="#e5f3ff" d="M0 0H330C240 60 90 40 0 140Z" />
        <path fill="#b5def9" d="M0 0H260C170 30 80 30 0 80Z" />
      </svg>

      <div className="mx-auto max-w-6xl px-5 pt-3 sm:px-7">
        <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-xs font-bold leading-6">
          <Link to="/" className="inline-flex min-h-10 items-center gap-2 hover:text-orange"><Home size={17} aria-hidden="true" />الرئيسية</Link>
          <ChevronLeft size={13} aria-hidden="true" />
          <span aria-current="page">سياسة الخصوصية</span>
        </nav>

        <header className="pb-5 pt-3 text-center sm:pb-7">
          <h1 className="text-3xl font-bold leading-relaxed sm:text-4xl">سياسة الخصوصية</h1>
          <div className="mt-2 flex justify-center gap-2" aria-hidden="true"><span className="h-1.5 w-16 rounded-full bg-orange" /><span className="h-1.5 w-16 rounded-full bg-orange" /></div>
          <p className="mx-auto mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#252733] sm:text-base">
            نحن في <bdi>Electro Adam</bdi> نولي أهمية كبيرة لحماية خصوصية زبائننا،
            <br className="hidden sm:block" />
            {' '}وتوضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية.
          </p>
        </header>

        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_220px] md:gap-7 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-9">
          <div className="min-w-0 divide-y divide-[#e7eaf2]">
            {sections.map(({ id, title, Icon, text }) => (
              <section key={id} aria-labelledby={`privacy-${id}`} className="grid grid-cols-[26px_minmax(0,1fr)] items-start gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[30px_minmax(0,1fr)] sm:py-3.5">
                <Icon className="mt-1 size-7 shrink-0 text-orange sm:size-8" strokeWidth={1.8} aria-hidden="true" />
                <div className="min-w-0">
                  <h2 id={`privacy-${id}`} className="text-base font-bold leading-7 sm:text-xl">{title}</h2>
                  <p className="mt-1 text-sm font-semibold leading-7 text-[#252733]">{text}</p>
                </div>
              </section>
            ))}
          </div>

          <div className="mx-auto w-44 max-w-full sm:w-52 md:w-full">
            <svg viewBox="50 360 430 445" width="430" height="445" className="block h-auto w-full overflow-hidden" role="img" aria-label="حماية خصوصيتك ومعلوماتك الشخصية" focusable="false">
              <image href={privacyReference} width="1536" height="1024" />
            </svg>
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
