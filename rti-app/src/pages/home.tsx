import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { STATES } from "@/data/states";
import { useTranslation } from "react-i18next";
import { FcGlobe } from "react-icons/fc";

export default function HomePage() {
  const { userName, selectedStateId } = useAuthStore();
  const stateInfo = STATES[selectedStateId];
  const { t, i18n } = useTranslation(undefined, { keyPrefix: "dashboard" });

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

          <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
            
            <Link
              to="/file"
              className="bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold text-center transition-colors text-lg shadow-sm"
            >
              {t("fileNewReq", "FILE NEW REQUEST")}
            </Link>

            <Link
              to="/track"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-4 px-6 rounded-xl font-bold text-center transition-colors text-lg shadow-sm"
            >
              {t("viewTrack", "VIEW / TRACK EXISTING REPORTS")}
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
    </ProtectedRoute>
  );
}
