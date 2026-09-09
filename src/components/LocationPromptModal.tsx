import React, { useState } from 'react';
import { MapPin, Navigation, X, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface LocationPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (locationData: { address: string; city: string; state: string }) => void;
  targetWorkerName?: string;
  targetServiceName?: string;
}

const POPULAR_HUBS = [
  { city: 'Chittoor', state: 'Andhra Pradesh' },
  { city: 'Tirupati', state: 'Andhra Pradesh' },
  { city: 'Madanapalle', state: 'Andhra Pradesh' },
  { city: 'Punganur', state: 'Andhra Pradesh' },
  { city: 'Srikalahasti', state: 'Andhra Pradesh' },
  { city: 'Bengaluru', state: 'Karnataka' },
];

export default function LocationPromptModal({
  isOpen,
  onClose,
  onConfirm,
  targetWorkerName,
  targetServiceName,
}: LocationPromptModalProps) {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Andhra Pradesh');
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleUseMyLocation = () => {
    setLocLoading(true);
    setError('');
    if (!navigator.geolocation) {
      setAddress('Gandhi Road, Opp. Clock Tower');
      setCity('Chittoor');
      setStateName('Andhra Pradesh');
      setLocLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setAddress('Gandhi Road, Near Municipal Office');
        setCity('Chittoor');
        setStateName('Andhra Pradesh');
        setLocLoading(false);
      },
      () => {
        // Fallback demo location
        setAddress('Gandhi Road, Near Clock Tower');
        setCity('Chittoor');
        setStateName('Andhra Pradesh');
        setLocLoading(false);
      },
      { timeout: 5000 }
    );
  };

  const handleSelectHub = (hub: { city: string; state: string }) => {
    setCity(hub.city);
    setStateName(hub.state);
    if (!address) {
      setAddress(`Main Bazaar, ${hub.city}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !address.trim()) {
      setError('Please provide your location or street address to proceed.');
      return;
    }

    // Save in storage for quick reuse across booking flows
    try {
      sessionStorage.setItem('dailsmart_user_location', JSON.stringify({
        address: address.trim(),
        city: city.trim(),
        state: stateName,
      }));
    } catch {
      // ignore
    }

    onConfirm({
      address: address.trim(),
      city: city.trim(),
      state: stateName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden relative transition-colors">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-gray-400 hover:text-dark dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-br from-[#1B3A6B] to-[#163264] p-6 text-white text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#FFC928] text-dark flex items-center justify-center mb-4 shadow-md">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            Enter Service Location
          </h3>
          <p className="text-blue-200 text-xs font-medium mt-1">
            {targetWorkerName
              ? `Confirm your location to book ${targetWorkerName}`
              : targetServiceName
              ? `Confirm where you need ${targetServiceName}`
              : 'Enter your doorstep location to schedule verified cooperative services'}
          </p>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl">
              {error}
            </div>
          )}

          {/* Street / Flat Address Input with Locate Button */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Service Address / Locality
            </label>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3.5 flex items-center gap-3 shadow-inner hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <MapPin className="text-dark dark:text-gray-300 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Flat / Street / Landmark (e.g. Gandhi Road, Near Clock Tower)"
                className="w-full bg-transparent border-none outline-none text-dark dark:text-white font-semibold placeholder-gray-400 text-sm focus:ring-0"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locLoading}
                className="flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-400 hover:text-blue-800 whitespace-nowrap px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors disabled:opacity-50"
                title="Use GPS Location"
              >
                <Navigation className={`w-3.5 h-3.5 ${locLoading ? 'animate-spin' : ''}`} />
                {locLoading ? 'Locating...' : 'Locate'}
              </button>
            </div>
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                City / Town
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chittoor"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-dark dark:text-white font-bold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                State
              </label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-dark dark:text-white font-bold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
              />
            </div>
          </div>

          {/* Popular Hubs Chips */}
          <div>
            <span className="block text-[11px] font-extrabold uppercase text-gray-400 tracking-wider mb-2">
              Quick Pick City:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_HUBS.map((hub) => {
                const isSelected = city.toLowerCase() === hub.city.toLowerCase();
                return (
                  <button
                    key={hub.city}
                    type="button"
                    onClick={() => handleSelectHub(hub)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-dark dark:bg-primary text-white dark:text-dark shadow-sm font-black'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-[#FFC928] dark:text-dark" />}
                    {hub.city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trust Banner */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>Cooperative-certified professionals active in this zone</span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 bg-[#FFC928] hover:bg-[#e6b31e] text-dark font-black text-sm rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Proceed to Booking <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
