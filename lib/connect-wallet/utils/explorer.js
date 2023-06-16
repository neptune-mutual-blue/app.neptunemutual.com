import { explorer } from '../config/chains'

export const getTxLink = (networkId, tx) => {
  return (explorer.tx[networkId] || '').replace('%s', tx.hash)
}

export const getAddressLink = (networkId, address) => {
  return (explorer.address[networkId] || '').replace('%s', address)
}

export const getBlockLink = (networkId, blockNumber) => {
  return (explorer.block[networkId] || '').replace('%s', blockNumber)
}

export const getTokenLink = (networkId, tokenAddress, userAddress = '') => {
  if (userAddress) {
    const appendString = tokenAddress + '?a=' + userAddress

    return (explorer.token[networkId] || '').replace('%s', appendString)
  }

  return (explorer.token[networkId] || '').replace('%s', tokenAddress)
}
