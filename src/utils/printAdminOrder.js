import { orderStatuses } from '../data/admin/ordersDemo.js';
import { formatPhone, money, orderDate, orderTime } from './adminOrders.js';

export function orderPrintFields(order) {
  return [
    ['رقم الطلب', `#${order.id}`], ['العميل', order.customer.name],
    ['الهاتف', formatPhone(order.customer.phone)], ['المدينة', order.customer.city],
    ['العنوان', order.customer.address], ['تاريخ الطلب', `${orderDate(order)} ${orderTime(order)}`],
    ['الحالة', orderStatuses.find(status => status.id === order.status).label], ['طريقة الدفع', 'الدفع عند الاستلام'],
  ];
}

// Isolated same-origin print document. Order data is inserted as text, never HTML.
export async function printAdminOrder(order) {
  const frame = document.createElement('iframe');
  frame.title = `طباعة الطلب ${order.id}`;
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:800px;height:1000px;border:0;';
  (document.querySelector('dialog[open]') || document.body).append(frame);
  const cleanup = () => frame.remove();
  try {
    const doc = frame.contentDocument, target = frame.contentWindow;
    if (!doc || !target) throw new Error('Print view unavailable');
    doc.documentElement.lang = 'ar'; doc.documentElement.dir = 'rtl';
    doc.title = `ELECTRO ADAM — طلب تجريبي ${order.id}`;
    const style = doc.createElement('style');
    style.textContent = '@page{size:A4;margin:14mm}body{font-family:Arial,sans-serif;color:#073773;font-size:14px;line-height:1.8}header{display:flex;align-items:center;gap:20px;border-bottom:2px solid #ff8a00;padding-bottom:12px}img{width:90px;height:90px;object-fit:contain}h1{font-size:24px;margin:0}aside{background:#fff4df;padding:8px;margin:15px 0}dl{display:grid;grid-template-columns:1fr 1fr;gap:12px}dt{color:#606b7f;font-size:12px}dd{margin:0;font-weight:bold;overflow-wrap:anywhere}table{width:100%;border-collapse:collapse;margin:24px 0}th,td{padding:10px;text-align:right;border-bottom:1px solid #e1e6ef}th{background:#f0f3f9}tfoot{font-weight:bold}footer{margin-top:24px;font-size:12px;color:#606b7f}';
    doc.head.append(style);
    const add = (parent, tag, text) => { const element = doc.createElement(tag); if (text !== undefined) element.textContent = String(text); parent.append(element); return element; };
    const header = add(doc.body, 'header');
    const logo = add(header, 'img'); logo.alt = 'إلكترو آدم'; logo.src = new URL('/assets/logo-transparent.png', window.location.origin).href;
    const title = add(header, 'div'); add(title, 'h1', 'ELECTRO ADAM'); add(title, 'p', `تفاصيل الطلب #${order.id}`);
    add(doc.body, 'aside', 'نسخة تجريبية للمعاينة — ليست فاتورة أو طلباً فعلياً.');
    const details = add(doc.body, 'dl');
    for (const [label, value] of orderPrintFields(order)) { const field = add(details, 'div'); add(field, 'dt', label); add(field, 'dd', value); }
    const table = add(doc.body, 'table'), head = add(add(table, 'thead'), 'tr');
    for (const label of ['المنتج', 'الكمية', 'سعر الوحدة', 'المجموع']) add(head, 'th', label);
    const body = add(table, 'tbody');
    for (const item of order.items) { const row = add(body, 'tr'); for (const value of [item.name, item.quantity, money(item.unit_price), money(item.quantity * item.unit_price)]) add(row, 'td', value); }
    const total = add(add(table, 'tfoot'), 'tr');
    const label = add(total, 'td', 'المبلغ الإجمالي'); label.colSpan = 3; add(total, 'td', money(order.amount));
    if (order.note) add(doc.body, 'p', order.note);
    add(doc.body, 'footer', 'ELECTRO ADAM — الشحن والتوصيل داخل المغرب');
    await Promise.race([new Promise(resolve => { if (logo.complete) resolve(); else { logo.onload = resolve; logo.onerror = resolve; } }), new Promise(resolve => setTimeout(resolve, 1500))]);
    target.addEventListener('afterprint', cleanup, { once: true });
    const timeout = setTimeout(cleanup, 120000);
    target.addEventListener('afterprint', () => clearTimeout(timeout), { once: true });
    target.focus(); target.print();
  } catch (error) { cleanup(); throw error; }
}
