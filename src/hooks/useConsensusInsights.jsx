import {
  useCallback,
  useRef,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import { getSubgraphData } from '@/src/services/subgraph'

const getQuery = () => {
  return `
  {
    incidentReports(
      orderBy: incidentDate
      orderDirection: desc
      where:{
        finalized: false
      }
    ) {
      id
      coverKey
      productKey
      incidentDate
      resolutionDeadline
      resolved
      finalized
      status
      resolutionTimestamp
      totalRefutedStake
      totalAttestedStake
    }
  }
`
}

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

    getSubgraphData(networkId, getQuery())
      .then((_data) => {
        if (!_data) { return }

        setData(() => {
          return {
            incidentReports: _data.incidentReports
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
