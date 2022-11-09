import { BigNumber } from '@ethersproject/bignumber'

const extractBignumber = (value) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (!value) {
    return ''
  }

  if (typeof value !== 'object' || !value.type || value.type !== 'BigNumber') {
    return value.toString()
  }

  return BigNumber.from(value).toString()
}

export const stringifyProps = (any) => {
  for (const prop in any) {
    if (Object.prototype.hasOwnProperty.call(any, prop)) {
      try {
        any[prop] = extractBignumber(any[prop])
      } catch (error) {
        // swallow this error
      }
    }
  }

  return any
}
