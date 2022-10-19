import { useState, useEffect } from 'react'
import { sumOf } from '@/utils/bn'
import DateLib from '@/lib/date/DateLib'
import { getNetworkId } from '@/src/config/environment'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { MULTIPLIER } from '@/src/config/constants'

const defaultData = {
  availableCovers: 0,
  dedicatedCoverCount: 0,
  productCount: 0,
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
      vaults {
        totalFlashLoanFees
        totalCoverLiquidityAdded
        totalCoverLiquidityRemoved
      }
      leverage
    }
    diversifiedCovers: covers(where: {supportsProducts: true}) {
      coverKey
      vaults {
        totalFlashLoanFees
        totalCoverLiquidityAdded
        totalCoverLiquidityRemoved
      }
      products {
        productKey
        capitalEfficiency
      }
      leverage
    }
    reporting: incidentReports(where: {finalized: false}) {
      id
    }
    protocols {
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
  const fetchStats = useSubgraphFetch('useFetchHeroStats')

  useEffect(() => {
    setLoading(true)

    ;(async function () {
      try {
        const data = await fetchStats(getNetworkId(), getQuery())

        if (!data) {
          return
        }

        const totalCoverFee = sumOf(...data.protocols.map((x) => x.totalCoverFee))
        const totalCoveredAmount = sumOf(...data.cxTokens.map((x) => x.totalCoveredAmount))

        const dedicatedCoverCount = data.dedicatedCovers.length
        let productCount = 0

        for (let i = 0; i < data.diversifiedCovers.length; i++) {
          productCount += data.diversifiedCovers[i].products.length
        }

        const availableCount = dedicatedCoverCount + productCount

        let totalCoverage = '0'
        data.dedicatedCovers.forEach(cover => {
          const totalCoverLiquidityAdded = sumOf(...cover.vaults.map((x) => x.totalCoverLiquidityAdded))
          const totalCoverLiquidityRemoved = sumOf(...cover.vaults.map((x) => x.totalCoverLiquidityRemoved))
          const totalFlashLoanFees = sumOf(...cover.vaults.map((x) => x.totalFlashLoanFees))

          const coverage = totalCoverLiquidityAdded
            .minus(totalCoverLiquidityRemoved)
            .plus(totalFlashLoanFees)
            .toString()

          totalCoverage = sumOf(totalCoverage, coverage).toString()
        })

        data.diversifiedCovers.forEach(cover => {
          const totalCoverLiquidityAdded = sumOf(...cover.vaults.map((x) => x.totalCoverLiquidityAdded))
          const totalCoverLiquidityRemoved = sumOf(...cover.vaults.map((x) => x.totalCoverLiquidityRemoved))
          const totalFlashLoanFees = sumOf(...cover.vaults.map((x) => x.totalFlashLoanFees))
          const medianEfficiency = sumOf(...cover.products.map((x) => x.capitalEfficiency)).dividedBy(cover.products.length)

          const coverage = totalCoverLiquidityAdded
            .minus(totalCoverLiquidityRemoved)
            .plus(totalFlashLoanFees)
            .multipliedBy(cover.leverage)
            .multipliedBy(medianEfficiency)
            .dividedBy(MULTIPLIER)
            .toString()

          totalCoverage = sumOf(totalCoverage, coverage).toString()
        })

        setData({
          availableCovers: availableCount,
          dedicatedCoverCount: dedicatedCoverCount,
          productCount: productCount,
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
  }, [fetchStats])

  return {
    data,
    loading
  }
}
