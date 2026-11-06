import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Layers, LayoutGrid, Network, Plus, Search, Trash2, TriangleAlert } from 'lucide-react';
import AdminLayout, { AdminDemoNotice } from '../components/admin/AdminLayout';
import AdminModal from '../components/admin/AdminModal';
import AdminPagination from '../components/admin/AdminPagination';
import CategoryForm from '../components/admin/CategoryForm';
import CategoryImage from '../components/admin/CategoryImage';
import CategoriesTable, { CategoryStatus } from '../components/admin/CategoriesTable';
import { useAdminCatalog } from '../context/AdminCatalogContext';
import { dashboardDemo } from '../data/admin/dashboardDemo';
import { categoryLinks, categoryStatistics, CategoryValidationError, filterCategories } from '../utils/adminCategories';
import { categoryPath, categoryProductCount, descendantCategoryIds } from '../utils/categoryTree';
import { paginateOrders as paginateCategories } from '../utils/adminOrders';

const initialFilters = { search: '', scope: 'roots', status: 'all' };
const cards = [
  { id: 'all', label: 'إجمالي التصنيفات', Icon: Layers, background: 'bg-[#e4efff]', color: 'text-[#0875ed]', iconBackground: 'bg-blue-100' },
  { id: 'active', label: 'تصنيفات نشطة', Icon: Check, background: 'bg-[#e9fbf0]', color: 'text-green-600', iconBackground: 'bg-green-100' },
  { id: 'subcategories', label: 'تصنيفات فرعية', Icon: Network, background: 'bg-[#f2edff]', color: 'text-purple-700', iconBackground: 'bg-purple-100' },
  { id: 'inactive', label: 'تصنيفات غير نشطة', Icon: Trash2, background: 'bg-[#fff0f2]', color: 'text-red-500', iconBackground: 'bg-red-100' },
];

function DeleteCategoryForm({ category, categories, products, onConfirm, onCancel }) {
  const [replacement, setReplacement] = useState(''), [error, setError] = useState('');
  const links = categoryLinks(categories, products, category.id);
  const requiresTransfer = links.products > 0 || links.children > 0;
  const excluded = descendantCategoryIds(categories, category.id); excluded.add(category.id);
  const options = categories.filter(item => !excluded.has(item.id));
  function submit(event) {
    event.preventDefault();
    try { onConfirm(replacement || null); }
    catch (failure) { setError(failure instanceof CategoryValidationError ? Object.values(failure.errors)[0] : 'تعذر حذف التصنيف. يرجى المحاولة مجدداً.'); }
  }
  return <form onSubmit={submit} noValidate className="space-y-4">
    <TriangleAlert size={32} className="text-red-500" aria-hidden="true" />
    <p className="break-words text-base font-bold leading-8">هل تريد حذف التصنيف «{category.name}»؟</p>
    <p className="text-sm leading-7 text-slate-500">يُطبَّق الحذف على بيانات المعاينة فقط، دون التأثير على المتجر العام.</p>
    {requiresTransfer && <><p className="rounded-xl bg-orange/10 p-3 text-sm leading-7 text-[#965000]">يرتبط به {links.products} منتج بشكل مباشر و{links.children} تصنيف فرعي. اختر تصنيفاً بديلاً لنقل هذه الارتباطات قبل الحذف.</p><label className="block text-sm font-bold">التصنيف البديل<select name="replacement_id" value={replacement} onChange={event => { setReplacement(event.target.value); setError(''); }} required aria-invalid={Boolean(error)} aria-describedby={error ? 'category-delete-error' : undefined} className="mt-2 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"><option value="">اختر التصنيف البديل</option>{options.map(item => <option key={item.id} value={item.id}>{categoryPath(categories, item.id)}</option>)}</select></label>{!options.length && <p className="text-sm text-red-700">لا يوجد تصنيف بديل صالح. انقل أو احذف الارتباطات أولاً.</p>}</>}
    {error && <p id="category-delete-error" role="alert" className="text-sm leading-7 text-red-700">{error}</p>}
    <div className="flex flex-wrap gap-3"><button type="submit" disabled={requiresTransfer && !replacement} className="flex min-h-11 items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-40"><Trash2 size={18} aria-hidden="true" />تأكيد الحذف</button><button type="button" onClick={onCancel} className="min-h-11 rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold hover:bg-slate-50">إلغاء</button></div>
  </form>;
}

