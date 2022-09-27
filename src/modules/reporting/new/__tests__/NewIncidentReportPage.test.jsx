import React from "react";
import {
  render,
  act,
  withProviders,
  fireEvent,
  waitFor,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";
import { NewIncidentReportPage } from "@/modules/reporting/new";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

describe("NewIncidentReportPage.test", () => {
  beforeAll(async () => {
    act(() => {
      i18n.activate("en");
    });
  });

  test("should show incident report form after accepting rules", async () => {
    const router = createMockRouter({
      query: { id: "animated-brands" },
    });

    mockFn.useCoverOrProductData();

    const Component = withProviders(NewIncidentReportPage, router);
    const { getByTestId } = render(<Component />);

    await waitFor(() => {
      expect(getByTestId("accept-report-rules-check-box")).toBeInTheDocument();
    });

    const acceptRulesCheckbox = getByTestId("accept-report-rules-check-box");
    const acceptRulesNextButton = getByTestId(
      "accept-report-rules-next-button"
    );

    fireEvent.click(acceptRulesCheckbox);
    fireEvent.click(acceptRulesNextButton);

    expect(getByTestId("incident-report-form")).toBeInTheDocument();
  });
});
