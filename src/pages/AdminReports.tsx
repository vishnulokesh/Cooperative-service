import { useState } from 'react';
import { Download, FileSpreadsheet, TrendingUp, IndianRupee, PieChart, Users, Building2, CheckCircle2 } from 'lucide-react';

export default function AdminReports() {
  const [toast, setToast] = useState<string | null>(null);

  const handleExport = (type: string) => {
    setToast(`Exporting DailSmart Solutions Platform ${type} report... (Demo download initiated)`);
    setTimeout(() => setToast(null), 3500);
  };

  const servicePopularity = [
    { service: 'Plumbing', percentage: 88, count: '5,420 jobs', revenue: '₹18,97,000', color: 'bg-blue-500' },
    { service: 'Electrical', percentage: 76, count: '4,680 jobs', revenue: '₹18,72,000', color: 'bg-amber-500' },
    { service: 'Domestic Help & Cleaning', percentage: 65, count: '3,890 jobs', revenue: '₹11,67,000', color: 'bg-emerald-500' },
    { service: 'Caregiving', percentage: 48, count: '2,410 jobs', revenue: '₹12,05,000', color: 'bg-purple-500' },
    { service: 'Carpentry & Painting', percentage: 38, count: '1,820 jobs', revenue: '₹9,10,000', color: 'bg-rose-500' },
    { service: 'AC & Appliance Repair', percentage: 22, count: '714 jobs', revenue: '₹7,83,200', color: 'bg-cyan-500' },
  ];

  const regionalBreakdown = [
    { district: 'Chittoor & Tirupati', share: 38, coops: 12, workers: 450 },
    { district: 'Hyderabad & Cyberabad', share: 26, coops: 9, workers: 320 },
    { district: 'Visakhapatnam & Vizianagaram', share: 18, coops: 7, workers: 240 },
    { district: 'Bengaluru Urban & Rural', share: 12, coops: 6, workers: 160 },
    { district: 'Chennai Metro', share: 6, coops: 4, workers: 76 },
  ];

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-24 right-8 bg-dark text-white px-5 py-3 rounded-xl shadow-2xl border border-primary z-50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-dark tracking-tight">Reports & Analytical Insights</h1>
          <p className="text-gray-500 text-sm mt-1">Platform service volume, revenue allocation, fair wage compliance, and regional penetration.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('CSV')}
            className="px-4 py-2 bg-white border border-gray-200 text-dark font-bold text-xs rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-4 py-2 bg-dark text-white font-bold text-xs rounded-xl hover:bg-dark/90 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-primary" /> Download PDF Report
          </button>
        </div>
      </div>

      {/* Financial High-level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
            <span>Total Gross GMV</span>
            <IndianRupee className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-dark tracking-tight mt-3">₹78,34,200</p>
          <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24.8% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
            <span>Direct Worker Wage Payout</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-dark tracking-tight mt-3">₹70,50,780</p>
          <p className="text-xs text-gray-500 font-medium mt-2">
            <strong>90% Direct</strong> to Cooperative Workers
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
            <span>Cooperative Welfare Fund (5%)</span>
            <Building2 className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-dark tracking-tight mt-3">₹3,91,710</p>
          <p className="text-xs text-amber-700 font-medium mt-2">
            Allocated for worker insurance & health
          </p>
        </div>
      </div>

      {/* Main Bar Chart Breakdown & Regional Shares */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Service Popularity & Volume (CSS-based Bar Chart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-dark text-lg flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" /> Service Category Demand & Revenue
              </h3>
              <p className="text-xs text-gray-500 font-medium">Completed job distribution across categories</p>
            </div>
            <span className="text-xs font-bold text-gray-400">YTD 2026</span>
          </div>

          <div className="space-y-5">
            {servicePopularity.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-dark">{item.service}</span>
                  <div className="flex items-center gap-3 text-gray-500">
                    <span>{item.count}</span>
                    <span className="text-dark font-black">{item.revenue}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div 
                    className={`${item.color} h-3 rounded-full transition-all duration-500`} 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-dark text-lg mb-1">Regional Market Penetration</h3>
            <p className="text-xs text-gray-500 font-medium mb-6">Distribution across districts and clusters</p>

            <div className="space-y-4">
              {regionalBreakdown.map((reg, idx) => (
                <div key={idx} className="p-3.5 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-dark">{reg.district}</span>
                    <span className="text-primary font-black bg-dark px-2 py-0.5 rounded">{reg.share}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium pt-1">
                    <span>Cooperatives: <strong>{reg.coops}</strong></span>
                    <span>Verified Workers: <strong>{reg.workers}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
            🌱 <strong>Impact Note:</strong> DailSmart Solutions has generated over <strong>18,934 fair-wage bookings</strong> since launch across southern states.
          </div>
        </div>

      </div>
    </div>
  );
}
