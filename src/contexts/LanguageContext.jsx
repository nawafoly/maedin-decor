import { createContext, useContext, useEffect, useMemo, useState } from "react";
import ar from "../i18n/ar.js";
import en from "../i18n/en.js";

const STORAGE_KEY = "forma-language";
const DEFAULT_LANGUAGE = "ar";
const dictionaries = { ar, en };

const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return savedLanguage && dictionaries[savedLanguage] ? savedLanguage : DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);
  const dictionary = dictionaries[language] || dictionaries[DEFAULT_LANGUAGE];

  useEffect(() => {
    document.documentElement.lang = dictionary.meta.lang;
    document.documentElement.dir = dictionary.meta.dir;
    document.body.dir = dictionary.meta.dir;
    document.body.dataset.language = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [dictionary, language]);

  const value = useMemo(
    () => ({
      language,
      direction: dictionary.meta.dir,
      t: dictionary,
      setLanguage: (nextLanguage) => {
        if (dictionaries[nextLanguage]) {
          setLanguageState(nextLanguage);
        }
      },
      toggleLanguage: () => {
        setLanguageState((currentLanguage) => (currentLanguage === "ar" ? "en" : "ar"));
      },
    }),
    [dictionary, language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
