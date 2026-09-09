import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { HeartPulse, Users, ShieldAlert, CheckCircle2, AlertTriangle, Loader2, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CooperativeWelfare() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [gapWorkers, setGapWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!profile?.cooperative_id) return;
      try {
        const [welfareStats, protectionGap] = await Promise.all([
          api.getCooperativeWelfareStats(profile.cooperative_id),
          api.getProtectionGap(profile.cooperative_id)
        ]);
        
        setStats(welfareStats);
        setGapWorkers(protectionGap);
      } catch (err) {
        console.error("Failed to load cooperative welfare data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-primary" /> Welfare & Protection
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage and track your cooperative workers' benefits and protection ecosystem.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-dark">{stats?.totalWorkers || 0}</div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Workers</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-dark">{stats?.activeWelfare || 0}</div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Active Welfare</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-dark">{stats?.pendingWelfare || 0}</div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Pending Enrollment</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-dark">{stats?.activeProtection || 0}</div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Active Protection</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-dark to-deepBlue rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
          <div>
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-orange-400" /> Protection Gap
            </h2>
            <p className="text-gray-300 font-medium max-w-lg mb-6">
              <strong className="text-white text-lg">{stats?.notEnrolled || 0} workers</strong> currently have no active protection record or welfare enrollment. Review priority cases below.
            </p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10 w-full md:w-auto">
             <div className="text-3xl font-black">{Math.round(((stats?.activeProtection || 0) / (stats?.totalWorkers || 1)) * 100)}%</div>
             <div className="text-sm font-bold text-gray-300 uppercase tracking-wider mt-1">Protected Fleet</div>
          </div>
        </div>

        {gapWorkers.length > 0 && (
          <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400 mb-4">Priority Workers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gapWorkers.slice(0, 6).map(worker => (
                <div key={worker.id} className="bg-white/10 border border-white/20 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">{worker.name}</h4>
                    <p className="text-xs font-medium text-gray-300">{worker.role}</p>
                    <p className="text-[10px] font-bold text-orange-300 uppercase tracking-wider mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {worker.welfare_status === 'not_enrolled' ? 'No Welfare' : 'No Protection'}
                    </p>
                  </div>
                  <Link to={`/cooperative/workers/${worker.id}`} className="bg-white text-dark text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    Review
                  </Link>
                </div>
              ))}
            </div>
            {gapWorkers.length > 6 && (
              <div className="mt-4 text-center">
                <Link to="/cooperative/workers" className="text-sm font-bold text-primary hover:text-white transition-colors">
                  View all {gapWorkers.length} workers with gaps &rarr;
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-dark mb-2">Welfare Contribution Transparency</h2>
        <p className="text-gray-500 font-medium mb-6">Track how service fees are allocated to cooperative welfare funds.</p>
        
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col md:flex-row gap-8 items-start">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-dark text-lg mb-2">Cooperative Allocation</h3>
            <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
              When a booking is completed, a portion of the fee is allocated to the cooperative according to your pricing rules (e.g., Customer pays ₹600 &rarr; Worker gets ₹480 &rarr; Cooperative gets ₹60 &rarr; Platform gets ₹60). 
            </p>
            <div className="mt-4 p-3 bg-white rounded-xl border border-blue-100 shadow-sm text-xs font-bold text-blue-800">
              <span className="text-blue-500 mr-2">ℹ</span>
              This allocation is recorded by CoopServe according to the configured pricing rule. It is not automatically an insurance premium or personal welfare contribution.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
