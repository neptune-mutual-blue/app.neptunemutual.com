import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { ADDRESS_ONE, COVER_STATS_URL } from '@/src/config/constants'
import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import { useNetwork } from '@/src/context/Network'
import { getCoverStats, isValidProduct } from '@/src/helpers/cover'
import { defaultStats } from '@/src/hooks/useFetchCoverStats'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { getStats } from '@/src/services/protocol/cover/stats'
import { getReplacedString } from '@/utils/string'
import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useRef, useState } from 'react'

const getQuery = () => {
  return `
  {
    coverProducts {
      id
      coverKey
      productKey
    }
  }
`
}

export const useFlattenedCoverProducts = (eager = true, fetchStats = false, fetchInfo = false) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { networkId } = useNetwork()
  const fetchFlattenedCoverProducts = useSubgraphFetch(
    'useFlattenedCoverProducts'
  )

  const [updatedData, setUpdatedData] = useState([])
  const { account, library } = useWeb3React()

  const fetched = useRef({ data: false })
  const { getCoverOrProductData } = useCoversAndProducts()

  const fetchCovers = useCallback(() => {
    if (fetched.current.data) return

    setLoading(true)
    fetchFlattenedCoverProducts(networkId, getQuery())
      .then((data) => {
        if (!data) return
        setData(data.coverProducts)

        setUpdatedData(() => {
          return data.coverProducts.map(c => ({ ...c, infoObj: {}, stats: defaultStats }))
        })

        fetched.current.data = true

        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [fetchFlattenedCoverProducts, networkId])

  useEffect(() => {
    if (eager) fetchCovers()
  }, [eager, fetchCovers])

  useEffect(() => {
    let ignore = false
    if (!data.length || !networkId || ignore || (!fetchInfo && !fetchStats)) return

    setLoading(true)
    data.forEach(async (cover, index) => {
      const coverKey = cover.coverKey
      const productKey = (isValidProduct(cover.productKey)) ? cover.productKey : utils.keyUtil.toBytes32('')

      const replacements = {
        networkId,
        coverKey,
        productKey,
        account: ADDRESS_ONE
      }

      let stats = defaultStats
      let info = { infoObj: {} }

      const requests = []
      if (fetchInfo) { // getch coverInfo
        const request = {
          method: getCoverOrProductData,
          args: [{ coverKey, productKey, networkId }],
          validate: (res) => {
            if (res) info = res
          }
        }
        requests.push(request)
      }

      if (fetchStats) { // getch coverstats
        if (account) {
          const signerOrProvider = getProviderOrSigner(library, account, networkId)
          const request = {
            method: getStats,
            args: [
              networkId,
              coverKey,
              productKey,
              account,
              signerOrProvider.provider
            ],
            validate: (res) => {
              if (res && Object.keys(res).length) {
                stats = res
              }
            }
          }
          requests.push(request)
        } else {
          const request = {
            method: fetch,
            args: [
              getReplacedString(COVER_STATS_URL, replacements),
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json'
                }
              }
            ],
            validate: async (res) => {
              if (res.ok) {
                const dataResponse = (await res.json()).data
                stats = dataResponse
              }
            }
          }
          requests.push(request)
        }
      }

      requests.forEach(({ method, args, validate }) => {
        method(...args)
          .then(async (response) => {
            await validate(response)

            setUpdatedData(_prev => {
              if (ignore) return _prev

              const _updated = [..._prev]
              _updated[index] = { ...cover, stats: getCoverStats(stats, false), ...info }
              return [..._updated]
            })
          })
          .catch(error => console.error(error))
          .finally(() => {
            if (index === data.length - 1) setLoading(false)
          })
      })
    })

    return () => {
      ignore = true
    }
  }, [data, networkId, fetchStats, account, library, fetchInfo, getCoverOrProductData])

  return {
    loading,
    data: updatedData,
    fetchData: fetchCovers
  }
}
