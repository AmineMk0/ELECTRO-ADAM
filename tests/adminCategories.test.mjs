import test from 'node:test';
import assert from 'node:assert/strict';
import { createCategoriesDemo, sampleCategoryImage } from '../src/data/admin/categoriesDemo.js';
import { createProductsDemo, sampleProductImage } from '../src/data/admin/productsDemo.js';
import { categoryLinks, categoryStatistics, CategoryValidationError, deleteDemoCategory, filterCategories, saveDemoCategory, validCategoryImage } from '../src/utils/adminCategories.js';
import { filterProducts, saveDemoProduct } from '../src/utils/adminProducts.js';
import { categoryPath, categoryProductCount, descendantCategoryIds } from '../src/utils/categoryTree.js';
import { paginateOrders } from '../src/utils/adminOrders.js';

const draft = changes => ({ name: 'تصنيف تجريبي جديد', description: 'وصف تجريبي', image: sampleCategoryImage('computer'), parent_id: null, is_active: true, ...changes });

test('seed hierarchy has eight roots, six active roots, two inactive roots and fourteen children', () => {
  const categories = createCategoriesDemo();
  assert.equal(categories.length, 22);
  assert.equal(new Set(categories.map(category => category.id)).size, 22);
  assert.deepEqual(categoryStatistics(categories), { all: 8, active: 6, subcategories: 14, inactive: 2 });
  assert.deepEqual(filterCategories(categories).slice(0, 5).map(category => category.display_id), [1, 2, 3, 4, 5]);
  for (const category of categories) { assert(validCategoryImage(category.image)); if (category.parent_id) assert(categories.some(parent => parent.id === category.parent_id)); }
  categories[0].name = 'changed'; assert.equal(createCategoriesDemo()[0].name, 'الحواسيب');
});

test('name search normalizes Arabic diacritics, and scopes/status filters combine', () => {
  const categories = createCategoriesDemo();
  assert.equal(filterCategories(categories, { search: 'الحَواسيب' }).length, 1);
  assert.equal(filterCategories(categories, { scope: 'children', search: 'الحواسيب' }).length, 2);
  assert.equal(filterCategories(categories, { scope: 'all' }).length, 22);
  assert.equal(filterCategories(categories, { status: 'active' }).length, 6);
  assert.equal(filterCategories(categories, { status: 'inactive' }).length, 2);
  assert.equal(filterCategories(categories, { search: 'not-present' }).length, 0);
});

test('new categories have stable IDs and can immediately be assigned to new products', () => {
  const roots = createCategoriesDemo(), products = createProductsDemo();
  const saved = saveDemoCategory(roots, draft());
  assert.equal(roots.length, 22); assert.equal(saved.categories.length, 23);
  const product = saveDemoProduct(products, { name: 'منتج مرتبط', reference: 'NEW-1', description: '', category_id: saved.category.id, price: 99, promotional_price: '', stock: 10, images: [sampleProductImage('phone')] }, null, new Date(), saved.categories);
  assert.equal(product.product.category_id, saved.category.id);
  assert.equal(categoryProductCount(saved.categories, product.products, saved.category.id), 1);
  assert.equal(filterProducts(product.products, { category: saved.category.id }, saved.categories).length, 1);
});

test('subcategories can be assigned to existing products while parent counts include descendants', () => {
  const categories = createCategoriesDemo(), products = createProductsDemo();
  const originalCount = categoryProductCount(categories, products, 'phones');
  const saved = saveDemoCategory(categories, draft({ parent_id: 'phones' }));
  const changed = saveDemoProduct(products, { ...products[0], category_id: saved.category.id }, products[0].id, new Date(), saved.categories);
  assert.equal(categoryStatistics(saved.categories).subcategories, 15);
  assert.equal(categoryProductCount(saved.categories, changed.products, 'phones'), originalCount);
  assert.equal(categoryProductCount(saved.categories, changed.products, saved.category.id), 1);
  assert.equal(filterProducts(changed.products, { category: 'phones' }, saved.categories).length, originalCount);
  assert(categoryPath(saved.categories, saved.category.id).includes('الهواتف /'));
});

