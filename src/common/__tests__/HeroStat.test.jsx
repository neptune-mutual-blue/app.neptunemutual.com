import { act, render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { HeroStat } from "@/common/HeroStat";

describe("HeroStat component", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  test("should render title and children passed to it.", () => {
    const screen = render(
      <HeroStat title={"HeroTitle"}>This is herostat children.</HeroStat>
    );
    const textElement = screen.getByText(/This is herostat children./i);
    const titleElement = screen.getByText(/HeroTitle/i);
    expect(textElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
  });
});
