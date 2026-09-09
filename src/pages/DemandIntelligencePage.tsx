import { useState } from 'react';
import {
  AlertTriangle, Users, CheckCircle2, Zap,
  Sparkles, BarChart3, Clock
} from 'lucide-react';
import { DemandIntelligenceAI, DemandIntelligenceReport } from '../services/ai/demandIntelligence';

export default function DemandIntelligencePage() {
  const [report] = useState<DemandIntelligenceReport>(DemandIntelligenceAI.getLiveForecast());
  const [activatedZoneB, setActivatedZoneB] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleActivateWorkers = (zoneId: string, count: number, trade: string) => {
    setActivatedZoneB(true);
    setToast(`⚡ Dispatched: Activated ${count} standby verified ${trade} professionals in ${zoneId.toUpperCase()}!`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Predictive AI Model
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Live Feed: {new Date(report.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            DailSmart Demand Intelligence & Workforce Allocation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cooperative workforce forecasting based on historical booking seasonality, weather alerts, and urban micro-zones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live AI Telemetry
          </span>
        </div>
      </div>

      {/* HIGHLIGHTED DEMO INSIGHT BANNER */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-black border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Major AI Insight • Next 24 Hours
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {report.highlightedInsight}
            </h2>

            <p className="text-blue-100 text-sm leading-relaxed">
              Recommendation: {report.recommendedAction}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => handleActivateWorkers('Zone B', 7, 'Plumbers')}
              disabled={activatedZoneB}
              className={`px-6 py-4 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center gap-2 ${
                activatedZoneB
                  ? 'bg-emerald-500 text-white cursor-default'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-105'
              }`}
            >
              {activatedZoneB ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> 7 Plumbers Activated
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-slate-950" /> Activate 7 Standby Plumbers
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary AI Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 p-4 rounded-2xl flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Electrical Demand Surge Window</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Electrical demand expected to peak between <strong>6:00 PM – 9:00 PM</strong> across Chittoor and Tirupati residential colonies.
            </p>
          </div>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Zone C Worker Deficit</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Zone C currently has high demand but insufficient available workers. Recommended: Cross-zone allocation from Sarjapur cluster.
            </p>
          </div>
        </div>
      </div>

      {/* AI WORKFORCE ALLOCATION MATRIX */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Zone-Wise Workforce Allocation Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Balancing supply and demand to maintain equitable opportunity distribution across cooperatives.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            3 Operational Zones Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {report.zones.map((zone) => (
            <div
              key={zone.zoneId}
              className="bg-slate-50 dark:bg-slate-950/70 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    zone.demandStatus === 'high'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : zone.demandStatus === 'low_availability'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {zone.demandStatus.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">+{zone.growthPercentage}% Surge</span>
                </div>

                <h4 className="font-black text-base text-slate-900 dark:text-white">{zone.zoneName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Primary Trade Needed: <strong>{zone.topTradeNeeded}</strong></p>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Required</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{zone.requiredWorkers}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Available</span>
                    <span className="text-sm font-black text-emerald-600">{zone.activeWorkers}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Shortage</span>
                    <span className={`text-sm font-black ${zone.shortageCount > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                      {zone.shortageCount > 0 ? `-${zone.shortageCount}` : '0'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60">
                  <span className="text-[10px] font-black uppercase text-indigo-700 dark:text-indigo-400 block mb-1">
                    AI Allocation Directive:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                    {zone.aiActionRecommendation}
                  </p>
                </div>
              </div>

              {zone.shortageCount > 0 && (
                <button
                  type="button"
                  onClick={() => handleActivateWorkers(zone.zoneName, zone.shortageCount, zone.topTradeNeeded)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                >
                  Activate {zone.shortageCount} Additional Workers
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Expected Jobs Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Predicted Hourly Demand Distribution (Tomorrow)
        </h3>
        <p className="text-xs text-slate-500">Peak expected jobs distribution for labour scheduling</p>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 pt-4">
          {report.peakHourlyDistribution.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-xs font-black text-indigo-600">{item.expectedJobs}</div>
              <div
                className="w-full bg-gradient-to-t from-indigo-600 to-blue-400 rounded-lg transition-all"
                style={{ height: `${Math.max(20, Math.min(100, item.expectedJobs * 1.1))}px` }}
              />
              <span className="text-[10px] font-bold text-slate-400">{item.hour}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
