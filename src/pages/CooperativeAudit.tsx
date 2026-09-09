import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FileText, Clock, User } from 'lucide-react';

export default function CooperativeAudit() {
  const { profile } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuditLogs() {
      if (!profile?.cooperative_id) return;
      try {
        const data = await api.getCooperativeAuditLogs(profile.cooperative_id);
        setLogs(data);
      } catch (error) {
        console.error("Error loading audit logs:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAuditLogs();
  }, [profile]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 rounded-xl w-64"></div>
        <div className="h-96 bg-gray-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-dark">Audit Log</h1>
        <p className="text-gray-500 mt-1 font-medium text-lg">A permanent record of administrative actions.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
        
        <div className="space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 relative before:absolute before:left-6 before:top-14 before:bottom-[-24px] before:w-px before:bg-gray-200 last:before:hidden">
              
              <div className="w-4 h-4 mt-1 rounded-full bg-primary ring-4 ring-white flex-shrink-0 relative z-10"></div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="font-bold text-dark">
                    <span className="capitalize">{log.verification_type.replace('_', ' ')}</span> verification {log.new_status}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                    <Clock className="w-3 h-3" /> {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-sm">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] block mb-0.5">Worker</span>
                      <span className="font-bold text-dark">{log.worker?.profile?.full_name || 'Unknown Worker'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] block mb-0.5">Action Performed By</span>
                      <span className="font-bold text-dark flex items-center gap-1"><User className="w-3 h-3 text-primary" /> {log.admin?.full_name || 'System'}</span>
                    </div>
                  </div>
                  
                  {log.notes && (
                    <div className="pt-2 border-t border-gray-50 text-sm">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] block mb-0.5">Notes</span>
                      <span className="text-gray-700 italic">{log.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center py-12 text-gray-500 font-medium">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              No administrative actions have been recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
