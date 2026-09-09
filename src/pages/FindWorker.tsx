import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import RapidoMap from '../components/RapidoMap';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeft, MapPin, Star, BadgeCheck, ShieldCheck, CheckCircle2,
  Phone, MessageSquare, Smartphone, CreditCard, Banknote, Check,
  Truck, PlayCircle, X, ChevronRight, Edit3, Plus, Percent,
  XCircle, Sun, Moon, RefreshCw
} from 'lucide-react';

interface ServiceOption {
  id: string;
  title: string;
  category: string;
  badge?: string;
  etaMinutes: number;
  originalPrice: number;
  discountedPrice: number;
  workerName: string;
  workerAvatar: string;
  workerRating: number;
  workerJobs: number;
  cooperativeName: string;
  description: string;
}

export default function FindWorker() {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Extract initial service and location from route state or defaults
  const passedService = locationState.service || locationState.serviceName || locationState.serviceId || 'Plumbing';
  const passedLocation = locationState.location || locationState.address || locationState.city || '2/419, Madanapalle';

  // Details if booked from a specific worker on ServiceDetail page
  const passedWorkerName = locationState.workerName;
  const passedWorkerAvatar = locationState.workerAvatar || 'https://i.pravatar.cc/150?img=51';
  const passedWorkerRating = locationState.workerRating || 4.9;
  const passedWorkerJobs = locationState.workerJobs || 342;
  const passedWorkerCoop = locationState.workerCoop || 'Chittoor Labour Cooperative';
  const passedPrice = locationState.price || 250;

  const [serviceName] = useState(passedService);
  const [customerAddress, setCustomerAddress] = useState(passedLocation);
  const [destinationAddress, setDestinationAddress] = useState('Eswaramma Colony, Doorstep');
  const [showAddressEdit, setShowAddressEdit] = useState(false);

  // Selected Service Option
  const [selectedOptionId, setSelectedOptionId] = useState('opt-1');
  const [selectedPayment, setSelectedPayment] = useState<'Cash' | 'UPI' | 'Card'>('UPI');
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [couponApplied, setCouponApplied] = useState(true);

  // Booking & Live Tracking State
  const [isBooked, setIsBooked] = useState(false);
  const [workerProgress, setWorkerProgress] = useState(0); // 0 to 1
  const [trackingEta, setTrackingEta] = useState(5); // in minutes
  const [trackingDistance, setTrackingDistance] = useState('1.4 km');
  const [trackingStatus, setTrackingStatus] = useState<'accepted' | 'on_the_way' | 'arrived' | 'started' | 'completed'>('on_the_way');
  const [showChatModal, setShowChatModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'worker' | 'user'; text: string; time: string }>>([
    { sender: 'worker', text: 'Namaste! I have accepted your request. I am on my way to your location with my tool kit.', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Payment Gateway State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [upiId, setUpiId] = useState('user@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 8921 7843 1902');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('382');
  const [cardName, setCardName] = useState('VISHNU KUMAR');

  // Available Service Options (Customized if a specific worker was selected)
  const serviceOptions: ServiceOption[] = [
    {
      id: 'opt-1',
      title: passedWorkerName ? `Booked ${passedWorkerName}` : `Instant ${serviceName} Visit`,
      category: serviceName,
      badge: 'FASTEST',
      etaMinutes: 5,
      originalPrice: passedWorkerName ? passedPrice + 50 : 300,
      discountedPrice: passedWorkerName ? passedPrice : 250,
      workerName: passedWorkerName || 'Surya Prakash',
      workerAvatar: passedWorkerAvatar,
      workerRating: passedWorkerRating,
      workerJobs: passedWorkerJobs,
      cooperativeName: passedWorkerCoop,
      description: `Quick doorstep arrival in 5 mins • Verified tools & cooperative certified`
    },
    {
      id: 'opt-2',
      title: `Standard Cooperative ${serviceName}`,
      category: serviceName,
      badge: 'COOP VERIFIED',
      etaMinutes: 12,
      originalPrice: 400,
      discountedPrice: 350,
      workerName: 'Rajesh Sharma',
      workerAvatar: 'https://i.pravatar.cc/150?img=53',
      workerRating: 4.8,
      workerJobs: 290,
      cooperativeName: 'Tirupati Skilled Artisans Coop',
      description: `Comprehensive repair • Skill tested • Free inspection`
    },
    {
      id: 'opt-3',
      title: `Master ${serviceName} Specialist`,
      category: serviceName,
      badge: '30-DAY WARRANTY',
      etaMinutes: 18,
      originalPrice: 500,
      discountedPrice: 450,
      workerName: 'Venkat Rao',
      workerAvatar: 'https://i.pravatar.cc/150?img=56',
      workerRating: 5.0,
      workerJobs: 418,
      cooperativeName: 'Rayalaseema Workers Cooperative',
      description: `10+ yrs experience • 30 days full cooperative warranty`
    }
  ];

  const selectedOption = serviceOptions.find(o => o.id === selectedOptionId) || serviceOptions[0];
  const finalPrice = couponApplied ? selectedOption.discountedPrice - 15 : selectedOption.discountedPrice;

  // If navigated with askPayment: true from service page, automatically show payment modal
  useEffect(() => {
    if (locationState.askPayment && !isBooked) {
      setShowPaymentModal(true);
    }
  }, [locationState.askPayment]);

  // Handle Coordinates depending on city
  const getCoordinates = (addr: string): [number, number] => {
    const lower = addr.toLowerCase();
    if (lower.includes('tirupati')) return [13.6288, 79.4192];
    if (lower.includes('chittoor')) return [13.2172, 79.1003];
    return [13.5560, 78.5010]; // Madanapalle default
  };

  const centerCoords = getCoordinates(customerAddress);

  // Live simulation of worker moving along the route towards customer
  useEffect(() => {
    let interval: any;
    if (isBooked && trackingStatus === 'on_the_way') {
      interval = setInterval(() => {
        setWorkerProgress(prev => {
          if (prev >= 1) {
            setTrackingStatus('arrived');
            setTrackingEta(0);
            setTrackingDistance('Arrived at Doorstep');
            clearInterval(interval);
            return 1;
          }
          const next = prev + 0.08;
          const remainingKm = (1.4 * (1 - next)).toFixed(1);
          setTrackingDistance(`${remainingKm} km`);
          setTrackingEta(Math.max(1, Math.round(5 * (1 - next))));
          return next;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isBooked, trackingStatus]);

  const handleConfirmBooking = async () => {
    setIsBooked(true);
    setWorkerProgress(0);
    setTrackingEta(5);
    setTrackingDistance('1.4 km');
    setTrackingStatus('on_the_way');

    try {
      await api.createBooking({
        customer_id: 'c1111111-1111-1111-1111-customer11111',
        worker_id: locationState.workerId || 'ww111111-1111-1111-1111-111111111111',
        service_id: serviceName.toLowerCase(),
        service_address: customerAddress,
        city: customerAddress.split(',')[0].trim(),
        total_amount: finalPrice,
        payment_method: selectedPayment,
        payment_status: selectedPayment === 'Cash' ? 'pending' : 'paid',
        status: 'on_the_way'
      });
    } catch {
      // ignore
    }
  };

  // Handle Book button click — ALWAYS prompts for payment method before showing tracking!
  const handleBookNow = () => {
    setShowPaymentModal(true);
    setPaymentDone(false);
    setPaymentProcessing(false);
  };

  // Handle payment submission (UPI / Card / Cash)
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentProcessing(true);

    if (selectedPayment === 'Cash') {
      // Cash payment confirmed
      setTimeout(() => {
        setPaymentDone(true);
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentProcessing(false);
          setPaymentDone(false);
          handleConfirmBooking();
        }, 1200);
      }, 1000);
    } else {
      // UPI or Card payment simulation (2.2s bank verification)
      setTimeout(() => {
        setPaymentDone(true);
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentProcessing(false);
          setPaymentDone(false);
          handleConfirmBooking();
        }, 1500);
      }, 2200);
    }
  };

  // Handle Cancellation of Booking (Resets map, tracking, order)
  const handleCancelBooking = () => {
    setIsBooked(false);
    setWorkerProgress(0);
    setTrackingStatus('on_the_way');
    setTrackingEta(5);
    setTrackingDistance('1.4 km');
    setShowCancelModal(false);
    setShowChatModal(false);
    setShowCallModal(false);
    setShowPaymentModal(false);
    setPaymentProcessing(false);
    setPaymentDone(false);

    setToastMessage('Service booking cancelled. Tracking order and route map have been reset.');
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: chatInput.trim(), time: 'Just now' }
    ]);
    setChatInput('');

    // Simulated worker reply
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'worker', text: 'Got it! Reaching your exact doorstep in 3 minutes. Please keep the work area clear.', time: 'Just now' }
      ]);
    }, 1500);
  };

  // Quick Simulation controls
  const handleSimulateStatus = (status: 'on_the_way' | 'arrived' | 'started' | 'completed') => {
    setTrackingStatus(status);
    if (status === 'arrived') {
      setWorkerProgress(1);
      setTrackingEta(0);
      setTrackingDistance('At your Doorstep');
    } else if (status === 'started') {
      setWorkerProgress(1);
      setTrackingDistance('Service in Progress');
    } else if (status === 'completed') {
      setWorkerProgress(1);
      setTrackingDistance('Service Completed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] dark:bg-gray-950 flex flex-col pt-20 transition-colors">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-dark text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-fade-in text-xs font-bold">
          <RefreshCw className="w-4 h-4 text-[#FFC928] animate-spin" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Floating Rapido Style Address Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 shadow-sm z-20 sticky top-20 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (isBooked) setShowCancelModal(true);
              else navigate(-1);
            }}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-dark dark:text-gray-200 flex-shrink-0 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Address Box */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-800/90 hover:bg-gray-100/80 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-2.5 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex flex-col items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800 shadow-sm" />
                <span className="w-0.5 h-3 bg-gray-300 dark:bg-gray-600" />
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-800 shadow-sm" />
              </div>

              <div className="min-w-0">
                <div className="text-xs font-bold text-dark dark:text-gray-100 truncate flex items-center gap-1.5">
                  <span>{customerAddress}</span>
                  <button
                    onClick={() => setShowAddressEdit(true)}
                    className="text-gray-400 hover:text-dark dark:hover:text-white p-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {destinationAddress}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddressEdit(true)}
                className="text-xs font-black text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1 ml-2 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Edit Area
              </button>
              
              {/* Dark Mode Toggle in Header */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-dark dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Interactive Map + Bottom Sheet Flow */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        
        {/* MAP SECTION:
            CRITICAL REQUIREMENT:
            - When isBooked (tracking): ONLY the booked worker is on the map! All other workers are hidden.
            - When !isBooked (or after cancellation): Map route is cleared and nearby workers are shown.
        */}
        <div className="w-full lg:w-7/12 h-[360px] sm:h-[420px] lg:h-[calc(100vh-140px)] sticky top-36 z-10">
          <RapidoMap
            center={centerCoords}
            customerLocation={{ lat: centerCoords[0], lng: centerCoords[1], address: customerAddress }}
            workerLocation={{ lat: centerCoords[0] + 0.007, lng: centerCoords[1] + 0.005, name: selectedOption.workerName }}
            isTracking={isBooked}
            workerProgress={workerProgress}
          />
        </div>

        {/* BOTTOM SHEET / SERVICES & TRACKING PANEL */}
        <div className="w-full lg:w-5/12 bg-white dark:bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto transition-colors">
          
          {/* ========================================================================= */}
          {/* VIEW 1: PRE-BOOKING SERVICE SELECTION                                     */}
          {/* ========================================================================= */}
          {!isBooked ? (
            <div className="space-y-4">
              
              {/* Promo Banner */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FFC928] text-dark flex items-center justify-center font-black text-xs">
                    %
                  </div>
                  <div>
                    <p className="text-xs font-black text-dark dark:text-gray-100">Use code COOP50 on {serviceName}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">You get ₹15 off & 10 coins cashback!</p>
                  </div>
                </div>
                <span className="text-xs font-black bg-dark dark:bg-gray-800 text-white px-2.5 py-1 rounded-lg">
                  COOP50
                </span>
              </div>

              {/* Service Category Header */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h2 className="text-lg font-black text-dark dark:text-gray-100 capitalize">{serviceName} Services Available</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cooperative certified workers ready near {customerAddress.split(',')[0]}</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  ⚡ 5 mins away
                </span>
              </div>

              {/* Service Cards List */}
              <div className="space-y-3">
                {serviceOptions.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-dark dark:border-primary bg-yellow-50/50 dark:bg-yellow-950/20 shadow-md ring-1 ring-dark/10'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-850'
                      }`}
                    >
                      {/* Left: Avatar & Details */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={opt.workerAvatar}
                            alt={opt.workerName}
                            className="w-13 h-13 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                            <BadgeCheck className="w-3 h-3" />
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-dark dark:text-gray-100 text-sm truncate">
                              {opt.title}
                            </h3>
                            {opt.badge && (
                              <span className="text-[9px] font-black uppercase tracking-wider bg-dark dark:bg-gray-800 text-[#FFC928] px-1.5 py-0.5 rounded">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {opt.description}
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                            <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {opt.workerRating}
                            </span>
                            <span>•</span>
                            <span className="text-gray-400 font-normal">{opt.workerName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-black text-dark dark:text-gray-100">
                          ₹{opt.discountedPrice}
                        </div>
                        <div className="text-xs text-gray-400 line-through">
                          ₹{opt.originalPrice}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Mode Selector Bar */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowPaymentSelector(true)}
                  className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 rounded-2xl border border-gray-200 dark:border-gray-700 text-left flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {selectedPayment === 'Cash' ? (
                      <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : selectedPayment === 'UPI' ? (
                      <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    )}
                    <span className="text-xs font-black text-dark dark:text-gray-100">{selectedPayment}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setCouponApplied(!couponApplied)}
                  className="p-3 bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100/80 rounded-2xl border border-yellow-200 dark:border-yellow-800/60 text-left flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Percent className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 flex-shrink-0" />
                    <span className="text-xs font-black text-dark dark:text-gray-100 truncate">
                      {couponApplied ? 'COOP50 Applied' : 'Apply Coupon'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    {couponApplied ? '-₹15' : ''}
                  </span>
                </button>
              </div>

              {/* Big Yellow CTA Button — ALWAYS OPENS PAYMENT SELECTION FIRST */}
              <button
                type="button"
                onClick={handleBookNow}
                className="w-full bg-[#FFC928] hover:bg-[#eab418] text-dark font-black text-base py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-2"
              >
                Book {selectedOption.title.split(' ')[0]} • ₹{finalPrice}
              </button>

              <p className="text-center text-[11px] text-gray-400 font-medium">
                Fair cooperative wage model • Direct doorstep arrival
              </p>
            </div>
          ) : (
            /* ========================================================================= */
            /* VIEW 2: LIVE TRACKING VIEW                                                */
            /* ========================================================================= */
            <div className="space-y-5 animate-fade-in">
              
              {/* Status Header with Pulse Radar */}
              <div className="bg-gradient-to-r from-[#1B3A6B] to-[#163264] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 bg-[#FFC928] text-dark text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                      {trackingStatus === 'on_the_way'
                        ? 'Worker On The Way'
                        : trackingStatus === 'arrived'
                        ? 'Worker Arrived'
                        : trackingStatus === 'started'
                        ? 'Service In Progress'
                        : 'Service Completed'}
                    </span>
                    <span className="text-sm font-black text-blue-200">
                      {trackingEta > 0 ? `ETA ${trackingEta} mins` : 'At Doorstep'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-1">
                    {trackingStatus === 'on_the_way'
                      ? `${selectedOption.workerName} is arriving soon`
                      : trackingStatus === 'arrived'
                      ? `${selectedOption.workerName} has arrived!`
                      : trackingStatus === 'started'
                      ? 'Work in progress at your home'
                      : 'Service successfully finished!'}
                  </h3>

                  <p className="text-xs text-blue-200 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FFC928]" />
                    {customerAddress} • Distance: {trackingDistance}
                  </p>
                </div>
              </div>

              {/* Start Service OTP Card */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700/60 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Share with worker upon arrival
                  </span>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 tracking-widest mt-0.5">
                    START OTP: <span className="font-mono bg-white dark:bg-gray-800 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-700">4819</span>
                  </div>
                </div>
                <div className="text-right">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 ml-auto mb-0.5" />
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">Verified Visit</span>
                </div>
              </div>

              {/* ONLY BOOKED WORKER PROFILE CARD */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedOption.workerAvatar}
                      alt={selectedOption.workerName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-gray-700 shadow-md"
                    />
                    <div>
                      <h4 className="font-black text-dark dark:text-white text-base flex items-center gap-1.5">
                        {selectedOption.workerName}
                        <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{selectedOption.cooperativeName}</p>
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {selectedOption.workerRating} • {selectedOption.workerJobs} jobs completed
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-extrabold uppercase text-gray-400 block">Service Bike</span>
                    <span className="text-xs font-mono font-black text-dark dark:text-gray-100 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                      AP 04 BK 8921
                    </span>
                  </div>
                </div>

                {/* Call & Chat Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowCallModal(true)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-750 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-dark dark:text-gray-100 transition-colors shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Call Worker
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChatModal(true)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-dark dark:bg-gray-700 hover:bg-deepBlue dark:hover:bg-gray-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-[#FFC928]" /> Live Chat
                  </button>
                </div>
              </div>

              {/* 5-Stage Live Status Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Live Status Tracker</h4>
                
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span className="text-dark dark:text-gray-100 font-bold">1. Booking Request Accepted</span>
                    <span className="text-gray-400 font-normal ml-auto text-[11px]">Just now</span>
                  </div>

                  <div className={`flex items-center gap-3 ${['on_the_way', 'arrived', 'started', 'completed'].includes(trackingStatus) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                    <Truck className={`w-4 h-4 flex-shrink-0 ${trackingStatus === 'on_the_way' ? 'animate-bounce text-blue-600 dark:text-blue-400' : ''}`} />
                    <span className="text-dark dark:text-gray-100 font-bold">2. Worker On The Way ({trackingDistance})</span>
                    {trackingStatus === 'on_the_way' && (
                      <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-black px-2 py-0.5 rounded-full ml-auto">
                        LIVE
                      </span>
                    )}
                  </div>

                  <div className={`flex items-center gap-3 ${['arrived', 'started', 'completed'].includes(trackingStatus) ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className={['arrived', 'started', 'completed'].includes(trackingStatus) ? 'text-dark dark:text-gray-100 font-bold' : ''}>
                      3. Arrived at Doorstep
                    </span>
                  </div>

                  <div className={`flex items-center gap-3 ${['started', 'completed'].includes(trackingStatus) ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                    <PlayCircle className="w-4 h-4 flex-shrink-0" />
                    <span className={['started', 'completed'].includes(trackingStatus) ? 'text-dark dark:text-gray-100 font-bold' : ''}>
                      4. Service In Progress
                    </span>
                  </div>

                  <div className={`flex items-center gap-3 ${trackingStatus === 'completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span className={trackingStatus === 'completed' ? 'text-dark dark:text-gray-100 font-bold' : ''}>
                      5. Completed & Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Demo Simulator Controls */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl space-y-2">
                <span className="text-[10px] font-black uppercase text-blue-900 dark:text-blue-300 tracking-wider block">
                  ⚡ Live Demo Simulator:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSimulateStatus('on_the_way')}
                    className="py-1.5 px-2 bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 text-blue-900 dark:text-blue-300 rounded-lg text-[10px] font-black border border-blue-200 dark:border-gray-700"
                  >
                    🛵 On Way
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateStatus('arrived')}
                    className="py-1.5 px-2 bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 text-blue-900 dark:text-blue-300 rounded-lg text-[10px] font-black border border-blue-200 dark:border-gray-700"
                  >
                    🚪 Arrived
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateStatus('started')}
                    className="py-1.5 px-2 bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 text-blue-900 dark:text-blue-300 rounded-lg text-[10px] font-black border border-blue-200 dark:border-gray-700"
                  >
                    🔧 Started
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateStatus('completed')}
                    className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black shadow-sm"
                  >
                    🎉 Complete
                  </button>
                </div>
              </div>

              {/* Price Paid & Dashboard Link */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-bold block">Total Amount</span>
                  <span className="text-xl font-black text-dark dark:text-white">₹{finalPrice}</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold ml-1.5">({selectedPayment})</span>
                </div>

                <Link
                  to="/customer-dashboard"
                  className="bg-dark dark:bg-gray-800 hover:bg-deepBlue dark:hover:bg-gray-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition-colors shadow-sm"
                >
                  View in My Bookings →
                </Link>
              </div>

              {/* CANCEL SERVICE BUTTON (Directly in tracking view) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="w-full py-3.5 px-4 rounded-2xl border-2 border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <XCircle className="w-4 h-4" /> Cancel Service Booking
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAYMENT GATEWAY MODAL — UPI / CARD / CASH                                 */}
      {/* ========================================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-dark/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">

            {/* Payment Success Screen */}
            {paymentDone ? (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shadow-inner">
                  <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black text-dark dark:text-white">
                  {selectedPayment === 'Cash' ? 'Booking Confirmed! 🎉' : 'Payment Successful! 🎉'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {selectedPayment === 'Cash' ? `₹${finalPrice} to be paid in Cash upon arrival` : `₹${finalPrice} paid via ${selectedPayment}`}
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Opening live tracking now...
                </p>
              </div>
            ) : paymentProcessing ? (
              /* Payment Processing */
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center relative">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 animate-spin absolute" />
                  {selectedPayment === 'UPI' ? (
                    <Smartphone className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  ) : selectedPayment === 'Card' ? (
                    <CreditCard className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Banknote className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-dark dark:text-white">
                    {selectedPayment === 'Cash' ? 'Confirming Dispatch...' : 'Processing Payment...'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedPayment === 'Cash' ? 'Assigning cooperative worker to your doorstep' : `Verifying your ${selectedPayment} payment through bank gateway`}
                  </p>
                </div>
                <div className="flex gap-1.5 justify-center">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            ) : (
              /* Payment Selection & Form */
              <form onSubmit={handlePaymentSubmit}>
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#1B3A6B] to-[#163264] p-5 flex items-center justify-between text-white">
                  <div>
                    <h3 className="font-black text-base">Select Payment Method</h3>
                    <p className="text-blue-200 text-xs font-medium">Verify payment before live tracking</p>
                  </div>
                  <button type="button" onClick={() => setShowPaymentModal(false)} className="p-1.5 text-white/70 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Amount Banner */}
                <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-100 dark:border-amber-800/60 px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Payable</p>
                    <p className="text-2xl font-black text-dark dark:text-white">₹{finalPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium">{selectedOption.title}</p>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">🔒 DailSmart Protected</p>
                  </div>
                </div>

                {/* Payment Method Tabs */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('UPI')}
                      className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                        selectedPayment === 'UPI'
                          ? 'bg-white dark:bg-gray-700 text-dark dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" /> UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('Card')}
                      className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                        selectedPayment === 'Card'
                          ? 'bg-white dark:bg-gray-700 text-dark dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('Cash')}
                      className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                        selectedPayment === 'Cash'
                          ? 'bg-white dark:bg-gray-700 text-dark dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white'
                      }`}
                    >
                      <Banknote className="w-3.5 h-3.5" /> Cash
                    </button>
                  </div>

                  {selectedPayment === 'UPI' && (
                    <>
                      {/* UPI QR Code */}
                      <div className="flex flex-col items-center gap-2 py-1">
                        <div className="w-32 h-32 bg-white border-4 border-dark dark:border-gray-700 rounded-2xl flex items-center justify-center shadow-md p-2">
                          <div className="grid grid-cols-7 gap-0.5 w-full h-full">
                            {Array.from({ length: 49 }).map((_, i) => (
                              <div
                                key={i}
                                className={`rounded-[1px] ${
                                  [0,1,2,3,4,5,6,7,14,21,28,35,42,43,44,45,46,47,48,
                                   8,15,10,11,12,13,24,25,26,33,34,36,41].includes(i)
                                    ? 'bg-dark' : 'bg-white'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Scan via GPay, PhonePe, Paytm, BHIM</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <span className="text-[10px] font-black text-gray-400 uppercase">Or Enter UPI ID</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Your UPI ID</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. yourname@okaxis / @ybl"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-dark dark:text-white font-bold text-sm focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </>
                  )}

                  {selectedPayment === 'Card' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Card Number</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim())}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-dark dark:text-white font-bold text-sm focus:border-blue-500 focus:outline-none font-mono tracking-widest"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          placeholder="VISHNU KUMAR"
                          value={cardName}
                          onChange={e => setCardName(e.target.value.toUpperCase())}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-dark dark:text-white font-bold text-sm focus:border-blue-500 focus:outline-none uppercase"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Expiry</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={e => {
                              const v = e.target.value.replace(/\D/g,'');
                              setCardExpiry(v.length > 2 ? v.slice(0,2)+'/'+v.slice(2) : v);
                            }}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-dark dark:text-white font-bold text-sm focus:border-blue-500 focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">CVV</label>
                          <input
                            type="password"
                            required
                            maxLength={3}
                            placeholder="•••"
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value.replace(/\D/g,''))}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-dark dark:text-white font-bold text-sm focus:border-blue-500 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedPayment === 'Cash' && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-2 text-left">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-sm">
                        <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        Pay on Completion
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        Pay <strong>₹{finalPrice}</strong> directly in cash to <strong>{selectedOption.workerName}</strong> after the service is performed to your satisfaction.
                      </p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                        🔒 Authenticated with secure 4-digit start OTP on arrival.
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#FFC928] hover:bg-[#eab418] text-dark font-black text-base py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-2"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    {selectedPayment === 'Cash'
                      ? `Confirm Cash Booking • ₹${finalPrice}`
                      : `Pay ₹${finalPrice} via ${selectedPayment}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANCEL SERVICE CONFIRMATION MODAL                                         */}
      {/* ========================================================================= */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-dark dark:text-white mb-1.5">
              Cancel Service Booking?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Are you sure you want to cancel this booking with <strong>{selectedOption.workerName}</strong>? The live tracking and route map for this order will be cleared and reset.
            </p>

            <div className="mb-4">
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                Reason for cancellation (optional)
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-dark dark:text-white focus:outline-none"
              >
                <option value="">Select reason...</option>
                <option value="Issue resolved">Issue resolved on my own</option>
                <option value="Need to reschedule">Need to reschedule for later</option>
                <option value="Selected wrong service">Selected wrong service type</option>
                <option value="Worker taking too long">Emergency cancelled</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT LOCATION MODAL                                              */}
      {/* ========================================================================= */}
      {showAddressEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-dark dark:text-white text-lg">Edit Service Location</h3>
              <button onClick={() => setShowAddressEdit(false)} className="p-1.5 text-gray-400 hover:text-dark dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Pickup / Doorstep Location</label>
              <input
                type="text"
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                placeholder="Enter Street / Area / Landmark"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-dark dark:text-white font-bold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Doorstep Destination</label>
              <input
                type="text"
                value={destinationAddress}
                onChange={e => setDestinationAddress(e.target.value)}
                placeholder="Eswaramma Colony, Doorstep"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-dark dark:text-white font-bold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {['2/419, Madanapalle', 'Eswaramma Colony', 'Gandhi Road, Chittoor', 'NVR Layout, Madanapalle', 'Tirupati Bazaar'].map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setCustomerAddress(chip)}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  {chip}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAddressEdit(false)}
              className="w-full bg-[#FFC928] hover:bg-[#eab418] text-dark font-black py-3 rounded-xl transition-colors mt-2"
            >
              Update Map Location
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PAYMENT METHOD QUICK SELECTOR MODAL                              */}
      {/* ========================================================================= */}
      {showPaymentSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-dark dark:text-white text-lg">Choose Payment Mode</h3>
              <button onClick={() => setShowPaymentSelector(false)} className="p-1.5 text-gray-400 hover:text-dark dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'UPI', name: 'UPI (GPay, PhonePe, Paytm)', desc: 'Instant escrow secured payment', icon: Smartphone },
                { id: 'Card', name: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay', icon: CreditCard },
                { id: 'Cash', name: 'Cash on Service Completion', desc: 'Pay directly to worker after job completion', icon: Banknote },
              ].map(method => (
                <div
                  key={method.id}
                  onClick={() => {
                    setSelectedPayment(method.id as any);
                    setShowPaymentSelector(false);
                  }}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                    selectedPayment === method.id
                      ? 'border-dark dark:border-primary bg-yellow-50/50 dark:bg-yellow-950/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-dark dark:text-gray-200">
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-dark dark:text-white">{method.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{method.desc}</p>
                    </div>
                  </div>
                  {selectedPayment === method.id && <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: WORKER LIVE CHAT MODAL                                           */}
      {/* ========================================================================= */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col h-[520px] border border-gray-100 dark:border-gray-800">
            {/* Header */}
            <div className="bg-[#1B3A6B] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={selectedOption.workerAvatar} alt={selectedOption.workerName} className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                <div>
                  <h4 className="font-black text-sm">{selectedOption.workerName}</h4>
                  <p className="text-[11px] text-blue-200">On the way • 4 mins away</p>
                </div>
              </div>
              <button onClick={() => setShowChatModal(false)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat message list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 dark:bg-gray-950">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs font-medium ${
                    msg.sender === 'user'
                      ? 'bg-dark text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-gray-100 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                    <span className="block text-[9px] text-gray-400 mt-1 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex gap-2">
              <input
                type="text"
                placeholder="Type a message (e.g. Near green gate)..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-dark dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#FFC928] hover:bg-[#eab418] text-dark font-black px-4 py-2.5 rounded-xl text-xs transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CALL WORKER MODAL                                                */}
      {/* ========================================================================= */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Phone className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <h3 className="font-black text-dark dark:text-white text-lg">Call {selectedOption.workerName}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Assigned Cooperative Service Partner</p>
              <p className="font-mono text-base font-black text-dark dark:text-white mt-2 bg-gray-50 dark:bg-gray-800 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
                +91 98492 10482
              </p>
            </div>

            <p className="text-[11px] text-gray-400">Calls are masked & protected via DailSmart secure cooperative gateway.</p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCallModal(false)}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-dark dark:text-gray-200 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <a
                href="tel:+919849210482"
                onClick={() => setShowCallModal(false)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
              >
                <Phone className="w-3.5 h-3.5" /> Call Now
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
