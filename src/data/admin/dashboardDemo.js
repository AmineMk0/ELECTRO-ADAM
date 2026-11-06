// Temporary, fictional dashboard data. Never imports or changes storefront/catalog data.
// Replace this module with Laravel/MySQL API responses when that backend is available.
export const dashboardDemo = {
  statistics: { orders: 128, sales: 12450, products: 86, customers: 342 },
  growth: { orders: 20, sales: 18, products: 5, customers: 12 },
  weeklySales: [
    { day: 'السبت', amount: 500 }, { day: 'الأحد', amount: 1100 },
    { day: 'الاثنين', amount: 850 }, { day: 'الثلاثاء', amount: 1350 },
    { day: 'الأربعاء', amount: 1000 }, { day: 'الخميس', amount: 1550 },
    { day: 'الجمعة', amount: 2150 },
  ],
  statuses: [
    { id: 'new', label: 'جديد', count: 12, color: '#087bfa', badge: 'bg-blue-100 text-blue-800' },
    { id: 'confirmed', label: 'مؤكد', count: 38, color: '#2cc45d', badge: 'bg-green-100 text-green-800' },
    { id: 'shipping', label: 'قيد الشحن', count: 24, color: '#ff9409', badge: 'bg-orange/15 text-[#bd5700]' },
    { id: 'delivered', label: 'تم التسليم', count: 48, color: '#9b4df5', badge: 'bg-purple-100 text-purple-800' },
    { id: 'cancelled', label: 'ملغى', count: 6, color: '#ff4b5c', badge: 'bg-red-100 text-red-800' },
  ],
  orders: [
    { id: 1058, customer: 'أحمد بن علي', amount: 1299, status: 'new', date: '2026-10-31', city: 'الدار البيضاء', product: 'هاتف ذكي 128GB' },
    { id: 1057, customer: 'سعاد الرحماني', amount: 599, status: 'confirmed', date: '2026-10-31', city: 'الرباط', product: 'ساعة ذكية' },
    { id: 1056, customer: 'يوسف العمري', amount: 2399, status: 'shipping', date: '2026-10-30', city: 'مراكش', product: 'درون للتصوير' },
    { id: 1055, customer: 'مريم الإدريسي', amount: 799, status: 'delivered', date: '2026-10-30', city: 'طنجة', product: 'سماعة رأس لاسلكية' },
    { id: 1054, customer: 'عمر الفاسي', amount: 249, status: 'delivered', date: '2026-10-29', city: 'فاس', product: 'لوحة مفاتيح للألعاب' },
    { id: 1053, customer: 'سلمى العلوي', amount: 399, status: 'cancelled', date: '2026-10-29', city: 'أكادير', product: 'مكبر صوت محمول' },
  ],
  products: [
    { id: 'demo-phone', name: 'هاتف ذكي 128GB', price: 1299, stock: 16, category: 'الهواتف' },
    { id: 'demo-watch', name: 'ساعة ذكية', price: 599, stock: 3, category: 'الإكسسوارات' },
    { id: 'demo-drone', name: 'درون للتصوير', price: 2399, stock: 8, category: 'الدرون' },
    { id: 'demo-headphones', name: 'سماعة رأس لاسلكية', price: 799, stock: 12, category: 'الصوتيات' },
  ],
  notifications: ['12 طلباً جديداً بانتظار المراجعة', 'مخزون الساعة الذكية منخفض: 3 قطع متبقية'],
};
