import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { User, Scan, Send, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PageTransitionLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeTip, setActiveTip] = useState(1);
  const location = useLocation();
  const { t } = useTranslation(undefined, { keyPrefix: "common" });

  useEffect(() => {
    // Randomize tip between 1 and 3
    setActiveTip(Math.floor(Math.random() * 3) + 1);
    // Every time the location changes, show the loader
    setIsLoading(true);
    setActiveStep(0);
    
    // Base minimum animation time is 2.5 seconds to let users read the tip
    const minAnimationTime = 2500;
    // Step interval: 2500ms / 4 steps = 625ms per step
    const stepInterval = 625;
    
    // Simulate real server load
    const simulatedServerLoadTime = Math.random() * 3500 + 500; 
    
    // The loader will stay for AT LEAST 2.5s
    const totalWaitTime = Math.max(minAnimationTime, simulatedServerLoadTime);
    
    const interval = setInterval(() => {
      setActiveStep(prev => (prev < 3 ? prev + 1 : prev));
    }, stepInterval);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, totalWaitTime);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [location.pathname]);

  if (!isLoading) return null;

  const steps = [
    { icon: User, label: t("loaderStep1", "Citizen Filing") },
    { icon: Scan, label: t("loaderStep2", "Document Scanning") },
    { icon: Send, label: t("loaderStep3", "RTI Filed") },
    { icon: MessageSquare, label: t("loaderStep4", "Got Reply") }
  ];

  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center">
      <div className="relative">
        {/* Background line */}
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100 -z-10" />
        
        {/* Animated green line progress */}
        <div 
          className="absolute left-5 top-5 w-0.5 bg-green-500 -z-10 transition-all duration-1000 ease-in-out" 
          style={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }} 
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= activeStep;
          const isCurrent = index === activeStep;
          
          return (
            <div key={index} className="flex items-center gap-5 mb-8 last:mb-0">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-1000 
                  ${isActive ? 'bg-green-50 border-2 border-green-500 text-green-600 shadow-sm' : 'bg-white border-2 border-gray-100 text-gray-300'}
                  ${isCurrent ? 'scale-110 ring-4 ring-green-50' : 'scale-100'}
                `}
              >
                <Icon size={18} />
              </div>
              <div className="w-40 text-left">
                <span className={`text-sm font-bold tracking-wide transition-all duration-1000 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Dynamic Tooltip / Hint */}
      <div className="mt-16 px-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        <span className="text-[10px] font-bold tracking-widest text-gray-400 mb-2 uppercase">
          {t("loaderTipTitle", "DID YOU KNOW?")}
        </span>
        <div className="bg-green-50 border border-green-200 px-5 py-3 rounded-2xl max-w-[300px] text-center shadow-sm">
          <p className="text-xs font-semibold text-green-800 leading-relaxed">
            {t(`loaderTip${activeTip}`, "YOU CAN EVEN FILE A RTI THROUGH WHATSAPP")}
          </p>
        </div>
      </div>
    </div>
  );
}
