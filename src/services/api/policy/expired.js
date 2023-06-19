import { ChainConfig } from '@/src/config/hardcoded'
import { convertToUnits } from '@/utils/bn'
import { getReplacedString } from '@/utils/string'

import * as api from '../config'

export const getExpiredPolicies = async (networkId, account) => {
  const stablecoinDecimals = ChainConfig[networkId].stablecoin.tokenDecimals

  try {
    const url = getReplacedString(api.USER_EXPIRED_POLICIES, { networkId, account: account.toLowerCase() })

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

    const policies = data.data

    if (!policies || !Array.isArray(policies)) {
      return null
    }

    return policies.map(policy => {
      return {
        ...policy,
        amount: convertToUnits(policy.amount, stablecoinDecimals).toString()
      }
    })
  } catch (error) {
    console.error('Could not get expired policies', error)
  }

  return null
}
