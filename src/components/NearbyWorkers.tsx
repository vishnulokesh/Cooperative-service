import { useState } from 'react';
import { Star, MapPin, ShieldCheck, ArrowRight, Sparkles, Check, Mic, MicOff, Search, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { workers, profiles, cooperatives } from '../services/mockData';

const CATEGORIES = [
  { id: 'all', name: 'All Services', icon: '✨' },
  { id: 'plumbing', name: 'Plumber', icon: '🚰' },
  { id: 'electrical', name: 'Electrician', icon: '🔧' },
  { id: 'carpentry', name: 'Carpenter', icon: '🪚' },
  { id: 'cleaning', name: 'Domestic Services', icon: '🧹' },
  { id: 'eldercare', name: 'Elder Care', icon: '👵' },
  { id: 'driver', name: 'Driver', icon: '🚗' },
  { id: 'painting', name: 'Painter', icon: '🎨' },
  { id: 'appliance', name: 'AC & Appliance', icon: '❄️' },
];

const NearbyWorkers = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationInput, setLocationInput] = useState('Chittoor, Andhra Pradesh');
  const [problemDescription, setProblemDescription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [detectingLoc, setDetectingLoc] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationInput('Tirupati, Andhra Pradesh');
      return;
    }
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationInput('Chittoor Central, Andhra Pradesh');
        setDetectingLoc(false);
      },
      () => {
        setLocationInput('Chittoor, Andhra Pradesh');
        setDetectingLoc(false);
      }
    );
  };

  const toggleMic = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your problem description.');
      return;
    }
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      const rec = new SpeechRecognition();
      rec.lang = 'en-IN';
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setProblemDescription(text);
        setIsListening(false);
      };
      rec.onerror = () => setIsListening(false);
      rec.start();
    }
  };

  const filteredWorkers = workers.filter(w => {
    if (w.availability_status !== 'available') return false;
    if (selectedCategory === 'all') return true;
    const title = (w.professional_title || '').toLowerCase();
    const skills = (w.skills || []).join(' ').toLowerCase();
    return title.includes(selectedCategory) || skills.includes(selectedCategory);
  }).slice(0, 4);

  const handleBookWorker = (workerId: string, workerName?: string) => {
    const draft = {
      workerId,
      workerName,
      location: locationInput,
      address: locationInput,
      city: locationInput.split(',')[0].trim(),
      notes: problemDescription,
      serviceCategory: selectedCategory
    };
    sessionStorage.setItem('dailsmart_pending_booking', JSON.stringify(draft));
    navigate(`/booking/${workerId}`, { state: { preservedBooking: draft } });
  };

  return (
    <section id="nearby-workers-section" className="py-20 bg-[#F6F8FC] dark:bg-slate-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-block bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
              📍 Location-First Verified Skills
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">Available Verified Workers</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Discover verified cooperative professionals near your doorstep without signing in. Login is only required when booking.
            </p>
          </div>
          <Link
            to="/find-worker"
            className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap"
          >
            View All Workers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Location & Problem Bar */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Location Input */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Where do you need the service?</span>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLoc}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px] font-bold flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" />
                  {detectingLoc ? 'Detecting...' : 'Detect My Location'}
                </button>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                <input
                  type="text"
                  value={locationInput}
                  onChange={e => setLocationInput(e.target.value)}
                  placeholder="Enter your area or city (e.g., Chittoor, Tirupati, Bengaluru)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Describe Problem */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Describe your problem (Voice or Text)
              </label>
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={problemDescription}
                  onChange={e => setProblemDescription(e.target.value)}
                  placeholder="e.g., Bathroom pipe leak, switchboard sparking, fan repair"
                  className="w-full pl-10 pr-12 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`absolute right-2 p-1.5 rounded-lg transition-all ${
                    isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                  }`}
                  title="Speak your problem in Telugu, Hindi, Tamil, or English"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

          {/* Service Categories Filter */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 mr-1">Select Service:</span>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Worker Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredWorkers.map((worker, index) => {
            const profile = profiles.find(p => p.id === worker.profile_id);
            const coop = cooperatives.find(c => c.id === worker.cooperative_id);
            const isTopMatch = index === 0;

            return (
              <div
                key={worker.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border transition-all duration-300 flex flex-col justify-between relative ${
                  isTopMatch
                    ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* AI Recommendation Banner for top worker */}
                {isTopMatch && (
                  <div className="mb-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-3 py-1.5 rounded-2xl text-[11px] font-black flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Recommended by DailSmart AI</span>
                  </div>
                )}

                <div>
                  {/* Avatar + Rating */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <img
                        src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'Worker')}&background=182235&color=fff`}
                        alt={profile?.full_name || 'Worker'}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" title="Available" />
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full text-xs font-black border border-amber-200 dark:border-amber-800">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {worker.rating}
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-0.5">{profile?.full_name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">{worker.professional_title}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {worker.skills.slice(0, 2).map(skill => (
                      <span key={skill} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{coop?.name || 'Cooperative Verified'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{worker.distance_km} km away</span>
                      <span>• ₹{worker.price_per_visit}/visit</span>
                    </div>
                  </div>

                  {/* Match Reasons for Top Match */}
                  {isTopMatch && (
                    <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] space-y-0.5 text-slate-600 dark:text-slate-400 mb-4 font-medium">
                      <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Match Reasons:</div>
                      <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                        <Check className="w-3 h-3" /> Required skill verified
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                        <Check className="w-3 h-3" /> Nearby ({worker.distance_km} km)
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                        <Check className="w-3 h-3" /> Available now
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                        <Check className="w-3 h-3" /> High reliability (4.8+ rating)
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to={`/workers/${worker.id}`}
                    className="flex-1 text-center text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleBookWorker(worker.id, profile?.full_name)}
                    className="flex-1 text-center text-xs font-black bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default NearbyWorkers;
