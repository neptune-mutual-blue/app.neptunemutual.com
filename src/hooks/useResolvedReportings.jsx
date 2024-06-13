import { useState, useEffect, useCallback } from 'react'
import { useNetwork } from '@/src/context/Network'
import { CARDS_PER_PAGE } from '@/src/config/constants'
import { getResolvedIncidents } from '@/src/services/api/consensus/resolved'

export const useResolvedReportings = () => {
  const [data, setData] = useState({ incidentReports: [] })
  const [loading, setLoading] = useState(true)
  const [itemsToSkip, setItemsToSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const { networkId } = useNetwork()

  useEffect(() => {
    setData({ incidentReports: [] })
    setItemsToSkip(0)
    setHasMore(true)
    setLoading(true)
  }, [networkId])

  useEffect(() => {
    let ignore = false

    setLoading(true)

    // @ts-ignore
    getResolvedIncidents(networkId, itemsToSkip)
      .then((_data) => {
        if (ignore || !_data) { return }

        const isLastPage =
          _data.length === 0 ||
          _data.length < CARDS_PER_PAGE

        if (isLastPage) {
          setHasMore(false)
        }

        setData((prev) => {
          return {
            incidentReports: [...prev.incidentReports, ..._data]
          }
        })
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [itemsToSkip, networkId])

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
