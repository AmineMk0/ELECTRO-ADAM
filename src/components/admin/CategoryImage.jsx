import reference from '../../../desin/dash4.jpg';
import { categoryImageSamples } from '../../data/admin/categoriesDemo';
import ProductImage from './ProductImage';

export default function CategoryImage({ image, alt, className = '' }) {
  const sample = image?.kind === 'category-reference' && categoryImageSamples.find(item => item.id === image.reference_id);
  if (sample) return <svg viewBox={sample.viewBox} className={`overflow-hidden ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} focusable="false"><image href={reference} width="1600" height="901" /></svg>;
  return <ProductImage image={image} alt={alt} className={className} />;
}
