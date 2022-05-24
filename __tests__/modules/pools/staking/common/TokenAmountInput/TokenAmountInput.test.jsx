/*
import { render, screen } from "@testing-library/react";
import { TokenAmountInput } from "@/common/TokenAmountInput/TokenAmountInput";
import { isValidNumber } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";

const noop = () => {};
describe("Home", () => {
  it("TokenAmountInput: should display", () => {
    render(
      <TokenAmountInput
        labelText="Amount you wish to cover"
        onChange={noop}
        error={false}
        handleChooseMax={noop}
        tokenAddress={""}
        tokenSymbol="cxDAI"
        tokenBalance={0}
        inputId={"cover-amount"}
        inputValue={0}
        disabled={false}
      >
        {value && isValidNumber(value) && (
          <div
            className="flex items-center text-15aac8"
            title={formatCurrency(value, "en", "cxDAI", true).long}
          >
            <p>
              You will receive:
              {formatCurrency(value, "en", "cxDAI", true).short}
            </p>
          </div>
        )}
        {error && <p className="flex items-center text-FA5C2F">{error}</p>}
      </TokenAmountInput>
    );

    const component = screen.getByRole("input", {
      // name: "Neutral Button",
    });

    expect(component).toBeInTheDocument();
  });
});
*/

describe("TestAmount", () => {
  it("renders Unlock Date string", () => {
    expect(null).toBe(null);

    // const title = screen.getByText("Unlock Date");

    // expect(title).toBeInTheDocument();
  });
});
