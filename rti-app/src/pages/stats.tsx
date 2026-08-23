import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Clock, Star, TrendingUp, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MOCK_PUBLIC_RTIS, RTIApplication } from "@/data/mockRTIs";
import { useApplicationsStore } from "@/store/applicationsStore";

export default function StatsPage() {
  const { t } = useTranslation(undefined, { keyPrefix: "stats" });
  const { applications } = useApplicationsStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const stats = {
    totalFiled: 12450,
    pending: 3240,
    resolved: 8120,
    averageRating: 4.6,
  };

  // Combine mock global public RTIs with user's own public RTIs
  const userPublicRTIs = applications.filter(app => app.isPublic);
  const allPublicRTIs = [...MOCK_PUBLIC_RTIS, ...userPublicRTIs];

  // Apply filters
  const filteredArchive = allPublicRTIs.filter(app => {
    const matchesSearch = app.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.problemSummary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "" || app.stateId.toLowerCase() === locationFilter.toLowerCase();
    return matchesSearch && matchesLocation;
  });

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center py-4 px-4 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-4xl space-y-6">
          
          <div className="bg-white/95 rounded-2xl shadow-md border-2 border-gray-300 sticky top-4 z-10 px-4 py-3 flex items-center">
            <Link to="/home" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-xl font-bold text-gray-900 ml-auto">Public RTI Archive</h1>
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

          {/* Public Archive List */}
          <div className="bg-white/95 rounded-2xl shadow-md border-2 border-gray-300 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Search the Archive</h2>
                <p className="text-xs text-gray-500">Find publicly accessible RTIs filed by others.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
                <div className="relative">
                  <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    className="pl-9 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none"
                  >
                    <option value="">All States</option>
                    <option value="delhi">Delhi</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="punjab">Punjab</option>
                    <option value="up">Uttar Pradesh</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-2 sm:p-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
              {filteredArchive.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No public RTIs found matching your criteria.</p>
                </div>
              ) : (
                filteredArchive.map((app, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all bg-white flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-bold text-gray-900 leading-tight">{app.subject}</h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                        app.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        app.status === 'replied' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{app.problemSummary}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-medium text-gray-500">
                      <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                        <MapPin size={12} /> {app.authority}
                      </span>
                      <span>Filed: {new Date(app.filedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
