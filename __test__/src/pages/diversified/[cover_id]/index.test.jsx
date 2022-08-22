import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import BasketsCoverpool from "@/src/pages/diversified/[cover_id]/index";

jest.mock("@/modules/home/Hero", () => ({
  HomeHero: () => <div data-testid="home-hero"></div>,
}));

jest.mock("@/common/ProductsGrid/ProductsGrid", () => ({
  ProductsGrid: () => <div data-testid="products-grid"></div>,
}));

describe("CoverPurchaseDetails test", () => {
  const { initialRender } = initiateTest(BasketsCoverpool);

  beforeEach(() => {
    initialRender();
  });

  test("Should display Baskets Cover pool component with home hero and product grid component", () => {
    const homeHero = screen.getByTestId("home-hero");
    expect(homeHero).toBeInTheDocument();

    const productGrid = screen.getByTestId("products-grid");
    expect(productGrid).toBeInTheDocument();
  });
});
