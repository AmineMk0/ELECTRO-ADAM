import { productCategories } from './productsDemo.js';

export const categoryImageSamples = [
  { id: 'computer', label: 'حاسوب', viewBox: '1090 455 90 62' },
  { id: 'phone', label: 'هاتف', viewBox: '1100 515 80 63' },
  { id: 'headphones', label: 'سماعات', viewBox: '1090 574 95 63' },
  { id: 'speaker', label: 'مكبر صوت', viewBox: '1080 637 110 49' },
  { id: 'home', label: 'جهاز منزلي', viewBox: '1090 690 100 67' },
];
export const sampleCategoryImage = id => ({ id: `category-image-${id}`, kind: 'category-reference', reference_id: id });

export function createCategoriesDemo() {
  const rows = [
    ['computers', 'أجهزة الكمبيوتر المحمولة والمكتبية', 'computer', true],
    ['phones', 'الهواتف الذكية وملحقاتها', 'phone', true],
    ['accessories', 'ملحقات الأجهزة الإلكترونية', 'headphones', true],
    ['audio', 'سماعات ومكبرات الصوت', 'speaker', true],
    ['home', 'أجهزة كهربائية للمطبخ والمنزل', 'home', false],
    ['drones', 'طائرات بدون طيار وملحقاتها', null, true],
    ['gaming', 'أجهزة وإكسسوارات الألعاب', null, true],
    ['chargers', 'الشواحن ومستلزمات الطاقة', null, false],
  ];
  const roots = rows.map(([id, description, image, is_active], index) => ({
    id, display_id: index + 1, name: productCategories.find(category => category.id === id).name,
    description, image: image ? sampleCategoryImage(image) : { id: `asset-${id}`, kind: 'asset', url: `/assets/category-${id === 'drones' ? 'drone' : id === 'gaming' ? 'gift' : 'electronics'}.png` },
    parent_id: null, is_active, created_at: '2026-10-31T10:00:00Z', updated_at: '2026-10-31T10:00:00Z',
  }));
  const children = [
    ['computers', 'الحواسيب المحمولة'], ['computers', 'الحواسيب المكتبية'],
    ['phones', 'الهواتف الذكية'], ['phones', 'أغطية الهواتف'],
    ['accessories', 'الكابلات'], ['accessories', 'ملحقات الشحن'],
    ['audio', 'سماعات الرأس'], ['audio', 'مكبرات الصوت'],
    ['home', 'أجهزة المطبخ'], ['home', 'أجهزة التنظيف'],
    ['drones', 'درون التصوير'], ['drones', 'بطاريات الدرون'],
    ['gaming', 'أجهزة الألعاب'], ['chargers', 'الشواحن اللاسلكية'],
  ].map(([parent_id, name], index) => {
    const parent = roots.find(category => category.id === parent_id);
    return { ...parent, id: `${parent_id}-child-${index + 1}`, display_id: index + 9, parent_id, name, description: `تصنيف فرعي ضمن ${parent.name}.`, image: { ...parent.image } };
  });
  return [...roots, ...children];
}

// Keep the original Products selector order; additional categories follow it.
export function productCategoryOptions(categories) {
  const order = productCategories.map(category => category.id);
  return [...categories].sort((a, b) => {
    const ai = order.indexOf(a.id), bi = order.indexOf(b.id);
    if (ai >= 0 || bi >= 0) return (ai < 0 ? Infinity : ai) - (bi < 0 ? Infinity : bi);
    return a.display_id - b.display_id;
  });
}
