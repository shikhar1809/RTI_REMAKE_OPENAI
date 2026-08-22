import { useTranslation } from "react-i18next";
import { BookOpen, Users, FileSearch, Clock, HelpCircle, ArrowRight, ArrowLeft, Scale } from "lucide-react";
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
      <div className="min-h-screen bg-white">
        <div className="bg-green-600 text-white relative">
          <Link to="/home" className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Home
          </Link>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="flex items-center gap-3 mb-4 opacity-80">
              <Scale size={20} />
              <span className="text-sm font-medium">Right to Information Act, 2005</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {t("heroTitle", "Demanding accountability")}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl leading-relaxed">
              {t("heroSubtitle", "The RTI Act empowers you to seek answers.")}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {facts.map((fact) => (
              <div key={fact.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${fact.bg}`}>
                  <fact.icon size={24} className={fact.color} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{fact.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{fact.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <BookOpen className="text-green-600" />
              {t("processTitle", "The Process")}
            </h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {["Draft", "File", "Wait", "Appeal"].map((step, idx) => (
                <div key={step} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-100 text-green-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-sm font-bold">{idx + 1}</span>
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-1">{step}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to exercise your right?
          </h2>
          <p className="text-gray-600 mb-6">
            It takes less than 3 minutes to draft and route your RTI request.
          </p>
          <Link to="/file" className="btn-primary px-8 py-3.5 text-base inline-flex">
            {tc("fileRTI", "File RTI")}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
