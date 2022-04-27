import { useRouter } from "next/router";

export const useNumberFormat = () => {
  const router = useRouter();

  const asCurrency = (sign, number, symbol, currency, token = false) => {
    if (token) {
      if (number < 0.00000001) {
        return "A fraction of " + currency;
      }

      if (parseFloat(number) < 0.01) {
        number = number.toFixed(8);
      }

      return `${sign}${number.toLocaleString(
        router.locale
      )}${symbol} ${currency}`;
    }

    const formatter = new Intl.NumberFormat(router.locale, {
      style: "currency",
      currency,
      maximumFractionDigits: parseFloat(number) < 1 ? 8 : 2,
    });

    return `${sign}${formatter.format(number)}${symbol}`;
  };

  const formatCurrency = (input, currency = "USD", token = false) => {
    const number = parseFloat(Math.abs(input).toString());

    if (!number) {
      return { short: "N/A", long: "Not available" };
    }

    const sign = input < 0 ? "-" : "";

    let result = number;
    let symbol = "";

    if (number > 1e4 && number < 1e5) {
      result = parseFloat(number.toFixed(2));
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

  const formatAmount = (x) => {
    return new Intl.NumberFormat(router.locale, {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: parseFloat(x) < 1 ? 6 : 2,
    }).format(x);
  };

  const formatPercent = (x) => {
    if (!x) {
      return "";
    }

    const percent = parseFloat(x) * 100;

    return new Intl.NumberFormat(router.locale, {
      style: "percent",
      maximumFractionDigits: percent < 1 ? 6 : 2,
    }).format(x);
  };

  return {
    formatCurrency,
    formatAmount,
    formatPercent,
  };
};
