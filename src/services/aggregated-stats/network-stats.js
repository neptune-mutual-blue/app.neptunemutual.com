import DateLib from '@/lib/date/DateLib'
import { MULTIPLIER, SUBGRAPH_API_URLS } from '@/src/config/constants'
import { getSubgraphData } from '@/src/services/subgraph'
import { sumOf } from '@/utils/bn'
import { getNetworkInfo } from '@/src/hooks/useValidateNetwork'

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
      coverKey
      productKey
    }
    protocols {
      totalCoverFee
      totalCoverLiquidityAdded
      totalCoverLiquidityRemoved
      totalFlashLoanFees
    }
    activeCxTokens: cxTokens(where: {expiryDate_gt: "${startOfMonth}"}) {
      totalCoveredAmount
    }
    allCxTokens: cxTokens {
      totalCoveredAmount
    }
  }`
}

function getAvailableKeys (data) {
  const availableKeys = data.dedicatedCovers.map(x => x.coverKey)
  data.diversifiedCovers.forEach(c => {
    c.products.forEach(p => {
      availableKeys.push(c.coverKey + '-' + p.productKey)
    })
  })

  return availableKeys
}

function getReportingKeys (data) {
  return data.reporting.map(x => {
    return (x.coverKey + '-' + x.productKey)
  })
}

function getProductCount (data) {
  let productCount = 0

  for (let i = 0; i < data.diversifiedCovers.length; i++) {
    productCount += data.diversifiedCovers[i].products.length
  }

  return productCount
}

async function getIndividualHeroStats (networkId) {
  const data = await getSubgraphData(networkId, getQuery())

  if (!data) {
    return
  }

  const totalCoverFee = sumOf(...data.protocols.map((x) => x.totalCoverFee))
  const totalCoverLiquidityAdded = sumOf(...data.protocols.map((x) => x.totalCoverLiquidityAdded))
  const totalCoverLiquidityRemoved = sumOf(...data.protocols.map((x) => x.totalCoverLiquidityRemoved))
  const totalFlashLoanFees = sumOf(...data.protocols.map((x) => x.totalFlashLoanFees))

  const totalCoveredAmount = sumOf(...data.allCxTokens.map((x) => x.totalCoveredAmount))
  const activeCoveredAmount = sumOf(...data.activeCxTokens.map((x) => x.totalCoveredAmount))

  const tvlCover = totalCoverLiquidityAdded
    .minus(totalCoverLiquidityRemoved)
    .plus(totalFlashLoanFees)
    .plus(totalCoverFee)
    .toString()

  const dedicatedCoverCount = data.dedicatedCovers.length

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

  return {
    networkId,
    availableKeys: getAvailableKeys(data),
    reportingKeys: getReportingKeys(data),
    dedicatedCoverCount: dedicatedCoverCount,
    productCount: getProductCount(data),
    coverFee: totalCoverFee.toString(),
    totalCoveredAmount: totalCoveredAmount.toString(),
    activeCoveredAmount: activeCoveredAmount.toString(),
    totalCoverage: totalCoverage,
    tvlPool: '0',
    tvlCover
  }
}

export async function getNetworkStats (currentNetworkId) {
  const { isMainNet } = getNetworkInfo(currentNetworkId)

  const promises = []

  for (const id in SUBGRAPH_API_URLS) {
    const match = getNetworkInfo(parseInt(id)).isMainNet === isMainNet

    if (match) {
      promises.push(getIndividualHeroStats(parseInt(id)))
    }
  }

  const result = await Promise.all(promises)

  const combined = result.reduce((prev, curr) => {
    return {
      uniqueAvailableKeys: Array.from(new Set([...prev.uniqueAvailableKeys, ...curr.availableKeys])),
      uniqueReportingKeys: Array.from(new Set([...prev.uniqueReportingKeys, ...curr.reportingKeys])),
      totalNonUniqueDedicatedCoverCount: prev.totalNonUniqueDedicatedCoverCount + curr.dedicatedCoverCount,
      totalNonUniqueProductCount: prev.totalNonUniqueProductCount + curr.productCount,
      totalCoverFee: sumOf(prev.totalCoverFee, curr.coverFee).toString(),
      totalCoveredAmount: sumOf(prev.totalCoveredAmount, curr.totalCoveredAmount).toString(),
      activeCoveredAmount: sumOf(prev.activeCoveredAmount, curr.activeCoveredAmount).toString(),
      totalCoverage: sumOf(prev.totalCoverage, curr.totalCoverage).toString(),
      totalTvlPool: sumOf(prev.totalTvlPool, curr.tvlPool).toString(),
      totalTvlCover: sumOf(prev.totalTvlCover, curr.tvlCover).toString()
    }
  }, {
    uniqueAvailableKeys: [],
    uniqueReportingKeys: [],
    totalNonUniqueDedicatedCoverCount: 0,
    totalNonUniqueProductCount: 0,
    totalCoverFee: '0',
    totalCoveredAmount: '0',
    activeCoveredAmount: '0',
    totalCoverage: '0',
    totalTvlPool: '0',
    totalTvlCover: '0'
  })

  return {
    individual: result,
    combined
  }
}
