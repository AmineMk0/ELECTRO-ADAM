import { productCategories } from '../data/admin/productsDemo.js';
import { nextProductId, ProductValidationError, validateProductDraft } from './adminProducts.js';

export const MAX_CREATE_IMAGES = 5;

export function validateFullProductDraft(draft, products, categories = productCategories) {
  const base = validateProductDraft({ ...draft, description: '' }, products, null, categories);
  const errors = { ...base.errors };
  const brand = String(draft.brand || '').trim();
  if (brand.length > 100) errors.brand = 'الحد الأقصى للعلامة التجارية هو 100 حرف.';
  if (typeof draft.is_active !== 'boolean') errors.is_active = 'يرجى تحديد حالة المنتج.';
  if (Array.isArray(draft.images) && draft.images.length > MAX_CREATE_IMAGES) errors.images = 'يمكن إضافة 5 صور كحد أقصى.';
  for (const [key, limit] of [['description_points', 2000], ['package_contents', 2000]]) {
    if (!Array.isArray(draft[key]) || draft[key].some(value => typeof value !== 'string' || !value.trim() || value.trim().length > limit)) errors[key] = 'يرجى التحقق من عناصر القائمة وإزالة العناصر الفارغة.';
  }
  if (!Array.isArray(draft.specifications) || draft.specifications.some(row => !row || typeof row.name !== 'string' || !row.name.trim() || row.name.trim().length > 120 || typeof row.value !== 'string' || !row.value.trim() || row.value.trim().length > 500)) errors.specifications = 'يجب أن تحتوي كل مواصفة على اسم وقيمة صحيحة.';
  return {
    errors,
    values: {
      ...base.values, brand, is_active: draft.is_active,
      description: Array.isArray(draft.description_points) && typeof draft.description_points[0] === 'string' ? draft.description_points[0].trim() : '',
      description_points: Array.isArray(draft.description_points) ? draft.description_points.map(value => typeof value === 'string' ? value.trim() : value) : [],
      specifications: Array.isArray(draft.specifications) ? draft.specifications.map(row => ({ name: typeof row?.name === 'string' ? row.name.trim() : '', value: typeof row?.value === 'string' ? row.value.trim() : '' })) : [],
      package_contents: Array.isArray(draft.package_contents) ? draft.package_contents.map(value => typeof value === 'string' ? value.trim() : value) : [],
      images: base.values.images.map((image, position) => ({ ...image, position, is_primary: position === 0 })),
      primary_image_id: base.values.images[0]?.id || null,
    },
  };
}

export function saveFullDemoProduct(products, draft, categories = productCategories, now = new Date()) {
  const { errors, values } = validateFullProductDraft(draft, products, categories);
  if (Object.keys(errors).length) throw new ProductValidationError(errors);
  const product = { ...values, id: nextProductId(products), currency: 'MAD', created_at: now.toISOString(), updated_at: now.toISOString() };
  return { product, products: [product, ...products] };
}

// Future Laravel multipart contract; mock screenshots/assets are not real uploads.
export function buildProductFormData(product) {
  if (product.images.some(image => image.kind !== 'upload' || !(image.file instanceof Blob))) throw new ProductValidationError({ images: 'الصور التجريبية مخصصة للمعاينة. اختر ملفات صور فعلية قبل الإرسال إلى الخادم.' });
  const data = new FormData();
  for (const key of ['name', 'reference', 'brand', 'category_id', 'price', 'stock']) data.append(key, String(product[key]));
  data.append('promotional_price', product.promotional_price == null ? '' : String(product.promotional_price));
  data.append('is_active', product.is_active ? '1' : '0');
  product.description_points.forEach((text, index) => data.append(`description_points[${index}]`, text));
  product.specifications.forEach((row, index) => { data.append(`specifications[${index}][name]`, row.name); data.append(`specifications[${index}][value]`, row.value); });
  product.package_contents.forEach((text, index) => data.append(`package_contents[${index}]`, text));
  product.images.forEach((image, index) => { data.append(`images[${index}]`, image.file, image.file.name || `product-${index}.png`); data.append(`image_order[${index}]`, String(index)); data.append(`image_is_primary[${index}]`, index === 0 ? '1' : '0'); });
  return data;
}
