import { Bot, Search, ShieldCheck, CheckCircle2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroVisual from './HeroVisual';
import { DailSmartLogo } from './DailSmartLogo';

export default function Hero({ onTalkToAI }: { onTalkToAI?: () => void }) {
  const navigate = useNavigate();

  const handleFindService = () => {
    navigate('/find-worker');
  };

  const handleTalkToAI = () => {
    if (onTalkToAI) {
      onTalkToAI();
    } else {
      // Trigger the floating AI Assistant button
      const aiBtn = document.getElementById('ai-assistant-toggle-btn') || document.querySelector('[title="AI Voice Assistant"]');
      if (aiBtn) {
        (aiBtn as HTMLElement).click();
      } else {
        navigate('/find-worker');
      }
    }
  };

  return (
    <section id="hero-section" className="pt-24 pb-10 lg:pt-32 lg:pb-16 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        
        {/* Left Content */}
        <div className="relative z-10 max-w-xl space-y-6">
          
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <DailSmartLogo className="h-8" showTagline={false} />
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Smart India Hackathon 2026
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-slate-900 dark:text-white tracking-tight">
            Local Skills. <br />
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
              Smarter Connections.
            </span> <br />
            Stronger Cooperatives.
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 dark:text-slate-300 font-medium text-base sm:text-lg leading-relaxed">
            Find verified local professionals, book trusted services, and help create a stronger cooperative workforce.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
            <button
              id="find-service-hero-btn"
              onClick={handleFindService}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-black text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 border border-blue-600/30 hover:scale-105"
            >
              <Search className="w-5 h-5" />
              Find a Service
            </button>

            <button
              id="talk-to-ai-hero-btn"
              onClick={handleTalkToAI}
              className="w-full sm:w-auto px-7 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-amber-300 hover:scale-105"
            >
              <Bot className="w-5 h-5 text-slate-950" />
              Talk to DailSmart AI
            </button>
          </div>

          {/* Micro Trust Indicators */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Police & Skill Verified
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Zero Surge Pricing
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              4.9★ Average Rating
            </span>
          </div>

        </div>

        {/* Right Content - Hero Visual Flowchart */}
        <div className="relative">
          <HeroVisual />
        </div>

      </div>
    </section>
  );
}
