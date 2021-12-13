import numeral from "numeral";

export const amountFormatter = (x, locale = "en") => {
  const format = x < 10000 ? "0.00" : "0.00a";
  numeral.locale(locale);
  return numeral(x).format(format).toUpperCase();
};
