import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Clock, AlertCircle, CheckCircle2, MessageSquare, Plus, Timer, ArrowLeft } from "lucide-react";
import { MOCK_APPLICATIONS, getDaysRemaining, type RTIApplication } from "@/data/mockRTIs";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function TrackPage() {
  const { t } = useTranslation(undefined, { keyPrefix: "track" });
  const { t: tc } = useTranslation(undefined, { keyPrefix: "common" });

  const applications = MOCK_APPLICATIONS;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/home" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft size={16} /> Home
          </Link>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t("pageTitle", "Track Applications")}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {t("pageDesc", "Monitor the status and 30-day deadlines of your RTI requests.")}
              </p>
            </div>
            <Link to="/file" className="btn-primary hidden sm:flex">
              <Plus size={16} />
              {t("fileNew", "New")}
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 border-dashed p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={28} className="text-gray-400" />
              </div>
              <h2 className="font-semibold text-gray-900 mb-2">{t("emptyTitle", "No applications yet")}</h2>
              <p className="text-gray-500 text-sm mb-6">{t("emptyDesc", "File your first RTI to start tracking.")}</p>
              <Link to="/file" className="btn-primary inline-flex">
                {t("fileFirst", "File First RTI")}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <RTICard key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

function RTICard({ app }: { app: RTIApplication }) {
  const { t } = useTranslation(undefined, { keyPrefix: "track" });
  const daysRemaining = getDaysRemaining(app.deadlineDate);
  const isOverdue = daysRemaining < 0;
  const isUrgent = daysRemaining >= 0 && daysRemaining <= 5;
  
  let statusColor = "bg-gray-100 text-gray-700";
  let StatusIcon = Clock;
  
  if (app.status === "replied") {
    statusColor = "bg-green-100 text-green-700";
    StatusIcon = CheckCircle2;
  } else if (app.status === "appealed") {
    statusColor = "bg-purple-100 text-purple-700";
    StatusIcon = AlertCircle;
  } else if (isOverdue) {
    statusColor = "bg-red-100 text-red-700";
    StatusIcon = Timer;
  } else if (isUrgent) {
    statusColor = "bg-amber-100 text-amber-700";
    StatusIcon = Timer;
  }

  return (
    <div className="card hover:shadow-md transition-shadow group flex flex-col sm:flex-row gap-5">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{app.subject}</h3>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColor}`}>
            <StatusIcon size={12} />
            {t(`status.${app.status}`, app.status)}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4">{app.authority}</p>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="font-medium text-gray-700">Filed:</span>
            {app.filedDate}
          </div>
          {app.status === "pending" && (
            <div className={`flex items-center gap-1.5 font-medium ${isOverdue ? "text-red-600" : isUrgent ? "text-amber-600" : "text-green-600"}`}>
              <Timer size={14} />
              {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex sm:flex-col justify-end gap-2 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-5">
        <Link to={`/track/${app.id}`} className="btn-secondary w-full sm:w-auto flex-1">
          {t("viewDetails", "Details")}
        </Link>
        {app.status === "replied" && (
          <Link to={`/check-reply`} className="btn-primary w-full sm:w-auto flex-1">
            Check Reply
          </Link>
        )}
      </div>
    </div>
  );
}
