import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, MapPin, BadgeCheck, XCircle,
  Loader, Calendar as CalendarIcon, CheckCircle2, Truck, PlayCircle, Smartphone,
  CreditCard, Landmark, Banknote, Sparkles, Phone, ShieldCheck, MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RapidoMap from '../components/RapidoMap';

const STATUS_STEPS = [
  { key: 'requested', label: 'Requested', icon: Clock },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle2 },
  { key: 'on_the_way', label: 'Worker On The Way', icon: Truck },
  { key: 'started', label: 'Started', icon: PlayCircle },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
];

function getStepIndex(status: string) {
  switch (status) {
    case 'requested':
    case 'pending': return 0;
    case 'accepted':
    case 'confirmed': return 1;
    case 'on_the_way': return 2;
    case 'started':
    case 'in_progress': return 3;
    case 'completed': return 4;
    default: return -1;
  }
}

export default function BookingDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [booking, setBooking] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Cash'>('UPI');
  const [upiVpa, setUpiVpa] = useState('user@oksbi');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const [bk, hist, pay] = await Promise.all([
          api.getBookingById(id),
          api.getBookingStatusHistory(id),
          api.getPaymentByBookingId(id)
        ]);
        
        if (!bk) throw new Error('Booking not found');
        setBooking(bk);
        setHistory(hist);
        setPayment(pay);
      } catch (err: any) {
        console.error(err);
        setError('Booking not found or failed to load.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, user]);

  const handleCancel = async () => {
    if (!cancelReason) return;
    try {
      setCancelling(true);
      await api.cancelBooking(booking.id, user?.id, cancelReason);
      
      const [bk, hist] = await Promise.all([
        api.getBookingById(booking.id),
        api.getBookingStatusHistory(booking.id)
      ]);
      setBooking(bk);
      setHistory(hist);
      setShowCancelModal(false);
      setToast('Booking has been cancelled.');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const handleAdvanceStatus = async () => {
    const cycle = ['requested', 'accepted', 'on_the_way', 'started', 'completed'];
    const currentIdx = cycle.indexOf(booking.status);
    const nextStatus = currentIdx >= 0 && currentIdx < cycle.length - 1 ? cycle[currentIdx + 1] : 'requested';
    
    try {
      await api.updateBookingStatus(booking.id, nextStatus);
      const [bk, hist] = await Promise.all([
        api.getBookingById(booking.id),
        api.getBookingStatusHistory(booking.id)
      ]);
      setBooking(bk);
      setHistory(hist);
      setToast(`Status advanced to ${nextStatus.replace(/_/g, ' ')}!`);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleProcessPayment = async () => {
    try {
      setProcessingPayment(true);
      const payRecord = await api.processDemoPayment(
        booking.id,
        user?.id,
        booking.total_amount || booking.estimated_amount,
        paymentMethod
      );
      setPayment(payRecord);
      setBooking((prev: any) => ({ ...prev, payment_status: 'paid', payment_method: paymentMethod }));
      setShowPaymentModal(false);
      setToast(`Payment of ₹${booking.total_amount || 350} completed via ${paymentMethod}!`);
      setTimeout(() => setToast(null), 4000);
    } catch(err) {
      console.error(err);
      alert('Payment failed.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading booking status tracker...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-dark mb-4">{error || 'Booking not found'}</h2>
        <Link to="/customer-dashboard" className="text-primary font-bold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  const currentStep = getStepIndex(booking.status);
  const isCancelled = booking.status === 'cancelled' || booking.status === 'rejected';
  const isPaid = booking.payment_status === 'paid' || payment?.status === 'completed';
  const worker = booking.worker || {};

  return (
    <div className="bg-lightBg min-h-screen pb-24 pt-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 right-8 bg-dark text-white px-5 py-3 rounded-2xl shadow-2xl border border-primary z-50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Navigation back */}
        <Link 
          to="/customer-dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-dark px-3 py-2 bg-white rounded-xl border border-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Bookings
        </Link>

        {/* Title & Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-dark tracking-tight">Booking #{booking.id}</h1>
              {booking.is_emergency && (
                <span className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider flex items-center gap-1">
                  🚨 Emergency
                </span>
              )}
            </div>
            <p className="text-gray-500 text-xs font-medium">
              Created on {new Date(booking.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Status simulator button for easy demo testing */}
            <button
              onClick={handleAdvanceStatus}
              title="Click to cycle status: Requested -> Accepted -> On The Way -> Started -> Completed"
              className="bg-primary/20 hover:bg-primary text-dark font-black text-xs px-3.5 py-2 rounded-xl border border-primary/40 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" /> Simulate Next Status
            </button>
          </div>
        </div>

        {/* STATUS TRACKER CARD */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-dark flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" /> Live Service Tracking
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Current Status: <strong className="text-dark uppercase font-black">{booking.status.replace(/_/g, ' ')}</strong>
              </p>
            </div>
            {isPaid ? (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-300">
                ✓ Payment Received
              </span>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" /> Pay ₹{booking.total_amount || 350}
              </button>
            )}
          </div>

          {isCancelled ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-center gap-3 text-rose-900 text-sm font-bold">
              <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
              <div>This booking has been cancelled. No cancellation fee was charged.</div>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 pt-2">
              {STATUS_STEPS.map((step, idx) => {
                const isDone = currentStep >= idx;
                const isCurrent = currentStep === idx;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-dark text-white ring-4 ring-primary/40 font-bold scale-110 shadow-md'
                          : isDone
                          ? 'bg-emerald-500 text-white font-bold'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs font-bold mt-2.5 leading-tight ${
                        isCurrent ? 'text-dark font-black' : isDone ? 'text-emerald-700 font-bold' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Live Rapido / Zomato Map Tracking View */}
          {!isCancelled && (
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
              {/* Start Service OTP Card */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                    Share with worker upon arrival
                  </span>
                  <div className="text-2xl font-black text-emerald-700 tracking-widest mt-0.5">
                    START OTP: <span className="font-mono bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200">4819</span>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-800 hidden sm:inline">Cooperative Verified</span>
                </div>
              </div>

              {/* Embedded Live Map */}
              <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm h-64 sm:h-80 relative">
                <RapidoMap
                  center={[13.5560, 78.5010]}
                  customerLocation={{
                    lat: 13.5560,
                    lng: 78.5010,
                    address: `${booking.service_address || '2/419'}, ${booking.city || 'Madanapalle'}`
                  }}
                  workerLocation={{
                    lat: 13.5560 + (booking.status === 'on_the_way' ? 0.0035 : booking.status === 'started' || booking.status === 'completed' ? 0 : 0.007),
                    lng: 78.5010 + (booking.status === 'on_the_way' ? 0.0025 : booking.status === 'started' || booking.status === 'completed' ? 0 : 0.005),
                    name: worker.name || 'Surya Prakash'
                  }}
                  isTracking={['on_the_way', 'started'].includes(booking.status)}
                  workerProgress={booking.status === 'started' || booking.status === 'completed' ? 1 : booking.status === 'on_the_way' ? 0.5 : 0}
                />
              </div>

              {/* Worker Quick Actions */}
              <div className="flex gap-3">
                <a
                  href="tel:+919849210482"
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call {worker.name || 'Worker'}
                </a>
                <button
                  type="button"
                  onClick={() => alert(`Opening live chat with ${worker.name || 'Worker'}...`)}
                  className="flex-1 py-3 px-4 bg-dark hover:bg-deepBlue text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#FFC928]" /> Message
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Service & Schedule */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-black text-dark mb-4">Service & Location</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase">Service Category</span>
                  <p className="font-black text-dark mt-0.5">{booking.service_name || booking.service?.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase">Appointment Time</span>
                  <p className="font-bold text-dark mt-0.5 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    {booking.scheduled_date} at {booking.scheduled_start_time}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
                <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> Service Address
                </span>
                <p className="font-bold text-dark mt-1">
                  {booking.service_address || 'Address provided'}, {booking.city || 'Chittoor'}, {booking.state || 'Andhra Pradesh'}
                </p>
              </div>

              {booking.customer_notes && (
                <div className="mt-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-xs">
                  <span className="font-bold text-amber-800 uppercase">Customer Instructions:</span>
                  <p className="text-dark font-medium mt-1">{booking.customer_notes}</p>
                </div>
              )}
            </div>

            {/* Timeline Log */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-black text-dark mb-4">Status Change Logs</h3>
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-dark uppercase">{item.status.replace(/_/g, ' ')}</span>
                        <span className="text-gray-400 font-mono">
                          {new Date(item.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-500 mt-0.5">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Worker Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block mb-3">
                Assigned Worker
              </span>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={worker.avatar || 'https://i.pravatar.cc/150?img=51'}
                  alt={worker.name || 'Worker'}
                  className="w-14 h-14 rounded-2xl object-cover bg-gray-50"
                />
                <div>
                  <h4 className="font-black text-dark text-base flex items-center gap-1">
                    {worker.name || 'Technician'}
                    <BadgeCheck className="w-4 h-4 text-emerald-500" />
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">{worker.role || 'Service Expert'}</p>
                  <p className="text-[11px] text-blue-600 font-bold">{worker.cooperativeName || 'Cooperative Certified'}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-xs font-semibold text-gray-600 flex items-center justify-between border border-gray-100">
                <span>Rating</span>
                <span className="font-black text-dark">⭐ {worker.rating || 4.9}</span>
              </div>
            </div>

            {/* Estimated Service Cost Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block mb-3">
                Estimated Service Cost
              </span>

              <div className="space-y-2.5 text-xs text-gray-600 pb-4 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>Base Visit Charge</span>
                  <span className="font-bold text-dark">₹{booking.total_amount ? booking.total_amount - 93 : 350}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform & Society Fee</span>
                  <span className="font-bold text-dark">₹50</span>
                </div>
                <div className="flex justify-between">
                  <span>Worker Welfare Contribution</span>
                  <span className="font-bold text-dark">₹25</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-bold text-dark">₹18</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 mb-4">
                <span className="font-black text-dark text-sm">Total Amount</span>
                <span className="text-xl font-black text-emerald-600">₹{booking.total_amount || 443}</span>
              </div>

              {/* Payment Mode Status */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs flex items-center justify-between">
                <span className="text-gray-500">Payment:</span>
                <span className="font-bold text-dark flex items-center gap-1">
                  {booking.payment_method || 'UPI'}
                  <span className={`px-1.5 py-0.5 text-[10px] rounded font-black uppercase ${
                    isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isPaid ? 'Paid' : 'Pending'}
                  </span>
                </span>
              </div>

              {!isPaid && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <CreditCard className="w-4 h-4" /> Pay Online Now
                </button>
              )}

              {['requested', 'accepted'].includes(booking.status) && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full mt-2 text-rose-600 hover:bg-rose-50 font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Cancel Booking
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-black text-dark mb-2">Cancel Service Booking</h3>
            <p className="text-xs text-gray-500 mb-4">Please specify a reason for cancellation:</p>
            <select
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-xs font-bold text-dark mb-4"
            >
              <option value="">Select cancellation reason...</option>
              <option value="Issue resolved on my own">Issue resolved on my own</option>
              <option value="Worker delay / not reachable">Worker delay / not reachable</option>
              <option value="Wrong address / time selected">Wrong address / time selected</option>
              <option value="Emergency cancelled">Emergency cancelled</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Keep
              </button>
              <button
                onClick={handleCancel}
                disabled={!cancelReason || cancelling}
                className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in">
            <h3 className="text-xl font-black text-dark mb-1">Choose Payment Option</h3>
            <p className="text-xs text-gray-500 mb-4">Amount: <strong className="text-emerald-600 font-black">₹{booking.total_amount || 350}</strong></p>

            <div className="space-y-2 mb-4">
              {[
                { id: 'UPI', label: 'UPI (GPay, PhonePe, Paytm)', icon: Smartphone },
                { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard },
                { id: 'Net Banking', label: 'Net Banking (SBI, HDFC, Grameena)', icon: Landmark },
                { id: 'Cash', label: 'Cash on Service Completion', icon: Banknote },
              ].map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id as any)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                      paymentMethod === opt.id ? 'border-dark bg-dark/5 font-black text-dark' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" /> {opt.label}
                    </span>
                    {paymentMethod === opt.id && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'UPI' && (
              <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">UPI VPA</label>
                <input
                  type="text"
                  value={upiVpa}
                  onChange={e => setUpiVpa(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-dark bg-white border border-gray-300 rounded-lg"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayment}
                disabled={processingPayment}
                className="flex-[2] py-3 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-sm"
              >
                {processingPayment ? <Loader className="w-4 h-4 animate-spin" /> : `Pay ₹${booking.total_amount || 350}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
