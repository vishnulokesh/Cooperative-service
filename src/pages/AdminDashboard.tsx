import { 
  Users, 
  Calendar, 
  IndianRupee, 
  AlertTriangle, 
  ShieldCheck, 
  Activity,
  Heart,
  TrendingUp,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { adminStats, mockAuditLog } from '../services/mockData';
import AIInsights from '../components/AIInsights';
import { AIFairRoute } from '../components/AIFairRoute';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const statCards = [
    { title: 'Total Workers', value: adminStats.totalWorkers.toLocaleString('en-IN'), icon: Users, color: 'from-blue-600 to-indigo-600', link: '/admin/users' },
    { title: 'Verified Workers', value: adminStats.verifiedWorkers.toLocaleString('en-IN'), icon: ShieldCheck, color: 'from-emerald-500 to-teal-600', link: '/admin/verification' },
    { title: 'Active Jobs', value: adminStats.activeBookings.toLocaleString('en-IN'), icon: Activity, color: 'from-indigo-600 to-purple-600', link: '/admin/bookings' },
    { title: 'Completed Jobs', value: adminStats.totalBookings.toLocaleString('en-IN'), icon: Calendar, color: 'from-violet-500 to-purple-600', link: '/admin/bookings' },
    { title: 'Customers', value: adminStats.totalCustomers.toLocaleString('en-IN'), icon: Users, color: 'from-cyan-600 to-blue-700', link: '/admin/users' },
    { title: 'Platform Revenue', value: formatCurrency(adminStats.totalPayments), icon: IndianRupee, color: 'from-emerald-600 to-emerald-800', link: '/admin/reports' },
    { title: 'Worker Earnings (90%)', value: formatCurrency(adminStats.workerEarnings), icon: IndianRupee, color: 'from-amber-500 to-orange-600', link: '/admin/reports' },
    { title: 'Welfare Pool (5%)', value: formatCurrency(adminStats.welfarePool), icon: Heart, color: 'from-rose-500 to-pink-600', link: '/admin/governance' },
    { title: 'Pending Verification', value: adminStats.pendingVerifications, icon: AlertTriangle, color: 'from-amber-600 to-yellow-600', link: '/admin/verification' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Federation Command Center
            </span>
            <span className="text-xs text-slate-500 font-mono">DailSmart Operations Grid</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-dark tracking-tight">Cooperative Command Center</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time governance, demand forecasting & opportunity distribution for DailSmart Solutions.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            Cooperative Network Active
          </span>
          <Link to="/admin/demand-intelligence" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm">
            <TrendingUp className="w-4 h-4" /> Demand AI
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={idx} 
              to={stat.link}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">{stat.title}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl lg:text-3xl font-black text-dark tracking-tight">{stat.value}</span>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* AI FairRoute Dispatcher */}
      <AIFairRoute />

      {/* Embedded AI Insights Module */}
      <AIInsights />

      {/* Two Column Layout: Recent Audit Logs & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Audit Log Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-dark text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent System Activity
              </h3>
              <p className="text-xs text-gray-500 font-medium">Real-time audit log stream</p>
            </div>
            <Link to="/admin/audit" className="text-xs font-bold text-deepBlue hover:underline flex items-center gap-1">
              View All Logs <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4 divide-y divide-gray-50">
            {mockAuditLog.slice(0, 5).map((log) => (
              <div key={log.id} className="pt-4 first:pt-0 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-deepBlue flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-dark">{log.action}</span>
                    <span className="text-[10px] font-semibold text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{log.details}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 font-medium">
                    <span>By: <strong className="text-gray-700">{log.performed_by}</strong></span>
                    <span>•</span>
                    <span>Target: <strong className="text-gray-700">{log.target}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System & Cooperative Status Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-dark text-lg mb-1">Cooperative Federation Summary</h3>
            <p className="text-xs text-gray-500 font-medium mb-6">Regional federation operational metrics</p>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-gray-600">Verified Cooperatives</span>
                  <span className="text-emerald-600">32 / 38 (84%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-gray-600">Worker Verification Rate</span>
                  <span className="text-blue-600">96.2%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '96.2%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-gray-600">Fair Wage Compliance</span>
                  <span className="text-amber-600">100% Guaranteed</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-gray-600">Dispute Resolution Rate</span>
                  <span className="text-purple-600">97.5%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '97.5%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-dark font-medium">
            💡 <strong>Platform Status:</strong> All service dispatch channels in Andhra Pradesh & Telangana operating normally.
          </div>
        </div>

      </div>
    </div>
  );
}
