import { useNavigate } from "react-router-dom";
import { useAuthStore, getPostLoginRoute } from "@/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BookOpen, Clock, IndianRupee, FileText, Scale, Check, ArrowRight } from "lucide-react";
import { FcIdea } from "react-icons/fc";

const RIGHTS_CARDS = [
  {
    icon: Scale,
    color: "text-green-600",
    bg: "bg-green-50",
    title: "What is RTI?",
    body: "The Right to Information Act, 2005 gives every Indian citizen the legal power to ask any government body for information. They MUST respond.",
  },
  {
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "What can you ask for?",
    body: "Documents, files, emails, records, minutes of meetings, spending data, inspection reports, any information held by a public authority.",
  },
  {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    title: "30-day rule",
    body: "The government must respond within 30 days. For matters involving life or liberty, the limit is just 48 hours.",
  },
  {
    icon: IndianRupee,
    color: "text-purple-600",
    bg: "bg-purple-50",
    title: "Filing fee",
    body: "₹10 for most states. ₹0 for BPL (Below Poverty Line) cardholders. Some states charge ₹50 — we'll tell you the exact amount.",
  },
  {
    icon: FcIdea,
    color: "text-rose-600",
    bg: "bg-rose-50",
    title: "If they don't reply?",
    body: "File a First Appeal to the same department. If that fails, escalate to the Information Commission. Penalties apply to non-compliant officers.",
  },
];

export default function OnboardingRightsPage() {
  const navigate = useNavigate();
  const { completeRightsStep } = useAuthStore();

  function handleContinue() {
    completeRightsStep();
    navigate(getPostLoginRoute(useAuthStore.getState()), { replace: true });
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start px-4 py-10">
        {/* PROGRESS BAR */}
        <div className="flex gap-2 mb-8">
          {["Login", "Location", "Rights", "Home"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                  i === 2
                    ? "bg-purple-600 border-purple-600 text-white"
                    : i < 2
                    ? "bg-purple-100 border-purple-300 text-purple-700"
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {i < 2 ? <Check size={14} /> : i + 1}
              </div>
              {i < 3 && <div className={`w-6 h-px ${i < 2 ? "bg-purple-300" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
              <FcIdea size={48} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Know your rights</h1>
            <p className="text-gray-500 text-sm">
              Before you file — here's what you need to know about the RTI Act.
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {RIGHTS_CARDS.map(({ icon: Icon, color, bg, title, body }, i) => (
              <div
                key={title}
                className="card flex items-start gap-4 hover:shadow-md transition-shadow"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-600 text-white rounded-xl p-5 mb-6">
            <p className="text-sm font-medium leading-relaxed text-center">
              "You can ask any government body for any document — and they must provide it, or give a lawful reason why not."
            </p>
          </div>

          <button onClick={handleContinue} className="btn-primary w-full py-3.5 text-base">
            I understand my rights — Get Started
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
