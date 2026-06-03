import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import ur from "../locales/ur.json";

const savedLanguage = localStorage.getItem("bukhari-lang") ?? "en";

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ur: { translation: ur }
  },
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

document.documentElement.lang = savedLanguage;
document.documentElement.dir = savedLanguage === "ur" ? "rtl" : "ltr";

export default i18n;
