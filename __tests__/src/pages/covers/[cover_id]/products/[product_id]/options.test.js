import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

jest.mock("@/src/modules/cover/CoverOptionsPage", () => ({
  CoverOptionsPage: () => {
    return <div data-testid="cover-options-page"></div>;
  },
}));

jest.mock("@/common/Container/Container", () => ({
  Container: ({ children }) => {
    return <div data-testid="container">{children}</div>;
  },
}));

jest.mock("@/common/BreadCrumbs/BreadCrumbs", () => ({
  BreadCrumbs: () => {
    return <div data-testid="bread-crumbs"></div>;
  },
}));

describe("Options test", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, NEXT_PUBLIC_ENABLE_V2: "true" };
    const Options =
      require("@/src/pages/covers/[cover_id]/products/[product_id]").default;
    const { initialRender } = initiateTest(Options, {}, () => {
      mockFn.useRouter();
      mockFn.useCoverOrProductData();
    });
    initialRender();
  });

  test("should display BreadCrumbs of Animated Brands and cover option page", () => {
    const container = screen.getByTestId("container");
    expect(container).toBeInTheDocument();

    const breadCrumbs = screen.getByTestId("bread-crumbs");
    expect(breadCrumbs).toBeInTheDocument();

    const coverOptionPage = screen.getByTestId("cover-options-page");
    expect(coverOptionPage).toBeInTheDocument();
  });
});
