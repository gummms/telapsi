import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../services/translationService";

/**
 * Hook that returns the translated version of `text`.
 * Displays original text immediately while translation is in progress.
 */
export function useTranslate(text) {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    // Reset to original immediately when text or language changes
    setTranslated(text);

    if (!text || language === "pt") return;

    let cancelled = false;
    translateText(text, language).then((result) => {
      if (!cancelled) setTranslated(result);
    });

    return () => { cancelled = true; };
  }, [text, language]);

  return translated;
}
