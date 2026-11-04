import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CircleHelp } from 'lucide-react';
import faqReference from '../../desin/question.jpg';

const questions = [
  {
    question: 'ما هي طرق الدفع المتاحة ؟',
    answer: 'نوفر الدفع عند الاستلام، حيث يمكنك دفع قيمة طلبك نقداً عند استلام المنتج.',
  },
  {
    question: 'هل التوصيل مجاني ؟',
    answer: 'نعم، التوصيل مجاني لجميع الطلبات داخل المغرب.',
  },
  {
    question: 'كم يستغرق التوصيل ؟',
    answer: 'عادة يتم التوصيل خلال 24 إلى 72 ساعة حسب المدينة.',
  },
  {
    question: 'هل يمكنني إرجاع أو استبدال المنتج ؟',
    answer: 'نعم، يمكنك إرجاع أو استبدال المنتج خلال 7 أيام من تاريخ الاستلام، بشرط يكون في حالته الأصلية.',
  },
  {
    question: 'كيف يمكنني تتبع طلبي ؟',
    answer: 'بعد تأكيد الطلب، سنرسل لك رقم التتبع عبر رسالة SMS أو على الواتساب لتتمكن من متابعة حالة طلبك.',
  },
];

export default function FAQ() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'الأسئلة المتكررة | إلكترو آدم';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div dir="rtl" className="relative isolate overflow-hidden bg-white pb-14 text-right text-brand sm:pb-16">
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 w-full sm:h-24" aria-hidden="true">
        <defs>
          <linearGradient id="faq-top-fade" x2="0" y2="1"><stop stopColor="#e3f3ff" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient>
        </defs>
        <path fill="url(#faq-top-fade)" d="M0 0H1440V140H0Z" />
        <path fill="#e5f4ff" d="M0 0H330C240 60 90 40 0 140Z" />
        <path fill="#a9daf9" d="M0 0H260C170 30 80 30 0 80Z" />
      </svg>

      <div className="mx-auto max-w-5xl px-5 pt-8 sm:px-7 sm:pt-10">
        <header className="pb-6 text-center sm:pb-8">
          <h1 className="text-3xl font-bold leading-relaxed sm:text-4xl">الأسئلة المتكررة</h1>
          <div className="mt-3 flex justify-center gap-2" aria-hidden="true"><span className="h-1.5 w-16 rounded-full bg-orange" /><span className="h-1.5 w-16 rounded-full bg-orange" /></div>
        </header>

        <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_220px] md:gap-8 lg:grid-cols-[minmax(0,1fr)_250px]">
          <div className="min-w-0">
            <div className="space-y-5 sm:space-y-6">
              {questions.map(({ question, answer }, index) => (
                <section key={question} aria-labelledby={`faq-question-${index}`}>
                  <h2 id={`faq-question-${index}`} className="flex items-start gap-3 text-lg font-bold leading-8 sm:text-xl">
                    <CircleHelp className="mt-1 size-6 shrink-0 text-[#087acb]" strokeWidth={1.9} aria-hidden="true" />
                    <span>{question}</span>
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-8 text-[#242733] sm:text-base">{answer}</p>
                </section>
              ))}
            </div>
            <Link to="/" className="mt-5 inline-flex min-h-11 items-center text-xs font-semibold text-brand underline decoration-orange underline-offset-4 transition-colors hover:text-orange sm:text-sm">العودة للرئيسية</Link>
          </div>

          <div className="mx-auto w-44 max-w-full sm:w-48 md:w-full">
            <svg viewBox="40 335 410 410" width="410" height="410" className="block h-auto w-full overflow-hidden" role="img" aria-label="توضيح للأسئلة والإجابات" focusable="false">
              <image href={faqReference} width="1536" height="1024" />
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
