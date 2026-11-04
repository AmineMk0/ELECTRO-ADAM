import accueil3 from '../../../desin/accueil3.jpg';

export default function DeliveryBanner() {
  return (
    <section className="mx-2 mt-4 max-w-7xl overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-sm md:mx-auto md:rounded-3xl" aria-label="التوصيل في المغرب">
      <img src={accueil3} alt="إلكترو آدم — خدمة التوصيل في جميع المدن المغربية" width="1600" height="800" loading="lazy" decoding="async" className="block h-auto w-full"/>
    </section>
  );
}
