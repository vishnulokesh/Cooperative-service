import { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, Users, ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Cooperative } from '../types';

export default function Cooperatives() {
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getCooperatives();
        setCooperatives(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load cooperatives from database.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-lightBg min-h-screen pb-24">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 pt-12 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-deepBlue px-4 py-2 rounded-full font-bold text-sm mb-6">
            <ShieldCheck className="w-5 h-5" /> Trusted Network
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">Discover Local Cooperatives</h1>
          <p className="text-xl text-gray-500 max-w-2xl">CoopServe partners with registered worker cooperatives to ensure fair wages, verified skills, and community growth.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12">
        {loading ? (
          <div className="flex justify-center items-center py-24 bg-white rounded-3xl border border-gray-100 h-full">
            <Loader className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-red-100">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-500">{error}</p>
          </div>
        ) : cooperatives.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
            <ShieldCheck className="w-12 h-12 text-gray-300 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-dark mb-2">No cooperatives found</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cooperatives.map(coop => (
              <div key={coop.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group flex flex-col h-full">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-dark mb-2 flex items-center gap-2">
                      {coop.name}
                      <ShieldCheck className="text-deepBlue w-6 h-6" />
                    </h2>
                    <div className="flex items-center gap-4 text-sm font-semibold text-gray-500">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {coop.city}, {coop.state}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded-xl text-center border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Members</div>
                    <div className="text-xl font-bold text-dark flex items-center justify-center gap-1">
                      <Users className="w-5 h-5 text-primary" /> {coop.total_members}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-8 flex-grow">
                  A registered worker cooperative providing verified professional services while ensuring fair wages and welfare for all its members.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {/* Placeholder for services, you might want to fetch these from DB or pass from API */}
                    <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg border border-gray-100">Plumbing</span>
                    <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg border border-gray-100">Electrical</span>
                    <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg border border-gray-100">Cleaning</span>
                  </div>
                  <Link 
                    to={`/cooperatives/${coop.id}`} 
                    className="w-full sm:w-auto bg-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-deepBlue transition-colors flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    View Cooperative <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
