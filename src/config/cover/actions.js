export const actions = {
  "purchase": {
    title: "Purchase Policy",
    description: "to get protection from hacks & exploits",
    imgSrc: `/options/purchase.png`,
    footerImgSrc: `/cover-actions/purchase.png`,
    getHref: (id) => `/cover/${id}/purchase`,
  },
  "add-liquidity": {
    title: "Provide Liquidity",
    description: "to pool risks and receive rewards",
    imgSrc: `/options/add-liquidity.png`,
    footerImgSrc: `/cover-actions/add-liquidity.png`,
    getHref: (id) => `/cover/${id}/add-liquidity`,
  },
  "report": {
    title: "Report Incident",
    description: "to notify other users about the cover event",
    imgSrc: `/options/report.png`,
    footerImgSrc: `/cover-actions/report.png`,
    getHref: (id) => `/reporting/${id}/new`,
  },
  "claim": {
    title: "Claim Cover",
    description: "to receive payout by claiming cxTokens",
    imgSrc: `/options/claim.png`,
    footerImgSrc: `/cover-actions/claim.png`,
    getHref: (_id) => `/my-policies/active`,
  },
};
