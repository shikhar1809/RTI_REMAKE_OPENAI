import { useTranslation } from "react-i18next";
import { BookOpen, Users, FileSearch, Clock, HelpCircle, ArrowRight, ArrowLeft, Scale, AlertOctagon, CheckCircle, BellRing } from "lucide-react";
import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AboutPage() {
  const { t } = useTranslation(undefined, { keyPrefix: "about" });
  const { t: tc } = useTranslation(undefined, { keyPrefix: "common" });

  const facts = [
    {
      icon: Users,
      title: t("whoCanFile", "Who can file?"),
      desc: t("whoCanFileDesc", "Any Indian citizen."),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: FileSearch,
      title: t("whatToAsk", "What to ask?"),
      desc: t("whatToAskDesc", "Any official documents."),
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Clock,
      title: t("howLong", "How long?"),
      desc: t("howLongDesc", "30 days limit."),
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: HelpCircle,
      title: t("whatIfNo", "No reply?"),
      desc: t("whatIfNoDesc", "File a first appeal."),
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center py-8 px-4 min-h-[calc(100vh-4rem)] w-full">
        <div className="w-full max-w-4xl overflow-hidden">
          <div className="bg-green-600 rounded-3xl text-white relative text-center shadow-lg border border-green-700/50">
            <Link to="/home" className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors">
              <ArrowLeft size={16} /> Home
            </Link>
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-4 opacity-80">
                <Scale size={24} />
                <span className="text-base font-semibold">Right to Information Act, 2005</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {t("heroTitle", "Know Your RTI Rules")}
              </h1>
              <p className="text-base md:text-lg opacity-90 max-w-xl leading-relaxed">
                {t("heroSubtitle", "Empowering citizens to seek answers, simply and effectively.")}
              </p>
            </div>
          </div>

          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <div className="grid sm:grid-cols-4 gap-4 mb-16">
            {facts.map((fact) => (
              <div key={fact.title} className="card flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${fact.bg}`}>
                  <fact.icon size={24} className={fact.color} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{fact.title}</h3>
                  <p className="text-gray-600 text-sm">{fact.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-16 max-w-3xl mx-auto text-left">
            
            {/* Recent Updates */}
            <div className="bg-white/95 border-2 border-blue-300 shadow-md rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2 justify-center">
                <BellRing className="text-blue-600" />
                {t("recentChangesTitle", "Recent Changes & Updates on Rules")}
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm text-center shrink-0 h-min">
                    <span className="block text-xs font-bold text-blue-400 uppercase">{t("aug", "Aug")}</span>
                    <span className="block text-lg font-black text-blue-900">{t("augYear", "2026")}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 mb-1">{t("update1Title", "Online Appeal System Upgraded")}</h3>
                    <p className="text-blue-800 text-sm">{t("update1Desc", "The central portal has integrated a new seamless appeal process for requests that have crossed the 30-day limit without a response.")}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm text-center shrink-0 h-min">
                    <span className="block text-xs font-bold text-blue-400 uppercase">{t("jun", "Jun")}</span>
                    <span className="block text-lg font-black text-blue-900">{t("junYear", "2026")}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 mb-1">{t("update2Title", "BPL Exemption Automation")}</h3>
                    <p className="text-blue-800 text-sm">{t("update2Desc", "Citizens with verified BPL (Below Poverty Line) status can now bypass the fee payment gateway automatically via their synced documents.")}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm text-center shrink-0 h-min">
                    <span className="block text-xs font-bold text-blue-400 uppercase">{t("mar", "Mar")}</span>
                    <span className="block text-lg font-black text-blue-900">{t("marYear", "2026")}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 mb-1">{t("update3Title", "State-specific Language Support")}</h3>
                    <p className="text-blue-800 text-sm">{t("update3Desc", "You can now draft your RTI in English and translate it automatically to regional languages like Hindi, Bengali, or Tamil directly in the final step.")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Rules */}
            <div className="bg-white/95 border-2 border-green-300 shadow-md rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2 justify-center">
                <CheckCircle className="text-green-600" />
                {t("clearRulesTitle", "Clear Rules & Examples")}
              </h2>
              <p className="text-green-800 text-center mb-6">
                {t("clearRulesDesc", "When filing an RTI, keep your questions specific and related to existing records.")}
              </p>
              <ul className="space-y-4 text-green-900">
                <li className="flex gap-3">
                  <span className="font-bold shrink-0">{t("rule1", "Rule 1:")}</span>
                  <span>{t("rule1Desc", "Ask for records, not opinions.")} <br/><span className="text-sm opacity-80">{t("rule1Ex", "Example: \"Provide a copy of the road repair budget\" (Good) vs \"Why is the road so bad?\" (Bad)")}</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold shrink-0">{t("rule2", "Rule 2:")}</span>
                  <span>{t("rule2Desc", "Be specific with dates and details.")} <br/><span className="text-sm opacity-80">{t("rule2Ex", "Example: \"Ration card applications received in Jan 2024\" (Good) vs \"All ration card applications\" (Bad)")}</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold shrink-0">{t("rule3", "Rule 3:")}</span>
                  <span>{t("rule3Desc", "Use simple language.")} <br/><span className="text-sm opacity-80">{t("rule3Ex", "Keep it straightforward. You don't need complex legal jargon.")}</span></span>
                </li>
              </ul>
            </div>

            {/* When RTI CANNOT be filed */}
            <div className="bg-white/95 border-2 border-red-300 shadow-md rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2 justify-center">
                <AlertOctagon className="text-red-600" />
                {t("cannotFileTitle", "When an RTI CANNOT be filed")}
              </h2>
              <p className="text-red-800 text-center mb-6">
                {t("cannotFileDesc", "The RTI Act exempts certain types of information from being disclosed.")}
              </p>
              <ul className="space-y-4 text-red-900">
                <li className="flex gap-3 items-start">
                  <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-red-500"></span>
                  <span><strong>{t("cannot1Title", "Private Companies:")}</strong>{t("cannot1Desc", " You cannot file an RTI against private bodies like private schools, hospitals, or corporate companies (unless they are substantially funded by the government).")}</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-red-500"></span>
                  <span><strong>{t("cannot2Title", "National Security:")}</strong>{t("cannot2Desc", " Information that would affect the sovereignty, integrity, or security of India.")}</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-red-500"></span>
                  <span><strong>{t("cannot3Title", "Personal Information:")}</strong>{t("cannot3Desc", " Details of other citizens that have no relationship to any public activity or interest (invasion of privacy).")}</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-red-500"></span>
                  <span><strong>{t("cannot4Title", "Future Plans:")}</strong>{t("cannot4Desc", " You cannot ask questions like \"When will the road be built?\". You can only ask for records of decisions already made.")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
