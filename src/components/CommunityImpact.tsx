import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CommunityImpact = () => {
  return (
    <section className="bg-[#244b7a] w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-0 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24 min-h-[500px]">
        
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 h-full flex items-end justify-center pt-16 md:pt-0">
          {/* Using a high-quality Unsplash image of a worker to represent the workforce */}
          <div className="relative w-full max-w-md aspect-[4/5] overflow-hidden rounded-t-3xl shadow-2xl self-end">
            <img 
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop" 
              alt="DailSmart Worker" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 py-16 md:py-24 text-white">
          <div className="mb-6 inline-block">
            <h2 className="text-4xl lg:text-5xl font-bold mb-2">Earn with DailSmart</h2>
            <div className="w-24 h-1 bg-[#FFCC00] rounded-full"></div>
          </div>
          
          <p className="text-lg lg:text-xl text-gray-200 mb-10 max-w-lg leading-relaxed">
            Become a DailSmart professional. Work when you want, work how you want, and earn on your own terms.
          </p>
          
          <Link to="/signup" state={{ defaultRole: 'worker' }}>
            <button className="bg-[#FFCC00] hover:bg-[#E6B800] text-black font-bold text-lg py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg">
              Start Earning <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CommunityImpact;
