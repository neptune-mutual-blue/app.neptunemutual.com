export const getNumberSeparators = (locale = 'en') => {
  const thousand = Intl.NumberFormat(locale).format(11111).replace(/\d/gu, '')
  const decimal = Intl.NumberFormat(locale).format(1.1).replace(/\d/gu, '')

  return {
    thousand,
    decimal
  }
}

export const getPlainNumber = (formattedString, locale = 'en') => {
  const sep = getNumberSeparators(locale)

  return formattedString
    .toString()
    .replaceAll(sep.thousand, '')
    .replace(sep.decimal, '.')
}
