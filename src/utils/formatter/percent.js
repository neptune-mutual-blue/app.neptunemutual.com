export const formatPercent = (x, locale, symbol = true) => {
  if (!x) {
    return "";
  }

  const percent = parseFloat(x) * 100;

  const result = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: percent < 1 ? 6 : 2,
  }).format(x);
  return symbol ? result : result.replace("%", "");
};
