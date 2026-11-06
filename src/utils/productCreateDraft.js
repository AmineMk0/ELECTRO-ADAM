import { nextProductId } from './adminProducts.js';

export const productListFields = {
  description_points: [{ name: 'text', label: 'نقطة الوصف', placeholder: 'أضف نقطة في وصف المنتج...', maxLength: 2000 }],
  specifications: [{ name: 'name', label: 'اسم المواصفة', placeholder: 'مثال: نوع الاتصال', maxLength: 120 }, { name: 'value', label: 'قيمة المواصفة', placeholder: 'مثال: Bluetooth 5.0', maxLength: 500 }],
  package_contents: [{ name: 'text', label: 'محتوى العلبة', placeholder: 'مثال: كابل الشحن', maxLength: 2000 }],
};
const emptyEditor = list => ({ editingId: null, values: Object.fromEntries(productListFields[list].map(field => [field.name, ''])) });
export function createProductCreateState(products = [], categoryId = '') {
  return {
    draft: { name: '', reference: `EA-${nextProductId(products)}`, category_id: categoryId, brand: '', price: '', promotional_price: '', stock: '0', is_active: true, images: [], description_points: [], specifications: [], package_contents: [] },
    editors: Object.fromEntries(Object.keys(productListFields).map(list => [list, emptyEditor(list)])),
    listErrors: {}, nextRowId: 1,
  };
}
export const editorHasContent = editor => Boolean(editor.editingId || Object.values(editor.values).some(value => String(value).trim()));

function commitRow(state, list) {
  const fields = productListFields[list], editor = state.editors[list];
  const values = Object.fromEntries(fields.map(field => [field.name, String(editor.values[field.name] || '').trim()]));
  if (fields.some(field => !values[field.name] || values[field.name].length > field.maxLength)) {
    return { ...state, listErrors: { ...state.listErrors, [list]: fields.length === 2 ? 'يرجى إدخال اسم المواصفة وقيمتها بشكل كامل.' : 'يرجى إدخال عنصر غير فارغ ضمن الطول المسموح.' } };
  }
  if (editor.editingId && !state.draft[list].some(row => row.id === editor.editingId)) return { ...state, listErrors: { ...state.listErrors, [list]: 'العنصر المطلوب تعديله غير موجود.' } };
  const row = { id: editor.editingId || `${list}-${state.nextRowId}`, ...values };
  const rows = editor.editingId ? state.draft[list].map(item => item.id === row.id ? row : item) : [...state.draft[list], row];
  return { ...state, draft: { ...state.draft, [list]: rows }, editors: { ...state.editors, [list]: emptyEditor(list) }, listErrors: { ...state.listErrors, [list]: '' }, nextRowId: state.nextRowId + (editor.editingId ? 0 : 1) };
}

export function productCreateReducer(state, action) {
  if (action.type === 'replace') return action.state;
  if (action.type === 'field' && ['name', 'reference', 'category_id', 'brand', 'price', 'promotional_price', 'stock', 'is_active'].includes(action.name)) return { ...state, draft: { ...state.draft, [action.name]: action.value } };
  if (action.type === 'images') return { ...state, draft: { ...state.draft, images: [...action.images] } };
  const list = action.list;
  if (!productListFields[list]) return state;
  const editor = state.editors[list];
  if (action.type === 'editor-change' && productListFields[list].some(field => field.name === action.name)) return { ...state, editors: { ...state.editors, [list]: { ...editor, values: { ...editor.values, [action.name]: action.value } } }, listErrors: { ...state.listErrors, [list]: '' } };
  if (action.type === 'editor-cancel') return { ...state, editors: { ...state.editors, [list]: emptyEditor(list) }, listErrors: { ...state.listErrors, [list]: '' } };
  if (action.type === 'row-commit') return commitRow(state, list);
  if (action.type === 'row-edit') {
    const row = state.draft[list].find(item => item.id === action.id);
    if (!row || editor.editingId === action.id) return state;
    if (editorHasContent(editor)) return { ...state, listErrors: { ...state.listErrors, [list]: 'احفظ الإدخال الحالي أو ألغِه قبل تعديل عنصر آخر.' } };
    return { ...state, editors: { ...state.editors, [list]: { editingId: row.id, values: Object.fromEntries(productListFields[list].map(field => [field.name, row[field.name]])) } }, listErrors: { ...state.listErrors, [list]: '' } };
  }
  if (action.type === 'row-delete') return { ...state, draft: { ...state.draft, [list]: state.draft[list].filter(item => item.id !== action.id) }, editors: { ...state.editors, [list]: editor.editingId === action.id ? emptyEditor(list) : editor }, listErrors: { ...state.listErrors, [list]: '' } };
  return state;
}

export function flushProductEditors(state) {
  let next = state;
  for (const list of Object.keys(productListFields)) if (editorHasContent(next.editors[list])) next = commitRow(next, list);
  return next;
}
export function serializeProductCreateState(state) {
  return {
    ...state.draft,
    images: state.draft.images.map(image => ({ ...image })),
    description_points: state.draft.description_points.map(row => row.text),
    specifications: state.draft.specifications.map(({ name, value }) => ({ name, value })),
    package_contents: state.draft.package_contents.map(row => row.text),
  };
}
export function primaryProductImage(images, id) {
  const chosen = images.find(image => image.id === id);
  return chosen ? [chosen, ...images.filter(image => image.id !== id)] : [...images];
}
