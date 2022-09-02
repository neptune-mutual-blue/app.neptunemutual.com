import { formatCurrency } from "@/src/utils/formatter/currency";

describe("formatCurrency test", () => {
  test("a fraction of currency", () => {
    const formatted = formatCurrency("0.000000001", "en", "USD", true);
    expect(formatted).toMatchObject({
      short: "A fraction of USD",
      long: "A fraction of USD",
    });
  });

  test("negative input", () => {
    const formatted = formatCurrency("-1", "en", "USD", true);
    expect(formatted).toMatchObject({
      short: "-1 USD",
      long: "-1 USD",
    });
  });

  test("Test billion input", () => {
    const formatted = formatCurrency("10000000000", "en", "USD", true);
    expect(formatted).toMatchObject({
      long: "10,000,000,000 USD",
      short: "10B USD",
    });
  });

  test("Test billion input", () => {
    const formatted = formatCurrency("10000000000", "en", "USD");
    expect(formatted).toMatchObject({
      long: "$10,000,000,000.00",
      short: "$10.00B",
    });
  });
});
