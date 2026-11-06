import AdminRowActions from './AdminRowActions';
import ProductImage from './ProductImage';
import { productCategories } from '../../data/admin/productsDemo';
import { availability, currentProductPrice, productStatuses } from '../../utils/adminProducts';
import { money } from '../../utils/adminOrders';

export default function ProductsTable({ products, onView, onEdit, onDelete, categories = productCategories }) {
  return <div className="overflow-x-auto rounded-lg" tabIndex={0} role="region" aria-label="جدول المنتجات — مرّر أفقياً لعرض جميع الأعمدة">
    <table className="w-full min-w-[840px] border-collapse text-right text-xs leading-6 text-[#182746]">
      <thead className="bg-[#f0f3f9]"><tr>{['#', 'الصورة', 'اسم المنتج', 'التصنيف', 'السعر', 'المخزون', 'الحالة', 'الإجراءات'].map(label => <th key={label} scope="col" className="whitespace-nowrap px-3 py-2 font-bold">{label}</th>)}</tr></thead>
      <tbody>{products.map(product => {
        const status = productStatuses[availability(product)];
        return <tr key={product.id} className="border-b border-[#edf0f6] last:border-0 hover:bg-slate-50"><th scope="row" className="px-3 py-2 font-bold text-brand"><bdi>#{product.id}</bdi></th><td className="px-3 py-1"><ProductImage image={product.images[0]} alt={product.name} className="h-14 w-16" /></td><td className="px-3 py-2"><button type="button" onClick={() => onView(product)} className="text-right font-bold hover:text-[#0875ed]">{product.name}</button><span dir="ltr" className="block text-right text-[10px] text-slate-400">{product.reference}</span></td><td className="px-3 py-2"><span className="inline-block whitespace-nowrap rounded-lg bg-blue-100 px-2 py-1 text-[11px] font-bold text-blue-800">{categories.find(category => category.id === product.category_id)?.name}</span></td><td className="whitespace-nowrap px-3 py-2 font-semibold"><bdi>{money(currentProductPrice(product))}</bdi>{product.promotional_price !== null && <del className="block text-[10px] font-normal text-slate-400"><bdi>{money(product.price)}</bdi></del>}</td><td className="px-3 py-2 font-semibold">{product.stock}</td><td className="px-3 py-2"><span className={`inline-block whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-bold ${status.badge}`}>{status.label}</span></td><td className="px-3 py-2"><AdminRowActions reference={product.reference} onView={() => onView(product)} onEdit={() => onEdit(product)} onDelete={() => onDelete(product)} /></td></tr>;
      })}{!products.length && <tr><td colSpan={8} className="py-10 text-center text-sm text-slate-500">لا توجد منتجات مطابقة للبحث والفلاتر.</td></tr>}</tbody>
    </table>
  </div>;
}
