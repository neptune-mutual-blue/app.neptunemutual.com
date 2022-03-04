export const useSearchResults = ({
  inputValue,
  coversToFilter,
  filterCoversBy,
}) => {
  let coversToShow = coversToFilter.filter(
    (cover) =>
      cover[filterCoversBy].toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );

  return { coversToShow };
};
