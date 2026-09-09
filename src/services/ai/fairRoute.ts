// DailSmart Solutions - FairRoute AI Engine
// Multi-factor intelligent opportunity distribution & matching algorithm
// Balances customer distance, skill certifications, reliability, AND fair cooperative opportunity rotation.

export interface FairRouteWorkerInput {
  id: string;
  name: string;
  avatar: string;
  role: string;
  serviceId: string;
  cooperativeName: string;
  experienceYears: number;
  rating: number;
  completedJobs: number;
  distanceKm: number;
  isVerified: boolean;
  isEmergencyAvailable: boolean;
  availabilityStatus: 'available' | 'busy' | 'offline';
  todayJobsCount: number;
  responseTimeMinutes: number;
  certificationsCount: number;
  pricePerVisit: number;
  languages: string[];
}

export interface FairRouteScoreResult {
  worker: FairRouteWorkerInput;
  totalScore: number; // 0 to 100
  breakdown: {
    skillMatchScore: number;      // max 20
    certificationScore: number;   // max 10
    availabilityScore: number;    // max 15
    distanceScore: number;        // max 15
    reliabilityScore: number;     // max 15
    ratingScore: number;          // max 10
    workloadBalanceScore: number; // max 15 (boosts workers who haven't had excessive jobs today)
  };
  isTopRecommendation: boolean;
  recommendationBadges: string[];
  reasons: string[];
}

export class FairRouteAI {
  /**
   * Evaluates a pool of candidate workers for a specific customer request
   * and computes a normalized 0-100 FairRoute score with transparent explanation.
   */
  static evaluate(
    candidates: FairRouteWorkerInput[],
    criteria: {
      requiredServiceId: string;
      isEmergency?: boolean;
      maxDistanceKm?: number;
    }
  ): FairRouteScoreResult[] {
    const results: FairRouteScoreResult[] = candidates.map((worker) => {
      // 1. Skill Match (max 20)
      const serviceMatch = (worker.serviceId || '').toLowerCase().includes(criteria.requiredServiceId.toLowerCase())
        || (worker.role || '').toLowerCase().includes(criteria.requiredServiceId.toLowerCase());
      const skillMatchScore = serviceMatch ? 20 : 8;

      // 2. Certifications (max 10)
      const certificationScore = Math.min(10, (worker.certificationsCount || 2) * 3.5);

      // 3. Availability (max 15)
      let availabilityScore = 5;
      if (criteria.isEmergency) {
        if (worker.isEmergencyAvailable && worker.availabilityStatus === 'available') {
          availabilityScore = 15;
        } else if (worker.availabilityStatus === 'available') {
          availabilityScore = 10;
        } else {
          availabilityScore = 2;
        }
      } else {
        if (worker.availabilityStatus === 'available') availabilityScore = 15;
        else if (worker.availabilityStatus === 'busy') availabilityScore = 7;
        else availabilityScore = 0;
      }

      // 4. Distance Score (max 15): Closer is higher
      const dist = Math.max(0.5, worker.distanceKm);
      const distanceScore = Math.max(2, Math.min(15, Math.round(15 - (dist - 0.5) * 2.2)));

      // 5. Reliability Score (max 15): Based on completed jobs & response speed
      const completedRatio = Math.min(10, (worker.completedJobs / 30));
      const speedScore = worker.responseTimeMinutes <= 15 ? 5 : 3;
      const reliabilityScore = Math.min(15, Math.round(completedRatio + speedScore));

      // 6. Rating Score (max 10)
      const ratingScore = Math.round((worker.rating / 5) * 10);

      // 7. Workload & Opportunity Balance (max 15):
      // Vital for Cooperatives: Prevents 1 worker taking all jobs while others starve
      let workloadBalanceScore = 15;
      if (worker.todayJobsCount === 0) workloadBalanceScore = 15; // High priority rotation
      else if (worker.todayJobsCount === 1) workloadBalanceScore = 13;
      else if (worker.todayJobsCount === 2) workloadBalanceScore = 10;
      else if (worker.todayJobsCount === 3) workloadBalanceScore = 7;
      else workloadBalanceScore = 4; // Overloaded, deprioritize slightly for fairness

      const totalScore = Math.min(
        99,
        Math.max(
          40,
          skillMatchScore +
            certificationScore +
            availabilityScore +
            distanceScore +
            reliabilityScore +
            ratingScore +
            workloadBalanceScore
        )
      );

      // Construct transparent SIH demo reasons
      const reasons: string[] = [];
      if (serviceMatch) reasons.push('Required skill & trade certification verified');
      if (worker.isVerified) reasons.push('Verified cooperative union member');
      if (criteria.isEmergency && worker.isEmergencyAvailable) {
        reasons.push('Certified for emergency immediate dispatch (< 15 mins)');
      } else if (worker.availabilityStatus === 'available') {
        reasons.push('Available now for instant doorstep arrival');
      }
      reasons.push(`Nearby (${worker.distanceKm} km away)`);
      if (worker.rating >= 4.8) reasons.push(`Exceptional customer trust (${worker.rating}★ rating)`);
      if (worker.todayJobsCount <= 2) reasons.push('Optimal cooperative workload rotation balance');

      const recommendationBadges: string[] = [];
      if (totalScore >= 88) recommendationBadges.push('Recommended by DailSmart AI');
      if (worker.isEmergencyAvailable) recommendationBadges.push('Emergency Ready');
      if (worker.todayJobsCount <= 1) recommendationBadges.push('Fair Share Allocation');

      return {
        worker,
        totalScore,
        breakdown: {
          skillMatchScore,
          certificationScore,
          availabilityScore,
          distanceScore,
          reliabilityScore,
          ratingScore,
          workloadBalanceScore,
        },
        isTopRecommendation: false,
        recommendationBadges,
        reasons,
      };
    });

    // Sort descending by FairRoute totalScore
    results.sort((a, b) => b.totalScore - a.totalScore);

    // Mark the top one
    if (results.length > 0) {
      results[0].isTopRecommendation = true;
      if (!results[0].recommendationBadges.includes('Recommended by DailSmart AI')) {
        results[0].recommendationBadges.unshift('Recommended by DailSmart AI');
      }
    }

    return results;
  }
}
