import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Navigation, Search, Wrench, Zap, Hammer, Paintbrush,
  Sparkles, Heart, TreePine, Car, MonitorSmartphone, Users, ArrowRight
} from 'lucide-react';

const SERVICE_ITEMS = [
  { id: 'electrical', name: 'Electrician', icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
  { id: 'plumbing', name: 'Plumber', icon: Wrench, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200' },
  { id: 'carpentry', name: 'Carpenter', icon: Hammer, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-200' },
  { id: 'painting', name: 'Painter', icon: Paintbrush, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200' },
  { id: 'cleaning', name: 'Cleaning', icon: Sparkles, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' },
  { id: 'caregiving', name: 'Caregiver', icon: Heart, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200' },
  { id: 'driving', name: 'Driver', icon: Car, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200' },
  { id: 'gardening', name: 'Gardener', icon: TreePine, color: 'text-green-500 bg-green-50 dark:bg-green-950/40 border-green-200' },
  { id: 'technical', name: 'AC Repair', icon: MonitorSmartphone, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200' },
  { id: 'appliance', name: 'Appliance Repair', icon: MonitorSmartphone, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40 border-teal-200' },
  { id: 'domestic', name: 'Domestic Help', icon: Users, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/40 border-pink-200' },
];

export default function LocationFirstSearch({ onTalkToAI }: { onTalkToAI?: () => void }) {
  const navigate = useNavigate();
  const [location, setLocation] = useState('Chittoor Central, Andhra Pradesh');
  const [detecting, setDetecting] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocation('Chittoor, Andhra Pradesh');
        setDetecting(false);
      },
      () => {
        setLocation('Tirupati, Andhra Pradesh');
        setDetecting(false);
      }
    );
  };

  const handleSelectService = (serviceName: string) => {
    navigate('/find-worker', {
      state: {
        service: serviceName,
        location: location || 'Chittoor, Andhra Pradesh',
        city: (location || 'Chittoor').split(',')[0].trim(),
      },
    });
  };

  return (
    <section id="location-search-section" className="py-12 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800 space-y-8">
        
        {/* Step 1: Location Prompt */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black">1</span>
              Where do you need a service?
            </h2>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              ✓ No login required to browse verified workers
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter City / Locality (e.g., Chittoor, Tirupati, Bengaluru, Hyderabad)"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={detecting}
              className="w-full sm:w-auto px-5 py-3.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-sm rounded-2xl border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Navigation className={`w-4 h-4 ${detecting ? 'animate-spin' : ''}`} />
              {detecting ? 'Detecting...' : 'Detect My Location'}
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/workers', { state: { location } });
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              Search Location
            </button>
          </div>
        </div>

        {/* Step 2: Service Cards */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">2</span>
              What do you need help with?
            </h3>
            <span className="text-xs text-slate-500">Tap category to view available workers</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {SERVICE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectService(item.name)}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 hover:shadow-lg group ${item.color}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center group-hover:rotate-6 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Help Strip with AI Prompt */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              AI
            </div>
            <div>
              <p className="text-xs font-black text-amber-300">Unsure what category fits your issue?</p>
              <p className="text-xs text-blue-100">Describe your problem in English, Telugu, Hindi, or Tamil — DailSmart AI detects it instantly!</p>
            </div>
          </div>
          <button
            onClick={onTalkToAI}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-transform hover:scale-105 shadow-md flex items-center justify-center gap-1.5 shrink-0"
          >
            Talk to DailSmart AI <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
