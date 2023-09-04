import { getReplacedString } from '@/utils/string'

import * as api from '../config'

export const getPolicyReceipt = async (networkId, txHash) => {
  try {
    const url = getReplacedString(api.POLICY_RECEIPT_URL, { networkId, txHash: txHash.toLowerCase().slice(2) })

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

    if (data.data.length > 0) {
      return data.data[0]
    } else {
      return null
    }
  } catch (error) {
    console.error('Could not get active policies', error)
  }

  return null
}
