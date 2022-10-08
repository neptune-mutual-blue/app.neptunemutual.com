import { PRICING_URL } from '@/src/config/constants'
import { getReplacedString } from '@/utils/string'

export const getPricingData = async (networkId, payload) => {
  try {
    const ENDPOINT = getReplacedString(PRICING_URL, { networkId })

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload),
      redirect: 'follow'
    })

    const result = await response.json()

    if (result.data.items) {
      return {
        items: result.data.items,
        total: result.data.total
      }
    }
  } catch (err) {
    console.error('error getting price', err)
  }

  return {
    items: payload,
    total: '0'
  }
}
