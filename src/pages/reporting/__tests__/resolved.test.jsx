import React from "react";
import { render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import ReportingResolved from "@/pages/reporting/resolved.page";

describe("Active Reporting Page", () => {
  beforeEach(async () => {
    i18n.activate("en");
  });

  test("should render resolved reporting", () => {
    const screen = render(<ReportingResolved />);
    const links = screen.container.getElementsByClassName("text-4e7dd9");
    expect(links).toHaveLength(1);
    expect(links[0].textContent).toBe("Resolved");
  });

  test("should render coming soon if reporting feature is disabled", () => {
    const screen = render(<ReportingResolved disabled={true} />);
    const links = screen.getByText(/Coming soon!/i);
    expect(links).toBeInTheDocument();
  });
});
