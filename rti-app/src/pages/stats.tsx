import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Clock, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function StatsPage() {
  const { t } = useTranslation(undefined, { keyPrefix: "stats" });

  const stats = {
    totalFiled: 12450,
    pending: 3240,
    resolved: 8120,
    averageRating: 4.6,
  };

  const topStates = [
    { state: "Uttar Pradesh", count: 3200, percentage: 25 },
    { state: "Maharashtra", count: 2800, percentage: 22 },
    { state: "Karnataka", count: 1900, percentage: 15 },
    { state: "Delhi", count: 1500, percentage: 12 },
    { state: "Kerala", count: 1200, percentage: 9 },
  ];

  const feedbackData = [
    { name: "Anonymous User (UP)", rating: 5, comment: "Very helpful platform. Got my ration card issue resolved." },
    { name: "Anonymous User (MH)", rating: 4, comment: "Process is easy, but government response took time." },
    { name: "Anonymous User (KA)", rating: 5, comment: "Drafting tool is amazing! Highly recommended." },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center py-4 px-4 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-4xl space-y-4">
          
          <div className="bg-white/95 rounded-2xl shadow-md border-2 border-gray-300 sticky top-4 z-10 px-4 py-3 flex items-center">
            <Link to="/home" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-xl font-bold text-gray-900 ml-auto">RTI Statistics</h1>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="card !p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1.5">
                <TrendingUp size={16} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.totalFiled.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase">Total RTIs</p>
            </div>
            <div className="card !p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-1.5">
                <Clock size={16} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.pending.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase">Pending</p>
            </div>
            <div className="card !p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-1.5">
                <MapPin size={16} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.resolved.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase">Resolved</p>
            </div>
            <div className="card !p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-1.5">
                <Star size={16} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.averageRating}/5</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase">Avg Rating</p>
            </div>
          </div>

          {/* Location Stats & Feedback */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Location Stats */}
            <div className="bg-white/95 rounded-xl border-2 border-gray-300 shadow-md overflow-hidden flex flex-col">
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900">RTI Requests by State</h2>
              </div>
              <div className="p-4 flex-1">
                <div className="space-y-3">
                  {topStates.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{item.state}</span>
                        <span className="text-gray-500">{item.count.toLocaleString()} filings</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-white/95 rounded-xl border-2 border-gray-300 shadow-md overflow-hidden flex flex-col">
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900">Recent Feedback</h2>
              </div>
              <div className="divide-y divide-gray-100 overflow-y-auto max-h-64">
                {feedbackData.map((feedback, idx) => (
                  <div key={idx} className="p-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700">{feedback.name}</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={i < feedback.rating ? "fill-amber-400" : "fill-gray-200 text-gray-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic">"{feedback.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
