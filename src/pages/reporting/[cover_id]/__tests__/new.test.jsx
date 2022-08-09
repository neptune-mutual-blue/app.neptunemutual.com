import React from "react";
import { render, waitFor } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import ReportingNewCoverPage from "@/pages/reporting/[cover_id]/new";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

describe("New Reporting Page", () => {
  beforeEach(async () => {
    i18n.activate("en");

    mockFn.useCoverOrProductData();
  });

  test("should render resolved reporting", async () => {
    const screen = render(
      <ReportingNewCoverPage />,
      createMockRouter({
        query: { cover_id: "animated-brands" },
      })
    );
    const acceptRules = screen.getByTestId("accept-report-rules-check-box");
    await waitFor(() => {
      expect(acceptRules).toBeInTheDocument();
    });
  });

  test("should render coming soon if reporting feature is disabled", () => {
    const screen = render(<ReportingNewCoverPage disabled={true} />);
    const links = screen.getByText(/Coming soon!/i);
    expect(links).toBeInTheDocument();
  });
});
