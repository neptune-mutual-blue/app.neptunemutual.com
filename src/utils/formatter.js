
export const formatAmount = (x, locale) => {
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: parseFloat(x) < 1 ? 6 : 2
  }).format(x)
}
