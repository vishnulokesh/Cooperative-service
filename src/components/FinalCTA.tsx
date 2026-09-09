import { ArrowRight } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-24 px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-dark rounded-[3rem] p-10 lg:p-16 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-deepBlue/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        
        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Don't Just Hire a Worker.<br />
            <span className="text-primary">Support a Community.</span>
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Find trusted local skills while helping cooperative workers build sustainable livelihoods and professional dignity.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto bg-primary hover:bg-yellow-400 text-dark font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-transform transform hover:-translate-y-1 shadow-lg">
              Find a Service <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-2xl border border-white/20 flex items-center justify-center gap-2 transition-transform transform hover:-translate-y-1 backdrop-blur-sm">
              Join as a Worker
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
