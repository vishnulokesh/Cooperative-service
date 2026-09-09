import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, IndianRupee, HeartHandshake, MapPin, BadgeCheck, Star, Users, Award, Loader, Search, Briefcase } from 'lucide-react';
import { api } from '../services/api';
import { Service } from '../types';
import LocationPromptModal from '../components/LocationPromptModal';

export default function ServiceDetail() {
  const { serviceId } = useParams();
  
  const [service, setService] = useState<Service | null>(null);
  const [subServices, setSubServices] = useState<string[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingWorker, setBookingWorker] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      if (!serviceId) return;
      try {
        setLoading(true);
        const s = await api.getServiceBySlug(serviceId);
        
        if (s) {
          setService(s);
          const [subSvc, wrkrs] = await Promise.all([
            api.getServiceTypes(s.id),
            api.getWorkersByServiceId(s.id)
          ]);
          setSubServices(subSvc);
          setWorkers(wrkrs);
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load service details.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center min-h-[50vh] justify-center">
        <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="py-24 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">{error || 'Service not found'}</h2>
        <Link to="/services" className="text-primary font-bold hover:underline">Return to Services</Link>
      </div>
    );
  }

  return (
    <div className="bg-lightBg dark:bg-gray-950 min-h-screen pb-24 transition-colors">
      {/* Header */}
      <section className="bg-dark text-white pt-16 pb-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link to="/services" className="text-gray-400 hover:text-white text-sm font-semibold flex items-center gap-2 mb-8 transition-colors">
            ← Back to all services
          </Link>
          <div className="inline-block bg-white/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-white/20">
            {service.category}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
            <h1 className="text-4xl lg:text-5xl font-bold">{service.name} Services</h1>
            <Link 
              to="/find-worker" 
              state={{ service: service.name, serviceId: service.id, askPayment: true }}
              className="bg-primary text-dark font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow-md"
            >
              <Search className="w-5 h-5" /> Find Best Match
            </Link>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl">{service.description}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          
          {/* Sub Services */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm mb-12 transition-colors">
            <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Common {service.name} Services</h2>
            {subServices.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">All types of {service.name.toLowerCase()} work supported.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subServices.map(sub => (
                  <div key={sub} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{sub}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Workers List */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-dark dark:text-white">Available Cooperative Workers</h2>
              <Link to="/workers" className="text-deepBlue dark:text-primary font-bold text-sm hover:underline transition-colors">View All →</Link>
            </div>

            <div className="space-y-6">
              {workers.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No verified workers currently available for this service.</p>
                </div>
              ) : (
                workers.map(worker => (
                  <div key={worker.id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-all">
                    <img src={worker.avatar} alt={worker.name} className="w-24 h-24 rounded-2xl object-cover border border-gray-100 dark:border-gray-800" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-xl text-dark dark:text-white flex items-center gap-2">
                            {worker.name}
                            {worker.isVerified && <BadgeCheck className="text-green-500 w-5 h-5" />}
                          </h3>
                          <p className="text-deepBlue dark:text-primary font-medium text-sm">{worker.role}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 rounded-lg text-sm font-bold border border-yellow-200/50 dark:border-yellow-800/50">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {worker.rating}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 mb-4">
                        <Users className="w-4 h-4" /> {worker.cooperativeName}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-5">
                        {worker.skills.slice(0, 3).map((skill: string) => (
                          <span key={skill} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-lg">
                            {skill}
                          </span>
                        ))}
                        {worker.skills.length > 3 && (
                          <span className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 text-gray-400 text-xs font-semibold rounded-lg">+{worker.skills.length - 3}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          {worker.experienceYears} Years Exp • {worker.jobsCompleted} Jobs
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/workers/${worker.id}`} className="bg-gray-100 dark:bg-gray-800 text-dark dark:text-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-750 transition-colors">
                            Profile
                          </Link>
                          <button 
                            type="button"
                            onClick={() => setBookingWorker(worker)}
                            className="bg-dark dark:bg-primary hover:bg-deepBlue dark:hover:bg-yellow-400 text-white dark:text-dark px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <Briefcase className="w-4 h-4" /> Book Worker
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Sidebar: Why Choose CoopServe */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-32 transition-colors">
            <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Why Choose CoopServe for {service.name}?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="text-deepBlue dark:text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-dark dark:text-white text-sm mb-1">Verified Skills</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Workers are verified through rigorous cooperative processes.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center flex-shrink-0">
                  <IndianRupee className="text-green-600 dark:text-green-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-dark dark:text-white text-sm mb-1">Fair Earnings</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Service payments follow the cooperative's transparent earning model.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center flex-shrink-0">
                  <HeartHandshake className="text-pink-600 dark:text-pink-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-dark dark:text-white text-sm mb-1">Worker Welfare</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Eligible cooperative workers benefit from welfare programs.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-950/40 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-yellow-600 dark:text-yellow-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-dark dark:text-white text-sm mb-1">Local Workforce</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Support skilled workers from your own community.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wider mb-4">Backed by</p>
              <div className="flex justify-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-gray-400" />
                </div>
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Prompt Modal */}
      <LocationPromptModal
        isOpen={!!bookingWorker}
        onClose={() => setBookingWorker(null)}
        targetWorkerName={bookingWorker?.name}
        targetServiceName={service?.name}
        onConfirm={(locData) => {
          const wId = bookingWorker?.id;
          const wName = bookingWorker?.name;
          const wAvatar = bookingWorker?.avatar;
          const wRating = bookingWorker?.rating;
          const wJobs = bookingWorker?.jobsCompleted;
          const wCoop = bookingWorker?.cooperativeName;
          setBookingWorker(null);
          navigate('/find-worker', {
            state: {
              service: service?.name || 'Plumbing',
              serviceId: service?.id || 'plumbing',
              location: locData.address || '2/419, Madanapalle',
              city: locData.city || 'Madanapalle',
              workerId: wId,
              workerName: wName,
              workerAvatar: wAvatar,
              workerRating: wRating,
              workerJobs: wJobs,
              workerCoop: wCoop,
              price: 280,
              askPayment: true, // Tells FindWorker to prompt for payment method before showing tracking
            },
          });
        }}
      />
    </div>
  );
}
