import { useRef, useState } from 'react';
import { Minus, Plus, ShoppingCart, UserRound, Phone, MapPin } from 'lucide-react';
import { validateOrder } from './orderValidation';

const fields = [{ name: 'name', label: 'الاسم الكامل', autoComplete: 'name', Icon: UserRound }, { name: 'phone', label: 'رقم الهاتف', autoComplete: 'tel', type: 'tel', Icon: Phone }, { name: 'city', label: 'المدينة', autoComplete: 'address-level2', Icon: MapPin }];

export default function OrderForm({ product, addToCart }) {
  const [values, setValues] = useState({ name: '', phone: '', city: '', quantity: 1 });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const form = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateOrder(values);
    setErrors(nextErrors);
    setMessage('');
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) { form.current.elements.namedItem(firstInvalid)?.focus(); return; }
    addToCart(product, values.quantity);
    setMessage('أُضيفت الكمية إلى السلة المحلية فقط. لم يُرسل أي طلب أو معلومات شخصية.');
  }

  return (
    <form ref={form} noValidate onSubmit={handleSubmit} aria-labelledby="order-heading" className="rounded-md border border-[#65aadd] bg-[#f1f8ff] p-3">
      <h2 id="order-heading" className="mb-2 text-center text-lg font-bold text-brand">اطلب الآن</h2>
      <div className="space-y-2">
        {fields.map(({ name, label, autoComplete, type = 'text', Icon }) => <div key={name}><label className="relative block"><span className="sr-only">{label}</span><Icon aria-hidden="true" size={16} className="pointer-events-none absolute top-3 right-3 text-brand"/><input name={name} type={type} autoComplete={autoComplete} required maxLength={name === 'phone' ? 24 : 100} value={values[name]} onChange={event => setValues(current => ({ ...current, [name]: event.target.value }))} placeholder={label} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `error-${name}` : undefined} className="h-11 w-full min-w-0 rounded border border-[#e0e7ef] bg-white pr-9 pl-3 text-right text-sm text-brand placeholder:text-gray-500"/></label>{errors[name] && <p id={`error-${name}`} className="mt-1 text-xs text-red-700">{errors[name]}</p>}</div>)}
      </div>
      <div className="mt-3 flex flex-col gap-3 min-[420px]:flex-row-reverse min-[420px]:items-center">
        <div className="flex items-center gap-2 self-start" dir="ltr">
          <button type="button" aria-label="تقليل الكمية" disabled={values.quantity <= 1} onClick={() => setValues(current => ({ ...current, quantity: current.quantity - 1 }))} className="grid h-10 w-10 place-items-center rounded bg-brand text-white disabled:opacity-40"><Minus size={16}/></button>
          <input name="quantity" aria-label="الكمية" aria-invalid={Boolean(errors.quantity)} aria-describedby={errors.quantity ? 'error-quantity' : undefined} type="number" min="1" max="99" step="1" value={values.quantity} onChange={event => setValues(current => ({ ...current, quantity: event.target.value === '' ? '' : Number(event.target.value) }))} className="h-10 w-12 rounded border border-blue-100 bg-white text-center text-sm text-brand"/>
          <button type="button" aria-label="زيادة الكمية" disabled={values.quantity >= 99} onClick={() => setValues(current => ({ ...current, quantity: Number(current.quantity) + 1 }))} className="grid h-10 w-10 place-items-center rounded bg-brand text-white disabled:opacity-40"><Plus size={16}/></button>
        </div>
        <button type="submit" className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded bg-orange px-3 py-2 text-sm font-bold text-white hover:bg-[#ed7b00]"><ShoppingCart size={18}/>أضف إلى السلة</button>
      </div>
      {errors.quantity && <p id="error-quantity" className="mt-1 text-xs text-red-700">{errors.quantity}</p>}
      <p className="mt-2 text-[11px] leading-5 text-slate-600">واجهة تجريبية: الطلب غير متاح حالياً. بيانات النموذج لا تُرسل ولا تُحفظ.</p>
      <p role="status" className="text-xs leading-5 text-brand">{message}</p>
    </form>
  );
}
