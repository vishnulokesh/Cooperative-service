import { Search, Briefcase, Building2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ctas = [
  {
    id: 'find-worker',
    icon: Search,
    label: 'Find a Worker',
    desc: 'Browse verified cooperative workers near you.',
    path: '/find-worker',
    bg: 'bg-[#182235]',
    text: 'text-white',
    iconBg: 'bg-white/10',
    hover: 'hover:bg-[#1e2d48]',
  },
  {
    id: 'become-worker',
    icon: Briefcase,
    label: 'Become a Worker',
    desc: 'Register your skills and start earning through a cooperative.',
    path: '/signup',
    state: { defaultRole: 'worker' },
    bg: 'bg-[#FFC928]',
    text: 'text-dark',
    iconBg: 'bg-dark/10',
    hover: 'hover:bg-[#e6b800]',
  },
  {
    id: 'register-cooperative',
    icon: Building2,
    label: 'Register Cooperative',
    desc: 'Bring your cooperative workers to the DailSmart platform.',
    path: '/signup',
    state: { defaultRole: 'cooperative_manager' },
    bg: 'bg-[#174A7E]',
    text: 'text-white',
    iconBg: 'bg-white/10',
    hover: 'hover:bg-[#1a5491]',
  },
  {
    id: 'emergency',
    icon: AlertTriangle,
    label: 'Emergency Help',
    desc: 'Get a verified worker to your doorstep immediately.',
    path: '/emergency',
    bg: 'bg-red-600',
    text: 'text-white',
    iconBg: 'bg-white/15',
    hover: 'hover:bg-red-700',
  },
];

const HomeCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#F6F8FC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-3">Get Started Today</h2>
          <p className="text-gray-500">Choose how you want to be part of the DailSmart cooperative community.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ctas.map((cta) => {
            const Icon = cta.icon;
            return (
              <button
                key={cta.id}
                id={`cta-${cta.id}`}
                onClick={() => navigate(cta.path, { state: cta.state })}
                className={`${cta.bg} ${cta.text} ${cta.hover} rounded-2xl p-7 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
              >
                <div className={`w-12 h-12 ${cta.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{cta.label}</h3>
                <p className={`text-sm ${cta.text === 'text-white' ? 'text-white/70' : 'text-dark/60'} leading-relaxed`}>
                  {cta.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
