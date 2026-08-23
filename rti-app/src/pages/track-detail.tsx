import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Timer, FileText, Download, Eye, EyeOff } from "lucide-react";
import { useApplicationsStore } from "@/store/applicationsStore";
import { getDaysRemaining } from "@/data/mockRTIs";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function TrackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { applications, togglePublic } = useApplicationsStore();
  
  const app = applications.find(a => a.id === id);
  
  if (!app) {
    return <Navigate to="/track" replace />;
  }

  const daysRemaining = getDaysRemaining(app.deadlineDate);
  const isOverdue = daysRemaining < 0;
  const isUrgent = daysRemaining >= 0 && daysRemaining <= 5;
  
  let statusColor = "bg-gray-100 text-gray-700 border-gray-200";
  let StatusIcon = Clock;
  let statusText = "Pending";
  
  if (app.status === "replied") {
    statusColor = "bg-green-100 text-green-700 border-green-200";
    StatusIcon = CheckCircle2;
    statusText = "Replied";
  } else if (app.status === "appealed") {
    statusColor = "bg-purple-100 text-purple-700 border-purple-200";
    StatusIcon = AlertCircle;
    statusText = "Appealed";
  } else if (app.status === "resolved") {
    statusColor = "bg-blue-100 text-blue-700 border-blue-200";
    StatusIcon = CheckCircle2;
    statusText = "Resolved";
  } else if (isOverdue) {
    statusColor = "bg-red-100 text-red-700 border-red-200";
    StatusIcon = Timer;
    statusText = "Overdue";
  } else if (isUrgent) {
    statusColor = "bg-amber-100 text-amber-700 border-amber-200";
    StatusIcon = Timer;
    statusText = "Urgent";
  }

  // Format dates for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center py-8 px-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-3xl">
          <Link to="/track" className="inline-flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-gray-900 mb-6 transition-all bg-white/95 border-2 border-gray-300 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50">
            <ArrowLeft size={16} /> Back to Tracking
          </Link>

          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{app.subject}</h1>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border-2 ${statusColor} shrink-0`}>
                  <StatusIcon size={16} />
                  {statusText}
                </div>
              </div>
              <p className="text-gray-700 font-bold text-lg">{app.authority}</p>
              <p className="text-sm text-gray-500 mt-1 capitalize">{app.stateId.replace('-', ' ')}</p>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-8">
              {/* Timeline Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-xl border border-gray-200">
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">Filed Date</p>
                  <p className="text-gray-900 font-semibold">{formatDate(app.filedDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">Expected Reply By (30 Days)</p>
                  <p className="text-gray-900 font-semibold">{formatDate(app.deadlineDate)}</p>
                  {app.status === "pending" && (
                    <p className={`text-sm mt-1 font-bold ${isOverdue ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-green-600'}`}>
                      {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
                    </p>
                  )}
                </div>
              </div>

              {/* Problem Summary */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={20} className="text-gray-400" />
                  Your Request Summary
                </h2>
                <div className="bg-green-50/50 p-5 rounded-xl border border-green-100 text-gray-700 leading-relaxed font-medium">
                  {app.problemSummary}
                </div>
              </div>

              {/* Public Archive Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex flex-col pr-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    {app.isPublic ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} className="text-gray-400" />}
                    Public Archive
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Allow others to view and download this RTI to help the community.
                  </p>
                </div>
                <button
                  onClick={() => togglePublic(app.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${app.isPublic ? 'bg-green-600' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${app.isPublic ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                {app.status === "replied" ? (
                  <Link to="/check-reply" className="btn-primary flex-1 justify-center py-3">
                    Analyze Government Reply
                  </Link>
                ) : (
                  <button className="btn-secondary flex-1 justify-center py-3 opacity-50 cursor-not-allowed">
                    Reply Not Received Yet
                  </button>
                )}
                
                <button className="btn-secondary flex-1 justify-center py-3 gap-2 bg-white">
                  <Download size={18} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
