import { Service, Cooperative } from '../types';
import { services, serviceTypes, cooperatives, profiles, workers as mockWorkers, mockBookings, mockNotifications } from './mockData';

// Helper to map DB relation structure to our flat mock structure for the UI
function getMappedWorker(w: any) {
  const profile = profiles.find(p => p.id === w.profile_id);
  const coop = cooperatives.find(c => c.id === w.cooperative_id);
  
  return {
    ...w,
    name: profile?.full_name || 'Worker Name',
    avatar: profile?.avatar_url || 'https://i.pravatar.cc/150?img=51',
    city: profile?.city || w.city || 'Chittoor',
    state: profile?.state || w.state || 'Andhra Pradesh',
    cooperativeName: coop?.name || 'Verified Cooperative',
    role: w.professional_title,
    isVerified: w.verification_status === 'verified',
    verificationStatus: w.verification_status,
    skills: w.skills || [],
    languages: w.languages || ['Telugu', 'English'],
    availability: w.availability_status || 'available',
    price_per_visit: w.price_per_visit || 350,
    distance_km: w.distance_km || 1.8,
    rating: w.rating || 4.8,
    completed_jobs: w.completed_jobs || 140,
    experience_years: w.experience_years || 5
  };
}

export const api = {
  async getServices(): Promise<Service[]> {
    return services;
  },

  async getServiceBySlug(slug: string): Promise<Service | null> {
    return services.find(s => s.slug === slug) || null;
  },

  async getServiceById(id: string): Promise<Service | null> {
    return services.find(s => s.id === id) || null;
  },

  async getServiceTypes(serviceId: string): Promise<string[]> {
    return serviceTypes.filter(s => s.service_id === serviceId).map(s => s.name);
  },

  async getWorkers(): Promise<any[]> {
    return mockWorkers.map(getMappedWorker);
  },

  async getWorkerById(id: string): Promise<any | null> {
    const w = mockWorkers.find(w => w.id === id);
    return w ? getMappedWorker(w) : null;
  },

  async getWorkersByServiceId(serviceId: string): Promise<any[]> {
    return mockWorkers.filter(w => w.service_id === serviceId).map(getMappedWorker);
  },

  async getCooperatives(): Promise<Cooperative[]> {
    return cooperatives.map(c => ({ ...c, services: ['Plumbing', 'Electrical', 'Cleaning'] }));
  },

  async getCooperativeById(id: string): Promise<Cooperative | null> {
    const c = cooperatives.find(c => c.id === id);
    return c ? { ...c, services: ['Plumbing', 'Electrical', 'Cleaning'] } : null;
  },
  
  async getWorkersByCooperativeId(cooperativeId: string): Promise<any[]> {
    return mockWorkers.filter(w => w.cooperative_id === cooperativeId).map(getMappedWorker);
  },

  // BOOKINGS API
  async createBooking(bookingData: Partial<any>): Promise<any> {
    const worker = mockWorkers.find(w => w.id === bookingData.worker_id);
    const mappedWorker = worker ? getMappedWorker(worker) : null;
    const service = services.find(s => s.id === bookingData.service_id);
    const newBooking = {
      id: 'bk_' + Math.random().toString(36).substr(2, 7),
      ...bookingData,
      status: bookingData.status || 'requested',
      service_name: service?.name || 'Home Service',
      service: service || { id: bookingData.service_id, name: 'Home Service' },
      worker: mappedWorker,
      total_amount: bookingData.total_amount || 350,
      estimated_amount: bookingData.estimated_amount || 350,
      payment_method: bookingData.payment_method || 'UPI',
      payment_status: bookingData.payment_method === 'Cash' ? 'pending' : 'paid',
      created_at: new Date().toISOString()
    };
    mockBookings.unshift(newBooking);
    
    // Auto-add confirmation notification
    mockNotifications.unshift({
      id: 'n_' + Date.now(),
      type: 'booking_confirmed',
      title: 'Booking Confirmed!',
      message: `Your booking for ${service?.name || 'Service'} with ${mappedWorker?.name || 'Worker'} on ${bookingData.scheduled_date || 'date'} at ${bookingData.scheduled_start_time || 'time'} is confirmed. Estimated Cost: ₹${newBooking.total_amount}. Payment: ${newBooking.payment_method}.`,
      read: false,
      created_at: new Date().toISOString()
    });

    return newBooking;
  },

  async checkWorkerAvailability(_workerId: string, _date: string, _startTime: string): Promise<boolean> {
    return true; // Always available in mock
  },

  async getBookingsForCustomer(customerId: string): Promise<any[]> {
    return mockBookings
      .filter(b => b.customer_id === customerId || true) // Return all mockBookings for customer testing
      .map(b => {
        const worker = mockWorkers.find(w => w.id === b.worker_id);
        const service = services.find(s => s.id === b.service_id);
        return {
          ...b,
          worker: worker ? getMappedWorker(worker) : (b.worker || { name: 'Worker', role: 'Professional' }),
          service: service || b.service || { id: b.service_id, name: b.service_name || 'Home Service' }
        };
      });
  },

  async getBookingsForWorker(workerId: string): Promise<any[]> {
    return mockBookings
      .filter(b => b.worker_id === workerId || true) // Return all mockBookings for worker dashboard demo
      .map(b => {
        const worker = mockWorkers.find(w => w.id === b.worker_id);
        const service = services.find(s => s.id === b.service_id);
        const customer = profiles.find(p => p.id === b.customer_id);
        return {
          ...b,
          worker: worker ? getMappedWorker(worker) : b.worker,
          service: service || b.service || { id: b.service_id, name: b.service_name || 'Home Service' },
          customer: customer || { full_name: 'Anitha Rao', city: b.city || 'Chittoor' }
        };
      });
  },

  async getBookingsForCooperative(_cooperativeId: string): Promise<any[]> {
    return mockBookings;
  },

  async getCooperativeBookings(_cooperativeId: string): Promise<any[]> {
    return mockBookings;
  },

  async getCooperativeAuditLogs(_cooperativeId: string): Promise<any[]> {
    return [];
  },

  async getCustomerPayments(_customerId: string): Promise<any[]> {
    return [
      { id: 'pay_001', booking_id: 'bk001', amount: 350, service_name: 'Plumbing Service', status: 'completed', payment_status: 'paid', date: '2026-09-01' },
      { id: 'pay_002', booking_id: 'bk002', amount: 450, service_name: 'Electrical Work', status: 'completed', payment_status: 'paid', date: '2026-08-28' }
    ];
  },

  async getBookingStatusHistory(bookingId: string): Promise<any[]> {
    const booking = mockBookings.find(b => b.id === bookingId);
    const status = booking?.status || 'requested';
    
    const steps = [
      { id: 'h1', status: 'requested', created_at: new Date(Date.now() - 3600000).toISOString(), note: 'Customer requested service' },
    ];
    if (['accepted', 'on_the_way', 'started', 'completed'].includes(status)) {
      steps.push({ id: 'h2', status: 'accepted', created_at: new Date(Date.now() - 2700000).toISOString(), note: 'Worker accepted job request' });
    }
    if (['on_the_way', 'started', 'completed'].includes(status)) {
      steps.push({ id: 'h3', status: 'on_the_way', created_at: new Date(Date.now() - 1800000).toISOString(), note: 'Worker is on the way to location' });
    }
    if (['started', 'completed'].includes(status)) {
      steps.push({ id: 'h4', status: 'started', created_at: new Date(Date.now() - 900000).toISOString(), note: 'Service work started' });
    }
    if (status === 'completed') {
      steps.push({ id: 'h5', status: 'completed', created_at: new Date().toISOString(), note: 'Service marked complete' });
    }
    if (status === 'cancelled') {
      steps.push({ id: 'h_cancel', status: 'cancelled', created_at: new Date().toISOString(), note: 'Booking was cancelled' });
    }
    return steps;
  },

  async cancelBooking(bookingId: string, _userId?: string, _reason?: string): Promise<void> {
    const b = mockBookings.find(b => b.id === bookingId);
    if (b) {
      b.status = 'cancelled';
      mockNotifications.unshift({
        id: 'n_' + Date.now(),
        type: 'booking_confirmed',
        title: 'Booking Cancelled',
        message: `Booking #${bookingId.slice(0, 6)} has been cancelled.`,
        read: false,
        created_at: new Date().toISOString()
      });
    }
  },

  async processDemoPayment(bookingId: string, _userId?: string, amount?: number, paymentMethod?: string): Promise<any> {
    const b = mockBookings.find(b => b.id === bookingId);
    if (b) {
      b.payment_status = 'paid';
      b.payment_method = paymentMethod || 'UPI';
    }
    mockNotifications.unshift({
      id: 'n_' + Date.now(),
      type: 'payment_received',
      title: 'Payment Successful',
      message: `₹${amount || 350} received successfully via ${paymentMethod || 'UPI'}.`,
      read: false,
      created_at: new Date().toISOString()
    });
    return { success: true, transactionId: `TXN_${Date.now()}`, amount: amount || 350, paymentMethod };
  },

  async getFairWagePreview(_serviceId: string, _city: string): Promise<any> {
    return {
      minAmount: 300,
      maxAmount: 750,
      recommendedAmount: 450,
      worker_amount: 350,
      cooperative_amount: 40,
      platform_amount: 35,
      payment_fee: 18,
      platformFee: 25,
      welfareFee: 25,
      total_amount: 443,
      finalAmount: 443,
      demandLevel: 'high'
    };
  },

  async getBookingById(bookingId: string): Promise<any | null> {
    const b = mockBookings.find(b => b.id === bookingId);
    if (!b) return null;
    const worker = mockWorkers.find(w => w.id === b.worker_id);
    const mappedWorker = worker ? getMappedWorker(worker) : b.worker;
    const service = services.find(s => s.id === b.service_id);
    return {
      ...b,
      worker: mappedWorker,
      service: service || b.service || { id: b.service_id, name: b.service_name || 'Service' }
    };
  },

  async getPaymentByBookingId(bookingId: string): Promise<any | null> {
    const b = mockBookings.find(b => b.id === bookingId);
    return {
      id: `pay_${bookingId}`,
      booking_id: bookingId,
      amount: b?.total_amount || 350,
      status: b?.payment_status === 'paid' ? 'completed' : 'pending',
      payment_method: b?.payment_method || 'UPI',
      created_at: new Date().toISOString()
    };
  },

  async updateBookingStatus(bookingId: string, status: string, _updatedBy?: string, _note?: string): Promise<any> {
    const booking = mockBookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status;
      const statusTitles: Record<string, string> = {
        accepted: 'Booking Accepted',
        on_the_way: 'Worker On The Way',
        started: 'Service Started',
        completed: 'Service Completed',
        rejected: 'Booking Rejected',
        cancelled: 'Booking Cancelled'
      };
      const statusDescriptions: Record<string, string> = {
        accepted: 'Your worker has accepted the booking request.',
        on_the_way: 'Worker is traveling to your location.',
        started: 'Worker has arrived and started the service.',
        completed: 'Service has been successfully completed. Thank you!',
        rejected: 'The worker could not take this request.',
        cancelled: 'Your booking has been cancelled.'
      };
      mockNotifications.unshift({
        id: 'n_' + Date.now(),
        type: status === 'completed' ? 'booking_completed' : 'booking_confirmed',
        title: statusTitles[status] || `Status: ${status}`,
        message: statusDescriptions[status] || `Booking status changed to ${status}.`,
        read: false,
        created_at: new Date().toISOString()
      });
    }
    return booking;
  },

  async calculateFairWage(_serviceId: string, _city: string): Promise<any> {
    return { minAmount: 300, maxAmount: 800, recommendedAmount: 500, platformFee: 25, finalAmount: 525, metrics: { demandMultiplier: 1.2, costOfLiving: 1.0, complexityScore: 1.1 }, breakdown: { baseRate: 350, travelAllowance: 50, skillPremium: 100 } };
  },

  async matchWorker(_bookingId: string): Promise<any> {
    return { workerId: mockWorkers[0].id, matchScore: 95 };
  },

  async findBestMatches(_criteria: any): Promise<any[]> {
    return mockWorkers.map(getMappedWorker);
  },

  // WORKER DASHBOARD
  async updateWorkerAvailability(workerId: string, status: string): Promise<void> {
    const worker = mockWorkers.find(w => w.id === workerId);
    if (worker) worker.availability_status = status as any;
  },

  async getWorkerEarnings(_workerId: string): Promise<any> {
    return { completedServices: [], totalEarnings: 1500, thisMonthEarnings: 500, pendingEarnings: 0 };
  },

  // COOPERATIVE ADMIN API
  async getCooperativeDashboardStats(_cooperativeId: string): Promise<any> {
    return { activeWorkers: 10, pendingVerification: 2, activeBookings: 5, completedServices: 20, cooperativeEarnings: 5000, emergencyJobs: 1, healthScore: { workerParticipation: 92, verificationCoverage: 95, serviceCompletion: 98, satisfaction: 4.8, availability: 84 } };
  },

  async getCooperativeWorkers(cooperativeId: string): Promise<any[]> {
    return mockWorkers.filter(w => w.cooperative_id === cooperativeId).map(getMappedWorker);
  },

  async getVerificationQueue(_cooperativeId: string): Promise<any[]> {
    return mockWorkers.filter(w => w.verification_status === 'pending').map(getMappedWorker);
  },

  async processVerification(workerId: string, status: string, _notes?: string, _p4?: any, _p5?: any, _p6?: any): Promise<void> {
    const worker = mockWorkers.find(w => w.id === workerId);
    if (worker) worker.verification_status = status as any;
  },

  async verifyWorker(workerId: string, _notes: string): Promise<void> {
    const worker = mockWorkers.find(w => w.id === workerId);
    if (worker) worker.verification_status = 'verified';
  },

  // WELFARE API
  async getWorkerWelfare(_workerId?: string): Promise<any> {
    return { welfare_status: 'active' };
  },

  async getWorkerInsurance(_workerId?: string): Promise<any> {
    return { status: 'active' };
  },

  async getWelfareContributions(_workerId?: string): Promise<any[]> {
    return [
      { id: 'wf001', month: 'August 2026', amount: 250, status: 'contributed' },
      { id: 'wf002', month: 'July 2026', amount: 250, status: 'contributed' }
    ];
  },

  async getAvailableBenefits(_workerId?: string): Promise<any[]> {
    return [
      { id: 'b001', title: 'Health & Medical Insurance', status: 'enrolled', coverage: '₹2,00,000' },
      { id: 'b002', title: 'Accident Coverage', status: 'enrolled', coverage: '₹5,00,000' }
    ];
  },

  async applyForWelfare(_workerId?: string, _type?: string, _details?: any): Promise<void> { },
  async getTrainingRecommendations(_workerId?: string): Promise<any[]> { return []; },
  async getCooperativeWelfareStats(_cooperativeId?: string): Promise<any> { return { totalWorkers: 10, activeWelfare: 8, pendingWelfare: 1, notEnrolled: 1, activeProtection: 9 }; },
  async getProtectionGap(_cooperativeId?: string): Promise<any[]> { return []; },
  async getExpiringProtection(_cooperativeId?: string): Promise<any[]> { return []; },

  // NOTIFICATIONS
  async getUnreadNotifications(_userId?: string): Promise<any[]> {
    return mockNotifications.filter((n: any) => !n.read);
  },
  async getAllNotifications(): Promise<any[]> {
    return mockNotifications;
  },
  async markNotificationsRead(_userId?: string): Promise<void> {
    mockNotifications.forEach((n: any) => { n.read = true; });
  }
};
