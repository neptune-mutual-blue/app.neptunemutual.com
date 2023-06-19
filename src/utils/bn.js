import BigNumber from 'bignumber.js'

import { GAS_MARGIN_MULTIPLIER } from '@/src/config/constants'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80
})

export const ZERO_BI = new BigNumber('0')

export const toBN = (x) => { return new BigNumber(x?.toString() || '0') }

export const toBNSafe = (x) => {
  try {
    return toBN(x.toString())
  } catch (error) {
    return toBN('0')
  }
}

export const hasValue = (x) => {
  return !(!x || !parseFloat(x.toString()))
}

export const isValidNumber = (x) => {
  if (BigNumber.isBigNumber(x)) {
    return true
  }

  if (isNaN(x)) {
    return false
  }

  const y = new BigNumber(x)

  return BigNumber.isBigNumber(y)
}

export const convertFromUnits = (value, decimals = 18) => {
  return new BigNumber(value.toString()).dividedBy(Math.pow(10, decimals))
}

export const convertToUnits = (value, decimals = 18) => {
  return new BigNumber(value.toString())
    .multipliedBy(Math.pow(10, decimals))
    .decimalPlaces(0)
}

// --- Utils ---

export const calculateGasMargin = (value) => {
  return new BigNumber(value.toString())
    .multipliedBy(GAS_MARGIN_MULTIPLIER)
    .decimalPlaces(0)
    .toString()
}

export const sumOf = (...amounts) => {
  let sum = new BigNumber('0')

  amounts.forEach((amount) => {
    if (!amount || amount.toString() === 'NaN' || !hasValue(amount)) { return }

    try {
      sum = sum.plus(amount.toString())
    } catch (error) {
      console.log('Could not add', amount)
    }
  })

  return sum
}

export const sort = (amounts, selector, reverse = false) => {
  return [...amounts].sort((a, b) => {
    const numA = selector ? selector(a) : a
    const bigA = new BigNumber(numA.toString())

    const numB = selector ? selector(b) : b
    const bigB = new BigNumber(numB.toString())

    if (bigA.isLessThan(bigB)) {
      return reverse ? 1 : -1
    }
    if (bigA.isGreaterThan(bigB)) {
      return reverse ? -1 : 1
    }

    // a must be equal to b
    return 0
  })
}

export const isGreater = (a, b) => {
  try {
    const bigA = new BigNumber(a.toString())
    const bigB = new BigNumber(b.toString())

    return bigA.isGreaterThan(bigB)
  } catch (error) {
    console.error(error)
  }

  return false
}

export const isGreaterOrEqual = (a, b) => {
  try {
    const bigA = new BigNumber(a.toString())
    const bigB = new BigNumber(b.toString())

    return bigA.isGreaterThanOrEqualTo(bigB)
  } catch (error) {
    console.error(error)
  }

  return false
}

export const isEqualTo = (a, b) => {
  try {
    const bigA = new BigNumber(a.toString())
    const bigB = new BigNumber(b.toString())

    return bigA.isEqualTo(bigB)
  } catch (error) {
    console.error(error)
  }

  return false
}
