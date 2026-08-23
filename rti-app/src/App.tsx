import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useState } from 'react';
import { PostHogProvider } from '@/components/PostHogProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { BootSequence } from '@/components/BootSequence';
import { PageTransitionLoader } from '@/components/PageTransitionLoader';

// Lazy load pages for performance
const LoginPage = lazy(() => import('@/pages/login'));
const LocationPage = lazy(() => import('@/pages/onboarding/location'));
const RightsPage = lazy(() => import('@/pages/onboarding/rights'));
const HomePage = lazy(() => import('@/pages/home'));
const FilePage = lazy(() => import('@/pages/file'));
const ManagePage = lazy(() => import('@/pages/manage'));
const TrackPage = lazy(() => import('@/pages/track'));
const TrackDetailPage = lazy(() => import('@/pages/track-detail'));
const CheckReplyPage = lazy(() => import('@/pages/check-reply'));
const AboutPage = lazy(() => import('@/pages/about'));
const DocumentsPage = lazy(() => import('@/pages/documents'));
const ToolkitPage = lazy(() => import('@/pages/toolkit'));
const StatsPage = lazy(() => import('@/pages/stats'));

export default function App() {
  const [hasBooted, setHasBooted] = useState(() => {
    return sessionStorage.getItem("rti_booted") === "true";
  });
  
  const location = useLocation();

  if (!hasBooted) {
    return (
      <BootSequence 
        onComplete={() => {
          sessionStorage.setItem("rti_booted", "true");
          setHasBooted(true);
        }} 
      />
    );
  }

  return (
    <PostHogProvider>
      <div className="min-h-screen flex flex-col bg-home-responsive">
        <PageTransitionLoader />
        {location.pathname !== '/home' && <LanguageSwitcher />}
        <main className="flex-1 flex flex-col">
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/onboarding/location" element={<LocationPage />} />
              <Route path="/onboarding/rights" element={<RightsPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/manage" element={<ManagePage />} />
              <Route path="/file" element={<FilePage />} />
              <Route path="/track" element={<TrackPage />} />
              <Route path="/track/:id" element={<TrackDetailPage />} />
              <Route path="/check-reply" element={<CheckReplyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/toolkit" element={<ToolkitPage />} />
              <Route path="/stats" element={<StatsPage />} />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </PostHogProvider>
  );
}
