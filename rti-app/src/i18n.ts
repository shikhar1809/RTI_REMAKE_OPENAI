import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "hi", "bn", "ta"],
    debug: false,
    interpolation: {
      escapeValue: false, // React already safe from xss
    },
    backend: {
      loadPath: "/locales/{{lng}}.json",
    },
  });

export default i18n;
