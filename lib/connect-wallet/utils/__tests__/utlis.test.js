import { ConnectorNames } from '@/lib/connect-wallet/config/connectors'
import { rpcUrls } from '@/lib/connect-wallet/config/rpcUrls'
import { getOne } from '@/lib/connect-wallet/utils/random'
import {
  getLibrary,
  getProvider,
  getProviderOrSigner,
  getSigner
} from '@/lib/connect-wallet/utils/web3'
import { testData } from '@/utils/unit-tests/test-data'
import { globalFn } from '@/utils/unit-tests/test-mockup-fn'

import { explorer } from '../../config/chains'
import { getConnectorByName } from '../connectors'
import { setupNetwork } from '../connectors/binanceWallet'
import * as metamask from '../connectors/metamask'
import {
  getAddressLink,
  getBlockLink,
  getTokenLink,
  getTxLink
} from '../explorer'
import { getNodeUrl } from '../getRpcUrl'
import * as wallet from '../wallet'

describe('binanceWallet::Setup network test', () => {
  global.BinanceChain = {
    switchNetwork: jest.fn().mockReturnValueOnce('')
  }

  test('Should return true for all networks', async () => {
    const networks = await Promise.all([
      setupNetwork(97),
      setupNetwork(56),
      setupNetwork(1)
    ])

    expect(networks).toEqual([true, true, true])
  })

  test('Should return false', async () => {
    const network = await setupNetwork(100)

    expect(network).toBeFalsy()
    expect(network).toBe(false)
  })
})

describe('Connectors::getConnectorByName', () => {
  test('Injected should support default neptune network id', async () => {
    const injected = await getConnectorByName(
      ConnectorNames.Injected,
      testData.network.networkId
    )

    expect(injected.supportedChainIds).toStrictEqual([
      testData.network.networkId
    ])
  })

  test('binance-wallet should support default neptune network id', async () => {
    const binanceWallet = await getConnectorByName(
      ConnectorNames.BSC,
      testData.network.networkId
    )

    expect(binanceWallet.supportedChainIds).toStrictEqual([
      testData.network.networkId
    ])
  })

  test('Unknown network should return null', async () => {
    const connector = await getConnectorByName(
      'Unknown',
      testData.network.networkId
    )

    expect(connector).toBeFalsy()
    expect(connector).toBeNull()
  })
})

describe('Explorer: getTxLink', () => {
  const networkId = testData.network.networkId
  const txHash = testData.coverInfo.id // sample id, not actual tx hash!

  test('with link ', () => {
    const txt = getTxLink(networkId, {
      hash: txHash
    })

    const link = explorer.tx[networkId].replace('%s', txHash)

    expect(txt).not.toBeFalsy()
    expect(txt).toBeTruthy()
    expect(txt).toBe(link)
  })

  test('unknown network id', () => {
    const txt = getTxLink(networkId + 1, {
      hash: txHash
    })

    const link = explorer.tx[networkId].replace('%s', txHash)

    expect(txt).not.toBe(link)
    expect(txt).toBe('')
    expect(txt).toBeFalsy()
  })
})

describe('Explorer: getAddressLink', () => {
  const networkId = testData.network.networkId
  const txHash = testData.coverInfo.id // sample id, not actual tx hash!

  test('get address link ', () => {
    const txt = getAddressLink(networkId, txHash)

    const link = explorer.address[networkId].replace('%s', txHash)

    expect(txt).not.toBeFalsy()
    expect(txt).toBeTruthy()
    expect(txt).toBe(link)
  })

  test('unknown network id', () => {
    const txt = getAddressLink(networkId + 1, txHash)

    const link = explorer.address[networkId].replace('%s', txHash)

    expect(txt).not.toBe(link)
    expect(txt).toBe('')
    expect(txt).toBeFalsy()
  })
})

