import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, HeartPulse, 
  IndianRupee, Gift, AlertTriangle, ArrowRight, Loader2
} from 'lucide-react';

export default function WorkerWelfare() {
  const { user } = useAuth();
  const [worker, setWorker] = useState<any>(null);
  const [welfare, setWelfare] = useState<any>(null);
  const [insurance, setInsurance] = useState<any>(null);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWelfareData() {
      if (!user) return;
      try {
        const { data: wData } = await supabase
          .from('workers')
          .select('id, verification_status')
          .eq('profile_id', user.id)
          .single();

        if (wData) {
          setWorker(wData);
          const [wf, ins, ben] = await Promise.all([
            api.getWorkerWelfare(wData.id),
            api.getWorkerInsurance(wData.id),
            api.getAvailableBenefits()
          ]);
          setWelfare(wf);
          setInsurance(ins);
          setBenefits(ben);
        }
      } catch (err) {
        console.error("Failed to load welfare data", err);
      } finally {
        setLoading(false);
      }
    }
    loadWelfareData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const isVerified = worker?.verification_status === 'verified';
  const wfStatus = welfare?.welfare_status || 'not_enrolled';
  const insStatus = insurance?.status || 'not_enrolled';

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 animate-fade-in space-y-12">
      
      <div className="text-center md:text-left">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-dark flex items-center justify-center md:justify-start gap-3">
          <HeartPulse className="w-10 h-10 text-primary" /> My Welfare
        </h1>
        <p className="text-gray-500 mt-3 font-medium text-lg">Your cooperative support, benefits and protection at a glance.</p>
      </div>

      {/* Welfare Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SummaryCard 
          title="Welfare Status" 
          value={wfStatus.replace('_', ' ')} 
          status={wfStatus} 
          icon={HeartPulse} 
        />
        <SummaryCard 
          title="Coop Membership" 
          value={isVerified ? 'Verified' : 'Pending'} 
          status={isVerified ? 'active' : 'pending'} 
          icon={UsersIcon} 
        />
        <SummaryCard 
          title="Protection Status" 
          value={insStatus.replace('_', ' ')} 
          status={insStatus} 
          icon={ShieldCheck} 
        />
        <SummaryCard 
          title="Total Contribution" 
          value={`₹${welfare?.contribution_amount || 0}`} 
          status="info" 
          icon={IndianRupee} 
        />
        <SummaryCard 
          title="Available Benefits" 
          value={benefits.length.toString()} 
          status="info" 
          icon={Gift} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Your CoopServe Protection - Distinctive Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-dark to-deepBlue rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-8">Your CoopServe Protection</h2>
              
              <div className="space-y-6">
                <ProtectionItem label="Cooperative Membership" isOk={isVerified} status={isVerified ? 'Verified' : 'Pending'} />
                <ProtectionItem label="Skill Certification" isOk={isVerified} status={isVerified ? 'Verified' : 'Pending'} />
                <ProtectionItem label="Welfare Enrollment" isOk={wfStatus === 'active'} status={wfStatus} />
                <ProtectionItem label="Insurance" isOk={insStatus === 'active'} status={insStatus} />
                <ProtectionItem label="Emergency Support" isOk={true} status="Available" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions / Navigation */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionCard 
            to="/welfare/insurance"
            title="Protection"
            description="View your insurance and coverage details."
            icon={ShieldCheck}
            color="bg-blue-50 text-blue-600"
          />
          <ActionCard 
            to="/welfare/training"
            title="Training & Skills"
            description="Recommended courses to boost your demand."
            icon={CheckCircle2}
            color="bg-green-50 text-green-600"
          />
          <ActionCard 
            to="/welfare/safety"
            title="Safety Center"
            description="Guidelines and procedures for safe work."
            icon={AlertTriangle}
            color="bg-orange-50 text-orange-600"
          />
          <ActionCard 
            to="/welfare/history"
            title="Welfare History"
            description="Track your contributions and changes."
            icon={IndianRupee}
            color="bg-purple-50 text-purple-600"
          />
        </div>
      </div>

      {/* Benefits Section */}
      <div>
        <h2 className="text-2xl font-black text-dark mb-6">Benefits Available To You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map(b => (
            <div key={b.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-dark text-lg">{b.name}</h3>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">Available</span>
              </div>
              <p className="text-sm text-gray-500 font-medium mb-6 flex-1">{b.description}</p>
              <button className="w-full bg-gray-50 hover:bg-gray-100 text-dark font-bold py-3 rounded-xl transition-colors text-sm">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function SummaryCard({ title, value, status, icon: Icon }: any) {
  const getStatusColor = () => {
    if (status === 'active') return 'text-green-600 bg-green-50 border-green-200';
    if (status === 'pending') return 'text-orange-600 bg-orange-50 border-orange-200';
    if (status === 'info') return 'text-primary bg-primary/10 border-primary/20';
    return 'text-gray-500 bg-gray-50 border-gray-200';
  };

  const colorClass = getStatusColor();

  return (
    <div className={`rounded-2xl p-4 border flex flex-col items-center justify-center text-center shadow-sm transition-all ${colorClass}`}>
      <Icon className="w-6 h-6 mb-2 opacity-80" />
      <div className="text-xl font-black capitalize tracking-tight">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-70">{title}</div>
    </div>
  );
}

function ProtectionItem({ label, isOk, status }: { label: string, isOk: boolean, status: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="font-bold text-white/90">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold uppercase tracking-wider capitalize ${
          isOk ? 'text-green-400' : 
          status === 'pending' || status === 'Pending' ? 'text-yellow-400' : 'text-gray-400'
        }`}>
          {status.replace('_', ' ')}
        </span>
        {isOk ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : (
           status === 'pending' || status === 'Pending' ? <AlertTriangle className="w-5 h-5 text-yellow-400" /> : <ShieldAlert className="w-5 h-5 text-gray-500" />
        )}
      </div>
    </div>
  );
}

function ActionCard({ to, title, description, icon: Icon, color }: any) {
  return (
    <Link to={to} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col group hover:shadow-md hover:border-primary/50 transition-all">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-dark text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-500 font-medium">{description}</p>
      <div className="mt-auto pt-4 flex items-center justify-end">
        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}

// Just to fix unimported icon
import { Users as UsersIcon } from 'lucide-react';
