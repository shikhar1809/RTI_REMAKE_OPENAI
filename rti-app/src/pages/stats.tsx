import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Clock, Star, TrendingUp, Search, Filter, Eye, X, FileText, Image as ImageIcon, CheckCircle2, Download, PieChart as PieChartIcon, List, Sparkles, Bot, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MOCK_PUBLIC_RTIS, RTIApplication } from "@/data/mockRTIs";
import { useApplicationsStore } from "@/store/applicationsStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const navigate = useNavigate();
  
  const handleOpenArchiveAI = async () => {
    let screenshotData = null;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(document.body, { scale: 0.4 });
      screenshotData = canvas.toDataURL("image/jpeg", 0.4);
    } catch (e) {
      console.warn("Screenshot failed:", e);
    }
    navigate("/toolkit", {
      state: {
        sourcePage: "Public RTI Archive",
        screenshot: screenshotData,
        initialMessage: "I can see the Public RTI Archive. What topics, precedents, or historical RTIs would you like me to search for you?"
      }
    });
  };
  
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedApp, setSelectedApp] = useState<(RTIApplication & { views: number }) | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "chart" | "map">("list");
  
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStateId, setExportStateId] = useState("");
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Hello! I am the Public Archive AI. You can ask me anything about historical RTIs filed across India, and I will find relevant precedents for you.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { role: 'ai', content: `Based on the public archive, I found 3 similar RTIs filed recently regarding "${userMsg}". Most of them were successfully resolved within 28 days by the Municipal Corporation. Would you like me to draft a similar application for you?` }]);
    }, 1500);
  };

  const handleExport = () => {
    setIsExporting(true);
    let dataToExport = allPublicRTIs;
    
    if (exportStateId) {
      dataToExport = dataToExport.filter(r => r.stateId.toLowerCase() === exportStateId.toLowerCase());
    }
    if (exportStartDate) {
      dataToExport = dataToExport.filter(r => new Date(r.filedDate) >= new Date(exportStartDate));
    }
    if (exportEndDate) {
      dataToExport = dataToExport.filter(r => new Date(r.filedDate) <= new Date(exportEndDate));
    }
    
    const doc = new jsPDF();
    doc.text("Public RTI Archive Stats", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    const filters = [];
    if (exportStateId) filters.push(`State: ${exportStateId}`);
    if (exportStartDate) filters.push(`From: ${exportStartDate}`);
    if (exportEndDate) filters.push(`To: ${exportEndDate}`);
    if (filters.length > 0) doc.text(`Filters: ${filters.join(" | ")}`, 14, 28);
    
    const tableData = dataToExport.map(r => [
      r.id.substring(0, 8),
      r.subject.length > 40 ? r.subject.substring(0, 40) + "..." : r.subject,
      r.authority,
      r.status,
      new Date(r.filedDate).toLocaleDateString()
    ]);
    
    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Subject', 'Authority', 'Status', 'Date']],
      body: tableData,
    });
    
    doc.save(`RTI_Stats_${new Date().getTime()}.pdf`);
    
    setIsExporting(false);
    setShowExportModal(false);
  };

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
            <Link to="/home" className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
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
              <p className="text-[10px] text-gray-600 font-medium uppercase">{t("totalRtis")}</p>
            </div>
            <div className="card !p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-1.5">
                <Clock size={16} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.pending.toLocaleString()}</p>
              <p className="text-[10px] text-gray-600 font-medium uppercase">{t("pending")}</p>
            </div>
            <div className="card !p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-1.5">
                <MapPin size={16} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.resolved.toLocaleString()}</p>
              <p className="text-[10px] text-gray-600 font-medium uppercase">{t("resolved")}</p>
            </div>
            <div className="card !p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-1.5">
                <Star size={16} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.averageRating}/5</p>
              <p className="text-[10px] text-gray-600 font-medium uppercase">{t("avgRating")}</p>
            </div>
          </div>

          {/* Public Archive Section */}
          <div className="bg-white/95 rounded-2xl shadow-md border-2 border-gray-300 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="shrink-0">
                <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">{t("searchTitle")}</h2>
                <p className="text-xs text-gray-600">{t("searchDesc")}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                
                {/* View Toggle */}
                <div className="flex w-full sm:w-auto justify-between sm:justify-start bg-gray-200 p-1 rounded-lg">
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-700"}`}
                  >
                    <List size={14} /> {t("list")}
                  </button>
                  <button 
                    onClick={() => setViewMode("chart")}
                    className={`flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "chart" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-700"}`}
                  >
                    <PieChartIcon size={14} /> {t("charts")}
                  </button>
                  <button 
                    onClick={() => setViewMode("map")}
                    className={`flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "map" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-700"}`}
                  >
                    <MapPin size={14} /> {t("map")}
                  </button>
                </div>

                {/* Search Topics → opens MR.RIGHTEOUS */}
                <button
                  onClick={handleOpenArchiveAI}
                  className="flex items-center gap-2 pl-3 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-green-500 hover:text-green-700 hover:shadow-md transition-all w-full sm:w-48 font-medium"
                >
                  <Search size={16} className="text-gray-400 shrink-0" />
                  <span>{t("searchPlaceholder")}</span>
                  <span className="ml-auto text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">AI</span>
                </button>
                
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

            {/* Export — prominent standalone banner */}
            <div className="px-5 py-4 bg-blue-50 border-b border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <Download size={15} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900">Export Public Archive Data</p>
                  <p className="text-xs text-blue-600">Download a filtered PDF report of RTIs</p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-sm shrink-0"
              >
                <Download size={15} />
                {t("exportStats", "Export PDF")}
              </button>
            </div>
            
            {viewMode === "list" && (
              <div className="p-2 sm:p-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
                {filteredArchive.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    <p>{t("noResults")}</p>
                  </div>
                ) : (
                  filteredArchive.map((app, idx) => {
                    // Generate a deterministic view count based on app ID
                    const views = (app.id.length * 137 + app.subject.length * 42) % 5000 + 100;
                    
                    return (
                      <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all bg-white flex flex-col gap-3">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-bold text-gray-900 leading-tight">{t(`mock_${app.id}_subject`, app.subject)}</h3>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                            app.status === 'resolved' ? 'bg-green-100 text-green-700' :
                            app.status === 'replied' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {t(`status_${app.status}`, app.status.toUpperCase())}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{t(`mock_${app.id}_desc`, app.problemSummary)}</p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-600">
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                              <MapPin size={12} /> {t(`mock_${app.id}_authority`, app.authority)}
                            </span>
                            <span>{t("filed")} {new Date(app.filedDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1 text-gray-600">
                              <Eye size={12} /> {views.toLocaleString()} {t("views")}
                            </span>
                          </div>
                          <button 
                            onClick={() => setSelectedApp({...app, views})}
                            className="w-full sm:w-auto text-center text-green-600 font-bold text-xs hover:text-green-800 transition-colors bg-green-50 px-3 py-2 sm:py-1.5 rounded-lg border border-green-200 hover:bg-green-100"
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
                className="p-1.5 text-gray-600 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
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
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-600">
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                    <MapPin size={12} /> {selectedApp.authority}
                  </span>
                  <span>{t("filed")} {new Date(selectedApp.filedDate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-gray-600">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <ImageIcon size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">site_photos_proof.jpg</p>
                      <p className="text-xs text-gray-600">2.4 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <FileText size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">previous_complaints.pdf</p>
                      <p className="text-xs text-gray-600">1.1 MB</p>
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

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <Download className="text-blue-600" size={20} />
                <h3 className="font-bold text-gray-900">{t("exportModalTitle", "Export PDF Report")}</h3>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="p-1.5 text-gray-600 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t("selectState", "Select State")}</label>
                <select
                  value={exportStateId}
                  onChange={(e) => setExportStateId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t("allStates", "All States")}</option>
                  <option value="delhi">Delhi</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="punjab">Punjab</option>
                  <option value="up">Uttar Pradesh</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t("startDate", "Start Date")}</label>
                  <input
                    type="date"
                    value={exportStartDate}
                    onChange={(e) => setExportStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t("endDate", "End Date")}</label>
                  <input
                    type="date"
                    value={exportEndDate}
                    onChange={(e) => setExportEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors text-sm"
                >
                  {t("cancel", "Cancel")}
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm flex justify-center items-center gap-2"
                >
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Download size={16} />
                  )}
                  {t("exportPdf", "Export PDF")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* AI RAG Chat Interface Overlay */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 flex items-center justify-between text-white shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl leading-tight tracking-tight">Archive AI</h3>
                  <p className="text-emerald-100 text-xs font-medium">Search topics & precedents</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all hover:rotate-90 duration-200"
              >
                <X size={22} />
              </button>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-6" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-auto ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {msg.role === 'user' ? <div className="font-bold text-xs">U</div> : <Bot size={16} />}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <p className="text-[15px] leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 flex-row">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm mt-auto">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white border border-gray-100 text-gray-600 shadow-sm rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-2 max-w-[75%]">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about historical RTIs..."
                className="flex-1 bg-slate-100 border border-transparent px-5 py-3.5 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                autoFocus
              />
              <button 
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white px-5 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
              >
                Send <Send size={16} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}

    </ProtectedRoute>
  );
}
