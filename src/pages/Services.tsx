import { useState, useEffect } from 'react';
import { Search, Wrench, Zap, Hammer, Paintbrush, Sparkles, Heart, TreePine, Car, MonitorSmartphone, Users, ArrowRight, Lightbulb, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { mockCategories, getRecommendation, mockSubServices } from '../data/mockData';
import { api } from '../services/api';
import { Service } from '../types';

const getServiceIcon = (id: string) => {
  // Using slug or name to map icon since UUID is random
  const name = id.toLowerCase();
  if (name.includes('plumb')) return Wrench;
  if (name.includes('elect')) return Zap;
  if (name.includes('carp')) return Hammer;
  if (name.includes('paint')) return Paintbrush;
  if (name.includes('clean')) return Sparkles;
  if (name.includes('care')) return Heart;
  if (name.includes('garden')) return TreePine;
  if (name.includes('driv')) return Car;
  if (name.includes('tech')) return MonitorSmartphone;
  if (name.includes('domestic')) return Users;
  return Wrench;
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [problemText, setProblemText] = useState('');
  const [recommendation, setRecommendation] = useState<{ categoryId: string, serviceName: string, reason: string } | 'not_found' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (err: any) {
        setError('Failed to load services from the database.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleProblemSubmit = () => {
    if (!problemText.trim()) return;
    const recId = getRecommendation(problemText);
    setRecommendation(recId || 'not_found');
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = activeCategory === 'All' || service.category === activeCategory.toLowerCase();
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-lightBg min-h-screen pb-24">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200 pt-12 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">What Do You Need Help With?</h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl">Find the right skilled worker from your local cooperative network.</p>
          
          <div className="relative max-w-2xl mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:ring-primary focus:border-primary transition-colors"
              placeholder="Search for a service... (e.g., leaking tap, fan repair)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2">
            {mockCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-semibold transition-colors ${
                  activeCategory === cat 
                    ? 'bg-primary text-dark shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content: Services Grid */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center py-24 bg-white rounded-3xl border border-gray-100">
              <Loader className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-red-100">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-dark mb-2">No matching services found</h2>
              <p className="text-gray-500 mb-6">Try another keyword or browse all services.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="bg-dark text-white px-6 py-3 rounded-xl font-semibold hover:bg-deepBlue transition-colors"
              >
                View All Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServices.map(service => {
                const Icon = getServiceIcon(service.id);
                const subServices = mockSubServices[service.id] || [];
                return (
                  <div key={service.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-deepBlue group-hover:bg-primary group-hover:text-dark transition-colors">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{service.category.split('/')[0]}</span>
                    </div>
                    
                    <h3 className="font-bold text-xl text-dark mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2">{service.description}</p>
                    
                    <div className="flex-grow">
                      <ul className="space-y-2 mb-6">
                        {subServices.slice(0, 3).map(sub => (
                          <li key={sub} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> {sub}
                          </li>
                        ))}
                        {subServices.length > 3 && (
                          <li className="text-sm text-gray-400 font-medium">+ {subServices.length - 3} more</li>
                        )}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-gray-500">12+ workers</span>
                      </div>
                      
                      <Link to={`/services/${service.slug}`} className="text-deepBlue font-bold text-sm flex items-center gap-1 group-hover:text-primary transition-colors">
                        Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar: Describe Problem */}
        <div className="lg:col-span-1">
          <div className="bg-dark rounded-3xl p-8 sticky top-32 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">Don't Know Which Service You Need?</h2>
            <p className="text-gray-400 text-sm mb-6">Describe the problem in your own words. We'll help you find the right service.</p>
            
            <textarea 
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-32 mb-4"
              placeholder="Example: &quot;My kitchen tap is leaking and water is collecting under the sink.&quot;"
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
            />
            
            <button 
              onClick={handleProblemSubmit}
              className="w-full bg-primary hover:bg-yellow-400 text-dark font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors mb-6"
            >
              <Lightbulb className="w-5 h-5" /> Find the Right Service
            </button>

            {/* Recommendation Result */}
            {recommendation && (
              <div className="bg-white/10 rounded-2xl p-5 border border-white/10 animate-fade-in">
                {recommendation === 'not_found' ? (
                  <>
                    <h3 className="text-white font-bold mb-2">We couldn't identify the exact service.</h3>
                    <p className="text-gray-400 text-sm mb-4">Browse all services to find what you need.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">We think you need:</h3>
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <span>⚡</span> <span className="font-bold capitalize">{recommendation.categoryId}</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-3">{recommendation.serviceName}</div>
                    <p className="text-gray-300 text-sm mb-5">Reason: "{recommendation.reason}"</p>
                    <button 
                      onClick={() => navigate(`/services/${recommendation.categoryId}`)}
                      className="w-full bg-primary hover:bg-yellow-400 text-dark font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors mb-3"
                    >
                      Find Best Worker <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => navigate(`/services/${recommendation.categoryId}`)}
                      className="w-full bg-transparent border border-white/20 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                    >
                      View Service
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
