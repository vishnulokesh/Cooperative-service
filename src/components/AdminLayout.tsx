import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  BarChart3,
  FileText,
  LogOut,
  Bell,
  Check,
  Shield,
  Home,
  MapPin,
  TrendingUp,
  Vote,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { mockNotifications } from '../services/mockData';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<any[]>(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setShowNotifications(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Command Center', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Skill Map (GIS)', path: '/admin/skill-map', icon: MapPin },
    { name: 'Demand Intelligence', path: '/admin/demand-intelligence', icon: TrendingUp },
    { name: 'Worker Verification', path: '/admin/verification', icon: ShieldCheck },
    { name: 'Coop Governance', path: '/admin/governance', icon: Vote },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Cooperatives', path: '/admin/cooperatives', icon: Building2 },
    { name: 'Bookings & Disputes', path: '/admin/bookings', icon: Calendar },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { name: 'Audit Log', path: '/admin/audit', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-dark overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col flex-shrink-0 relative z-20">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            DAILSMART
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-md tracking-wider uppercase">Admin</span>
          </Link>
          <Link to="/" title="Go to main website" className="text-slate-400 hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <div className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-4 px-2">Platform Administration</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-dark shadow-md font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-dark' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Role: Platform Admin</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
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
              DAILSMART
              <span className="text-[8px] bg-red-500 text-white font-bold px-1 py-0.5 rounded-sm tracking-widest uppercase">Admin</span>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-col">
            <h2 className="font-bold text-dark text-lg">Platform Command Center</h2>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational (Demo Mode)
            </div>
          </div>

          <div className="flex items-center gap-6 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-gray-400 hover:text-dark transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[8px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute top-14 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="font-bold text-dark text-sm">Platform Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAsRead} className="text-xs font-bold text-primary hover:text-dark transition-colors flex items-center gap-1">
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500 font-medium">
                      No notifications at this time.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-4 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-amber-50/40' : ''}`}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-dark">{n.title}</span>
                            <span className="text-[10px] text-gray-400 font-semibold">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-600 font-medium leading-snug mt-1">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-dark leading-none">{profile?.full_name || 'System Admin'}</p>
                <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">Super Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-dark text-primary flex items-center justify-center font-bold text-lg border-2 border-primary shadow-sm">
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
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark border-t border-gray-800 z-50 flex justify-around p-2 text-white">
        {[
          { name: 'Dash', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Users', path: '/admin/users', icon: Users },
          { name: 'Coops', path: '/admin/cooperatives', icon: Building2 },
          { name: 'Bookings', path: '/admin/bookings', icon: Calendar },
          { name: 'Reports', path: '/admin/reports', icon: BarChart3 }
        ].map((item) => {
          const isActive = location.pathname === item.path;
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
