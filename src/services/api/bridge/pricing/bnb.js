import * as api from '../../config'

export const getBnbPrice = async () => {
  try {
    const url = api.BRIDGE_BNB_PRICING_URL

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

    const price = data.data

    return price
  } catch (error) {
    console.error('Could not get BNB price', error)
  }

  return null
}
