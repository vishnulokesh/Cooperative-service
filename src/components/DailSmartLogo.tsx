import { Star } from 'lucide-react';

export function DailSmartLogo({ className = "h-10", showTagline = true }: { className?: string; showTagline?: boolean }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Circle Emblem Badge */}
      <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#A65D28] via-[#8A4A1C] to-[#5C2F0E] flex items-center justify-center shadow-md shrink-0 border-2 border-white/20">
        <div className="flex items-center justify-center font-black text-white italic text-lg tracking-tighter">
          <span className="text-white">d</span>
          <span className="text-amber-200 text-xl font-extrabold font-serif -ml-0.5">s</span>
        </div>
        <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300 absolute top-2 right-2 transform rotate-12" />
      </div>

      {/* Brand Text Block */}
      <div className="flex flex-col justify-center leading-none">
        <div className="text-xl sm:text-2xl font-black tracking-tight flex items-baseline gap-0.5">
          <span className="text-slate-900 dark:text-white">Dail</span>
          <span className="text-[#A65D28] dark:text-amber-400">Smart</span>
        </div>
        <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300 mt-0.5">
          SOLUTIONS PRIVATE LIMITED
        </div>
        {showTagline && (
          <div className="text-[8px] font-bold text-[#A65D28] dark:text-amber-400/90 tracking-wider mt-0.5 flex items-center gap-1">
            <span className="w-2 h-[1px] bg-[#A65D28]"></span>
            AUTOMATE | INNOVATE | ACCELERATE
            <span className="w-2 h-[1px] bg-[#A65D28]"></span>
          </div>
        )}
      </div>
    </div>
  );
}
