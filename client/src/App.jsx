import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout components
import GovernmentTopNav from './components/layout/GovernmentTopNav';
import EmployeeSidebar from './components/layout/EmployeeSidebar';
import AIAssistantDrawer from './components/AIAssistantDrawer';
import GovernmentFooter from './components/GovernmentFooter';

// Pages
import LoginPage from './pages/LoginPage';
import PortalSelectionPage from './pages/PortalSelectionPage';
import EmployeeSelectionPage from './pages/EmployeeSelectionPage';
import TrainerPortalView from './pages/TrainerPortalView';
import AdminPortalView from './pages/AdminPortalView';
import StreamAssessmentPage from './pages/StreamAssessmentPage';
import GapAnalysisPage from './pages/GapAnalysisPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import DigitalPassportPage from './pages/DigitalPassportPage';
import CompetenciesPage from './pages/CompetenciesPage';
import SkillGapsPage from './pages/SkillGapsPage';
import LearningPathPage from './pages/LearningPathPage';
import ExploreLearningPage from './pages/ExploreLearningPage';
import VirtualLabsPage from './pages/VirtualLabsPage';
import AssessmentsPage from './pages/AssessmentsPage';
import DiscussionsPage from './pages/DiscussionsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import FutureRolePage from './pages/FutureRolePage';
import ProgressHistoryPage from './pages/ProgressHistoryPage';
import CertificatesPage from './pages/CertificatesPage';
import ProfileErrorBoundary from './components/ProfileErrorBoundary';

// Context
import { StreamProvider, useStream } from './context/StreamContext';

// App shell for authenticated users who have selected an employee profile
function AppShell({ onLogout, onSwitchPortal }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const mainScrollRef = useRef(null);

  // Prevent document/body level scroll when inside the Employee Portal (prevents header movement & double scrollbars)
  useEffect(() => {
    document.documentElement.classList.add('portal-active');
    document.body.classList.add('portal-active');
    return () => {
      document.documentElement.classList.remove('portal-active');
      document.body.classList.remove('portal-active');
    };
  }, []);

  // Scroll to top of main content container on route change
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="portal-shell-root h-screen max-h-screen w-full flex flex-col bg-gov-off-white text-gov-gray-800 overflow-hidden">
      {/* Top Navbar - Fixed at top of viewport */}
      <GovernmentTopNav
        onLogout={onLogout}
        onSwitchPortal={onSwitchPortal}
        onMobileMenuToggle={() => setMobileSidebarOpen(true)}
      />

      {/* Main App Layout: Fixed Sidebar + Scrollable Content */}
      <div className="flex-1 flex overflow-hidden min-h-0 w-full app-shell">
        {/* Desktop Sidebar - Stationary */}
        <div className="hidden lg:flex shrink-0 w-64 h-full sidebar overflow-hidden z-30">
          <EmployeeSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-gov-navy/50 z-40 lg:hidden backdrop-blur-xs"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <EmployeeSidebar
                mobile
                onClose={() => setMobileSidebarOpen(false)}
              />
            </>
          )}
        </AnimatePresence>

        {/* Independent Main Scroll Container */}
        <div
          ref={mainScrollRef}
          className="flex-1 h-full min-w-0 overflow-y-auto overflow-x-hidden flex flex-col main-scroll-container"
        >
          {/* Dynamic Route Content */}
          <main className="flex-1 min-w-0 w-full main-area p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>

          {/* Government Footer at the bottom of the scrollable content */}
          <GovernmentFooter />
        </div>
      </div>
    </div>
  );
}

