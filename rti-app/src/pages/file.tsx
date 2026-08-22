import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft, Copy, Check, ExternalLink } from "lucide-react";
import { useRTIStore } from "@/store/rtiStore";
import { useDocumentStore } from "@/store/documentStore";
import { generateMockDraft, translateDraft } from "@/data/mockDrafts";
import { STATES, UNSUPPORTED_STATE_GUIDANCE } from "@/data/states";
import { trackWizardStarted, trackWizardStep, trackDraftGenerated, trackDraftCopied } from "@/lib/analytics";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Link } from "react-router-dom";

const TOTAL_STEPS = 3;

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

  const [copied, setCopied] = useState(false);

  function goNext() {
    if (currentStep === 1 && problemDescription.length < 10) return;
    if (currentStep === 2 && !selectedStateId) return;

    if (currentStep === 2) {
      const isBpl = useDocumentStore.getState().isBPLVerified();
      const newDraft = generateMockDraft(problemDescription, selectedStateId, isBpl);
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

          <div className="card shadow-sm">
            {currentStep === 1 ? (
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

                <textarea
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder={t("step1Placeholder", "For example: I applied for a ration card 6 months ago...")}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none mb-6"
                />
                <button
                  onClick={goNext}
                  disabled={problemDescription.length < 10}
                  className="btn-primary w-full"
                >
                  {tc("next", "Next")}
                  <ArrowRight size={16} />
                </button>
              </>
            ) : currentStep === 2 ? (
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
            ) : currentStep === 3 && draft ? (
              <>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-xl font-bold text-gray-900">{t("step3Title", "Your RTI Draft is Ready")}</h1>
                  <select 
                    onChange={(e) => setDraft(translateDraft(draft, e.target.value))}
                    className="text-xs bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-600 shadow-sm focus:ring-1 focus:ring-green-500"
                  >
                    <option value="en">English (Default)</option>
                    <option value="hi">Translate to Hindi</option>
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
    </ProtectedRoute>
  );
}
