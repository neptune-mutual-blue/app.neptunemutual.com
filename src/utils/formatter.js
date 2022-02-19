import numeral from "numeral";

export const formatWithAabbreviation = (x, locale = "en") => {
  const format = x < 10000 ? "0.00" : "0.00a";
  numeral.locale(locale);
  return numeral(x).format(format).toUpperCase();
};

export const formatAmount = (x) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: x < 1 ? 6 : 2,
  }).format(x);
};

export const formatPercent = (x) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: x < 1 ? 6 : 2,
  }).format(x);
};
