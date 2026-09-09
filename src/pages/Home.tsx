import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LocationFirstSearch from '../components/LocationFirstSearch';
import DailSmartAIBigDemo from '../components/DailSmartAIBigDemo';
import AdvantageStrip from '../components/AdvantageStrip';
import ServicesSection from '../components/ServicesSection';
import SkillPassport from '../components/SkillPassport';
import EarnWithDailSmart from '../components/EarnWithDailSmart';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import { AIAssistant } from '../components/AIAssistant';

const Home = () => {
  const handleOpenAIDemo = () => {
    // Smooth scroll to the AI demo
    const el = document.getElementById('ai-assistant-showcase');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Navbar />

      <main className="flex-grow">
        {/* 1. Hero */}
        <Hero onTalkToAI={handleOpenAIDemo} />

        {/* 2. Location-First Search (Directly Below Hero) */}
        <LocationFirstSearch onTalkToAI={handleOpenAIDemo} />

        {/* 3. DailSmart AI Interactive Showcase */}
        <section id="ai-assistant-showcase" className="py-8 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-6 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              Core SIH Innovation
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
              Talk to DailSmart AI
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm">
              Describe what you need in your mother tongue (Telugu, Hindi, Tamil, or English). Our AI classifies your problem, verifies urgency, and triggers fair opportunity distribution.
            </p>
          </div>

          <DailSmartAIBigDemo />
        </section>

        {/* 4. Advantage Strip — Verified Skills, Fair Wages, Worker Welfare, Local Workforce */}
        <AdvantageStrip />

        {/* 5. Services Section */}
        <ServicesSection />

        {/* 6. Skill Passport — Meet the People Behind the Service */}
        <SkillPassport />

        {/* 7. Earn with DailSmart Solutions Section */}
        <EarnWithDailSmart />

        {/* 8. Reviews / Testimonials */}
        <Testimonials />
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Home;
