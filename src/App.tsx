import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Workers from './pages/Workers';
import WorkerProfile from './pages/WorkerProfile';
import Cooperatives from './pages/Cooperatives';
import CooperativeProfile from './pages/CooperativeProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import BookingForm from './pages/BookingForm';
import BookingDetail from './pages/BookingDetail';
import FindWorker from './pages/FindWorker';
import EmergencyService from './pages/EmergencyService';
import Invoice from './pages/Invoice';
import CustomerPayments from './pages/CustomerPayments';
import WorkerEarnings from './pages/WorkerEarnings';
import WorkerWelfare from './pages/WorkerWelfare';
import WorkerInsurance from './pages/WorkerInsurance';
import WelfareHistory from './pages/WelfareHistory';
import WorkerSafety from './pages/WorkerSafety';
import WorkerTraining from './pages/WorkerTraining';
import CooperativeLayout from './components/CooperativeLayout';
import CooperativeDashboard from './pages/CooperativeDashboard';
import CooperativeWorkers from './pages/CooperativeWorkers';
import CooperativeWorkerDetail from './pages/CooperativeWorkerDetail';
import CooperativeWelfare from './pages/CooperativeWelfare';
import CooperativeTraining from './pages/CooperativeTraining';
import VerificationQueue from './pages/VerificationQueue';
import VerificationDetail from './pages/VerificationDetail';
import CooperativeBookings from './pages/CooperativeBookings';
import CooperativeEmergency from './pages/CooperativeEmergency';
import CooperativeEarnings from './pages/CooperativeEarnings';
import CooperativeServices from './pages/CooperativeServices';
import CooperativeReports from './pages/CooperativeReports';
import CooperativeAudit from './pages/CooperativeAudit';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCooperatives from './pages/AdminCooperatives';
import AdminBookings from './pages/AdminBookings';
import AdminReports from './pages/AdminReports';
import AdminAudit from './pages/AdminAudit';
import DemandIntelligencePage from './pages/DemandIntelligencePage';
import CooperativeSkillMapPage from './pages/CooperativeSkillMapPage';
import CooperativeGovernancePage from './pages/CooperativeGovernancePage';
import VerificationQueuePage from './pages/VerificationQueuePage';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import SkillPassport from './components/SkillPassport';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AIAssistant } from './components/AIAssistant';

