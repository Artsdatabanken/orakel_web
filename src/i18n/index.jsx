import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../locales/en.json";
import es from "../locales/es.json";
import nb from "../locales/nb.json";
import nl from "../locales/nl.json";
import nn from "../locales/nn.json";
import sv from "../locales/sv.json";
import webExtras from "../locales/web.json";

const CATALOGS = {
  en: { ...en, ...(webExtras.en ?? {}) },
  es: { ...es, ...(webExtras.es ?? {}) },
  nb: { ...nb, ...(webExtras.nb ?? {}) },
  nl: { ...nl, ...(webExtras.nl ?? {}) },
  nn: { ...nn, ...(webExtras.nn ?? {}) },
  sv: { ...sv, ...(webExtras.sv ?? {}) },
};
// Fallback used when a key is missing in the active catalog AND when
// "system" resolves to a language we don't ship. English is the
// international convention here — falling back to Norwegian would
// surprise non-Norwegian users.
const DEFAULT_LANG = "en";
const STORAGE_KEY = "selectedLanguage";

export const SUPPORTED_LANGUAGES = [
  { code: "system", labelKey: "system_default" },
  { code: "nb", labelKey: "language_norwegian_bokmaal" },
  { code: "nn", labelKey: "language_norwegian_nynorsk" },
  { code: "en", labelKey: "language_english" },
  { code: "nl", labelKey: "language_dutch" },
  { code: "es", labelKey: "language_spanish" },
  { code: "sv", labelKey: "language_swedish" },
];

function resolveLanguage(selection) {
  if (selection === "system") {
    const nav = (navigator.language || DEFAULT_LANG).slice(0, 2).toLowerCase();
    return CATALOGS[nav] ? nav : DEFAULT_LANG;
  }
  return CATALOGS[selection] ? selection : DEFAULT_LANG;
}

const LanguageContext = createContext(null);

function readStoredLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredLanguage(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* ignore — storage unavailable (SSR, jsdom, etc.) */
  }
}

export function LanguageProvider({ children }) {
  const [selection, setSelection] = useState(() => readStoredLanguage() || "system");

  useEffect(() => {
    writeStoredLanguage(selection);
  }, [selection]);

  const activeCode = useMemo(() => resolveLanguage(selection), [selection]);
  const catalog = CATALOGS[activeCode];

  const t = useMemo(() => {
    return function translate(key, params) {
      let value = catalog[key];
      if (value == null) value = CATALOGS[DEFAULT_LANG][key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          // Android-style positional format ("%1$s", "%1$d") and
          // brace placeholders ("{percent}"). %% → literal %.
          value = value.replace(new RegExp(`%${k}\\$[sd]`, "g"), String(v));
          value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      value = value.replace(/%%/g, "%");
      return value;
    };
  }, [catalog]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", activeCode);
  }, [activeCode]);

  const value = useMemo(
    () => ({ t, selection, activeCode, setLanguage: setSelection }),
    [t, selection, activeCode]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used inside <LanguageProvider>");
  return ctx;
}
