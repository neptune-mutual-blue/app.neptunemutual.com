import { getReplacedString } from '@/utils/string'

import * as api from '../config'

export const getLiquidityTransactions = async (networkId, account) => {
  try {
    const url = getReplacedString(api.USER_LIQUIDITY_TXS, { networkId, account: account.toLowerCase() })

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
    console.error('Could not get liquidity transactions', error)
  }

  return null
}
