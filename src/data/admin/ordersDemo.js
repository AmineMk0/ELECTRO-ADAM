import { dashboardDemo } from './dashboardDemo.js';

// Fictional Order DTOs, isolated from public checkout and Dashboard data.
// Future Laravel endpoints can return this shape with paginated metadata.
export const orderStatuses = dashboardDemo.statuses.map(({ id, label, badge, color }) => ({ id, label, badge, color }));

const seeds = [
  [1058, 'أحمد بن علي', '0612345678', 1299, 'new', '2026-10-31T15:24:00+01:00', 'الدار البيضاء', 'هاتف ذكي 128GB'],
  [1057, 'سعاد الرحماني', '0698765432', 599, 'confirmed', '2026-10-31T14:10:00+01:00', 'الرباط', 'ساعة ذكية'],
  [1056, 'يوسف العمري', '0611223344', 2399, 'shipping', '2026-10-30T18:45:00+01:00', 'مراكش', 'درون للتصوير'],
  [1055, 'مريم الإدريسي', '0677889900', 799, 'delivered', '2026-10-30T12:30:00+01:00', 'طنجة', 'سماعة رأس لاسلكية'],
  [1054, 'عمر الكتاني', '0655667788', 1499, 'cancelled', '2026-10-29T19:20:00+01:00', 'فاس', 'جهاز لوحي'],
];

function orderFromRow([id, name, phone, amount, status, created_at, city, product]) {
  return {
    id, customer: { id: `demo-customer-${id}`, name, phone, city, address: `عنوان تجريبي — ${city}` },
    amount, currency: 'MAD', status, created_at, payment_method: 'cod',
    items: [{ id: `demo-item-${id}`, name: product, quantity: 1, unit_price: amount }],
    note: 'طلب تجريبي للمعاينة فقط.',
  };
}

export function createOrdersDemo() {
  const orders = seeds.map(orderFromRow);
  let index = 0;
  for (const status of dashboardDemo.statuses) {
    const remaining = status.count - orders.filter(order => order.status === status.id).length;
    for (let i = 0; i < remaining; i++, index++) {
      const seed = seeds[index % seeds.length];
      const date = new Date(Date.UTC(2026, 9, 28 - Math.floor(index / 6), 9 + index % 10, index * 7 % 60));
      orders.push(orderFromRow([
        1053 - index, `${seed[1]} ${Math.floor(index / seeds.length) + 2}`,
        `06${String(10000000 + index * 137).padStart(8, '0')}`, seed[3], status.id,
        date.toISOString(), seed[6], seed[7],
      ]));
    }
  }
  return orders.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}
