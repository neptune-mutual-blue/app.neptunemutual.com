import { useState, useEffect } from 'react'
import { useNetwork } from '@/src/context/Network'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { useWeb3React } from '@web3-react/core'
import { defaultStats } from '@/src/hooks/useFetchCoverStats'
import { getCoverStats, isValidProduct } from '@/src/helpers/cover'
import { ADDRESS_ONE, COVER_STATS_URL } from '@/src/config/constants'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { getStats } from '@/src/services/protocol/cover/stats'
import { getReplacedString } from '@/utils/string'
import { utils } from '@neptunemutual/sdk'
import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'

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

export const useCovers = ({ supportsProducts, fetchStats = false, fetchInfo = false }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { networkId } = useNetwork()
  const fetchCovers = useSubgraphFetch('useCovers')

  const [updatedData, setUpdatedData] = useState([])
  const { account, library } = useWeb3React()

  const { getCoverOrProductData } = useCoversAndProducts()

  useEffect(() => {
    setLoading(true)

    fetchCovers(networkId, getQuery(supportsProducts))
      .then((data) => {
        if (!data) return
        setData(data.covers)

        setUpdatedData(() => {
          return data.covers.map(c => ({ ...c, infoObj: {}, stats: defaultStats }))
        })

        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [fetchCovers, networkId, supportsProducts])

  useEffect(() => {
    let ignore = false
    if (!data.length || !networkId || ignore || (!fetchInfo && !fetchStats)) return

    setLoading(true)

    data.forEach((cover, index) => {
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
              _updated[index] = { ...cover, stats: getCoverStats(stats, supportsProducts), ...info }
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
  }, [data, networkId, fetchStats, account, library, fetchInfo, getCoverOrProductData, supportsProducts])

  return {
    loading,
    data: updatedData
  }
}
