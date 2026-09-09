import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export default function VerificationQueue() {
  const { profile } = useAuth();
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQueue() {
      if (!profile?.cooperative_id) return;
      try {
        const data = await api.getVerificationQueue(profile.cooperative_id);
        setVerifications(data);
      } catch (err) {
        console.error("Error loading verification queue:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQueue();
  }, [profile]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 rounded-xl w-64"></div>
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl w-full"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-dark">Worker Verification</h1>
        <p className="text-gray-500 mt-1 font-medium text-lg">Review worker identity, skills and cooperative membership before they become fully verified.</p>
      </div>

      <div className="space-y-4">
        {verifications.map(v => (
          <div key={v.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold overflow-hidden border border-orange-100">
                {v.worker.profile.avatar_url ? (
                  <img src={v.worker.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserCheck className="w-8 h-8" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-black text-dark">{v.worker.profile.full_name}</h3>
                <p className="text-sm font-bold text-gray-500 mb-2">{v.worker.professional_title}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    v.verification_type === 'identity' ? 'bg-blue-50 text-blue-700' :
                    v.verification_type === 'skill' ? 'bg-purple-50 text-purple-700' :
                    'bg-green-50 text-green-700'
                  } capitalize`}>
                    {v.verification_type.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Pending Review
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Submitted: {new Date(v.created_at).toLocaleDateString()}
              </div>
              <Link 
                to={`/cooperative/verification/${v.id}`}
                className="flex items-center gap-2 bg-dark hover:bg-deepBlue text-white px-6 py-3 rounded-xl font-bold transition-colors w-full md:w-auto justify-center"
              >
                Review Application <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}

        {verifications.length === 0 && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">All caught up!</h3>
            <p className="text-gray-500 font-medium">There are no pending verifications in the queue right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
