import { useEffect } from 'react';
import PaymentMethods from './PaymentMethods';
import ReturnsPolicy from './ReturnsPolicy';

export default function StorePolicy({ type }) {
  const payment = type === 'payment';
  const title = payment ? 'طرق الدفع' : 'سياسة الاستبدال والاسترجاع';

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | إلكترو آدم`;
    return () => { document.title = previousTitle; };
  }, [title]);

  return payment ? <PaymentMethods /> : <ReturnsPolicy />;
}
