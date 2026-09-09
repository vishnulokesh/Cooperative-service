import { useState } from 'react';
import { X, Moon, Sun, Globe, Bell, UserCheck, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [currentRole, setCurrentRole] = useState<'customer' | 'worker' | 'cooperative_admin'>(
    (profile?.role as any) || 'customer'
  );

  if (!isOpen) return null;

  const handleRoleChange = (newRole: 'customer' | 'worker' | 'cooperative_admin') => {
    setCurrentRole(newRole);
    // Update local demo profile
    try {
      const demoProfile = JSON.parse(localStorage.getItem('dailsmart_profile') || '{}');
      demoProfile.role = newRole;
      localStorage.setItem('dailsmart_profile', JSON.stringify(demoProfile));
    } catch { /* ignore */ }

    if (newRole === 'worker') {
      navigate('/worker-dashboard');
    } else if (newRole === 'customer') {
      navigate('/customer-dashboard');
    } else {
      navigate('/cooperative/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden text-gray-900 dark:text-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              ⚙️
            </div>
            <h2 className="text-lg font-black">{t('settings.title', 'Application Settings')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Theme / Dark Mode */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  {isDarkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold">{t('settings.dark_mode', 'Dark Mode')}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('settings.dark_mode_desc', 'Toggle dark theme for night usage')}
                  </p>
                </div>
              </div>

              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${
                  isDarkMode ? 'bg-primary justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 tracking-wider">
              <Globe className="w-4 h-4 text-primary" />
              <span>{t('settings.language', 'Language')}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as LanguageCode)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-dark dark:text-white font-bold ring-2 ring-primary/30'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{lang.native}</div>
                      <div className="text-[11px] text-gray-400">{lang.name}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-deepBlue dark:text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{t('settings.notifications', 'Notification Alerts')}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('settings.notifications_desc', 'Receive updates for bookings & jobs')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${
                  notifications ? 'bg-emerald-500 justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
              </button>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 tracking-wider">
              <UserCheck className="w-4 h-4 text-blue-500" />
              <span>{t('settings.role_mode', 'View Mode / Switch Role')}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRoleChange('customer')}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                  currentRole === 'customer'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-extrabold'
                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {t('settings.role_customer', 'Customer')}
              </button>

              <button
                onClick={() => handleRoleChange('worker')}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                  currentRole === 'worker'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-extrabold'
                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {t('settings.role_worker', 'Worker')}
              </button>

              <button
                onClick={() => handleRoleChange('cooperative_admin')}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                  currentRole === 'cooperative_admin'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-extrabold'
                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {t('settings.role_coop', 'Cooperative')}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-dark dark:bg-white text-white dark:text-dark font-black rounded-xl text-xs hover:opacity-90 transition-opacity"
          >
            {t('btn.save_settings', 'Save & Close')}
          </button>
        </div>
      </div>
    </div>
  );
}
