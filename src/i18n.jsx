import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  en,
  fr,
  ja,
  zh,
} from "make-plural/plurals";
import { useEffect, useState } from "react";

import { useActiveLocale } from "./hooks/useActiveLocale";

const plurals = {
  "en": en,
  "fr": fr,
  "ja": ja,
  "zh": zh,
};

/**
 * Load messages for requested locale and activate it.
 * This function isn't part of the LinguiJS library because there're
 * many ways how to load messages — from REST API, from file, from cache, etc.
 */
export const dynamicActivate = async (locale) => {
  const isProduction = process.env.NODE_ENV === "production";
  let messages;

  if (isProduction) {
    messages = await import(`../locales/${locale}/messages`);
  } else {
    messages = await import(`@lingui/loader!../locales/${locale}/messages.po`);
  }

  i18n.loadLocaleData(locale, { plurals: () => plurals[locale] });
  i18n.load(locale, messages.messages);
  i18n.activate(locale);
};

export function LanguageProvider({ children }) {
  const locale = useActiveLocale();
  const [loaded, setLoaded] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    dynamicActivate(locale)
      .then(() => setLoaded(true))
      .catch((error) =>
        console.error("Failed to activate locale", locale, error)
      );
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
