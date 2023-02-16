const asCurrency = (sign, number, symbol, locale, currency, token = false) => {
  if (token) {
    if (number < 0.00000001) {
      return 'A fraction of ' + currency
    }

    if (parseFloat(number) < 0.01) {
      number = number.toFixed(8)
    }

    return `${sign}${number.toLocaleString(locale)}${symbol} ${currency}`
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: parseFloat(number) < 1 ? 8 : 2
  })

  return `${sign}${formatter.format(number)}${symbol}`
}

export const formatCurrency = (
  input,
  locale = 'en',
  currency = 'USD',
  token = false,
  alwaysShort = false
) => {
  const number = parseFloat(Math.abs(input).toString())

  if (!number) {
    return { short: 'N/A', long: 'Not available' }
  }

  const sign = input < 0 ? '-' : ''

  let result = number
  let symbol = ''

  if (number > 1e4 && number < 1e5) {
    result = parseFloat(number.toFixed(2))
  }

  if (((alwaysShort && number >= 1e3) || (!alwaysShort && number >= 1e5)) && number < 1e6) {
    symbol = 'K'
    result = +(number / 1e3).toFixed(2)
  }

  if (number >= 1e6 && number < 1e9) {
    symbol = 'M'
    result = +(number / 1e6).toFixed(2)
  }

  if (number >= 1e9 && number < 1e12) {
    symbol = 'B'
    result = +(number / 1e9).toFixed(2)
  }

  if (number >= 1e12) {
    symbol = 'T'
    result = +(number / 1e12).toFixed(2)
  }

  return {
    short: asCurrency(sign, result, symbol, locale, currency, token),
    long: asCurrency(sign, number, '', locale, currency, token)
  }
}
