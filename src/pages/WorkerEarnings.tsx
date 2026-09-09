import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader, IndianRupee, Briefcase, TrendingUp, Calendar as CalendarIcon, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function WorkerEarnings() {
  const { user } = useAuth();
  const [earningsData, setEarningsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [expandedEarning, setExpandedEarning] = useState<string | null>(null);

  useEffect(() => {
    async function loadEarnings() {
      if (!user) return;
      try {
        setLoading(true);
        // We assume user.id maps to profile.id. In a real app we'd fetch worker by profile ID first.
        // For our prototype, worker_id might be needed. Let's assume we can fetch by profile ID or we get the worker ID.
        // The mock backend usually has worker linked to profile. 
        // We'll just fetch a worker by profile_id and then use that ID.
        // This is a bit of a hack since getWorkerEarnings expects workerId.
        // Let's actually use a standard Supabase query if needed, or pass the profile ID directly if api.ts handles it.
        // Wait, getWorkerEarnings in api.ts takes workerId. Let's find our workerId.
        
        // Quick fix to find worker by profile_id:
        const { data: myWorker } = await (api as any).supabase
          .from('workers')
          .select('id')
          .eq('profile_id', user.id)
          .single();
          
        if (!myWorker) throw new Error('Worker profile not found');

        const data = await api.getWorkerEarnings(myWorker.id);
        setEarningsData(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load earnings data.');
      } finally {
        setLoading(false);
      }
    }
    
    loadEarnings();
  }, [user]);

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your earnings...</p>
      </div>
    );
  }

  if (error || !earningsData) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-dark mb-4">{error}</h2>
        <Link to="/worker-dashboard" className="text-primary font-bold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedEarning(expandedEarning === id ? null : id);
  };

  return (
    <div className="bg-lightBg min-h-screen pb-24 pt-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <Link 
          to="/worker-dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-dark font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-dark">My Earnings</h1>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-dark text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <p className="text-gray-300 font-medium mb-1">Total Earnings</p>
            <h2 className="text-4xl font-black flex items-center mb-2"><IndianRupee className="w-7 h-7" /> {earningsData.totalEarnings}</h2>
            <p className="text-xs text-gray-400">All time completed services</p>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <CalendarIcon className="w-4 h-4" /> <p className="font-medium">This Month</p>
            </div>
            <h2 className="text-3xl font-bold text-dark flex items-center mb-2"><IndianRupee className="w-6 h-6" /> {earningsData.thisMonthEarnings}</h2>
            <p className="text-xs text-green-600 font-bold bg-green-50 inline-block px-2 py-1 rounded-md">On track!</p>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Briefcase className="w-4 h-4" /> <p className="font-medium">Completed Jobs</p>
            </div>
            <h2 className="text-3xl font-bold text-dark mb-2">{earningsData.completedServices.length}</h2>
            <p className="text-xs text-gray-400">Services successfully delivered</p>
          </div>
        </div>

        {/* Tabs - Static for now */}
        <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
          <button className="pb-4 font-bold text-dark border-b-2 border-dark whitespace-nowrap">Overview</button>
          <button className="pb-4 font-bold text-gray-400 hover:text-gray-600 whitespace-nowrap transition-colors">Pending ({earningsData.pendingEarnings})</button>
          <button className="pb-4 font-bold text-gray-400 hover:text-gray-600 whitespace-nowrap transition-colors">Paid</button>
        </div>

        {/* Services List */}
        <div>
          <h2 className="text-xl font-bold text-dark mb-6">Completed Services</h2>
          
          {earningsData.completedServices.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-dark mb-2">No completed services</h2>
              <p className="text-gray-500">Your earnings will appear here once you complete a service.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {earningsData.completedServices.map((booking: any) => (
                <div key={booking.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-all">
                  
                  <div 
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => toggleExpand(booking.id)}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-dark">{booking.service?.name || 'Service'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-gray-400">{booking.scheduled_date}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${booking.payment?.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {booking.payment?.payment_status === 'paid' ? 'Paid' : 'Pending Payment'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto w-full border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-500 font-medium mb-0.5">Your Earnings</p>
                        <span className="block text-2xl font-black text-green-600">₹{booking.worker_amount}</span>
                      </div>
                      <div className="text-gray-400">
                        {expandedEarning === booking.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {expandedEarning === booking.id && (
                    <div className="mt-6 pt-6 border-t border-dashed border-gray-200 animate-fade-in">
                      <h4 className="font-bold text-dark mb-4">Service Earnings Breakdown</h4>
                      
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-3 text-sm">
                        <div className="flex justify-between items-center text-gray-500">
                          <span>Customer Payment (Total)</span>
                          <span>₹{booking.total_amount || booking.estimated_amount}</span>
                        </div>
                        
                        <div className="pt-2 mt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-semibold">Your Earnings</span>
                            <span className="text-green-600 font-bold">₹{booking.worker_amount}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>Cooperative Contribution</span>
                          <span>₹{booking.cooperative_amount}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>Platform & Fees</span>
                          <span>₹{Number(booking.platform_amount || 0) + Number(booking.payment_fee || 0)}</span>
                        </div>
                        
                        <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                          <span className="text-dark font-bold">Net Transferred to You</span>
                          <span className="text-dark font-black text-lg">₹{booking.worker_amount}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-center">
                        <Link to={`/bookings/${booking.id}`} className="text-sm font-bold text-primary hover:underline">
                          View Full Booking Details →
                        </Link>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
