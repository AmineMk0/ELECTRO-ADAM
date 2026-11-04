import HeroSlider from '../components/home/HeroSlider';
import StoreFeatures from '../components/home/StoreFeatures';
import SpecialOffers from '../components/home/SpecialOffers';
import Categories from '../components/home/Categories';
import DeliveryBanner from '../components/home/DeliveryBanner';
import Testimonials from '../components/home/Testimonials';
import CustomerServices from '../components/home/CustomerServices';
export default function Home({addToCart}){return <><HeroSlider/><StoreFeatures/><SpecialOffers addToCart={addToCart}/><Categories/><DeliveryBanner/><Testimonials/><CustomerServices/></>;}