// A layout wrapper for pages to include Navbar, Footer, and AI Voice Assistant consistently
const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen bg-lightBg dark:bg-slate-950 text-dark dark:text-gray-100 transition-colors relative">
    <Navbar />
    <main className="flex-grow pt-24">{children}</main>
    <Footer />
    <AIAssistant />
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-lightBg dark:bg-slate-950 font-sans text-dark dark:text-gray-100 overflow-x-hidden transition-colors">
        <Routes>
          {/* Customer entry opens Customer Website / Homepage with location-first search */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<PageLayout><Login /></PageLayout>} />
          <Route path="/signup" element={<PageLayout><Signup /></PageLayout>} />
          <Route path="/notifications" element={<PageLayout><Notifications /></PageLayout>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Customer Routes */}
          <Route path="/customer-dashboard" element={<PageLayout><CustomerDashboard /></PageLayout>} />
          <Route path="/customer/dashboard" element={<PageLayout><CustomerDashboard /></PageLayout>} />
          <Route path="/booking/:workerId" element={<PageLayout><BookingForm /></PageLayout>} />
          <Route path="/booking" element={<PageLayout><BookingForm /></PageLayout>} />
          <Route path="/payments" element={<PageLayout><CustomerPayments /></PageLayout>} />
          
          {/* Worker Routes */}
          <Route path="/worker-dashboard" element={<PageLayout><WorkerDashboard /></PageLayout>} />
          <Route path="/worker/dashboard" element={<PageLayout><WorkerDashboard /></PageLayout>} />
          <Route path="/earnings" element={<PageLayout><WorkerEarnings /></PageLayout>} />
          <Route path="/welfare" element={<PageLayout><WorkerWelfare /></PageLayout>} />
          <Route path="/welfare/insurance" element={<PageLayout><WorkerInsurance /></PageLayout>} />
          <Route path="/welfare/history" element={<PageLayout><WelfareHistory /></PageLayout>} />
          <Route path="/welfare/safety" element={<PageLayout><WorkerSafety /></PageLayout>} />
          <Route path="/welfare/training" element={<PageLayout><WorkerTraining /></PageLayout>} />

          {/* Cooperative Admin Routes */}
          <Route path="/cooperative/dashboard" element={<CooperativeLayout><CooperativeDashboard /></CooperativeLayout>} />
          <Route path="/cooperative/workers" element={<CooperativeLayout><CooperativeWorkers /></CooperativeLayout>} />
          <Route path="/cooperative/workers/:workerId" element={<CooperativeLayout><CooperativeWorkerDetail /></CooperativeLayout>} />
          <Route path="/cooperative/verification" element={<CooperativeLayout><VerificationQueue /></CooperativeLayout>} />
          <Route path="/cooperative/verification/:workerId" element={<CooperativeLayout><VerificationDetail /></CooperativeLayout>} />
          <Route path="/cooperative/welfare" element={<CooperativeLayout><CooperativeWelfare /></CooperativeLayout>} />
          <Route path="/cooperative/training" element={<CooperativeLayout><CooperativeTraining /></CooperativeLayout>} />
          <Route path="/cooperative/bookings" element={<CooperativeLayout><CooperativeBookings /></CooperativeLayout>} />
          <Route path="/cooperative/emergency" element={<CooperativeLayout><CooperativeEmergency /></CooperativeLayout>} />
          <Route path="/cooperative/earnings" element={<CooperativeLayout><CooperativeEarnings /></CooperativeLayout>} />
          <Route path="/cooperative/services" element={<CooperativeLayout><CooperativeServices /></CooperativeLayout>} />
          <Route path="/cooperative/reports" element={<CooperativeLayout><CooperativeReports /></CooperativeLayout>} />
          <Route path="/cooperative/audit" element={<CooperativeLayout><CooperativeAudit /></CooperativeLayout>} />

          {/* Platform / Cooperative Command Center Routes */}
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/skill-map" element={<AdminLayout><CooperativeSkillMapPage /></AdminLayout>} />
          <Route path="/admin/demand-intelligence" element={<AdminLayout><DemandIntelligencePage /></AdminLayout>} />
          <Route path="/admin/governance" element={<AdminLayout><CooperativeGovernancePage /></AdminLayout>} />
          <Route path="/admin/verification" element={<AdminLayout><VerificationQueuePage /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/admin/cooperatives" element={<AdminLayout><AdminCooperatives /></AdminLayout>} />
          <Route path="/admin/bookings" element={<AdminLayout><AdminBookings /></AdminLayout>} />
          <Route path="/admin/reports" element={<AdminLayout><AdminReports /></AdminLayout>} />
          <Route path="/admin/audit" element={<AdminLayout><AdminAudit /></AdminLayout>} />

          {/* Shared Routes */}
          <Route path="/bookings/:id" element={<PageLayout><BookingDetail /></PageLayout>} />
          <Route path="/invoice/:bookingId" element={<PageLayout><Invoice /></PageLayout>} />
          <Route path="/profile" element={<PageLayout><Profile /></PageLayout>} />
          <Route path="/services" element={<PageLayout><Services /></PageLayout>} />
          <Route path="/services/:serviceId" element={<PageLayout><ServiceDetail /></PageLayout>} />
          <Route path="/workers" element={<PageLayout><Workers /></PageLayout>} />
          <Route path="/workers/:id" element={<PageLayout><WorkerProfile /></PageLayout>} />
          <Route path="/cooperatives" element={<PageLayout><Cooperatives /></PageLayout>} />
          <Route path="/cooperatives/:id" element={<PageLayout><CooperativeProfile /></PageLayout>} />
          <Route path="/find-worker" element={<PageLayout><FindWorker /></PageLayout>} />
          <Route path="/skills" element={<PageLayout><SkillPassport /></PageLayout>} />
          <Route path="/emergency" element={<PageLayout><EmergencyService /></PageLayout>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
