import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { FcHighPriority, FcIdea } from "react-icons/fc";

export default function ToolkitPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-3xl p-4 sm:p-8">
          <Link to="/home" className="inline-flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-gray-900 mb-6 transition-all bg-white/95 border-2 border-gray-300 px-3 py-1.5 rounded-full shadow-md">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          
          <div className="bg-white/95 border-2 border-gray-300 rounded-2xl p-5 shadow-md mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">RTI Toolkit</h1>
            <p className="text-gray-500">Advanced tools to help you manage your RTI applications.</p>
          </div>

          <div className="grid gap-4">
            <Link
              to="/check-reply"
              className="card flex items-center justify-between p-5 md:p-6 hover:border-amber-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <FcHighPriority size={32} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Analyze Government Reply</div>
                  <div className="text-sm text-gray-500 mt-1">Use AI to grade response strength & draft appeals</div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                <ChevronRight size={20} />
              </div>
            </Link>
            
            <Link
              to="/about"
              className="card flex items-center justify-between p-5 md:p-6 hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <FcIdea size={32} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">RTI Guide & Tips</div>
                  <div className="text-sm text-gray-500 mt-1">Learn how to write better RTIs</div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <ChevronRight size={20} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
