import React from "react";
import { render, waitFor, screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import Bond from "@/pages/pools/bond";

describe("Bond page", () => {
  beforeEach(() => {
    i18n.activate("en");
  });

  describe("if feature disabled", () => {
    beforeEach(() => {
      render(<Bond disabled={"true"} />);
    });

    test("should display coming soon message", () => {
      waitFor(() => {
        expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
      });
    });
  });

  describe("if feature enabled", () => {
    test("should display Bonds tab as selected", () => {
      const screen = render(<Bond />);
      const links = screen.container.getElementsByClassName(
        "text-4e7dd9 border-B0C4DB"
      );
      expect(links).toHaveLength(1);
      expect(links[0].textContent).toBe("Bond");
    });
  });
});
