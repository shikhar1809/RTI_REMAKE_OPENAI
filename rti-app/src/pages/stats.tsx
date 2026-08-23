import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Clock, Star, TrendingUp, Search, Filter, Eye, X, FileText, Image as ImageIcon, CheckCircle2, Download, PieChart as PieChartIcon, List } from "lucide-react";
import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MOCK_PUBLIC_RTIS, RTIApplication } from "@/data/mockRTIs";
import { useApplicationsStore } from "@/store/applicationsStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const STATE_COORDINATES: Record<string, [number, number]> = {
  Delhi: [28.7041, 77.1025],
  Maharashtra: [19.7515, 75.7139],
  Karnataka: [15.3173, 75.7139],
  Punjab: [31.1471, 75.3412],
  "Uttar Pradesh": [26.8467, 80.9462],
  Kerala: [10.8505, 76.2711],
  TamilNadu: [11.1271, 78.6569],
  Gujarat: [22.2587, 71.1924],
  Rajasthan: [27.0238, 74.2179],
  Bengal: [22.9868, 87.8550]
};

export default function StatsPage() {
  const { t } = useTranslation(undefined, { keyPrefix: "stats" });
  const { applications } = useApplicationsStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedApp, setSelectedApp] = useState<(RTIApplication & { views: number }) | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "chart" | "map">("list");

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

  // Chart Data Processing
  const statusData = useMemo(() => {
    const counts = { pending: 0, replied: 0, resolved: 0 };
    filteredArchive.forEach(app => {
      if (counts[app.status as keyof typeof counts] !== undefined) {
        counts[app.status as keyof typeof counts]++;
      }
    });
    return [
      { name: "Pending", value: counts.pending, color: "#f59e0b" },
      { name: "Replied", value: counts.replied, color: "#3b82f6" },
      { name: "Resolved", value: counts.resolved, color: "#10b981" }
    ];
  }, [filteredArchive]);

  const stateData = useMemo(() => {
    const stateCounts: Record<string, number> = {};
    filteredArchive.forEach(app => {
      const s = app.stateId.charAt(0).toUpperCase() + app.stateId.slice(1);
      stateCounts[s] = (stateCounts[s] || 0) + 1;
    });
    return Object.entries(stateCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5
  }, [filteredArchive]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center py-4 px-4 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-4xl space-y-6">
          
          <div className="bg-white/95 rounded-2xl shadow-md border-2 border-gray-300 sticky top-4 z-10 px-4 py-3 flex items-center">
            <Link to="/home" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft size={16} /> {t("backHome")}
            </Link>
            <h1 className="text-xl font-bold text-gray-900 ml-auto">{t("pageTitle")}</h1>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="card !p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1.5">
                <TrendingUp size={16} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.totalFiled.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase">{t("totalRtis")}</p>
            </div>
            <div className="card !p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-1.5">
                <Clock size={16} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.pending.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase">{t("pending")}</p>
            </div>
            <div className="card !p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-1.5">
                <MapPin size={16} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.resolved.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase">{t("resolved")}</p>
            </div>
            <div className="card !p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-1.5">
                <Star size={16} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.averageRating}/5</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase">{t("avgRating")}</p>
            </div>
          </div>

          {/* Public Archive Section */}
          <div className="bg-white/95 rounded-2xl shadow-md border-2 border-gray-300 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t("searchTitle")}</h2>
                <p className="text-xs text-gray-500">{t("searchDesc")}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                
                {/* View Toggle */}
                <div className="flex bg-gray-200 p-1 rounded-lg">
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <List size={14} /> {t("list")}
                  </button>
                  <button 
                    onClick={() => setViewMode("chart")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "chart" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <PieChartIcon size={14} /> {t("charts")}
                  </button>
                  <button 
                    onClick={() => setViewMode("map")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "map" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <MapPin size={14} /> {t("map")}
                  </button>
                </div>

                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder={t("searchPlaceholder")}
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
                    <option value="">{t("allStates")}</option>
                    <option value="delhi">Delhi</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="punjab">Punjab</option>
                    <option value="up">Uttar Pradesh</option>
                  </select>
                </div>
              </div>
            </div>
            
            {viewMode === "list" && (
              <div className="p-2 sm:p-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
                {filteredArchive.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t("noResults")}</p>
                  </div>
                ) : (
                  filteredArchive.map((app, idx) => {
                    // Generate a deterministic view count based on app ID
                    const views = (app.id.length * 137 + app.subject.length * 42) % 5000 + 100;
                    
                    return (
                      <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all bg-white flex flex-col gap-3">
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
                        
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                              <MapPin size={12} /> {app.authority}
                            </span>
                            <span>{t("filed")} {new Date(app.filedDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <Eye size={12} /> {views.toLocaleString()} {t("views")}
                            </span>
                          </div>
                          <button 
                            onClick={() => setSelectedApp({...app, views})}
                            className="text-green-600 font-bold text-xs hover:text-green-800 transition-colors bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-100"
                          >
                            {t("viewDetails")}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
            
            {viewMode === "chart" && (
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white min-h-[400px]">
                {/* Chart 1: Status Distribution */}
                <div className="border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-center">
                  <h3 className="font-bold text-gray-900 mb-4 text-center">{t("statusDist")}</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`${value}`, t("count")]}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Top States */}
                <div className="border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-center">
                  <h3 className="font-bold text-gray-900 mb-4 text-center">{t("topStates")}</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stateData}
                        margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12, fill: '#6b7280' }} 
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f3f4f6' }}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name={t("rtisFiled")} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {viewMode === "map" && (
              <div className="p-4 sm:p-6 bg-white min-h-[500px] flex flex-col relative z-0">
                <h3 className="font-bold text-gray-900 text-xl mb-4">{t("heatmap")}</h3>
                <div className="w-full rounded-2xl overflow-hidden border-2 border-gray-200 shadow-inner relative" style={{ height: "450px" }}>
                  <MapContainer 
                    center={[22.5937, 78.9629]} 
                    zoom={4} 
                    scrollWheelZoom={false}
                    className="absolute inset-0 z-0"
                    style={{ background: '#f8fafc', height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    {stateData.map((state) => {
                      // Fallback coordinate if not in mapping, roughly central India
                      const coords = STATE_COORDINATES[state.name] || [22.5, 78.9];
                      // Scale radius by volume
                      const radius = Math.max(10, Math.min(30, state.count * 3));
                      return (
                        <CircleMarker
                          key={state.name}
                          center={coords}
                          radius={radius}
                          fillColor="#16a34a"
                          color="#15803d"
                          weight={2}
                          opacity={0.8}
                          fillOpacity={0.6}
                        >
                          <LeafletTooltip direction="top" offset={[0, -10]} opacity={1}>
                            <div className="text-center font-sans">
                              <p className="font-bold text-gray-900 m-0">{state.name}</p>
                              <p className="text-gray-600 text-xs m-0">{state.count} {t("rtisFiled")}</p>
                            </div>
                          </LeafletTooltip>
                        </CircleMarker>
                      );
                    })}
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Detailed Modal View */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="text-green-600" size={20} />
                <h3 className="font-bold text-gray-900">{t("modalTitle")}</h3>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {/* Content */}
            <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-6">
              
              <div>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">{selectedApp.subject}</h2>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                    selectedApp.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    selectedApp.status === 'replied' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedApp.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                    <MapPin size={12} /> {selectedApp.authority}
                  </span>
                  <span>{t("filed")} {new Date(selectedApp.filedDate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Eye size={12} /> {selectedApp.views?.toLocaleString()} {t("views")}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">{t("problemDesc")}</h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed">
                  {selectedApp.problemSummary}
                </div>
              </div>

              {/* Fake Attachments */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">{t("attachedEvidence")} (2 {t("files")})</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <ImageIcon size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">site_photos_proof.jpg</p>
                      <p className="text-xs text-gray-500">2.4 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <FileText size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">previous_complaints.pdf</p>
                      <p className="text-xs text-gray-500">1.1 MB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Government Response Download */}
              {(selectedApp.status === 'replied' || selectedApp.status === 'resolved') && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-green-600">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-900 text-sm">{t("govReply")}</h4>
                      <p className="text-xs text-green-700">{t("receivedOn")} {
                        new Date(new Date(selectedApp.filedDate).getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()
                      }</p>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 bg-white border border-green-300 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                    <Download size={16} /> {t("download")} PDF
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
