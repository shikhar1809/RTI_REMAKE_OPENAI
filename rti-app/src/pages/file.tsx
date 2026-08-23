import { Paperclip, X, ImageIcon, FileText, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft, Copy, Check, ExternalLink, CheckCircle2, ShieldCheck, AlertOctagon, Eye, EyeOff } from "lucide-react";
import { useRTIStore } from "@/store/rtiStore";
import { useDocumentStore } from "@/store/documentStore";
import { generateMockDraft, translateDraft } from "@/data/mockDrafts";
import { STATES, UNSUPPORTED_STATE_GUIDANCE } from "@/data/states";
import { trackWizardStarted, trackWizardStep, trackDraftGenerated, trackDraftCopied } from "@/lib/analytics";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useApplicationsStore } from "@/store/applicationsStore";
import { PublicConsentModal } from "@/components/PublicConsentModal";

const TOTAL_STEPS = 6;

export default function FilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(undefined, { keyPrefix: "file" });
  const { t: tc } = useTranslation(undefined, { keyPrefix: "common" });

  const {
    applicantName: name,
    applicantAddress: address,
    applicantMobile: mobile,
    problemDescription,
    selectedStateId,
    draft,
    currentStep,
    setApplicantName: setName,
    setApplicantAddress: setAddress,
    setApplicantMobile: setMobile,
    setProblemDescription,
    setSelectedStateId,
    setDraft,
    setCurrentStep,
    resetWizard,
  } = useRTIStore();

  const { lastSynced } = useDocumentStore();

  const { savedFullName, savedAddress, savedMobile, saveProfileDetails } = useAuthStore();

  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [rating, setRating] = useState(0);
  const [attachments, setAttachments] = useState<{ name: string; size: string; type: string; url: string }[]>([]);
  const [isPublicApp, setIsPublicApp] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addApplication } = useApplicationsStore();

  const handleToggleClick = () => {
    if (isPublicApp) {
      setIsPublicApp(false);
    } else {
      setShowConsent(true);
    }
  };

  const handleSubmitRTI = () => {
    // Generate a mock application and push it to the store so tracking works
    const newId = `rti-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const authorityName = STATES[selectedStateId]?.name || "Government Authority";
    
    addApplication({
      id: newId,
      subject: draft?.subject || "RTI Application",
      authority: authorityName,
      stateId: selectedStateId,
      filedDate: new Date().toISOString(),
      deadlineDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending",
      problemSummary: problemDescription,
      isPublic: isPublicApp
    });
    
    setCurrentStep(6);
  };

  useEffect(() => {
    // If the user navigates back to this page and it was left on step 6, reset it
    if (currentStep === 6) {
      resetWizard();
    }
  }, []);

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

  const [fileError, setFileError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("fetching basic details...");

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError("");
    const files = Array.from(e.target.files || []);
    
    // Only accept one file at a time per user instruction, but since we map we can handle if they somehow select multiple
    const validFiles = [];
    
    for (const f of files) {
      // Check file extension/type manually for better error message
      const isImage = f.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name);
      const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
      const isWord = f.type === "application/msword" || 
                     f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
                     /\.(doc|docx)$/i.test(f.name);
                     
      if (!isImage && !isPdf && !isWord) {
        setFileError(`Invalid file type: ${f.name}. Please upload only Images, PDFs, or Word documents.`);
        continue; // Skip invalid files
      }
      validFiles.push(f);
    }
    
    if (validFiles.length > 0) {
      const newAttachments = validFiles.map(f => ({
        name: f.name,
        size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
        type: f.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name) ? "image" : "document",
        url: URL.createObjectURL(f),
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeAttachment(index: number) {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }

  function goNext() {
    if (currentStep === 1 && (!name || !address || !mobile)) return;
    // Step 2 is attachments — always optional, can skip
    if (currentStep === 3 && problemDescription.length < 10) return;
    if (currentStep === 4 && !selectedStateId) return;

    if (currentStep === 4) {
      setIsGenerating(true);
      setLoadingText("fetching basic details...");
      
      setTimeout(() => setLoadingText("loading optimal template..."), 1500);
      setTimeout(() => setLoadingText("preparing final draft..."), 3000);
      
      setTimeout(() => {
        const isBpl = useDocumentStore.getState().isBPLVerified();
        const profile = { 
          name: name || savedFullName || "[Your Name]", 
          address: address || savedAddress || "[Your Address]", 
          mobile: mobile || savedMobile || "[Your Mobile Number]" 
        };
        const newDraft = generateMockDraft(problemDescription, selectedStateId, isBpl, profile);
        setDraft(newDraft);
        trackDraftGenerated(selectedStateId, "General");
        
        setIsGenerating(false);
        const next = currentStep + 1;
        setCurrentStep(next);
        trackWizardStep(next);
      }, 5000);
      return; // Do not proceed to next step immediately
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

  function handleTopBack() {
    if (currentStep === 1 || currentStep === 6) {
      resetWizard();
      navigate('/home');
    } else {
      goBack();
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
      <div className="flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-2xl p-4 sm:p-8">
          <button 
            onClick={handleTopBack} 
            className="inline-flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-gray-900 mb-6 transition-all bg-white/95 border-2 border-gray-300 px-3 py-1.5 rounded-full shadow-md"
          >
            <ArrowLeft size={16} /> {currentStep === 1 || currentStep === 6 ? tc("home", "Home") : tc("back", "Back")}
          </button>
          {lastSynced && (
            <div className="mb-8 bg-white/95 border-2 border-gray-300 rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between text-sm font-bold text-gray-700 mb-2">
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
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("verifyTitle", "Identity Verification Required")}</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {t("verifyDesc", "To legally file a Right to Information (RTI) request, you must first sync your official documents (like Aadhaar/PAN) to verify your identity.")}
                </p>
                <Link to="/documents" className="btn-primary inline-flex">
                  {t("goVault", "Go to Document Vault")} <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            ) : currentStep === 1 ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t("detailsTitle", "Your Details")}
                    </label>
                    {savedFullName && (
                      <button onClick={handleImport} className="text-xs text-blue-600 font-semibold hover:underline">
                        {t("autoFill", "Auto-fill from saved profile")}
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {t("detailsDesc", "This information is required by the RTI Act and will be automatically added to your draft.")}
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-5 flex items-start gap-2">
                    <ShieldCheck size={16} className="text-green-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-green-800 font-medium leading-tight">
                      <strong>{t("privateTitle", "100% Private & Secure:")}</strong> {t("privateDesc", "Your details are stored strictly locally on your device. We do not track, collect, or upload your personal information to any server.")}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder={t("fullName", "Full Name")} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" 
                      />
                    </div>
                    <div>
                      <textarea 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        placeholder={t("address", "Complete Postal Address")} 
                        className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none" 
                      />
                    </div>
                    <div>
                      <input 
                        type="tel" 
                        value={mobile} 
                        onChange={(e) => setMobile(e.target.value)} 
                        placeholder={t("mobile", "Mobile Number")} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" 
                      />
                    </div>
                  </div>
                  
                  {name && address && mobile && (
                    <button onClick={handleSaveProfile} className="mt-4 text-xs font-semibold text-green-600 hover:underline">
                      {t("saveDetails", "Save details for next time")}
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
                <div className="mb-2">
                  <h2 className="text-sm font-semibold text-gray-700 mb-1">{t("attachTitle", "Attach Supporting Documents")}</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {t("attachDesc1", "Please upload your documents")} <strong>{t("attachDesc2", "one by one")}</strong> {t("attachDesc3", "(photos, screenshots, receipts, or PDFs).")} <span className="font-medium text-gray-700">{t("attachDesc4", "This step is optional.")}</span>
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-green-400 hover:bg-green-50/50 transition-colors group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gray-100 group-hover:bg-green-100 rounded-full flex items-center justify-center transition-colors">
                      <Upload size={22} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-gray-600 group-hover:text-green-700">{t("clickUpload", "Click to upload a file")}</p>
                    <p className="text-xs text-gray-400">{t("uploadTypes", "Images, PDFs, Word documents")}</p>
                  </button>
                  
                  {fileError && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertOctagon size={16} className="text-red-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-red-800 font-medium leading-tight">
                        {fileError}
                      </p>
                    </div>
                  )}
                </div>

                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${file.type === "image" ? "bg-blue-100" : "bg-orange-100"}`}>
                          {file.type === "image"
                            ? <ImageIcon size={16} className="text-blue-600" />
                            : <FileText size={16} className="text-orange-600" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                        {file.type === "image" && (
                          <img src={file.url} alt={file.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                        )}
                        <button onClick={() => removeAttachment(i)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={goBack} className="btn-secondary flex-1">
                    <ArrowLeft size={16} /> {tc("back", "Back")}
                  </button>
                  <button onClick={goNext} className="btn-primary flex-1">
                    {attachments.length > 0 ? `${t("continueWith", "Continue with")} ${attachments.length} ${attachments.length > 1 ? t("filesWord", "files") : t("fileWord", "file")}` : t("skipForNow", "Skip for now")}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </>
            ) : currentStep === 3 ? (
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
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none mb-2"
                />
                
                {["why is", "why hasn't", "when will", "take action", "punish", "complaint against", "resolve my", "action against", "your opinion"].some(kw => problemDescription.toLowerCase().includes(kw)) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <AlertOctagon size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 font-medium leading-tight">
                      <strong>{t("wait", "Wait!")}</strong> {t("waitDesc1", "This request might not be valid under the RTI Act. RTIs can only ask for existing records, not opinions, future plans, or direct action. Please review the")} <Link to="/about" className="underline font-bold text-blue-600 hover:text-blue-800">{t("knowRti", "KNOW YOUR RTI")}</Link> {t("waitDesc2", "rules first.")}
                    </p>
                  </div>
                )}
                <div className="mb-6"></div>
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
            ) : currentStep === 4 ? (
              isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[300px]">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{t("pleaseWait", "Please wait")}</h2>
                  <p className="text-sm font-medium text-green-600 animate-pulse">{loadingText}</p>
                </div>
              ) : (
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
              )
            ) : currentStep === 5 && draft ? (
              <>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-xl font-bold text-gray-900">{t("step3Title", "Your RTI Draft is Ready")}</h1>
                  <select 
                    onChange={(e) => setDraft(translateDraft(draft, e.target.value))}
                    className="text-xs bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-600 shadow-sm focus:ring-1 focus:ring-green-500"
                  >
                    <option value="en">{t("englishDef", "English (Default)")}</option>
                    <option value="hi">{t("transHi", "Translate to Hindi")}</option>
                    <option value="bn">{t("transBn", "Translate to Bengali")}</option>
                    <option value="ta">{t("transTa", "Translate to Tamil")}</option>
                  </select>
                </div>
                <p className="text-sm text-gray-500 mb-6">{t("step3Desc", "Copy this draft and paste it on the official portal.")}</p>
                <div id="print-section" className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="hidden print:block border-2 border-dashed border-gray-400 p-4 mb-6 text-center text-sm font-semibold text-gray-500">
                    [ Staple ₹10 Postal Order Here ]
                  </div>
                  <p className="font-semibold text-gray-900 mb-4">{draft.subject}</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{draft.body}</p>
                  
                  {attachments.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="font-semibold text-gray-900 mb-2">Enclosures ({attachments.length}):</p>
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {attachments.map((file, i) => (
                          <li key={i}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={goBack} className="btn-secondary flex-1">
                    <ArrowLeft size={16} />
                    {tc("back", "Back")}
                  </button>
                  <button onClick={() => window.print()} className="btn-secondary flex-1">
                    {t("printPdf", "Print PDF")}
                  </button>
                  <button onClick={copyDraft} className="btn-primary flex-1">
                    <Copy size={16} />
                    {copied ? tc("copied", "Copied!") : tc("copy", "Copy")}
                  </button>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4">
                    <div className="flex flex-col pr-4">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        {isPublicApp ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} className="text-gray-400" />}
                        {t("publishTitle", "Publish to Public Archive")}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {t("publishDesc", "Make this RTI publicly accessible to help others facing similar issues.")}
                      </p>
                    </div>
                    <button
                      onClick={handleToggleClick}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isPublicApp ? 'bg-green-600' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublicApp ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>

                  <div className="flex justify-center">
                    <button onClick={handleSubmitRTI} className="btn-primary w-full flex justify-center items-center gap-2 mt-2">
                      {t("submitRti", "Submit RTI")} <CheckCircle2 size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : currentStep === 6 ? (
              <div className="text-center py-6 px-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("completeTitle", "Filing Complete!")}</h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {t("expDesc", "How was your experience using our platform to draft and file your RTI?")}
                </p>
                
                <div className="max-w-xs mx-auto mb-6">
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => setRating(star)}
                        className={`transition-colors ${rating >= star ? 'text-amber-400' : 'text-gray-300 hover:text-amber-400 focus:text-amber-400'}`}
                      >
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <textarea 
                    placeholder={t("expPlaceholder", "Short description of your experience...")} 
                    className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none mb-4"
                  />
                  <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg text-left mb-6 font-medium">
                    <strong className="block mb-1">{t("tipTitle", "Tip: Public Archive")}</strong>
                    {t("tipDesc", "You can toggle your RTI public or private at any time from your tracking dashboard to help others.")}
                  </div>
                  <Link to="/home" onClick={() => resetWizard()} className="btn-primary w-full">
                    {t("submitHome", "Submit Survey & Go Home")}
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={20} className="text-green-400" />
          <span className="text-sm font-medium">{t("savedLater", "Details saved for later!")}</span>
        </div>
      )}

      <PublicConsentModal 
        isOpen={showConsent} 
        onClose={() => setShowConsent(false)} 
        onConfirm={() => setIsPublicApp(true)} 
      />
    </ProtectedRoute>
  );
}
