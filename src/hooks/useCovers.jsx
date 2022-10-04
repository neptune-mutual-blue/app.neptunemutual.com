import { useState, useEffect } from 'react'
import { useNetwork } from '@/src/context/Network'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'

const getQuery = (supportsProducts) => {
  return `
  {
    covers(
      where: {
         supportsProducts: ${supportsProducts}
      }
    ) {
      id
      coverKey
    }
  }
`
}

export const useCovers = ({ supportsProducts }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { networkId } = useNetwork()
  const fetchCovers = useSubgraphFetch('useCovers')

  useEffect(() => {
    setLoading(true)

    fetchCovers(networkId, getQuery(supportsProducts))
      .then((data) => {
        if (!data) return
        setData(data.covers)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [fetchCovers, networkId, supportsProducts])

  return {
    loading,
    data
  }
}
