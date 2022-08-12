import { CoverCard } from "@/common/Cover/CoverCard";
import { MULTIPLIER } from "@/src/config/constants";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { convertFromUnits, toBN } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { formatPercent } from "@/utils/formatter/percent";
import { screen, render, cleanup } from "@/utils/unit-tests/test-utils";
import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { testData } from "@/utils/unit-tests/test-data";

const mockCoverDetails = {
  coverKey:
    "0x6262382d65786368616e67650000000000000000000000000000000000000000",
  infoObj: {
    about:
      "BB8 Exchange is a global cryptocurrency exchange that lets users from over 140 countries buy and sell over 1200 different digital currencies and tokens. BB8 Exchange offers a simple buy/sell crypto function for beginners as well as a variety of crypto-earning options, in addition to expert cryptocurrency spot and futures trading platforms. On this platform, both novice and expert traders may find what they're looking for.",
    coverName: "Bb8 Exchange Cover",
    links: '{blog: "https://bb8-exchange.medium.com", documenta…}',
    leverage: "1",
    projectName: "Bb8 Exchange",
    tags: '["Smart Contract", "DeFi", "Exchange"]',
    rules:
      "1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\n    2. During your coverage period, the exchange was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.\n    3. This does not have to be your own loss.",
    pricingFloor: 200,
    pricingCeiling: 1400,
    resolutionSources: '["https://twitter.com/BB8Exchange", "https://twitte…]',
  },
  reportingPeriod: 1800,
  cooldownPeriod: 300,
  claimPeriod: 1800,
  minReportingStake: "5000000000000000000000",
  stakeWithFees: "50000000000000000000000",
  reassurance: "20000000000000000000000",
  liquidity: "5685029588525899752492213",
  utilization: "0.01",
  products: [],
  supportsProducts: false,
};

const getUtilizationRatio = (totalLiquidity, activeCommitment) => {
  const liquidity = totalLiquidity;
  const protection = activeCommitment;
  const utilization = toBN(liquidity).isEqualTo(0)
    ? "0"
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString();

  return formatPercent(utilization, "en");
};

describe("CoverCard component", () => {
  beforeEach(() => {
    mockFn.useAppConstants();
    mockFn.useRouter();
    mockFn.useMyLiquidityInfo();
    mockFn.useFetchCoverStats();

    const { initialRender } = initiateTest(CoverCard, {
      coverKey: mockCoverDetails.coverKey,
      coverInfo: mockCoverDetails,
    });

    initialRender();
  });

  test("should render the outer OutlinedCard", () => {
    const wrapper = screen.getByTestId("card-skeleton");
    expect(wrapper).toBeInTheDocument();
  });

  describe("cover image", () => {
    test("should render cover image without fail", () => {
      const img = screen.getByTestId("cover-img");
      expect(img).toBeInTheDocument();
    });

    test("should have correct image alt text", () => {
      const img = screen.getByTestId("cover-img");
      expect(img).toHaveAttribute("alt", mockCoverDetails.projectName);
    });

    test("should have correct image src", () => {
      const imgSrc = getCoverImgSrc({ key: mockCoverDetails.coverKey });
      const img = screen.getByTestId("cover-img");
      expect(img).toHaveAttribute("src", imgSrc);
    });
  });

  describe("cover badge", () => {
    test("should render card status badge 'Incident Occurred'", () => {
      mockFn.useMyLiquidityInfo();

      mockFn.useFetchCoverStats(() => ({
        info: {
          ...testData.coverStats.info,
          productStatus: "Incident Occurred",
        },
        refetch: () => Promise.resolve(testData.coverStats),
      }));

      const { initialRender } = initiateTest(CoverCard, {
        coverKey: mockCoverDetails.coverKey,
        coverInfo: mockCoverDetails,
      });

      initialRender();

      const badgeText = screen.queryByText("Incident Occured");

      expect(badgeText).toBeInTheDocument();
    });

    test("should not render card status badge for 'Normal' status", () => {
      cleanup();
      mockFn.useFetchCoverStats();

      render(
        <CoverCard
          coverKey={mockCoverDetails.coverKey}
          coverInfo={mockCoverDetails}
        />
      );

      expect(screen.queryByTestId("card-badge")).not.toBeInTheDocument();
    });
  });

  test("should render correct project name", () => {
    const projectName = screen.getByTestId("project-name").textContent;
    expect(`${projectName} Cover`).toEqual(mockCoverDetails.infoObj.coverName);
  });

  test("should render correct cover fee text", () => {
    const coverFeeEl = screen.getByTestId("cover-fee");
    const coverFee = `Cover fee: ${formatPercent(
      mockCoverDetails.infoObj.pricingFloor / MULTIPLIER,
      "en"
    )}-${formatPercent(
      mockCoverDetails.infoObj.pricingCeiling / MULTIPLIER,
      "en"
    )}`;

    expect(coverFeeEl).toHaveTextContent(coverFee);
  });

  test("should render correct utilization ratio", () => {
    const utilizationRatio = getUtilizationRatio(
      testData.liquidityFormsContext.info.totalLiquidity,
      testData.coverStats.info.activeCommitment
    );
    const utilizationEl = screen.getByTestId("util-ratio");
    expect(utilizationEl).toHaveTextContent(utilizationRatio);
  });

  describe("Protection", () => {
    test("should render correct protection text", () => {
      const protectionEl = screen.getByTestId("protection");
      const liquidityText = formatCurrency(
        convertFromUnits(
          testData.coverStats.info.activeCommitment,
          testData.appConstants.liquidityTokenDecimals
        ).toString(),
        "en"
      ).short;
      expect(protectionEl).toHaveTextContent(liquidityText);
    });

    test("should have correct title text", () => {
      const protectionEl = screen.getByTestId("protection");
      const titleText = formatCurrency(
        convertFromUnits(
          testData.coverStats.info.activeCommitment,
          testData.appConstants.liquidityTokenDecimals
        ).toString(),
        "en"
      ).long;
      expect(protectionEl).toHaveAttribute("title", titleText);
    });
  });

  describe("Liquidity", () => {
    test("should render correct liquidity text", () => {
      const liquidityEl = screen.getByTestId("liquidity");
      const liquidityText = formatCurrency(
        convertFromUnits(
          testData.coverStats.info.availableLiquidity,
          testData.appConstants.liquidityTokenDecimals
        ).toString(),
        "en"
      ).short;

      expect(liquidityEl).toHaveTextContent(liquidityText);
    });

    test("should have correct title text", () => {
      const liquidityEl = screen.getByTestId("liquidity");

      const liquidity = toBN(testData.coverStats.info.availableLiquidity)
        .plus(testData.coverStats.info.activeCommitment)
        .toString();

      const titleText = formatCurrency(
        convertFromUnits(
          liquidity,
          testData.appConstants.liquidityTokenDecimals
        ).toString(),
        "en"
      ).long;

      expect(liquidityEl).toHaveAttribute("title", titleText);
    });
  });
});
