export const MULTIPLIER = 10_000;
export const DAYS = 86400;

export const DEFAULT_GAS_LIMIT = "6000000";
export const ADDRESS_ONE = "0x0000000000000000000000000000000000000001";

// Should be added to CSP
export const PRICING_URL = "https://api.neptunemutual.com/pricing/{networkId}";
export const FAUCET_URL = "https://faucet.neptunemutual.com/";
export const LEADERBOARD_URL = "https://leaderboard.neptunemutual.com/";
export const UNSTAKE_INFO_URL =
  "https://api.neptunemutual.com/protocol/consensus/unstake-info/{networkId}/{coverKey}/{account}/{incidentDate}";

export const POOL_URLS = {
  3: "https://app.sushi.com/add/{liquidityTokenAddress}/{NPMTokenAddress}",
  42: "https://app.sushi.com/add/{liquidityTokenAddress}/{NPMTokenAddress}",
};

export const SUBGRAPH_API_URLS = {
  3: "https://api.thegraph.com/subgraphs/name/neptune-mutual/neptune-mutual-ropsten",
  42: "https://api.thegraph.com/subgraphs/name/neptune-mutual/subgraph-kovan",
};
