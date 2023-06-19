import { getReplacedString } from '@/utils/string'

import * as api from '../config'

// @note: THIS FILE IS NOT BEING USED
export const getPolicyTransactions = async (networkId, account) => {
  try {
    const url = getReplacedString(api.USER_POLICY_TXS, { networkId, account: account.toLowerCase() })

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

    const txs = data.data

    if (!txs || !Array.isArray(txs)) {
      return null
    }

    return txs
  } catch (error) {
    console.error('Could not get policy transactions', error)
  }

  return null
}
