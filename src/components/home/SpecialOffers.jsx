import AccentTitle from '../common/AccentTitle';
import ProductCard from '../common/ProductCard';
import { products } from '../../data/products';
export default function SpecialOffers({ addToCart }) {return <section className="section-space"><div className="mb-9 md:mb-12"><AccentTitle>عروض و تخفيضات</AccentTitle></div><div className="mx-auto flex min-h-72 max-w-5xl justify-start px-8 md:min-h-96 md:px-12">{products.map(product => <div key={product.id} className="w-32 sm:w-44 md:w-52"><ProductCard product={product} addToCart={addToCart}/></div>)}</div></section>;}
