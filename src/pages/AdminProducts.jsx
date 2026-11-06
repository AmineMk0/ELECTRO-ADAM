import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminCatalog } from '../context/AdminCatalogContext';
import { Ban, Check, Layers, Package, Plus, Search, Tags, Trash2, TriangleAlert } from 'lucide-react';
import AdminLayout, { AdminDemoNotice } from '../components/admin/AdminLayout';
import AdminModal from '../components/admin/AdminModal';
import AdminPagination from '../components/admin/AdminPagination';
import ProductForm from '../components/admin/ProductForm';
import ProductImage from '../components/admin/ProductImage';
import ProductsTable from '../components/admin/ProductsTable';
import { productCategories } from '../data/admin/productsDemo';
import { dashboardDemo } from '../data/admin/dashboardDemo';
import { availability, currentProductPrice, filterProducts, productStatistics, productStatuses } from '../utils/adminProducts';
import { money, paginateOrders as paginateProducts } from '../utils/adminOrders';

const initialFilters = { search: '', category: 'all', status: 'all' };
const cards = [
  { id: 'all', label: 'إجمالي المنتجات', Icon: Layers, background: 'bg-[#e4efff]', color: 'text-[#0875ed]', iconBackground: 'bg-blue-100' },
  { id: 'categories', label: 'التصنيفات', Icon: Tags, background: 'bg-[#fff2e8]', color: 'text-orange', iconBackground: 'bg-orange/15' },
  { id: 'available', label: 'متوفر', Icon: Check, background: 'bg-[#e9fbf0]', color: 'text-green-600', iconBackground: 'bg-green-100' },
  { id: 'low', label: 'مخزون منخفض', Icon: Package, background: 'bg-[#f2edff]', color: 'text-purple-700', iconBackground: 'bg-purple-100' },
  { id: 'unavailable', label: 'غير متوفر', Icon: Ban, background: 'bg-[#fff0f2]', color: 'text-red-500', iconBackground: 'bg-red-100' },
];

export function ProductDetails({ product, onEdit, categories = productCategories }) {
  const [imageIndex, setImageIndex] = useState(0);
  const status = productStatuses[availability(product)];
  return <div className="space-y-5">
    <div className="grid items-start gap-5 sm:grid-cols-[200px_minmax(0,1fr)]">
      <div><ProductImage image={product.images[imageIndex]} alt={product.name} className="h-44 w-full rounded-xl bg-slate-50" /><div className="mt-2 flex flex-wrap justify-center gap-2">{product.images.map((image, index) => <button type="button" key={image.id} onClick={() => setImageIndex(index)} aria-label={`عرض صورة المنتج ${index + 1}`} aria-pressed={imageIndex === index} className={`rounded-lg border p-1 ${imageIndex === index ? 'border-orange' : 'border-slate-200'}`}><ProductImage image={image} alt="" className="h-10 w-12" /></button>)}</div></div>
      <div className="min-w-0 space-y-3"><h3 className="text-lg font-bold leading-8">{product.name}</h3><p className="text-xs text-slate-500"><bdi>{product.reference}</bdi></p><p className="text-xl font-bold"><bdi>{money(currentProductPrice(product))}</bdi>{product.promotional_price !== null && <del className="mr-3 text-sm font-normal text-slate-400"><bdi>{money(product.price)}</bdi></del>}</p><dl className="grid grid-cols-2 gap-3 text-sm"><div><dt className="mb-1 text-xs text-slate-500">التصنيف</dt><dd className="font-semibold">{categories.find(category => category.id === product.category_id)?.name}</dd></div><div><dt className="mb-1 text-xs text-slate-500">المخزون</dt><dd className="font-semibold">{product.stock} قطعة</dd></div></dl><span className={`inline-block rounded-lg px-3 py-1 text-xs font-bold ${status.badge}`}>{status.label}</span></div>
    </div>
    <section aria-label="وصف المنتج"><h3 className="mb-2 text-sm font-bold">الوصف</h3><p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">{product.description || 'لا يوجد وصف لهذا المنتج.'}</p></section>
    <button type="button" onClick={() => onEdit(product)} className="min-h-11 rounded-xl bg-orange px-5 py-2 text-sm font-bold text-white">تعديل المنتج</button>
  </div>;
}

