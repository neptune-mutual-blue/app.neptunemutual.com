import {
  fireEvent,
  waitFor,
  withProviders,
  withSorting,
} from "@/utils/unit-tests/test-utils";
import { act } from "react-dom/test-utils";
import {
  contracts,
  getCover,
  pricing,
  QUERY_RESULT,
} from "./data/mockUpdata.data";
import { API_BASE_URL } from "@/src/config/constants";
import { StakingPage } from "@/modules/pools/staking";
import { i18n } from "@lingui/core";
import ReactDOM from "react-dom";
import { mockFetch } from "@/utils/unit-tests/mockApiRequest";

const MOCKUP_API_URLS = {
  POOL_INFO_URL: `${API_BASE_URL}protocol/staking-pools/info/`,
  GET_CONTRACTS_INFO_URL: `${process.env.NEXT_PUBLIC_API_URL}/protocol/contracts/`,
  SUB_GRAPH: process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
  FINANCING: `${process.env.NEXT_PUBLIC_API_URL}/pricing/`,
};

const QUERY = {
  PLATFORM_FEE: "platformFee",
  IPS_HASH: "ipfsHash",
  TOTAL_ADDED_TO_BOND: "totalLpAddedToBond",
};

async function mockFetch(url, { body }) {
  if (url.startsWith(MOCKUP_API_URLS.POOL_INFO_URL)) {
    return {
      ok: true,
      status: 200,
      json: async () => getCover(url),
    };
  }

  if (url.startsWith(MOCKUP_API_URLS.GET_CONTRACTS_INFO_URL)) {
    return {
      ok: true,
      status: 200,
      json: async () => contracts,
    };
  }

  if (url.startsWith(MOCKUP_API_URLS.FINANCING)) {
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
global.crypto = {
  getRandomValues: jest.fn().mockReturnValueOnce(new Uint32Array(10)),
};

const ETHEREUM_METHODS = {
  eth_requestAccounts: () => [process.env.NEXT_PUBLIC_TEST_ACCOUNT],
};

global.ethereum = {
  enable: jest.fn(() => Promise.resolve(true)),
  send: jest.fn((method) => {
    if (method === "eth_chainId") {
      return Promise.resolve(1);
    }

    if (method === "eth_requestAccounts") {
      return Promise.resolve(process.env.NEXT_PUBLIC_TEST_ACCOUNT);
    }

    return Promise.resolve(true);
  }),
  request: jest.fn(async ({ method }) => {
    if (ETHEREUM_METHODS.hasOwnProperty(method)) {
      return ETHEREUM_METHODS[method];
    }

    return "";
  }),
  on: jest.fn(() => {}),
};

window.ethereum = global.ethereum;

const SELECTION = {
  TITLE: "title",
  TVL: "tvl",
  APR: "apr",
};

const select = (container, type) => {
  if (type === SELECTION.TITLE) {
    return Array.from(container.querySelectorAll("h4"));
  }

  if (type === SELECTION.TVL) {
    return Array.from(
      container.querySelectorAll(".text-right[title] p.text-7398C0")
    );
  }

  return Array.from(container.querySelectorAll(".text-21AD8C"));
};

const getValues = (container, type) => {
  if (type === SELECTION.TITLE) {
    return select(container, type).map((el) => el.textContent);
  }

  if (type === SELECTION.TVL) {
    return select(container, type).map((el) =>
      parseFloat(el.textContent.slice(1), 10)
    );
  }

  return select(container, type).map((el) =>
    parseFloat(el.textContent.slice("APR: ".length), 10)
  );
};

const sortFromHighest = (a, b) => {
  if (a === b) {
    return 0;
  }

  return a > b ? -1 : 1;
};

describe("Pool Staking", () => {
  global.fetch = jest.fn(mockFetch);

  const Component = withProviders(withSorting(StakingPage));
  const container = document.createElement("div");

  beforeAll(async () => {
    act(() => {
      i18n.activate("en");
      ReactDOM.render(<Component />, container);
    });
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(11));
  });

  describe("Staking card", () => {
    it("Card should be 6", () => {
      const stakeCards = select(container, SELECTION.TITLE);

      expect(stakeCards.length).toEqual(6);
    });

    describe("TVL", () => {
      it("should be 6", () => {
        const tvlElements = select(container, SELECTION.TVL);
        expect(tvlElements.length).toEqual(6);
      });

      it("no 0 value", () => {
        const tvlValues = getValues(container, SELECTION.TVL);

        const zeroValues = tvlValues.filter((value) => value === 0);

        expect(zeroValues.length).toEqual(0);
      });
    });

    describe("APR", () => {
      it("should be 6", () => {
        const aprElements = select(container, SELECTION.APR);
        expect(aprElements.length).toEqual(6);
      });

      it("no 0 value", () => {
        const aprValues = getValues(container, SELECTION.APR);
        const zeroValues = aprValues.filter((value) => value === 0);

        expect(zeroValues.length).toEqual(0);
      });
    });

    describe("Sorting", () => {
      it("Sorting is visible", () => {
        const sortButton = container.querySelector("button");

        act(() => {
          fireEvent.click(sortButton);
        });

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        );

        expect(container).toContainElement(sortList);
      });

      it("Sort Alphabetically", () => {
        const original = getValues(container, SELECTION.TITLE);

        const sortButton = container.querySelector("button");

        act(() => {
          fireEvent.select(sortButton);
        });

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        );

        const [alphabet] = Array.from(sortList.querySelectorAll("li"));

        act(() => {
          fireEvent.click(alphabet);
        });

        const values = getValues(container, SELECTION.TITLE);

        expect(original).toEqual(values);
      });

      it("Sort by TVL", () => {
        const original = getValues(container, SELECTION.TVL);

        const sortButton = container.querySelector("button");

        act(() => {
          fireEvent.click(sortButton);
        });

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        );

        const [_, tvl] = Array.from(sortList.querySelectorAll("li"));

        act(() => {
          fireEvent.click(tvl);
        });

        const values = getValues(container, SELECTION.TVL);
        const sortedOriginal = [...original].sort(sortFromHighest);

        expect(original).not.toEqual(values);
        expect(sortedOriginal).toEqual(values);
      });

      it("Sort by APR", () => {
        const original = getValues(container, SELECTION.APR);

        const sortButton = container.querySelector("button");

        act(() => {
          fireEvent.click(sortButton);
        });

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        );

        const [_, _tvl, apr] = Array.from(sortList.querySelectorAll("li"));

        act(() => {
          fireEvent.click(apr);
        });

        const values = getValues(container, SELECTION.APR);
        const sortedOriginal = [...original].sort(sortFromHighest);

        expect(original).not.toEqual(values);
        expect(sortedOriginal).toEqual(values);
      });
    });
  });
});
