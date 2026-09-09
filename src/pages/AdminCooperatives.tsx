import { useState } from 'react';
import { cooperatives as initialCooperatives } from '../services/mockData';
import { Building2, CheckCircle2, XCircle, MapPin, Users, Star, Plus, ShieldCheck, Search } from 'lucide-react';

export default function AdminCooperatives() {
  const [coops, setCoops] = useState(initialCooperatives);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New coop form state
  const [newCoopName, setNewCoopName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Andhra Pradesh');

  const handleVerify = (id: string) => {
    setCoops(prev => prev.map(c => c.id === id ? { ...c, verification_status: 'verified' } : c));
    setToast('Cooperative has been verified successfully!');
    setTimeout(() => setToast(null), 3000);
  };

  const handleReject = (id: string) => {
    setCoops(prev => prev.map(c => c.id === id ? { ...c, verification_status: 'rejected' } : c));
    setToast('Cooperative verification request rejected.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddCooperative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoopName || !newCity) return;

    const newCoop = {
      id: `c${Date.now()}`,
      name: newCoopName,
      city: newCity,
      district: newCity,
      state: newState,
      verification_status: 'verified',
      worker_count: 1,
      rating: 5.0
    };

    setCoops(prev => [newCoop, ...prev]);
    setShowAddModal(false);
    setNewCoopName('');
    setNewCity('');
    setToast(`Cooperative "${newCoopName}" created successfully!`);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredCoops = coops.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.city.toLowerCase().includes(search.toLowerCase()) ||
                          c.state.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.verification_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-24 right-8 bg-dark text-white px-5 py-3 rounded-xl shadow-2xl border border-primary z-50 flex items-center gap-3 animate-bounce">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-dark tracking-tight">Cooperative Societies & Federations</h1>
          <p className="text-gray-500 text-sm mt-1">Review, verify, and onboard Labour Cooperatives across India.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-primary text-dark font-extrabold text-sm rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Federation
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 lg:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cooperative by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-500">Verification Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Cooperatives</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending Approval</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Grid of Cooperatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoops.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-100 text-gray-400 font-medium">
            No cooperatives matching your criteria.
          </div>
        ) : (
          filteredCoops.map((coop) => (
            <div key={coop.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-gray-200 transition-all">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-deepBlue flex items-center justify-center font-bold flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    {coop.verification_status === 'verified' && (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified
                      </span>
                    )}
                    {coop.verification_status === 'pending' && (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-extrabold text-[10px] rounded-full border border-amber-200 animate-pulse">
                        Pending Review
                      </span>
                    )}
                    {coop.verification_status === 'rejected' && (
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-extrabold text-[10px] rounded-full border border-rose-200 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-500" /> Rejected
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-extrabold text-dark text-base leading-snug">{coop.name}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{coop.city}, {coop.state}</span>
                  </div>
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <strong className="text-dark font-bold">{coop.worker_count}</strong> Workers
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <strong className="text-dark font-bold">{coop.rating}</strong> Rating
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                {coop.verification_status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleReject(coop.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleVerify(coop.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Verify
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-bold text-gray-400">Cooperative Active</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Federation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-dark flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" /> Register New Federation
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-dark font-bold text-xl">✕</button>
            </div>

            <form onSubmit={handleAddCooperative} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1">Cooperative Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kadapa Skilled Labour Federation"
                  value={newCoopName}
                  onChange={(e) => setNewCoopName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1">City / District</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kadapa"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1">State</label>
                <select
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Kerala">Kerala</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-dark font-black text-sm rounded-xl hover:bg-yellow-400 shadow-sm"
                >
                  Register Cooperative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
