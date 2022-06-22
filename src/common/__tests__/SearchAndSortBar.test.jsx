import { act, render, fireEvent } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { SearchAndSortBar } from "@/common/SearchAndSortBar";

describe("SearchAndSortBar component", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  const onSearchChange = jest.fn();

  test("should not render see more button", () => {
    const screen = render(
      <SearchAndSortBar searchValue="test" onSearchChange={onSearchChange} />
    );
    const searchValue = screen.getByPlaceholderText("Search");
    expect(searchValue).toHaveValue("test");

    fireEvent.change(searchValue, { target: { value: "change" } });
    expect(onSearchChange).toHaveBeenCalled();
  });
});
