const { ShortNetworkNames } = require('@/lib/connect-wallet/config/chains')
const all = require('../data/summary.json')

const getCoverOrProductName = (coverId, productId, networkId) => {
  if (productId) {
    const product = all.find((item) => {
      return item.chainId === networkId.toString() && item.coverKeyString === coverId && item.productKeyString === productId
    })

    if (product) {
      return product.productInfoDetails.productName || product.coverInfoDetails.coverName
    }
  }

  const cover = all.find((item) => {
    return item.coverKeyString === coverId && item.chainId === networkId.toString()
  })

  if (cover) {
    return cover.coverInfoDetails.coverName
  }

  return ''
}

const getTitle = ({
  coverId = undefined,
  productId = undefined,
  networkId,
  pageAction = undefined
}) => {
  let title = ''

  if (pageAction) {
    title += `${pageAction} / `
  }

  if (coverId || productId) {
    const name = getCoverOrProductName(coverId, productId, networkId)
    title += `${name} / `
  }

  const network = ShortNetworkNames[networkId]

  title += `${network} Cover Marketplace / Neptune Mutual Decentralized Insurance`

  return title
}

const getDescription = (coverId, productId, networkId) => {
  const name = getCoverOrProductName(coverId, productId, networkId)

  return `Secure insurance coverage for ${name} or become an underwriter and receive rewards for reporting incidents.`
}

module.exports = { getTitle, getDescription }
