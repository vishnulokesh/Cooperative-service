export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'worker' | 'admin';
  createdAt: string;
}

export interface Worker {
  id: string;
  userId: string;
  name: string;
  role: string;
  cooperativeId: string;
  cooperativeName: string;
  skills: string[];
  experienceYears: number;
  rating: number;
  isVerified: boolean;
  jobsCompleted: number;
  avatar: string;
  primarySkill: string;
  availability: string;
  languages: string[];
}

export interface Cooperative {
  id: string;
  name: string;
  location?: string;
  city?: string;
  district?: string;
  state?: string;
  verifiedWorkers?: number;
  worker_count?: number;
  registration_number?: string;
  total_members?: number;
  verification_status?: string;
  establishedDate?: string;
  rating: number;
  services: string[];
}

export interface Service {
  id: string;
  name: string;
  slug?: string;
  category: string;
  basePrice?: number;
  description: string;
  icon?: string;
  active?: boolean;
}

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customer_id: string;
  worker_id: string;
  service_id: string;
  service_type_id?: string;
  cooperative_id: string;
  
  service_address: string;
  city: string;
  district: string;
  state: string;
  
  scheduled_date: string;
  scheduled_start_time: string;
  scheduled_end_time?: string;
  
  customer_notes?: string;
  estimated_amount?: number;
  
  status: BookingStatus;
  cancellation_reason?: string;
  
  created_at: string;
  updated_at: string;
  
  // Joined fields for UI convenience
  worker?: any;
  customer?: any;
  service?: Service;
  cooperative?: Cooperative;
}

export interface BookingStatusHistory {
  id: string;
  booking_id: string;
  status: BookingStatus;
  changed_by: string;
  note?: string;
  created_at: string;
}

export interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
