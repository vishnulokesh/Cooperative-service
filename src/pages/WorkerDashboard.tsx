import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  CheckCircle2, MapPin, Truck, PlayCircle, ShieldCheck, Star, IndianRupee, Heart, Award, Bell, ChevronRight, TrendingUp, Phone, Navigation, Activity, Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";
import { mockBookings } from "../services/mockData";

const STATUS_STEPS = [
  { key: "accepted", label: "Accepted", icon: CheckCircle2 },
  { key: "on_the_way", label: "On The Way", icon: Truck },
  { key: "started", label: "Working", icon: PlayCircle },
  { key: "completed", label: "Done", icon: Award },
];

function StatusTracker({ status }: { status: string }) {
  const stepIndex = STATUS_STEPS.findIndex(s => s.key === status);
  return (
    <div className="flex items-center gap-1 mt-3">
      {STATUS_STEPS.map((step, idx) => {
        const Icon = step.icon;
        const done = idx <= stepIndex;
        const active = idx === stepIndex;
        return (
          <div key={step.key} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-slate-50 text-slate-400"} ${active ? "ring-4 ring-emerald-100 scale-110 shadow-md" : ""}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-semibold mt-1 ${done ? "text-emerald-700 font-bold" : "text-slate-400"}`}>{step.label}</span>
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mb-4 rounded transition-all ${idx < stepIndex ? "bg-emerald-500" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function WorkerDashboard() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [bookings, setBookings] = useState<any[]>(mockBookings || []);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const currentUser = user as any;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateStatus = (bookingId: string, newStatus: string) => {
    setActionLoading(bookingId);
    setTimeout(() => {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      showToast(`Status updated to ${newStatus.replace('_', ' ')}!`);
      setActionLoading(null);
    }, 600);
  };

  const activeJob = bookings.find(b => ["accepted", "on_the_way", "started", "in_progress", "confirmed"].includes(b.status));
  const pendingJobs = bookings.filter(b => b.status === "pending" || b.status === "requested");

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce border border-emerald-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Worker Header Card */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150"} 
                  alt={currentUser?.name || "Ravi Kumar"} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                />
                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-900 ${isOnline ? "bg-emerald-400" : "bg-slate-400"}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{currentUser?.name || "Ravi Kumar"}</h1>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Pro
                  </span>
                </div>
                <p className="text-blue-200 text-sm flex items-center gap-2 mt-1">
                  <Briefcase className="w-4 h-4 text-blue-400" /> Senior Master Plumber • Mumbai Central Coop
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9 (128 jobs)
                  </span>
                  <span className="bg-blue-800/40 text-blue-200 px-2 py-0.5 rounded-md">
                    Badge: ⭐ Top Performer
                  </span>
                </div>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3 self-stretch sm:self-auto justify-between">
              <div className="text-left">
                <div className="text-xs text-blue-200 uppercase font-semibold tracking-wider">Duty Status</div>
                <div className={`text-sm font-bold ${isOnline ? "text-emerald-300" : "text-slate-400"}`}>
                  {isOnline ? "🟢 Online & Available" : "⚪ Offline"}
                </div>
              </div>
              <button 
                onClick={() => setIsOnline(!isOnline)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${isOnline ? "bg-emerald-500" : "bg-slate-600"}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isOnline ? "translate-x-8" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Today's Jobs</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">4</div>
            <div className="text-xs text-indigo-600 font-medium mt-1">1 active, 3 completed</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">3</div>
            <div className="text-xs text-slate-500 mt-1">Avg 45 mins/job</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Earnings Today</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">₹1,250</div>
            <div className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18% vs yesterday
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Rating</span>
              <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">4.8 ⭐</div>
            <div className="text-xs text-slate-500 mt-1">From 142 reviews</div>
          </div>
        </div>

        {/* ACTIVE JOB BANNER / CARD */}
        {activeJob ? (
          <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-xl overflow-hidden">
            <div className="bg-emerald-600 text-white px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
                <Activity className="w-5 h-5 animate-pulse text-emerald-200" /> Active Job In Progress
              </div>
              <span className="bg-emerald-700 text-emerald-100 text-xs px-3 py-1 rounded-full font-mono">
                ID: #{activeJob.id || "JOB-8942"}
              </span>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{activeJob.service || "Emergency Pipe Leak Repair"}</h3>
                  <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    {activeJob.address || "Flat 402, Sunshine Heights, Worli, Mumbai"} (1.2 km away)
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-700">₹{activeJob.amount || 750}</div>
                  <div className="text-xs text-slate-400">Fixed Rate Guaranteed</div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Job Status Tracker</div>
                <StatusTracker status={activeJob.status || "accepted"} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <a href={`tel:${activeJob.customerPhone || "9876543210"}`} className="px-4 py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-xl text-sm hover:bg-blue-100 transition-colors flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Call Customer
                  </a>
                  <button className="px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-200 transition-colors flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-blue-600" /> Start Navigation
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {(activeJob.status === "accepted" || activeJob.status === "confirmed") && (
                    <button 
                      onClick={() => handleUpdateStatus(activeJob.id, "on_the_way")}
                      disabled={actionLoading === activeJob.id}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4" /> Mark "On The Way"
                    </button>
                  )}
                  {activeJob.status === "on_the_way" && (
                    <button 
                      onClick={() => handleUpdateStatus(activeJob.id, "started")}
                      disabled={actionLoading === activeJob.id}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4" /> Start Work Now
                    </button>
                  )}
                  {(activeJob.status === "started" || activeJob.status === "in_progress") && (
                    <button 
                      onClick={() => handleUpdateStatus(activeJob.id, "completed")}
                      disabled={actionLoading === activeJob.id}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2 animate-pulse"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete & Collect Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-slate-800">No active job right now</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto mt-1">
              You are marked as <span className="font-semibold text-emerald-700">Available</span>. New customer booking requests nearby will pop up below in real-time.
            </p>
          </div>
        )}

        {/* TWO COLUMN GRID: Pending Requests & Skill Passport */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Pending Job Requests (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" /> Incoming Nearby Requests
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {pendingJobs.length || 2} new
                </span>
              </h2>
            </div>

            {/* List of nearby job requests */}
            <div className="space-y-3">
              {[
                { id: "REQ-PLUMB", trade: "Plumbing", service: "Pipe Leakage & Sanitary Repair", distance: "2.1 km", amount: 450, urgency: "Urgent" },
                { id: "REQ-ELEC", trade: "Electrical", service: "Switchboard & Short Circuit Fix", distance: "3.4 km", amount: 600, urgency: "Normal" },
              ].map((req) => (
                <div key={req.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        {req.trade}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {req.distance} away
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{req.service}</h3>
                    <p className="text-xs text-slate-500">
                      Estimated earning: <strong className="text-emerald-700 font-black">₹{req.amount}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => alert(`Job Details:\nCategory: ${req.trade}\nService: ${req.service}\nDistance: ${req.distance}\nEstimated Earning: ₹${req.amount}`)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      View Job
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(req.id, "accepted")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      Accept Job
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Completed Job History Snippet */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Recently Completed Jobs Today
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">Kitchen Sink Drainage Unblocking</div>
                    <div className="text-slate-400">Customer: Ananya S. • Bandra West</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">₹550</span>
                    <div className="text-amber-500 flex items-center gap-0.5 justify-end"><Star className="w-3 h-3 fill-amber-400" /> 5.0</div>
                  </div>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">Overhead Tank Valve Replacement</div>
                    <div className="text-slate-400">Customer: Rajesh M. • Worli</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">₹800</span>
                    <div className="text-amber-500 flex items-center gap-0.5 justify-end"><Star className="w-3 h-3 fill-amber-400" /> 4.9</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Skill Passport & Welfare Quick Access */}
          <div className="space-y-4">
            
            {/* Digital Skill Passport Widget */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-lg border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm">Digital Skill Passport</h3>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                  ID: SP-9921
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase tracking-wider">Certified Primary Skill</div>
                  <div className="font-bold text-slate-200 text-sm">Master Plumbing & Pipefitting</div>
                  <div className="text-emerald-400 text-[11px] font-semibold">Government Certified Level 4</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <div className="text-slate-400 text-[10px]">Safety Rating</div>
                    <div className="font-bold text-emerald-400 text-sm">100% Verified</div>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <div className="text-slate-400 text-[10px]">Coop Member</div>
                    <div className="font-bold text-blue-300 text-sm">Mumbai Plumbers</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link 
                    to="/skills" 
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    View Full Skill Passport <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Welfare & Insurance Status */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Heart className="w-4 h-4 text-rose-500" /> Welfare & Benefits
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-emerald-900">PM-JAY Health Insurance</div>
                    <div className="text-emerald-700 text-[11px]">Cover up to ₹5,00,000</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-blue-900">Worker Pension Fund</div>
                    <div className="text-blue-700 text-[11px]">Monthly Coop Contribution</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              <Link 
                to="/welfare" 
                className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
              >
                Access Welfare Portal <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default WorkerDashboard;
