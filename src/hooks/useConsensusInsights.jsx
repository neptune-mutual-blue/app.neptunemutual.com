import { useState, useRef } from 'react'
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

export const useConsensusInsights = () => {
  const [data, setData] = useState({
    incidentReports: []
  })
  const [loading, setLoading] = useState(false)
  const fetched = useRef(false)

  const { networkId } = useNetwork()
  const fetchConsensusAnalytics = useSubgraphFetch('useConsensusInsights')

  const fetchData = () => {
    if (fetched.current || loading) {
      return
    }

    setLoading(true)

    fetchConsensusAnalytics(networkId, getQuery())
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
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return {
    data: {
      incidentReports: data.incidentReports
    },
    loading,
    setData,
    fetchData
  }
}
