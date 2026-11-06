import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import CategoryImage from './CategoryImage';
import { categoryImageSamples, sampleCategoryImage } from '../../data/admin/categoriesDemo';
import { CategoryValidationError } from '../../utils/adminCategories';
import { categoryPath, descendantCategoryIds } from '../../utils/categoryTree';

export default function CategoryForm({ category, categories, onSave, onUpload }) {
  const [draft, setDraft] = useState(() => ({ name: category?.name || '', description: category?.description || '', image: category?.image ? { ...category.image } : null, parent_id: category?.parent_id || '', is_active: category?.is_active ?? true }));
  const [errors, setErrors] = useState({});
  const form = useRef(null);
  const forbidden = category ? descendantCategoryIds(categories, category.id) : new Set();
  if (category) forbidden.add(category.id);
  function change(name, value) { setDraft(current => ({ ...current, [name]: value })); setErrors(current => ({ ...current, [name]: '', form: '' })); }
  function submit(event) {
    event.preventDefault();
    try { onSave(draft); }
    catch (error) {
      const fields = error instanceof CategoryValidationError ? error.errors : { form: 'تعذر حفظ التصنيف. يرجى المحاولة مجدداً.' };
      setErrors(fields); form.current.elements.namedItem(Object.keys(fields)[0])?.focus();
    }
  }
  function upload(event) {
    const file = event.target.files?.[0];
    if (file) try { change('image', onUpload([file], 0)[0]); } catch (error) { setErrors(current => ({ ...current, image: error.message })); }
    event.target.value = '';
  }
  const inputClass = 'mt-1 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-800';
  const props = name => ({ name, value: draft[name], onChange: event => change(name, event.target.value), 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `category-error-${name}` : undefined, className: inputClass });
  const errorText = name => errors[name] && <p id={`category-error-${name}`} className="mt-1 text-xs leading-6 text-red-700">{errors[name]}</p>;
  return <form ref={form} onSubmit={submit} noValidate className="space-y-4">
    <p className="text-xs leading-6 text-slate-500">حفظ مؤقت في الإدارة. سيكون التصنيف متاحاً لاختياره عند إضافة أو تعديل منتج.</p>
    {errors.form && <p role="alert" className="text-sm text-red-700">{errors.form}</p>}
    <label className="block text-sm font-bold">اسم التصنيف<input {...props('name')} type="text" required maxLength={100} />{errorText('name')}</label>
    <label className="block text-sm font-bold">الوصف<textarea {...props('description')} rows={3} maxLength={2000} className={`${inputClass} resize-y leading-7`} />{errorText('description')}</label>
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block text-sm font-bold">التصنيف الأب <span className="font-normal text-slate-500">(اختياري)</span><select {...props('parent_id')}><option value="">بدون — تصنيف رئيسي</option>{categories.filter(item => !forbidden.has(item.id)).map(item => <option key={item.id} value={item.id}>{categoryPath(categories, item.id)}</option>)}</select>{errorText('parent_id')}</label>
      <label className="block text-sm font-bold">الحالة<select name="is_active" value={draft.is_active ? 'active' : 'inactive'} onChange={event => change('is_active', event.target.value === 'active')} aria-invalid={Boolean(errors.is_active)} aria-describedby={errors.is_active ? 'category-error-is_active' : undefined} className={inputClass}><option value="active">نشط</option><option value="inactive">غير نشط</option></select>{errorText('is_active')}</label>
    </div>
    <fieldset className="space-y-3"><legend className="text-sm font-bold">صورة التصنيف</legend>
      <label className="block rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-3 text-xs leading-6"><span className="mb-2 flex items-center gap-2 font-bold"><ImagePlus size={19} aria-hidden="true" />اختيار صورة من جهازك</span><input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload} aria-invalid={Boolean(errors.image)} aria-describedby={`category-image-help${errors.image ? ' category-error-image' : ''}`} className="block w-full min-w-0 text-xs file:ml-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-brand" /><span id="category-image-help" className="mt-2 block text-slate-500">صورة واحدة بصيغة JPG أو PNG أو WebP أو AVIF، حتى 5 ميغابايت.</span></label>
      {errorText('image')}
      {draft.image && <div className="relative mx-auto w-40 rounded-xl border border-slate-200 p-2"><button type="button" onClick={() => change('image', null)} aria-label="إزالة صورة التصنيف" className="absolute left-0 top-0 flex size-9 items-center justify-center rounded-lg bg-white/90 text-red-600 hover:bg-red-50"><X size={16} /></button><CategoryImage image={draft.image} alt={draft.name || 'صورة التصنيف'} className="h-24 w-full" /></div>}
      <p className="text-xs text-slate-500">أو اختر صورة تجريبية:</p>
      <div className="grid grid-cols-5 gap-2">{categoryImageSamples.map(sample => <button type="button" key={sample.id} onClick={() => change('image', sampleCategoryImage(sample.id))} aria-label={`استخدام صورة ${sample.label}`} aria-pressed={draft.image?.reference_id === sample.id} className={`rounded-lg border p-1 hover:bg-blue-50 ${draft.image?.reference_id === sample.id ? 'border-orange' : 'border-slate-200'}`}><CategoryImage image={sampleCategoryImage(sample.id)} alt={sample.label} className="h-12 w-full" /></button>)}</div>
    </fieldset>
    <button type="submit" className="min-h-11 rounded-xl bg-orange px-6 py-2 text-sm font-bold text-white hover:brightness-95">{category ? 'حفظ التعديلات' : 'إضافة التصنيف'}</button>
  </form>;
}
