import { useState, useRef, useEffect } from 'react';
import {
  MoreVertical, X, Home as HomeIcon, Search, Users, Shield,
  User, LogOut, Settings, Bell, AlertTriangle, Globe, Briefcase, ShieldAlert,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { mockNotifications } from '../services/mockData';
import SettingsModal from './SettingsModal';
import { DailSmartLogo } from './DailSmartLogo';

const LANGUAGES: { code: LanguageCode; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'te', label: 'తెలుగు', short: 'TE' },
  { code: 'hi', label: 'हिन्दी', short: 'HI' },
  { code: 'ta', label: 'தமிழ்', short: 'TA' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { language, setLanguage, t } = useLanguage();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Read demo session from localStorage (set during demo login)
  const getDemoSession = () => {
    try {
      const s = localStorage.getItem('dailsmart_session');
      const p = localStorage.getItem('dailsmart_profile');
      if (s) return { session: JSON.parse(s), profile: p ? JSON.parse(p) : null };
    } catch { /* ignore */ }
    return null;
  };
  const demoData = getDemoSession();
  const activeSession = session || (demoData?.session?.loggedIn ? demoData.session : null);
  const activeProfile = profile || demoData?.profile;

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  // Notification bell is ONLY visible if user is logged in AND not on unauthenticated home page
  const isHomePage = location.pathname === '/' || location.pathname === '/login';
  const showNotifications = activeSession !== null && !isHomePage;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'D';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getDashboardPath = () => {
    if (!activeProfile) return '/customer-dashboard';
    if (activeProfile.role === 'worker') return '/worker-dashboard';
    if (activeProfile.role === 'cooperative_admin') return '/cooperative/dashboard';
    if (activeProfile.role === 'platform_admin') return '/admin/dashboard';
    return '/customer-dashboard';
  };

  const notifIcon = (type: string) => {
    if (type === 'booking_confirmed' || type === 'worker_assigned') return '📋';
    if (type === 'booking_completed') return '✅';
    if (type === 'payment_received') return '💰';
    if (type === 'new_job') return '🔔';
    return '📣';
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-[#FAFAFA] dark:bg-[#101828] border-b border-gray-200 dark:border-gray-800 shadow-sm py-3 transition-colors">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex justify-between items-center gap-4">

          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center group flex-shrink-0">
            <DailSmartLogo className="h-9" showTagline={false} />
          </Link>

          {/* CENTER: Primary Links */}
          <div className="hidden md:flex items-center justify-center gap-6 flex-1">
            <Link to="/" className="font-bold text-dark dark:text-gray-100 hover:text-blue-700 dark:hover:text-primary transition-colors text-sm">
              {t('nav.home', 'Home')}
            </Link>
            <Link to="/services" className="font-bold text-dark dark:text-gray-100 hover:text-blue-700 dark:hover:text-primary transition-colors text-sm">
              {t('nav.services', 'Services')}
            </Link>
            <Link to="/about" className="font-bold text-dark dark:text-gray-100 hover:text-blue-700 dark:hover:text-primary transition-colors text-sm">
              How It Works
            </Link>
            <a href="/#ai-assistant-showcase" className="font-bold text-dark dark:text-gray-100 hover:text-blue-700 dark:hover:text-primary transition-colors text-sm flex items-center gap-1">
              <span className="text-amber-500">✨</span> AI Assistant
            </a>
            <Link to="/about" className="font-bold text-dark dark:text-gray-100 hover:text-blue-700 dark:hover:text-primary transition-colors text-sm">
              About
            </Link>
          </div>

          {/* RIGHT: Auth & Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Emergency Button */}
            <button
              id="emergency-nav-btn"
              onClick={() => navigate('/emergency')}
              className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {t('nav.emergency', 'Emergency')}
            </button>

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                id="lang-switcher-btn"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs font-bold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                title="Switch Language"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span>{LANGUAGES.find(l => l.code === language)?.short}</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-1.5 z-50 animate-fadeIn">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        language === lang.code ? 'font-black text-deepBlue dark:text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-xs text-gray-400 font-mono">{lang.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell — Only shown when logged in */}
            {showNotifications && (
              <div className="relative" ref={notifRef}>
                <button
                  id="notification-bell-btn"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title={t('nav.notifications', 'Notifications')}
                >
                  <Bell className="w-5 h-5 text-dark dark:text-gray-200" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                      <p className="font-bold text-dark dark:text-white text-sm">{t('nav.notifications', 'Notifications')}</p>
                      <Link
                        to="/notifications"
                        onClick={() => setIsNotifOpen(false)}
                        className="text-xs font-bold text-deepBlue dark:text-primary hover:underline"
                      >
                        View All
                      </Link>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {mockNotifications.slice(0, 4).map(notif => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 ${!notif.read ? 'bg-blue-50/40 dark:bg-blue-950/30' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-lg flex-shrink-0 mt-0.5">{notifIcon(notif.type)}</span>
                            <div>
                              <p className={`text-xs font-bold text-dark dark:text-gray-100 ${!notif.read ? 'text-deepBlue dark:text-primary' : ''}`}>{notif.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{notif.message}</p>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1 ml-auto" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth: Profile or Login */}
            {activeSession ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-9 h-9 rounded-full bg-indigo-900 text-white border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-primary transition-all focus:outline-none"
                  title="Open Profile Menu"
                >
                  {activeProfile?.avatar_url ? (
                    <img src={activeProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-xs">{getInitials(activeProfile?.full_name)}</span>
                  )}
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-2">
                      <p className="font-bold text-sm text-dark dark:text-white truncate">{activeProfile?.full_name || activeSession?.email?.split('@')[0] || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{activeProfile?.role?.replace('_', ' ') || activeSession?.role?.replace('_', ' ') || 'Customer'}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-deepBlue dark:hover:text-primary transition-colors"
                    >
                      <User className="w-4 h-4 text-primary" /> {t('nav.profile', 'My Profile')}
                    </Link>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-deepBlue dark:hover:text-primary transition-colors"
                    >
                      <HomeIcon className="w-4 h-4 text-blue-500" /> {t('nav.dashboard', 'Dashboard')}
                    </Link>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-deepBlue dark:hover:text-primary transition-colors"
                    >
                      <Settings className="w-4 h-4 text-purple-500" /> {t('nav.settings', 'Settings')}
                    </button>

                    <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
                      <button
                        onClick={() => {
                          signOut();
                          localStorage.removeItem('dailsmart_session');
                          localStorage.removeItem('dailsmart_profile');
                          sessionStorage.removeItem('dailsmart_logged_in');
                          setIsProfileMenuOpen(false);
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> {t('nav.logout', 'Log Out')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2.5">
                <Link
                  to="/login?role=worker"
                  className="text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 px-3 py-2 rounded-xl transition-colors border border-indigo-200 dark:border-indigo-800"
                >
                  Worker Login
                </Link>
                <Link
                  to="/login?role=customer"
                  className="text-xs font-black bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                >
                  Customer Login
                </Link>
              </div>
            )}

            {/* Slide menu trigger */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              title="More Options"
            >
              <MoreVertical className="w-5 h-5 text-dark dark:text-gray-200" />
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-out Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 animate-fadeIn"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-out Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto border-l border-transparent dark:border-gray-800`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Dailsmart Menu
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="w-6 h-6 text-dark dark:text-gray-200" />
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Dedicated Role Login Options in Menu (Top Right) */}
            <div className="bg-slate-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-slate-200 dark:border-gray-700 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Portal Logins</h3>
              
              <Link 
                to="/login?role=worker" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 bg-indigo-900 text-white hover:bg-indigo-800 rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  Worker Partner Login
                </span>
                <span className="text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-black">Pro</span>
              </Link>

              <Link 
                to="/admin/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold shadow-sm transition-all border border-slate-700"
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-blue-400" />
                  Admin Governance Portal
                </span>
                <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded font-bold">Admin</span>
              </Link>
            </div>

            {/* Nav Links */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Navigation</h3>
              <ul className="space-y-3">
                <li><Link to="/home" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-dark dark:text-gray-100 hover:text-deepBlue dark:hover:text-primary font-medium"><HomeIcon className="w-5 h-5 text-gray-400" /> Home</Link></li>
                <li><Link to="/services" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-dark dark:text-gray-100 hover:text-deepBlue dark:hover:text-primary font-medium"><Search className="w-5 h-5 text-gray-400" /> Services</Link></li>
                <li><Link to="/workers" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-dark dark:text-gray-100 hover:text-deepBlue dark:hover:text-primary font-medium"><Users className="w-5 h-5 text-gray-400" /> Workers Directory</Link></li>
                <li><Link to="/cooperatives" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-dark dark:text-gray-100 hover:text-deepBlue dark:hover:text-primary font-medium"><Shield className="w-5 h-5 text-gray-400" /> Cooperatives</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Emergency & Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/emergency" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-red-600 hover:text-red-700 font-bold">
                    <AlertTriangle className="w-5 h-5" /> Emergency Help (24/7)
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Navbar;
