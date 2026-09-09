import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { api } from '../services/api';
import { ArrowLeft, UserCheck, ShieldCheck, HeartPulse, ShieldAlert, Star, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function CooperativeWorkerDetail() {
  const { workerId } = useParams<{ workerId: string }>();
  const { profile } = useAuth();
  
  const [worker, setWorker] = useState<any>(null);
  const [welfare, setWelfare] = useState<any>(null);
  const [insurance, setInsurance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkerData() {
      if (!workerId || !profile?.cooperative_id) return;
      try {
        const { data: wData } = await supabase
          .from('workers')
          .select(`
            *,
            profile:profiles(full_name, avatar_url, phone, email)
          `)
          .eq('id', workerId)
          .eq('cooperative_id', profile.cooperative_id)
          .single();

        if (wData) {
          setWorker(wData);
          
          const [wf, ins] = await Promise.all([
            api.getWorkerWelfare(workerId),
            api.getWorkerInsurance(workerId)
          ]);
          setWelfare(wf);
          setInsurance(ins);
        }
      } catch (err) {
        console.error("Error loading worker details", err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkerData();
  }, [workerId, profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-dark">Worker Not Found</h2>
        <Link to="/cooperative/workers" className="text-primary hover:underline mt-4 inline-block">Back to Workers</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl mx-auto">
      <Link to="/cooperative/workers" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-dark transition-colors mb-2">
        <ArrowLeft className="w-4 h-4" /> Back to Workers
      </Link>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        <div className="w-24 h-24 rounded-2xl bg-gray-100 border-4 border-white shadow-md flex-shrink-0 overflow-hidden text-gray-400 flex items-center justify-center relative z-10">
          {worker.profile.avatar_url ? (
            <img src={worker.profile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <UserCheck className="w-10 h-10" />
          )}
        </div>
        
        <div className="flex-1 relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-dark">{worker.profile.full_name}</h1>
            {worker.verification_status === 'verified' && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1 border border-green-200">
                <ShieldCheck className="w-4 h-4" /> Verified
              </span>
            )}
          </div>
          <p className="text-gray-500 font-bold text-lg mb-4">{worker.professional_title}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-1">Experience</div>
              <div className="font-bold text-dark">{worker.experience_years} Years</div>
            </div>
            <div>
              <div className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-1">Rating</div>
              <div className="font-bold text-dark flex items-center gap-1">
                <Star className="w-4 h-4 text-primary fill-primary" /> {worker.rating}
              </div>
            </div>
            <div>
              <div className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-1">Jobs Completed</div>
              <div className="font-bold text-dark">{worker.completed_jobs}</div>
            </div>
            <div>
              <div className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-1">Contact</div>
              <div className="font-bold text-dark">{worker.profile.phone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Welfare & Protection Admin View */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <h2 className="text-2xl font-black text-dark mb-6 flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-red-500" /> Welfare & Protection
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Welfare Box */}
          <div className={`p-6 rounded-2xl border ${!welfare || welfare.welfare_status === 'not_enrolled' ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Cooperative Welfare
            </h3>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${!welfare || welfare.welfare_status === 'not_enrolled' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                {!welfare || welfare.welfare_status === 'not_enrolled' ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
              <div>
                <div className="font-black text-xl text-dark capitalize">
                  {welfare?.welfare_status?.replace('_', ' ') || 'Not Enrolled'}
                </div>
                <div className="text-xs font-medium text-gray-500 mt-1">
                  {welfare?.enrollment_date ? `Enrolled: ${new Date(welfare.enrollment_date).toLocaleDateString()}` : 'No enrollment record found.'}
                </div>
              </div>
            </div>
            
            <button className="w-full bg-white border border-gray-200 text-sm font-bold text-dark py-3 rounded-xl hover:bg-gray-50 transition-colors">
              Manage Enrollment
            </button>
          </div>

          {/* Insurance Box */}
          <div className={`p-6 rounded-2xl border ${!insurance || insurance.status !== 'active' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Protection & Insurance
            </h3>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${!insurance || insurance.status !== 'active' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                {!insurance || insurance.status !== 'active' ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
              <div>
                <div className="font-black text-xl text-dark capitalize">
                  {insurance?.status || 'Not Covered'}
                </div>
                <div className="text-xs font-medium text-gray-500 mt-1">
                  {insurance ? `${insurance.insurance_type.replace('_', ' ')}` : 'No active policies.'}
                </div>
              </div>
            </div>
            
            <button className="w-full bg-white border border-gray-200 text-sm font-bold text-dark py-3 rounded-xl hover:bg-gray-50 transition-colors">
              Update Coverage
            </button>
          </div>
        </div>

        {(!welfare || welfare.welfare_status === 'not_enrolled' || !insurance || insurance.status !== 'active') && (
          <div className="mt-6 bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800">Protection Gap Detected</h4>
              <p className="text-sm text-red-600 mt-1">This worker is currently operating with a protection gap. Please follow up to ensure compliance with cooperative welfare standards.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
