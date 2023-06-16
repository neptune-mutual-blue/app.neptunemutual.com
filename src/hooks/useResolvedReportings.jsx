import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { CARDS_PER_PAGE } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'

const getQuery = (itemsToSkip) => {
  return `
  {
    incidentReports(
      skip: ${itemsToSkip}
      first: ${CARDS_PER_PAGE}
      orderBy: incidentDate
      orderDirection: desc
      where:{
        resolved: true
      }
    ) {
      id
      coverKey
      productKey
      incidentDate
      resolutionDeadline
      resolved
      emergencyResolved
      emergencyResolveTransaction{
        timestamp
      }
      resolveTransaction{
        timestamp
      }
      finalized
      status
      resolutionTimestamp
      totalAttestedStake
      totalRefutedStake
    }
  }
  `
}

export const useResolvedReportings = () => {
  const [data, setData] = useState({
    incidentReports: []
  })
  const [loading, setLoading] = useState(false)
  const [itemsToSkip, setItemsToSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const { networkId } = useNetwork()
  const fetchResolvedReportings = useSubgraphFetch('useResolvedReportings')

  useEffect(() => {
    setLoading(true)

    fetchResolvedReportings(networkId, getQuery(itemsToSkip))
      .then((_data) => {
        if (!_data) { return }

        const isLastPage =
          _data.incidentReports.length === 0 ||
          _data.incidentReports.length < CARDS_PER_PAGE

        if (isLastPage) {
          setHasMore(false)
        }

        setData((prev) => {
          return {
            incidentReports: [...prev.incidentReports, ..._data.incidentReports]
          }
        })
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [fetchResolvedReportings, itemsToSkip, networkId])

  const handleShowMore = useCallback(() => {
    setItemsToSkip((prev) => { return prev + CARDS_PER_PAGE })
  }, [])

  return {
    handleShowMore,
    hasMore,
    data: {
      incidentReports: data.incidentReports
    },
    loading
  }
}
