import { getMonthNames } from '@/lib/dates'
import { toBNSafe } from '@/utils/bn'
import { toStringSafe } from '@/utils/string'

// Don't translate these
export const SORT_TYPES = {
  ALPHABETIC: 'A-Z',
  UTILIZATION_RATIO: 'Utilization ratio',
  LIQUIDITY: 'Liquidity',
  TVL: 'TVL',
  APR: 'APR',
  INCIDENT_DATE: 'Incident date',
  RESOLVED_DATE: 'Resolved date',
  ALL: 'all',
  DIVERSIFIED_POOL: 'diversified',
  DEDICATED_POOL: 'dedicated'
}

export const DEFAULT_SORT = { name: 'Utilization ratio', value: SORT_TYPES.UTILIZATION_RATIO }

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

/* sort array of dates formatted as "MMM-YY" (eg. JAN-23) */
export function sortDates (dates, selector = (x) => x, asc = true) {
  return dates.sort((a, b) => {
    const aData = selector(a)
    const bData = selector(b)

    const [aMonth, aYear] = aData.split('-')
    const [bMonth, bYear] = bData.split('-')
    const months = getMonthNames(undefined, true)
    const aMonthIndex = months.indexOf(aMonth)
    const bMonthIndex = months.indexOf(bMonth)
    if (aYear === bYear) {
      return asc ? (aMonthIndex - bMonthIndex) : (bMonthIndex - aMonthIndex)
    } else {
      return asc ? (aYear - bYear) : (bYear - aYear)
    }
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
      if (sortType === 'asc') return Number(prevValue) - Number(currValue)
      if (sortType === 'desc') return Number(currValue) - Number(prevValue)
      return 0
    }

    if (sortType === 'asc') return prevValue.localeCompare(currValue)
    if (sortType === 'desc') return currValue.localeCompare(prevValue)

    return 0
  })
}
