import React from "react";
import {
  render,
  waitFor,
  screen,
  fireEvent,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import { CoverPurchaseDetailsPage } from "@/modules/cover/purchase/index.jsx";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { act } from "react-dom/test-utils";

describe("CoverPurchasePage.test", () => {
  beforeEach(() => {
    act(() => {
      i18n.activate("en");
    });

    mockFn.useAppConstants();
    mockFn.useMyLiquidityInfo();
    mockFn.useCoverOrProductData();
    mockFn.useCoverStatsContext();
    // mockFn.useValidateReferralCode();
    mockFn.useRouter();

    render(<CoverPurchaseDetailsPage />);
  });

  test("should show purchase policy form after accepting rules", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("accept-rules-check-box")).toBeInTheDocument();
    });

    const acceptRulesCheckbox = screen.getByTestId("accept-rules-check-box");
    const acceptRulesNextButton = screen.getByTestId(
      "accept-rules-next-button"
    );

    fireEvent.click(acceptRulesCheckbox);
    fireEvent.click(acceptRulesNextButton);

    expect(screen.getByTestId("purchase-policy-form")).toBeInTheDocument();
  });
});
