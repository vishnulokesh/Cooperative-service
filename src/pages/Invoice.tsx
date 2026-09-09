import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Download, Printer, Loader, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Invoice() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  
  const [booking, setBooking] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInvoice() {
      if (!bookingId) return;
      try {
        setLoading(true);
        const [bk, pay] = await Promise.all([
          api.getBookingById(bookingId),
          api.getPaymentByBookingId(bookingId)
        ]);

        if (bk.customer_id !== user?.id) {
          throw new Error('Unauthorized');
        }

        setBooking(bk);
        setPayment(pay);
      } catch (err) {
        console.error(err);
        setError('Failed to load invoice or unauthorized.');
      } finally {
        setLoading(false);
      }
    }
    
    if (user) loadInvoice();
  }, [bookingId, user]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Generating invoice...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-dark mb-4">{error || 'Invoice not found'}</h2>
        <Link to="/customer-dashboard" className="text-primary font-bold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="bg-lightBg min-h-screen pb-24 pt-12 print:bg-white print:pt-0">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        
        {/* Print non-visible header controls */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link 
            to={`/bookings/${booking.id}`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-dark font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Booking
          </Link>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-dark hover:bg-gray-50">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-lg text-sm font-bold hover:bg-deepBlue">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        {/* Invoice Paper */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 print:shadow-none print:border-none print:p-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12 border-b border-gray-100 pb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-dark mb-1">COOPSERVE</h1>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Cooperative Service Invoice</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm font-bold text-gray-500 mb-1">Invoice No: <span className="text-dark font-mono">{payment?.id?.split('-')[0].toUpperCase() || 'N/A'}</span></p>
              <p className="text-sm font-bold text-gray-500 mb-1">Booking ID: <span className="text-dark font-mono">{booking.id.split('-')[0].toUpperCase()}</span></p>
              <p className="text-sm font-bold text-gray-500">Date: <span className="text-dark">{new Date(payment?.paid_at || booking.created_at).toLocaleDateString()}</span></p>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
              <h3 className="font-bold text-dark text-lg mb-1">{booking.customer.full_name}</h3>
              <p className="text-sm text-gray-600 mb-1">{booking.service_address}</p>
              <p className="text-sm text-gray-600">{booking.city}, {booking.district}, {booking.state}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service Provider</p>
              <h3 className="font-bold text-dark text-lg mb-1">{booking.worker.profile.full_name}</h3>
              <p className="text-sm text-gray-600 mb-1">{booking.worker.professional_title}</p>
              <p className="text-sm text-gray-600">{booking.cooperative.name}</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="mb-12">
            <h3 className="font-bold text-dark mb-4 text-lg">Service Details</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 font-bold text-gray-600">Description</th>
                    <th className="py-3 px-4 font-bold text-gray-600 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-4 px-4">
                      <p className="font-bold text-dark">{booking.service.name}</p>
                      {booking.service_type_id && <p className="text-gray-500 mt-1">{booking.service_type_id}</p>}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-dark">
                      ₹{booking.base_amount || booking.estimated_amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown (Transparent Pricing) */}
          <div className="mb-12">
            <h3 className="font-bold text-dark mb-4 text-lg">Payment Distribution (Fair-Wage)</h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Worker Earnings</span>
                <span className="text-dark font-bold">₹{booking.worker_amount || '...'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Cooperative Contribution</span>
                <span className="text-dark font-bold">₹{booking.cooperative_amount || '...'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Platform Operations</span>
                <span className="text-dark font-bold">₹{booking.platform_amount || '...'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Payment Charges</span>
                <span className="text-dark font-bold">₹{booking.payment_fee || '...'}</span>
              </div>
              
              <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between items-center">
                <span className="text-dark font-bold text-lg">Total</span>
                <span className="text-green-600 font-black text-xl flex items-center">
                  <IndianRupee className="w-5 h-5" /> {booking.total_amount || booking.estimated_amount}
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-8 mt-8">
            <div className="mb-4 sm:mb-0 text-center sm:text-left">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Status</p>
              {payment?.payment_status === 'paid' ? (
                <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                  <CheckCircle2 className="w-6 h-6" /> PAID IN FULL
                </div>
              ) : (
                <div className="text-yellow-600 font-bold text-lg uppercase">
                  PAYMENT PENDING
                </div>
              )}
            </div>
            
            {payment?.payment_status === 'paid' && (
              <div className="text-center sm:text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Method & Ref</p>
                <p className="text-sm font-bold text-dark capitalize mb-1">{payment.payment_method.replace('_', ' ')}</p>
                <p className="text-xs font-mono text-gray-500">{payment.transaction_reference}</p>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t border-dashed border-gray-200 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Thank you for supporting cooperative labor. Your payment ensures fair wages and helps build a sustainable worker ecosystem.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
