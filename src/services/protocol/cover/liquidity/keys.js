import { registry } from '@/src/services/store-keys'
import sdk from '@neptunemutual/sdk'

/**
 * @param {{coverKey:string, productKeys: string[]}[]} payload
 */
export const getKeys = (payload) => {
  return [
    registry.policy('policy'),
    ...payload.map(x => getIndividualKeys(x)).flat()
  ]
}

/**
 * @param {{coverKey:string, productKeys: string[]}} payload
 */
const getIndividualKeys = (payload) => {
  const coverKey = payload.coverKey

  return [
    // Leverage
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.COVER_LEVERAGE_FACTOR, payload.coverKey],
      returns: 'uint256',
      property: `${coverKey}-leverage`
    },

    // Efficiency
    ...payload.productKeys.map((productKey) => ({
      key: [sdk.utils.keyUtil.PROTOCOL.NS.COVER_PRODUCT_EFFICIENCY, payload.coverKey, productKey],
      returns: 'uint256',
      property: `${coverKey}-${productKey}`
    }))
  ]
}
