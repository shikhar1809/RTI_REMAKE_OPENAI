import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertTriangle, Copy, Check } from "lucide-react";
import { analyzeReply } from "@/data/mockReplies";
import { useRTIStore } from "@/store/rtiStore";
import { trackReplyAnalyzed, trackAppealGenerated } from "@/lib/analytics";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CheckReplyPage() {
  const { t } = useTranslation(undefined, { keyPrefix: "checkReply" });
  const { t: tc } = useTranslation(undefined, { keyPrefix: "common" });

  const { replyText, setReplyText, replyAnalysis, setReplyAnalysis, draft } = useRTIStore();
  const [step, setStep] = useState<"input" | "result">("input");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleAnalyze() {
    if (!replyText.trim() || replyText.length < 20) return;
    
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1500));
    
    const result = analyzeReply(replyText);
    setReplyAnalysis(result);
    trackReplyAnalyzed(result.score, result.verdict);
    
    if (result.verdict === "weak" && draft) {
      trackAppealGenerated(result.score);
    }
    
    setIsAnalyzing(false);
    setStep("result");
  }

  async function copyAppeal() {
    if (!replyAnalysis) return;
    await navigator.clipboard.writeText(`${replyAnalysis.appealSubject}\n\n${replyAnalysis.appealBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/home" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft size={16} /> Home
          </Link>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{t("pageTitle", "Check Government Reply")}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {t("pageDesc", "Paste the reply you received to check if it's satisfactory or if you should file an appeal.")}
            </p>
          </div>

          {step === "input" ? (
            <div className="card shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("pasteLabel", "Paste the official reply here:")}
              </label>
              <textarea
                ref={textareaRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t("placeholder", "E.g. With reference to your RTI application... the information is denied under section 8(1)(j)...")}
                className="w-full h-64 p-4 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-6"
              />
              <button
                onClick={handleAnalyze}
                disabled={replyText.length < 20 || isAnalyzing}
                className="btn-primary w-full py-3 bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600"
              >
                {isAnalyzing ? (
                  <><Loader2 size={16} className="animate-spin" /> {t("analyzing", "Analyzing...")}</>
                ) : (
                  <>{t("analyzeBtn", "Analyze Reply")} <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          ) : replyAnalysis && (
            <div className="space-y-6">
              <div className="card shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <ScoreRing score={replyAnalysis.score} />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {t(`verdicts.${replyAnalysis.verdict}Title`, "Reply Quality")}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {t(`verdicts.${replyAnalysis.verdict}Desc`, "We've analyzed the response.")}
                  </p>
                </div>
              </div>

              {replyAnalysis.issues.length > 0 && (
                <div className="card border-amber-200 bg-amber-50">
                  <h3 className="font-semibold text-amber-900 flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} />
                    {t("issuesFound", "Issues Found")}
                  </h3>
                  <ul className="space-y-2">
                    {replyAnalysis.issues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                        <span className="mt-1 flex-shrink-0">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {replyAnalysis.verdict === "weak" && replyAnalysis.appealBody ? (
                <div className="card border-blue-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 mb-1">{t("appealReady", "First Appeal Draft Ready")}</h3>
                    <p className="text-sm text-gray-500">{t("appealDesc", "Based on their reply, we've drafted a legal appeal for you.")}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-gray-900 mb-2">{replyAnalysis.appealSubject}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{replyAnalysis.appealBody}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep("input")} className="btn-secondary flex-1">
                      <ArrowLeft size={16} />
                      {tc("back", "Back")}
                    </button>
                    <button onClick={copyAppeal} className="btn-primary flex-1 bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600">
                      {copied ? <><Check size={16} /> {tc("copied", "Copied")}</> : <><Copy size={16} /> {t("copyAppeal", "Copy Appeal")}</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => setStep("input")} className="btn-secondary">
                    <ArrowLeft size={15} />
                    Check another reply
                  </button>
                  {replyAnalysis.verdict === "strong" && (
                    <button className="btn-primary text-sm">
                      <CheckCircle2 size={15} />
                      {t("markResolved", "Mark as Resolved")}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 60 ? "#16a34a" : score >= 35 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex-shrink-0">
      <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <div className="text-center -mt-16 text-2xl font-bold" style={{ color }}>
        {score}
      </div>
      <div className="text-center text-xs text-gray-400 mt-6">/ 100</div>
    </div>
  );
}
