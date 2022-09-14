import { getCoverImgSrc } from "@/src/helpers/cover";
import { convertFromUnits, toBN } from "@/utils/bn";
import { formatPercent } from "@/utils/formatter/percent";
import { cleanup, screen, act, render } from "@/utils/unit-tests/test-utils";
import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { ProductCard } from "@/common/Cover/ProductCard";
import { testData } from "@/utils/unit-tests/test-data";
import { i18n } from "@lingui/core";
import { MULTIPLIER } from "@/src/config/constants";
import { formatCurrency } from "@/utils/formatter/currency";

const mockCoverDetails = {
  cover: {
    coverKey:
      "0x6465666900000000000000000000000000000000000000000000000000000000",
    id: "0x6465666900000000000000000000000000000000000000000000000000000000",
    infoObj: {
      about:
        "BB8 Exchange is a global cryptocurrency exchange that lets users from over 140 countries buy and sell over 1200 different digital currencies and tokens. BB8 Exchange offers a simple buy/sell crypto function for beginners as well as a variety of crypto-earning options, in addition to expert cryptocurrency spot and futures trading platforms. On this platform, both novice and expert traders may find what they're looking for.",
      coverName: "Bb8 Exchange Cover",
      links: '{blog: "https://bb8-exchange.medium.com", documenta…}',
      leverage: "10",
      projectName: "",
      tags: '["Smart Contract", "DeFi", "Exchange"]',
      rules:
        "1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\n    2. During your coverage period, the exchange was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.\n    3. This does not have to be your own loss.",
      pricingFloor: 200,
      pricingCeiling: 1400,
      resolutionSources: undefined,
    },
    supportsProducts: true,
  },
  coverKey:
    "0x6465666900000000000000000000000000000000000000000000000000000000",
  id: "0x6465666900000000000000000000000000000000000000000000000000000000-0x31696e6368000000000000000000000000000000000000000000000000000000",
  infoObj: {
    about:
      "The 1inch Network unites decentralized protocols whose synergy enables the most lucrative, fastest, and protected operations in the DeFi space by offering access to hundreds of liquidity sources across multi",
    capitalEfficiency: "9000",
    links: {
      blog: "https://blog.1inch.io/",
      discord: "https://discord.com/invite/1inch",
      documentation: "https://docs.1inch.io/",
      github: "https://github.com/1inch",
      reddit: "https://www.reddit.com/r/1inch/",
      telegram: "https://t.me/OneInchNetwork",
      twitter: "https://twitter.com/1inch",
      website: "https://1inch.io/",
      youtube: "https://www.youtube.com/channel/UCk0nvK4bHpteQXZKv7lkq5w",
    },
    productName: "1inch ",
  },
  productKey:
    "0x31696e6368000000000000000000000000000000000000000000000000000000",
};

const getUtilizationRatio = (totalLiquidity, activeCommitment) => {
  const liquidity = totalLiquidity;
  const protection = activeCommitment;
  const utilization = toBN(liquidity).isEqualTo(0)
    ? "0"
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString();

  return formatPercent(utilization, "en");
};

describe("ProductCard component", () => {
  beforeEach(() => {
    mockFn.useAppConstants();
    mockFn.useRouter();
    mockFn.useSortableStats();
    mockFn.useMyLiquidityInfo();
    mockFn.useFetchCoverStats();

    const { initialRender } = initiateTest(ProductCard, {
      coverKey: mockCoverDetails.coverKey,
      productKey: mockCoverDetails.productKey,
      productInfo: mockCoverDetails,
    });

    initialRender();
  });

  test("should render the outer OutlinedCard", () => {
    const wrapper = screen.getByTestId("card-outline");
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
      const imgSrc = getCoverImgSrc({
        key: mockCoverDetails.productKey,
      });
      const img = screen.getByTestId("cover-img");
      expect(img).toHaveAttribute("src", imgSrc);
    });
  });

  describe("cover badge", () => {
    beforeEach(() => {
      act(() => {
        i18n.activate("en");
      });
    });
    test("should render card status badge 'Incident Occurred'", () => {
      mockFn.useMyLiquidityInfo();

      mockFn.useFetchCoverStats(() => ({
        info: {
          ...testData.coverStats.info,
          productStatus: "Incident Occurred",
        },
        refetch: () => Promise.resolve(testData.coverStats),
      }));

      const { initialRender } = initiateTest(ProductCard, {
        coverKey: mockCoverDetails.coverKey,
        productKey: mockCoverDetails.productKey,
        productInfo: mockCoverDetails,
      });

      initialRender();

      const badgeText = screen.queryByText("Incident Occured");

      expect(badgeText).toBeInTheDocument();
    });

    test("should not render card status badge for 'Normal' status", () => {
      cleanup();

      mockFn.useFetchCoverStats();

      render(
        <ProductCard
          coverKey={mockCoverDetails.coverKey}
          productKey={mockCoverDetails.productKey}
          productInfo={mockCoverDetails}
        />
      );

      expect(screen.queryByTestId("card-badge")).not.toBeInTheDocument();
    });
  });

  test("should render correct project name", () => {
    const projectName = screen.getByTestId("project-name").textContent;
    expect(`${projectName}`).toEqual(mockCoverDetails.infoObj.productName);
  });

  test("should render correct cover fee text", () => {
    const coverFeeEl = screen.getByTestId("cover-fee");
    const coverFee = `Cover fee: ${formatPercent(
      mockCoverDetails.cover.infoObj.pricingFloor / MULTIPLIER,
      "en"
    )}-${formatPercent(
      mockCoverDetails.cover.infoObj.pricingCeiling / MULTIPLIER,
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
