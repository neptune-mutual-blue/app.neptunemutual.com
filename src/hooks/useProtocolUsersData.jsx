import { useNetwork } from '@/src/context/Network'
import { useState, useEffect } from 'react'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'

const query = `
{
  protocolUsers (orderBy: totalProtection, orderDirection: desc) {
    id
    totalProtection
    purchasedCoverCount
  }
}
`

export const useProtocolUsersData = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const { networkId } = useNetwork()
  const fetchUserData = useSubgraphFetch('useProtocolUsersData')

  useEffect(() => {
    if (!networkId) return

    setLoading(true)

    fetchUserData(networkId, query)
      .then(({ protocolUsers }) => {
        if (protocolUsers) setData(protocolUsers)
      })
      .catch(error => {
        console.log('Error in fetching protocolUsers: ', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [networkId, fetchUserData])

  return {
    data,
    loading
  }
}
