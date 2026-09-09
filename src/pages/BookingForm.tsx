import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  BadgeCheck, Calendar as CalendarIcon, MapPin, IndianRupee,
  ArrowRight, Loader, AlertCircle, CheckCircle2,
  ShieldCheck, Smartphone, CreditCard, Landmark, Banknote, Star, ArrowLeft,
  Navigation, Copy, Check, Lock, QrCode, Sparkles, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const PAYMENT_METHODS = [
  {
    id: 'UPI',
    name: 'UPI (GPay / PhonePe / Paytm)',
    icon: Smartphone,
    desc: 'Instant & Zero Transaction Fee',
    badge: 'Fastest',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'Card',
    name: 'Credit / Debit Card',
    icon: CreditCard,
    desc: 'Visa, MasterCard, RuPay',
    badge: 'Secure',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'Net Banking',
    name: 'Net Banking',
    icon: Landmark,
    desc: 'All Major Indian & Grameena Banks',
    badge: 'Direct',
    badgeColor: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'Cash',
    name: 'Cash on Service Completion',
    icon: Banknote,
    desc: 'Pay directly to the worker after satisfaction',
    badge: 'Post-Pay',
    badgeColor: 'bg-amber-100 text-amber-800'
  },
];

const POPULAR_CITIES = ['Chittoor', 'Tirupati', 'Madanapalle', 'Punganur', 'Srikalahasti', 'Bengaluru'];

