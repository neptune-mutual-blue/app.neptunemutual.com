import { ChainConfig } from '@/src/config/hardcoded'
import { convertToUnits } from '@/utils/bn'
import { getReplacedString } from '@/utils/string'

import * as api from '../../config'

export const getCoverExpiringThisMonth = async (networkId) => {
  const stablecoinDecimals = ChainConfig[networkId].stablecoin.tokenDecimals

  try {
    const url = getReplacedString(api.COVER_EXPIRING_THIS_MONTH, { networkId })

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
        totalProtection: convertToUnits(item.totalProtection, stablecoinDecimals).toString()
      }
    })
  } catch (error) {
    console.error('Could not get covers expiring this month', error)
  }

  return null
}
