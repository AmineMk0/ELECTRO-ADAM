import test from 'node:test';
import assert from 'node:assert/strict';
import { createProductsDemo, productCategories, sampleProductImage } from '../src/data/admin/productsDemo.js';
import { createProductCreateState, flushProductEditors, primaryProductImage, productCreateReducer as reduce, serializeProductCreateState } from '../src/utils/productCreateDraft.js';
import { buildProductFormData, saveFullDemoProduct, validateFullProductDraft } from '../src/utils/adminProductCreate.js';
import { saveDemoProduct } from '../src/utils/adminProducts.js';
const products = createProductsDemo();
const draft = () => ({ ...serializeProductCreateState(createProductCreateState(products)), name: 'سماعات جديدة', category_id: 'audio', brand: 'JBL', price: '599', promotional_price: '499', stock: '25', images: [sampleProductImage('headphones')], description_points: ['تصميم مريح', 'جودة الصوت'], specifications: [{ name: 'نوع الاتصال', value: 'Bluetooth 5.0' }], package_contents: ['سماعات', 'كابل الشحن'] });
function type(state, list, values) { for (const [name, value] of Object.entries(values)) state = reduce(state, { type: 'editor-change', list, name, value }); return state; }
test('dynamic lists support add, stable edits, deleting and clearing edited rows', () => {
  let state = type(createProductCreateState(), 'description_points', { text: 'الأول' });
  state = reduce(state, { type: 'row-commit', list: 'description_points' });
  const id = state.draft.description_points[0].id;
  state = reduce(state, { type: 'row-edit', list: 'description_points', id });
  state = type(state, 'description_points', { text: 'تعديل' });
  state = reduce(state, { type: 'row-commit', list: 'description_points' });
  assert.deepEqual(state.draft.description_points, [{ id, text: 'تعديل' }]);
  state = reduce(state, { type: 'row-edit', list: 'description_points', id });
  state = reduce(state, { type: 'row-delete', list: 'description_points', id });
  assert.equal(state.draft.description_points.length, 0); assert.equal(state.editors.description_points.editingId, null);
});
test('save flushes all pending entries; incomplete specifications block without losing values', () => {
  let state = createProductCreateState();
  state = type(state, 'description_points', { text: 'وصف' });
  state = type(state, 'specifications', { name: 'الاتصال' });
  state = type(state, 'package_contents', { text: 'كابل' });
  state = flushProductEditors(state);
  assert.equal(state.draft.description_points.length, 1); assert.equal(state.draft.package_contents.length, 1);
  assert(state.listErrors.specifications); assert.equal(state.editors.specifications.values.name, 'الاتصال');
  state = flushProductEditors(type(state, 'specifications', { value: 'Bluetooth' }));
  assert.equal(state.listErrors.specifications, ''); assert.equal(state.draft.specifications.length, 1);
  assert.deepEqual(serializeProductCreateState(state).specifications, [{ name: 'الاتصال', value: 'Bluetooth' }]);
});
test('pending edits are not silently discarded when selecting another row', () => {
  let state = createProductCreateState();
  state = reduce(type(state, 'package_contents', { text: 'كابل' }), { type: 'row-commit', list: 'package_contents' });
  state = type(state, 'package_contents', { text: 'دليل' });
  state = reduce(state, { type: 'row-edit', list: 'package_contents', id: state.draft.package_contents[0].id });
  assert(state.listErrors.package_contents); assert.equal(state.editors.package_contents.values.text, 'دليل');
});
test('lists have no item-count limit and reset clears drafts and editors', () => {
  let state = createProductCreateState();
  for (let index = 0; index < 1001; index++) state = reduce(type(state, 'description_points', { text: `عنصر ${index}` }), { type: 'row-commit', list: 'description_points' });
  assert.equal(serializeProductCreateState(state).description_points.length, 1001);
  assert.equal(Object.keys(validateFullProductDraft({ ...draft(), description_points: serializeProductCreateState(state).description_points }, products).errors).length, 0);
  state = reduce(state, { type: 'replace', state: createProductCreateState(products) });
  assert.deepEqual(state.draft.description_points, []); assert.equal(state.editors.description_points.values.text, '');
});
test('complete save captures every scalar, list, image order and primary metadata', () => {
  const data = draft(); data.images.push(sampleProductImage('phone')); data.images = primaryProductImage(data.images, data.images[1].id); data.is_active = false;
  const result = saveFullDemoProduct(products, data);
  assert.equal(result.products.length, products.length + 1); assert.equal(products.length, 86);
  for (const key of ['brand', 'is_active', 'description_points', 'specifications', 'package_contents']) assert.deepEqual(result.product[key], data[key]);
  assert.equal(result.product.price, 599); assert.equal(result.product.stock, 25); assert.equal(result.product.primary_image_id, data.images[0].id);
  assert.deepEqual(result.product.images.map(image => image.is_primary), [true, false]);
  const edited = saveDemoProduct(result.products, { ...result.product, images: [...result.product.images].reverse() }, result.product.id).product;
  assert.deepEqual(edited.description_points, data.description_points); assert.equal(edited.brand, 'JBL'); assert.equal(edited.primary_image_id, data.images[1].id);
});
test('required fields, duplicate SKU, price, stock, image cap and list validation', () => {
  const data = { ...draft(), name: '', reference: products[0].reference, category_id: '', price: '0', stock: '-1', brand: 'a'.repeat(101), is_active: 'yes', description_points: [''], specifications: [{ name: 'نوع', value: '' }], package_contents: [''] };
  const errors = validateFullProductDraft(data, products).errors;
  for (const key of ['name', 'reference', 'category_id', 'price', 'stock', 'brand', 'is_active', 'description_points', 'specifications', 'package_contents']) assert(errors[key], key);
  assert(validateFullProductDraft({ ...draft(), promotional_price: '599' }, products).errors.promotional_price);
  assert(validateFullProductDraft({ ...draft(), images: [] }, products).errors.images);
  assert(validateFullProductDraft({ ...draft(), images: Array.from({ length: 6 }, (_, i) => ({ ...sampleProductImage('phone'), id: `img-${i}` })) }, products).errors.images);
});
test('new dynamic categories can be associated with a product', () => {
  const result = saveFullDemoProduct(products, { ...draft(), category_id: 'new-category' }, [...productCategories, { id: 'new-category', name: 'جديد' }]);
  assert.equal(result.product.category_id, 'new-category');
});
test('future multipart adapter contains files and indexed lists, never blob URLs', () => {
  const file = new File(['image bytes'], 'headphones.png', { type: 'image/png' });
  const product = saveFullDemoProduct(products, { ...draft(), images: [{ id: 'upload-1', kind: 'upload', url: 'blob:local-test', file }] }).product;
  const form = buildProductFormData(product);
  assert(form.get('images[0]') instanceof Blob); assert.equal(form.get('images[0]').name, 'headphones.png');
  assert.equal(form.get('description_points[1]'), 'جودة الصوت'); assert.equal(form.get('specifications[0][value]'), 'Bluetooth 5.0');
  assert.equal(form.get('package_contents[1]'), 'كابل الشحن'); assert.equal(form.get('brand'), 'JBL'); assert.equal(form.get('image_is_primary[0]'), '1');
  assert(!Array.from(form.values()).includes('blob:local-test'));
  assert.throws(() => buildProductFormData(saveFullDemoProduct(products, draft()).product), error => Boolean(error.errors.images));
});
