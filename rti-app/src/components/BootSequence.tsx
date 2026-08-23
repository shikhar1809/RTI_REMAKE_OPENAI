import { useState, useEffect } from "react";

import { Loader2, FileText, ShieldCheck, Check } from "lucide-react";

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
        <div className="flex items-center justify-center mb-8 relative h-48 sm:h-56 w-full max-w-[16rem] mx-auto">
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @keyframes scan {
              0% { top: 5%; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 95%; opacity: 0; }
            }
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>

          {/* Stage 0: Loading - Floating Document with Scanner */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${stage === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
            <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 z-10" style={{ animation: 'float 3s ease-in-out infinite' }}>
              <FileText size={56} className="text-blue-600" strokeWidth={1.5} />
              {/* Scanner Line */}
              <div className="absolute left-3 right-3 h-[3px] bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.9)] z-20" style={{ animation: 'scan 2s linear infinite' }} />
            </div>
            {/* Orbiting particles */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'spin-slow 8s linear infinite' }}>
              <div className="w-36 h-36 border-2 border-dashed border-blue-100 rounded-full" />
              <div className="absolute top-2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
              <div className="absolute bottom-6 right-6 w-2 h-2 bg-blue-300 rounded-full shadow-[0_0_8px_rgba(147,197,253,0.8)]" />
            </div>
          </div>

          {/* Stage 1: Checking - Shield & Verification */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${stage === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
            <div className="relative z-10" style={{ animation: 'float 2.5s ease-in-out infinite' }}>
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-60" style={{ animationDuration: '2s' }} />
              <div className="relative bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6">
                <ShieldCheck size={56} className="text-blue-600" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Stage 2: Ready - Success Check */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${stage === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
            <div className="relative bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-4 border-green-500 p-5 z-10">
              <Check size={56} className="text-green-500" strokeWidth={3} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-green-200 rounded-full animate-ping opacity-40" />
            </div>
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
