import { Star, Quote } from 'lucide-react';
import { mockTestimonials } from '../services/mockData';

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-50 text-deepBlue text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            ⭐ Customer Stories
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-3">Trusted by Thousands Across India</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Real reviews from real customers who trust DailSmart Solutions for their household service needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#F6F8FC] rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Quote Icon */}
              <Quote className="w-7 h-7 text-gray-200 mb-4" fill="currentColor" />

              {/* Review Text */}
              <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">"{t.review}"</p>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${t.color}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-dark text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.city}</p>
                </div>
                <span className="ml-auto text-xs font-medium text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                  {t.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
