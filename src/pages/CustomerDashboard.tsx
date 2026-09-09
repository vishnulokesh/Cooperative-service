import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Calendar, ArrowRight, Loader, BadgeCheck, MapPin, IndianRupee,
  CheckCircle2, Clock, Truck, PlayCircle, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const TRACKER_STEPS = [
  { key: 'requested', label: 'Requested', icon: Clock },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle2 },
  { key: 'on_the_way', label: 'On The Way', icon: Truck },
  { key: 'started', label: 'Started', icon: PlayCircle },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
];

function getStepIndex(status: string) {
  switch (status) {
    case 'requested':
    case 'pending':
      return 0;
    case 'accepted':
    case 'confirmed':
      return 1;
    case 'on_the_way':
      return 2;
    case 'started':
    case 'in_progress':
      return 3;
    case 'completed':
      return 4;
    default:
      return -1;
  }
}

export default function CustomerDashboard() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  
  // Get actual name from stored profile (set during signup) or Supabase
  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name.split(' ')[0];
    try {
      const stored = localStorage.getItem('dailsmart_profile');
      if (stored) {
        const p = JSON.parse(stored);
        if (p.full_name) return p.full_name.split(' ')[0];
      }
    } catch { /* ignore */ }
    return 'Member';
  };
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed' | 'All'>('Active');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        const bData = await api.getBookingsForCustomer(user?.id || 'c1111111-1111-1111-1111-customer11111');
        setBookings(bData);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.cancelBooking(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      setToast('Booking has been cancelled.');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-black">🟡 {t('status.requested','Requested')}</span>;
      case 'accepted':
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-xs font-black">🔵 {t('status.accepted','Accepted')}</span>;
      case 'on_the_way':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 px-3 py-1 rounded-full text-xs font-black animate-pulse">🛵 {t('dashboard.worker_on_the_way','Worker On The Way')}</span>;
      case 'started':
      case 'in_progress':
        return <span className="bg-teal-100 text-teal-800 border border-teal-300 px-3 py-1 rounded-full text-xs font-black">⚡ {t('status.started','Work Started')}</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black">✅ {t('status.completed','Completed')}</span>;
      case 'cancelled':
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-xs font-black">❌ {t('status.cancelled','Cancelled')}</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 border border-gray-300 px-3 py-1 rounded-full text-xs font-black">{status}</span>;
    }
  };

  const activeBookings = bookings.filter(b => ['requested', 'pending', 'accepted', 'confirmed', 'on_the_way', 'started', 'in_progress'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  // The primary active booked service to show prominently
  const primaryActiveBooking = activeBookings[0] || null;

  const displayBookings = activeTab === 'Active'
    ? (primaryActiveBooking ? [primaryActiveBooking] : [])
    : activeTab === 'Completed'
    ? completedBookings
    : bookings;

  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const totalSpent = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

  return (
    <div className="bg-lightBg dark:bg-gray-950 min-h-screen pb-24 transition-colors">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-8 bg-dark text-white px-5 py-3 rounded-2xl shadow-2xl border border-primary z-50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <section className="bg-gradient-to-br from-dark to-deepBlue text-white pt-12 pb-20 px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/20 text-primary border border-primary/30 text-xs font-black px-3 py-1 rounded-full uppercase">
                {t('dashboard.customer_title', 'Customer Dashboard')}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
              {t('dashboard.welcome', 'Welcome back')}, {getDisplayName()}!
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              Track your booked service in real-time and manage your cooperative bookings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/workers"
              className="bg-primary hover:bg-yellow-400 text-dark font-black px-5 py-3 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> {t('btn.book_now', 'Book New Service')}
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-10 relative z-20">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Active Booked Service</p>
              <p className="text-3xl font-black text-dark dark:text-white mt-1">{activeBookings.length}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">Currently in progress</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Completed Jobs</p>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{completedCount}</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">100% verified workers</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Total Spend</p>
              <p className="text-3xl font-black text-dark dark:text-white mt-1">₹{totalSpent}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">Fair wage distributed</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* My Bookings Tracker Header */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-2xl font-black text-dark dark:text-white tracking-tight flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" /> {t('dashboard.active_booking', 'Current Active Booked Service')}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Real-time tracking for your current booking: Requested ➔ Accepted ➔ On The Way ➔ Started ➔ Completed.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveTab('Active')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'Active'
                    ? 'bg-dark dark:bg-primary text-white dark:text-dark shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white'
                }`}
              >
                ⭐ Active Booking ({activeBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('Completed')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'Completed'
                    ? 'bg-dark dark:bg-primary text-white dark:text-dark shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white'
                }`}
              >
                History ({completedBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('All')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'All'
                    ? 'bg-dark dark:bg-primary text-white dark:text-dark shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {/* Bookings Display */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader className="w-10 h-10 text-primary animate-spin mb-3" />
              <p className="text-sm font-medium text-gray-500">Loading your booked service...</p>
            </div>
          ) : displayBookings.length === 0 ? (
            <div className="py-16 text-center">
              <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-dark dark:text-white mb-1">
                {t('dashboard.no_active', 'No active bookings currently in progress.')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Select a service to book a verified cooperative worker.</p>
              <Link
                to="/workers"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-dark font-black rounded-xl text-xs shadow-sm hover:bg-yellow-400 transition-colors"
              >
                {t('btn.book_now', 'Book a Worker Now')}
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {displayBookings.map((booking) => {
                const currentStep = getStepIndex(booking.status);
                const isCancelled = booking.status === 'cancelled' || booking.status === 'rejected';
                const worker = booking.worker || {};

                return (
                  <div
                    key={booking.id}
                    className="border border-gray-200 dark:border-gray-800 rounded-3xl p-6 bg-white dark:bg-gray-900 transition-all shadow-sm hover:shadow-md"
                  >
                    {/* Header Row: Service, Booking ID, Status Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-black text-dark dark:text-white">{booking.service_name || booking.service?.name}</h3>
                          <span className="text-xs font-mono font-bold text-gray-400">#{booking.id}</span>
                          {booking.is_emergency && (
                            <span className="bg-red-100 text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                              🚨 Emergency
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Scheduled: <strong className="text-dark dark:text-gray-200">{booking.scheduled_date || booking.date} at {booking.scheduled_start_time || booking.time_slot || 'Morning'}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(booking.status)}
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Estimated Cost</span>
                          <span className="text-lg font-black text-dark dark:text-white flex items-center justify-end">
                            <IndianRupee className="w-4 h-4" /> {booking.total_amount || booking.amount || 350}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* LIVE STATUS TRACKER BAR — only shown for non-cancelled bookings */}
                    {!isCancelled && (
                      <div className="py-6 px-2">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-4 flex items-center justify-between">
                          <span>{t('dashboard.job_progress', 'Job Progress Tracker')}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Step {currentStep + 1} of 5</span>
                        </div>

                        <div className="grid grid-cols-5 gap-2 relative">
                          {TRACKER_STEPS.map((step, idx) => {
                            const isDone = currentStep >= idx;
                            const isCurrent = currentStep === idx;
                            const Icon = step.icon;

                            return (
                              <div key={step.key} className="flex flex-col items-center text-center">
                                <div
                                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                                    isCurrent
                                      ? 'bg-dark dark:bg-primary text-white dark:text-dark ring-4 ring-primary/40 font-bold scale-110 shadow-lg'
                                      : isDone
                                      ? 'bg-emerald-500 text-white font-bold'
                                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span
                                  className={`text-[11px] font-bold mt-2 leading-tight ${
                                    isCurrent ? 'text-dark dark:text-white font-black' : isDone ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-400'
                                  }`}
                                >
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Worker Details & Actions */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-3">
                        <img
                          src={worker.avatar || 'https://i.pravatar.cc/150?img=51'}
                          alt={worker.name || 'Worker'}
                          className="w-12 h-12 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 bg-gray-50"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-dark dark:text-white text-sm">{worker.name || 'Surya Prakash'}</span>
                            <BadgeCheck className="w-4 h-4 text-emerald-500" aria-label="Cooperative Verified" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{worker.role || worker.professional_title || 'Master Plumber'}</p>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-400" /> {booking.service_address || 'Chittoor, AP'}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-bold">{booking.payment_method || 'UPI'} {booking.payment_status?.toUpperCase() || 'PAID'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-4 py-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-xs font-bold transition-colors"
                          >
                            Cancel Booking
                          </button>
                        )}
                        <Link
                          to={`/bookings/${booking.id}`}
                          className="px-5 py-2.5 bg-dark dark:bg-white text-white dark:text-dark font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
                        >
                          {t('btn.view_details', 'View Details')} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
