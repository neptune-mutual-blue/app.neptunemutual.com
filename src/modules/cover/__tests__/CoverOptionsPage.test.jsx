import React from "react";
import {
  render,
  withProviders,
  waitFor,
  screen,
  fireEvent,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";
import { CoverOptionsPage } from "@/modules/cover/CoverOptionsPage";
import { actions as coverActions } from "@/src/config/cover/actions";

import { mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { testData } from "@/utils/unit-tests/test-data";

const NUMBER_OF_ACTIONS = Object.keys(coverActions).length;

describe("CoverOptionsPage", () => {
  const backBtnHandler = jest.fn();
  beforeEach(async () => {
    i18n.activate("en");

    const router = createMockRouter({
      query: { cover_id: "animated-brands" },
      back: () => backBtnHandler(),
    });
    const Component = withProviders(CoverOptionsPage, router, {
      coverProductInfo: testData.coverInfo,
    });
    render(<Component />);
  });

  it("has correct number cover actions", async () => {
    const coverOptionActions = await waitFor(() =>
      screen.getAllByTestId("cover-option-actions")
    );
    expect(coverOptionActions).toHaveLength(NUMBER_OF_ACTIONS);
  });

  test("should call router.back when clicking on back button ", () => {
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[buttons.length - 1]);

    expect(backBtnHandler).toHaveBeenCalled();
  });
});

describe("CoverOptionsPage", () => {
  beforeEach(async () => {
    i18n.activate("en");
    mockFn.useCoverOrProductData(() => {});

    const router = createMockRouter({
      query: { cover_id: "animated-brands" },
    });
    const Component = withProviders(CoverOptionsPage, router);
    render(<Component />);
  });

  it("returns loading if not cover info", async () => {
    const loading = screen.getByText(/loading.../i);

    expect(loading).toBeInTheDocument();
  });
});
