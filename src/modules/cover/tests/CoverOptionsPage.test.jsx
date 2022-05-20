import React from "react";
import { render, act, withProviders } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import "@testing-library/jest-dom";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";
import { CoverOptionsPage } from "@/modules/cover/CoverOptionsPage";
import { actions as coverActions } from "@/src/config/cover/actions";

const NUMBER_OF_ACTIONS = Object.keys(coverActions).length;

describe("CoverOptionsPage", () => {
  beforeAll(() => act(() => i18n.activate("en")));
  describe("should render CoverOptionsPage", () => {
    xtest("has correct number cover actions", async () => {
      const router = createMockRouter({
        query: { cover_id: "animated-brands" },
      });
      const Component = withProviders(CoverOptionsPage, router);
      const { getAllByTestId } = render(<Component />);

      const coverActionsTitle = getAllByTestId("cover-action-title");
      const coverActionsDescription = getAllByTestId(
        "cover-action-description"
      );

      expect(coverActionsTitle).toHaveLength(NUMBER_OF_ACTIONS);
      expect(coverActionsDescription).toHaveLength(NUMBER_OF_ACTIONS);
    });
  });
});
