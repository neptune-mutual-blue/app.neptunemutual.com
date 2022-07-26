import { screen, act, render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { PolicyFeesAndExpiry } from "@/common/PolicyFeesAndExpiry/PolicyFeesAndExpiry";
import { formatPercent } from "@/utils/formatter/percent";
import { MULTIPLIER } from "@/src/config/constants";
import { toBN } from "@/utils/bn";

describe("PolicyFeesAndExpiry component behaviour", () => {
  const mockdata = {
    fee: "39490958",
    rate: "1486",
    expiryDate: "1667260799",
  };

  const rateConverted = toBN(mockdata.rate).dividedBy(MULTIPLIER).toString();

  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  it("should render fees percent", () => {
    render(<PolicyFeesAndExpiry data={mockdata} />);
    const feesElement = screen.getByText(/Fees/i);
    const feesPercent = screen.getByText(formatPercent(rateConverted, "en"));
    expect(feesElement).toBeInTheDocument();
    expect(feesPercent).toBeInTheDocument();
  });
});
