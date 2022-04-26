export const getLocale = () => {
  const fallback = "en-US";

  try {
    let locale;

    if (typeof window !== "undefined") {
      locale = window.location.pathname.substring(1, 6); // will get the locale from route
    }

    return locale || fallback;
  } catch {
    // `navigator` is not available
  }

  return fallback;
};
