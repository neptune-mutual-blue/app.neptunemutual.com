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
    footerImgSrc: `/cover-actions/purchase.svg`,
    getHref: (cover_id, product_id, isDiversified) =>
      isDiversified
        ? `/covers/${cover_id}/products/${product_id}/purchase`
        : `/covers/${cover_id}/purchase`,
    action: "purchase",
  },
  "add-liquidity": {
    title: "Provide Liquidity",
    description: "to pool risks and receive rewards",
    imgSrc: <ProvideLiquidityIcon />,
    smImgSrc: <ProvideLiquiditySmall />,
    footerImgSrc: `/cover-actions/add-liquidity.svg`,
    getHref: (cover_id, product_id, isDiversified) =>
      isDiversified
        ? `/covers/${cover_id}/add-liquidity`
        : `/covers/${cover_id}/add-liquidity`,
    action: "add-liquidity",
  },
  "report": {
    title: "Report Incident",
    description: "to notify other users about the cover event",
    imgSrc: <ReportIncidentIcon />,
    smImgSrc: <ReportIncidentSmall />,
    footerImgSrc: `/cover-actions/report.svg`,
    getHref: (cover_id, product_id, isDiversified) =>
      isDiversified
        ? `/covers/${cover_id}/products/${product_id}/new-report`
        : `/covers/${cover_id}/new-report`,
    action: "new-report",
  },
  "claim": {
    title: "Claim Cover",
    description: "to receive payout by claiming cxTokens",
    imgSrc: <ClaimCoverIcon />,
    smImgSrc: <ClaimCoverSmall />,
    footerImgSrc: `/cover-actions/claim.svg`,
    getHref: (_id) => `/my-policies/active`,
    action: "claim",
  },
};
