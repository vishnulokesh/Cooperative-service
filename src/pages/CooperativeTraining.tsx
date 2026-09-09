import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function CooperativeTraining() {
  const { profile } = useAuth();
  const [trainingNeed, setTrainingNeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrainingNeeds() {
      if (!profile?.cooperative_id) return;
      try {
        // Since we don't have a direct API for aggregate training needs yet, we mock the calculation 
        // based on the instruction "Do not call this AI yet. This should use Step 7's skill-gap data."
        
        // Mocking the aggregate view for now based on the spec
        const mockData = [
          { id: 1, title: 'Advanced Electrical Safety', demand: 'High', availableWorkers: 4, recentRequests: 38, suggestedParticipants: 12 },
          { id: 2, title: 'Emergency Plumbing Response', demand: 'High', availableWorkers: 2, recentRequests: 24, suggestedParticipants: 8 },
          { id: 3, title: 'HVAC Maintenance Standard', demand: 'Medium', availableWorkers: 6, recentRequests: 15, suggestedParticipants: 5 },
        ];
        
        setTimeout(() => {
          setTrainingNeed(mockData);
          setLoading(false);
        }, 600);

      } catch (err) {
        console.error("Failed to load training data", err);
        setLoading(false);
      }
    }
    fetchTrainingNeeds();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-green-500" /> Cooperative Training
          </h1>
          <p className="text-gray-500 font-medium mt-1">Identify skill gaps and recommend training to your workforce.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-dark mb-6">High Priority Training Areas</h2>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:hidden before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          {trainingNeed.map(training => (
            <div key={training.id} className="relative flex items-center justify-between md:justify-normal group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-50 text-green-600 shadow-sm shrink-0 md:mr-6 z-10">
                <BookOpen className="w-4 h-4" />
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-green-300 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-dark text-lg">{training.title}</h3>
                    {training.demand === 'High' && (
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-red-200">
                        <AlertCircle className="w-3 h-3" /> High Demand
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Available Workers</span>
                      <span className="font-bold text-dark">{training.availableWorkers}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Recent Requests</span>
                      <span className="font-bold text-dark">{training.recentRequests}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Suggested Participants</span>
                      <span className="font-bold text-dark flex items-center gap-1">
                        <Users className="w-4 h-4 text-primary" /> {training.suggestedParticipants}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <button className="w-full lg:w-auto bg-dark hover:bg-deepBlue text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                    Recommend to Workers <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-center font-bold text-gray-400 mt-2">
                    * Do not automatically enroll workers.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
