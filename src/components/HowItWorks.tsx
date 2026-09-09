const steps = [
  {
    num: '01',
    title: 'Tell Us What You Need',
    desc: 'Choose a service and location through our smart search.',
  },
  {
    num: '02',
    title: 'Discover Verified Skills',
    desc: 'Compare nearby cooperative workers with verified digital identities.',
  },
  {
    num: '03',
    title: 'Book With Confidence',
    desc: 'See worker verification, trust profile and transparent pricing upfront.',
  },
  {
    num: '04',
    title: 'Support the Community',
    desc: 'Get your service while contributing to cooperative worker welfare.',
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-b border-gray-100">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">How It Works</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={step.num} className="relative group">
            {/* Connector Line (hidden on mobile, visible on desktop) */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-12 left-1/2 w-full h-[2px] bg-gray-100 -z-10 group-hover:bg-primary/30 transition-colors" />
            )}
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-lightBg border-4 border-white shadow-xl flex items-center justify-center mb-6 text-3xl font-bold text-deepBlue group-hover:scale-110 group-hover:bg-primary group-hover:text-dark transition-all duration-300">
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-dark mb-3">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[250px]">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
