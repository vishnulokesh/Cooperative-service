import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Phone, MapPin, Building, Shield, Briefcase, Calendar, CheckCircle2, ArrowRight, AtSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Profile() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeJob, setActiveJob] = useState<any>(null);
  const [loadingJob, setLoadingJob] = useState(false);

  // Get the profile data from localStorage (saved during signup/login) or from Supabase
  const getStoredProfile = () => {
    try {
      const p = localStorage.getItem('dailsmart_profile');
      if (p) return JSON.parse(p);
    } catch { /* ignore */ }
    return null;
  };

  // Get session data (saved on login)
  const getSessionData = () => {
    try {
      const s = localStorage.getItem('dailsmart_session');
      if (s) return JSON.parse(s);
    } catch { /* ignore */ }
    return null;
  };

  const storedProfile = getStoredProfile();
  const sessionData = getSessionData();

  // Merge: Supabase profile > localStorage profile > session data > blank
  const activeProfile = {
    full_name: profile?.full_name || storedProfile?.full_name || sessionData?.full_name || 'User',
    email: profile?.email || storedProfile?.email || sessionData?.email || '',
    phone: profile?.phone || storedProfile?.phone || '',
    city: profile?.city || storedProfile?.city || '',
    state: profile?.state || storedProfile?.state || '',
    role: profile?.role || storedProfile?.role || sessionData?.role || 'customer',
    username: profile?.username || storedProfile?.username || '',
    created_at: profile?.created_at || storedProfile?.created_at || null,
    avatar_url: profile?.avatar_url || storedProfile?.avatar_url || null,
  };

  const isWorker = activeProfile.role === 'worker';

  useEffect(() => {
    async function loadWorkerActiveJob() {
      if (!isWorker) return;
      try {
        setLoadingJob(true);
        const bookings = await api.getBookingsForWorker('ww111111-1111-1111-1111-111111111111');
        const accepted = bookings.find(b => ['accepted', 'on_the_way', 'started'].includes(b.status));
        setActiveJob(accepted || null);
      } catch (err) {
        console.error('Failed to load active worker job:', err);
      } finally {
        setLoadingJob(false);
      }
    }
    loadWorkerActiveJob();
  }, [isWorker]);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-lightBg dark:bg-gray-950 pt-24 pb-12 px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-dark dark:text-white">
            {t('nav.profile', 'My Profile')}
          </h1>
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${isWorker ? 'bg-emerald-600 text-white' : 'bg-primary text-dark'}`}>
            {activeProfile.role.replace('_', ' ')} mode
          </span>
        </div>

        {/* WORKER ACTIVE ACCEPTED JOB CARD */}
        {isWorker && !loadingJob && activeJob && (
          <div className="bg-gradient-to-r from-dark to-deepBlue text-white rounded-3xl p-6 shadow-xl border border-blue-900 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Job Accepted & Active
                  </span>
                  <span className="text-xs font-mono text-blue-200">#{activeJob.id?.slice(0,8)}</span>
                </div>
                <h2 className="text-xl font-black text-white">{activeJob.service_name || 'Service'}</h2>
                <p className="text-xs text-blue-200 flex items-center gap-3">
                  <span>Customer: <strong className="text-white">{activeJob.customer?.full_name || 'Customer'}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-400" /> {activeJob.city || activeJob.service_address || 'Location'}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-blue-300 font-extrabold uppercase">Payout</span>
                  <p className="text-lg font-black text-primary">₹{activeJob.total_amount || 500}</p>
                </div>
                <button
                  onClick={() => navigate('/worker-dashboard')}
                  className="bg-primary hover:bg-yellow-400 text-dark font-black px-6 py-3 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md transform hover:scale-105"
                >
                  {t('worker.view_dashboard', 'View Active Job')} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Details Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          
          {/* Header Banner */}
          <div className={`h-32 w-full relative ${isWorker ? 'bg-gradient-to-r from-blue-800 to-emerald-700' : 'bg-gradient-to-r from-primary/30 to-amber-200'}`}>
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-900 border-4 border-white dark:border-gray-800 shadow-md flex items-center justify-center overflow-hidden">
                {activeProfile.avatar_url ? (
                  <img src={activeProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-3xl text-dark dark:text-white">{getInitials(activeProfile.full_name)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Basic Info */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-dark dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                    <div className="flex items-center gap-3 text-dark dark:text-gray-200">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{activeProfile.full_name}</span>
                    </div>
                  </div>

                  {activeProfile.username && (
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Username</label>
                      <div className="flex items-center gap-3 text-dark dark:text-gray-200">
                        <AtSign className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">@{activeProfile.username}</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                    <div className="flex items-center gap-3 text-dark dark:text-gray-200">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{activeProfile.email || '—'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                    <div className="flex items-center gap-3 text-dark dark:text-gray-200">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{activeProfile.phone || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Account */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-dark dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Location & Account</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</label>
                    <div className="flex items-center gap-3 text-dark dark:text-gray-200">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">
                        {activeProfile.city && activeProfile.state
                          ? `${activeProfile.city}, ${activeProfile.state}`
                          : activeProfile.city || activeProfile.state || '—'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Type</label>
                    <div className="flex items-center gap-3 text-dark dark:text-gray-200">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <span className={`font-bold px-3 py-1 rounded-full text-xs ${isWorker ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'}`}>
                        {activeProfile.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Joined</label>
                    <div className="flex items-center gap-3 text-dark dark:text-gray-200">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">
                        {activeProfile.created_at ? new Date(activeProfile.created_at).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Worker Professional Details */}
            {isWorker && (
              <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-dark dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 mb-6">Professional Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <h3 className="font-bold text-sm text-dark dark:text-white">Verification Status</h3>
                    </div>
                    <span className="text-green-700 bg-green-100 dark:bg-green-950/60 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold">Verified Professional</span>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-5 h-5 text-deepBlue dark:text-primary" />
                      <h3 className="font-bold text-sm text-dark dark:text-white">Cooperative</h3>
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Chittoor District Labour Cooperative Society</span>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5 text-orange-500" />
                      <h3 className="font-bold text-sm text-dark dark:text-white">Top Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Plumbing', 'Pipe Repair', 'Maintenance'].map(skill => (
                        <span key={skill} className="text-xs font-semibold bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2 py-1 rounded-md text-gray-600 dark:text-gray-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Quick Links */}
            {!isWorker && (
              <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-dark dark:text-white pb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link to="/customer-dashboard" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 hover:shadow-md transition-all text-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <span className="text-xs font-bold text-dark dark:text-white">My Bookings</span>
                  </Link>
                  <Link to="/workers" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 hover:shadow-md transition-all text-center">
                    <User className="w-6 h-6 text-amber-600" />
                    <span className="text-xs font-bold text-dark dark:text-white">Find Workers</span>
                  </Link>
                  <Link to="/notifications" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 hover:shadow-md transition-all text-center">
                    <Shield className="w-6 h-6 text-green-600" />
                    <span className="text-xs font-bold text-dark dark:text-white">Notifications</span>
                  </Link>
                  <Link to="/emergency" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 hover:shadow-md transition-all text-center">
                    <Phone className="w-6 h-6 text-red-600" />
                    <span className="text-xs font-bold text-dark dark:text-white">Emergency</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
