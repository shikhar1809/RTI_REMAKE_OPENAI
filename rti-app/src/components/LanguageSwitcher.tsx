import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { trackLanguageSwitched } from "@/lib/analytics";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "bn", label: "বাংলা" },
  { code: "ta", label: "தமிழ்" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  
  const locale = i18n.language || "en";
  const currentLang = LOCALES.find((l) => l.code === locale) || LOCALES[0];

  function switchLocale(newLocale: string) {
    if (newLocale === locale) return;
    trackLanguageSwitched(locale, newLocale);
    i18n.changeLanguage(newLocale);
    setOpen(false);
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors"
        >
          <Globe size={16} className="text-gray-500" />
          <span className="font-medium">{currentLang.label}</span>
        </button>
        
        {open && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg py-1">
            {LOCALES.map((loc) => (
              <button
                key={loc.code}
                onClick={() => switchLocale(loc.code)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  loc.code === locale
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
