import { api } from '@/src/config/constants'
import { getReplacedString } from '@/utils/string'

export const getExpiredPolicies = async (networkId, account) => {
  try {
    const url = getReplacedString(api.USER_EXPIRED_POLICIES, { networkId, account: account.toLowerCase() })

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
    console.error('Could not get expired policies', error)
  }

  return null
}
