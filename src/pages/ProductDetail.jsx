import { Link, useParams } from 'react-router-dom';
import { Camera, FoldHorizontal, Radio, BriefcaseBusiness, Package, Star, ChevronLeft, Home } from 'lucide-react';
import { products } from '../data/products';
import ProductGallery from '../components/product/ProductGallery';
import OrderForm from '../components/product/OrderForm';
import OrderBenefits from '../components/product/OrderBenefits';
import ProductInformation from '../components/product/ProductInformation';
import ProductCard from '../components/common/ProductCard';

const benefitIcons = { camera: Camera, folding: FoldHorizontal, remote: Radio, bag: BriefcaseBusiness };

function ProductContent({ product, addToCart }) {
  const discount = product.originalPrice > product.price && product.price >= 0 ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const reviews = (product.reviews || []).filter(review => review.isGenuine === true && Number.isFinite(review.rating) && review.rating >= 1 && review.rating <= 5);
  const rating = reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : null;
  const related = products.filter(item => item.id !== product.id && item.category === product.category);

  return (
    <div className="mx-auto max-w-6xl px-3 pb-6 sm:px-6">
      <nav aria-label="مسار التصفح" className="flex flex-wrap items-center gap-1 py-3 text-[10px] leading-5 text-slate-500 sm:gap-2 sm:text-xs"><Link to="/" aria-label="الرئيسية"><Home size={13}/></Link><ChevronLeft size={11}/><Link to="/catalogue">التشكيلات</Link><ChevronLeft size={11}/><Link to={`/category/${product.category}`}>المنتجات</Link><ChevronLeft size={11}/><span aria-current="page" className="truncate">{product.name}</span></nav>
      <div className="grid min-w-0 gap-4 lg:grid-cols-2 lg:gap-6" dir="ltr">
        <div dir="rtl"><ProductGallery product={product} discount={discount}/></div>
        <div dir="rtl" className="min-w-0">
          <h1 className="text-xl leading-8 font-bold text-brand sm:text-2xl lg:text-3xl">{product.name}</h1>
          {product.subtitle && <p className="mt-1 text-xs leading-6 text-slate-600 sm:text-sm">{product.subtitle}</p>}
          {rating !== null && <div className="mt-2 flex items-center gap-2"><span className="flex text-amber-400" aria-label={`${rating.toFixed(1)} من 5`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < Math.round(rating) ? 'currentColor' : 'none'}/>)}</span><span className="text-xs text-gray-500">({reviews.length})</span></div>}
          <div className="mt-2 flex flex-wrap items-baseline gap-3"><strong className="text-2xl font-bold text-orange sm:text-3xl"><bdi>{product.price} MAD</bdi></strong>{discount > 0 && <del className="text-sm font-semibold text-gray-400"><bdi>{product.originalPrice} MAD</bdi></del>}</div>
          {discount > 0 && <p className="mt-0.5 text-xs font-bold text-orange">وفر <bdi>{product.originalPrice - product.price} MAD</bdi></p>}
          {product.isSample && <p className="mt-1 text-[11px] text-gray-500">بيانات وأسعار توضيحية، في انتظار الكتالوج الرسمي.</p>}
          {product.benefits?.length > 0 && <ul className="my-4 grid grid-cols-4 gap-1 text-center">{product.benefits.map(benefit => { const Icon = benefitIcons[benefit.icon] || Package; return <li key={benefit.title} className="min-w-0"><Icon aria-hidden="true" className="mx-auto mb-1 h-6 w-6 text-[#10aeb8]"/><p className="text-[10px] leading-5 font-bold text-brand sm:text-xs">{benefit.title}</p>{benefit.detail && <p className="text-[9px] leading-4 text-slate-500 sm:text-[11px]">{benefit.detail}</p>}</li>; })}</ul>}
          <OrderForm product={product}/>
          <OrderBenefits/>
          {product.isSample && <p className="mt-1 text-center text-[10px] leading-5 text-slate-500">تُؤكد شروط التوصيل والضمان عند إطلاق المتجر.</p>}
        </div>
      </div>
      <ProductInformation product={product}/>
      {related.length > 0 && <section className="border-t border-gray-100 pt-5"><h2 className="mb-4 text-lg font-bold text-brand">منتجات مشابهة</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{related.map(item => <ProductCard key={item.id} product={item} addToCart={addToCart}/>)}</div></section>}
    </div>
  );
}

export default function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const product = products.find(item => item.id === id);
  if (!product) return <section className="mx-auto min-h-[40vh] max-w-3xl px-6 py-9"><h1 className="mb-4 text-2xl font-bold text-brand">المنتج غير موجود</h1><Link to="/catalogue" className="text-brand underline">العودة إلى التشكيلات</Link></section>;
  return <ProductContent key={product.id} product={product} addToCart={addToCart}/>;
}
