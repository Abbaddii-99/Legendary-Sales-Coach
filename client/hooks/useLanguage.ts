import { useState, useEffect, useCallback } from "react";
import {
  Language,
  loadLanguage,
  setLanguage as setLang,
  getLanguage,
  t as translate,
  isRTL as checkRTL,
  TranslationKey,
} from "@/lib/i18n";

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(getLanguage());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage().then((lang) => {
      setLanguageState(lang);
      setIsLoading(false);
    });
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    await setLang(lang);
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(async () => {
    const newLang = language === "ar" ? "en" : "ar";
    await setLanguage(newLang);
  }, [language, setLanguage]);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translate(key);
    },
    [language]
  );

  const isRTL = language === "ar";

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isRTL,
    isLoading,
  };
}
