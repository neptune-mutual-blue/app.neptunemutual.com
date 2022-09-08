import { render, screen } from "@testing-library/react";

jest.mock("@/modules/home/Hero", () => ({
  HomeHero: () => <div data-testid="home-hero"></div>,
}));

jest.mock("@/common/ProductsGrid/ProductsGrid", () => ({
  ProductsGrid: () => <div data-testid="products-grid"></div>,
}));

jest.mock("@/common/ComingSoon", () => ({
  ComingSoon: () => <div data-testid="coming-soon"></div>,
}));

describe("CoverPurchaseDetails test", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, NEXT_PUBLIC_ENABLE_V2: "true" };
  });

  afterEach(() => {
    jest.resetModules();
    process.env = OLD_ENV;
  });

  test("Should display Baskets Cover pool component with home hero and product grid component", () => {
    const BasketsCoverpoolR =
      require("@/src/pages/diversified/[cover_id]/index").default;

    render(<BasketsCoverpoolR />);

    const homeHero = screen.getByTestId("home-hero");
    expect(homeHero).toBeInTheDocument();

    const productGrid = screen.getByTestId("products-grid");
    expect(productGrid).toBeInTheDocument();
  });

  test("Should display Baskets Cover pool component with home hero and product grid component", () => {
    process.env.NEXT_PUBLIC_ENABLE_V2 = "false";
    const BasketsCoverpoolRZ =
      require("@/src/pages/diversified/[cover_id]/index").default;

    render(<BasketsCoverpoolRZ />);

    const comingsoon = screen.getByTestId("coming-soon");
    expect(comingsoon).toBeInTheDocument();
  });
});