export default function BookingForm() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  
  // Check for preserved booking draft from navigation state or sessionStorage
  let draft: any = null;
  try {
    if (location.state?.preservedBooking) {
      draft = location.state.preservedBooking;
    } else if (sessionStorage.getItem('dailsmart_pending_booking')) {
      draft = JSON.parse(sessionStorage.getItem('dailsmart_pending_booking')!);
    }
  } catch { /* ignore */ }

  const initialServiceId = draft?.serviceId || location.state?.serviceId || '';
  const isEmergency = draft?.isEmergency || location.state?.isEmergency || false;

  // Read passed location from navigation state or sessionStorage
  let savedLoc: any = null;
  try {
    const stored = sessionStorage.getItem('dailsmart_user_location');
    if (stored) savedLoc = JSON.parse(stored);
  } catch {
    // ignore
  }

  const passedLocation = draft?.address || location.state?.address || location.state?.location || savedLoc?.address || '';
  const passedCity = draft?.city || location.state?.city || savedLoc?.city || profile?.city || '';
  const passedState = draft?.state || location.state?.state || savedLoc?.state || profile?.state || 'Andhra Pradesh';

  const [allWorkers, setAllWorkers] = useState<any[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(draft?.workerId || workerId || '');
  const [worker, setWorker] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [subServices, setSubServices] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'fill_details' | 'review_confirm'>('fill_details');
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // Form Fields - Initialized with passed location or clean empty values (no fake hardcoded address)
  const [serviceId, setServiceId] = useState(initialServiceId);
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [address, setAddress] = useState(passedLocation);
  const [city, setCity] = useState(passedCity || 'Chittoor');
  const [district, setDistrict] = useState(draft?.district || location.state?.district || passedCity || 'Chittoor');
  const [stateName, setStateName] = useState(passedState);
  const [date, setDate] = useState(draft?.date || new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [time, setTime] = useState(draft?.time || '10:30');
  const [notes, setNotes] = useState(draft?.notes || '');
  const [locLoading, setLocLoading] = useState(false);

  // Payment Options
  const [selectedPayment, setSelectedPayment] = useState('UPI');
  const [upiId, setUpiId] = useState('user@oksbi');
  const [selectedBank, setSelectedBank] = useState('Andhra Pragathi Grameena Bank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('11/28');

  // Interactive Payment Gateway Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentTxnId, setPaymentTxnId] = useState('');
  const [cardOtp, setCardOtp] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Pricing State
  const [fairWage, setFairWage] = useState<any>({
    baseRate: 350,
    platformFee: 35,
    welfareFee: 25,
    taxes: 18,
    total: 428
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [wList, sList] = await Promise.all([
          api.getWorkers(),
          api.getServices()
        ]);
        setAllWorkers(wList);
        setServices(sList);

        const targetWorkerId = selectedWorkerId || (wList[0]?.id ?? '');
        setSelectedWorkerId(targetWorkerId);

        if (targetWorkerId) {
          const w = wList.find(item => item.id === targetWorkerId) || await api.getWorkerById(targetWorkerId);
          setWorker(w);
          if (w?.service_id) {
            setServiceId(w.service_id);
            const types = await api.getServiceTypes(w.service_id);
            setSubServices(types);
          }
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [workerId]);

  // Recalculate price when worker or service changes
  useEffect(() => {
    if (worker) {
      const base = worker.price_per_visit || 350;
      const platformFee = Math.round(base * 0.10);
      const welfareFee = 25;
      const taxes = Math.round((base + platformFee) * 0.05);
      const total = base + platformFee + welfareFee + taxes;
      setFairWage({
        baseRate: base,
        platformFee,
        welfareFee,
        taxes,
        total
      });
    }
  }, [worker, serviceId]);

  const handleUseMyLocation = () => {
    setLocLoading(true);
    if (!navigator.geolocation) {
      setAddress('Gandhi Road, Opp. Municipal Office');
      setCity('Chittoor');
      setDistrict('Chittoor');
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setAddress('Gandhi Road, Near Clock Tower');
        setCity('Chittoor');
        setDistrict('Chittoor');
        setLocLoading(false);
      },
      () => {
        setAddress('Gandhi Road, Near Clock Tower');
        setCity('Chittoor');
        setDistrict('Chittoor');
        setLocLoading(false);
      }
    );
  };

  const handleWorkerChange = async (wId: string) => {
    setSelectedWorkerId(wId);
    const w = allWorkers.find(item => item.id === wId) || await api.getWorkerById(wId);
    setWorker(w);
    if (w?.service_id) {
      setServiceId(w.service_id);
      const types = await api.getServiceTypes(w.service_id);
      setSubServices(types);
    }
  };

  const handleServiceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setServiceId(val);
    setServiceTypeId('');
    if (val) {
      const types = await api.getServiceTypes(val);
      setSubServices(types);
    } else {
      setSubServices([]);
    }
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !city.trim() || !date || !time) {
      setError('Please provide your service location and schedule to proceed.');
      return;
    }
    setError('');

    // Check if customer is logged in
    const isCustomerLoggedIn = !!user || !!localStorage.getItem('dailsmart_session');
    if (!isCustomerLoggedIn) {
      const pendingData = {
        workerId: selectedWorkerId,
        serviceId: serviceId || worker?.service_id,
        address,
        city,
        district,
        state: stateName,
        date,
        time,
        notes,
        isEmergency,
        selectedPayment
      };
      sessionStorage.setItem('dailsmart_pending_booking', JSON.stringify(pendingData));
      navigate('/login?redirect=booking&role=customer', { state: { preservedBooking: pendingData } });
      return;
    }

    setStep('review_confirm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Payment Gateway Modal
  const handleInitiatePayment = () => {
    if (!selectedPayment) {
      setError('Please choose a payment method.');
      return;
    }
    setError('');
    setShowPaymentModal(true);
  };

  // Process payment inside the interactive modal
  const handleProcessPayment = async () => {
    setPaymentProcessing(true);
    const generatedTxn = `TXN_DSM_${Math.floor(100000000 + Math.random() * 900000000)}`;
    setPaymentTxnId(generatedTxn);

    // Simulate realistic 1.2s bank verification
    await new Promise(r => setTimeout(r, 1200));
    setPaymentProcessing(false);
    setPaymentSuccess(true);

    // Display green check for 1s before showing confirmed booking screen
    await new Promise(r => setTimeout(r, 1000));
    setShowPaymentModal(false);
    setPaymentSuccess(false);

    // Create the booking in api
    await executeBookingCreation(generatedTxn);
  };

  const executeBookingCreation = async (txnId: string) => {
    try {
      setSubmitting(true);
      setError('');

      const created = await api.createBooking({
        customer_id: user?.id || 'c1111111-1111-1111-1111-customer11111',
        worker_id: selectedWorkerId,
        service_id: serviceId || worker?.service_id,
        cooperative_id: worker?.cooperative_id,
        service_address: address,
        city,
        district,
        state: stateName,
        scheduled_date: date,
        scheduled_start_time: time,
        customer_notes: notes,
        total_amount: fairWage.total,
        estimated_amount: fairWage.total,
        payment_method: selectedPayment,
        payment_status: selectedPayment === 'Cash' ? 'pending_cash' : 'paid_escrow',
        status: 'requested',
        is_emergency: isEmergency,
      });
      
      setBookingDetails({ ...created, transaction_id: txnId });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to complete booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Preparing booking environment...</p>
      </div>
    );
  }

  // SUCCESS SCREEN
  if (success && bookingDetails) {
    return (
      <div className="bg-lightBg min-h-screen py-16 px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100 animate-fade-in">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          
          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-black uppercase px-3 py-1 rounded-full mb-3">
            Booking Confirmed & Dispatched
          </span>
          <h1 className="text-3xl font-black text-dark mb-2">Booking Requested!</h1>
          <p className="text-gray-600 text-sm mb-6">
            Your request has been routed to <strong>{worker?.name}</strong>. You can monitor live job status below.
          </p>

          {/* Booking Summary Box */}
          <div className="bg-gray-50 rounded-2xl p-5 text-left mb-6 space-y-3 border border-gray-200">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-xs font-bold text-gray-500 uppercase">Booking ID</span>
              <span className="text-sm font-mono font-black text-dark">#{bookingDetails.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Assigned Professional</span>
              <span className="text-sm font-bold text-dark flex items-center gap-1">
                {worker?.name} <BadgeCheck className="w-4 h-4 text-emerald-500 inline" />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Service Location</span>
              <span className="text-sm font-bold text-dark truncate max-w-[200px]">{address}, {city}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Scheduled Date & Time</span>
              <span className="text-sm font-bold text-dark">{date} at {time}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payment Mode</span>
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{selectedPayment}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payment Status</span>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                {selectedPayment === 'Cash' ? 'Cash on Completion' : 'Paid & Secured in Escrow'}
              </span>
            </div>
            {bookingDetails.transaction_id && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transaction ID</span>
                <span className="text-xs font-mono font-bold text-gray-700">{bookingDetails.transaction_id}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-base font-bold text-dark">Estimated Service Cost</span>
              <span className="text-xl font-black text-emerald-600">₹{bookingDetails.total_amount}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => navigate(`/customer-dashboard`)}
              className="w-full bg-dark text-white px-6 py-4 rounded-2xl font-bold hover:bg-deepBlue transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Track Status in My Bookings <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/services')}
              className="w-full border border-gray-200 text-dark px-6 py-3.5 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
            >
              Book Another Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lightBg min-h-screen pb-24 pt-8">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-4 mb-6">
          {step === 'review_confirm' ? (
            <button
              onClick={() => setStep('fill_details')}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-dark px-3 py-2 bg-white rounded-xl border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Details
            </button>
          ) : (
            <Link
              to="/workers"
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-dark px-3 py-2 bg-white rounded-xl border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Workers
            </Link>
          )}

          <div>
            <h1 className="text-3xl font-black text-dark tracking-tight">
              {step === 'fill_details' ? 'Schedule Service Booking' : 'Review & Confirm Booking'}
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Transparent, cooperative-backed pricing with verified worker protection.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* STEP 1: FILL DETAILS */}
        {step === 'fill_details' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleProceedToReview} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">
                
                {/* Worker Selector */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Assigned Professional</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-dark font-bold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    value={selectedWorkerId}
                    onChange={(e) => handleWorkerChange(e.target.value)}
                  >
                    {allWorkers.map((w: any) => (
                      <option key={w.id} value={w.id}>
                        {w.name} — {w.role} (⭐ {w.rating} | ₹{w.price_per_visit || 350}/visit)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Service Category</label>
                    <select 
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-dark font-bold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      value={serviceId}
                      onChange={handleServiceChange}
                    >
                      <option value="" disabled>Select category</option>
                      {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Specific Service Type</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-dark font-medium text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      value={serviceTypeId}
                      onChange={(e) => setServiceTypeId(e.target.value)}
                    >
                      <option value="">General Repair / Inspection</option>
                      {subServices.map((sub: string) => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                  </div>
                </div>

                {/* Location Section with Home-style Locate button & City Chips */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-dark flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-500" /> Service Doorstep Location
                    </h3>
                    <button
                      type="button"
                      onClick={handleUseMyLocation}
                      disabled={locLoading}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                      title="Use Current Location"
                    >
                      <Navigation className={`w-3.5 h-3.5 ${locLoading ? 'animate-spin' : ''}`} />
                      {locLoading ? 'Detecting...' : 'Use My Location'}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                        Door / Flat No. & Street Address *
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. 14/2, Gandhi Road, Opp. Municipal High School"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-dark font-semibold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        value={address} 
                        onChange={e => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">City *</label>
                        <input 
                          type="text" 
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-dark font-bold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                          value={city} 
                          onChange={e => setCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">District *</label>
                        <input 
                          type="text" 
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-dark font-medium text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                          value={district} 
                          onChange={e => setDistrict(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">State *</label>
                        <input 
                          type="text" 
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-dark font-medium text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                          value={stateName} 
                          onChange={e => setStateName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Quick City Selection */}
                    <div>
                      <span className="block text-[11px] font-extrabold uppercase text-gray-400 tracking-wider mb-1.5">
                        Quick Pick City:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_CITIES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => { setCity(c); setDistrict(c); }}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                              city.toLowerCase() === c.toLowerCase()
                                ? 'bg-dark text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Map Preview — shows location based on entered city + address */}
                    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm mt-2">
                      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" /> 
                          Map Preview · {address ? `${address}, ` : ''}{city || 'Select city'}
                        </span>
                        <span className="text-[10px] text-gray-400">Powered by OpenStreetMap</span>
                      </div>
                      <iframe
                        key={city}
                        title="Service Location Map"
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=78.0,12.5,79.5,14.0&layer=mapnik&marker=${
                          city === 'Tirupati' ? '13.6288,79.4192' :
                          city === 'Bengaluru' ? '12.9716,77.5946' :
                          city === 'Madanapalle' ? '13.5508,78.5005' :
                          city === 'Srikalahasti' ? '13.4343,79.6990' :
                          city === 'Punganur' ? '13.3634,78.5791' :
                          '13.2170,79.1021' // Chittoor default
                        }`}
                      />
                      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
                        <p className="text-[11px] text-gray-400">
                          📍 Worker will arrive at: <strong className="text-dark">{address || 'Enter your address above'}</strong>
                          {city ? `, ${city}` : ''}{stateName ? `, ${stateName}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-base font-bold text-dark mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-emerald-500" /> Preferred Date & Time
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Date *</label>
                      <input 
                        type="date" required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-dark font-bold text-sm"
                        value={date} onChange={e => setDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Time Slot *</label>
                      <input 
                        type="time" required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-dark font-bold text-sm"
                        value={time} onChange={e => setTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="pt-6 border-t border-gray-100">
                  <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                    Instructions / Problem Description (Optional)
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="e.g. Bring spare pipe connectors, bell is not working on 1st floor..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-dark font-medium text-sm resize-none"
                    value={notes} onChange={e => setNotes(e.target.value)}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-dark hover:bg-deepBlue text-white py-4 rounded-2xl font-black text-base transition-colors shadow-sm"
                  >
                    Proceed to Review & Payment <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

              </form>
            </div>

            {/* Estimated Cost Preview Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-32">
                {worker && (
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                    <img src={worker.avatar} alt={worker.name} className="w-14 h-14 rounded-2xl object-cover" />
                    <div>
                      <h4 className="font-bold text-dark text-base flex items-center gap-1">
                        {worker.name} <BadgeCheck className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                      </h4>
                      <p className="text-xs text-gray-500">{worker.role}</p>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {worker.rating} • {worker.completed_jobs} jobs
                      </div>
                    </div>
                  </div>
                )}

                <h3 className="font-black text-dark text-sm uppercase tracking-wider mb-3">Estimated Service Cost</h3>
                
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 mb-4">
                  <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Total Payable Estimate</span>
                  <div className="text-3xl font-black text-emerald-700 flex items-center mt-1">
                    <IndianRupee className="w-7 h-7" /> {fairWage.total}
                  </div>
                  <p className="text-[11px] text-emerald-600 mt-1">Cooperative transparent wage policy applies</p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs font-medium text-gray-600 border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span>Base Service Rate</span>
                    <span className="font-bold text-dark">₹{fairWage.baseRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cooperative & Platform Fee</span>
                    <span className="font-bold text-dark">₹{fairWage.platformFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Worker Welfare Fund</span>
                    <span className="font-bold text-dark">₹{fairWage.welfareFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-bold text-dark">₹{fairWage.taxes}</span>
                  </div>
                </div>

                <div className="mt-5 p-3 bg-blue-50 text-blue-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 text-blue-600" />
                  Free cancellation up to 2 hours before scheduled time.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW & CONFIRM WITH DIGITAL PAYMENT */}
        {step === 'review_confirm' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Review Summary */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-base font-black text-dark mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" /> 1. Booking Summary
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase">Worker</span>
                    <p className="font-black text-dark">{worker?.name} ({worker?.role})</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase">Cooperative</span>
                    <p className="font-bold text-dark">{worker?.cooperativeName || 'Labour Society'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase">Schedule</span>
                    <p className="font-bold text-dark">{date} at {time}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase">Doorstep Address</span>
                    <p className="font-bold text-dark truncate">{address}, {city}</p>
                  </div>
                </div>
              </div>

              {/* Digital Payment Options UI */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-black text-dark">2. Choose Digital Payment Mode</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Select how you want to pay for this booking</p>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    100% Escrow Protected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {PAYMENT_METHODS.map(method => {
                    const Icon = method.icon;
                    const isSelected = selectedPayment === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-dark bg-dark/5 shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-dark text-white' : 'bg-gray-100 text-gray-600'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-black text-sm text-dark">{method.name.split('(')[0]}</span>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${method.badgeColor}`}>
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 pl-10">{method.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Sub-inputs depending on selected method */}
                {selectedPayment === 'UPI' && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
                    <label className="block text-xs font-bold text-gray-600">Your UPI ID / Virtual Payment Address</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={upiId} 
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="mobile@upi or user@okaxis" 
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-dark focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                      <button 
                        type="button" 
                        className="px-4 py-2.5 bg-dark text-white text-xs font-bold rounded-xl hover:bg-deepBlue"
                      >
                        Verified
                      </button>
                    </div>
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-500">
                      <span>Supported:</span>
                      <span className="font-bold text-dark">Google Pay</span> • 
                      <span className="font-bold text-dark">PhonePe</span> • 
                      <span className="font-bold text-dark">Paytm</span> • 
                      <span className="font-bold text-dark">BHIM UPI</span>
                    </div>
                  </div>
                )}

                {selectedPayment === 'Card' && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Card Number</label>
                      <input 
                        type="text" 
                        value={cardNumber} 
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-dark"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Expiry</label>
                        <input 
                          type="text" 
                          value={cardExpiry} 
                          onChange={e => setCardExpiry(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">CVV</label>
                        <input 
                          type="password" 
                          maxLength={4}
                          defaultValue="•••"
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-dark"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPayment === 'Net Banking' && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-600">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-dark"
                    >
                      <option value="Andhra Pragathi Grameena Bank">Andhra Pragathi Grameena Bank</option>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Union Bank of India">Union Bank of India</option>
                    </select>
                  </div>
                )}

                {selectedPayment === 'Cash' && (
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs font-semibold text-amber-900">
                    💵 You can hand over ₹{fairWage.total} in cash to {worker?.name} once the service is finished and verified to your satisfaction.
                  </div>
                )}
              </div>

            </div>

            {/* Price Confirmation Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-32">
                <h3 className="font-black text-dark text-base mb-4">Total Price Confirmation</h3>
                
                <div className="space-y-3 text-sm pb-4 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Visit Fee</span>
                    <span className="font-bold text-dark">₹{fairWage.baseRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform & Coop Fee</span>
                    <span className="font-bold text-dark">₹{fairWage.platformFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Welfare & Protection</span>
                    <span className="font-bold text-dark">₹{fairWage.welfareFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (5%)</span>
                    <span className="font-bold text-dark">₹{fairWage.taxes}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-b border-gray-200 mb-6">
                  <span className="font-black text-dark text-base">Grand Total</span>
                  <span className="text-2xl font-black text-emerald-600">₹{fairWage.total}</span>
                </div>

                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {selectedPayment === 'Cash' ? (
                    <>Confirm Cash Booking (₹{fairWage.total})</>
                  ) : (
                    <>Pay & Confirm via {selectedPayment} (₹{fairWage.total}) <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>

                <p className="text-center text-[11px] text-gray-400 font-medium mt-3">
                  Safe & Secure with DailSmart Cooperative Escrow Protection
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* INTERACTIVE DIGITAL PAYMENT GATEWAY MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="bg-[#1B3A6B] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFC928] text-dark flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight">DailSmart Secure Payment Gateway</h3>
                  <p className="text-[11px] text-blue-200">100% Escrow Protected Transaction</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!paymentProcessing) setShowPaymentModal(false);
                }}
                disabled={paymentProcessing}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors disabled:opacity-30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Due Banner */}
            <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Amount Payable</span>
              <span className="text-xl font-black text-emerald-700 flex items-center">
                <IndianRupee className="w-5 h-5" /> {fairWage.total}
              </span>
            </div>

            {/* Modal Body: Depends on payment state and selected payment */}
            <div className="p-6">
              {paymentProcessing ? (
                <div className="py-12 text-center space-y-4">
                  <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
                  <h4 className="text-lg font-black text-dark">Connecting to Bank Escrow...</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Please do not close or refresh this window while we secure your booking payment of ₹{fairWage.total}.
                  </p>
                </div>
              ) : paymentSuccess ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-emerald-700">Payment Authorized!</h4>
                  <p className="text-xs text-gray-600">
                    Funds placed in Cooperative Escrow. Transacting with reference:
                  </p>
                  <span className="inline-block font-mono text-xs font-black bg-gray-100 px-3 py-1.5 rounded-xl text-dark">
                    {paymentTxnId}
                  </span>
                </div>
              ) : (
                <>
                  {/* UPI FLOW */}
                  {selectedPayment === 'UPI' && (
                    <div className="space-y-4 text-center">
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 inline-block mx-auto">
                        {/* Simulated QR Code SVG */}
                        <div className="w-40 h-40 bg-white border-2 border-dashed border-gray-300 rounded-xl p-2 mx-auto flex flex-col items-center justify-center relative shadow-inner">
                          <QrCode className="w-28 h-28 text-dark" />
                          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                            Scan to Pay ₹{fairWage.total}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 font-medium">
                        Scan QR with Google Pay, PhonePe, Paytm, or BHIM
                      </p>

                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                        <span className="font-mono text-gray-600 truncate">dailsmart.escrow@icici</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCopiedUpi(true);
                            setTimeout(() => setCopiedUpi(false), 2000);
                          }}
                          className="flex items-center gap-1 font-bold text-deepBlue hover:text-dark px-2 py-1 rounded bg-white border border-gray-200"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedUpi ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleProcessPayment}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-[#FFC928]" />
                        Simulate Payment Approval (₹{fairWage.total})
                      </button>
                    </div>
                  )}

                  {/* CARD FLOW */}
                  {selectedPayment === 'Card' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                        <p className="font-bold">Bank 3D-Secure Authentication</p>
                        <p className="text-[11px] text-blue-700">One Time Password (OTP) sent to registered mobile linked with card ending in 8921.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Enter 6-Digit Bank OTP</label>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="e.g. 583920"
                          value={cardOtp}
                          onChange={e => setCardOtp(e.target.value)}
                          className="w-full text-center tracking-widest text-lg font-black px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setCardOtp('583920')}
                        className="text-xs font-bold text-deepBlue hover:underline block text-center mx-auto"
                      >
                        ⚡ Fill Demo OTP: 583920
                      </button>

                      <button
                        type="button"
                        onClick={handleProcessPayment}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        Authorize & Pay ₹{fairWage.total}
                      </button>
                    </div>
                  )}

                  {/* NET BANKING FLOW */}
                  {selectedPayment === 'Net Banking' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-left space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Selected Gateway</span>
                        <p className="font-black text-dark text-sm">{selectedBank}</p>
                        <p className="text-xs text-gray-500">
                          Transferring ₹{fairWage.total} to DailSmart Escrow Account for job #{selectedWorkerId.slice(0, 8)}.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleProcessPayment}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        Authorize Net Banking Transfer (₹{fairWage.total})
                      </button>
                    </div>
                  )}

                  {/* CASH FLOW */}
                  {selectedPayment === 'Cash' && (
                    <div className="space-y-4 text-left">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-900 space-y-2">
                        <p className="font-bold text-sm">💵 Cash on Service Completion Policy</p>
                        <p>
                          1. The assigned professional will visit your location on {date} at {time}.
                        </p>
                        <p>
                          2. Pay exact cash of <strong>₹{fairWage.total}</strong> directly to the worker once service is finished and you are 100% satisfied.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleProcessPayment}
                        className="w-full bg-dark hover:bg-deepBlue text-white font-black py-3.5 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        Confirm & Place Cash Booking
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer Security Guarantee */}
            <div className="bg-gray-50 p-3.5 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-500 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cooperative Escrow Guarantee: Payment released only upon completion</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
