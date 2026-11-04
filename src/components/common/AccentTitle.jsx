function Accent() {
  return <svg viewBox="0 0 36 32" className="h-5 w-6 shrink-0 sm:h-6 sm:w-7" aria-hidden="true"><path d="M4 2 17 23 25 20 12 0ZM0 18 22 28 23 23 2 12Z" fill="#FF8A00"/></svg>;
}

export default function AccentTitle({ children, id }) {
  return <div className="flex items-center justify-center gap-2 sm:gap-4"><Accent/><h2 id={id} className="text-2xl leading-relaxed font-bold text-brand sm:text-3xl">{children}</h2><span className="-scale-x-100"><Accent/></span></div>;
}
