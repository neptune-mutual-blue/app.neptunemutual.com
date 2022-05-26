import React from "react";
import {
  render,
  act,
  withProviders,
  fireEvent,
  waitFor,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";
import {
  covers,
  pools,
  contracts,
  pricing,
  coverInfo,
  vaultInfo,
} from "@/utils/unit-tests/data/coverPurchaseMockUpData";
import { CoverAddLiquidityDetailsPage } from "@/modules/cover/add-liquidity";

const NETWORKID = 80001;

const MOCKUP_API_URLS = {
  GET_CONTRACTS_URL: `${process.env.NEXT_PUBLIC_API_URL}/protocol/contracts/mumbai`,
  GET_COVER_INFO: `${process.env.NEXT_PUBLIC_API_URL}/protocol/cover/info/${NETWORKID}`,
  GET_VAULT_INFO: `${process.env.NEXT_PUBLIC_API_URL}/protocol/vault/info/${NETWORKID}`,
  GET_PRICING_URL: `${process.env.NEXT_PUBLIC_API_URL}/pricing/${NETWORKID}`,
  SUB_GRAPH: process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
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

  if (url.startsWith(MOCKUP_API_URLS.GET_COVER_INFO)) {
    return {
      ok: true,
      status: 200,
      json: async () => coverInfo,
    };
  }

  if (url.startsWith(MOCKUP_API_URLS.GET_VAULT_INFO)) {
    return {
      ok: true,
      status: 200,
      json: async () => vaultInfo,
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

describe("CoverAddLiquidityPage.test", () => {
  global.fetch = jest.fn(mockFetch);

  beforeAll(async () => {
    act(() => {
      i18n.activate("en");
    });
  });

  it("should show purchase policy form after accepting rules", async () => {
    const router = createMockRouter({
      query: { cover_id: "animated-brands" },
    });
    const Component = withProviders(CoverAddLiquidityDetailsPage, router);
    const { getByTestId } = render(<Component />);

    await waitFor(() => {
      expect(getByTestId("accept-rules-check-box")).toBeInTheDocument();
    });

    const acceptRulesCheckbox = getByTestId("accept-rules-check-box");
    const acceptRulesNextButton = getByTestId("accept-rules-next-button");

    fireEvent.click(acceptRulesCheckbox);
    fireEvent.click(acceptRulesNextButton);

    expect(getByTestId("add-liquidity-form")).toBeInTheDocument();
  });
});
