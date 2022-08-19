import { screen } from "@/utils/unit-tests/test-utils";
import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { ActiveReportingCard } from "@/modules/reporting/active/ActiveReportingCard";
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
  stakeWithFees: "5000000000000000000000",
  reassurance: "20000000000000000000000",
  liquidity: "5685029588525899752492213",
  utilization: "0.01",
  products: [],
  supportsProducts: false,
};

const cardProps = {
  id: `${mockCoverDetails.coverKey}-0x0000000000000000000000000000000000000000000000000000000000000000-1658984960`,
  coverKey: mockCoverDetails.coverKey,
  incidentDate: "1658984960",
};

describe("ActiveReportingCard component", () => {
  beforeEach(() => {
    mockFn.useRouter();

    const { initialRender } = initiateTest(ActiveReportingCard, cardProps);

    initialRender();
  });

  test("should render the card skeleton", () => {
    const wrapper = screen.getByTestId("active-report-card-skeleton");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render card status badge 'Incident Occurred'", async () => {
    mockFn.useCoverOrProductData();
    mockFn.useFetchCoverStats(() => ({
      info: {
        ...testData.coverStats.info,
        productStatus: "Incident Occurred",
      },
      refetch: () => Promise.resolve(testData.coverStats),
    }));

    const { initialRender } = initiateTest(ActiveReportingCard, cardProps);

    initialRender();

    const badgeText = screen.getByTestId("card-badge");

    expect(badgeText).toBeInTheDocument();
  });
});
