import {
  getParsedCoverInfo,
  getParsedProductInfo,
  parseIpfsData
} from '@/src/helpers/cover'
import { getSubgraphData } from '@/src/services/subgraph'
import { getTotalCoverage } from '@/utils/formula'
import { convertFromUnits, convertToUnits, sumOf, toBN } from '@/utils/bn'
import { MULTIPLIER } from '@/src/config/constants'
import DateLib from '@/lib/date/DateLib'

export async function getCoverData (networkId, coverKey) {
  const data = await getSubgraphData(
    networkId,
    `{
  cover (id: "${coverKey}") {
    id
    coverKey
    supportsProducts
    ipfsHash
    ipfsData
    products {
      id
      productKey
      coverKey
      ipfsHash
      ipfsData
    }
  }
}`
  )

  if (!data) return null

  const products = await Promise.all(
    data.cover.products.map(async (product) => ({
      id: product.id,
      productKey: product.productKey,
      coverKey: product.coverKey,
      ipfsHash: product.ipfsHash,
      ipfsData: product.ipfsData,
      infoObj: await getParsedProductInfo(product.ipfsData, product.ipfsHash)
    }))
  )

  return {
    id: data.cover.id,
    coverKey: data.cover.coverKey,
    supportsProducts: data.cover.supportsProducts,
    ipfsHash: data.cover.ipfsHash,
    ipfsData: data.cover.ipfsData,
    infoObj: await getParsedCoverInfo(data.cover.ipfsData, data.cover.ipfsHash),
    products
  }
}

export async function getCoverProductData (networkId, coverKey, productKey) {
  const data = await getSubgraphData(
    networkId,
    `{
  product (id: "${coverKey}-${productKey}") {
    id
    coverKey
    productKey
    ipfsHash
    ipfsData
    cover {
      id
      supportsProducts
      coverKey
      ipfsHash
      ipfsData
    }
  }
}`
  )

  if (!data) return null

  return {
    id: data.product.id,
    coverKey: data.product.coverKey,
    productKey: data.product.productKey,
    ipfsHash: data.product.ipfsHash,
    ipfsData: data.product.ipfsData,
    infoObj: await getParsedProductInfo(
      data.product.ipfsData,
      data.product.ipfsHash
    ),
    cover: {
      id: data.product.cover.id,
      supportsProducts: data.product.cover.supportsProducts,
      coverKey: data.product.cover.coverKey,
      ipfsHash: data.product.cover.ipfsHash,
      ipfsData: data.product.cover.ipfsData,
      infoObj: await getParsedCoverInfo(
        data.product.cover.ipfsData,
        data.product.cover.ipfsHash
      )
    }
  }
}

/**
 *
 * @param {number} networkId
 * @param {string} coverKey
 * @param {number} liquidityTokenDecimals
 */
export async function getDiversifiedTotalCoverage (
  networkId,
  coverKey,
  liquidityTokenDecimals
) {
  const startOfMonth = DateLib.toUnix(DateLib.getSomInUTC(Date.now()))

  const data = await getSubgraphData(
    networkId,
    `{
  cover (id: "${coverKey}") {
    id
    ipfsData
    ipfsHash
    products {
      ipfsData
      ipfsHash
    }
  }
  reporting: incidentReports (where: {
    finalized: false
    coverKey: "${coverKey}"
  }) {
    id
  }
  protocols {
    totalFlashLoanFees
    totalCoverLiquidityAdded
    totalCoverLiquidityRemoved
    totalCoverFee
  }
  covers (where: { coverKey: "${coverKey}" }){
    vaults {
      totalCoverLiquidityAdded,
      totalCoverLiquidityRemoved
      totalFlashLoanFees
    }
  }
  cxTokens(where: {
    expiryDate_gt: "${startOfMonth}"
    coverKey: "${coverKey}"
  }){
    totalCoveredAmount
  }
}`
  )

  if (!data) return null

  const { leverage } = await parseIpfsData(
    data.cover.ipfsData,
    data.cover.ipfsHash
  )

  const producstInfoArray = await Promise.all(
    data.cover.products.map((product) =>
      parseIpfsData(product.ipfsData, product.ipfsHash)
    )
  )

  const totalCapitalEfficiency = producstInfoArray.reduce(
    (total, productData) => total + Number(productData.capitalEfficiency),
    0
  )

  const medianCapitalEfficiency = toBN(
    totalCapitalEfficiency / data.cover.products.length
  ).dividedBy(MULTIPLIER)

  const vaults = data.covers.map((cover) =>
    cover.vaults.reduce(
      (total, vault) => ({
        totalCoverLiquidityAdded: total.totalCoverLiquidityAdded.plus(
          toBN(vault.totalCoverLiquidityAdded)
        ),
        totalCoverLiquidityRemoved: total.totalCoverLiquidityRemoved.plus(
          toBN(vault.totalCoverLiquidityRemoved)
        ),
        totalFlashLoanFees: total.totalFlashLoanFees.plus(
          toBN(vault.totalFlashLoanFees)
        )
      }),
      {
        totalCoverLiquidityAdded: toBN(0),
        totalCoverLiquidityRemoved: toBN(0),
        totalFlashLoanFees: toBN(0)
      }
    )
  )
  const totalCoverageFromVault = getTotalCoverage(vaults)

  const totalCoverage = convertFromUnits(
    totalCoverageFromVault,
    liquidityTokenDecimals
  )
    .multipliedBy(leverage)
    .multipliedBy(medianCapitalEfficiency)

  const totalCoverFee = sumOf(...data.protocols.map((x) => x.totalCoverFee))
  const totalCoveredAmount = sumOf(
    ...data.cxTokens.map((x) => x.totalCoveredAmount)
  )

  return {
    availableCovers: 1,
    reportingCovers: data.reporting.length,
    leverage,
    medianCapitalEfficiency,
    totalCoverage: convertToUnits(totalCoverage, liquidityTokenDecimals),
    totalCoverFee,
    totalCoveredAmount
  }
}
