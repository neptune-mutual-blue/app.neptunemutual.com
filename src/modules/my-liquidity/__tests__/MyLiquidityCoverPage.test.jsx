import React from "react";
import { render, act, cleanup, screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import { MyLiquidityCoverPage } from "@/modules/my-liquidity/details";

import * as RouterHook from "next/router";
import * as AppConstantsHook from "@/src/context/AppConstants";
import * as CoverOrProductDataHook from "@/src/hooks/useCoverOrProductData";
import * as LiquidityFormsContextHook from "@/common/LiquidityForms/LiquidityFormsContext";
import * as CoverActiveReportingsHook from "@/src/hooks/useCoverActiveReportings";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits } from "@/utils/bn";

const mockFunction = (file, method, returnFn) => {
  jest.spyOn(file, method).mockImplementation(returnFn);
};

const mockData = {
  router: {
    query: {
      cover_id: "hicif-bank",
    },

    locale: "en",
  },
  appConstants: {
    liquidityTokenDecimals: 6,
  },
  coverOrProductData: {
    id: "0x68696369662d62616e6b00000000000000000000000000000000000000000000",
    coverKey:
      "0x68696369662d62616e6b00000000000000000000000000000000000000000000",
    supportsProducts: false,
    infoObj: {
      coverName: "Hicif Bank OTC Cover",
      projectName: "Hicif Bank",
      about:
        "Hicif Bank, which was founded in 2017 and is based on the beautiful Portuguese island of Madeira, is one of the world's leading digital banks, aiming to deliver financial solutions to more countries than any other digital bank.",

      links: {
        website: "https://otc.hicifbank.com",
        linkedin: "https://www.linkedin.com/company/hicifbank",
        twitter: "https://twitter.com/hicifbank",
      },
    },
    products: [],
  },
  liquidityFormsContext: {
    accureInterest: jest.fn(),
    isWithdrawalWindowOpen: false,
    info: {
      withdrawalOpen: "1659081765",
      withdrawalClose: "1659085365",
      totalReassurance: "4489008000000",
      vault: "0x98e7786ffF366AEff1A55131C92C4Aa7EDd68aD1",
      stablecoin: "0x5B73fd777f535C5A47CC6eFb45d0cc66308B1468",
      podTotalSupply: "4698126000000000000000000",
      myPodBalance: "500000000000000000000",
      vaultStablecoinBalance: "4698126000000",
      amountLentInStrategies: "0",
      myShare: "500000000",
      myUnrealizedShare: "500000000",
      totalLiquidity: "4698126000000",
      myStablecoinBalance: "180224579590",
      stablecoinTokenSymbol: "DAI",
      vaultTokenDecimals: "18",
      vaultTokenSymbol: "HCF-nDAI",
      minStakeToAddLiquidity: "250000000000000000000",
      myStake: "500000000000000000000",
      isAccrualComplete: "",
    },
  },
  network: {
    networkId: 43113,
  },
  coverActiveReportings: {
    data: [],
  },
};

const initalMocks = () => {
  mockFunction(RouterHook, "useRouter", () => mockData.router);
  mockFunction(
    AppConstantsHook,
    "useAppConstants",
    () => mockData.appConstants
  );
  mockFunction(
    CoverOrProductDataHook,
    "useCoverOrProductData",
    () => mockData.coverOrProductData
  );
  mockFunction(
    LiquidityFormsContextHook,
    "useLiquidityFormsContext",
    () => mockData.liquidityFormsContext
  );
  mockFunction(
    CoverActiveReportingsHook,
    "useCoverActiveReportings",
    () => mockData.coverActiveReportings
  );
};

describe("MyLiquidityTxsTable test", () => {
  const initialRender = (newProps = {}, rerender = false) => {
    if (!rerender) initalMocks();
    act(() => {
      i18n.activate("en");
    });
    render(<MyLiquidityCoverPage {...newProps} />);
  };

  const rerender = (newProps = {}, mockParameters = []) => {
    if (mockParameters.length) {
      mockParameters.map((mock) => {
        mockFunction(mock.file, mock.method, mock.returnFn);
      });
    }

    cleanup();
    initialRender(newProps, true);
  };

  // global.window = Object.create(window);
  // const url = "fuji.test.com";
  // Object.defineProperty(window, "location", {
  //   value: {
  //     host: url,
  //     href: url,
  //   },
  // });

  beforeEach(() => {
    cleanup();
    initialRender();
  });

  test("should render only `loading...` text if coverinfo not loaded", () => {
    rerender({}, [
      {
        file: CoverOrProductDataHook,
        method: "useCoverOrProductData",
        returnFn: () => null,
      },
    ]);
    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  test("should render the main container if coverinfo loaded", () => {
    const wrapper = screen.getByTestId("main-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render the breadcrumbs component", () => {
    const wrapper = screen.getByTestId("breadcrumbs");
    expect(wrapper).toBeInTheDocument();
  });

  test("should not render the diversified profile info for dedicated cover", () => {
    const wrapper = screen.queryByTestId(
      "diversified-coverprofileinfo-container"
    );
    expect(wrapper).not.toBeInTheDocument();
  });

  test("should render dedicated cover profile", () => {
    const wrapper = screen.getByTestId("dedicated-coverprofileinfo-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render the herostat container", () => {
    const wrapper = screen.getByTestId("herostat");
    expect(wrapper).toBeInTheDocument();
  });

  test("Herostat container should have correct description", () => {
    const wrapper = screen.getByTestId("herostat");
    const desc = wrapper.querySelector("p");

    const text = formatCurrency(
      convertFromUnits(
        mockData.liquidityFormsContext.info.myUnrealizedShare,
        mockData.appConstants.liquidityTokenDecimals
      ),
      mockData.router.locale
    ).long;
    expect(desc).toHaveTextContent(text);
  });

  test("should not render CoverProduct component for dedicated cover", () => {
    const wrapper = screen.queryByTestId("cover-product-container");
    expect(wrapper).not.toBeInTheDocument();
  });

  test("should render the SeeMore container", () => {
    const wrapper = screen.getByTestId("see-more-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render the ProvideLiquidity form component", () => {
    const wrapper = screen.getByTestId("provide-liquidity-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render the LiquidityResolution component", () => {
    const wrapper = screen.getByTestId("liquidity-resolution-container");
    expect(wrapper).toBeInTheDocument();
  });
});
