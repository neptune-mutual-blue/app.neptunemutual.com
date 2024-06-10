import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { REPORT_DETAILS_URL } from '@/src/config/constants'
import { getNetworkId } from '@/src/config/environment'
import { getReplacedString } from '@/utils/string'

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
  const [loading, setLoading] = useState(false)

  const getData = useCallback(async () => {
    try {
      const response = await fetch(
        getReplacedString(REPORT_DETAILS_URL, {
          networkId: getNetworkId(),
          coverKey,
          productKey,
          incidentDate
        })
      )
      if (!response.ok) {
        return
      }

      const data = await response.json()

      if (data && Array.isArray(data)) {
        setData(data[0])
      }
    } catch (e) {
      console.error(e)
    }
  }, [coverKey, productKey, incidentDate])

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
