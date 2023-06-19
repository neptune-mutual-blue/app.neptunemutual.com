import { useNetwork } from '@/src/context/Network'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { useState, useEffect } from 'react'

const getQuery = (limit, page, coverKey, productKey, incidentDate) => {
  return `
  {
    _meta {
      block {
        number
      }
    }
    votes(
      skip: ${limit * (page - 1)}
      first: ${limit} 
      orderBy: createdAtTimestamp
      orderDirection: desc
      where: {
        coverKey:"${coverKey}"
        productKey:"${productKey}"
        incidentDate: "${incidentDate}"
    }) {
      id
      createdAtTimestamp
      voteType
      witness
      stake
      transaction {
        id
        timestamp
      }
    }
  }        
  `
}

export const useRecentVotes = ({
  coverKey,
  productKey,
  incidentDate,
  limit,
  page
}) => {
  const [data, setData] = useState({
    votes: [],
    blockNumber: null
  })
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { networkId } = useNetwork()
  const fetchRecentVotes = useSubgraphFetch('useRecentVotes')

  useEffect(() => {
    if (!coverKey || !incidentDate) {
      return
    }

    setLoading(true)

    fetchRecentVotes(
      networkId,
      getQuery(limit, page, coverKey, productKey, incidentDate)
    )
      .then((_data) => {
        if (!_data) { return }

        const isLastPage =
          _data.votes.length === 0 || _data.votes.length < limit

        if (isLastPage) {
          setHasMore(false)
        }

        setData((prev) => {
          return {
            blockNumber: _data._meta.block.number,
            votes: [...prev.votes, ..._data.votes]
          }
        })
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [
    coverKey,
    fetchRecentVotes,
    incidentDate,
    limit,
    networkId,
    page,
    productKey
  ])

  return {
    data: {
      blockNumber: data.blockNumber,
      transactions: data?.votes || []
    },
    loading,
    hasMore
  }
}
