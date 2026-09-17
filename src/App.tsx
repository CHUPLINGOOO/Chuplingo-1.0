import { useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ChuplingoProvider, useChuplingo } from "./context/ChuplingoContext";
import { MobileContainer } from "./components/layout/MobileContainer";
import { BottomNav } from "./components/layout/BottomNav";
import { NetworkStatusBanner } from "./components/common/NetworkStatusBanner";
import { SplashScreen } from "./components/common/SplashScreen";
import { AnimatePresence, motion } from "framer-motion";

// Core Pages
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import CoursesList from "./pages/CoursesList";
import CourseDetail from "./pages/CourseDetail";
import PracticeSetup from "./pages/PracticeSetup";
import PracticeQuestionScreen from "./pages/PracticeQuestionScreen";
import PracticeResults from "./pages/PracticeResults";
import ChallengesScreen from "./pages/ChallengesScreen";
import ProgressScreen from "./pages/ProgressScreen";
import PracticeHistory from "./pages/PracticeHistory";
import MistakesScreen from "./pages/MistakesScreen";
import FavoritesScreen from "./pages/FavoritesScreen";
import AchievementsScreen from "./pages/AchievementsScreen";
import ProfileScreen from "./pages/ProfileScreen";
import PlansScreen from "./pages/PlansScreen";
import NotificationsCenter from "./pages/NotificationsCenter";
import EmailTemplatesPreview from "./pages/EmailTemplatesPreview";
import AdminScreen from "./pages/AdminScreen";
import DownloadApp from "./pages/DownloadApp";

// Auth Pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full h-full flex flex-col"
    >
      {children}
    </motion.div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const { isLoadingQuestions } = useChuplingo();
  const [showSplash, setShowSplash] = useState(true);

  // Hide bottom nav on onboarding, authentication, active question screen, admin and download views
  const hideBottomNavRoutes = [
    '/welcome',
    '/register',
    '/login',
    '/verify-email',
    '/forgot-password',
    '/practice',
    '/admin',
    '/descargar',
    '/download'
  ];
  
  const shouldHideBottomNav = hideBottomNavRoutes.some(path => location.pathname.startsWith(path));

  return (
    <>
      {showSplash && (
        <SplashScreen 
          isLoadingData={isLoadingQuestions} 
          onFinish={() => setShowSplash(false)} 
        />
      )}
      <MobileContainer hasBottomNav={!shouldHideBottomNav}>
        <NetworkStatusBanner />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/welcome" element={<PageWrapper><Welcome /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/verify-email" element={<PageWrapper><VerifyEmail /></PageWrapper>} />
            <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
            <Route path="/courses" element={<PageWrapper><CoursesList /></PageWrapper>} />
            <Route path="/courses/:courseId" element={<PageWrapper><CourseDetail /></PageWrapper>} />
            <Route path="/practice-setup" element={<PageWrapper><PracticeSetup /></PageWrapper>} />
            <Route path="/practice-setup/:courseId" element={<PageWrapper><PracticeSetup /></PageWrapper>} />
            <Route path="/practice-setup/:courseId/:topicId" element={<PageWrapper><PracticeSetup /></PageWrapper>} />
            <Route path="/practice" element={<PracticeQuestionScreen />} />
            <Route path="/results/:sessionId" element={<PageWrapper><PracticeResults /></PageWrapper>} />
            <Route path="/challenges" element={<PageWrapper><ChallengesScreen /></PageWrapper>} />
            <Route path="/progress" element={<PageWrapper><ProgressScreen /></PageWrapper>} />
            <Route path="/history" element={<PageWrapper><PracticeHistory /></PageWrapper>} />
            <Route path="/mistakes" element={<PageWrapper><MistakesScreen /></PageWrapper>} />
            <Route path="/favorites" element={<PageWrapper><FavoritesScreen /></PageWrapper>} />
            <Route path="/achievements" element={<PageWrapper><AchievementsScreen /></PageWrapper>} />
            <Route path="/plans" element={<PageWrapper><PlansScreen /></PageWrapper>} />
            <Route path="/notifications" element={<PageWrapper><NotificationsCenter /></PageWrapper>} />
            <Route path="/email-templates" element={<PageWrapper><EmailTemplatesPreview /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><AdminScreen /></PageWrapper>} />
            <Route path="/descargar" element={<PageWrapper><DownloadApp /></PageWrapper>} />
            <Route path="/download" element={<PageWrapper><DownloadApp /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><ProfileScreen /></PageWrapper>} />
            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
        {!shouldHideBottomNav && <BottomNav />}
      </MobileContainer>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ChuplingoProvider>
        <TooltipProvider>
          <Sonner
            position="top-center"
            visibleToasts={1}
            duration={2500}
            richColors
            closeButton
          />
          <AppContent />
        </TooltipProvider>
      </ChuplingoProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;