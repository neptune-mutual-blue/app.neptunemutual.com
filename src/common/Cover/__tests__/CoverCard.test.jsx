import { CoverCard } from "@/common/Cover/CoverCard";
import { MULTIPLIER } from "@/src/config/constants";
import { getCoverImgSrc } from "@/src/helpers/cover";
import * as LiquidityInfoHook from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import * as FetchCoverHook from "@/src/hooks/useFetchCoverStats";
import { convertFromUnits, toBN } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { formatPercent } from "@/utils/formatter/percent";
import { screen, act, render, cleanup } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

const mockLiquidityInfo = {
  withdrawalOpen: "1653599608",
  withdrawalClose: "1653603208",
  totalReassurance: "4699071000000000000000000",
  vault: "0x1584bAD9c569d596332eDe934CC46f160b5B0841",
  stablecoin: "0x76061C192fBBBF210d2dA25D4B8aaA34b798ccaB",
  podTotalSupply: "5684166862063574187077743",
  myPodBalance: "250961717477153143329",
  vaultStablecoinBalance: "5401448480506781942050936",
  amountLentInStrategies: "283581108019117810441277",
  myShare: "238479414912922028921",
  myUnrealizedShare: "250999807723261719090",
  totalLiquidity: "5685029588525899752492213",
};

const mockCoverStats = {
  activeIncidentDate: "0",
  claimPlatformFee: "650",
  activeCommitment: "40169729265418543666668",
  isUserWhitelisted: false,
  reporterCommission: "1000",
  reportingPeriod: "1800",
  requiresWhitelist: false,
  status: "Normal",
  totalCommitment: "40169729265418543666668",
  totalPoolAmount: "5685029588525899752492213",
};

const mockCoverDetails = {
  key: "0x6262382d65786368616e67650000000000000000000000000000000000000000",
  coverName: "Bb8 Exchange Cover",
  projectName: "Bb8 Exchange",
  tags: '["Smart Contract", "DeFi", "Exchange"]',
  about:
    "BB8 Exchange is a global cryptocurrency exchange that lets users from over 140 countries buy and sell over 1200 different digital currencies and tokens. BB8 Exchange offers a simple buy/sell crypto function for beginners as well as a variety of crypto-earning options, in addition to expert cryptocurrency spot and futures trading platforms. On this platform, both novice and expert traders may find what they're looking for.",
  rules:
    "1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\n    2. During your coverage period, the exchange was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.\n    3. This does not have to be your own loss.",
  links: '{blog: "https://bb8-exchange.medium.com", documenta…}',
  pricingFloor: 200,
  pricingCeiling: 1400,
  reportingPeriod: 1800,
  cooldownPeriod: 300,
  claimPeriod: 1800,
  minReportingStake: "5000000000000000000000",
  resolutionSources: '["https://twitter.com/BB8Exchange", "https://twitte…]',
  stakeWithFees: "50000000000000000000000",
  reassurance: "20000000000000000000000",
  liquidity: "5685029588525899752492213",
  utilization: "0.01",
};

const getUtilizationRatio = (totalLiquidity, activeCommitment) => {
  const liquidity = totalLiquidity;
  const protection = activeCommitment;
  const utilization = toBN(liquidity).isEqualTo(0)
    ? "0"
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString();

  return formatPercent(utilization, "en");
};

const mockFunction = (file, method, returnData) => {
  jest.spyOn(file, method).mockImplementation(() => returnData);
};

describe("CoverCard component", () => {
  mockFunction(LiquidityInfoHook, "useMyLiquidityInfo", {
    info: mockLiquidityInfo,
  });

  mockFunction(FetchCoverHook, "useFetchCoverStats", mockCoverStats);

  beforeEach(() => {
    act(() => {
      i18n.activate("en");
    });
    render(<CoverCard details={mockCoverDetails} />);
  });

  test("should render the outer OutlineCard", () => {
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
      const imgSrc = getCoverImgSrc({ key: mockCoverDetails.key });
      const img = screen.getByTestId("cover-img");
      expect(img).toHaveAttribute("src", imgSrc);
    });
  });

  describe("cover badge", () => {
    test("should not render card status badge if status is 'Normal'", () => {
      const badgeText = screen.queryByText(mockCoverStats.status);
      expect(badgeText).not.toBeInTheDocument();
    });

    test("should render card status badge if status is not 'Normal'", () => {
      cleanup();
      mockFunction(FetchCoverHook, "useFetchCoverStats", {
        ...mockCoverStats,
        status: "Fraud",
      });
      render(<CoverCard details={mockCoverDetails} />);
      const badgeText = screen.getByText("Fraud");
      expect(badgeText).toBeInTheDocument();
    });
  });

  test("should render correct project name", () => {
    const projectName = screen.getByTestId("project-name");
    expect(projectName).toHaveTextContent(mockCoverDetails.projectName);
  });

  test("should render correct cover fee text", () => {
    const coverFeeEl = screen.getByTestId("cover-fee");
    const coverFee = `Cover fee: ${formatPercent(
      mockCoverDetails.pricingFloor / MULTIPLIER,
      "en"
    )}-${formatPercent(mockCoverDetails.pricingCeiling / MULTIPLIER, "en")}`;
    expect(coverFeeEl).toHaveTextContent(coverFee);
  });

  test("should render correct utilization ratio", () => {
    const utilizationRatio = getUtilizationRatio(
      mockLiquidityInfo.totalLiquidity,
      mockCoverStats.activeCommitment
    );
    const utilizationEl = screen.getByTestId("util-ratio");
    expect(utilizationEl).toHaveTextContent(utilizationRatio);
  });

  describe("Protection", () => {
    test("should render correct protection text", () => {
      const protectionEl = screen.getByTestId("protection");
      const liquidityText = `Protection: ${
        formatCurrency(
          convertFromUnits(mockCoverStats.activeCommitment).toString(),
          "en"
        ).short
      }`;

      expect(protectionEl).toHaveTextContent(liquidityText);
    });

    test("should have correct title text", () => {
      const protectionEl = screen.getByTestId("protection");
      const titleText = formatCurrency(
        convertFromUnits(mockCoverStats.activeCommitment).toString(),
        "en"
      ).long;
      expect(protectionEl).toHaveAttribute("title", titleText);
    });
  });

  describe("Liquidity", () => {
    test("should render correct liquidity text", () => {
      const liquidityEl = screen.getByTestId("liquidity");
      const liquidityText = `Liquidity: ${
        formatCurrency(
          convertFromUnits(mockLiquidityInfo.totalLiquidity).toString(),
          "en"
        ).short
      }`;

      expect(liquidityEl).toHaveTextContent(liquidityText);
    });

    test("should have correct title text", () => {
      const liquidityEl = screen.getByTestId("liquidity");
      const titleText = formatCurrency(
        convertFromUnits(mockLiquidityInfo.totalLiquidity).toString(),
        "en"
      ).long;
      expect(liquidityEl).toHaveAttribute("title", titleText);
    });
  });
});
