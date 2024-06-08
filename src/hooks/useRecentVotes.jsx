import {
  useEffect,
  useState
} from 'react'
import { useNetwork } from '@/src/context/Network'
import { getRecentVotes } from '@/src/services/api/consensus/recent-votes'

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
  // const [hasMore, setHasMore] = useState(true) // Pagination not supported by the API
  const { networkId } = useNetwork()

  useEffect(() => {
    if (!coverKey || !productKey || !incidentDate) {
      return
    }

    setLoading(true)

    getRecentVotes({ networkId, coverKey, productKey, incidentDate })
      .then((_data) => {
        if (!_data) { return }

        setData({
          blockNumber: null,
          votes: _data
        })

        // const isLastPage =
        //   _data.votes.length === 0 ||
        //   _data.votes.length < limit

        // if (isLastPage) {
        //   setHasMore(false)
        // }

        // setData((prev) => {
        //   return {
        //     blockNumber: _data._meta.block.number,
        //     votes: [...prev.votes, ..._data.votes]
        //   }
        // })
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [
    coverKey,
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
    loading
    // hasMore
  }
}
