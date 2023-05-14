import { api } from '@/src/config/constants'
import { getReplacedString } from '@/utils/string'

export const getTopAccountsByProtection = async (networkId) => {
  try {
    const url = getReplacedString(api.TOP_ACCOUNTS_BY_PROTECTION, { networkId })

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

    return data.data
  } catch (error) {
    console.error('Could not get top accounts by policy', error)
  }

  return null
}
