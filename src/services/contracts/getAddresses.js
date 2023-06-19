import {
  GET_CONTRACTS_INFO_URL,
  NetworkUrlParam
} from '@/src/config/constants'
import { ChainConfig } from '@/src/config/hardcoded'
import { chunk } from '@/utils/arrays'
import { getReplacedString } from '@/utils/string'
import {
  config,
  multicall,
  registry
} from '@neptunemutual/sdk'

const { Contract, Provider } = multicall

export const getTokenSymbolAndDecimals = async (
  addresses,
  signerOrProvider
) => {
  const multiCallProvider = new Provider(signerOrProvider.provider)

  await multiCallProvider.init() // Only required when `chainId` is not provided in the `Provider` constructor

  const calls = []
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i]

    const instance = new Contract(address, config.abis.IERC20Detailed)

    calls.push(instance.symbol(), instance.decimals())
  }

  const result = await multiCallProvider.all(calls)

  return chunk(2, result)
}

export const getAddressesFromApi = async (networkId) => {
  try {
    const networkName = NetworkUrlParam[networkId]
    const url = getReplacedString(GET_CONTRACTS_INFO_URL, { networkName })

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      return null
    }

    const { data } = await response.json()

    const npmAddr = data.contracts.find((item) => { return item.key === 'NPM' }) || {}
    const stablecoinAddr = data.contracts.find((item) => { return item.key === 'Stablecoin' }) || {}

    return {
      NPMTokenAddress: npmAddr.value,
      NPMTokenSymbol: ChainConfig[networkId].npm.tokenSymbol,
      NPMTokenDecimals: ChainConfig[networkId].npm.tokenDecimals,

      liquidityTokenAddress: stablecoinAddr.value,
      liquidityTokenSymbol: ChainConfig[networkId].stablecoin.tokenSymbol,
      liquidityTokenDecimals: ChainConfig[networkId].stablecoin.tokenDecimals
    }
  } catch (error) {
    console.error('could not get contract addresses from api', error)
  }

  return {
    NPMTokenAddress: ChainConfig[networkId].npm.address,
    NPMTokenSymbol: ChainConfig[networkId].npm.tokenSymbol,
    NPMTokenDecimals: ChainConfig[networkId].npm.tokenDecimals,

    liquidityTokenAddress: ChainConfig[networkId].stablecoin.address,
    liquidityTokenSymbol: ChainConfig[networkId].stablecoin.tokenSymbol,
    liquidityTokenDecimals: ChainConfig[networkId].stablecoin.tokenDecimals
  }
}

export const getAddressesFromProvider = async (networkId, signerOrProvider) => {
  try {
    const [NPMTokenAddress, liquidityTokenAddress] = await Promise.all([
      registry.NPMToken.getAddress(networkId, signerOrProvider),
      registry.Stablecoin.getAddress(networkId, signerOrProvider)
    ])

    const [npmTokenData, liquidityTokenData] = await getTokenSymbolAndDecimals(
      [NPMTokenAddress, liquidityTokenAddress],
      signerOrProvider
    )

    return {
      NPMTokenAddress,
      NPMTokenSymbol: npmTokenData[0],
      NPMTokenDecimals: npmTokenData[1],
      liquidityTokenAddress,
      liquidityTokenSymbol: liquidityTokenData[0],
      liquidityTokenDecimals: liquidityTokenData[1]
    }
  } catch (error) {
    console.error(error)
  }

  return {
    NPMTokenAddress: ChainConfig[networkId].npm.address,
    NPMTokenSymbol: ChainConfig[networkId].npm.tokenSymbol,
    NPMTokenDecimals: ChainConfig[networkId].npm.tokenDecimals,

    liquidityTokenAddress: ChainConfig[networkId].stablecoin.address,
    liquidityTokenSymbol: ChainConfig[networkId].stablecoin.tokenSymbol,
    liquidityTokenDecimals: ChainConfig[networkId].stablecoin.tokenDecimals
  }
}
