import PageLayout from '../components/PageLayout';
import { ShieldCheck, HeartHandshake, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Hero */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="px-3 py-1 bg-primary/20 text-dark font-extrabold text-xs uppercase tracking-widest rounded-full">
              Our Mission & Vision
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-dark tracking-tight leading-tight">
              Work Together. <span className="text-deepBlue">Serve Better.</span>
            </h1>
            <p className="text-gray-600 text-lg font-medium leading-relaxed">
              DailSmart Solutions is India’s first cooperative-owned digital marketplace connecting verified skilled workers from Labour Cooperative Societies with household and community service seekers.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-dark">Cooperative Ownership</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Unlike corporate gig platforms, DailSmart Solutions is co-owned by Labour Cooperatives. 90% of service revenues directly enrich workers and community welfare funds.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-dark">100% Verification</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Every worker on DailSmart Solutions undergoes identity check, police verification, skill testing, and background vetting by registered Labour Cooperative Federations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-dark">Fair Wage Guarantee</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                We enforce district-mandated minimum floor wages, healthcare coverage, and accident insurance for all cooperative workers.
              </p>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="bg-dark text-white rounded-3xl p-8 lg:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl lg:text-4xl font-black text-primary">38+</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Labour Coops</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-black text-primary">1,246+</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Verified Workers</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-black text-primary">18,934+</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Services Delivered</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-black text-primary">4.8★</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Customer Rating</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-primary/10 border border-primary/30 p-8 rounded-3xl space-y-4">
            <h3 className="text-2xl font-black text-dark">Ready to experience ethical home services?</h3>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              Book a verified electrician, plumber, cleaner, or caregiver today and support worker dignity.
            </p>
            <div className="pt-2">
              <Link to="/find-worker" className="px-6 py-3 bg-dark text-white font-extrabold text-sm rounded-xl hover:bg-dark/90 transition-all inline-flex items-center gap-2">
                Book a Service Now <ArrowRight className="w-4 h-4 text-primary" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
