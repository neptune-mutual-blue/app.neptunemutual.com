import React from "react";
import { i18n } from "@lingui/core";
import { render } from "@/utils/unit-tests/test-utils";
import MyBondTxs from "@/pages/pools/bond/transactions.page";

describe("Bond transaction page", () => {
  beforeEach(() => {
    i18n.activate("en");
  });

  describe("if feature disabled", () => {
    test("should display coming soon message", () => {
      const screen = render(<MyBondTxs disabled={"true"} />);

      expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
    });
  });

  describe("if feature enabled", () => {
    test("should have transaction list table on document", () => {
      const screen = render(<MyBondTxs />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });
  });
});
