import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Filter, Calendar, MapPin, IndianRupee } from 'lucide-react';

export default function CooperativeBookings() {
  const { profile } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchBookings() {
      if (!profile?.cooperative_id) return;
      try {
        const data = await api.getCooperativeBookings(profile.cooperative_id);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [profile]);

  const filteredBookings = bookings.filter(b => statusFilter === 'all' || b.status === statusFilter);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 rounded-xl w-64"></div>
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl w-full"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black tracking-tight text-dark">Bookings Overview</h1>
        
        <div className="relative w-full md:w-64">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-white border border-gray-100 rounded-xl appearance-none font-medium text-dark focus:ring-2 focus:ring-primary shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted / Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="px-6 py-4">Service & Worker</th>
                <th className="px-6 py-4">Customer & Location</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-dark">{b.service?.name}</div>
                    <div className="text-sm text-gray-500 font-medium">by {b.worker?.profile?.full_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-dark">{b.customer?.full_name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {b.city}, {b.district}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-dark font-medium">
                      <Calendar className="w-4 h-4 text-primary" />
                      {b.is_emergency ? 'Immediate' : `${new Date(b.scheduled_date).toLocaleDateString()} at ${b.scheduled_start_time.slice(0, 5)}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                      b.status === 'completed' ? 'bg-green-50 text-green-700' :
                      b.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                      b.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                      b.is_emergency ? 'bg-red-500 text-white shadow-sm' :
                      'bg-orange-50 text-orange-700'
                    }`}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 font-bold text-dark">
                      <IndianRupee className="w-4 h-4 text-gray-400" />
                      {b.base_amount || 0}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
