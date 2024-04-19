import {
  useEffect,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import {
  getSnapshotApiURL,
  parseEmptyScores
} from '@/utils/snapshot'

const getQuery = (id) => {
  return `query SingleProposal {
  proposal(id: "${id}") {
    id
    title
    body
    choices
    start
    end
    ipfs
    snapshot
    network
    state
    author
    scores
    symbol
    space {
      id
      name
    }
  }
}`
}

export const useSnapshotProposalById = (id) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const { networkId } = useNetwork()

  useEffect(() => {
    if (!id || !networkId) { return }

    const url = getSnapshotApiURL(networkId)

    const fetchSnapshotById = async () => {
      setLoading(true)

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({ query: getQuery(id) })
        })

        if (res.ok) {
          const data = await res.json()
          if (data?.data?.proposal) {
            setData(parseEmptyScores(data.data.proposal))
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSnapshotById()
  }, [id, networkId])

  return {
    data,
    loading
  }
}
