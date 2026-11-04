import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Flame, Search, ShoppingCart, UserRound, Menu, X } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

const navigation = [
  { to: '/', label: 'الصفحة الرئيسية' },
  { to: '/catalogue', label: 'التصنيفات' },
  { to: '/products', label: 'قائمة المنتجات' },
  { to: '/info/contact', label: 'اتصل بنا' },
];

export default function Header({ count, total = 0, onCart }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [location.pathname, location.search]);

  const links = navigation.map(({ to, label }) => (
    <NavLink key={to} to={to} end={to === '/'} className="flex min-h-10 items-center transition-colors hover:text-orange">{label}</NavLink>
  ));

  return (
    <header dir="rtl" className="relative z-20 bg-white text-[#082b65] shadow-[0_8px_22px_-14px_#77c8fc]">
      <div className="flex min-h-7 items-center justify-center gap-2 bg-gradient-to-l from-[#ff9800] to-[#ff8700] px-3 py-1.5 text-center text-[10px] font-bold text-white sm:min-h-8 sm:text-sm">
        <span>التوصيل بالمجان، و الدفع عند الاستلام</span><Flame className="size-4 shrink-0 fill-[#f23716] text-[#f23716] sm:size-4" aria-hidden="true" />
      </div>

      <div className="relative mx-auto grid h-16 max-w-[1380px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 md:h-18 sm:px-8">
        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-4 text-sm font-bold lg:flex lg:gap-6 lg:text-sm">{links}</nav>
        <button type="button" onClick={() => { setMenu(!menu); setSearch(false); }} aria-label={menu ? 'إغلاق القائمة' : 'القائمة'} aria-expanded={menu} aria-controls="mobile-navigation" className="flex size-11 items-center justify-center justify-self-start lg:hidden">
          {menu ? <X size={21} /> : <Menu size={21} />}
        </button>

        <Link to="/" aria-label="إلكترو آدم — الصفحة الرئيسية" className="relative z-10 flex h-18 w-22 translate-y-1 items-center justify-center self-start rounded-b-[50%] bg-white pb-2 md:h-21 md:w-28">
          <BrandLogo className="h-16 w-16 md:h-18 md:w-18" />
        </Link>

        <div className="flex items-center justify-end gap-0 sm:gap-2 md:gap-3">
          <Link to="/info/account" aria-label="حسابي" className="hidden size-9 items-center justify-center rounded-lg hover:bg-sky-50 md:flex"><UserRound size={17} /></Link>
          <button type="button" aria-label={search ? 'إغلاق البحث' : 'بحث'} aria-expanded={search} aria-controls="header-search" onClick={() => { setSearch(!search); setMenu(false); }} className="flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-sky-50">{search ? <X size={20} /> : <Search size={22} strokeWidth={2.5} />}</button>
          <button type="button" onClick={onCart} aria-label={`سلة التسوق، ${count} منتجات`} className="relative flex min-h-10 shrink-0 items-center overflow-visible rounded-xl border-2 border-[#d9ecf8] bg-white font-bold transition-colors hover:bg-sky-50">
            <span className="flex size-9 items-center justify-center sm:size-10"><ShoppingCart className="size-6 sm:size-6" strokeWidth={2} /></span>
            <span className="hidden min-w-16 items-center justify-center gap-1 self-stretch border-r-2 border-[#d9ecf8] px-3 text-sm sm:flex"><bdi>{total.toLocaleString('en-US')}</bdi><span>درهم</span></span>
            {count > 0 && <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-[10px] text-white">{count}</span>}
          </button>
        </div>
      </div>

      {menu && <nav id="mobile-navigation" aria-label="قائمة الهاتف" className="relative z-20 grid gap-1 border-t border-sky-100 bg-white px-4 py-3 text-sm font-bold lg:hidden">{links}<Link to="/info/about" className="flex min-h-10 items-center hover:text-orange">من نحن</Link><Link to="/info/account" className="flex min-h-10 items-center gap-2 hover:text-orange"><UserRound size={15} aria-hidden="true" />حسابي</Link></nav>}
      {search && <form id="header-search" role="search" onSubmit={event => { event.preventDefault(); navigate(`/search?q=${encodeURIComponent(query.trim())}`); setSearch(false); }} className="relative z-20 mx-auto flex max-w-3xl gap-2 bg-white px-4 pb-3 pt-3">
        <input autoFocus type="search" aria-label="ابحث عن منتج" value={query} onChange={event => setQuery(event.target.value)} placeholder="ما الذي تبحث عنه؟" className="min-h-10 min-w-0 flex-1 rounded-lg border border-sky-200 px-4 py-1.5 text-sm" />
        <button type="submit" className="rounded-lg bg-brand px-5 font-bold text-white">بحث</button>
      </form>}
    </header>
  );
}
