import { orderStatuses } from '../data/admin/ordersDemo.js';

export const money = value => `${value.toLocaleString('en-US')} DH`;
const dateFormatter = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Africa/Casablanca', year: 'numeric', month: '2-digit', day: '2-digit' });
const timeFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Casablanca', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
export const orderDate = order => dateFormatter.format(new Date(order.created_at));
export const orderTime = order => timeFormatter.format(new Date(order.created_at));

function latinDigits(value) {
  return String(value).replace(/[٠-٩]/g, char => String(char.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, char => String(char.charCodeAt(0) - 1776));
}
function textKey(value) {
  return latinDigits(value).normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').toLocaleLowerCase('ar').trim().replace(/\s+/g, ' ');
}
function phoneKey(value) {
  return latinDigits(value).replace(/\D/g, '').replace(/^(?:00212|212)/, '0');
}
export const formatPhone = phone => phoneKey(phone).replace(/(\d{2})(?=\d)/g, '$1 ');

export function filterOrders(orders, { search = '', status = 'all', from = '', to = '' } = {}) {
  if (from && to && from > to) return [];
  const query = textKey(search), numeric = query.replace(/^#/, '');
  const phone = phoneKey(search);
  return orders.filter(order => {
    if (status !== 'all' && order.status !== status) return false;
    const date = orderDate(order);
    if ((from && date < from) || (to && date > to)) return false;
    if (!query) return true;
    return textKey(order.customer.name).includes(query)
      || (/^\d+$/.test(numeric) && String(order.id).includes(numeric))
      || (phone.length >= 2 && /^[+\d\s()-]+$/.test(latinDigits(search).trim()) && phoneKey(order.customer.phone).includes(phone));
  });
}

export function orderStatistics(orders) {
  const counts = Object.fromEntries(orderStatuses.map(status => [status.id, 0]));
  for (const order of orders) if (Object.hasOwn(counts, order.status)) counts[order.status]++;
  return { all: orders.length, ...counts };
}

export function paginateOrders(orders, requestedPage = 1, requestedSize = 5) {
  const pageSize = [5, 10, 20].includes(Number(requestedSize)) ? Number(requestedSize) : 5;
  const total = orders.length, pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(pages, Math.max(1, Math.trunc(Number(requestedPage)) || 1));
  const offset = (page - 1) * pageSize;
  return { items: orders.slice(offset, offset + pageSize), page, pages, pageSize, total, start: total ? offset + 1 : 0, end: Math.min(offset + pageSize, total) };
}

export function paginationItems(page, pages) {
  const visible = [...new Set([1, pages, page - 2, page - 1, page, page + 1, page + 2].filter(value => value >= 1 && value <= pages))].sort((a, b) => a - b);
  return visible.flatMap((value, index) => index && value - visible[index - 1] > 1 ? [`gap-${value}`, value] : [value]);
}

export function updateOrderStatus(orders, id, status) {
  if (!orderStatuses.some(item => item.id === status) || !orders.some(order => order.id === id)) throw new Error('Invalid order or status');
  return orders.map(order => order.id === id ? { ...order, status } : order);
}

export function toTableOrder(order) {
  return { id: order.id, customer: order.customer.name, phone: formatPhone(order.customer.phone), amount: order.amount, status: order.status, date: orderDate(order), time: orderTime(order), created_at: order.created_at };
}

export function createManualDemoOrder(values, orders, now = new Date()) {
  const name = String(values.name || '').trim(), phone = phoneKey(values.phone || ''), city = String(values.city || '').trim(), product = String(values.product || '').trim();
  const amount = Number(values.amount);
  if (name.length < 2 || !/^0[5-7]\d{8}$/.test(phone) || city.length < 2 || !product || !Number.isFinite(amount) || amount <= 0) throw new Error('يرجى التحقق من اسم العميل والهاتف والمدينة والمنتج والمبلغ.');
  const id = Math.max(0, ...orders.map(order => order.id)) + 1;
  return { id, customer: { id: `demo-customer-${id}`, name, phone, city, address: `عنوان تجريبي — ${city}` }, amount, currency: 'MAD', status: 'new', created_at: now.toISOString(), payment_method: 'cod', items: [{ id: `demo-item-${id}`, name: product, quantity: 1, unit_price: amount }], note: 'طلب تجريبي مضاف محلياً، لا يُرسل إلى المتجر.' };
}
