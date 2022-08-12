import { TokenAmountSpan } from "@/common/TokenAmountSpan";
import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { testData } from "@/utils/unit-tests/test-data";
import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

describe("TokenAmountSpan", () => {
  const { initialRender } = initiateTest(
    TokenAmountSpan,
    testData.tokenAmountSpanProps
  );

  beforeEach(() => {
    initialRender();
  });

  test("should render main container", () => {
    const wrapper = screen.getByTestId("token-amount-span");
    expect(wrapper).toBeInTheDocument();
  });

  test("should have correct data", () => {
    const wrapper = screen.getByTestId("token-amount-span");

    const expectedValue = formatCurrency(
      convertFromUnits(
        testData.tokenAmountSpanProps.amountInUnits,
        testData.tokenAmountSpanProps.decimals
      ).toString(),
      "en",
      testData.tokenAmountSpanProps.symbol,
      true
    ).short;
    expect(wrapper).toHaveTextContent(expectedValue);
  });

  test("should have correct title data", () => {
    const wrapper = screen.getByTestId("token-amount-span");

    const expectedValue = formatCurrency(
      convertFromUnits(
        testData.tokenAmountSpanProps.amountInUnits,
        testData.tokenAmountSpanProps.decimals
      ).toString(),
      "en",
      testData.tokenAmountSpanProps.symbol,
      true
    ).long;
    expect(wrapper).toHaveAttribute("title", expectedValue);
  });
});
