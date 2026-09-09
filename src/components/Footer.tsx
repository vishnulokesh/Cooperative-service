import { Link } from 'react-router-dom';
import { DailSmartLogo } from './DailSmartLogo';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-10 px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <DailSmartLogo className="h-10" showTagline={true} />
            </Link>
            <p className="text-amber-400 font-bold text-sm tracking-wide">
              AUTOMATE | INNOVATE | ACCELERATE
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              DailSmart Solutions Private Limited is India’s premier digital home & industrial service platform connecting verified skilled workers and cooperatives with households & enterprises.
            </p>
          </div>

          {/* Service Categories */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 text-amber-400">Services</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">Plumbing & Pipe Leakage</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">Electrical & Fan Repair</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">AC & Appliance Servicing</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">Deep House Cleaning</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">Interior & Wall Painting</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 text-amber-400">Join Partner Network</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link to="/login?role=worker" className="hover:text-amber-400 transition-colors font-semibold text-amber-300">Become a Worker Partner</Link></li>
              <li><Link to="/cooperatives" className="hover:text-amber-400 transition-colors">Cooperative Society Partner</Link></li>
              <li><Link to="/welfare" className="hover:text-amber-400 transition-colors">PM-JAY Worker Social Security</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact Corporate Office</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 text-amber-400">Governance</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link to="/admin/dashboard" className="hover:text-amber-400 transition-colors">Admin Portal</Link></li>
              <li><Link to="/skills" className="hover:text-amber-400 transition-colors">Digital Skill Passport</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">About DailSmart</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left">
            © 2026 <strong>DailSmart Solutions Private Limited</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="#" className="hover:text-white transition-colors">Escrow Guarantee</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
