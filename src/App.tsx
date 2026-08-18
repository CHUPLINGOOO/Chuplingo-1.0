import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ChuplingoProvider } from "./context/ChuplingoContext";
import { MobileContainer } from "./components/layout/MobileContainer";
import { BottomNav } from "./components/layout/BottomNav";

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

// Auth Pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();

  // Hide bottom nav on onboarding, authentication, active question screen and admin views
  const hideBottomNavRoutes = [
    '/welcome',
    '/register',
    '/login',
    '/verify-email',
    '/forgot-password',
    '/practice',
    '/admin'
  ];
  
  const shouldHideBottomNav = hideBottomNavRoutes.some(path => location.pathname.startsWith(path));

  return (
    <MobileContainer hasBottomNav={!shouldHideBottomNav}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/courses" element={<CoursesList />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/practice-setup" element={<PracticeSetup />} />
        <Route path="/practice-setup/:courseId" element={<PracticeSetup />} />
        <Route path="/practice-setup/:courseId/:topicId" element={<PracticeSetup />} />
        <Route path="/practice" element={<PracticeQuestionScreen />} />
        <Route path="/results/:sessionId" element={<PracticeResults />} />
        <Route path="/challenges" element={<ChallengesScreen />} />
        <Route path="/progress" element={<ProgressScreen />} />
        <Route path="/history" element={<PracticeHistory />} />
        <Route path="/mistakes" element={<MistakesScreen />} />
        <Route path="/favorites" element={<FavoritesScreen />} />
        <Route path="/achievements" element={<AchievementsScreen />} />
        <Route path="/plans" element={<PlansScreen />} />
        <Route path="/notifications" element={<NotificationsCenter />} />
        <Route path="/email-templates" element={<EmailTemplatesPreview />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!shouldHideBottomNav && <BottomNav />}
    </MobileContainer>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChuplingoProvider>
      <TooltipProvider>
        <Sonner position="top-center" />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ChuplingoProvider>
  </QueryClientProvider>
);

export default App;