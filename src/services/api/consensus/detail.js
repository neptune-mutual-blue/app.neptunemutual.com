import { getReplacedString } from '@/utils/string'

import * as api from '../config'

export const getIncidentDetail = async (networkId, coverKey, productKey, incidentDate) => {
  try {
    const url = getReplacedString(api.INCIDENT_DETAIL, { networkId, coverKey, productKey, incidentDate })

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

    const item = items[0]

    if (!item) {
      return null
    }

    return {
      ...item,
      id: item.coverKey + item.productKey + item.incidentDate,
      totalAttestationStake: item.totalAttestation || '0',
      totalRefutationStake: item.totalRefutation || '0'
    }
  } catch (error) {
    console.error('Could not get incident detail', error)
  }

  return null
}
