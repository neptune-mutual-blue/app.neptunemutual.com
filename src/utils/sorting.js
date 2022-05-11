Object.byString = function(o, s) {
  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  var a = s.split(".");
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};

export const sortByObjectKey = (
  array,
  key,
  ascending = true,
  formatFunction
) => {
  return array.sort((a, b) => {
    const dataA = formatFunction ?
      formatFunction(Object.byString(a, key)) :
      Object.byString(a, key);
    const dataB = formatFunction ?
      formatFunction(Object.byString(b, key)) :
      Object.byString(b, key);
    if (dataA < dataB) return ascending ? -1 : 1;
    else if (dataA > dataB) return ascending ? 1 : -1;
    return 0;
  });
};

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
    case SORT_TYPES.APR:
      return sortByBigNumber(dataList, callback);
    default:
      return dataList;
  }
}

export const sortData = (dataList, sortTypeName) => {
  switch (sortTypeName) {
    case SORT_TYPES.AtoZ:
      return sortByObjectKey(dataList, "projectName", true);
    case SORT_TYPES.Utilization:
      /* return sortByObjectKey(dataList, "stats.utilization", false, parseFloat); */
      return dataList;
    case SORT_TYPES.Liquidity:
      /* return sortByObjectKey(dataList, "stats.liquidity", false, parseFloat); */
      return dataList;
    case SORT_TYPES.TVL:
      return sortByObjectKey(dataList, "tvl", false, parseFloat);
    default:
      return dataList;
  }
};