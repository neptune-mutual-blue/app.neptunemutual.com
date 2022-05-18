import React from "react";
import { render, screen } from "@/utils/unit-tests/test-utils";
import "@testing-library/jest-dom";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";

describe("CardSkeleton", () => {
  describe("should render CardSkeleton properly", () => {
    test("has correct number of cards and line content", async () => {
      const CARDS_PER_PAGE = 5;
      const LINE_CONTENT_PER_CARD = 4;

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

    // test("hide status badge and subtitle", () => {
    //   render(<CardSkeleton statusBadge={false} subTitle={false} />);

    //   const subtitle = screen.findAllByTestId("card-subtitle");
    //   const statusBadge = screen.findAllByTestId("card-status-badge");

    //   expect(subtitle).toHaveLength(0);
    //   expect(statusBadge).toHaveLength(0);
    // });
  });
});
