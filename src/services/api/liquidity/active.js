import { getReplacedString } from '@/utils/string'

import * as api from '../config'

export const getActiveLiquidities = async (networkId, account) => {
  try {
    const url = getReplacedString(api.USER_ACTIVE_LIQUIDITIES, { networkId, account: account.toLowerCase() })

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

    const liquidities = data.data

    if (!liquidities || !Array.isArray(liquidities)) {
      return null
    }

    return liquidities
  } catch (error) {
    console.error('Could not get active policies', error)
  }

  return null
}
