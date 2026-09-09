import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Briefcase,
  IndianRupee,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Bell,
  Check,
  HeartPulse,
  BookOpen
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function CooperativeLayout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      if (!profile?.id) return;
      try {
        const data = await api.getUnreadNotifications(profile.id);
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [profile]);

  const handleMarkAsRead = async () => {
    if (!profile?.id) return;
    try {
      await api.markNotificationsRead(profile.id);
      setNotifications([]);
      setShowNotifications(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Overview', path: '/cooperative/dashboard', icon: LayoutDashboard },
    { name: 'Workers', path: '/cooperative/workers', icon: Users },
    { name: 'Verification', path: '/cooperative/verification', icon: ShieldCheck },
    { name: 'Welfare & Protection', path: '/cooperative/welfare', icon: HeartPulse },
    { name: 'Training', path: '/cooperative/training', icon: BookOpen },
    { name: 'Bookings', path: '/cooperative/bookings', icon: Calendar },
    { name: 'Emergency Jobs', path: '/cooperative/emergency', icon: AlertTriangle },
    { name: 'Services', path: '/cooperative/services', icon: Briefcase },
    { name: 'Earnings', path: '/cooperative/earnings', icon: IndianRupee },
    { name: 'Reports', path: '/cooperative/reports', icon: BarChart3 },
    { name: 'Audit Log', path: '/cooperative/audit', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-dark overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-dark text-white hidden md:flex flex-col flex-shrink-0 relative z-20">
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            COOPSERVE
            <span className="text-[10px] bg-primary text-dark font-bold px-1.5 py-0.5 rounded-sm tracking-widest uppercase">Admin</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Control Center</div>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-dark shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-dark' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-800">
          <Link 
            to="/cooperative/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              location.pathname === '/cooperative/settings' ? 'bg-primary text-dark shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-5 h-5" /> Settings
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/" className="text-xl font-black tracking-tighter text-dark flex items-center gap-2">
              COOPSERVE
              <span className="text-[8px] bg-primary text-dark font-bold px-1 py-0.5 rounded-sm tracking-widest uppercase">Admin</span>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-col">
            <h2 className="font-bold text-dark text-lg">Cooperative Control Center</h2>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Verified Cooperative
            </div>
          </div>

          <div className="flex items-center gap-6 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-gray-400 hover:text-dark transition-colors"
            >
              <Bell className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[8px] font-bold text-white flex items-center justify-center">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute top-12 right-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="font-bold text-dark">Notifications</h3>
                  {notifications.length > 0 && (
                    <button onClick={handleMarkAsRead} className="text-xs font-bold text-primary hover:text-dark transition-colors flex items-center gap-1">
                      <Check className="w-3 h-3" /> Mark read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500 font-medium">
                      You have no unread notifications.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {notifications.map(n => (
                        <div key={n.id} className="p-4 hover:bg-gray-50 transition-colors cursor-default">
                          <p className="text-sm text-dark font-medium leading-snug">{n.message}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                            {new Date(n.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-dark leading-none">{profile?.full_name}</p>
                <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary text-dark flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                {profile?.full_name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>

      </main>
      
      {/* Mobile Bottom Nav (Simplified version of sidebar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around p-2 pb-safe">
        {[
          { name: 'Dash', path: '/cooperative/dashboard', icon: LayoutDashboard },
          { name: 'Workers', path: '/cooperative/workers', icon: Users },
          { name: 'Verify', path: '/cooperative/verification', icon: ShieldCheck },
          { name: 'Menu', path: '/cooperative/menu', icon: Settings } // A mobile menu expansion page could be added
        ].map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
