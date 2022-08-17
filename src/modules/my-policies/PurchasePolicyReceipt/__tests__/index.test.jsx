import { PurchasePolicyReceipt } from "@/modules/my-policies/PurchasePolicyReceipt";
import { i18n } from "@lingui/core";
import { render, screen } from "@/utils/unit-tests/test-utils";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

describe("PurchasePolicyReceipt test", () => {
  beforeEach(() => {
    i18n.activate("en");

    const router = createMockRouter({
      query: {
        txHash:
          "0x3e19c6f2398efdf5f6183a168bb694421ebd5aab367eed39872a293b26a71a7c",
      },
    });

    mockFn.useCoverOrProductData();
    mockFn.useAppConstants();
    mockFn.useNetwork();
    mockFn.useRegisterToken();
    mockFn.useFetchCoverPurchasedEvent();
  });

  test("should render the title correctly", () => {
    render(
      <PurchasePolicyReceipt
        txHash={
          "0x3e19c6f2398efdf5f6183a168bb694421ebd5aab367eed39872a293b26a71a7c"
        }
      />
    );
    const wrapper = screen.getByText(/Policy Receipt/i);
    expect(wrapper).toBeInTheDocument();
  });

  test("should not show anything if txhash is not passed", () => {
    render(<PurchasePolicyReceipt />);

    const titleText = screen.queryByText(/Policy Receipt/i);
    expect(titleText).toBeNull();
  });
});
