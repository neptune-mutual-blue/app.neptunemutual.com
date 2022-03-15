import ClaimCoverIcon from "@/icons/ClaimCoverIcon";
import ProvideLiquidityIcon from "@/icons/ProvideLiquidityIcon";
import PurchasePolicyIcon from "@/icons/PurchasePolicyIcon";
import ReportIncidentIcon from "@/icons/ReportIncidentIcon";
import ProvideLiquiditySmall from "@/icons/ProvideLiquiditySmall";
import PurchasePolicySmall from "@/icons/PurchasePolicySmall";
import ReportIncidentSmall from "@/icons/ReportIncidentSmall";
import ClaimCoverSmall from "@/icons/ClaimCoverSmall";

export const actions = {
  "purchase": {
    title: "Purchase Policy",
    description: "to get protection from hacks & exploits",
    imgSrc: <PurchasePolicyIcon />,
    smImgSrc: <PurchasePolicySmall />,
    // mdImgSrc: `/options/purchase-md.png`,
    footerImgSrc: `/cover-actions/purchase.svg`,
    getHref: (id) => `/cover/${id}/purchase`,
  },
  "add-liquidity": {
    title: "Provide Liquidity",
    description: "to pool risks and receive rewards",
    imgSrc: <ProvideLiquidityIcon />,
    smImgSrc: <ProvideLiquiditySmall />,
    // mdImgSrc: `/options/add-liquidity-md.png`,
    footerImgSrc: `/cover-actions/add-liquidity.svg`,
    getHref: (id) => `/cover/${id}/add-liquidity`,
  },
  "report": {
    title: "Report Incident",
    description: "to notify other users about the cover event",
    imgSrc: <ReportIncidentIcon />,
    smImgSrc: <ReportIncidentSmall />,
    // mdImgSrc: `/options/report-md.png`,
    footerImgSrc: `/cover-actions/report.svg`,
    getHref: (id) => `/reporting/${id}/new`,
  },
  "claim": {
    title: "Claim Cover",
    description: "to receive payout by claiming cxTokens",
    imgSrc: <ClaimCoverIcon />,
    smImgSrc: <ClaimCoverSmall />,
    // mdImgSrc: `/options/claim-md.png`,
    footerImgSrc: `/cover-actions/claim.svg`,
    getHref: (_id) => `/my-policies/active`,
  },
};
