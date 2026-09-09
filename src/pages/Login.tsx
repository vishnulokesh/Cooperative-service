import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Users, Mail, Lock, ArrowRight, AlertCircle, Briefcase, Sparkles, CheckCircle2, ShieldCheck, Phone } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const roleParam = searchParams.get('role');
  const redirectParam = searchParams.get('redirect');
  const [role, setRole] = useState<'customer' | 'worker'>(roleParam === 'worker' ? 'worker' : 'customer');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (roleParam === 'worker') {
      setRole('worker');
    } else {
      setRole('customer');
    }

    // Check if there is a preserved booking from booking flow or sessionStorage
    const stateBooking = (location.state as any)?.preservedBooking;
    if (stateBooking) {
      setPendingBooking(stateBooking);
    } else {
      try {
        const stored = sessionStorage.getItem('dailsmart_pending_booking');
        if (stored) setPendingBooking(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, [roleParam, location.state]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your email / mobile and password.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);

    let userRole: string = role;
    let storedFullName = role === 'worker' ? 'Surya Prakash' : 'Anitha Rao';
    let email = identifier.includes('@') ? identifier : `${identifier}@dailsmart.in`;

    try {
      const stored = localStorage.getItem('dailsmart_profile');
      if (stored) {
        const localProfile = JSON.parse(stored);
        if (localProfile.email?.toLowerCase() === email.toLowerCase()) {
          userRole = localProfile.role || role;
          storedFullName = localProfile.full_name || storedFullName;
        }
      }
    } catch { /* ignore */ }

    const sessionData = {
      email,
      role: userRole,
      loggedIn: true,
      full_name: storedFullName,
      id: userRole === 'worker' ? 'ww111111-1111-1111-1111-111111111111' : 'c1111111-1111-1111-1111-customer11111'
    };

    try {
      localStorage.setItem('dailsmart_session', JSON.stringify(sessionData));
      localStorage.setItem('dailsmart_profile', JSON.stringify({
        id: sessionData.id,
        email: sessionData.email,
        role: sessionData.role,
        full_name: sessionData.full_name,
        city: 'Chittoor',
        state: 'Andhra Pradesh'
      }));
      sessionStorage.setItem('dailsmart_logged_in', '1');
    } catch { /* ignore */ }

    setTimeout(() => {
      // If there's a preserved booking, restore immediately to booking flow
      if (pendingBooking && (redirectParam === 'booking' || role === 'customer')) {
        navigate('/booking', { state: pendingBooking });
        return;
      }

      if (userRole === 'worker') navigate('/worker-dashboard');
      else if (userRole === 'platform_admin' || userRole === 'admin' || userRole === 'cooperative_admin') navigate('/admin/dashboard');
      else navigate('/customer-dashboard');
    }, 400);
  };

  const handleQuickCustomerDemo = () => {
    setIdentifier('customer@dailsmart.in');
    setPassword('123456');
    setRole('customer');
  };

  const handleDemoWorkerLogin = (workerName: string) => {
    setLoading(true);
    const workerSession = {
      email: 'surya@coopserve.local',
      role: 'worker',
      loggedIn: true,
      full_name: workerName,
      id: 'ww111111-1111-1111-1111-111111111111'
    };
    try {
      localStorage.setItem('dailsmart_session', JSON.stringify(workerSession));
      localStorage.setItem('dailsmart_profile', JSON.stringify(workerSession));
    } catch { /* ignore */ }

    setTimeout(() => {
      navigate('/worker-dashboard', { state: { demoWorker: workerName } });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl flex items-center justify-center shadow-xl border border-blue-800">
            {role === 'worker' ? (
              <Briefcase className="text-amber-400 w-8 h-8" />
            ) : (
              <Users className="text-white w-8 h-8" />
            )}
          </div>
        </div>

        <h2 className="text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {role === 'worker' ? 'Worker Partner Portal' : 'DailSmart Solutions'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          {role === 'worker'
            ? 'Sign in to access your live duty status, job alerts & welfare wallet'
            : 'Sign in to confirm booking, manage active services & track verified workers'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-5 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-3xl sm:px-10 border border-slate-200 dark:border-slate-800">

          {/* Preserved Booking Context Banner */}
          {pendingBooking && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 text-xs font-black uppercase">
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Booking Details Preserved!
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                You are booking <strong>{pendingBooking.serviceName}</strong> with <strong>{pendingBooking.workerName}</strong>. Sign in below to confirm immediately.
              </p>
            </div>
          )}

          {/* Worker Context Highlight Banner */}
          {role === 'worker' && (
            <div className="mb-6 p-4 bg-indigo-950 text-white rounded-2xl flex items-start gap-3 border border-indigo-800 shadow-md">
              <div className="w-8 h-8 rounded-xl bg-indigo-900 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Briefcase className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">DailSmart Worker Partner Portal</p>
                <p className="text-[11px] text-blue-200 mt-0.5">
                  Accept job alerts, update live status (On The Way, Working, Completed), and view cooperative welfare wallet.
                </p>
              </div>
            </div>
          )}

          {/* Quick Demo 1-Click Access for SIH Testing */}
          <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
            <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">
              ⚡ 1-Click Quick Demo Login:
            </span>

            {role === 'worker' ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDemoWorkerLogin('Surya Prakash')}
                  className="w-full flex items-center justify-between p-2.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold text-slate-900 dark:text-amber-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Sign in as Surya Prakash (Plumber, Chittoor)
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoWorkerLogin('Rajesh Sharma')}
                  className="w-full flex items-center justify-between p-2.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold text-slate-900 dark:text-blue-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Sign in as Rajesh Sharma (Electrician, Tirupati)
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleQuickCustomerDemo}
                className="w-full flex items-center justify-between p-2.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold text-slate-900 dark:text-blue-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Fill Demo Credentials: customer@dailsmart.in
                </span>
                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-black">Fill</span>
              </button>
            )}
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 p-3 rounded-xl text-xs font-medium flex items-start gap-2.5 border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Email or Mobile Field */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {role === 'worker' ? 'Worker ID / Mobile / Email' : 'Email Address or Mobile'}
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  {identifier.includes('@') ? (
                    <Mail className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Phone className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white font-medium text-sm"
                  placeholder={role === 'worker' ? 'worker@dailsmart.in or 9848022334' : 'customer@dailsmart.in or 9876543210'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white font-medium text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-black focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 hover:scale-[1.02] ${
                role === 'worker'
                  ? 'bg-indigo-900 hover:bg-indigo-800 text-white focus:ring-indigo-500'
                  : 'bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-500'
              }`}
            >
              {loading
                ? 'Signing in...'
                : pendingBooking
                ? 'Sign In & Confirm Booking'
                : role === 'worker'
                ? 'Sign In to Partner Portal'
                : 'Sign In to DailSmart'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom Footer Links */}
          <div className="mt-6 text-center space-y-2">
            {role === 'worker' ? (
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Don't have a worker account? </span>
                <Link
                  to="/signup"
                  state={{ defaultRole: 'worker' }}
                  className="text-xs font-black text-indigo-700 dark:text-indigo-400 hover:underline"
                >
                  Create an account
                </Link>
              </div>
            ) : (
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Don't have an account? </span>
                <Link to="/signup" className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline">
                  Create an account
                </Link>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              {role === 'worker' ? (
                <Link
                  to="/login?role=customer"
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                >
                  Switch to Customer Login
                </Link>
              ) : (
                <Link
                  to="/login?role=worker"
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                >
                  Are you a skilled worker? Partner Login →
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
