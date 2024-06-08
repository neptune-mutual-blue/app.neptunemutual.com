import { getReplacedString } from '@/utils/string'

import * as api from '../config'

export const getRecentVotes = async ({ networkId, coverKey, productKey, incidentDate }) => {
  try {
    const url = getReplacedString(api.RECENT_VOTES, { networkId, coverKey, productKey, incidentDate })

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
    console.error('Could not get recent votes', error)
  }

  return null
}
