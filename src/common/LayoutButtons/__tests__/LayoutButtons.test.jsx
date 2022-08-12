import { render, act, fireEvent } from "@/utils/unit-tests/test-utils";
import { LayoutButtons } from "../LayoutButtons";
import { i18n } from "@lingui/core";

describe("should render LayoutButtons Component", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  test("should receive setCoverView function props", () => {
    const mockOnChange = jest.fn();
    const { getByRole } = render(
      <LayoutButtons coverView="products" setCoverView={mockOnChange} />
    );
    const inputRadio = getByRole("radio", {
      name: "Show covers only",
    });

    fireEvent.change(inputRadio);

    expect(inputRadio).not.toBeChecked();
  });
});
