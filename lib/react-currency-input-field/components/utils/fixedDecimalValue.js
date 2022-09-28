export const fixedDecimalValue = (
  value,
  decimalSeparator,
  fixedDecimalLength
) => {
  if (fixedDecimalLength && value.length > 1) {
    if (value.includes(decimalSeparator)) {
      const [int, decimals] = value.split(decimalSeparator)
      if (decimals.length > fixedDecimalLength) {
        return `${int}${decimalSeparator}${decimals.slice(
          0,
          fixedDecimalLength
        )}`
      }
    }

    const regExp = new RegExp(value.length > fixedDecimalLength ? `(\\d+)(\\d{${fixedDecimalLength}})` : '(\\d)(\\d+)')
    const match = value.match(regExp)

    if (match) {
      const [, int, decimals] = match
      return `${int}${decimalSeparator}${decimals}`
    }
  }

  return value
}
