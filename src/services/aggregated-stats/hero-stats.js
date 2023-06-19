import DateLib from '@/lib/date/DateLib'
import {
  MULTIPLIER,
  SUBGRAPH_API_URLS
} from '@/src/config/constants'
import { ChainConfig } from '@/src/config/hardcoded'
import { getSubgraphData } from '@/src/services/subgraph'
import {
  convertFromUnits,
  sumOf
} from '@/utils/bn'
import { getNetworkInfo } from '@/utils/network'

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
  const availableKeys = data.dedicatedCovers.map(x => { return x.coverKey })
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

  const stablecoinDecimals = ChainConfig[networkId].stablecoin.tokenDecimals

  const totalCoverFee = sumOf(...data.protocols.map((x) => { return x.totalCoverFee }))
  const totalCoveredAmount = sumOf(...data.cxTokens.map((x) => { return x.totalCoveredAmount }))

  const dedicatedCoverCount = data.dedicatedCovers.length

  let totalCoverage = '0'
  data.dedicatedCovers.forEach(cover => {
    const totalCoverLiquidityAdded = sumOf(...cover.vaults.map((x) => { return x.totalCoverLiquidityAdded }))
    const totalCoverLiquidityRemoved = sumOf(...cover.vaults.map((x) => { return x.totalCoverLiquidityRemoved }))
    const totalFlashLoanFees = sumOf(...cover.vaults.map((x) => { return x.totalFlashLoanFees }))

    const coverage = totalCoverLiquidityAdded
      .minus(totalCoverLiquidityRemoved)
      .plus(totalFlashLoanFees)
      .toString()

    totalCoverage = sumOf(totalCoverage, coverage).toString()
  })

  data.diversifiedCovers.forEach(cover => {
    const totalCoverLiquidityAdded = sumOf(...cover.vaults.map((x) => { return x.totalCoverLiquidityAdded }))
    const totalCoverLiquidityRemoved = sumOf(...cover.vaults.map((x) => { return x.totalCoverLiquidityRemoved }))
    const totalFlashLoanFees = sumOf(...cover.vaults.map((x) => { return x.totalFlashLoanFees }))
    const medianEfficiency = sumOf(...cover.products.map((x) => { return x.capitalEfficiency })).dividedBy(cover.products.length)

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
    coverFee: convertFromUnits(totalCoverFee.toString(), stablecoinDecimals).toString(),
    covered: convertFromUnits(totalCoveredAmount.toString(), stablecoinDecimals).toString(),
    totalCoverage: convertFromUnits(totalCoverage.toString(), stablecoinDecimals).toString(),
    tvlPool: '0'
  }
}

export async function getHeroStats (currentNetworkId) {
  const { isMainNet } = getNetworkInfo(currentNetworkId)

  const promises = []

  let currentNetworkIndex = 0
  for (const id in SUBGRAPH_API_URLS) {
    if (
      (isMainNet && getNetworkInfo(parseInt(id)).isMainNet) ||
      (!isMainNet && !getNetworkInfo(parseInt(id)).isMainNet)
    ) {
      promises.push(getIndividualHeroStats(parseInt(id)))
      if (parseInt(id) === currentNetworkId) { currentNetworkIndex = promises.length - 1 }
    }
  }

  const result = await Promise.all(promises)

  return result.reduce((prev, curr, idx) => {
    const currentNetwork = idx === currentNetworkIndex
      ? {
          dedicatedCoverCount: curr.dedicatedCoverCount,
          productCount: curr.productCount
        }
      : prev.currentNetwork

    return {
      availableKeys: [...prev.availableKeys, ...curr.availableKeys],
      reportingKeys: [...prev.reportingKeys, ...curr.reportingKeys],
      dedicatedCoverCount: prev.dedicatedCoverCount + curr.dedicatedCoverCount,
      productCount: prev.productCount + curr.productCount,
      coverFee: sumOf(prev.coverFee, curr.coverFee).toString(),
      covered: sumOf(prev.covered, curr.covered).toString(),
      totalCoverage: sumOf(prev.totalCoverage, curr.totalCoverage).toString(),
      tvlPool: sumOf(prev.tvlPool, curr.tvlPool).toString(),
      currentNetwork
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
