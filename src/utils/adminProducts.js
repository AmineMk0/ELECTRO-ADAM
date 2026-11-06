import { productCategories, productImageSamples } from '../data/admin/productsDemo.js';
import { descendantCategoryIds } from './categoryTree.js';

export const LOW_STOCK_THRESHOLD = 5;
export const MAX_PRODUCT_IMAGES = 6;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
export const productStatuses = {
  available: { label: 'متوفر', badge: 'bg-green-100 text-green-800' },
  low: { label: 'مخزون منخفض', badge: 'bg-orange/15 text-[#c46300]' },
  unavailable: { label: 'غير متوفر', badge: 'bg-red-100 text-red-700' },
};
export function availability(product) { return product.stock === 0 ? 'unavailable' : product.stock <= LOW_STOCK_THRESHOLD ? 'low' : 'available'; }
export const currentProductPrice = product => product.promotional_price ?? product.price;
export function productStatistics(products, categories = productCategories) {
  return { all: products.length, categories: categories.filter(category => !category.parent_id).length, available: products.filter(product => product.stock > 0).length, low: products.filter(product => availability(product) === 'low').length, unavailable: products.filter(product => product.stock === 0).length };
}
function searchKey(value) {
  return String(value).normalize('NFKC').replace(/[٠-٩]/g, char => String(char.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, char => String(char.charCodeAt(0) - 1776)).replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').trim().toLocaleLowerCase('ar').replace(/\s+/g, ' ');
}
export function filterProducts(products, { search = '', category = 'all', status = 'all' } = {}, categories = productCategories) {
  const query = searchKey(search);
  const included = descendantCategoryIds(categories, category); included.add(category);
  return products.filter(product => (category === 'all' || included.has(product.category_id))
    && (status === 'all' || (status === 'available' ? product.stock > 0 : availability(product) === status))
    && (!query || searchKey(product.name).includes(query) || searchKey(product.reference).includes(query)));
}

export function validateImageFiles(files, existingCount = 0) {
  if (existingCount + files.length > MAX_PRODUCT_IMAGES) throw new Error('يمكنك إضافة 6 صور كحد أقصى.');
  for (const file of files) {
    if (!IMAGE_TYPES.includes(file.type)) throw new Error('يرجى اختيار صور بصيغة JPG أو PNG أو WebP أو AVIF.');
    if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error('يجب أن يكون حجم كل صورة أكبر من صفر وأقل من أو يساوي 5 ميغابايت.');
  }
}
export function validProductImage(image) {
  if (!image || typeof image.id !== 'string') return false;
  if (image.kind === 'reference') return productImageSamples.some(sample => sample.id === image.reference_id);
  if (image.kind === 'asset') return /^\/assets\/[\w-]+\.(?:png|jpe?g|webp)$/i.test(image.url || '');
  if (image.kind === 'upload') return typeof image.url === 'string' && image.url.startsWith('blob:') && IMAGE_TYPES.includes(image.file?.type) && image.file.size > 0 && image.file.size <= MAX_IMAGE_BYTES;
  return false;
}

export class ProductValidationError extends Error {
  constructor(errors) { super('يرجى التحقق من بيانات المنتج.'); this.name = 'ProductValidationError'; this.errors = errors; }
}
export const nextProductId = products => Math.max(0, ...products.map(product => product.id)) + 1;

export function validateProductDraft(draft, products, editingId = null, categories = productCategories) {
  const errors = {};
  const name = String(draft.name || '').trim(), description = String(draft.description || '').trim();
  const reference = String(draft.reference || '').trim().toUpperCase();
  const price = Math.round((Number(draft.price) + Number.EPSILON) * 100) / 100, stock = Number(draft.stock);
  const promotional_price = draft.promotional_price === '' || draft.promotional_price == null ? null : Math.round((Number(draft.promotional_price) + Number.EPSILON) * 100) / 100;
  if (name.length < 2 || name.length > 140) errors.name = 'يرجى إدخال اسم من حرفين إلى 140 حرفاً.';
  if (description.length > 5000) errors.description = 'الوصف طويل جداً. الحد الأقصى 5000 حرف.';
  if (!/^[A-Z0-9][A-Z0-9._-]{1,39}$/.test(reference)) errors.reference = 'يرجى إدخال مرجع من حرفين إلى 40 حرفاً بالأحرف اللاتينية أو الأرقام.';
  else if (products.some(product => product.id !== editingId && product.reference.toUpperCase() === reference)) errors.reference = 'هذا المرجع مستخدم لمنتج آخر.';
  if (!Number.isFinite(price) || price < 0.01 || price > 1e9) errors.price = 'يرجى إدخال سعر صحيح أكبر من صفر.';
  if (promotional_price !== null && (!Number.isFinite(promotional_price) || promotional_price <= 0 || promotional_price >= price)) errors.promotional_price = 'يجب أن يكون السعر الترويجي أكبر من صفر وأقل من السعر الأصلي.';
  if (String(draft.stock ?? '').trim() === '' || !Number.isInteger(stock) || stock < 0 || stock > 1000000) errors.stock = 'يرجى إدخال كمية صحيحة بين صفر ومليون.';
  if (!categories.some(category => category.id === draft.category_id)) errors.category_id = 'يرجى اختيار تصنيف صحيح.';
  if (!Array.isArray(draft.images) || !draft.images.length || draft.images.length > MAX_PRODUCT_IMAGES || !draft.images.every(validProductImage) || new Set(draft.images.map(image => image.id)).size !== draft.images.length) errors.images = 'يرجى إضافة صورة واحدة إلى 6 صور صحيحة.';
  return { errors, values: { name, description, reference, price, promotional_price, stock, category_id: draft.category_id, images: Array.isArray(draft.images) ? draft.images.map(image => ({ ...image })) : [] } };
}

export function saveDemoProduct(products, draft, editingId = null, now = new Date(), categories = productCategories) {
  const existing = editingId === null ? null : products.find(product => product.id === editingId);
  if (editingId !== null && !existing) throw new ProductValidationError({ form: 'المنتج غير موجود.' });
  const { errors, values } = validateProductDraft(draft, products, editingId, categories);
  if (Object.keys(errors).length) throw new ProductValidationError(errors);
  const product = { ...(existing || {}), ...values, id: existing?.id ?? nextProductId(products), currency: 'MAD', created_at: existing?.created_at ?? now.toISOString(), updated_at: now.toISOString() };
  if (existing?.primary_image_id) {
    product.images = product.images.map((image, position) => ({ ...image, position, is_primary: position === 0 }));
    product.primary_image_id = product.images[0]?.id || null;
  }
  return { product, products: existing ? products.map(item => item.id === existing.id ? product : item) : [product, ...products] };
}

export function deleteDemoProduct(products, id) {
  if (!products.some(product => product.id === id)) throw new Error('المنتج غير موجود.');
  return products.filter(product => product.id !== id);
}
