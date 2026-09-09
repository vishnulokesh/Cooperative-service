import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';
import { ShieldCheck, XCircle, FileText, UserCheck, ArrowLeft, Loader2 } from 'lucide-react';

export default function VerificationDetail() {
  const { workerId: verificationId } = useParams<{ workerId: string }>(); // Route actually uses workerId for param name, let's treat it as verificationId
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDetails() {
      if (!profile?.cooperative_id || !verificationId) return;
      try {
        const { data, error } = await supabase
          .from('worker_verifications')
          .select(`
            *,
            worker:workers!inner(
              *,
              profile:profiles(full_name, avatar_url, phone, email)
            )
          `)
          .eq('id', verificationId)
          .eq('worker.cooperative_id', profile.cooperative_id)
          .single();
          
        if (error) throw error;
        setVerification(data);
      } catch (err) {
        console.error("Failed to load verification", err);
        setError("Failed to load verification details or you don't have permission.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [verificationId, profile]);

  const handleProcess = async (status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !rejectReason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }
    
    setProcessing(true);
    setError('');
    
    try {
      await api.processVerification(
        verification.id, 
        verification.worker.id, 
        profile!.cooperative_id!, 
        profile!.id, 
        status, 
        status === 'rejected' ? rejectReason : 'Approved by cooperative admin.'
      );
      
      navigate('/cooperative/verification');
    } catch (err: any) {
      setError(err.message || "Failed to process verification.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !verification) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl">
        {error || "Verification not found."}
        <br />
        <button onClick={() => navigate('/cooperative/verification')} className="mt-4 text-dark font-bold underline">Go Back</button>
      </div>
    );
  }

  const w = verification.worker;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      <button 
        onClick={() => navigate('/cooperative/verification')}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-dark transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Queue
      </button>

      <div>
        <h1 className="text-3xl font-black tracking-tight text-dark">Worker Verification Review</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gray-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-gray-400">
              {w.profile.avatar_url ? (
                <img src={w.profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserCheck className="w-8 h-8" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black text-dark">{w.profile.full_name}</h2>
              <p className="font-bold text-gray-500">{w.professional_title}</p>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-xl text-sm font-bold capitalize">
            {verification.verification_type.replace('_', ' ')} Verification
          </div>
        </div>

        {/* Details */}
        <div className="p-8 space-y-8">
          
          <div>
            <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" /> Submitted Information
            </h3>
            
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</div>
                  <div className="font-bold text-dark capitalize">{verification.status}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Submitted On</div>
                  <div className="font-bold text-dark">{new Date(verification.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              
              {verification.verification_type === 'identity' && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Information</div>
                  <div className="font-bold text-dark">{w.profile.phone}</div>
                  <div className="font-bold text-dark">{w.profile.email}</div>
                </div>
              )}

              {verification.verification_type === 'skill' && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Skills Listed</div>
                  <div className="font-bold text-dark">{w.professional_title} with {w.experience_years} years experience.</div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-100">
            {showRejectForm ? (
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-4 animate-fade-in">
                <h3 className="font-bold text-red-800">Reason for Rejection</h3>
                <p className="text-sm text-red-600">Explain why this verification was rejected. This will be saved in the audit log.</p>
                <textarea
                  rows={3}
                  className="w-full p-3 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 bg-white text-sm"
                  placeholder="e.g. Identity document is blurry..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                ></textarea>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleProcess('rejected')}
                    disabled={processing}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                  >
                    {processing ? 'Processing...' : 'Confirm Rejection'}
                  </button>
                  <button 
                    onClick={() => { setShowRejectForm(false); setError(''); }}
                    disabled={processing}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-xl font-bold border border-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => handleProcess('approved')}
                  disabled={processing}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <ShieldCheck className="w-5 h-5" /> {processing ? 'Processing...' : 'Approve Application'}
                </button>
                <button 
                  onClick={() => setShowRejectForm(true)}
                  disabled={processing}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5" /> Reject
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
