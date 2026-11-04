import { FileText, Settings, Package, Star } from 'lucide-react';

function DetailSection({ title, Icon, children }) {
  return <section className="border-t border-[#edf0f5] py-5" aria-label={title}><h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-brand"><Icon size={22} aria-hidden="true"/>{title}</h2>{children}</section>;
}

export default function ProductInformation({ product }) {
  const points = product.descriptionPoints?.length ? product.descriptionPoints : [product.description].filter(Boolean);
  const reviews = (product.reviews || []).filter(review => review.isGenuine === true);
  return (
    <div className="mt-6 text-sm leading-7 text-slate-700 lg:mt-8">
      <DetailSection title="وصف المنتج" Icon={FileText}>
        {points.length ? <ul className="space-y-1 pr-4 marker:text-orange list-disc">{points.map(point => <li key={point}>{point}</li>)}</ul> : <p>لا يتوفر وصف إضافي لهذا المنتج حالياً.</p>}
      </DetailSection>
      <DetailSection title="مواصفات المنتج" Icon={Settings}>
        {product.specifications?.length ? <dl className="grid gap-x-6 lg:grid-cols-2">{product.specifications.map(spec => <div key={spec.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-white bg-[#f5f6f9] px-3 py-1.5 text-xs sm:text-sm"><dt className="font-bold text-brand">{spec.label}</dt><dd className="min-w-0 break-words">{spec.value}</dd></div>)}</dl> : <p>ستُضاف المواصفات المؤكدة عند توفرها.</p>}
      </DetailSection>
      <DetailSection title="محتويات العلبة" Icon={Package}>
        {product.packageContents?.length ? <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">{product.packageContents.map(item => <li key={item.name} className="flex items-start gap-2 text-xs sm:text-sm lg:flex-col lg:items-center lg:rounded-md lg:bg-[#f5f6f9] lg:p-3">{item.image && <img src={item.image} alt="" loading="lazy" className="hidden h-20 w-20 object-contain lg:block"/>}<span className="text-orange lg:hidden">●</span><span>{item.name}</span></li>)}</ul> : <p>لم تُحدد محتويات العلبة بعد.</p>}
      </DetailSection>
      <DetailSection title="آراء العملاء" Icon={Star}>
        {reviews.length ? <div className="grid gap-3 md:grid-cols-3">{reviews.map((review, index) => <article key={review.id || index} className="rounded border border-gray-100 p-3 shadow-sm"><div className="flex items-center justify-between gap-2"><h3 className="font-bold text-brand">{review.name || 'عميل'}</h3>{Number.isFinite(review.rating) && review.rating >= 1 && review.rating <= 5 && <span className="flex text-orange" aria-label={`${review.rating} من 5`}>{Array.from({length:5}, (_, star) => <Star key={star} size={13} fill={star < review.rating ? 'currentColor' : 'none'}/>)}</span>}</div><p className="mt-2">{review.text}</p>{review.date && <time dateTime={review.date} className="mt-2 block text-xs text-gray-500">{review.date}</time>}</article>)}</div> : <p className="rounded-md border border-gray-100 bg-[#fafbfc] px-4 py-3 text-sm text-slate-500">لا توجد تقييمات لهذا المنتج بعد.</p>}
      </DetailSection>
    </div>
  );
}
