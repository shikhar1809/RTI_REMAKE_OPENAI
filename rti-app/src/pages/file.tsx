import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft, Copy, Check, ExternalLink, CheckCircle2, ShieldCheck } from "lucide-react";
import { useRTIStore } from "@/store/rtiStore";
import { useDocumentStore } from "@/store/documentStore";
import { generateMockDraft, translateDraft } from "@/data/mockDrafts";
import { STATES, UNSUPPORTED_STATE_GUIDANCE } from "@/data/states";
import { trackWizardStarted, trackWizardStep, trackDraftGenerated, trackDraftCopied } from "@/lib/analytics";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const TOTAL_STEPS = 4;

export default function FilePage() {
  const { t } = useTranslation(undefined, { keyPrefix: "file" });
  const { t: tc } = useTranslation(undefined, { keyPrefix: "common" });

  const {
    problemDescription,
    selectedStateId,
    draft,
    currentStep,
    setProblemDescription,
    setSelectedStateId,
    setDraft,
    setCurrentStep,
  } = useRTIStore();

  const { lastSynced } = useDocumentStore();

  const { savedFullName, savedAddress, savedMobile, saveProfileDetails } = useAuthStore();
  
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  function handleImport() {
    setName(savedFullName);
    setAddress(savedAddress);
    setMobile(savedMobile);
  }

  function handleSaveProfile() {
    saveProfileDetails(name, address, mobile);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function goNext() {
    if (currentStep === 1 && (!name || !address || !mobile)) return;
    if (currentStep === 2 && problemDescription.length < 10) return;
    if (currentStep === 3 && !selectedStateId) return;

    if (currentStep === 3) {
      const isBpl = useDocumentStore.getState().isBPLVerified();
      const profile = { name, address, mobile };
      const newDraft = generateMockDraft(problemDescription, selectedStateId, isBpl, profile);
      setDraft(newDraft);
      trackDraftGenerated(selectedStateId, "General");
    }

    const next = currentStep + 1;
    setCurrentStep(next);
    trackWizardStep(next);
  }

  function goBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function copyDraft() {
    if (!draft) return;
    await navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`);
    setCopied(true);
    trackDraftCopied(selectedStateId);
    setTimeout(() => setCopied(false), 2500);
  }

  const STATE_OPTIONS = [
    { id: "central", label: t("states.central", "Central Government") },
    { id: "up", label: t("states.up", "Uttar Pradesh") },
    { id: "kerala", label: t("states.kerala", "Kerala") },
    { id: "hp", label: t("states.hp", "Himachal Pradesh") },
    { id: "rajasthan", label: t("states.rajasthan", "Rajasthan") },
    { id: "jk", label: t("states.jk", "Jammu & Kashmir") },
    { id: "other", label: t("states.other", "Other State / UT") },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/home" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft size={16} /> Home
          </Link>
          {lastSynced && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>
                  {tc("step", "Step")} {currentStep} {tc("of", "of")} {TOTAL_STEPS}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="card shadow-sm">
            {!lastSynced ? (
              <div className="text-center py-10 px-4">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={40} className="text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Identity Verification Required</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  To legally file a Right to Information (RTI) request, you must first sync your official documents (like Aadhaar/PAN) to verify your identity.
                </p>
                <Link to="/documents" className="btn-primary inline-flex">
                  Go to Document Vault <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            ) : currentStep === 1 ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Your Details
                    </label>
                    {savedFullName && (
                      <button onClick={handleImport} className="text-xs text-blue-600 font-semibold hover:underline">
                        Auto-fill from saved profile
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    This information is required by the RTI Act and will be automatically added to your draft.
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-5 flex items-start gap-2">
                    <ShieldCheck size={16} className="text-green-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-green-800 font-medium leading-tight">
                      <strong>100% Private & Secure:</strong> Your details are stored strictly locally on your device. We do not track, collect, or upload your personal information to any server.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Full Name" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" 
                      />
                    </div>
                    <div>
                      <textarea 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        placeholder="Complete Postal Address" 
                        className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none" 
                      />
                    </div>
                    <div>
                      <input 
                        type="tel" 
                        value={mobile} 
                        onChange={(e) => setMobile(e.target.value)} 
                        placeholder="Mobile Number" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" 
                      />
                    </div>
                  </div>
                  
                  {name && address && mobile && (
                    <button onClick={handleSaveProfile} className="mt-4 text-xs font-semibold text-green-600 hover:underline">
                      Save details for next time
                    </button>
                  )}
                </div>
                
                <button
                  onClick={goNext}
                  disabled={!name || !address || !mobile}
                  className="btn-primary w-full"
                >
                  {tc("next", "Next")}
                  <ArrowRight size={16} />
                </button>
              </>
            ) : currentStep === 2 ? (
              <>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("step1Title", "What is your problem?")}
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  {t("step1Desc", "Describe the issue in your own words. We will handle the legal language.")}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    "Status of Ration Card application",
                    "Road repair contractor details",
                    "Pending FIR status",
                    "Marksheet verification"
                  ].map(template => (
                    <button
                      key={template}
                      onClick={() => setProblemDescription(`I want to know the ${template.toLowerCase()}`)}
                      className="text-xs font-medium px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder={t("step1Placeholder", "For example: I applied for a ration card 6 months ago...")}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none mb-6"
                />
                <div className="flex gap-3">
                  <button onClick={goBack} className="btn-secondary flex-1">
                    <ArrowLeft size={16} />
                    {tc("back", "Back")}
                  </button>
                  <button
                    onClick={goNext}
                    disabled={problemDescription.length < 10}
                    className="btn-primary flex-1"
                  >
                    {tc("next", "Next")}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </>
            ) : currentStep === 3 ? (
              <>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{t("step2Title", "Select the Authority")}</h1>
                <p className="text-sm text-gray-500 mb-6">{t("step2Desc", "Which state government or central authority?")}</p>
                <div className="space-y-2 mb-6">
                  {STATE_OPTIONS.map((state) => (
                    <button
                      key={state.id}
                      onClick={() => setSelectedStateId(state.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedStateId === state.id
                          ? "border-green-500 bg-green-50 text-green-800"
                          : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {state.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={goBack} className="btn-secondary flex-1">
                    <ArrowLeft size={16} />
                    {tc("back", "Back")}
                  </button>
                  <button onClick={goNext} disabled={!selectedStateId} className="btn-primary flex-1">
                    {tc("next", "Next")}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </>
            ) : currentStep === 4 && draft ? (
              <>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-xl font-bold text-gray-900">{t("step3Title", "Your RTI Draft is Ready")}</h1>
                  <select 
                    onChange={(e) => setDraft(translateDraft(draft, e.target.value))}
                    className="text-xs bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-600 shadow-sm focus:ring-1 focus:ring-green-500"
                  >
                    <option value="en">English (Default)</option>
                    <option value="hi">Translate to Hindi</option>
                    <option value="bn">Translate to Bengali</option>
                    <option value="ta">Translate to Tamil</option>
                  </select>
                </div>
                <p className="text-sm text-gray-500 mb-6">{t("step3Desc", "Copy this draft and paste it on the official portal.")}</p>
                <div id="print-section" className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="hidden print:block border-2 border-dashed border-gray-400 p-4 mb-6 text-center text-sm font-semibold text-gray-500">
                    [ Staple ₹10 Postal Order Here ]
                  </div>
                  <p className="font-semibold text-gray-900 mb-4">{draft.subject}</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{draft.body}</p>
                </div>
                
                {selectedStateId !== "other" && STATES[selectedStateId] ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
                    <p className="font-semibold text-blue-900 mb-1">Filing Instructions</p>
                    <p className="text-blue-800 mb-2">Portal: {STATES[selectedStateId].portalUrl}</p>
                    <p className="text-blue-800 mb-3">
                      Fee: {useDocumentStore.getState().isBPLVerified() ? "₹0 (Exempt under BPL)" : `₹${STATES[selectedStateId].fee}`}
                    </p>
                    <a
                      href={`https://${STATES[selectedStateId].portalUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline"
                    >
                      Open Portal <ExternalLink size={14} />
                    </a>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
                    <p className="font-semibold mb-2">{UNSUPPORTED_STATE_GUIDANCE.message}</p>
                    <p className="whitespace-pre-wrap">{UNSUPPORTED_STATE_GUIDANCE.instructions}</p>
                    <a href={UNSUPPORTED_STATE_GUIDANCE.doptDirectory} target="_blank" rel="noreferrer" className="inline-flex mt-2 font-semibold hover:underline">
                      View State Contact Directory <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={goBack} className="btn-secondary flex-1">
                    <ArrowLeft size={16} />
                    {tc("back", "Back")}
                  </button>
                  <button onClick={() => window.print()} className="btn-secondary flex-1">
                    Print PDF
                  </button>
                  <button onClick={copyDraft} className="btn-primary flex-1">
                    <Copy size={16} />
                    {copied ? tc("copied", "Copied!") : tc("copy", "Copy")}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
      
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={20} className="text-green-400" />
          <span className="text-sm font-medium">Details saved for later!</span>
        </div>
      )}
    </ProtectedRoute>
  );
}
