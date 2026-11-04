import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Heart, Home, ShoppingCart, Star } from 'lucide-react';
import { products } from '../data/products';

const favoritesKey = 'electro-adam-product-favorites';
const formatPrice = value => `${value.toLocaleString('en-US')} DH`;

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    return Array.isArray(saved) ? saved.filter(id => products.some(product => product.id === id)) : [];
  } catch {
    return [];
  }
}

export function ListingProductCard({ product, addToCart, favorite, onFavorite }) {
  const discount = product.originalPrice > product.price && product.price >= 0
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const reviews = (product.reviews || []).filter(review => review.isGenuine === true && Number.isFinite(review.rating) && review.rating >= 1 && review.rating <= 5);
  const rating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  return (
    <article className="group relative flex min-w-0 flex-col rounded-[18px] border border-[#e8e9ef] bg-white p-3 text-center shadow-[0_5px_18px_-10px_rgba(7,55,115,0.18)] transition-shadow hover:shadow-[0_8px_24px_-10px_rgba(7,55,115,0.25)] sm:p-3">
      {discount > 0 && <span dir="ltr" className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-[#ff6a00] to-[#ff4500] px-3 py-1 text-xs font-bold leading-5 text-white sm:text-sm">-{discount}%</span>}
      <button type="button" onClick={onFavorite} aria-pressed={favorite} aria-label={`${favorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}: ${product.name}`} className="absolute right-1.5 top-1.5 z-10 flex size-11 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-orange/10 hover:text-orange">
        <Heart size={20} fill={favorite ? 'currentColor' : 'none'} className={favorite ? 'text-orange' : ''} aria-hidden="true" />
      </button>

      <Link to={`/products/${product.id}`} className="block pt-5 text-[#08265f]">
        <div className="mx-auto flex aspect-[1.6] w-full items-center justify-center sm:aspect-[2]">
          <img src={product.image} alt={product.name} width="280" height="180" loading="lazy" decoding="async" className="h-full w-full object-contain p-1 transition-transform group-hover:scale-[1.03] motion-reduce:transform-none" />
        </div>
        <h2 className="mt-2 min-h-10 text-xs font-bold leading-6 sm:min-h-7 sm:text-base sm:leading-7">{product.name}</h2>
      </Link>

      <div className="mt-auto">
        <div className="mt-1 flex min-h-8 flex-wrap items-baseline justify-center gap-x-3 gap-y-0.5 text-[#08265f]">
          <strong className="text-base font-bold sm:text-lg"><bdi>{formatPrice(product.price)}</bdi></strong>
          {discount > 0 && <del className="text-xs font-semibold text-[#81838c] sm:text-sm"><bdi>{formatPrice(product.originalPrice)}</bdi></del>}
        </div>
        <div className="my-2 flex min-h-6 flex-wrap items-center justify-center gap-1.5">
          <span className="flex gap-0.5 text-orange" role="img" aria-label={reviews.length ? `التقييم: ${rating.toFixed(1)} من 5` : 'لا توجد تقييمات بعد'}>
            {Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill={index < Math.round(rating) ? 'currentColor' : 'none'} strokeWidth={1.8} aria-hidden="true" />)}
          </span>
          {reviews.length > 0 && <span className="text-xs text-slate-600">({reviews.length})</span>}
        </div>
        {product.isSample && <p className="mb-2 text-[10px] leading-5 text-slate-500">سعر وخصم توضيحيان</p>}
        <button type="button" onClick={() => addToCart(product)} className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#0663cd] px-2 py-2 text-[11px] font-bold leading-6 text-white transition-colors hover:bg-brand sm:gap-2 sm:text-sm">
          <ShoppingCart size={17} className="shrink-0" aria-hidden="true" />أضف إلى السلة
        </button>
      </div>
    </article>
  );
}

export default function ProductList({ addToCart }) {
  const [favorites, setFavorites] = useState(readFavorites);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'قائمة المنتجات | إلكترو آدم';
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    try { localStorage.setItem(favoritesKey, JSON.stringify(favorites)); } catch { /* Favorites still work for this visit. */ }
  }, [favorites]);

  const toggleFavorite = id => setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);

  return (
    <div dir="rtl" className="relative isolate min-h-[45vh] overflow-hidden bg-gradient-to-b from-white to-[#fefeff] pb-10 text-[#08265f] sm:pb-12">
      <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 w-full sm:h-24" aria-hidden="true">
        <path fill="#e9f5fe" d="M0 0H330C230 65 90 40 0 150Z" />
        <path fill="#bfe4fc" d="M0 0H265C170 35 90 30 0 90Z" />
      </svg>

      <div className="mx-auto max-w-[1420px] px-4 pt-4 sm:px-6 lg:px-8">
        <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-xs font-bold leading-6 sm:text-sm">
          <Link to="/" className="inline-flex min-h-10 items-center gap-2 hover:text-orange"><Home size={16} aria-hidden="true" />الرئيسية</Link>
          <ChevronLeft size={15} aria-hidden="true" />
          <span aria-current="page">المنتجات</span>
        </nav>

        <header className="pb-5 pt-3 text-center sm:pb-6 sm:pt-1">
          <h1 className="text-3xl font-bold leading-relaxed sm:text-[32px] sm:leading-relaxed">قائمة المنتجات</h1>
          <div className="mt-2 flex justify-center gap-2" aria-hidden="true"><span className="h-1.5 w-12 rounded-full bg-orange sm:w-14" /><span className="h-1.5 w-12 rounded-full bg-orange sm:w-14" /></div>
        </header>

        <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map(product => <ListingProductCard key={product.id} product={product} addToCart={addToCart} favorite={favorites.includes(product.id)} onFavorite={() => toggleFavorite(product.id)} />)}
        </div>
      </div>
    </div>
  );
}
