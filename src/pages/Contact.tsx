import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'General Query', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageLayout>
      <div className="bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-black text-dark tracking-tight">Get in Touch with DailSmart Solutions</h1>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Have questions about booking a service, onboarding your Labour Cooperative Society, or emergency support? We are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Info Column */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-dark text-sm">Head Office</h4>
                  <p className="text-xs text-gray-500 mt-1">Cooperative House, District Collectorate Road, Chittoor, Andhra Pradesh - 517001</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-dark text-sm">Emergency & Helpline</h4>
                  <p className="text-xs text-gray-500 mt-1">+91 1800-425-9999 (Toll Free)</p>
                  <p className="text-xs text-gray-500">+91 877-2244-100</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-dark text-sm">Email Support</h4>
                  <p className="text-xs text-gray-500 mt-1">support@dailsmart.in</p>
                  <p className="text-xs text-gray-500">cooperatives@dailsmart.in</p>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-dark">Message Sent Successfully!</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Thank you for reaching out to DailSmart Solutions. Our cooperative support team will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: 'General Query', message: '' }); }}
                    className="px-6 py-2.5 bg-dark text-white font-extrabold text-xs rounded-xl hover:bg-dark/90"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-black text-dark mb-4">Send Us a Message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1">Topic</label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none font-medium"
                    >
                      <option value="General Query">Customer General Inquiry</option>
                      <option value="Cooperative Registration">Register a Labour Cooperative</option>
                      <option value="Worker Registration">Worker Onboarding Support</option>
                      <option value="Corporate/Bulk Booking">Community & Institutional Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-dark font-black text-sm rounded-xl hover:bg-yellow-400 shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </PageLayout>
  );
}
