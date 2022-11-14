import { Routes } from '@/src/config/routes'
import { t } from '@lingui/macro'

export const actions = {
  purchase: {
    title: t`Purchase Policy`,
    description: t`to get protection from hacks & exploits`,
    imgSrc: '/cover-actions/purchase.png',
    getHref: (coverKey, productKey) => Routes.PurchasePolicy(coverKey, productKey),
    action: 'purchase'
  },
  'add-liquidity': {
    title: t`Provide Liquidity`,
    description: t`to pool risks and receive rewards`,
    imgSrc: '/cover-actions/add-liquidity.png',
    getHref: (coverKey, _productKey) => Routes.ProvideLiquidity(coverKey),
    action: 'add-liquidity'
  },
  report: {
    title: t`Report Incident`,
    description: t`to notify other users about the cover event`,
    imgSrc: '/cover-actions/report.png',
    getHref: (coverKey, productKey) => Routes.ReportNewIncident(coverKey, productKey),
    action: 'new-report'
  },
  claim: {
    title: t`Claim Cover`,
    description: t`to receive payout by claiming cxTokens`,
    imgSrc: '/cover-actions/claim.png',
    getHref: (_coverKey, _productKey) => Routes.MyActivePolicies,
    action: 'claim'
  }
}
