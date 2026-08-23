import { useState, useEffect } from "react";

import { Loader2 } from "lucide-react";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Stage 0: Loading components (0 to 5 seconds)
    const duration = 5000;
    const interval = 50; // update every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min(100, (currentStep / steps) * 100));

      if (currentStep >= steps) {
        clearInterval(timer);
        setStage(1);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (stage !== 1) return;

    // Stage 1: Checking prerequisites (2-3 seconds)
    const prereqTimer = setTimeout(() => {
      setStage(2);
      
      // Stage 2: Done, wait a tiny bit then complete
      setTimeout(() => {
        onComplete();
      }, 800);
      
    }, 2500);

    return () => clearTimeout(prereqTimer);
  }, [stage, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm mx-auto text-center">
        {/* Visual Area */}
        <div className="flex items-center justify-center mb-8 relative">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white bg-gray-100 flex items-center justify-center">
            <video 
              src="/boot-video.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Text Area */}
        <div className="h-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">RTI Easy</h1>
          {stage === 0 && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 size={14} className="animate-spin" />
              Loading secure components...
            </div>
          )}
          {stage === 1 && (
            <div className="flex flex-col items-center gap-1 text-sm text-gray-500">
              <span className="font-medium text-blue-600">Checking prerequisites...</span>
              <span className="text-xs">Verifying PAN & DigiLocker status</span>
            </div>
          )}
          {stage === 2 && (
            <div className="text-sm font-medium text-green-600">
              System Ready
            </div>
          )}
        </div>

        {/* Progress Bar Area */}
        <div className="mt-8">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 transition-all duration-75 ease-linear rounded-full"
              style={{ width: `${stage === 0 ? progress : 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
