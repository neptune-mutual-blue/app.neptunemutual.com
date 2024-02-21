import { Routes } from '@/src/config/routes'

/**
 * Returns an object containing actions for a given cover.
 *
 * @returns {Object} An object containing actions for a given cover. Each action is an object itself with properties like title, description, imgSrc, getHref, and action.
 */
export const getActions = () => {
  return {
    purchase: {
      title: 'Purchase Policy',
      description: 'to get protection from hacks & exploits',
      imgSrc: '/cover-actions/purchase.png',
      getHref: (coverKey, productKey) => { return Routes.PurchasePolicy(coverKey, productKey) },
      action: 'purchase'
    },
    'add-liquidity': {
      title: 'Provide Liquidity',
      description: 'to pool risks and receive rewards',
      imgSrc: '/cover-actions/add-liquidity.png',
      getHref: (coverKey, _productKey) => { return Routes.ProvideLiquidity(coverKey) },
      action: 'add-liquidity'
    },
    report: {
      title: 'Report Incident',
      description: 'to notify other users about the cover event',
      imgSrc: '/cover-actions/report.png',
      getHref: (coverKey, productKey) => { return Routes.ReportNewIncident(coverKey, productKey) },
      action: 'new-report'
    },
    claim: {
      title: 'Claim Cover',
      description: 'to receive payout by claiming cxTokens',
      imgSrc: '/cover-actions/claim.png',
      getHref: (_coverKey, _productKey) => { return Routes.MyActivePolicies },
      action: 'claim'
    }
  }
}
