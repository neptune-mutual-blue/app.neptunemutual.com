import { cleanup, screen } from "@/utils/unit-tests/test-utils";

import { MyLiquidityPage } from "@/modules/my-liquidity";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";

const props = {
  myLiquidities: [
    {
      id: "0x9bdae2a084ec18528b78e90b38d1a67c79f6cab6-0x68696369662d62616e6b00000000000000000000000000000000000000000000",
      account: "0x9bdae2a084ec18528b78e90b38d1a67c79f6cab6",
      totalPodsRemaining: "500000000000000000000",
      cover: {
        id: "0x68696369662d62616e6b00000000000000000000000000000000000000000000",
        coverKey:
          "0x68696369662d62616e6b00000000000000000000000000000000000000000000",
        vaults: [
          {
            tokenSymbol: "HCF-nDAI",
            tokenDecimals: 18,
            address: "0x98e7786fff366aeff1a55131c92c4aa7edd68ad1",
          },
        ],
      },
    },
  ],
  loading: false,
};

describe("MyLiquidityPage test", () => {
  const { initialRender, rerenderFn } = initiateTest(MyLiquidityPage, props);

  beforeEach(() => {
    cleanup();
    initialRender();
  });

  test("should render the main page container without fail", () => {
    const wrapper = screen.getByTestId("page-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render `Transaction List` link", () => {
    const link = screen.getByText("Transaction List");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/my-liquidity/transactions");
  });

  describe("Liquidities present", () => {
    test("should show the liquidities grid if liquidities are present", () => {
      const wrapper = screen.getByTestId("liquidities-grid");
      expect(wrapper).toBeInTheDocument();
    });

    test("should show correct number of liquidity cover cards", () => {
      const wrapper = screen.getAllByTestId("liquidity-cover-card");
      expect(wrapper.length).toBe(props.myLiquidities.length);
    });

    test("liquidity cover card should have correct link", () => {
      const card = screen.getAllByTestId("liquidity-cover-card")[0];

      const link = `/my-liquidity/${safeParseBytes32String(
        props.myLiquidities[0].cover.id
      )}`;
      expect(card).toHaveAttribute("href", link);
    });
  });

  describe("Liquidities loading", () => {
    test("should render the loading grid when loading & no liquidity data present", () => {
      rerenderFn({ loading: true, myLiquidities: [] });
      const wrapper = screen.getByTestId("loading-grid");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Liquidities not present", () => {
    test("should render the no liquidities grid if no liquidities are present", () => {
      rerenderFn({ myLiquidities: [] });
      const wrapper = screen.getByTestId("no-liquidities-grid");
      expect(wrapper).toBeInTheDocument();
    });

    test("should render the empty list illustration", () => {
      rerenderFn({ myLiquidities: [] });
      const wrapper = screen.getByTestId("no-liquidities-grid");
      const img = wrapper.querySelector("img");

      const imageSrc = "/images/covers/empty-list-illustration.svg";
      expect(img).toHaveAttribute("src", imageSrc);
    });
  });
});
