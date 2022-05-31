import React from "react";
import {
  render,
  act,
  withProviders,
  waitFor,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";
import { CoverOptionsPage } from "@/modules/cover/CoverOptionsPage";
import { actions as coverActions } from "@/src/config/cover/actions";
import {
  covers,
  pools,
  contracts,
  pricing,
} from "@/utils/unit-tests/data/coverOptionsMockUpData";
import { API_BASE_URL } from "@/src/config/constants";

const NETWORKID = 80001;
const NUMBER_OF_ACTIONS = Object.keys(coverActions).length;

const MOCKUP_API_URLS = {
  GET_CONTRACTS_URL: `${API_BASE_URL}/protocol/contracts/mumbai`,
  GET_PRICING_URL: `${API_BASE_URL}/pricing/${NETWORKID}`,
  SUB_GRAPH:
    "https://api.thegraph.com/subgraphs/name/neptune-mutual/subgraph-mumbai",
};

const QUERY = {
  POOLS: "pools",
  COVERS: "covers",
};

async function mockFetch(url, { body }) {
  if (url.startsWith(MOCKUP_API_URLS.GET_CONTRACTS_URL)) {
    return {
      ok: true,
      status: 200,
      json: async () => contracts,
    };
  }

  if (url.startsWith(MOCKUP_API_URLS.GET_PRICING_URL)) {
    return {
      ok: true,
      status: 200,
      json: async () => pricing,
    };
  }

  if (url.startsWith(MOCKUP_API_URLS.SUB_GRAPH)) {
    if (body.includes(QUERY.POOLS)) {
      return {
        ok: true,
        status: 200,
        json: async () => pools,
      };
    }

    if (body.includes(QUERY.COVERS)) {
      return {
        ok: true,
        status: 200,
        json: async () => covers,
      };
    }
  }

  throw new Error(`Unhandled request: ${url}`);
}

describe("CoverOptionsPage", () => {
  global.fetch = jest.fn(mockFetch);

  beforeAll(async () => {
    act(() => {
      i18n.activate("en");
    });
  });

  it("has correct number cover actions", async () => {
    const router = createMockRouter({
      query: { cover_id: "animated-brands" },
    });
    const Component = withProviders(CoverOptionsPage, router);
    const { getAllByTestId } = render(<Component />);

    const CoverOptionActions = await waitFor(() =>
      getAllByTestId("cover-option-actions")
    );

    expect(CoverOptionActions).toHaveLength(NUMBER_OF_ACTIONS);
  });
});
