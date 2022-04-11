Object.byString = function (o, s) {
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
    const dataA = formatFunction
      ? formatFunction(Object.byString(a, key))
      : Object.byString(a, key);
    const dataB = formatFunction
      ? formatFunction(Object.byString(b, key))
      : Object.byString(b, key);
    if (dataA < dataB) return ascending ? -1 : 1;
    else if (dataA > dataB) return ascending ? 1 : -1;
    return 0;
  });
};

export const sortData = (dataList, sortTypeName) => {
  switch (sortTypeName) {
    case "A-Z":
      return sortByObjectKey(dataList, "projectName", true);
    case "Utilization Ratio":
      return sortByObjectKey(dataList, "stats.utilization", false, parseFloat);
    case "Liquidity":
      return sortByObjectKey(dataList, "stats.liquidity", false, parseFloat);
    case "TVL":
      return sortByObjectKey(dataList, "tvl", false, parseFloat);
    default:
      return dataList;
  }
};
