import test from 'node:test';
import assert from 'node:assert/strict';
import { validateOrder } from '../src/components/product/orderValidation.js';
import { PRODUCT_ORDERS_KEY, saveProductOrder } from '../src/components/product/productOrder.js';

const values = { name: 'عميل تجريبي', phone: '0612345678', city: 'الرباط', neighborhood: 'حي الرياض', quantity: 2 };
const product = { id: 'e88-drone', name: 'درون', price: 399 };
function memoryStorage() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

test('all delivery fields are required, including neighborhood; Moroccan phones and quantity remain validated', () => {
  assert.deepEqual(validateOrder(values), {});
  for (const field of ['name', 'phone', 'city', 'neighborhood']) {
    assert(validateOrder({ ...values, [field]: ' ' })[field], field);
  }
  assert(validateOrder({ ...values, neighborhood: undefined }).neighborhood);
  for (const phone of ['٠٦١٢٣٤٥٦٧٨', '+212 612 345 678', '00212612345678']) assert.deepEqual(validateOrder({ ...values, phone }), {});
  for (const quantity of [0, 100, 1.5, '', NaN]) assert(validateOrder({ ...values, quantity }).quantity);
});

test('direct order persists neighborhood, customer, product, quantity and total without touching cart', () => {
  const storage = memoryStorage();
  storage.setItem('electro-adam-cart', '[{"id":"other","quantity":1}]');
  const order = saveProductOrder(product, { ...values, neighborhood: '  حي الرياض  ' }, storage);
  assert.equal(order.customer.neighborhood, 'حي الرياض');
  assert.equal(order.customer.address, 'حي الرياض');
  assert.equal(order.customer.city, values.city);
  assert.equal(order.amount, 798);
  assert.equal(order.items[0].quantity, 2);
  assert.equal(order.items[0].id, product.id);
  assert.equal(order.status, 'new');
  assert.equal(order.payment_method, 'cod');
  assert.equal(order.submission_status, 'local');
  assert.deepEqual(JSON.parse(storage.getItem(PRODUCT_ORDERS_KEY)), [order]);
  const next = saveProductOrder(product, values, storage);
  assert.notEqual(order.id, next.id);
  assert.equal(JSON.parse(storage.getItem(PRODUCT_ORDERS_KEY)).length, 2);
  assert.equal(storage.getItem('electro-adam-cart'), '[{"id":"other","quantity":1}]');
});

test('invalid orders, corrupted storage and write failures never report success or erase saved data', () => {
  const storage = memoryStorage();
  assert.throws(() => saveProductOrder(product, { ...values, neighborhood: '' }, storage));
  assert.equal(storage.getItem(PRODUCT_ORDERS_KEY), null);
  for (const saved of ['broken-json', '{}']) {
    storage.setItem(PRODUCT_ORDERS_KEY, saved);
    assert.throws(() => saveProductOrder(product, values, storage));
    assert.equal(storage.getItem(PRODUCT_ORDERS_KEY), saved);
  }
  assert.throws(() => saveProductOrder(product, values, { getItem: () => null, setItem: () => { throw new Error('Storage unavailable'); } }));
});

test('product form renders required RTL fields in order and three illustrated benefits', async () => {
  const { createServer } = await import('vite');
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: OrderForm } = await server.ssrLoadModule('/src/components/product/OrderForm.jsx');
    const { default: OrderBenefits } = await server.ssrLoadModule('/src/components/product/OrderBenefits.jsx');
    const html = renderToStaticMarkup(createElement(OrderForm, { product }));
    assert(html.includes('dir="rtl"'));
    assert(html.includes('شراء الآن'));
    assert(!html.includes('أضف إلى السلة'));
    const fields = [...html.matchAll(/<input\b[^>]*\bname="([^"]+)"[^>]*>/g)];
    assert.deepEqual(fields.map(match => match[1]), ['name', 'phone', 'city', 'neighborhood', 'quantity']);
    for (const field of fields.slice(0, 4)) assert(field[0].includes('required=""'));
    const benefits = renderToStaticMarkup(createElement(OrderBenefits));
    assert.equal((benefits.match(/<svg /g) || []).length, 3);
    assert(benefits.includes('grid-cols-3'));
    assert(benefits.includes('h-[48px] w-[48px]'));
  } finally { await server.close(); }
});
