import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NyayaAvatar } from "./NyayaAvatar";

const EXCLUDE_PAGES = ['/login', '/onboarding/location', '/onboarding/rights', '/toolkit', '/home'];

export const GlobalAIAssistant = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isExcluded = EXCLUDE_PAGES.includes(location.pathname);

  // ALL hooks must be called before any early return
  useEffect(() => {
    if (isExcluded) return;
    setShowTooltip(false);
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, Math.random() * 5000 + 3000);
    return () => clearTimeout(timer);
  }, [location.pathname, isExcluded]);

  // Don't render anything on excluded pages — AFTER all hooks
  if (isExcluded) return null;

  const handleClick = () => {
    setIsTransitioning(true);
    setShowTooltip(false);
    setTimeout(() => {
      setIsTransitioning(false);
      navigate('/toolkit');
    }, 3000);
  };

  return (
    <>
      {/* Full Screen Loading Transition */}
      {isTransitioning && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
          <NyayaAvatar size={120} state="typing" />
          <h2 className="mt-8 text-2xl font-bold text-gray-900 animate-pulse tracking-tight">Analyzing context...</h2>
          <p className="text-gray-500 mt-2 font-medium">Preparing Nyaya AI</p>
        </div>
      )}

      {/* Floating Button & Tooltip positioned relative to center column */}
      <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none flex justify-center">
        <div className="w-full max-w-md flex justify-end px-4 sm:px-6">
          <div className="pointer-events-auto flex items-center gap-3">
            {showTooltip && !isTransitioning && (
              <div className="bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg relative animate-in fade-in slide-in-from-right-4">
                Need help?
                <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-gray-900 rotate-45 -translate-y-1/2" />
              </div>
            )}
            <button 
              onClick={handleClick}
              className="w-16 h-16 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] flex items-center justify-center border-2 border-green-400 hover:scale-110 active:scale-90 transition-all duration-200"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <NyayaAvatar size={54} state="idle" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
