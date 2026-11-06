function Illustration({ type }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false" className="h-[48px] w-[48px] shrink-0">
      <circle cx="32" cy="32" r="30" fill="#edf5ff"/>
      {type === 'delivery' && <>
        <path d="M7 24h10M5 30h9M8 36h7" stroke="#ff8a00" strokeWidth="3" strokeLinecap="round"/>
        <rect x="17" y="18" width="25" height="27" rx="4" fill="#073773"/>
        <path d="M42 27h8l8 11v7H42V27Z" fill="#ff8a00"/>
        <path d="M45 30h4l5 8h-9v-8Z" fill="#fff"/>
        <path d="M26 18h7v12l-3.5-2-3.5 2V18Z" fill="#a9d6ff"/>
        <path d="M21 39h12" stroke="#a9d6ff" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="26" cy="46" r="6" fill="#073773" stroke="#edf5ff" strokeWidth="2"/>
        <circle cx="49" cy="46" r="6" fill="#073773" stroke="#edf5ff" strokeWidth="2"/>
        <circle cx="26" cy="46" r="2" fill="white"/><circle cx="49" cy="46" r="2" fill="white"/>
      </>}
      {type === 'payment' && <>
        <rect x="12" y="13" width="36" height="25" rx="4" fill="#073773" transform="rotate(-8 12 13)"/>
        <rect x="16" y="18" width="36" height="24" rx="4" fill="#a9d6ff" stroke="#073773" strokeWidth="2"/>
        <circle cx="34" cy="30" r="7" fill="#fff"/>
        <path d="M32 27h4m-4 3h4m-4 3h4M22 25v10m24-10v10" stroke="#073773" strokeWidth="2" strokeLinecap="round"/>
        <path d="m8 46 8-8 10 7h13a4 4 0 0 1 0 8H26L14 56 8 46Z" fill="#ff8a00"/>
        <path d="m29 45 6-5a4 4 0 0 1 5 6l-4 3H26" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="m7 43 7 10-5 4-7-10 5-4Z" fill="#073773"/>
      </>}
      {type === 'quality' && <>
        <path d="m23 39-6 17 11-4 5 6 3-19M39 39l8 17-10-4-5 6-3-19" fill="#ff8a00"/>
        <path d="m32 7 7 4 8 1 2 8 4 7-4 7-2 8-8 1-7 4-7-4-8-1-2-8-4-7 4-7 2-8 8-1 7-4Z" fill="#073773"/>
        <circle cx="32" cy="27" r="14" fill="#fff"/>
        <circle cx="32" cy="27" r="11" fill="#edf5ff" stroke="#a9d6ff" strokeWidth="2"/>
        <path d="m25 27 5 5 9-10" stroke="#ff8a00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </>}
    </svg>
  );
}

const benefits = [
  { type: 'delivery', title: 'توصيل سريع' },
  { type: 'payment', title: 'الدفع عند الاستلام' },
  { type: 'quality', title: 'ضمان الجودة' },
];

export default function OrderBenefits() {
  return <ul dir="rtl" aria-label="مزايا الشراء" className="mt-3 grid grid-cols-3 gap-2 py-2">
    {benefits.map(({ type, title }) => <li key={type} className="flex min-w-0 flex-col items-center gap-2 text-center">
      <Illustration type={type}/>
      <span className="text-[12px] leading-5 font-bold text-brand min-[400px]:text-[13px]">{title}</span>
    </li>)}
  </ul>;
}
