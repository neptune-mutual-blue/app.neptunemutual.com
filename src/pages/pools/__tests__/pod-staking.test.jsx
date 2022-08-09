import React from "react";
import { i18n } from "@lingui/core";
import { render } from "@/utils/unit-tests/test-utils";

import PodStaking from "@/pages/pools/pod-staking";

describe("POD Staking page", () => {
  beforeEach(() => {
    i18n.activate("en");
  });

  describe("if feature disabled", () => {
    test("should display coming soon message", () => {
      const screen = render(<PodStaking disabled={"true"} />);

      expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
    });
  });

  describe("if feature enabled", () => {
    test("should display POD Staking tab as selected", () => {
      const screen = render(<PodStaking />);

      const links = screen.container.getElementsByClassName(
        "text-4e7dd9 border-B0C4DB"
      );
      expect(links).toHaveLength(1);
      expect(links[0].textContent).toBe("POD Staking");
    });
  });
});
