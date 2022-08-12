import React from "react";
import {
  render,
  withProviders,
  waitFor,
  screen,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";
import { CoverOptionsPage } from "@/modules/cover/CoverOptionsPage";
import { actions as coverActions } from "@/src/config/cover/actions";

import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

const NUMBER_OF_ACTIONS = Object.keys(coverActions).length;

describe("CoverOptionsPage", () => {
  beforeEach(async () => {
    i18n.activate("en");
    mockFn.useCoverOrProductData();

    const router = createMockRouter({
      query: { cover_id: "animated-brands" },
    });
    const Component = withProviders(CoverOptionsPage, router);
    render(<Component />);
  });

  it("has correct number cover actions", async () => {
    const coverOptionActions = await waitFor(() =>
      screen.getAllByTestId("cover-option-actions")
    );
    expect(coverOptionActions).toHaveLength(NUMBER_OF_ACTIONS);
  });
});
