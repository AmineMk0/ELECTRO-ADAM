import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Home, Mail, Phone } from 'lucide-react';
import WhatsAppIcon from '../components/common/WhatsAppIcon';
import { contact } from '../data/contact';
import contactReference from '../../desin/nous.jpg';

const methods = [
  {
    id: 'whatsapp', title: 'واتساب', description: 'تواصل معنا مباشرة على واتساب للحصول على رد سريع.',
    action: 'مراسلتنا على واتساب', href: contact.whatsappHref, icon: WhatsAppIcon,
    background: 'bg-[#f0faf3]', color: 'bg-[#08c62b]', external: true,
  },
  {
    id: 'email', title: 'البريد الإلكتروني', description: 'أرسل لنا استفسارك عبر البريد الإلكتروني.',
    action: 'إرسال بريد إلكتروني', href: contact.emailHref, detail: contact.email, icon: Mail,
    background: 'bg-[#edf7ff]', color: 'bg-[#009bf0]',
  },
  {
    id: 'phone', title: 'الهاتف', description: 'يمكنك الاتصال بنا خلال أوقات العمل.',
    action: 'الاتصال بنا الآن', href: contact.phoneHref, detail: contact.phoneDisplay, icon: Phone,
    background: 'bg-[#fff8ef]', color: 'bg-[#ff8a00]',
  },
];

function TitleAccent({ className }) {
  return (
    <svg viewBox="0 0 48 54" fill="#ff8a00" className={className} aria-hidden="true">
      <path d="M32 31 17 7C11-3 1 4 8 13l20 21c3 3 6 0 4-3ZM21 42 6 33c-8-5-13 7-4 10l17 4c5 1 6-2 2-5Z" />
    </svg>
  );
}

export default function Contact() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'تواصل معنا | إلكترو آدم';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div dir="rtl" className="relative isolate overflow-hidden bg-white pb-12 text-right text-brand sm:pb-16">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 w-full sm:h-28" aria-hidden="true">
        <path fill="#eaf6fe" d="M0 0H320C230 65 90 40 0 120Z" />
        <path fill="#c2e6fc" d="M0 0H260C170 35 90 30 0 72Z" />
      </svg>
      <div className="mx-auto max-w-[1380px] px-4 pt-4 sm:px-8">
        <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-xs font-bold sm:text-sm">
          <Link to="/" className="inline-flex min-h-10 items-center gap-2 hover:text-orange"><Home size={15} aria-hidden="true" />الرئيسية</Link>
          <ChevronLeft size={14} aria-hidden="true" />
          <span aria-current="page">تواصل معنا</span>
        </nav>

        <header className="pb-4 pt-3 text-center sm:pb-5">
          <div className="flex items-center justify-center gap-3 sm:gap-7">
            <TitleAccent className="h-9 w-8 -scale-x-100 sm:h-11 sm:w-10" />
            <h1 className="text-3xl font-bold leading-relaxed sm:text-5xl sm:leading-relaxed">تواصل معنا</h1>
            <TitleAccent className="h-9 w-8 sm:h-11 sm:w-10" />
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold leading-7 text-[#242733] sm:text-xl lg:text-2xl">نحن هنا للإجابة على استفساراتك ومساعدتك في أي وقت</p>
        </header>

        <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_30%] lg:gap-6">
          <div className="space-y-3">
            {methods.map(({ id, title, description, action, href, detail, icon: Icon, background, color, external }) => (
              <section key={id} aria-labelledby={`contact-${id}`} className={`grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-3 gap-y-4 rounded-3xl p-3 sm:grid-cols-[52px_minmax(0,1fr)_minmax(160px,36%)] sm:gap-4 sm:p-4 ${background}`}>
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-full text-white shadow-sm sm:size-14 ${color}`}>
                  <Icon className="size-7 sm:size-7" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <h2 id={`contact-${id}`} className="text-lg font-bold leading-7 sm:text-xl">{title}</h2>
                  <p className="text-sm font-semibold leading-6 text-[#242733]">{description}</p>
                  {detail && <a href={href} dir="ltr" className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold leading-6 shadow-sm ring-1 ring-current/10 hover:underline min-[390px]:text-xs sm:text-[11px] xl:text-sm"><Icon className="size-4 shrink-0" aria-hidden="true" /><span className="break-all">{detail}</span></a>}
                </div>
                <div className="col-span-2 sm:col-span-1 sm:border-r-2 sm:border-[#159ce8] sm:pr-5">
                  <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={`flex min-h-10 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-center text-sm font-bold text-white transition hover:brightness-95 sm:text-xs xl:text-base ${color}`}>
                    <Icon className="size-5 shrink-0" aria-hidden="true" /><span>{action}</span><ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              </section>
            ))}
          </div>

          <div className="relative mx-auto w-52 max-w-full sm:w-64 lg:w-full lg:border-r-[3px] lg:border-[#1099df] lg:pr-7">
            {/* Reuse the reference illustration while keeping all contact details live HTML. */}
            <svg viewBox="80 310 465 375" width="465" height="375" className="block h-auto w-full overflow-hidden" role="img" aria-labelledby="contact-illustration-title" focusable="false">
              <title id="contact-illustration-title">خدمة الزبناء في إلكترو آدم</title>
              <image href={contactReference} width="1536" height="1024" />
            </svg>
          </div>
        </div>
      </div>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-12 w-full sm:h-20" aria-hidden="true">
        <path fill="#d7effe" d="M0 5C140 20 210 90 420 90H1020C1230 90 1300 20 1440 5V90H0Z" />
        <path fill="#79c7fa" d="M0 30C140 40 220 100 430 100H1010C1220 100 1300 40 1440 30V90H0Z" />
      </svg>
    </div>
  );
}
