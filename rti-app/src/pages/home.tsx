import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { STATES } from "@/data/states";
import { MOCK_APPLICATIONS } from "@/data/mockRTIs";
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

  const newRepliesCount = MOCK_APPLICATIONS.filter((app) => app.status === "replied").length;

  const [showModal, setShowModal] = useState(false);
  const [wa, setWa] = useState("");
  const [email, setEmail] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [showToast, setShowToast] = useState(false);

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t("welcome", "Welcome")}, {userName}</h1>
            <p className="text-gray-500 text-sm md:text-base">{t("whatWouldYouLike", "What would you like to do today?")}</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-10">
            {stateInfo && (
              <div className="bg-white border border-gray-200 shadow-sm rounded-full px-5 py-2 flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <select
                    value={selectedStateId}
                    onChange={(e) => useAuthStore.getState().completeLocationStep(e.target.value)}
                    className="bg-transparent font-semibold text-gray-800 outline-none cursor-pointer hover:text-gray-900 appearance-none"
                  >
                    {Object.values(STATES).map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </span>
                <div className="w-px h-4 bg-gray-200"></div>
                <span className="text-sm text-gray-500 font-medium">{t("fee", "Fee")}: ₹{stateInfo.fee}</span>
              </div>
            )}
            
            <div className="bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 flex items-center gap-2">
              <FcGlobe size={18} />
              <select 
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer hover:text-gray-900"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <button 
              onClick={handleToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors border ${
                notificationsEnabled 
                  ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" 
                  : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
              {notificationsEnabled ? "Notifications On" : "Notifications Off"}
            </button>
          </div>

          <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
            
            <Link
              to="/file"
              className="bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold text-center transition-colors text-lg shadow-sm relative"
            >
              {t("fileNewReq", "FILE NEW REQUEST")}
            </Link>

            <Link
              to="/track"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-4 px-6 rounded-xl font-bold text-center transition-colors text-lg shadow-sm relative"
            >
              {t("viewTrack", "VIEW / TRACK EXISTING REPORTS")}
              {newRepliesCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-7 h-7 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                  {newRepliesCount}
                </div>
              )}
            </Link>

            <Link
              to="/documents"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-4 px-6 rounded-xl font-bold text-center transition-colors text-lg shadow-sm"
            >
              {t("docConnect", "DOCUMENT CONNECT")}
            </Link>

            <Link
              to="/about"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-4 px-6 rounded-xl font-bold text-center transition-colors text-lg shadow-sm"
            >
              {t("knowRules", "KNOW RTI RULES")}
            </Link>

            <Link
              to="/toolkit"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-4 px-6 rounded-xl font-bold text-center transition-colors text-lg shadow-sm"
            >
              {t("rtiToolkit", "RTI TOOLKIT")}
            </Link>

          </div>
          
          <div className="mt-12 text-center">
            <button
              onClick={() => useAuthStore.getState().logout()}
              className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
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
