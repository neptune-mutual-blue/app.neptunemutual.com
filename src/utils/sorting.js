import { toBNSafe } from "@/utils/bn";
import { toStringSafe } from "@/utils/string";

export const SORT_TYPES = {
  ALPHABETIC: "A-Z",
  UTILIZATION_RATIO: "Utilization Ratio",
  LIQUIDITY: "Liquidity",
  TVL: "TVL",
  APR: "APR",
  INCIDENT_DATE: "Incident Date",
  RESOLVED_DATE: "Resolved Date",
};

export const SORT_DATA_TYPES = {
  BIGNUMBER: "BIGNUMBER",
  STRING: "STRING",
};

const sortByString = (dataList, selector, asc = true) => {
  return dataList.sort((a, b) => {
    const aKey = toStringSafe(selector(a));
    const bKey = toStringSafe(selector(b));

    const compare = new Intl.Collator("en").compare;

    return asc ? compare(aKey, bKey) : compare(bKey, aKey);
  });
};

const sortByBigNumber = (dataList, selector, asc = false) => {
  return dataList.sort((a, b) => {
    const aKey = toBNSafe(selector(a));
    const bKey = toBNSafe(selector(b));

    if (aKey.isGreaterThan(bKey)) {
      return asc ? 1 : -1;
    }

    if (bKey.isGreaterThan(aKey)) {
      return asc ? -1 : 1;
    }

    return 0;
  });
};

/**
 *
 * @param {Object} sorterArgs - args used for sorting
 * @param {(any)=>any} sorterArgs.selector - a function which returns the value to sort with.
 * @param {any[]} sorterArgs.list - array of items
 * @param {keyof SORT_DATA_TYPES} sorterArgs.datatype - array of items
 * @param {boolean} [sorterArgs.ascending] - array of items
 */
export const sorter = ({ selector, list, datatype, ascending }) => {
  if (datatype === SORT_DATA_TYPES.STRING) {
    return sortByString(list, selector, ascending);
  }

  if (datatype === SORT_DATA_TYPES.BIGNUMBER) {
    return sortByBigNumber(list, selector, ascending);
  }

  return list;
};