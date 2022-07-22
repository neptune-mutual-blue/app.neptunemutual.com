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

  const reg = new RegExp(sep.thousand, "g");

  return formattedString.toString().replace(reg, "").replace(sep.decimal, ".");
};

export const limitNumberToDecimal = (value = "", limit = 12) =>
  value.indexOf(".") >= 0
    ? value.substr(0, value.indexOf(".")) +
      value.substr(value.indexOf("."), limit + 1)
    : value;
