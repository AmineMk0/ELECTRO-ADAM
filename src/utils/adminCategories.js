import { categoryImageSamples } from '../data/admin/categoriesDemo.js';
import { validProductImage } from './adminProducts.js';
import { descendantCategoryIds } from './categoryTree.js';

export class CategoryValidationError extends Error {
  constructor(errors) { super('يرجى التحقق من بيانات التصنيف.'); this.name = 'CategoryValidationError'; this.errors = errors; }
}
export function categorySearchKey(value) {
  return String(value).normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').trim().toLocaleLowerCase('ar').replace(/\s+/g, ' ');
}
export const validCategoryImage = image => Boolean(image && (image.kind === 'category-reference'
  ? typeof image.id === 'string' && categoryImageSamples.some(sample => sample.id === image.reference_id)
  : validProductImage(image)));

export function categoryStatistics(categories) {
  const roots = categories.filter(category => !category.parent_id);
  return { all: roots.length, active: roots.filter(category => category.is_active).length, subcategories: categories.length - roots.length, inactive: roots.filter(category => !category.is_active).length };
}
export function filterCategories(categories, { search = '', scope = 'roots', status = 'all' } = {}) {
  const query = categorySearchKey(search);
  return categories.filter(category => (scope === 'all' || (scope === 'children' ? Boolean(category.parent_id) : !category.parent_id))
    && (status === 'all' || category.is_active === (status === 'active'))
    && (!query || categorySearchKey(category.name).includes(query)));
}

export function saveDemoCategory(categories, draft, editingId = null, now = new Date()) {
  const existing = editingId === null ? null : categories.find(category => category.id === editingId);
  if (editingId !== null && !existing) throw new CategoryValidationError({ form: 'التصنيف غير موجود.' });
  const name = String(draft.name || '').trim(), description = String(draft.description || '').trim();
  const parent_id = draft.parent_id || null, errors = {};
  if (name.length < 2 || name.length > 100) errors.name = 'يرجى إدخال اسم من حرفين إلى 100 حرف.';
  if (description.length > 2000) errors.description = 'الحد الأقصى للوصف هو 2000 حرف.';
  if (parent_id && !categories.some(category => category.id === parent_id)) errors.parent_id = 'يرجى اختيار تصنيف أب صحيح.';
  if (editingId && (parent_id === editingId || descendantCategoryIds(categories, editingId).has(parent_id))) errors.parent_id = 'لا يمكن وضع التصنيف داخل نفسه أو داخل أحد فروعه.';
  if (categories.some(category => category.id !== editingId && (category.parent_id || null) === parent_id && categorySearchKey(category.name) === categorySearchKey(name))) errors.name = 'يوجد تصنيف بهذا الاسم تحت نفس التصنيف الأب.';
  if (typeof draft.is_active !== 'boolean') errors.is_active = 'يرجى تحديد حالة التصنيف.';
  if (!validCategoryImage(draft.image)) errors.image = 'يرجى إضافة صورة صحيحة للتصنيف.';
  if (Object.keys(errors).length) throw new CategoryValidationError(errors);
  const display_id = existing?.display_id ?? Math.max(0, ...categories.map(category => category.display_id)) + 1;
  const category = { ...(existing || {}), id: existing?.id ?? `demo-category-${display_id}`, display_id, name, description, parent_id, image: { ...draft.image }, is_active: draft.is_active, created_at: existing?.created_at ?? now.toISOString(), updated_at: now.toISOString() };
  return { category, categories: existing ? categories.map(item => item.id === editingId ? category : item) : [category, ...categories] };
}

export function categoryLinks(categories, products, id) {
  return { products: products.filter(product => product.category_id === id).length, children: categories.filter(category => category.parent_id === id).length };
}
export function deleteDemoCategory(categories, products, id, replacementId = null, now = new Date()) {
  const category = categories.find(item => item.id === id);
  if (!category) throw new CategoryValidationError({ form: 'التصنيف غير موجود.' });
  const links = categoryLinks(categories, products, id);
  if (links.products || links.children) {
    const descendants = descendantCategoryIds(categories, id);
    if (!replacementId || replacementId === id || descendants.has(replacementId) || !categories.some(item => item.id === replacementId)) throw new CategoryValidationError({ replacement_id: 'اختر تصنيفاً بديلاً لنقل المنتجات والتصنيفات الفرعية المرتبطة.' });
    for (const child of categories.filter(item => item.parent_id === id)) {
      if (categories.some(other => other.id !== id && other.id !== child.id && other.parent_id === replacementId && categorySearchKey(other.name) === categorySearchKey(child.name))) throw new CategoryValidationError({ replacement_id: 'يوجد فرع بنفس الاسم في التصنيف البديل. عدّل أسماء الفروع أولاً.' });
    }
  }
  return {
    categories: categories.filter(item => item.id !== id).map(item => item.parent_id === id ? { ...item, parent_id: replacementId, updated_at: now.toISOString() } : item),
    products: products.map(product => product.category_id === id ? { ...product, category_id: replacementId, updated_at: now.toISOString() } : product),
  };
}
