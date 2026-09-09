import { Link } from 'react-router-dom';
import { ArrowRight, Star, Tag } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  tagline: string;
  price: string;
  discount: string;
  rating: string;
  image: string;
}

const serviceItems: ServiceItem[] = [
  {
    id: 'plumbing',
    name: 'Plumbing & Pipefitting',
    tagline: 'Tap repair, pipe leaks, drainage unblocking & sanitary fitting',
    price: '₹199',
    discount: '25% OFF',
    rating: '4.9 (14.2k)',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'electrical',
    name: 'Electrician & Wiring',
    tagline: 'Short circuits, fan installation, switchboard repair & MCB setup',
    price: '₹149',
    discount: '30% OFF',
    rating: '4.8 (11.8k)',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'appliance',
    name: 'AC & Appliance Servicing',
    tagline: 'AC deep cleaning, gas refill, fridge & washing machine repair',
    price: '₹399',
    discount: '40% OFF',
    rating: '4.9 (9.5k)',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'cleaning',
    name: 'Deep Home Cleaning',
    tagline: 'Bathroom sanitization, kitchen degreasing & full house cleaning',
    price: '₹499',
    discount: '35% OFF',
    rating: '4.9 (18.6k)',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'painting',
    name: 'Painting & Waterproofing',
    tagline: 'Interior wall coating, texture designs, putty & leak prevention',
    price: '₹12/sq.ft',
    discount: '15% OFF',
    rating: '4.8 (8.1k)',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'caregiving',
    name: 'Caregiver & Elder Support',
    tagline: 'Compassionate elderly care, mobility support & daily assistance',
    price: '₹499/day',
    discount: '20% OFF',
    rating: '4.9 (6.4k)',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=400&q=80',
  },
];

const ServicesSection = () => {
  return (
    <section id="services-section" className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="px-6 lg:px-8 max-w-7xl mx-auto space-y-10">

        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#A65D28] font-black text-xs uppercase tracking-widest mb-1">
              <Tag className="w-4 h-4" /> NoBroker Style Best Value Services
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Top Rated Home Services
            </h2>
            <p className="text-slate-500 text-sm mt-1">Fixed transparent pricing • Verified local professionals • 60-day service warranty</p>
          </div>
          <Link 
            to="/services"
            className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto"
          >
            View All 24 Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceItems.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-slate-950 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Discount Tag */}
              <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm z-10">
                {service.discount}
              </div>

              <div>
                {/* Image */}
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100 relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {service.rating}
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#A65D28] transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {service.tagline}
                </p>
              </div>

              {/* Price & Book CTA */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Starting At</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">{service.price}</div>
                </div>
                
                <Link
                  to="/find-worker"
                  state={{ service: service.name }}
                  className="px-4 py-2 bg-[#A65D28] hover:bg-[#8A4A1C] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  Book Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
