import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader, Receipt, ArrowRight, IndianRupee, FileText } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CustomerPayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPayments() {
      if (!user) return;
      try {
        setLoading(true);
        const data = await api.getCustomerPayments(user.id);
        setPayments(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load payment history.');
      } finally {
        setLoading(false);
      }
    }
    
    loadPayments();
  }, [user]);

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-dark mb-4">{error}</h2>
        <Link to="/customer-dashboard" className="text-primary font-bold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="bg-lightBg min-h-screen pb-24 pt-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <Link 
          to="/customer-dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-dark font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
            <Receipt className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-dark">Payment History</h1>
        </div>

        {payments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-dark mb-2">No payments yet</h2>
            <p className="text-gray-500 mb-6">You haven't made any payments for services yet.</p>
            <Link to="/services" className="inline-block bg-primary text-dark font-bold py-3 px-6 rounded-xl hover:bg-yellow-400 transition-colors">
              Explore Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map(payment => (
              <div key={payment.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <IndianRupee className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-dark mb-1">
                      {payment.booking?.service?.name || 'Unknown Service'}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Worker: {payment.booking?.worker?.profiles?.full_name || 'N/A'}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400">
                        {new Date(payment.paid_at || payment.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs font-mono text-gray-400">
                        {payment.transaction_reference}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                  <div className="text-right">
                    <span className="block text-2xl font-black text-dark mb-1">₹{payment.amount}</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      payment.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 
                      payment.payment_status === 'refunded' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {payment.payment_status}
                    </span>
                  </div>

                  <Link 
                    to={`/invoice/${payment.booking_id}`}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-dark transition-colors"
                  >
                    <FileText className="w-4 h-4" /> View Invoice <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