export function CategoryDetails({ category, categories, products, onEdit, onView, onProducts }) {
  const children = categories.filter(item => item.parent_id === category.id);
  return <div className="space-y-5">
    <div className="grid items-start gap-5 sm:grid-cols-[180px_minmax(0,1fr)]"><CategoryImage image={category.image} alt={category.name} className="h-40 w-full rounded-xl bg-slate-50" /><div className="space-y-3"><h3 className="break-words text-lg font-bold leading-8">{category.name}</h3><CategoryStatus active={category.is_active} /><dl className="grid grid-cols-2 gap-3 text-sm"><div><dt className="mb-1 text-xs text-slate-500">التصنيف الأب</dt><dd className="font-semibold">{category.parent_id ? categoryPath(categories, category.parent_id) : 'تصنيف رئيسي'}</dd></div><div><dt className="mb-1 text-xs text-slate-500">عدد المنتجات مع الفروع</dt><dd><button type="button" onClick={() => onProducts(category)} className="min-h-9 font-bold text-blue-700 underline underline-offset-4">{categoryProductCount(categories, products, category.id)} منتج</button></dd></div></dl></div></div>
    <section aria-label="وصف التصنيف"><h3 className="mb-2 text-sm font-bold">الوصف</h3><p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">{category.description || 'لا يوجد وصف لهذا التصنيف.'}</p></section>
    {children.length > 0 && <section aria-label="التصنيفات الفرعية"><h3 className="mb-2 text-sm font-bold">التصنيفات الفرعية</h3><div className="flex flex-wrap gap-2">{children.map(child => <button type="button" key={child.id} onClick={() => onView(child)} className="min-h-10 max-w-full break-words rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-brand hover:bg-blue-100">{child.name}</button>)}</div></section>}
    <div className="flex flex-wrap gap-3"><button type="button" onClick={() => onEdit(category)} className="min-h-11 rounded-xl bg-orange px-5 py-2 text-sm font-bold text-white">تعديل التصنيف</button><button type="button" onClick={() => onProducts(category)} className="min-h-11 rounded-xl bg-brand px-5 py-2 text-sm font-bold text-white">عرض المنتجات المرتبطة</button></div>
  </div>;
}

