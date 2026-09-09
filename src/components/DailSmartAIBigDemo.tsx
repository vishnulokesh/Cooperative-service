import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot, Mic, MicOff, Send, Sparkles, AlertTriangle, CheckCircle2,
  Star, ArrowRight, ShieldCheck, RefreshCw
} from 'lucide-react';
import { DailSmartAIService, ServiceIntent } from '../services/ai/serviceUnderstanding';
import { FairRouteAI, FairRouteScoreResult } from '../services/ai/fairRoute';
import { workers } from '../services/mockData';

const SAMPLE_QUERIES = [
  { text: 'నా బాత్రూంలో పైప్ లీక్ అవుతుంది', lang: 'Telugu', label: 'Telugu: Pipe Leak' },
  { text: 'Bathroom lo pipe leak avutundi urgent ga', lang: 'Code-Switch', label: 'Telugu-Eng: Urgent Leak' },
  { text: 'Mere ghar mein pipe burst ho gaya hai', lang: 'Hindi', label: 'Hindi: Pipe Burst' },
  { text: 'Enaku plumber venum kitchen tap repair', lang: 'Tamil', label: 'Tamil: Tap Repair' },
  { text: 'Urgent electrical sparking in main MCB board', lang: 'English', label: 'English: Electrical Spark' },
];

