import { useState, useEffect } from 'react'
import { sumOf } from '@/utils/bn'
import DateLib from '@/lib/date/DateLib'
import { getNetworkId } from '@/src/config/environment'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { getTotalCoverage } from '@/src/services/protocol/cover/liquidity'
import { useNetwork } from '@/src/context/Network'
import { useWeb3React } from '@web3-react/core'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'

const defaultData = {
  availableCovers: 0,
  reportingCovers: 0,
  totalCoverage: '0',
  tvlPool: '0',
  covered: '0',
  coverFee: '0'
}

const getQuery = () => {
  const startOfMonth = DateLib.toUnix(DateLib.getSomInUTC(Date.now()))

  return `
  {
    dedicatedCovers: covers(where: {supportsProducts: false}) {
      coverKey
    }
    diversifiedCovers: covers(where: {supportsProducts: true}) {
      coverKey
      products {
        productKey
      }
    }
    reporting: incidentReports(where: {finalized: false}) {
      id
    }
    protocols {
      totalFlashLoanFees
      totalCoverLiquidityAdded
      totalCoverLiquidityRemoved
      totalCoverFee
    }
    cxTokens(where: {expiryDate_gt: "${startOfMonth}"}) {
      totalCoveredAmount
    }
  }`
}

export const useFetchHeroStats = () => {
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)
  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()
  const fetchStats = useSubgraphFetch('useFetchHeroStats')

  useEffect(() => {
    setLoading(true)

    ;(async function () {
      try {
        if (!networkId) {
          return
        }

        const data = await fetchStats(getNetworkId(), getQuery())

        if (!data) {
          return
        }

        const totalCoverLiquidityAdded = sumOf(
          ...data.protocols.map((x) => x.totalCoverLiquidityAdded)
        )
        const totalCoverLiquidityRemoved = sumOf(
          ...data.protocols.map((x) => x.totalCoverLiquidityRemoved)
        )
        const totalFlashLoanFees = sumOf(
          ...data.protocols.map((x) => x.totalFlashLoanFees)
        )
        const totalCoverFee = sumOf(
          ...data.protocols.map((x) => x.totalCoverFee)
        )
        const totalCoveredAmount = sumOf(
          ...data.cxTokens.map((x) => x.totalCoveredAmount)
        )

        let totalCoverage = totalCoverLiquidityAdded
          .minus(totalCoverLiquidityRemoved)
          .plus(totalFlashLoanFees)
          .toString()

        let availableCount = data.dedicatedCovers.length
        for (let i = 0; i < data.diversifiedCovers.length; i++) {
          availableCount += data.diversifiedCovers[i].products.length
        }

        if (account) {
          // Get data from provider if wallet's connected
          const signerOrProvider = getProviderOrSigner(
            library,
            account,
            networkId
          )

          totalCoverage = await getTotalCoverage(
            networkId,
            [
              ...data.diversifiedCovers.map(cover => ({
                coverKey: cover.coverKey,
                productKeys: cover.products.map(product => product.productKey)
              })),
              ...data.dedicatedCovers.map(cover => ({
                coverKey: cover.coverKey,
                productKeys: null
              }))
            ],
            signerOrProvider.provider)
        }

        setData({
          availableCovers: availableCount,
          reportingCovers: data.reporting.length,
          coverFee: totalCoverFee.toString(),
          covered: totalCoveredAmount.toString(),
          totalCoverage: totalCoverage,
          tvlPool: '0'
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [account, fetchStats, library, networkId])

  return {
    data,
    loading
  }
}
