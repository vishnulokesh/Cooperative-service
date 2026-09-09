import type { Service, Cooperative, Worker } from '../types';

export const mockCategories = ['All', 'Home', 'Repair', 'Care', 'Outdoor', 'Transport', 'Technical'];

export const mockServices: Service[] = [
  { id: 'plumbing', name: 'Plumbing', category: 'Home / Repair', basePrice: 500, description: 'Find verified cooperative plumbers for your home and community needs.' },
  { id: 'electrical', name: 'Electrical', category: 'Home / Repair', basePrice: 400, description: 'Find verified electricians for safe and reliable electrical work.' },
  { id: 'carpentry', name: 'Carpentry', category: 'Home / Repair', basePrice: 600, description: 'Skilled carpenters for custom furniture and repair works.' },
  { id: 'painting', name: 'Painting', category: 'Home', basePrice: 2000, description: 'Professional painters for your home and office.' },
  { id: 'cleaning', name: 'Cleaning', category: 'Home', basePrice: 800, description: 'Thorough cleaning services for homes and communities.' },
  { id: 'caregiving', name: 'Caregiving', category: 'Care', basePrice: 1200, description: 'Compassionate caregivers for your loved ones.' },
  { id: 'gardening', name: 'Gardening', category: 'Outdoor', basePrice: 700, description: 'Expert gardening and landscaping services.' },
  { id: 'driving', name: 'Driving', category: 'Transport', basePrice: 1000, description: 'Professional drivers for local and outstation trips.' },
  { id: 'technical', name: 'Technical Services', category: 'Technical / Repair', basePrice: 900, description: 'Reliable repair for appliances and equipment.' },
  { id: 'domestic', name: 'Domestic Help', category: 'Home', basePrice: 15000, description: 'Trusted daily household assistance.' }
];

export const mockSubServices: Record<string, string[]> = {
  plumbing: ['Tap repair', 'Pipe repair', 'Leakage repair', 'Drain cleaning', 'Water tank installation', 'Emergency Plumbing'],
  electrical: ['Fan repair', 'Switch/socket repair', 'Wiring', 'Appliance installation', 'Electrical inspection'],
  carpentry: ['Furniture repair', 'Door repair', 'Custom furniture', 'Shelf installation'],
  painting: ['Wall painting', 'Exterior painting', 'Touch-up work', 'Waterproofing'],
  cleaning: ['Home cleaning', 'Deep cleaning', 'Office cleaning', 'Community cleaning'],
  caregiving: ['Elder care', 'Daily assistance', 'Patient support', 'Companion care'],
  gardening: ['Garden maintenance', 'Plant care', 'Lawn maintenance', 'Landscaping'],
  driving: ['Personal driver', 'Local trips', 'Institutional transport'],
  technical: ['Appliance repair', 'Equipment maintenance', 'Basic electronics support'],
  domestic: ['Household assistance', 'Kitchen assistance', 'Daily home support']
};

export const mockCooperatives: Cooperative[] = [
  { id: 'c1', name: 'Chittoor Skilled Workers Cooperative', location: 'Chittoor', verifiedWorkers: 126, establishedDate: '2020-01-15', rating: 4.8, services: ['Plumbing', 'Electrical', 'Carpentry'] },
  { id: 'c2', name: 'Tirupati Community Services Cooperative', location: 'Tirupati', verifiedWorkers: 94, establishedDate: '2021-06-10', rating: 4.7, services: ['Cleaning', 'Caregiving', 'Gardening'] },
  { id: 'c3', name: 'Bengaluru Technical Workers Cooperative', location: 'Bengaluru', verifiedWorkers: 210, establishedDate: '2019-11-20', rating: 4.9, services: ['Electrical', 'Technical Services', 'Plumbing'] },
];

