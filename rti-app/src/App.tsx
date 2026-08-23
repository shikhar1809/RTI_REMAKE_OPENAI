import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { PostHogProvider } from '@/components/PostHogProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { BootSequence } from '@/components/BootSequence';
import { GlobalAIAssistant } from '@/components/GlobalAIAssistant';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Static imports — avoids stale chunk errors on HMR/navigation
import LoginPage from '@/pages/login';
import LocationPage from '@/pages/onboarding/location';
import RightsPage from '@/pages/onboarding/rights';
import HomePage from '@/pages/home';
import FilePage from '@/pages/file';
import ManagePage from '@/pages/manage';
import TrackPage from '@/pages/track';
import TrackDetailPage from '@/pages/track-detail';
import CheckReplyPage from '@/pages/check-reply';
import AboutPage from '@/pages/about';
import DocumentsPage from '@/pages/documents';
import ToolkitPage from '@/pages/toolkit';
import StatsPage from '@/pages/stats';

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
        <GlobalAIAssistant />
        {location.pathname !== '/home' && <LanguageSwitcher />}
        <main className="flex-1 flex flex-col">
          <ErrorBoundary>
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
          </ErrorBoundary>
        </main>
      </div>
    </PostHogProvider>
  );
}
