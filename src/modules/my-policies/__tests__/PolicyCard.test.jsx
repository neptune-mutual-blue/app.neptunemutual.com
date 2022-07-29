import React from "react";
import { render, act, cleanup, screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { PolicyCard } from "@/modules/my-policies/PolicyCard";

import * as ValidReportHook from "@/src/hooks/useValidReport";
import * as ERC20BalanceHook from "@/src/hooks/useERC20Balance";
import * as FetchCoverStatsHook from "@/src/hooks/useFetchCoverStats";
import * as CoverOrProductDataHook from "@/src/hooks/useCoverOrProductData";
import * as CoverOrProductData from "@/src/hooks/useCoverOrProductData";
import { getCoverImgSrc } from "@/src/helpers/cover";

const mockFunction = (file, method, returnFn) => {
  jest.spyOn(file, method).mockImplementation(returnFn);
};

const mockCoverInfo = {
  id: "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
  coverKey:
    "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
  supportsProducts: false,
  ipfsHash: "QmTK8RzfNuzLrqzRepKKWQxPi1hEc6JTdzJ9bFhyW6xmAR",
  ipfsData:
    '{\n  "key": "0x616e696d617465642d6272616e64730000000000000000000000000000000000",\n  "coverName": "Animated Brands",\n  "projectName": "Animated Brands",\n  "vault": {\n    "name": "Animated Brands POD",\n    "symbol": "AB-nDAI"\n  },\n  "requiresWhitelist": false,\n  "supportsProducts": false,\n  "leverage": "1",\n  "tags": [\n    "Smart Contract",\n    "NFT",\n    "Gaming"\n  ],\n  "about": "Animated Brands is a Thailand based gaming company, and a venture capitalist firm founded in 2017 by Jack D\'Souza. It was listed on Singapore Exchange (SGX) from 23rd May, 2019.",\n  "rules": "1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\\n    3. This does not have to be your own loss.",\n  "exclusions": "",\n  "links": {\n    "website": "https://www.animatedbrands.com",\n    "twitter": "https://twitter.com/animatedbrands",\n    "blog": "https://animatedbrands.medium.com",\n    "linkedin": "https://www.linkedin.com/company/animated-brands"\n  },\n  "pricingFloor": "700",\n  "pricingCeiling": "2400",\n  "reportingPeriod": 1800,\n  "cooldownPeriod": 300,\n  "claimPeriod": 1800,\n  "minReportingStake": "3400000000000000000000",\n  "resolutionSources": [\n    "https://twitter.com/animatedbrands",\n    "https://twitter.com/neptunemutual"\n  ],\n  "stakeWithFees": "50000000000000000000000",\n  "reassurance": "10000000000",\n  "reassuranceRate": "2500"\n}',
  infoObj: {
    coverName: "Animated Brands",
    projectName: "Animated Brands",
    leverage: "1",
    tags: ["Smart Contract", "NFT", "Gaming"],
    about:
      "Animated Brands is a Thailand based gaming company, and a venture capitalist firm founded in 2017 by Jack D'Souza. It was listed on Singapore Exchange (SGX) from 23rd May, 2019.",
    rules:
      "1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\n    3. This does not have to be your own loss.",
    exclusions: "",
    links: {
      website: "https://www.animatedbrands.com",
      twitter: "https://twitter.com/animatedbrands",
      blog: "https://animatedbrands.medium.com",
      linkedin: "https://www.linkedin.com/company/animated-brands",
    },
    pricingFloor: "700",
    pricingCeiling: "2400",
    resolutionSources: [
      "https://twitter.com/animatedbrands",
      "https://twitter.com/neptunemutual",
    ],
  },
  products: [],
};

const mockValidReport = {
  data: {
    report: {
      incidentDate: "1654263563",
      resolutionDeadline: "1654265793",
      status: "Normal",
      claimBeginsFrom: "1654265794",
      claimExpiresAt: "1654267594",
    },
  },
};

const coverStats = {
  activeCommitment: "29495000000",
  activeIncidentDate: "1658133009",
  availableLiquidity: "11164267175300",
  claimPlatformFee: "650",
  isUserWhitelisted: "",
  productStatus: "Normal",
  reporterCommission: "1000",
  reportingPeriod: "1800",
  requiresWhitelist: "",
  totalPoolAmount: "11193762175300",
};

const mockCoverDetails = {
  coverKey:
    "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
  infoObj: {
    about:
      "BB8 Exchange is a global cryptocurrency exchange that lets users from over 140 countries buy and sell over 1200 different digital currencies and tokens. BB8 Exchange offers a simple buy/sell crypto function for beginners as well as a variety of crypto-earning options, in addition to expert cryptocurrency spot and futures trading platforms. On this platform, both novice and expert traders may find what they're looking for.",
    coverName: "Bb8 Exchange Cover",
    links: '{blog: "https://bb8-exchange.medium.com", documenta…}',
    leverage: "1",
    projectName: "Animated Brands",
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

const mocks = () => {
  mockFunction(
    CoverOrProductDataHook,
    "useCoverOrProductData",
    () => mockCoverInfo
  );

  mockFunction(FetchCoverStatsHook, "useFetchCoverStats", () => ({
    info: coverStats,
    refetch: () => Promise.resolve(coverStats),
  }));

  mockFunction(
    CoverOrProductData,
    "useCoverOrProductData",
    () => mockCoverDetails
  );

  mockFunction(
    ValidReportHook,
    "useValidReport",
    jest.fn(() => mockValidReport)
  );

  mockFunction(ERC20BalanceHook, "useERC20Balance", () => ({
    balance: "1400000000000000000000",
  }));
};

describe("PolicyCard test", () => {
  const props = {
    policyInfo: {
      id: "0x03b4658fa53bdac8cedd7c4cec3e41ca9777db84-0x5712114cfbc297158a7d7a1142aa82da69de6dbc-1664582399",
      cxToken: {
        id: "0x5712114cfbc297158a7d7a1142aa82da69de6dbc",
        creationDate: "1658377325",
        expiryDate: "1659076653",
      },
      totalAmountToCover: "1000000000",
      expiresOn: "1664582399",
      coverKey:
        "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
      productKey:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      cover: {
        id: "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
      },
      product: null,
    },
  };

  const initialRender = (newProps = {}, runMocks = true) => {
    if (runMocks) mocks();
    act(() => {
      i18n.activate("en");
    });
    render(<PolicyCard {...props} {...newProps} />);
  };

  beforeEach(() => {
    cleanup();
    initialRender();
  });

  test("should render the main container", () => {
    const hero = screen.getByTestId("policy-card");
    expect(hero).toBeInTheDocument();
  });

  test("should not render the main container if coveInfo is not available", () => {
    cleanup();
    mockFunction(CoverOrProductData, "useCoverOrProductData", () => null);

    render(<PolicyCard {...props} />);

    const hero = screen.queryByTestId("policy-card");
    expect(hero).not.toBeInTheDocument();
  });

  describe("Cover Image", () => {
    test("should render the cover image", () => {
      const coverImage = screen.getByTestId("cover-img");
      expect(coverImage).toBeInTheDocument();
    });

    test("cover image should have correct src", () => {
      const coverImage = screen.getByTestId("cover-img");
      const src = getCoverImgSrc({
        key: "0x6262382d65786368616e67650000000000000000000000000000000000000000",
      });
      expect(coverImage).toHaveAttribute("src", src);
    });

    test("cover image should have correct alt text", () => {
      const coverImage = screen.getByTestId("cover-img");
      const text = mockCoverInfo.infoObj.coverName;
      expect(coverImage).toHaveAttribute("alt", text);
    });
  });

  describe("Status badge", () => {
    test("should not display anything if status is 'Normal'", () => {
      cleanup();
      mockFunction(ValidReportHook, "useValidReport", () => ({
        ...mockValidReport,
        data: {
          ...mockValidReport.data,
          report: {
            ...mockValidReport.data.report,
            status: "Normal",
          },
        },
      }));

      render(<PolicyCard {...props} />);

      const status = screen.getByTestId("policy-card-status");
      expect(status).toHaveTextContent("");
    });

    test("should display status badge if status is not 'Normal'", () => {
      cleanup();
      const claimableCoverState = Object.assign({}, coverStats, {
        productStatus: "Claimable",
      });
      mockFunction(FetchCoverStatsHook, "useFetchCoverStats", () => ({
        info: claimableCoverState,
        refetch: () => Promise.resolve(claimableCoverState),
      }));
      mockFunction(ValidReportHook, "useValidReport", () => mockValidReport);
      render(<PolicyCard {...props} />);

      const status = screen.getByTestId("policy-card-status");
      expect(status).toHaveTextContent("Claimable");
    });
  });

  test("should dsplay correct policy card title", () => {
    const title = screen.getByTestId("policy-card-title");
    expect(title).toHaveTextContent(mockCoverInfo.infoObj.coverName);
  });

  test("should render policy card footer", () => {
    const footer = screen.getByTestId("policy-card-footer");
    expect(footer).toBeInTheDocument();
  });
});
