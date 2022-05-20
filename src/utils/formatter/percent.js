export const formatPercent = (x, locale) => {
  if (!x) {
    return "";
  }

  const percent = parseFloat(x) * 100;

  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: percent < 1 ? 6 : 2,
  }).format(x);
};