import { act, render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { Hero } from "@/common/Hero";

describe("Hero component", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  test("should render children passed to it.", () => {
    const screen = render(<Hero>This is test.</Hero>);
    const textElement = screen.getByText(/This is test./i);
    expect(textElement).toBeInTheDocument();
  });
});
