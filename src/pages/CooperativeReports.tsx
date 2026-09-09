import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BarChart3, TrendingUp, AlertTriangle, HeartPulse, ShieldCheck } from 'lucide-react';

export default function CooperativeReports() {
  const { profile } = useAuth();
  const [reportsData, setReportsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      if (!profile?.cooperative_id) return;
      try {
        const [workers, bookings, welfareStats] = await Promise.all([
          api.getCooperativeWorkers(profile.cooperative_id),
          api.getCooperativeBookings(profile.cooperative_id),
          api.getCooperativeWelfareStats(profile.cooperative_id)
        ]);

        // Demand Calculation
        const demandMap = new Map();
        bookings.forEach(b => {
          if (!b.service) return;
          const s = b.service.name;
          demandMap.set(s, (demandMap.get(s) || 0) + 1);
        });

        const sortedDemand = Array.from(demandMap.entries()).sort((a, b) => b[1] - a[1]);

        // Supply Calculation
        const supplyMap = new Map();
        workers.forEach(w => {
          const s = w.professional_title;
          supplyMap.set(s, (supplyMap.get(s) || 0) + 1);
        });

        // Skill Gap Calculation
        let topGap = { skill: 'None', demand: 0, supply: 0, level: 'Low' };
        if (sortedDemand.length > 0) {
          const highestDemand = sortedDemand[0];
          const supply = supplyMap.get(highestDemand[0]) || 0;
          
          if (supply < highestDemand[1] / 2) {
            topGap = { skill: highestDemand[0], demand: highestDemand[1], supply, level: 'High' };
          } else if (supply < highestDemand[1]) {
            topGap = { skill: highestDemand[0], demand: highestDemand[1], supply, level: 'Medium' };
          } else {
            topGap = { skill: highestDemand[0], demand: highestDemand[1], supply, level: 'Low' };
          }
        }

        // Wellbeing Index Calculation (Mocked from platform participation factors)
        const wfScore = welfareStats.totalWorkers ? Math.round((welfareStats.activeWelfare / welfareStats.totalWorkers) * 100) : 0;
        const ptScore = welfareStats.totalWorkers ? Math.round((welfareStats.activeProtection / welfareStats.totalWorkers) * 100) : 0;
        
        let index = null;
        if (welfareStats.totalWorkers > 0) {
          index = {
            total: Math.round((wfScore + ptScore + 80 + 70) / 4), // 80 and 70 are mock participation/training scores
            protection: ptScore,
            training: 70,
            welfare: wfScore,
            participation: 80
          };
        }

        setReportsData({
          demand: sortedDemand,
          gap: topGap,
          welfare: welfareStats,
          wellbeingIndex: index
        });
      } catch (err) {
        console.error("Error fetching reports", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [profile]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 rounded-xl w-64"></div>
        <div className="h-48 bg-gray-200 rounded-3xl w-full"></div>
        <div className="h-64 bg-gray-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-dark">Cooperative Reports</h1>
        <p className="text-gray-500 mt-1 font-medium text-lg">Simple, data-driven insights into your operations.</p>
      </div>

      {/* Skill Gap Feature */}
      <div className="bg-gradient-to-br from-dark to-deepBlue rounded-3xl p-8 shadow-sm text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Cooperative Skill Gap</h2>
            <p className="text-white/70 font-medium">Calculated from recent booking data versus available workers.</p>
          </div>
        </div>

        {reportsData?.gap.skill !== 'None' ? (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
              <div>
                <div className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">High Demand</div>
                <div className="font-bold text-lg">{reportsData.gap.skill}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Available Workers</div>
                <div className="font-bold text-lg">{reportsData.gap.supply}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Recent Requests</div>
                <div className="font-bold text-lg">{reportsData.gap.demand}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Gap</div>
                <div className="font-bold text-lg text-primary">{reportsData.gap.level}</div>
              </div>
            </div>
            
            <div className="bg-white text-dark p-4 rounded-xl flex-shrink-0 w-full md:w-64 border-l-4 border-primary">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Recommendation</div>
              <div className="font-bold text-sm">Consider training or onboarding additional {reportsData.gap.skill.toLowerCase()} workers.</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-white/70 font-medium">Not enough data to calculate skill gaps yet.</p>
          </div>
        )}
      </div>

      {/* Community Need */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-dark flex items-center gap-2 mb-8">
          <BarChart3 className="w-6 h-6 text-primary" /> What Does Your Community Need?
        </h2>

        {reportsData?.demand.length > 0 ? (
          <div className="space-y-6">
            {reportsData.demand.map((item: any, idx: number) => {
              const max = reportsData.demand[0][1];
              const percentage = (item[1] / max) * 100;
              
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-32 flex-shrink-0 font-bold text-dark text-sm">{item[0]}</div>
                  <div className="flex-1 bg-gray-100 h-6 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-dark rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right font-bold text-gray-500 text-sm">{item[1]} reqs</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">No Booking Data</h3>
            <p className="text-gray-500 text-sm mt-1">Analytics will appear here once bookings are made.</p>
          </div>
        )}
      </div>

      {/* Worker Wellbeing Overview */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-dark flex items-center gap-2 mb-2">
          <HeartPulse className="w-6 h-6 text-red-500" /> Worker Wellbeing Overview
        </h2>
        <p className="text-gray-500 font-medium text-sm mb-6 max-w-2xl">
          This is an administrative participation indicator, not a measure of a worker's personal wellbeing or health. Calculated from verification, welfare enrollment, and platform participation.
        </p>

        {reportsData?.wellbeingIndex ? (
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
            <div className="w-48 h-48 rounded-full border-8 border-gray-50 flex flex-col items-center justify-center relative flex-shrink-0 shadow-inner">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="289" strokeDashoffset={289 - (289 * reportsData.wellbeingIndex.total) / 100} className="text-primary transition-all duration-1000" strokeLinecap="round" />
              </svg>
              <span className="text-4xl font-black text-dark">{reportsData.wellbeingIndex.total}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">/ 100</span>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Protection</div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-dark">{reportsData.wellbeingIndex.protection}</span>
                  <span className="text-xs font-bold text-gray-400 mb-1">/ 100</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Training</div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-dark">{reportsData.wellbeingIndex.training}</span>
                  <span className="text-xs font-bold text-gray-400 mb-1">/ 100</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Welfare</div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-dark">{reportsData.wellbeingIndex.welfare}</span>
                  <span className="text-xs font-bold text-gray-400 mb-1">/ 100</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Participation</div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-dark">{reportsData.wellbeingIndex.participation}</span>
                  <span className="text-xs font-bold text-gray-400 mb-1">/ 100</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <h3 className="text-lg font-bold text-gray-700">Not enough data</h3>
            <p className="text-gray-500 text-sm mt-1">Worker data is required to calculate the wellbeing index.</p>
          </div>
        )}
      </div>

      {/* Worker Welfare Summary */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-dark flex items-center gap-2 mb-6">
          <ShieldCheck className="w-6 h-6 text-blue-500" /> Worker Welfare Report
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Total Workers</div>
            <div className="text-2xl font-black text-blue-900">{reportsData?.welfare?.totalWorkers || 0}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
            <div className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">Active Welfare</div>
            <div className="text-2xl font-black text-green-900">{reportsData?.welfare?.activeWelfare || 0}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
            <div className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">Pending Welfare</div>
            <div className="text-2xl font-black text-yellow-900">{reportsData?.welfare?.pendingWelfare || 0}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
            <div className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">No Record</div>
            <div className="text-2xl font-black text-red-900">{reportsData?.welfare?.notEnrolled || 0}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
            <div className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">Active Protection</div>
            <div className="text-2xl font-black text-purple-900">{reportsData?.welfare?.activeProtection || 0}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Training Participation</div>
            <div className="text-2xl font-black text-gray-800">Mock: 45%</div>
          </div>
        </div>
      </div>

    </div>
  );
}
