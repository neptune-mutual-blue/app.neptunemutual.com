import { screen, act, render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { PolicyFeesAndExpiry } from "@/common/PolicyFeesAndExpiry/PolicyFeesAndExpiry";
import { convertUintToPercentage } from "@/utils/bn";
import { formatPercent } from "@/utils/formatter/percent";
import DateLib from "@/lib/date/DateLib";

describe("PolicyFeesAndExpiry component behaviour", () => {
  const mockdata = {
    fee: "55024605570624478809",
    rate: "400",
    expiryDate: "1655103959",
  };

  const rateToShow = convertUintToPercentage(mockdata.rate);

  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  it("should render PolicyFeesAndExpiry component", () => {
    render(<PolicyFeesAndExpiry data={mockdata} />);
    const feesElement = screen.getByText(/Fees/i);
    const feesPercent = screen.getByText(formatPercent(rateToShow, "en"));
    const dateText = screen.getByText(
      DateLib.toLongDateFormat(mockdata.expiryDate, "en", "UTC")
    );
    expect(dateText).toBeInTheDocument();
    expect(feesElement).toBeInTheDocument();
    expect(feesPercent).toBeInTheDocument();
  });
});
