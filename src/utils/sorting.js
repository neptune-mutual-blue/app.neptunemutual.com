export const SORT_TYPES = {
  AtoZ: "A-Z",
  Utilization: "Utilization Ratio",
  Liquidity: "Liquidity",
  TVL: "TVL",
  APR: "APR",
};

/**
 *
 * @param {*} object object | array
 * @param {*} key string | number
 * @param {*} defaultValue string | number | Function
 * @returns string | number | Function
 */
export const getProperty = (object, key, defaultValue = "") => {
  if (object.hasOwnProperty(key)) {
    return object[key];
  }

  return defaultValue;
};

const sortByString = (dataList, callback, asc = true) => {
  return dataList.sort((a, b) => {
    const aKey = callback(a).trim().toLowerCase();
    const bKey = callback(b).trim().toLowerCase();

    const compare = new Intl.Collator("en").compare;

    return asc ? compare(aKey, bKey) : compare(bKey, aKey);
  });
};

const sortByBigNumber = (dataList, callback, asc = true) => {
  return dataList.sort((a, b) => {
    const aKey = callback(a);
    const bKey = callback(b);

    if (aKey.isGreaterThan(bKey)) {
      return asc ? -1 : 1;
    }

    if (bKey.isGreaterThan(aKey)) {
      return asc ? 1 : -1;
    }

    return 0;
  });
};

export function sortList(dataList, callback, sortTypeName) {
  switch (sortTypeName) {
    case SORT_TYPES.AtoZ:
      return sortByString(dataList, callback);
    case SORT_TYPES.Liquidity:
    case SORT_TYPES.Utilization:
    case SORT_TYPES.TVL:
      return sortByBigNumber(dataList, callback);
    default:
      return dataList;
  }
}