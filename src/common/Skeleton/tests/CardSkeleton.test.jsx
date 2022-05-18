import React from "react";
import { render, screen } from "@/utils/unit-tests/test-utils";
import "@testing-library/jest-dom";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";

const CARDS_PER_PAGE = 5;
const LINE_CONTENT_PER_CARD = 4;

describe("CardSkeleton", () => {
  describe("should render CardSkeleton properly", () => {
    test("has correct number of cards and line content", async () => {
      render(
        <CardSkeleton
          numberOfCards={CARDS_PER_PAGE}
          lineContent={LINE_CONTENT_PER_CARD}
        />
      );

      const cards = screen.getAllByTestId("card-skeleton");
      const lineContent = screen.getAllByTestId("card-line-content");

      expect(cards).toHaveLength(CARDS_PER_PAGE);
      expect(lineContent).toHaveLength(LINE_CONTENT_PER_CARD * CARDS_PER_PAGE);
    });

    test("show status badge and subtitle", () => {
      render(
        <CardSkeleton statusBadge subTitle numberOfCards={CARDS_PER_PAGE} />
      );

      const subtitle = screen.getAllByTestId("card-subtitle");
      const statusBadge = screen.getAllByTestId("card-status-badge");

      expect(subtitle).toHaveLength(CARDS_PER_PAGE);
      expect(statusBadge).toHaveLength(CARDS_PER_PAGE);
    });
  });
});
