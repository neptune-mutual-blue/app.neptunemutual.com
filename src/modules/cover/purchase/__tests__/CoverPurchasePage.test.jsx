import React from "react";
import {
  render,
  withProviders,
  fireEvent,
  waitFor,
  screen,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";

import { CoverPurchaseDetailsPage } from "@/modules/cover/purchase/index.jsx";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

describe("CoverPurchasePage.test", () => {
  beforeEach(() => {
    i18n.activate("en");

    mockFn.useCoverOrProductData();

    const Component = withProviders(
      CoverPurchaseDetailsPage,
      createMockRouter({
        query: { cover_id: "animated-brands" },
      })
    );
    render(<Component />);
  });

  test("should show purchase policy form after accepting rules", () => {
    waitFor(() => {
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
