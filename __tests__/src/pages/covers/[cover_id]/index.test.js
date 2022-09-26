import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

import * as environment from "@/src/config/environment";
import { testData } from "@/utils/unit-tests/test-data";

const mockIsV2BasketCoverEnabled = jest.spyOn(
  environment,
  "isV2BasketCoverEnabled"
);

jest.mock("@/src/modules/cover/CoverOptionsPage", () => ({
  CoverOptionsPage: () => {
    return <div data-testid="cover-options-page"></div>;
  },
}));

jest.mock("@/modules/home/Hero", () => ({
  HomeHero: () => {
    return <div data-testid="home-hero"></div>;
  },
}));

jest.mock("@/common/ProductsGrid/ProductsGrid", () => ({
  ProductsGrid: () => {
    return <div data-testid="products-grind"></div>;
  },
}));

describe("Options test", () => {
  mockIsV2BasketCoverEnabled.mockImplementation(() => true);
  const CoverPage = require("@/src/pages/covers/[cover_id]").default;

  const { initialRender, rerenderFn } = initiateTest(CoverPage, {}, () => {
    mockFn.useCoverOrProductData();
  });

  beforeEach(() => {
    initialRender();
  });

  test("Should display Cover option page Dedicated Product", () => {
    const coverOptionPage = screen.getByTestId("cover-options-page");
    expect(coverOptionPage).toBeInTheDocument();
  });

  test("Should display Home Hero And Products Grind Component Diversifed Product", () => {
    rerenderFn(CoverPage, () => {
      mockFn.useCoverOrProductData(() => {
        return { ...testData.coverInfo, supportsProducts: true };
      });
    });

    const homeHero = screen.getByTestId("home-hero");
    expect(homeHero).toBeInTheDocument();

    const productsGrind = screen.getByTestId("products-grind");
    expect(productsGrind).toBeInTheDocument();
  });
});
