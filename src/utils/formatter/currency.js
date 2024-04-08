import { toBN } from '@/utils/bn'

export const formatCurrency = (
  amount,
  locale = 'en',
  currency = 'USD',
  token = false
) => {
  const minimumFractionDigits = 0
  let maximumFractionDigits = 2
  const style = 'currency'
  const notation = 'compact'

  if (toBN(amount).isLessThanOrEqualTo(1)) {
    maximumFractionDigits = 8
  }

  if (token) {
    return {
      short: Intl.NumberFormat(locale, { notation, minimumFractionDigits, maximumFractionDigits }).format(amount) + ' ' + currency,
      long: Intl.NumberFormat(locale, { minimumFractionDigits, maximumFractionDigits }).format(amount) + ' ' + currency
    }
  }

  return {
    short: Intl.NumberFormat(locale, { style, currency, notation, minimumFractionDigits, maximumFractionDigits }).format(amount),
    long: Intl.NumberFormat(locale, { style, currency, minimumFractionDigits, maximumFractionDigits }).format(amount)
  }
}
