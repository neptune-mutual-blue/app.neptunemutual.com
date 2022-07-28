import React from "react";
import {
  render,
  screen,
  cleanup,
  fireEvent,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { AvailableCovers } from "@/modules/home/AvailableCovers";
import * as Covers from "@/src/hooks/useCovers";
import * as Diversified from "@/src/hooks/useFlattenedCoverProducts";
import * as CoverOrProductData from "@/src/hooks/useCoverOrProductData";
import { CARDS_PER_PAGE } from "@/src/config/constants";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";

const availableCovers = [
  {
    id: "0x616e696d617465642d6272616e64730000000000000000000000000000000001",
    coverKey:
      "0x616e696d617465642d6272616e64730000000000000000000000000000000001",
    coverName: "Animated Brands",
    projectName: "Animated Brands",
    tags: ["Smart Contract", "NFT", "Gaming"],
  },
  {
    id: "0x6262382d65786368616e67650000000000000000000000000000000000000002",
    coverKey:
      "0x6262382d65786368616e67650000000000000000000000000000000000000002",
    coverName: "Bb8 Exchange Cover",
    projectName: "Bb8 Exchange",
    tags: ["Smart Contract", "DeFi", "Exchange"],
  },
  {
    id: "0x616e696d617465642d6272616e64730000000000000000000000000000000003",
    coverKey:
      "0x616e696d617465642d6272616e64730000000000000000000000000000000003",
    coverName: "Animated Brands",
    projectName: "Animated Brands",
    tags: ["Smart Contract", "NFT", "Gaming"],
  },
  {
    id: "0x6262382d65786368616e67650000000000000000000000000000000000000004",
    coverKey:
      "0x6262382d65786368616e67650000000000000000000000000000000000000004",
    coverName: "Bb8 Exchange Cover",
    projectName: "Bb8 Exchange",
    tags: ["Smart Contract", "DeFi", "Exchange"],
  },
  {
    id: "0x616e696d617465642d6272616e64730000000000000000000000000000000005",
    coverKey:
      "0x616e696d617465642d6272616e64730000000000000000000000000000000005",
    coverName: "Animated Brands",
    projectName: "Animated Brands",
    tags: ["Smart Contract", "NFT", "Gaming"],
  },
  {
    id: "0x6262382d65786368616e67650000000000000000000000000000000000000006",
    coverKey:
      "0x6262382d65786368616e67650000000000000000000000000000000000000006",
    coverName: "Bb8 Exchange Cover",
    projectName: "Bb8 Exchange",
    tags: ["Smart Contract", "DeFi", "Exchange"],
  },
  {
    id: "0x616e696d617465642d6272616e64730000000000000000000000000000000007",
    coverKey:
      "0x616e696d617465642d6272616e64730000000000000000000000000000000007",
    coverName: "Animated Brands",
    projectName: "Animated Brands",
    tags: ["Smart Contract", "NFT", "Gaming"],
  },
  {
    id: "0x6262382d65786368616e67650000000000000000000000000000000000000008",
    coverKey:
      "0x6262382d65786368616e67650000000000000000000000000000000000000008",
    coverName: "Bb8 Exchange Cover",
    projectName: "Bb8 Exchange",
    tags: ["Smart Contract", "DeFi", "Exchange"],
  },
  {
    id: "0x616e696d617465642d6272616e64730000000000000000000000000000000009",
    coverKey:
      "0x616e696d617465642d6272616e64730000000000000000000000000000000009",
    coverName: "Animated Brands",
    projectName: "Animated Brands",
    tags: ["Smart Contract", "NFT", "Gaming"],
  },
  {
    id: "0x6262382d65786368616e67650000000000000000000000000000000000000010",
    coverKey:
      "0x6262382d65786368616e67650000000000000000000000000000000000000010",
    coverName: "Bb8 Exchange Cover",
    projectName: "Bb8 Exchange",
    tags: ["Smart Contract", "DeFi", "Exchange"],
  },
];

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

const mockFunction = (file, method, returnData) => {
  jest.spyOn(file, method).mockImplementation(() => returnData);
};

describe("AvailableCovers test", () => {
  beforeEach(() => {
    i18n.activate("en");

    mockFunction(Covers, "useCovers", {
      data: availableCovers,
      loading: false,
    });

    mockFunction(Diversified, "useFlattenedCoverProducts", {
      data: availableCovers,
      loading: false,
    });

    mockFunction(CoverOrProductData, "useCoverOrProductData", mockCoverDetails);

    render(<AvailableCovers />);
  });

  test("should render the component correctly", () => {
    const wrapper = screen.getByTestId("available-covers-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render the `Cover Products` text element", () => {
    const wrapper = screen.getByText("Cover Products");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render the SearchAndSortBar component", () => {
    const wrapper = screen.getByTestId("search-and-sort-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render correct no. of cover links", () => {
    const links = screen.getAllByTestId("cover-link");
    expect(links.length).toBe(CARDS_PER_PAGE);
  });

  test("should render correct cover link href", () => {
    const href = `covers/${safeParseBytes32String(
      availableCovers[0].id
    )}/options`;
    const link = screen.getAllByTestId("cover-link")[0];
    expect(link).toHaveAttribute("href", href);
  });

  test("should render `Show More` button by default", () => {
    const btn = screen.getByTestId("show-more-button");
    expect(btn).toBeInTheDocument();
  });

  test("should show more cover cards on `Show More` button click", () => {
    const btn = screen.getByTestId("show-more-button");
    fireEvent.click(btn);

    const coverNumbers =
      availableCovers.length >= CARDS_PER_PAGE * 2
        ? CARDS_PER_PAGE * 2
        : availableCovers.length;
    const links = screen.getAllByTestId("cover-link");
    expect(links.length).toBe(coverNumbers);
  });

  test("should render the `No data found` if not loading & no available covers", async () => {
    cleanup();

    mockFunction(Covers, "useCovers", {
      data: [],
      loading: false,
    });
    mockFunction(Diversified, "useFlattenedCoverProducts", {
      data: [],
      loading: false,
    });

    render(<AvailableCovers />);

    const wrapper = screen.getByTestId("no-data");
    expect(wrapper).toBeInTheDocument();
  });

  test("testing by setting the `loading` state to true", () => {
    cleanup();

    mockFunction(Covers, "useCovers", {
      data: [],
      loading: true,
    });

    mockFunction(Diversified, "useFlattenedCoverProducts", {
      data: [],
      loading: true,
    });

    render(<AvailableCovers />);
    const noData = screen.queryByTestId("no-data");
    expect(noData).not.toBeInTheDocument();
    const links = screen.queryAllByTestId("cover-link");
    expect(links.length).toBe(0);
  });

  test("simulating input search", () => {
    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "Animated" } });
    expect(input).toBeInTheDocument();
  });
});
