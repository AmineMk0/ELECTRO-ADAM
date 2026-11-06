import productsReference from '../../../desin/dash3.jpg';
import { productImageSamples } from '../../data/admin/productsDemo';

export default function ProductImage({ image, alt, className = '' }) {
  if (image?.kind === 'reference') {
    const sample = productImageSamples.find(item => item.id === image.reference_id);
    if (sample) return <svg viewBox={sample.viewBox} className={`overflow-hidden ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} focusable="false"><image href={productsReference} width="1600" height="900" /></svg>;
  }
  return <img src={image?.url || '/assets/product.png'} alt={alt} className={`object-contain ${className}`} onError={event => { if (!event.currentTarget.src.endsWith('/assets/product.png')) event.currentTarget.src = '/assets/product.png'; }} />;
}
