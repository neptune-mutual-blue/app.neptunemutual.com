import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { useEffect, useState } from "react";

import { useActiveLocale } from "../hooks/useActiveLocale";
import { dynamicActivate } from "@/src/i18n/dynamic-activate";

export function LanguageProvider({ children }) {
  const locale = useActiveLocale();
  const [loaded, setLoaded] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    let ignore = false;

    dynamicActivate(locale)
      .then(() => {
        /* istanbul ignore next */
        if (ignore) return;
        setLoaded(true);
      })
      .catch((error) =>
        console.error("Failed to activate locale", locale, error)
      );

    return () => {
      ignore = true;
    };
  }, [locale]);

  useEffect(() => {
    if (refresh === true) setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    const updateRefresh = () => setRefresh(true);

    // Detect network change and manually refresh
    if (window && window.addEventListener) {
      window.addEventListener("languagechange", updateRefresh);
    }

    return () => window.removeEventListener("languagechange", updateRefresh);
  }, []);

  if (!loaded) {
    // prevent the app from rendering with placeholder text before the locale is loaded
    console.log("Could not fetch locale");
  }

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
