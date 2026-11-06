import { useRef, useState } from 'react';
import { Minus, Plus, ShoppingBag, UserRound, Phone, MapPin, MapPinned } from 'lucide-react';
import { validateOrder } from './orderValidation';
import { saveProductOrder } from './productOrder';

const fields = [{ name: 'name', label: 'الاسم الكامل', autoComplete: 'name', Icon: UserRound }, { name: 'phone', label: 'رقم الهاتف', autoComplete: 'tel', type: 'tel', Icon: Phone }, { name: 'city', label: 'المدينة', autoComplete: 'address-level2', Icon: MapPin }, { name: 'neighborhood', label: 'الحي', autoComplete: 'address-level3', Icon: MapPinned }];

export default function OrderForm({ product }) {
  const [values, setValues] = useState({ name: '', phone: '', city: '', neighborhood: '', quantity: 1 });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const form = useRef(null);
  const submitted = useRef(false);

  function changeValues(update) {
    submitted.current = false;
    setMessage('');
    setValues(update);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (submitted.current) return;
    const nextErrors = validateOrder(values);
    setErrors(nextErrors);
    setMessage('');
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) { form.current.elements.namedItem(firstInvalid)?.focus(); return; }
    try {
      saveProductOrder(product, values);
      submitted.current = true;
      setMessage('تم حفظ طلبك على هذا الجهاز مع بيانات التوصيل. لم يُرسل إلى المتجر بعد.');
    } catch {
      setErrors({ submission: 'تعذر حفظ الطلب. يرجى المحاولة مجدداً والتحقق من إتاحة التخزين في المتصفح.' });
    }
  }

  return (
    <form ref={form} dir="rtl" noValidate onSubmit={handleSubmit} aria-labelledby="order-heading" className="rounded-md border border-[#65aadd] bg-[#f1f8ff] p-3">
      <h2 id="order-heading" className="mb-2 text-center text-lg font-bold text-brand">اطلب الآن</h2>
      <div className="space-y-2">
        {fields.map(({ name, label, autoComplete, type = 'text', Icon }) => <div key={name}><label className="relative block"><span className="sr-only">{label}</span><Icon aria-hidden="true" size={16} className="pointer-events-none absolute top-3 right-3 text-brand"/><input name={name} type={type} autoComplete={autoComplete} required maxLength={name === 'phone' ? 24 : 100} value={values[name]} onChange={event => changeValues(current => ({ ...current, [name]: event.target.value }))} placeholder={label} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `error-${name}` : undefined} className="h-11 w-full min-w-0 rounded border border-[#e0e7ef] bg-white pr-9 pl-3 text-right text-sm text-brand placeholder:text-gray-500"/></label>{errors[name] && <p id={`error-${name}`} className="mt-1 text-xs text-red-700">{errors[name]}</p>}</div>)}
      </div>
      <div className="mt-3 flex flex-col gap-3 min-[420px]:flex-row-reverse min-[420px]:items-center">
        <div className="flex items-center gap-2 self-start" dir="ltr">
          <button type="button" aria-label="تقليل الكمية" disabled={values.quantity <= 1} onClick={() => changeValues(current => ({ ...current, quantity: current.quantity - 1 }))} className="grid h-10 w-10 place-items-center rounded bg-brand text-white disabled:opacity-40"><Minus size={16}/></button>
          <input name="quantity" aria-label="الكمية" aria-invalid={Boolean(errors.quantity)} aria-describedby={errors.quantity ? 'error-quantity' : undefined} type="number" min="1" max="99" step="1" value={values.quantity} onChange={event => changeValues(current => ({ ...current, quantity: event.target.value === '' ? '' : Number(event.target.value) }))} className="h-10 w-12 rounded border border-blue-100 bg-white text-center text-sm text-brand"/>
          <button type="button" aria-label="زيادة الكمية" disabled={values.quantity >= 99} onClick={() => changeValues(current => ({ ...current, quantity: Number(current.quantity) + 1 }))} className="grid h-10 w-10 place-items-center rounded bg-brand text-white disabled:opacity-40"><Plus size={16}/></button>
        </div>
        <button type="submit" disabled={Boolean(message)} className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded bg-orange px-3 py-2 text-sm font-bold text-white hover:bg-[#ed7b00] disabled:opacity-70"><ShoppingBag aria-hidden="true" size={19}/>شراء الآن</button>
      </div>
      {errors.quantity && <p id="error-quantity" className="mt-1 text-xs text-red-700">{errors.quantity}</p>}
      {errors.submission && <p role="alert" className="mt-2 text-xs leading-5 text-red-700">{errors.submission}</p>}
      <p className="mt-2 text-[11px] leading-5 text-slate-600">نسخة تجريبية: يُحفظ الطلب على هذا الجهاز فقط، إلى حين تفعيل إرسال الطلبات إلى المتجر.</p>
      <p role="status" className="text-xs leading-5 text-brand">{message}</p>
    </form>
  );
}