test('editing preserves identity and validates required data and category images', () => {
  const categories = createCategoriesDemo(), category = categories[0];
  const result = saveDemoCategory(categories, { ...category, name: 'حواسيب معدلة', is_active: false }, category.id);
  assert.equal(result.category.id, category.id); assert.equal(result.category.display_id, category.display_id);
  assert.equal(category.is_active, true); assert.equal(categoryStatistics(result.categories).inactive, 3);
  for (const changes of [{ name: '' }, { image: null }, { is_active: 'false' }, { parent_id: 'missing' }]) assert.throws(() => saveDemoCategory(categories, draft(changes)), CategoryValidationError);
  assert.throws(() => saveDemoCategory(categories, draft(), 'missing'), CategoryValidationError);
});

test('a category cannot become its own parent or move into a descendant at any depth', () => {
  const categories = createCategoriesDemo(), parent = categories[0];
  const child = categories.find(category => category.parent_id === parent.id);
  const deep = saveDemoCategory(categories, draft({ parent_id: child.id }));
  assert(descendantCategoryIds(deep.categories, parent.id).has(deep.category.id));
  for (const parent_id of [parent.id, child.id, deep.category.id]) assert.throws(() => saveDemoCategory(deep.categories, { ...parent, parent_id }, parent.id), error => error instanceof CategoryValidationError && Boolean(error.errors.parent_id));
});

test('duplicate sibling names are rejected but identical names under distinct parents are valid', () => {
  const categories = createCategoriesDemo();
  assert.throws(() => saveDemoCategory(categories, draft({ name: 'الحواسيب' })), CategoryValidationError);
  const first = saveDemoCategory(categories, draft({ name: 'قسم جديد', parent_id: 'phones' }));
  assert.throws(() => saveDemoCategory(first.categories, draft({ name: 'قِسْم جديد', parent_id: 'phones' })), CategoryValidationError);
  assert.doesNotThrow(() => saveDemoCategory(first.categories, draft({ name: 'قسم جديد', parent_id: 'computers' })));
});

test('empty category deletion is immutable; linked categories require explicit valid reassignment', () => {
  const categories = createCategoriesDemo(), products = createProductsDemo();
  const extra = saveDemoCategory(categories, draft());
  assert.equal(deleteDemoCategory(extra.categories, products, extra.category.id).categories.length, 22);
  assert.equal(extra.categories.length, 23);
  for (const replacement of [null, 'phones', 'phones-child-3', 'missing']) assert.throws(() => deleteDemoCategory(categories, products, 'phones', replacement), CategoryValidationError);
});

test('confirmed reassignment moves products and children atomically without orphaning records', () => {
  const categories = createCategoriesDemo(), products = createProductsDemo();
  const links = categoryLinks(categories, products, 'phones');
  assert(links.products > 0 && links.children > 0);
  const result = deleteDemoCategory(categories, products, 'phones', 'computers');
  assert.equal(result.products.length, products.length);
  assert(!result.categories.some(category => category.id === 'phones'));
  assert(!result.products.some(product => product.category_id === 'phones'));
  assert(!result.categories.some(category => category.parent_id === 'phones'));
  for (const product of result.products) assert(result.categories.some(category => category.id === product.category_id));
  for (const category of result.categories) if (category.parent_id) assert(result.categories.some(parent => parent.id === category.parent_id));
  assert(products.some(product => product.category_id === 'phones'));
});

test('reparenting during deletion blocks real name collisions but ignores the deleted category itself', () => {
  let categories = createCategoriesDemo();
  const parent = saveDemoCategory(categories, draft({ name: 'قسم مخصص', parent_id: 'phones' }));
  const child = saveDemoCategory(parent.categories, draft({ name: 'قسم مخصص', parent_id: parent.category.id }));
  assert.doesNotThrow(() => deleteDemoCategory(child.categories, [], parent.category.id, 'phones'));
  const conflict = saveDemoCategory(child.categories, draft({ name: 'قسم مخصص', parent_id: 'computers' }));
  assert.throws(() => deleteDemoCategory(conflict.categories, [], parent.category.id, 'computers'), CategoryValidationError);
});

test('category pagination clamps after deletion and handles empty and child-only results', () => {
  const categories = createCategoriesDemo();
  assert.equal(paginateOrders(filterCategories(categories), 2).items.length, 3);
  assert.equal(paginateOrders(filterCategories(categories, { scope: 'children' }), 3).items.length, 4);
  assert.equal(paginateOrders(filterCategories(categories, { search: 'none' }), 9).start, 0);
});
