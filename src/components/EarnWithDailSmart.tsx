import { ArrowRight, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const EarnWithDailSmart = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#1B3A6B] via-[#162D53] to-[#0F1E38] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: Image / Trust Visual */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-[#163264] shadow-2xl max-w-md mx-auto lg:mx-0 border border-blue-400/20">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
                alt="Earn with DailSmart Solutions"
                className="w-full h-80 object-cover"
              />
            </div>
            {/* Overlay pill */}
            <div className="absolute -bottom-4 right-4 sm:right-12 bg-white text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs font-black">Cooperative Protected</p>
                <p className="text-[10px] text-slate-500">₹5,00,000 Insurance Cover</p>
              </div>
            </div>
          </div>

          {/* Right: Text & CTA */}
          <div className="lg:pl-6">
            <div className="h-1.5 w-16 bg-[#FFC928] rounded-full mb-6" />

            <span className="text-xs font-black uppercase tracking-widest text-[#FFC928] block mb-2">
              Worker Partner Opportunity
            </span>

            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-5 leading-tight">
              Earn with DailSmart Solutions
            </h2>

            <p className="text-blue-100 text-base lg:text-lg font-normal mb-6 leading-relaxed max-w-lg">
              Become a verified DailSmart Service Partner. Work with dignity, earn fair wages with zero middleman commissions, and enjoy full cooperative welfare backing with health and accident security.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <HeartHandshake className="w-5 h-5 text-[#FFC928] mb-1" />
                <p className="text-xs font-bold">Welfare Wallet</p>
                <p className="text-[11px] text-blue-200">Social security savings</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <Award className="w-5 h-5 text-emerald-400 mb-1" />
                <p className="text-xs font-bold">Skill Passport</p>
                <p className="text-[11px] text-blue-200">Government recognized</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/login?role=worker"
                className="inline-flex items-center gap-2 bg-[#FFC928] hover:bg-[#e6b31e] text-slate-950 font-black px-8 py-4 rounded-2xl text-base transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Worker Partner Login <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/signup"
                state={{ defaultRole: 'worker' }}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-4 rounded-2xl text-sm transition-colors border border-white/20"
              >
                Register as Worker
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EarnWithDailSmart;
