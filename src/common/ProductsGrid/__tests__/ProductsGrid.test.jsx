import {
  screen,
  render,
  withProviders,
  waitFor,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { ProductsGrid } from "@/common/ProductsGrid/ProductsGrid";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

describe("ProductsGrid", () => {
  beforeEach(async () => {
    i18n.activate("en");
    mockFn.useCoverOrProductData();

    const Component = withProviders(ProductsGrid);
    render(<Component />);
  });

  it("has correct title", async () => {
    const backBtn = await waitFor(() => screen.getByText(/Back/i));
    expect(backBtn).toBeInTheDocument();
  });
});
