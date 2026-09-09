import { User, Bot, CheckCircle2, Building2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const HeroVisual = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto p-2">
      {/* Background ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-amber-400/15 via-indigo-600/15 to-emerald-500/15 rounded-3xl blur-3xl -z-10" />

      {/* Main Container */}
      <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-5">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Cooperative Service Ecosystem
            </span>
          </div>
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
            FairRoute™ Live
          </span>
        </div>

        {/* 4-Step Flow Architecture: Customer → AI → Verified Worker → Cooperative */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* 1. Customer */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-slate-800/80 dark:to-slate-800/40 p-4 rounded-2xl border border-blue-100 dark:border-slate-700 relative group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <User className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-blue-700 dark:text-blue-400 tracking-wider">Step 1</span>
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Customer Request</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Multilingual voice or text search for local home & community needs.
            </p>
          </div>

          {/* 2. DailSmart AI */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/70 dark:from-slate-800/80 dark:to-slate-800/40 p-4 rounded-2xl border border-purple-100 dark:border-slate-700 relative group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-purple-700 dark:text-purple-400 tracking-wider">Step 2</span>
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
              DailSmart AI <Sparkles className="w-3 h-3 text-amber-500" />
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Intent classification, emergency detection & 12-factor FairRoute matching.
            </p>
          </div>

          {/* 3. Verified Worker */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-slate-800/80 dark:to-slate-800/40 p-4 rounded-2xl border border-amber-100 dark:border-slate-700 relative group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400 tracking-wider">Step 3</span>
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
              Verified Worker <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Certified trade skill, digital Skill Passport & verified background.
            </p>
          </div>

          {/* 4. Cooperative */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-slate-800/80 dark:to-slate-800/40 p-4 rounded-2xl border border-emerald-100 dark:border-slate-700 relative group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">Step 4</span>
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Labour Cooperative</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Welfare wallet, fair rotation, social security & collective ownership.
            </p>
          </div>

        </div>

        {/* Live System Trust Strip */}
        <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-base">🤝</span>
            <div className="text-[11px]">
              <span className="font-bold text-white">Tri-Party Value Guarantee: </span>
              <span className="text-blue-200">Customer + Worker + Cooperative</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-400 flex-shrink-0" />
        </div>

      </div>
    </div>
  );
};

export default HeroVisual;
