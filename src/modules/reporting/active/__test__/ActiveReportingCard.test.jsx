import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import { testData } from "@/utils/unit-tests/test-data";
import { ActiveReportingCard } from "@/modules/reporting/active/ActiveReportingCard";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { MULTIPLIER } from "@/src/config/constants";
import { formatPercent } from "@/utils/formatter/percent";
import { convertFromUnits, toBN } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { fromNow } from "@/utils/formatter/relative-time";

const incidentReport = testData.reporting.activeReporting[0];

const getUtilizationRatio = (totalLiquidity, activeCommitment) => {
  const liquidity = totalLiquidity;
  const protection = activeCommitment;
  const utilization = toBN(liquidity).isEqualTo(0)
    ? "0"
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString();

  return formatPercent(utilization, "en");
};

describe("Active Reporting Card Loading", () => {
  beforeEach(() => {
    mockFn.useAppConstants();
    mockFn.useCoverOrProductData(() => null);
    mockFn.useMyLiquidityInfo();
    mockFn.useFetchCoverStats();

    const { initialRender } = initiateTest(ActiveReportingCard, {
      id: incidentReport.id,
      coverKey: incidentReport.coverKey,
      productKey: incidentReport.productKey,
      incidentDate: incidentReport.incidentDate,
    });

    initialRender();
  });

  test("should render the card skeleton while no cover or product info is fetched", () => {
    const cardSkeleton = screen.getByTestId("active-report-card-skeleton");
    expect(cardSkeleton).toBeInTheDocument();
  });
});

describe("Active Reporting Card Info", () => {
  beforeEach(() => {
    mockFn.useAppConstants();
    mockFn.useCoverOrProductData();
    mockFn.useMyLiquidityInfo();
    mockFn.useFetchCoverStats();

    const { initialRender } = initiateTest(ActiveReportingCard, {
      id: incidentReport.id,
      coverKey: incidentReport.coverKey,
      productKey: incidentReport.productKey,
      incidentDate: incidentReport.incidentDate,
    });

    initialRender();
  });

  test("should render the card info when cover info loaded", () => {
    const imgContainer = screen.getByTestId("active-report-cover-img");
    const img = imgContainer.querySelector("img");
    const src = getCoverImgSrc({
      key: testData.coverInfo.coverKey,
    });

    expect(img).toHaveAttribute("src", src);

    const coverFee = screen.getByTestId("cover-fee");

    const floor = formatPercent(
      testData.coverInfo.infoObj.pricingFloor / MULTIPLIER,
      testData.router.locale
    );

    const ceiling = formatPercent(
      testData.coverInfo.infoObj.pricingCeiling / MULTIPLIER,
      testData.router.locale
    );

    expect(coverFee).toHaveTextContent(floor);
    expect(coverFee).toHaveTextContent(ceiling);

    const utilRatio = screen.getByTestId("util-ratio");

    const utilizationRatioText = getUtilizationRatio(
      testData.liquidityFormsContext.info.totalLiquidity,
      testData.coverStats.info.activeCommitment
    );

    expect(utilRatio).toHaveTextContent(utilizationRatioText);

    const protection = screen.getByTestId("protection");

    const liquidityText = formatCurrency(
      convertFromUnits(
        testData.coverStats.info.activeCommitment,
        testData.appConstants.liquidityTokenDecimals
      ).toString(),
      "en"
    ).short;

    expect(protection).toHaveTextContent(liquidityText);

    const incidentDate = screen.getByTestId("incident-date");

    const incidentDateText = fromNow(incidentReport.incidentDate);

    expect(incidentDate).toHaveTextContent(incidentDateText);
  });
});
