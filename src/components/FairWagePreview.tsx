import { IndianRupee, PieChart, Heart, Building2 } from 'lucide-react';

const FairWagePreview = () => {
  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">Where Your Money Goes</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlike traditional gig platforms, our cooperative model ensures transparent and fair distribution of your payment.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="mb-8">
          <h3 className="text-lg font-bold text-dark mb-1 flex items-center justify-center gap-2">
            Example: Plumbing Service
          </h3>
          <div className="text-center text-sm text-gray-500">Customer pays: <span className="font-bold text-dark text-xl ml-1">₹500</span></div>
        </div>

        {/* Visual Bar */}
        <div className="flex w-full h-8 rounded-full overflow-hidden mb-8 shadow-inner">
          <div className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-bold transition-all duration-1000" style={{ width: '84%' }}>84%</div>
          <div className="bg-pink-500 h-full flex items-center justify-center text-white text-xs font-bold transition-all duration-1000" style={{ width: '6%' }}>6%</div>
          <div className="bg-primary h-full flex items-center justify-center text-dark text-xs font-bold transition-all duration-1000" style={{ width: '10%' }}>10%</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-green-50 border border-green-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3 text-green-600">
              <PieChart className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-green-700 mb-1">₹420</div>
            <div className="text-sm font-semibold text-green-900">Worker Earnings</div>
            <div className="text-xs text-green-700/70 mt-1">Directly to the professional</div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-3 text-pink-600">
              <Heart className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-pink-700 mb-1">₹30</div>
            <div className="text-sm font-semibold text-pink-900">Worker Welfare</div>
            <div className="text-xs text-pink-700/70 mt-1">Insurance & training fund</div>
          </div>

          <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-3 text-yellow-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-yellow-700 mb-1">₹50</div>
            <div className="text-sm font-semibold text-yellow-900">Cooperative Operations</div>
            <div className="text-xs text-yellow-700/70 mt-1">Platform maintenance</div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm font-medium text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-center gap-2">
          <IndianRupee className="w-4 h-4" /> Transparent earnings distribution helps support fair wages and cooperative welfare.
        </div>
      </div>
    </section>
  );
};

export default FairWagePreview;
