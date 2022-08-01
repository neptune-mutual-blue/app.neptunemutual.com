import { CoverCard } from "@/common/Cover/CoverCard";
import { MULTIPLIER } from "@/src/config/constants";
import { getCoverImgSrc } from "@/src/helpers/cover";
import * as LiquidityInfoHook from "@/src/hooks/useMyLiquidityInfo";
import * as FetchCoverHook from "@/src/hooks/useFetchCoverStats";
import { convertFromUnits, toBN } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { formatPercent } from "@/utils/formatter/percent";
import { screen, act, render, cleanup } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

const mockLiquidityInfo = {
  amountLentInStrategies: "0",
  isAccrualComplete: "",
  minStakeToAddLiquidity: "250000000000000000000",
  myPodBalance: "1329999988533739826355",
  myShare: "1330000909",
  myStablecoinBalance: "176464876715",
  myStake: "250000000000000000000",
  myUnrealizedShare: "1330000909",
  podTotalSupply: "8044300999575311406559026",
  stablecoin: "0x5B73fd777f535C5A47CC6eFb45d0cc66308B1468",
  stablecoinTokenSymbol: "DAI",
  totalLiquidity: "8044306569013",
  totalReassurance: "332485000000",
  vault: "0x972B237c2E585b940bf814CDCF521053F0a66Fe1",
  vaultStablecoinBalance: "8044306569013",
  vaultTokenDecimals: "18",
  vaultTokenSymbol: "BEC-nDAI",
  withdrawalClose: "1658213413",
  withdrawalOpen: "1658209813",
};

const coverStats = {
  activeCommitment: "29495000000",
  activeIncidentDate: "1658133009",
  availableLiquidity: "11164267175300",
  claimPlatformFee: "650",
  isUserWhitelisted: "",
  productStatus: "Incident Happened",
  reporterCommission: "1000",
  reportingPeriod: "1800",
  requiresWhitelist: "",
  totalPoolAmount: "11193762175300",
};

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

const liquidityTokenDecimals = 6;

const mockFunction = (file, method, returnData) => {
  jest.spyOn(file, method).mockImplementation(() => returnData);
};

describe("CoverCard component", () => {
  mockFunction(LiquidityInfoHook, "useMyLiquidityInfo", {
    info: mockLiquidityInfo,
  });

  mockFunction(FetchCoverHook, "useFetchCoverStats", {
    info: coverStats,
    refetch: () => Promise.resolve(coverStats),
  });

  beforeEach(() => {
    act(() => {
      i18n.activate("en");
    });
    render(
      <CoverCard
        coverKey={mockCoverDetails.coverKey}
        coverInfo={mockCoverDetails}
      />
    );
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
    test("should render card status badge 'Incident Happened'", () => {
      const badgeText = screen.queryByText(coverStats.productStatus);
      expect(badgeText).toBeInTheDocument();
    });

    test("should not render card status badge for 'Normal' status", () => {
      cleanup();
      mockFunction(FetchCoverHook, "useFetchCoverStats", {
        info: { ...coverStats, productStatus: "Normal" },
        refetch: () => Promise.resolve(coverStats),
      });

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
      mockLiquidityInfo.totalLiquidity,
      coverStats.activeCommitment
    );
    const utilizationEl = screen.getByTestId("util-ratio");
    expect(utilizationEl).toHaveTextContent(utilizationRatio);
  });

  describe("Protection", () => {
    test("should render correct protection text", () => {
      const protectionEl = screen.getByTestId("protection");
      const liquidityText = formatCurrency(
        convertFromUnits(
          coverStats.activeCommitment,
          liquidityTokenDecimals
        ).toString(),
        "en"
      ).short;
      expect(protectionEl).toHaveTextContent(liquidityText);
    });

    test("should have correct title text", () => {
      const protectionEl = screen.getByTestId("protection");
      const titleText = formatCurrency(
        convertFromUnits(
          coverStats.activeCommitment,
          liquidityTokenDecimals
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
          mockLiquidityInfo.totalLiquidity,
          liquidityTokenDecimals
        ).toString(),
        "en"
      ).short;

      expect(liquidityEl).toHaveTextContent(liquidityText);
    });

    test("should have correct title text", () => {
      const liquidityEl = screen.getByTestId("liquidity");
      const titleText = formatCurrency(
        convertFromUnits(
          mockLiquidityInfo.totalLiquidity,
          liquidityTokenDecimals
        ).toString(),
        "en"
      ).long;

      expect(liquidityEl).toHaveAttribute("title", titleText);
    });
  });
});
