import BigNumber from "bignumber.js";

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
