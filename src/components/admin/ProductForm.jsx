import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import ProductImage from './ProductImage';
import { productCategories, productImageSamples, sampleProductImage } from '../../data/admin/productsDemo';
import { MAX_PRODUCT_IMAGES, nextProductId, ProductValidationError } from '../../utils/adminProducts';
import { categoryPath } from '../../utils/categoryTree';

export default function ProductForm({ product, products, onSave, onUpload, categories = productCategories, defaultCategoryId = '' }) {
  const [draft, setDraft] = useState(() => ({
    name: product?.name || '', reference: product?.reference || `EA-${nextProductId(products)}`,
    description: product?.description || '', category_id: product?.category_id || defaultCategoryId,
    price: product?.price ?? '', promotional_price: product?.promotional_price ?? '', stock: product?.stock ?? '',
    images: product?.images.map(image => ({ ...image })) || [],
  }));
  const [errors, setErrors] = useState({});
  const form = useRef(null);
  function change(name, value) { setDraft(current => ({ ...current, [name]: value })); setErrors(current => ({ ...current, [name]: '', form: '' })); }
  function submit(event) {
    event.preventDefault();
    try { onSave(draft); }
    catch (error) {
      const fields = error instanceof ProductValidationError ? error.errors : { form: 'تعذر حفظ المنتج في المعاينة. يرجى المحاولة مجدداً.' };
      setErrors(fields);
      form.current.elements.namedItem(Object.keys(fields)[0])?.focus();
    }
  }
  function upload(event) {
    try { change('images', [...draft.images, ...onUpload([...event.target.files], draft.images.length)]); }
    catch (error) { setErrors(current => ({ ...current, images: error.message })); }
    event.target.value = '';
  }
  const inputClass = 'mt-1 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-800';
  const fieldProps = name => ({ name, value: draft[name], onChange: event => change(name, event.target.value), 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `product-error-${name}` : undefined, className: inputClass });
  const errorText = name => errors[name] && <p id={`product-error-${name}`} className="mt-1 text-xs leading-6 text-red-700">{errors[name]}</p>;
  return <form ref={form} onSubmit={submit} noValidate className="space-y-4">
    <p className="text-xs leading-6 text-slate-500">حفظ مؤقت في بيانات المعاينة فقط، دون تعديل منتجات المتجر العام.</p>
    {errors.form && <p role="alert" className="text-sm text-red-700">{errors.form}</p>}
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm font-bold">اسم المنتج<input {...fieldProps('name')} type="text" required maxLength={140} />{errorText('name')}</label>
      <label className="text-sm font-bold">مرجع المنتج<input {...fieldProps('reference')} type="text" required maxLength={40} dir="ltr" className={`${inputClass} text-right uppercase`} />{errorText('reference')}</label>
      <label className="text-sm font-bold">التصنيف<select {...fieldProps('category_id')} required><option value="">اختر التصنيف</option>{categories.map(category => <option key={category.id} value={category.id}>{category.parent_id ? categoryPath(categories, category.id) : category.name}</option>)}</select>{errorText('category_id')}</label>
      <label className="text-sm font-bold">الكمية في المخزون<input {...fieldProps('stock')} type="number" required min="0" max="1000000" step="1" />{errorText('stock')}</label>
      <label className="text-sm font-bold">السعر بالدرهم<input {...fieldProps('price')} type="number" required min="0.01" max="1000000000" step="0.01" />{errorText('price')}</label>
      <label className="text-sm font-bold">السعر الترويجي بالدرهم <span className="font-normal text-slate-500">(اختياري)</span><input {...fieldProps('promotional_price')} type="number" min="0.01" step="0.01" />{errorText('promotional_price')}</label>
    </div>
    <label className="block text-sm font-bold">وصف المنتج<textarea {...fieldProps('description')} rows={3} maxLength={5000} className={`${inputClass} resize-y leading-7`} />{errorText('description')}</label>
    <fieldset className="min-w-0 space-y-3">
      <legend className="text-sm font-bold">صور المنتج</legend>
      <label className="block rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-3 text-xs leading-6"><span className="mb-2 flex items-center gap-2 font-bold"><ImagePlus size={19} aria-hidden="true" />إضافة صور من جهازك</span><input type="file" name="images" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={upload} disabled={draft.images.length >= MAX_PRODUCT_IMAGES} aria-invalid={Boolean(errors.images)} aria-describedby={`product-image-help${errors.images ? ' product-error-images' : ''}`} className="block w-full min-w-0 text-xs file:ml-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-brand disabled:opacity-50" /><span id="product-image-help" className="mt-2 block text-slate-500">حتى 6 صور، 5 ميغابايت لكل صورة. JPG، PNG، WebP أو AVIF.</span></label>
      {errorText('images')}
      {draft.images.length > 0 && <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 sm:grid-cols-4">{draft.images.map((image, index) => <div key={image.id} className="relative min-w-0 rounded-xl border border-slate-200 p-2 text-center"><button type="button" onClick={() => change('images', draft.images.filter(item => item.id !== image.id))} aria-label={`إزالة الصورة ${index + 1}`} className="absolute left-0 top-0 flex size-9 items-center justify-center rounded-lg bg-white/90 text-red-600 hover:bg-red-50"><X size={16} /></button><ProductImage image={image} alt={`${draft.name || 'المنتج'} — صورة ${index + 1}`} className="mx-auto h-20 w-full" />{index === 0 ? <span className="text-[10px] font-bold text-blue-700">الصورة الرئيسية</span> : <button type="button" onClick={() => change('images', [image, ...draft.images.filter(item => item.id !== image.id)])} className="min-h-9 text-[10px] font-semibold text-brand underline">تعيين كرئيسية</button>}</div>)}</div>}
      <p className="text-xs text-slate-500">أو اختر صورة تجريبية:</p>
      <div className="grid grid-cols-5 gap-2">{productImageSamples.map(sample => <button type="button" key={sample.id} disabled={draft.images.length >= MAX_PRODUCT_IMAGES || draft.images.some(image => image.reference_id === sample.id)} onClick={() => change('images', [...draft.images, sampleProductImage(sample.id)])} aria-label={`استخدام صورة ${sample.label}`} className="min-w-0 rounded-lg border border-slate-200 p-1 hover:bg-blue-50 disabled:opacity-35"><ProductImage image={sampleProductImage(sample.id)} alt={sample.label} className="h-12 w-full" /></button>)}</div>
    </fieldset>
    <button type="submit" className="min-h-11 rounded-xl bg-orange px-6 py-2 text-sm font-bold text-white hover:brightness-95">{product ? 'حفظ التعديلات' : 'إضافة المنتج'}</button>
  </form>;
}
