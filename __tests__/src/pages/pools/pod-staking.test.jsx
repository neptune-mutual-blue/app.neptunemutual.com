import React from "react";
import { i18n } from "@lingui/core";
import { render } from "@/utils/unit-tests/test-utils";

import PodStaking from "@/src/pages/pools/pod-staking";

jest.mock("@/src/modules/pools/pod-staking", () => {
  return {
    PodStakingPage: () => {
      return <div>Podstaking page</div>;
    },
  };
});

describe("POD Staking page", () => {
  beforeEach(() => {
    i18n.activate("en");
  });

  describe("if feature disabled", () => {
    test("should display coming soon message", () => {
      const screen = render(<PodStaking disabled={true} />);
      const comingSoonText = screen.getByText(/Coming Soon/i);
      expect(comingSoonText).toBeInTheDocument();
    });
  });

  describe("if feature enabled", () => {
    test("should display POD Staking tab as selected", () => {
      const screen = render(<PodStaking disabled={false} />);
      const podStakingPage = screen.getByText(/Podstaking page/i);
      expect(podStakingPage).toBeInTheDocument();
    });
  });
});
