import React from "react";
import { render, act, cleanup, screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { PoliciesTabs } from "@/modules/my-policies/PoliciesTabs";
import * as ActivePoliciesHook from "@/src/hooks/useActivePolicies";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits } from "@/utils/bn";

const mockFunction = (file, method, returnFn) => {
  jest.spyOn(file, method).mockImplementation(returnFn);
};

describe("PoliciesTab test", () => {
  mockFunction(ActivePoliciesHook, "useActivePolicies", () => ({
    data: {
      totalActiveProtection: "200000000000000000000",
    },
    loading: false,
  }));

  const props = {
    active: "active",
    children: <></>,
  };

  const initialRender = (newProps = {}) => {
    act(() => {
      i18n.activate("en");
    });
    render(<PoliciesTabs {...props} {...newProps} />);
  };

  beforeEach(() => {
    cleanup();
    initialRender();
  });

  test("should render the hero container", () => {
    const hero = screen.getByTestId("hero-container");
    expect(hero).toBeInTheDocument();
  });

  test("should show the `My Policies` text properly", () => {
    const title = screen.getByText("My Policies");
    expect(title).toBeInTheDocument();
  });

  test("should render the herostat title", () => {
    const heroStat = screen.getByText("Total Active Protection");
    expect(heroStat).toBeInTheDocument();
  });

  test("should render the herostat value", () => {
    const value = formatCurrency(
      convertFromUnits("200000000000000000000"),
      "en"
    ).long;
    const heroStatVal = screen.getByText(value);
    expect(heroStatVal).toBeInTheDocument();
  });

  test("should render the TabNav container", () => {
    const tabNav = screen.getByTestId("tab-nav-container");
    expect(tabNav).toBeInTheDocument();
  });
});