describe('Explorer: getBlockLink', () => {
  const networkId = testData.network.networkId
  const txHash = testData.coverInfo.id // sample id, not actual tx hash!

  test('get block link ', () => {
    const txt = getBlockLink(networkId, txHash)

    const link = explorer.block[networkId].replace('%s', txHash)

    expect(txt).not.toBeFalsy()
    expect(txt).toBeTruthy()
    expect(txt).toBe(link)
  })

  test('unknown network id', () => {
    const txt = getBlockLink(networkId + 1, txHash)

    const link = explorer.block[networkId].replace('%s', txHash)

    expect(txt).not.toBe(link)
    expect(txt).toBe('')
    expect(txt).toBeFalsy()
  })
})

describe('Explorer: getTokenLink', () => {
  const networkId = testData.network.networkId
  const tokenAddress = testData.tokenBalanceProps.tokenAddress
  const account = testData.account.account

  test('get token link with account ', () => {
    const txt = getTokenLink(networkId, tokenAddress, account)

    const appendString = tokenAddress + '?a=' + account
    const link = explorer.token[networkId].replace('%s', appendString)

    expect(txt).not.toBeFalsy()
    expect(txt).toBeTruthy()
    expect(txt).toBe(link)
  })

  test('get token link no account', () => {
    const txt = getTokenLink(networkId, tokenAddress, '')

    const link = explorer.token[networkId].replace('%s', tokenAddress)

    expect(txt).not.toBeFalsy()
    expect(txt).toBeTruthy()
    expect(txt).toBe(link)
  })

  test('Falsy: get token link with account', () => {
    const txt = getTokenLink(networkId, tokenAddress, account)

    const link = explorer.token[networkId].replace('%s', tokenAddress)

    expect(txt).not.toBe(link)
  })

  test('Falsy: get token link no account', () => {
    const txt = getTokenLink(networkId, tokenAddress, '')

    const appendString = tokenAddress + '?a=' + account
    const link = explorer.token[networkId].replace('%s', appendString)

    expect(txt).not.toBe(link)
  })

  test('unknown network id', () => {
    const txt = getTokenLink(networkId + 1, tokenAddress)

    const link = explorer.token[networkId].replace('%s', tokenAddress)

    expect(txt).not.toBe(link)
    expect(txt).toBe('')
    expect(txt).toBeFalsy()
  })
})

describe('getRpcUrl: getNodeUrl', () => {
  const networkId = testData.network.networkId

  beforeEach(() => {
    globalFn.crypto()
  })

  test('get rpc', () => {
    const url = getNodeUrl(networkId)

    expect(url).toBe(rpcUrls[networkId][0])
  })

  test('unknown network id', () => {
    const url = rpcUrls[networkId + 1]

    expect(url).toBeFalsy()
    expect(url).toBe(undefined)
  })
})

describe('metamask: setupNetwork', () => {
  const networkId = testData.network.networkId

  beforeEach(() => {
    globalFn.ethereum()
  })

  test('show return true', async () => {
    const result = await metamask.setupNetwork(networkId)

    expect(result).toBeTruthy()
    expect(result).toBe(true)
  })

  test('unknown network id, should return false', async () => {
    globalFn.console.error()
    const result = await metamask.setupNetwork(networkId + 1)

    expect(result).toBeFalsy()
    expect(result).toBe(false)
  })

  test('No ethereum provider', async () => {
    globalFn.console.error()
    global.ethereum = undefined
    const result = await metamask.setupNetwork(networkId + 1)

    expect(result).toBeFalsy()
    expect(result).toBe(false)
  })

  test('Ethereum provided', async () => {
    globalFn.console.error()

    const error = { message: 'test', code: 4902 }
    const ethereum = {
      request: () =>
        new Promise((resolve, reject) => {
          reject(error)
        })
    }

    global.ethereum = ethereum
    const result = await metamask.setupNetwork(networkId)

    expect(result).toBeFalsy()
    expect(result).toBe(false)
  })

  test('Ethereum provided', async () => {
    globalFn.console.error()

    const error = { message: 'test', code: 4902 }
    const ethereum = {
      request: () =>
        new Promise((resolve, reject) => {
          global.ethereum = {
            request: async () => Promise.resolve()
          }

          reject(error)
        })
    }

    global.ethereum = ethereum
    const result = await metamask.setupNetwork(networkId)

    expect(result).toBeTruthy()
    expect(result).toBe(true)
  })

  test('Ethereum provided and removed', async () => {
    globalFn.console.error()

    const error = { message: 'test', code: 4902 }

    const ethereum = {
      request: () =>
        new Promise((resolve, reject) => {
          global.ethereum = undefined
          reject(error)
        })
    }

    global.ethereum = ethereum
    const result = await metamask.setupNetwork(networkId)

    expect(result).toBeFalsy()
    expect(result).toBe(false)
  })
})

