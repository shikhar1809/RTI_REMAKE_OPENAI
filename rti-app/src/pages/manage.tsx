import { Link, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useTranslation } from "react-i18next";
import { useApplicationsStore } from "@/store/applicationsStore";
import { ArrowLeft, FileText, Activity } from "lucide-react";

export default function ManagePage() {
  const { t } = useTranslation(undefined, { keyPrefix: "dashboard" });
  const navigate = useNavigate();
  
  const { applications } = useApplicationsStore();
  const newRepliesCount = applications.filter((app) => app.status === "replied").length;

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center py-8 px-4 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md p-4 sm:p-8">
          <button 
            onClick={() => navigate("/home")} 
            className="inline-flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-gray-900 mb-6 transition-all bg-white/95 border-2 border-gray-300 px-3 py-1.5 rounded-full shadow-md"
          >
            <ArrowLeft size={16} /> Home
          </button>

          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 drop-shadow-md">
              Manage Reports
            </h1>
            <p className="text-gray-600 font-medium text-sm drop-shadow">
              File a new RTI request or check the status of existing ones.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <Link
              to="/file"
              className="bg-white/95 hover:bg-green-50 text-gray-800 hover:text-green-700 p-6 rounded-3xl font-bold text-center transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 border-2 border-gray-300 hover:border-green-500 flex flex-col items-center justify-center gap-3 h-48"
            >
              <FileText size={48} className="drop-shadow-sm mb-1 transition-colors" />
              <span className="text-xl tracking-wide">FILE A NEW RTI</span>
            </Link>

            <Link
              to="/track"
              className="bg-white/95 hover:bg-green-50 text-gray-800 hover:text-green-700 p-6 rounded-3xl font-bold text-center transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 border-2 border-gray-300 hover:border-green-500 flex flex-col items-center justify-center gap-3 h-48 relative"
            >
              <Activity size={48} className="drop-shadow-sm mb-1 transition-colors" />
              <span className="text-xl tracking-wide">VIEW/TRACK EXISTING REPORTS</span>
              {newRepliesCount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-black w-8 h-8 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                  {newRepliesCount}
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
