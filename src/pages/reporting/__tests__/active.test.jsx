import React from "react";
import { render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import ReportingActive from "@/pages/reporting/active";

describe("Active Reporting Page", () => {
  beforeEach(async () => {
    i18n.activate("en");
  });

  test("should render active reporting", () => {
    const screen = render(<ReportingActive />);
    const links = screen.container.getElementsByClassName("text-4e7dd9");
    expect(links).toHaveLength(1);
    expect(links[0].textContent).toBe("Active");
  });

  test("should render coming soon if reporting feature is disabled", () => {
    const screen = render(<ReportingActive disabled={true} />);
    const links = screen.getByText(/Coming soon!/i);
    expect(links).toBeInTheDocument();
  });
});
