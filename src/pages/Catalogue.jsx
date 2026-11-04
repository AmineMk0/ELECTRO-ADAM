import { Link } from 'react-router-dom';
import { categories } from '../data/products';

const catalogueCategories = [
  { id: 'electronics', name: 'electronics', image: '/assets/category-electronics.png' },
  ...categories,
];

export default function Catalogue() {
  return (
    <section
      aria-labelledby="catalogue-title"
      className="mx-auto w-full max-w-[1172px] px-6 pt-7 pb-9 sm:pt-[32px] sm:pb-[36px]"
    >
      <div className="text-center">
        <h1 id="catalogue-title" className="text-2xl leading-10 font-bold text-[#111111]">
          جميع التشكيلات
        </h1>
        <p className="mt-0.5 text-sm leading-6 text-[#777777]">ستجد كل ما تبحث عنه</p>
      </div>

      <div className="mt-7 grid grid-cols-1 justify-items-center gap-4 min-[360px]:grid-cols-2 sm:mt-[32px] lg:grid-cols-4">
        {catalogueCategories.map(category => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="group block w-full max-w-[280px] overflow-hidden rounded-[3px] border border-[#eeeeee] bg-white shadow-[0_5px_18px_rgba(0,0,0,0.025)] transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand lg:max-w-none"
          >
            <div className="aspect-[1.2] overflow-hidden bg-white">
              <img
                src={category.image}
                alt=""
                width="262"
                height="262"
                className="h-full w-full object-contain"
              />
            </div>
            <h2 className="flex min-h-[44px] items-center justify-center border-t border-[#eeeeee] px-3 py-2 text-center text-sm leading-6 font-semibold text-black">
              <bdi>{category.name}</bdi>
            </h2>
          </Link>
        ))}
      </div>
    </section>
  );
}
