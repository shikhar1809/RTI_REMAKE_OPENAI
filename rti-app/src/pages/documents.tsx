import { useState } from "react";
import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { FcSafe, FcDocument, FcSimCard, FcDataBackup } from "react-icons/fc";
import { useDocumentStore } from "@/store/documentStore";

const ICON_MAP: Record<string, any> = {
  aadhaar: FcSimCard,
  pan: FcDocument,
  bpl: FcSafe,
};

export default function DocumentsPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { documents, lastSynced, syncBPL } = useDocumentStore();

  const handleSync = async () => {
    setIsSyncing(true);
    await syncBPL();
    setIsSyncing(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/home" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft size={16} /> Home
          </Link>
          
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FcDataBackup size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Document Locker</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Check if your identity and fee exemption documents are linked. These are automatically attached to your RTI applications when required.
            </p>
          </div>

          <div className="card mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
              <div>
                <h2 className="font-bold text-gray-900">DigiLocker Integration</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {lastSynced 
                    ? `Last synced today at ${lastSynced}` 
                    : "Securely fetch your official documents directly from the government."}
                </p>
              </div>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="btn-primary py-2 px-4 text-sm flex items-center justify-center gap-2 sm:w-auto w-full"
              >
                <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                {isSyncing ? "Connecting to DigiLocker..." : "Sync DigiLocker"}
              </button>
            </div>

            <div className="space-y-4">
              {documents.map((doc) => {
                const IconComponent = ICON_MAP[doc.id];
                return (
                <div key={doc.id} className={`flex items-center justify-between p-4 rounded-xl border ${doc.verified ? 'border-green-200 bg-green-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <IconComponent size={28} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                      <p className="text-xs text-gray-500">{doc.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {doc.verified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <CheckCircle2 size={14} /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                        <AlertCircle size={14} /> Missing
                      </span>
                    )}
                  </div>
                </div>
              )})}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            <span className="font-semibold">Privacy Note:</span> We do not store your documents on our servers. They are securely transmitted directly to the RTI filing authority when you submit an application.
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
