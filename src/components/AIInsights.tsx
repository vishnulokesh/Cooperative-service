import { TrendingUp, MapPin, Users, Zap, ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, Sparkles, BarChart3 } from 'lucide-react';
import { aiInsightsData } from '../services/mockData';

const trendIcon = (trend: string) => {
  if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
  if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-rose-500" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
};

const statusColor = (status: string) => {
  if (status === 'high_demand') return 'bg-rose-100 text-rose-700 border-rose-200';
  if (status === 'understaffed') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-emerald-100 text-emerald-700 border-emerald-200';
};

const DEMAND_FORECAST_BARS = [
  { label: "Plumbing", percentage: 94, surge: "↑ 41% Tomorrow", color: "bg-blue-600", recommendation: "+7 plumbers" },
  { label: "Electrical", percentage: 86, surge: "↑ 18% Tomorrow", color: "bg-indigo-600", recommendation: "+3 electricians" },
  { label: "Carpentry", percentage: 45, surge: "↓ 7% Normal", color: "bg-slate-500", recommendation: "Optimal" },
  { label: "Cleaning", percentage: 78, surge: "↑ 15% Tomorrow", color: "bg-purple-600", recommendation: "+2 cleaners" },
  { label: "Appliance", percentage: 72, surge: "↑ 12% Tomorrow", color: "bg-amber-600", recommendation: "+2 technicians" },
];

const AIInsights = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md border border-purple-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-400/30">
            <Zap className="w-6 h-6 text-purple-300 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              DailSmart AI Demand Forecast & Analytics
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-purple-200">Predictive intelligence for regional surge management & cooperative worker allocation</p>
          </div>
        </div>

        {/* Prediction Alert Banner */}
        <div className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          🔥 Tomorrow's Forecast: Plumbing demand predicted to surge by 41% in Zone B.
        </div>
      </div>

      {/* Visual Chart Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <div>
              <h4 className="font-bold text-slate-900 text-base">Tomorrow's Forecast</h4>
              <p className="text-xs text-slate-500">AI predicted demand surge & recommended workforce activation</p>
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span>Recommended Workers:</span>
            <span className="text-emerald-700 bg-white px-2 py-0.5 rounded shadow-sm">+7 plumbers</span>
            <span className="text-blue-700 bg-white px-2 py-0.5 rounded shadow-sm">+3 electricians</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pt-2">
          {DEMAND_FORECAST_BARS.map((bar) => (
            <div key={bar.label} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>{bar.label}</span>
                  <span className="text-indigo-600">{bar.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div className={`h-3 rounded-full ${bar.color} transition-all duration-500`} style={{ width: `${bar.percentage}%` }} />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
                <span className={bar.surge.includes('↑') ? 'text-emerald-700' : 'text-slate-600'}>{bar.surge}</span>
                <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">{bar.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Demand Forecast Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-sm">High-Demand Services (Next 3 Days)</h4>
          </div>
          <div className="space-y-3">
            {aiInsightsData.demandForecast.map((item) => (
              <div key={item.service} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{item.service}</p>
                  <p className="text-xs text-slate-400">{item.area} · {item.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${item.demand}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-8">{item.demand}%</span>
                  {trendIcon(item.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Busy Areas */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-rose-500" />
            <h4 className="font-bold text-slate-900 text-sm">Busy Service Areas</h4>
          </div>
          <div className="space-y-3">
            {aiInsightsData.busyAreas.map((area) => (
              <div key={area.area} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{area.area}</p>
                  <p className="text-xs text-slate-400">{area.bookings} bookings · {area.workers_available} workers available</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusColor(area.status)}`}>
                  {area.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Worker Allocation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-slate-900 text-sm">Recommended Worker Allocation</h4>
          </div>
          <div className="space-y-3">
            {aiInsightsData.workerRecommendations.map((rec) => (
              <div key={rec.service} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{rec.service}</p>
                  <p className="text-xs text-slate-400">Have {rec.current_workers} · Need {rec.recommended}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${rec.shortage > 4 ? 'bg-rose-100 text-rose-700' : rec.shortage > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {rec.shortage > 0 ? `+${rec.shortage} needed` : 'Sufficient'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Assignments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold text-slate-900 text-sm">Suggested Worker Assignments</h4>
          </div>
          <div className="space-y-4">
            {aiInsightsData.suggestedAssignments.map((assignment) => (
              <div key={assignment.booking_id} className="p-3.5 bg-purple-50/80 border border-purple-100 rounded-xl">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{assignment.customer}</p>
                    <p className="text-xs text-slate-500">{assignment.service} · #{assignment.booking_id}</p>
                  </div>
                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                    {assignment.confidence}% match
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-purple-700">→ {assignment.suggested_worker}</span>
                  {' '}— {assignment.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIInsights;
