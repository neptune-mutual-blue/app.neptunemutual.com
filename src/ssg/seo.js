const all = require('../data/summary.json')

const getCoverOrProductName = (coverId, productId, networkId) => {
  if (!productId) {
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

const getTitle = (coverId, productId, networkId) => {
  const name = getCoverOrProductName(coverId, productId, networkId)

  return `${name} / Neptune Mutual Decentralized Insurance`
}

const getDescription = (coverId, productId, networkId) => {
  const name = getCoverOrProductName(coverId, productId, networkId)

  return `Secure insurance coverage for ${name} or become an underwriter and receive rewards for reporting incidents.`
}

module.exports = { getTitle, getDescription }
