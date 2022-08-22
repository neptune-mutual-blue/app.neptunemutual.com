import { testData } from "@/utils/unit-tests/test-data";
import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import Options from "@/src/pages/covers/[cover_id]/[product_id]/options";

jest.mock("@/src/modules/cover/CoverOptionsPage", () => ({
  CoverOptionsPage: () => {
    return <div data-testid="cover-options-page"></div>;
  },
}));

describe.only("Options test", () => {
  const { initialRender, rerenderFn } = initiateTest(Options, {}, () => {
    mockFn.useCoverOrProductData(() => ({
      ...testData.coverInfo,
      cover: { infoObj: testData.coverInfo.infoObj },
    }));
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

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });
    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
