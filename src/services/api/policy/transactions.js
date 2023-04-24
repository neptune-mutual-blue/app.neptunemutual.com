import { api } from '@/src/config/constants'
import { getReplacedString } from '@/utils/string'

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

    return data.data
  } catch (error) {
    console.error('Could not get policy transactions', error)
  }

  return null
}
