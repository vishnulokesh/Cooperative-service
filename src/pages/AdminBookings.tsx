import { useState } from 'react';
import { mockDisputes } from '../services/mockData';
import { Calendar, AlertCircle, CheckCircle, Clock, Search, ShieldAlert, Star } from 'lucide-react';

const initialBookings = [
  { id: 'bk001', customer: 'Anitha Rao', worker: 'Surya Prakash', service: 'Plumbing (Pipe Leakage)', date: '2026-09-06 09:00 AM', status: 'confirmed', amount: 350, location: 'Chittoor', rating: 5, review: 'Prompt service! Solved the leak cleanly.' },
  { id: 'bk002', customer: 'Ravi Kumar', worker: 'Venkat Reddy', service: 'Electrical (Wiring Repair)', date: '2026-09-05 02:30 PM', status: 'completed', amount: 450, location: 'Tirupati', rating: 5, review: 'Very polite worker, fair wage price.' },
  { id: 'bk003', customer: 'Sita Ramaiah', worker: 'Lakshmi Devi', service: 'Caregiving (Elder Support)', date: '2026-09-04 10:00 AM', status: 'in_progress', amount: 500, location: 'Nellore', rating: null, review: null },
  { id: 'bk004', customer: 'Kalyan Varma', worker: 'Meena Kumari', service: 'Deep House Cleaning', date: '2026-09-03 11:15 AM', status: 'disputed', amount: 600, location: 'Hyderabad', rating: 2, review: 'Cleaning was incomplete in kitchen area.' },
  { id: 'bk005', customer: 'Girish Sharma', worker: 'Ramesh Babu', service: 'AC Maintenance', date: '2026-09-02 04:00 PM', status: 'completed', amount: 400, location: 'Visakhapatnam', rating: 4, review: 'Good work on compressor.' },
  { id: 'bk006', customer: 'Priya Sundaram', worker: 'Surya Prakash', service: 'Tap Replacement', date: '2026-09-01 08:30 AM', status: 'cancelled', amount: 300, location: 'Chittoor', rating: null, review: null },
];

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'disputes' | 'ratings'>('bookings');
  const [bookings] = useState(initialBookings);
  const [disputes, setDisputes] = useState(mockDisputes);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState<string | null>(null);

  const resolveDispute = (disputeId: string) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === disputeId) {
        setToast(`Dispute #${disputeId} resolved & refund initiated.`);
        setTimeout(() => setToast(null), 3500);
        return { ...d, status: 'resolved' };
      }
      return d;
    }));
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customer.toLowerCase().includes(search.toLowerCase()) ||
                          b.worker.toLowerCase().includes(search.toLowerCase()) ||
                          b.service.toLowerCase().includes(search.toLowerCase()) ||
                          b.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-full border border-emerald-200 flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3 text-emerald-500" /> Completed</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-extrabold text-[10px] rounded-full border border-blue-200 flex items-center gap-1 w-fit"><Clock className="w-3 h-3 text-blue-500" /> Confirmed</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-extrabold text-[10px] rounded-full border border-amber-200 animate-pulse w-fit">In Progress</span>;
      case 'disputed':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-extrabold text-[10px] rounded-full border border-rose-200 flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3 text-rose-500" /> Disputed</span>;
      case 'cancelled':
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 font-extrabold text-[10px] rounded-full border border-gray-200 w-fit">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-24 right-8 bg-dark text-white px-5 py-3 rounded-xl shadow-2xl border border-primary z-50 flex items-center gap-3 animate-bounce">
          <ShieldAlert className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-dark tracking-tight">Bookings, Ratings & Dispute Governance</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor all service dispatches, resolve customer complaints, and audit rating feedback.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'bookings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            All Bookings ({bookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'disputes' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Complaints ({disputes.filter(d => d.status === 'open').length})
          </button>
          <button 
            onClick={() => setActiveTab('ratings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'ratings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Ratings & Reviews
          </button>
        </div>
      </div>

      {/* DISPUTES / COMPLAINTS TAB */}
      {(activeTab === 'disputes' || activeTab === 'bookings') && (
        <div className="bg-gradient-to-br from-rose-900 via-slate-900 to-dark p-6 lg:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-widest mb-2">
              <ShieldAlert className="w-4 h-4" /> Escrow Governance & Dispute Resolution
            </div>
            <h2 className="text-xl lg:text-2xl font-black mb-1">Active Customer Complaints & Disputes</h2>
            <p className="text-xs text-gray-300 mb-6">Escrow funds are safely retained until both customer and worker confirm job completion satisfaction.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disputes.map(dispute => (
                <div key={dispute.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">ID: #{dispute.id} ({dispute.booking_id})</span>
                    {dispute.status === 'open' ? (
                      <span className="px-2 py-0.5 bg-rose-500 text-white font-extrabold text-[10px] rounded-full uppercase">Open Complaint</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500 text-white font-extrabold text-[10px] rounded-full uppercase">Resolved</span>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">{dispute.issue}</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Customer: <strong className="text-white">{dispute.customer}</strong> vs Worker: <strong className="text-white">{dispute.worker}</strong>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-gray-400">{dispute.created_at}</span>
                    {dispute.status === 'open' ? (
                      <button
                        onClick={() => resolveDispute(dispute.id)}
                        className="px-3 py-1.5 bg-amber-400 text-slate-900 font-extrabold rounded-lg hover:bg-amber-300 transition-colors shadow"
                      >
                        Resolve & Refund Customer
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Refund Processed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RATINGS TAB */}
      {activeTab === 'ratings' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Customer Feedback & Worker Ratings</h3>
              <p className="text-xs text-slate-500">Audit transparent customer reviews and star ratings across all completed jobs.</p>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 text-amber-800 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> Platform Avg: 4.85 / 5
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.filter(b => b.rating).map(b => (
              <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{b.customer}</span>
                    <span className="text-xs text-slate-400">reviewed</span>
                    <span className="font-bold text-indigo-600 text-xs">{b.worker}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-400/20 text-amber-800 px-2 py-0.5 rounded text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {b.rating}.0
                  </div>
                </div>
                <div className="text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                  "{b.review}"
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Job: {b.service}</span>
                  <span>{b.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKINGS TABLE TAB */}
      {(activeTab === 'bookings') && (
        <>
          {/* Bookings Filters & Search */}
          <div className="bg-white p-4 lg:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search booking ID, customer, worker, or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-gray-500">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="disputed">Disputed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                    <th className="py-4 px-6">Booking ID & Service</th>
                    <th className="py-4 px-4">Customer</th>
                    <th className="py-4 px-4">Assigned Worker</th>
                    <th className="py-4 px-4">Date & Time</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="text-xs font-mono font-bold text-primary bg-dark px-2 py-0.5 rounded">{b.id}</span>
                          <p className="font-bold text-dark text-sm mt-1">{b.service}</p>
                          <p className="text-xs text-gray-400 font-medium">{b.location}</p>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-semibold text-dark text-sm">{b.customer}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-semibold text-dark text-sm">{b.worker}</span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{b.date}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {getStatusBadge(b.status)}
                      </td>

                      <td className="py-4 px-4 text-right font-black text-dark">
                        ₹{b.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
