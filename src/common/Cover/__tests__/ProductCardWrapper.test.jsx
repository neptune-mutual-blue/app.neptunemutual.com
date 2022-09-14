import { screen } from "@/utils/unit-tests/test-utils";
import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { ProductCardWrapper } from "@/common/Cover/ProductCardWrapper";

const mockCoverDetails = {
  coverKey:
    "0x6465666900000000000000000000000000000000000000000000000000000000",
  productKey:
    "0x31696e6368000000000000000000000000000000000000000000000000000000",
};

describe("ProductCardWrapper component", () => {
  beforeEach(() => {
    mockFn.useCoverOrProductData(() => {});

    const { initialRender } = initiateTest(ProductCardWrapper, {
      coverKey: mockCoverDetails.coverKey,
      productKey: mockCoverDetails.productKey,
    });

    initialRender();
  });

  test("should render the card skeleton if productInfo is null", () => {
    const wrapper = screen.getByTestId("card-status-badge");
    expect(wrapper).toBeInTheDocument();
  });

  test("should not render the link to verify its the skeleton", () => {
    const linkElement = screen.queryByTestId("cover-link");
    expect(linkElement).not.toBeInTheDocument();
  });
});

describe("ProductCardWrapper component", () => {
  beforeEach(() => {
    mockFn.useCoverOrProductData();

    const { initialRender } = initiateTest(ProductCardWrapper, {
      coverKey: mockCoverDetails.coverKey,
      productKey: mockCoverDetails.productKey,
    });

    initialRender();
  });

  test("should render the wrapper links if there is productInfo", () => {
    const linkElement = screen.getByTestId("cover-link");
    expect(linkElement).toBeInTheDocument();
  });
});
