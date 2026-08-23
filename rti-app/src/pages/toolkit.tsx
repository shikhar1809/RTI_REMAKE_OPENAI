import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ArrowLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { FcHighPriority, FcIdea, FcFeedback } from "react-icons/fc";
import { useState } from "react";

export default function ToolkitPage() {
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureRequest, setFeatureRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!featureRequest.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setShowFeatureModal(false);
        setIsSubmitted(false);
        setFeatureRequest("");
      }, 2000);
    }, 1000);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center py-8 px-4 min-h-[calc(100vh-4rem)]">
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

            <button
              onClick={() => setShowFeatureModal(true)}
              className="card flex items-center justify-between p-5 md:p-6 hover:border-purple-300 transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <FcFeedback size={32} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Request a New Feature</div>
                  <div className="text-sm text-gray-500 mt-1">Tell us what tools we should build next</div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                <ChevronRight size={20} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {showFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                <FcFeedback size={24} /> Feature Request
              </h3>
            </div>
            
            <div className="p-6">
              {isSubmitted ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Request Submitted!</h4>
                  <p className="text-gray-500">Thank you for your feedback. We're constantly working to improve this platform.</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-4 text-sm">
                    What feature would make filing and tracking RTIs easier for you?
                  </p>
                  <textarea 
                    value={featureRequest}
                    onChange={(e) => setFeatureRequest(e.target.value)}
                    placeholder="E.g., I would love to see an integration with WhatsApp for status updates..."
                    className="w-full h-32 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none mb-6"
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowFeatureModal(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={!featureRequest.trim() || isSubmitting}
                      className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold rounded-xl transition-colors flex justify-center items-center"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
