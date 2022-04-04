export const sortData = (dataList, sortTypeName) => {
  switch (sortTypeName) {
    case "A-Z":
      return dataList.sort((a, b) => {
        if (a.projectName < b.projectName) return -1;
        else if (a.projectName > b.projectName) return 1;
        return 0;
      });
    case "TVL":
      return dataList.sort((a, b) => {
        if (parseFloat(a.tvl) > parseFloat(b.tvl)) return -1;
        else if (parseFloat(a.tvl) < parseFloat(b.tvl)) return 1;
        return 0;
      });
    default:
      return dataList;
  }
};
