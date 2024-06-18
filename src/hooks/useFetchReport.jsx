import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { getIncidentDetail } from '@/src/services/api/consensus/detail'
import { useNetwork } from '@/src/context/Network'

/**
 *
 * @param {object} param
 * @param {string} param.coverKey
 * @param {string} param.productKey
 * @param {string | string[]} param.incidentDate
 * @returns
 */
export const useFetchReport = ({ coverKey, productKey, incidentDate }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const { networkId } = useNetwork()

  const getData = useCallback(() => {
    if (!coverKey || !productKey || !incidentDate) {
      return
    }

    return getIncidentDetail(networkId, coverKey, productKey, incidentDate)
      .then(data => {
        if (data) {
          setData(data)
        }
      })
      .catch(error => {
        console.error(error)
      })
  }, [coverKey, productKey, incidentDate, networkId])

  useEffect(() => {
    async function updateData () {
      setLoading(true)
      await getData()
      setLoading(false)
    }

    updateData()
  }, [getData])

  return {
    data,
    loading,
    refetch: getData
  }
}