describe('random: getOne', () => {
  test('get one', () => {
    const arrayOfLetters = ['a', 'b', 'c']
    const letter = getOne(...arrayOfLetters)

    expect(arrayOfLetters).toContain(letter)
  })

  test('Throw Error', () => {
    const result = getOne()
    expect(result).toBeFalsy()
    expect(result).toBe(undefined)
  })
})

describe('Wallet', () => {
  test('connect Injected', async () => {
    globalFn.ethereum()
    const network = await wallet.setupNetwork(
      ConnectorNames.Injected,
      testData.network.networkId
    )

    expect(network).toBeTruthy()
    expect(network).toBe(true)
  })

  test('connect Binance', async () => {
    const network = await wallet.setupNetwork(ConnectorNames.BSC, 97)

    expect(network).toBeTruthy()
    expect(network).toBe(true)
  })

  test('connect Binance with Error', async () => {
    global.BinanceChain = {
      switchNetwork: async () => Promise.reject(new Error('An error occurred when connecting to binance'))
    }

    const network = await wallet.setupNetwork(ConnectorNames.BSC, 97)

    expect(network).toBeFalsy()
    expect(network).toBe(false)
  })

  test('connect Unknown', async () => {
    const network = await wallet.setupNetwork('', testData.network.networkId)

    expect(network).toBeFalsy()
    expect(network).toBe(false)
  })
})

describe('Web3', () => {
  const networkId = testData.network.networkId
  const account = testData.account.account
  test('getProvider', async () => {
    const provider = await getProvider(networkId)

    expect(provider).toBeTruthy()
  })

  test('getProvider: should throw error', async () => {
    expect(() => getProvider(networkId + 1)).toThrow(TypeError)
  })

  test('getLibrary', async () => {
    const provider = await getProvider(networkId)
    const library = await getLibrary(provider)

    expect(library).toBeTruthy()
  })

  test('getLibrary: should throw error', async () => {
    expect(() => getLibrary('')).toThrowError()
  })

  test('getSigner', async () => {
    const provider = await getProvider(networkId)
    const library = await getLibrary(provider)
    const signer = await getSigner(library, account)

    expect(signer).toBeTruthy()
  })

  test('getSigner: should throw error', async () => {
    expect(() => getSigner('', account)).toThrowError()
  })

  test('getProviderOrSigner: with library', async () => {
    const provider = await getProvider(networkId)
    const library = await getLibrary(provider)
    const providerOrsigner = await getProviderOrSigner(
      library,
      account,
      networkId
    )

    expect(providerOrsigner).toBeTruthy()
  })

  test('getProviderOrSigner: without library', async () => {
    const providerOrsigner = await getProviderOrSigner(
      undefined,
      account,
      networkId
    )

    expect(providerOrsigner).toBeTruthy()
  })

  test('getProviderOrSigner: without library and account', async () => {
    const providerOrsigner = await getProviderOrSigner(
      undefined,
      undefined,
      networkId
    )

    expect(providerOrsigner).toBeTruthy()
  })

  test('getProviderOrSigner: without library and account and networkid', async () => {
    expect(() => getProviderOrSigner(undefined, undefined, undefined)).toThrow(
      TypeError
    )
  })
})
