import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { STATES } from "@/data/states";
import { useApplicationsStore } from "@/store/applicationsStore";
import { useRTIStore } from "@/store/rtiStore";
import { useTranslation } from "react-i18next";
import { FcGlobe, FcSmartphoneTablet } from "react-icons/fc";
import { Bell, BellOff, X, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const { 
    userName, selectedStateId, 
    notificationsEnabled, contactVerified, 
    setNotificationsEnabled, verifyContact 
  } = useAuthStore();
  const stateInfo = STATES[selectedStateId];
  const { t, i18n } = useTranslation(undefined, { keyPrefix: "dashboard" });

  const { applications } = useApplicationsStore();
  const newRepliesCount = applications.filter((app) => app.status === "replied").length;
  
  const { currentStep, resetWizard } = useRTIStore();

  const [showModal, setShowModal] = useState(false);
  const [wa, setWa] = useState("");
  const [email, setEmail] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingLang, setIsLoadingLang] = useState(false);
  const [langToast, setLangToast] = useState(false);

  const handleToggle = () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
    } else {
      if (contactVerified) {
        setNotificationsEnabled(true);
      } else {
        setShowModal(true);
      }
    }
  };

  const handleVerify = () => {
    // Mock OTP verification
    verifyContact(wa, email);
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setIsLoadingLang(true);
    // Change language immediately so the loader displays in the target language
    i18n.changeLanguage(newLang);
    
    // Keep loader on screen for 1 second for visual feedback
    setTimeout(() => {
      setIsLoadingLang(false);
      setLangToast(true);
      setTimeout(() => setLangToast(false), 3000);
    }, 1000);
  };

  return (
    <ProtectedRoute>
      {/* Full Screen Language Loader */}
      {isLoadingLang && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-900/40 backdrop-blur-md">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
            <FcGlobe size={48} className="animate-spin-slow mb-4" />
            <h3 className="font-bold text-gray-900 text-lg mb-1">{t("applyingLang")}</h3>
            <p className="text-gray-500 text-sm text-center">{t("syncingLang")}</p>
          </div>
        </div>
      )}

      {/* Language Change Success Toast */}
      {langToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="text-green-400" size={20} />
          <span className="font-medium text-sm">{t("langSuccess")}</span>
        </div>
      )}

      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-xl p-4 sm:p-8 relative">
          
          <div className="text-center mb-6 mt-4">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 drop-shadow-md">{t("welcome", "Welcome")}, {userName}</h1>
            <p className="text-gray-600 font-medium text-sm drop-shadow">{t("whatWouldYouLike", "What would you like to do today?")}</p>
          </div>

          <div className="flex flex-col items-center gap-3 mb-8">
            {/* Row 1: Area Selector */}
            {stateInfo && (
              <div className="bg-white/95 border-2 border-gray-300 shadow-sm rounded-full px-6 py-2.5 flex items-center gap-3">
                <span className="text-base font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <select
                    value={selectedStateId}
                    onChange={(e) => useAuthStore.getState().completeLocationStep(e.target.value)}
                    className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer hover:text-gray-900 appearance-none"
                  >
                    {Object.values(STATES).map((state) => (
                      <option key={state.id} value={state.id}>
                        {t(`state_${state.id}`, state.name)}
                      </option>
                    ))}
                  </select>
                </span>
                <div className="w-px h-5 bg-gray-300"></div>
                <span className="text-sm text-gray-500 font-bold">₹{stateInfo.fee}</span>
              </div>
            )}
            
            {/* Row 2: Language Selector + Alerts */}
            <div className="flex items-center justify-center gap-4">
              {/* Language Selector */}
              <div className="bg-white/95 border-2 border-gray-300 shadow-sm rounded-full px-5 py-2 flex items-center gap-2">
                <FcGlobe size={20} />
                <select 
                  value={i18n.language}
                  onChange={handleLanguageChange}
                  className="bg-transparent text-base font-bold text-gray-700 outline-none cursor-pointer hover:text-gray-900"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="bn">বাংলা</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>

              {/* Alerts Button */}
              <button 
                onClick={handleToggle}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-base font-bold transition-all border-2 shadow-sm ${
                  notificationsEnabled 
                    ? "bg-green-50/95 border-green-400 text-green-700 hover:bg-green-100" 
                    : "bg-white/95 border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                {notificationsEnabled ? t("alertsOn", "Alerts On") : t("alertsOff", "Alerts Off")}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
            
            {currentStep > 1 && currentStep < 6 && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 shadow-sm flex flex-col gap-2 mb-1 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 text-sm mt-0.5">⚠️</span>
                  <p className="text-xs font-bold text-amber-900 leading-tight">
                    {t("midProgress", { step: currentStep, defaultValue: `Your RTI filing stopped mid-progress (Step ${currentStep}). Do you want to continue?` })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to="/file" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 rounded-md text-center text-xs transition-colors shadow-sm">
                    {t("continueDraft", "Continue Draft")}
                  </Link>
                  <button 
                    onClick={() => resetWizard()} 
                    className="flex-1 bg-white hover:bg-amber-100 text-amber-700 border border-amber-300 font-bold py-1.5 rounded-md text-center text-xs transition-colors shadow-sm"
                  >
                    {t("startFresh", "Start Fresh")}
                  </button>
                </div>
              </div>
            )}

            {/* Notification Center */}
            <div className="relative w-full z-20">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-full bg-white/95 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 text-gray-800 py-3 px-6 rounded-xl font-bold text-center transition-all shadow-md flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <Bell size={18} />
                  {t("notifications", "NOTIFICATIONS")}
                </div>
                <div className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                  3 {t("new", "NEW")}
                </div>
              </button>
              
              {showNotifications && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-2">
                  <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 text-sm">{t("recentAlerts", "Recent Alerts")}</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto text-left">
                    <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        {t("alert1Title", "Deadline Approaching")}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{t("alert1Desc", "Kerala Municipal Corporation has 2 days left to reply to your RTI on Road Repair.")}</p>
                    </div>
                    <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        {t("alert2Title", "Community Impact")}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{t("alert2Desc", "12 people viewed the RTI you published to the Public Archive!")}</p>
                    </div>
                    <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {t("alert3Title", "Reply Received")}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{t("alert3Desc", "Your RTI on Land Mutation has been resolved. Tap to view.")}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/manage"
              className="bg-white/95 border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 hover:text-green-700 text-gray-800 py-3 px-6 rounded-xl font-bold text-center transition-all shadow-md flex justify-center items-center gap-2 relative"
            >
              {t("manageReports", "MANAGE REPORTS")}
              {newRepliesCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                  {newRepliesCount}
                </div>
              )}
            </Link>

            <Link
              to="/documents"
              className="bg-white/95 border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 hover:text-green-700 text-gray-800 py-3 px-6 rounded-xl font-bold text-center transition-all shadow-md"
            >
              {t("docConnect", "DOCUMENT CONNECT")}
            </Link>

            <Link
              to="/about"
              className="bg-white/95 border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 hover:text-green-700 text-gray-800 py-3 px-6 rounded-xl font-bold text-center transition-all shadow-md"
            >
              {t("knowRules", "KNOW YOUR RTI")}
            </Link>

            <Link
              to="/stats"
              className="bg-white/95 border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 hover:text-green-700 text-gray-800 py-3 px-6 rounded-xl font-bold text-center transition-all shadow-md"
            >
              {t("rtiStats", "PUBLIC RTI ARCHIVE")}
            </Link>

            <Link
              to="/toolkit"
              className="bg-white/95 border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 hover:text-green-700 text-gray-800 py-3 px-6 rounded-xl font-bold text-center transition-all shadow-md"
            >
              {t("rtiToolkit", "RTI TOOLKIT")}
            </Link>

          </div>
          
          <div className="mt-6 text-center flex justify-center">
            <button
              onClick={() => useAuthStore.getState().logout()}
              className="px-5 py-2 bg-white hover:bg-red-50 text-red-600 font-bold rounded-lg shadow-sm border border-red-200 transition-colors flex items-center gap-2 text-sm"
            >
              {t("signOut", "Sign out securely")}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FcSmartphoneTablet size={20} /> Setup Notifications
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              {!otpStep ? (
                <>
                  <p className="text-sm text-gray-500 mb-4">Get instant updates on your RTI via WhatsApp & Email.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Number</label>
                      <input 
                        type="tel" 
                        value={wa} 
                        onChange={(e) => setWa(e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="you@example.com"
                      />
                    </div>
                    <button 
                      onClick={() => setOtpStep(true)}
                      disabled={wa.length < 10 || !email.includes("@")}
                      className="w-full bg-gray-900 text-white font-semibold py-2.5 rounded-xl disabled:opacity-50 mt-2"
                    >
                      Send OTP
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">Enter the 4-digit code sent to your WhatsApp.</p>
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-lg tracking-[0.5em] font-bold focus:ring-2 focus:ring-green-500 outline-none mb-4"
                    placeholder="••••"
                    maxLength={4}
                  />
                  <button 
                    onClick={handleVerify}
                    disabled={otp.length < 4}
                    className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-xl disabled:opacity-50"
                  >
                    Verify & Enable
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={20} className="text-green-400" />
          <span className="text-sm font-medium">Notifications enabled successfully!</span>
        </div>
      )}
    </ProtectedRoute>
  );
}
