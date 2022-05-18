import { withProviders } from "@/utils/unit-tests/test-utils";
import { act } from "react-dom/test-utils";
import { contracts, getCover, pricing, QUERY_RESULT } from "./mockUpdata.data";
import { API_BASE_URL } from "@/src/config/constants";
import { StakingPage } from "@/modules/pools/staking";
import { i18n } from "@lingui/core";
import ReactDOM from "react-dom";

const MOCKUP_API_URLS = {
  POOL_INFO_URL: `${API_BASE_URL}protocol/staking-pools/info/`,
  GET_CONTRACTS_INFO_URL: `${process.env.NEXT_PUBLIC_API_URL}/protocol/contracts/`,
  SUB_GRAPH: process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
};

async function mockFetch(url) {
  console.log("fetch url", url);
  if (url.startsWith(MOCKUP_API_URLS.POOL_INFO_URL)) {
    return {
      ok: true,
      status: 200,
      json: async () => getCover(url),
    };
  }

  if (url.startsWith(MOCKUP_API_URLS.GET_CONTRACTS_INFO_URL)) {
    // console.log("return contracts");
    return {
      ok: true,
      status: 200,
      json: async () => contracts,
    };
  }

  if (url.startsWith(MOCKUP_API_URLS.FINANCING)) {
    // console.log("return financing");
    return {
      ok: true,
      status: 200,
      json: async () => pricing,
    };
  }

  if (url.startsWith(MOCKUP_API_URLS.SUB_GRAPH)) {
    if (body.includes(QUERY.PLATFORM_FEE)) {
      return {
        ok: true,
        status: 200,
        json: async () => QUERY_RESULT.PLATFORM_FEE,
      };
    }

    if (body.includes(QUERY.IPS_HASH)) {
      return {
        ok: true,
        status: 200,
        json: async () => QUERY_RESULT.IPFSHASH,
      };
    }

    if (body.includes(QUERY.TOTAL_ADDED_TO_BOND)) {
      return {
        ok: true,
        status: 200,
        json: async () => QUERY_RESULT.TOTAL_ADDED_TO_BOND,
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

function delay(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

describe("Pool Staking", () => {
  beforeAll(() => act(() => i18n.activate("en")));
  const Component = withProviders(StakingPage);

  it("Staking card should be 6", async () => {
    const container = document.createElement("div");
    await act(() => {
      ReactDOM.render(<Component />, container);
      return delay(1000);
    });
    const stakeCards = container.querySelectorAll("h4");

    expect(stakeCards.length).toEqual(6);
  });
});