export const mockWorkers: Worker[] = [
  { id: 'w1', userId: 'u1', name: 'Ramesh Kumar', role: 'Master Plumber', cooperativeId: 'c1', cooperativeName: 'Chittoor Skilled Workers Cooperative', skills: ['Pipe Repair', 'Water Systems', 'Leakage Detection', 'Emergency Plumbing', 'Installation'], experienceYears: 8, rating: 4.8, isVerified: true, jobsCompleted: 342, avatar: 'https://ui-avatars.com/api/?name=Ramesh+Kumar&background=EBF5FF&color=174A7E&size=128', primarySkill: 'Plumbing', availability: 'Available now', languages: ['English', 'Telugu'] },
  { id: 'w2', userId: 'u2', name: 'Lakshmi Devi', role: 'Professional Caregiver', cooperativeId: 'c2', cooperativeName: 'Tirupati Community Services Cooperative', skills: ['Elder Care', 'Medication', 'Mobility Support', 'Companionship'], experienceYears: 6, rating: 4.9, isVerified: true, jobsCompleted: 215, avatar: 'https://ui-avatars.com/api/?name=Lakshmi+Devi&background=FCE7F3&color=BE185D&size=128', primarySkill: 'Caregiving', availability: 'Available today', languages: ['Telugu', 'Hindi'] },
  { id: 'w3', userId: 'u3', name: 'Suresh Babu', role: 'Senior Electrician', cooperativeId: 'c3', cooperativeName: 'Bengaluru Technical Workers Cooperative', skills: ['Wiring', 'Appliance Installation', 'Fault Finding'], experienceYears: 12, rating: 4.7, isVerified: true, jobsCompleted: 512, avatar: 'https://ui-avatars.com/api/?name=Suresh+Babu&background=FEF3C7&color=D97706&size=128', primarySkill: 'Electrical', availability: 'Available now', languages: ['Kannada', 'English'] },
  { id: 'w4', userId: 'u4', name: 'Anita Reddy', role: 'Expert Cleaner', cooperativeId: 'c2', cooperativeName: 'Tirupati Community Services Cooperative', skills: ['Deep Cleaning', 'Home Organizing', 'Sanitization'], experienceYears: 4, rating: 4.6, isVerified: true, jobsCompleted: 180, avatar: 'https://ui-avatars.com/api/?name=Anita+Reddy&background=D1FAE5&color=047857&size=128', primarySkill: 'Cleaning', availability: 'Available tomorrow', languages: ['Telugu'] },
];

// Simple keyword recommendation mapping
export const getRecommendation = (query: string): { categoryId: string, serviceName: string, reason: string } | null => {
  const q = query.toLowerCase();
  
  if (q.includes('tap') || q.includes('leak') || q.includes('pipe') || q.includes('plumb')) return { categoryId: 'plumbing', serviceName: q.includes('tap') ? 'Tap Repair' : 'Pipe Leakage', reason: 'Your description matches our Plumbing services.' };
  if (q.includes('fan') || q.includes('light') || q.includes('wire') || q.includes('switch') || q.includes('electric')) return { categoryId: 'electrical', serviceName: q.includes('fan') ? 'Fan Repair' : (q.includes('switch') ? 'Switch & Socket Repair' : 'Wiring'), reason: 'Your description matches our Electrical services.' };
  if (q.includes('wood') || q.includes('furniture') || q.includes('door') || q.includes('carpent')) return { categoryId: 'carpentry', serviceName: q.includes('door') ? 'Door Repair' : 'Furniture Repair', reason: 'Your description matches our Carpentry services.' };
  if (q.includes('paint') || q.includes('color') || q.includes('wall')) return { categoryId: 'painting', serviceName: 'Home Painting', reason: 'Your description matches our Painting services.' };
  if (q.includes('clean') || q.includes('dust') || q.includes('sweep') || q.includes('mop') || q.includes('bathroom')) return { categoryId: 'cleaning', serviceName: q.includes('bathroom') ? 'Bathroom Cleaning' : 'Home Cleaning', reason: 'Your description matches our Cleaning services.' };
  if (q.includes('elder') || q.includes('care') || q.includes('assist') || q.includes('patient') || q.includes('old person')) return { categoryId: 'caregiving', serviceName: 'Elder Care', reason: 'Your description matches our Caregiving services.' };
  if (q.includes('garden') || q.includes('plant') || q.includes('grass') || q.includes('lawn')) return { categoryId: 'gardening', serviceName: 'Garden Maintenance', reason: 'Your description matches our Gardening services.' };
  if (q.includes('drive') || q.includes('car') || q.includes('transport')) return { categoryId: 'driving', serviceName: 'Local Driver', reason: 'Your description matches our Driving services.' };
  if (q.includes('appliance') || q.includes('tv') || q.includes('ac') || q.includes('machine') || q.includes('techn') || q.includes('cool')) return { categoryId: 'technical', serviceName: q.includes('ac') || q.includes('cool') ? 'AC Service' : 'Appliance Repair', reason: 'Your description matches our Technician services.' };
  if (q.includes('maid') || q.includes('cook') || q.includes('help') || q.includes('domestic')) return { categoryId: 'domestic', serviceName: 'House Help', reason: 'Your description matches our Domestic services.' };
  
  return null;
};
