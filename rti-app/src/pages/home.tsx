import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MOCK_APPLICATIONS, getDaysRemaining } from "@/data/mockRTIs";
import { STATES } from "@/data/states";
import {
  FcDocument,
  FcSearch,
  FcHighPriority,
  FcApproval,
  FcIdea,
  FcClock,
  FcRight,
  FcDataBackup
} from "react-icons/fc";
import { ArrowLeft, ArrowRight, ChevronRight, Timer, AlertTriangle } from "lucide-react";

export default function HomePage() {
  const { userName, selectedStateId } = useAuthStore();
  const stateInfo = STATES[selectedStateId];
  const pending = MOCK_APPLICATIONS.filter((a) => a.status === "pending");
  const recentApp = MOCK_APPLICATIONS[0];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Good day,</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{userName ?? "Citizen"} 👋</h1>
            </div>
            {stateInfo && (
              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm inline-flex items-center gap-2">
                <span className="text-lg">📍</span>
                <span className="text-sm font-medium text-gray-700">{stateInfo.name}</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">Fee: ₹{stateInfo.fee}</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Left/Main Column */}
            <div className="md:col-span-2 space-y-6 md:space-y-8">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <Link
                  to="/file"
                  className="card flex flex-col items-center justify-center gap-4 py-8 md:py-10 text-center hover:shadow-lg transition-all hover:border-green-300 group"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 group-hover:scale-105 transition-all">
                    <FcDocument size={44} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 md:text-lg">File New RTI</div>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">Draft & route instantly</div>
                  </div>
                </Link>

                <Link
                  to="/track"
                  className="card flex flex-col items-center justify-center gap-4 py-8 md:py-10 text-center hover:shadow-lg transition-all hover:border-blue-300 group"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                    <FcSearch size={44} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 md:text-lg">Track Applications</div>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">{MOCK_APPLICATIONS.length} active cases</div>
                  </div>
                </Link>
              </div>

              {pending.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Timer size={16} /> Awaiting Reply
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {pending.slice(0, 4).map((app) => {
                      const days = getDaysRemaining(app.deadlineDate);
                      const overdue = days < 0;
                      return (
                        <Link
                          key={app.id}
                          to={`/track/${app.id}`}
                          className="card flex flex-col items-start gap-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between w-full">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                overdue ? "bg-red-100" : "bg-amber-100"
                              }`}
                            >
                              <Timer
                                size={18}
                                className={overdue ? "text-red-600" : "text-amber-600"}
                              />
                            </div>
                            <ChevronRight size={18} className="text-gray-300" />
                          </div>
                          <div className="w-full">
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{app.subject}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{app.authority}</p>
                          </div>
                          <div
                            className={`text-xs font-bold w-full pt-3 mt-auto border-t border-gray-100 ${
                              overdue ? "text-red-600" : "text-amber-600"
                            }`}
                          >
                            {overdue
                              ? `${Math.abs(days)} days overdue`
                              : `${days} days left`}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right/Sidebar Column */}
            <div className="space-y-6">
              {MOCK_APPLICATIONS.some((a) => a.status === "replied" && (a.replyScore ?? 0) < 60) && (
                <div className="card border-amber-200 bg-amber-50 shadow-sm">
                  <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <AlertTriangle size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Weak reply detected</p>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        One of your RTIs received a reply that may not fully answer your question.
                      </p>
                    </div>
                    <Link
                      to="/check-reply"
                      className="inline-flex items-center justify-center gap-1 mt-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Check it now <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              )}

              <div className="card shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      to: "/check-reply",
                      icon: FcApproval,
                      label: "Check a Government Reply",
                      bg: "bg-green-50",
                    },
                    {
                      to: "/about",
                      icon: FcIdea,
                      label: "Read the RTI Guide",
                      bg: "bg-blue-50",
                    },
                    {
                      to: "/track",
                      icon: FcClock,
                      label: "View All Past Cases",
                      bg: "bg-purple-50",
                    },
                    {
                      to: "/documents",
                      icon: FcDataBackup,
                      label: "Document Locker (DigiLocker)",
                      bg: "bg-orange-50",
                    },
                  ].map(({ to, icon: Icon, label, bg }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                    >
                      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <Icon size={24} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => {
                useAuthStore.getState().logout();
                window.location.href = "/login";
              }}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
