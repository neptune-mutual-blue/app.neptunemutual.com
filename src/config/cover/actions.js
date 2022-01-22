export const actions = {
  "purchase": {
    title: "Purchase Policy",
    description: "to get protection from hacks & exploits",
    getHref: (id) => `/cover/${id}/purchase`,
  },
  "add-liquidity": {
    title: "Provide Liquidity",
    description: "to pool risks and receive rewards",
    getHref: (id) => `/cover/${id}/add-liquidity`,
  },
  "report": {
    title: "Report Incident",
    description: "to notify other users about the cover event",
    getHref: (id) => `/cover/${id}/report/details`,
  },
  "claim": {
    title: "Claim Cover",
    description: "to receive payout by claiming cxTokens",
    getHref: (_id) => `/my-policies/active`,
  },
};
