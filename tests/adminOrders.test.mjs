import test from 'node:test';
import assert from 'node:assert/strict';
import { createOrdersDemo } from '../src/data/admin/ordersDemo.js';
import { createManualDemoOrder, filterOrders, orderDate, orderStatistics, paginateOrders, paginationItems, toTableOrder, updateOrderStatus } from '../src/utils/adminOrders.js';
import { orderPrintFields } from '../src/utils/printAdminOrder.js';

test('128 independent DTOs have unique IDs, chronological order, and correct totals', () => {
  const orders = createOrdersDemo();
  assert.equal(orders.length, 128);
  assert.equal(new Set(orders.map(order => order.id)).size, 128);
  assert.deepEqual(orders.slice(0, 5).map(order => order.id), [1058, 1057, 1056, 1055, 1054]);
  for (let index = 0; index < orders.length; index++) {
    const order = orders[index];
    assert.equal(order.amount, order.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0));
    if (index) assert(Date.parse(orders[index - 1].created_at) >= Date.parse(order.created_at));
  }
  orders[0].customer.name = 'changed';
  assert.equal(createOrdersDemo()[0].customer.name, 'أحمد بن علي');
});

test('statistics count the same actual records shown by filters and pagination', () => {
  assert.deepEqual(orderStatistics(createOrdersDemo()), { all: 128, new: 12, confirmed: 38, shipping: 24, delivered: 48, cancelled: 6 });
});

test('search accepts order numbers, Arabic digits, names and local/international phone formats', () => {
  const orders = createOrdersDemo();
  for (const search of ['#1058', '١٠٥٨', '0612345678', '06 12 34 56 78', '+212 6 12 34 56 78', '٠٦١٢٣٤٥٦٧٨']) {
    assert.deepEqual(filterOrders(orders, { search }).map(order => order.id), [1058], search);
  }
  assert(filterOrders(orders, { search: 'احمد بن علي' }).some(order => order.id === 1058));
  assert.equal(filterOrders(orders, { search: 'no-such-customer' }).length, 0);
});

test('status and inclusive date filters combine, reject inverted ranges, and use Casablanca dates', () => {
  const orders = createOrdersDemo();
  assert.equal(filterOrders(orders, { from: '2026-10-31', to: '2026-10-31' }).length, 2);
  assert.deepEqual(filterOrders(orders, { status: 'confirmed', from: '2026-10-31', to: '2026-10-31' }).map(order => order.id), [1057]);
  assert.equal(filterOrders(orders, { from: '2026-11-01', to: '2026-10-01' }).length, 0);
  const boundary = { ...orders[0], created_at: '2026-10-31T23:30:00Z' };
  assert.equal(orderDate(boundary), '2026-11-01');
  assert.equal(filterOrders([boundary], { to: '2026-10-31' }).length, 0);
});

test('pagination reaches every record once, clamps invalid pages, and handles empty results', () => {
  const orders = createOrdersDemo();
  const seen = [];
  for (let page = 1; page <= 26; page++) seen.push(...paginateOrders(orders, page, 5).items.map(order => order.id));
  assert.equal(seen.length, 128);
  assert.equal(new Set(seen).size, 128);
  assert.equal(paginateOrders(orders, 99).page, 26);
  assert.equal(paginateOrders(orders, 26).items.length, 3);
  assert.equal(paginateOrders(orders, -5).page, 1);
  const empty = paginateOrders([], 9);
  assert.equal(empty.page, 1); assert.equal(empty.start, 0); assert.equal(empty.end, 0);
  for (const page of [1, 13, 26]) {
    const tokens = paginationItems(page, 26);
    assert(tokens.includes(1)); assert(tokens.includes(26)); assert(tokens.includes(page));
    assert.equal(new Set(tokens).size, tokens.length);
  }
});

test('status updates are immutable, validate inputs, and update counters and filtered pages', () => {
  const original = createOrdersDemo();
  const changed = updateOrderStatus(original, 1058, 'confirmed');
  assert.equal(original[0].status, 'new');
  assert.equal(changed[0].status, 'confirmed');
  assert.equal(orderStatistics(changed).new, 11); assert.equal(orderStatistics(changed).confirmed, 39);
  assert.throws(() => updateOrderStatus(original, 1058, 'unknown'));
  assert.throws(() => updateOrderStatus(original, -1, 'new'));
  let remaining = original;
  for (const order of paginateOrders(filterOrders(original, { status: 'new' }), 3).items) remaining = updateOrderStatus(remaining, order.id, 'confirmed');
  assert.equal(paginateOrders(filterOrders(remaining, { status: 'new' }), 3).page, 2);
});

test('manual demo order validates inputs and creates a fresh DTO with consistent items', () => {
  const orders = createOrdersDemo();
  const values = { name: 'عميل تجريبي', phone: '+212 7 03 50 59 00', city: 'الرباط', product: 'منتج تجريبي', amount: '399.50' };
  const order = createManualDemoOrder(values, orders, new Date('2026-11-04T12:00:00Z'));
  assert.equal(order.id, 1059); assert.equal(order.status, 'new'); assert.equal(order.amount, 399.5);
  assert.equal(order.customer.phone, '0703505900'); assert.equal(order.items[0].unit_price, 399.5);
  assert.equal(orderStatistics([order, ...orders]).all, 129);
  assert.throws(() => createManualDemoOrder({ ...values, phone: '123' }, orders));
  assert.throws(() => createManualDemoOrder({ ...values, amount: '-1' }, orders));
});

test('table and print projections use the latest order status and preserve customer text safely', () => {
  const order = updateOrderStatus(createOrdersDemo(), 1058, 'delivered')[0];
  assert.equal(toTableOrder(order).status, 'delivered');
  assert.equal(toTableOrder(order).phone, '06 12 34 56 78');
  const fields = orderPrintFields(order);
  assert(fields.some(([label, value]) => label === 'الحالة' && value === 'تم التسليم'));
  const unsafeName = '<img src=x onerror=alert(1)>';
  assert.equal(orderPrintFields({ ...order, customer: { ...order.customer, name: unsafeName } })[1][1], unsafeName);
});
