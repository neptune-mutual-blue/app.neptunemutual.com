import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import Options from "@/src/pages/covers/[cover_id]/options";

jest.mock("@/src/modules/cover/CoverOptionsPage", () => ({
  CoverOptionsPage: () => {
    return <div data-testid="cover-options-page"></div>;
  },
}));

describe("Options test", () => {
  const { initialRender } = initiateTest(Options, {}, () => {
    mockFn.useCoverOrProductData();
  });

  beforeEach(() => {
    initialRender();
  });

  test("should display BreadCrumbs of Animated Brands and cover option page", () => {
    const home = screen.getByText("Home");
    expect(home).toBeInTheDocument();

    const animatedbrands = screen.getByText("Animated Brands");
    expect(animatedbrands).toBeInTheDocument();

    const coverOptionPage = screen.getByTestId("cover-options-page");
    expect(coverOptionPage).toBeInTheDocument();
  });
});
