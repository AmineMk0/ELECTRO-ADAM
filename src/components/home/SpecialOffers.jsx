import AccentTitle from '../common/AccentTitle';
import ProductCard from '../common/ProductCard';
import { products } from '../../data/products';
export default function SpecialOffers({ addToCart }) {return <section className="section-space"><div className="mb-6 md:mb-8"><AccentTitle>عروض و تخفيضات</AccentTitle></div><div className="mx-auto flex min-h-0 max-w-5xl justify-start px-5 md:min-h-0 md:px-8">{products.map(product => <div key={product.id} className="w-32 sm:w-44 md:w-44"><ProductCard product={product} addToCart={addToCart}/></div>)}</div></section>;}
