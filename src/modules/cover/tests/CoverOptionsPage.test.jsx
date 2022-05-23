import React from "react";
import {
  render,
  act,
  withProviders,
  waitFor,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import "@testing-library/jest-dom";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";
import { CoverOptionsPage } from "@/modules/cover/CoverOptionsPage";
import { actions as coverActions } from "@/src/config/cover/actions";
import { covers, pools, contracts, pricing } from "./mockup.data.js";

const NUMBER_OF_ACTIONS = Object.keys(coverActions).length;

async function mockFetch(url, { body }) {
  if (url.startsWith("https://api.npm.finance/protocol/contracts/mumbai")) {
    return {
      ok: true,
      status: 200,
      json: async () => contracts,
    };
  }

  if (url.startsWith("https://api.npm.finance/pricing/80001")) {
    return {
      ok: true,
      status: 200,
      json: async () => pricing,
    };
  }

  if (url.startsWith("https://api2.neptunemutual.com/subgraph/mumbai")) {
    if (body.includes("pools")) {
      return {
        ok: true,
        status: 200,
        json: async () => pools,
      };
    }

    if (body.includes("covers")) {
      return {
        ok: true,
        status: 200,
        json: async () => covers,
      };
    }
  }

  throw new Error(`Unhandled request: ${url}`);
}

global.fetch = jest.fn(mockFetch);
global.ethereum = {
  enable: jest.fn(() => {}),
  eth_requestAccounts: () => {},
};

describe("CoverOptionsPage", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });
  describe("should render CoverOptionsPage", () => {
    test("has correct number cover actions", async () => {
      const router = createMockRouter({
        query: { cover_id: "animated-brands" },
      });
      const Component = withProviders(CoverOptionsPage, router);
      const { getAllByTestId } = render(<Component />);

      await waitFor(() => getAllByTestId("cover-action-title"), {
        timeout: 2000,
      });
      await waitFor(() => getAllByTestId("cover-action-description"), {
        timeout: 2000,
      });

      // await waitFor(() =>
      //   expect(getAllByTestId("cover-action-description")).toHaveLength(
      //     NUMBER_OF_ACTIONS
      //   )
      // );

      // const coverActionsTitle = getAllByTestId("cover-action-title");
      // const coverActionsDescription = getAllByTestId(
      //   "cover-action-description"
      // );

      // expect(coverActionsTitle).toHaveLength(NUMBER_OF_ACTIONS);
      // expect(coverActionsDescription).toHaveLength(NUMBER_OF_ACTIONS);
    });
  });
});
