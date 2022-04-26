import { getLocale } from "@/utils/locale";
import BigNumber from "bignumber.js";

const asCurrency = (sign, number, symbol, currency, token = false) => {
  if (token) {
    if (number < 0.00000001) {
      return "A fraction of " + currency;
    }

    if (parseFloat(number) < 0.01) {
      number = number.toFixed(8);
    }

    return `${sign}${number.toLocaleString(getLocale())}${symbol} ${currency}`;
  }

  const formatter = new Intl.NumberFormat(getLocale(), {
    style: "currency",
    currency,
    maximumFractionDigits: parseFloat(number) < 1 ? 8 : 2,
  });

  return `${sign}${formatter.format(number)}${symbol}`;
};

export const formatCurrency = (input, currency = "USD", token = false) => {
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

export const getNumberSeparators = (locale = "en") => {
  const thousand = Intl.NumberFormat(locale).format(11111).replace(/\d/gu, "");
  const decimal = Intl.NumberFormat(locale).format(1.1).replace(/\d/gu, "");
  return {
    thousand,
    decimal,
  };
};

export const getPlainNumber = (formattedString, locale = "en") => {
  const sep = getNumberSeparators(locale);
  return formattedString
    .toString()
    .replaceAll(sep.thousand, "")
    .replace(sep.decimal, ".");
};

BigNumber.prototype.newFormat = (function (u) {
  const format = BigNumber.prototype.toFormat;
  return function (dp, rm) {
    if (typeof dp === "object" && dp) {
      let t = dp.minimumDecimalPlaces;
      if (t !== u) return format.call(this, this.dp() < t ? t : u);
      rm = dp.roundingMode;
      t = dp.maximumDecimalPlaces;
      if (t !== u) return format.call(this.dp(t, rm));
      t = dp.decimalPlaces;
      if (t !== u) return format.call(this, t, rm);
    }
    return format.call(this, dp, rm);
  };
})();

export const numberLocaleChange = (formattedNumber, locale = "en") => {
  const sep = getNumberSeparators(locale);
  return formattedNumber
    .replaceAll(",", sep.thousand)
    .replace(".", sep.decimal);
};

export const getLocaleNumber = (
  plainNumber,
  locale = "en",
  preserveTrailingZeroes = false
) => {
  const sep = getNumberSeparators(locale);
  let formattedNumber = "";
  if (preserveTrailingZeroes) {
    const decimalLength = plainNumber
      ? plainNumber.toString().split(".")[1]?.length ?? 0
      : 0;
    formattedNumber = new BigNumber(plainNumber).newFormat({
      // decimalSeparator: sep.decimal,
      // groupSeparator: sep.thousand,
      groupSize: 3,
      minimumDecimalPlaces: decimalLength,
    });
    formattedNumber = numberLocaleChange(formattedNumber, locale);
  } else {
    formattedNumber = new BigNumber(plainNumber).toFormat({
      decimalSeparator: sep.decimal,
      groupSeparator: sep.thousand,
      groupSize: 3,
    });
  }
  return formattedNumber;
};
