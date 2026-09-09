import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader, AlertTriangle } from 'lucide-react';

function getDemoSession() {
  try {
    const stored = localStorage.getItem('dailsmart_session');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.loggedIn) return parsed;
    }
  } catch { /* ignore */ }
  return null;
}

function getDemoProfile() {
  try {
    const storedP = localStorage.getItem('dailsmart_profile');
    if (storedP) return JSON.parse(storedP);
  } catch { /* ignore */ }
  return null;
}

export default function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { session, profile, loading } = useAuth();
  const demoSession = getDemoSession();
  const demoProfile = getDemoProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightBg dark:bg-gray-950">
        <Loader className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Allow access if authenticated via Supabase OR demo session
  const isAuthenticated = !!session || !!demoSession;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Effective role from Supabase profile, local demo profile, or demo session
  const effectiveRole = profile?.role || demoProfile?.role || demoSession?.role || 'customer';

  // Role check — if allowedRoles is specified and current role is not included, check if demo mode allows role switching
  if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
    // If in demo mode, allow flexible role switching for seamless testing
    const isDemoMode = !session && !!demoSession;
    if (isDemoMode) {
      // Auto-update demo profile role to match requested route role to prevent blocking
      const targetRole = allowedRoles[0];
      if (targetRole && targetRole !== 'platform_admin') {
        try {
          const updatedProfile = { ...(demoProfile || {}), role: targetRole };
          localStorage.setItem('dailsmart_profile', JSON.stringify(updatedProfile));
        } catch { /* ignore */ }
        return <Outlet />;
      }
    }

    return (
      <div className="min-h-screen bg-lightBg dark:bg-gray-950 flex flex-col items-center justify-center py-24 px-6 text-center transition-colors">
        <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100 dark:border-gray-800 flex flex-col items-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-950/60 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-dark dark:text-white mb-4">Access Restricted</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">You are currently logged in with a different role.</p>
          <Link
            to={effectiveRole === 'worker' ? '/worker-dashboard' : effectiveRole === 'customer' ? '/customer-dashboard' : '/'}
            className="bg-dark dark:bg-white text-white dark:text-dark font-black py-4 px-8 rounded-2xl transition-colors w-full text-sm"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
