import AdminRowActions from './AdminRowActions';
import CategoryImage from './CategoryImage';
import { categoryProductCount } from '../../utils/categoryTree';

export function CategoryStatus({ active }) {
  return <span className={`inline-block whitespace-nowrap rounded-lg px-3 py-1 text-[11px] font-bold ${active ? 'bg-green-100 text-green-800' : 'bg-orange/15 text-[#c46300]'}`}>{active ? 'نشط' : 'غير نشط'}</span>;
}

export default function CategoriesTable({ categories, allCategories, products, onView, onEdit, onDelete, onProducts }) {
  return <div className="overflow-x-auto rounded-lg" tabIndex={0} role="region" aria-label="جدول التصنيفات — مرّر أفقياً لعرض جميع الأعمدة">
    <table className="w-full min-w-[830px] border-collapse text-right text-xs leading-6 text-[#182746]">
      <thead className="bg-[#f0f3f9]"><tr>{['#', 'الصورة', 'اسم التصنيف', 'الوصف', 'عدد المنتجات', 'الحالة', 'الإجراءات'].map(label => <th key={label} scope="col" className="whitespace-nowrap px-3 py-2 font-bold">{label}</th>)}</tr></thead>
      <tbody>{categories.map(category => <tr key={category.id} className="border-b border-[#edf0f6] last:border-0 hover:bg-slate-50"><th scope="row" className="px-3 py-2 font-bold text-brand"><bdi>#{category.display_id}</bdi></th><td className="px-3 py-1"><CategoryImage image={category.image} alt={category.name} className="h-14 w-16" /></td><td className="px-3 py-2"><button type="button" onClick={() => onView(category)} className="text-right font-bold hover:text-[#0875ed]">{category.name}</button>{category.parent_id && <span className="block text-[10px] text-slate-400">فرعي من {allCategories.find(parent => parent.id === category.parent_id)?.name}</span>}</td><td className="max-w-80 px-3 py-2 text-slate-600"><p className="line-clamp-2 leading-6">{category.description || '—'}</p></td><td className="px-3 py-2"><button type="button" onClick={() => onProducts(category)} aria-label={`عرض منتجات التصنيف ${category.name}`} className="min-h-10 min-w-10 rounded-lg px-2 font-semibold hover:bg-blue-50">{categoryProductCount(allCategories, products, category.id)}</button></td><td className="px-3 py-2"><CategoryStatus active={category.is_active} /></td><td className="px-3 py-2"><AdminRowActions entity="التصنيف" reference={category.display_id} onView={() => onView(category)} onEdit={() => onEdit(category)} onDelete={() => onDelete(category)} /></td></tr>)}
      {!categories.length && <tr><td colSpan={7} className="py-10 text-center text-sm text-slate-500">لا توجد تصنيفات مطابقة للبحث.</td></tr>}</tbody>
    </table>
  </div>;
}
