import { useState } from 'react';
import {
  ShieldCheck, CheckCircle2, FileQuestion, Users,
  MapPin, Award, Check, X, AlertTriangle, Eye
} from 'lucide-react';
import { workers, MockWorker } from '../services/mockData';

export default function VerificationQueuePage() {
  const [workerList, setWorkerList] = useState<MockWorker[]>(workers);
  const [selectedWorker, setSelectedWorker] = useState<MockWorker | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const pendingWorkers = workerList.filter(w => w.verification_status === 'pending');
  const verifiedWorkers = workerList.filter(w => w.verification_status === 'verified');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = (id: string, name: string) => {
    setWorkerList(prev => prev.map(w => w.id === id ? { ...w, verification_status: 'verified' } : w));
    if (selectedWorker?.id === id) {
      setSelectedWorker(prev => prev ? { ...prev, verification_status: 'verified' } : null);
    }
    showToast(`✓ Approved: ${name} is now verified and eligible for FairRoute service dispatch.`);
  };

  const handleReject = (id: string, name: string) => {
    setWorkerList(prev => prev.map(w => w.id === id ? { ...w, verification_status: 'rejected' } : w));
    if (selectedWorker?.id === id) {
      setSelectedWorker(prev => prev ? { ...prev, verification_status: 'rejected' } : null);
    }
    showToast(`Rejected: Application for ${name} marked rejected.`);
  };

  const handleRequestDocs = (name: string) => {
    showToast(`Requested additional ITI trade certificate & police clearance from ${name}.`);
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Trust & Compliance
            </span>
            <span className="text-xs text-slate-500 font-mono">Labour Cooperative Federation</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Worker Verification & Skill Passport Vetting
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review submitted government IDs, cooperative membership credentials, and trade certifications before activating dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 text-xs font-black rounded-xl border border-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {pendingWorkers.length} Pending Approvals
          </span>
        </div>
      </div>

      {/* Layout: Pending List + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Queue Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Pending Application Queue ({pendingWorkers.length})
          </h3>

          {pendingWorkers.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2 opacity-80" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Queue is completely cleared!</p>
              <p className="text-xs text-slate-400 mt-1">All registered cooperative workers are verified.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingWorkers.map((w) => (
                <div
                  key={w.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    selectedWorker?.id === w.id
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={w.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
                      alt={w.full_name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-base text-slate-900 dark:text-white">{w.full_name}</h4>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                          Pending Review
                        </span>
                      </div>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{w.professional_title}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" /> {w.city}, {w.state} • {w.cooperative_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedWorker(w)}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRequestDocs(w.full_name || 'Worker')}
                      className="px-3 py-2 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-xl transition-colors border border-amber-200 dark:border-amber-800 flex items-center gap-1"
                    >
                      <FileQuestion className="w-3.5 h-3.5" /> Request Docs
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReject(w.id, w.full_name || 'Worker')}
                      className="px-3 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl transition-colors border border-rose-200 dark:border-rose-800 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(w.id, w.full_name || 'Worker')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1 hover:scale-105"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Worker
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Already Verified Table Section */}
          <div className="pt-6">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-3">
              Active Verified Workers ({verifiedWorkers.length})
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="p-3.5">Worker Name</th>
                    <th className="p-3.5">Trade Role</th>
                    <th className="p-3.5">Cooperative</th>
                    <th className="p-3.5">Rating / Jobs</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {verifiedWorkers.slice(0, 6).map(w => (
                    <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <img src={w.avatar_url} className="w-7 h-7 rounded-lg object-cover" alt="" />
                        {w.full_name}
                      </td>
                      <td className="p-3.5 font-semibold text-indigo-600">{w.professional_title}</td>
                      <td className="p-3.5 text-slate-500">{w.cooperative_name}</td>
                      <td className="p-3.5 font-bold">★ {w.rating} ({w.completed_jobs})</td>
                      <td className="p-3.5">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                          Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detailed Verification Inspector Drawer */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Skill Passport Inspector
            </h3>
            <span className="text-[10px] font-bold text-slate-400">SIH Document Vault</span>
          </div>

          {selectedWorker ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <img
                  src={selectedWorker.avatar_url}
                  alt={selectedWorker.full_name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-white">{selectedWorker.full_name}</h4>
                  <p className="text-xs text-indigo-600 font-bold">{selectedWorker.professional_title}</p>
                  <p className="text-xs text-slate-500">{selectedWorker.phone}</p>
                </div>
              </div>

              {/* Document verification checklist */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Compliance Checks:
                </span>
                
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">Aadhaar Govt ID:</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-black">Verified (UIDAI)</span>
                </div>

                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">Police Clearance Vetting:</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-black">Clean Record</span>
                </div>

                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200">Cooperative Union Membership:</span>
                  <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-black">ID: COOP-AP-2026</span>
                </div>

                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200">Skill Trade Certification:</span>
                  <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-black">Level 3 Certified</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleApprove(selectedWorker.id, selectedWorker.full_name || 'Worker')}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition-all"
                >
                  Confirm & Activate
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              <ShieldCheck className="w-8 h-8 mx-auto text-slate-300 mb-2 opacity-50" />
              Select an applicant from the pending queue to inspect their verified credentials and certificates.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
