import {
  useCallback,
  useRef,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import { getActiveIncidents } from '@/src/services/api/consensus/active'

export const useConsensusInsights = () => {
  const [data, setData] = useState({
    incidentReports: []
  })
  const [loading, setLoading] = useState(false)
  const fetched = useRef(false)

  const { networkId } = useNetwork()

  const fetchData = useCallback(() => {
    if (fetched.current) {
      return
    }

    setLoading(true)

    getActiveIncidents(networkId)
      .then((_data) => {
        if (!_data) { return }

        setData(() => {
          return {
            incidentReports: _data
          }
        })

        fetched.current = true
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [networkId])

  return {
    data: {
      incidentReports: data.incidentReports
    },
    loading,
    setData,
    fetchData
  }
}
