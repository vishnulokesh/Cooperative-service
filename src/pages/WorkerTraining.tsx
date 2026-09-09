import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

export default function WorkerTraining() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTraining() {
      if (!user) return;
      try {
        const { data: wData } = await supabase
          .from('workers')
          .select('id')
          .eq('profile_id', user.id)
          .single();

        if (wData) {
          const recs = await api.getTrainingRecommendations(wData.id);
          setRecommendations(recs);
        }
      } catch (err) {
        console.error("Failed to load training recommendations", err);
      } finally {
        setLoading(false);
      }
    }
    loadTraining();
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
          <BookOpen className="w-10 h-10 text-green-500" /> Skill Development
        </h1>
        <p className="text-gray-500 mt-3 font-medium text-lg">Recommended training based on cooperative demand.</p>
      </div>

      <div className="space-y-6">
        {recommendations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-dark mb-2">No active recommendations</h3>
            <p className="text-gray-500 font-medium">Your cooperative will notify you if specific skills are in high demand in your area.</p>
          </div>
        ) : (
          recommendations.map(rec => (
            <div key={rec.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-green-100 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-2xl font-black text-dark">{rec.title}</h3>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-md border border-green-200">
                    Recommended
                  </span>
                  {rec.demand_level === 'high' && (
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-md border border-orange-200 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> High Demand
                    </span>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mt-4 border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reason</h4>
                  <p className="text-sm font-bold text-gray-700">{rec.reason}</p>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-3">
                <button className="bg-dark hover:bg-deepBlue text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                  View Course <ArrowRight className="w-4 h-4" />
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-dark font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap text-sm">
                  Mark as Interested
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
