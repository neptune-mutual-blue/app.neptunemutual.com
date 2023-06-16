export const formatPercent = (x, locale, symbol = true) => {
  if (!x) {
    x = 0
  }

  const percent = parseFloat(x) * 100

  if (isNaN(percent)) {
    x = 0
  }

  const result = new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: percent < 1 ? 6 : 2
  }).format(x)

  return symbol ? result : result.replace('%', '')
}
