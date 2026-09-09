// DailSmart Solutions - Core Mock Database & Demo Seed Data
// Comprehensive dataset for Smart India Hackathon 2026: 25+ Workers, Cooperatives, Bookings & System Metrics

export interface MockWorker {
  id: string;
  profile_id: string;
  cooperative_id: string;
  professional_title: string;
  experience_years: number;
  rating: number;
  completed_jobs: number;
  verification_status: 'verified' | 'pending' | 'rejected';
  availability_status: 'available' | 'busy' | 'offline';
  service_id: string;
  skills: string[];
  languages: string[];
  price_per_visit: number;
  distance_km: number;
  is_emergency_available: boolean;
  today_jobs_count: number;
  response_time_minutes: number;
  certifications_count: number;
  cooperative_name?: string;
  avatar_url?: string;
  full_name?: string;
  phone?: string;
  city?: string;
  state?: string;
}

export const services = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Plumbing', slug: 'plumbing', description: 'Find verified cooperative plumbers for tap, pipe leaks and sanitation.', category: 'repair', icon: 'Wrench', active: true },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Electrical', slug: 'electrical', description: 'Certified electricians for house wiring, switches, short circuits & MCB.', category: 'repair', icon: 'Zap', active: true },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Carpentry', slug: 'carpentry', description: 'Skilled carpenters for custom woodwork, door repairs and locks.', category: 'repair', icon: 'Hammer', active: true },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Painting', slug: 'painting', description: 'Professional painters for interior, exterior coating and putty works.', category: 'home', icon: 'Paintbrush', active: true },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Cleaning', slug: 'cleaning', description: 'Thorough deep cleaning, sanitization and kitchen care.', category: 'home', icon: 'Sparkles', active: true },
  { id: '66666666-6666-6666-6666-666666666666', name: 'Caregiving', slug: 'caregiving', description: 'Compassionate verified caregivers for elders and post-op patients.', category: 'care', icon: 'Heart', active: true },
  { id: '77777777-7777-7777-7777-777777777777', name: 'Gardening', slug: 'gardening', description: 'Expert gardening, landscaping and outdoor plant maintenance.', category: 'outdoor', icon: 'TreePine', active: true },
  { id: '88888888-8888-8888-8888-888888888888', name: 'Driving', slug: 'driving', description: 'Experienced background-checked drivers for city and highway transit.', category: 'transport', icon: 'Car', active: true },
  { id: '99999999-9999-9999-9999-999999999999', name: 'AC/Appliance Repair', slug: 'technical', description: 'Expert technician support for AC servicing, refrigerators & washing machines.', category: 'technical', icon: 'MonitorSmartphone', active: true },
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Domestic Help', slug: 'domestic', description: 'Daily household assistance from registered labour union helpers.', category: 'home', icon: 'Users', active: true },
];

