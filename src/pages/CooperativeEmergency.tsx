import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';

export default function CooperativeEmergency() {
  const { profile } = useAuth();
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmergencies() {
      if (!profile?.cooperative_id) return;
      try {
        const data = await api.getCooperativeBookings(profile.cooperative_id);
        setEmergencies(data.filter((b: any) => b.is_emergency && ['pending', 'accepted', 'in_progress'].includes(b.status)));
      } catch (err) {
        console.error("Error fetching emergencies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEmergencies();
    
    // Auto refresh every 30 seconds for emergency monitor
    const interval = setInterval(fetchEmergencies, 30000);
    return () => clearInterval(interval);
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex items-center gap-2 text-red-500 font-bold">
          <AlertTriangle className="w-6 h-6 animate-bounce" /> Loading Emergency Operations...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-red-600 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8" /> Emergency Operations
        </h1>
        <p className="text-gray-500 mt-1 font-medium text-lg">Live monitoring of critical service requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencies.map(e => (
          <div key={e.id} className="bg-red-50 rounded-3xl p-6 border-2 border-red-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50"></div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-black text-red-900">{e.service?.name}</h3>
                  <div className="flex items-center gap-2 text-red-700 font-bold text-sm mt-1">
                    <Clock className="w-4 h-4" /> 
                    {Math.floor((new Date().getTime() - new Date(e.created_at).getTime()) / 60000)} mins ago
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm ${
                  e.status === 'pending' ? 'bg-red-500 text-white animate-pulse' :
                  e.status === 'in_progress' ? 'bg-orange-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {e.status === 'pending' ? 'Awaiting Worker' : e.status === 'in_progress' ? 'In Progress' : 'Worker Assigned'}
                </span>
              </div>

              <div className="pt-4 border-t border-red-200/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500 font-bold shadow-sm">
                    {e.customer?.full_name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-red-900 text-sm">Customer: {e.customer?.full_name}</div>
                    <div className="text-xs text-red-700 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {e.city}, {e.district}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500 font-bold shadow-sm">
                    {e.worker?.profile?.full_name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-red-900 text-sm">Worker: {e.worker?.profile?.full_name}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {emergencies.length === 0 && (
          <div className="col-span-full bg-green-50 rounded-3xl p-12 border-2 border-green-200 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">All Clear</h3>
            <p className="text-green-700 font-medium">There are no active emergency operations at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Just to avoid unresolved imports, added a simple ShieldCheck since I used it above
import { ShieldCheck } from 'lucide-react';
