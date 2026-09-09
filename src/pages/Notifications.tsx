import { useState } from 'react';
import { mockNotifications } from '../services/mockData';
import { Bell, Check, Trash2, Calendar, CheckCircle2, Clock, Info } from 'lucide-react';
export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [toast, setToast] = useState<string | null>(null);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setToast('All notifications marked as read.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleClearAll = () => {
    setNotifications([]);
    setToast('Notifications cleared.');
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSingleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'worker_assigned':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'booking_completed':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Toast */}
        {toast && (
          <div className="fixed top-24 right-8 bg-dark text-white px-5 py-3 rounded-xl shadow-2xl border border-primary z-50 flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">{toast}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-dark tracking-tight flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" /> Notifications
            </h1>
            <p className="text-gray-500 text-sm mt-1">Stay updated with your service bookings, worker dispatches, and cooperative alerts.</p>
          </div>

          <div className="flex items-center gap-2">
            {notifications.some(n => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 bg-white border border-gray-200 text-dark font-bold text-xs rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4 text-emerald-600" /> Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-4 mb-6">
          {(['all', 'unread', 'read'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                filter === tab
                  ? 'bg-dark text-primary shadow-sm'
                  : 'text-gray-500 hover:text-dark hover:bg-gray-100'
              }`}
            >
              {tab === 'all' && `All (${notifications.length})`}
              {tab === 'unread' && `Unread (${notifications.filter(n => !n.read).length})`}
              {tab === 'read' && `Read (${notifications.filter(n => n.read).length})`}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm space-y-3">
              <Bell className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-bold text-dark text-base">No notifications to show</h3>
              <p className="text-gray-400 text-xs">You're all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map(n => (
              <div
                key={n.id}
                onClick={() => toggleSingleRead(n.id)}
                className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 hover:shadow-md ${
                  !n.read ? 'border-amber-300 bg-amber-50/20' : 'border-gray-100 opacity-90'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-gray-50 flex-shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-dark text-sm">{n.title}</h4>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">{n.message}</p>
                </div>

                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2"></span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
  );
}