// Router & State Orchestrator inside BrowserRouter & StreamProvider
function AppRoutes() {
  const navigate = useNavigate();
  const {
    employee,
    selectDemoEmployee,
    onboardingStep,
    setOnboardingStep,
    finishOnboarding,
    retakeAssessment,
    resetAll,
    diagnosticAttemptId,
    startNewDiagnosticAttempt,
  } = useStream();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('ks_is_logged_in') === 'true';
  });

  const [activePortal, setActivePortal] = useState(() => {
    return localStorage.getItem('ks_active_portal') || 'portal_selection';
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('ks_is_logged_in', 'true');
    setActivePortal('portal_selection');
    localStorage.setItem('ks_active_portal', 'portal_selection');
    navigate('/portal');
  };

  const handlePortalSelect = (portalId) => {
    setIsLoggedIn(true);
    localStorage.setItem('ks_is_logged_in', 'true');
    if (portalId === 'employee') {
      setActivePortal('employee_selection');
      localStorage.setItem('ks_active_portal', 'employee_selection');
      navigate('/employee/select');
    } else if (portalId === 'trainer') {
      setActivePortal('trainer');
      localStorage.setItem('ks_active_portal', 'trainer');
      navigate('/trainer');
    } else if (portalId === 'admin') {
      setActivePortal('admin');
      localStorage.setItem('ks_active_portal', 'admin');
      navigate('/admin');
    }
  };

  const isDiagnosticCompleted = (empId) => {
    if (!empId) return false;
    return localStorage.getItem(`ks_diagnostic_completed_${empId}`) === 'true';
  };

  const handleEmployeeSelect = (demoEmp) => {
    selectDemoEmployee(demoEmp);
    setActivePortal('employee');
    localStorage.setItem('ks_active_portal', 'employee');
    // EVERY "Enter Employee" click starts a new initial competency quiz attempt
    startNewDiagnosticAttempt(demoEmp.id);
    navigate('/employee/diagnostic');
  };

  const handleBackToPortals = () => {
    setActivePortal('portal_selection');
    localStorage.setItem('ks_active_portal', 'portal_selection');
    navigate('/portal');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePortal('portal_selection');
    localStorage.removeItem('ks_is_logged_in');
    localStorage.removeItem('ks_token');
    localStorage.removeItem('ks_user');
    localStorage.removeItem('ks_active_portal');
    localStorage.removeItem('ks_employee_profile');
    resetAll();
    navigate('/');
  };

  return (
    <>
      <Routes>
      {/* ── 1. ENTRY / LOGIN GATE ────────────────────────────────────────── */}
      <Route
        path="/"
        element={
          !isLoggedIn ? (
            <LoginPage onLogin={handleLogin} />
          ) : (
            <Navigate to="/portal" replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          !isLoggedIn ? (
            <LoginPage onLogin={handleLogin} />
          ) : (
            <Navigate to="/portal" replace />
          )
        }
      />

      {/* ── 2. PORTAL SELECTION WORKSPACE GATE ───────────────────────────── */}
      <Route
        path="/portal"
        element={
          <PortalSelectionPage
            onSelectPortal={handlePortalSelect}
            onLogout={handleLogout}
          />
        }
      />

      {/* ── 3. TRAINER WORKSPACE (DIRECT ACCESS SUPPORTED) ────────────────── */}
      <Route
        path="/trainer"
        element={
          <TrainerPortalView
            onBackToPortals={handleBackToPortals}
          />
        }
      />

      {/* ── 4. ADMINISTRATION WORKSPACE (DIRECT ACCESS SUPPORTED) ─────────── */}
      <Route
        path="/admin"
        element={
          <AdminPortalView
            onBackToPortals={handleBackToPortals}
          />
        }
      />

      {/* ── 5. EMPLOYEE PROFILE SELECTION (5 DEMO PERSONAS) ───────────────── */}
      <Route
        path="/employee/select"
        element={
          !isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <EmployeeSelectionPage
              onSelectEmployee={handleEmployeeSelect}
              onBackToPortals={handleBackToPortals}
            />
          )
        }
      />

      {/* ── 6. EMPLOYEE INITIAL COMPETENCY DIAGNOSTIC (STEP 3-8) ──────────── */}
      <Route
        path="/employee/diagnostic"
        element={
          !isLoggedIn ? (
            <Navigate to="/" replace />
          ) : !employee ? (
            <Navigate to="/employee/select" replace />
          ) : (
            <StreamAssessmentPage
              key={`${employee?.id}-${diagnosticAttemptId}`}
              onBackToStreams={() => navigate('/employee/select')}
              onComplete={() => navigate('/employee/diagnostic/results')}
            />
          )
        }
      />

      {/* ── 7. EMPLOYEE DIAGNOSTIC RESULTS & LEARNING PATH (STEP 9-12) ────── */}
      <Route
        path="/employee/diagnostic/results"
        element={
          !isLoggedIn ? (
            <Navigate to="/" replace />
          ) : !employee ? (
            <Navigate to="/employee/select" replace />
          ) : (
            <GapAnalysisPage
              onEnterDashboard={() => {
                finishOnboarding();
                navigate('/dashboard');
              }}
              onRetake={() => navigate('/employee/diagnostic')}
            />
          )
        }
      />

      {/* ── 8. DIRECT APP/HOME ALIAS WITH DIAGNOSTIC PROTECTION (STEP 15) ─── */}
      <Route
        path="/app/home"
        element={
          !isLoggedIn ? (
            <Navigate to="/" replace />
          ) : !employee ? (
            <Navigate to="/employee/select" replace />
          ) : !isDiagnosticCompleted(employee?.id) ? (
            <Navigate to="/employee/diagnostic" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />

      {/* ── 9. EMPLOYEE PORTAL SHELL & DASHBOARD (STRICTLY GUARDED VIA OUTLET) ─ */}
      <Route
        element={
          !isLoggedIn ? (
            <Navigate to="/" replace />
          ) : !employee ? (
            <Navigate to="/employee/select" replace />
          ) : !isDiagnosticCompleted(employee?.id) ? (
            <Navigate to="/employee/diagnostic" replace />
          ) : (
            <AppShell
              onLogout={handleLogout}
              onSwitchPortal={handleBackToPortals}
            />
          )
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/home" element={<DashboardPage />} />
        <Route path="/passport" element={<DigitalPassportPage />} />
        <Route path="/profile" element={<ProfileErrorBoundary><ProfilePage /></ProfileErrorBoundary>} />
        <Route path="/competencies" element={<CompetenciesPage />} />
        <Route path="/skill-gaps" element={<SkillGapsPage />} />
        <Route path="/learning-path" element={<LearningPathPage />} />
        <Route path="/explore-learning" element={<ExploreLearningPage />} />
        <Route path="/virtual-labs" element={<VirtualLabsPage />} />
        <Route path="/virtual-labs/:labId" element={<VirtualLabsPage />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/discussions" element={<DiscussionsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/future-role" element={<FutureRolePage />} />
        <Route path="/progress" element={<ProgressHistoryPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/learning" element={<ExploreLearningPage />} />
        <Route
          path="/assessment"
          element={
            <StreamAssessmentPage
              onBackToStreams={() => navigate('/dashboard')}
              onComplete={() => navigate('/diagnostic')}
            />
          }
        />
        <Route
          path="/diagnostic"
          element={
            <GapAnalysisPage
              onEnterDashboard={() => navigate('/dashboard')}
              onRetake={() => navigate('/assessment')}
            />
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>

    {/* Global Small Size AI Assistant Bot */}
    <AIAssistantDrawer />
  </>
);
}

export default function App() {
  return (
    <BrowserRouter>
      <StreamProvider>
        <AppRoutes />
      </StreamProvider>
    </BrowserRouter>
  );
}
