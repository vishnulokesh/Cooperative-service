import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { Search, Filter, ShieldCheck, ShieldAlert, Star } from 'lucide-react';

export default function CooperativeWorkers() {
  const { profile } = useAuth();
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  useEffect(() => {
    async function fetchWorkers() {
      if (!profile?.cooperative_id) return;
      try {
        const data = await api.getCooperativeWorkers(profile.cooperative_id);
        setWorkers(data);
      } catch (err) {
        console.error("Error fetching workers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkers();
  }, [profile]);

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.profile.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.professional_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVerification = verificationFilter === 'all' || w.verification_status === verificationFilter;
    const matchesAvailability = availabilityFilter === 'all' || w.availability_status === availabilityFilter;
    return matchesSearch && matchesVerification && matchesAvailability;
  });

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 rounded-xl w-64"></div>
        <div className="h-20 bg-gray-200 rounded-2xl w-full"></div>
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl w-full"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black tracking-tight text-dark">Workers</h1>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search workers by name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary font-medium text-dark"
          />
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-48">
            <select 
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-xl appearance-none font-medium text-dark focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 md:w-48">
            <select 
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-xl appearance-none font-medium text-dark focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="px-6 py-4">Worker</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4">Stats</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWorkers.map(w => (
                <tr key={w.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-dark flex items-center justify-center font-bold overflow-hidden">
                        {w.profile.avatar_url ? (
                          <img src={w.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : w.profile.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-dark">{w.profile.full_name}</div>
                        <div className="text-sm text-gray-500 font-medium">{w.professional_title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {w.verification_status === 'verified' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
                        <ShieldAlert className="w-3.5 h-3.5" /> {w.verification_status.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                      w.availability_status === 'available' ? 'bg-blue-50 text-blue-700' :
                      w.availability_status === 'busy' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        w.availability_status === 'available' ? 'bg-blue-500' :
                        w.availability_status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                      }`}></span>
                      {w.availability_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm font-bold text-dark">
                        <Star className="w-4 h-4 text-primary fill-primary" /> {w.rating}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">{w.completed_jobs} completed</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {w.verification_status === 'pending' ? (
                      <Link 
                        to={`/cooperative/verification/${w.id}`}
                        className="inline-flex items-center px-4 py-2 bg-dark hover:bg-deepBlue text-white text-sm font-bold rounded-xl transition-colors"
                      >
                        Review
                      </Link>
                    ) : (
                      <Link 
                        to={`/workers/${w.id}`}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-dark text-sm font-bold rounded-xl transition-colors"
                      >
                        View Profile
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
              {filteredWorkers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-gray-500 font-medium">No workers found matching your filters.</p>
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
