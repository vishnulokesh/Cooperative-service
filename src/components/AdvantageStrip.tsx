import { ShieldCheck, IndianRupee, HeartHandshake, MapPin } from 'lucide-react';

const AdvantageStrip = () => {
  return (
    <section className="bg-white border-y border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0 first:pt-0">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <ShieldCheck className="text-deepBlue w-6 h-6" />
            </div>
            <h3 className="font-bold text-dark text-lg mb-2">Verified Skills</h3>
            <p className="text-sm text-gray-500">Workers are verified through cooperative processes.</p>
          </div>

          <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <IndianRupee className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="font-bold text-dark text-lg mb-2">Fair Wages</h3>
            <p className="text-sm text-gray-500">Transparent distribution of service earnings.</p>
          </div>

          <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0">
            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center mb-4">
              <HeartHandshake className="text-pink-600 w-6 h-6" />
            </div>
            <h3 className="font-bold text-dark text-lg mb-2">Worker Welfare</h3>
            <p className="text-sm text-gray-500">Support for insurance, training and welfare.</p>
          </div>

          <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0">
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
              <MapPin className="text-yellow-600 w-6 h-6" />
            </div>
            <h3 className="font-bold text-dark text-lg mb-2">Local Workforce</h3>
            <p className="text-sm text-gray-500">Keep skilled workers connected to their communities.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AdvantageStrip;
