import React from "react";
import { render, act, cleanup, screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import { MyLiquidityCoverPage } from "@/modules/my-liquidity/details";

import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits } from "@/utils/bn";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

const initalMocks = () => {
  mockFn.useRouter();
  mockFn.useAppConstants();
  mockFn.useCoverOrProductData();
  mockFn.useLiquidityFormsContext();
  mockFn.useCoverActiveReportings();
};

describe("MyLiquidityTxsTable test", () => {
  const initialRender = (newProps = {}, rerender = false) => {
    if (!rerender) initalMocks();
    act(() => {
      i18n.activate("en");
    });
    render(<MyLiquidityCoverPage {...newProps} />);
  };

  const rerender = (newProps = {}, mocks = () => {}) => {
    mocks();

    cleanup();
    initialRender(newProps, true);
  };

  beforeEach(() => {
    cleanup();
    initialRender();
  });

  test("should render only `loading...` text if coverinfo not loaded", () => {
    rerender({}, () => {
      mockFn.useCoverOrProductData(() => null);
    });
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
        testData.liquidityFormsContext.info.myUnrealizedShare,
        testData.appConstants.liquidityTokenDecimals
      ),
      testData.router.locale
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
