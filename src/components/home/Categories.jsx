import { Link } from 'react-router-dom';
import { categories } from '../../data/products';
import AccentTitle from '../common/AccentTitle';
export default function Categories() { return <section className="section-space"><div className="mb-9 md:mb-12"><AccentTitle>أنواع المنتجات</AccentTitle></div><div className="mx-auto flex max-w-5xl gap-3 px-8 md:gap-6 md:px-12">{categories.map(category => <Link key={category.id} to={`/category/${category.id}`} className="w-28 rounded-lg border border-gray-100 bg-white p-2 text-center shadow-sm transition hover:shadow-md sm:w-40 md:w-52"><img src={category.image} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-contain"/><h3 className="mt-2 text-[10px] font-semibold md:text-sm">{category.name}</h3></Link>)}</div></section>; }
