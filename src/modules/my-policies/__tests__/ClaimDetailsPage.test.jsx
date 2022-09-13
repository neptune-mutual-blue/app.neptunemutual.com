import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { ClaimDetailsPage } from "@/modules/my-policies/ClaimDetailsPage";
import { screen } from "@testing-library/react";
import { testData } from "@/utils/unit-tests/test-data";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits } from "@/utils/bn";

describe("Claim Details Page loading", () => {
  beforeEach(() => {
    mockFn.useRouter(() => ({
      ...testData.router,
      query: {
        cover_id: "defi",
        product_id: "1inch",
      },
      locale: "en",
    }));
    mockFn.useCoverOrProductData(() => null);
    mockFn.useActivePoliciesByCover();
    mockFn.useFetchReportsByKeyAndDate();
    mockFn.useAppConstants();

    const { initialRender } = initiateTest(ClaimDetailsPage, {});

    initialRender();
  });

  test("should render the loading indicator", () => {
    const loadingText = screen.getByText("loading...");
    expect(loadingText).toBeInTheDocument();
  });
});

describe("Claim Details Page disabled", () => {
  beforeEach(() => {
    mockFn.useRouter(() => ({
      ...testData.router,
      query: {
        cover_id: "defi",
        product_id: "1inch",
      },
      locale: "en",
    }));
    mockFn.useCoverOrProductData();
    mockFn.useActivePoliciesByCover();
    mockFn.useFetchReportsByKeyAndDate();
    mockFn.useAppConstants();

    const { initialRender } = initiateTest(ClaimDetailsPage, {
      disabled: true,
    });

    initialRender();
  });

  test("should render the coming soon indicator", () => {
    const comingSoonText = screen.getByText("Coming soon!");
    expect(comingSoonText).toBeInTheDocument();
  });
});

describe("Claim Details Page", () => {
  beforeEach(() => {
    mockFn.useRouter(() => ({
      ...testData.router,
      query: {
        cover_id: "defi",
        product_id: "1inch",
      },
      locale: "en",
    }));
    mockFn.useCoverOrProductData();
    mockFn.useActivePoliciesByCover();
    mockFn.useFetchReportsByKeyAndDate();
    mockFn.useAppConstants();

    const { initialRender } = initiateTest(ClaimDetailsPage, {});

    initialRender();
  });

  const activeProtection = formatCurrency(
    convertFromUnits(testData.activePoliciesByCover.totalActiveProtection, 6),
    "en",
    "USD"
  ).long;

  test("should render the coming soon indicator", () => {
    const protectionAmount = screen.getByText(activeProtection);
    expect(protectionAmount).toBeInTheDocument();
  });
});
