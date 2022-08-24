import { i18n } from "@lingui/core";
import { render, screen } from "@/utils/unit-tests/test-utils";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { PoolsTabs } from "@/modules/pools/PoolsTabs";

describe("PoolsTab test", () => {
  beforeEach(() => {
    i18n.activate("en");

    mockFn.useAppConstants();
  });

  test("should render the title correctly", () => {
    render(<PoolsTabs active={"pod-staking"} />);
    const wrapper = screen.getByText(/Bond and Staking Pools/i);
    expect(wrapper).toBeInTheDocument();
  });
});
