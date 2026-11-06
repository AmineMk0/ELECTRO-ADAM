import { useEffect, useId, useRef, useState } from 'react';
import { dashboardDemo } from '../../data/admin/dashboardDemo';

export function SalesChart({ data = dashboardDemo.weeklySales }) {
  const gradientId = useId();
  const container = useRef(null);
  const [width, setWidth] = useState(660);
  useEffect(() => {
    const update = () => setWidth(Math.max(260, Math.round(container.current.getBoundingClientRect().width)));
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const height = 190, left = 43, right = 14, top = 15, bottom = 31, maximum = 2500;
  const plotWidth = width - left - right, plotHeight = height - top - bottom;
  const points = data.map((point, index) => ({ ...point, x: left + index * plotWidth / (data.length - 1), y: top + (1 - point.amount / maximum) * plotHeight }));
  const path = points.map((point, index) => {
    if (!index) return `M${point.x},${point.y}`;
    const previous = points[index - 1], mid = (previous.x + point.x) / 2;
    return `C${mid},${previous.y} ${mid},${point.y} ${point.x},${point.y}`;
  }).join(' ');
  return (
    <figure ref={container} className="min-w-0">
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" role="img" aria-label="تطور المبيعات التجريبية خلال آخر سبعة أيام، بالدرهم" dir="ltr">
        <defs><linearGradient id={gradientId} x2="0" y2="1"><stop stopColor="#0b79ee" stopOpacity="0.45" /><stop offset="1" stopColor="#0b79ee" stopOpacity="0.08" /></linearGradient></defs>
        {[0, 500, 1000, 1500, 2000, 2500].map(value => {
          const y = top + (1 - value / maximum) * plotHeight;
          return <g key={value}><line x1={left} x2={width - right} y1={y} y2={y} stroke="#e7ebf2" /><text x={left - 10} y={y + 4} textAnchor="end" fill="#596279" fontSize="11">{value.toLocaleString('en-US')}</text></g>;
        })}
        <path d={`${path} L${points.at(-1).x},${height - bottom} L${left},${height - bottom} Z`} fill={`url(#${gradientId})`} />
        <path d={path} stroke="#0878ef" strokeWidth="3" fill="none" />
        {points.map(point => <g key={point.day}><circle cx={point.x} cy={point.y} r="4.5" fill="white" stroke="#0878ef" strokeWidth="3"><title>{`${point.day}: ${point.amount} DH`}</title></circle><text x={point.x} y={height - 9} textAnchor="middle" fill="#596279" fontSize={width < 420 ? 9 : 10.5}>{width < 420 ? point.day.replace(/^ال/, '') : point.day}</text></g>)}
      </svg>
      <figcaption className="sr-only">{data.map(point => `${point.day}: ${point.amount} درهم`).join('، ')}</figcaption>
    </figure>
  );
}

export function OrderStatusChart({ statuses = dashboardDemo.statuses }) {
  const total = statuses.reduce((sum, status) => sum + status.count, 0);
  let offset = 0;
  return (
    <div dir="ltr" className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
      <svg viewBox="0 0 160 160" className="h-36 w-36 shrink-0 xl:h-40 xl:w-40" role="img" aria-label={`حالات الطلبات التجريبية، المجموع ${total} طلباً`}>
        <circle cx="80" cy="80" r="61" fill="none" stroke="#eef2f8" strokeWidth="25" />
        {statuses.map(status => {
          const percent = status.count / total * 100, start = offset;
          offset += percent;
          return <circle key={status.id} cx="80" cy="80" r="61" pathLength="100" fill="none" stroke={status.color} strokeWidth="25" strokeDasharray={`${Math.max(0, percent - 0.5)} ${100 - Math.max(0, percent - 0.5)}`} strokeDashoffset={-start} transform="rotate(-90 80 80)"><title>{`${status.label}: ${status.count}`}</title></circle>;
        })}
        <text x="80" y="80" textAnchor="middle" fill="#08265f" fontSize="24" fontWeight="700">{total}</text>
        <text x="80" y="101" textAnchor="middle" fill="#08265f" fontSize="15" fontWeight="700">طلب</text>
      </svg>
      <ul dir="rtl" className="min-w-32 flex-1 space-y-2 text-xs font-semibold">
        {statuses.map(status => <li key={status.id} className="flex items-center gap-2"><span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: status.color }} aria-hidden="true" /><span className="flex-1">{status.label}</span><bdi className="font-bold text-[#152448]">{status.count}</bdi></li>)}
      </ul>
    </div>
  );
}