export const serviceTypes = [
  { service_id: '11111111-1111-1111-1111-111111111111', name: 'Tap Repair' },
  { service_id: '11111111-1111-1111-1111-111111111111', name: 'Pipe Repair' },
  { service_id: '11111111-1111-1111-1111-111111111111', name: 'Leakage Repair' },
  { service_id: '11111111-1111-1111-1111-111111111111', name: 'Drain Cleaning' },
  { service_id: '22222222-2222-2222-2222-222222222222', name: 'Fan Repair' },
  { service_id: '22222222-2222-2222-2222-222222222222', name: 'Wiring' },
  { service_id: '33333333-3333-3333-3333-333333333333', name: 'Furniture Repair' },
  { service_id: '33333333-3333-3333-3333-333333333333', name: 'Custom Furniture' },
  { service_id: '44444444-4444-4444-4444-444444444444', name: 'Wall Painting' },
  { service_id: '55555555-5555-5555-5555-555555555555', name: 'Home Cleaning' },
  { service_id: '55555555-5555-5555-5555-555555555555', name: 'Deep Cleaning' },
  { service_id: '66666666-6666-6666-6666-666666666666', name: 'Elder Care' },
  { service_id: '66666666-6666-6666-6666-666666666666', name: 'Patient Support' },
  { service_id: '77777777-7777-7777-7777-777777777777', name: 'Garden Maintenance' },
  { service_id: '88888888-8888-8888-8888-888888888888', name: 'Personal Driver' },
  { service_id: '99999999-9999-9999-9999-999999999999', name: 'Appliance Repair' },
  { service_id: '99999999-9999-9999-9999-999999999999', name: 'AC Service' },
  { service_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Kitchen Assistance' },
];

export const cooperatives = [
  { id: 'c1111111-1111-1111-1111-111111111111', name: 'Chittoor Skilled Workers Cooperative', city: 'Chittoor', district: 'Chittoor', state: 'Andhra Pradesh', verification_status: 'verified', worker_count: 142, rating: 4.9 },
  { id: 'c2222222-2222-2222-2222-222222222222', name: 'Tirupati Community Services Cooperative', city: 'Tirupati', district: 'Tirupati', state: 'Andhra Pradesh', verification_status: 'verified', worker_count: 118, rating: 4.8 },
  { id: 'c3333333-3333-3333-3333-333333333333', name: 'Bengaluru Technical Workers Cooperative', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', verification_status: 'verified', worker_count: 240, rating: 4.9 },
  { id: 'c4444444-4444-4444-4444-444444444444', name: 'Hyderabad Domestic Help Union', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', verification_status: 'verified', worker_count: 180, rating: 4.7 },
  { id: 'c5555555-5555-5555-5555-555555555555', name: 'Chennai Caregivers Cooperative', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', verification_status: 'verified', worker_count: 95, rating: 4.9 },
  { id: 'c6666666-6666-6666-6666-666666666666', name: 'Visakhapatnam Port Artisans Union', city: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh', verification_status: 'pending', worker_count: 52, rating: 4.5 },
];

export const profiles = [
  { id: 'w1111111-1111-1111-1111-111111111111', full_name: 'Surya Prakash', email: 'surya@coopserve.local', role: 'worker', city: 'Chittoor', state: 'Andhra Pradesh', avatar_url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300' },
  { id: 'w2222222-2222-2222-2222-222222222222', full_name: 'Rajesh Sharma', email: 'rajesh@coopserve.local', role: 'worker', city: 'Tirupati', state: 'Andhra Pradesh', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
  { id: 'w3333333-3333-3333-3333-333333333333', full_name: 'Lakshmi Devi', email: 'lakshmi@coopserve.local', role: 'worker', city: 'Tirupati', state: 'Andhra Pradesh', avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300' },
  { id: 'w4444444-4444-4444-4444-444444444444', full_name: 'Venkat Reddy', email: 'venkat@coopserve.local', role: 'worker', city: 'Chittoor', state: 'Andhra Pradesh', avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300' },
  { id: 'w5555555-5555-5555-5555-555555555555', full_name: 'Suresh Patil', email: 'suresh@coopserve.local', role: 'worker', city: 'Tirupati', state: 'Andhra Pradesh', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' },
  { id: 'c1111111-1111-1111-1111-customer11111', full_name: 'Anitha Rao', email: 'customer@dailsmart.in', role: 'customer', city: 'Chittoor', state: 'Andhra Pradesh', avatar_url: null },
  { id: 'c2222222-2222-2222-2222-customer22222', full_name: 'Ravi Krishna', email: 'ravi@example.com', role: 'customer', city: 'Tirupati', state: 'Andhra Pradesh', avatar_url: null },
  { id: 'a1111111-1111-1111-1111-admin1111111', full_name: 'Cooperative Administrator', email: 'admin@dailsmart.in', role: 'platform_admin', city: 'Chittoor', state: 'Andhra Pradesh', avatar_url: null },
];

export const workers: MockWorker[] = [
  // 1. Surya Prakash - Master Plumber (Hero Demo Profile)
  {
    id: 'ww111111-1111-1111-1111-111111111111',
    profile_id: 'w1111111-1111-1111-1111-111111111111',
    full_name: 'Surya Prakash',
    phone: '+91 98480 22334',
    city: 'Chittoor',
    state: 'Andhra Pradesh',
    avatar_url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300',
    cooperative_id: 'c1111111-1111-1111-1111-111111111111',
    cooperative_name: 'Chittoor Skilled Workers Cooperative',
    professional_title: 'Master Plumber',
    experience_years: 8,
    rating: 4.9,
    completed_jobs: 342,
    verification_status: 'verified',
    availability_status: 'available',
    service_id: '11111111-1111-1111-1111-111111111111',
    skills: ['Tap Repair', 'Pipe Burst Fix', 'Leakage Detection', 'Drain Cleaning', 'Solar Geyser Piping'],
    languages: ['Telugu', 'English', 'Hindi'],
    price_per_visit: 350,
    distance_km: 1.2,
    is_emergency_available: true,
    today_jobs_count: 1,
    response_time_minutes: 10,
    certifications_count: 3
  },
  // 2. Rajesh Sharma - Master Electrician
  {
    id: 'ww222222-2222-2222-2222-222222222222',
    profile_id: 'w2222222-2222-2222-2222-222222222222',
    full_name: 'Rajesh Sharma',
    phone: '+91 94401 55667',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    cooperative_id: 'c2222222-2222-2222-2222-222222222222',
    cooperative_name: 'Tirupati Community Services Cooperative',
    professional_title: 'Expert Electrician',
    experience_years: 11,
    rating: 4.8,
    completed_jobs: 490,
    verification_status: 'verified',
    availability_status: 'available',
    service_id: '22222222-2222-2222-2222-222222222222',
    skills: ['House Wiring', 'MCB Tripping Fix', 'Inverter Wiring', 'Short Circuit Clearance'],
    languages: ['Telugu', 'Hindi', 'English'],
    price_per_visit: 400,
    distance_km: 1.8,
    is_emergency_available: true,
    today_jobs_count: 0,
    response_time_minutes: 12,
    certifications_count: 4
  },
  // 3. Lakshmi Devi - Senior Caregiver
  {
    id: 'ww333333-3333-3333-3333-333333333333',
    profile_id: 'w3333333-3333-3333-3333-333333333333',
    full_name: 'Lakshmi Devi',
    phone: '+91 97012 34890',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    cooperative_id: 'c2222222-2222-2222-2222-222222222222',
    cooperative_name: 'Tirupati Community Services Cooperative',
    professional_title: 'Certified Senior Caregiver',
    experience_years: 6,
    rating: 4.9,
    completed_jobs: 178,
    verification_status: 'verified',
    availability_status: 'available',
    service_id: '66666666-6666-6666-6666-666666666666',
    skills: ['Elder Daily Assistance', 'Vital Signs Monitoring', 'Patient Post-Op Care', 'Medication Management'],
    languages: ['Telugu', 'Tamil', 'English'],
    price_per_visit: 500,
    distance_km: 2.1,
    is_emergency_available: false,
    today_jobs_count: 1,
    response_time_minutes: 20,
    certifications_count: 2
  },
  // 4. Venkat Reddy - Expert Plumber
  {
    id: 'ww444444-4444-4444-4444-444444444444',
    profile_id: 'w4444444-4444-4444-4444-444444444444',
    full_name: 'Venkat Reddy',
    phone: '+91 99881 22334',
    city: 'Chittoor',
    state: 'Andhra Pradesh',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    cooperative_id: 'c1111111-1111-1111-1111-111111111111',
    cooperative_name: 'Chittoor Skilled Workers Cooperative',
    professional_title: 'Senior Sanitary Plumber',
    experience_years: 7,
    rating: 4.7,
    completed_jobs: 260,
    verification_status: 'verified',
    availability_status: 'available',
    service_id: '11111111-1111-1111-1111-111111111111',
    skills: ['Pipe Leakage', 'Overhead Tank Fitting', 'Bathroom Clog Removal', 'Submersible Pump'],
    languages: ['Telugu', 'English'],
    price_per_visit: 350,
    distance_km: 2.4,
    is_emergency_available: true,
    today_jobs_count: 2,
    response_time_minutes: 15,
    certifications_count: 2
  },
  // 5. Suresh Patil - Plumber (Tirupati)
  {
    id: 'ww555555-5555-5555-5555-555555555555',
    profile_id: 'w5555555-5555-5555-5555-555555555555',
    full_name: 'Suresh Patil',
    phone: '+91 91234 56701',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    cooperative_id: 'c2222222-2222-2222-2222-222222222222',
    cooperative_name: 'Tirupati Community Services Cooperative',
    professional_title: 'Plumbing Specialist',
    experience_years: 5,
    rating: 4.8,
    completed_jobs: 194,
    verification_status: 'verified',
    availability_status: 'available',
    service_id: '11111111-1111-1111-1111-111111111111',
    skills: ['Kitchen Pipe Jointing', 'Drainage Unclog', 'Bathroom Fittings'],
    languages: ['Telugu', 'Kannada'],
    price_per_visit: 320,
    distance_km: 3.2,
    is_emergency_available: true,
    today_jobs_count: 0,
    response_time_minutes: 14,
    certifications_count: 2
  },
  // 6. Meena Kumari - Housekeeping & Deep Clean
  {
    id: 'ww666666-6666-6666-6666-666666666666',
    profile_id: 'w6666666-6666-6666-6666-666666666666',
    full_name: 'Meena Kumari',
    phone: '+91 98765 43219',
    city: 'Hyderabad',
    state: 'Telangana',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    cooperative_id: 'c4444444-4444-4444-4444-444444444444',
    cooperative_name: 'Hyderabad Domestic Help Union',
    professional_title: 'Professional Housekeeper',
    experience_years: 5,
    rating: 4.9,
    completed_jobs: 310,
    verification_status: 'verified',
    availability_status: 'available',
    service_id: '55555555-5555-5555-5555-555555555555',
    skills: ['Deep Home Cleaning', 'Kitchen Chimney Degreasing', 'Disinfection'],
    languages: ['Telugu', 'Hindi', 'English'],
    price_per_visit: 300,
    distance_km: 0.9,
    is_emergency_available: false,
    today_jobs_count: 1,
    response_time_minutes: 25,
    certifications_count: 2
  },
  // 7. Ramesh Babu - Appliance Technician
  {
    id: 'ww777777-7777-7777-7777-777777777777',
    profile_id: 'w7777777-7777-7777-7777-777777777777',
    full_name: 'Ramesh Babu',
    phone: '+91 99441 12233',
    city: 'Bengaluru',
    state: 'Karnataka',
    avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300',
    cooperative_id: 'c3333333-3333-3333-3333-333333333333',
    cooperative_name: 'Bengaluru Technical Workers Cooperative',
    professional_title: 'AC & Appliance Technician',
    experience_years: 9,
    rating: 4.8,
    completed_jobs: 520,
    verification_status: 'verified',
    availability_status: 'available',
    service_id: '99999999-9999-9999-9999-999999999999',
    skills: ['Split AC Gas Filling', 'Compressor Diagnostic', 'Refrigerator Cooling', 'Microwave Repair'],
    languages: ['Kannada', 'Telugu', 'English', 'Hindi'],
    price_per_visit: 450,
    distance_km: 2.8,
    is_emergency_available: true,
    today_jobs_count: 1,
    response_time_minutes: 18,
    certifications_count: 3
  },
  // 8. Raju Naidu - Carpenter
  {
    id: 'ww888888-8888-8888-8888-888888888888',
    profile_id: 'w8888888-8888-8888-8888-888888888888',
    full_name: 'Raju Naidu',
    phone: '+91 98850 77889',
    city: 'Chittoor',
    state: 'Andhra Pradesh',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    cooperative_id: 'c1111111-1111-1111-1111-111111111111',
    cooperative_name: 'Chittoor Skilled Workers Cooperative',
    professional_title: 'Master Carpenter',
    experience_years: 12,
    rating: 4.8,
    completed_jobs: 630,
    verification_status: 'verified',
    availability_status: 'available',
    service_id: '33333333-3333-3333-3333-333333333333',
    skills: ['Door Lock Replacement', 'Hinges Alignment', 'Furniture Restoration', 'Modular Kitchen Cabinets'],
    languages: ['Telugu', 'English'],
    price_per_visit: 380,
    distance_km: 1.5,
    is_emergency_available: true,
    today_jobs_count: 0,
    response_time_minutes: 15,
    certifications_count: 3
  },
  // 9. Padmavathi Rao - Professional Painter
  {
    id: 'ww999999-9999-9999-9999-999999999999',
    profile_id: 'w9999999-9999-9999-9999-999999999999',
    full_name: 'Padmavathi Rao',
    phone: '+91 96550 44332',
    city: 'Chittoor',
    state: 'Andhra Pradesh',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
    cooperative_id: 'c1111111-1111-1111-1111-111111111111',
    cooperative_name: 'Chittoor Skilled Workers Cooperative',
    professional_title: 'Master Wall Painter',
    experience_years: 7,
    rating: 4.6,
    completed_jobs: 215,
    verification_status: 'verified',
    availability_status: 'available',
    service_id: '44444444-4444-4444-4444-444444444444',
    skills: ['Wall Putty Smoothing', 'Waterproof Damp Coating', 'Interior Emulsion', 'Texture Design'],
    languages: ['Telugu', 'Kannada'],
    price_per_visit: 420,
    distance_km: 4.0,
    is_emergency_available: false,
    today_jobs_count: 1,
    response_time_minutes: 30,
    certifications_count: 2
  },
  // 10. Pending Verification Worker - Mahesh Babu (Plumber)
  {
    id: 'wwffffff-ffff-ffff-ffff-ffffffffffff',
    profile_id: 'wfffffff-ffff-ffff-ffff-ffffffffffff',
    full_name: 'Mahesh Babu Varma',
    phone: '+91 96521 77881',
    city: 'Chittoor',
    state: 'Andhra Pradesh',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    cooperative_id: 'c1111111-1111-1111-1111-111111111111',
    cooperative_name: 'Chittoor Skilled Workers Cooperative',
    professional_title: 'Apprentice Plumber',
    experience_years: 3,
    rating: 4.3,
    completed_jobs: 24,
    verification_status: 'pending',
    availability_status: 'available',
    service_id: '11111111-1111-1111-1111-111111111111',
    skills: ['PVC Pipe Joining', 'Washbasin Installation'],
    languages: ['Telugu'],
    price_per_visit: 280,
    distance_km: 3.8,
    is_emergency_available: false,
    today_jobs_count: 0,
    response_time_minutes: 30,
    certifications_count: 1
  },
  // 11. Pending Verification Worker - Sunita Rani (Electrician)
  {
    id: 'ww101010-1010-1010-1010-101010101010',
    profile_id: 'w1010101-1010-1010-1010-101010101010',
    full_name: 'Sunita Rani',
    phone: '+91 94901 88776',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    cooperative_id: 'c2222222-2222-2222-2222-222222222222',
    cooperative_name: 'Tirupati Community Services Cooperative',
    professional_title: 'Certified Electrician (ITI)',
    experience_years: 4,
    rating: 4.5,
    completed_jobs: 38,
    verification_status: 'pending',
    availability_status: 'available',
    service_id: '22222222-2222-2222-2222-222222222222',
    skills: ['Solar Panel Inverter', 'Appliance Earthing', 'Wiring Repair'],
    languages: ['Telugu', 'English'],
    price_per_visit: 380,
    distance_km: 2.2,
    is_emergency_available: true,
    today_jobs_count: 0,
    response_time_minutes: 15,
    certifications_count: 2
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'bk001',
    customer_id: 'c1111111-1111-1111-1111-customer11111',
    customer_name: 'Anitha Rao',
    customer_phone: '+91 98765 43210',
    worker_id: 'ww111111-1111-1111-1111-111111111111',
    worker_name: 'Surya Prakash',
    worker_phone: '+91 98480 22334',
    service_id: '11111111-1111-1111-1111-111111111111',
    service_name: 'Plumbing Service',
    status: 'completed',
    scheduled_date: '2026-08-28',
    scheduled_start_time: '10:00 AM',
    service_address: '12, Gandhi Nagar, Chittoor',
    city: 'Chittoor',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    total_amount: 350,
    estimated_amount: 350,
    payment_method: 'UPI',
    payment_status: 'paid',
    customer_notes: 'Bathroom tap leaking continuously',
    created_at: '2026-08-27T08:00:00Z',
    is_emergency: false
  },
  {
    id: 'bk002',
    customer_id: 'c1111111-1111-1111-1111-customer11111',
    customer_name: 'Anitha Rao',
    customer_phone: '+91 98765 43210',
    worker_id: 'ww222222-2222-2222-2222-222222222222',
    worker_name: 'Rajesh Sharma',
    worker_phone: '+91 94401 55667',
    service_id: '22222222-2222-2222-2222-222222222222',
    service_name: 'Electrical Inspection',
    status: 'on_the_way',
    scheduled_date: '2026-09-08',
    scheduled_start_time: '11:30 AM',
    service_address: '24, Balaji Colony, Tirupati',
    city: 'Tirupati',
    district: 'Tirupati',
    state: 'Andhra Pradesh',
    total_amount: 400,
    estimated_amount: 400,
    payment_method: 'UPI',
    payment_status: 'pending',
    customer_notes: 'Main distribution board circuit breaker tripping',
    created_at: '2026-09-08T05:30:00Z',
    is_emergency: false
  },
  {
    id: 'bk003',
    customer_id: 'c2222222-2222-2222-2222-customer22222',
    customer_name: 'Ravi Krishna',
    customer_phone: '+91 91234 56789',
    worker_id: 'ww111111-1111-1111-1111-111111111111',
    worker_name: 'Surya Prakash',
    worker_phone: '+91 98480 22334',
    service_id: '11111111-1111-1111-1111-111111111111',
    service_name: 'Emergency Pipe Burst Repair',
    status: 'requested',
    scheduled_date: '2026-09-08',
    scheduled_start_time: 'Immediate',
    service_address: '8, High School Road, Chittoor',
    city: 'Chittoor',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    total_amount: 600,
    estimated_amount: 600,
    payment_method: 'UPI',
    payment_status: 'pending',
    customer_notes: 'Urgent main water supply pipe burst in bathroom area!',
    created_at: '2026-09-08T04:15:00Z',
    is_emergency: true
  }
];

export function getPersistedBookings(): any[] {
  try {
    const s = localStorage.getItem('dailsmart_bookings');
    if (s) return JSON.parse(s);
  } catch { /* ignore */ }
  return INITIAL_BOOKINGS;
}

export function savePersistedBookings(b: any[]) {
  try {
    localStorage.setItem('dailsmart_bookings', JSON.stringify(b));
  } catch { /* ignore */ }
}

export const mockBookings = getPersistedBookings();

export const mockWelfare = [
  {
    id: 'wf001',
    worker_id: 'ww111111-1111-1111-1111-111111111111',
    month: '2026-08',
    total_jobs: 24,
    total_earnings: 14850,
    coop_contribution: 742.5,
    welfare_balance: 3250,
    status: 'credited'
  }
];

export const mockInsurance = [
  {
    id: 'ins001',
    worker_id: 'ww111111-1111-1111-1111-111111111111',
    policy_type: 'Accident Cover',
    policy_provider: 'LIC of India (Cooperative Scheme)',
    policy_number: 'LIC-COOP-2026-8812',
    coverage_amount: 500000,
    valid_till: '2027-08-31',
    status: 'active'
  },
  {
    id: 'ins002',
    worker_id: 'ww111111-1111-1111-1111-111111111111',
    policy_type: 'Health & Hospitalization',
    policy_provider: 'National Insurance Company',
    policy_number: 'NIC-HLTH-2026-4401',
    coverage_amount: 200000,
    valid_till: '2027-08-31',
    status: 'active'
  }
];

export const mockNotifications = [
  { id: 'n001', type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your plumbing service booking on Sep 8, 10:00 AM has been confirmed.', read: false, created_at: '2026-09-08T07:05:00Z' },
  { id: 'n002', type: 'worker_assigned', title: 'Worker Assigned', message: 'Surya Prakash (Master Plumber) has been assigned to your booking.', read: false, created_at: '2026-09-08T07:06:00Z' },
  { id: 'n003', type: 'booking_completed', title: 'Service Completed', message: 'Your plumbing service on Aug 28 has been marked as completed. Please rate your experience.', read: true, created_at: '2026-08-28T14:30:00Z' },
  { id: 'n004', type: 'payment_received', title: 'Payment Received', message: 'Payment of ₹350 received for booking #bk001.', read: true, created_at: '2026-08-28T15:00:00Z' },
  { id: 'n005', type: 'new_job', title: 'New Job Request', message: 'You have a new plumbing request from Anitha Rao.', read: false, created_at: '2026-09-08T06:00:00Z' },
];

export const mockTestimonials = [
  {
    id: 't001',
    name: 'Anitha Lakshmi',
    city: 'Chittoor, Andhra Pradesh',
    rating: 5,
    service: 'Plumbing',
    review: 'Surya Prakash fixed our pipeline leakage within 30 minutes. Cooperative-verified, respectful, and zero hidden costs. DailSmart Solutions is truly a game changer!',
    avatar: 'AL',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 't002',
    name: 'Ravi Krishna',
    city: 'Tirupati, Andhra Pradesh',
    rating: 5,
    service: 'Electrical',
    review: 'The electrician arrived on time, was fully certified with ITI credentials, and explained the safety grounding clearly. Honest and fair cooperative rates.',
    avatar: 'RK',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 't003',
    name: 'Padma Devi',
    city: 'Nellore, Andhra Pradesh',
    rating: 5,
    service: 'Caregiving',
    review: 'Lakshmi Devi took exceptional care of my mother. Cooperative verification and background check gave my family complete peace of mind.',
    avatar: 'PD',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    id: 't004',
    name: 'Srinivas Reddy',
    city: 'Bengaluru, Karnataka',
    rating: 5,
    service: 'Deep Cleaning',
    review: 'Outstanding service. Transparent digital payment, no haggling, and I love that 90% of earnings go straight to the workers and their cooperative welfare pool.',
    avatar: 'SR',
    color: 'bg-amber-100 text-amber-700',
  },
];

export const adminStats = {
  totalCustomers: 4872,
  totalWorkers: 1246,
  verifiedWorkers: 1180,
  totalCooperatives: 38,
  totalBookings: 18934,
  activeBookings: 247,
  totalPayments: 7834200,
  workerEarnings: 7050780,
  welfarePool: 391710,
  pendingPayments: 124500,
  openComplaints: 14,
  resolvedComplaints: 912,
  emergencyRequests: 18,
  pendingVerifications: 34,
};

export const aiInsightsData = {
  demandForecast: [
    { service: 'Electrical', demand: 92, trend: 'up', area: 'Chittoor South', date: 'Sep 8–10' },
    { service: 'Plumbing', demand: 78, trend: 'up', area: 'Tirupati East', date: 'Sep 8–10' },
    { service: 'Cleaning', demand: 65, trend: 'stable', area: 'Bengaluru Sarjapur', date: 'Sep 8–11' },
    { service: 'Caregiving', demand: 55, trend: 'down', area: 'Hyderabad Central', date: 'Sep 8–9' },
  ],
  busyAreas: [
    { area: 'Chittoor South', bookings: 43, workers_available: 8, status: 'high_demand' },
    { area: 'Tirupati East', bookings: 37, workers_available: 12, status: 'normal' },
    { area: 'Bengaluru Sarjapur', bookings: 29, workers_available: 5, status: 'understaffed' },
    { area: 'Hyderabad Central', bookings: 18, workers_available: 9, status: 'normal' },
  ],
  workerRecommendations: [
    { service: 'Electrical', current_workers: 8, recommended: 14, shortage: 6 },
    { service: 'Plumbing', current_workers: 11, recommended: 18, shortage: 7 },
    { service: 'Cleaning', current_workers: 5, recommended: 12, shortage: 7 },
    { service: 'Caregiving', current_workers: 9, recommended: 10, shortage: 1 },
  ],
  suggestedAssignments: [
    { booking_id: 'bk003', customer: 'Ravi Krishna', service: 'Plumbing', suggested_worker: 'Surya Prakash', reason: 'Best rated, emergency certified, 1.2 km away', confidence: 96 },
    { booking_id: 'bk002', customer: 'Anitha Rao', service: 'Electrical', suggested_worker: 'Rajesh Sharma', reason: 'ITI Master, 1.8 km away, zero jobs today', confidence: 92 },
  ],
};

export const mockAdminUsers = [
  { id: 'u001', full_name: 'Anitha Rao', email: 'customer@dailsmart.in', phone: '+91 98765 43210', role: 'customer', city: 'Chittoor', state: 'Andhra Pradesh', status: 'active', joined: '2026-07-12' },
  { id: 'u002', full_name: 'Ravi Krishna', email: 'ravi@example.com', phone: '+91 91234 56789', role: 'customer', city: 'Tirupati', state: 'Andhra Pradesh', status: 'active', joined: '2026-06-20' },
  { id: 'u003', full_name: 'Surya Prakash', email: 'surya@coopserve.local', phone: '+91 98480 22334', role: 'worker', city: 'Chittoor', state: 'Andhra Pradesh', status: 'active', joined: '2026-04-05' },
  { id: 'u004', full_name: 'Rajesh Sharma', email: 'rajesh@coopserve.local', phone: '+91 94401 55667', role: 'worker', city: 'Tirupati', state: 'Andhra Pradesh', status: 'active', joined: '2026-05-18' },
  { id: 'u005', full_name: 'Mahesh Babu Varma', email: 'mahesh@coopserve.local', phone: '+91 96521 77881', role: 'worker', city: 'Chittoor', state: 'Andhra Pradesh', status: 'pending_verification', joined: '2026-09-07' },
  { id: 'u006', full_name: 'Cooperative Manager AP', email: 'admin@dailsmart.in', phone: '+91 98000 00001', role: 'cooperative_admin', city: 'Chittoor', state: 'Andhra Pradesh', status: 'active', joined: '2026-02-14' },
];

export const mockDisputes = [
  { id: 'd001', booking_id: 'bk001', customer: 'Anitha Rao', worker: 'Surya Prakash', issue: 'Clarification regarding extra pipe seal material', status: 'resolved', created_at: '2026-09-01' },
];

export const mockAuditLog = [
  { id: 'al001', action: 'Worker Verified', performed_by: 'Cooperative Manager AP', target: 'Surya Prakash', timestamp: '2026-09-04T09:30:00Z', details: 'Skill certification & background check verified' },
  { id: 'al002', action: 'Welfare Disbursed', performed_by: 'Cooperative Command Center', target: 'Chittoor Welfare Pool', timestamp: '2026-09-03T14:00:00Z', details: 'Monthly accident & health policy premium paid' },
  { id: 'al003', action: 'Cooperative Verified', performed_by: 'Platform Admin', target: 'Chittoor Skilled Workers Cooperative', timestamp: '2026-09-02T11:00:00Z', details: 'Registration certificate verified' },
  { id: 'al004', action: 'Emergency Request Handled', performed_by: 'FairRoute AI Dispatcher', target: 'Customer Ravi Krishna', timestamp: '2026-09-04T06:45:00Z', details: 'Plumber dispatched in 8 mins' },
];
