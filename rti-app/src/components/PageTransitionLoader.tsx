import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function PageTransitionLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Every time the location changes, show the loader
    setIsLoading(true);
    
    // Fake a 800ms load time to ensure contents are "loaded"
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center">
      <Loader2 size={48} className="text-green-600 animate-spin mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Loading...</h2>
      <p className="text-sm text-gray-500">Preparing content securely</p>
    </div>
  );
}
