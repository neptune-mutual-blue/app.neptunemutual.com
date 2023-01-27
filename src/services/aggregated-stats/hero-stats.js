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
    }
    cxTokens(where: {expiryDate_gt: "${startOfMonth}"}) {
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
  const totalCoveredAmount = sumOf(...data.cxTokens.map((x) => x.totalCoveredAmount))

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
    availableKeys: getAvailableKeys(data),
    reportingKeys: getReportingKeys(data),
    dedicatedCoverCount: dedicatedCoverCount,
    productCount: getProductCount(data),
    coverFee: totalCoverFee.toString(),
    covered: totalCoveredAmount.toString(),
    totalCoverage: totalCoverage,
    tvlPool: '0'
  }
}

export async function getHeroStats (currentNetworkId) {
  const { isMainNet } = getNetworkInfo(currentNetworkId)

  const promises = []

  for (const id in SUBGRAPH_API_URLS) {
    if (isMainNet && getNetworkInfo(parseInt(id)).isMainNet) {
      promises.push(getIndividualHeroStats(parseInt(id)))
    }

    if (!isMainNet && !getNetworkInfo(parseInt(id)).isMainNet) {
      promises.push(getIndividualHeroStats(parseInt(id)))
    }
  }

  const result = await Promise.all(promises)

  return result.reduce((prev, curr) => {
    return {
      availableKeys: [...prev.availableKeys, ...curr.availableKeys],
      reportingKeys: [...prev.reportingKeys, ...curr.reportingKeys],
      dedicatedCoverCount: prev.dedicatedCoverCount + curr.dedicatedCoverCount,
      productCount: prev.productCount + curr.productCount,
      coverFee: sumOf(prev.coverFee, curr.coverFee).toString(),
      covered: sumOf(prev.covered, curr.covered).toString(),
      totalCoverage: sumOf(prev.totalCoverage, curr.totalCoverage).toString(),
      tvlPool: sumOf(prev.tvlPool, curr.tvlPool).toString()
    }
  }, {
    availableKeys: [],
    reportingKeys: [],
    dedicatedCoverCount: 0,
    productCount: 0,
    coverFee: '0',
    covered: '0',
    totalCoverage: '0',
    tvlPool: '0'
  })
}