export default function DailSmartAIBigDemo({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [intent, setIntent] = useState<ServiceIntent | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<'normal' | 'emergency' | null>(null);
  const [fairRouteResults, setFairRouteResults] = useState<FairRouteScoreResult[]>([]);
  const [aiSpeechActive, setAiSpeechActive] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN';
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setQuery(transcript);
        handleProcessQuery(transcript);
      };
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      u.onstart = () => setAiSpeechActive(true);
      u.onend = () => setAiSpeechActive(false);
      window.speechSynthesis.speak(u);
    }
  };

  const handleProcessQuery = (textToAnalyze: string) => {
    const text = textToAnalyze || query;
    if (!text.trim()) return;

    setAnalyzing(true);
    setIntent(null);
    setSelectedUrgency(null);
    setFairRouteResults([]);

    setTimeout(() => {
      const classified = DailSmartAIService.classifyIntent(text);
      setIntent(classified);
      setAnalyzing(false);

      const localized = DailSmartAIService.getLocalizedResponse(classified);
      speakMessage(`${localized.question} ${localized.promptEmergency}`);
    }, 600);
  };

  const handleSelectUrgency = (urgency: 'normal' | 'emergency') => {
    setSelectedUrgency(urgency);
    if (!intent) return;

    // Convert candidate workers to FairRoute input format
    const candidateWorkers = workers
      .filter(w => w.verification_status === 'verified')
      .map(w => ({
        id: w.id,
        name: w.full_name || w.professional_title,
        avatar: w.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
        role: w.professional_title,
        serviceId: w.service_id,
        cooperativeName: w.cooperative_name || 'Labour Cooperative',
        experienceYears: w.experience_years,
        rating: w.rating,
        completedJobs: w.completed_jobs,
        distanceKm: w.distance_km,
        isVerified: w.verification_status === 'verified',
        isEmergencyAvailable: w.is_emergency_available,
        availabilityStatus: w.availability_status,
        todayJobsCount: w.today_jobs_count,
        responseTimeMinutes: w.response_time_minutes,
        certificationsCount: w.certifications_count,
        pricePerVisit: w.price_per_visit,
        languages: w.languages
      }));

    const evaluated = FairRouteAI.evaluate(candidateWorkers, {
      requiredServiceId: intent.serviceId,
      isEmergency: urgency === 'emergency'
    });

    setFairRouteResults(evaluated.slice(0, 3));
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type or click the sample phrases below.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleBookWorker = (result: FairRouteScoreResult) => {
    const bookingDraft = {
      workerId: result.worker.id,
      workerName: result.worker.name,
      workerRole: result.worker.role,
      workerAvatar: result.worker.avatar,
      workerCoop: result.worker.cooperativeName,
      serviceName: intent?.serviceName || 'Plumbing',
      problemDescription: intent?.problem || 'Pipe Leakage Repair',
      isEmergency: selectedUrgency === 'emergency',
      estimatedAmount: selectedUrgency === 'emergency' ? result.worker.pricePerVisit + 150 : result.worker.pricePerVisit,
      location: 'Chittoor Central, Andhra Pradesh',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: selectedUrgency === 'emergency' ? 'Immediate (< 15 mins)' : '11:00 AM'
    };

    // Save pending booking draft to sessionStorage so it is never lost even if user needs to login
    sessionStorage.setItem('dailsmart_pending_booking', JSON.stringify(bookingDraft));

    // Check if user is logged in
    const sessionStr = localStorage.getItem('dailsmart_session');
    let isLoggedIn = false;
    try {
      if (sessionStr && JSON.parse(sessionStr).loggedIn) isLoggedIn = true;
    } catch { /* ignore */ }

    if (isLoggedIn) {
      navigate('/booking', { state: bookingDraft });
    } else {
      // Redirect to login preserving booking intent
      navigate('/login?redirect=booking&role=customer', {
        state: { preservedBooking: bookingDraft }
      });
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700 space-y-6 max-w-4xl mx-auto my-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg border border-blue-400/30">
            <Bot className="w-7 h-7 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">DailSmart AI Assistant</h2>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-400/40 uppercase">
                Multilingual NLP
              </span>
            </div>
            <p className="text-xs text-blue-200">
              Understands Telugu, Hindi, Tamil & English • Code-Switching Supported
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors text-xs font-bold"
          >
            ✕ Close
          </button>
        )}
      </div>

      {/* Input Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 focus-within:border-indigo-500 shadow-inner">
          <button
            type="button"
            onClick={toggleMic}
            className={`p-3 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isListening ? 'Listening to voice...' : 'Click for Voice input'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleProcessQuery(query)}
            placeholder={isListening ? 'Listening to your voice...' : 'Describe your problem: e.g., "నా బాత్రూంలో పైప్ లీక్ అవుతుంది" or "Bathroom lo pipe leak"'}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white font-medium placeholder-slate-500 focus:ring-0"
          />

          <button
            type="button"
            onClick={() => handleProcessQuery(query)}
            disabled={!query.trim() || analyzing}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-40 shadow-md flex items-center gap-1.5"
          >
            {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Analyze
          </button>
        </div>

        {/* Quick Sample Queries */}
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
            ⚡ Quick Demo Prompts (Tap to test):
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUERIES.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(sq.text);
                  handleProcessQuery(sq.text);
                }}
                className="text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500 transition-all font-medium flex items-center gap-1.5"
              >
                <span>{sq.label}</span>
                <span className="text-[10px] text-amber-400 font-mono">"{sq.text.slice(0, 18)}..."</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 1 Result: Detected Intent & Service Understanding */}
      {intent && (
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-indigo-500/40 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Intent Classification Result
              {aiSpeechActive && (
                <span className="text-[10px] text-amber-300 animate-pulse bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                  🔊 Voice Active
                </span>
              )}
            </span>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
              Confidence: {intent.confidence}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Detected Service</span>
              <p className="text-base font-black text-white mt-0.5">{intent.serviceName}</p>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Specific Issue</span>
              <p className="text-base font-black text-amber-400 mt-0.5">{intent.problem}</p>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Input Language</span>
              <p className="text-base font-black text-indigo-300 uppercase mt-0.5">{intent.detectedLanguage}</p>
            </div>
          </div>

          {/* AI Conversational Clarification Question */}
          <div className="p-4 bg-indigo-950/70 border border-indigo-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <span>🤖</span>
                "It sounds like you need a plumber for a pipe leakage. Is this an emergency?"
              </p>
              <p className="text-xs text-blue-200">
                Choose urgency level to trigger FairRoute allocation:
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleSelectUrgency('normal')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  selectedUrgency === 'normal'
                    ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                Normal Service
              </button>

              <button
                type="button"
                onClick={() => handleSelectUrgency('emergency')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  selectedUrgency === 'emergency'
                    ? 'bg-rose-600 text-white shadow-lg ring-2 ring-rose-400'
                    : 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Emergency (&lt; 15 mins)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 Result: Top 3 FairRoute Worker Results */}
      {fairRouteResults.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>⚡</span>
                FairRoute AI Intelligent Allocation
              </h3>
              <p className="text-xs text-slate-400">
                Scored across 12 parameters (Skill, Certifications, Distance, Reliability, Rating & Fair Workload Rotation)
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
              Top 3 Verified Matches
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fairRouteResults.map((res) => {
              const w = res.worker;
              return (
                <div
                  key={w.id}
                  className={`bg-slate-950 rounded-2xl p-4 border transition-all flex flex-col justify-between relative ${
                    res.isTopRecommendation
                      ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-xl'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Badge */}
                  {res.isTopRecommendation && (
                    <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Recommended by DailSmart AI
                    </div>
                  )}

                  <div className="space-y-3 pt-1">
                    {/* Worker Identity */}
                    <div className="flex items-start gap-3">
                      <img
                        src={w.avatar}
                        alt={w.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-black text-sm text-white truncate">{w.name}</h4>
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        </div>
                        <p className="text-[11px] text-blue-300 font-medium truncate">{w.role}</p>
                        <p className="text-[10px] text-slate-400 truncate">{w.cooperativeName}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-2 rounded-xl text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Rating</span>
                        <span className="text-xs font-black text-amber-400 flex items-center justify-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {w.rating}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Distance</span>
                        <span className="text-xs font-black text-white">{w.distanceKm} km</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">FairRoute</span>
                        <span className="text-xs font-black text-emerald-400">{res.totalScore}/100</span>
                      </div>
                    </div>

                    {/* FairRoute Explanations (Why Recommended) */}
                    <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                        Why Recommended:
                      </span>
                      {res.reasons.slice(0, 4).map((r, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking CTA */}
                  <div className="pt-4 border-t border-slate-800 mt-3 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Rate</span>
                      <span className="text-sm font-black text-white">₹{w.pricePerVisit}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBookWorker(res)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-md ${
                        res.isTopRecommendation
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-105'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      Book Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
