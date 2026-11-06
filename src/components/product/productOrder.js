import { validateOrder } from './orderValidation.js';

export const PRODUCT_ORDERS_KEY = 'electro-adam-product-orders';

// Same customer/items shape as the existing order management DTOs.
// Replace this local adapter with the order API when the store is connected.
export function saveProductOrder(product, values, storage = window.localStorage) {
  if (Object.keys(validateOrder(values)).length) throw new Error('Invalid order');
  if (!product.id || !Number.isFinite(product.price) || product.price <= 0) throw new Error('Invalid product');
  const saved = storage.getItem(PRODUCT_ORDERS_KEY);
  const orders = saved ? JSON.parse(saved) : [];
  if (!Array.isArray(orders)) throw new Error('Invalid order storage');
  const id = crypto.randomUUID();
  const neighborhood = values.neighborhood.trim();
  const order = {
    id,
    customer: { id: `customer-${id}`, name: values.name.trim(), phone: values.phone.trim(), city: values.city.trim(), neighborhood, address: neighborhood },
    amount: product.price * values.quantity,
    currency: 'MAD',
    status: 'new',
    created_at: new Date().toISOString(),
    payment_method: 'cod',
    items: [{ id: product.id, name: product.name, quantity: values.quantity, unit_price: product.price }],
    source: 'product-detail',
    submission_status: 'local',
  };
  storage.setItem(PRODUCT_ORDERS_KEY, JSON.stringify([...orders, order]));
  return order;
}
