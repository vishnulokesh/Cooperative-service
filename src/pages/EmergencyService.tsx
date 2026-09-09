import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AlertTriangle, MapPin, Phone, Loader, ShieldCheck, BadgeCheck, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EmergencyService() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [serviceId, setServiceId] = useState('');
  const [city, setCity] = useState(profile?.city || '');
  const [district, setDistrict] = useState('');
  const [problem, setProblem] = useState('');
  const [phone, setPhone] = useState(profile?.phone || '');
  
  // Results
  const [searching, setSearching] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  
  // Booking state
  const [bookingWorkerId, setBookingWorkerId] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const svcs = await api.getServices();
        setServices(svcs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const handleUseLocation = () => {
    setCity('Chittoor');
    setDistrict('Chittoor District');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId || !city || !problem || !phone) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      setError('');
      setSearching(true);
      setHasSearched(true);
      
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().substring(0, 5); // HH:MM
      
      // Artificial delay for emergency scan effect
      await new Promise(r => setTimeout(r, 1200));

      const results = await api.findBestMatches({
        serviceId,
        date,
        time,
        city,
        district,
        isEmergency: true
      });
      
      setMatches(results);
    } catch (err) {
      console.error(err);
      setError('Failed to find emergency workers.');
    } finally {
      setSearching(false);
    }
  };

  const handleBookEmergency = async (worker: any) => {
    if (!user) {
      navigate('/login', { state: { returnTo: '/emergency' } });
      return;
    }
    
    try {
      setBookingWorkerId(worker.id);
      
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().substring(0, 5);

      const booking = await api.createBooking({
        customer_id: user.id,
        worker_id: worker.id,
        service_id: serviceId,
        cooperative_id: worker.cooperative_id,
        service_address: 'Emergency Location', // Should capture real address in production
        city,
        district,
        state: 'Andhra Pradesh',
        scheduled_date: date,
        scheduled_start_time: time,
        customer_notes: `EMERGENCY: ${problem}\nContact: ${phone}`,
        estimated_amount: 800, // Premium emergency rate
        status: 'pending',
        is_emergency: true
      });
      
      navigate(`/bookings/${booking.id}`);
      
    } catch (err: any) {
      console.error(err);
      alert('Failed to request emergency help. Please try again.');
      setBookingWorkerId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-12 h-12 text-red-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading emergency services...</p>
      </div>
    );
  }

  return (
    <div className="bg-lightBg min-h-screen pb-24">
      {/* Red Header Banner */}
      <section className="bg-red-600 text-white pt-12 pb-24 px-6 lg:px-8 relative overflow-hidden shadow-inner">
        <div className="absolute top-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <AlertTriangle className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Get Help Now</h1>
          <p className="text-lg text-red-100 font-medium max-w-2xl mx-auto">
            We'll prioritize available verified cooperative workers near your location for immediate assistance.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 -mt-16 relative z-20">
        
        {!hasSearched ? (
          <form onSubmit={handleSearch} className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-red-50/50">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6">{error}</div>}
            
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-dark mb-2">1. What's the emergency?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {services.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setServiceId(s.id)}
                      className={`px-4 py-3 rounded-xl text-sm font-bold transition-all border-2 flex flex-col items-center justify-center gap-2 h-24 ${
                        serviceId === s.id 
                          ? 'border-red-500 bg-red-50 text-red-700' 
                          : 'border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50/30'
                      }`}
                    >
                      <span className="text-2xl">{
                        s.category === 'home' ? '🚰' : 
                        s.category === 'repair' ? '⚡' : 
                        s.category === 'care' ? '❤️' : '🔧'
                      }</span>
                      <span className="text-center leading-tight">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-dark mb-2 flex justify-between">
                  <span>2. Where are you?</span>
                  <button type="button" onClick={handleUseLocation} className="text-red-600 hover:underline text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Use my location
                  </button>
                </label>
                <div className="flex gap-3">
                  <input 
                    type="text" placeholder="City" required
                    className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-dark focus:ring-red-500 focus:border-red-500"
                    value={city} onChange={e => setCity(e.target.value)}
                  />
                  <input 
                    type="text" placeholder="District"
                    className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-dark focus:ring-red-500 focus:border-red-500"
                    value={district} onChange={e => setDistrict(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-dark mb-2">3. Briefly describe what happened</label>
                <textarea 
                  required rows={3} placeholder="Pipe burst, sparking wire, etc..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-dark focus:ring-red-500 focus:border-red-500 resize-none"
                  value={problem} onChange={e => setProblem(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-dark mb-2">4. Best contact number</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                  <input 
                    type="tel" required placeholder="Phone number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-12 text-sm font-medium text-dark focus:ring-red-500 focus:border-red-500"
                    value={phone} onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

            </div>

            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-5 rounded-xl mt-8 shadow-lg shadow-red-600/30 transition-all active:scale-[0.98]"
            >
              Find Help Now
            </button>
          </form>
        ) : searching ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-red-50"></div>
              <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
              <AlertTriangle className="w-10 h-10 text-red-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-6">Scanning for available workers...</h2>
            
            <div className="space-y-3 text-left mx-auto w-56 font-bold text-gray-500">
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-green-500"></span> Prioritizing "Available Now"</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-green-500"></span> Matching local radius</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-green-500"></span> Verifying skill profiles</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-2">
              <h2 className="font-bold text-dark flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" /> {matches.length} Verified Workers Available Nearby
              </h2>
              <button onClick={() => setHasSearched(false)} className="text-sm font-bold text-gray-400 hover:text-dark">Cancel</button>
            </div>

            {matches.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-dark mb-2">No workers available right now</h3>
                <p className="text-gray-500 mb-6">Unfortunately, there are no verified workers available in your area for immediate emergency dispatch.</p>
                <button onClick={() => setHasSearched(false)} className="bg-gray-100 text-dark px-6 py-3 rounded-xl font-bold hover:bg-gray-200">
                  Try standard booking
                </button>
              </div>
            ) : (
              matches.map(worker => (
                <div key={worker.id} className="bg-white rounded-3xl p-6 shadow-xl border-2 border-red-100 relative overflow-hidden flex flex-col md:flex-row gap-6">
                  
                  <div className="absolute top-0 right-0 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl">
                    Emergency Match
                  </div>

                  <div className="w-full md:w-1/3 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                    <img src={worker.avatar} alt={worker.name} className="w-20 h-20 rounded-2xl object-cover mb-4" />
                    <h3 className="font-bold text-lg text-dark flex items-center justify-center gap-1">
                      {worker.name}
                      {worker.isVerified && <BadgeCheck className="text-green-500 w-4 h-4" />}
                    </h3>
                    <p className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded mt-2 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div> Available Now
                    </p>
                  </div>

                  <div className="w-full md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-2xl font-black text-dark mb-1">{worker.matchScore}% Match</div>
                          <div className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" /> {worker.distanceText}
                          </div>
                        </div>
                        <div className="text-right bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                          <div className="text-xs font-bold text-gray-400 uppercase">Est. Arrival</div>
                          <div className="font-bold text-dark flex items-center gap-1"><Clock className="w-4 h-4 text-red-500" /> 20-30 min</div>
                        </div>
                      </div>

                      <ul className="space-y-1.5 mb-6">
                        <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-500" /> Verified Cooperative Member ({worker.cooperativeName})
                        </li>
                        <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-500" /> {worker.experience_years} Years Experience
                        </li>
                      </ul>
                    </div>
                    
                    <button 
                      onClick={() => handleBookEmergency(worker)}
                      disabled={bookingWorkerId !== null}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {bookingWorkerId === worker.id ? (
                        <><Loader className="w-5 h-5 animate-spin" /> Requesting...</>
                      ) : (
                        <><AlertTriangle className="w-5 h-5" /> Request Emergency Help</>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