export default function AdminProducts({ preview, user }) {
  const { products, categories, categoryOptions, saveProduct: saveCatalogProduct, deleteProduct, uploadImages, discardUnusedUploads } = useAdminCatalog();
  const location = useLocation(), navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1), [pageSize, setPageSize] = useState(5);
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState('');
  const stats = productStatistics(products, categories);
  const pagination = paginateProducts(filterProducts(products, filters, categories), page, pageSize);
  const selected = dialog?.id ? products.find(product => product.id === dialog.id) : null;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'إدارة المنتجات | إلكترو آدم';
    return () => { document.title = previousTitle; };
  }, []);
  useEffect(() => {
    const categoryId = location.state?.category;
    if (categoryId && categories.some(category => category.id === categoryId)) {
      setFilters({ ...initialFilters, category: categoryId }); setPage(1);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, categories, navigate]);
  function closeDialog() { setDialog(null); discardUnusedUploads(); }

  function changeFilter(name, value) { setFilters(current => ({ ...current, [name]: value })); setPage(1); }
  const viewProduct = product => setDialog({ kind: 'view', id: product.id });
  const editProduct = product => setDialog({ kind: 'edit', id: product.id });
  const askDelete = product => setDialog({ kind: 'delete', id: product.id });
  function saveProduct(draft) {
    const result = saveCatalogProduct(draft, dialog.kind === 'edit' ? selected.id : null);
    if (dialog.kind === 'new') { setFilters(initialFilters); setPage(1); }
    setNotice(`تم ${dialog.kind === 'edit' ? 'تحديث' : 'إضافة'} المنتج ${result.product.reference} في المعاينة فقط.`);
    setDialog(null);
  }
  function confirmDelete() {
    deleteProduct(selected.id);
    setNotice(`تم حذف المنتج ${selected.reference} من بيانات المعاينة فقط.`);
    setDialog(null);
  }
  const title = dialog?.kind === 'new' ? 'إضافة منتج جديد' : dialog?.kind === 'edit' ? 'تعديل المنتج' : dialog?.kind === 'delete' ? 'تأكيد حذف المنتج' : 'تفاصيل المنتج';

  return <AdminLayout preview={preview} user={user} active="products" newOrderCount={dashboardDemo.statistics.orders}>
    {({ logoutError }) => <>
      <main className="mx-auto max-w-[1500px] space-y-5 p-3 sm:p-5">
        <AdminDemoNotice preview={preview} subject="الأرقام والمنتجات" />
        <section aria-labelledby="products-title"><h1 id="products-title" className="flex items-center gap-3 text-xl font-bold leading-9 sm:text-2xl"><Package size={28} aria-hidden="true" />إدارة المنتجات</h1><p className="text-xs font-semibold leading-7 text-slate-500 sm:text-sm">إضافة وتعديل وحذف منتجات المتجر</p></section>
        {logoutError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{logoutError}</p>}
        <p role="status" aria-live="polite" className={notice ? 'rounded-lg bg-green-50 px-3 py-2 text-xs leading-6 text-green-800' : 'sr-only'}>{notice}</p>

        <section aria-label="إحصائيات المنتجات التجريبية" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {cards.map(({ id, label, Icon, background, color, iconBackground }) => <article key={id} className={`flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-white/50 p-3 shadow-[0_3px_12px_#123a7007] ${background}`}><div className="min-w-0"><h2 className="text-[11px] font-bold leading-6">{label}</h2><strong className="block text-xl leading-8 sm:text-2xl">{stats[id]}</strong></div><span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${color} ${iconBackground}`}><Icon size={24} aria-hidden="true" /></span></article>)}
        </section>

        <section aria-label="قائمة المنتجات" className="min-w-0 rounded-2xl border border-[#e9edf5] bg-white p-3 shadow-[0_3px_12px_#123a7010] sm:p-4">
          <form onSubmit={event => event.preventDefault()} aria-label="البحث وتصفية المنتجات" className="mb-5 grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
            <label className="block min-w-0 sm:col-span-2 xl:col-span-1"><span className="sr-only">البحث باسم المنتج أو مرجعه</span><span className="relative block"><Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" /><input type="search" value={filters.search} onChange={event => changeFilter('search', event.target.value)} placeholder="البحث عن منتج (الاسم، المرجع...)" className="min-h-11 w-full min-w-0 rounded-xl border border-[#d5dce8] bg-white py-2 pr-9 pl-3 text-xs" /></span></label>
            <label className="block min-w-0"><span className="sr-only">حالة توفر المنتج</span><select value={filters.status} onChange={event => changeFilter('status', event.target.value)} className="min-h-11 w-full rounded-xl border border-[#d5dce8] bg-white px-3 py-2 text-xs font-semibold"><option value="all">كل الحالات</option>{Object.entries(productStatuses).map(([id, status]) => <option key={id} value={id}>{status.label}</option>)}</select></label>
            <label className="block min-w-0"><span className="sr-only">تصنيف المنتج</span><select value={filters.category} onChange={event => changeFilter('category', event.target.value)} className="min-h-11 w-full rounded-xl border border-[#d5dce8] bg-white px-3 py-2 text-xs font-semibold"><option value="all">كل التصنيفات</option>{categoryOptions.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <button type="button" onClick={() => setDialog({ kind: 'new' })} className="flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-orange px-4 py-2 text-sm font-bold text-white hover:brightness-95"><Plus size={20} aria-hidden="true" />إضافة منتج جديد</button>
          </form>
          {Object.keys(initialFilters).some(key => filters[key] !== initialFilters[key]) && <button type="button" onClick={() => { setFilters(initialFilters); setPage(1); }} className="mb-3 min-h-9 text-xs font-semibold text-[#c96500] underline underline-offset-4">إعادة ضبط البحث والفلاتر</button>}
          <ProductsTable products={pagination.items} categories={categories} onView={viewProduct} onEdit={editProduct} onDelete={askDelete} />
          <AdminPagination pagination={pagination} total={products.length} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} entity="منتج" ariaLabel="صفحات المنتجات" />
        </section>
      </main>

      <AdminModal open={Boolean(dialog)} onClose={closeDialog} title={<>{title}{selected && <bdi className="mr-2 text-sm text-slate-500">{selected.reference}</bdi>}</>} headingId="product-dialog-heading">
        {(dialog?.kind === 'new' || (dialog?.kind === 'edit' && selected)) && <ProductForm key={selected?.id ?? 'new'} product={dialog.kind === 'edit' ? selected : null} products={products} categories={categoryOptions} defaultCategoryId={filters.category !== 'all' ? filters.category : ''} onSave={saveProduct} onUpload={uploadImages} />}
        {dialog?.kind === 'view' && selected && <ProductDetails key={selected.id} product={selected} categories={categories} onEdit={editProduct} />}
        {dialog?.kind === 'delete' && selected && <div className="space-y-4"><TriangleAlert size={32} className="text-red-500" aria-hidden="true" /><p className="text-base font-bold leading-8">هل تريد حذف المنتج «{selected.name}»؟</p><p className="text-sm leading-7 text-slate-500">سيُحذف من بيانات المعاينة فقط، ويمكن استعادته بإعادة تحميل الصفحة.</p><div className="flex flex-wrap gap-3"><button type="button" onClick={confirmDelete} className="flex min-h-11 items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700"><Trash2 size={18} aria-hidden="true" />تأكيد الحذف</button><button type="button" onClick={() => setDialog(null)} className="min-h-11 rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold hover:bg-slate-50">إلغاء</button></div></div>}
      </AdminModal>
    </>}
  </AdminLayout>;
}
