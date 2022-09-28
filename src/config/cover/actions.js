import ClaimCoverIcon from '@/icons/ClaimCoverIcon'
import ProvideLiquidityIcon from '@/icons/ProvideLiquidityIcon'
import PurchasePolicyIcon from '@/icons/PurchasePolicyIcon'
import ReportIncidentIcon from '@/icons/ReportIncidentIcon'
import ProvideLiquiditySmall from '@/icons/ProvideLiquiditySmall'
import PurchasePolicySmall from '@/icons/PurchasePolicySmall'
import ReportIncidentSmall from '@/icons/ReportIncidentSmall'
import ClaimCoverSmall from '@/icons/ClaimCoverSmall'
import { Routes } from '@/src/config/routes'

/**
 *
 * @type {Object.<string, {title: string, description: string, imgSrc: JSX.Element, smImgSrc: JSX.Element, footerImgSrc: string, getHref: (coverKey: any, productKey: any) => string, action: string}>}
 *
 */
export const actions = {
  purchase: {
    title: 'Purchase Policy',
    description: 'to get protection from hacks & exploits',
    imgSrc: <PurchasePolicyIcon />,
    smImgSrc: <PurchasePolicySmall />,
    footerImgSrc: '/cover-actions/purchase.svg',
    getHref: (coverKey, productKey) =>
      Routes.PurchasePolicy(coverKey, productKey),
    action: 'purchase'
  },
  'add-liquidity': {
    title: 'Provide Liquidity',
    description: 'to pool risks and receive rewards',
    imgSrc: <ProvideLiquidityIcon />,
    smImgSrc: <ProvideLiquiditySmall />,
    footerImgSrc: '/cover-actions/add-liquidity.svg',
    getHref: (coverKey, _productKey) => Routes.ProvideLiquidity(coverKey),
    action: 'add-liquidity'
  },
  report: {
    title: 'Report Incident',
    description: 'to notify other users about the cover event',
    imgSrc: <ReportIncidentIcon />,
    smImgSrc: <ReportIncidentSmall />,
    footerImgSrc: '/cover-actions/report.svg',
    getHref: (coverKey, productKey) =>
      Routes.ReportNewIncident(coverKey, productKey),
    action: 'new-report'
  },
  claim: {
    title: 'Claim Cover',
    description: 'to receive payout by claiming cxTokens',
    imgSrc: <ClaimCoverIcon />,
    smImgSrc: <ClaimCoverSmall />,
    footerImgSrc: '/cover-actions/claim.svg',
    getHref: (_coverKey, _productKey) => Routes.MyPolicies,
    action: 'claim'
  }
}
