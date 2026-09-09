import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Users, ArrowRight, BadgeCheck, Star, Award, Loader } from 'lucide-react';
import { api } from '../services/api';
import { Cooperative } from '../types';

export default function CooperativeProfile() {
  const { id } = useParams();
  
  const [cooperative, setCooperative] = useState<Cooperative | null>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const [coopData, workersData] = await Promise.all([
          api.getCooperativeById(id),
          api.getWorkersByCooperativeId(id)
        ]);
        setCooperative(coopData);
        setWorkers(workersData);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load cooperative profile.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading cooperative profile...</p>
      </div>
    );
  }

  if (error || !cooperative) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-dark mb-4">{error || 'Cooperative not found'}</h2>
        <Link to="/cooperatives" className="text-primary font-bold hover:underline">Return to Cooperatives Directory</Link>
      </div>
    );
  }

  return (
    <div className="bg-lightBg min-h-screen pb-24">
      {/* Header */}
      <section className="bg-dark text-white pt-16 pb-32 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-deepBlue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/cooperatives" className="text-gray-400 hover:text-white text-sm font-semibold flex items-center gap-2 mb-8 transition-colors">
            ← Back to all cooperatives
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-bold mb-4 border border-green-500/20">
                <ShieldCheck className="w-4 h-4" /> Verified Cooperative
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{cooperative.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-300 font-medium">
                <span className="flex items-center gap-1.5"><MapPin className="w-5 h-5 text-gray-400" /> {cooperative.city}, {cooperative.state}</span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1.5"><Award className="w-5 h-5 text-gray-400" /> Reg: {cooperative.registration_number}</span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 text-center min-w-[140px]">
              <div className="text-3xl font-bold text-primary mb-1">{cooperative.total_members}</div>
              <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">Active Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 -mt-16 relative z-20">
        
        {/* About Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-dark mb-4">About the Cooperative</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            This registered cooperative is committed to providing high-quality services while ensuring fair wages, social security, and democratic control for its worker-owners. All members are verified and adhere to strict professional standards.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <BadgeCheck className="text-deepBlue w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-dark text-sm mb-1">Skill Verification</h4>
                <p className="text-xs text-gray-500">Internal peer assessment.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <Users className="text-green-600 w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-dark text-sm mb-1">Democratic Control</h4>
                <p className="text-xs text-gray-500">One member, one vote.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
                <Star className="text-yellow-600 w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-dark text-sm mb-1">Quality Assurance</h4>
                <p className="text-xs text-gray-500">Continuous skill upgrades.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Member Directory */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-dark">Member Directory</h2>
          </div>

          <div className="space-y-6">
            {workers.length === 0 ? (
              <div className="p-12 text-center bg-gray-50 rounded-3xl border border-gray-100">
                <Users className="w-12 h-12 text-gray-300 mb-4 mx-auto" />
                <p className="text-gray-500 font-medium text-lg mb-2">No active members found.</p>
                <p className="text-gray-400 text-sm">Members will appear here once they complete verification.</p>
              </div>
            ) : (
              workers.map((worker: any) => (
                <div key={worker.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                  <img src={worker.avatar} alt={worker.name} className="w-24 h-24 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-xl text-dark flex items-center gap-2">
                          {worker.name}
                          {worker.isVerified && <BadgeCheck className="text-green-500 w-5 h-5" />}
                        </h3>
                        <p className="text-deepBlue font-medium text-sm">{worker.role}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-sm font-bold">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {worker.rating}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5 mt-4">
                      {worker.skills.slice(0, 4).map((skill: string) => (
                        <span key={skill} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-sm font-semibold text-gray-500">
                        {worker.experienceYears} Years Exp • {worker.jobsCompleted} Jobs Done
                      </div>
                      <Link to={`/workers/${worker.id}`} className="bg-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-deepBlue transition-colors flex items-center gap-2">
                        View Profile <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
