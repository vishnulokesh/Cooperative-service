import { useState } from 'react';
import {
  Vote, CheckCircle2,
  Plus, Calendar, Percent
} from 'lucide-react';
import { CooperativeGovernanceService, CooperativeProposal, WelfarePolicyConfig } from '../services/ai/governance';

export default function CooperativeGovernancePage() {
  const [proposals, setProposals] = useState<CooperativeProposal[]>(CooperativeGovernanceService.getProposals());
  const [policy, setPolicy] = useState<WelfarePolicyConfig>(CooperativeGovernanceService.getPolicy());
  const [showNewProposalModal, setShowNewProposalModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New proposal form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const newCoop = 'Chittoor Skilled Workers Cooperative';
  const [newCategory, setNewCategory] = useState<'welfare' | 'tariff' | 'equipment' | 'rules'>('welfare');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleVote = (id: string, choice: 'yes' | 'no') => {
    const updated = CooperativeGovernanceService.voteProposal(id, choice);
    setProposals(updated);
    showToast(`Your vote (${choice.toUpperCase()}) has been recorded on the cooperative ledger!`);
  };

  const handlePolicyChange = (rate: number) => {
    const updated = CooperativeGovernanceService.updatePolicy({ cooperativeWelfareRatePercent: rate });
    setPolicy(updated);
    showToast(`Cooperative welfare policy updated to ${rate}% allocation.`);
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    CooperativeGovernanceService.createProposal({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      proposerCooperative: newCoop,
      deadline: '2026-10-15',
      totalEligibleMembers: 450,
    });

    setProposals(CooperativeGovernanceService.getProposals());
    setShowNewProposalModal(false);
    setNewTitle('');
    setNewDesc('');
    showToast('New proposal submitted for democratic membership vote!');
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-500 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Democratic Oversight
            </span>
            <span className="text-xs text-slate-500 font-mono">Labour Cooperative Federation</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Cooperative Governance & Welfare Policy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Transparent policy formulation, democratic member voting, and configurable social security allocation.
          </p>
        </div>

        <button
          onClick={() => setShowNewProposalModal(true)}
          className="px-5 py-3 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Policy Proposal
        </button>
      </div>

      {/* CONFIGURABLE WELFARE POLICY CARD */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-700/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Current Cooperative Welfare Policy</h3>
              <p className="text-xs text-blue-200">
                Welfare allocation is configurable by the federation — not a rigid hardcoded commission.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-blue-200 block font-semibold">Active Deduction Rate</span>
            <span className="text-3xl font-black text-amber-400">{policy.cooperativeWelfareRatePercent}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Slider */}
          <div className="md:col-span-2 space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-indigo-800/80">
            <div className="flex justify-between items-center text-xs font-bold text-blue-200">
              <span>Configurable Allocation Slider:</span>
              <span className="text-white font-black">{policy.cooperativeWelfareRatePercent}% per booking</span>
            </div>
            <input
              type="range"
              min={3}
              max={8}
              step={0.5}
              value={policy.cooperativeWelfareRatePercent}
              onChange={(e) => handlePolicyChange(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-bold">
              <span>3% (Min Welfare Reserve)</span>
              <span>5% (Recommended Federation Standard)</span>
              <span>8% (Maximum Social Security)</span>
            </div>
          </div>

          {/* Social Security Benefits Funded */}
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-indigo-950/80 rounded-xl border border-indigo-800 flex items-center justify-between">
              <span className="text-slate-300">Health Insurance Pool:</span>
              <span className="font-black text-emerald-400">₹{policy.healthInsuranceMaxCover.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-indigo-950/80 rounded-xl border border-indigo-800 flex items-center justify-between">
              <span className="text-slate-300">Accident Insurance:</span>
              <span className="font-black text-amber-400">₹{policy.accidentInsuranceMaxCover.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-indigo-950/80 rounded-xl border border-indigo-800 flex items-center justify-between">
              <span className="text-slate-300">Emergency Night Allowance:</span>
              <span className="font-black text-white">+{policy.emergencySurgeAllowancePercent}% Direct</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE PROPOSALS FOR VOTING */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Vote className="w-5 h-5 text-indigo-600" />
              Active Member Proposals & Voting
            </h3>
            <p className="text-xs text-slate-500">Every verified cooperative member has 1 equal vote</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {proposals.length} Proposals Open
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((prop) => {
            const totalVotes = prop.yesVotes + prop.noVotes;
            const yesPercent = totalVotes > 0 ? Math.round((prop.yesVotes / totalVotes) * 100) : 0;
            const participationPercent = Math.round((totalVotes / prop.totalEligibleMembers) * 100);

            return (
              <div
                key={prop.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full">
                      {prop.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Due {prop.deadline}
                    </span>
                  </div>

                  <h4 className="font-black text-base text-slate-900 dark:text-white leading-snug">
                    {prop.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {prop.description}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Sponsoring Union: <strong>{prop.proposerCooperative}</strong>
                  </p>
                </div>

                {/* Voting Progress */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-600">Yes: {prop.yesVotes} ({yesPercent}%)</span>
                    <span className="text-rose-600">No: {prop.noVotes} ({100 - yesPercent}%)</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: `${yesPercent}%` }} />
                    <div className="bg-rose-500 h-full" style={{ width: `${100 - yesPercent}%` }} />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Participation: <strong>{participationPercent}%</strong></span>
                    <span>{totalVotes} of {prop.totalEligibleMembers} voted</span>
                  </div>

                  {/* Voting Actions */}
                  {prop.hasUserVoted ? (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl text-center text-xs font-bold text-slate-600 dark:text-slate-400">
                      ✓ You voted <strong className="uppercase text-indigo-600">{prop.hasUserVoted}</strong> on this proposal
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleVote(prop.id, 'yes')}
                        className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-black text-xs rounded-xl transition-colors border border-emerald-200 dark:border-emerald-800"
                      >
                        Vote Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVote(prop.id, 'no')}
                        className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-black text-xs rounded-xl transition-colors border border-rose-200 dark:border-rose-800"
                      >
                        Vote No
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Create Policy Proposal */}
      {showNewProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Draft Cooperative Policy Proposal</h3>
            
            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Proposal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Increase emergency-service allowance by 15%"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="welfare">Welfare & Social Security</option>
                  <option value="equipment">Equipment & Safety Grants</option>
                  <option value="tariff">Service Tariff & Pricing</option>
                  <option value="rules">Cooperative Bylaws & Rules</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain rationale and how welfare funding or tariff change will be distributed..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewProposalModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md transition-all"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
