import { ChainConfig } from '@/src/config/hardcoded'
import { convertToUnits } from '@/utils/bn'
import { getReplacedString } from '@/utils/string'

import * as api from '../../config'

export const getCoverPremiumByPool = async (networkId) => {
  const stablecoinDecimals = ChainConfig[networkId].stablecoin.tokenDecimals

  try {
    const url = getReplacedString(api.COVER_PREMIUM_BY_POOL, { networkId })

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    const items = data.data

    if (!items || !Array.isArray(items)) {
      return null
    }

    return items.map(item => {
      return {
        ...item,
        totalPremium: convertToUnits(item.totalPremium, stablecoinDecimals).toString()
      }
    })
  } catch (error) {
    console.error('Could not get cover premium by pool', error)
  }

  return null
}
