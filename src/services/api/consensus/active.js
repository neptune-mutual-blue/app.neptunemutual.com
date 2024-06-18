import { getReplacedString } from '@/utils/string'

import * as api from '../config'

export const getActiveIncidents = async (networkId) => {
  try {
    const url = getReplacedString(api.ACTIVE_INCIDENTS, { networkId })

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
    console.error('Could not get active incidents', error)
  }

  return null
}
