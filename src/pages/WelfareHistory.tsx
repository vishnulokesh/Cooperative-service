import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, IndianRupee, Calendar } from 'lucide-react';

export default function WelfareHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      try {
        const { data: wData } = await supabase
          .from('workers')
          .select('id')
          .eq('profile_id', user.id)
          .single();

        if (wData) {
          const contributions = await api.getWelfareContributions(wData.id);
          setHistory(contributions);
        }
      } catch (err) {
        console.error("Failed to load welfare history", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12 animate-fade-in space-y-8">
      
      <Link to="/welfare" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-dark transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Welfare
      </Link>

      <div>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-dark flex items-center gap-3">
          Welfare History
        </h1>
        <p className="text-gray-500 mt-3 font-medium text-lg">A record of your cooperative contributions and status updates.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
        
        {history.length === 0 ? (
          <div className="text-center py-12">
            <IndianRupee className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-dark mb-1">No History Found</h3>
            <p className="text-gray-500 font-medium text-sm">You do not have any recorded welfare contributions yet.</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {history.map((record) => (
              <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-primary">
                  <IndianRupee className="w-5 h-5" />
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-dark text-lg">₹{record.amount}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                      record.status === 'recorded' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {record.status}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-600 mb-2 capitalize">{record.contribution_type} Contribution</div>
                  <div className="text-xs text-gray-400 font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
