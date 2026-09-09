import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ArrowLeft, Loader2, Info } from 'lucide-react';

export default function WorkerInsurance() {
  const { user } = useAuth();
  const [insurance, setInsurance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsurance() {
      if (!user) return;
      try {
        const { data: wData } = await supabase
          .from('workers')
          .select('id')
          .eq('profile_id', user.id)
          .single();

        if (wData) {
          const ins = await api.getWorkerInsurance(wData.id);
          setInsurance(ins);
        }
      } catch (err) {
        console.error("Failed to load insurance", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInsurance();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const isEnrolled = insurance?.status === 'active' || insurance?.status === 'pending';
  
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12 animate-fade-in space-y-8">
      
      <Link to="/welfare" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-dark transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Welfare
      </Link>

      <div>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-dark flex items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-blue-500" /> Protection
        </h1>
        <p className="text-gray-500 mt-3 font-medium text-lg">Your insurance and coverage details managed by your cooperative.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm font-bold flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 flex-shrink-0" />
        <p>
          Insurance policies are configured and managed directly by your Cooperative. CoopServe provides this dashboard for visibility, but does not issue or underwrite policies.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Status Banner */}
        <div className={`absolute top-0 left-0 w-2 h-full ${
          insurance?.status === 'active' ? 'bg-green-500' :
          insurance?.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-300'
        }`}></div>
        
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-500 mb-1">Insurance Status</h2>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black capitalize ${
                insurance?.status === 'active' ? 'text-green-600' :
                insurance?.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {insurance?.status ? insurance.status.replace('_', ' ') : 'Not Enrolled'}
              </span>
              {insurance?.is_demo && (
                <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-gray-200">
                  Demo / Placeholder
                </span>
              )}
            </div>
          </div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
             insurance?.status === 'active' ? 'bg-green-50 text-green-500' :
             insurance?.status === 'pending' ? 'bg-yellow-50 text-yellow-500' : 'bg-gray-50 text-gray-400'
          }`}>
            {insurance?.status === 'active' ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Coverage Type</h3>
            <div className="text-xl font-bold text-dark">
              {isEnrolled ? insurance?.coverage_type : 'Not Assigned'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Provider</h3>
              <div className="text-lg font-bold text-dark">
                {isEnrolled ? insurance?.provider_name : 'Not Assigned'}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Policy Reference</h3>
              <div className="text-lg font-bold text-dark font-mono bg-gray-50 inline-block px-3 py-1 rounded-lg">
                {isEnrolled ? insurance?.policy_reference : 'N/A'}
              </div>
            </div>
          </div>
          
          {isEnrolled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Coverage Amount</h3>
                <div className="text-lg font-bold text-dark">
                  ₹{insurance?.coverage_amount}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Validity</h3>
                <div className="text-sm font-bold text-dark">
                  {new Date(insurance?.start_date).toLocaleDateString()} to {new Date(insurance?.end_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-100">
          <button className="w-full bg-dark hover:bg-deepBlue text-white font-bold py-4 rounded-xl transition-colors">
            Learn About Coverage
          </button>
        </div>
      </div>

    </div>
  );
}
