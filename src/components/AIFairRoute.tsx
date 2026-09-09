import { useState, useEffect } from "react";
import { Sparkles, Cpu, CheckCircle2, MapPin, Star, ArrowRight, RefreshCw, Bot } from "lucide-react";
import { geminiService } from "../services/geminiService";

interface WorkerMatch {
  id: string;
  name: string;
  avatar: string;
  skillMatch: number;
  distanceKm: number;
  availability: "Available" | "Busy" | "En Route";
  rating: number;
  jobsCompleted: number;
  fairnessScore: number;
  workloadBalance: string;
  opportunityBalance: string;
  reasons: string[];
}

const MOCK_FAIRROUTE_MATCHES: WorkerMatch[] = [
  {
    id: "w1",
    name: "Ravi Kumar",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150",
    skillMatch: 95,
    distanceKm: 1.2,
    availability: "Available",
    rating: 4.9,
    jobsCompleted: 128,
    fairnessScore: 88,
    workloadBalance: "Optimal (2 jobs today)",
    opportunityBalance: "High Priority Allocation",
    reasons: [
      "Exact match for Level 4 Pipe Burst Certification",
      "Closest available worker (1.2 km away)",
      "High fairness rotation score for balanced earnings"
    ]
  },
  {
    id: "w2",
    name: "Suresh Patil",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    skillMatch: 88,
    distanceKm: 2.5,
    availability: "Available",
    rating: 4.8,
    jobsCompleted: 94,
    fairnessScore: 82,
    workloadBalance: "Light (1 job today)",
    opportunityBalance: "Fair Allocation",
    reasons: [
      "Certified Plumber with 5+ yrs experience",
      "Available immediately within 3 km radius",
      "Good rating history"
    ]
  },
  {
    id: "w3",
    name: "Vikram Singh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    skillMatch: 80,
    distanceKm: 4.1,
    availability: "En Route",
    rating: 4.7,
    jobsCompleted: 110,
    fairnessScore: 75,
    workloadBalance: "Busy (3 jobs today)",
    opportunityBalance: "Standard Allocation",
    reasons: [
      "General Plumbing Specialist",
      "Finishing job nearby in 15 mins",
      "Consistent 4.7+ customer rating"
    ]
  }
];

export function AIFairRoute({ 
  customerRequest = "Emergency Pipe Burst & Leak Repair", 
  location = "Worli Naka, Mumbai Central", 
  requiredSkill = "Plumbing (Level 4 Master)",
  onAssignWorker
}: {
  customerRequest?: string;
  location?: string;
  requiredSkill?: string;
  onAssignWorker?: (workerId: string) => void;
}) {
  const [selectedWorker, setSelectedWorker] = useState<string>("w1");
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedWorker, setDispatchedWorker] = useState<string | null>(null);

  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchAiAdvice();
  }, [customerRequest, location]);

  const fetchAiAdvice = async () => {
    setAiLoading(true);
    try {
      const advice = await geminiService.getFairRouteAdvice(customerRequest, location);
      setAiAdvice(advice);
    } catch {
      setAiAdvice("Recommended Ravi Kumar (95% skill match, 1.2km away) for optimal speed and earnings equity.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleDispatch = (workerId: string) => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchedWorker(workerId);
      if (onAssignWorker) onAssignWorker(workerId);
    }, 1000);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 relative overflow-hidden space-y-6">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-400 p-1.5 rounded-lg border border-blue-500/30">
              <Cpu className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              AI FairRoute Dispatcher
            </h2>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-mono border border-emerald-500/30">
              Google Gemini Powered
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Ethical AI matching powered by Google Gemini based on skill fit, proximity, availability, and earnings fairness.
          </p>
        </div>

        {/* Customer Request Summary Pill */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 text-xs space-y-0.5">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Active Booking Context</div>
          <div className="font-bold text-slate-200">{customerRequest}</div>
          <div className="text-blue-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400" /> {location} • <span className="text-amber-300">{requiredSkill}</span>
          </div>
        </div>
      </div>

      {/* Live Gemini AI Analysis Banner */}
      <div className="bg-gradient-to-r from-indigo-950 to-purple-950 p-4 rounded-2xl border border-indigo-500/30 flex items-start gap-3 relative z-10">
        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30 shrink-0">
          <Bot className="w-5 h-5 animate-bounce" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-bold text-indigo-200 flex items-center gap-2">
            Gemini AI Live Recommendation Engine
            {aiLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />}
          </div>
          <p className="text-slate-300 leading-relaxed font-medium">
            {aiLoading ? "Consulting Gemini AI endpoint for real-time optimal routing..." : aiAdvice}
          </p>
        </div>
      </div>

      {/* Recommended Worker Cards */}
      <div className="space-y-4 relative z-10">
        {MOCK_FAIRROUTE_MATCHES.map((worker, idx) => {
          const isTopMatch = idx === 0;
          const isAssigned = dispatchedWorker === worker.id;

          return (
            <div 
              key={worker.id}
              onClick={() => setSelectedWorker(worker.id)}
              className={`p-5 rounded-2xl transition-all cursor-pointer border relative ${
                isTopMatch 
                  ? "bg-gradient-to-r from-slate-800/90 via-slate-800/60 to-indigo-950/40 border-blue-500/60 shadow-lg ring-1 ring-blue-500/30" 
                  : "bg-slate-800/40 border-slate-800 hover:bg-slate-800/70"
              }`}
            >
              {/* Top Match Tag */}
              {isTopMatch && (
                <div className="absolute -top-3 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Recommended Worker
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Worker Avatar & Basic Info */}
                <div className="flex items-center gap-4">
                  <img 
                    src={worker.avatar} 
                    alt={worker.name} 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white">{worker.name}</h3>
                      <span className="text-xs text-amber-400 font-bold flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {worker.rating}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                        worker.availability === "Available" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-300"
                      }`}>
                        {worker.availability}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>📍 {worker.distanceKm} km away</span>
                      <span>•</span>
                      <span>💼 {worker.jobsCompleted} total jobs</span>
                    </p>
                  </div>
                </div>

                {/* AI Score Pill Grid */}
                <div className="grid grid-cols-3 gap-3 text-center bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Skill Match</div>
                    <div className="text-base font-black text-emerald-400">{worker.skillMatch}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Distance</div>
                    <div className="text-base font-black text-blue-400">{worker.distanceKm} km</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Fairness</div>
                    <div className="text-base font-black text-purple-400">{worker.fairnessScore}%</div>
                  </div>
                </div>

                {/* Dispatch Button */}
                <div className="shrink-0 text-right">
                  {isAssigned ? (
                    <div className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <CheckCircle2 className="w-4 h-4" /> Dispatched!
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDispatch(worker.id);
                      }}
                      disabled={isDispatching}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                        isTopMatch 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20" 
                          : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                      }`}
                    >
                      {isDispatching && selectedWorker === worker.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Assign via FairRoute <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>

              {/* Reasons Breakdown */}
              <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                {worker.reasons.map((r, i) => (
                  <span key={i} className="flex items-center gap-1 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> {r}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
