import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import { PostHogProvider } from '@/components/PostHogProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { BootSequence } from '@/components/BootSequence';

// Lazy load pages for performance
const LoginPage = lazy(() => import('@/pages/login'));
const LocationPage = lazy(() => import('@/pages/onboarding/location'));
const RightsPage = lazy(() => import('@/pages/onboarding/rights'));
const HomePage = lazy(() => import('@/pages/home'));
const FilePage = lazy(() => import('@/pages/file'));
const TrackPage = lazy(() => import('@/pages/track'));
const CheckReplyPage = lazy(() => import('@/pages/check-reply'));
const AboutPage = lazy(() => import('@/pages/about'));
const DocumentsPage = lazy(() => import('@/pages/documents'));

export default function App() {
  const [hasBooted, setHasBooted] = useState(() => {
    return sessionStorage.getItem("rti_booted") === "true";
  });

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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <LanguageSwitcher />
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
              <Route path="/file" element={<FilePage />} />
              <Route path="/track" element={<TrackPage />} />
              <Route path="/check-reply" element={<CheckReplyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/documents" element={<DocumentsPage />} />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </PostHogProvider>
  );
}
