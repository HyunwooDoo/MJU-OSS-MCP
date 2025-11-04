"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Simple messages object for now - can be expanded
const messages: Record<string, { translation: Record<string, string> }> = {};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "ko",
    fallbackLng: "ko",
    debug: false,
    resources: messages,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
