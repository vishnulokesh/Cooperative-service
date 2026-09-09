import { useState } from 'react';
import { mockAuditLog } from '../services/mockData';
import { Search, Shield, User, Clock, CheckCircle2, Download } from 'lucide-react';

export default function AdminAudit() {
  const [logs] = useState(mockAuditLog);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [toast, setToast] = useState<string | null>(null);

  const handleExportLogs = () => {
    setToast('Audit log exported to CSV! (Demo file generated)');
    setTimeout(() => setToast(null), 3000);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) ||
                          log.performed_by.toLowerCase().includes(search.toLowerCase()) ||
                          log.target.toLowerCase().includes(search.toLowerCase()) ||
                          log.details.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-24 right-8 bg-dark text-white px-5 py-3 rounded-xl shadow-2xl border border-primary z-50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-dark tracking-tight">Security & Governance Audit Log</h1>
          <p className="text-gray-500 text-sm mt-1">Immutable ledger of administrative actions, verifications, suspensions, and dispute resolutions.</p>
        </div>
        <button
          onClick={handleExportLogs}
          className="px-4 py-2 bg-dark text-white font-bold text-xs rounded-xl hover:bg-dark/90 transition-all flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4 text-primary" /> Export Audit Log
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 lg:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit records by actor, target or detail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-500">Action Type:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Actions</option>
            <option value="verified">Verifications</option>
            <option value="suspended">Suspensions</option>
            <option value="dispute">Disputes</option>
            <option value="emergency">Emergency Operations</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-4">Action</th>
                <th className="py-4 px-4">Performed By</th>
                <th className="py-4 px-4">Target Entity</th>
                <th className="py-4 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    No audit records matching your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-gray-100 text-dark font-extrabold text-xs rounded-lg border border-gray-200 flex items-center gap-1.5 w-fit">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-dark">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{log.performed_by}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-deepBlue bg-blue-50 px-2 py-0.5 rounded">
                        {log.target}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-600 font-medium">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
