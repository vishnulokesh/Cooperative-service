import { useState, useEffect } from 'react';
import { BadgeCheck, Star, Users, Filter, ShieldCheck, Award, Loader, MapPin, IndianRupee, ChevronDown, X, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Service, Cooperative } from '../types';
import LocationPromptModal from '../components/LocationPromptModal';

// Indian middle-class realistic avatars using DiceBear (Indian style silhouettes)
const INDIAN_AVATARS = [
  'https://i.pravatar.cc/150?img=51',  // Indian-looking male
  'https://i.pravatar.cc/150?img=47',  // Indian-looking female
  'https://i.pravatar.cc/150?img=53',  // Indian-looking male
  'https://i.pravatar.cc/150?img=49',  // Indian-looking female
  'https://i.pravatar.cc/150?img=56',  // Indian-looking male
  'https://i.pravatar.cc/150?img=44',  // Indian-looking female
  'https://i.pravatar.cc/150?img=68',  // Indian-looking male
  'https://i.pravatar.cc/150?img=45',  // Indian-looking female
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'distance', label: 'Nearest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'jobs', label: 'Most Jobs Done' },
];

export default function Workers() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [filterService, setFilterService] = useState('All');
  const [filterExp, setFilterExp] = useState('Any');
  const [filterRating, setFilterRating] = useState('Any');
  const [filterCoop, setFilterCoop] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [locationModalWorker, setLocationModalWorker] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [wrkrs, svcs, coops] = await Promise.all([
          api.getWorkers(),
          api.getServices(),
          api.getCooperatives()
        ]);
        // Assign Indian avatars
        const withAvatars = wrkrs.map((w: any, i: number) => ({
          ...w,
          avatar: INDIAN_AVATARS[i % INDIAN_AVATARS.length],
        }));
        setWorkers(withAvatars);
        setServices(svcs);
        setCooperatives(coops);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load workers. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const clearFilters = () => {
    setFilterService('All');
    setFilterExp('Any');
    setFilterRating('Any');
    setFilterCoop('All');
    setFilterAvailability('All');
    setSortBy('rating');
  };

  const activeFilterCount = [
    filterService !== 'All',
    filterExp !== 'Any',
    filterRating !== 'Any',
    filterCoop !== 'All',
    filterAvailability !== 'All',
  ].filter(Boolean).length;

  // Filtering
  const filteredWorkers = workers.filter(w => {
    // Service filter — match by professional_title or role
    if (filterService !== 'All') {
      const serviceMatch = services.find(s => s.name === filterService);
      const titleLower = (w.role || w.professional_title || '').toLowerCase();
      const serviceLower = filterService.toLowerCase();
      if (!titleLower.includes(serviceLower.split(' ')[0])) return false;
      // Also try matching by service_id if available
      if (serviceMatch && w.service_id && w.service_id !== serviceMatch.id) {
        if (!titleLower.includes(serviceLower.split(' ')[0])) return false;
      }
    }

    // Experience filter
    const exp = w.experience_years ?? w.experienceYears ?? 0;
    if (filterExp === '1-3' && (exp < 1 || exp > 3)) return false;
    if (filterExp === '3-5' && (exp < 3 || exp > 5)) return false;
    if (filterExp === '5+' && exp < 5) return false;

    // Rating filter
    if (filterRating === '4+' && w.rating < 4) return false;
    if (filterRating === '4.5+' && w.rating < 4.5) return false;

    // Cooperative filter
    if (filterCoop !== 'All' && w.cooperative_id !== filterCoop) return false;

    // Availability filter
    if (filterAvailability !== 'All') {
      const avail = (w.availability || w.availability_status || '').toLowerCase();
      if (filterAvailability === 'available' && avail !== 'available') return false;
      if (filterAvailability === 'busy' && avail !== 'busy') return false;
    }

    return true;
  });

  // Sorting
  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    switch (sortBy) {
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'distance': return (a.distance_km || 99) - (b.distance_km || 99);
      case 'price_asc': return (a.price_per_visit || 0) - (b.price_per_visit || 0);
      case 'price_desc': return (b.price_per_visit || 0) - (a.price_per_visit || 0);
      case 'experience': return ((b.experience_years ?? b.experienceYears ?? 0) - (a.experience_years ?? a.experienceYears ?? 0));
      case 'jobs': return ((b.completed_jobs || b.jobsCompleted || 0) - (a.completed_jobs || a.jobsCompleted || 0));
      default: return 0;
    }
  });

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-dark font-bold">
          <Filter className="w-5 h-5 text-primary" /> Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-primary text-dark text-xs font-black rounded-full flex items-center justify-center">{activeFilterCount}</span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-rose-600 font-bold flex items-center gap-1 hover:underline">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Service */}
      <div>
        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Service Category</label>
        <select
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-dark focus:ring-2 focus:ring-primary focus:outline-none"
          value={filterService}
          onChange={e => setFilterService(e.target.value)}
        >
          <option value="All">All Services</option>
          {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Availability</label>
        <div className="flex flex-col gap-2">
          {['All', 'available', 'busy'].map(opt => (
            <button
              key={opt}
              onClick={() => setFilterAvailability(opt)}
              className={`text-left px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                filterAvailability === opt
                  ? 'bg-dark text-white border-dark'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {opt === 'All' ? 'All Statuses' : opt === 'available' ? '🟢 Available Now' : '🔴 Busy'}
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Experience</label>
        <div className="flex flex-col gap-2">
          {[
            { val: 'Any', label: 'Any Experience' },
            { val: '1-3', label: '1–3 Years' },
            { val: '3-5', label: '3–5 Years' },
            { val: '5+', label: '5+ Years' },
          ].map(opt => (
            <button
              key={opt.val}
              onClick={() => setFilterExp(opt.val)}
              className={`text-left px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                filterExp === opt.val
                  ? 'bg-dark text-white border-dark'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Minimum Rating</label>
        <div className="flex flex-col gap-2">
          {[
            { val: 'Any', label: 'Any Rating' },
            { val: '4+', label: '⭐ 4.0 & above' },
            { val: '4.5+', label: '⭐ 4.5 & above' },
          ].map(opt => (
            <button
              key={opt.val}
              onClick={() => setFilterRating(opt.val)}
              className={`text-left px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                filterRating === opt.val
                  ? 'bg-dark text-white border-dark'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cooperative */}
      <div>
        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Cooperative Society</label>
        <select
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-dark focus:ring-2 focus:ring-primary focus:outline-none"
          value={filterCoop}
          onChange={e => setFilterCoop(e.target.value)}
        >
          <option value="All">All Cooperatives</option>
          {cooperatives.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div className="bg-lightBg min-h-screen pb-24">
      {/* Header */}
      <section className="bg-gradient-to-br from-dark to-deepBlue pt-12 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">
            Find Verified Workers Near You
          </h1>
          <p className="text-blue-200 text-base max-w-2xl">
            All workers are ID-verified, cooperative-certified, skill-tested, and insured. Filter by service, rating, availability, and more.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-32">
            <FilterPanel />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort Bar + Mobile Filters Toggle */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="text-sm font-semibold text-gray-500">
              {loading ? 'Loading...' : `${sortedWorkers.length} worker${sortedWorkers.length !== 1 ? 's' : ''} found`}
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile Filters Button */}
              <button
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-dark shadow-sm"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter className="w-4 h-4" /> Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-primary text-dark text-xs font-black rounded-full flex items-center justify-center">{activeFilterCount}</span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-dark focus:ring-2 focus:ring-primary focus:outline-none shadow-sm cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Workers Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-24 bg-white rounded-3xl border border-gray-100">
              <div className="text-center space-y-3">
                <Loader className="w-10 h-10 text-primary animate-spin mx-auto" />
                <p className="text-sm text-gray-500 font-medium">Loading verified workers...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-red-100 flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
              <p className="text-gray-500 mb-4 text-sm">{error}</p>
              <button onClick={() => window.location.reload()} className="px-5 py-2 bg-dark text-white font-bold text-sm rounded-xl hover:bg-dark/90">Retry</button>
            </div>
          ) : sortedWorkers.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center">
              <Users className="w-14 h-14 text-gray-200 mb-4" />
              <h2 className="text-xl font-bold text-dark mb-2">No workers match your filters</h2>
              <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or clearing them.</p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 bg-primary text-dark font-extrabold text-sm rounded-xl hover:bg-yellow-400"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedWorkers.map((worker, idx) => {
                const exp = worker.experience_years ?? worker.experienceYears ?? 0;
                const jobs = worker.completed_jobs ?? worker.jobsCompleted ?? 0;
                const avail = (worker.availability || worker.availability_status || '').toLowerCase();
                const isAvailable = avail === 'available';
                const coopName = worker.cooperativeName || 'Verified Cooperative';

                return (
                  <div
                    key={worker.id}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                  >
                    {/* Top accent bar */}
                    <div className={`h-1 w-full ${isAvailable ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-gray-300 to-gray-400'}`} />

                    <div className="p-6 flex flex-col flex-1">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={worker.avatar || INDIAN_AVATARS[idx % INDIAN_AVATARS.length]}
                            alt={worker.name}
                            className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-gray-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name || 'W')}&background=174A7E&color=FFC928&bold=true`;
                            }}
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isAvailable ? 'bg-emerald-400' : 'bg-gray-400'}`}
                            title={isAvailable ? 'Available' : 'Busy'}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-dark text-base flex items-center gap-1.5 leading-tight">
                                {worker.name}
                                {worker.isVerified && <BadgeCheck className="text-emerald-500 w-4 h-4 flex-shrink-0" />}
                              </h3>
                              <p className="text-deepBlue font-semibold text-xs mt-0.5">{worker.role || worker.professional_title}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-black flex-shrink-0">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {worker.rating}
                            </div>
                          </div>

                          {/* Trust badges */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="flex items-center gap-0.5 bg-green-50 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              <ShieldCheck className="w-2.5 h-2.5" /> ID Verified
                            </span>
                            <span className="flex items-center gap-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              <Award className="w-2.5 h-2.5" /> Coop Certified
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cooperative */}
                      <Link
                        to={`/cooperatives/${worker.cooperative_id}`}
                        className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl mb-4 border border-gray-100 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 flex-shrink-0 text-deepBlue" />
                        <span className="truncate">{coopName}</span>
                      </Link>

                      {/* Skills */}
                      {worker.skills && worker.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {worker.skills.slice(0, 3).map((skill: string) => (
                            <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className="text-center">
                          <div className="text-sm font-black text-dark">{exp}y</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Exp</div>
                        </div>
                        <div className="text-center border-x border-gray-200">
                          <div className="text-sm font-black text-dark">{jobs}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Jobs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-black text-dark">
                            {worker.distance_km ? `${worker.distance_km}km` : 'N/A'}
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Distance</div>
                        </div>
                      </div>

                      {/* Price + availability */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-1 text-dark font-black text-base">
                          <IndianRupee className="w-4 h-4" />
                          {worker.price_per_visit || '350'}<span className="text-xs font-medium text-gray-400">/visit</span>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                          isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {isAvailable ? 'Available Now' : 'Busy'}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{worker.city || 'Chittoor'}, {worker.state || 'Andhra Pradesh'}</span>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex gap-2">
                        <Link
                          to={`/workers/${worker.id}`}
                          className="flex-1 text-center text-sm font-bold border border-gray-200 text-dark py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          View Profile
                        </Link>
                        <button
                          type="button"
                          onClick={() => setLocationModalWorker(worker)}
                          disabled={!isAvailable}
                          className={`flex-1 text-center text-sm font-black py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 ${
                            isAvailable
                              ? 'bg-dark text-white hover:bg-deepBlue'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          {isAvailable ? 'Book Now' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-dark text-lg">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-6 py-3 bg-dark text-white font-black rounded-xl text-sm"
            >
              Apply Filters ({sortedWorkers.length} results)
            </button>
          </div>
        </div>
      )}
      {/* Location Prompt Modal */}
      <LocationPromptModal
        isOpen={!!locationModalWorker}
        onClose={() => setLocationModalWorker(null)}
        targetWorkerName={locationModalWorker?.name}
        onConfirm={(locData) => {
          const w = locationModalWorker;
          setLocationModalWorker(null);
          navigate('/find-worker', {
            state: {
              service: w?.role || w?.professional_title || 'Plumbing',
              location: locData.address || '2/419, Madanapalle',
              workerId: w?.id,
              workerName: w?.name,
            },
          });
        }}
      />
    </div>
  );
}
