export function validateOrder(values) {
  const errors = {};
  if (values.name.trim().length < 3) errors.name = 'يرجى إدخال الاسم الكامل (3 أحرف على الأقل).';
  const phone = values.phone.replace(/[\s().-]/g, '').replace(/[٠-٩۰-۹]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.includes(digit) ? '٠١٢٣٤٥٦٧٨٩'.indexOf(digit) : '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
  if (!/^(?:(?:\+212|00212)[5-7]\d{8}|0[5-7]\d{8})$/.test(phone)) errors.phone = 'أدخل رقماً مغربياً صحيحاً، مثال: 06XXXXXXXX.';
  if (values.city.trim().length < 2) errors.city = 'يرجى إدخال اسم المدينة.';
  if (!Number.isInteger(values.quantity) || values.quantity < 1 || values.quantity > 99) errors.quantity = 'الكمية المتاحة بين 1 و99.';
  return errors;
}
