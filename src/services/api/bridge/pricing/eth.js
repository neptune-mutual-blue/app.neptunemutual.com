import * as api from '../../config'

export const getEthPrice = async () => {
  try {
    const url = api.BRIDGE_ETH_PRICING_URL

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
    console.error('Could not get ETH price', error)
  }

  return null
}
