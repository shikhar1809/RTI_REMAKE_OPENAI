import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ArrowRight, Check } from "lucide-react";
import { FcGlobe } from "react-icons/fc";
import { STATE_LIST } from "@/data/states";

const ALL_STATES = [
  { id: "central", name: "Central Government (Ministries/PSUs)" },
  { id: "up", name: "Uttar Pradesh" },
  { id: "kerala", name: "Kerala" },
  { id: "hp", name: "Himachal Pradesh" },
  { id: "rajasthan", name: "Rajasthan" },
  { id: "jk", name: "Jammu & Kashmir" },
  { id: "other", name: "Other State / UT" },
];

export default function OnboardingLocationPage() {
  const navigate = useNavigate();
  const { completeLocationStep } = useAuthStore();
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");

  const filtered = ALL_STATES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleContinue() {
    if (!selected) return;
    completeLocationStep(selected);
    navigate("/onboarding/rights", { replace: true });
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start px-4 py-10">
        <div className="flex gap-2 mb-8">
          {["Login", "Location", "Rights", "Home"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                  i === 1
                    ? "bg-blue-500 border-blue-500 text-white"
                    : i < 1
                    ? "bg-blue-100 border-blue-300 text-blue-700"
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {i < 1 ? <Check size={14} /> : i + 1}
              </div>
              {i < 3 && <div className={`w-6 h-px ${i < 1 ? "bg-blue-300" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
              <FcGlobe size={48} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Where are you located?</h1>
            <p className="text-gray-500 text-sm">
              We use this to route your RTI to the correct authority and show you
              the right filing fee.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search your state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3 transition"
          />

          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {filtered.map((state) => (
              <button
                key={state.id}
                onClick={() => setSelected(state.id)}
                className={`text-left px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                  selected === state.id
                    ? "border-green-500 bg-green-50 text-green-800"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {selected === state.id && (
                  <Check size={12} className="inline mr-1 text-green-600" />
                )}
                {state.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={!selected}
            className="btn-primary w-full mt-5 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
