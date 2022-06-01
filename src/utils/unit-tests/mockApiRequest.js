import { API_BASE_URL } from "@/src/config/constants";
import {
  contracts,
  getCover,
  getLiquidity,
  pricing,
  QUERY_RESULT,
} from "@/utils/unit-tests/data/mockUpdata.data";

const NETWORKID = 80001;

const MOCKUP_API_URLS = {
  POOL_INFO_URL: `${API_BASE_URL}protocol/staking-pools/info/`,
  GET_CONTRACTS_INFO_URL: `${API_BASE_URL}protocol/contracts/`,
  SUB_GRAPH:
    "https://api.thegraph.com/subgraphs/name/neptune-mutual/subgraph-mumbai",
  FINANCING: `${API_BASE_URL}pricing/`,

  // liquidity
  LIQUIDITY_INFO: `${API_BASE_URL}protocol/vault/info/${NETWORKID}`,
};

const QUERY = {
  PLATFORM_FEE: "platformFee",
  IPS_HASH: "ipfsHash",
  TOTAL_ADDED_TO_BOND: "totalLpAddedToBond",
  TOTAL_LIQUIDITY: "totalLiquidity",
};

export async function mockFetch(url, { body }) {
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

  // LIQUIDITY
  if (url.startsWith(MOCKUP_API_URLS.LIQUIDITY_INFO)) {
    return {
      ok: true,
      status: 200,
      json: async () => getLiquidity(url),
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

    if (body.includes(QUERY.TOTAL_LIQUIDITY)) {
      return {
        ok: true,
        status: 200,
        json: async () => QUERY_RESULT.TOTAL_LIQUIDITY,
      };
    }
  }

  throw new Error(`Unhandled request: ${url}`);
}
