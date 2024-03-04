const { networkIdToSlug } = require('@/src/config/networks')
const all = require('../data/summary.json')

const getNetworks = () => {
  const networks = Object.values(networkIdToSlug)

  return networks.map((network) => {
    return {
      params: { network }
    }
  })
}

const getNetworksAndCovers = () => {
  const networks = all.map((item) => {
    return networkIdToSlug[item.chainId]
  })

  const paramsArr = []
  for (const network of networks) {
    const itemsByNetwork = all.filter((item) => {
      return (networkIdToSlug[item.chainId] === network) && Boolean(item.coverKey)
    })

    const duplicateCoverIds = itemsByNetwork.map((item) => {
      return item.coverKeyString
    })

    const coverIds = Array.from(new Set(duplicateCoverIds))

    paramsArr.push(
      ...coverIds.map((coverId) => {
        return {
          params: { network, coverId }
        }
      })
    )
  }

  return paramsArr
}

const getNetworksAndProducts = () => {
  const networks = all.map((item) => {
    return networkIdToSlug[item.chainId]
  })

  const paramsArr = []
  for (const network of networks) {
    const itemsByNetwork = all.filter((item) => {
      return (networkIdToSlug[item.chainId] === network) && Boolean(item.coverKey) && Boolean(item.productKey)
    })

    const products = itemsByNetwork.map((item) => {
      return {
        coverId: item.coverKeyString,
        productId: item.productKeyString
      }
    })

    paramsArr.push(
      ...products.map(({ coverId, productId }) => {
        return {
          params: { network, coverId, productId }
        }
      })
    )
  }

  return paramsArr
}

module.exports = { getNetworks, getNetworksAndCovers, getNetworksAndProducts }
