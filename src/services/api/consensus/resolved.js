import { getReplacedString } from '@/utils/string'

import * as api from '../config'

export const getResolvedIncidents = async (networkId) => {
  try {
    const url = getReplacedString(api.RESOLVED_INCIDENTS, { networkId })

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
      return []
    }

    return items.map((item) => {
      return {
        ...item,
        id: item.coverKey + item.productKey + item.incidentDate
      }
    })
  } catch (error) {
    console.error('Could not get resolved incidents', error)
  }

  return null
}
