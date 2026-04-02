import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Core UI Components
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import AIChatbot from './components/AIChatbot';

// Pages - Lazy Loaded
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Impact = lazy(() => import('./pages/Works')); 
const Volunteer = lazy(() => import('./pages/Volunteer'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog')); 
const BlogPost = lazy(() => import('./pages/BlogPost'));
const GeneralSettings = lazy(() => import('./components/GeneralSettings'));
const Donate = lazy(() => import('./pages/Donate'));
const ImpactReport = lazy(() => import('./pages/ImpactReport'));
const CauseDetail = lazy(() => import('./pages/CauseDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Admin Pages
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminComplaints = lazy(() => import('./admin/AdminComplaints'));
const AdminDonations = lazy(() => import('./admin/AdminDonations'));
const AdminVolunteers = lazy(() => import('./admin/AdminVolunteers'));



// Volunteer Pages
const VolunteerLayout = lazy(() => import('./volunteer-dashboard/VolunteerLayout'));
const VolunteerHub = lazy(() => import('./volunteer-dashboard/VolunteerHub'));
const VolunteerCampaigns = lazy(() => import('./volunteer-dashboard/VolunteerCampaigns'));
const VolunteerImpact = lazy(() => import('./volunteer-dashboard/VolunteerImpact'));
const VolunteerAnnouncements = lazy(() => import('./volunteer-dashboard/VolunteerAnnouncements'));
const VolunteerModules = lazy(() => import('./volunteer-dashboard/VolunteerModules'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-primary-navy text-white p-10 h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-heading font-black mb-4 uppercase">System Malfunction</h1>
          <p className="text-primary-offwhite/50 mb-8 max-w-md font-body">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-primary-gold text-[#0A0A0F] font-bold rounded-full"
          >
            REBOOT NODE
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Global Layout Wrapper to conditionally hide Navbar
const GlobalLayout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/volunteer-dashboard');

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className={isDashboard ? '' : 'min-h-screen'}>
        {children}
      </main>
      {!isDashboard && <AIChatbot />}
    </>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Impact />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/impact" element={<ImpactReport />} />
          <Route path="/cause/:id" element={<CauseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected System: Admin Nexus */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
               <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="volunteers" element={<AdminVolunteers />} />
            <Route path="settings" element={<GeneralSettings />} />
          </Route>



          <Route path="/volunteer-dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
               <VolunteerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<VolunteerHub />} />
            <Route path="campaigns" element={<VolunteerCampaigns />} />
            <Route path="impact" element={<VolunteerImpact />} />
            <Route path="announcements" element={<VolunteerAnnouncements />} />
            <Route path="modules" element={<VolunteerModules />} />
            <Route path="settings" element={<GeneralSettings />} />
          </Route>
        </Routes>
      </AnimatePresence>
  );
};

const App = () => {
  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              <MotionConfig transition={isMobile ? { duration: 0 } : undefined}>
                <Loader />
                <CustomCursor />
                <GlobalLayout>
                  <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[60vh]">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold" />
                    </div>
                  }>
                    <AnimatedRoutes />
                  </Suspense>
                </GlobalLayout>
                
                <ToastContainer 
                  position="bottom-right"
                  theme="dark"
                  toastClassName="glass border border-white/10 rounded-2xl font-body text-sm font-bold"
                />
              </MotionConfig>
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
