import { useState, useEffect } from 'react'
import { useNetwork } from '@/src/context/Network'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'

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

export const useConsensusAnalytics = () => {
  const [data, setData] = useState({
    incidentReports: []
  })
  const [loading, setLoading] = useState(false)

  const { networkId } = useNetwork()
  const fetchConsensusAnalytics = useSubgraphFetch('useConsensusAnalytics')

  useEffect(() => {
    setLoading(true)

    fetchConsensusAnalytics(networkId, getQuery())
      .then((_data) => {
        if (!_data) return

        setData(() => ({
          incidentReports: _data.incidentReports
        }))
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [fetchConsensusAnalytics, networkId])

  return {
    data: {
      incidentReports: data.incidentReports
    },
    loading
  }
}
