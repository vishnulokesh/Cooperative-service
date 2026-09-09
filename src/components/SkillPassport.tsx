import { useState } from 'react';
import { BadgeCheck, Star, ArrowRight, ShieldCheck, Award, Users } from 'lucide-react';

const SkillPassport = () => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const workers = [
    {
      id: 'w1',
      name: 'Ramesh Kumar',
      role: 'Master Plumber',
      avatar: 'https://ui-avatars.com/api/?name=Ramesh+Kumar&background=EBF5FF&color=174A7E&size=128',
      exp: '8 Years',
      rating: '4.8',
      jobs: '342',
      skills: ['Pipe Repair', 'Water Systems', 'Emergency Plumbing']
    },
    {
      id: 'w2',
      name: 'Lakshmi Devi',
      role: 'Professional Caregiver',
      avatar: 'https://ui-avatars.com/api/?name=Lakshmi+Devi&background=FCE7F3&color=BE185D&size=128',
      exp: '6 Years',
      rating: '4.9',
      jobs: '215',
      skills: ['Elder Care', 'Medication', 'Mobility Support']
    }
  ];

  return (
    <section className="bg-lightBg py-24 px-6 lg:px-8 border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">Meet the People Behind the Service</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Introducing the <span className="font-semibold text-deepBlue">CoopServe Skill Passport</span> — a verified digital professional identity ensuring trust, safety, and quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {workers.map((worker) => (
            <div key={worker.id} className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 relative overflow-hidden group">
              {/* Top Banner / Verification status */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-deepBlue" />
              
              <div className="flex items-start gap-5 mb-8">
                <img src={worker.avatar} alt={worker.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl text-dark mb-1 flex items-center gap-2">
                        {worker.name}
                        <BadgeCheck className="text-green-500 w-5 h-5" />
                      </h3>
                      <p className="text-deepBlue font-medium text-sm mb-3">{worker.role}</p>
                    </div>
                  </div>
                  
                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-600">
                    <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md">
                      <ShieldCheck className="w-3 h-3" /> Identity Verified
                    </span>
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                      <Award className="w-3 h-3" /> Skill Certified
                    </span>
                    <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md">
                      <Users className="w-3 h-3" /> Coop Member
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 bg-gray-50 rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-dark">{worker.exp}</div>
                  <div className="text-xs text-gray-500 font-medium">Experience</div>
                </div>
                <div className="text-center border-x border-gray-200">
                  <div className="text-lg font-bold text-dark flex items-center justify-center gap-1">
                    {worker.rating} <Star className="w-4 h-4 text-primary fill-primary" />
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-dark">{worker.jobs}</div>
                  <div className="text-xs text-gray-500 font-medium">Jobs Done</div>
                </div>
              </div>

              {/* Skills tags */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="relative">
                <button 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dark text-dark font-bold hover:bg-dark hover:text-white transition-colors group/btn"
                  onClick={() => setShowTooltip(worker.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  View Trust Profile <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {showTooltip === worker.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-dark text-white text-xs p-3 rounded-lg shadow-xl text-center z-10 transition-opacity">
                    Detailed worker profiles will be connected in the next stage.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-dark"></div>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillPassport;
