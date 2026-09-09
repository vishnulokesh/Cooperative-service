import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { BadgeCheck, Star, Users, MapPin, Languages, Briefcase, Calendar, CheckCircle2, ArrowRight, Loader, ShieldCheck, HeartPulse } from 'lucide-react';
import { api } from '../services/api';
import LocationPromptModal from '../components/LocationPromptModal';

export default function WorkerProfile() {
  const { id } = useParams();
  const locationState = useLocation().state || {};
  const { matchScore, matchReasons } = locationState;
  
  const [worker, setWorker] = useState<any | null>(null);
  const [welfare, setWelfare] = useState<any | null>(null);
  const [insurance, setInsurance] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadWorker() {
      if (!id) return;
      try {
        setLoading(true);
        const [data, wf, ins] = await Promise.all([
          api.getWorkerById(id),
          api.getWorkerWelfare(id),
          api.getWorkerInsurance(id)
        ]);
        setWorker(data);
        setWelfare(wf);
        setInsurance(ins);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load worker profile from database.');
      } finally {
        setLoading(false);
      }
    }
    loadWorker();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading skill passport...</p>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-dark mb-4">{error || 'Worker not found'}</h2>
        <Link to="/workers" className="text-primary font-bold hover:underline">Return to Workers Directory</Link>
      </div>
    );
  }

  return (
    <div className="bg-lightBg min-h-screen pb-24">
      {/* Header Profile Section */}
      <section className="bg-dark text-white pt-16 pb-32 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <img src={worker.avatar} alt={worker.name} className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-4 border-white/10 shadow-2xl" />
          
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-bold mb-2 flex items-center gap-3">
              {worker.name}
              {worker.isVerified && <BadgeCheck className="text-green-500 w-8 h-8" />}
            </h1>
            <p className="text-xl text-primary font-medium mb-6">{worker.role}</p>
            
            <div className="flex flex-wrap gap-3">
              {worker.isVerified ? (
                <>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-sm font-semibold border border-white/20">
                    <ShieldCheck className="w-4 h-4 text-green-400" /> Identity Verified
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-sm font-semibold border border-white/20">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> Skill Certified
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-sm font-semibold border border-white/20">
                    <Users className="w-4 h-4 text-yellow-400" /> Cooperative Member
                  </span>
                  {welfare?.welfare_status === 'active' && insurance?.status === 'active' && (
                    <span className="flex items-center gap-1.5 bg-blue-500/20 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-500/50 text-blue-300">
                      <HeartPulse className="w-4 h-4 text-blue-400" /> Fully Protected
                    </span>
                  )}
                </>
              ) : (
                <span className="flex items-center gap-1.5 bg-orange-500/20 px-3 py-1.5 rounded-lg text-sm font-semibold border border-orange-500/50 text-orange-400 uppercase tracking-wider">
                  Verification {worker.verificationStatus || 'Pending'}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 -mt-20 relative z-20">
        
        {/* Optional Match Score Header */}
        {matchScore !== undefined && (
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border-4 border-green-500/20 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="text-4xl font-black text-green-600">{matchScore}%</div>
              <div>
                <h3 className="font-bold text-dark text-xl mb-1">CoopServe Match</h3>
                <p className="text-sm text-gray-500 font-medium">This worker is highly recommended for your request.</p>
              </div>
            </div>
            
            {matchReasons && matchReasons.length > 0 && (
              <div className="bg-green-50 rounded-2xl p-4 flex-1 w-full border border-green-100">
                <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider mb-2">Why this match?</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchReasons.map((reason: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs font-semibold text-green-700">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center md:border-r border-gray-100 pb-4 md:pb-0 border-b md:border-b-0">
            <Briefcase className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-dark">{worker.experience_years} Years</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Experience</div>
          </div>
          <div className="text-center md:border-r border-gray-100 pb-4 md:pb-0 border-b md:border-b-0">
            <CheckCircle2 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-dark">{worker.completed_jobs}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Services Done</div>
          </div>
          <div className="text-center md:border-r border-gray-100">
            <Star className="w-6 h-6 text-primary fill-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-dark">{worker.rating} / 5</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</div>
          </div>
          <div className="text-center">
            <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-600 mb-1 capitalize">{worker.availability}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Availability</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-dark mb-6">Verified Skills</h2>
              {worker.skills.length === 0 ? (
                <p className="text-gray-500">No specific skills listed.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {worker.skills.map((skill: string) => (
                    <span key={skill} className="px-4 py-2 bg-gray-50 border border-gray-200 text-dark font-medium rounded-xl">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-dark mb-6">Professional Profile</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Cooperative Affiliation</h3>
                  <Link to={`/cooperatives/${worker.cooperative_id}`} className="inline-flex items-center gap-3 bg-blue-50 hover:bg-blue-100 transition-colors p-4 rounded-xl text-deepBlue font-bold w-full sm:w-auto">
                    <Users className="w-5 h-5" />
                    {worker.cooperativeName}
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Service Area</h3>
                    <p className="font-semibold text-dark">{worker.service_area || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Languages className="w-4 h-4" /> Languages</h3>
                    <p className="font-semibold text-dark">{worker.languages?.join(' • ') || 'English'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-primary/20 sticky top-32">
              <h2 className="text-xl font-bold text-dark mb-4">Request Service</h2>
              <p className="text-sm text-gray-500 mb-6">Book this verified professional through their cooperative. Payments are securely held until job completion.</p>
              
              <button 
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="w-full bg-dark text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-deepBlue transition-colors mb-4 shadow-sm"
              >
                Book This Worker <ArrowRight className="w-5 h-5" />
              </button>
              <div className="text-center text-xs font-semibold text-gray-400">
                Supports Cooperative Fair Wage Model
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Location Prompt Modal */}
      <LocationPromptModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        targetWorkerName={worker?.name}
        onConfirm={(locData) => {
          setShowLocationModal(false);
          navigate(`/booking/${worker.id}`, { state: { ...locData, workerId: worker.id } });
        }}
      />
    </div>
  );
}
