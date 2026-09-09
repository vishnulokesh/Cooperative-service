// DailSmart Solutions - Cooperative Governance & Welfare Policy Engine

export interface CooperativeProposal {
  id: string;
  title: string;
  description: string;
  category: 'welfare' | 'tariff' | 'equipment' | 'rules';
  proposerCooperative: string;
  deadline: string;
  yesVotes: number;
  noVotes: number;
  totalEligibleMembers: number;
  status: 'active' | 'passed' | 'rejected';
  hasUserVoted?: 'yes' | 'no' | null;
}

export interface WelfarePolicyConfig {
  cooperativeWelfareRatePercent: number; // e.g. 5%
  emergencySurgeAllowancePercent: number; // e.g. 15%
  accidentInsuranceMaxCover: number; // e.g. 500000
  healthInsuranceMaxCover: number; // e.g. 200000
  maternityBenefitCover: number; // e.g. 100000
}

const STORAGE_KEY_PROPOSALS = 'dailsmart_coop_proposals';
const STORAGE_KEY_POLICY = 'dailsmart_welfare_policy';

const DEFAULT_POLICY: WelfarePolicyConfig = {
  cooperativeWelfareRatePercent: 5,
  emergencySurgeAllowancePercent: 15,
  accidentInsuranceMaxCover: 500000,
  healthInsuranceMaxCover: 200000,
  maternityBenefitCover: 100000,
};

const DEFAULT_PROPOSALS: CooperativeProposal[] = [
  {
    id: 'prop-101',
    title: 'Increase emergency-service allowance by 15% for night shifts',
    description: 'Provide an additional direct stipend from the cooperative welfare pool to workers responding to emergency water burst and electrical failures between 9 PM and 6 AM.',
    category: 'welfare',
    proposerCooperative: 'Chittoor Skilled Workers Cooperative',
    deadline: '2026-09-20',
    yesVotes: 324,
    noVotes: 42,
    totalEligibleMembers: 410,
    status: 'active',
    hasUserVoted: null,
  },
  {
    id: 'prop-102',
    title: 'Monsoon Waterproofing & Heavy Duty Electrical Safety Gear Grant',
    description: 'Allocate ₹1,500 equipment voucher per verified electrical & plumbing partner from the cooperative reserve to equip members with ISI-certified insulated boots and rain gear.',
    category: 'equipment',
    proposerCooperative: 'Tirupati Community Services Cooperative',
    deadline: '2026-09-25',
    yesVotes: 289,
    noVotes: 18,
    totalEligibleMembers: 350,
    status: 'active',
    hasUserVoted: null,
  },
  {
    id: 'prop-103',
    title: 'Extend Maternity & Family Care Support to ₹1,50,000',
    description: 'Increase maximum health and maternity hospital coverage benefit for female cooperative members and spouses of registered artisans.',
    category: 'welfare',
    proposerCooperative: 'Hyderabad Domestic Help Union',
    deadline: '2026-09-30',
    yesVotes: 412,
    noVotes: 31,
    totalEligibleMembers: 490,
    status: 'active',
    hasUserVoted: null,
  },
];

export class CooperativeGovernanceService {
  static getPolicy(): WelfarePolicyConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_POLICY);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return DEFAULT_POLICY;
  }

  static updatePolicy(newPolicy: Partial<WelfarePolicyConfig>): WelfarePolicyConfig {
    const current = this.getPolicy();
    const updated = { ...current, ...newPolicy };
    try {
      localStorage.setItem(STORAGE_KEY_POLICY, JSON.stringify(updated));
    } catch { /* ignore */ }
    return updated;
  }

  static getProposals(): CooperativeProposal[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROPOSALS);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return DEFAULT_PROPOSALS;
  }

  static voteProposal(proposalId: string, choice: 'yes' | 'no'): CooperativeProposal[] {
    const proposals = this.getProposals();
    const updated = proposals.map(p => {
      if (p.id === proposalId && !p.hasUserVoted) {
        return {
          ...p,
          yesVotes: choice === 'yes' ? p.yesVotes + 1 : p.yesVotes,
          noVotes: choice === 'no' ? p.noVotes + 1 : p.noVotes,
          hasUserVoted: choice,
        };
      }
      return p;
    });
    try {
      localStorage.setItem(STORAGE_KEY_PROPOSALS, JSON.stringify(updated));
    } catch { /* ignore */ }
    return updated;
  }

  static createProposal(proposal: Omit<CooperativeProposal, 'id' | 'yesVotes' | 'noVotes' | 'status' | 'hasUserVoted'>): CooperativeProposal {
    const proposals = this.getProposals();
    const newP: CooperativeProposal = {
      ...proposal,
      id: `prop-${Date.now()}`,
      yesVotes: 1,
      noVotes: 0,
      status: 'active',
      hasUserVoted: 'yes',
    };
    proposals.unshift(newP);
    try {
      localStorage.setItem(STORAGE_KEY_PROPOSALS, JSON.stringify(proposals));
    } catch { /* ignore */ }
    return newP;
  }
}
