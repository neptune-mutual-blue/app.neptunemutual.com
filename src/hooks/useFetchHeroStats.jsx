import { useState, useEffect } from 'react'
import { sumOf } from '@/utils/bn'
import DateLib from '@/lib/date/DateLib'
import { getNetworkId } from '@/src/config/environment'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'

const defaultData = {
  availableCovers: 0,
  reportingCovers: 0,
  tvlCover: '0',
  tvlPool: '0',
  covered: '0',
  coverFee: '0'
}

const getQuery = () => {
  const startOfMonth = DateLib.toUnix(DateLib.getSomInUTC(Date.now()))

  return `
  {
    covers {
      id
    }
    reporting: incidentReports (where: {
      finalized: false
    }) {
      id
    }
    protocols {
      totalFlashLoanFees
      totalCoverLiquidityAdded
      totalCoverLiquidityRemoved
      totalCoverFee
    }
    cxTokens(where: {
      expiryDate_gt: "${startOfMonth}"
    }){
      totalCoveredAmount
    }
  }
  `
}

export const useFetchHeroStats = () => {
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)
  const fetchFetchHeroStats = useSubgraphFetch('useFetchHeroStats')

  useEffect(() => {
    setLoading(true)

    fetchFetchHeroStats(getNetworkId(), getQuery())
      .then((data) => {
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

        const tvlCover = totalCoverLiquidityAdded
          .minus(totalCoverLiquidityRemoved)
          .plus(totalFlashLoanFees)
          .toString()

        setData({
          availableCovers: data.covers.length,
          reportingCovers: data.reporting.length,
          coverFee: totalCoverFee.toString(),
          covered: totalCoveredAmount.toString(),
          tvlCover: tvlCover,
          tvlPool: '0'
        })
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [fetchFetchHeroStats])

  return {
    data,
    loading
  }
}
