import { getReplacedString } from '@/utils/string'

import * as api from '../config'

export const getProductSummaryWithAccount = async (networkId, account) => {
  try {
    const url = getReplacedString(api.PRODUCT_SUMMARY_WITH_ACCOUNT_URL, { networkId, account })

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

    return items
  } catch (error) {
    console.error('Could not get product summary (common)', error)
  }

  return null
}
