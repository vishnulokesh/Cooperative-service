import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { IndianRupee, TrendingUp, CheckCircle2, Calculator } from 'lucide-react';

export default function CooperativeEarnings() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentEarnings, setRecentEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEarnings() {
      if (!profile?.cooperative_id) return;
      try {
        const data = await api.getCooperativeDashboardStats(profile.cooperative_id);
        setStats(data);
        
        const bookings = await api.getCooperativeBookings(profile.cooperative_id);
        const completed = bookings.filter(b => b.status === 'completed');
        setRecentEarnings(completed.slice(0, 10)); // Just taking recent 10 for display
      } catch (err) {
        console.error("Error fetching earnings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEarnings();
  }, [profile]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 rounded-xl w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl w-full"></div>)}
        </div>
      </div>
    );
  }

  const averageContribution = stats?.completedServices > 0 
    ? Math.round(stats.cooperativeEarnings / stats.completedServices) 
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-dark">Cooperative Earnings</h1>
        <p className="text-gray-500 mt-1 font-medium text-lg">Financial overview and service contributions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-dark to-deepBlue rounded-3xl p-6 shadow-sm text-white">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black tracking-tight mb-1">₹{stats?.cooperativeEarnings || 0}</div>
          <div className="text-sm font-bold text-white/70 uppercase tracking-wider">Total Contribution</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-dark tracking-tight mb-1">₹{Math.round((stats?.cooperativeEarnings || 0) * 0.3)}</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">This Month (Est.)</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-dark tracking-tight mb-1">{stats?.completedServices || 0}</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Completed Services</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Calculator className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-dark tracking-tight mb-1">₹{averageContribution}</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Avg Contribution / Service</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mt-8">
        <h2 className="text-xl font-bold text-dark mb-6">Recent Financial Breakdown</h2>
        
        <div className="space-y-4">
          {recentEarnings.map(b => (
            <div key={b.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-dark">{b.service?.name}</h3>
                <p className="text-sm text-gray-500 font-medium mt-0.5">
                  by {b.worker?.profile?.full_name} on {new Date(b.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Customer Paid</div>
                  <div className="font-bold text-dark">₹{b.base_amount || 0}</div>
                </div>
                <div>
                  <div className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Worker Earnings</div>
                  <div className="font-bold text-dark">₹{b.worker_amount || 0}</div>
                </div>
                <div>
                  <div className="text-primary font-bold uppercase tracking-wider text-[10px]">Coop Allocation</div>
                  <div className="font-black text-primary">₹{b.cooperative_amount || 0}</div>
                </div>
                <div>
                  <div className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Platform & Fees</div>
                  <div className="font-bold text-dark">₹{(Number(b.platform_amount) || 0) + (Number(b.payment_fee) || 0)}</div>
                </div>
              </div>
            </div>
          ))}

          {recentEarnings.length === 0 && (
            <div className="text-center py-8 text-gray-500 font-medium">
              No completed services found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
