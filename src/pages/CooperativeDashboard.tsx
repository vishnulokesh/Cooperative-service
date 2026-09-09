import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Users, ShieldAlert, CalendarClock, CheckCircle2, 
  IndianRupee, AlertTriangle, TrendingUp, ShieldCheck 
} from 'lucide-react';

export default function CooperativeDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [welfareStats, setWelfareStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    async function loadStats() {
      if (!profile?.cooperative_id) return;
      try {
        const [data, wData] = await Promise.all([
          api.getCooperativeDashboardStats(profile.cooperative_id),
          api.getCooperativeWelfareStats(profile.cooperative_id)
        ]);
        setStats(data);
        setWelfareStats(wData);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
    
    // Refresh every minute for demo
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, [profile]);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-20 bg-gray-200 rounded-3xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl"></div>)}
      </div>
    </div>;
  }

  const statCards = [
    { label: 'Active Workers', value: stats?.activeWorkers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Pending Verification', value: stats?.pendingVerification || 0, icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Active Bookings', value: stats?.activeBookings || 0, icon: CalendarClock, color: 'text-primary', bg: 'bg-yellow-50' },
    { label: 'Completed Services', value: stats?.completedServices || 0, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Cooperative Earnings', value: `₹${stats?.cooperativeEarnings || 0}`, icon: IndianRupee, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Emergency Jobs', value: stats?.emergencyJobs || 0, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-dark">Control Center</h1>
          <p className="text-gray-500 mt-1 font-medium">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col group hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-dark tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-gray-500 mt-1">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cooperative Health */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark">Cooperative Health Overview</h2>
            <p className="text-sm text-gray-500 font-medium">Transparent summary of measurable platform metrics.</p>
          </div>
        </div>

        {stats?.activeWorkers > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <HealthMetric label="Worker Participation" value={`${stats.healthScore.workerParticipation}%`} />
            <HealthMetric label="Verification Coverage" value={`${stats.healthScore.verificationCoverage}%`} />
            <HealthMetric label="Service Completion" value={`${stats.healthScore.serviceCompletion}%`} />
            <HealthMetric label="Customer Satisfaction" value={`${stats.healthScore.satisfaction} / 5`} />
            <HealthMetric label="Worker Availability" value={`${stats.healthScore.availability}%`} />
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">Not enough data yet</h3>
            <p className="text-gray-500 text-sm mt-1">Metrics will appear here once your cooperative begins operations.</p>
          </div>
        )}
      </div>

      {/* Worker Protection Summary Card */}
      {welfareStats && (
        <div className="bg-gradient-to-br from-dark to-deepBlue rounded-3xl p-8 border border-gray-800 shadow-xl text-white relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Worker Protection</h3>
                <p className="text-gray-400 font-medium text-sm">Status of your cooperative's welfare and insurance enrollment.</p>
              </div>
            </div>
            
            <div className="flex gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <div className="text-center">
                <div className="text-3xl font-black text-blue-400">
                  {welfareStats.totalWorkers > 0 ? Math.round((welfareStats.activeProtection / welfareStats.totalWorkers) * 100) : 0}%
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Protected</div>
              </div>
              <div className="w-px h-12 bg-white/10 self-center hidden sm:block"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-yellow-400">{welfareStats.pendingWelfare}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Pending</div>
              </div>
              <div className="w-px h-12 bg-white/10 self-center hidden sm:block"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-orange-400">{welfareStats.notEnrolled}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1 whitespace-nowrap">Need Attention</div>
              </div>
            </div>

            <div className="w-full md:w-auto flex-shrink-0 mt-4 md:mt-0">
              <a href="/cooperative/welfare" className="w-full inline-flex items-center justify-center bg-white text-dark font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors gap-2">
                Manage Welfare &rarr;
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function HealthMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col">
      <div className="text-2xl font-black text-dark mb-1">{value}</div>
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</div>
    </div>
  );
}