export default function AdminCategories({ preview, user }) {
  const { categories, products, saveCategory, deleteCategory, uploadImages, discardUnusedUploads } = useAdminCatalog();
  const [filters, setFilters] = useState(initialFilters), [page, setPage] = useState(1), [pageSize, setPageSize] = useState(5);
  const [dialog, setDialog] = useState(null), [notice, setNotice] = useState('');
  const navigate = useNavigate();
  const stats = categoryStatistics(categories);
  const pagination = paginateCategories(filterCategories(categories, filters), page, pageSize);
  const scopeTotal = filterCategories(categories, { scope: filters.scope }).length;
  const selected = dialog?.id ? categories.find(category => category.id === dialog.id) : null;
  useEffect(() => { const title = document.title; document.title = 'إدارة التصنيفات | إلكترو آدم'; return () => { document.title = title; }; }, []);
  function closeDialog() { setDialog(null); discardUnusedUploads(); }
  const viewCategory = category => setDialog({ kind: 'view', id: category.id });
  const editCategory = category => setDialog({ kind: 'edit', id: category.id });
  const askDelete = category => setDialog({ kind: 'delete', id: category.id });
  const viewProducts = category => navigate('/admin/products', { state: { category: category.id } });
  function changeFilter(name, value) { setFilters(current => ({ ...current, [name]: value })); setPage(1); }
  function filterByStat(id) { setFilters({ search: '', scope: id === 'subcategories' ? 'children' : 'roots', status: ['active', 'inactive'].includes(id) ? id : 'all' }); setPage(1); }
  function save(draft) {
    const result = saveCategory(draft, dialog.kind === 'edit' ? selected.id : null);
    setFilters({ search: '', scope: result.category.parent_id ? 'children' : 'roots', status: 'all' }); setPage(1);
    setNotice(`تم حفظ التصنيف «${result.category.name}». يمكنك الآن اختياره في نموذج المنتج.`);
    setDialog(null);
  }
  function remove(replacementId) {
    const name = selected.name;
    deleteCategory(selected.id, replacementId);
    setNotice(`تم حذف التصنيف «${name}» من المعاينة${replacementId ? ' ونقل ارتباطاته إلى التصنيف البديل' : ''}.`);
    setDialog(null);
  }
  const title = dialog?.kind === 'new' ? 'إضافة تصنيف جديد' : dialog?.kind === 'edit' ? 'تعديل التصنيف' : dialog?.kind === 'delete' ? 'تأكيد حذف التصنيف' : 'تفاصيل التصنيف';
  return <AdminLayout preview={preview} user={user} active="categories" newOrderCount={dashboardDemo.statistics.orders}>
    {({ logoutError }) => <>
      <main className="mx-auto max-w-[1500px] space-y-5 p-3 sm:p-5">
        <AdminDemoNotice preview={preview} subject="الأرقام والتصنيفات" />
        <section aria-labelledby="categories-title"><h1 id="categories-title" className="flex items-center gap-3 text-xl font-bold leading-9 sm:text-2xl"><LayoutGrid size={28} aria-hidden="true" />إدارة التصنيفات</h1><p className="text-xs font-semibold leading-7 text-slate-500 sm:text-sm">إضافة وتعديل وحذف تصنيفات المنتجات</p></section>
        {logoutError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{logoutError}</p>}
        <p role="status" aria-live="polite" className={notice ? 'rounded-lg bg-green-50 px-3 py-2 text-xs leading-6 text-green-800' : 'sr-only'}>{notice}</p>
        <section aria-label="إحصائيات التصنيفات الرئيسية والفروع" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {cards.map(({ id, label, Icon, background, color, iconBackground }) => <button type="button" key={id} onClick={() => filterByStat(id)} className={`flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-white/50 p-3 text-right shadow-[0_3px_12px_#123a7007] hover:shadow-md sm:p-4 ${background}`}><span className="min-w-0"><span className="block text-[11px] font-bold leading-6 sm:text-xs">{label}</span><strong className="block text-xl leading-8 sm:text-2xl">{stats[id]}</strong></span><span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${color} ${iconBackground}`}><Icon size={25} aria-hidden="true" /></span></button>)}
          <p className="sr-only">إجمالي ونشاط التصنيفات الرئيسية، مع إحصاء التصنيفات الفرعية بشكل منفصل.</p>
        </section>
        <section aria-label="قائمة التصنيفات" className="min-w-0 rounded-2xl border border-[#e9edf5] bg-white p-3 shadow-[0_3px_12px_#123a7010] sm:p-4">
          <form onSubmit={event => event.preventDefault()} aria-label="البحث وتصفية التصنيفات" className="mb-5 grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_auto]">
            <label className="block min-w-0 sm:col-span-2 xl:col-span-1"><span className="sr-only">البحث باسم التصنيف</span><span className="relative block"><Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" /><input type="search" value={filters.search} onChange={event => changeFilter('search', event.target.value)} placeholder="البحث عن تصنيف (الاسم...)" className="min-h-11 w-full min-w-0 rounded-xl border border-[#d5dce8] bg-white py-2 pr-9 pl-3 text-xs" /></span></label>
            <label className="block min-w-0"><span className="sr-only">نوع التصنيفات المعروضة</span><select value={filters.scope} onChange={event => changeFilter('scope', event.target.value)} className="min-h-11 w-full rounded-xl border border-[#d5dce8] bg-white px-3 py-2 text-xs font-semibold"><option value="roots">التصنيفات الرئيسية</option><option value="children">التصنيفات الفرعية</option><option value="all">جميع التصنيفات</option></select></label>
            <button type="button" onClick={() => setDialog({ kind: 'new' })} className="flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-orange px-4 py-2 text-sm font-bold text-white hover:brightness-95"><Plus size={20} aria-hidden="true" />إضافة تصنيف جديد</button>
          </form>
          {Object.keys(initialFilters).some(key => filters[key] !== initialFilters[key]) && <button type="button" onClick={() => { setFilters(initialFilters); setPage(1); }} className="mb-3 min-h-9 text-xs font-semibold text-[#c96500] underline underline-offset-4">إعادة ضبط البحث والفلاتر</button>}
          <CategoriesTable categories={pagination.items} allCategories={categories} products={products} onView={viewCategory} onEdit={editCategory} onDelete={askDelete} onProducts={viewProducts} />
          <AdminPagination pagination={pagination} total={scopeTotal} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} entity="تصنيفات" ariaLabel="صفحات التصنيفات" />
        </section>
      </main>
      <AdminModal open={Boolean(dialog)} onClose={closeDialog} title={<>{title}{selected && <bdi className="mr-2 text-sm text-slate-500">#{selected.display_id}</bdi>}</>} headingId="category-dialog-heading">
        {(dialog?.kind === 'new' || (dialog?.kind === 'edit' && selected)) && <CategoryForm key={selected?.id || 'new'} category={dialog.kind === 'edit' ? selected : null} categories={categories} onSave={save} onUpload={uploadImages} />}
        {dialog?.kind === 'view' && selected && <CategoryDetails category={selected} categories={categories} products={products} onEdit={editCategory} onView={viewCategory} onProducts={viewProducts} />}
        {dialog?.kind === 'delete' && selected && <DeleteCategoryForm key={selected.id} category={selected} categories={categories} products={products} onConfirm={remove} onCancel={closeDialog} />}
      </AdminModal>
    </>}
  </AdminLayout>;
}
