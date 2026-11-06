import { useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Box, Info, List, Minus, Package, Plus, RotateCcw, Save, Settings, X } from 'lucide-react';
import AdminLayout, { AdminDemoNotice } from '../components/admin/AdminLayout';
import DynamicProductListEditor from '../components/admin/DynamicProductListEditor';
import ProductImageManager from '../components/admin/ProductImageManager';
import { useAdminCatalog } from '../context/AdminCatalogContext';
import { dashboardDemo } from '../data/admin/dashboardDemo';
import { MAX_CREATE_IMAGES } from '../utils/adminProductCreate';
import { createProductCreateState, flushProductEditors, primaryProductImage, productCreateReducer, serializeProductCreateState } from '../utils/productCreateDraft';

const inputClass = 'min-h-10 w-full min-w-0 rounded-lg border border-[#d6deeb] bg-white px-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
function Field({ name, label, required, error, children }) {
  return <div className="min-w-0"><label htmlFor={`product-${name}`} className="mb-2 block text-xs font-bold">{label}{required && <span className="mr-1 text-red-500">*</span>}</label>{children}{error && <p id={`product-${name}-error`} className="mt-1 text-[11px] leading-5 text-red-600">{error}</p>}</div>;
}
const lists = [
  { list: 'description_points', title: 'وصف المنتج (قائمة نقاط)', Icon: List },
  { list: 'specifications', title: 'مواصفات المنتج', Icon: Settings },
  { list: 'package_contents', title: 'محتويات العلبة', Icon: Box },
];

