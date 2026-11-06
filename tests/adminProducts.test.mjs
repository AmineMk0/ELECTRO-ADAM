import test from 'node:test';
import assert from 'node:assert/strict';
import { createProductsDemo, productCategories, sampleProductImage } from '../src/data/admin/productsDemo.js';
import { availability, currentProductPrice, deleteDemoProduct, filterProducts, MAX_IMAGE_BYTES, productStatistics, ProductValidationError, saveDemoProduct, validProductImage, validateImageFiles, validateProductDraft } from '../src/utils/adminProducts.js';
import { paginateOrders } from '../src/utils/adminOrders.js';

const newDraft = () => ({ name: 'منتج تجريبي جديد', reference: 'EA-2000', description: 'وصف تجريبي', price: '100', promotional_price: '80', category_id: 'phones', stock: '3', images: [sampleProductImage('phone')] });

test('86 independent products have unique references, eight known categories and valid images', () => {
  const products = createProductsDemo();
  assert.equal(products.length, 86); assert.equal(productCategories.length, 8);
  assert.equal(new Set(products.map(product => product.id)).size, 86);
  assert.equal(new Set(products.map(product => product.reference)).size, 86);
  for (const product of products) {
    assert(productCategories.some(category => category.id === product.category_id));
    assert(product.images.every(validProductImage));
  }
  products[0].images.pop();
  assert.equal(createProductsDemo()[0].images.length, 1);
});

test('stock counters are consistent; low stock is a subset of available products', () => {
  assert.deepEqual(productStatistics(createProductsDemo()), { all: 86, categories: 8, available: 78, low: 12, unavailable: 8 });
  assert.equal(availability({ stock: 0 }), 'unavailable');
  assert.equal(availability({ stock: 1 }), 'low'); assert.equal(availability({ stock: 5 }), 'low');
  assert.equal(availability({ stock: 6 }), 'available');
});

test('search handles names, case-insensitive references, Arabic digits and combined filters', () => {
  const products = createProductsDemo();
  for (const search of ['EA-1006', 'ea-1006', 'EA-١٠٠٦']) assert.deepEqual(filterProducts(products, { search }).map(product => product.id), [1006]);
  assert(filterProducts(products, { search: 'samsung' }).some(product => product.id === 1006));
  assert(filterProducts(products, { search: 'مِقْلاة هَوائية' }).some(product => product.id === 1002));
  assert.equal(filterProducts(products, { status: 'available' }).length, 78);
  assert.equal(filterProducts(products, { status: 'low' }).length, 12);
  assert.equal(filterProducts(products, { status: 'unavailable' }).length, 8);
  assert.deepEqual(filterProducts(products, { search: 'ea-1006', category: 'phones', status: 'available' }).map(product => product.id), [1006]);
  assert.equal(filterProducts(products, { search: 'ea-1006', category: 'home' }).length, 0);
});

test('creating a product normalizes reference and numeric values without mutating fixtures', () => {
  const products = createProductsDemo(), draft = newDraft(); draft.reference = ' ea-2000 ';
  const { product, products: updated } = saveDemoProduct(products, draft, null, new Date('2026-11-04T12:00:00Z'));
  assert.equal(products.length, 86); assert.equal(updated.length, 87);
  assert.equal(product.id, 1007); assert.equal(product.reference, 'EA-2000');
  assert.equal(product.price, 100); assert.equal(product.promotional_price, 80); assert.equal(product.stock, 3);
  assert.equal(currentProductPrice(product), 80);
  assert.equal(product.created_at, '2026-11-04T12:00:00.000Z');
  draft.images.pop(); assert.equal(product.images.length, 1);
});

test('editing preserves ID and creation date and updates stock counters immediately', () => {
  const products = createProductsDemo(), original = products[0];
  const result = saveDemoProduct(products, { ...original, stock: '0', name: 'اسم معدل', promotional_price: '999' }, original.id);
  assert.equal(result.product.id, original.id); assert.equal(result.product.created_at, original.created_at);
  assert.equal(result.products.length, 86); assert.equal(original.stock, 45);
  assert.equal(productStatistics(result.products).unavailable, 9);
  assert.equal(productStatistics(result.products).available, 77);
});

test('references must be unique while a product may keep its own reference when edited', () => {
  const products = createProductsDemo();
  assert.throws(() => saveDemoProduct(products, { ...newDraft(), reference: 'ea-1006' }), error => error instanceof ProductValidationError && Boolean(error.errors.reference));
  assert.equal(Object.keys(validateProductDraft(products[0], products, products[0].id).errors).length, 0);
  assert.throws(() => saveDemoProduct(products, newDraft(), -1), ProductValidationError);
});

test('invalid stock, category, names and required images cannot be saved', () => {
  const products = createProductsDemo();
  for (const changes of [{ stock: '' }, { stock: -1 }, { stock: 1.5 }, { category_id: 'unknown' }, { name: '' }, { images: [] }]) {
    assert.throws(() => saveDemoProduct(products, { ...newDraft(), ...changes }), ProductValidationError);
  }
});

test('promotions must remain strictly below the normal price after currency rounding', () => {
  const products = createProductsDemo();
  for (const changes of [{ price: 0 }, { price: Infinity }, { promotional_price: 100 }, { promotional_price: 101 }, { promotional_price: 0 }, { price: 1.004, promotional_price: 1.003 }]) {
    assert.throws(() => saveDemoProduct(products, { ...newDraft(), ...changes }), ProductValidationError);
  }
  const { product } = saveDemoProduct(products, { ...newDraft(), promotional_price: '' });
  assert.equal(product.promotional_price, null); assert.equal(currentProductPrice(product), product.price);
});

test('image validation rejects unsafe sources, unsupported formats, empty and oversized uploads', () => {
  validateImageFiles([{ type: 'image/png', size: 100 }], 5);
  for (const files of [[{ type: 'image/svg+xml', size: 100 }], [{ type: 'image/png', size: 0 }], [{ type: 'image/jpeg', size: MAX_IMAGE_BYTES + 1 }]]) assert.throws(() => validateImageFiles(files));
  assert.throws(() => validateImageFiles([{ type: 'image/png', size: 100 }], 6));
  assert.equal(validProductImage({ id: 'bad', kind: 'asset', url: '/assets/../secret.png' }), false);
  assert.equal(validProductImage({ id: 'bad', kind: 'upload', url: 'javascript:alert(1)', file: { type: 'image/png', size: 100 } }), false);
  assert.equal(validProductImage({ id: 'ok', kind: 'upload', url: 'blob:http://localhost/image', file: { type: 'image/png', size: 100 } }), true);
});

test('deletion is immutable, updates counters and clamps pagination when the last page disappears', () => {
  const products = createProductsDemo();
  const last = paginateOrders(products, 18).items[0];
  const updated = deleteDemoProduct(products, last.id);
  assert.equal(products.length, 86); assert.equal(updated.length, 85);
  assert(!updated.some(product => product.id === last.id));
  assert.equal(paginateOrders(updated, 18).page, 17);
  assert.throws(() => deleteDemoProduct(products, -1));
  assert.equal(createProductsDemo().length, 86);
});

test('pagination covers every product exactly once and handles empty searches', () => {
  const products = createProductsDemo(), ids = [];
  for (let page = 1; page <= 18; page++) ids.push(...paginateOrders(products, page).items.map(product => product.id));
  assert.equal(ids.length, 86); assert.equal(new Set(ids).size, 86);
  assert.equal(paginateOrders(filterProducts(products, { search: 'not-a-real-product' }), 99).total, 0);
});
