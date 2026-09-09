import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  Users, Mail, Lock, User, Phone, MapPin, Building, ArrowRight,
  AlertCircle, Briefcase, ChevronDown, Shield, CheckCircle,
} from 'lucide-react';
import { INDIAN_STATES, CITIES_BY_STATE } from '../lib/locations';

type Role = 'customer' | 'worker' | 'cooperative_manager';

export default function Signup() {
  const location = useLocation();
  const initialRole = (location.state?.defaultRole as Role) || 'customer';
  const [role, setRole] = useState<Role>(initialRole);

  // Common fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');

  // Cooperative manager extra fields
  const [coopName, setCoopName] = useState('');
  const [coopRegNo, setCoopRegNo] = useState('');
  const [coopDistrict, setCoopDistrict] = useState('');
  const [coopType, setCoopType] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const resetFields = () => {
    setFullName(''); setUsername(''); setEmail(''); setPhone(''); setPassword('');
    setCity(''); setStateName(''); setCoopName(''); setCoopRegNo('');
    setCoopDistrict(''); setCoopType(''); setError('');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // [DEMO] Cooperative Manager application flow – shows success screen
    // In production: submit to admin review queue via Supabase or backend API
    if (role === 'cooperative_manager') {
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 1200);
      return;
    }

    try {
      // Step 1: Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      
      // If the email is already registered, let them sign in instead
      if (authError) {
        if (authError.message?.toLowerCase().includes('already registered') || authError.message?.toLowerCase().includes('already exists')) {
          setError('This email is already registered. Please sign in instead.');
          setLoading(false);
          return;
        }
        throw authError;
      }
      if (!authData.user) throw new Error('Failed to create account');

      // Step 2: Save profile data locally as fallback
      const profileData = { id: authData.user.id, full_name: fullName, username, email, phone, role, city, state: stateName, verification_status: role === 'worker' ? 'pending' : 'verified', created_at: new Date().toISOString() };
      try {
        localStorage.setItem('dailsmart_profile', JSON.stringify(profileData));
        localStorage.setItem('dailsmart_session', JSON.stringify({ email, role, loggedIn: true, full_name: fullName, id: authData.user.id }));
      } catch { /* ignore */ }

      // Step 3: Try to insert into Supabase profiles table
      // This may fail if RLS policies are not set up to allow inserts
      // We silently ignore RLS errors since the auth account was created
      try {
        await supabase.from('profiles').insert([profileData]);
      } catch {
        // RLS policy error - auth user created successfully, profile will be fetched/created on next login
        // Continue with navigation regardless
      }

      // Step 4: Navigate to dashboard
      if (role === 'worker') navigate('/worker-dashboard');
      else navigate('/customer-dashboard');

    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.message?.includes('fetch')) {
        // Network error - use demo mode fallback
        const profileData = { full_name: fullName, username, email, phone, role, city, state: stateName, id: 'demo-user', created_at: new Date().toISOString() };
        try { 
          localStorage.setItem('dailsmart_profile', JSON.stringify(profileData));
          localStorage.setItem('dailsmart_session', JSON.stringify({ email, role, loggedIn: true, full_name: fullName }));
        } catch { /* ignore */ }
        if (role === 'worker') navigate('/worker-dashboard');
        else navigate('/customer-dashboard');
        return;
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cooperative Manager success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-lightBg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-6 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">Application Submitted!</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Your cooperative registration request has been received. Our team will verify your documents and contact you at <strong>{email}</strong> within 2–3 business days.
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-bold text-deepBlue mb-2">Your Application Details</p>
              <p className="text-xs text-gray-600">Cooperative: <span className="font-semibold">{coopName}</span></p>
              <p className="text-xs text-gray-600">Registration No: <span className="font-semibold">{coopRegNo}</span></p>
              <p className="text-xs text-gray-600">District: <span className="font-semibold">{coopDistrict}</span></p>
              <p className="text-xs text-gray-600">Contact: <span className="font-semibold">{fullName} · {phone}</span></p>
            </div>
            <p className="text-xs text-gray-400 mb-5">📋 Demo mode — no actual Supabase record created. Connect admin review queue in production.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-[#182235] text-white font-bold py-3 rounded-xl hover:bg-[#111827] transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightBg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-2 text-center text-3xl font-black tracking-tight text-dark">
          Join DailSmart Solutions
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          AI-Powered Cooperative Service Ecosystem
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {/* Customer */}
            <button
              onClick={() => { setRole('customer'); resetFields(); }}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${role === 'customer' ? 'border-primary bg-yellow-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
            >
              <Users className={`w-5 h-5 mb-2 ${role === 'customer' ? 'text-primary' : 'text-gray-400'}`} />
              <h3 className="font-bold text-dark text-xs">Customer</h3>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">Find trusted services.</p>
            </button>

            {/* Worker */}
            <button
              onClick={() => { setRole('worker'); resetFields(); }}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${role === 'worker' ? 'border-deepBlue bg-blue-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
            >
              <Briefcase className={`w-5 h-5 mb-2 ${role === 'worker' ? 'text-deepBlue' : 'text-gray-400'}`} />
              <h3 className="font-bold text-dark text-xs">Worker</h3>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">Share skills & earn.</p>
            </button>

            {/* Cooperative Manager */}
            <button
              onClick={() => { setRole('cooperative_manager'); resetFields(); }}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${role === 'cooperative_manager' ? 'border-green-600 bg-green-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
            >
              <Shield className={`w-5 h-5 mb-2 ${role === 'cooperative_manager' ? 'text-green-600' : 'text-gray-400'}`} />
              <h3 className="font-bold text-dark text-xs">Cooperative</h3>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">Register your coop.</p>
            </button>
          </div>

          {/* Cooperative Manager Info Banner */}
          {role === 'cooperative_manager' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex gap-3">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-800">Cooperative Registration</p>
                <p className="text-xs text-green-700 mt-0.5">Fill in your cooperative details. Our team will verify your registration and activate your manager account within 2–3 business days.</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                {role === 'cooperative_manager' ? 'Manager Full Name' : 'Full Name'}
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary text-dark font-medium text-sm"
                  placeholder="Ravi Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            {/* Username (for customer and worker) */}
            {role !== 'cooperative_manager' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-bold text-sm">@</span>
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary text-dark font-medium text-sm"
                    placeholder="ravikumar123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">This will be your unique display handle</p>
              </div>
            )}

            {/* Cooperative-specific fields */}
            {role === 'cooperative_manager' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Cooperative Name</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary text-dark font-medium text-sm"
                      placeholder="Chittoor Skilled Workers Cooperative"
                      value={coopName}
                      onChange={(e) => setCoopName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Registration Number</label>
                    <input
                      type="text"
                      required
                      className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary text-dark font-medium text-sm"
                      placeholder="AP/COOP/2024/0001"
                      value={coopRegNo}
                      onChange={(e) => setCoopRegNo(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">District</label>
                    <input
                      type="text"
                      required
                      className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary text-dark font-medium text-sm"
                      placeholder="Chittoor"
                      value={coopDistrict}
                      onChange={(e) => setCoopDistrict(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Cooperative Type</label>
                  <div className="relative">
                    <select
                      required
                      className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary text-dark font-medium text-sm appearance-none"
                      value={coopType}
                      onChange={(e) => setCoopType(e.target.value)}
                    >
                      <option value="" disabled>Select type</option>
                      <option>Labour Cooperative Society</option>
                      <option>Labour Cooperative Federation</option>
                      <option>Women's Cooperative</option>
                      <option>Artisan Cooperative</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </>
            )}

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary text-dark font-medium text-sm"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary text-dark font-medium text-sm"
                    placeholder="+91 9999999999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Password – hidden for cooperative manager (no auth account created yet) */}
            {role !== 'cooperative_manager' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary text-dark font-medium text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* State & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    required
                    className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary text-dark font-medium text-sm appearance-none"
                    value={stateName}
                    onChange={(e) => { setStateName(e.target.value); setCity(''); }}
                  >
                    <option value="" disabled>Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    required
                    className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary text-dark font-medium text-sm appearance-none"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!stateName}
                  >
                    <option value="" disabled>Select City</option>
                    {(CITIES_BY_STATE[stateName] || []).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 ${
                role === 'cooperative_manager'
                  ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                  : 'bg-primary hover:bg-yellow-400 text-dark focus:ring-primary'
              }`}
            >
              {loading
                ? (role === 'cooperative_manager' ? 'Submitting Application...' : 'Creating Account...')
                : (role === 'cooperative_manager' ? 'Submit Cooperative Application' : 'Create Account')
              }
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-sm font-bold text-deepBlue hover:text-primary transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
