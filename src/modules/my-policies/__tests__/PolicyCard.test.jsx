import React from "react";
import { render, act, cleanup, screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { PolicyCard } from "@/modules/my-policies/PolicyCard";

import * as ValidReportHook from "@/src/hooks/useValidReport";
import * as ERC20BalanceHook from "@/src/hooks/useERC20Balance";
import * as FetchCoverStatsHook from "@/src/hooks/useFetchCoverStats";
import * as CoverOrProductDataHook from "@/src/hooks/useCoverOrProductData";
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

const mockCoverStats = {
  info: {
    activeIncidentDate: "0",
    claimPlatformFee: "650",
    activeCommitment: "900000000",
    isUserWhitelisted: "",
    reporterCommission: "1000",
    reportingPeriod: "1800",
    requiresWhitelist: "",
    productStatus: "Normal",
    totalPoolAmount: "7762051028549",
    availableLiquidity: "7761151028549",
  },
};

const mocks = () => {
  mockFunction(
    CoverOrProductDataHook,
    "useCoverOrProductData",
    () => mockCoverInfo
  );

  mockFunction(FetchCoverStatsHook, "useFetchCoverStats", () => mockCoverStats);

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
        "0x6372706f6f6c0000000000000000000000000000000000000000000000000000",
      productKey:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      cover: {
        id: "0x6372706f6f6c0000000000000000000000000000000000000000000000000000",
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

  const rerender = (newProps = {}, mockParameters = []) => {
    if (mockParameters.length) {
      mockParameters.map((mock) => {
        mockFunction(mock.file, mock.method, mock.returnFn);
      });
    }

    cleanup();
    initialRender(newProps, false);
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
    rerender({}, [
      {
        file: CoverOrProductDataHook,
        method: "useCoverOrProductData",
        returnFn: () => null,
      },
    ]);

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
      const src = getCoverImgSrc({ key: mockCoverInfo.coverKey });
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
      const status = screen.getByTestId("policy-card-status");
      expect(status).toHaveTextContent("");
    });

    test("should display status badge if status is not 'Normal'", () => {
      rerender({}, [
        {
          file: FetchCoverStatsHook,
          method: "useFetchCoverStats",
          returnFn: () => ({
            info: {
              ...mockCoverStats.info,
              productStatus: "Claimable",
            },
          }),
        },
        {
          file: ValidReportHook,
          method: "useValidReport",
          returnFn: () => ({
            data: {
              report: {
                ...mockValidReport.data.report,
                status: "Claimable",
              },
            },
          }),
        },
      ]);
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
