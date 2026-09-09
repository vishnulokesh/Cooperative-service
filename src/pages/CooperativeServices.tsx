import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Briefcase, Users, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CooperativeServices() {
  const { profile } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      if (!profile?.cooperative_id) return;
      try {
        // Here we build a mock aggregated view from workers and bookings for the demo
        // In reality, this would be a dedicated SQL View or RPC
        const [workers, bookings] = await Promise.all([
          api.getCooperativeWorkers(profile.cooperative_id),
          api.getCooperativeBookings(profile.cooperative_id)
        ]);

        const serviceMap = new Map();
        
        // Count workers per service (assuming professional_title maps to service)
        workers.forEach(w => {
          const serviceName = w.professional_title;
          if (!serviceMap.has(serviceName)) {
            serviceMap.set(serviceName, { name: serviceName, workers: 0, available: 0, completed: 0, emergency: 0 });
          }
          const s = serviceMap.get(serviceName);
          s.workers++;
          if (w.availability_status === 'available') s.available++;
        });

        // Count bookings per service
        bookings.forEach(b => {
          if (!b.service) return;
          const serviceName = b.service.name;
          if (!serviceMap.has(serviceName)) {
             serviceMap.set(serviceName, { name: serviceName, workers: 0, available: 0, completed: 0, emergency: 0 });
          }
          const s = serviceMap.get(serviceName);
          if (b.status === 'completed') s.completed++;
          if (b.is_emergency) s.emergency++;
        });

        setServices(Array.from(serviceMap.values()));
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, [profile]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 rounded-xl w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-200 rounded-3xl w-full"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-dark">Supported Services</h1>
        <p className="text-gray-500 mt-1 font-medium text-lg">Services managed by your cooperative.</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-sm font-bold flex items-start gap-3">
        <Briefcase className="w-5 h-5 flex-shrink-0" />
        <p>
          The global service catalog remains platform-controlled. As a Cooperative Admin, you can view the capacity and demand for the services your workers provide, but you cannot arbitrarily add or delete global service types.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col group hover:border-primary transition-colors">
            <h3 className="text-xl font-black text-dark mb-4">{s.name}</h3>
            
            <div className="space-y-3 mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-bold flex items-center gap-2">
                  <Users className="w-4 h-4" /> Workers
                </span>
                <span className="font-bold text-dark">{s.workers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 ml-1 mr-1"></span> Available
                </span>
                <span className="font-bold text-green-600">{s.available}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </span>
                <span className="font-bold text-dark">{s.completed}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-red-500 text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Emergencies
                </span>
                <span className="font-bold text-red-600">{s.emergency}</span>
              </div>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 font-medium">
            Your cooperative does not have any active workers or bookings yet.
          </div>
        )}
      </div>
    </div>
  );
}
