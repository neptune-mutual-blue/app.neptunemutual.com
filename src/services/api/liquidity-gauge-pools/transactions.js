import { ChainConfig } from '@/src/config/hardcoded'
import { convertToUnits } from '@/utils/bn'
import { getReplacedString } from '@/utils/string'

import * as api from '../config'

export const getLgpTransactions = async (networkId, account) => {
  try {
    const url = getReplacedString(api.LGP_TXS_URL, { networkId, account: account.toLowerCase() })

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

    return txs.map(tx => {
      // @todo: replace with backend response data
      const decimals = tx.event === 'Get Reward' ? ChainConfig[networkId].npm.tokenDecimals : ChainConfig[networkId].vaultTokenDecimals

      return {
        ...tx,
        amount: convertToUnits(tx.amount, decimals).toString() // @todo: update with correct decimals
      }
    })
  } catch (error) {
    console.error('Could not get liquidity gauge pool transactions', error)
  }

  return null
}
