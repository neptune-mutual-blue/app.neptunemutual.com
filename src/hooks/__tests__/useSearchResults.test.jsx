import { renderHook } from "@testing-library/react-hooks";
import { useSearchResults } from "../useSearchResults";

const mockProps = {
  list: [],
  filter: () => {},
};

describe("useSearchResults", () => {
  test("should receive values", () => {
    const { result } = renderHook(() => useSearchResults(mockProps));

    expect(result.current.searchValue).toEqual("");
    expect(result.current.setSearchValue).toEqual(expect.any(Function));
    expect(result.current.filtered).toEqual([]);
  });
});
