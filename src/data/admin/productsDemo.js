// Fictional Product DTOs, independent from the public catalogue and checkout.
export const productCategories = [
  { id: 'phones', name: 'الهواتف' }, { id: 'accessories', name: 'الإكسسوارات' },
  { id: 'computers', name: 'الحواسيب' }, { id: 'audio', name: 'الصوتيات' },
  { id: 'home', name: 'الأجهزة المنزلية' }, { id: 'drones', name: 'الدرون' },
  { id: 'gaming', name: 'الألعاب' }, { id: 'chargers', name: 'الشواحن' },
];
export const productImageSamples = [
  { id: 'phone', label: 'هاتف', viewBox: '1082 445 90 76' },
  { id: 'headphones', label: 'سماعات', viewBox: '1080 520 100 65' },
  { id: 'laptop', label: 'حاسوب', viewBox: '1076 590 104 60' },
  { id: 'speaker', label: 'مكبر صوت', viewBox: '1070 650 110 55' },
  { id: 'air-fryer', label: 'مقلاة هوائية', viewBox: '1086 712 90 78' },
];
export const sampleProductImage = key => ({ id: `reference-${key}`, kind: 'reference', reference_id: key });
const templates = [
  { name: 'هاتف Samsung A54', category_id: 'phones', price: 1299, image: 'phone' },
  { name: 'سماعات JBL Tune 510', category_id: 'accessories', price: 599, image: 'headphones' },
  { name: 'حاسوب HP Pavilion 15', category_id: 'computers', price: 2399, image: 'laptop' },
  { name: 'مكبر صوت JBL Charge 5', category_id: 'audio', price: 799, image: 'speaker' },
  { name: 'مقلاة هوائية Air Fryer 5L', category_id: 'home', price: 1499, image: 'air-fryer' },
  { name: 'درون للتصوير', category_id: 'drones', price: 999 },
  { name: 'سماعة للألعاب', category_id: 'gaming', price: 349, image: 'headphones' },
  { name: 'شاحن سريع', category_id: 'chargers', price: 129 },
];

export function createProductsDemo() {
  return Array.from({ length: 86 }, (_, index) => {
    const template = templates[index % templates.length], id = 1006 - index;
    const stock = index < 5 ? [45, 5, 28, 32, 0][index] : index < 12 ? 0 : index < 23 ? 1 + index % 5 : 10 + index % 40;
    return {
      id, reference: `EA-${id}`, name: template.name + (index < 5 ? '' : ` — إصدار ${Math.floor(index / templates.length) + 1}`),
      description: 'وصف تجريبي للمنتج للاطلاع على واجهة الإدارة. هذا المنتج ليس منشوراً في المتجر.',
      category_id: template.category_id, price: template.price, promotional_price: null, stock,
      images: template.image ? [sampleProductImage(template.image)] : [{ id: `asset-${id}`, kind: 'asset', url: '/assets/product.png' }],
      currency: 'MAD', created_at: '2026-10-31T10:00:00Z', updated_at: '2026-10-31T10:00:00Z',
    };
  });
}
