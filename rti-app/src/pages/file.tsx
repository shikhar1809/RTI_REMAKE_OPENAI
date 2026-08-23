import { Paperclip, X, ImageIcon, FileText, Upload, CheckCircle2, ShieldCheck, AlertOctagon, Eye, EyeOff, Search, FileSignature, Wallet, Check, CreditCard, Landmark, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft, Copy, ExternalLink } from "lucide-react";
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

const TOTAL_STEPS = 10;

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

  const { lastSynced, isBPLVerified } = useDocumentStore();
  const { savedFullName, savedAddress, savedMobile, saveProfileDetails } = useAuthStore();
  const { addApplication } = useApplicationsStore();

  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [autoFillToast, setAutoFillToast] = useState(false);
  const [rating, setRating] = useState(0);
  const [attachments, setAttachments] = useState<{ name: string; size: string; type: string; url: string }[]>([]);
  const [isPublicApp, setIsPublicApp] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileError, setFileError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [loadingText, setLoadingText] = useState("fetching basic details...");

  const isBpl = isBPLVerified();

  useEffect(() => {
    if (currentStep === 10) {
      resetWizard();
    }
  }, []);

  useEffect(() => {
    if (currentStep === 1 && !name && !address && !mobile && savedFullName) {
      setName(savedFullName);
      setAddress(savedAddress);
      setMobile(savedMobile);
      setAutoFillToast(true);
      setTimeout(() => setAutoFillToast(false), 3000);
    }
  }, [currentStep, name, address, mobile, savedFullName, savedAddress, savedMobile, setName, setAddress, setMobile]);

  function handleImport() {
    setName(savedFullName);
    setAddress(savedAddress);
    setMobile(savedMobile);
    setAutoFillToast(true);
    setTimeout(() => setAutoFillToast(false), 3000);
  }

  function handleSaveProfile() {
    saveProfileDetails(name, address, mobile);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError("");
    const files = Array.from(e.target.files || []);
    
    const validFiles = [];
    for (const f of files) {
      const isImage = f.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name);
      const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
      const isWord = f.type === "application/msword" || 
                     f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
                     /\.(doc|docx)$/i.test(f.name);
                     
      if (!isImage && !isPdf && !isWord) {
        setFileError(`Invalid file type: ${f.name}. Please upload only Images, PDFs, or Word documents.`);
        continue;
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
    if (currentStep === 3 && problemDescription.length < 10) return;
    if (currentStep === 4 && !selectedStateId) return;

    if (currentStep === 4) {
      // Step 4 -> 5: AI Department Routing
      setIsRouting(true);
      setTimeout(() => {
        setIsRouting(false);
        const next = 5;
        setCurrentStep(next);
        trackWizardStep(next);
      }, 2500);
      return;
    }

    if (currentStep === 6) {
      // Step 6 -> 7: AI Draft Generation
      setIsGenerating(true);
      setLoadingText("analyzing department format...");
      setTimeout(() => setLoadingText("loading optimal template..."), 1500);
      setTimeout(() => setLoadingText("preparing final legal draft..."), 3000);
      
      setTimeout(() => {
        const profile = { 
          name: name || savedFullName || "[Your Name]", 
          address: address || savedAddress || "[Your Address]", 
          mobile: mobile || savedMobile || "[Your Mobile Number]" 
        };
        const newDraft = generateMockDraft(problemDescription, selectedStateId, isBpl, profile);
        setDraft(newDraft);
        trackDraftGenerated(selectedStateId, "General");
        
        setIsGenerating(false);
        const next = 7;
        setCurrentStep(next);
        trackWizardStep(next);
      }, 5000);
      return;
    }

    if (currentStep === 7) {
      // Step 7 -> 8 (Payment) OR 9 (Submit if BPL)
      const next = isBpl ? 9 : 8;
      setCurrentStep(next);
      trackWizardStep(next);
      return;
    }

    const next = currentStep + 1;
    setCurrentStep(next);
    trackWizardStep(next);
  }

  function goBack() {
    if (currentStep > 1) {
      if (currentStep === 9 && isBpl) {
        // Skip back over payment if BPL
        setCurrentStep(7);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  }

  function handleTopBack() {
    if (currentStep === 1 || currentStep === 10) {
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

  const handleToggleClick = () => {
    if (isPublicApp) {
      setIsPublicApp(false);
    } else {
      setShowConsent(true);
    }
  };

  const handlePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      goNext(); // Go to step 9
    }, 2000);
  };

  const handleSubmitRTI = () => {
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
    
    setCurrentStep(10);
  };

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
            <ArrowLeft size={16} /> {currentStep === 1 || currentStep === 10 ? tc("home", "Home") : tc("back", "Back")}
          </button>
          
          {lastSynced && currentStep < 10 && (
            <div className="mb-8 bg-white/95 border-2 border-gray-300 rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between text-sm font-bold text-gray-700 mb-2">
                <span>
                  {tc("step", "Step")} {currentStep} {tc("of", "of")} {TOTAL_STEPS}
                </span>
                <span className="text-gray-400 text-xs truncate max-w-[150px]">
                  {currentStep === 1 && "Personal Details"}
                  {currentStep === 2 && "BPL Verification"}
                  {currentStep === 3 && "Problem Description"}
                  {currentStep === 4 && "Authority Level"}
                  {currentStep === 5 && "Department Routing"}
                  {currentStep === 6 && "Attachments"}
                  {currentStep === 7 && "Draft Review"}
                  {currentStep === 8 && "Payment Gateway"}
                  {currentStep === 9 && "Final Submission"}
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
              // Step 1: Personal Details
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
                      <strong>{t("privateTitle", "100% Private & Secure:")}</strong> {t("privateDesc", "Your details are stored strictly locally on your device.")}
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
                
                <button onClick={goNext} disabled={!name || !address || !mobile} className="btn-primary w-full">
                  {tc("next", "Next")} <ArrowRight size={16} />
                </button>
              </>
            ) : currentStep === 2 ? (
              // Step 2: BPL Verification
              <div className="text-center py-6 px-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isBpl ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  {isBpl ? <CheckCircle2 size={32} /> : <Landmark size={32} />}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">BPL Verification</h1>
                
                {isBpl ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 my-6 text-left text-sm text-green-800">
                    <p className="mb-2"><strong>Below Poverty Line (BPL) Confirmed</strong></p>
                    <p>We automatically verified your BPL status from your DigiLocker documents. You are completely exempt from the ₹10 RTI fee.</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 my-6 text-left text-sm text-gray-700">
                    <p className="mb-2"><strong>Standard Filing Required</strong></p>
                    <p>No valid BPL certificate was found in your Document Vault. The standard ₹10 RTI processing fee will apply at the end of this application.</p>
                  </div>
                )}

                <div className="flex gap-3 mt-8">
                  <button onClick={goBack} className="btn-secondary flex-1">
                    <ArrowLeft size={16} /> {tc("back", "Back")}
                  </button>
                  <button onClick={goNext} className="btn-primary flex-1">
                    {tc("next", "Next")} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : currentStep === 3 ? (
              // Step 3: Problem Description
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("step1Title", "What is your problem?")}
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    {t("step1Desc", "Describe the issue in your own words. We will handle the legal language.")}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Status of Ration Card", "Road repair details", "Pending FIR status", "Marksheet verification"].map(template => (
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
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none mb-4"
                />
                
                {["why is", "why hasn't", "when will", "punish", "complaint against"].some(kw => problemDescription.toLowerCase().includes(kw)) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <AlertOctagon size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 font-medium leading-tight">
                      <strong>{t("wait", "Wait!")}</strong> RTIs can only ask for existing records, not opinions, future plans, or direct action. Please keep it factual.
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button onClick={goBack} className="btn-secondary flex-1">
                    <ArrowLeft size={16} /> {tc("back", "Back")}
                  </button>
                  <button onClick={goNext} disabled={problemDescription.length < 10} className="btn-primary flex-1">
                    {tc("next", "Next")} <ArrowRight size={16} />
                  </button>
                </div>
              </>
            ) : currentStep === 4 ? (
              // Step 4: Authority Level
              <>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{t("step2Title", "Select the Authority Level")}</h1>
                <p className="text-sm text-gray-500 mb-6">Does your query relate to a State Government or the Central Government?</p>
                
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
                    <ArrowLeft size={16} /> {tc("back", "Back")}
                  </button>
                  <button onClick={goNext} disabled={!selectedStateId} className="btn-primary flex-1">
                    {tc("next", "Next")} <ArrowRight size={16} />
                  </button>
                </div>
              </>
            ) : currentStep === 5 ? (
              // Step 5: Department Routing (AI Loading)
              isRouting ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[300px]">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Routing Application...</h2>
                  <p className="text-sm font-medium text-blue-600 animate-pulse">Our AI is analyzing your problem to find the exact Ministry and Public Information Officer (PIO)...</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 mb-4">Public Authority Identified</h1>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left mb-6">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Target Authority</p>
                    <p className="text-md font-bold text-gray-900">{STATES[selectedStateId]?.name || "Government Authority"}</p>
                    <p className="text-sm text-gray-600 mt-2 border-t pt-2 border-gray-200">Based on your query regarding "{problemDescription.substring(0, 20)}...", we have routed this to the most appropriate Public Information Officer.</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button onClick={goBack} className="btn-secondary flex-1">
                      <ArrowLeft size={16} /> {tc("back", "Back")}
                    </button>
                    <button onClick={goNext} className="btn-primary flex-1">
                      {tc("next", "Next")} <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )
            ) : currentStep === 6 ? (
              // Step 6: Attachments
              <>
                <div className="mb-2">
                  <h2 className="text-sm font-semibold text-gray-700 mb-1">{t("attachTitle", "Attach Supporting Documents")}</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {t("attachDesc1", "Please upload your documents")} <strong>{t("attachDesc2", "one by one")}</strong> {t("attachDesc3", "(photos, screenshots, receipts, or PDFs).")} <span className="font-medium text-gray-700">{t("attachDesc4", "This step is optional.")}</span>
                  </p>

                  <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
                  
                  <button onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-green-400 hover:bg-green-50/50 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 bg-gray-100 group-hover:bg-green-100 rounded-full flex items-center justify-center transition-colors">
                      <Upload size={22} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-gray-600 group-hover:text-green-700">{t("clickUpload", "Click to upload a file")}</p>
                    <p className="text-xs text-gray-400">{t("uploadTypes", "Images, PDFs, Word documents")}</p>
                  </button>
                  
                  {fileError && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertOctagon size={16} className="text-red-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-red-800 font-medium leading-tight">{fileError}</p>
                    </div>
                  )}
                </div>

                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${file.type === "image" ? "bg-blue-100" : "bg-orange-100"}`}>
                          {file.type === "image" ? <ImageIcon size={16} className="text-blue-600" /> : <FileText size={16} className="text-orange-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                        {file.type === "image" && <img src={file.url} alt={file.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200" />}
                        <button onClick={() => removeAttachment(i)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0"><X size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={goBack} className="btn-secondary flex-1"><ArrowLeft size={16} /> {tc("back", "Back")}</button>
                  <button onClick={goNext} className="btn-primary flex-1">
                    {attachments.length > 0 ? `Continue (${attachments.length})` : "Skip for now"} <ArrowRight size={16} />
                  </button>
                </div>
              </>
            ) : currentStep === 7 ? (
              // Step 7: Draft Generation & Review
              isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[300px]">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Drafting Application</h2>
                  <p className="text-sm font-medium text-green-600 animate-pulse">{loadingText}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-xl font-bold text-gray-900">Your RTI Draft is Ready</h1>
                    <select 
                      onChange={(e) => setDraft(translateDraft(draft!, e.target.value))}
                      className="text-xs bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-600 shadow-sm focus:ring-1 focus:ring-green-500"
                    >
                      <option value="en">English (Default)</option>
                      <option value="hi">Translate to Hindi</option>
                      <option value="bn">Translate to Bengali</option>
                      <option value="ta">Translate to Tamil</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">Review the legally compliant draft generated for you.</p>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <p className="font-semibold text-gray-900 mb-4">{draft?.subject}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{draft?.body}</p>
                    {attachments.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">Enclosures ({attachments.length}):</p>
                        <ul className="list-disc pl-5 text-sm text-gray-700">
                          {attachments.map((file, i) => <li key={i}>{file.name}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={goBack} className="btn-secondary flex-1"><ArrowLeft size={16} /> {tc("back", "Back")}</button>
                    <button onClick={goNext} className="btn-primary flex-1">{tc("next", "Next")} <ArrowRight size={16} /></button>
                  </div>
                </>
              )
            ) : currentStep === 8 ? (
              // Step 8: Payment Gateway (Only if not BPL)
              <div className="py-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet size={32} />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Gateway</h1>
                  <p className="text-sm text-gray-500">Please pay the mandatory RTI fee to proceed.</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
                    <span className="text-sm text-gray-600">RTI Application Fee</span>
                    <span className="font-bold text-gray-900">₹10.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Amount</span>
                    <span className="text-xl font-bold text-green-600">₹10.00</span>
                  </div>
                </div>

                {isPaying ? (
                  <div className="flex justify-center items-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-3 font-medium text-gray-600">Processing Payment...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button onClick={handlePayment} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <CreditCard className="text-blue-600" size={24} />
                        <span className="font-medium text-gray-800">Pay via UPI</span>
                      </div>
                      <ArrowRight size={16} className="text-gray-400" />
                    </button>
                    <button onClick={handlePayment} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Globe className="text-blue-600" size={24} />
                        <span className="font-medium text-gray-800">Net Banking / Debit Card</span>
                      </div>
                      <ArrowRight size={16} className="text-gray-400" />
                    </button>
                    <button onClick={goBack} className="btn-secondary w-full mt-4"><ArrowLeft size={16} /> {tc("back", "Back")}</button>
                  </div>
                )}
              </div>
            ) : currentStep === 9 ? (
              // Step 9: Final Submission & Archive
              <div className="py-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Final Review & Submit</h1>
                <p className="text-sm text-gray-500 mb-6">You are about to legally submit this RTI application.</p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <FileSignature size={24} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Application Ready</p>
                      <p className="text-xs text-gray-500">Your draft and {attachments.length} attachments are packaged.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 size={24} className="text-green-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Fee {isBpl ? 'Waived (BPL)' : 'Paid'}</p>
                      <p className="text-xs text-gray-500">All required payments are settled.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl mb-8">
                  <div className="flex flex-col pr-4">
                    <h3 className="font-bold text-blue-900 flex items-center gap-2">
                      {isPublicApp ? <Eye size={18} className="text-blue-600" /> : <EyeOff size={18} className="text-blue-400" />}
                      Publish to Public Archive
                    </h3>
                    <p className="text-xs text-blue-700 mt-1">Make this RTI publicly accessible to help others facing similar issues.</p>
                  </div>
                  <button
                    onClick={handleToggleClick}
                    className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isPublicApp ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublicApp ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex gap-3">
                  <button onClick={goBack} className="btn-secondary flex-1"><ArrowLeft size={16} /> {tc("back", "Back")}</button>
                  <button onClick={handleSubmitRTI} className="btn-primary flex-1 flex justify-center items-center gap-2">
                    {t("submitRti", "Submit RTI")} <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            ) : currentStep === 10 ? (
              // Step 10: Complete
              <div className="text-center py-6 px-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("completeTitle", "Filing Complete!")}</h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">{t("expDesc", "How was your experience using our platform to draft and file your RTI?")}</p>
                
                <div className="max-w-xs mx-auto mb-6">
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => setRating(star)}
                        className={`transition-colors ${rating >= star ? 'text-amber-400' : 'text-gray-300 hover:text-amber-400 focus:text-amber-400'}`}
                      >
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
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
      
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={20} className="text-green-400" />
          <span className="text-sm font-medium">{t("savedLater", "Details saved for later!")}</span>
        </div>
      )}

      {autoFillToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <ShieldCheck size={20} className="text-green-200 shrink-0" />
          <span className="text-sm font-medium">Details auto-filled from your saved profile!</span>
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
