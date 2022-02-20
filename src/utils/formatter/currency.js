import { getLocale } from "@/utils/locale";

const asCurrency = (sign, number, symbol, currency, token = false) => {
  if (token) {
    return `${sign}${number.toLocaleString(getLocale())}${symbol} ${currency}`;
  }

  const formatter = new Intl.NumberFormat(getLocale(), {
    style: "currency",
    currency,
  });

  return `${sign}${formatter.format(number)}${symbol}`;
};

export const formatCurrency = (input, currency = "USD", token = false) => {
  const number = parseFloat(Math.abs(input));

  if (!number) {
    return "";
  }

  const sign = input < 0 ? "-" : "";

  let result = number;
  let symbol = "";

  if (number > 1e4 && number < 1e5) {
    result = number.toFixed(2);
  }

  if (number >= 1e5 && number < 1e6) {
    symbol = "K";
    result = +(number / 1e3).toFixed(2);
  }

  if (number >= 1e6 && number < 1e9) {
    symbol = "M";
    result = +(number / 1e6).toFixed(2);
  }

  if (number >= 1e9 && number < 1e12) {
    symbol = "B";
    result = +(number / 1e9).toFixed(2);
  }

  if (number >= 1e12) {
    symbol = "T";
    result = +(number / 1e12).toFixed(2);
  }

  return {
    short: asCurrency(sign, result, symbol, currency, token),
    long: asCurrency(sign, number, "", currency, token),
  };
};