export default function AdminProductAdd({ preview, user }) {
  const { products, categoryOptions, saveFullProduct, uploadImages, releaseUnusedImages } = useAdminCatalog();
  const [state, dispatch] = useReducer(productCreateReducer, products, createProductCreateState);
  const [errors, setErrors] = useState({}), [notice, setNotice] = useState('');
  const form = useRef(null), navigate = useNavigate();
  const draft = state.draft;
  useEffect(() => { const title = document.title; document.title = 'إضافة منتج جديد | إلكترو آدم'; return () => { document.title = title; }; }, []);
  function field(name, value) { dispatch({ type: 'field', name, value }); setErrors(previous => ({ ...previous, [name]: '' })); setNotice(''); }
  function input(name, type = 'text', extra = {}) { return <input {...extra} id={`product-${name}`} name={name} type={type} value={draft[name]} onChange={event => field(name, event.target.value)} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `product-${name}-error` : undefined} className={inputClass} />; }
  function addImages(files) {
    if (!files.length) return;
    try {
      if (draft.images.length + files.length > MAX_CREATE_IMAGES) throw new Error('يمكن إضافة 5 صور كحد أقصى.');
      const images = uploadImages(files, draft.images.length);
      dispatch({ type: 'images', images: [...draft.images, ...images] }); setErrors(previous => ({ ...previous, images: '' }));
    } catch (error) { setErrors(previous => ({ ...previous, images: error.message })); }
  }
  function removeImage(id) { releaseUnusedImages(draft.images.filter(image => image.id === id)); dispatch({ type: 'images', images: draft.images.filter(image => image.id !== id) }); }
  function reset() { releaseUnusedImages(draft.images); dispatch({ type: 'replace', state: createProductCreateState(products) }); setErrors({}); setNotice(''); }
  function focusError(nextErrors) {
    const key = Object.keys(nextErrors).find(name => nextErrors[name]);
    const id = lists.some(item => item.list === key) ? `${key}-${key === 'specifications' ? 'name' : 'text'}` : `product-${key}`;
    form.current?.querySelector(`[id="${id}"]`)?.focus();
  }
  function save(event) {
    event.preventDefault(); setNotice('');
    const flushed = flushProductEditors(state); dispatch({ type: 'replace', state: flushed });
    const pendingErrors = Object.fromEntries(Object.entries(flushed.listErrors).filter(([, value]) => value));
    if (Object.keys(pendingErrors).length) { setErrors(pendingErrors); focusError(pendingErrors); return; }
    try {
      const result = saveFullProduct(serializeProductCreateState(flushed));
      const product = result.product;
      setNotice(`تم حفظ المنتج ${product.reference} في بيانات المعاينة: ${product.images.length} صور، ${product.description_points.length} نقاط وصف، ${product.specifications.length} مواصفات، ${product.package_contents.length} عناصر في العلبة. تُحفظ البيانات مؤقتاً حتى إعادة تحميل الصفحة.`);
      dispatch({ type: 'replace', state: createProductCreateState(result.products) }); setErrors({});
      form.current?.querySelector('[role="status"]')?.focus();
    } catch (error) { const nextErrors = error.errors || { form: 'تعذر حفظ المنتج. يرجى المحاولة مجدداً.' }; setErrors(nextErrors); focusError(nextErrors); }
  }
  return <AdminLayout preview={preview} user={user} active="products" newOrderCount={dashboardDemo.statistics.orders}>{({ logoutError }) => <main className="mx-auto max-w-[1500px] space-y-4 p-3 sm:p-5">
    <AdminDemoNotice preview={preview} subject="المنتجات المضافة" />
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="flex items-center gap-2 text-xl font-bold sm:text-2xl"><Package size={27} aria-hidden="true" />إضافة منتج جديد</h1><p className="mt-1 text-xs leading-6 text-slate-500">إدخال جميع معلومات المنتج في صفحة واحدة</p></div><nav aria-label="مسار الصفحة" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs shadow-sm"><Link to="/admin/products" className="font-bold hover:text-orange">المنتجات</Link><span>/</span><span>إضافة منتج جديد</span><ArrowLeft size={16} aria-hidden="true" /></nav></div>
    {logoutError && <p role="alert" className="text-xs text-red-600">{logoutError}</p>}
    <form ref={form} noValidate onSubmit={save} onReset={event => { event.preventDefault(); reset(); }} className="space-y-4">
      <div role="status" tabIndex={-1} className={notice ? 'rounded-lg bg-green-50 p-3 text-xs leading-7 text-green-800' : 'sr-only'}>{notice}{notice && <Link to="/admin/products" className="mr-2 font-bold underline">عرض قائمة المنتجات</Link>}</div>
      {Object.values(errors).some(Boolean) && <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs leading-6 text-red-700">{errors.form || 'يرجى التحقق من الحقول الموضحة أدناه قبل حفظ المنتج.'}</p>}
      <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(245px,29%)]">
        <section aria-labelledby="basic-product-title" className="min-w-0 rounded-2xl bg-white p-4 shadow-[0_2px_7px_#123a7010]"><h2 id="basic-product-title" className="mb-5 flex items-center gap-2 text-base font-bold"><Info size={23} className="text-[#0875ed]" aria-hidden="true" />المعلومات الأساسية</h2><div className="grid gap-x-3 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
          <Field name="name" label="اسم المنتج" required error={errors.name}>{input('name', 'text', { required: true, maxLength: 140, placeholder: 'مثال: سماعات JBL Tune 510' })}</Field>
          <Field name="reference" label="المرجع (SKU)" required error={errors.reference}>{input('reference', 'text', { required: true, maxLength: 40, dir: 'ltr' })}</Field>
          <Field name="category_id" label="التصنيف" required error={errors.category_id}><select id="product-category_id" name="category_id" required value={draft.category_id} onChange={event => field('category_id', event.target.value)} aria-invalid={Boolean(errors.category_id)} aria-describedby={errors.category_id ? 'product-category_id-error' : undefined} className={inputClass}><option value="">اختر التصنيف</option>{categoryOptions.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field>
          <Field name="brand" label="العلامة التجارية" error={errors.brand}>{input('brand', 'text', { maxLength: 100, placeholder: 'مثال: JBL' })}</Field>
          {['price', 'promotional_price'].map(name => <Field key={name} name={name} label={name === 'price' ? 'السعر الأساسي' : 'سعر التخفيض (اختياري)'} required={name === 'price'} error={errors[name]}><div className="relative">{input(name, 'number', { min: name === 'price' ? '0.01' : '0', step: '0.01', dir: 'ltr', required: name === 'price', placeholder: '0.00', style: { paddingLeft: 38 } })}<span className="pointer-events-none absolute inset-y-0 left-0 flex items-center rounded-l-lg bg-slate-100 px-2 text-[10px]">DH</span></div></Field>)}
          <Field name="stock" label="الكمية في المخزون" required error={errors.stock}><div className="flex items-center"><button type="button" aria-label="زيادة الكمية" onClick={() => field('stock', String(Math.min(1000000, (Number(draft.stock) || 0) + 1)))} className="flex size-10 shrink-0 items-center justify-center rounded-r-lg border border-l-0 border-[#d6deeb]"><Plus size={16} /></button>{input('stock', 'number', { required: true, min: 0, max: 1000000, step: 1, dir: 'ltr' })}<button type="button" aria-label="تقليل الكمية" onClick={() => field('stock', String(Math.max(0, (Number(draft.stock) || 0) - 1)))} className="flex size-10 shrink-0 items-center justify-center rounded-l-lg border border-r-0 border-[#d6deeb]"><Minus size={16} /></button></div></Field>
          <Field name="is_active" label="حالة المنتج" error={errors.is_active}><button id="product-is_active" type="button" role="switch" aria-checked={draft.is_active} aria-label="حالة المنتج" onClick={() => field('is_active', !draft.is_active)} className="flex min-h-10 w-full items-center justify-between gap-2 text-xs"><span>{draft.is_active ? 'نشط' : 'غير نشط'}</span><span className={`flex h-6 w-11 items-center rounded-full p-1 ${draft.is_active ? 'justify-start bg-green-600' : 'justify-end bg-slate-300'}`}><span className="size-4 rounded-full bg-white shadow" /></span></button></Field>
        </div></section>
        <ProductImageManager images={draft.images} onUpload={addImages} onRemove={removeImage} onPrimary={id => dispatch({ type: 'images', images: primaryProductImage(draft.images, id) })} error={errors.images} />
        <div className="min-w-0 lg:col-start-1 lg:row-start-2"><DynamicProductListEditor {...lists[0]} state={state} dispatch={dispatch} error={state.listErrors.description_points || errors.description_points} /></div>
        <div className="grid min-w-0 gap-3 md:grid-cols-2 lg:col-start-1 lg:row-start-3">{lists.slice(1).map(config => <DynamicProductListEditor key={config.list} {...config} state={state} dispatch={dispatch} error={state.listErrors[config.list] || errors[config.list]} />)}</div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_7px_#123a7010]"><button type="submit" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange px-8 py-2.5 text-sm font-bold text-white hover:brightness-95 sm:w-auto"><Save size={20} />حفظ المنتج</button><div className="grid w-full grid-cols-2 gap-2 sm:w-auto"><button type="reset" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold hover:bg-slate-50"><RotateCcw size={18} />إعادة التعيين</button><button type="button" onClick={() => { releaseUnusedImages(draft.images); navigate('/admin/products'); }} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold hover:bg-slate-50"><X size={18} />إلغاء</button></div></div>
    </form>
  </main>}</AdminLayout>;
}
