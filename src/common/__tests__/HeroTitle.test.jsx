import { act, render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { HeroTitle } from "@/common/HeroTitle";

describe("HeroTitle component", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  test("should render children passed to it.", () => {
    const screen = render(<HeroTitle>HeroTitle</HeroTitle>);

    const titleElement = screen.getByText(/HeroTitle/i);
    expect(titleElement).toBeInTheDocument();
  });
});
