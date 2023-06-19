import { ChainConfig } from '@/src/config/hardcoded'
import { convertToUnits } from '@/utils/bn'
import { getReplacedString } from '@/utils/string'

import * as api from '../../config'

export const getHistoricalAprByCover = async (networkId) => {
  const stablecoinDecimals = ChainConfig[networkId].stablecoin.tokenDecimals

  try {
    const url = getReplacedString(api.HISTORICAL_APR_BY_COVER, { networkId })

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
        policyFeeEarned: convertToUnits(item.policyFeeEarned, stablecoinDecimals).toString(),
        startBalance: convertToUnits(item.startBalance, stablecoinDecimals).toString(),
        endBalance: convertToUnits(item.startBalance, stablecoinDecimals).toString()
      }
    })
  } catch (error) {
    console.error('Could not get historical APR by cover', error)
  }

  return null
}
