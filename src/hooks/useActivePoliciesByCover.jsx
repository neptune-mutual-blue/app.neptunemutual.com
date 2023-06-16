import { sumOf } from '@/utils/bn'
import { useWeb3React } from '@web3-react/core'
import DateLib from '@/lib/date/DateLib'
import { useState, useEffect, useMemo } from 'react'
import { useNetwork } from '@/src/context/Network'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'

const getQuery = (limit, page, startOfMonth, account, coverKey, productKey) => {
  return `
  {
    userPolicies(
      skip: ${limit * (page - 1)}
      first: ${limit}
      where: {
        expiresOn_gt: "${startOfMonth}"
        account: "${account}"
        coverKey: "${coverKey}"
        productKey: "${productKey}"
      }
    ) {
      id
      coverKey
      productKey
      cxToken {
        id
        creationDate
        expiryDate
        tokenSymbol
        tokenDecimals
      }
      totalAmountToCover
      expiresOn
      cover {
        id
      }
    }
  }
  `
}

export const useActivePoliciesByCover = ({
  coverKey,
  productKey,
  limit,
  page
}) => {
  const [data, setData] = useState({
    userPolicies: []
  })
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const { networkId } = useNetwork()
  const { account } = useWeb3React()
  const fetchActivePoliciesByCover = useSubgraphFetch(
    'useActivePoliciesByCover'
  )

  useEffect(() => {
    if (!networkId || !account) {
      return
    }

    const startOfMonth = DateLib.toUnix(DateLib.getSomInUTC(Date.now()))

    setLoading(true)

    fetchActivePoliciesByCover(
      networkId,
      getQuery(limit, page, startOfMonth, account, coverKey, productKey)
    )
      .then((_data) => {
        if (!_data) { return }

        const isLastPage =
          _data.userPolicies.length === 0 || _data.userPolicies.length < limit

        if (isLastPage) {
          setHasMore(false)
        }

        setData((prev) => {
          return {
            userPolicies: [...prev.userPolicies, ..._data.userPolicies]
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
    account,
    coverKey,
    fetchActivePoliciesByCover,
    limit,
    networkId,
    page,
    productKey
  ])

  const totalActiveProtection = useMemo(() => {
    return sumOf(
      '0',
      ...data.userPolicies.map((x) => { return x.totalAmountToCover || '0' })
    )
  }, [data.userPolicies])

  return {
    data: {
      activePolicies: data.userPolicies,
      totalActiveProtection
    },
    loading,
    hasMore
  }
}
