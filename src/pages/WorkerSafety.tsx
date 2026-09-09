import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, CheckCircle2, PhoneCall, HeartPulse } from 'lucide-react';

export default function WorkerSafety() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12 animate-fade-in space-y-8">
      
      <Link to="/welfare" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-dark transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Welfare
      </Link>

      <div>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-dark flex items-center gap-3">
          <ShieldAlert className="w-10 h-10 text-orange-500" /> Worker Safety Center
        </h1>
        <p className="text-gray-500 mt-3 font-medium text-lg">Practical guidelines and emergency procedures.</p>
      </div>

      <div className="bg-orange-50 border border-orange-200 text-orange-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-black mb-1 flex items-center gap-2"><PhoneCall className="w-5 h-5" /> Emergency Support</h2>
          <p className="text-sm font-medium opacity-80">If you are in immediate danger or require urgent medical assistance, contact local authorities immediately.</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap shadow-md">
          Call Authorities
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
          <h3 className="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-3">Before Accepting a Job</h3>
          <ul className="space-y-4 flex-1">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-dark block">Confirm Service Location</span>
                <span className="text-sm text-gray-500 font-medium">Review the area and ensure you can travel there safely.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-dark block">Check Required Equipment</span>
                <span className="text-sm text-gray-500 font-medium">Verify you have the appropriate tools and protective gear.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-dark block">Review Customer Notes</span>
                <span className="text-sm text-gray-500 font-medium">Read all details provided to anticipate potential hazards.</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
          <h3 className="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-3">During Service</h3>
          <ul className="space-y-4 flex-1">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-dark block">Use Appropriate Safety Equipment</span>
                <span className="text-sm text-gray-500 font-medium">Always wear the required PPE (gloves, masks, goggles) for your trade.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-dark block">Follow Professional Procedures</span>
                <span className="text-sm text-gray-500 font-medium">Do not take shortcuts that compromise safety. Adhere to your certified training.</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-500" /> Emergency Guidelines
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-dark block">Contact emergency services when appropriate</span>
                <span className="text-sm text-gray-500 font-medium">Do not hesitate to call 112 (or local emergency numbers) for medical, fire, or immediate security threats.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-dark block">Use CoopServe Emergency Support</span>
                <span className="text-sm text-gray-500 font-medium">For non-life-threatening but urgent job-related issues, contact your Cooperative Admin via the support portal.</span>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
