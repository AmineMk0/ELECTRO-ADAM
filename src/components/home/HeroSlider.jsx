import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import accueil1 from '../../../desin/accueil1.jpg';
import accueil2 from '../../../desin/accueil2.jpg';

const slides = [
  { image: accueil1, alt: 'إلكترو آدم، متجرك الإلكتروني للإلكترونيات الحديثة — تسوق الآن', to: '/catalogue' },
  { image: accueil2, alt: 'إلكترو آدم — عروض حصرية وتخفيضات مميزة على الإلكترونيات', to: '/category/offers' },
];
const controlClass = 'absolute top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand/60 text-white transition-colors hover:bg-brand/85 sm:size-10';

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef(null);
  const suppressClickUntil = useRef(0);
  const paused = hovered || focused || touching || reducedMotion;
  const change = direction => setActive(current => (current + direction + slides.length) % slides.length);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => setActive(current => (current + 1) % slides.length), 4000);
    return () => window.clearTimeout(timer);
  }, [active, paused]);

  function endTouch(event) {
    const start = touchStart.current;
    const end = event.changedTouches[0];
    touchStart.current = null;
    setTouching(false);
    if (!start || !end) return;
    const distanceX = end.clientX - start.x;
    const distanceY = end.clientY - start.y;
    if (Math.abs(distanceX) >= 40 && Math.abs(distanceX) > Math.abs(distanceY) * 1.2) {
      // Follow the RTL arrows: swipe right for the next slide.
      change(distanceX > 0 ? 1 : -1);
      suppressClickUntil.current = Date.now() + 500;
    }
  }

  return (
    <section
      aria-label="عروض المتجر"
      aria-roledescription="عرض شرائح"
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setHovered(false); }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      className="relative mx-auto w-[calc(100%-16px)] max-w-6xl overflow-hidden rounded-2xl sm:w-[calc(100%-32px)] md:rounded-3xl"
    >
      <h1 className="sr-only">إلكترو آدم — متجر الإلكترونيات والعروض</h1>
      <div
        className="relative isolate aspect-[2.3/1] sm:aspect-[2.6/1] touch-pan-y"
        onTouchStart={event => {
          const touch = event.touches[0];
          touchStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
          setTouching(true);
        }}
        onTouchEnd={endTouch}
        onTouchCancel={() => { touchStart.current = null; setTouching(false); }}
        onClickCapture={event => { if (Date.now() < suppressClickUntil.current) event.preventDefault(); }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            role="group"
            aria-roledescription="شريحة"
            aria-label={`${index + 1} من ${slides.length}`}
            aria-hidden={active !== index}
            className={`absolute inset-0 transition-opacity duration-[600ms] ease-in-out motion-reduce:transition-none ${active === index ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'}`}
          >
            <Link to={slide.to} tabIndex={active === index ? 0 : -1} className="block h-full w-full focus-visible:-outline-offset-4" draggable={false}>
              <img src={slide.image} alt={slide.alt} width="1600" height="800" loading="eager" fetchPriority={index === 0 ? 'high' : 'low'} decoding="async" draggable={false} className="block h-full w-full select-none object-contain"/>
            </Link>
          </div>
        ))}
      </div>

      <button type="button" aria-label="الشريحة السابقة" onClick={() => change(-1)} className={`${controlClass} right-2 sm:right-3`}><ChevronRight size={18} aria-hidden="true"/></button>
      <button type="button" aria-label="الشريحة التالية" onClick={() => change(1)} className={`${controlClass} left-2 sm:left-3`}><ChevronLeft size={18} aria-hidden="true"/></button>
    </section>
  );
}
