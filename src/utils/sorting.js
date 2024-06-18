import { toBNSafe } from '@/utils/bn'
import { toStringSafe } from '@/utils/string'
import { t } from '@lingui/macro'

// Don't translate these
export const SORT_TYPES = {
  ALPHABETIC: 'a-z',
  UTILIZATION_RATIO: 'utilization-ratio',
  LIQUIDITY: 'liquidity',
  EMISSIONS: 'emissions',
  TVL: 'tvl',
  APR: 'apr',
  INCIDENT_DATE: 'incident-date',
  RESOLVED_DATE: 'resolved-date',
  ALL: 'all',
  DIVERSIFIED_POOL: 'diversified',
  DEDICATED_POOL: 'dedicated'
}

/**
 *
 * @param {import('@lingui/core').I18n} i18n - The I18n instance from Lingui library.
 * @returns {Array<{name: string, value: string}>} An array of column objects.
 */
export const DEFAULT_SORT_OPTIONS = (i18n) => {
  return [
    { name: t(i18n)`A-Z`, value: SORT_TYPES.ALPHABETIC },
    { name: t(i18n)`Utilization ratio`, value: SORT_TYPES.UTILIZATION_RATIO },
    { name: t(i18n)`Liquidity`, value: SORT_TYPES.LIQUIDITY }
  ]
}

export const DEFAULT_SORT = (i18n) => {
  return DEFAULT_SORT_OPTIONS(i18n)[0]
}

export const SORT_DATA_TYPES = {
  BIGNUMBER: 'BIGNUMBER',
  STRING: 'STRING'
}

const sortByString = (dataList, selector, asc = true) => {
  return dataList.sort((a, b) => {
    const aKey = toStringSafe(selector(a))
    const bKey = toStringSafe(selector(b))

    const compare = new Intl.Collator('en').compare

    return asc ? compare(aKey, bKey) : compare(bKey, aKey)
  })
}

const sortByBigNumber = (dataList, selector, asc = false) => {
  return dataList.sort((a, b) => {
    const aKey = toBNSafe(selector(a))
    const bKey = toBNSafe(selector(b))

    if (aKey.isGreaterThan(bKey)) {
      return asc ? 1 : -1
    }

    if (bKey.isGreaterThan(aKey)) {
      return asc ? -1 : 1
    }

    return 0
  })
}

/**
 *
 * @param {Object} sorterArgs - args used for sorting
 * @param {(any)=>any} sorterArgs.selector - a function which returns the value to sort with.
 * @param {any[]} sorterArgs.list - array of items
 * @param {keyof SORT_DATA_TYPES | string}  sorterArgs.datatype - array of items
 * @param {boolean} [sorterArgs.ascending] - array of items
 */
export const sorter = ({ selector, list, datatype, ascending }) => {
  if (datatype === SORT_DATA_TYPES.STRING) {
    return sortByString(list, selector, ascending)
  }

  if (datatype === SORT_DATA_TYPES.BIGNUMBER) {
    return sortByBigNumber(list, selector, ascending)
  }

  return list
}

const getNestedObjectValue = (object, key = '') => {
  return key.split('.').reduce((acc, curr) => {
    return acc ? acc[curr] : object[curr]
  }, null)
}

export const sortDataByKey = (data = [], sortKey, sortType) => {
  return data.sort((prev, curr) => {
    const prevValue = getNestedObjectValue(prev, sortKey) || ''
    const currValue = getNestedObjectValue(curr, sortKey) || ''

    if (Number(prevValue) && Number(currValue)) {
      if (sortType === 'asc') { return Number(prevValue) - Number(currValue) }
      if (sortType === 'desc') { return Number(currValue) - Number(prevValue) }

      return 0
    }

    if (sortType === 'asc') { return prevValue.localeCompare(currValue) }
    if (sortType === 'desc') { return currValue.localeCompare(prevValue) }

    return 0
  })
}
